-- Add parent PIN gate fields to family_members
-- parentPinHash: bcrypt hash of the 4-digit PIN (account-owner only)
-- pinSetAt:      timestamp of last PIN update
-- pinAttempts:   consecutive failed verify attempts (reset on success / lockout expiry)
-- pinLockedUntil: when the lockout expires (NULL = not locked)

ALTER TABLE "family_members"
  ADD COLUMN "parentPinHash"  TEXT,
  ADD COLUMN "pinSetAt"        TIMESTAMP(3),
  ADD COLUMN "pinAttempts"     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "pinLockedUntil"  TIMESTAMP(3);
