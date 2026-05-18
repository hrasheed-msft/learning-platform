import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import config from '../config';
import prisma from '../config/database';
import { BadRequestError, UnauthorizedError, NotFoundError, ConflictError } from '../middleware/error.middleware';

interface RegisterInput {
  email: string;
  password: string;
  familyName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult extends TokenPair {
  user: {
    id: string;
    email: string;
    role: string;
  };
  family: {
    id: string;
    name: string;
  };
}

export class AuthService {
  static async register(input: RegisterInput): Promise<AuthResult> {
    const { email, password, familyName } = input;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.bcrypt.rounds);

    // Create family and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create family
      const family = await tx.family.create({
        data: {
          name: familyName,
          subscriptionTier: 'FREE',
        },
      });

      // Create user (parent)
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          role: 'PARENT',
          familyId: family.id,
          emailVerified: false,
          verificationToken: uuid(),
        },
      });

      return { family, user };
    });

    // TODO: Send verification email

    // Generate tokens
    const tokens = this.generateTokens(result.user, result.family);

    return {
      ...tokens,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
      family: {
        id: result.family.id,
        name: result.family.name,
      },
    };
  }

  static async login(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;

    // Find user with family
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { family: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = this.generateTokens(user, user.family);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      family: {
        id: user.family.id,
        name: user.family.name,
      },
    };
  }

  static async refreshToken(refreshToken: string): Promise<TokenPair> {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string;
        familyId: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { family: true },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return this.generateTokens(user, user.family);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  static async logout(userId: string, refreshToken?: string): Promise<void> {
    // TODO: Invalidate refresh token in Redis
    // For now, just log it
    console.log(`User ${userId} logged out`);
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal whether user exists
      return;
    }

    const resetToken = uuid();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // TODO: Send reset email
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.rounds);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  static async verifyEmail(token: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestError('Invalid verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });
  }

  static async resendVerification(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestError('Email already verified');
    }

    const verificationToken = uuid();

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // TODO: Send verification email
  }

  private static generateTokens(user: { id: string; email: string; role: string }, family: { id: string }): TokenPair {
    const accessToken = jwt.sign(
      {
        userId: user.id,
        familyId: family.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn } as any
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        familyId: family.id,
      },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn } as any
    );

    return { accessToken, refreshToken };
  }
}
