import { Router, Request, Response } from 'express';
import { getOrGenerateVideo } from '../services/videoService';
import { videoQueue } from '../services/videoQueue.service';
import prisma from '../config/database';

const router = Router();

/**
 * POST /api/v1/units/:unitId/video
 * Request body: { language: "ar" | "en" }
 * Smart endpoint: returns cached URL, queue status, or enqueues generation.
 */
router.post('/units/:unitId/video', async (req: Request, res: Response) => {
  try {
    const { unitId } = req.params;
    const { language } = req.body;

    if (!language || !['ar', 'en'].includes(language)) {
      return res.status(400).json({
        success: false,
        error: { message: 'language must be "ar" or "en"' },
      });
    }

    // Check current status in database
    const cached = await prisma.videoCache.findUnique({
      where: { unitId_language: { unitId, language } },
    });

    if (cached?.status === 'ready' && cached.url) {
      return res.json({
        success: true,
        data: { status: 'ready', url: cached.url, duration: cached.duration },
      });
    }

    if (cached?.status === 'generating') {
      const position = videoQueue.getPosition(unitId, language);
      return res.json({
        success: true,
        data: { status: 'generating', position, estimatedTime: 60 },
      });
    }

    if (cached?.status === 'queued') {
      const position = videoQueue.getPosition(unitId, language);
      return res.json({
        success: true,
        data: { status: 'queued', position, estimatedTime: position * 60 },
      });
    }

    // Not in system — enqueue it (non-blocking)
    await videoQueue.enqueue(unitId, language);
    const position = videoQueue.getPosition(unitId, language);

    return res.json({
      success: true,
      data: { status: 'queued', position, estimatedTime: position * 60 },
    });
  } catch (error: any) {
    console.error('[VideoRoute] Error:', error.message);
    return res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to process video request' },
    });
  }
});

/**
 * POST /api/v1/admin/generate-videos
 * Body: { courseId?: string, language: "ar" | "en" }
 * Queues all units in a course (or all courses) for video generation.
 */
router.post('/admin/generate-videos', async (req: Request, res: Response) => {
  try {
    const { courseId, language } = req.body;

    if (!language || !['ar', 'en'].includes(language)) {
      return res.status(400).json({
        success: false,
        error: { message: 'language must be "ar" or "en"' },
      });
    }

    // Fetch units to queue
    const whereClause = courseId ? { courseId } : {};
    const units = await prisma.unit.findMany({
      where: whereClause,
      select: { id: true, title: true },
      orderBy: { orderIndex: 'asc' },
    });

    if (units.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: courseId ? 'No units found for this course' : 'No units found' },
      });
    }

    // Enqueue each unit
    let queued = 0;
    for (const unit of units) {
      const wasQueued = await videoQueue.enqueue(unit.id, language);
      if (wasQueued) queued++;
    }

    return res.json({
      success: true,
      data: {
        queued,
        total: units.length,
        skipped: units.length - queued,
        message: `Queued ${queued} videos for generation (${units.length - queued} already ready/queued)`,
      },
    });
  } catch (error: any) {
    console.error('[VideoRoute] Admin generate-videos error:', error.message);
    return res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to queue videos' },
    });
  }
});

/**
 * GET /api/v1/admin/video-status
 * Returns aggregate counts of video generation progress.
 */
router.get('/admin/video-status', async (_req: Request, res: Response) => {
  try {
    const [total, queued, generating, ready, failed] = await Promise.all([
      prisma.videoCache.count(),
      prisma.videoCache.count({ where: { status: 'queued' } }),
      prisma.videoCache.count({ where: { status: 'generating' } }),
      prisma.videoCache.count({ where: { status: 'ready' } }),
      prisma.videoCache.count({ where: { status: 'failed' } }),
    ]);

    return res.json({
      success: true,
      data: {
        total,
        queued,
        generating,
        ready,
        failed,
        queueLength: videoQueue.length,
        isProcessing: videoQueue.isProcessing,
      },
    });
  } catch (error: any) {
    console.error('[VideoRoute] Admin video-status error:', error.message);
    return res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to get video status' },
    });
  }
});

export default router;

