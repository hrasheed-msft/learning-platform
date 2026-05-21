import { Request, Response, NextFunction } from 'express';
import { getOrGenerateAudio, getAudioTimestamps, preGenerateAllAudio } from '../services/tts.service';
import prisma from '../config/database';

export class AudioController {
  /**
   * GET /api/v1/units/:unitId/audio?language=ar|en
   * Returns cached audio URL + timestamps if pre-generated. Does NOT trigger generation.
   */
  static async getCachedAudio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId } = req.params;
      const language = (req.query.language as string) || 'en';

      if (!['ar', 'en'].includes(language)) {
        res.status(400).json({ success: false, message: 'language must be "ar" or "en"' });
        return;
      }

      const cached = await prisma.audioCache.findUnique({
        where: {
          unitId_language_blockIndex: {
            unitId,
            language,
            blockIndex: -1,
          },
        },
        select: { url: true, duration: true, timestamps: true },
      });

      if (!cached || !cached.url) {
        res.status(404).json({ success: false, message: 'No pre-generated audio found for this unit' });
        return;
      }

      // Detect stale cache entries pointing to ephemeral container storage
      if (cached.url.includes('azurecontainerapps.io/audio/')) {
        res.status(404).json({ success: false, message: 'Audio needs regeneration (stale cache)' });
        return;
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const audioUrl = cached.url.startsWith('http') ? cached.url : `${baseUrl}${cached.url}`;

      res.json({
        success: true,
        data: {
          audioUrl,
          duration: cached.duration || 0,
          timestamps: (cached.timestamps as any) || [],
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
  /**
   * POST /api/v1/units/:unitId/audio
   * Body: { language: "ar" | "en", contentBlockId?: string }
   *
   * Returns cached or freshly-generated audio URL + word timestamps for the unit.
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
          timestamps: result.timestamps,
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

  /**
   * GET /api/v1/units/:unitId/audio/timestamps
   * Query: ?language=ar|en&blockIndex=N
   *
   * Returns just the word-level timestamps for pre-generated audio.
   */
  static async getTimestamps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId } = req.params;
      const language = (req.query.language as string) || 'ar';
      const blockIndexParam = req.query.blockIndex as string | undefined;

      if (!['ar', 'en'].includes(language)) {
        res.status(400).json({ message: 'language must be "ar" or "en"' });
        return;
      }

      const blockIndex = blockIndexParam !== undefined ? parseInt(blockIndexParam, 10) : null;
      if (blockIndex !== null && isNaN(blockIndex)) {
        res.status(400).json({ message: 'blockIndex must be a number' });
        return;
      }

      const timestamps = await getAudioTimestamps(unitId, language as 'ar' | 'en', blockIndex);

      if (!timestamps) {
        res.status(404).json({ message: 'No pre-generated audio timestamps found for this unit' });
        return;
      }

      res.json({
        success: true,
        data: { timestamps },
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/pre-generate-audio
   * Body: { language?: "ar" | "en", forceRegenerate?: boolean }
   *
   * Admin endpoint to batch pre-generate audio + timestamps for all units.
   */
  static async preGenerateAudio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { language = 'ar', forceRegenerate = false } = req.body;

      if (!['ar', 'en'].includes(language)) {
        res.status(400).json({ message: 'language must be "ar" or "en"' });
        return;
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;

      // Run async — respond immediately with acknowledgement, process in background
      res.json({
        success: true,
        message: `Audio pre-generation started for language="${language}", forceRegenerate=${forceRegenerate}. Check server logs for progress.`,
      });

      // Execute in background (after response is sent)
      setImmediate(async () => {
        try {
          const result = await preGenerateAllAudio(baseUrl, language, forceRegenerate);
          console.log(`TTS pre-gen complete: ${result.processed} processed, ${result.skipped} skipped, ${result.failed.length} failed`);
          if (result.failed.length > 0) {
            console.log(`TTS pre-gen failures:\n  ${result.failed.join('\n  ')}`);
          }
        } catch (err) {
          console.error('TTS pre-gen fatal error:', err);
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
}
