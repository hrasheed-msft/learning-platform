import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { SRSService } from '../services/srs.service';

export class SRSController {
  static async getDueItems(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const items = await SRSService.getDueItems(req.user!.familyId, memberId);
      
      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItems(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const items = await SRSService.getItems(req.user!.familyId, memberId);
      
      res.json({
        success: true,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const itemData = req.body;
      const item = await SRSService.addItem(req.user!.familyId, itemData);
      
      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { itemId, memberId, rating } = req.body;
      const result = await SRSService.submitReview(req.user!.familyId, memberId, itemId, rating);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReviewHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const { limit } = req.query;
      const history = await SRSService.getReviewHistory(
        req.user!.familyId, 
        memberId, 
        limit ? parseInt(limit as string) : undefined
      );
      
      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const stats = await SRSService.getStats(req.user!.familyId, memberId);
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
