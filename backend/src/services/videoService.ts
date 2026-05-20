import puppeteer, { Browser } from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prisma from '../config/database';
import { getOrGenerateAudio } from './tts.service';

const VIDEO_DIR = path.join(__dirname, '../../public/videos');
const TEMPLATES_DIR = path.join(__dirname, './video/templates');

// Ensure video output directory exists
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

interface SlideData {
  type: 'title' | 'text' | 'arabic' | 'quiz';
  html: string;
  narrationText: string;
}

/**
 * Simple template rendering — replaces {{variable}} placeholders.
 * Handles {{#if var}}...{{/if}} conditionals.
 */
function renderTemplate(templateName: string, vars: Record<string, string | undefined>): string {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf-8');

  // Process conditionals: {{#if var}}content{{/if}}
  html = html.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, content) => {
    return vars[key] ? content : '';
  });

  // Replace variables
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value || '');
  }

  return html;
}

/**
 * Strip HTML tags for narration text
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
 * Split unit content into logical segments for slides.
 * Splits on paragraphs, headings, and block-level elements.
 */
function segmentContent(htmlContent: string): string[] {
  // Split on block elements (p, h1-h6, div, section, li)
  const blocks = htmlContent.split(/<\/(?:p|h[1-6]|div|section|li|blockquote)>/gi);
  const segments: string[] = [];

  for (const block of blocks) {
    const text = stripHtml(block).trim();
    if (text.length > 20) {
      // If too long (> 300 chars), further split on sentences
      if (text.length > 300) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let current = '';
        for (const sentence of sentences) {
          if ((current + sentence).length > 300 && current.length > 0) {
            segments.push(current.trim());
            current = sentence;
          } else {
            current += sentence;
          }
        }
        if (current.trim()) segments.push(current.trim());
      } else {
        segments.push(text);
      }
    }
  }

  return segments.length > 0 ? segments : [stripHtml(htmlContent)];
}

/**
 * Generate slides from unit content
 */
function generateSlides(
  unit: { title: string; content: string | null; arabicTerms: { arabicText: string; transliteration: string; translation: string }[]; course: { title: string } },
  language: 'ar' | 'en'
): SlideData[] {
  const slides: SlideData[] = [];

  // Title slide
  slides.push({
    type: 'title',
    html: renderTemplate('titleSlide', {
      courseName: unit.course.title,
      unitTitle: unit.title,
      arabicTitle: undefined,
    }),
    narrationText: language === 'ar'
      ? unit.title
      : `${unit.course.title}. ${unit.title}`,
  });

  // Content slides
  if (unit.content) {
    const segments = segmentContent(unit.content);
    segments.forEach((segment, idx) => {
      slides.push({
        type: 'text',
        html: renderTemplate('textSlide', {
          unitTitle: unit.title,
          slideLabel: `${idx + 1} of ${segments.length}`,
          content: segment,
        }),
        narrationText: segment,
      });
    });
  }

  // Arabic term slides (up to 10 terms to keep video reasonable)
  const terms = unit.arabicTerms.slice(0, 10);
  for (const term of terms) {
    slides.push({
      type: 'arabic',
      html: renderTemplate('arabicSlide', {
        arabicText: term.arabicText,
        transliteration: term.transliteration || undefined,
        translation: term.translation || undefined,
      }),
      narrationText: language === 'ar'
        ? term.arabicText
        : `${term.arabicText}. ${term.transliteration ? term.transliteration + '.' : ''} ${term.translation || ''}`,
    });
  }

  return slides;
}

/**
 * Render a single HTML slide to PNG using Puppeteer
 */
async function renderSlideToImage(
  browser: Browser,
  html: string,
  outputPath: string
): Promise<void> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: outputPath, type: 'png' });
  await page.close();
}

/**
 * Generate video for a unit using the narrated slide-deck approach:
 * 1. Fetch unit content
 * 2. Generate slides (HTML → PNG via Puppeteer)
 * 3. Generate TTS audio per slide
 * 4. Stitch with ffmpeg into MP4
 */
