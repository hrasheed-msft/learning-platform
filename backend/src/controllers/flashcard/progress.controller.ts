/**
 * Flash Card Progress Controller
 * 
 * Handles HTTP requests for flash card progress tracking and spaced repetition.
 */

import { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as progressService from '../../services/flashcard/flashcard-progress.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

// Validation schemas
const submitReviewSchema = z.object({
  memberId: z.string().uuid('Member ID must be a valid UUID'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
});

const dueCardsFiltersSchema = z.object({
  unitId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  daysAhead: z.coerce.number().int().min(0).max(30).optional().default(0),
});

const statisticsFiltersSchema = z.object({
  memberId: z.string().uuid('Member ID must be a valid UUID'),
  unitId: z.string().uuid().optional(),
  courseId: z.string().uuid().optional(),
});

/**
 * Initialize progress for a flash card
 */
export async function initializeProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { flashCardId } = req.params;
    const memberId = req.user?.id; // Use user.id, not memberId

    if (!memberId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const progress = await progressService.getOrCreateProgress(memberId, flashCardId);

    res.status(201).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: 'Progress already initialized for this card',
      });
    }
    next(error);
  }
}

/**
 * Submit a review for a flash card
 */
export async function submitReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { flashCardId } = req.params;
    const { memberId, rating } = submitReviewSchema.parse(req.body);

    console.log(`[FlashCard Review] Member: ${memberId}, Card: ${flashCardId}, Rating: ${rating}`);

    const result = await progressService.submitReview({ memberId, flashCardId, rating });

    console.log(`[FlashCard Review] Updated status: ${result.progress.status}, repetitions: ${result.progress.repetitions}`);

    res.status(200).json({
      success: true,
      data: result.progress,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Flash card or progress not found',
      });
    }
    next(error);
  }
}

/**
 * Get due cards for review
 */
export async function getDueCards(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const memberId = req.user?.id;

    if (!memberId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const filters = dueCardsFiltersSchema.parse(req.query);

    const dueCards = await progressService.getDueCards(memberId, filters);

    res.status(200).json({
      success: true,
      data: dueCards.dueCards,
      count: dueCards.total,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    next(error);
  }
}

/**
 * Get progress statistics
 */
export async function getStatistics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const filters = statisticsFiltersSchema.parse(req.query);
    const memberId = filters.memberId;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        error: 'Member ID is required',
      });
    }

    const stats = await progressService.getStatistics(
      memberId,
      filters.courseId,
      filters.unitId
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
    next(error);
  }
}

/**
 * Get progress for a unit
 */
export async function getUnitProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { unitId } = req.params;
    const memberId = req.user?.id;

    if (!memberId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const progress = await progressService.getUnitProgress(memberId, unitId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get progress for a course
 */
export async function getCourseProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params;
    const memberId = req.user?.id;

    if (!memberId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const progress = await progressService.getCourseProgress(memberId, courseId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get recent reviews
 */
export async function getRecentReviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const memberId = req.user?.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!memberId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const reviews = await progressService.getRecentReviews(memberId, limit);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reset progress for a single card
 */
export async function resetProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { flashCardId } = req.params;
    const memberId = req.user?.id;

    if (!memberId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    await progressService.resetProgress(memberId, flashCardId);

    res.status(200).json({
      success: true,
      message: 'Progress reset successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found',
      });
    }
    next(error);
  }
}

/**
 * Reset progress for all cards in a unit
 */
export async function resetUnitProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { unitId } = req.params;
    const memberId = req.user?.id;

    if (!memberId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    await progressService.resetUnitProgress(memberId, unitId);

    res.status(200).json({
      success: true,
      message: 'Unit progress reset successfully',
    });
  } catch (error) {
    next(error);
  }
}
