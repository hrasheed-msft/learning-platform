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
   * Set or update the PIN for the account-owner member in the calling user's family.
   * Hashes the PIN with bcrypt cost 10 before storing.
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Find the account-owner member for this family
    const ownerMember = await prisma.familyMember.findFirst({
      where: { familyId: user.familyId, isAccountOwner: true },
      select: { id: true },
    });

    if (!ownerMember) {
      throw new NotFoundError('No account-owner member profile found for this family');
    }

    const pinHash = await bcrypt.hash(pin, PIN_BCRYPT_COST);

    await prisma.familyMember.update({
      where: { id: ownerMember.id },
      data: {
        parentPinHash: pinHash,
        pinSetAt: new Date(),
        pinAttempts: 0,
        pinLockedUntil: null,
      },
    });
  }

  /**
   * Returns whether the account-owner member for this user's family has set a PIN.
   */
  static async getPinStatus(userId: string): Promise<{ hasPin: boolean }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true },
    });

    if (!user) {
      return { hasPin: false };
    }

    const ownerMember = await prisma.familyMember.findFirst({
      where: { familyId: user.familyId, isAccountOwner: true },
      select: { parentPinHash: true },
    });

    return { hasPin: !!ownerMember?.parentPinHash };
  }

  /**
   * Verifies the PIN against the account-owner FamilyMember identified by memberId.
   * Enforces a 3-attempt / 30-second lockout per member.
   */
  static async verifyPin(
    memberId: string,
    pin: string
  ): Promise<{ verified: boolean; remainingAttempts?: number }> {
    const member = await prisma.familyMember.findUnique({
      where: { id: memberId },
      select: {
        parentPinHash: true,
        pinAttempts: true,
        pinLockedUntil: true,
        isAccountOwner: true,
      },
    });

    if (!member || !member.isAccountOwner) {
      throw new NotFoundError('Member not found or is not an account owner');
    }

    if (!member.parentPinHash) {
      throw new BadRequestError('No PIN has been set for this account');
    }

    // Lockout check
    if (member.pinLockedUntil && member.pinLockedUntil > new Date()) {
      const secsLeft = Math.ceil(
        (member.pinLockedUntil.getTime() - Date.now()) / 1000
      );
      throw new AppError(
        `Too many failed PIN attempts. Try again in ${secsLeft} seconds.`,
        429
      );
    }

    const verified = await bcrypt.compare(pin, member.parentPinHash);

    if (verified) {
      await prisma.familyMember.update({
        where: { id: memberId },
        data: { pinAttempts: 0, pinLockedUntil: null },
      });
      return { verified: true };
    }

    // Increment failure counter
    const newAttempts = (member.pinAttempts ?? 0) + 1;
    const lockedUntil =
      newAttempts >= MAX_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_SECONDS * 1000)
        : null;

    await prisma.familyMember.update({
      where: { id: memberId },
      data: { pinAttempts: newAttempts, pinLockedUntil: lockedUntil },
    });

    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - newAttempts);
    return { verified: false, remainingAttempts };
  }
}
