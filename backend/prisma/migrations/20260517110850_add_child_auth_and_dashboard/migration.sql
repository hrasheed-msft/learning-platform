/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `family_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ActivityEventType" AS ENUM ('QUIZ_COMPLETED', 'COURSE_STARTED', 'COURSE_COMPLETED', 'FLASHCARD_REVIEWED', 'GAME_PLAYED', 'STREAK_REACHED', 'BADGE_EARNED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MILESTONE', 'ALERT', 'WEEKLY_SUMMARY');

-- AlterTable
ALTER TABLE "family_members" ADD COLUMN     "loginEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "activity_events" (
    "id" TEXT NOT NULL,
    "eventType" "ActivityEventType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familyMemberId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_events_familyMemberId_idx" ON "activity_events"("familyMemberId");

-- CreateIndex
CREATE INDEX "activity_events_familyId_idx" ON "activity_events"("familyId");

-- CreateIndex
CREATE INDEX "activity_events_eventType_idx" ON "activity_events"("eventType");

-- CreateIndex
CREATE INDEX "activity_events_createdAt_idx" ON "activity_events"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_familyId_idx" ON "notifications"("familyId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "family_members_username_key" ON "family_members"("username");

-- AddForeignKey
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;
