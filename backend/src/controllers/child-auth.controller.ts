import { Request, Response, NextFunction } from 'express';
import { ChildAuthService } from '../services/child-auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ChildAuthController {
  static async createCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const { username, password } = req.body;
      const result = await ChildAuthService.createCredentials(
        req.user!.familyId,
        memberId,
        { username, password }
      );

      res.status(201).json({
        success: true,
        message: 'Child login credentials created',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async childLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await ChildAuthService.childLogin({ username, password });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await ChildAuthService.getChildProfile(req.child!.memberId);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { avatarUrl } = req.body;
      const profile = await ChildAuthService.updateChildProfile(
        req.child!.memberId,
        { avatarUrl }
      );

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}
