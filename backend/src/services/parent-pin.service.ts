import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { AppError, BadRequestError, NotFoundError } from '../middleware/error.middleware';

const PIN_BCRYPT_COST = 10;
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

// Common weak PINs to reject
const WEAK_PINS = new Set([
  '0000', '1111', '2222', '3333', '4444',
  '5555', '6666', '7777', '8888', '9999',
  '1234', '4321', '0123', '9876',
]);

export class ParentPinService {
  /**
   * Set or update the PIN for the authenticated parent User.
   * Hashes the PIN with bcrypt cost 10 before storing on the users table.
   */
  static async setPin(userId: string, pin: string): Promise<void> {
    if (!/^\d{4}$/.test(pin)) {
      throw new BadRequestError('PIN must be exactly 4 digits (0–9)');
    }
    if (WEAK_PINS.has(pin)) {
      throw new BadRequestError(
        'PIN is too common. Please choose a more unique 4-digit PIN.'
      );
    }

    const pinHash = await bcrypt.hash(pin, PIN_BCRYPT_COST);

    await prisma.user.update({
      where: { id: userId },
      data: {
        parentPinHash: pinHash,
        pinSetAt: new Date(),
        pinAttempts: 0,
        pinLockedUntil: null,
      },
    });
  }

  /**
   * Returns whether the authenticated parent has set a PIN.
   */
  static async getPinStatus(userId: string): Promise<{ hasPin: boolean }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { parentPinHash: true },
    });

    return { hasPin: !!user?.parentPinHash };
  }

  /**
   * Verifies the PIN for the parent who owns the family of the given memberId.
   * The memberId identifies any FamilyMember; we find the parent User for that family.
   * Enforces a 3-attempt / 30-second lockout.
   */
  static async verifyPin(
    memberId: string,
    pin: string
  ): Promise<{ verified: boolean; remainingAttempts?: number }> {
    // Resolve the parent User from memberId → familyId → User (PARENT role)
    const member = await prisma.familyMember.findUnique({
      where: { id: memberId },
      select: { familyId: true },
    });

    if (!member) {
      throw new NotFoundError('Member not found');
    }

    // Find the parent user for this family (there should be at least one)
    const parentUser = await prisma.user.findFirst({
      where: { familyId: member.familyId, role: 'PARENT' },
      select: {
        id: true,
        parentPinHash: true,
        pinAttempts: true,
        pinLockedUntil: true,
      },
    });

    if (!parentUser) {
      throw new NotFoundError('No parent user found for this family');
    }

    if (!parentUser.parentPinHash) {
      throw new BadRequestError('No PIN has been set for this account');
    }

    // Lockout check
    if (parentUser.pinLockedUntil && parentUser.pinLockedUntil > new Date()) {
      const secsLeft = Math.ceil(
        (parentUser.pinLockedUntil.getTime() - Date.now()) / 1000
      );
      throw new AppError(
        `Too many failed PIN attempts. Try again in ${secsLeft} seconds.`,
        429
      );
    }

    const verified = await bcrypt.compare(pin, parentUser.parentPinHash);

    if (verified) {
      await prisma.user.update({
        where: { id: parentUser.id },
        data: { pinAttempts: 0, pinLockedUntil: null },
      });
      return { verified: true };
    }

    // Increment failure counter
    const newAttempts = (parentUser.pinAttempts ?? 0) + 1;
    const lockedUntil =
      newAttempts >= MAX_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_SECONDS * 1000)
        : null;

    await prisma.user.update({
      where: { id: parentUser.id },
      data: { pinAttempts: newAttempts, pinLockedUntil: lockedUntil },
    });

    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - newAttempts);
    return { verified: false, remainingAttempts };
  }
}

