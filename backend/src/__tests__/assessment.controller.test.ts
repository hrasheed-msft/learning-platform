import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/assessment.service', () => ({
  AssessmentService: {
    submitQuiz: vi.fn(),
    getMemberResults: vi.fn(),
  },
}));

import { AssessmentController } from '../controllers/assessment.controller';
import { AssessmentService } from '../services/assessment.service';

describe('AssessmentController', () => {
  const res = {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitQuiz', () => {
    it('uses the active learner identity for parent sessions', async () => {
      vi.mocked(AssessmentService.submitQuiz).mockResolvedValue({ id: 'result-1', score: 100 } as any);

      const req = {
        body: {
          memberId: 'parent-user-id',
          unitId: 'unit-1',
          answers: [{ questionId: 'question-1', answer: 'A' }],
          timeSpent: 45,
        },
        user: {
          id: 'parent-user-id',
          familyId: 'family-1',
          email: 'parent@example.com',
          role: 'PARENT',
        },
        activeMemberId: 'member-1',
      } as any;

      await AssessmentController.submitQuiz(req, res, next);

      expect(AssessmentService.submitQuiz).toHaveBeenCalledWith({
        familyId: 'family-1',
        memberId: 'member-1',
        unitId: 'unit-1',
        answers: [{ questionId: 'question-1', answer: 'A' }],
        timeSpent: 45,
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 'result-1', score: 100 },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('uses the child identity without requiring memberId in the request body', async () => {
      vi.mocked(AssessmentService.submitQuiz).mockResolvedValue({ id: 'result-2', score: 80 } as any);

      const req = {
        body: {
          unitId: 'unit-2',
          answers: [{ questionId: 'question-2', answer: 'B' }],
        },
        child: {
          memberId: 'child-member-1',
          familyId: 'family-1',
          ageCategory: 'CHILD',
          role: 'CHILD',
        },
        activeMemberId: 'child-member-1',
      } as any;

      await AssessmentController.submitQuiz(req, res, next);

      expect(AssessmentService.submitQuiz).toHaveBeenCalledWith({
        familyId: 'family-1',
        memberId: 'child-member-1',
        unitId: 'unit-2',
        answers: [{ questionId: 'question-2', answer: 'B' }],
        timeSpent: undefined,
      });
    });
  });

  describe('getMemberResults', () => {
    it('prevents a child from requesting another learner\'s quiz results', async () => {
      const req = {
        params: { memberId: 'sibling-member' },
        child: {
          memberId: 'child-member-1',
          familyId: 'family-1',
          ageCategory: 'CHILD',
          role: 'CHILD',
        },
        activeMemberId: 'child-member-1',
      } as any;

      await AssessmentController.getMemberResults(req, res, next);

      expect(AssessmentService.getMemberResults).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next.mock.calls[0][0]).toMatchObject({
        message: 'Students can only access their own quiz results',
      });
    });
  });
});
