import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ActiveMemberRequest } from '../middleware/requireActiveMember.middleware';
import { BadRequestError, ForbiddenError } from '../middleware/error.middleware';
import { AssessmentService } from '../services/assessment.service';

function resolveFamilyId(req: AuthenticatedRequest): string {
  if (req.child) {
    return req.child.familyId;
  }

  if (req.user) {
    return req.user.familyId;
  }

  throw new BadRequestError('Unable to determine family for this request');
}

function resolveAccessibleMemberId(
  req: ActiveMemberRequest,
  requestedMemberId?: string,
): string {
  if (req.child && requestedMemberId && requestedMemberId !== req.child.memberId) {
    throw new ForbiddenError('Students can only access their own quiz results');
  }

  const memberId = req.child?.memberId ?? req.activeMemberId ?? requestedMemberId;

  if (!memberId) {
    throw new BadRequestError('Member ID is required');
  }

  return memberId;
}

export class AssessmentController {
  static async getQuestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId } = req.params;
      const questions = await AssessmentService.getQuestions(unitId);
      
      res.json({
        success: true,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitQuiz(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId, answers, timeSpent } = req.body;
      const memberId = resolveAccessibleMemberId(req, req.body.memberId);
      const familyId = resolveFamilyId(req);
      const result = await AssessmentService.submitQuiz({
        familyId,
        memberId,
        unitId,
        answers,
        timeSpent,
      });
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMemberResults(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveAccessibleMemberId(req, req.params.memberId);
      const familyId = resolveFamilyId(req);
      const results = await AssessmentService.getMemberResults(familyId, memberId);
      
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getQuizResult(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resultId } = req.params;
      const familyId = resolveFamilyId(req);
      const result = await AssessmentService.getQuizResult(familyId, resultId);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async generateQuestions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId, count, types } = req.body;
      const questions = await AssessmentService.generateQuestions({ unitId, count, types });
      
      res.json({
        success: true,
        data: questions,
      });
    } catch (error) {
      next(error);
    }
  }
}
