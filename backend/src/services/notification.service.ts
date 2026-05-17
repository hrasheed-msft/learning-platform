import prisma from '../config/database';
import { Prisma } from '@prisma/client';
import { NotFoundError, ForbiddenError } from '../middleware/error.middleware';

export class NotificationService {
  static async getNotifications(
    userId: string,
    familyId: string,
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId, familyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { userId, familyId },
      }),
      prisma.notification.count({
        where: { userId, familyId, read: false },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError('Not authorized to modify this notification');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return updated;
  }

  static async createNotification(
    userId: string,
    familyId: string,
    type: 'MILESTONE' | 'ALERT' | 'WEEKLY_SUMMARY',
    title: string,
    message: string,
    metadata?: Record<string, unknown>
  ) {
    return prisma.notification.create({
      data: {
        userId,
        familyId,
        type,
        title,
        message,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
