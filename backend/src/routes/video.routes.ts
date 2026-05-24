import { Router, Request, Response } from 'express';

const router = Router();

const videoGenerationDisabled = (_req: Request, res: Response) => {
  return res.status(503).json({
    success: false,
    error: {
      message: 'Video generation is temporarily disabled while we stabilize lesson loading.',
      code: 'VIDEO_GENERATION_DISABLED',
    },
  });
};

// Temporarily disable video generation endpoints so lessons and audio stay responsive.
router.post('/units/:unitId/video', videoGenerationDisabled);
router.post('/admin/generate-videos', videoGenerationDisabled);
router.get('/admin/video-status', videoGenerationDisabled);

export default router;

