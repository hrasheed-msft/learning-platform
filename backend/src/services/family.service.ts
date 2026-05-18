import prisma from '../config/database';
import { NotFoundError, ForbiddenError, BadRequestError } from '../middleware/error.middleware';

interface AddMemberInput {
  name: string;
  age: number;
  pin?: string;
  avatarUrl?: string;
}

interface UpdateMemberInput {
  name?: string;
  age?: number;
  pin?: string;
  avatarUrl?: string;
}

// Helper to determine age category
function getAgeCategory(age: number): string {
  if (age <= 6) return 'EARLY_CHILD';
  if (age <= 9) return 'CHILD';
  if (age <= 12) return 'PRE_TEEN';
  if (age <= 17) return 'TEEN';
  return 'ADULT';
}

export class FamilyService {
  static async getFamily(familyId: string) {
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!family) {
      throw new NotFoundError('Family not found');
    }

    return family;
  }

  static async getMembers(familyId: string) {
    const members = await prisma.familyMember.findMany({
      where: { familyId },
      orderBy: { createdAt: 'asc' },
    });

    return members;
  }

  static async getMember(familyId: string, memberId: string) {
    const member = await prisma.familyMember.findFirst({
      where: {
        id: memberId,
        familyId,
      },
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    return member;
  }

  static async addMember(familyId: string, input: AddMemberInput) {
    const { name, age, pin, avatarUrl } = input;

    const member = await prisma.familyMember.create({
      data: {
        familyId,
        name,
        age,
        ageCategory: getAgeCategory(age),
        pin: pin || null,
        avatarUrl: avatarUrl || null,
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
      },
    });

    return member;
  }

  static async updateMember(familyId: string, memberId: string, updates: UpdateMemberInput) {
    // Verify member belongs to family
    const existing = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!existing) {
      throw new NotFoundError('Member not found');
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.age !== undefined) {
      updateData.age = updates.age;
      updateData.ageCategory = getAgeCategory(updates.age);
    }
    if (updates.pin !== undefined) updateData.pin = updates.pin;
    if (updates.avatarUrl !== undefined) updateData.avatarUrl = updates.avatarUrl;

    const member = await prisma.familyMember.update({
      where: { id: memberId },
      data: updateData,
    });

    return member;
  }

  static async deleteMember(familyId: string, memberId: string): Promise<void> {
    // Verify member belongs to family
    const existing = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!existing) {
      throw new NotFoundError('Member not found');
    }

    await prisma.familyMember.delete({
      where: { id: memberId },
    });
  }

  static async switchMember(familyId: string, memberId: string, pin?: string) {
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    // Verify PIN if member has one set
    if (member.pin) {
      if (!pin || pin !== member.pin) {
        throw new ForbiddenError('Invalid PIN');
      }
    }

    // Return member info for session
    return {
      id: member.id,
      name: member.name,
      age: member.age,
      ageCategory: member.ageCategory,
      avatarUrl: member.avatarUrl,
    };
  }

  static async getMemberProgress(familyId: string, memberId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    // Get enrollments with progress
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { memberId },
      include: {
        course: true,
        unitProgress: true,
      },
    });

    // Get achievements
    const achievements = await prisma.achievement.findMany({
      where: { memberId },
      orderBy: { earnedAt: 'desc' },
    });

    return {
      member: {
        id: member.id,
        name: member.name,
        currentStreak: member.currentStreak,
        longestStreak: member.longestStreak,
        totalPoints: member.totalPoints,
      },
      enrollments,
      achievements,
    };
  }
}
