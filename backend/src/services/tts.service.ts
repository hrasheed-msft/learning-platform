import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';
import path from 'path';
import config from '../config';
import prisma from '../config/database';

const AUDIO_DIR = path.join(__dirname, '../../public/audio');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
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

/**
 * Strip HTML tags and decode common entities for TTS input.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detect if text contains Arabic characters.
 */
function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

/**
 * Build voice elements for bilingual content — Arabic segments get ar-SA voice,
 * English segments get en-US voice. Returns raw voice element strings (without <speak> wrapper).
 */
function buildVoiceElements(text: string, language: 'ar' | 'en'): string[] {
  if (language === 'ar') {
    return [`<voice name="${VOICES.ar}">${text}</voice>`];
  }

  // English with possible inline Arabic — split on Arabic character runs
  const parts = text.split(/([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\u064B-\u065F\u0670]+)/g);
  const filteredParts = parts.filter((p) => p.trim());

  // If no Arabic detected, single voice element
  if (!filteredParts.some(containsArabic)) {
    return [`<voice name="${VOICES.en}">${text}</voice>`];
  }

  // Bilingual: one voice element per language segment
  return filteredParts.map((part) => {
    if (containsArabic(part)) {
      return `<voice name="${VOICES.ar}">${part.trim()}</voice>`;
    }
    return `<voice name="${VOICES.en}">${part.trim()}</voice>`;
  });
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
 * Returns raw audio bytes.
 */
async function synthesizeChunkToBuffer(ssml: string): Promise<Buffer> {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    config.azureSpeech.key,
    config.azureSpeech.region
  );
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

  // Use null audio config to get buffer output instead of file
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, undefined as any);

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          resolve(Buffer.from(result.audioData));
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
 * Synthesize a single chunk with retry logic.
 */
async function synthesizeChunkWithRetry(ssml: string, chunkIndex: number): Promise<Buffer> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES_PER_CHUNK; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`TTS: retrying chunk ${chunkIndex + 1}, attempt ${attempt + 1}`);
        await delay(CHUNK_DELAY_MS * 2); // Longer delay on retry
      }
      return await synthesizeChunkToBuffer(ssml);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`TTS: chunk ${chunkIndex + 1} failed (attempt ${attempt + 1}): ${lastError.message}`);
    }
  }

  throw lastError || new Error(`TTS: chunk ${chunkIndex + 1} failed after retries`);
}

/**
 * Synthesize text to an MP3 file using Azure Speech SDK with chunked SSML.
 * Splits voice elements into groups of ≤25 to stay under Azure's 50-element limit.
 * Returns the file path and duration in seconds.
 */
export async function synthesizeToFile(
  text: string,
  language: 'ar' | 'en',
  outputPath: string,
  unitId?: string
): Promise<{ filePath: string; durationSeconds: number }> {
  const voiceElements = buildVoiceElements(text, language);
  const ssmlChunks = chunkSsmlElements(voiceElements, language);

  const logId = unitId || path.basename(outputPath);
  if (ssmlChunks.length > 1) {
    console.log(`TTS: synthesizing in ${ssmlChunks.length} chunks for unit ${logId} (${voiceElements.length} voice elements)`);
  }

  // Synthesize each chunk sequentially with delay between calls
  const audioBuffers: Buffer[] = [];
  for (let i = 0; i < ssmlChunks.length; i++) {
    if (i > 0) {
      await delay(CHUNK_DELAY_MS);
    }
    const buffer = await synthesizeChunkWithRetry(ssmlChunks[i], i);
    audioBuffers.push(buffer);
  }

  // Concatenate all audio buffers (MP3 frames are self-contained, so concat works)
  const finalAudio = Buffer.concat(audioBuffers);

  // Write to output file
  fs.writeFileSync(outputPath, finalAudio);

  // Estimate duration from MP3 data size:
  // 128kbps = 16KB/s, so duration ≈ fileSize / 16000
  const durationSeconds = finalAudio.length / 16000;

  return { filePath: outputPath, durationSeconds };
}

export interface AudioResult {
  url: string;
  duration: number | null;
  cached: boolean;
}

/**
 * Get or generate audio for a unit.
 * Checks AudioCache first; if miss, synthesizes via Azure Speech and stores.
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
    return { url: cached.url, duration: cached.duration, cached: true };
  }

  // Fetch unit content
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    select: { content: true, title: true, arabicTerms: true },
  });

  if (!unit || !unit.content) {
    throw new Error('Unit not found or has no content');
  }

  // Extract text for synthesis
  let textToSynthesize: string;
  if (blockIndex !== null && blockIndex >= 0) {
    // Split content into blocks (paragraphs)
    const blocks = unit.content.split(/<\/?(p|div|section|h[1-6])[^>]*>/gi).filter((b) => b.trim() && b.length > 10);
    if (blockIndex >= blocks.length) {
      throw new Error(`Block index ${blockIndex} out of range (${blocks.length} blocks)`);
    }
    textToSynthesize = stripHtml(blocks[blockIndex]);
  } else {
    textToSynthesize = stripHtml(unit.content);
  }

  if (!textToSynthesize.trim()) {
    throw new Error('No synthesizable text found in unit content');
  }

  // Generate filename and synthesize
  const blockSuffix = blockIndex !== null && blockIndex >= 0 ? `-${blockIndex}` : '';
  const filename = `${unitId}-${language}${blockSuffix}.mp3`;
  const outputPath = path.join(AUDIO_DIR, filename);

  const { durationSeconds } = await synthesizeToFile(textToSynthesize, language, outputPath, unitId);

  // Build the public URL
  const audioUrl = `${baseUrl}/audio/${filename}`;

  // Cache in database
  await prisma.audioCache.create({
    data: {
      unitId,
      language,
      blockIndex: blockIndex ?? -1,
      url: audioUrl,
      duration: durationSeconds,
    },
  });

  return { url: audioUrl, duration: durationSeconds, cached: false };
}