export async function generateUnitVideo(
  unitId: string,
  language: 'ar' | 'en'
): Promise<string> {
  // Fetch unit with content and terms
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: {
      course: true,
      arabicTerms: true,
    },
  });

  if (!unit) throw new Error(`Unit not found: ${unitId}`);
  if (!unit.content && unit.arabicTerms.length === 0) {
    throw new Error(`Unit ${unitId} has no content to generate video from`);
  }

  // Create temp working directory
  const workDir = path.join(VIDEO_DIR, `_work_${unitId}_${language}`);
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

  try {
    // Generate slides
    const slides = generateSlides(unit, language);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    // Render each slide to PNG and generate audio
    const segments: { imagePath: string; audioPath: string; duration: number }[] = [];
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const imagePath = path.join(workDir, `slide_${String(i).padStart(3, '0')}.png`);

      // Render slide image
      await renderSlideToImage(browser, slide.html, imagePath);

      // Generate TTS audio for this slide
      const audioFileName = `slide_${unitId}_${language}_${i}.mp3`;
      const audioPath = path.join(workDir, audioFileName);

      const audioResult = await generateSlideAudio(
        slide.narrationText,
        language,
        audioPath
      );

      segments.push({
        imagePath,
        audioPath,
        duration: audioResult.durationSeconds,
      });
    }

    await browser.close();

    // Build ffmpeg concat file
    const concatFilePath = path.join(workDir, 'concat.txt');
    const segmentVideoPaths: string[] = [];

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const segVideoPath = path.join(workDir, `seg_${String(i).padStart(3, '0')}.mp4`);

      // Create a video segment: image displayed for audio duration + audio track
      const duration = Math.max(seg.duration, 2); // minimum 2 seconds per slide
      execSync(
        `ffmpeg -y -loop 1 -i "${seg.imagePath}" -i "${seg.audioPath}" ` +
        `-c:v libx264 -tune stillimage -c:a aac -b:a 128k ` +
        `-pix_fmt yuv420p -shortest -t ${duration.toFixed(2)} "${segVideoPath}"`,
        { stdio: 'pipe' }
      );

      segmentVideoPaths.push(segVideoPath);
    }

    // Write concat list
    const concatContent = segmentVideoPaths
      .map((p) => `file '${p.replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatFilePath, concatContent);

    // Concatenate all segments into final video
    const outputFileName = `${unitId}-${language}.mp4`;
    const outputPath = path.join(VIDEO_DIR, outputFileName);

    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputPath}"`,
      { stdio: 'pipe' }
    );

    // Calculate total duration
    const totalDuration = segments.reduce((sum, s) => sum + Math.max(s.duration, 2), 0);

    // Build public URL
    const videoUrl = `/videos/${outputFileName}`;

    // Update database cache
    await prisma.videoCache.upsert({
      where: { unitId_language: { unitId, language } },
      create: { unitId, language, url: videoUrl, duration: totalDuration, status: 'ready' },
      update: { url: videoUrl, duration: totalDuration, status: 'ready', updatedAt: new Date() },
    });

    // Clean up work directory
    fs.rmSync(workDir, { recursive: true, force: true });

    return videoUrl;
  } catch (error) {
    // Mark as failed in database
    await prisma.videoCache.upsert({
      where: { unitId_language: { unitId, language } },
      create: { unitId, language, url: '', status: 'failed' },
      update: { status: 'failed', updatedAt: new Date() },
    });

    // Clean up work directory
    if (fs.existsSync(workDir)) {
      fs.rmSync(workDir, { recursive: true, force: true });
    }

    throw error;
  }
}

/**
 * Generate TTS audio for a single slide's narration text.
 * Uses the Azure Speech SDK directly (similar to tts.service but writes to a specific path).
 */
async function generateSlideAudio(
  text: string,
  language: 'ar' | 'en',
  outputPath: string
): Promise<{ filePath: string; durationSeconds: number }> {
  // Dynamic import to reuse the same SDK setup
  const sdk = await import('microsoft-cognitiveservices-speech-sdk');
  const config = (await import('../config')).default;

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    config.azureSpeech.key,
    config.azureSpeech.region
  );
  speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

  const VOICES = { ar: 'ar-SA-HamedNeural', en: 'en-US-JennyNeural' };
  const voice = VOICES[language];

  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${language === 'ar' ? 'ar-SA' : 'en-US'}">
  <voice name="${voice}">${text}</voice>
</speak>`;

  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const durationSeconds = result.audioDuration / 10_000_000;
          resolve({ filePath: outputPath, durationSeconds });
        } else {
          reject(new Error(`TTS failed: ${result.errorDetails || 'Unknown error'}`));
        }
      },
      (error) => {
        synthesizer.close();
        reject(new Error(`TTS error: ${error}`));
      }
    );
  });
}

/**
 * Get video status/URL for a unit, or trigger generation.
 */
export async function getOrGenerateVideo(
  unitId: string,
  language: 'ar' | 'en'
): Promise<{ status: 'generating' | 'ready' | 'failed'; url?: string; estimatedTime?: number }> {
  // Check cache
  const cached = await prisma.videoCache.findUnique({
    where: { unitId_language: { unitId, language } },
  });

  if (cached) {
    if (cached.status === 'ready') {
      return { status: 'ready', url: cached.url };
    }
    if (cached.status === 'generating') {
      return { status: 'generating', estimatedTime: 60 };
    }
    // If failed, allow re-generation by falling through
  }

  // Mark as generating
  await prisma.videoCache.upsert({
    where: { unitId_language: { unitId, language } },
    create: { unitId, language, url: '', status: 'generating' },
    update: { status: 'generating', updatedAt: new Date() },
  });

  // Trigger async generation (fire-and-forget)
  generateUnitVideo(unitId, language).catch((err) => {
    console.error(`[VideoService] Generation failed for unit ${unitId}:`, err.message);
  });

  return { status: 'generating', estimatedTime: 60 };
}
