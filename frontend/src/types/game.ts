// Game Types — matching backend enums and API contracts

export type GameType =
  // Course-integrated
  | 'TERM_MATCH'
  | 'SPEED_QUIZ'
  | 'FLASHCARD_FLIP'
  | 'WORD_SCRAMBLE'
  | 'FILL_IN_BLANK'
  | 'MEMORY_MATCH'
  | 'TRUE_FALSE'
  | 'MULTIPLE_CHOICE'
  | 'SENTENCE_BUILD'
  | 'LISTENING_QUIZ'
  | 'CALLIGRAPHY_TRACE'
  | 'SPELLING_BEE'
  | 'AYAH_COMPLETION'
  | 'FIQH_SCENARIO'
  | 'HADITH_CHAIN'
  | 'WORD_SEARCH'
  // Standalone
  | 'STORY_PUZZLE'
  | 'ESCAPE_ROOM'
  | 'MAZE_RUNNER'
  | 'MAZE_NAVIGATOR'
  | 'DAILY_CHALLENGE'
  | 'KNOWLEDGE_EXPEDITION'
  | 'TRIVIA_BATTLE'
  | 'MOSQUE_BUILDER'
  | 'PATTERN_CREATOR'
  | 'SEERAH_TIMELINE';

export type GameCategory = 'COURSE_INTEGRATED' | 'STANDALONE';
export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type GameSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'TIMED_OUT';
export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
export type BadgeCategory = 'STREAK' | 'MASTERY' | 'EXPLORER' | 'SPEED' | 'BUILDER' | 'SOCIAL' | 'SPECIAL';
export type LeaderboardScope = 'FAMILY' | 'GLOBAL';
export type LeaderboardPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';

export interface GameTemplate {
  type: GameType;
  category: GameCategory;
  name: string;
  description: string;
  iconUrl?: string;
}

export interface Game {
  id: string;
  template: GameTemplate;
  difficulty: GameDifficulty;
  courseId?: string;
  courseName?: string;
  unitId?: string;
  contentCount: number;
  suggestedDifficulty: GameDifficulty;
  lastPlayed?: string;
  bestScore?: number;
}

export interface TimerConfig {
  type: 'PER_QUESTION' | 'GLOBAL' | 'NONE';
  durationMs: number;
  warningAtMs?: number;
}

export interface LivesConfig {
  enabled: boolean;
  initial: number;
  bonusLiveThreshold?: number;
}

export interface GameRound {
  roundIndex: number;
  contentType: 'QUESTION' | 'FLASHCARD' | 'ARABIC_TERM';
  content: GameContent;
}

export interface GameContent {
  id: string;
  // Common question fields
  arabicText?: string;
  transliteration?: string;
  translation?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  // Flashcard fields
  front?: string;
  frontArabic?: string;
  back?: string;
  backArabic?: string;
  explanation?: string;
  // TERM_MATCH / MEMORY_MATCH pairs
  pairs?: Array<{ id: string; term: string; definition: string; transliteration?: string; [key: string]: unknown }>;
  // Escape Room / Maze fields
  clue?: string;
  hint?: string;
  stage?: number;
  checkpoint?: number;
  // SENTENCE_BUILD
  words?: string[];
  correctOrder?: string[];
  // WORD_SEARCH / WORD_SCRAMBLE
  grid?: string[][];
  targetWords?: string[];
  scrambledWord?: string;
  // CALLIGRAPHY_TRACE
  letter?: string;
  strokeData?: unknown;
  // HADITH_CHAIN
  narrators?: Array<{ id: string; name: string; [key: string]: unknown }>;
  // STORY_PUZZLE / SEERAH_TIMELINE
  segments?: Array<{ id: string; text: string; [key: string]: unknown }>;
  events?: Array<{ id: string; title: string; year?: string; [key: string]: unknown }>;
  // MOSQUE_BUILDER / PATTERN_CREATOR
  pattern?: unknown;
  reward?: unknown;
  // Speed quiz / game mode hints
  gameMode?: string;
  timeLimit?: number;
  // Catch-all for any additional backend metadata fields
  [key: string]: unknown;
}

