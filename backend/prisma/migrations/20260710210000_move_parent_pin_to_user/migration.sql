-- Move parent PIN gate fields from family_members to users table.
-- The initial migration (20260710201500) added these columns to family_members
-- but the service uses the User model (authenticated parent = User record).
-- This migration adds the correct columns to users and cleans up family_members.

-- Add PIN columns to users (the correct location)
ALTER TABLE "users"
  ADD COLUMN "parentPinHash"  TEXT,
  ADD COLUMN "pinSetAt"        TIMESTAMP(3),
  ADD COLUMN "pinAttempts"     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "pinLockedUntil"  TIMESTAMP(3);

-- Remove the now-unused PIN columns from family_members (additive rollback)
ALTER TABLE "family_members"
  DROP COLUMN IF EXISTS "parentPinHash",
  DROP COLUMN IF EXISTS "pinSetAt",
  DROP COLUMN IF EXISTS "pinAttempts",
  DROP COLUMN IF EXISTS "pinLockedUntil";
