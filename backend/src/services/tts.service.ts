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
 * Build SSML for bilingual content — Arabic segments get ar-SA voice,
 * English segments get en-US voice.
 */
function buildSsml(text: string, language: 'ar' | 'en'): string {
  if (language === 'ar') {
    // Pure Arabic narration
    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-SA">
  <voice name="${VOICES.ar}">${text}</voice>
</speak>`;
  }

  // English with possible inline Arabic — split on Arabic runs
  const parts = text.split(/([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\u064B-\u065F\u0670]+)/g);
  const ssmlParts = parts
    .filter((p) => p.trim())
    .map((part) => {
      if (containsArabic(part)) {
        return `<lang xml:lang="ar-SA"><voice name="${VOICES.ar}">${part.trim()}</voice></lang>`;
      }
      return part.trim();
    })
    .join(' ');

  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="${VOICES.en}">${ssmlParts}</voice>
</speak>`;
}

/**
 * Synthesize text to an MP3 file using Azure Speech SDK.
 * Returns the file path and duration in seconds.
 */
async function synthesizeToFile(
  text: string,
  language: 'ar' | 'en',
  outputPath: string
): Promise<{ filePath: string; durationSeconds: number }> {
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    config.azureSpeech.key,
    config.azureSpeech.region
  );
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  const ssml = buildSsml(text, language);

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const durationSeconds = result.audioDuration / 10_000_000; // 100-ns ticks → seconds
          resolve({ filePath: outputPath, durationSeconds });
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

  const { durationSeconds } = await synthesizeToFile(textToSynthesize, language, outputPath);

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
