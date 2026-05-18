import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma client
vi.mock('../config/database', () => ({
  default: {
    memorizationItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    reviewLog: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    familyMember: {
      findFirst: vi.fn(),
    },
  },
}));

// Import after mocking
import { SRSService } from '../services/srs.service';
import prisma from '../config/database';

const mockMember = {
  id: 'member-1',
  familyId: 'family-1',
  name: 'Ahmed',
  role: 'CHILD',
};

const mockItems = [
  {
    id: 'item-1',
    memberId: 'member-1',
    front: 'What is the Arabic letter أ called?',
    back: 'Alif (أَلِف)',
    type: 'TERM',
    interval: 1,
    easeFactor: 2.5,
    repetitions: 1,
    nextReviewDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'item-2',
    memberId: 'member-1',
    front: 'How many pillars of Islam are there?',
    back: 'Five (5)',
    type: 'TERM',
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('SRSService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: member exists
    vi.mocked(prisma.familyMember.findFirst).mockResolvedValue(mockMember as any);
  });

  describe('getDueItems', () => {
    it('should return items due for review', async () => {
      vi.mocked(prisma.memorizationItem.findMany).mockResolvedValue(mockItems as any);

      const result = await SRSService.getDueItems('family-1', 'member-1');

      expect(result.dueCount).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(prisma.memorizationItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            memberId: 'member-1',
          }),
        })
      );
    });

    it('should return empty array when no items due', async () => {
      vi.mocked(prisma.memorizationItem.findMany).mockResolvedValue([]);

      const result = await SRSService.getDueItems('family-1', 'member-1');

      expect(result.dueCount).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it('should reject if member does not belong to family', async () => {
      vi.mocked(prisma.familyMember.findFirst).mockResolvedValue(null);

      await expect(
        SRSService.getDueItems('family-1', 'member-1')
      ).rejects.toThrow('Member not found or does not belong to your family');
    });
  });

  describe('submitReview', () => {
    it('should update item with rating "Good" (3) and advance interval', async () => {
      vi.mocked(prisma.memorizationItem.findFirst).mockResolvedValue(mockItems[0] as any);
      vi.mocked(prisma.memorizationItem.update).mockResolvedValue({
        ...mockItems[0],
        interval: 3,
        repetitions: 2,
        nextReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      } as any);
      vi.mocked(prisma.reviewLog.create).mockResolvedValue({} as any);

      const result = await SRSService.submitReview('family-1', 'member-1', 'item-1', 3);

      expect(result.nextInterval).toBeGreaterThanOrEqual(1);
      expect(prisma.memorizationItem.update).toHaveBeenCalled();
      expect(prisma.reviewLog.create).toHaveBeenCalled();
    });

    it('should record review in history with rating', async () => {
      vi.mocked(prisma.memorizationItem.findFirst).mockResolvedValue(mockItems[0] as any);
      vi.mocked(prisma.memorizationItem.update).mockResolvedValue(mockItems[0] as any);
      vi.mocked(prisma.reviewLog.create).mockResolvedValue({} as any);

      await SRSService.submitReview('family-1', 'member-1', 'item-1', 3);

      expect(prisma.reviewLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            memorizationItemId: 'item-1',
            rating: 3,
          }),
        })
      );
    });

    it('should reject if item not found', async () => {
      vi.mocked(prisma.memorizationItem.findFirst).mockResolvedValue(null);

      await expect(
        SRSService.submitReview('family-1', 'member-1', 'non-existent', 3)
      ).rejects.toThrow('Memorization item not found');
    });
  });

  describe('addItem', () => {
    it('should create new SRS memorization item', async () => {
      vi.mocked(prisma.memorizationItem.create).mockResolvedValue({
        id: 'new-item',
        memberId: 'member-1',
        front: 'New question',
        back: 'New answer',
        type: 'TERM',
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date(),
      } as any);

      const result = await SRSService.addItem('family-1', {
        memberId: 'member-1',
        front: 'New question',
        back: 'New answer',
        type: 'TERM',
      });

      expect(result.id).toBe('new-item');
      expect(prisma.memorizationItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            memberId: 'member-1',
            front: 'New question',
            back: 'New answer',
            type: 'TERM',
            interval: 0,
            easeFactor: 2.5,
          }),
        })
      );
    });
  });

  describe('getStats', () => {
    it('should return SRS statistics for member', async () => {
      vi.mocked(prisma.memorizationItem.count)
        .mockResolvedValueOnce(10) // totalItems
        .mockResolvedValueOnce(3);  // dueItems
      vi.mocked(prisma.reviewLog.count).mockResolvedValue(5);
      vi.mocked(prisma.memorizationItem.groupBy).mockResolvedValue([
        { type: 'TERM', _count: 5 },
        { type: 'AYAH', _count: 3 },
        { type: 'DUA', _count: 2 },
      ] as any);
      vi.mocked(prisma.reviewLog.findMany).mockResolvedValue([
        { rating: 3 },
        { rating: 4 },
        { rating: 3 },
        { rating: 2 },
      ] as any);

      const result = await SRSService.getStats('family-1', 'member-1');

      expect(result.totalItems).toBe(10);
      expect(result.dueItems).toBe(3);
      expect(result.reviewsToday).toBe(5);
      expect(result.retentionRate).toBe(75); // 3/4 = 75%
      expect(result.itemsByType).toHaveProperty('TERM');
    });

    it('should return 0 retention rate when no reviews', async () => {
      vi.mocked(prisma.memorizationItem.count)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      vi.mocked(prisma.reviewLog.count).mockResolvedValue(0);
      vi.mocked(prisma.memorizationItem.groupBy).mockResolvedValue([]);
      vi.mocked(prisma.reviewLog.findMany).mockResolvedValue([]);

      const result = await SRSService.getStats('family-1', 'member-1');

      expect(result.retentionRate).toBe(0);
    });
  });
});
