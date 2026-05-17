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
  SPEED_QUIZ:           { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  FLASHCARD_FLIP:       { minArabicTerms: 0,  minFlashcards: 5, minQuestions: 0 },
  DAILY_CHALLENGE:      { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  KNOWLEDGE_EXPEDITION: { minArabicTerms: 0,  minFlashcards: 5, minQuestions: 5 },
  TRIVIA_BATTLE:        { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 10 },
  MOSQUE_BUILDER:       { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  PATTERN_CREATOR:      { minArabicTerms: 0,  minFlashcards: 5, minQuestions: 0 },
  SEERAH_TIMELINE:      { minArabicTerms: 0,  minFlashcards: 8, minQuestions: 0 },
  ESCAPE_ROOM:          { minArabicTerms: 0,  minFlashcards: 3, minQuestions: 3 },
  MAZE_NAVIGATOR:       { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  // New types with frontend UI support
  WORD_SCRAMBLE:        { minArabicTerms: 4,  minFlashcards: 0, minQuestions: 0 },
  FILL_IN_BLANK:        { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  MEMORY_MATCH:         { minArabicTerms: 4,  minFlashcards: 0, minQuestions: 0 },
  TRUE_FALSE:           { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  MULTIPLE_CHOICE:      { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
  SENTENCE_BUILD:       { minArabicTerms: 0,  minFlashcards: 4, minQuestions: 0 },
  LISTENING_QUIZ:       { minArabicTerms: 4,  minFlashcards: 0, minQuestions: 0 },
  CALLIGRAPHY_TRACE:    { minArabicTerms: 4,  minFlashcards: 0, minQuestions: 0 },
  SPELLING_BEE:         { minArabicTerms: 4,  minFlashcards: 0, minQuestions: 0 },
  STORY_PUZZLE:         { minArabicTerms: 0,  minFlashcards: 4, minQuestions: 0 },
  MAZE_RUNNER:          { minArabicTerms: 0,  minFlashcards: 0, minQuestions: 5 },
};

const ROUNDS_BY_DIFFICULTY: Record<string, number> = {
  EASY: 5,
  MEDIUM: 10,
  HARD: 15,
};

const TIMER_CONFIGS: Record<string, Record<string, { type: string; durationMs: number }>> = {
  TERM_MATCH:           { EASY: { type: 'NONE', durationMs: 0 },            MEDIUM: { type: 'GLOBAL', durationMs: 90000 },       HARD: { type: 'GLOBAL', durationMs: 60000 } },
  SPEED_QUIZ:           { EASY: { type: 'PER_QUESTION', durationMs: 15000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 10000 }, HARD: { type: 'PER_QUESTION', durationMs: 7000 } },
  FLASHCARD_FLIP:       { EASY: { type: 'NONE', durationMs: 0 },            MEDIUM: { type: 'NONE', durationMs: 0 },              HARD: { type: 'NONE', durationMs: 0 } },
  DAILY_CHALLENGE:      { EASY: { type: 'PER_QUESTION', durationMs: 20000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 15000 }, HARD: { type: 'PER_QUESTION', durationMs: 10000 } },
  WORD_SEARCH:          { EASY: { type: 'GLOBAL', durationMs: 300000 },     MEDIUM: { type: 'GLOBAL', durationMs: 180000 },       HARD: { type: 'GLOBAL', durationMs: 120000 } },
  AYAH_COMPLETION:      { EASY: { type: 'PER_QUESTION', durationMs: 60000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 45000 }, HARD: { type: 'PER_QUESTION', durationMs: 30000 } },
  FIQH_SCENARIO:        { EASY: { type: 'PER_QUESTION', durationMs: 90000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 60000 }, HARD: { type: 'PER_QUESTION', durationMs: 45000 } },
  HADITH_CHAIN:         { EASY: { type: 'GLOBAL', durationMs: 120000 },     MEDIUM: { type: 'GLOBAL', durationMs: 90000 },        HARD: { type: 'GLOBAL', durationMs: 60000 } },
  KNOWLEDGE_EXPEDITION: { EASY: { type: 'PER_QUESTION', durationMs: 60000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 45000 }, HARD: { type: 'PER_QUESTION', durationMs: 30000 } },
  TRIVIA_BATTLE:        { EASY: { type: 'PER_QUESTION', durationMs: 30000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 20000 }, HARD: { type: 'PER_QUESTION', durationMs: 15000 } },
  MOSQUE_BUILDER:       { EASY: { type: 'NONE', durationMs: 0 },            MEDIUM: { type: 'NONE', durationMs: 0 },              HARD: { type: 'PER_QUESTION', durationMs: 30000 } },
  PATTERN_CREATOR:      { EASY: { type: 'PER_QUESTION', durationMs: 60000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 45000 }, HARD: { type: 'PER_QUESTION', durationMs: 30000 } },
  SEERAH_TIMELINE:      { EASY: { type: 'GLOBAL', durationMs: 120000 },     MEDIUM: { type: 'GLOBAL', durationMs: 90000 },        HARD: { type: 'GLOBAL', durationMs: 60000 } },
  ESCAPE_ROOM:          { EASY: { type: 'GLOBAL', durationMs: 600000 },     MEDIUM: { type: 'GLOBAL', durationMs: 420000 },       HARD: { type: 'GLOBAL', durationMs: 300000 } },
  MAZE_NAVIGATOR:       { EASY: { type: 'GLOBAL', durationMs: 300000 },     MEDIUM: { type: 'GLOBAL', durationMs: 240000 },       HARD: { type: 'GLOBAL', durationMs: 180000 } },
  // New types
  WORD_SCRAMBLE:        { EASY: { type: 'PER_QUESTION', durationMs: 30000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 20000 }, HARD: { type: 'PER_QUESTION', durationMs: 15000 } },
  FILL_IN_BLANK:        { EASY: { type: 'PER_QUESTION', durationMs: 30000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 20000 }, HARD: { type: 'PER_QUESTION', durationMs: 15000 } },
  MEMORY_MATCH:         { EASY: { type: 'GLOBAL', durationMs: 180000 },     MEDIUM: { type: 'GLOBAL', durationMs: 120000 },       HARD: { type: 'GLOBAL', durationMs: 90000 } },
  TRUE_FALSE:           { EASY: { type: 'PER_QUESTION', durationMs: 15000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 10000 }, HARD: { type: 'PER_QUESTION', durationMs: 7000 } },
  MULTIPLE_CHOICE:      { EASY: { type: 'PER_QUESTION', durationMs: 20000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 15000 }, HARD: { type: 'PER_QUESTION', durationMs: 10000 } },
  SENTENCE_BUILD:       { EASY: { type: 'PER_QUESTION', durationMs: 45000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 30000 }, HARD: { type: 'PER_QUESTION', durationMs: 20000 } },
  LISTENING_QUIZ:       { EASY: { type: 'PER_QUESTION', durationMs: 30000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 20000 }, HARD: { type: 'PER_QUESTION', durationMs: 15000 } },
  CALLIGRAPHY_TRACE:    { EASY: { type: 'NONE', durationMs: 0 },            MEDIUM: { type: 'PER_QUESTION', durationMs: 45000 }, HARD: { type: 'PER_QUESTION', durationMs: 30000 } },
  SPELLING_BEE:         { EASY: { type: 'PER_QUESTION', durationMs: 30000 }, MEDIUM: { type: 'PER_QUESTION', durationMs: 20000 }, HARD: { type: 'PER_QUESTION', durationMs: 15000 } },
  STORY_PUZZLE:         { EASY: { type: 'GLOBAL', durationMs: 300000 },     MEDIUM: { type: 'GLOBAL', durationMs: 180000 },       HARD: { type: 'GLOBAL', durationMs: 120000 } },
  MAZE_RUNNER:          { EASY: { type: 'GLOBAL', durationMs: 300000 },     MEDIUM: { type: 'GLOBAL', durationMs: 240000 },       HARD: { type: 'GLOBAL', durationMs: 180000 } },
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
    // Try exact difficulty first, fallback to any difficulty if no match
    let questions = await prisma.question.findMany({
      where: { ...unitFilter, difficulty: difficulty as string },
      orderBy: { createdAt: 'desc' },
      take: roundCount * 2,
    });
    if (questions.length === 0) {
      questions = await prisma.question.findMany({
        where: unitFilter,
        orderBy: { createdAt: 'desc' },
        take: roundCount * 2,
      });
    }
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

// ---------------------------------------------------------------------------
// Game-type-specific round formatting
// ---------------------------------------------------------------------------

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate word search grid containing the given words.
 * Returns the grid (2D char array) and the placed words with positions.
 */
function generateWordSearchGrid(words: string[], gridSize: number): { grid: string[][]; placements: Array<{ word: string; row: number; col: number; direction: string }> } {
  const grid: string[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  const placements: Array<{ word: string; row: number; col: number; direction: string }> = [];
  const directions = [
    { dr: 0, dc: 1, name: 'RIGHT' },
    { dr: 1, dc: 0, name: 'DOWN' },
    { dr: 1, dc: 1, name: 'DIAGONAL_DOWN_RIGHT' },
  ];

  for (const rawWord of words) {
    const word = rawWord.toUpperCase().replace(/[^A-Z]/g, '');
    if (word.length === 0 || word.length > gridSize) continue;

    let placed = false;
    for (let attempts = 0; attempts < 50 && !placed; attempts++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const maxRow = gridSize - (dir.dr === 0 ? 1 : word.length);
      const maxCol = gridSize - (dir.dc === 0 ? 1 : word.length);
      if (maxRow < 0 || maxCol < 0) continue;

      const startRow = Math.floor(Math.random() * (maxRow + 1));
      const startCol = Math.floor(Math.random() * (maxCol + 1));

      let canPlace = true;
      for (let k = 0; k < word.length; k++) {
        const r = startRow + k * dir.dr;
        const c = startCol + k * dir.dc;
        if (grid[r][c] !== '' && grid[r][c] !== word[k]) { canPlace = false; break; }
      }

      if (canPlace) {
        for (let k = 0; k < word.length; k++) {
          grid[startRow + k * dir.dr][startCol + k * dir.dc] = word[k];
        }
        placements.push({ word, row: startRow, col: startCol, direction: dir.name });
        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') grid[r][c] = alphabet[Math.floor(Math.random() * 26)];
    }
  }
  return { grid, placements };
}

/**
 * Transform raw content items into game-type-specific round metadata.
 * Returns an array of round data objects with `metadata` shaped for the frontend.
 */
function formatRoundsForGameType(
  gameType: GameType,
  items: ContentItem[],
  difficulty: GameDifficulty,
): Array<{ contentType: string; contentId: string; metadata: Record<string, unknown> }> {
  switch (gameType) {
    // ── TERM_MATCH: All items become a single matching round ──
    case 'TERM_MATCH': {
      const pairs = items.map((item) => {
        const c = item.content as any;
        return {
          id: item.contentId,
          term: c.arabicText || c.front || '',
          transliteration: c.transliteration || '',
          definition: c.translation || c.back || '',
        };
      });
      // Single round containing all pairs
      return [{
        contentType: items[0]?.contentType ?? 'ARABIC_TERM',
        contentId: items.map((i) => i.contentId).join(','),
        metadata: {
          gameMode: 'TERM_MATCH',
          pairs,
          shuffledTerms: shuffleArray(pairs.map((p) => ({ id: p.id, term: p.term, transliteration: p.transliteration }))),
          shuffledDefinitions: shuffleArray(pairs.map((p) => ({ id: p.id, definition: p.definition }))),
          totalPairs: pairs.length,
        },
      }];
    }

    // ── SPEED_QUIZ: Timed multiple choice from Questions ──
    case 'SPEED_QUIZ': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'SPEED_QUIZ',
            questionText: c.questionText || c.front || '',
            options: c.options || generateOptions(c, items),
            explanation: undefined, // hidden until answered
          },
        };
      });
    }

    // ── FLASHCARD_FLIP: SRS-style self-rating review ──
    case 'FLASHCARD_FLIP': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'FLASHCARD_FLIP',
            front: c.front || c.arabicText || c.questionText || '',
            frontArabic: c.frontArabic || c.arabicText || '',
            back: c.back || c.translation || c.correctAnswer || '',
            backArabic: c.backArabic || '',
          },
        };
      });
    }

    // ── AYAH_COMPLETION: Fill in blanks from flashcard text ──
    case 'AYAH_COMPLETION': {
      return items.map((item) => {
        const c = item.content as any;
        const fullText: string = c.back || c.front || '';
        const words = fullText.split(/\s+/);
        // Remove 1-3 words based on difficulty
        const blanksCount = difficulty === 'EASY' ? 1 : difficulty === 'MEDIUM' ? 2 : 3;
        const blankIndices: number[] = [];
        const removableIndices = words.map((_, i) => i).filter((i) => words[i].length > 2);
        const shuffledIndices = shuffleArray(removableIndices);
        for (let i = 0; i < Math.min(blanksCount, shuffledIndices.length); i++) {
          blankIndices.push(shuffledIndices[i]);
        }
        blankIndices.sort((a, b) => a - b);

        const missingWords = blankIndices.map((i) => words[i]);
        const textWithBlanks = words.map((w, i) => blankIndices.includes(i) ? '______' : w).join(' ');

        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'AYAH_COMPLETION',
            textWithBlanks,
            missingWords,
            arabicText: c.frontArabic || c.backArabic || '',
            hint: c.front || '',
          },
        };
      });
    }

    // ── FIQH_SCENARIO: Scenario-based multiple choice ──
    case 'FIQH_SCENARIO': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'FIQH_SCENARIO',
            scenario: c.questionText || '',
            options: c.options || [],
            explanation: undefined,
          },
        };
      });
    }

    // ── HADITH_CHAIN: Arrange items in correct order ──
    case 'HADITH_CHAIN': {
      const orderedItems = items.map((item, index) => {
        const c = item.content as any;
        return {
          id: item.contentId,
          text: c.front || c.arabicText || '',
          arabicText: c.frontArabic || c.arabicText || '',
          correctPosition: index,
        };
      });
      return [{
        contentType: items[0]?.contentType ?? 'FLASHCARD',
        contentId: items.map((i) => i.contentId).join(','),
        metadata: {
          gameMode: 'HADITH_CHAIN',
          description: 'Arrange these items in the correct order',
          scrambledItems: shuffleArray(orderedItems.map(({ id, text, arabicText }) => ({ id, text, arabicText }))),
          totalItems: orderedItems.length,
          correctOrder: orderedItems.map((o) => o.id),
        },
      }];
    }

    // ── WORD_SEARCH: Find terms in a letter grid ──
    case 'WORD_SEARCH': {
      const words = items.map((item) => {
        const c = item.content as any;
        return c.transliteration || c.front || c.translation || '';
      }).filter((w) => w.length >= 3);

      const gridSize = difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 12 : 15;
      const { grid, placements } = generateWordSearchGrid(words, gridSize);

      return [{
        contentType: items[0]?.contentType ?? 'ARABIC_TERM',
        contentId: items.map((i) => i.contentId).join(','),
        metadata: {
          gameMode: 'WORD_SEARCH',
          grid,
          wordsToFind: items.map((item) => {
            const c = item.content as any;
            return {
              id: item.contentId,
              word: (c.transliteration || c.front || '').toUpperCase().replace(/[^A-Z]/g, ''),
              hint: c.translation || c.back || '',
            };
          }),
          gridSize,
          placements, // stored for validation but frontend shouldn't show this
        },
      }];
    }

    // ── TRIVIA_BATTLE: Competitive-styled multiple choice ──
    case 'TRIVIA_BATTLE': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'TRIVIA_BATTLE',
            questionText: c.questionText || c.front || '',
            options: c.options || generateOptions(c, items),
            category: c.type || 'GENERAL',
          },
        };
      });
    }

    // ── KNOWLEDGE_EXPEDITION: Multi-zone journey with mixed content ──
    case 'KNOWLEDGE_EXPEDITION': {
      const zones = ['Foundations', 'Arabic', 'Fiqh', 'History', 'Quran'];
      return items.map((item, index) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'KNOWLEDGE_EXPEDITION',
            zone: zones[index % zones.length],
            zoneIndex: index,
            questionText: c.questionText || c.front || c.translation || '',
            options: c.options || generateOptions(c, items),
            hint: c.explanation || c.back || '',
          },
        };
      });
    }

    // ── MOSQUE_BUILDER: Answer questions to earn building blocks ──
    case 'MOSQUE_BUILDER': {
      const parts = ['foundation', 'walls', 'dome', 'minaret', 'courtyard', 'mihrab', 'entrance', 'garden', 'fountain', 'balcony'];
      return items.map((item, index) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'MOSQUE_BUILDER',
            questionText: c.questionText || c.front || '',
            options: c.options || generateOptions(c, items),
            buildingPart: parts[index % parts.length],
            buildProgress: index,
          },
        };
      });
    }

    // ── PATTERN_CREATOR: Match and complete patterns ──
    case 'PATTERN_CREATOR': {
      return items.map((item) => {
        const c = item.content as any;
        const front = c.front || c.arabicText || '';
        const back = c.back || c.translation || '';
        // Create a pattern: show front, pick correct back from options
        const wrongOptions = items
          .filter((i) => i.contentId !== item.contentId)
          .slice(0, 3)
          .map((i) => (i.content as any).back || (i.content as any).translation || '');
        const allOptions = shuffleArray([back, ...wrongOptions]);

        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'PATTERN_CREATOR',
            pattern: front,
            arabicText: c.frontArabic || c.arabicText || '',
            options: allOptions,
            hint: c.backArabic || '',
          },
        };
      });
    }

    // ── SEERAH_TIMELINE: Arrange events chronologically ──
    case 'SEERAH_TIMELINE': {
      const events = items.map((item, index) => {
        const c = item.content as any;
        return {
          id: item.contentId,
          event: c.front || c.translation || '',
          description: c.back || c.arabicText || '',
          correctPosition: index,
        };
      });
      return [{
        contentType: items[0]?.contentType ?? 'FLASHCARD',
        contentId: items.map((i) => i.contentId).join(','),
        metadata: {
          gameMode: 'SEERAH_TIMELINE',
          description: 'Arrange these events in chronological order',
          scrambledEvents: shuffleArray(events.map(({ id, event, description }) => ({ id, event, description }))),
          totalEvents: events.length,
          correctOrder: events.map((e) => e.id),
        },
      }];
    }

    // ── ESCAPE_ROOM: Multi-stage puzzle rooms ──
    case 'ESCAPE_ROOM': {
      const roomThemes = ['Library of Wisdom', 'Chamber of Sunnah', 'Garden of Fiqh', 'Hall of Quran'];
      const roomName = roomThemes[Math.floor(Math.random() * roomThemes.length)];
      return items.map((item, index) => {
        const c = item.content as any;
        const totalStages = items.length;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'ESCAPE_ROOM',
            roomName,
            stage: index + 1,
            totalStages,
            puzzleType: item.contentType === 'QUESTION' ? 'RIDDLE' : item.contentType === 'FLASHCARD' ? 'DECODE' : 'TRANSLATE',
            questionText: c.questionText || c.front || c.arabicText || '',
            options: c.options || generateOptions(c, items),
            hint: c.explanation || c.back || c.translation || '',
            clue: `Solve puzzle ${index + 1} of ${totalStages} to escape the ${roomName}`,
          },
        };
      });
    }

    // ── MAZE_NAVIGATOR: Answer at checkpoints to proceed ──
    case 'MAZE_NAVIGATOR': {
      const totalCheckpoints = items.length;
      return items.map((item, index) => {
        const c = item.content as any;
        // Build a simple maze path with checkpoints
        const directions = ['north', 'east', 'south', 'west'];
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'MAZE_NAVIGATOR',
            checkpoint: index + 1,
            totalCheckpoints,
            questionText: c.questionText || c.front || '',
            options: c.options || generateOptions(c, items),
            direction: directions[index % directions.length],
            progress: Math.round(((index + 1) / totalCheckpoints) * 100),
          },
        };
      });
    }

    // ── WORD_SCRAMBLE: Scramble letters of a term for the player to unscramble ──
    case 'WORD_SCRAMBLE': {
      return items.map((item) => {
        const c = item.content as any;
        const word = (c.transliteration || c.front || c.translation || '').trim();
        const letters = shuffleArray(word.split(''));
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'WORD_SCRAMBLE',
            scrambledLetters: letters,
            hint: c.translation || c.back || '',
            arabicText: c.arabicText || c.frontArabic || '',
            wordLength: word.length,
          },
        };
      });
    }

    // ── FILL_IN_BLANK: Remove a word from a sentence for the player to fill ──
    case 'FILL_IN_BLANK': {
      return items.map((item) => {
        const c = item.content as any;
        const text: string = c.questionText || c.front || c.back || '';
        const words = text.split(/\s+/);
        const removable = words.map((_, i) => i).filter((i) => words[i].length > 3);
        const blankIdx = removable.length > 0 ? removable[Math.floor(Math.random() * removable.length)] : 0;
        const missingWord = words[blankIdx];
        const sentence = words.map((w, i) => i === blankIdx ? '______' : w).join(' ');
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'FILL_IN_BLANK',
            sentence,
            missingWord,
            options: shuffleArray([missingWord, ...items.filter((i) => i.contentId !== item.contentId).slice(0, 3).map((i) => {
              const ic = i.content as any;
              const t = ic.questionText || ic.front || ic.back || '';
              const w = t.split(/\s+/);
              return w[Math.floor(Math.random() * w.length)] || 'none';
            })]),
            explanation: c.explanation || '',
          },
        };
      });
    }

    // ── MEMORY_MATCH: Pair-matching card game ──
    case 'MEMORY_MATCH': {
      const pairs = items.map((item) => {
        const c = item.content as any;
        return {
          id: item.contentId,
          term: c.arabicText || c.front || '',
          definition: c.translation || c.back || '',
          transliteration: c.transliteration || '',
        };
      });
      return [{
        contentType: items[0]?.contentType ?? 'ARABIC_TERM',
        contentId: items.map((i) => i.contentId).join(','),
        metadata: {
          gameMode: 'MEMORY_MATCH',
          cards: shuffleArray([
            ...pairs.map((p) => ({ id: `${p.id}-term`, pairId: p.id, face: p.term, type: 'term' })),
            ...pairs.map((p) => ({ id: `${p.id}-def`, pairId: p.id, face: p.definition, type: 'definition' })),
          ]),
          totalPairs: pairs.length,
        },
      }];
    }

    // ── TRUE_FALSE: Present a statement, player decides true or false ──
    case 'TRUE_FALSE': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'TRUE_FALSE',
            statement: c.questionText || c.front || '',
            options: ['True', 'False'],
            explanation: c.explanation || c.back || '',
          },
        };
      });
    }

    // ── MULTIPLE_CHOICE: Standard four-option question ──
    case 'MULTIPLE_CHOICE': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'MULTIPLE_CHOICE',
            questionText: c.questionText || c.front || '',
            options: c.options || generateOptions(c, items),
            explanation: undefined,
          },
        };
      });
    }

    // ── SENTENCE_BUILD: Arrange words into the correct sentence ──
    case 'SENTENCE_BUILD': {
      return items.map((item) => {
        const c = item.content as any;
        const sentence: string = c.back || c.front || '';
        const words = sentence.split(/\s+/).filter(Boolean);
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'SENTENCE_BUILD',
            scrambledWords: shuffleArray(words),
            wordCount: words.length,
            hint: c.front || c.arabicText || '',
            arabicText: c.frontArabic || c.backArabic || '',
          },
        };
      });
    }

    // ── LISTENING_QUIZ: Listen to Arabic audio and answer ──
    case 'LISTENING_QUIZ': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'LISTENING_QUIZ',
            audioUrl: c.audioUrl || '',
            arabicText: c.arabicText || c.frontArabic || '',
            options: generateOptions(c, items),
            hint: c.transliteration || '',
          },
        };
      });
    }

    // ── CALLIGRAPHY_TRACE: Trace Arabic letters/words ──
    case 'CALLIGRAPHY_TRACE': {
      return items.map((item) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'CALLIGRAPHY_TRACE',
            arabicText: c.arabicText || c.frontArabic || '',
            transliteration: c.transliteration || '',
            translation: c.translation || c.back || '',
          },
        };
      });
    }

    // ── SPELLING_BEE: Read definition, spell the transliterated term ──
    case 'SPELLING_BEE': {
      return items.map((item) => {
        const c = item.content as any;
        const word = (c.transliteration || c.front || '').trim();
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'SPELLING_BEE',
            definition: c.translation || c.back || '',
            arabicText: c.arabicText || c.frontArabic || '',
            wordLength: word.length,
            firstLetter: word.charAt(0),
          },
        };
      });
    }

    // ── STORY_PUZZLE: Arrange flashcard content segments in order ──
    case 'STORY_PUZZLE': {
      const segments = items.map((item, index) => {
        const c = item.content as any;
        return {
          id: item.contentId,
          text: c.front || c.back || '',
          correctPosition: index,
        };
      });
      return [{
        contentType: items[0]?.contentType ?? 'FLASHCARD',
        contentId: items.map((i) => i.contentId).join(','),
        metadata: {
          gameMode: 'STORY_PUZZLE',
          description: 'Arrange these segments in the correct order',
          scrambledSegments: shuffleArray(segments.map(({ id, text }) => ({ id, text }))),
          totalSegments: segments.length,
          correctOrder: segments.map((s) => s.id),
        },
      }];
    }

    // ── MAZE_RUNNER: Similar to MAZE_NAVIGATOR with different theming ──
    case 'MAZE_RUNNER': {
      const totalGates = items.length;
      return items.map((item, index) => {
        const c = item.content as any;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'MAZE_RUNNER',
            gate: index + 1,
            totalGates,
            questionText: c.questionText || c.front || '',
            options: c.options || generateOptions(c, items),
            progress: Math.round(((index + 1) / totalGates) * 100),
          },
        };
      });
    }

    // ── Fallback: generic round format ──
    default: {
      return items.map((item) => ({
        contentType: item.contentType,
        contentId: item.contentId,
        metadata: {
          gameMode: gameType,
          ...item.content,
        },
      }));
    }
  }
}

