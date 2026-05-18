/**
 * Flash Card Progress Service
 * 
 * Handles tracking of member progress on flash cards including:
 * - Review submission and SM-2 algorithm application
 * - Retrieving due cards for review
 * - Progress statistics and analytics
 */

import prisma from '../../config/database';
import { FlashCardStatus, Prisma } from '@prisma/client';
import { calculateNextReview, getStatusTransitionMessage } from './sm2-algorithm.service';

export interface SubmitReviewData {
  memberId: string;
  flashCardId: string;
  rating: number; // 1-5
}

export interface DueCardsFilters {
  courseId?: string;
  unitId?: string;
  limit?: number;
}

export interface FlashCardStatistics {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewingCards: number;
  masteredCards: number;
  dueToday: number;
  masteryPercentage: number;
  averageEaseFactor?: number;
  reviewStreak?: number;
}

/**
 * Get or create progress record for a flash card and member
 */
export async function getOrCreateProgress(memberId: string, flashCardId: string) {
  // Try to find existing progress
  let progress = await prisma.flashCardProgress.findUnique({
    where: {
      memberId_flashCardId: {
        memberId,
        flashCardId,
      },
    },
  });

  // Create if doesn't exist
  if (!progress) {
    progress = await prisma.flashCardProgress.create({
      data: {
        memberId,
        flashCardId,
        // Defaults from schema: easeFactor=2.5, interval=0, repetitions=0, status=NEW
      },
    });
  }

  return progress;
}

/**
 * Get progress for a specific flash card
 */
export async function getProgress(memberId: string, flashCardId: string) {
  return await prisma.flashCardProgress.findUnique({
    where: {
      memberId_flashCardId: {
        memberId,
        flashCardId,
      },
    },
    include: {
      flashCard: true,
    },
  });
}

/**
 * Submit a review rating for a flash card
 */
export async function submitReview(data: SubmitReviewData) {
  const { memberId, flashCardId, rating } = data;

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Get or create progress
  const currentProgress = await getOrCreateProgress(memberId, flashCardId);

  // Calculate next review using SM-2 algorithm
  const sm2Result = calculateNextReview({
    easeFactor: currentProgress.easeFactor,
    interval: currentProgress.interval,
    repetitions: currentProgress.repetitions,
    rating,
    currentStatus: currentProgress.status,
  });

  // Determine if this was a correct review (rating 4 or 5)
  const wasCorrect = rating >= 4;
  const newCorrectReviews = currentProgress.correctReviews + (wasCorrect ? 1 : 0);

  // Get status transition message
  const statusMessage = getStatusTransitionMessage(
    currentProgress.status,
    sm2Result.status
  );

  // Update progress
  const updatedProgress = await prisma.flashCardProgress.update({
    where: {
      memberId_flashCardId: {
        memberId,
        flashCardId,
      },
    },
    data: {
      easeFactor: sm2Result.easeFactor,
      interval: sm2Result.interval,
      repetitions: sm2Result.repetitions,
      nextReviewDate: sm2Result.nextReviewDate,
      totalReviews: currentProgress.totalReviews + 1,
      correctReviews: newCorrectReviews,
      lastRating: rating,
      status: sm2Result.status,
    },
    include: {
      flashCard: true,
    },
  });

  return {
    progress: updatedProgress,
    nextReviewDate: sm2Result.nextReviewDate,
    interval: sm2Result.interval,
    status: sm2Result.status,
    statusMessage,
  };
}

/**
 * Get all flash cards due for review for a member
 */
