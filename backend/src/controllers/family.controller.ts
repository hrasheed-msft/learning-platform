import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { FamilyService } from '../services/family.service';
import prisma from '../config/database';

export class FamilyController {
  /**
   * GET /api/v1/family/learners
   * Returns all available learner profiles for the current user's family.
   */
  static async getLearners(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const familyId = req.user!.familyId;
      const members = await prisma.familyMember.findMany({
        where: { familyId },
        orderBy: [{ isAccountOwner: 'desc' }, { createdAt: 'asc' }],
      });

      res.json({ success: true, data: members });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/family/self-enroll
   * Creates a FamilyMember record for the logged-in parent (account owner).
   * Idempotent: returns existing record if already created.
   */
  static async selfEnroll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const familyId = req.user!.familyId;

      // Check if user already has a self-member
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { selfMemberId: true, email: true },
      });

      if (existingUser?.selfMemberId) {
        const existingMember = await prisma.familyMember.findUnique({
          where: { id: existingUser.selfMemberId },
        });
        res.json({ success: true, data: existingMember });
        return;
      }

      const { name, avatar } = req.body || {};
      const displayName = name || existingUser!.email.split('@')[0];

      // Create FamilyMember and link to User in a transaction
      const member = await prisma.$transaction(async (tx) => {
        const newMember = await tx.familyMember.create({
          data: {
            familyId,
            name: displayName,
            age: 18,
            ageCategory: 'ADULT',
            isAccountOwner: true,
            avatarUrl: avatar || null,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: { selfMemberId: newMember.id },
        });

        return newMember;
      });

      res.status(201).json({ success: true, data: member });
    } catch (error) {
      next(error);
    }
  }

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
