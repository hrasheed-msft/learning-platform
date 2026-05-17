import prisma from '../config/database';
import { GameType, GameDifficulty, GameSessionStatus, FlashCardStatus, ActivityEventType } from '@prisma/client';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/error.middleware';
import { calculateNextReview } from './flashcard/sm2-algorithm.service';
import { recordActivity } from './activity.service';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONTENT_REQUIREMENTS: Record<string, { minArabicTerms: number; minFlashcards: number; minQuestions: number }> = {
  TERM_MATCH:           { minArabicTerms: 4,  minFlashcards: 0, minQuestions: 0 },
  AYAH_COMPLETION:      { minArabicTerms: 0,  minFlashcards: 3, minQuestions: 0 },
  FIQH_SCENARIO:        { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  HADITH_CHAIN:         { minArabicTerms: 0,  minFlashcards: 4, minQuestions: 0 },
  WORD_SEARCH:          { minArabicTerms: 6,  minFlashcards: 0, minQuestions: 0 },
  SPEED_QUIZ:           { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 10 },
  FLASHCARD_FLIP:       { minArabicTerms: 0,  minFlashcards: 5, minQuestions: 0 },
  DAILY_CHALLENGE:      { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  KNOWLEDGE_EXPEDITION: { minArabicTerms: 0,  minFlashcards: 5, minQuestions: 5 },
  TRIVIA_BATTLE:        { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 20 },
  MOSQUE_BUILDER:       { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  PATTERN_CREATOR:      { minArabicTerms: 0,  minFlashcards: 5, minQuestions: 0 },
  SEERAH_TIMELINE:      { minArabicTerms: 0,  minFlashcards: 8, minQuestions: 0 },
  ESCAPE_ROOM:          { minArabicTerms: 0,  minFlashcards: 3, minQuestions: 3 },
  MAZE_NAVIGATOR:       { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 10 },
};

const ROUNDS_BY_DIFFICULTY: Record<string, number> = {
  EASY: 5,
  MEDIUM: 10,
  HARD: 15,
};

const TIMER_CONFIGS: Record<string, Record<string, { type: string; durationMs: number }>> = {
  TERM_MATCH:      { EASY: { type: 'NONE', durationMs: 0 },     MEDIUM: { type: 'GLOBAL', durationMs: 90000 },  HARD: { type: 'GLOBAL', durationMs: 60000 } },
  SPEED_QUIZ:      { EASY: { type: 'PER_QUESTION', durationMs: 15000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 10000 }, HARD: { type: 'PER_QUESTION', durationMs: 7000 } },
  FLASHCARD_FLIP:  { EASY: { type: 'NONE', durationMs: 0 },     MEDIUM: { type: 'NONE', durationMs: 0 },        HARD: { type: 'NONE', durationMs: 0 } },
  DAILY_CHALLENGE: { EASY: { type: 'PER_QUESTION', durationMs: 20000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 15000 }, HARD: { type: 'PER_QUESTION', durationMs: 10000 } },
  WORD_SEARCH:     { EASY: { type: 'GLOBAL', durationMs: 300000 }, MEDIUM: { type: 'GLOBAL', durationMs: 180000 }, HARD: { type: 'GLOBAL', durationMs: 120000 } },
};

const BASE_POINTS = 100;
const SPEED_BONUS_MAX = 50;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ContentItem {
  contentType: 'QUESTION' | 'FLASHCARD' | 'ARABIC_TERM';
  contentId: string;
  content: Record<string, unknown>;
}

interface ParentalCheckResult {
  allowed: boolean;
  reason?: string;
}

// ---------------------------------------------------------------------------
// Helper functions (module-private)
// ---------------------------------------------------------------------------

function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

function calculateRoundScore(
  isCorrect: boolean,
  timeSpentMs: number,
  timerDurationMs: number,
  currentStreak: number,
  _gameType: GameType,
): number {
  if (!isCorrect) return 0;

  let points = BASE_POINTS;

  // Speed bonus: remaining time percentage × 50
  if (timerDurationMs > 0 && timeSpentMs < timerDurationMs) {
    const remaining = (timerDurationMs - timeSpentMs) / timerDurationMs;
    points += Math.round(remaining * SPEED_BONUS_MAX);
  }

  // Streak multiplier
  points = Math.round(points * getStreakMultiplier(currentStreak));

  return points;
}

function computeSrsRating(isCorrect: boolean, timeSpentMs: number, difficulty: GameDifficulty): number {
  if (!isCorrect) return 2;

  // Fast and correct → higher rating
  const thresholdMs = difficulty === 'EASY' ? 10000 : difficulty === 'MEDIUM' ? 7000 : 5000;
  if (timeSpentMs <= thresholdMs * 0.5) return 5;
  if (timeSpentMs <= thresholdMs) return 4;
  return 3;
}

function computeStars(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  const pct = score / maxScore;
  if (pct >= 0.9) return 3;
  if (pct >= 0.75) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Build content pool and select `roundCount` items, prioritising SRS-due → wrong → unseen → random. */
async function selectContent(
  gameType: GameType,
  memberId: string,
  unitId: string | undefined,
  courseId: string | undefined,
  difficulty: GameDifficulty,
  roundCount: number,
): Promise<ContentItem[]> {
  const req = CONTENT_REQUIREMENTS[gameType];
  if (!req) throw new BadRequestError(`Unknown game type: ${gameType}`);

  const items: ContentItem[] = [];

  // Determine which unit IDs to scope content to
  let unitIds: string[] = [];
  if (unitId) {
    unitIds = [unitId];
  } else if (courseId) {
    const units = await prisma.unit.findMany({ where: { courseId }, select: { id: true } });
    unitIds = units.map((u) => u.id);
  }

  const unitFilter = unitIds.length > 0 ? { unitId: { in: unitIds } } : {};

  // ---------- Questions ----------
  if (req.minQuestions > 0) {
    const questions = await prisma.question.findMany({
      where: { ...unitFilter, difficulty: difficulty as string },
      orderBy: { createdAt: 'desc' },
      take: roundCount * 2,
    });
    for (const q of questions) {
      items.push({
        contentType: 'QUESTION',
        contentId: q.id,
        content: {
          type: q.type,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        },
      });
    }
  }

  // ---------- FlashCards ----------
  if (req.minFlashcards > 0) {
    // Prioritise SRS-due cards
    const now = new Date();
    const dueProgress = await prisma.flashCardProgress.findMany({
      where: {
        memberId,
        nextReviewDate: { lte: now },
        flashCard: unitIds.length > 0 ? { unitId: { in: unitIds } } : undefined,
      },
      include: { flashCard: true },
      orderBy: { nextReviewDate: 'asc' },
      take: roundCount,
    });

    for (const p of dueProgress) {
      items.push({
        contentType: 'FLASHCARD',
        contentId: p.flashCard.id,
        content: {
          front: p.flashCard.front,
          back: p.flashCard.back,
          frontArabic: p.flashCard.frontArabic,
          backArabic: p.flashCard.backArabic,
        },
      });
    }

    // Fill remaining with unseen / random flashcards
    if (items.filter((i) => i.contentType === 'FLASHCARD').length < roundCount) {
      const existingIds = items.filter((i) => i.contentType === 'FLASHCARD').map((i) => i.contentId);
      const extra = await prisma.flashCard.findMany({
        where: {
          ...(unitIds.length > 0 ? { unitId: { in: unitIds } } : {}),
          id: { notIn: existingIds },
        },
        take: roundCount - existingIds.length,
      });
      for (const fc of extra) {
        items.push({
          contentType: 'FLASHCARD',
          contentId: fc.id,
          content: {
            front: fc.front,
            back: fc.back,
            frontArabic: fc.frontArabic,
            backArabic: fc.backArabic,
          },
        });
      }
    }
  }

  // ---------- Arabic Terms ----------
  if (req.minArabicTerms > 0) {
    const terms = await prisma.arabicTerm.findMany({
      where: unitFilter,
      take: roundCount * 2,
    });
    for (const t of terms) {
      items.push({
        contentType: 'ARABIC_TERM',
        contentId: t.id,
        content: {
          arabicText: t.arabicText,
          transliteration: t.transliteration,
          translation: t.translation,
          audioUrl: t.audioUrl,
        },
      });
    }
  }

  // For mixed-content games (e.g. KNOWLEDGE_EXPEDITION, ESCAPE_ROOM), items already contain both types

  // Shuffle (Fisher-Yates) then take roundCount
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items.slice(0, roundCount);
}

async function checkContentAvailability(
  gameType: GameType,
  unitId?: string,
  courseId?: string,
  _memberId?: string,
): Promise<{ available: boolean; missing?: string }> {
  const req = CONTENT_REQUIREMENTS[gameType];
  if (!req) return { available: false, missing: `Unknown game type: ${gameType}` };

  let unitIds: string[] = [];
  if (unitId) {
    unitIds = [unitId];
  } else if (courseId) {
    const units = await prisma.unit.findMany({ where: { courseId }, select: { id: true } });
    unitIds = units.map((u) => u.id);
  }

  const unitFilter = unitIds.length > 0 ? { unitId: { in: unitIds } } : {};

  if (req.minArabicTerms > 0) {
    const count = await prisma.arabicTerm.count({ where: unitFilter });
    if (count < req.minArabicTerms) {
      return { available: false, missing: `Need ${req.minArabicTerms} Arabic terms, found ${count}` };
    }
  }

  if (req.minFlashcards > 0) {
    const count = await prisma.flashCard.count({
      where: unitIds.length > 0 ? { unitId: { in: unitIds } } : {},
    });
    if (count < req.minFlashcards) {
      return { available: false, missing: `Need ${req.minFlashcards} flashcards, found ${count}` };
    }
  }

  if (req.minQuestions > 0) {
    const count = await prisma.question.count({ where: unitFilter });
    if (count < req.minQuestions) {
      return { available: false, missing: `Need ${req.minQuestions} questions, found ${count}` };
    }
  }

  return { available: true };
}

async function writeSrsUpdates(
  rounds: Array<{ contentType: string; contentId: string; isCorrect: boolean | null; timeSpentMs: number | null; srsRating: number | null }>,
  memberId: string,
): Promise<void> {
  const flashcardRounds = rounds.filter((r) => r.contentType === 'FLASHCARD' && r.isCorrect !== null);

  for (const round of flashcardRounds) {
    const rating = round.srsRating ?? (round.isCorrect ? 4 : 2);

    // Get or create progress
    let progress = await prisma.flashCardProgress.findUnique({
      where: { memberId_flashCardId: { memberId, flashCardId: round.contentId } },
    });

    if (!progress) {
      progress = await prisma.flashCardProgress.create({
        data: {
          memberId,
          flashCardId: round.contentId,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          status: 'NEW' as FlashCardStatus,
        },
      });
    }

    const result = calculateNextReview({
      easeFactor: progress.easeFactor,
      interval: progress.interval,
      repetitions: progress.repetitions,
      rating,
      currentStatus: progress.status,
    });

    await prisma.flashCardProgress.update({
      where: { id: progress.id },
      data: {
        easeFactor: result.easeFactor,
        interval: result.interval,
        repetitions: result.repetitions,
        nextReviewDate: result.nextReviewDate,
        status: result.status,
        lastRating: rating,
        totalReviews: { increment: 1 },
        correctReviews: round.isCorrect ? { increment: 1 } : undefined,
      },
    });
  }
}

async function updateStreak(memberId: string): Promise<void> {
  const today = startOfDay();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let streak = await prisma.userStreakRecord.findUnique({
    where: { memberId },
  });

  if (!streak) {
    streak = await prisma.userStreakRecord.create({
      data: { memberId, currentStreak: 1, longestStreak: 1, lastActivityDate: today },
    });
    await prisma.familyMember.update({
      where: { id: memberId },
      data: { currentStreak: 1, longestStreak: { increment: 0 } },
    });
    return;
  }

  const lastDate = startOfDay(streak.lastActivityDate);

  if (lastDate.getTime() === today.getTime()) {
    // Already active today — no change
    return;
  }

  if (lastDate.getTime() === yesterday.getTime()) {
    // Consecutive day
    const newStreak = streak.currentStreak + 1;
    const newLongest = Math.max(newStreak, streak.longestStreak);
    await prisma.userStreakRecord.update({
      where: { id: streak.id },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActivityDate: today,
        gracePeriodUsed: false,
      },
    });
    await prisma.familyMember.update({
      where: { id: memberId },
      data: { currentStreak: newStreak, longestStreak: newLongest },
    });
    return;
  }

  // Check if exactly 1 day gap and grace not yet used
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  if (lastDate.getTime() === twoDaysAgo.getTime() && !streak.gracePeriodUsed) {
    // Grace period: keep streak, mark grace used
    const newStreak = streak.currentStreak + 1;
    const newLongest = Math.max(newStreak, streak.longestStreak);
    await prisma.userStreakRecord.update({
      where: { id: streak.id },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActivityDate: today,
        gracePeriodUsed: true,
      },
    });
    await prisma.familyMember.update({
      where: { id: memberId },
      data: { currentStreak: newStreak, longestStreak: newLongest },
    });
    return;
  }

  // 2+ day gap — reset streak to 1
  await prisma.userStreakRecord.update({
    where: { id: streak.id },
    data: {
      currentStreak: 1,
      longestStreak: streak.longestStreak,
      lastActivityDate: today,
      gracePeriodUsed: false,
    },
  });
  await prisma.familyMember.update({
    where: { id: memberId },
    data: { currentStreak: 1 },
  });
}

async function checkParentalControls(
  memberId: string,
  gameType: GameType,
  difficulty: GameDifficulty,
): Promise<ParentalCheckResult> {
  const settings = await prisma.gameParentalSettings.findUnique({
    where: { familyMemberId: memberId },
  });

  if (!settings || !settings.isActive) {
    return { allowed: true };
  }

  // Check allowed game types
  if (settings.allowedGameTypes.length > 0 && !settings.allowedGameTypes.includes(gameType)) {
    return { allowed: false, reason: `Game type ${gameType} is not allowed by parental settings` };
  }

  // Check max difficulty
  const difficultyRank: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
  if (difficultyRank[difficulty] > difficultyRank[settings.maxDifficulty]) {
    return { allowed: false, reason: `Difficulty ${difficulty} exceeds max allowed ${settings.maxDifficulty}` };
  }

  // Check time budget
  const remaining = await getRemainingTime(memberId);
  if (remaining !== null && remaining <= 0) {
    return { allowed: false, reason: 'Daily game time limit has been reached' };
  }

  return { allowed: true };
}

async function updateTimeLog(memberId: string, durationMinutes: number): Promise<void> {
  const dateStr = todayDateString();

  await prisma.gameTimeLog.upsert({
    where: { familyMemberId_date: { familyMemberId: memberId, date: dateStr } },
    create: {
      familyMemberId: memberId,
      date: dateStr,
      minutesPlayed: durationMinutes,
      sessionsPlayed: 1,
      lastSessionEndedAt: new Date(),
    },
    update: {
      minutesPlayed: { increment: durationMinutes },
      sessionsPlayed: { increment: 1 },
      lastSessionEndedAt: new Date(),
    },
  });
}

async function getRemainingTime(memberId: string): Promise<number | null> {
  const settings = await prisma.gameParentalSettings.findUnique({
    where: { familyMemberId: memberId },
  });

  if (!settings || !settings.isActive) return null; // No limit

  const isWeekend = [0, 6].includes(new Date().getDay());
  const limit = isWeekend ? settings.weekendLimitMinutes : settings.dailyLimitMinutes;

  const log = await prisma.gameTimeLog.findUnique({
    where: { familyMemberId_date: { familyMemberId: memberId, date: todayDateString() } },
  });

  const played = log?.minutesPlayed ?? 0;
  return Math.max(0, limit - played);
}

// ---------------------------------------------------------------------------
// GameService
// ---------------------------------------------------------------------------

export class GameService {
  /**
   * List game templates with content availability, last played, and best score info.
   */
  static async getAvailableGames(
    memberId: string,
    filters?: { courseId?: string; unitId?: string; category?: string },
  ) {
    const templates = await prisma.gameTemplate.findMany({
      where: {
        isActive: true,
        ...(filters?.category ? { category: filters.category as any } : {}),
      },
      include: {
        games: {
          where: {
            isActive: true,
            ...(filters?.courseId ? { courseId: filters.courseId } : {}),
            ...(filters?.unitId ? { unitId: filters.unitId } : {}),
          },
          include: {
            sessions: {
              where: { memberId },
              orderBy: { startedAt: 'desc' },
              take: 1,
              select: { startedAt: true, score: true, status: true },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const results = [];

    for (const template of templates) {
      const availability = await checkContentAvailability(
        template.type,
        filters?.unitId,
        filters?.courseId,
        memberId,
      );

      // Best score across all sessions for this game type
      const bestScore = await prisma.gameScore.findFirst({
        where: {
          memberId,
          session: { game: { template: { type: template.type } } },
        },
        orderBy: { totalScore: 'desc' },
        select: { totalScore: true, accuracy: true, createdAt: true },
      });

      const lastSession = template.games
        .flatMap((g) => g.sessions)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

      results.push({
        templateId: template.id,
        type: template.type,
        category: template.category,
        name: template.name,
        description: template.description,
        iconUrl: template.iconUrl,
        rules: template.rules,
        available: availability.available,
        unavailableReason: availability.missing,
        games: template.games.map((g) => ({
          id: g.id,
          difficulty: g.difficulty,
          courseId: g.courseId,
          unitId: g.unitId,
        })),
        lastPlayed: lastSession?.startedAt ?? null,
        bestScore: bestScore
          ? { totalScore: bestScore.totalScore, accuracy: bestScore.accuracy, date: bestScore.createdAt }
          : null,
      });
    }

    return results;
  }

  /** Games available for a specific unit. */
  static async getGamesForUnit(unitId: string, memberId: string) {
    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) throw new NotFoundError(`Unit ${unitId} not found`);

    return GameService.getAvailableGames(memberId, { unitId });
  }

  /** Games available for a course. */
  static async getGamesForCourse(courseId: string, memberId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundError(`Course ${courseId} not found`);

    return GameService.getAvailableGames(memberId, { courseId });
  }

  /** Standalone / hub games (no course/unit binding). */
  static async getStandaloneGames(memberId: string) {
    return GameService.getAvailableGames(memberId, { category: 'STANDALONE' });
  }

  /**
   * Create a game session: check parental controls, select content, generate rounds.
   */
  static async startGame(params: {
    memberId: string;
    gameType: GameType;
    gameId?: string;
    unitId?: string;
    courseId?: string;
    difficulty: GameDifficulty;
  }) {
    const { memberId, gameType, gameId, unitId, courseId, difficulty } = params;

    // 1. Parental controls
    const parentalCheck = await checkParentalControls(memberId, gameType, difficulty);
    if (!parentalCheck.allowed) {
      throw new ForbiddenError(parentalCheck.reason ?? 'Game not allowed by parental settings');
    }

    // 2. Resolve or find Game record
    let game;
    if (gameId) {
      game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { template: true },
      });
      if (!game) throw new NotFoundError(`Game ${gameId} not found`);
    } else {
      // Find or create a matching Game for this template/unit/course/difficulty
      const template = await prisma.gameTemplate.findUnique({ where: { type: gameType } });
      if (!template) throw new NotFoundError(`Game template for type ${gameType} not found`);

      game = await prisma.game.findFirst({
        where: {
          templateId: template.id,
          difficulty,
          ...(unitId ? { unitId } : {}),
          ...(courseId ? { courseId } : {}),
          isActive: true,
        },
        include: { template: true },
      });

      if (!game) {
        game = await prisma.game.create({
          data: {
            templateId: template.id,
            difficulty,
            unitId: unitId ?? null,
            courseId: courseId ?? null,
          },
          include: { template: true },
        });
      }
    }

    // 3. Check content availability
    const availability = await checkContentAvailability(gameType, unitId ?? game.unitId ?? undefined, courseId ?? game.courseId ?? undefined, memberId);
    if (!availability.available) {
      throw new BadRequestError(availability.missing ?? 'Not enough content for this game');
    }

    // 4. Select content
    const roundCount = ROUNDS_BY_DIFFICULTY[difficulty] ?? 10;
    const contentItems = await selectContent(
      gameType,
      memberId,
      unitId ?? game.unitId ?? undefined,
      courseId ?? game.courseId ?? undefined,
      difficulty,
      roundCount,
    );

    if (contentItems.length === 0) {
      throw new BadRequestError('No content available for this game configuration');
    }

    // 5. Create session and rounds
    const maxScore = contentItems.length * (BASE_POINTS + SPEED_BONUS_MAX) * 3; // theoretical max with highest streak

    const session = await prisma.gameSession.create({
      data: {
        gameId: game.id,
        memberId,
        status: 'IN_PROGRESS' as GameSessionStatus,
        difficulty,
        score: 0,
        maxScore,
        accuracy: 0,
        streakBest: 0,
        timeSpentMs: 0,
        roundsTotal: contentItems.length,
        roundsCorrect: 0,
        livesUsed: 0,
        metadata: {},
        rounds: {
          create: contentItems.map((item, index) => ({
            roundIndex: index,
            contentType: item.contentType,
            contentId: item.contentId,
            metadata: item.content as any,
          })),
        },
      },
      include: {
        rounds: { orderBy: { roundIndex: 'asc' } },
      },
    });

    // Timer / lives config
    const timerConfig = TIMER_CONFIGS[gameType]?.[difficulty] ?? { type: 'NONE', durationMs: 0 };

    return {
      session,
      config: {
        timer: timerConfig,
        totalRounds: contentItems.length,
        difficulty,
        gameType,
      },
    };
  }

  /**
   * Submit an answer for a single round.
   */
  static async submitRound(
    sessionId: string,
    roundId: string,
    answer: unknown,
    timeSpentMs: number,
  ) {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { game: { include: { template: true } }, rounds: { orderBy: { roundIndex: 'asc' } } },
    });

    if (!session) throw new NotFoundError(`Session ${sessionId} not found`);
    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestError(`Session is ${session.status}, cannot submit rounds`);
    }

    const round = session.rounds.find((r) => r.id === roundId);
    if (!round) throw new NotFoundError(`Round ${roundId} not found in session`);
    if (round.playerAnswer !== null) {
      throw new BadRequestError('Round already answered');
    }

    // Grade the answer
    const isCorrect = await gradeAnswer(round, answer);

    // Compute current streak from preceding rounds
    let currentStreak = 0;
    const sortedRounds = session.rounds.filter((r) => r.playerAnswer !== null).sort((a, b) => a.roundIndex - b.roundIndex);
    for (let i = sortedRounds.length - 1; i >= 0; i--) {
      if (sortedRounds[i].isCorrect) currentStreak++;
      else break;
    }
    if (isCorrect) currentStreak++;

    // Timer duration for speed bonus
    const gameType = session.game.template.type;
    const timerConfig = TIMER_CONFIGS[gameType]?.[session.difficulty] ?? { type: 'NONE', durationMs: 0 };
    const timerDurationMs = timerConfig.type === 'PER_QUESTION' ? timerConfig.durationMs : timerConfig.durationMs;

    const points = calculateRoundScore(isCorrect, timeSpentMs, timerDurationMs, currentStreak, gameType);
    const srsRating = computeSrsRating(isCorrect, timeSpentMs, session.difficulty);

    // Update round
    const updatedRound = await prisma.gameRound.update({
      where: { id: roundId },
      data: {
        playerAnswer: answer as any,
        isCorrect,
        pointsEarned: points,
        timeSpentMs,
        srsRating,
      },
    });

    // Update session running totals
    const newScore = session.score + points;
    const newCorrect = session.roundsCorrect + (isCorrect ? 1 : 0);
    const answeredCount = sortedRounds.length + 1;
    const newAccuracy = answeredCount > 0 ? (newCorrect / answeredCount) * 100 : 0;
    const newStreakBest = Math.max(session.streakBest, currentStreak);
    const newTimeSpent = session.timeSpentMs + timeSpentMs;

    await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        score: newScore,
        roundsCorrect: newCorrect,
        accuracy: newAccuracy,
        streakBest: newStreakBest,
        timeSpentMs: newTimeSpent,
      },
    });

    return {
      round: updatedRound,
      isCorrect,
      pointsEarned: points,
      currentStreak: isCorrect ? currentStreak : 0,
      runningScore: newScore,
      roundsRemaining: session.roundsTotal - answeredCount,
    };
  }

  /**
   * Finalise a game session: score, SRS writeback, streak, activity, XP.
   */
  static async completeGame(sessionId: string, reason?: string) {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        game: { include: { template: true } },
        rounds: true,
        member: true,
      },
    });

    if (!session) throw new NotFoundError(`Session ${sessionId} not found`);
    if (session.status === 'COMPLETED') {
      throw new BadRequestError('Session already completed');
    }

    const finalStatus: GameSessionStatus = reason === 'TIMED_OUT' ? 'TIMED_OUT' : reason === 'ABANDONED' ? 'ABANDONED' : 'COMPLETED';
    const stars = computeStars(session.score, session.maxScore);
    const xpEarned = Math.round(session.score * 0.1) + stars * 25;

    // Update session
    const updatedSession = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: finalStatus,
        completedAt: new Date(),
      },
    });

    // Create GameScore
    const gameScore = await prisma.gameScore.create({
      data: {
        sessionId,
        memberId: session.memberId,
        totalScore: session.score,
        accuracy: session.accuracy,
        timeSpentMs: session.timeSpentMs,
        xpEarned,
        bonuses: {
          stars,
          streakBest: session.streakBest,
          reason: reason ?? null,
        },
      },
    });

    // SRS writeback for flashcard rounds
    await writeSrsUpdates(
      session.rounds.map((r) => ({
        contentType: r.contentType,
        contentId: r.contentId,
        isCorrect: r.isCorrect,
        timeSpentMs: r.timeSpentMs,
        srsRating: r.srsRating,
      })),
      session.memberId,
    );

    // Update streak
    await updateStreak(session.memberId);

    // Award XP
    await prisma.familyMember.update({
      where: { id: session.memberId },
      data: { totalPoints: { increment: xpEarned } },
    });

    // Update time log
    const durationMinutes = Math.ceil(session.timeSpentMs / 60000);
    await updateTimeLog(session.memberId, durationMinutes);

    // Record activity event
    await recordActivity(session.memberId, session.member.familyId, ActivityEventType.GAME_PLAYED, {
      gameType: session.game.template.type,
      sessionId,
      score: session.score,
      accuracy: session.accuracy,
      stars,
      xpEarned,
    });

    return {
      session: updatedSession,
      score: gameScore,
      stars,
      xpEarned,
    };
  }

  /** Get a session with its rounds. */
  static async getSession(sessionId: string) {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        game: { include: { template: true } },
        rounds: { orderBy: { roundIndex: 'asc' } },
        gameScore: true,
      },
    });

    if (!session) throw new NotFoundError(`Session ${sessionId} not found`);
    return session;
  }

  /** Paginated game scores for a member. */
  static async getScores(
    memberId: string,
    filters?: { gameType?: string; page?: number; limit?: number },
  ) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = { memberId };
    if (filters?.gameType) {
      where.session = { game: { template: { type: filters.gameType as GameType } } };
    }

    const [scores, total] = await Promise.all([
      prisma.gameScore.findMany({
        where,
        include: {
          session: {
            include: { game: { include: { template: { select: { type: true, name: true } } } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gameScore.count({ where }),
    ]);

    return {
      scores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** Family leaderboard computed from GameScore aggregation. */
  static async getLeaderboard(
    gameType: string | null,
    familyId: string,
    period?: string,
  ) {
    // Date range by period
    let dateFrom: Date | undefined;
    const now = new Date();
    switch (period) {
      case 'DAILY':
        dateFrom = startOfDay(now);
        break;
      case 'WEEKLY': {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        dateFrom = startOfDay(d);
        break;
      }
      case 'MONTHLY': {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 1);
        dateFrom = startOfDay(d);
        break;
      }
      default:
        // ALL_TIME
        break;
    }

    // Get family members
    const members = await prisma.familyMember.findMany({
      where: { familyId },
      select: { id: true, name: true, avatarUrl: true },
    });

    const memberIds = members.map((m) => m.id);

    const scoreWhere: any = { memberId: { in: memberIds } };
    if (dateFrom) scoreWhere.createdAt = { gte: dateFrom };
    if (gameType) scoreWhere.session = { game: { template: { type: gameType as GameType } } };

    const scores = await prisma.gameScore.findMany({
      where: scoreWhere,
      select: { memberId: true, totalScore: true, accuracy: true },
    });

    // Aggregate per member
    const agg = new Map<string, { totalScore: number; gamesPlayed: number; accuracySum: number }>();
    for (const s of scores) {
      const entry = agg.get(s.memberId) ?? { totalScore: 0, gamesPlayed: 0, accuracySum: 0 };
      entry.totalScore += s.totalScore;
      entry.gamesPlayed += 1;
      entry.accuracySum += s.accuracy;
      agg.set(s.memberId, entry);
    }

    const leaderboard = members
      .map((m) => {
        const stats = agg.get(m.id);
        return {
          memberId: m.id,
          name: m.name,
          avatarUrl: m.avatarUrl,
          totalScore: stats?.totalScore ?? 0,
          gamesPlayed: stats?.gamesPlayed ?? 0,
          averageAccuracy: stats && stats.gamesPlayed > 0 ? Math.round(stats.accuracySum / stats.gamesPlayed) : 0,
        };
      })
      .filter((e) => e.gamesPlayed > 0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({ rank: index + 1, ...entry }));

    return { leaderboard, period: period ?? 'ALL_TIME', gameType };
  }

  /** Get or create today's daily challenge. */
  static async getDailyChallenge(memberId: string) {
    const today = todayDateString();
    const todayDate = new Date(today);

    // Deterministic seed from date
    const seed = parseInt(today.replace(/-/g, ''), 10);

    let challenge = await prisma.dailyChallenge.findFirst({
      where: { date: todayDate, isActive: true },
      include: {
        attempts: { where: { memberId }, take: 1 },
      },
    });

    if (!challenge) {
      // Create today's challenge — select content deterministically
      const questions = await prisma.question.findMany({
        orderBy: { createdAt: 'asc' },
        take: 200,
        select: { id: true },
      });

      // Seeded deterministic shuffle
      const shuffled = [...questions];
      let s = seed;
      for (let i = shuffled.length - 1; i > 0; i--) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const j = s % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const contentIds = shuffled.slice(0, 10).map((q) => q.id);
      const difficulty: GameDifficulty = 'MEDIUM';

      challenge = await prisma.dailyChallenge.create({
        data: {
          date: todayDate,
          difficulty,
          contentIds: contentIds as any,
          seed,
        },
        include: {
          attempts: { where: { memberId }, take: 1 },
        },
      });
    }

    const attempted = challenge.attempts.length > 0;

    // Streak info
    const streak = await prisma.userStreakRecord.findUnique({ where: { memberId } });

    // Load content for the challenge
    const contentIds = challenge.contentIds as string[];
    const questions = await prisma.question.findMany({
      where: { id: { in: contentIds } },
    });

    return {
      challenge: {
        id: challenge.id,
        date: challenge.date,
        difficulty: challenge.difficulty,
        seed: challenge.seed,
      },
      content: questions.map((q) => ({
        contentId: q.id,
        type: q.type,
        questionText: q.questionText,
        options: q.options,
        // Don't send correctAnswer before submission
        ...(attempted ? { correctAnswer: q.correctAnswer, explanation: q.explanation } : {}),
      })),
      attempted,
      attemptScore: challenge.attempts[0]?.score ?? null,
      streak: {
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
      },
    };
  }

  /** Submit a daily challenge attempt: grade, record, and update streak. */
  static async submitDailyChallengeAttempt(
    challengeId: string,
    memberId: string,
    answers: Array<{ contentId: string; answer: string; timeSpentMs: number }>,
  ) {
    const challenge = await prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) throw new NotFoundError(`Daily challenge ${challengeId} not found`);

    // Check for existing attempt
    const existing = await prisma.dailyChallengeAttempt.findUnique({
      where: { challengeId_memberId: { challengeId, memberId } },
    });
    if (existing) throw new BadRequestError('Daily challenge already attempted');

    // Load questions for grading
    const contentIds = answers.map((a) => a.contentId);
    const questions = await prisma.question.findMany({
      where: { id: { in: contentIds } },
    });
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let correctCount = 0;
    let totalTimeMs = 0;
    const gradedAnswers = answers.map((a) => {
      const question = questionMap.get(a.contentId);
      const isCorrect = question
        ? a.answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
        : false;
      if (isCorrect) correctCount++;
      totalTimeMs += a.timeSpentMs;
      return {
        contentId: a.contentId,
        answer: a.answer,
        isCorrect,
        timeSpentMs: a.timeSpentMs,
        correctAnswer: question?.correctAnswer ?? null,
      };
    });

    const score = Math.round((correctCount / Math.max(answers.length, 1)) * 100);
    const accuracy = answers.length > 0 ? (correctCount / answers.length) * 100 : 0;

    const attempt = await prisma.dailyChallengeAttempt.create({
      data: {
        challengeId,
        memberId,
        score,
        accuracy,
        timeSpentMs: totalTimeMs,
        answers: gradedAnswers as any,
        completedAt: new Date(),
      },
    });

    // Update streak
    await updateStreak(memberId);

    // Record activity
    const member = await prisma.familyMember.findUnique({
      where: { id: memberId },
      select: { familyId: true },
    });
    if (member) {
      await recordActivity(memberId, member.familyId, ActivityEventType.GAME_PLAYED, {
        gameType: 'DAILY_CHALLENGE',
        challengeId,
        score,
        accuracy,
      });
    }

    return {
      attempt,
      results: gradedAnswers,
      score,
      accuracy,
      correctCount,
      totalQuestions: answers.length,
    };
  }
}

// ---------------------------------------------------------------------------
// Grading helper (module-private)
// ---------------------------------------------------------------------------

async function gradeAnswer(
  round: { contentType: string; contentId: string; metadata: unknown },
  answer: unknown,
): Promise<boolean> {
  const answerStr = typeof answer === 'string' ? answer.trim().toLowerCase() : JSON.stringify(answer);

  if (round.contentType === 'QUESTION') {
    const question = await prisma.question.findUnique({ where: { id: round.contentId } });
    if (!question) return false;
    return answerStr === question.correctAnswer.trim().toLowerCase();
  }

  if (round.contentType === 'FLASHCARD') {
    const flashcard = await prisma.flashCard.findUnique({ where: { id: round.contentId } });
    if (!flashcard) return false;
    // Accept back (translation) or backArabic
    const acceptable = [flashcard.back, flashcard.backArabic].filter(Boolean).map((s) => s!.trim().toLowerCase());
    return acceptable.includes(answerStr);
  }

  if (round.contentType === 'ARABIC_TERM') {
    const term = await prisma.arabicTerm.findUnique({ where: { id: round.contentId } });
    if (!term) return false;
    // Accept translation or transliteration
    const acceptable = [term.translation, term.transliteration].map((s) => s.trim().toLowerCase());
    return acceptable.includes(answerStr);
  }

  return false;
}