/**
 * Generate multiple-choice options from content item, using other items as distractors.
 */
function generateOptions(content: Record<string, unknown>, allItems: ContentItem[]): string[] {
  const correctAnswer = (content.correctAnswer || content.back || content.translation || '') as string;
  if (!correctAnswer) return [];

  // Gather distractors from other items
  const distractors: string[] = [];
  for (const item of allItems) {
    const c = item.content as any;
    const candidate = c.correctAnswer || c.back || c.translation || '';
    if (candidate && candidate !== correctAnswer && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
    if (distractors.length >= 3) break;
  }

  // If not enough distractors, add generic ones
  while (distractors.length < 3) {
    distractors.push(`Option ${distractors.length + 2}`);
  }

  return shuffleArray([correctAnswer, ...distractors.slice(0, 3)]);
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
            course: { select: { id: true, title: true } },
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
          courseName: (g as any).course?.title ?? null,
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
    gameType?: GameType;
    gameId?: string;
    unitId?: string;
    courseId?: string;
    difficulty: GameDifficulty;
  }) {
    const { memberId, gameId, unitId, courseId, difficulty } = params;
    let { gameType } = params;

    // 1. Resolve or find Game record
    let game;
    if (gameId) {
      game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { template: true },
      });
      if (!game) throw new NotFoundError(`Game ${gameId} not found`);
      // Derive gameType from the game record when not explicitly provided
      if (!gameType) {
        gameType = game.template.type;
      }
    } else if (gameType) {
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
    } else {
      throw new BadRequestError('Either gameId or gameType is required');
    }

    // 2. Parental controls (after gameType is resolved)
    const parentalCheck = await checkParentalControls(memberId, gameType!, difficulty);
    if (!parentalCheck.allowed) {
      throw new ForbiddenError(parentalCheck.reason ?? 'Game not allowed by parental settings');
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

    // 5. Format rounds per game type
    const formattedRounds = formatRoundsForGameType(gameType, contentItems, difficulty);

    // 6. Create session and rounds
    const maxScore = formattedRounds.length * (BASE_POINTS + SPEED_BONUS_MAX) * 3; // theoretical max with highest streak

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
        roundsTotal: formattedRounds.length,
        roundsCorrect: 0,
        livesUsed: 0,
        metadata: {},
        rounds: {
          create: formattedRounds.map((round, index) => ({
            roundIndex: index,
            contentType: round.contentType,
            contentId: round.contentId,
            metadata: round.metadata as any,
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
  const meta = round.metadata as Record<string, unknown>;
  const gameMode = meta?.gameMode as string | undefined;

  // ── TERM_MATCH: answer is array of { termId, definitionId } pairs ──
  if (gameMode === 'TERM_MATCH') {
    const pairs = meta.pairs as Array<{ id: string }>;
    const playerPairs = answer as Array<{ termId: string; definitionId: string }>;
    if (!Array.isArray(playerPairs)) return false;
    let allCorrect = true;
    for (const pp of playerPairs) {
      if (pp.termId !== pp.definitionId) { allCorrect = false; break; }
    }
    return allCorrect;
  }

  // ── HADITH_CHAIN / SEERAH_TIMELINE: answer is array of IDs in order ──
  if (gameMode === 'HADITH_CHAIN' || gameMode === 'SEERAH_TIMELINE') {
    const correctOrder = meta.correctOrder as string[];
    const playerOrder = answer as string[];
    if (!Array.isArray(playerOrder) || playerOrder.length !== correctOrder.length) return false;
    return correctOrder.every((id, i) => id === playerOrder[i]);
  }

  // ── WORD_SEARCH: answer is array of found word strings ──
  if (gameMode === 'WORD_SEARCH') {
    const wordsToFind = meta.wordsToFind as Array<{ word: string }>;
    const found = answer as string[];
    if (!Array.isArray(found)) return false;
    const expectedSet = new Set(wordsToFind.map((w) => w.word.toUpperCase()));
    const foundSet = new Set(found.map((w) => (typeof w === 'string' ? w : '').toUpperCase()));
    // Correct if all words found
    return [...expectedSet].every((w) => foundSet.has(w));
  }

  // ── AYAH_COMPLETION: answer is array of missing words ──
  if (gameMode === 'AYAH_COMPLETION') {
    const missingWords = meta.missingWords as string[];
    const playerWords = answer as string[];
    if (!Array.isArray(playerWords)) return false;
    return missingWords.every((w, i) =>
      playerWords[i] && playerWords[i].trim().toLowerCase() === w.trim().toLowerCase()
    );
  }

  // ── FLASHCARD_FLIP: answer is self-rating (1-5), always "correct" if rating >= 3 ──
  if (gameMode === 'FLASHCARD_FLIP') {
    const rating = typeof answer === 'number' ? answer : parseInt(answer as string, 10);
    return !isNaN(rating) && rating >= 3;
  }

  // ── CALLIGRAPHY_TRACE: answer is self-rating (1-5), like flashcard flip ──
  if (gameMode === 'CALLIGRAPHY_TRACE') {
    const rating = typeof answer === 'number' ? answer : parseInt(answer as string, 10);
    return !isNaN(rating) && rating >= 3;
  }

  // ── WORD_SCRAMBLE: answer is the unscrambled word ──
  if (gameMode === 'WORD_SCRAMBLE') {
    const term = round.contentType === 'ARABIC_TERM'
      ? await prisma.arabicTerm.findUnique({ where: { id: round.contentId } })
      : null;
    if (term) {
      const expected = (term.transliteration || term.translation).trim().toLowerCase();
      const playerAnswer = (typeof answer === 'string' ? answer : '').trim().toLowerCase();
      return playerAnswer === expected;
    }
  }

  // ── SPELLING_BEE: answer is the spelled-out transliteration ──
  if (gameMode === 'SPELLING_BEE') {
    const term = round.contentType === 'ARABIC_TERM'
      ? await prisma.arabicTerm.findUnique({ where: { id: round.contentId } })
      : null;
    if (term) {
      const expected = (term.transliteration || '').trim().toLowerCase();
      const playerAnswer = (typeof answer === 'string' ? answer : '').trim().toLowerCase();
      return playerAnswer === expected;
    }
  }

  // ── MEMORY_MATCH: answer is array of matched pair IDs; correct if all pairs matched ──
  if (gameMode === 'MEMORY_MATCH') {
    const totalPairs = (meta.totalPairs as number) || 0;
    const matched = answer as string[];
    if (!Array.isArray(matched)) return false;
    return matched.length >= totalPairs;
  }

  // ── SENTENCE_BUILD / STORY_PUZZLE: answer is array of IDs or words in order ──
  if (gameMode === 'SENTENCE_BUILD') {
    const c = meta as any;
    const correctSentence = (c.scrambledWords as string[])?.sort()?.join(' ');
    // For sentence build the "correct" check is done by comparing reconstructed sentence
    // Player submits words in order; we compare to original sentence
    const playerWords = answer as string[];
    if (!Array.isArray(playerWords)) return false;
    const fc = await prisma.flashCard.findUnique({ where: { id: round.contentId } });
    if (!fc) return false;
    const expected = (fc.back || fc.front || '').split(/\s+/).filter(Boolean);
    return expected.length === playerWords.length && expected.every((w, i) => w.toLowerCase() === (playerWords[i] || '').toLowerCase());
  }

  if (gameMode === 'STORY_PUZZLE') {
    const correctOrder = meta.correctOrder as string[];
    const playerOrder = answer as string[];
    if (!Array.isArray(playerOrder) || playerOrder.length !== correctOrder.length) return false;
    return correctOrder.every((id, i) => id === playerOrder[i]);
  }

  // ── FILL_IN_BLANK: answer is the missing word ──
  if (gameMode === 'FILL_IN_BLANK') {
    const missingWord = (meta.missingWord as string) || '';
    const playerAnswer = (typeof answer === 'string' ? answer : '').trim().toLowerCase();
    return playerAnswer === missingWord.trim().toLowerCase();
  }

  // ── Generic multiple-choice types: SPEED_QUIZ, FIQH_SCENARIO, TRIVIA_BATTLE, KNOWLEDGE_EXPEDITION, MOSQUE_BUILDER, PATTERN_CREATOR, ESCAPE_ROOM, MAZE_NAVIGATOR ──
  const answerStr = typeof answer === 'string' ? answer.trim().toLowerCase() : JSON.stringify(answer);

  if (round.contentType === 'QUESTION') {
    const question = await prisma.question.findUnique({ where: { id: round.contentId } });
    if (!question) return false;
    return answerStr === question.correctAnswer.trim().toLowerCase();
  }

  if (round.contentType === 'FLASHCARD') {
    const flashcard = await prisma.flashCard.findUnique({ where: { id: round.contentId } });
    if (!flashcard) return false;
    const acceptable = [flashcard.back, flashcard.backArabic].filter(Boolean).map((s) => s!.trim().toLowerCase());
    return acceptable.includes(answerStr);
  }

  if (round.contentType === 'ARABIC_TERM') {
    const term = await prisma.arabicTerm.findUnique({ where: { id: round.contentId } });
    if (!term) return false;
    const acceptable = [term.translation, term.transliteration].map((s) => s.trim().toLowerCase());
    return acceptable.includes(answerStr);
  }

  return false;
}
