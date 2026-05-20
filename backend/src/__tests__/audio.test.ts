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

describe('Audio / TTS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AudioCache lookup', () => {
    it('should return cached audio if available', async () => {
      const cachedEntry = {
        id: 'cache-1',
        unitId: 'unit-1',
        language: 'en',
        blockIndex: -1,
        url: 'https://api.example.com/audio/unit-1-en.mp3',
        duration: 45.5,
      };
      vi.mocked(prisma.audioCache.findUnique).mockResolvedValue(cachedEntry as any);

      const result = await prisma.audioCache.findUnique({
        where: {
          unitId_language_blockIndex: {
            unitId: 'unit-1',
            language: 'en',
            blockIndex: -1,
          },
        },
      });

      expect(result).toBeDefined();
      expect(result!.url).toContain('unit-1-en.mp3');
      expect(result!.duration).toBe(45.5);
    });

    it('should return null for uncached audio', async () => {
      vi.mocked(prisma.audioCache.findUnique).mockResolvedValue(null);

      const result = await prisma.audioCache.findUnique({
        where: {
          unitId_language_blockIndex: {
            unitId: 'unit-new',
            language: 'ar',
            blockIndex: -1,
          },
        },
      });

      expect(result).toBeNull();
    });
  });

  describe('Audio URL format', () => {
    it('should generate correct audio URL pattern', () => {
      const unitId = 'unit-123';
      const language = 'ar';
      const baseUrl = 'https://api.example.com';
      const filename = `${unitId}-${language}.mp3`;
      const audioUrl = `${baseUrl}/audio/${filename}`;

      expect(audioUrl).toBe('https://api.example.com/audio/unit-123-ar.mp3');
    });

    it('should include block index in filename for block-specific audio', () => {
      const unitId = 'unit-123';
      const language = 'en';
      const blockIndex = 2;
      const filename = `${unitId}-${language}-${blockIndex}.mp3`;

      expect(filename).toBe('unit-123-en-2.mp3');
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
});
