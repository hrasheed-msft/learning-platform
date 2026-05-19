import prisma from '../config/database';
import {
  GameType,
  GameDifficulty,
  GameSessionStatus,
  FlashCardStatus,
  ActivityEventType,
} from '@prisma/client';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/error.middleware';
import { calculateNextReview } from './flashcard/sm2-algorithm.service';
import { recordActivity } from './activity.service';

// ---------------------------------------------------------------------------
// Game taxonomy
//
// 9 distinct mechanics (per khaldun-game-redesign.md §2, with the user's
// directive merging G8 VERIFY into G1 QUICK_RECALL as a true/false variant).
//
// Each entry declares:
//   - minimum content thresholds (for availability checks)
//   - per-difficulty timer config
//   - default course-compatibility hint used when seeding a Game row
// ---------------------------------------------------------------------------

interface GameDef {
  minQuestions: number;
  minFlashcards: number;
  minArabicTerms: number;
  timers: Record<GameDifficulty, { type: 'NONE' | 'PER_QUESTION' | 'GLOBAL'; durationMs: number }>;
  defaultCompatibility: {
    contentType: 'QUESTION' | 'FLASHCARD' | 'ARABIC_TERM' | 'FIQH_SCENARIO';
    courseCategory?: string;
    minItems: number;
  };
}

const GAME_DEFS: Record<GameType, GameDef> = {
  QUICK_RECALL: {
    minQuestions: 5, minFlashcards: 0, minArabicTerms: 0,
    timers: {
      EASY:   { type: 'NONE',         durationMs: 0 },
      MEDIUM: { type: 'PER_QUESTION', durationMs: 20000 },
      HARD:   { type: 'PER_QUESTION', durationMs: 10000 },
    },
    defaultCompatibility: { contentType: 'QUESTION', minItems: 5 },
  },
  PAIR_MATCH: {
    minQuestions: 0, minFlashcards: 4, minArabicTerms: 0,
    timers: {
      EASY:   { type: 'NONE',   durationMs: 0 },
      MEDIUM: { type: 'GLOBAL', durationMs: 120000 },
      HARD:   { type: 'GLOBAL', durationMs: 90000 },
    },
    defaultCompatibility: { contentType: 'FLASHCARD', minItems: 4 },
  },
  FLASHCARD_SPRINT: {
    minQuestions: 0, minFlashcards: 5, minArabicTerms: 0,
    timers: {
      EASY:   { type: 'NONE',         durationMs: 0 },
      MEDIUM: { type: 'NONE',         durationMs: 0 },
      HARD:   { type: 'PER_QUESTION', durationMs: 8000 },
    },
    defaultCompatibility: { contentType: 'FLASHCARD', minItems: 5 },
  },
  CLOZE: {
    minQuestions: 0, minFlashcards: 5, minArabicTerms: 0,
    timers: {
      EASY:   { type: 'PER_QUESTION', durationMs: 45000 },
      MEDIUM: { type: 'PER_QUESTION', durationMs: 30000 },
      HARD:   { type: 'PER_QUESTION', durationMs: 20000 },
    },
    defaultCompatibility: { contentType: 'FLASHCARD', minItems: 5 },
  },
  WORD_SEARCH: {
    minQuestions: 0, minFlashcards: 0, minArabicTerms: 6,
    timers: {
      EASY:   { type: 'GLOBAL', durationMs: 300000 },
      MEDIUM: { type: 'GLOBAL', durationMs: 180000 },
      HARD:   { type: 'GLOBAL', durationMs: 120000 },
    },
    defaultCompatibility: { contentType: 'ARABIC_TERM', minItems: 6 },
  },
  SEQUENCE_IT: {
    minQuestions: 0, minFlashcards: 4, minArabicTerms: 0,
    timers: {
      EASY:   { type: 'GLOBAL', durationMs: 180000 },
      MEDIUM: { type: 'GLOBAL', durationMs: 120000 },
      HARD:   { type: 'GLOBAL', durationMs: 75000 },
    },
    defaultCompatibility: { contentType: 'FLASHCARD', minItems: 4 },
  },
  WORD_SCRAMBLE: {
    minQuestions: 0, minFlashcards: 0, minArabicTerms: 4,
    timers: {
      EASY:   { type: 'PER_QUESTION', durationMs: 30000 },
      MEDIUM: { type: 'PER_QUESTION', durationMs: 20000 },
      HARD:   { type: 'PER_QUESTION', durationMs: 12000 },
    },
    defaultCompatibility: { contentType: 'ARABIC_TERM', minItems: 4 },
  },
  CALLIGRAPHY_TRACE: {
    minQuestions: 0, minFlashcards: 0, minArabicTerms: 4,
    timers: {
      EASY:   { type: 'NONE',         durationMs: 0 },
      MEDIUM: { type: 'PER_QUESTION', durationMs: 45000 },
      HARD:   { type: 'PER_QUESTION', durationMs: 30000 },
    },
    // No courseCategory restriction: Arabic terms exist across all subjects,
    // not only ARABIC-category courses. The minArabicTerms check is the gate.
    defaultCompatibility: { contentType: 'ARABIC_TERM', minItems: 4 },
  },
  FIQH_SCENARIO: {
    // Fiqh Scenario uses a manually-authored branching tree (FiqhScenario
    // content model — Phase C). Until that content exists we fall back to
    // Question-table fiqh items so the game stays playable.
    minQuestions: 3, minFlashcards: 0, minArabicTerms: 0,
    timers: {
      EASY:   { type: 'PER_QUESTION', durationMs: 90000 },
      MEDIUM: { type: 'PER_QUESTION', durationMs: 60000 },
      HARD:   { type: 'PER_QUESTION', durationMs: 45000 },
    },
    defaultCompatibility: { contentType: 'FIQH_SCENARIO', courseCategory: 'FIQH', minItems: 3 },
  },
};

const ROUNDS_BY_DIFFICULTY: Record<GameDifficulty, number> = {
  EASY: 5,
  MEDIUM: 10,
  HARD: 15,
};

const BASE_POINTS = 100;
const SPEED_BONUS_MAX = 50;

// ---------------------------------------------------------------------------
// Slugs (for /games/:slug/eligible-courses launcher endpoint)
// ---------------------------------------------------------------------------

const SLUG_TO_TYPE: Record<string, GameType> = {
  'quick-recall':       'QUICK_RECALL',
  'pair-match':         'PAIR_MATCH',
  'flashcard-sprint':   'FLASHCARD_SPRINT',
  'cloze':              'CLOZE',
  'word-search':        'WORD_SEARCH',
  'sequence-it':        'SEQUENCE_IT',
  'word-scramble':      'WORD_SCRAMBLE',
  'calligraphy-trace':  'CALLIGRAPHY_TRACE',
  'fiqh-scenario':      'FIQH_SCENARIO',
};

