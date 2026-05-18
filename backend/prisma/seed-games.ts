import { PrismaClient, GameType, GameCategory, GameDifficulty, BadgeCategory, AchievementTier, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Games Seed — GameTemplates, Games, and BadgeDefinitions
 *
 * Run independently with: npx ts-node --transpile-only prisma/seed-games.ts
 *
 * Post game-engine collapse (May 2026): only the 9 canonical GameType values
 * are seeded. Course attachment is decided at launch time via the
 * /games/:slug/eligible-courses endpoint, so we no longer pre-create one
 * Game row per (course, type) combination. Instead we seed one Game per
 * template (templateId acts as the "slug" the launcher routes by).
 */

type TemplateDef = {
  type: GameType;
  category: GameCategory;
  name: string;
  description: string;
  rules: Prisma.InputJsonValue;
  sortOrder: number;
  defaultDifficulty: GameDifficulty;
  presentationConfig?: Prisma.InputJsonValue;
  courseCompatibility?: Prisma.InputJsonValue;
};

const TEMPLATE_DEFS: TemplateDef[] = [
  {
    type: GameType.QUICK_RECALL,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Quick Recall',
    description: 'Rapid-fire multiple-choice and true/false questions. Speed earns bonus points.',
    rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 30, medium: 20, hard: 10 }, scoringRules: { correct: 100, bonus: 75 } },
    sortOrder: 1,
    defaultDifficulty: GameDifficulty.MEDIUM,
    presentationConfig: { showTimer: true, allowTrueFalse: true },
    courseCompatibility: { requires: ['questions'], minItems: 5 },
  },
  {
    type: GameType.PAIR_MATCH,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Pair Match',
    description: 'Match Arabic terms with their English meanings — drag pairs together.',
    rules: { minContent: 4, defaultDifficulty: 'EASY', timerDefaults: { easy: 120, medium: 90, hard: 60 }, scoringRules: { correct: 100, bonus: 50 } },
    sortOrder: 2,
    defaultDifficulty: GameDifficulty.EASY,
    presentationConfig: { showTimer: true, pairsPerRound: 6 },
    courseCompatibility: { requires: ['arabicTerms', 'flashCards'], minItems: 4 },
  },
  {
    type: GameType.FLASHCARD_SPRINT,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Flashcard Sprint',
    description: 'Flip through flashcards and rate how well you know each one. Drives spaced repetition.',
    rules: { minContent: 4, defaultDifficulty: 'EASY', timerDefaults: { easy: 0, medium: 0, hard: 30 }, scoringRules: { correct: 50, bonus: 25 } },
    sortOrder: 3,
    defaultDifficulty: GameDifficulty.EASY,
    presentationConfig: { showTimer: false, srsEnabled: true },
    courseCompatibility: { requires: ['flashCards'], minItems: 4 },
  },
  {
    type: GameType.CLOZE,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Fill the Blank',
    description: 'Complete sentences from your lessons with the missing word or phrase.',
    rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 45, medium: 30, hard: 20 }, scoringRules: { correct: 100, bonus: 50 } },
    sortOrder: 4,
    defaultDifficulty: GameDifficulty.MEDIUM,
    presentationConfig: { showTimer: true, blanksPerRound: 1 },
    courseCompatibility: { requires: ['questions', 'flashCards'], minItems: 5 },
  },
  {
    type: GameType.WORD_SEARCH,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Word Search',
    description: 'Find Arabic and Islamic vocabulary words hidden in a letter grid.',
    rules: { minContent: 6, defaultDifficulty: 'EASY', timerDefaults: { easy: 240, medium: 180, hard: 120 }, scoringRules: { correct: 50, bonus: 100 } },
    sortOrder: 5,
    defaultDifficulty: GameDifficulty.EASY,
    presentationConfig: { gridSize: 12, allowDiagonals: true },
    courseCompatibility: { requires: ['arabicTerms', 'flashCards'], minItems: 6 },
  },
  {
    type: GameType.SEQUENCE_IT,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Sequence It',
    description: 'Arrange events, ayat, or steps in the correct order — Seerah timelines, du\u2018a steps, wudu order.',
    rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 120, medium: 90, hard: 60 }, scoringRules: { correct: 100, bonus: 75 } },
    sortOrder: 6,
    defaultDifficulty: GameDifficulty.MEDIUM,
    presentationConfig: { itemsPerRound: 5 },
    courseCompatibility: { requires: ['questions'], minItems: 4 },
  },
  {
    type: GameType.WORD_SCRAMBLE,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Word Scramble',
    description: 'Unscramble the letters to spell the correct Arabic or Islamic term.',
    rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 45, medium: 30, hard: 20 }, scoringRules: { correct: 100, bonus: 50 } },
    sortOrder: 7,
    defaultDifficulty: GameDifficulty.MEDIUM,
    presentationConfig: { showHint: true },
    courseCompatibility: { requires: ['arabicTerms', 'flashCards'], minItems: 4 },
  },
  {
    type: GameType.CALLIGRAPHY_TRACE,
    category: GameCategory.STANDALONE,
    name: 'Calligraphy Trace',
    description: 'Trace Arabic letters and words with your finger or stylus to practice writing.',
    rules: { minContent: 3, defaultDifficulty: 'EASY', timerDefaults: { easy: 0, medium: 0, hard: 60 }, scoringRules: { correct: 75, bonus: 50 } },
    sortOrder: 8,
    defaultDifficulty: GameDifficulty.EASY,
    presentationConfig: { strokeWidth: 8, showGuideLines: true },
    courseCompatibility: { requires: ['arabicTerms'], minItems: 3 },
  },
  {
    type: GameType.FIQH_SCENARIO,
    category: GameCategory.COURSE_INTEGRATED,
    name: 'Fiqh Scenario',
    description: 'Real-life Islamic rulings — read the scenario, pick the correct fiqh decision.',
    rules: { minContent: 3, defaultDifficulty: 'HARD', timerDefaults: { easy: 60, medium: 45, hard: 30 }, scoringRules: { correct: 150, bonus: 100 } },
    sortOrder: 9,
    defaultDifficulty: GameDifficulty.HARD,
    presentationConfig: { showRationale: true, branchedOutcomes: true },
    courseCompatibility: { requires: ['questions'], minItems: 3 },
  },
];

