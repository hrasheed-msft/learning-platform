import { Request, Response, NextFunction } from 'express';
import {
  getOrGenerateAudio,
  getAudioTimestamps,
  preGenerateAllAudio,
  getCachedAudioEntry,
  invalidateAudioCache,
  TTS_AUDIO_CACHE_VERSION,
} from '../services/tts.service';

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

      const cached = await getCachedAudioEntry(unitId, language as 'ar' | 'en', null);

      if (!cached || !cached.url) {
        res.status(404).json({ success: false, message: 'No pre-generated audio found for this unit' });
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
   * POST /api/v1/admin/audio-cache/invalidate
   * Body: { language?: "ar" | "en" }
   *
   * Deletes cached audio rows so units regenerate on-demand with the current TTS format.
   */
  static async invalidateCachedAudio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestedLanguage = req.body?.language as string | undefined;
      const requestedUnitIds = Array.isArray(req.body?.unitIds)
        ? req.body.unitIds.filter((unitId: unknown): unitId is string => typeof unitId === 'string')
        : undefined;

      if (requestedLanguage !== undefined && !['ar', 'en'].includes(requestedLanguage)) {
        res.status(400).json({ message: 'language must be "ar" or "en"' });
        return;
      }

      const deletedCount = await invalidateAudioCache({
        language: requestedLanguage as 'ar' | 'en' | undefined,
        unitIds: requestedUnitIds,
      });

      res.json({
        success: true,
        message: deletedCount > 0
          ? `Invalidated ${deletedCount} cached audio entr${deletedCount === 1 ? 'y' : 'ies'}. Audio will regenerate on next request.`
          : 'No cached audio entries matched the invalidation filter.',
        data: {
          deletedCount,
          language: requestedLanguage || 'all',
          unitIds: requestedUnitIds || 'all',
          cacheVersion: TTS_AUDIO_CACHE_VERSION,
        },
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
