import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { FamilyService } from '../services/family.service';

export class FamilyController {
  static async getFamily(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const family = await FamilyService.getFamily(req.user!.familyId);
      
      res.json({
        success: true,
        data: family,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMembers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const members = await FamilyService.getMembers(req.user!.familyId);
      
      res.json({
        success: true,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const member = await FamilyService.getMember(req.user!.familyId, memberId);
      
      res.json({
        success: true,
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, age, pin, avatarUrl } = req.body;
      const member = await FamilyService.addMember(req.user!.familyId, { name, age, pin, avatarUrl });
      
      res.status(201).json({
        success: true,
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const updates = req.body;
      const member = await FamilyService.updateMember(req.user!.familyId, memberId, updates);
      
      res.json({
        success: true,
        data: member,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      await FamilyService.deleteMember(req.user!.familyId, memberId);
      
      res.json({
        success: true,
        message: 'Member deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async switchMember(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const { pin } = req.body;
      const result = await FamilyService.switchMember(req.user!.familyId, memberId, pin);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMemberProgress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const progress = await FamilyService.getMemberProgress(req.user!.familyId, memberId);
      
      res.json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }
}
