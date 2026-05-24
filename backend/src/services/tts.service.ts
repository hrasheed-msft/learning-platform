import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';
import path from 'path';
import { BlobServiceClient } from '@azure/storage-blob';
import config from '../config';
import prisma from '../config/database';

const AUDIO_DIR = path.join(__dirname, '../../public/audio');

// Ensure audio directory exists (used as temp storage before uploading to blob)
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Azure Blob Storage client for persistent audio storage
const BLOB_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'audio';
let blobContainerClient: ReturnType<BlobServiceClient['getContainerClient']> | null = null;

function getBlobContainerClient() {
  if (blobContainerClient) return blobContainerClient;
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING || config.azure.storageConnectionString;
  if (!connStr) {
    console.warn('TTS: No AZURE_STORAGE_CONNECTION_STRING configured, using local file serving');
    return null;
  }
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
    blobContainerClient = blobServiceClient.getContainerClient(BLOB_CONTAINER_NAME);
    console.log(`TTS: Blob storage configured - container "${BLOB_CONTAINER_NAME}" at ${blobServiceClient.url}`);
    return blobContainerClient;
  } catch (err: any) {
    console.error('TTS: Failed to initialize blob storage client:', err.message);
    return null;
  }
}

/**
 * Upload an audio file to Azure Blob Storage and return the public URL.
 * Falls back to local serving if blob storage isn't configured.
 */
async function uploadToBlob(filePath: string, filename: string, baseUrl: string): Promise<string> {
  const container = getBlobContainerClient();
  if (!container) {
    // Fallback to local serving
    console.log(`TTS: Serving audio locally: ${baseUrl}/audio/${filename}`);
    return `${baseUrl}/audio/${filename}`;
  }

  try {
    const blockBlobClient = container.getBlockBlobClient(filename);
    await blockBlobClient.uploadFile(filePath, {
      blobHTTPHeaders: { blobContentType: 'audio/mpeg' },
    });
    console.log(`TTS: Uploaded to blob: ${blockBlobClient.url}`);

    // Clean up local temp file
    try { fs.unlinkSync(filePath); } catch { /* ignore */ }

    return blockBlobClient.url;
  } catch (err: any) {
    console.error(`TTS: Blob upload failed, falling back to local: ${err.message}`);
    return `${baseUrl}/audio/${filename}`;
  }
}

const VOICES = {
  ar: 'ar-SA-HamedNeural',
  en: 'en-US-JennyNeural',
} as const;

// Azure Speech Service hard limit is 50 <voice> elements per request.
// We use 25 to leave headroom.
const MAX_VOICE_ELEMENTS_PER_CHUNK = 25;
const CHUNK_DELAY_MS = 200;
const MAX_RETRIES_PER_CHUNK = 2;

/** Word-level timestamp entry for karaoke-style highlighting */
export interface WordTimestamp {
  word: string;
  offset: number;   // milliseconds from audio start
  duration: number; // milliseconds
}

/** Result from synthesizing a single chunk (audio + word timestamps) */
interface ChunkSynthesisResult {
  audioBuffer: Buffer;
  wordTimestamps: WordTimestamp[];
  durationMs: number;
}

interface TtsArabicTerm {
  arabicText: string;
  transliteration: string;
  translation: string;
}