export interface GameSession {
  id: string;
  status: GameSessionStatus;
  difficulty: GameDifficulty;
  score: number;
  maxScore: number;
  accuracy: number;
  streakBest: number;
  timeSpentMs: number;
  roundsTotal: number;
  roundsCorrect: number;
  livesUsed: number;
  rounds: GameRound[];
  timerConfig: TimerConfig;
  livesConfig: LivesConfig;
  totalRounds: number;
  startedAt?: string;
  completedAt?: string;
}

export interface RoundResult {
  isCorrect: boolean;
  pointsEarned: number;
  srsRating: number;
  explanation?: string;
  sessionState: {
    score: number;
    streak: number;
    livesRemaining: number | null;
    roundsCompleted: number;
    roundsTotal: number;
  };
}

export interface GameScore {
  id: string;
  totalScore: number;
  accuracy: number;
  timeSpentMs: number;
  xpEarned: number;
  bonuses?: Record<string, number>;
  createdAt: string;
  game?: { type: GameType; name: string };
}

export interface GameCompletionResult {
  session: GameSession;
  gameScore: GameScore;
  achievements: UserAchievement[];
  streakUpdate: {
    currentStreak: number;
    longestStreak: number;
    streakAchievement?: { streakCount: number; earnedAt: string } | null;
  };
  srsUpdates: Array<{
    flashCardId: string;
    newStatus: string;
    nextReviewDate: string;
  }>;
}

export interface DailyChallenge {
  id: string;
  date: string;
  difficulty: GameDifficulty;
  questionCount: number;
  attempted: boolean;
  streak: {
    currentStreak: number;
    longestStreak: number;
  };
}

export interface UserAchievement {
  id: string;
  type: string;
  name: string;
  description: string;
  iconUrl?: string;
  xpReward: number;
  earnedAt: string;
  metadata?: Record<string, unknown>;
}

export interface BadgeDefinition {
  key: string;
  name: string;
  description?: string;
  category: BadgeCategory;
  tier: AchievementTier;
  iconUrl?: string;
}

export interface UserBadge {
  badge: BadgeDefinition;
  earnedAt: string;
}

export interface BadgeProgress {
  badge: BadgeDefinition;
  progress: { current: number; target: number };
}

export interface LeaderboardEntry {
  rank: number;
  member: { id: string; name: string; avatarUrl?: string };
  score: number;
  gamesPlayed: number;
  accuracy: number;
}

export interface Leaderboard {
  id: string;
  scope: LeaderboardScope;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  gracePeriodUsed: boolean;
  freezesRemaining: number;
  milestones: number[];
  nextMilestone: number;
  daysToNextMilestone: number;
  streakAchievements: Array<{ streakCount: number; earnedAt: string }>;
}

export interface GameParentalSettings {
  id: string;
  familyMemberId: string;
  dailyLimitMinutes: number;
  weekendLimitMinutes: number;
  allowedGameTypes: GameType[];
  maxDifficulty: GameDifficulty;
  enforceAfterHour?: number;
  isActive: boolean;
  updatedAt: string;
}

export interface GameTimeStatus {
  date: string;
  dayOfWeek: string;
  minutesPlayedToday: number;
  sessionsPlayedToday: number;
  dailyLimitMinutes: number | null;
  minutesRemainingToday: number | null;
  percentageUsed: number;
  lastSessionEndedAt?: string;
  parentalSettingsActive: boolean;
  enforceAfterHour?: number;
}

export interface GameFilters {
  courseId?: string;
  unitId?: string;
  category?: GameCategory;
  memberId: string;
}

export interface LeaderboardParams {
  scope: LeaderboardScope;
  period: LeaderboardPeriod;
  gameType?: GameType;
  limit?: number;
  memberId: string;
}

