-- CreateEnum
CREATE TYPE "FlashCardStatus" AS ENUM ('NEW', 'LEARNING', 'REVIEWING', 'MASTERED');

-- CreateEnum
CREATE TYPE "FlashCardDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "flashcards" (
    "id" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "frontArabic" TEXT,
    "backArabic" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "difficulty" "FlashCardDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_progress" (
    "id" TEXT NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "correctReviews" INTEGER NOT NULL DEFAULT 0,
    "lastRating" INTEGER NOT NULL DEFAULT 0,
    "status" "FlashCardStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,
    "flashCardId" TEXT NOT NULL,

    CONSTRAINT "flashcard_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flashcards_unitId_idx" ON "flashcards"("unitId");

-- CreateIndex
CREATE INDEX "flashcards_courseId_idx" ON "flashcards"("courseId");

-- CreateIndex
CREATE INDEX "flashcards_category_idx" ON "flashcards"("category");

-- CreateIndex
CREATE INDEX "flashcards_difficulty_idx" ON "flashcards"("difficulty");

-- CreateIndex
CREATE UNIQUE INDEX "flashcards_unitId_orderIndex_key" ON "flashcards"("unitId", "orderIndex");

-- CreateIndex
CREATE INDEX "flashcard_progress_memberId_idx" ON "flashcard_progress"("memberId");

-- CreateIndex
CREATE INDEX "flashcard_progress_flashCardId_idx" ON "flashcard_progress"("flashCardId");

-- CreateIndex
CREATE INDEX "flashcard_progress_nextReviewDate_idx" ON "flashcard_progress"("nextReviewDate");

-- CreateIndex
CREATE INDEX "flashcard_progress_status_idx" ON "flashcard_progress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_progress_memberId_flashCardId_key" ON "flashcard_progress"("memberId", "flashCardId");

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_flashCardId_fkey" FOREIGN KEY ("flashCardId") REFERENCES "flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