const SSML_BREAK_PREFIX = '[[break:';
const FORCE_ARABIC_OPEN = '[[ar]]';
const FORCE_ARABIC_CLOSE = '[[/ar]]';
const TRANSLITERATION_SEPARATOR_RE = /[\s\-–—_]+/;
const TRANSLITERATION_CHAR_VARIANTS: Record<string, string> = {
  a: 'aāáàâäãăą',
  b: 'b',
  c: 'cçč',
  d: 'dḍďđḏ',
  e: 'eēéèêë',
  f: 'f',
  g: 'gġğ',
  h: 'hḥḩẖ',
  i: 'iīíìîï',
  j: 'jǧ',
  k: 'kḳķ',
  l: 'lḷļ',
  m: 'm',
  n: 'nñṇ',
  o: 'oōóòôö',
  p: 'p',
  q: 'q',
  r: 'rṛŕ',
  s: 'sṣśš',
  t: 'tṭţťṯ',
  u: 'uūúùûü',
  v: 'v',
  w: 'wẇ',
  x: 'x',
  y: 'yýȳ',
  z: 'zẓžźż',
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Strip HTML tags and decode common entities for TTS input.
 */
function stripHtml(html: string): string {
  return normalizeWhitespace(decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ')));
}

function capitalizePhrase(text: string): string {
  const trimmed = normalizeWhitespace(text);
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
}

function simplifyTransliteration(text: string): string {
  return normalizeWhitespace(
    decodeHtmlEntities(text)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ʿʾʻʼ']/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .toLowerCase()
  );
}

function toDisplayTransliteration(text: string): string {
  return simplifyTransliteration(text)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildTransliterationRegex(transliteration: string): RegExp | null {
  const simplified = simplifyTransliteration(transliteration);
  if (!simplified) return null;

  const pattern = simplified
    .split(TRANSLITERATION_SEPARATOR_RE)
    .filter(Boolean)
    .map((segment) => Array.from(segment).map((char) => {
      const variants = TRANSLITERATION_CHAR_VARIANTS[char] || char;
      return `[${escapeRegExp(variants)}]`;
    }).join(''))
    .join(String.raw`(?:[\s\-–—_'’ʿʾʻʼ]+)`);

  if (!pattern) return null;
  return new RegExp(`(^|[^\\p{L}])(${pattern}(?:['’ʿʾʻʼ])?)(?=$|[^\\p{L}])`, 'giu');
}

function formatArabicTermForTts(term: TtsArabicTerm): string {
  return `${capitalizePhrase(term.translation)} ${FORCE_ARABIC_OPEN}${term.arabicText}${FORCE_ARABIC_CLOSE} ${toDisplayTransliteration(term.transliteration)}`;
}

function replaceTransliteratedTerms(text: string, arabicTerms: TtsArabicTerm[]): string {
  return arabicTerms
    .filter((term) => term.arabicText && term.transliteration && term.translation)
    .sort((a, b) => simplifyTransliteration(b.transliteration).length - simplifyTransliteration(a.transliteration).length)
    .reduce((currentText, term) => {
      const transliterationRe = buildTransliterationRegex(term.transliteration);
      if (!transliterationRe) return currentText;

      return currentText.replace(transliterationRe, (_match, prefix: string) => {
        return `${prefix}${formatArabicTermForTts(term)}`;
      });
    }, text);
}

function extractSynthesisBlocks(html: string): string[] {
  const blocks = html.match(/<(p|div|section|h[1-6])\b[^>]*>[\s\S]*?<\/\1>/gi) || [];
  const meaningfulBlocks = blocks.filter((block) => stripHtml(block).length > 10);
  return meaningfulBlocks.length > 0 ? meaningfulBlocks : [html];
}

/**
 * Detect if text contains Arabic characters.
 */
function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

/**
 * Escape XML special characters for safe inclusion inside SSML elements.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function preprocessTtsHtml(html: string, arabicTerms: TtsArabicTerm[] = []): string {
  const htmlWithHeadingPauses = html.replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_match, headingContent: string) => {
    const headingText = stripHtml(headingContent);
    if (!headingText) return ' ';
    return ` ${SSML_BREAK_PREFIX}800ms]] ${headingText} [[break:500ms]] `;
  });

  const plainText = stripHtml(htmlWithHeadingPauses);
  return normalizeWhitespace(replaceTransliteratedTerms(plainText, arabicTerms));
}

type PreprocessedToken =
  | { type: 'break'; timeMs: string }
  | { type: 'text'; text: string; forceArabic: boolean };

function tokenizePreprocessedText(text: string): PreprocessedToken[] {
  const tokens: PreprocessedToken[] = [];
  const markerRe = /\[\[break:(\d+)ms\]\]|\[\[ar\]\]([\s\S]*?)\[\[\/ar\]\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markerRe.exec(text)) !== null) {
    const plainText = normalizeWhitespace(text.slice(lastIndex, match.index));
    if (plainText) {
      tokens.push({ type: 'text', text: plainText, forceArabic: false });
    }

    if (match[1]) {
      tokens.push({ type: 'break', timeMs: match[1] });
    } else if (match[2]) {
      const forcedArabicText = normalizeWhitespace(match[2]);
      if (forcedArabicText) {
        tokens.push({ type: 'text', text: forcedArabicText, forceArabic: true });
      }
    }

    lastIndex = markerRe.lastIndex;
  }

  const trailingText = normalizeWhitespace(text.slice(lastIndex));
  if (trailingText) {
    tokens.push({ type: 'text', text: trailingText, forceArabic: false });
  }

  return tokens;
}

function appendEnglishVoiceElements(voiceElements: string[], text: string): void {
  // Split on Arabic character runs — whitespace is NOT included in the Arabic class
  const ARABIC_SEGMENT_RE = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u064B-\u065F\u0670]+(?:\s+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u064B-\u065F\u0670]+)*)/g;
  const parts = text.split(ARABIC_SEGMENT_RE);

  if (!parts.some(containsArabic)) {
    voiceElements.push(`<voice name="${VOICES.en}"><prosody rate="1.05">${escapeXml(text)}</prosody></voice>`);
    return;
  }

  const ARABIC_WORD_THRESHOLD = 4;
  let englishBuffer = '';

  for (const part of parts) {
    if (!part) continue;

    if (containsArabic(part)) {
      const arabicWordCount = part.trim().split(/\s+/).length;

      if (arabicWordCount <= ARABIC_WORD_THRESHOLD) {
        englishBuffer += part;
      } else {
        const bufferedText = normalizeWhitespace(englishBuffer);
        if (bufferedText) {
          voiceElements.push(`<voice name="${VOICES.en}"><prosody rate="1.05">${escapeXml(bufferedText)}</prosody></voice>`);
        }
        englishBuffer = '';
        voiceElements.push(`<voice name="${VOICES.ar}">${escapeXml(normalizeWhitespace(part))}</voice>`);
      }
    } else {
      englishBuffer += part;
    }
  }

  const bufferedText = normalizeWhitespace(englishBuffer);
  if (bufferedText) {
    voiceElements.push(`<voice name="${VOICES.en}"><prosody rate="1.05">${escapeXml(bufferedText)}</prosody></voice>`);
  }
}

/**
 * Build voice elements for bilingual content — Arabic segments get ar-SA voice,
 * English segments get en-US voice. Returns raw voice element strings (without <speak> wrapper).
 */
function buildBreakVoiceElement(language: 'ar' | 'en', timeMs: string): string {
  const voiceName = language === 'ar' ? VOICES.ar : VOICES.en;
  return `<voice name="${voiceName}"><break time="${timeMs}ms"/></voice>`;
}

export function buildVoiceElements(text: string, language: 'ar' | 'en'): string[] {
  const tokens = tokenizePreprocessedText(text);
  const voiceElements: string[] = [];

  if (language === 'ar') {
    for (const token of tokens) {
      if (token.type === 'break') {
        voiceElements.push(buildBreakVoiceElement('ar', token.timeMs));
        continue;
      }
      voiceElements.push(`<voice name="${VOICES.ar}">${escapeXml(token.text)}</voice>`);
    }
    return voiceElements;
  }

  for (const token of tokens) {
    if (token.type === 'break') {
      voiceElements.push(buildBreakVoiceElement('en', token.timeMs));
      continue;
    }

    if (token.forceArabic) {
      voiceElements.push(`<voice name="${VOICES.ar}">${escapeXml(token.text)}</voice>`);
      continue;
    }

    appendEnglishVoiceElements(voiceElements, token.text);
  }

  return voiceElements;
}

/**
 * Split voice elements into chunks of ≤MAX_VOICE_ELEMENTS_PER_CHUNK,
 * wrapping each chunk in a valid <speak> document.
 */
function chunkSsmlElements(voiceElements: string[], language: 'ar' | 'en'): string[] {
  const xmlLang = language === 'ar' ? 'ar-SA' : 'en-US';
  const chunks: string[] = [];

  for (let i = 0; i < voiceElements.length; i += MAX_VOICE_ELEMENTS_PER_CHUNK) {
    const slice = voiceElements.slice(i, i + MAX_VOICE_ELEMENTS_PER_CHUNK);
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${xmlLang}">
${slice.map((el) => `  ${el}`).join('\n')}
</speak>`;
    chunks.push(ssml);
  }

  return chunks;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Synthesize a single SSML chunk to a buffer using Azure Speech SDK.
 * Captures word boundary events for timestamp generation.
 * Returns audio bytes + word-level timestamps (local to this chunk).
 */
async function synthesizeChunkWithTimestamps(ssml: string): Promise<ChunkSynthesisResult> {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    config.azureSpeech.key,
    config.azureSpeech.region
  );
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined as any);

  const wordTimestamps: WordTimestamp[] = [];

  // Register word boundary event to capture per-word timing
  synthesizer.wordBoundary = (_sender, event) => {
    // audioOffset is in 100-nanosecond ticks; convert to milliseconds
    const offsetMs = Number(event.audioOffset) / 10000;
    const durationMs = event.duration / 10000;
    const word = event.text;

    if (word && word.trim()) {
      wordTimestamps.push({
        word: word.trim(),
        offset: Math.round(offsetMs),
        duration: Math.round(durationMs),
      });
    }
  };

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioBuffer = Buffer.from(result.audioData);
          // Estimate chunk duration from buffer size (128kbps = 16KB/s)
          const durationMs = (audioBuffer.length / 16000) * 1000;
          resolve({ audioBuffer, wordTimestamps, durationMs });
        } else {
          const errorDetail = result.errorDetails || 'Unknown TTS error';
          reject(new Error(`TTS synthesis failed: ${errorDetail}`));
        }
      },
      (error) => {
        synthesizer.close();
        reject(new Error(`TTS synthesis error: ${error}`));
      }
    );
  });
}

/**
 * Synthesize a single chunk with retry logic, capturing word timestamps.
 */
async function synthesizeChunkWithRetry(ssml: string, chunkIndex: number): Promise<ChunkSynthesisResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES_PER_CHUNK; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`TTS: retrying chunk ${chunkIndex + 1}, attempt ${attempt + 1}`);
        await delay(CHUNK_DELAY_MS * 2);
      }
      return await synthesizeChunkWithTimestamps(ssml);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`TTS: chunk ${chunkIndex + 1} failed (attempt ${attempt + 1}): ${lastError.message}`);
    }
  }

  throw lastError || new Error(`TTS: chunk ${chunkIndex + 1} failed after retries`);
}

/** Full synthesis result with timestamps */
export interface SynthesisResult {
  filePath: string;
  durationSeconds: number;
  timestamps: WordTimestamp[];
}

/**
 * Synthesize text to an MP3 file using Azure Speech SDK with chunked SSML.
 * Splits voice elements into groups of ≤25 to stay under Azure's 50-element limit.
 * Captures word-level timestamps with cumulative offsets across chunks.
 */
export async function synthesizeToFile(
  text: string,
  language: 'ar' | 'en',
  outputPath: string,
  unitId?: string
): Promise<SynthesisResult> {
  const voiceElements = buildVoiceElements(text, language);
  const ssmlChunks = chunkSsmlElements(voiceElements, language);

  const logId = unitId || path.basename(outputPath);
  if (ssmlChunks.length > 1) {
    console.log(`TTS: synthesizing in ${ssmlChunks.length} chunks for unit ${logId} (${voiceElements.length} voice elements)`);
  }

  // Synthesize each chunk sequentially with delay between calls
  const audioBuffers: Buffer[] = [];
  const allTimestamps: WordTimestamp[] = [];
  let cumulativeOffsetMs = 0;

  for (let i = 0; i < ssmlChunks.length; i++) {
    if (i > 0) {
      await delay(CHUNK_DELAY_MS);
    }
    const chunkResult = await synthesizeChunkWithRetry(ssmlChunks[i], i);
    audioBuffers.push(chunkResult.audioBuffer);

    // Adjust timestamps with cumulative offset from previous chunks
    for (const ts of chunkResult.wordTimestamps) {
      allTimestamps.push({
        word: ts.word,
        offset: ts.offset + Math.round(cumulativeOffsetMs),
        duration: ts.duration,
      });
    }

    // Accumulate this chunk's duration for next chunk's offset base
    cumulativeOffsetMs += chunkResult.durationMs;
  }

  // Concatenate all audio buffers (MP3 frames are self-contained, so concat works)
  const finalAudio = Buffer.concat(audioBuffers);

  // Write to output file
  fs.writeFileSync(outputPath, finalAudio);

  // Estimate duration from MP3 data size: 128kbps = 16KB/s
  const durationSeconds = finalAudio.length / 16000;

  return { filePath: outputPath, durationSeconds, timestamps: allTimestamps };
}

export interface AudioResult {
  url: string;
  duration: number | null;
  timestamps: WordTimestamp[] | null;
  cached: boolean;
}

/**
 * Get or generate audio for a unit.
 * Checks AudioCache first; if miss, synthesizes via Azure Speech and stores.
 * Returns audio URL + word-level timestamps for karaoke highlighting.
 */
export async function getOrGenerateAudio(
  unitId: string,
  language: 'ar' | 'en',
  blockIndex: number | null,
  baseUrl: string
): Promise<AudioResult> {
  // Check cache
  const cached = await prisma.audioCache.findUnique({
    where: {
      unitId_language_blockIndex: {
        unitId,
        language,
        blockIndex: blockIndex ?? -1, // -1 signals "full unit"
      },
    },
  });

  if (cached) {
    // Detect stale cache entries pointing to ephemeral container storage
    if (cached.url && cached.url.includes('azurecontainerapps.io/audio/') && getBlobContainerClient()) {
      // Delete stale entry — will regenerate with blob storage below
      await prisma.audioCache.delete({
        where: { unitId_language_blockIndex: { unitId, language, blockIndex: blockIndex ?? -1 } },
      });
      console.log(`TTS: Migrating stale cache for ${unitId} to blob storage`);
    } else {
      return {
        url: cached.url,
        duration: cached.duration,
        timestamps: (cached.timestamps as WordTimestamp[] | null) ?? null,
        cached: true,
      };
    }
  }

  // Fetch unit content
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    select: {
      content: true,
      title: true,
      arabicTerms: {
        select: {
          arabicText: true,
          transliteration: true,
          translation: true,
        },
      },
    },
  });

  if (!unit || !unit.content) {
    throw new Error('Unit not found or has no content');
  }

  // Extract text for synthesis
  let textToSynthesize: string;
  if (blockIndex !== null && blockIndex >= 0) {
    const blocks = extractSynthesisBlocks(unit.content);
    if (blockIndex >= blocks.length) {
      throw new Error(`Block index ${blockIndex} out of range (${blocks.length} blocks)`);
    }
    textToSynthesize = preprocessTtsHtml(blocks[blockIndex], unit.arabicTerms);
  } else {
    textToSynthesize = preprocessTtsHtml(unit.content, unit.arabicTerms);
  }

  if (!textToSynthesize.trim()) {
    throw new Error('No synthesizable text found in unit content');
  }

  // Generate filename and synthesize to temp file
  const blockSuffix = blockIndex !== null && blockIndex >= 0 ? `-${blockIndex}` : '';
  const filename = `${unitId}-${language}${blockSuffix}.mp3`;
  const outputPath = path.join(AUDIO_DIR, filename);

  const { durationSeconds, timestamps } = await synthesizeToFile(textToSynthesize, language, outputPath, unitId);

  // Upload to blob storage (or serve locally as fallback)
  const audioUrl = await uploadToBlob(outputPath, filename, baseUrl);

  // Cache in database (including timestamps)
  await prisma.audioCache.create({
    data: {
      unitId,
      language,
      blockIndex: blockIndex ?? -1,
      url: audioUrl,
      duration: durationSeconds,
      timestamps: timestamps as any,
    },
  });

  return { url: audioUrl, duration: durationSeconds, timestamps, cached: false };
}

/**
 * Get cached timestamps for a unit's audio (without generating).
 * Returns null if no cache entry exists.
 */
export async function getAudioTimestamps(
  unitId: string,
  language: 'ar' | 'en',
  blockIndex: number | null
): Promise<WordTimestamp[] | null> {
  const cached = await prisma.audioCache.findUnique({
    where: {
      unitId_language_blockIndex: {
        unitId,
        language,
        blockIndex: blockIndex ?? -1,
      },
    },
    select: { timestamps: true },
  });

  if (!cached || !cached.timestamps) return null;
  return cached.timestamps as unknown as WordTimestamp[];
}

/**
 * Pre-generate audio + timestamps for all units in the database.
 * Processes sequentially to avoid overwhelming Azure Speech Service.
 * Returns a summary of processed/failed units.
 */
export async function preGenerateAllAudio(
  baseUrl: string,
  language: 'ar' | 'en' = 'ar',
  forceRegenerate: boolean = false
): Promise<{ processed: number; skipped: number; failed: string[] }> {
  const units = await prisma.unit.findMany({
    where: { content: { not: null } },
    select: { id: true, title: true },
    orderBy: { orderIndex: 'asc' },
  });

  let processed = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const unit of units) {
    try {
      // Check if already cached (skip unless forceRegenerate)
      if (!forceRegenerate) {
        const existing = await prisma.audioCache.findUnique({
          where: {
            unitId_language_blockIndex: {
              unitId: unit.id,
              language,
              blockIndex: -1,
            },
          },
          select: { id: true, timestamps: true },
        });

        if (existing && existing.timestamps) {
          skipped++;
          continue;
        }

        // Delete existing cache without timestamps so we regenerate with them
        if (existing) {
          await prisma.audioCache.delete({ where: { id: existing.id } });
        }
      } else {
        // Force: delete existing cache entry
        await prisma.audioCache.deleteMany({
          where: { unitId: unit.id, language, blockIndex: -1 },
        });
      }

      await getOrGenerateAudio(unit.id, language, null, baseUrl);
      processed++;
      console.log(`TTS pre-gen: ✓ ${unit.title || unit.id}`);

      // Throttle to avoid rate limiting
      await delay(500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`TTS pre-gen: ✗ ${unit.title || unit.id} — ${msg}`);
      failed.push(`${unit.title || unit.id}: ${msg}`);
    }
  }

  return { processed, skipped, failed };
}