const BADGE_DEFS = [
  {
    key: 'first_game_played',
    name: 'First Step',
    description: 'Play your very first game on the platform.',
    category: BadgeCategory.EXPLORER,
    tier: AchievementTier.BRONZE,
    criteria: { type: 'count', field: 'gamesCompleted', threshold: 1 },
    xpReward: 25,
    sortOrder: 1,
  },
  {
    key: 'first_perfect_score',
    name: 'Flawless',
    description: 'Achieve a perfect score (100% accuracy) in any game.',
    category: BadgeCategory.MASTERY,
    tier: AchievementTier.SILVER,
    criteria: { type: 'accuracy', field: 'accuracy', threshold: 1.0 },
    xpReward: 100,
    sortOrder: 2,
  },
  {
    key: 'streak_3_day',
    name: '3-Day Streak',
    description: 'Play at least one game on 3 consecutive days.',
    category: BadgeCategory.STREAK,
    tier: AchievementTier.BRONZE,
    criteria: { type: 'streak', field: 'dailyStreakDays', threshold: 3 },
    xpReward: 50,
    sortOrder: 3,
  },
  {
    key: 'streak_7_day',
    name: 'Week Warrior',
    description: 'Maintain a 7-day game-play streak.',
    category: BadgeCategory.STREAK,
    tier: AchievementTier.SILVER,
    criteria: { type: 'streak', field: 'dailyStreakDays', threshold: 7 },
    xpReward: 150,
    sortOrder: 4,
  },
  {
    key: 'streak_30_day',
    name: 'Monthly Devotion',
    description: 'Keep a 30-day game-play streak going.',
    category: BadgeCategory.STREAK,
    tier: AchievementTier.GOLD,
    criteria: { type: 'streak', field: 'dailyStreakDays', threshold: 30 },
    xpReward: 500,
    sortOrder: 5,
  },
  {
    key: 'quiz_master',
    name: 'Quiz Master',
    description: 'Complete 25 Quick Recall games.',
    category: BadgeCategory.MASTERY,
    tier: AchievementTier.GOLD,
    criteria: { type: 'count', field: 'gamesCompletedByType', gameType: 'QUICK_RECALL', threshold: 25 },
    xpReward: 300,
    sortOrder: 6,
  },
  {
    key: 'vocabulary_scholar',
    name: 'Vocabulary Scholar',
    description: 'Complete 20 Pair Match games.',
    category: BadgeCategory.MASTERY,
    tier: AchievementTier.SILVER,
    criteria: { type: 'count', field: 'gamesCompletedByType', gameType: 'PAIR_MATCH', threshold: 20 },
    xpReward: 200,
    sortOrder: 7,
  },
  {
    key: 'daily_challenger',
    name: 'Daily Challenger',
    description: 'Complete the Daily Challenge 7 days in a row.',
    category: BadgeCategory.SPECIAL,
    tier: AchievementTier.GOLD,
    criteria: { type: 'streak', field: 'dailyChallengeStreak', threshold: 7 },
    xpReward: 250,
    sortOrder: 8,
  },
  {
    key: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 10 questions correctly in under 5 seconds each in Quick Recall.',
    category: BadgeCategory.SPEED,
    tier: AchievementTier.PLATINUM,
    criteria: { type: 'speed', field: 'avgTimePerCorrectAnswerMs', gameType: 'QUICK_RECALL', threshold: 5000 },
    xpReward: 500,
    sortOrder: 9,
  },
  {
    key: 'calligrapher',
    name: 'Master Calligrapher',
    description: 'Complete 15 Calligraphy Trace sessions with 90%+ stroke accuracy.',
    category: BadgeCategory.MASTERY,
    tier: AchievementTier.GOLD,
    criteria: { type: 'count', field: 'gamesCompletedByType', gameType: 'CALLIGRAPHY_TRACE', threshold: 15 },
    xpReward: 300,
    sortOrder: 10,
  },
];

