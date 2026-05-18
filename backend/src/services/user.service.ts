import bcrypt from 'bcrypt';
import config from '../config';
import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../middleware/error.middleware';

interface UpdateProfileInput {
  name?: string;
  timezone?: string;
}

interface UpdateSettingsInput {
  emailNotifications?: boolean;
  dailyReminders?: boolean;
  reminderTime?: string;
}

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
        family: {
          select: {
            id: true,
            name: true,
            subscriptionTier: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  static async updateProfile(userId: string, updates: UpdateProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update user settings or family name as appropriate
    // For now, we'll update family name if provided
    if (updates.name) {
      await prisma.family.update({
        where: { id: user.familyId },
        data: { name: updates.name },
      });
    }

    return this.getProfile(userId);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.rounds);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  static async getSettings(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        settings: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Return settings or defaults
    const defaultSettings = {
      emailNotifications: true,
      dailyReminders: false,
      reminderTime: '09:00',
      theme: 'light',
      language: 'en',
    };

    return {
      ...(defaultSettings),
      ...(user.settings as Record<string, unknown> || {}),
    };
  }

  static async updateSettings(userId: string, updates: UpdateSettingsInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const currentSettings = (user.settings as Record<string, unknown>) || {};
    const newSettings = { ...currentSettings, ...updates };

    await prisma.user.update({
      where: { id: userId },
      data: { settings: newSettings },
    });

    return newSettings;
  }

  static async getAchievements(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { family: { include: { members: true } } },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get achievements for all family members (for parent view)
    const memberIds = user.family.members.map(m => m.id);

    const achievements = await prisma.achievement.findMany({
      where: { memberId: { in: memberIds } },
      orderBy: { earnedAt: 'desc' },
      include: {
        member: { select: { name: true } },
      },
    });

    return achievements;
  }
}
