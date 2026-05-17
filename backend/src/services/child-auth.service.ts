import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import prisma from '../config/database';
import { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError, ConflictError } from '../middleware/error.middleware';

interface CreateCredentialsInput {
  username: string;
  password: string;
}

interface ChildLoginInput {
  username: string;
  password: string;
}

interface ChildAuthResult {
  accessToken: string;
  member: {
    id: string;
    name: string;
    ageCategory: string;
    avatarUrl: string | null;
  };
  family: {
    id: string;
    name: string;
  };
}

export class ChildAuthService {
  static async createCredentials(
    parentFamilyId: string,
    memberId: string,
    input: CreateCredentialsInput
  ): Promise<{ username: string }> {
    const { username, password } = input;

    // Validate password length
    if (!password || password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters');
    }

    // Validate username
    if (!username || username.length < 3 || username.length > 30) {
      throw new BadRequestError('Username must be between 3 and 30 characters');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      throw new BadRequestError('Username can only contain letters, numbers, hyphens, and underscores');
    }

    // Verify member belongs to parent's family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId: parentFamilyId },
    });

    if (!member) {
      throw new NotFoundError('Family member not found');
    }

    // Check username uniqueness
    const existingUsername = await prisma.familyMember.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (existingUsername && existingUsername.id !== memberId) {
      throw new ConflictError('Username is already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.bcrypt.rounds);

    // Update member with credentials
    await prisma.familyMember.update({
      where: { id: memberId },
      data: {
        username: username.toLowerCase(),
        passwordHash,
        loginEnabled: true,
      },
    });

    return { username: username.toLowerCase() };
  }

  static async childLogin(input: ChildLoginInput): Promise<ChildAuthResult> {
    const { username, password } = input;

    // Find member by username
    const member = await prisma.familyMember.findUnique({
      where: { username: username.toLowerCase() },
      include: { family: true },
    });

    if (!member || !member.loginEnabled || !member.passwordHash) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, member.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid username or password');
    }

    // Update last active
    await prisma.familyMember.update({
      where: { id: member.id },
      data: { lastActiveAt: new Date() },
    });

    // Generate child JWT
    const accessToken = jwt.sign(
      {
        sub: member.id,
        role: 'CHILD',
        familyId: member.familyId,
        ageCategory: member.ageCategory,
      },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn } as jwt.SignOptions
    );

    return {
      accessToken,
      member: {
        id: member.id,
        name: member.name,
        ageCategory: member.ageCategory,
        avatarUrl: member.avatarUrl,
      },
      family: {
        id: member.family.id,
        name: member.family.name,
      },
    };
  }

  static async getChildProfile(memberId: string) {
    const member = await prisma.familyMember.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        age: true,
        ageCategory: true,
        avatarUrl: true,
        username: true,
        currentStreak: true,
        longestStreak: true,
        totalPoints: true,
        lastActiveAt: true,
        createdAt: true,
      },
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    return member;
  }

  static async updateChildProfile(
    memberId: string,
    updates: { avatarUrl?: string }
  ) {
    const member = await prisma.familyMember.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    const updateData: Record<string, unknown> = {};
    if (updates.avatarUrl !== undefined) updateData.avatarUrl = updates.avatarUrl;

    const updated = await prisma.familyMember.update({
      where: { id: memberId },
      data: updateData,
      select: {
        id: true,
        name: true,
        age: true,
        ageCategory: true,
        avatarUrl: true,
        username: true,
        currentStreak: true,
        longestStreak: true,
        totalPoints: true,
        lastActiveAt: true,
      },
    });

    return updated;
  }
}
