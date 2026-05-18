import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma client - must be before importing services
vi.mock('../config/database', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    family: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock bcrypt
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn(),
  },
}));

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mock_token'),
    verify: vi.fn(),
  },
}));

// Mock config
vi.mock('../config', () => ({
  default: {
    jwt: {
      accessSecret: 'test-access-secret',
      refreshSecret: 'test-refresh-secret',
      accessExpiresIn: '15m',
      refreshExpiresIn: '7d',
    },
    bcrypt: {
      rounds: 12,
    },
  },
}));

import { AuthService } from '../services/auth.service';
import prisma from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: 'hashed_password',
  role: 'PARENT',
  familyId: 'family-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFamily = {
  id: 'family-1',
  name: 'Test Family',
  subscriptionTier: 'FREE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
        const txMock = {
          family: {
            create: vi.fn().mockResolvedValue(mockFamily),
          },
          user: {
            create: vi.fn().mockResolvedValue(mockUser),
          },
        };
        return fn(txMock);
      });

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'Password123!',
        familyName: 'Test Family',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('family');
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should reject registration with existing email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      await expect(
        AuthService.register({
          email: 'test@example.com',
          password: 'Password123!',
          familyName: 'Test Family',
        })
      ).rejects.toThrow('An account with this email already exists');
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        family: mockFamily,
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should reject invalid password', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        family: mockFamily,
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        AuthService.login({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('refreshToken', () => {
    it('should refresh valid token', async () => {
      vi.mocked(jwt.verify).mockReturnValue({
        userId: 'user-1',
        familyId: 'family-1',
      } as any);
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        ...mockUser,
        family: mockFamily,
      } as any);

      const result = await AuthService.refreshToken('valid_refresh_token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should reject invalid refresh token', async () => {
      vi.mocked(jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        AuthService.refreshToken('invalid_token')
      ).rejects.toThrow('Invalid refresh token');
    });

    it('should require refresh token', async () => {
      await expect(
        AuthService.refreshToken('')
      ).rejects.toThrow('Refresh token is required');
    });
  });

  describe('forgotPassword', () => {
    it('should create password reset token for existing user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

      // Should not throw and should update user
      await AuthService.forgotPassword('test@example.com');

      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should not reveal if email exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      // Should not throw for non-existent email
      await expect(
        AuthService.forgotPassword('nonexistent@example.com')
      ).resolves.not.toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue({
        ...mockUser,
        passwordResetToken: 'valid_token',
        passwordResetExpires: new Date(Date.now() + 3600000),
      } as any);
      vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

      await expect(
        AuthService.resetPassword('valid_token', 'NewPassword123!')
      ).resolves.not.toThrow();

      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should reject invalid/expired token', async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null);

      await expect(
        AuthService.resetPassword('invalid_token', 'NewPassword123!')
      ).rejects.toThrow();
    });
  });
});
