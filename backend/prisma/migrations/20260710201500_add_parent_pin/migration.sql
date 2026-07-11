-- Add parent PIN gate fields to users (parent accounts)
-- parentPinHash: bcrypt hash of the 4-digit PIN
-- pinSetAt:      timestamp of last PIN update
-- pinAttempts:   consecutive failed verify attempts (reset on success / lockout expiry)
-- pinLockedUntil: when the lockout expires (NULL = not locked)

ALTER TABLE "users"
  ADD COLUMN "parentPinHash"  TEXT,
  ADD COLUMN "pinSetAt"        TIMESTAMP(3),
  ADD COLUMN "pinAttempts"     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "pinLockedUntil"  TIMESTAMP(3);
