import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FlashCardDifficulty } from '@prisma/client';
import * as flashCardService from '../../services/flashcard/flashcard.service';
import type { CreateFlashCardData, UpdateFlashCardData, FlashCardFilters } from '../../services/flashcard/flashcard.service';

// Mock Prisma Client - must be defined inside the factory
vi.mock('../../config/database', () => {
  const mockPrisma = {
    flashCard: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  return {
    default: mockPrisma,
  };
});

// Import prisma after mocking to get the mock instance
import prisma from '../../config/database';
const mockPrisma = prisma as any;

describe('FlashCard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createFlashCard', () => {
    it('should create flash card with valid data', async () => {
      const createData: CreateFlashCardData = {
        front: 'What is فَعَلَ?',
        back: 'He did/acted',
        frontArabic: 'ما هو فَعَلَ؟',
        backArabic: 'فَعَلَ',
        category: 'vocabulary',
        tags: ['verb', 'past-tense'],
        difficulty: FlashCardDifficulty.MEDIUM,
        unitId: 'unit-1',
        courseId: 'course-1',
        orderIndex: 0,
      };

      const mockCreated = {
        id: 'flashcard-1',
        ...createData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.flashCard.create.mockResolvedValue(mockCreated);

      const result = await flashCardService.createFlashCard(createData);

      expect(result).toEqual(mockCreated);
      expect(mockPrisma.flashCard.create).toHaveBeenCalledWith({
        data: createData,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should auto-assign orderIndex if not provided', async () => {
      const createData: CreateFlashCardData = {
        front: 'Question',
        back: 'Answer',
        category: 'vocabulary',
        tags: [],
        difficulty: FlashCardDifficulty.EASY,
        unitId: 'unit-1',
        courseId: 'course-1',
      };

      mockPrisma.flashCard.findFirst.mockResolvedValue({
        id: 'last-card',
        orderIndex: 4,
      } as any);
      
      mockPrisma.flashCard.create.mockResolvedValue({
        id: 'flashcard-1',
        ...createData,
        orderIndex: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      await flashCardService.createFlashCard(createData);

      expect(mockPrisma.flashCard.findFirst).toHaveBeenCalledWith({
        where: { unitId: 'unit-1' },
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });
      expect(mockPrisma.flashCard.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createData,
          orderIndex: 5,
        }),
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should validate required fields', async () => {
      const invalidData: any = {
        front: 'Question',
        // missing back
        category: 'vocabulary',
        unitId: 'unit-1',
        courseId: 'course-1',
      };

      await expect(
        flashCardService.createFlashCard(invalidData)
      ).rejects.toThrow('Front and back content are required');
    });

    it('should handle duplicate orderIndex in same unit', async () => {
      const createData: CreateFlashCardData = {
        front: 'Question',
        back: 'Answer',
        category: 'vocabulary',
        tags: [],
        difficulty: FlashCardDifficulty.MEDIUM,
        unitId: 'unit-1',
        courseId: 'course-1',
        orderIndex: 0,
      };

      mockPrisma.flashCard.create.mockRejectedValueOnce(
        new Error('Unique constraint violation')
      );

      await expect(
        flashCardService.createFlashCard(createData)
      ).rejects.toThrow('Unique constraint violation');
    });
  });

  describe('getFlashCard', () => {
    it('should return card by ID', async () => {
      const mockCard = {
        id: 'flashcard-1',
        front: 'Question',
        back: 'Answer',
        frontArabic: null,
        backArabic: null,
        category: 'vocabulary',
        tags: ['test'],
        difficulty: FlashCardDifficulty.MEDIUM,
        orderIndex: 0,
        unitId: 'unit-1',
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        unit: {
          id: 'unit-1',
          title: 'Unit 1',
        },
        course: {
          id: 'course-1',
          title: 'Course 1',
        },
      };

      mockPrisma.flashCard.findUnique.mockResolvedValue(mockCard);

      const result = await flashCardService.getFlashCard('flashcard-1');

      expect(result).toEqual(mockCard);
      expect(mockPrisma.flashCard.findUnique).toHaveBeenCalledWith({
        where: { id: 'flashcard-1' },
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should throw error for non-existent ID', async () => {
      mockPrisma.flashCard.findUnique.mockResolvedValue(null);

      await expect(
        flashCardService.getFlashCard('non-existent')
      ).rejects.toThrow('Flash card not found');
    });
  });

  describe('getFlashCards', () => {
    const mockCards = [
      {
        id: 'flashcard-1',
        front: 'Q1',
        back: 'A1',
        category: 'vocabulary',
        tags: ['verb'],
        difficulty: FlashCardDifficulty.EASY,
        orderIndex: 0,
        unitId: 'unit-1',
        courseId: 'course-1',
      },
      {
        id: 'flashcard-2',
        front: 'Q2',
        back: 'A2',
        category: 'definition',
        tags: ['noun'],
        difficulty: FlashCardDifficulty.MEDIUM,
        orderIndex: 1,
        unitId: 'unit-1',
        courseId: 'course-1',
      },
    ];

    it('should return all cards without filters', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue(mockCards);
      mockPrisma.flashCard.count.mockResolvedValue(2);

      const result = await flashCardService.getFlashCards({});

      expect(result.flashCards).toEqual(mockCards);
      expect(result.total).toBe(2);
      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 50,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should filter by courseId', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue(mockCards);
      mockPrisma.flashCard.count.mockResolvedValue(2);

      await flashCardService.getFlashCards({ courseId: 'course-1' });

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: { courseId: 'course-1' },
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 50,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should filter by unitId', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue(mockCards);
      mockPrisma.flashCard.count.mockResolvedValue(2);

      await flashCardService.getFlashCards({ unitId: 'unit-1' });

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: { unitId: 'unit-1' },
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 50,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should filter by category', async () => {
      const filtered = [mockCards[0]];
      mockPrisma.flashCard.findMany.mockResolvedValue(filtered);
      mockPrisma.flashCard.count.mockResolvedValue(1);

      await flashCardService.getFlashCards({ category: 'vocabulary' });

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: { category: 'vocabulary' },
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 50,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should filter by difficulty', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue([mockCards[0]]);
      mockPrisma.flashCard.count.mockResolvedValue(1);

      await flashCardService.getFlashCards({
        difficulty: FlashCardDifficulty.EASY,
      });

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: { difficulty: FlashCardDifficulty.EASY },
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 50,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should filter by tags', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue([mockCards[0]]);
      mockPrisma.flashCard.count.mockResolvedValue(1);

      await flashCardService.getFlashCards({ tags: ['verb'] });

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: { tags: { hasSome: ['verb'] } },
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 50,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should combine multiple filters', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue([mockCards[0]]);
      mockPrisma.flashCard.count.mockResolvedValue(1);

      const filters: FlashCardFilters = {
        unitId: 'unit-1',
        category: 'vocabulary',
        difficulty: FlashCardDifficulty.EASY,
        tags: ['verb'],
      };

      await flashCardService.getFlashCards(filters);

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: {
          unitId: 'unit-1',
          category: 'vocabulary',
          difficulty: FlashCardDifficulty.EASY,
          tags: { hasSome: ['verb'] },
        },
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 50,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should paginate results', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue([mockCards[0]]);
      mockPrisma.flashCard.count.mockResolvedValue(2);

      await flashCardService.getFlashCards({ offset: 0, limit: 1 });

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { orderIndex: 'asc' },
        skip: 0,
        take: 1,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should handle offset pagination correctly', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue([mockCards[1]]);
      mockPrisma.flashCard.count.mockResolvedValue(2);

      await flashCardService.getFlashCards({ offset: 1, limit: 1 });

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { orderIndex: 'asc' },
        skip: 1,
        take: 1,
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });
  });

  describe('updateFlashCard', () => {
    it('should update card fields', async () => {
      const updateData: UpdateFlashCardData = {
        front: 'Updated Question',
        back: 'Updated Answer',
        difficulty: FlashCardDifficulty.HARD,
      };

      const mockUpdated = {
        id: 'flashcard-1',
        front: 'Updated Question',
        back: 'Updated Answer',
        frontArabic: null,
        backArabic: null,
        category: 'vocabulary',
        tags: ['test'],
        difficulty: FlashCardDifficulty.HARD,
        orderIndex: 0,
        unitId: 'unit-1',
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        unit: { id: 'unit-1', title: 'Unit 1' },
        course: { id: 'course-1', title: 'Course 1' },
      };

      mockPrisma.flashCard.findUnique.mockResolvedValue(mockUpdated);
      mockPrisma.flashCard.update.mockResolvedValue(mockUpdated);

      const result = await flashCardService.updateFlashCard(
        'flashcard-1',
        updateData
      );

      expect(result).toEqual(mockUpdated);
      expect(mockPrisma.flashCard.update).toHaveBeenCalledWith({
        where: { id: 'flashcard-1' },
        data: expect.objectContaining({
          front: 'Updated Question',
          back: 'Updated Answer',
          difficulty: FlashCardDifficulty.HARD,
        }),
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });

    it('should handle non-existent ID', async () => {
      mockPrisma.flashCard.findUnique.mockResolvedValue(null);

      await expect(
        flashCardService.updateFlashCard('non-existent', { front: 'Test' })
      ).rejects.toThrow('Flash card not found');
    });

    it('should allow partial updates', async () => {
      const updateData: UpdateFlashCardData = {
        tags: ['updated-tag'],
      };

      const existing = {
        id: 'flashcard-1',
        front: 'Original',
        back: 'Original',
        frontArabic: null,
        backArabic: null,
        category: 'vocabulary',
        tags: ['old-tag'],
        difficulty: FlashCardDifficulty.MEDIUM,
        orderIndex: 0,
        unitId: 'unit-1',
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        unit: { id: 'unit-1', title: 'Unit 1' },
        course: { id: 'course-1', title: 'Course 1' },
      };

      mockPrisma.flashCard.findUnique.mockResolvedValue(existing);
      mockPrisma.flashCard.update.mockResolvedValue({
        ...existing,
        tags: ['updated-tag'],
      });

      await flashCardService.updateFlashCard('flashcard-1', updateData);

      expect(mockPrisma.flashCard.update).toHaveBeenCalledWith({
        where: { id: 'flashcard-1' },
        data: expect.objectContaining({
          tags: ['updated-tag'],
        }),
        include: expect.objectContaining({
          unit: expect.any(Object),
          course: expect.any(Object),
        }),
      });
    });
  });

  describe('deleteFlashCard', () => {
    it('should delete card', async () => {
      const existing = { id: 'flashcard-1' };
      mockPrisma.flashCard.findUnique.mockResolvedValue(existing as any);
      mockPrisma.flashCard.delete.mockResolvedValue(existing as any);

      await flashCardService.deleteFlashCard('flashcard-1');

      expect(mockPrisma.flashCard.delete).toHaveBeenCalledWith({
        where: { id: 'flashcard-1' },
      });
    });

    it('should handle non-existent ID', async () => {
      mockPrisma.flashCard.findUnique.mockResolvedValue(null);

      await expect(
        flashCardService.deleteFlashCard('non-existent')
      ).rejects.toThrow('Flash card not found');
    });
  });

  describe('createFlashCardBatch', () => {
    it('should create multiple cards', async () => {
      const cardsData: CreateFlashCardData[] = [
        {
          front: 'Q1',
          back: 'A1',
          category: 'vocabulary',
          tags: [],
          difficulty: FlashCardDifficulty.EASY,
          unitId: 'unit-1',
          courseId: 'course-1',
          orderIndex: 0,
        },
        {
          front: 'Q2',
          back: 'A2',
          category: 'vocabulary',
          tags: [],
          difficulty: FlashCardDifficulty.MEDIUM,
          unitId: 'unit-1',
          courseId: 'course-1',
          orderIndex: 1,
        },
      ];

      const mockCreated = cardsData.map((data, idx) => ({
        id: `flashcard-${idx + 1}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrisma.$transaction.mockResolvedValue(mockCreated);

      const result = await flashCardService.createFlashCardBatch(cardsData);

      expect(result.count).toBe(2);
      expect(result.cards).toHaveLength(2);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should auto-assign orderIndexes if not provided', async () => {
      const cardsData: CreateFlashCardData[] = [
        {
          front: 'Q1',
          back: 'A1',
          category: 'vocabulary',
          tags: [],
          difficulty: FlashCardDifficulty.EASY,
          unitId: 'unit-1',
          courseId: 'course-1',
        },
        {
          front: 'Q2',
          back: 'A2',
          category: 'vocabulary',
          tags: [],
          difficulty: FlashCardDifficulty.MEDIUM,
          unitId: 'unit-1',
          courseId: 'course-1',
        },
      ];

      mockPrisma.flashCard.findFirst.mockResolvedValue({ orderIndex: 4 });
      mockPrisma.$transaction.mockResolvedValue([]);

      await flashCardService.createFlashCardBatch(cardsData);

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should handle empty array', async () => {
      const result = await flashCardService.createFlashCardBatch([]);

      expect(result).toEqual({ count: 0, cards: [] });
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('reorderFlashCards', () => {
    it('should reorder cards in unit', async () => {
      const cardIds = ['flashcard-1', 'flashcard-2'];

      mockPrisma.flashCard.findMany.mockResolvedValue([
        { id: 'flashcard-1', unitId: 'unit-1' },
        { id: 'flashcard-2', unitId: 'unit-1' },
      ]);
      mockPrisma.$transaction.mockResolvedValue([]);

      await flashCardService.reorderFlashCards('unit-1', cardIds);

      expect(mockPrisma.flashCard.findMany).toHaveBeenCalled();
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('should handle empty reorder array', async () => {
      mockPrisma.flashCard.findMany.mockResolvedValue([]);

      await flashCardService.reorderFlashCards('unit-1', []);

      // Implementation calls transaction even with empty array
      expect(mockPrisma.$transaction).toHaveBeenCalledWith([]);
    });
  });

  describe('Utility Functions', () => {
    it('should get distinct categories from unit', async () => {
      // Mock should return distinct values as Prisma would
      const mockCards = [
        { category: 'vocabulary' },
        { category: 'definition' },
      ];

      mockPrisma.flashCard.findMany.mockResolvedValue(mockCards);

      // Function signature is getCategories(courseId?, unitId?)
      const result = await flashCardService.getCategories(undefined, 'unit-1');

      expect(result).toEqual(expect.arrayContaining(['vocabulary', 'definition']));
      expect(result).toHaveLength(2);
      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: { unitId: 'unit-1' },
        select: { category: true },
        distinct: ['category'],
      });
    });

    it('should get all categories without unitId', async () => {
      const mockCards = [
        { category: 'vocabulary' },
        { category: 'definition' },
      ];

      mockPrisma.flashCard.findMany.mockResolvedValue(mockCards);

      const result = await flashCardService.getCategories();

      expect(result).toEqual(expect.arrayContaining(['vocabulary', 'definition']));
      expect(result).toHaveLength(2);
      expect(mockPrisma.flashCard.findMany).toHaveBeenCalledWith({
        where: {},
        select: { category: true },
        distinct: ['category'],
      });
    });

    it('should get distinct tags from unit', async () => {
      const mockCards = [
        { tags: ['verb', 'past-tense'] },
        { tags: ['noun'] },
        { tags: ['verb', 'present-tense'] },
      ];

      mockPrisma.flashCard.findMany.mockResolvedValue(mockCards);

      const result = await flashCardService.getTags('unit-1');

      expect(result).toContain('verb');
      expect(result).toContain('past-tense');
      expect(result).toContain('noun');
      expect(result).toContain('present-tense');
    });

    it('should count cards with filters', async () => {
      mockPrisma.flashCard.count.mockResolvedValue(15);

      const result = await flashCardService.getFlashCardCount({
        unitId: 'unit-1',
        difficulty: FlashCardDifficulty.MEDIUM,
      });

      expect(result).toBe(15);
      expect(mockPrisma.flashCard.count).toHaveBeenCalledWith({
        where: {
          unitId: 'unit-1',
          difficulty: FlashCardDifficulty.MEDIUM,
        },
      });
    });

    it('should count all cards without filters', async () => {
      mockPrisma.flashCard.count.mockResolvedValue(100);

      const result = await flashCardService.getFlashCardCount({});

      expect(result).toBe(100);
      expect(mockPrisma.flashCard.count).toHaveBeenCalledWith({
        where: {},
      });
    });
  });
});
