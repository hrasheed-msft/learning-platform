import type { GameType, ActiveGameType } from '@/types/game';

/**
 * Safely extract options from round content.
 * Handles cases where options is a stringified JSON array (double-encoded in DB).
 */
export function getOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not valid JSON
    }
  }
  return [];
}

/**
 * Map any backend GameType (legacy or new) to one of the 9 active mechanics.
 * Used when grouping legacy game records under the new taxonomy.
 */
export function mapToActiveType(type: GameType): ActiveGameType {
  switch (type) {
    // MCQ family → Quick Recall
    case 'MULTIPLE_CHOICE':
    case 'SPEED_QUIZ':
    case 'TRIVIA_BATTLE':
    case 'ESCAPE_ROOM':
    case 'MAZE_RUNNER':
    case 'MAZE_NAVIGATOR':
    case 'KNOWLEDGE_EXPEDITION':
    case 'MOSQUE_BUILDER':
    case 'PATTERN_CREATOR':
    case 'LISTENING_QUIZ':
    case 'TRUE_FALSE':
    case 'DAILY_CHALLENGE':
    case 'QUICK_RECALL':
      return 'QUICK_RECALL';
    // Pair family
    case 'TERM_MATCH':
    case 'MEMORY_MATCH':
    case 'PAIR_MATCH':
      return 'PAIR_MATCH';
    // Flashcard self-rate
    case 'FLASHCARD_FLIP':
    case 'FLASHCARD_SPRINT':
      return 'FLASHCARD_SPRINT';
    // Cloze family
    case 'FILL_IN_BLANK':
    case 'AYAH_COMPLETION':
    case 'SPELLING_BEE':
    case 'CLOZE':
      return 'CLOZE';
    case 'WORD_SEARCH':
      return 'WORD_SEARCH';
    // Sequence family
    case 'HADITH_CHAIN':
    case 'SEERAH_TIMELINE':
    case 'SENTENCE_BUILD':
    case 'STORY_PUZZLE':
    case 'SEQUENCE_IT':
      return 'SEQUENCE_IT';
    case 'WORD_SCRAMBLE':
      return 'WORD_SCRAMBLE';
    case 'CALLIGRAPHY_TRACE':
      return 'CALLIGRAPHY_TRACE';
    case 'FIQH_SCENARIO':
      return 'FIQH_SCENARIO';
    default:
      return 'QUICK_RECALL';
  }
}

export const ACTIVE_GAME_TYPES: ActiveGameType[] = [
  'QUICK_RECALL',
  'PAIR_MATCH',
  'FLASHCARD_SPRINT',
  'CLOZE',
  'WORD_SEARCH',
  'SEQUENCE_IT',
  'WORD_SCRAMBLE',
  'CALLIGRAPHY_TRACE',
  'FIQH_SCENARIO',
];

export const SLUG_TO_TYPE: Record<string, ActiveGameType> = {
  'quick-recall': 'QUICK_RECALL',
  'pair-match': 'PAIR_MATCH',
  'flashcard-sprint': 'FLASHCARD_SPRINT',
  'cloze': 'CLOZE',
  'word-search': 'WORD_SEARCH',
  'sequence-it': 'SEQUENCE_IT',
  'word-scramble': 'WORD_SCRAMBLE',
  'calligraphy-trace': 'CALLIGRAPHY_TRACE',
  'fiqh-scenario': 'FIQH_SCENARIO',
};

export const TYPE_TO_SLUG: Record<ActiveGameType, string> = {
  QUICK_RECALL: 'quick-recall',
  PAIR_MATCH: 'pair-match',
  FLASHCARD_SPRINT: 'flashcard-sprint',
  CLOZE: 'cloze',
  WORD_SEARCH: 'word-search',
  SEQUENCE_IT: 'sequence-it',
  WORD_SCRAMBLE: 'word-scramble',
  CALLIGRAPHY_TRACE: 'calligraphy-trace',
  FIQH_SCENARIO: 'fiqh-scenario',
};

/**
 * Shuffle an array in place (Fisher-Yates). Returns a new shuffled array.
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

