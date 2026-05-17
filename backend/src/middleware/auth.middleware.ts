import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import prisma from '../config/database';
import { UnauthorizedError, ForbiddenError } from './error.middleware';

export interface JwtPayload {
  userId: string;
  familyId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface ChildJwtPayload {
  sub: string;
  role: 'CHILD';
  familyId: string;
  ageCategory: string;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    familyId: string;
    email: string;
    role: string;
  };
  child?: {
    memberId: string;
    familyId: string;
    ageCategory: string;
    role: 'CHILD';
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as Record<string, unknown>;

      if (decoded.role === 'CHILD') {
        // Child JWT — sub = FamilyMember ID
        const childPayload = decoded as unknown as ChildJwtPayload;
        const member = await prisma.familyMember.findUnique({
          where: { id: childPayload.sub },
          select: { id: true, familyId: true, ageCategory: true, loginEnabled: true },
        });

        if (!member || !member.loginEnabled) {
          throw new UnauthorizedError('Child account not found or disabled');
        }

        req.child = {
          memberId: member.id,
          familyId: member.familyId,
          ageCategory: member.ageCategory,
          role: 'CHILD',
        };
      } else {
        // Parent/Admin JWT — userId = User ID
        const parentPayload = decoded as unknown as JwtPayload;
        const user = await prisma.user.findUnique({
          where: { id: parentPayload.userId },
          select: { id: true, familyId: true, email: true, role: true },
        });

        if (!user) {
          throw new UnauthorizedError('User no longer exists');
        }

        req.user = {
          id: user.id,
          familyId: user.familyId,
          email: user.email,
          role: user.role,
        };
      }

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired');
      }
      if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token');
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Not authenticated'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }

    next();
  };
};

export const requireParentRole = requireRole('PARENT');

export const requireParent = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || (req.user.role !== 'PARENT' && req.user.role !== 'ADMIN')) {
    next(new ForbiddenError('Parent access required'));
    return;
  }
  next();
};

export const requireChild = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.child) {
    next(new ForbiddenError('Child access required'));
    return;
  }
  next();
};

// Alias for compatibility
export const requireAuth = authenticate;

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as Record<string, unknown>;

      if (decoded.role === 'CHILD') {
        const childPayload = decoded as unknown as ChildJwtPayload;
        const member = await prisma.familyMember.findUnique({
          where: { id: childPayload.sub },
          select: { id: true, familyId: true, ageCategory: true, loginEnabled: true },
        });

        if (member && member.loginEnabled) {
          req.child = {
            memberId: member.id,
            familyId: member.familyId,
            ageCategory: member.ageCategory,
            role: 'CHILD',
          };
        }
      } else {
        const parentPayload = decoded as unknown as JwtPayload;
        const user = await prisma.user.findUnique({
          where: { id: parentPayload.userId },
          select: { id: true, familyId: true, email: true, role: true },
        });

        if (user) {
          req.user = {
            id: user.id,
            familyId: user.familyId,
            email: user.email,
            role: user.role,
          };
        }
      }
    } catch {
      // Token invalid or expired, continue without auth
    }

    next();
  } catch (error) {
    next(error);
  }
};
