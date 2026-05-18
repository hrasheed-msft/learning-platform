-- Migration: Collapse GameType enum from 26 values to 9.
-- Strategy:
--   1. Create new enum.
--   2. Convert each column (game_templates.type, leaderboards.gameType,
--      game_parental_settings.allowedGameTypes[]) using a CASE mapping.
--   3. Drop the old enum and rename the new one.
--   4. De-duplicate game_templates rows that now share the same type, repointing
--      games to the canonical template before deleting duplicates.
--   5. Add presentationConfig + courseCompatibility columns on games.
--
-- Mapping (per khaldun-game-redesign.md §4.2; G8 VERIFY merged into QUICK_RECALL
-- per hrasheed's directive — true/false becomes a 2-option MCQ variant):
--   MULTIPLE_CHOICE, SPEED_QUIZ, TRIVIA_BATTLE, ESCAPE_ROOM, MAZE_NAVIGATOR,
--   MAZE_RUNNER, KNOWLEDGE_EXPEDITION, MOSQUE_BUILDER, PATTERN_CREATOR,
--   LISTENING_QUIZ, TRUE_FALSE, DAILY_CHALLENGE   -> QUICK_RECALL
--   MEMORY_MATCH, TERM_MATCH                      -> PAIR_MATCH
--   FLASHCARD_FLIP                                -> FLASHCARD_SPRINT
--   FILL_IN_BLANK, AYAH_COMPLETION, SPELLING_BEE  -> CLOZE
--   WORD_SEARCH                                   -> WORD_SEARCH
--   HADITH_CHAIN, SEERAH_TIMELINE, SENTENCE_BUILD,
--   STORY_PUZZLE                                  -> SEQUENCE_IT
--   WORD_SCRAMBLE                                 -> WORD_SCRAMBLE
--   CALLIGRAPHY_TRACE                             -> CALLIGRAPHY_TRACE
--   FIQH_SCENARIO                                 -> FIQH_SCENARIO (legacy MCQ
--                                                   scores preserved; new
--                                                   scenario-tree rounds start
--                                                   fresh)

-- 1. New enum
CREATE TYPE "GameType_new" AS ENUM (
  'QUICK_RECALL',
  'PAIR_MATCH',
  'FLASHCARD_SPRINT',
  'CLOZE',
  'WORD_SEARCH',
  'SEQUENCE_IT',
  'WORD_SCRAMBLE',
  'CALLIGRAPHY_TRACE',
  'FIQH_SCENARIO'
);

-- 2a. Convert game_parental_settings.allowedGameTypes (GameType[])
-- PostgreSQL cannot use subqueries in USING for ALTER COLUMN TYPE on arrays.
-- Workaround: add a temp column, populate via UPDATE, drop old, rename.
ALTER TABLE "game_parental_settings"
  ADD COLUMN "allowedGameTypes_new" "GameType_new"[] DEFAULT ARRAY[]::"GameType_new"[];

UPDATE "game_parental_settings" SET "allowedGameTypes_new" = (
  SELECT COALESCE(array_agg(DISTINCT mapped), ARRAY[]::"GameType_new"[])
  FROM (
    SELECT (
      CASE elem::text
        WHEN 'MULTIPLE_CHOICE'      THEN 'QUICK_RECALL'
        WHEN 'SPEED_QUIZ'           THEN 'QUICK_RECALL'
        WHEN 'TRIVIA_BATTLE'        THEN 'QUICK_RECALL'
        WHEN 'ESCAPE_ROOM'          THEN 'QUICK_RECALL'
        WHEN 'MAZE_NAVIGATOR'       THEN 'QUICK_RECALL'
        WHEN 'MAZE_RUNNER'          THEN 'QUICK_RECALL'
        WHEN 'KNOWLEDGE_EXPEDITION' THEN 'QUICK_RECALL'
        WHEN 'MOSQUE_BUILDER'       THEN 'QUICK_RECALL'
        WHEN 'PATTERN_CREATOR'      THEN 'QUICK_RECALL'
        WHEN 'LISTENING_QUIZ'       THEN 'QUICK_RECALL'
        WHEN 'TRUE_FALSE'           THEN 'QUICK_RECALL'
        WHEN 'DAILY_CHALLENGE'      THEN 'QUICK_RECALL'
        WHEN 'MEMORY_MATCH'         THEN 'PAIR_MATCH'
        WHEN 'TERM_MATCH'           THEN 'PAIR_MATCH'
        WHEN 'FLASHCARD_FLIP'       THEN 'FLASHCARD_SPRINT'
        WHEN 'FILL_IN_BLANK'        THEN 'CLOZE'
        WHEN 'AYAH_COMPLETION'      THEN 'CLOZE'
        WHEN 'SPELLING_BEE'         THEN 'CLOZE'
        WHEN 'WORD_SEARCH'          THEN 'WORD_SEARCH'
        WHEN 'HADITH_CHAIN'         THEN 'SEQUENCE_IT'
        WHEN 'SEERAH_TIMELINE'      THEN 'SEQUENCE_IT'
        WHEN 'SENTENCE_BUILD'       THEN 'SEQUENCE_IT'
        WHEN 'STORY_PUZZLE'         THEN 'SEQUENCE_IT'
        WHEN 'WORD_SCRAMBLE'        THEN 'WORD_SCRAMBLE'
        WHEN 'CALLIGRAPHY_TRACE'    THEN 'CALLIGRAPHY_TRACE'
        WHEN 'FIQH_SCENARIO'        THEN 'FIQH_SCENARIO'
        ELSE 'QUICK_RECALL'
      END
    )::"GameType_new" AS mapped
    FROM unnest("allowedGameTypes") AS elem
  ) sub
);

ALTER TABLE "game_parental_settings" DROP COLUMN "allowedGameTypes";
ALTER TABLE "game_parental_settings" RENAME COLUMN "allowedGameTypes_new" TO "allowedGameTypes";

-- 2b. Convert game_templates.type (drop unique first; we'll re-add after de-dup)
ALTER TABLE "game_templates" DROP CONSTRAINT IF EXISTS "game_templates_type_key";

ALTER TABLE "game_templates"
  ALTER COLUMN "type" TYPE "GameType_new"
  USING (
    CASE "type"::text
      WHEN 'MULTIPLE_CHOICE'      THEN 'QUICK_RECALL'
      WHEN 'SPEED_QUIZ'           THEN 'QUICK_RECALL'
      WHEN 'TRIVIA_BATTLE'        THEN 'QUICK_RECALL'
      WHEN 'ESCAPE_ROOM'          THEN 'QUICK_RECALL'
      WHEN 'MAZE_NAVIGATOR'       THEN 'QUICK_RECALL'
      WHEN 'MAZE_RUNNER'          THEN 'QUICK_RECALL'
      WHEN 'KNOWLEDGE_EXPEDITION' THEN 'QUICK_RECALL'
      WHEN 'MOSQUE_BUILDER'       THEN 'QUICK_RECALL'
      WHEN 'PATTERN_CREATOR'      THEN 'QUICK_RECALL'
      WHEN 'LISTENING_QUIZ'       THEN 'QUICK_RECALL'
      WHEN 'TRUE_FALSE'           THEN 'QUICK_RECALL'
      WHEN 'DAILY_CHALLENGE'      THEN 'QUICK_RECALL'
      WHEN 'MEMORY_MATCH'         THEN 'PAIR_MATCH'
      WHEN 'TERM_MATCH'           THEN 'PAIR_MATCH'
      WHEN 'FLASHCARD_FLIP'       THEN 'FLASHCARD_SPRINT'
      WHEN 'FILL_IN_BLANK'        THEN 'CLOZE'
      WHEN 'AYAH_COMPLETION'      THEN 'CLOZE'
      WHEN 'SPELLING_BEE'         THEN 'CLOZE'
      WHEN 'WORD_SEARCH'          THEN 'WORD_SEARCH'
      WHEN 'HADITH_CHAIN'         THEN 'SEQUENCE_IT'
      WHEN 'SEERAH_TIMELINE'      THEN 'SEQUENCE_IT'
      WHEN 'SENTENCE_BUILD'       THEN 'SEQUENCE_IT'
      WHEN 'STORY_PUZZLE'         THEN 'SEQUENCE_IT'
      WHEN 'WORD_SCRAMBLE'        THEN 'WORD_SCRAMBLE'
      WHEN 'CALLIGRAPHY_TRACE'    THEN 'CALLIGRAPHY_TRACE'
      WHEN 'FIQH_SCENARIO'        THEN 'FIQH_SCENARIO'
      ELSE 'QUICK_RECALL'
    END::"GameType_new"
  );

-- 2c. Convert leaderboards.gameType (nullable)
ALTER TABLE "leaderboards"
  ALTER COLUMN "gameType" TYPE "GameType_new"
  USING (
    CASE
      WHEN "gameType" IS NULL THEN NULL
      ELSE (
        CASE "gameType"::text
          WHEN 'MULTIPLE_CHOICE'      THEN 'QUICK_RECALL'
          WHEN 'SPEED_QUIZ'           THEN 'QUICK_RECALL'
          WHEN 'TRIVIA_BATTLE'        THEN 'QUICK_RECALL'
          WHEN 'ESCAPE_ROOM'          THEN 'QUICK_RECALL'
          WHEN 'MAZE_NAVIGATOR'       THEN 'QUICK_RECALL'
          WHEN 'MAZE_RUNNER'          THEN 'QUICK_RECALL'
          WHEN 'KNOWLEDGE_EXPEDITION' THEN 'QUICK_RECALL'
          WHEN 'MOSQUE_BUILDER'       THEN 'QUICK_RECALL'
          WHEN 'PATTERN_CREATOR'      THEN 'QUICK_RECALL'
          WHEN 'LISTENING_QUIZ'       THEN 'QUICK_RECALL'
          WHEN 'TRUE_FALSE'           THEN 'QUICK_RECALL'
          WHEN 'DAILY_CHALLENGE'      THEN 'QUICK_RECALL'
          WHEN 'MEMORY_MATCH'         THEN 'PAIR_MATCH'
          WHEN 'TERM_MATCH'           THEN 'PAIR_MATCH'
          WHEN 'FLASHCARD_FLIP'       THEN 'FLASHCARD_SPRINT'
          WHEN 'FILL_IN_BLANK'        THEN 'CLOZE'
          WHEN 'AYAH_COMPLETION'      THEN 'CLOZE'
          WHEN 'SPELLING_BEE'         THEN 'CLOZE'
          WHEN 'WORD_SEARCH'          THEN 'WORD_SEARCH'
          WHEN 'HADITH_CHAIN'         THEN 'SEQUENCE_IT'
          WHEN 'SEERAH_TIMELINE'      THEN 'SEQUENCE_IT'
          WHEN 'SENTENCE_BUILD'       THEN 'SEQUENCE_IT'
          WHEN 'STORY_PUZZLE'         THEN 'SEQUENCE_IT'
          WHEN 'WORD_SCRAMBLE'        THEN 'WORD_SCRAMBLE'
          WHEN 'CALLIGRAPHY_TRACE'    THEN 'CALLIGRAPHY_TRACE'
          WHEN 'FIQH_SCENARIO'        THEN 'FIQH_SCENARIO'
          ELSE 'QUICK_RECALL'
        END
      )::"GameType_new"
    END
  );

-- 3. Swap enum types
DROP TYPE "GameType";
ALTER TYPE "GameType_new" RENAME TO "GameType";

-- 4. De-duplicate game_templates: keep one canonical row per (new) type,
--    repoint games to it, then delete the duplicates.
WITH ranked AS (
  SELECT
    id,
    type,
    ROW_NUMBER() OVER (
      PARTITION BY type
      ORDER BY "sortOrder" ASC, "createdAt" ASC, id ASC
    ) AS rn
  FROM "game_templates"
),
canonical AS (
  SELECT type, id AS canonical_id FROM ranked WHERE rn = 1
)
UPDATE "games" g
SET "templateId" = c.canonical_id
FROM "game_templates" t
JOIN canonical c ON c.type = t.type
WHERE g."templateId" = t.id
  AND t.id <> c.canonical_id;

DELETE FROM "game_templates"
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY type
      ORDER BY "sortOrder" ASC, "createdAt" ASC, id ASC
    ) AS rn
    FROM "game_templates"
  ) sub
  WHERE rn > 1
);

