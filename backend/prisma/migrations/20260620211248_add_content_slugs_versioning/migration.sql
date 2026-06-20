-- AlterTable: add slug + contentVersion to courses
ALTER TABLE "courses" ADD COLUMN "slug" TEXT;
ALTER TABLE "courses" ADD COLUMN "contentVersion" INTEGER NOT NULL DEFAULT 1;

-- AlterTable: add slug to units
ALTER TABLE "units" ADD COLUMN "slug" TEXT;

-- AlterTable: add externalId to questions
ALTER TABLE "questions" ADD COLUMN "externalId" TEXT;

-- CreateIndex: unique slug on courses (NULLs are distinct in Postgres)
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex: composite unique (courseId, slug) on units
-- Postgres treats NULL as distinct, so rows with NULL slug don't conflict
CREATE UNIQUE INDEX "units_courseId_slug_key" ON "units"("courseId", "slug");

-- CreateIndex: unique externalId on questions
CREATE UNIQUE INDEX "questions_externalId_key" ON "questions"("externalId");
