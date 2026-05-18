/**
 * Flash Card Service
 * 
 * Handles CRUD operations for flash cards including filtering, pagination,
 * and batch operations.
 */

import prisma from '../../config/database';
import { FlashCardDifficulty, Prisma } from '@prisma/client';

export interface CreateFlashCardData {
  unitId: string;
  courseId: string;
  front: string;
  back: string;
  frontArabic?: string;
  backArabic?: string;
  category: string;
  tags?: string[];
  difficulty?: FlashCardDifficulty;
  orderIndex?: number;
}

export interface UpdateFlashCardData {
  front?: string;
  back?: string;
  frontArabic?: string;
  backArabic?: string;
  category?: string;
  tags?: string[];
  difficulty?: FlashCardDifficulty;
  orderIndex?: number;
}

export interface FlashCardFilters {
  courseId?: string;
  unitId?: string;
  category?: string;
  difficulty?: FlashCardDifficulty;
  tags?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Get flash cards with optional filtering and pagination
 */
export async function getFlashCards(filters: FlashCardFilters = {}) {
  const {
    courseId,
    unitId,
    category,
    difficulty,
    tags,
    limit = 50,
    offset = 0,
  } = filters;

  // Build where clause
  const where: Prisma.FlashCardWhereInput = {};

  if (courseId) where.courseId = courseId;
  if (unitId) where.unitId = unitId;
  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;
  if (tags && tags.length > 0) {
    where.tags = {
      hasSome: tags,
    };
  }

  // Execute query with pagination
  const [flashCards, total] = await Promise.all([
    prisma.flashCard.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
      skip: offset,
      take: limit,
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
    }),
    prisma.flashCard.count({ where }),
  ]);

  return {
    flashCards,
    total,
    limit,
    offset,
    hasMore: offset + flashCards.length < total,
  };
}

/**
 * Get a single flash card by ID
 */
export async function getFlashCard(id: string) {
  const flashCard = await prisma.flashCard.findUnique({
    where: { id },
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
  });

  if (!flashCard) {
    throw new Error('Flash card not found');
  }

  return flashCard;
}

/**
 * Get flash cards by IDs (batch fetch)
 */
export async function getFlashCardsByIds(ids: string[]) {
  return await prisma.flashCard.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    orderBy: { orderIndex: 'asc' },
  });
}

/**
 * Create a new flash card
 */