export async function getDueCards(
  memberId: string,
  filters: DueCardsFilters = {}
) {
  const { courseId, unitId, limit } = filters;

  // Build where clause
  const where: Prisma.FlashCardProgressWhereInput = {
    memberId,
    nextReviewDate: {
      lte: new Date(), // Due now or in the past
    },
  };

  // Add flash card filters through relation
  if (courseId || unitId) {
    where.flashCard = {};
    if (courseId) where.flashCard.courseId = courseId;
    if (unitId) where.flashCard.unitId = unitId;
  }

  // Query due cards
  const dueCards = await prisma.flashCardProgress.findMany({
    where,
    orderBy: [
      { nextReviewDate: 'asc' }, // Oldest due first
      { status: 'asc' },          // Prioritize NEW cards
    ],
    ...(limit && { take: limit }),
    include: {
      flashCard: {
        include: {
          unit: {
            select: {
              id: true,
              title: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  return {
    dueCards,
    total: dueCards.length,
  };
}

/**
 * Get flash card statistics for a member
 */
export async function getStatistics(
  memberId: string,
  courseId?: string,
  unitId?: string
): Promise<FlashCardStatistics> {
  // Build where clause for flash cards
  const flashCardWhere: Prisma.FlashCardWhereInput = {};
  if (courseId) flashCardWhere.courseId = courseId;
  if (unitId) flashCardWhere.unitId = unitId;

  // Get total cards count
  const totalCards = await prisma.flashCard.count({
    where: flashCardWhere,
  });

  // Build where clause for progress
  const progressWhere: Prisma.FlashCardProgressWhereInput = {
    memberId,
  };

  if (courseId || unitId) {
    progressWhere.flashCard = flashCardWhere;
  }

  // Get progress records grouped by status
  const progressByStatus = await prisma.flashCardProgress.groupBy({
    by: ['status'],
    where: progressWhere,
    _count: {
      status: true,
    },
  });

  // Count cards by status
  let newCards = 0;
  let learningCards = 0;
  let reviewingCards = 0;
  let masteredCards = 0;

  progressByStatus.forEach((group) => {
    const count = group._count.status;
    switch (group.status) {
      case FlashCardStatus.NEW:
        newCards = count;
        break;
      case FlashCardStatus.LEARNING:
        learningCards = count;
        break;
      case FlashCardStatus.REVIEWING:
        reviewingCards = count;
        break;
      case FlashCardStatus.MASTERED:
        masteredCards = count;
        break;
    }
  });

  // Cards that haven't been started yet
  const progressCount = await prisma.flashCardProgress.count({
    where: progressWhere,
  });
  const notStartedCards = totalCards - progressCount;
  newCards += notStartedCards;

  // Count due cards (due now or in the past)
  const dueTodayCount = await prisma.flashCardProgress.count({
    where: {
      ...progressWhere,
      nextReviewDate: {
        lte: new Date(),
      },
    },
  });

  // Calculate mastery percentage
  const masteryPercentage =
    totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  // Calculate average ease factor
  const easeFactorAgg = await prisma.flashCardProgress.aggregate({
    where: progressWhere,
    _avg: {
      easeFactor: true,
    },
  });

  const averageEaseFactor = easeFactorAgg._avg.easeFactor || undefined;

  // TODO: Calculate review streak (requires review log or daily tracking)
  const reviewStreak = undefined;

  return {
    totalCards,
    newCards,
    learningCards,
    reviewingCards,
    masteredCards,
    dueToday: dueTodayCount,
    masteryPercentage,
    averageEaseFactor,
    reviewStreak,
  };
}

/**
 * Get progress for all flash cards in a unit
 */
export async function getUnitProgress(memberId: string, unitId: string) {
  return await prisma.flashCardProgress.findMany({
    where: {
      memberId,
      flashCard: {
        unitId,
      },
    },
    include: {
      flashCard: true,
    },
    orderBy: {
      flashCard: {
        orderIndex: 'asc',
      },
    },
  });
}

/**
 * Get progress for all flash cards in a course
 */
export async function getCourseProgress(memberId: string, courseId: string) {
  return await prisma.flashCardProgress.findMany({
    where: {
      memberId,
      flashCard: {
        courseId,
      },
    },
    include: {
      flashCard: {
        include: {
          unit: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        flashCard: {
          unit: {
            orderIndex: 'asc',
          },
        },
      },
      {
        flashCard: {
          orderIndex: 'asc',
        },
      },
    ],
  });
}

/**
 * Reset progress for a flash card (admin function)
 */
export async function resetProgress(memberId: string, flashCardId: string) {
  return await prisma.flashCardProgress.update({
    where: {
      memberId_flashCardId: {
        memberId,
        flashCardId,
      },
    },
    data: {
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: new Date(),
      totalReviews: 0,
      correctReviews: 0,
      lastRating: 0,
      status: FlashCardStatus.NEW,
    },
  });
}

/**
 * Bulk reset progress for all cards in a unit
 */
export async function resetUnitProgress(memberId: string, unitId: string) {
  const progressRecords = await prisma.flashCardProgress.findMany({
    where: {
      memberId,
      flashCard: {
        unitId,
      },
    },
    select: {
      memberId: true,
      flashCardId: true,
    },
  });

  if (progressRecords.length === 0) {
    return { count: 0 };
  }

  // Use transaction to reset all
  const updates = progressRecords.map((record) =>
    prisma.flashCardProgress.update({
      where: {
        memberId_flashCardId: {
          memberId: record.memberId,
          flashCardId: record.flashCardId,
        },
      },
      data: {
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
        totalReviews: 0,
        correctReviews: 0,
        lastRating: 0,
        status: FlashCardStatus.NEW,
      },
    })
  );

  await prisma.$transaction(updates);

  return { count: progressRecords.length };
}

/**
 * Get recent reviews for analytics
 */
export async function getRecentReviews(
  memberId: string,
  limit: number = 10
) {
  return await prisma.flashCardProgress.findMany({
    where: {
      memberId,
      totalReviews: {
        gt: 0,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: limit,
    include: {
      flashCard: {
        select: {
          id: true,
          front: true,
          category: true,
        },
      },
    },
  });
}

export default {
  getOrCreateProgress,
  getProgress,
  submitReview,
  getDueCards,
  getStatistics,
  getUnitProgress,
  getCourseProgress,
  resetProgress,
  resetUnitProgress,
  getRecentReviews,
};
