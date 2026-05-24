import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/course.service', () => ({
  CourseService: {
    getMemberEnrollments: vi.fn(),
    updateProgress: vi.fn(),
  },
}));

import { CourseController } from '../controllers/course.controller';
import { CourseService } from '../services/course.service';

describe('CourseController', () => {
  const res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMemberEnrollments', () => {
    it('uses the child family/member identity for child sessions', async () => {
      vi.mocked(CourseService.getMemberEnrollments).mockResolvedValue([{ id: 'enrollment-1' }] as any);

      const req = {
        params: { memberId: 'member-1' },
        child: {
          memberId: 'member-1',
          familyId: 'family-1',
          ageCategory: 'CHILD',
          role: 'CHILD',
        },
      } as any;

      await CourseController.getMemberEnrollments(req, res, next);

      expect(CourseService.getMemberEnrollments).toHaveBeenCalledWith('family-1', 'member-1');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [{ id: 'enrollment-1' }],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('prefers the active learner over a stale requested member id', async () => {
      vi.mocked(CourseService.getMemberEnrollments).mockResolvedValue([{ id: 'enrollment-1' }] as any);

      const req = {
        params: { memberId: 'parent-user-id' },
        user: {
          id: 'parent-user-id',
          familyId: 'family-1',
          email: 'parent@example.com',
          role: 'PARENT',
        },
        activeMemberId: 'member-1',
      } as any;

      await CourseController.getMemberEnrollments(req, res, next);

      expect(CourseService.getMemberEnrollments).toHaveBeenCalledWith('family-1', 'member-1');
    });

    it('blocks child sessions from requesting a sibling enrollment list', async () => {
      const req = {
        params: { memberId: 'member-2' },
        child: {
          memberId: 'member-1',
          familyId: 'family-1',
          ageCategory: 'CHILD',
          role: 'CHILD',
        },
      } as any;

      await CourseController.getMemberEnrollments(req, res, next);

      expect(CourseService.getMemberEnrollments).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0]).toMatchObject({
        message: 'Students can only access their own enrollments',
      });
    });
  });

  describe('updateProgress', () => {
    it('uses the active learner identity instead of the submitted user id', async () => {
      vi.mocked(CourseService.updateProgress).mockResolvedValue({ id: 'progress-1' } as any);

      const req = {
        body: {
          memberId: 'parent-user-id',
          unitId: 'unit-1',
          readingCompleted: true,
        },
        user: {
          id: 'parent-user-id',
          familyId: 'family-1',
          email: 'parent@example.com',
          role: 'PARENT',
        },
        activeMemberId: 'member-1',
      } as any;

      await CourseController.updateProgress(req, res, next);

      expect(CourseService.updateProgress).toHaveBeenCalledWith('family-1', 'member-1', 'unit-1', {
        memberId: 'parent-user-id',
        readingCompleted: true,
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'progress-1' },
      });
    });
  });
});
