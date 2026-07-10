-- CreateEnum
CREATE TYPE "LearningPath" AS ENUM ('AFTER_SCHOOL', 'WEEKEND');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable: Add gender to family_members
ALTER TABLE "family_members" ADD COLUMN "gender" "Gender";

-- AlterTable: Add includedInPaths to units
ALTER TABLE "units" ADD COLUMN "includedInPaths" "LearningPath"[];

-- AlterTable: Add stageTag and subjectTag to flashcards
ALTER TABLE "flashcards" ADD COLUMN "stageTag" TEXT;
ALTER TABLE "flashcards" ADD COLUMN "subjectTag" TEXT;

-- CreateTable: programs
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "learningPaths" "LearningPath"[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: program_stages
CREATE TABLE "program_stages" (
    "id" TEXT NOT NULL,
    "stageNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ageMin" INTEGER NOT NULL,
    "ageMax" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "program_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable: program_enrollments
CREATE TABLE "program_enrollments" (
    "id" TEXT NOT NULL,
    "path" "LearningPath" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyMemberId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "currentStageId" TEXT NOT NULL,

    CONSTRAINT "program_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: implicit M2M join table for Course <-> ProgramStage
CREATE TABLE "_CourseToProgramStage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseToProgramStage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE INDEX "program_stages_programId_idx" ON "program_stages"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "program_stages_programId_stageNumber_key" ON "program_stages"("programId", "stageNumber");

-- CreateIndex
CREATE INDEX "program_enrollments_familyMemberId_idx" ON "program_enrollments"("familyMemberId");

-- CreateIndex
CREATE INDEX "program_enrollments_programId_idx" ON "program_enrollments"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "program_enrollments_familyMemberId_programId_key" ON "program_enrollments"("familyMemberId", "programId");

-- CreateIndex
CREATE INDEX "_CourseToProgramStage_B_index" ON "_CourseToProgramStage"("B");

-- AddForeignKey
ALTER TABLE "program_stages" ADD CONSTRAINT "program_stages_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_enrollments" ADD CONSTRAINT "program_enrollments_currentStageId_fkey" FOREIGN KEY ("currentStageId") REFERENCES "program_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProgramStage" ADD CONSTRAINT "_CourseToProgramStage_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToProgramStage" ADD CONSTRAINT "_CourseToProgramStage_B_fkey" FOREIGN KEY ("B") REFERENCES "program_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
