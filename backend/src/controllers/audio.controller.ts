import { Request, Response, NextFunction } from 'express';
import { getOrGenerateAudio } from '../services/tts.service';

export class AudioController {
  /**
   * POST /api/v1/units/:unitId/audio
   * Body: { language: "ar" | "en", contentBlockId?: string }
   *
   * Returns cached or freshly-generated audio URL for the unit.
   */
  static async generateAudio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId } = req.params;
      const { language, contentBlockId } = req.body;

      if (!language || !['ar', 'en'].includes(language)) {
        res.status(400).json({ message: 'language must be "ar" or "en"' });
        return;
      }

      const blockIndex = contentBlockId !== undefined ? parseInt(contentBlockId, 10) : null;
      if (blockIndex !== null && isNaN(blockIndex)) {
        res.status(400).json({ message: 'contentBlockId must be a numeric index' });
        return;
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const result = await getOrGenerateAudio(unitId, language, blockIndex, baseUrl);

      res.json({
        success: true,
        data: {
          url: result.url,
          duration: result.duration,
          cached: result.cached,
        },
      });
    } catch (error: any) {
      if (error.message?.includes('not found') || error.message?.includes('No synthesizable')) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  }
}
