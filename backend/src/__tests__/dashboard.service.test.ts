import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../config/database', () => ({
  default: {
    familyMember: {
      findFirst: vi.fn(),
    },
    quizResult: {
      findMany: vi.fn(),
    },
    courseEnrollment: {
      findMany: vi.fn(),
    },
    flashCardProgress: {
      groupBy: vi.fn(),
    },
    activityEvent: {
      findMany: vi.fn(),
    },
  },
}));

import prisma from '../config/database';
import { DashboardService } from '../services/dashboard.service';

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.familyMember.findFirst).mockResolvedValue({
      id: 'member-1',
      familyId: 'family-1',
      name: 'Fatima',
      ageCategory: '10-12',
      currentStreak: 4,
      longestStreak: 8,
    } as any);
    vi.mocked(prisma.quizResult.findMany).mockResolvedValue([]);
    vi.mocked(prisma.flashCardProgress.groupBy).mockResolvedValue([]);
    vi.mocked(prisma.activityEvent.findMany).mockResolvedValue([]);
  });

  it('recalculates dashboard course completion from full unit progress', async () => {
    vi.mocked(prisma.courseEnrollment.findMany).mockResolvedValue([
      {
        course: {
          id: 'course-1',
          title: 'Arabic Basics',
          category: 'ARABIC',
          _count: { units: 2 },
          units: [
            { id: 'unit-1', title: 'Unit 1', orderIndex: 0 },
            { id: 'unit-2', title: 'Unit 2', orderIndex: 1 },
          ],
        },
        status: 'COMPLETED',
        progress: 100,
        unitProgress: [
          {
            unitId: 'unit-1',
            videoCompleted: true,
            readingCompleted: true,
            quizCompleted: true,
            completedAt: new Date('2026-07-01T00:00:00.000Z'),
          },
          {
            unitId: 'unit-2',
            videoCompleted: true,
            readingCompleted: false,
            quizCompleted: false,
            completedAt: null,
          },
        ],
      },
    ] as any);

    const result = await DashboardService.getChildDetailedStats('family-1', 'member-1');

    expect(result.coursesCompleted).toBe(0);
    expect(result.courseProgress[0]).toEqual(
      expect.objectContaining({
        courseId: 'course-1',
        progress: 50,
        status: 'ACTIVE',
        totalUnits: 2,
        completedUnits: 1,
      })
    );
    expect(result.courseProgress[0].units).toEqual([
      expect.objectContaining({
        unitId: 'unit-1',
        unitTitle: 'Unit 1',
        orderIndex: 0,
        completed: true,
        status: 'completed',
      }),
      expect.objectContaining({
        unitId: 'unit-2',
        unitTitle: 'Unit 2',
        orderIndex: 1,
        completed: false,
        status: 'in_progress',
      }),
    ]);
  });
});
