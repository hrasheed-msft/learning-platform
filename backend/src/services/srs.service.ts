import prisma from '../config/database';
import { NotFoundError, ForbiddenError } from '../middleware/error.middleware';

interface AddItemInput {
  memberId: string;
  type: 'AYAH' | 'HADITH' | 'DUA' | 'TERM';
  front: string;
  back: string;
  arabicText?: string;
  transliteration?: string;
  sourceUnitId?: string;
}

// SM-2 Algorithm intervals (in days)
const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120, 240];

// Calculate next review date based on rating
function calculateNextReview(rating: number, currentInterval: number): { nextInterval: number; nextReviewDate: Date } {
  let nextInterval: number;

  if (rating === 1) {
    // Again - reset to beginning
    nextInterval = INTERVALS[0];
  } else if (rating === 2) {
    // Hard - stay at current or go back one step
    const currentIndex = INTERVALS.indexOf(currentInterval);
    nextInterval = INTERVALS[Math.max(0, currentIndex - 1)];
  } else if (rating === 3) {
    // Good - advance one step
    const currentIndex = INTERVALS.indexOf(currentInterval);
    nextInterval = INTERVALS[Math.min(INTERVALS.length - 1, currentIndex + 1)];
  } else {
    // Easy - advance two steps
    const currentIndex = INTERVALS.indexOf(currentInterval);
    nextInterval = INTERVALS[Math.min(INTERVALS.length - 1, currentIndex + 2)];
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return { nextInterval, nextReviewDate };
}

export class SRSService {
  static async getDueItems(familyId: string, memberId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const now = new Date();

    const items = await prisma.memorizationItem.findMany({
      where: {
        memberId,
        nextReviewDate: { lte: now },
      },
      orderBy: { nextReviewDate: 'asc' },
    });

    return {
      dueCount: items.length,
      items,
    };
  }

  static async getItems(familyId: string, memberId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const items = await prisma.memorizationItem.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
    });

    return items;
  }

  static async addItem(familyId: string, input: AddItemInput) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: input.memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const item = await prisma.memorizationItem.create({
      data: {
        memberId: input.memberId,
        type: input.type,
        front: input.front,
        back: input.back,
        arabicText: input.arabicText,
        transliteration: input.transliteration,
        sourceUnitId: input.sourceUnitId,
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(), // Due immediately
      },
    });

    return item;
  }

  static async submitReview(familyId: string, memberId: string, itemId: string, rating: number) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    // Get item
    const item = await prisma.memorizationItem.findFirst({
      where: { id: itemId, memberId },
    });

    if (!item) {
      throw new NotFoundError('Memorization item not found');
    }

    // Calculate next review
    const currentInterval = item.interval || 0;
    const { nextInterval, nextReviewDate } = calculateNextReview(rating, currentInterval);

    // Update item
    const updatedItem = await prisma.memorizationItem.update({
      where: { id: itemId },
      data: {
        interval: nextInterval,
        repetitions: { increment: 1 },
        lastReviewedAt: new Date(),
        nextReviewDate,
      },
    });

    // Log review
    await prisma.reviewLog.create({
      data: {
        memorizationItemId: itemId,
        memberId,
        rating,
        intervalBefore: currentInterval,
        intervalAfter: nextInterval,
      },
    });

    return {
      item: updatedItem,
      nextReviewDate,
      nextInterval,
    };
  }

  static async getReviewHistory(familyId: string, memberId: string, limit = 50) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const history = await prisma.reviewLog.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        memorizationItem: {
          select: { front: true, type: true },
        },
      },
    });

    return history;
  }

  static async getStats(familyId: string, memberId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get counts
    const [totalItems, dueItems, reviewsToday] = await Promise.all([
      prisma.memorizationItem.count({ where: { memberId } }),
      prisma.memorizationItem.count({
        where: { memberId, nextReviewDate: { lte: now } },
      }),
      prisma.reviewLog.count({
        where: { memberId, createdAt: { gte: today } },
      }),
    ]);

    // Get items by type
    const itemsByType = await prisma.memorizationItem.groupBy({
      by: ['type'],
      where: { memberId },
      _count: true,
    });

    // Get retention rate (items reviewed in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReviews = await prisma.reviewLog.findMany({
      where: { memberId, createdAt: { gte: thirtyDaysAgo } },
    });

    const goodReviews = recentReviews.filter(r => r.rating >= 3).length;
    const retentionRate = recentReviews.length > 0 
      ? Math.round((goodReviews / recentReviews.length) * 100) 
      : 0;

    return {
      totalItems,
      dueItems,
      reviewsToday,
      retentionRate,
      itemsByType: itemsByType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