export async function createFlashCard(data: CreateFlashCardData) {
  // Validate required fields
  if (!data.front || !data.back) {
    throw new Error('Front and back content are required');
  }

  if (!data.unitId || !data.courseId) {
    throw new Error('Unit ID and Course ID are required');
  }

  // If orderIndex not provided, get the next available one
  let orderIndex = data.orderIndex;
  if (orderIndex === undefined) {
    const lastCard = await prisma.flashCard.findFirst({
      where: { unitId: data.unitId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    orderIndex = lastCard ? lastCard.orderIndex + 1 : 1;
  }

  // Create the flash card
  const flashCard = await prisma.flashCard.create({
    data: {
      unitId: data.unitId,
      courseId: data.courseId,
      front: data.front,
      back: data.back,
      frontArabic: data.frontArabic || null,
      backArabic: data.backArabic || null,
      category: data.category,
      tags: data.tags || [],
      difficulty: data.difficulty || FlashCardDifficulty.MEDIUM,
      orderIndex,
    },
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
  });

  return flashCard;
}

/**
 * Create multiple flash cards in a batch
 */
export async function createFlashCardBatch(cards: CreateFlashCardData[]) {
  if (cards.length === 0) {
    return { count: 0, cards: [] };
  }

  // Validate all cards
  for (const card of cards) {
    if (!card.front || !card.back) {
      throw new Error('All cards must have front and back content');
    }
    if (!card.unitId || !card.courseId) {
      throw new Error('All cards must have unitId and courseId');
    }
  }

  // Create cards using transaction for atomicity
  const createdCards = await prisma.$transaction(
    cards.map((card, index) =>
      prisma.flashCard.create({
        data: {
          unitId: card.unitId,
          courseId: card.courseId,
          front: card.front,
          back: card.back,
          frontArabic: card.frontArabic || null,
          backArabic: card.backArabic || null,
          category: card.category,
          tags: card.tags || [],
          difficulty: card.difficulty || FlashCardDifficulty.MEDIUM,
          orderIndex: card.orderIndex !== undefined ? card.orderIndex : index + 1,
        },
      })
    )
  );

  return {
    count: createdCards.length,
    cards: createdCards,
  };
}

/**
 * Update a flash card
 */
export async function updateFlashCard(id: string, data: UpdateFlashCardData) {
  // Check if card exists
  const existing = await prisma.flashCard.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error('Flash card not found');
  }

  // Update the card
  const flashCard = await prisma.flashCard.update({
    where: { id },
    data: {
      ...(data.front !== undefined && { front: data.front }),
      ...(data.back !== undefined && { back: data.back }),
      ...(data.frontArabic !== undefined && { frontArabic: data.frontArabic || null }),
      ...(data.backArabic !== undefined && { backArabic: data.backArabic || null }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.tags !== undefined && { tags: data.tags }),
      ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
      ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
    },
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
  });

  return flashCard;
}

/**
 * Delete a flash card
 */
export async function deleteFlashCard(id: string) {
  // Check if card exists
  const existing = await prisma.flashCard.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error('Flash card not found');
  }

  // Delete the card (cascade will delete progress records)
  await prisma.flashCard.delete({
    where: { id },
  });

  return { success: true, id };
}

/**
 * Reorder flash cards in a unit
 */
export async function reorderFlashCards(unitId: string, cardIds: string[]) {
  // Verify all cards belong to the unit
  const cards = await prisma.flashCard.findMany({
    where: {
      id: { in: cardIds },
      unitId,
    },
  });

  if (cards.length !== cardIds.length) {
    throw new Error('Some cards do not belong to this unit');
  }

  // Update order in transaction
  const updates = cardIds.map((cardId, index) =>
    prisma.flashCard.update({
      where: { id: cardId },
      data: { orderIndex: index + 1 },
    })
  );

  await prisma.$transaction(updates);

  return { success: true, count: cardIds.length };
}

/**
 * Get flash card count by filters
 */
export async function getFlashCardCount(filters: FlashCardFilters = {}) {
  const { courseId, unitId, category, difficulty, tags } = filters;

  const where: Prisma.FlashCardWhereInput = {};

  if (courseId) where.courseId = courseId;
  if (unitId) where.unitId = unitId;
  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;
  if (tags && tags.length > 0) {
    where.tags = {
      hasSome: tags,
    };
  }

  return await prisma.flashCard.count({ where });
}

/**
 * Get all categories used in flash cards
 */
export async function getCategories(courseId?: string, unitId?: string) {
  const where: Prisma.FlashCardWhereInput = {};
  if (courseId) where.courseId = courseId;
  if (unitId) where.unitId = unitId;

  const cards = await prisma.flashCard.findMany({
    where,
    select: { category: true },
    distinct: ['category'],
  });

  return cards.map((c) => c.category).sort();
}

/**
 * Get all tags used in flash cards
 */
export async function getTags(courseId?: string, unitId?: string) {
  const where: Prisma.FlashCardWhereInput = {};
  if (courseId) where.courseId = courseId;
  if (unitId) where.unitId = unitId;

  const cards = await prisma.flashCard.findMany({
    where,
    select: { tags: true },
  });

  // Flatten and deduplicate tags
  const allTags = new Set<string>();
  cards.forEach((card) => {
    card.tags.forEach((tag) => allTags.add(tag));
  });

  return Array.from(allTags).sort();
}

export default {
  getFlashCards,
  getFlashCard,
  getFlashCardsByIds,
  createFlashCard,
  createFlashCardBatch,
  updateFlashCard,
  deleteFlashCard,
  reorderFlashCards,
  getFlashCardCount,
  getCategories,
  getTags,
};
