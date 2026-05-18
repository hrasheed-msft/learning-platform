import { create } from 'zustand';
import { gameService } from '@/services/gameService';
import type {
  Game,
  GameSession,
  GameDifficulty,
  GameScore,
  RoundResult,
  GameCompletionResult,
  DailyChallenge,
  UserAchievement,
  LeaderboardEntry,
  StreakInfo,
  GameParentalSettings,
  GameTimeStatus,
  GameFilters,
  LeaderboardParams,
  ScoreHistoryParams,
  UserBadge,
  BadgeProgress,
} from '@/types/game';

interface GameState {
  // Game discovery
  availableGames: Game[];
  dailyChallenge: DailyChallenge | null;
  isLoadingGames: boolean;

  // Launcher selections (chosen on /games/:slug/launch, consumed by GamePlay)
  selectedGameSlug: string | null;
  selectedCourseId: string | null;
  selectedGameId: string | null;
  selectedDifficulty: GameDifficulty;

  // Active session
  activeSession: GameSession | null;
  currentRound: number;
  score: number;
  streak: number;
  lives: number | null;
  timeRemainingMs: number | null;
  rounds: RoundResult[];

  // Results
  lastResult: GameCompletionResult | null;

  // Scores
  scoreHistory: GameScore[];
  scorePagination: { page: number; limit: number; total: number };

  // Achievements & Badges
  achievements: UserAchievement[];
  totalXp: number;
  earnedBadges: UserBadge[];
  availableBadges: BadgeProgress[];

  // Leaderboard
  leaderboardEntries: LeaderboardEntry[];
  myRank: number;

  // Streak
  streakInfo: StreakInfo | null;

  // Parental Controls
  parentalSettings: GameParentalSettings | null;
  gameTime: GameTimeStatus | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions — Discovery
  fetchAvailableGames: (filters: GameFilters) => Promise<void>;
  fetchDailyChallenge: (memberId: string) => Promise<void>;

  // Actions — Session
  startGame: (gameId: string, memberId: string, difficulty: GameDifficulty) => Promise<void>;
  submitAnswer: (roundIndex: number, answer: unknown, timeSpentMs: number) => Promise<RoundResult>;
  completeGame: (reason: 'FINISHED' | 'ABANDONED' | 'TIMED_OUT') => Promise<GameCompletionResult>;
  resetSession: () => void;

  // Actions — Data
  fetchScoreHistory: (params: ScoreHistoryParams) => Promise<void>;
  fetchLeaderboard: (params: LeaderboardParams) => Promise<void>;
  fetchAchievements: (memberId: string) => Promise<void>;
  fetchBadges: (memberId: string) => Promise<void>;
  fetchStreak: (memberId: string) => Promise<void>;

  // Actions — Parental
  fetchParentalSettings: (memberId: string) => Promise<void>;
  fetchGameTime: (memberId: string) => Promise<void>;

  // Actions — Timer
  setTimeRemaining: (ms: number | null) => void;

  // Actions — Launcher
  setLauncherSelection: (selection: {
    gameSlug?: string;
    courseId?: string;
    gameId?: string;
    difficulty?: GameDifficulty;
  }) => void;
  clearLauncherSelection: () => void;

  clearError: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  availableGames: [],
  dailyChallenge: null,
  isLoadingGames: false,
  selectedGameSlug: null,
  selectedCourseId: null,
  selectedGameId: null,
  selectedDifficulty: 'MEDIUM',
  activeSession: null,
  currentRound: 0,
  score: 0,
  streak: 0,
  lives: null,
  timeRemainingMs: null,
  rounds: [],
  lastResult: null,
  scoreHistory: [],
  scorePagination: { page: 1, limit: 20, total: 0 },
  achievements: [],
  totalXp: 0,
  earnedBadges: [],
  availableBadges: [],
  leaderboardEntries: [],
  myRank: 0,
  streakInfo: null,
  parentalSettings: null,
  gameTime: null,
  isLoading: false,
  error: null,

  fetchAvailableGames: async (filters) => {
    set({ isLoadingGames: true, error: null });
    try {
      const data = await gameService.getAvailableGames(filters);
      set({
        availableGames: data.games,
        dailyChallenge: data.dailyChallenge,
        isLoadingGames: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch games',
        isLoadingGames: false,
      });
    }
  },

