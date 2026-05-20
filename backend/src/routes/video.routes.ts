import { Router, Request, Response } from 'express';
import { getOrGenerateVideo } from '../services/videoService';

const router = Router();

/**
 * POST /api/v1/units/:unitId/video
 * Request body: { language: "ar" | "en" }
 * If video is cached, returns immediately. Otherwise starts generation.
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

    const result = await getOrGenerateVideo(unitId, language);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[VideoRoute] Error:', error.message);
    return res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to generate video' },
    });
  }
});

export default router;
