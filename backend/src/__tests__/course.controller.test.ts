import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/course.service', () => ({
  CourseService: {
    getMemberEnrollments: vi.fn(),
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
});
