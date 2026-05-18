import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

export class UserController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getProfile(req.user!.id);
      
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updates = req.body;
      const user = await UserService.updateProfile(req.user!.id, updates);
      
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      await UserService.changePassword(req.user!.id, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await UserService.getSettings(req.user!.id);
      
      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updates = req.body;
      const settings = await UserService.updateSettings(req.user!.id, updates);
      
      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAchievements(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const achievements = await UserService.getAchievements(req.user!.id);
      
      res.json({
        success: true,
        data: achievements,
      });
    } catch (error) {
      next(error);
    }
  }
}
