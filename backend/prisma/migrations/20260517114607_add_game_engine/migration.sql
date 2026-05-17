-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('TERM_MATCH', 'AYAH_COMPLETION', 'FIQH_SCENARIO', 'HADITH_CHAIN', 'WORD_SEARCH', 'SPEED_QUIZ', 'FLASHCARD_FLIP', 'DAILY_CHALLENGE', 'KNOWLEDGE_EXPEDITION', 'TRIVIA_BATTLE', 'MOSQUE_BUILDER', 'PATTERN_CREATOR', 'SEERAH_TIMELINE', 'ESCAPE_ROOM', 'MAZE_NAVIGATOR');

-- CreateEnum
CREATE TYPE "GameCategory" AS ENUM ('COURSE_INTEGRATED', 'STANDALONE');

-- CreateEnum
CREATE TYPE "GameDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "GameSessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'TIMED_OUT');

-- CreateEnum
CREATE TYPE "AchievementTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('STREAK', 'MASTERY', 'EXPLORER', 'SPEED', 'BUILDER', 'SOCIAL', 'SPECIAL');

-- CreateEnum
CREATE TYPE "LeaderboardScope" AS ENUM ('FAMILY', 'GLOBAL');

-- CreateEnum
CREATE TYPE "LeaderboardPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME');