-- Re-add unique constraint only if it doesn't exist (check both pg_constraint and pg_class for index)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class WHERE relname = 'game_templates_type_key'
  ) THEN
    ALTER TABLE "game_templates"
      ADD CONSTRAINT "game_templates_type_key" UNIQUE ("type");
  END IF;
END $$;

-- 5. New Game columns
ALTER TABLE "games" ADD COLUMN "presentationConfig" JSONB;
ALTER TABLE "games" ADD COLUMN "courseCompatibility" JSONB;

-- 6. Refresh canonical template names/descriptions so the hub reflects the new taxonomy.
UPDATE "game_templates" SET
  name = 'Quick Recall',
  description = 'Multiple-choice questions, optionally timed. Includes true/false as a 2-option variant.',
  "sortOrder" = 1
WHERE type = 'QUICK_RECALL';

UPDATE "game_templates" SET
  name = 'Pair Match',
  description = 'Match Arabic terms with their meanings — flip cards from memory or connect them in place.',
  "sortOrder" = 2
WHERE type = 'PAIR_MATCH';

UPDATE "game_templates" SET
  name = 'Flashcard Sprint',
  description = 'Self-rated recall: see the front, think, flip, rate. Feeds your review queue.',
  "sortOrder" = 3
WHERE type = 'FLASHCARD_SPRINT';

