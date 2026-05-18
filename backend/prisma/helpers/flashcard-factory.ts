/**
 * Flash Card Factory Helpers
 * 
 * Utility functions for creating flash cards in seed scripts and tests.
 */

import { PrismaClient, FlashCardDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateFlashCardOptions {
  unitId: string;
  courseId: string;
  front: string;
  back: string;
  frontArabic?: string;
  backArabic?: string;
  category: string;
  tags?: string[];
  difficulty?: FlashCardDifficulty;
  orderIndex: number;
}

export interface CreateFlashCardBatchOptions {
  unitId: string;
  courseId: string;
  cards: Omit<CreateFlashCardOptions, 'unitId' | 'courseId'>[];
}

/**
 * Create a single flash card
 */
export async function createFlashCard(options: CreateFlashCardOptions) {
  return await prisma.flashCard.create({
    data: {
      unitId: options.unitId,
      courseId: options.courseId,
      front: options.front,
      back: options.back,
      frontArabic: options.frontArabic || null,
      backArabic: options.backArabic || null,
      category: options.category,
      tags: options.tags || [],
      difficulty: options.difficulty || FlashCardDifficulty.MEDIUM,
      orderIndex: options.orderIndex,
    },
  });
}

/**
 * Create multiple flash cards for a unit in a batch
 */
export async function createFlashCardBatch(options: CreateFlashCardBatchOptions) {
  const cards = options.cards.map((card, index) => ({
    unitId: options.unitId,
    courseId: options.courseId,
    front: card.front,
    back: card.back,
    frontArabic: card.frontArabic || null,
    backArabic: card.backArabic || null,
    category: card.category,
    tags: card.tags || [],
    difficulty: card.difficulty || FlashCardDifficulty.MEDIUM,
    orderIndex: card.orderIndex !== undefined ? card.orderIndex : index + 1,
  }));

  return await prisma.flashCard.createMany({
    data: cards,
    skipDuplicates: true,
  });
}

/**
 * Create a flash card with automatic progress initialization for a member
 */
export async function createFlashCardWithProgress(
  cardOptions: CreateFlashCardOptions,
  memberId: string
) {
  const card = await createFlashCard(cardOptions);

  const progress = await prisma.flashCardProgress.create({
    data: {
      memberId,
      flashCardId: card.id,
      // Defaults are set in schema: easeFactor=2.5, interval=0, repetitions=0, status=NEW
    },
  });

  return { card, progress };
}

/**
 * Validate flash card content
 */
export function validateFlashCardContent(card: CreateFlashCardOptions): string[] {
  const errors: string[] = [];

  if (!card.front || card.front.trim().length === 0) {
    errors.push('Front content is required');
  }

  if (card.front && card.front.length > 500) {
    errors.push('Front content should be less than 500 characters');
  }

  if (!card.back || card.back.trim().length === 0) {
    errors.push('Back content is required');
  }

  if (card.back && card.back.length > 1000) {
    errors.push('Back content should be less than 1000 characters');
  }

  if (!card.category || card.category.trim().length === 0) {
    errors.push('Category is required');
  }

  const validCategories = [
    'vocabulary',
    'definition',
    'pattern',
    'example',
    'rule',
    'verse',
    'hadith',
    'dua',
  ];

  if (card.category && !validCategories.includes(card.category)) {
    errors.push(
      `Category must be one of: ${validCategories.join(', ')}. Got: ${card.category}`
    );
  }

  if (card.orderIndex < 0) {
    errors.push('Order index must be non-negative');
  }

  return errors;
}

/**
 * Get the next available order index for a unit
 */
export async function getNextOrderIndex(unitId: string): Promise<number> {
  const lastCard = await prisma.flashCard.findFirst({
    where: { unitId },
    orderBy: { orderIndex: 'desc' },
    select: { orderIndex: true },
  });

  return lastCard ? lastCard.orderIndex + 1 : 1;
}

/**
 * Reorder flash cards in a unit
 */
export async function reorderFlashCards(
  unitId: string,
  cardOrder: string[]
): Promise<void> {
  const updates = cardOrder.map((cardId, index) =>
    prisma.flashCard.update({
      where: { id: cardId },
      data: { orderIndex: index + 1 },
    })
  );

  await prisma.$transaction(updates);
}

/**
 * Delete all flash cards for a unit
 */
export async function deleteUnitFlashCards(unitId: string): Promise<number> {
  const result = await prisma.flashCard.deleteMany({
    where: { unitId },
  });

  return result.count;
}

/**
 * Helper to create common Sarf (Arabic morphology) flash card patterns
 */
export interface SarfFlashCardTemplate {
  term: string;
  termArabic: string;
  definition: string;
  example?: string;
  exampleArabic?: string;
}

export function createSarfDefinitionCard(
  template: SarfFlashCardTemplate,
  orderIndex: number
): Omit<CreateFlashCardOptions, 'unitId' | 'courseId'> {
  return {
    front: `What is ${template.term}?`,
    back: template.definition,
    frontArabic: template.termArabic,
    backArabic: template.termArabic,
    category: 'definition',
    tags: ['sarf', 'arabic', 'morphology'],
    difficulty: FlashCardDifficulty.MEDIUM,
    orderIndex,
  };
}

export function createSarfExampleCard(
  template: SarfFlashCardTemplate,
  orderIndex: number
): Omit<CreateFlashCardOptions, 'unitId' | 'courseId'> {
  return {
    front: `Give an example of ${template.term}`,
    back: template.example || '',
    frontArabic: `مثال ${template.termArabic}`,
    backArabic: template.exampleArabic || '',
    category: 'example',
    tags: ['sarf', 'arabic', 'morphology', 'examples'],
    difficulty: FlashCardDifficulty.EASY,
    orderIndex,
  };
}

export function createSarfPatternCard(
  pattern: string,
  patternArabic: string,
  meaning: string,
  orderIndex: number
): Omit<CreateFlashCardOptions, 'unitId' | 'courseId'> {
  return {
    front: `What does the pattern ${pattern} mean?`,
    back: meaning,
    frontArabic: patternArabic,
    backArabic: null,
    category: 'pattern',
    tags: ['sarf', 'arabic', 'patterns', 'morphology'],
    difficulty: FlashCardDifficulty.HARD,
    orderIndex,
  };
}

export default {
  createFlashCard,
  createFlashCardBatch,
  createFlashCardWithProgress,
  validateFlashCardContent,
  getNextOrderIndex,
  reorderFlashCards,
  deleteUnitFlashCards,
  createSarfDefinitionCard,
  createSarfExampleCard,
  createSarfPatternCard,
};
