import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Video Generation Tests
 * Tests: video endpoint, queue behavior, status polling
 */

vi.mock('../config/database', () => ({
  default: {
    videoCache: {
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    unit: {
      findMany: vi.fn(),
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

vi.mock('../services/videoQueue.service', () => ({
  videoQueue: {
    enqueue: vi.fn().mockResolvedValue(true),
    getPosition: vi.fn().mockReturnValue(1),
    length: 0,
    isProcessing: false,
  },
}));

vi.mock('../services/videoService', () => ({
  getOrGenerateVideo: vi.fn(),
}));

import express from 'express';
import request from 'supertest';
import prisma from '../config/database';
import { videoQueue } from '../services/videoQueue.service';

// Inline the video route logic for testing
function createVideoApp() {
  const app = express();
  app.use(express.json());

  app.post('/api/v1/units/:unitId/video', async (req, res) => {
    try {
      const { unitId } = req.params;
      const { language } = req.body;

      if (!language || !['ar', 'en'].includes(language)) {
        return res.status(400).json({
          success: false,
          error: { message: 'language must be "ar" or "en"' },
        });
      }

      const cached = await prisma.videoCache.findUnique({
        where: { unitId_language: { unitId, language } },
      } as any);

      if (cached && (cached as any).status === 'ready' && (cached as any).url) {
        return res.json({
          success: true,
          data: { status: 'ready', url: (cached as any).url, duration: (cached as any).duration },
        });
      }

      if (cached && (cached as any).status === 'generating') {
        const position = videoQueue.getPosition(unitId, language);
        return res.json({
          success: true,
          data: { status: 'generating', position, estimatedTime: 60 },
        });
      }

      if (cached && (cached as any).status === 'queued') {
        const position = videoQueue.getPosition(unitId, language);
        return res.json({
          success: true,
          data: { status: 'queued', position, estimatedTime: position * 60 },
        });
      }

      await videoQueue.enqueue(unitId, language);
      const position = videoQueue.getPosition(unitId, language);

      return res.json({
        success: true,
        data: { status: 'queued', position, estimatedTime: position * 60 },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: error.message || 'Failed to process video request' },
      });
    }
  });

  return app;
}

describe('Video Generation API', () => {
  let app: express.Application;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createVideoApp();
  });

  describe('POST /api/v1/units/:unitId/video', () => {
    it('should return 400 for invalid language', async () => {
      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({ language: 'fr' });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('language must be');
    });

    it('should return 400 for missing language', async () => {
      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return cached video if status is ready', async () => {
      vi.mocked(prisma.videoCache.findUnique).mockResolvedValue({
        unitId: 'unit-1',
        language: 'en',
        status: 'ready',
        url: 'https://cdn.example.com/video/unit-1-en.mp4',
        duration: 120,
      } as any);

      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({ language: 'en' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('ready');
      expect(res.body.data.url).toContain('unit-1-en.mp4');
      expect(res.body.data.duration).toBe(120);
    });

    it('should return generating status with position', async () => {
      vi.mocked(prisma.videoCache.findUnique).mockResolvedValue({
        unitId: 'unit-1',
        language: 'ar',
        status: 'generating',
        url: null,
        duration: null,
      } as any);
      vi.mocked(videoQueue.getPosition).mockReturnValue(0);

      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({ language: 'ar' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('generating');
      expect(res.body.data.estimatedTime).toBe(60);
    });

    it('should return queued status with estimated time', async () => {
      vi.mocked(prisma.videoCache.findUnique).mockResolvedValue({
        unitId: 'unit-1',
        language: 'en',
        status: 'queued',
        url: null,
        duration: null,
      } as any);
      vi.mocked(videoQueue.getPosition).mockReturnValue(3);

      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({ language: 'en' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('queued');
      expect(res.body.data.position).toBe(3);
      expect(res.body.data.estimatedTime).toBe(180);
    });

    it('should enqueue new video generation if not in system', async () => {
      vi.mocked(prisma.videoCache.findUnique).mockResolvedValue(null);
      vi.mocked(videoQueue.enqueue).mockResolvedValue(true as any);
      vi.mocked(videoQueue.getPosition).mockReturnValue(1);

      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({ language: 'ar' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('queued');
      expect(videoQueue.enqueue).toHaveBeenCalledWith('unit-1', 'ar');
    });
  });

  describe('Queue behavior', () => {
    it('should not re-enqueue if video already in queue', async () => {
      vi.mocked(prisma.videoCache.findUnique).mockResolvedValue({
        status: 'queued', url: null, duration: null,
      } as any);
      vi.mocked(videoQueue.getPosition).mockReturnValue(5);

      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({ language: 'en' });

      expect(res.body.data.status).toBe('queued');
      expect(videoQueue.enqueue).not.toHaveBeenCalled();
    });

    it('estimated time scales with queue position', async () => {
      vi.mocked(prisma.videoCache.findUnique).mockResolvedValue(null);
      vi.mocked(videoQueue.getPosition).mockReturnValue(5);

      const res = await request(app)
        .post('/api/v1/units/unit-1/video')
        .send({ language: 'en' });

      expect(res.body.data.estimatedTime).toBe(300); // 5 * 60
    });
  });
});