-- CreateTable
CREATE TABLE "game_templates" (
    "id" TEXT NOT NULL,
    "type" "GameType" NOT NULL,
    "category" "GameCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "rules" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "difficulty" "GameDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateId" TEXT NOT NULL,
    "courseId" TEXT,
    "unitId" TEXT,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" TEXT NOT NULL,
    "status" "GameSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "difficulty" "GameDifficulty" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "streakBest" INTEGER NOT NULL DEFAULT 0,
    "timeSpentMs" INTEGER NOT NULL DEFAULT 0,
    "roundsTotal" INTEGER NOT NULL DEFAULT 0,
    "roundsCorrect" INTEGER NOT NULL DEFAULT 0,
    "livesUsed" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_rounds" (
    "id" TEXT NOT NULL,
    "roundIndex" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "playerAnswer" JSONB,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "timeSpentMs" INTEGER NOT NULL DEFAULT 0,
    "srsRating" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "game_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_scores" (
    "id" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "timeSpentMs" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "bonuses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "game_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge_definitions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "category" "BadgeCategory" NOT NULL,
    "tier" "AchievementTier" NOT NULL,
    "criteria" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboards" (
    "id" TEXT NOT NULL,
    "scope" "LeaderboardScope" NOT NULL,
    "period" "LeaderboardPeriod" NOT NULL,
    "gameType" "GameType",
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_entries" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaderboardId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_challenges" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "difficulty" "GameDifficulty" NOT NULL,
    "contentIds" JSONB NOT NULL,
    "seed" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_challenge_attempts" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "timeSpentMs" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "challengeId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "daily_challenge_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_streak_records" (
    "id" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" DATE NOT NULL,
    "gracePeriodUsed" BOOLEAN NOT NULL DEFAULT false,
    "freezesRemaining" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "memberId" TEXT NOT NULL,

    CONSTRAINT "user_streak_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streak_achievements" (
    "id" TEXT NOT NULL,
    "streakCount" INTEGER NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streakRecordId" TEXT NOT NULL,

    CONSTRAINT "streak_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_parental_settings" (
    "id" TEXT NOT NULL,
    "dailyLimitMinutes" INTEGER NOT NULL DEFAULT 30,
    "weekendLimitMinutes" INTEGER NOT NULL DEFAULT 60,
    "allowedGameTypes" "GameType"[] DEFAULT ARRAY[]::"GameType"[],
    "maxDifficulty" "GameDifficulty" NOT NULL DEFAULT 'EASY',
    "enforceAfterHour" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familyMemberId" TEXT NOT NULL,

    CONSTRAINT "game_parental_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_time_logs" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "minutesPlayed" INTEGER NOT NULL DEFAULT 0,
    "sessionsPlayed" INTEGER NOT NULL DEFAULT 0,
    "lastSessionEndedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "familyMemberId" TEXT NOT NULL,

    CONSTRAINT "game_time_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_templates_type_key" ON "game_templates"("type");

-- CreateIndex
CREATE INDEX "game_templates_category_idx" ON "game_templates"("category");

-- CreateIndex
CREATE INDEX "game_templates_isActive_idx" ON "game_templates"("isActive");

-- CreateIndex
CREATE INDEX "games_templateId_idx" ON "games"("templateId");

-- CreateIndex
CREATE INDEX "games_courseId_idx" ON "games"("courseId");

-- CreateIndex
CREATE INDEX "games_unitId_idx" ON "games"("unitId");

-- CreateIndex
CREATE INDEX "games_difficulty_idx" ON "games"("difficulty");

-- CreateIndex
CREATE INDEX "game_sessions_gameId_idx" ON "game_sessions"("gameId");

-- CreateIndex
CREATE INDEX "game_sessions_memberId_idx" ON "game_sessions"("memberId");

-- CreateIndex
CREATE INDEX "game_sessions_status_idx" ON "game_sessions"("status");

-- CreateIndex
CREATE INDEX "game_sessions_startedAt_idx" ON "game_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "game_sessions_memberId_gameId_idx" ON "game_sessions"("memberId", "gameId");

-- CreateIndex
CREATE INDEX "game_rounds_sessionId_idx" ON "game_rounds"("sessionId");

-- CreateIndex
CREATE INDEX "game_rounds_contentType_contentId_idx" ON "game_rounds"("contentType", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "game_scores_sessionId_key" ON "game_scores"("sessionId");

-- CreateIndex
CREATE INDEX "game_scores_memberId_idx" ON "game_scores"("memberId");

-- CreateIndex
CREATE INDEX "game_scores_createdAt_idx" ON "game_scores"("createdAt");

-- CreateIndex
CREATE INDEX "game_scores_memberId_createdAt_idx" ON "game_scores"("memberId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "badge_definitions_key_key" ON "badge_definitions"("key");

-- CreateIndex
CREATE INDEX "badge_definitions_category_idx" ON "badge_definitions"("category");

-- CreateIndex
CREATE INDEX "badge_definitions_tier_idx" ON "badge_definitions"("tier");

-- CreateIndex
CREATE INDEX "user_badges_memberId_idx" ON "user_badges"("memberId");

-- CreateIndex
CREATE INDEX "user_badges_badgeId_idx" ON "user_badges"("badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_memberId_badgeId_key" ON "user_badges"("memberId", "badgeId");

-- CreateIndex
CREATE INDEX "user_achievements_memberId_idx" ON "user_achievements"("memberId");

-- CreateIndex
CREATE INDEX "user_achievements_type_idx" ON "user_achievements"("type");

-- CreateIndex
CREATE INDEX "user_achievements_earnedAt_idx" ON "user_achievements"("earnedAt");

-- CreateIndex
CREATE INDEX "leaderboards_scope_period_idx" ON "leaderboards"("scope", "period");

-- CreateIndex
CREATE INDEX "leaderboards_isActive_idx" ON "leaderboards"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_scope_period_gameType_startDate_key" ON "leaderboards"("scope", "period", "gameType", "startDate");

-- CreateIndex
CREATE INDEX "leaderboard_entries_leaderboardId_rank_idx" ON "leaderboard_entries"("leaderboardId", "rank");

-- CreateIndex
CREATE INDEX "leaderboard_entries_memberId_idx" ON "leaderboard_entries"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_entries_leaderboardId_memberId_key" ON "leaderboard_entries"("leaderboardId", "memberId");

-- CreateIndex
CREATE INDEX "daily_challenges_date_idx" ON "daily_challenges"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenges_date_difficulty_key" ON "daily_challenges"("date", "difficulty");

-- CreateIndex
CREATE INDEX "daily_challenge_attempts_challengeId_idx" ON "daily_challenge_attempts"("challengeId");

-- CreateIndex
CREATE INDEX "daily_challenge_attempts_memberId_idx" ON "daily_challenge_attempts"("memberId");

-- CreateIndex
CREATE INDEX "daily_challenge_attempts_completedAt_idx" ON "daily_challenge_attempts"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenge_attempts_challengeId_memberId_key" ON "daily_challenge_attempts"("challengeId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "user_streak_records_memberId_key" ON "user_streak_records"("memberId");

-- CreateIndex
CREATE INDEX "user_streak_records_memberId_idx" ON "user_streak_records"("memberId");

-- CreateIndex
CREATE INDEX "user_streak_records_currentStreak_idx" ON "user_streak_records"("currentStreak");

-- CreateIndex
CREATE INDEX "streak_achievements_streakRecordId_idx" ON "streak_achievements"("streakRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "streak_achievements_streakRecordId_streakCount_key" ON "streak_achievements"("streakRecordId", "streakCount");

-- CreateIndex
CREATE UNIQUE INDEX "game_parental_settings_familyMemberId_key" ON "game_parental_settings"("familyMemberId");

-- CreateIndex
CREATE INDEX "game_parental_settings_familyMemberId_idx" ON "game_parental_settings"("familyMemberId");

-- CreateIndex
CREATE INDEX "game_parental_settings_isActive_idx" ON "game_parental_settings"("isActive");

-- CreateIndex
CREATE INDEX "game_time_logs_familyMemberId_date_idx" ON "game_time_logs"("familyMemberId", "date");

-- CreateIndex
CREATE INDEX "game_time_logs_date_idx" ON "game_time_logs"("date");

-- CreateIndex
CREATE UNIQUE INDEX "game_time_logs_familyMemberId_date_key" ON "game_time_logs"("familyMemberId", "date");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "game_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_scores" ADD CONSTRAINT "game_scores_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_scores" ADD CONSTRAINT "game_scores_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badge_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_leaderboardId_fkey" FOREIGN KEY ("leaderboardId") REFERENCES "leaderboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_challenge_attempts" ADD CONSTRAINT "daily_challenge_attempts_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "daily_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_challenge_attempts" ADD CONSTRAINT "daily_challenge_attempts_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_streak_records" ADD CONSTRAINT "user_streak_records_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_achievements" ADD CONSTRAINT "streak_achievements_streakRecordId_fkey" FOREIGN KEY ("streakRecordId") REFERENCES "user_streak_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_parental_settings" ADD CONSTRAINT "game_parental_settings_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_time_logs" ADD CONSTRAINT "game_time_logs_familyMemberId_fkey" FOREIGN KEY ("familyMemberId") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