  fetchDailyChallenge: async (memberId) => {
    try {
      const data = await gameService.getDailyChallenge(memberId);
      set({
        dailyChallenge: {
          ...data.challenge,
          attempted: data.attempted,
          streak: data.streak,
        },
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch daily challenge' });
    }
  },

  startGame: async (gameId, memberId, difficulty) => {
    set({ isLoading: true, error: null, lastResult: null });
    try {
      const data = await gameService.startGame(gameId, memberId, difficulty);
      const session = data.session;
      set({
        activeSession: session,
        currentRound: 0,
        score: 0,
        streak: 0,
        lives: session.livesConfig?.enabled ? session.livesConfig.initial : null,
        timeRemainingMs: session.timerConfig?.type !== 'NONE' ? session.timerConfig?.durationMs ?? null : null,
        rounds: [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to start game',
        isLoading: false,
      });
      throw error;
    }
  },

  submitAnswer: async (roundIndex, answer, timeSpentMs) => {
    const { activeSession } = get();
    if (!activeSession) throw new Error('No active session');

    try {
      const result = await gameService.submitRound(activeSession.id, roundIndex, answer, timeSpentMs);
      set((state) => {
        const newRounds = [...state.rounds, result];
        const ss = result.sessionState ?? ({} as any);
        return {
          rounds: newRounds,
          // Prefer backend value, but fall back to client-side count so the
          // component never gets stuck if the server response is malformed.
          currentRound: typeof ss.roundsCompleted === 'number' ? ss.roundsCompleted : newRounds.length,
          score: typeof ss.score === 'number' ? ss.score : state.score + (result.pointsEarned ?? 0),
          streak: typeof ss.streak === 'number' ? ss.streak : (result.isCorrect ? state.streak + 1 : 0),
          lives: ss.livesRemaining ?? state.lives,
        };
      });
      return result;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to submit answer' });
      throw error;
    }
  },

  completeGame: async (reason) => {
    const { activeSession, score, rounds } = get();
    if (!activeSession) throw new Error('No active session');

    set({ isLoading: true });
    try {
      const result = await gameService.completeGame(activeSession.id, reason);
      set({
        lastResult: result,
        activeSession: null,
        isLoading: false,
      });
      return result;
    } catch (error) {
      // Build a fallback result so GameOverScreen still renders
      const fallbackResult = {
        session: {
          ...activeSession,
          accuracy: rounds.length > 0 ? rounds.filter(r => r.isCorrect).length / rounds.length : 0,
          streakBest: 0,
          timeSpentMs: 0,
        },
        gameScore: { totalScore: score, xpEarned: 0, bonuses: {} },
        achievements: [],
        streakUpdate: null,
        srsUpdates: [],
      };
      set({
        lastResult: fallbackResult as any,
        activeSession: null,
        isLoading: false,
      });
      return fallbackResult as any;
    }
  },

  resetSession: () => {
    set({
      activeSession: null,
      currentRound: 0,
      score: 0,
      streak: 0,
      lives: null,
      timeRemainingMs: null,
      rounds: [],
      lastResult: null,
      error: null,
    });
  },

  fetchScoreHistory: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await gameService.getScoreHistory(params);
      set({
        scoreHistory: data.scores,
        scorePagination: data.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch scores',
        isLoading: false,
      });
    }
  },

  fetchLeaderboard: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await gameService.getLeaderboard(params);
      set({
        leaderboardEntries: data.leaderboard?.entries ?? [],
        myRank: data.myRank ?? 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch leaderboard',
        isLoading: false,
      });
    }
  },

  fetchAchievements: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await gameService.getAchievements(memberId);
      set({
        achievements: data.achievements ?? [],
        totalXp: data.totalXpFromAchievements ?? 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch achievements',
        isLoading: false,
      });
    }
  },

  fetchBadges: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await gameService.getBadges(memberId);
      set({
        earnedBadges: data.earned,
        availableBadges: data.available,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch badges',
        isLoading: false,
      });
    }
  },

  fetchStreak: async (memberId) => {
    try {
      const data = await gameService.getStreak(memberId);
      set({ streakInfo: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch streak' });
    }
  },

  fetchParentalSettings: async (memberId) => {
    try {
      const data = await gameService.getParentalSettings(memberId);
      set({ parentalSettings: data });
    } catch {
      // No settings configured is not an error
      set({ parentalSettings: null });
    }
  },

  fetchGameTime: async (memberId) => {
    try {
      const data = await gameService.getGameTime(memberId);
      set({ gameTime: data });
    } catch {
      set({ gameTime: null });
    }
  },

  setTimeRemaining: (ms) => set({ timeRemainingMs: ms }),

  setLauncherSelection: (selection) =>
    set((state) => ({
      selectedGameSlug: selection.gameSlug ?? state.selectedGameSlug,
      selectedCourseId: selection.courseId ?? state.selectedCourseId,
      selectedGameId: selection.gameId ?? state.selectedGameId,
      selectedDifficulty: selection.difficulty ?? state.selectedDifficulty,
    })),

  clearLauncherSelection: () =>
    set({
      selectedGameSlug: null,
      selectedCourseId: null,
      selectedGameId: null,
      selectedDifficulty: 'MEDIUM',
    }),

  clearError: () => set({ error: null }),
}));
