import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import prisma from '../config/database';

/**
 * Middleware that enforces an active learner profile selection.
 *
 * - Checks for `x-active-member-id` header
 * - Validates that the member belongs to the authenticated user's family
 * - Attaches `req.activeMemberId` to the request
 *
 * For child JWTs, the memberId is already embedded in the token — we use that
 * directly without requiring the header.
 */

export interface ActiveMemberRequest extends AuthenticatedRequest {
  activeMemberId?: string;
}

export const requireActiveMember = async (
  req: ActiveMemberRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Child tokens carry their own memberId — always valid
    if (req.child) {
      req.activeMemberId = req.child.memberId;
      next();
      return;
    }

    const memberId = req.headers['x-active-member-id'] as string | undefined;

    if (!memberId) {
      res.status(403).json({
        error: 'NO_ACTIVE_MEMBER',
        message: 'Please select a learner profile',
      });
      return;
    }

    // Validate that this member belongs to the user's family
    const familyId = req.user?.familyId;
    if (!familyId) {
      res.status(403).json({
        error: 'NO_ACTIVE_MEMBER',
        message: 'Please select a learner profile',
      });
      return;
    }

    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
      select: { id: true },
    });

    if (!member) {
      res.status(403).json({
        error: 'NO_ACTIVE_MEMBER',
        message: 'Please select a learner profile',
      });
      return;
    }

    req.activeMemberId = member.id;
    next();
  } catch (error) {
    next(error);
  }
};
