import { PrismaClient, GameType, GameCategory, GameDifficulty, BadgeCategory, AchievementTier } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Games Seed — GameTemplates, Games, and BadgeDefinitions
 * Can be run independently with: npx ts-node --transpile-only prisma/seed-games.ts
 */

export async function seedGames() {
  console.log('🎮 Starting games seed...');
  console.log('');

  // Clean up orphaned games and sessions from previous seeds
  await prisma.gameRound.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.game.deleteMany();

  // ─── 1. GAME TEMPLATES ────────────────────────────────────────────────────

  const templateDefs = [
    // Course-integrated games
    {
      type: GameType.TERM_MATCH,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Term Match',
      description: 'Match Islamic terms with their definitions by connecting pairs on screen.',
      rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 120, medium: 90, hard: 60 }, scoringRules: { correct: 100, bonus: 50 } },
      sortOrder: 1,
    },
    {
      type: GameType.SPEED_QUIZ,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Speed Quiz',
      description: 'Answer multiple-choice questions as fast as you can — speed earns bonus points.',
      rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 30, medium: 20, hard: 10 }, scoringRules: { correct: 100, bonus: 75 } },
      sortOrder: 2,
    },
    {
      type: GameType.FLASHCARD_FLIP,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Flashcard Flip',
      description: 'Flip through Arabic-English flashcards and rate how well you know each one.',
      rules: { minContent: 4, defaultDifficulty: 'EASY', timerDefaults: { easy: 0, medium: 0, hard: 30 }, scoringRules: { correct: 50, bonus: 25 } },
      sortOrder: 3,
    },
    {
      type: GameType.WORD_SCRAMBLE,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Word Scramble',
      description: 'Unscramble the letters to spell the correct Islamic term.',
      rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 30, medium: 20, hard: 15 }, scoringRules: { correct: 100, bonus: 50 } },
      sortOrder: 4,
    },
    {
      type: GameType.FILL_IN_BLANK,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Fill in the Blank',
      description: 'Complete sentences with the missing word from the lesson.',
      rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 30, medium: 20, hard: 15 }, scoringRules: { correct: 100, bonus: 50 } },
      sortOrder: 5,
    },
    {
      type: GameType.MEMORY_MATCH,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Memory Match',
      description: 'Flip cards to find matching pairs of Arabic terms and their meanings.',
      rules: { minContent: 4, defaultDifficulty: 'EASY', timerDefaults: { easy: 180, medium: 120, hard: 90 }, scoringRules: { correct: 75, bonus: 50 } },
      sortOrder: 6,
    },
    {
      type: GameType.TRUE_FALSE,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'True or False',
      description: 'Decide whether each Islamic knowledge statement is true or false.',
      rules: { minContent: 5, defaultDifficulty: 'EASY', timerDefaults: { easy: 15, medium: 10, hard: 7 }, scoringRules: { correct: 75, bonus: 50 } },
      sortOrder: 7,
    },
    {
      type: GameType.MULTIPLE_CHOICE,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Multiple Choice',
      description: 'Pick the correct answer from four options for each question.',
      rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 20, medium: 15, hard: 10 }, scoringRules: { correct: 100, bonus: 50 } },
      sortOrder: 8,
    },
    {
      type: GameType.SENTENCE_BUILD,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Sentence Builder',
      description: 'Arrange jumbled words into the correct sentence.',
      rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 45, medium: 30, hard: 20 }, scoringRules: { correct: 100, bonus: 75 } },
      sortOrder: 9,
    },
    {
      type: GameType.LISTENING_QUIZ,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Listening Quiz',
      description: 'Listen to Arabic audio and answer questions about what you hear.',
      rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 30, medium: 20, hard: 15 }, scoringRules: { correct: 100, bonus: 75 } },
      sortOrder: 10,
    },
    {
      type: GameType.CALLIGRAPHY_TRACE,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Calligraphy Trace',
      description: 'Trace Arabic letters and words with your finger or mouse.',
      rules: { minContent: 4, defaultDifficulty: 'EASY', timerDefaults: { easy: 0, medium: 45, hard: 30 }, scoringRules: { correct: 50, bonus: 25 } },
      sortOrder: 11,
    },
    {
      type: GameType.SPELLING_BEE,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Spelling Bee',
      description: 'Read the definition and spell the transliterated term correctly.',
      rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 30, medium: 20, hard: 15 }, scoringRules: { correct: 100, bonus: 50 } },
      sortOrder: 12,
    },
    {
      type: GameType.AYAH_COMPLETION,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Ayah Completion',
      description: 'Complete the missing words in Quranic verses to test your memorisation.',
      rules: { minContent: 3, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 60, medium: 45, hard: 30 }, scoringRules: { correct: 150, bonus: 100 } },
      sortOrder: 13,
    },
    {
      type: GameType.FIQH_SCENARIO,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Fiqh Scenario',
      description: 'Read real-life scenarios and choose the correct Islamic ruling or action.',
      rules: { minContent: 4, defaultDifficulty: 'HARD', timerDefaults: { easy: 90, medium: 60, hard: 45 }, scoringRules: { correct: 200, bonus: 100 } },
      sortOrder: 14,
    },
    {
      type: GameType.HADITH_CHAIN,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Hadith Chain',
      description: 'Arrange the narrators of a hadith in the correct chain of transmission.',
      rules: { minContent: 3, defaultDifficulty: 'HARD', timerDefaults: { easy: 120, medium: 90, hard: 60 }, scoringRules: { correct: 200, bonus: 150 } },
      sortOrder: 15,
    },
    {
      type: GameType.WORD_SEARCH,
      category: GameCategory.COURSE_INTEGRATED,
      name: 'Word Search',
      description: 'Find hidden Islamic terms in a letter grid before time runs out.',
      rules: { minContent: 6, defaultDifficulty: 'EASY', timerDefaults: { easy: 180, medium: 120, hard: 90 }, scoringRules: { correct: 75, bonus: 50 } },
      sortOrder: 16,
    },

    // Standalone games
    {
      type: GameType.STORY_PUZZLE,
      category: GameCategory.STANDALONE,
      name: 'Story Puzzle',
      description: 'Arrange story segments from Islamic history in the correct order.',
      rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 300, medium: 180, hard: 120 }, scoringRules: { correct: 150, bonus: 100 } },
      sortOrder: 17,
    },
    {
      type: GameType.ESCAPE_ROOM,
      category: GameCategory.STANDALONE,
      name: 'Escape Room',
      description: 'Solve a series of Islamic knowledge puzzles to "escape" a themed room.',
      rules: { minContent: 6, defaultDifficulty: 'HARD', timerDefaults: { easy: 600, medium: 420, hard: 300 }, scoringRules: { correct: 250, bonus: 200 } },
      sortOrder: 18,
    },
    {
      type: GameType.MAZE_RUNNER,
      category: GameCategory.STANDALONE,
      name: 'Maze Runner',
      description: 'Navigate mazes by answering Islamic knowledge questions at each gate.',
      rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 300, medium: 240, hard: 180 }, scoringRules: { correct: 150, bonus: 100 } },
      sortOrder: 19,
    },
    {
      type: GameType.DAILY_CHALLENGE,
      category: GameCategory.STANDALONE,
      name: 'Daily Challenge',
      description: 'A fresh set of 10 questions every day — build your streak and earn rewards.',
      rules: { minContent: 10, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 45, medium: 30, hard: 20 }, scoringRules: { correct: 100, bonus: 100 } },
      sortOrder: 20,
    },
    {
      type: GameType.TRIVIA_BATTLE,
      category: GameCategory.STANDALONE,
      name: 'Trivia Battle',
      description: 'Compete in a timed trivia showdown covering Islamic history, Fiqh, and Aqeedah.',
      rules: { minContent: 10, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 30, medium: 20, hard: 15 }, scoringRules: { correct: 100, bonus: 50 } },
      sortOrder: 21,
    },
    {
      type: GameType.KNOWLEDGE_EXPEDITION,
      category: GameCategory.STANDALONE,
      name: 'Knowledge Expedition',
      description: 'Journey through themed knowledge zones across Islamic sciences, earning stars at each stop.',
      rules: { minContent: 8, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 60, medium: 45, hard: 30 }, scoringRules: { correct: 120, bonus: 80 } },
      sortOrder: 22,
    },
    {
      type: GameType.MAZE_NAVIGATOR,
      category: GameCategory.STANDALONE,
      name: 'Maze Navigator',
      description: 'Answer questions correctly to unlock the path through a maze and reach the goal.',
      rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 300, medium: 240, hard: 180 }, scoringRules: { correct: 150, bonus: 100 } },
      sortOrder: 23,
    },
    {
      type: GameType.MOSQUE_BUILDER,
      category: GameCategory.STANDALONE,
      name: 'Mosque Builder',
      description: 'Earn building blocks by answering questions correctly and construct your own virtual mosque.',
      rules: { minContent: 5, defaultDifficulty: 'EASY', timerDefaults: { easy: 0, medium: 0, hard: 30 }, scoringRules: { correct: 100, bonus: 75 } },
      sortOrder: 24,
    },
    {
      type: GameType.PATTERN_CREATOR,
      category: GameCategory.STANDALONE,
      name: 'Pattern Creator',
      description: 'Recognise and continue Arabic calligraphy and geometric patterns linked to Islamic art.',
      rules: { minContent: 4, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 60, medium: 45, hard: 30 }, scoringRules: { correct: 100, bonus: 50 } },
      sortOrder: 25,
    },
    {
      type: GameType.SEERAH_TIMELINE,
      category: GameCategory.STANDALONE,
      name: 'Seerah Timeline',
      description: 'Place key events from the Prophet\'s life (ﷺ) in the correct chronological order.',
      rules: { minContent: 5, defaultDifficulty: 'MEDIUM', timerDefaults: { easy: 120, medium: 90, hard: 60 }, scoringRules: { correct: 150, bonus: 100 } },
      sortOrder: 26,
    },
  ];

  let createdTemplates = 0;
  const templateMap: Record<string, string> = {};

  for (const def of templateDefs) {
    const existing = await prisma.gameTemplate.findUnique({ where: { type: def.type } });
    if (existing) {
      templateMap[def.type] = existing.id;
      continue;
    }
    const tpl = await prisma.gameTemplate.create({ data: def });
    templateMap[def.type] = tpl.id;
    createdTemplates++;
  }

  console.log(`✅ Game templates: ${createdTemplates} created, ${templateDefs.length - createdTemplates} already existed`);

  // ─── 2. GAMES ─────────────────────────────────────────────────────────────

  // Fetch the first 5 courses in DB order
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'asc' },
    take: 5,
    select: { id: true, title: true },
  });

  // Course-linked games: create one per course for each course-integrated type
  const courseLinkedTypes: { type: GameType; difficulty: GameDifficulty }[] = [
    { type: GameType.TERM_MATCH,       difficulty: GameDifficulty.EASY   },
    { type: GameType.SPEED_QUIZ,       difficulty: GameDifficulty.MEDIUM },
    { type: GameType.FLASHCARD_FLIP,   difficulty: GameDifficulty.EASY   },
    { type: GameType.WORD_SCRAMBLE,    difficulty: GameDifficulty.MEDIUM },
    { type: GameType.FILL_IN_BLANK,    difficulty: GameDifficulty.MEDIUM },
    { type: GameType.MEMORY_MATCH,     difficulty: GameDifficulty.EASY   },
    { type: GameType.TRUE_FALSE,       difficulty: GameDifficulty.EASY   },
    { type: GameType.MULTIPLE_CHOICE,  difficulty: GameDifficulty.MEDIUM },
    { type: GameType.SENTENCE_BUILD,   difficulty: GameDifficulty.MEDIUM },
    { type: GameType.LISTENING_QUIZ,   difficulty: GameDifficulty.MEDIUM },
    { type: GameType.CALLIGRAPHY_TRACE, difficulty: GameDifficulty.EASY  },
    { type: GameType.SPELLING_BEE,     difficulty: GameDifficulty.MEDIUM },
    { type: GameType.AYAH_COMPLETION,  difficulty: GameDifficulty.MEDIUM },
    { type: GameType.FIQH_SCENARIO,    difficulty: GameDifficulty.HARD   },
    { type: GameType.HADITH_CHAIN,     difficulty: GameDifficulty.HARD   },
    { type: GameType.WORD_SEARCH,      difficulty: GameDifficulty.EASY   },
  ];

  let createdGames = 0;

  for (const course of courses) {
    for (const { type, difficulty } of courseLinkedTypes) {
      const templateId = templateMap[type];
      if (!templateId) continue;

      const existing = await prisma.game.findFirst({
        where: { templateId, courseId: course.id, difficulty },
      });
      if (existing) continue;

      await prisma.game.create({
        data: { templateId, courseId: course.id, difficulty, isActive: true },
      });
      createdGames++;
    }
  }

  // ─── Flashcard-rich course games ───────────────────────────────────────────
  // Some game types need flashcards but the first 5 courses have none.
  // Find courses with enough flashcard content and create games for FC-dependent types.
  const flashcardTypes: { type: GameType; difficulty: GameDifficulty; minFC: number }[] = [
    { type: GameType.FLASHCARD_FLIP, difficulty: GameDifficulty.EASY,   minFC: 5 },
    { type: GameType.SENTENCE_BUILD, difficulty: GameDifficulty.MEDIUM, minFC: 4 },
    { type: GameType.AYAH_COMPLETION, difficulty: GameDifficulty.MEDIUM, minFC: 3 },
    { type: GameType.HADITH_CHAIN,   difficulty: GameDifficulty.HARD,   minFC: 4 },
  ];

  const fcRichCourses = await prisma.course.findMany({
    where: {
      units: { some: { flashCards: { some: {} } } },
    },
    select: { id: true, title: true },
    orderBy: { createdAt: 'asc' },
    take: 3,
  });

  for (const course of fcRichCourses) {
    for (const { type, difficulty } of flashcardTypes) {
      const templateId = templateMap[type];
      if (!templateId) continue;
      const existing = await prisma.game.findFirst({
        where: { templateId, courseId: course.id, difficulty },
      });
      if (existing) continue;
      await prisma.game.create({
        data: { templateId, courseId: course.id, difficulty, isActive: true },
      });
      createdGames++;
    }
  }

  // Standalone games (no courseId)
  const standaloneSpecs: { type: GameType; difficulty: GameDifficulty }[] = [
    { type: GameType.DAILY_CHALLENGE,      difficulty: GameDifficulty.MEDIUM },
    { type: GameType.ESCAPE_ROOM,          difficulty: GameDifficulty.HARD   },
    { type: GameType.MAZE_RUNNER,          difficulty: GameDifficulty.MEDIUM },
    { type: GameType.MAZE_NAVIGATOR,       difficulty: GameDifficulty.MEDIUM },
    { type: GameType.KNOWLEDGE_EXPEDITION, difficulty: GameDifficulty.EASY   },
    { type: GameType.TRIVIA_BATTLE,        difficulty: GameDifficulty.MEDIUM },
    { type: GameType.STORY_PUZZLE,         difficulty: GameDifficulty.MEDIUM },
    { type: GameType.MOSQUE_BUILDER,       difficulty: GameDifficulty.EASY   },
    { type: GameType.SEERAH_TIMELINE,      difficulty: GameDifficulty.MEDIUM },
    { type: GameType.PATTERN_CREATOR,      difficulty: GameDifficulty.MEDIUM },
  ];

  for (const { type, difficulty } of standaloneSpecs) {
    const templateId = templateMap[type];
    if (!templateId) continue;

    const existing = await prisma.game.findFirst({
      where: { templateId, courseId: null, difficulty },
    });
    if (existing) continue;

    await prisma.game.create({
      data: { templateId, difficulty, isActive: true },
    });
    createdGames++;
  }

  console.log(`✅ Games: ${createdGames} created`);

  // ─── 3. BADGE DEFINITIONS ─────────────────────────────────────────────────

  const badgeDefs = [
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
      description: 'Complete 25 Speed Quiz games.',
      category: BadgeCategory.MASTERY,
      tier: AchievementTier.GOLD,
      criteria: { type: 'count', field: 'gamesCompletedByType', gameType: 'SPEED_QUIZ', threshold: 25 },
      xpReward: 300,
      sortOrder: 6,
    },
    {
      key: 'vocabulary_scholar',
      name: 'Vocabulary Scholar',
      description: 'Complete 20 Term Match games.',
      category: BadgeCategory.MASTERY,
      tier: AchievementTier.SILVER,
      criteria: { type: 'count', field: 'gamesCompletedByType', gameType: 'TERM_MATCH', threshold: 20 },
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
      key: 'escape_artist',
      name: 'Escape Artist',
      description: 'Successfully escape from 5 Escape Room challenges.',
      category: BadgeCategory.EXPLORER,
      tier: AchievementTier.GOLD,
      criteria: { type: 'count', field: 'gamesCompletedByType', gameType: 'ESCAPE_ROOM', threshold: 5 },
      xpReward: 350,
      sortOrder: 9,
    },
    {
      key: 'speed_demon',
      name: 'Speed Demon',
      description: 'Answer 10 questions correctly in under 5 seconds each in Speed Quiz.',
      category: BadgeCategory.SPEED,
      tier: AchievementTier.PLATINUM,
      criteria: { type: 'speed', field: 'avgTimePerCorrectAnswerMs', gameType: 'SPEED_QUIZ', threshold: 5000 },
      xpReward: 500,
      sortOrder: 10,
    },
  ];

  let createdBadges = 0;
  for (const def of badgeDefs) {
    const existing = await prisma.badgeDefinition.findUnique({ where: { key: def.key } });
    if (existing) continue;
    await prisma.badgeDefinition.create({ data: def });
    createdBadges++;
  }

  console.log(`✅ Badge definitions: ${createdBadges} created`);
  console.log('');
  console.log('🎮 Games seed completed!');
}

// ─── Standalone entrypoint (only when run directly) ─────────────────────────

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