export interface ScoreHistoryParams {
  memberId: string;
  gameType?: GameType;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// Game metadata for UI display
export const GAME_META: Record<GameType, { name: string; emoji: string; color: string; description: string }> = {
  TERM_MATCH: { name: 'Term Match', emoji: '🃏', color: 'bg-purple-500', description: 'Match Arabic terms to their definitions' },
  SPEED_QUIZ: { name: 'Speed Quiz', emoji: '⚡', color: 'bg-red-500', description: 'Answer rapid-fire questions against the clock' },
  FLASHCARD_FLIP: { name: 'Flashcard Flip', emoji: '🔄', color: 'bg-indigo-500', description: 'Flip cards to reveal definitions and rate yourself' },
  WORD_SCRAMBLE: { name: 'Word Scramble', emoji: '🔤', color: 'bg-amber-500', description: 'Unscramble letters to spell the correct word' },
  FILL_IN_BLANK: { name: 'Fill in the Blank', emoji: '✏️', color: 'bg-teal-500', description: 'Complete sentences with the missing word' },
  MEMORY_MATCH: { name: 'Memory Match', emoji: '🧠', color: 'bg-blue-500', description: 'Flip cards to find matching pairs' },
  TRUE_FALSE: { name: 'True or False', emoji: '✅', color: 'bg-emerald-500', description: 'Decide if statements are true or false' },
  MULTIPLE_CHOICE: { name: 'Multiple Choice', emoji: '📝', color: 'bg-orange-500', description: 'Pick the correct answer from four options' },
  SENTENCE_BUILD: { name: 'Sentence Builder', emoji: '🧩', color: 'bg-cyan-500', description: 'Arrange words in the correct order' },
  LISTENING_QUIZ: { name: 'Listening Quiz', emoji: '🎧', color: 'bg-rose-500', description: 'Listen and answer questions about what you hear' },
  CALLIGRAPHY_TRACE: { name: 'Calligraphy Trace', emoji: '🖌️', color: 'bg-violet-500', description: 'Trace Arabic letters with your finger or mouse' },
  SPELLING_BEE: { name: 'Spelling Bee', emoji: '🐝', color: 'bg-yellow-500', description: 'Read the definition and spell the word correctly' },
  AYAH_COMPLETION: { name: 'Ayah Completion', emoji: '📖', color: 'bg-sky-500', description: 'Complete missing words in Quranic verses' },
  FIQH_SCENARIO: { name: 'Fiqh Scenario', emoji: '⚖️', color: 'bg-slate-500', description: 'Choose the correct ruling for real-life scenarios' },
  HADITH_CHAIN: { name: 'Hadith Chain', emoji: '🔗', color: 'bg-stone-500', description: 'Arrange narrators in the correct chain' },
  WORD_SEARCH: { name: 'Word Search', emoji: '🔍', color: 'bg-pink-500', description: 'Find hidden Islamic terms in a letter grid' },
  STORY_PUZZLE: { name: 'Story Puzzle', emoji: '📚', color: 'bg-green-500', description: 'Arrange story segments in the right order' },
  ESCAPE_ROOM: { name: 'Escape Room', emoji: '🔐', color: 'bg-fuchsia-500', description: 'Solve challenges to escape themed rooms' },
  MAZE_RUNNER: { name: 'Maze Runner', emoji: '🧭', color: 'bg-lime-500', description: 'Navigate mazes by answering questions at gates' },
  MAZE_NAVIGATOR: { name: 'Maze Navigator', emoji: '🗺️', color: 'bg-emerald-600', description: 'Answer questions to unlock maze paths' },
  DAILY_CHALLENGE: { name: 'Daily Challenge', emoji: '📅', color: 'bg-amber-600', description: 'A fresh set of questions every day' },
  KNOWLEDGE_EXPEDITION: { name: 'Knowledge Expedition', emoji: '🗻', color: 'bg-blue-600', description: 'Journey through Islamic knowledge zones' },
  TRIVIA_BATTLE: { name: 'Trivia Battle', emoji: '⚔️', color: 'bg-red-600', description: 'Compete in an Islamic trivia showdown' },
  MOSQUE_BUILDER: { name: 'Mosque Builder', emoji: '🕌', color: 'bg-teal-600', description: 'Build a virtual mosque by answering correctly' },
  PATTERN_CREATOR: { name: 'Pattern Creator', emoji: '🎨', color: 'bg-purple-600', description: 'Complete Arabic and geometric patterns' },
  SEERAH_TIMELINE: { name: 'Seerah Timeline', emoji: '📜', color: 'bg-orange-600', description: "Order events from the Prophet's life (ﷺ)" },
};
