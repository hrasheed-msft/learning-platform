-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GameType" ADD VALUE 'WORD_SCRAMBLE';
ALTER TYPE "GameType" ADD VALUE 'FILL_IN_BLANK';
ALTER TYPE "GameType" ADD VALUE 'MEMORY_MATCH';
ALTER TYPE "GameType" ADD VALUE 'TRUE_FALSE';
ALTER TYPE "GameType" ADD VALUE 'MULTIPLE_CHOICE';
ALTER TYPE "GameType" ADD VALUE 'SENTENCE_BUILD';
ALTER TYPE "GameType" ADD VALUE 'LISTENING_QUIZ';
ALTER TYPE "GameType" ADD VALUE 'CALLIGRAPHY_TRACE';
ALTER TYPE "GameType" ADD VALUE 'SPELLING_BEE';
ALTER TYPE "GameType" ADD VALUE 'STORY_PUZZLE';
ALTER TYPE "GameType" ADD VALUE 'MAZE_RUNNER';
