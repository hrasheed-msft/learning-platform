// Game Types — matching backend enums and API contracts

export type GameType =
  | 'TERM_MATCH'
  | 'AYAH_COMPLETION'
  | 'FIQH_SCENARIO'
  | 'HADITH_CHAIN'
  | 'WORD_SEARCH'
  | 'SPEED_QUIZ'
  | 'FLASHCARD_FLIP'
  | 'DAILY_CHALLENGE'
  | 'KNOWLEDGE_EXPEDITION'
  | 'TRIVIA_BATTLE'
  | 'MOSQUE_BUILDER'
  | 'PATTERN_CREATOR'
  | 'SEERAH_TIMELINE'
  | 'ESCAPE_ROOM'
  | 'MAZE_NAVIGATOR';

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
  arabicText?: string;
  transliteration?: string;
  translation?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  front?: string;
  frontArabic?: string;
  back?: string;
  backArabic?: string;
  explanation?: string;
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
  TERM_MATCH: { name: 'Term Match', emoji: '🃏', color: 'bg-purple-500', description: 'Match Arabic terms to their translations' },
  AYAH_COMPLETION: { name: 'Ayah Completion', emoji: '📖', color: 'bg-emerald-500', description: 'Complete Quranic verses with missing words' },
  FIQH_SCENARIO: { name: 'Fiqh Scenario', emoji: '⚖️', color: 'bg-amber-500', description: 'Navigate Islamic jurisprudence scenarios' },
  HADITH_CHAIN: { name: 'Hadith Chain', emoji: '🔗', color: 'bg-blue-500', description: 'Arrange hadith segments in correct order' },
  WORD_SEARCH: { name: 'Word Search', emoji: '🔍', color: 'bg-teal-500', description: 'Find Arabic terms hidden in a letter grid' },
  SPEED_QUIZ: { name: 'Speed Quiz', emoji: '⚡', color: 'bg-red-500', description: 'Answer rapid-fire questions against the clock' },
  FLASHCARD_FLIP: { name: 'Flashcard Flip', emoji: '🔄', color: 'bg-indigo-500', description: 'Review flashcards with swipe-based rating' },
  DAILY_CHALLENGE: { name: 'Daily Challenge', emoji: '🌟', color: 'bg-yellow-500', description: 'Complete today\'s challenge from all your courses' },
  KNOWLEDGE_EXPEDITION: { name: 'Knowledge Expedition', emoji: '🗺️', color: 'bg-orange-500', description: 'Build cities through knowledge challenges' },
  TRIVIA_BATTLE: { name: 'Trivia Battle', emoji: '⚔️', color: 'bg-rose-500', description: 'Compete against AI scholars in trivia' },
  MOSQUE_BUILDER: { name: 'Mosque Builder', emoji: '🕌', color: 'bg-green-500', description: 'Build a mosque by answering correctly' },
  PATTERN_CREATOR: { name: 'Pattern Creator', emoji: '🎨', color: 'bg-cyan-500', description: 'Create Islamic patterns through knowledge' },
  SEERAH_TIMELINE: { name: 'Seerah Timeline', emoji: '📅', color: 'bg-violet-500', description: 'Place Islamic history events on a timeline' },
  ESCAPE_ROOM: { name: 'Escape Room', emoji: '🔐', color: 'bg-fuchsia-500', description: 'Solve knowledge challenges to escape themed rooms' },
  MAZE_NAVIGATOR: { name: 'Maze Navigator', emoji: '🧭', color: 'bg-lime-500', description: 'Navigate mazes by answering questions at gates' },
};
