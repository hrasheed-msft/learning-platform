/**
 * Flash Card Controller
 * 
 * Handles HTTP requests for flash card CRUD operations with validation.
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as flashCardService from '../../services/flashcard/flashcard.service';
import { FlashCardDifficulty } from '@prisma/client';

// Validation schemas
const createFlashCardSchema = z.object({
  front: z.string().min(1, 'Front text is required'),
  back: z.string().min(1, 'Back text is required'),
  frontArabic: z.string().optional(),
  backArabic: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  difficulty: z.nativeEnum(FlashCardDifficulty).optional().default(FlashCardDifficulty.MEDIUM),
  orderIndex: z.number().int().min(0).optional(),
});

const updateFlashCardSchema = z.object({
  front: z.string().min(1).optional(),
  back: z.string().min(1).optional(),
  frontArabic: z.string().optional(),
  backArabic: z.string().optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.nativeEnum(FlashCardDifficulty).optional(),
  orderIndex: z.number().int().min(0).optional(),
});

const flashCardFiltersSchema = z.object({
  courseId: z.string().uuid().optional(),
  unitId: z.string().uuid().optional(),
  category: z.string().optional(),
  difficulty: z.nativeEnum(FlashCardDifficulty).optional(),
  tags: z.array(z.string()).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const createBatchSchema = z.object({
  cards: z.array(createFlashCardSchema).min(1, 'At least one card is required'),
});

const reorderSchema = z.object({
  cardIds: z.array(z.string().uuid()).min(1, 'At least one card ID is required'),
});

/**
 * Create a flash card for a unit
 */
export async function createFlashCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { unitId, courseId } = req.params;
    const validated = createFlashCardSchema.parse(req.body);

    const flashCard = await flashCardService.createFlashCard({
      ...validated,
      unitId,
      courseId,
    });

    res.status(201).json({
      success: true,
      data: flashCard,
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
 * Get flash cards with optional filtering
 */
export async function getFlashCards(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId, unitId } = req.params;
    const filters = flashCardFiltersSchema.parse({
      ...req.query,
      courseId: courseId || req.query.courseId,
      unitId: unitId || req.query.unitId,
    });

    const result = await flashCardService.getFlashCards(filters);

    res.status(200).json({
      success: true,
      data: result.flashCards,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore,
      },
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
 * Get a single flash card by ID
 */
export async function getFlashCardById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const flashCard = await flashCardService.getFlashCard(id);

    if (!flashCard) {
      return res.status(404).json({
        success: false,
        error: 'Flash card not found',
      });
    }

    res.status(200).json({
      success: true,
      data: flashCard,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a flash card
 */
export async function updateFlashCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const validated = updateFlashCardSchema.parse(req.body);

    const flashCard = await flashCardService.updateFlashCard(id, validated);

    res.status(200).json({
      success: true,
      data: flashCard,
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
        error: 'Flash card not found',
      });
    }
    next(error);
  }
}

/**
 * Delete a flash card
 */
export async function deleteFlashCard(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await flashCardService.deleteFlashCard(id);

    res.status(200).json({
      success: true,
      message: 'Flash card deleted successfully',
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Flash card not found',
      });
    }
    next(error);
  }
}

/**
 * Create multiple flash cards in batch
 */
export async function createFlashCardBatch(req: Request, res: Response, next: NextFunction) {
  try {
    const { unitId, courseId } = req.params;
    const { cards } = createBatchSchema.parse(req.body);

    const cardsWithContext = cards.map(card => ({
      ...card,
      unitId,
      courseId,
    }));

    const result = await flashCardService.createFlashCardBatch(cardsWithContext);

    res.status(201).json({
      success: true,
      data: {
        count: result.count,
        cards: result.cards,
      },
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
 * Reorder flash cards in a unit
 */
export async function reorderFlashCards(req: Request, res: Response, next: NextFunction) {
  try {
    const { unitId } = req.params;
    const { cardIds } = reorderSchema.parse(req.body);

    await flashCardService.reorderFlashCards(unitId, cardIds);

    res.status(200).json({
      success: true,
      message: 'Flash cards reordered successfully',
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
        error: 'One or more flash cards not found',
      });
    }
    next(error);
  }
}

/**
 * Get distinct categories
 */
export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const { unitId } = req.query;

    const categories = await flashCardService.getCategories(unitId as string | undefined);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get distinct tags
 */
export async function getTags(req: Request, res: Response, next: NextFunction) {
  try {
    const { unitId } = req.query;

    const tags = await flashCardService.getTags(unitId as string | undefined);

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get flash card count with filters
 */
export async function getFlashCardCount(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = flashCardFiltersSchema.parse(req.query);

    const count = await flashCardService.getFlashCardCount(filters);

    res.status(200).json({
      success: true,
      data: { count },
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
