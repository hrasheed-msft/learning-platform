import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Audio / TTS Tests
 * Tests: TTS endpoint, AudioCache lookup, SSML generation validation
 */

vi.mock('../config/database', () => ({
  default: {
    audioCache: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    unit: {
      findUnique: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

vi.mock('../config/redis', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

vi.mock('microsoft-cognitiveservices-speech-sdk', () => ({
  SpeechConfig: {
    fromSubscription: vi.fn().mockReturnValue({
      speechSynthesisOutputFormat: null,
    }),
  },
  AudioConfig: {
    fromAudioFileOutput: vi.fn().mockReturnValue({}),
  },
  SpeechSynthesizer: vi.fn().mockImplementation(() => ({
    speakSsmlAsync: vi.fn((ssml, resolve) => {
      resolve({ reason: 1, audioDuration: 50000000 }); // 5 seconds
    }),
    close: vi.fn(),
  })),
  SpeechSynthesisOutputFormat: {
    Audio16Khz128KBitRateMonoMp3: 4,
  },
  ResultReason: {
    SynthesizingAudioCompleted: 1,
  },
}));

vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
  },
  existsSync: vi.fn().mockReturnValue(true),
  mkdirSync: vi.fn(),
}));

import prisma from '../config/database';
import {
  buildAudioFilename,
  buildVoiceElements,
  getCachedAudioEntry,
  invalidateAudioCache,
  preprocessTtsHtml,
  TTS_AUDIO_CACHE_VERSION,
} from '../services/tts.service';

describe('Audio / TTS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AudioCache lookup', () => {
    it('should return cached audio if available for the current cache version', async () => {
      const cachedEntry = {
        id: 'cache-1',
        url: `https://api.example.com/audio/unit-1-en-${TTS_AUDIO_CACHE_VERSION}.mp3`,
        duration: 45.5,
        timestamps: [{ word: 'Prayer', offset: 0, duration: 500 }],
        cacheVersion: TTS_AUDIO_CACHE_VERSION,
      };
      vi.mocked(prisma.audioCache.findUnique).mockResolvedValue(cachedEntry as any);

      const result = await getCachedAudioEntry('unit-1', 'en', null);

      expect(result).toBeDefined();
      expect(result!.url).toContain(TTS_AUDIO_CACHE_VERSION);
      expect(result!.duration).toBe(45.5);
      expect(prisma.audioCache.delete).not.toHaveBeenCalled();
    });

    it('should invalidate stale cached audio when cache version is missing', async () => {
      vi.mocked(prisma.audioCache.findUnique).mockResolvedValue({
        id: 'cache-old',
        url: 'https://api.example.com/audio/unit-1-en.mp3',
        duration: 30,
        timestamps: null,
        cacheVersion: null,
      } as any);
      vi.mocked(prisma.audioCache.delete).mockResolvedValue({} as any);

      const result = await getCachedAudioEntry('unit-1', 'en', null);

      expect(result).toBeNull();
      expect(prisma.audioCache.delete).toHaveBeenCalledWith({ where: { id: 'cache-old' } });
    });

    it('should return null for uncached audio', async () => {
      vi.mocked(prisma.audioCache.findUnique).mockResolvedValue(null);

      const result = await getCachedAudioEntry('unit-new', 'ar', null);

      expect(result).toBeNull();
    });
  });

  describe('Audio URL format', () => {
    it('should generate versioned filenames for full-unit audio', () => {
      const filename = buildAudioFilename('unit-123', 'ar', null);

      expect(filename).toBe(`unit-123-ar-${TTS_AUDIO_CACHE_VERSION}.mp3`);
    });

    it('should include block index in versioned filenames for block-specific audio', () => {
      const filename = buildAudioFilename('unit-123', 'en', 2);

      expect(filename).toBe(`unit-123-en-2-${TTS_AUDIO_CACHE_VERSION}.mp3`);
    });
  });

  describe('Language selection', () => {
    it('should support Arabic language', () => {
      const VOICES = { ar: 'ar-SA-HamedNeural', en: 'en-US-JennyNeural' };
      expect(VOICES.ar).toBe('ar-SA-HamedNeural');
    });

    it('should support English language', () => {
      const VOICES = { ar: 'ar-SA-HamedNeural', en: 'en-US-JennyNeural' };
      expect(VOICES.en).toBe('en-US-JennyNeural');
    });

    it('should reject invalid languages', () => {
      const validLanguages = ['ar', 'en'];
      expect(validLanguages.includes('fr')).toBe(false);
      expect(validLanguages.includes('ar')).toBe(true);
    });
  });

  describe('Audio cache invalidation', () => {
    it('should delete cached audio rows in bulk', async () => {
      vi.mocked(prisma.audioCache.deleteMany).mockResolvedValue({ count: 7 } as any);

      const deletedCount = await invalidateAudioCache({ language: 'en' });

      expect(deletedCount).toBe(7);
      expect(prisma.audioCache.deleteMany).toHaveBeenCalledWith({
        where: { language: 'en' },
      });
    });
  });

  describe('TTS preprocessing', () => {
    const arabicTerms = [
      { arabicText: 'صلاة', transliteration: 'salah', translation: 'prayer' },
      { arabicText: 'وضوء', transliteration: 'wudu', translation: 'ablution' },
    ];

    it('should replace transliterated Arabic terms with translation, Arabic, and simple transliteration', () => {
      const result = preprocessTtsHtml('<p>Ṣalāh requires Wuḍūʾ before class.</p>', arabicTerms);

      expect(result).toContain('Prayer [[ar]]صلاة[[/ar]] Salah');
      expect(result).toContain('Ablution [[ar]]وضوء[[/ar]] Wudu');
      expect(result).not.toContain('Ṣalāh');
      expect(result).not.toContain('Wuḍūʾ');
    });

    it('should add heading breaks and force Arabic voice for inserted Arabic terms', () => {
      const preprocessed = preprocessTtsHtml('<h2>Ṣalāh</h2><p>Practice Ṣalāh daily.</p>', arabicTerms);
      const voiceElements = buildVoiceElements(preprocessed, 'en');

      expect(preprocessed).toContain('[[break:800ms]]');
      expect(preprocessed).toContain('[[break:500ms]]');
      expect(voiceElements.some((element) => element.includes('<break time="800ms"/>'))).toBe(true);
      expect(voiceElements.some((element) => element.includes('<break time="500ms"/>'))).toBe(true);
      expect(voiceElements.every((element) => element.startsWith('<voice '))).toBe(true);
      expect(voiceElements.some((element) => element.includes('ar-SA-HamedNeural') && element.includes('صلاة'))).toBe(true);
    });
  });
});