export function gameTypeToSlug(type: GameType): string {
  return type.toLowerCase().replace(/_/g, '-');
}

export function slugToGameType(slug: string): GameType | null {
  return SLUG_TO_TYPE[slug] ?? null;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface ContentItem {
  contentType: 'QUESTION' | 'FLASHCARD' | 'ARABIC_TERM';
  contentId: string;
  content: any;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function streakMultiplier(streak: number): number {
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
): number {
  if (!isCorrect) return 0;
  let points = BASE_POINTS;
  if (timerDurationMs > 0 && timeSpentMs < timerDurationMs) {
    const remaining = (timerDurationMs - timeSpentMs) / timerDurationMs;
    points += Math.round(remaining * SPEED_BONUS_MAX);
  }
  return Math.round(points * streakMultiplier(currentStreak));
}

function computeSrsRating(isCorrect: boolean, timeSpentMs: number, difficulty: GameDifficulty): number {
  if (!isCorrect) return 2;
  const threshold = difficulty === 'EASY' ? 10000 : difficulty === 'MEDIUM' ? 7000 : 5000;
  if (timeSpentMs <= threshold * 0.5) return 5;
  if (timeSpentMs <= threshold) return 4;
  return 3;
}

function computeStars(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  const pct = score / maxScore;
  if (pct >= 0.9) return 3;
  if (pct >= 0.75) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

function startOfDay(d: Date = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseOptions(raw: unknown): string[] | null {
  if (Array.isArray(raw) && raw.length > 0) return raw as string[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch { /* not JSON */ }
  }
  return null;
}

/** Build MCQ options by drawing distractors from sibling items in the pool. */
function buildOptions(
  correct: string,
  items: ContentItem[],
  excludeId: string,
  count: number,
): string[] {
  if (!correct) return [];
  const distractors: string[] = [];
  for (const it of items) {
    if (it.contentId === excludeId) continue;
    const c = it.content;
    const cand: string = c.correctAnswer || c.back || c.translation || '';
    if (cand && cand !== correct && !distractors.includes(cand)) {
      distractors.push(cand);
    }
    if (distractors.length >= count - 1) break;
  }
  while (distractors.length < count - 1) {
    distractors.push(`Option ${distractors.length + 2}`);
  }
  return shuffle([correct, ...distractors]);
}

// ---------------------------------------------------------------------------
// Content selection
// ---------------------------------------------------------------------------

async function selectContent(
  gameType: GameType,
  memberId: string,
  unitId: string | undefined,
  courseId: string | undefined,
  difficulty: GameDifficulty,
  roundCount: number,
): Promise<ContentItem[]> {
  const def = GAME_DEFS[gameType];
  if (!def) throw new BadRequestError(`Unknown game type: ${gameType}`);

  let unitIds: string[] = [];
  if (unitId) unitIds = [unitId];
  else if (courseId) {
    const units = await prisma.unit.findMany({ where: { courseId }, select: { id: true } });
    unitIds = units.map((u) => u.id);
  }
  const unitFilter = unitIds.length > 0 ? { unitId: { in: unitIds } } : {};

  const items: ContentItem[] = [];

  // Questions
  if (def.minQuestions > 0) {
    let qs = await prisma.question.findMany({
      where: { ...unitFilter, difficulty: difficulty as string },
      orderBy: { createdAt: 'desc' },
      take: roundCount * 2,
    });
    if (qs.length === 0) {
      qs = await prisma.question.findMany({
        where: unitFilter, orderBy: { createdAt: 'desc' }, take: roundCount * 2,
      });
    }
    if (qs.length < def.minQuestions && unitIds.length > 0) {
      qs = await prisma.question.findMany({ orderBy: { createdAt: 'desc' }, take: roundCount * 2 });
    }
    for (const q of qs) {
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

  // Flashcards (SRS-due first)
  if (def.minFlashcards > 0) {
    const now = new Date();
    const due = await prisma.flashCardProgress.findMany({
      where: {
        memberId,
        nextReviewDate: { lte: now },
        flashCard: unitIds.length > 0 ? { unitId: { in: unitIds } } : undefined,
      },
      include: { flashCard: true },
      orderBy: { nextReviewDate: 'asc' },
      take: roundCount,
    });
    for (const p of due) {
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
    const flashcardCount = items.filter((i) => i.contentType === 'FLASHCARD').length;
    if (flashcardCount < roundCount) {
      const existingIds = items.filter((i) => i.contentType === 'FLASHCARD').map((i) => i.contentId);
      let extra = await prisma.flashCard.findMany({
        where: {
          ...(unitIds.length > 0 ? { unitId: { in: unitIds } } : {}),
          id: { notIn: existingIds },
        },
        take: roundCount - flashcardCount,
      });
      if (extra.length + flashcardCount < def.minFlashcards && unitIds.length > 0) {
        extra = await prisma.flashCard.findMany({
          where: { id: { notIn: existingIds } },
          take: roundCount - flashcardCount,
        });
      }
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

  // Arabic terms
  if (def.minArabicTerms > 0) {
    let terms = await prisma.arabicTerm.findMany({ where: unitFilter, take: roundCount * 2 });
    if (terms.length < def.minArabicTerms && unitIds.length > 0) {
      terms = await prisma.arabicTerm.findMany({ take: roundCount * 2 });
    }
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

  return shuffle(items).slice(0, roundCount);
}

// ---------------------------------------------------------------------------
// Round formatting — one branch per of the 9 game types
// ---------------------------------------------------------------------------

function formatRounds(
  gameType: GameType,
  items: ContentItem[],
  difficulty: GameDifficulty,
  presentationConfig?: any,
): Array<{ contentType: string; contentId: string; metadata: Record<string, unknown> }> {

  switch (gameType) {

    // ── G1. QUICK_RECALL ────────────────────────────────────────────────
    // MCQ. If the source question has only 2 options (or correctAnswer is
    // "True"/"False"), it becomes a true/false round. HARD uses 5 options.
    case 'QUICK_RECALL': {
      const optionCount = difficulty === 'HARD' ? 5 : 4;
      return items.map((item) => {
        const c = item.content;
        const correct: string = (c.correctAnswer || c.back || c.translation || '').toString();
        let options = parseOptions(c.options);
        const trueFalse =
          (options && options.length === 2 &&
           options.every((o) => /^(true|false)$/i.test(o))) ||
          /^(true|false)$/i.test(correct);
        let questionType: 'mcq' | 'true_false' = 'mcq';
        if (trueFalse) {
          options = ['True', 'False'];
          questionType = 'true_false';
        } else if (!options || options.length < 2) {
          options = buildOptions(correct, items, item.contentId, optionCount);
        } else if (options.length < optionCount) {
          options = buildOptions(correct, items, item.contentId, optionCount);
        }
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'QUICK_RECALL',
            questionType,
            questionText: c.questionText || c.front || '',
            options,
            correctAnswer: correct,
            explanation: c.explanation || '',
            arabicText: c.frontArabic || c.arabicText || '',
            theme: presentationConfig?.theme ?? 'classic',
          },
        };
      });
    }

    // ── G2. PAIR_MATCH ──────────────────────────────────────────────────
    // Collapse all items into a single round whose metadata carries the
    // full pair list; the frontend renders the grid and submits per-pair
    // matches against the same round.
    case 'PAIR_MATCH': {
      const pairs = items.map((item) => {
        const c = item.content;
        return {
          id: item.contentId,
          term: c.front || c.arabicText || c.frontArabic || '',
          definition: c.back || c.translation || '',
          termArabic: c.frontArabic || c.arabicText || '',
        };
      });
      const mode = (presentationConfig?.mode === 'connect' ? 'connect' : 'memory') as
        'memory' | 'connect';
      const ids = items.map((i) => i.contentId).join(',');
      return [{
        contentType: 'FLASHCARD',
        contentId: ids,
        metadata: {
          gameMode: 'PAIR_MATCH',
          mode,
          pairs,
        },
      }];
    }

    // ── G3. FLASHCARD_SPRINT ────────────────────────────────────────────
    // One round per card. Player submits a self-rating 1–5.
    case 'FLASHCARD_SPRINT': {
      return items.map((item) => {
        const c = item.content;
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'FLASHCARD_SPRINT',
            front: c.front || c.arabicText || '',
            back: c.back || c.translation || '',
            frontArabic: c.frontArabic || c.arabicText || '',
            backArabic: c.backArabic || '',
          },
        };
      });
    }

    // ── G4. CLOZE ───────────────────────────────────────────────────────
    // Remove one word per round; produce multiple rounds per item on harder
    // difficulties. Frontend expects: questionText (with blank marker),
    // correctAnswer, options (word bank), arabicText.
    case 'CLOZE': {
      const blanksPerItem = difficulty === 'EASY' ? 1 : difficulty === 'MEDIUM' ? 2 : 3;
      const showWordBank = difficulty === 'EASY';
      const rounds: Array<{ contentType: string; contentId: string; metadata: any }> = [];

      for (const item of items) {
        const c = item.content;
        const sentence: string =
          c.back || c.front || c.questionText || c.translation || '';
        const wordList = sentence.split(/\s+/).filter(Boolean);
        const candidateIdx = wordList
          .map((_, i) => i)
          .filter((i) => wordList[i].length > 2);
        const chosen = shuffle(candidateIdx).slice(0, Math.min(blanksPerItem, candidateIdx.length))
          .sort((a, b) => a - b);

        // Build distractors from sibling items
        const distractors = items
          .filter((i) => i.contentId !== item.contentId)
          .flatMap((i) => {
            const t = (i.content.back || i.content.front || '') as string;
            return t.split(/\s+/).filter((w) => w.length > 2);
          });

        // One round per blank (frontend handles single blank per round)
        for (const position of chosen) {
          const correctAnswer = wordList[position];
          const withBlank = wordList.map((w, i) => (i === position ? '{blank}' : w)).join(' ');
          const options = showWordBank
            ? shuffle([correctAnswer, ...shuffle(distractors).slice(0, 3)])
            : undefined;

          rounds.push({
            contentType: item.contentType,
            contentId: item.contentId,
            metadata: {
              gameMode: 'CLOZE',
              questionText: withBlank,
              correctAnswer,
              options,
              arabicText: c.frontArabic || c.backArabic || c.arabicText || '',
              front: c.front || '',
              hint: c.front || '',
              explanation: c.back || '',
            },
          });
        }
      }
      return rounds;
    }

    // ── G5. WORD_SEARCH ─────────────────────────────────────────────────
    // Aggregate round: build a single grid containing all words.
    case 'WORD_SEARCH': {
      const gridSize = difficulty === 'EASY' ? 8 : difficulty === 'MEDIUM' ? 12 : 16;
      const allowReverseDiagonal = difficulty === 'HARD';
      const words = items
        .map((it) => (it.content.transliteration || it.content.front || it.content.translation || '')
          .toString().toUpperCase().replace(/[^A-Z]/g, ''))
        .filter((w) => w.length >= 3 && w.length <= gridSize);

      const { grid, placements } = buildWordSearchGrid(words, gridSize, allowReverseDiagonal);
      const ids = items.map((i) => i.contentId).join(',');
      const targetWords = placements.map((p) => p.word);
      return [{
        contentType: 'ARABIC_TERM',
        contentId: ids,
        metadata: {
          gameMode: 'WORD_SEARCH',
          grid,
          targetWords,
          words: targetWords, // backward compat
          placements,
          gridSize,
          hints: items.map((it) => ({
            word: (it.content.transliteration || it.content.front || '').toString().toUpperCase().replace(/[^A-Z]/g, ''),
            arabic: it.content.arabicText || '',
            translation: it.content.translation || '',
          })),
        },
      }];
    }

    // ── G6. SEQUENCE_IT ─────────────────────────────────────────────────
    // Drag items into the correct order. One aggregate round.
    case 'SEQUENCE_IT': {
      const mode = (
        presentationConfig?.mode === 'isnad' || presentationConfig?.mode === 'timeline' ||
        presentationConfig?.mode === 'syntax' || presentationConfig?.mode === 'narrative'
      ) ? presentationConfig.mode : 'narrative';
      const limit = difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 5 : 8;
      const chosen = items.slice(0, limit);
      const sequenceItems = chosen.map((it, idx) => {
        const c = it.content;
        return {
          id: it.contentId,
          content: c.front || c.questionText || c.arabicText || c.translation || '',
          arabicText: c.frontArabic || c.arabicText || '',
          correctPosition: idx,
        };
      });
      const ids = chosen.map((i) => i.contentId).join(',');
      return [{
        contentType: chosen[0]?.contentType ?? 'FLASHCARD',
        contentId: ids,
        metadata: {
          gameMode: 'SEQUENCE_IT',
          mode,
          items: shuffle(sequenceItems),
          correctOrder: chosen.map((i) => i.contentId),
        },
      }];
    }

    // ── G7. WORD_SCRAMBLE ───────────────────────────────────────────────
    case 'WORD_SCRAMBLE': {
      const showFirstLetter = difficulty !== 'HARD';
      return items.map((item) => {
        const c = item.content;
        const word: string = (c.transliteration || c.front || c.translation || '').toString().trim();
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'WORD_SCRAMBLE',
            word,
            scrambled: shuffle(word.split('')).join(''),
            hint: c.translation || c.back || '',
            firstLetter: showFirstLetter ? word.charAt(0) : null,
            arabicText: c.arabicText || c.frontArabic || '',
          },
        };
      });
    }

    // ── G8. CALLIGRAPHY_TRACE ───────────────────────────────────────────
    // Self-rated stroke quality (1–5).
    case 'CALLIGRAPHY_TRACE': {
      return items.map((item) => {
        const c = item.content;
        const letter: string = c.arabicText || c.frontArabic || '';
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'CALLIGRAPHY_TRACE',
            letter,
            strokeGuides: difficulty === 'EASY',
            referenceImage: null,
            transliteration: c.transliteration || '',
            translation: c.translation || c.back || '',
          },
        };
      });
    }

    // ── G9. FIQH_SCENARIO ───────────────────────────────────────────────
    // Branching decision tree. Until FiqhScenario content is authored we
    // emit linear nodes derived from Question rows so the game stays
    // playable. Each node carries `choices` with `nextNodeId` references.
    case 'FIQH_SCENARIO': {
      const nodeIds = items.map((_, i) => `node-${i}`);
      return items.map((item, i) => {
        const c = item.content;
        const correct: string = c.correctAnswer || '';
        let options = parseOptions(c.options) || buildOptions(correct, items, item.contentId, 4);
        const isTerminal = i === items.length - 1;
        const choices = options.map((text: string, idx: number) => ({
          id: `${nodeIds[i]}-c${idx}`,
          text,
          // In the auto-generated fallback every choice progresses to the
          // next node; the verdict is the cumulative correctness chain.
          nextNodeId: isTerminal ? null : nodeIds[i + 1],
          isCorrect: text === correct,
        }));
        return {
          contentType: item.contentType,
          contentId: item.contentId,
          metadata: {
            gameMode: 'FIQH_SCENARIO',
            nodeId: nodeIds[i],
            prompt: c.questionText || c.front || '',
            choices,
            isTerminal,
            correctAnswer: correct,
            explanation: c.explanation || '',
          },
        };
      });
    }
  }
}

/** Word-search grid generator. */
function buildWordSearchGrid(
  words: string[],
  gridSize: number,
  allowReverseDiagonal: boolean,
): { grid: string[][]; placements: Array<{ word: string; row: number; col: number; direction: string }> } {
  const grid: string[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  const placements: Array<{ word: string; row: number; col: number; direction: string }> = [];
  const dirs = [
    { dr: 0, dc: 1, name: 'RIGHT' },
    { dr: 1, dc: 0, name: 'DOWN' },
    { dr: 1, dc: 1, name: 'DIAGONAL_DR' },
  ];
  if (allowReverseDiagonal) {
    dirs.push({ dr: 1, dc: -1, name: 'DIAGONAL_DL' });
    dirs.push({ dr: 0, dc: -1, name: 'LEFT' });
  }

  for (const word of words) {
    if (word.length === 0 || word.length > gridSize) continue;
    let placed = false;
    for (let attempt = 0; attempt < 60 && !placed; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const minRow = dir.dr < 0 ? word.length - 1 : 0;
      const maxRow = gridSize - 1 - Math.max(0, (word.length - 1) * dir.dr);
      const minCol = dir.dc < 0 ? word.length - 1 : 0;
      const maxCol = gridSize - 1 - Math.max(0, (word.length - 1) * dir.dc);
      if (maxRow < minRow || maxCol < minCol) continue;
      const r0 = minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
      const c0 = minCol + Math.floor(Math.random() * (maxCol - minCol + 1));
      let ok = true;
      for (let k = 0; k < word.length; k++) {
        const r = r0 + k * dir.dr, c = c0 + k * dir.dc;
        if (grid[r][c] !== '' && grid[r][c] !== word[k]) { ok = false; break; }
      }
      if (!ok) continue;
      for (let k = 0; k < word.length; k++) {
        grid[r0 + k * dir.dr][c0 + k * dir.dc] = word[k];
      }
      placements.push({ word, row: r0, col: c0, direction: dir.name });
      placed = true;
    }
  }
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') grid[r][c] = alpha[Math.floor(Math.random() * 26)];
    }
  }
  return { grid, placements };
}

// ---------------------------------------------------------------------------
// Content availability
// ---------------------------------------------------------------------------

async function checkContentAvailability(
  gameType: GameType,
  unitId?: string,
  courseId?: string,
): Promise<{ available: boolean; missing?: string }> {
  const def = GAME_DEFS[gameType];
  if (!def) return { available: false, missing: `Unknown game type: ${gameType}` };

  let unitIds: string[] = [];
  if (unitId) unitIds = [unitId];
  else if (courseId) {
    const units = await prisma.unit.findMany({ where: { courseId }, select: { id: true } });
    unitIds = units.map((u) => u.id);
  }
  const unitFilter = unitIds.length > 0 ? { unitId: { in: unitIds } } : {};

  if (def.minQuestions > 0) {
    let count = await prisma.question.count({ where: unitFilter });
    if (count < def.minQuestions && unitIds.length > 0) count = await prisma.question.count();
    if (count < def.minQuestions) return { available: false, missing: `Need ${def.minQuestions} questions, found ${count}` };
  }
  if (def.minFlashcards > 0) {
    let count = await prisma.flashCard.count({ where: unitIds.length > 0 ? { unitId: { in: unitIds } } : {} });
    if (count < def.minFlashcards && unitIds.length > 0) count = await prisma.flashCard.count();
    if (count < def.minFlashcards) return { available: false, missing: `Need ${def.minFlashcards} flashcards, found ${count}` };
  }
  if (def.minArabicTerms > 0) {
    let count = await prisma.arabicTerm.count({ where: unitFilter });
    if (count < def.minArabicTerms && unitIds.length > 0) count = await prisma.arabicTerm.count();
    if (count < def.minArabicTerms) return { available: false, missing: `Need ${def.minArabicTerms} Arabic terms, found ${count}` };
  }
  return { available: true };
}

/**
 * Count total content items available for a game type on a given course.
 * Used to populate contentCount and drive suggestedDifficulty.
 */
async function countContentForGame(gameType: GameType, courseId: string): Promise<number> {
  const def = GAME_DEFS[gameType];
  if (!def) return 0;

  const units = await prisma.unit.findMany({ where: { courseId }, select: { id: true } });
  const unitIds = units.map((u) => u.id);
  if (unitIds.length === 0) return 0;

  const unitFilter = { unitId: { in: unitIds } };

  let count = 0;
  if (def.minQuestions > 0) {
    count += await prisma.question.count({ where: unitFilter });
  }
  if (def.minFlashcards > 0) {
    count += await prisma.flashCard.count({ where: { unitId: { in: unitIds } } });
  }
  if (def.minArabicTerms > 0) {
    count += await prisma.arabicTerm.count({ where: unitFilter });
  }
  return count;
}

// ---------------------------------------------------------------------------
// SRS / streak / time-budget helpers (kept lean)
// ---------------------------------------------------------------------------

async function writeSrsUpdates(
  rounds: Array<{ contentType: string; contentId: string; isCorrect: boolean | null; srsRating: number | null }>,
  memberId: string,
): Promise<void> {
  const flashRounds = rounds.filter(
    (r) => r.contentType === 'FLASHCARD' && r.isCorrect !== null && !r.contentId.includes(','),
  );
  for (const round of flashRounds) {
    const rating = round.srsRating ?? (round.isCorrect ? 4 : 2);
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
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const twoAgo = new Date(today); twoAgo.setDate(twoAgo.getDate() - 2);

  let rec = await prisma.userStreakRecord.findUnique({ where: { memberId } });
  if (!rec) {
    await prisma.userStreakRecord.create({
      data: { memberId, currentStreak: 1, longestStreak: 1, lastActivityDate: today },
    });
    await prisma.familyMember.update({ where: { id: memberId }, data: { currentStreak: 1 } });
    return;
  }
  const last = startOfDay(rec.lastActivityDate);
  if (last.getTime() === today.getTime()) return;

  if (last.getTime() === yesterday.getTime() ||
      (last.getTime() === twoAgo.getTime() && !rec.gracePeriodUsed)) {
    const newStreak = rec.currentStreak + 1;
    const newLongest = Math.max(newStreak, rec.longestStreak);
    await prisma.userStreakRecord.update({
      where: { id: rec.id },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActivityDate: today,
        gracePeriodUsed: last.getTime() === twoAgo.getTime() ? true : false,
      },
    });
    await prisma.familyMember.update({
      where: { id: memberId },
      data: { currentStreak: newStreak, longestStreak: newLongest },
    });
    return;
  }
  await prisma.userStreakRecord.update({
    where: { id: rec.id },
    data: { currentStreak: 1, lastActivityDate: today, gracePeriodUsed: false },
  });
  await prisma.familyMember.update({ where: { id: memberId }, data: { currentStreak: 1 } });
}

async function checkParentalControls(
  memberId: string,
  gameType: GameType,
  difficulty: GameDifficulty,
): Promise<{ allowed: boolean; reason?: string }> {
  const settings = await prisma.gameParentalSettings.findUnique({ where: { familyMemberId: memberId } });
  if (!settings || !settings.isActive) return { allowed: true };
  if (settings.allowedGameTypes.length > 0 && !settings.allowedGameTypes.includes(gameType)) {
    return { allowed: false, reason: `Game type ${gameType} is not allowed by parental settings` };
  }
  const rank: Record<GameDifficulty, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
  if (rank[difficulty] > rank[settings.maxDifficulty]) {
    return { allowed: false, reason: `Difficulty ${difficulty} exceeds max allowed ${settings.maxDifficulty}` };
  }
  const remaining = await getRemainingTime(memberId);
  if (remaining !== null && remaining <= 0) {
    return { allowed: false, reason: 'Daily game time limit has been reached' };
  }
  return { allowed: true };
}

async function updateTimeLog(memberId: string, minutes: number): Promise<void> {
  const date = todayDateString();
  await prisma.gameTimeLog.upsert({
    where: { familyMemberId_date: { familyMemberId: memberId, date } },
    create: {
      familyMemberId: memberId, date,
      minutesPlayed: minutes, sessionsPlayed: 1,
      lastSessionEndedAt: new Date(),
    },
    update: {
      minutesPlayed: { increment: minutes },
      sessionsPlayed: { increment: 1 },
      lastSessionEndedAt: new Date(),
    },
  });
}

async function getRemainingTime(memberId: string): Promise<number | null> {
  const settings = await prisma.gameParentalSettings.findUnique({ where: { familyMemberId: memberId } });
  if (!settings || !settings.isActive) return null;
  const isWeekend = [0, 6].includes(new Date().getDay());
  const limit = isWeekend ? settings.weekendLimitMinutes : settings.dailyLimitMinutes;
  const log = await prisma.gameTimeLog.findUnique({
    where: { familyMemberId_date: { familyMemberId: memberId, date: todayDateString() } },
  });
  return Math.max(0, limit - (log?.minutesPlayed ?? 0));
}

// ---------------------------------------------------------------------------
// GameService — public surface (preserves /games/start, submitRound,
// completeGame, getSession, getScores, getLeaderboard, getDailyChallenge,
// submitDailyChallengeAttempt). New: getEligibleCourses(slug, memberId).
// ---------------------------------------------------------------------------

export class GameService {

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
    for (const t of templates) {
      const availability = await checkContentAvailability(t.type, filters?.unitId, filters?.courseId);
      const bestScore = await prisma.gameScore.findFirst({
        where: { memberId, session: { game: { template: { type: t.type } } } },
        orderBy: { totalScore: 'desc' },
        select: { totalScore: true, accuracy: true, createdAt: true },
      });
      const lastSession = t.games
        .flatMap((g) => g.sessions)
        .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];

      results.push({
        templateId: t.id,
        type: t.type,
        slug: gameTypeToSlug(t.type),
        category: t.category,
        name: t.name,
        description: t.description,
        iconUrl: t.iconUrl,
        rules: t.rules,
        available: availability.available,
        unavailableReason: availability.missing,
        games: t.games.map((g) => ({
          id: g.id,
          difficulty: g.difficulty,
          courseId: g.courseId,
          courseName: (g as any).course?.title ?? null,
          unitId: g.unitId,
          presentationConfig: g.presentationConfig ?? null,
        })),
        lastPlayed: lastSession?.startedAt ?? null,
        bestScore: bestScore
          ? { totalScore: bestScore.totalScore, accuracy: bestScore.accuracy, date: bestScore.createdAt }
          : null,
      });
    }
    return results;
  }

  static async getGamesForUnit(unitId: string, memberId: string) {
    const unit = await prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) throw new NotFoundError(`Unit ${unitId} not found`);
    return GameService.getAvailableGames(memberId, { unitId });
  }

  static async getGamesForCourse(courseId: string, memberId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundError(`Course ${courseId} not found`);
    return GameService.getAvailableGames(memberId, { courseId });
  }

  static async getStandaloneGames(memberId: string) {
    return GameService.getAvailableGames(memberId, { category: 'STANDALONE' });
  }

  /**
   * Courses compatible with a given game slug for a given member.
   * Used by the launcher's course picker (per khaldun-game-redesign §3.3).
   */
  static async getEligibleCourses(slug: string, memberId: string) {
    const gameType = slugToGameType(slug);
    if (!gameType) throw new NotFoundError(`Unknown game slug: ${slug}`);

    // Find the canonical Game/Template for this type (templates store
    // compatibility defaults; Games may override via courseCompatibility).
    const template = await prisma.gameTemplate.findUnique({
      where: { type: gameType },
      include: {
        games: {
          where: { isActive: true },
          select: { id: true, courseId: true, courseCompatibility: true, presentationConfig: true, difficulty: true },
        },
      },
    });
    if (!template) throw new NotFoundError(`No template for game type ${gameType}`);

    const compatibility = GAME_DEFS[gameType].defaultCompatibility;

    // Find courses the member is enrolled in
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { memberId },
      include: {
        course: {
          select: { id: true, title: true, category: true, isPublished: true },
        },
      },
    });

    const eligible = [];
    for (const e of enrollments) {
      if (!e.course || !e.course.isPublished) continue;
      if (compatibility.courseCategory && e.course.category !== compatibility.courseCategory) continue;

      // Confirm there is enough content for this game on this course.
      const availability = await checkContentAvailability(gameType, undefined, e.course.id);
      if (!availability.available) continue;

      // Count available content items for this game type on this course
      const contentCount = await countContentForGame(gameType, e.course.id);

      // Suggest difficulty based on content count: ≤8 EASY, ≤15 MEDIUM, else HARD
      const suggestedDifficulty: 'EASY' | 'MEDIUM' | 'HARD' =
        contentCount <= 8 ? 'EASY' : contentCount <= 15 ? 'MEDIUM' : 'HARD';

      // Find the existing Game row (if any) for this course+template — frontend
      // can use it as `gameId` for /start without re-creating one server-side.
      const existingGame = template.games.find((g) => g.courseId === e.course.id);

      eligible.push({
        courseId: e.course.id,
        courseTitle: e.course.title,
        courseName: e.course.title, // alias for frontend compatibility
        courseCategory: e.course.category,
        contentCount,
        suggestedDifficulty,
        gameId: existingGame?.id ?? null,
        presentationConfig: existingGame?.presentationConfig ?? null,
      });
    }

    return {
      slug,
      type: gameType,
      template: {
        id: template.id,
        name: template.name,
        description: template.description,
      },
      compatibility,
      courses: eligible, // renamed from eligibleCourses for frontend compat
    };
  }

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

    // Resolve Game record
    let game;
    if (gameId) {
      game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { template: true },
      });
      if (!game) throw new NotFoundError(`Game ${gameId} not found`);
      if (!gameType) gameType = game.template.type;
    } else if (gameType) {
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

    // Parental controls
    const pc = await checkParentalControls(memberId, gameType!, difficulty);
    if (!pc.allowed) throw new ForbiddenError(pc.reason ?? 'Game not allowed by parental settings');

    // Effective scope
    const effUnit = unitId ?? (gameId ? game.unitId ?? undefined : undefined);
    const effCourse = courseId ?? (gameId ? game.courseId ?? undefined : undefined);

    const availability = await checkContentAvailability(gameType!, effUnit, effCourse);
    if (!availability.available) {
      throw new BadRequestError(availability.missing ?? 'Not enough content for this game');
    }

    const roundCount = ROUNDS_BY_DIFFICULTY[difficulty];
    const items = await selectContent(gameType!, memberId, effUnit, effCourse, difficulty, roundCount);
    if (items.length === 0) throw new BadRequestError('No content available for this game configuration');

    const rounds = formatRounds(gameType!, items, difficulty, game.presentationConfig as any);
    const maxScore = rounds.length * (BASE_POINTS + SPEED_BONUS_MAX) * 3;

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
        roundsTotal: rounds.length,
        roundsCorrect: 0,
        livesUsed: 0,
        metadata: {},
        rounds: {
          create: rounds.map((r, idx) => ({
            roundIndex: idx,
            contentType: r.contentType,
            contentId: r.contentId,
            metadata: r.metadata as any,
          })),
        },
      },
      include: { rounds: { orderBy: { roundIndex: 'asc' } } },
    });

    return {
      session,
      config: {
        timer: GAME_DEFS[gameType!].timers[difficulty],
        totalRounds: rounds.length,
        difficulty,
        gameType,
        presentationConfig: game.presentationConfig ?? null,
      },
    };
  }

  static async submitRound(
    sessionId: string,
    roundId: string,
    answer: unknown,
    timeSpentMs: number,
  ) {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        game: { include: { template: true } },
        rounds: { orderBy: { roundIndex: 'asc' } },
      },
    });
    if (!session) throw new NotFoundError(`Session ${sessionId} not found`);
    if (session.status !== 'IN_PROGRESS') {
      throw new BadRequestError(`Session is ${session.status}, cannot submit rounds`);
    }

    const round = /^round-\d+$/.test(roundId)
      ? session.rounds.find((r) => r.roundIndex === parseInt(roundId.replace('round-', ''), 10))
      : session.rounds.find((r) => r.id === roundId);
    if (!round) throw new NotFoundError(`Round ${roundId} not found in session`);
    if (round.playerAnswer !== null) throw new BadRequestError('Round already answered');

    const isCorrect = await gradeAnswer(round, answer);

    // Current streak from preceding answered rounds
    let currentStreak = 0;
    const prevAnswered = session.rounds
      .filter((r) => r.playerAnswer !== null)
      .sort((a, b) => a.roundIndex - b.roundIndex);
    for (let i = prevAnswered.length - 1; i >= 0; i--) {
      if (prevAnswered[i].isCorrect) currentStreak++;
      else break;
    }
    if (isCorrect) currentStreak++;

    const gameType = session.game.template.type;
    const timer = GAME_DEFS[gameType].timers[session.difficulty];
    const points = calculateRoundScore(isCorrect, timeSpentMs, timer.durationMs, currentStreak);
    const srsRating = computeSrsRating(isCorrect, timeSpentMs, session.difficulty);

    const updatedRound = await prisma.gameRound.update({
      where: { id: round.id },
      data: {
        playerAnswer: answer as any,
        isCorrect,
        pointsEarned: points,
        timeSpentMs,
        srsRating,
      },
    });

    const newScore = session.score + points;
    const newCorrect = session.roundsCorrect + (isCorrect ? 1 : 0);
    const answeredCount = prevAnswered.length + 1;
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
      srsRating,
      correctAnswer: (round.metadata as any)?.correctAnswer ?? null,
      explanation: (round.metadata as any)?.explanation ?? null,
      currentStreak: isCorrect ? currentStreak : 0,
      runningScore: newScore,
      roundsRemaining: session.roundsTotal - answeredCount,
      sessionState: {
        score: newScore,
        streak: isCorrect ? currentStreak : 0,
        livesRemaining: null,
        roundsCompleted: answeredCount,
        roundsTotal: session.roundsTotal,
      },
    };
  }

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

    if (session.status === 'COMPLETED' || session.status === 'ABANDONED') {
      const existing = await prisma.gameScore.findUnique({ where: { sessionId } });
      return {
        session,
        gameScore: existing ? {
          totalScore: existing.totalScore,
          accuracy: existing.accuracy as number,
          timeSpentMs: existing.timeSpentMs,
          xpEarned: existing.xpEarned,
          bonuses: existing.bonuses as Record<string, number>,
        } : { totalScore: 0, accuracy: 0, timeSpentMs: 0, xpEarned: 0, bonuses: {} },
        achievements: [],
        streakUpdate: null,
        srsUpdates: [],
      };
    }

    const finalStatus: GameSessionStatus =
      reason === 'TIMED_OUT' ? 'TIMED_OUT' : reason === 'ABANDONED' ? 'ABANDONED' : 'COMPLETED';
    const stars = computeStars(session.score, session.maxScore);
    const xpEarned = Math.round(session.score * 0.1) + stars * 25;

    const updatedSession = await prisma.gameSession.update({
      where: { id: sessionId },
      data: { status: finalStatus, completedAt: new Date() },
    });

    const gameScore = await prisma.gameScore.upsert({
      where: { sessionId },
      create: {
        sessionId,
        memberId: session.memberId,
        totalScore: session.score,
        accuracy: session.accuracy,
        timeSpentMs: session.timeSpentMs,
        xpEarned,
        bonuses: { stars, streakBest: session.streakBest, reason: reason ?? null },
      },
      update: {
        totalScore: session.score,
        accuracy: session.accuracy,
        timeSpentMs: session.timeSpentMs,
        xpEarned,
        bonuses: { stars, streakBest: session.streakBest, reason: reason ?? null },
      },
    });

    await writeSrsUpdates(
      session.rounds.map((r) => ({
        contentType: r.contentType,
        contentId: r.contentId,
        isCorrect: r.isCorrect,
        srsRating: r.srsRating,
      })),
      session.memberId,
    );

    await updateStreak(session.memberId);

    await prisma.familyMember.update({
      where: { id: session.memberId },
      data: { totalPoints: { increment: xpEarned } },
    });

    await updateTimeLog(session.memberId, Math.ceil(session.timeSpentMs / 60000));

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
      gameScore: {
        totalScore: gameScore.totalScore,
        accuracy: gameScore.accuracy,
        timeSpentMs: gameScore.timeSpentMs,
        xpEarned: gameScore.xpEarned,
        bonuses: gameScore.bonuses as Record<string, number>,
      },
      achievements: [],
      streakUpdate: null,
      srsUpdates: [],
    };
  }

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
          session: { include: { game: { include: { template: { select: { type: true, name: true } } } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gameScore.count({ where }),
    ]);
    return { scores, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  static async getLeaderboard(gameType: string | null, familyId: string, period?: string) {
    let dateFrom: Date | undefined;
    const now = new Date();
    if (period === 'DAILY') dateFrom = startOfDay(now);
    else if (period === 'WEEKLY') { const d = new Date(now); d.setDate(d.getDate() - 7); dateFrom = startOfDay(d); }
    else if (period === 'MONTHLY') { const d = new Date(now); d.setMonth(d.getMonth() - 1); dateFrom = startOfDay(d); }

    const members = await prisma.familyMember.findMany({
      where: { familyId }, select: { id: true, name: true, avatarUrl: true },
    });
    const where: any = { memberId: { in: members.map((m) => m.id) } };
    if (dateFrom) where.createdAt = { gte: dateFrom };
    if (gameType) where.session = { game: { template: { type: gameType as GameType } } };

    const scores = await prisma.gameScore.findMany({
      where, select: { memberId: true, totalScore: true, accuracy: true },
    });

    const agg = new Map<string, { totalScore: number; gamesPlayed: number; accuracySum: number }>();
    for (const s of scores) {
      const e = agg.get(s.memberId) ?? { totalScore: 0, gamesPlayed: 0, accuracySum: 0 };
      e.totalScore += s.totalScore; e.gamesPlayed += 1; e.accuracySum += s.accuracy;
      agg.set(s.memberId, e);
    }

    const leaderboard = members
      .map((m) => {
        const a = agg.get(m.id);
        return {
          memberId: m.id, name: m.name, avatarUrl: m.avatarUrl,
          totalScore: a?.totalScore ?? 0,
          gamesPlayed: a?.gamesPlayed ?? 0,
          averageAccuracy: a && a.gamesPlayed > 0 ? Math.round(a.accuracySum / a.gamesPlayed) : 0,
        };
      })
      .filter((e) => e.gamesPlayed > 0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({ rank: index + 1, ...entry }));

    return { leaderboard, period: period ?? 'ALL_TIME', gameType };
  }

  static async getDailyChallenge(memberId: string) {
    const today = todayDateString();
    const todayDate = new Date(today);
    const seed = parseInt(today.replace(/-/g, ''), 10);

    let challenge = await prisma.dailyChallenge.findFirst({
      where: { date: todayDate, isActive: true },
      include: { attempts: { where: { memberId }, take: 1 } },
    });

    if (!challenge) {
      const qs = await prisma.question.findMany({
        orderBy: { createdAt: 'asc' }, take: 200, select: { id: true },
      });
      const shuffled = [...qs];
      let s = seed;
      for (let i = shuffled.length - 1; i > 0; i--) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const j = s % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      challenge = await prisma.dailyChallenge.create({
        data: {
          date: todayDate,
          difficulty: 'MEDIUM' as GameDifficulty,
          contentIds: shuffled.slice(0, 10).map((q) => q.id) as any,
          seed,
        },
        include: { attempts: { where: { memberId }, take: 1 } },
      });
    }

    const attempted = challenge.attempts.length > 0;
    const streak = await prisma.userStreakRecord.findUnique({ where: { memberId } });
    const contentIds = challenge.contentIds as string[];
    const questions = await prisma.question.findMany({ where: { id: { in: contentIds } } });

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

  static async submitDailyChallengeAttempt(
    challengeId: string,
    memberId: string,
    answers: Array<{ contentId: string; answer: string; timeSpentMs: number }>,
  ) {
    const challenge = await prisma.dailyChallenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundError(`Daily challenge ${challengeId} not found`);

    const existing = await prisma.dailyChallengeAttempt.findUnique({
      where: { challengeId_memberId: { challengeId, memberId } },
    });
    if (existing) throw new BadRequestError('Daily challenge already attempted');

    const contentIds = answers.map((a) => a.contentId);
    const questions = await prisma.question.findMany({ where: { id: { in: contentIds } } });
    const qMap = new Map(questions.map((q) => [q.id, q]));

    let correctCount = 0;
    let totalTimeMs = 0;
    const graded = answers.map((a) => {
      const q = qMap.get(a.contentId);
      const isCorrect = q ? a.answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : false;
      if (isCorrect) correctCount++;
      totalTimeMs += a.timeSpentMs;
      return {
        contentId: a.contentId,
        answer: a.answer,
        isCorrect,
        timeSpentMs: a.timeSpentMs,
        correctAnswer: q?.correctAnswer ?? null,
      };
    });
    const score = Math.round((correctCount / Math.max(answers.length, 1)) * 100);
    const accuracy = answers.length > 0 ? (correctCount / answers.length) * 100 : 0;

    const attempt = await prisma.dailyChallengeAttempt.create({
      data: {
        challengeId, memberId,
        score, accuracy,
        timeSpentMs: totalTimeMs,
        answers: graded as any,
        completedAt: new Date(),
      },
    });

    await updateStreak(memberId);

    const member = await prisma.familyMember.findUnique({
      where: { id: memberId }, select: { familyId: true },
    });
    if (member) {
      await recordActivity(memberId, member.familyId, ActivityEventType.GAME_PLAYED, {
        gameType: 'QUICK_RECALL', // Daily Challenge wraps Quick Recall content
        challengeId, score, accuracy,
      });
    }

    return { attempt, results: graded, score, accuracy, correctCount, totalQuestions: answers.length };
  }
}

// ---------------------------------------------------------------------------
// Grading — one branch per of the 9 game types. Answer shapes per redesign:
//
//   QUICK_RECALL      { selectedOption }  → string match vs correctAnswer
//   PAIR_MATCH        { matches: [{ termId, definitionId }] }  → all-pairs check
//   FLASHCARD_SPRINT  { rating: 1–5 }     → rating ≥ 3 counts as correct
//   CLOZE             { answers: string[] }  → all blanks match
//   WORD_SEARCH       { found: string[] }    → all words found
//   SEQUENCE_IT       { order: string[] }    → order matches metadata.correctOrder
//   WORD_SCRAMBLE     { answer: string }     → matches metadata.word
//   CALLIGRAPHY_TRACE { rating: 1–5 }        → rating ≥ 3
//   FIQH_SCENARIO     { choiceId } per round, OR { path: [choiceId,...] }
//                                            → choice marked isCorrect
// ---------------------------------------------------------------------------

async function gradeAnswer(
  round: { contentType: string; contentId: string; metadata: unknown },
  answer: unknown,
): Promise<boolean> {
  const meta = (round.metadata ?? {}) as Record<string, any>;
  const mode = meta.gameMode as GameType | undefined;

  // Unwrap common answer envelopes
  let raw: any = answer;
  if (answer && typeof answer === 'object' && !Array.isArray(answer)) {
    const a = answer as Record<string, unknown>;
    if ('selectedOption' in a) raw = a.selectedOption;
    else if ('answer' in a) raw = a.answer;
    else if ('value' in a) raw = a.value;
    else raw = answer;
  }

  switch (mode) {

    case 'QUICK_RECALL': {
      const expected = (meta.correctAnswer || '').toString().trim().toLowerCase();
      if (!expected) return false;
      const player = (typeof raw === 'string' ? raw : JSON.stringify(raw)).trim().toLowerCase();
      return player === expected;
    }

    case 'PAIR_MATCH': {
      const matches = (answer as any)?.matches;
      if (!Array.isArray(matches)) return false;
      const pairs: Array<{ id: string }> = meta.pairs || [];
      // Correct iff every submitted pair has termId === definitionId
      // (the frontend uses the same id for both sides) and all pairs are covered.
      const ids = new Set(pairs.map((p) => p.id));
      if (matches.length < pairs.length) return false;
      return matches.every((m: any) => m && m.termId && m.termId === m.definitionId && ids.has(m.termId));
    }

    case 'FLASHCARD_SPRINT':
    case 'CALLIGRAPHY_TRACE': {
      const rating = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
      return !isNaN(rating) && rating >= 3;
    }

    case 'CLOZE': {
      // New format: each round has a single `correctAnswer` string.
      // Frontend submits { answer: string, correct?: boolean }.
      const correctAnswer: string = meta.correctAnswer || '';
      const playerAnswer: string = typeof raw === 'string'
        ? raw
        : typeof (answer as any)?.answer === 'string'
          ? (answer as any).answer
          : '';
      if (!correctAnswer) return false;
      return playerAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }

    case 'WORD_SEARCH': {
      const expected: string[] = Array.isArray(meta.targetWords)
        ? meta.targetWords
        : Array.isArray(meta.words) ? meta.words : [];
      const found: string[] = Array.isArray(raw)
        ? raw.map((w) => String(w).toUpperCase())
        : Array.isArray((answer as any)?.found)
          ? ((answer as any).found as unknown[]).map((w) => String(w).toUpperCase())
          : Array.isArray((answer as any)?.foundWords)
            ? ((answer as any).foundWords as unknown[]).map((w) => String(w).toUpperCase())
            : [];
      if (expected.length === 0) return false;
      const hits = expected.filter((w) => found.includes(w.toUpperCase())).length;
      return hits / expected.length >= 0.6;
    }

    case 'SEQUENCE_IT': {
      const expected: string[] = Array.isArray(meta.correctOrder) ? meta.correctOrder : [];
      const player: string[] = Array.isArray(raw)
        ? raw.map(String)
        : Array.isArray((answer as any)?.order)
          ? ((answer as any).order as unknown[]).map(String)
          : [];
      if (expected.length === 0 || player.length !== expected.length) return false;
      return expected.every((id, i) => id === player[i]);
    }

    case 'WORD_SCRAMBLE': {
      const expected = (meta.word || '').toString().trim().toLowerCase();
      const player = (typeof raw === 'string' ? raw : '').trim().toLowerCase();
      return expected.length > 0 && player === expected;
    }

    case 'FIQH_SCENARIO': {
      // Single-node submission: { choiceId }
      const choiceId = (answer as any)?.choiceId ?? raw;
      const choices: Array<{ id: string; isCorrect: boolean }> = meta.choices || [];
      const chosen = choices.find((c) => c.id === choiceId);
      if (chosen) return chosen.isCorrect;
      // Path submission: { path: [choiceId,...] } — correct if final choice was correct
      const path = (answer as any)?.path;
      if (Array.isArray(path) && path.length > 0) {
        const last = path[path.length - 1];
        const c = choices.find((x) => x.id === last);
        return !!c?.isCorrect;
      }
      return false;
    }

    default:
      return false;
  }
}
