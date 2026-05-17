import prisma from '../config/database';
import { ActivityEventType, Prisma } from '@prisma/client';

export async function recordActivity(
  memberId: string,
  familyId: string,
  eventType: ActivityEventType,
  metadata?: Record<string, unknown>
): Promise<void> {
  await prisma.activityEvent.create({
    data: {
      familyMemberId: memberId,
      familyId,
      eventType,
      metadata: metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

export class ActivityService {
  static recordActivity = recordActivity;
}
