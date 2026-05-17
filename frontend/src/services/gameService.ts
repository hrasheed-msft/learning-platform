import api from './api';
import type {
  Game,
  GameSession,
  GameDifficulty,
  RoundResult,
  GameCompletionResult,
  DailyChallenge,
  GameScore,
  Leaderboard,
  UserAchievement,
  UserBadge,
  BadgeProgress,
  StreakInfo,
  GameParentalSettings,
  GameTimeStatus,
  GameFilters,
  LeaderboardParams,
  ScoreHistoryParams,
} from '@/types/game';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const gameService = {
  // --- Game Discovery ---

  async getAvailableGames(filters: GameFilters): Promise<{ games: Game[]; dailyChallenge: DailyChallenge | null }> {
    const response = await api.get<ApiResponse<{ games: Game[]; dailyChallenge: DailyChallenge | null }>>('/games/available', { params: filters });
    return response.data.data;
  },

  async getGamesByUnit(unitId: string, memberId: string): Promise<Game[]> {
    const response = await api.get<ApiResponse<Game[]>>('/games/available', {
      params: { unitId, memberId, category: 'COURSE_INTEGRATED' },
    });
    return response.data.data ?? [];
  },

  async getGamesByCourse(courseId: string, memberId: string): Promise<Game[]> {
    const response = await api.get<ApiResponse<Game[]>>('/games/available', {
      params: { courseId, memberId },
    });
    return response.data.data ?? [];
  },

  // --- Session Lifecycle ---

  async startGame(gameId: string, memberId: string, difficulty: GameDifficulty): Promise<{ session: GameSession }> {
    const response = await api.post<ApiResponse<{ session: GameSession }>>(`/games/${gameId}/sessions`, {
      memberId,
      difficulty,
    });
    return response.data.data;
  },

  async submitRound(sessionId: string, roundIndex: number, answer: unknown, timeSpentMs: number): Promise<RoundResult> {
    const response = await api.post<ApiResponse<RoundResult>>(`/games/sessions/${sessionId}/rounds`, {
      roundIndex,
      answer,
      timeSpentMs,
    });
    return response.data.data;
  },

  async completeGame(sessionId: string, reason: 'FINISHED' | 'ABANDONED' | 'TIMED_OUT'): Promise<GameCompletionResult> {
    const response = await api.post<ApiResponse<GameCompletionResult>>(`/games/sessions/${sessionId}/complete`, {
      reason,
    });
    return response.data.data;
  },

  async abandonGame(sessionId: string): Promise<void> {
    await api.delete(`/games/sessions/${sessionId}`);
  },

  async getSession(sessionId: string): Promise<GameSession> {
    const response = await api.get<ApiResponse<GameSession>>(`/games/sessions/${sessionId}`);
    return response.data.data;
  },

  // --- Daily Challenge ---

  async getDailyChallenge(memberId: string): Promise<{ challenge: DailyChallenge; attempted: boolean; streak: { currentStreak: number; longestStreak: number } }> {
    const response = await api.get<ApiResponse<{ challenge: DailyChallenge; attempted: boolean; streak: { currentStreak: number; longestStreak: number } }>>('/games/daily-challenge', {
      params: { memberId },
    });
    return response.data.data;
  },

  async submitDailyChallenge(challengeId: string, memberId: string, answers: Array<{ contentId: string; answer: string; timeSpentMs: number }>): Promise<GameCompletionResult> {
    const response = await api.post<ApiResponse<GameCompletionResult>>(`/games/daily-challenge/${challengeId}/attempt`, {
      memberId,
      answers,
    });
    return response.data.data;
  },

  // --- Scores & Leaderboards ---

  async getScoreHistory(params: ScoreHistoryParams): Promise<{ scores: GameScore[]; pagination: { page: number; limit: number; total: number } }> {
    const response = await api.get<ApiResponse<{ scores: GameScore[]; pagination: { page: number; limit: number; total: number } }>>('/games/scores/history', {
      params,
    });
    return response.data.data;
  },

  async getLeaderboard(params: LeaderboardParams): Promise<{ leaderboard: Leaderboard; myRank: number }> {
    const response = await api.get<ApiResponse<{ leaderboard: Leaderboard; myRank: number }>>('/games/leaderboards', {
      params,
    });
    return response.data.data;
  },

  // --- Achievements & Badges ---

  async getAchievements(memberId: string): Promise<{ achievements: UserAchievement[]; totalXpFromAchievements: number }> {
    const response = await api.get<ApiResponse<{ achievements: UserAchievement[]; totalXpFromAchievements: number }>>('/games/achievements', {
      params: { memberId },
    });
    return response.data.data;
  },

  async getBadges(memberId: string): Promise<{ earned: UserBadge[]; available: BadgeProgress[] }> {
    const response = await api.get<ApiResponse<{ earned: UserBadge[]; available: BadgeProgress[] }>>('/games/badges', {
      params: { memberId },
    });
    return response.data.data;
  },

  // --- Streaks ---

  async getStreak(memberId: string): Promise<StreakInfo> {
    const response = await api.get<ApiResponse<StreakInfo>>('/games/streaks', {
      params: { memberId },
    });
    return response.data.data;
  },

  // --- Parental Controls ---

  async getParentalSettings(memberId: string): Promise<GameParentalSettings> {
    const response = await api.get<ApiResponse<GameParentalSettings>>(`/family/members/${memberId}/game-settings`);
    return response.data.data;
  },

  async updateParentalSettings(memberId: string, settings: Partial<GameParentalSettings>): Promise<GameParentalSettings> {
    const response = await api.put<ApiResponse<GameParentalSettings>>(`/family/members/${memberId}/game-settings`, settings);
    return response.data.data;
  },

  async getGameTime(memberId: string): Promise<GameTimeStatus> {
    const response = await api.get<ApiResponse<GameTimeStatus>>(`/family/members/${memberId}/game-time`);
    return response.data.data;
  },
};
