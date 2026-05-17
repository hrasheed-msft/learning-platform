import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class DashboardController {
  static async getChildren(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const children = await DashboardService.getChildrenWithStats(req.user!.familyId);

      res.json({
        success: true,
        data: children,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getChildStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const stats = await DashboardService.getChildDetailedStats(req.user!.familyId, memberId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getChildActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const activity = await DashboardService.getChildActivity(
        req.user!.familyId,
        memberId,
        page,
        limit
      );

      res.json({
        success: true,
        data: activity,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFamilySummary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await DashboardService.getFamilySummary(req.user!.familyId);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
}