UPDATE "game_templates" SET
  name = 'Cloze',
  description = 'Fill in the missing words in an ayah, hadith, or sentence.',
  "sortOrder" = 4
WHERE type = 'CLOZE';

UPDATE "game_templates" SET
  name = 'Word Search',
  description = 'Find Islamic terms hidden in a letter grid.',
  "sortOrder" = 5
WHERE type = 'WORD_SEARCH';

UPDATE "game_templates" SET
  name = 'Sequence It',
  description = 'Drag items into the correct order — isnad, timeline, syntax, or narrative.',
  "sortOrder" = 6
WHERE type = 'SEQUENCE_IT';

UPDATE "game_templates" SET
  name = 'Word Scramble',
  description = 'Unscramble jumbled letters to reveal the term.',
  "sortOrder" = 7
WHERE type = 'WORD_SCRAMBLE';

UPDATE "game_templates" SET
  name = 'Calligraphy Trace',
  description = 'Trace Arabic letters and short words on a canvas.',
  "sortOrder" = 8
WHERE type = 'CALLIGRAPHY_TRACE';

UPDATE "game_templates" SET
  name = 'Fiqh Scenario',
  description = 'Work through real-life fiqh situations one decision at a time.',
  "sortOrder" = 9
WHERE type = 'FIQH_SCENARIO';