export async function seedGames() {
  console.log('🎮 Starting games seed (9-type taxonomy)...');

  // Wipe old games/sessions so we can re-seed cleanly. Templates are upserted.
  await prisma.gameRound.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.game.deleteMany();

  // ─── 1. GAME TEMPLATES ────────────────────────────────────────────────────

  const templateMap: Record<string, string> = {};
  let createdTemplates = 0;

  for (const def of TEMPLATE_DEFS) {
    const existing = await prisma.gameTemplate.findUnique({ where: { type: def.type } });
    if (existing) {
      // Keep schema in sync if details changed
      const updated = await prisma.gameTemplate.update({
        where: { id: existing.id },
        data: {
          category: def.category,
          name: def.name,
          description: def.description,
          rules: def.rules,
          sortOrder: def.sortOrder,
        },
      });
      templateMap[def.type] = updated.id;
      continue;
    }
    const tpl = await prisma.gameTemplate.create({
      data: {
        type: def.type,
        category: def.category,
        name: def.name,
        description: def.description,
        rules: def.rules,
        sortOrder: def.sortOrder,
      },
    });
    templateMap[def.type] = tpl.id;
    createdTemplates++;
  }

  console.log(`✅ Game templates: ${createdTemplates} created, ${TEMPLATE_DEFS.length - createdTemplates} updated`);

  // ─── 2. GAMES ─────────────────────────────────────────────────────────────
  // One Game row per template (no per-course pre-attachment). Courses are
  // selected at launch via /games/:slug/eligible-courses.

  let createdGames = 0;
  for (const def of TEMPLATE_DEFS) {
    const templateId = templateMap[def.type];
    if (!templateId) continue;

    await prisma.game.create({
      data: {
        templateId,
        difficulty: def.defaultDifficulty,
        isActive: true,
        presentationConfig: def.presentationConfig ?? Prisma.JsonNull,
        courseCompatibility: def.courseCompatibility ?? Prisma.JsonNull,
      },
    });
    createdGames++;
  }
  console.log(`✅ Games: ${createdGames} created (one per template)`);

  // ─── 3. BADGE DEFINITIONS ─────────────────────────────────────────────────

  let createdBadges = 0;
  for (const def of BADGE_DEFS) {
    const existing = await prisma.badgeDefinition.findUnique({ where: { key: def.key } });
    if (existing) continue;
    await prisma.badgeDefinition.create({ data: def });
    createdBadges++;
  }
  console.log(`✅ Badge definitions: ${createdBadges} created`);

  console.log('🎮 Games seed completed!');
}

// ─── Standalone entrypoint ──────────────────────────────────────────────────

if (require.main === module) {
  seedGames()
    .catch((e) => {
      console.error('❌ Games seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
