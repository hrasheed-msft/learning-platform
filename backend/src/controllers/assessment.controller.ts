import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { AssessmentService } from '../services/assessment.service';

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

  static async submitQuiz(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId, memberId, answers, timeSpent } = req.body;
      const result = await AssessmentService.submitQuiz({
        familyId: req.user!.familyId,
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

  static async getMemberResults(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const results = await AssessmentService.getMemberResults(req.user!.familyId, memberId);
      
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
      const result = await AssessmentService.getQuizResult(req.user!.familyId, resultId);
      
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
