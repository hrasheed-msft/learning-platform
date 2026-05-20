import prisma from '../config/database';
import { generateUnitVideo } from './videoService';

interface QueueItem {
  unitId: string;
  language: 'ar' | 'en';
}

class VideoQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private currentItem: QueueItem | null = null;

  get length(): number {
    return this.queue.length;
  }

  get isProcessing(): boolean {
    return this.processing;
  }

  /**
   * Add a unit to the generation queue. Skips if already queued or ready.
   */
  async enqueue(unitId: string, language: 'ar' | 'en'): Promise<boolean> {
    // Skip if already in queue
    if (this.queue.some((item) => item.unitId === unitId && item.language === language)) {
      return false;
    }

    // Skip if currently processing this item
    if (this.currentItem?.unitId === unitId && this.currentItem?.language === language) {
      return false;
    }

    // Skip if already ready in database (but not stale generating/failed)
    const existing = await prisma.videoCache.findUnique({
      where: { unitId_language: { unitId, language } },
    });
    if (existing?.status === 'ready') {
      return false;
    }
    // Skip if already queued in DB and we just need to add to in-memory queue
    // (don't skip generating/failed — those may be stale after restart)

    // Mark as queued in database
    await prisma.videoCache.upsert({
      where: { unitId_language: { unitId, language } },
      create: { unitId, language, url: '', status: 'queued' },
      update: { status: 'queued', updatedAt: new Date() },
    });

    this.queue.push({ unitId, language });
    this.processNext();
    return true;
  }

  /**
   * Get position of a unit in the queue (0-based). Returns -1 if not found.
   */
  getPosition(unitId: string, language: 'ar' | 'en'): number {
    if (this.currentItem?.unitId === unitId && this.currentItem?.language === language) {
      return 0; // Currently processing
    }
    const idx = this.queue.findIndex((item) => item.unitId === unitId && item.language === language);
    return idx >= 0 ? idx + 1 : -1; // +1 because current item is position 0
  }

  /**
   * Process queue items one at a time.
   */
  private async processNext(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    this.currentItem = this.queue.shift()!;

    const { unitId, language } = this.currentItem;
    console.log(`[VideoQueue] Processing: unit=${unitId}, lang=${language} (${this.queue.length} remaining)`);

    try {
      // Mark as generating
      await prisma.videoCache.upsert({
        where: { unitId_language: { unitId, language } },
        create: { unitId, language, url: '', status: 'generating' },
        update: { status: 'generating', updatedAt: new Date() },
      });

      await generateUnitVideo(unitId, language);
      console.log(`[VideoQueue] ✓ Complete: unit=${unitId}, lang=${language}`);
    } catch (error: any) {
      console.error(`[VideoQueue] ✗ Failed: unit=${unitId}, lang=${language}:`, error.message);
      // generateUnitVideo already marks as failed in DB
    }

    this.currentItem = null;
    this.processing = false;

    // Process next item
    if (this.queue.length > 0) {
      // Small delay to avoid overwhelming the server
      setTimeout(() => this.processNext(), 2000);
    } else {
      console.log('[VideoQueue] Queue empty — all jobs complete');
    }
  }
}

// Singleton instance
export const videoQueue = new VideoQueue();
