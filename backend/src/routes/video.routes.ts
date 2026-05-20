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

    const { force } = req.body;

    // Check current status in database
    const cached = await prisma.videoCache.findUnique({
      where: { unitId_language: { unitId, language } },
    });

    if (!force) {
      if (cached?.status === 'ready' && cached.url) {
        return res.json({
          success: true,
          data: { status: 'ready', url: cached.url, duration: cached.duration },
        });
      }

      // If "generating" but not actually in-memory queue, it's stale — re-enqueue
      if (cached?.status === 'generating') {
        const position = videoQueue.getPosition(unitId, language);
        if (position >= 0 || videoQueue.isProcessing) {
          return res.json({
            success: true,
            data: { status: 'generating', position, estimatedTime: 60 },
          });
        }
        // Stale — fall through to re-enqueue
      }

      if (cached?.status === 'queued') {
        const position = videoQueue.getPosition(unitId, language);
        if (position >= 0) {
          return res.json({
            success: true,
            data: { status: 'queued', position, estimatedTime: position * 60 },
          });
        }
        // Stale — fall through to re-enqueue
      }
    }

    // Reset stale status before enqueue if needed
    if (cached && (cached.status === 'generating' || cached.status === 'failed' || force)) {
      await prisma.videoCache.update({
        where: { unitId_language: { unitId, language } },
        data: { status: 'queued', updatedAt: new Date() },
      });
    }

    // Enqueue (non-blocking)
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

