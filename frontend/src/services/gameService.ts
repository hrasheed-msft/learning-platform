import api from './api';
import type {
  Game,
  GameSession,
  GameRound,
  GameDifficulty,
  RoundResult,
  GameCompletionResult,
  DailyChallenge,
  GameScore,
  Leaderboard,
  LeaderboardEntry,
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

/**
 * Backend returns round data in `metadata`; frontend components expect `content`.
 * This maps metadata → content so all 26 game components work without changes.
 */
function transformRounds(rounds: any[]): GameRound[] {
  return rounds.map((r: any) => {
    const raw = r.metadata ?? r.content ?? {};
    // Some JSON fields are double-encoded as strings in the DB — parse them
    const content = typeof raw === 'string' ? safeParse(raw) : { ...raw };
    // Fix options that got stored as stringified JSON
    if (typeof content.options === 'string') {
      content.options = safeParse(content.options) || [];
    }
    return { ...r, content };
  });
}

function safeParse(val: string): any {
  try { return JSON.parse(val); } catch { return val; }
}

export const gameService = {
  // --- Game Discovery ---

  async getAvailableGames(filters: GameFilters): Promise<{ games: Game[]; dailyChallenge: DailyChallenge | null }> {
    const response = await api.get<ApiResponse<any>>('/games/available', { params: filters });
    const raw = response.data.data;

    // API returns template-centric array; flatten into Game[] with nested template
    const templates = Array.isArray(raw) ? raw : (raw?.games ?? []);
    const games: Game[] = [];
    for (const t of templates) {
      const template: Game['template'] = {
        type: t.type,
        category: t.category,
        name: t.name,
        description: t.description,
        iconUrl: t.iconUrl,
      };
      if (t.games && t.games.length > 0) {
        for (const g of t.games) {
          games.push({
            id: g.id,
            template,
            difficulty: g.difficulty ?? 'MEDIUM',
            courseId: g.courseId,
            courseName: g.course?.title || g.courseName || t.courseName || '',
            unitId: g.unitId,
            contentCount: t.contentCount ?? 0,
            suggestedDifficulty: g.suggestedDifficulty ?? g.difficulty ?? 'MEDIUM',
            lastPlayed: t.lastPlayed,
            bestScore: t.bestScore?.totalScore,
          });
        }
      } else if (t.available !== false) {
        // Standalone template with no game instances — create a virtual entry
        games.push({
          id: t.templateId ?? t.type,
          template,
          difficulty: 'MEDIUM',
          courseId: t.courseId,
          courseName: t.courseName || t.course?.title || '',
          contentCount: t.contentCount ?? 0,
          suggestedDifficulty: 'MEDIUM',
          lastPlayed: t.lastPlayed,
          bestScore: t.bestScore?.totalScore,
        });
      }
    }
    return { games, dailyChallenge: raw?.dailyChallenge ?? null };
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

  /**
   * Fetch courses eligible for a given game slug (one of the 9 new mechanics).
   * Tries the dedicated endpoint first; falls back to filtering availableGames
   * client-side if the endpoint isn't deployed yet.
   */
  async getEligibleCourses(
    gameSlug: string,
    memberId: string
  ): Promise<Array<{ gameId: string; courseId?: string; courseName: string; contentCount: number; suggestedDifficulty: GameDifficulty }>> {
    try {
      const response = await api.get<ApiResponse<any>>(`/games/${gameSlug}/eligible-courses`, {
        params: { memberId },
      });
      const raw = response.data.data;
      const list = Array.isArray(raw) ? raw : raw?.eligibleCourses ?? raw?.courses ?? [];
      return list.map((c: any) => ({
        gameId: c.gameId ?? c.id,
        courseId: c.courseId,
        courseName: c.courseName ?? c.courseTitle ?? c.course?.title ?? 'Untitled',
        contentCount: c.contentCount ?? 0,
        suggestedDifficulty: c.suggestedDifficulty ?? 'MEDIUM',
      }));
    } catch {
      // Fallback: derive from /games/available by matching template type
      const { SLUG_TO_TYPE, mapToActiveType } = await import('@/utils/gameHelpers');
      const target = SLUG_TO_TYPE[gameSlug];
      if (!target) return [];
      const { games } = await gameService.getAvailableGames({ memberId });
      const matched = games.filter((g) => mapToActiveType(g.template.type) === target);
      // Deduplicate by gameId
      const seen = new Set<string>();
      return matched
        .filter((g) => {
          if (seen.has(g.id)) return false;
          seen.add(g.id);
          return true;
        })
        .map((g) => ({
          gameId: g.id,
          courseId: g.courseId,
          courseName: g.courseName || 'General',
          contentCount: g.contentCount,
          suggestedDifficulty: g.suggestedDifficulty,
        }));
    }
  },

  // --- Session Lifecycle ---

  async startGame(params: {
    gameId?: string;
    gameType?: string;
    memberId: string;
    courseId?: string;
    difficulty: GameDifficulty;
  }): Promise<{ session: GameSession }> {
    const response = await api.post<ApiResponse<any>>('/games/start', {
      ...(params.gameId ? { gameId: params.gameId } : {}),
      ...(params.gameType ? { gameType: params.gameType } : {}),
      ...(params.courseId ? { courseId: params.courseId } : {}),
      memberId: params.memberId,
      difficulty: params.difficulty,
    });
    const data = response.data.data;
    const session: any = data.session ?? {};
    if (session.rounds) {
      session.rounds = transformRounds(session.rounds);
    }
    // Backend persists `roundsTotal` but frontend reads `totalRounds`.
    // Backend also returns timer config under `data.config.timer`, not on session.
    session.totalRounds = session.totalRounds ?? session.roundsTotal ?? data.config?.totalRounds ?? session.rounds?.length ?? 0;
    session.timerConfig = session.timerConfig ?? data.config?.timer ?? { type: 'NONE', durationMs: 0 };
    session.livesConfig = session.livesConfig ?? { enabled: false, initial: 0 };
    return { session };
  },

  async submitRound(sessionId: string, roundIndex: number, answer: unknown, timeSpentMs: number): Promise<RoundResult> {
    const roundId = `round-${roundIndex}`;
    const response = await api.post<ApiResponse<any>>(`/games/sessions/${sessionId}/rounds/${roundId}/submit`, {
      answer,
      timeSpentMs,
    });
    const raw = response.data.data;
    // Backend returns { round, isCorrect, pointsEarned, currentStreak, runningScore, roundsRemaining }.
    // Frontend expects RoundResult with a `sessionState` block.
    if (raw && raw.sessionState) {
      return raw as RoundResult;
    }
    const roundsRemaining = typeof raw?.roundsRemaining === 'number' ? raw.roundsRemaining : 0;
    const roundsCompleted = roundIndex + 1;
    const roundsTotal = roundsCompleted + roundsRemaining;
    return {
      isCorrect: Boolean(raw?.isCorrect),
      pointsEarned: raw?.pointsEarned ?? 0,
      srsRating: raw?.round?.srsRating ?? 0,
      explanation: raw?.round?.explanation,
      sessionState: {
        score: raw?.runningScore ?? 0,
        streak: raw?.currentStreak ?? 0,
        livesRemaining: raw?.livesRemaining ?? null,
        roundsCompleted,
        roundsTotal,
      },
    };
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
    const response = await api.get<ApiResponse<any>>(`/games/sessions/${sessionId}`);
    const session: any = response.data.data;
    if (session?.rounds) {
      session.rounds = transformRounds(session.rounds);
    }
    if (session) {
      session.totalRounds = session.totalRounds ?? session.roundsTotal ?? session.rounds?.length ?? 0;
      session.timerConfig = session.timerConfig ?? { type: 'NONE', durationMs: 0 };
      session.livesConfig = session.livesConfig ?? { enabled: false, initial: 0 };
    }
    return session as GameSession;
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
    const response = await api.get<ApiResponse<{ scores: GameScore[]; pagination: { page: number; limit: number; total: number } }>>('/games/scores', {
      params,
    });
    return response.data.data;
  },

  async getLeaderboard(params: LeaderboardParams): Promise<{ leaderboard: Leaderboard; myRank: number }> {
    const gameType = params.gameType || 'TERM_MATCH';
    const response = await api.get<ApiResponse<any>>(`/games/leaderboard/${gameType}`, {
      params,
    });
    const raw = response.data.data;
    // Backend returns { leaderboard: Entry[], period, gameType }
    // Frontend expects { leaderboard: { entries: Entry[] }, myRank }
    const entries: LeaderboardEntry[] = Array.isArray(raw?.leaderboard)
      ? raw.leaderboard.map((e: any) => ({
          rank: e.rank,
          member: { id: e.memberId, name: e.name, avatarUrl: e.avatarUrl },
          score: e.totalScore ?? 0,
          gamesPlayed: e.gamesPlayed ?? 0,
          accuracy: e.averageAccuracy ?? 0,
        }))
      : (raw?.leaderboard?.entries ?? []);
    return {
      leaderboard: {
        id: gameType,
        scope: params.scope,
        period: params.period,
        entries,
      },
      myRank: raw?.myRank ?? 0,
    };
  },

  // --- Achievements & Badges ---

  async getAchievements(memberId: string): Promise<{ achievements: UserAchievement[]; totalXpFromAchievements: number }> {
    const response = await api.get<ApiResponse<any>>('/games/achievements', {
      params: { memberId },
    });
    const raw = response.data.data;
    // Backend returns an array of achievement objects directly
    const achievements: UserAchievement[] = Array.isArray(raw)
      ? raw
      : (raw?.achievements ?? []);
    const totalXp = Array.isArray(raw)
      ? achievements.reduce((sum: number, a: any) => sum + (a.xpReward ?? 0), 0)
      : (raw?.totalXpFromAchievements ?? 0);
    return { achievements, totalXpFromAchievements: totalXp };
  },

  async getBadges(memberId: string): Promise<{ earned: UserBadge[]; available: BadgeProgress[] }> {
    try {
      const response = await api.get<ApiResponse<{ earned: UserBadge[]; available: BadgeProgress[] }>>('/games/badges', {
        params: { memberId },
      });
      return response.data.data;
    } catch {
      return { earned: [], available: [] };
    }
  },

  // --- Streaks ---

  async getStreak(memberId: string): Promise<StreakInfo> {
    const defaultStreak: StreakInfo = {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: '',
      gracePeriodUsed: false,
      freezesRemaining: 0,
      milestones: [],
      nextMilestone: 7,
      daysToNextMilestone: 7,
      streakAchievements: [],
    };
    try {
      const data = await gameService.getDailyChallenge(memberId);
      return {
        ...defaultStreak,
        currentStreak: data.streak?.currentStreak ?? 0,
        longestStreak: data.streak?.longestStreak ?? 0,
      };
    } catch {
      return defaultStreak;
    }
  },

  // --- Parental Controls ---

  async getParentalSettings(memberId: string): Promise<GameParentalSettings> {
    const response = await api.get<ApiResponse<GameParentalSettings>>(`/games/settings/${memberId}`);
    return response.data.data;
  },

  async updateParentalSettings(memberId: string, settings: Partial<GameParentalSettings>): Promise<GameParentalSettings> {
    const response = await api.put<ApiResponse<GameParentalSettings>>(`/games/settings/${memberId}`, settings);
    return response.data.data;
  },

  async getGameTime(memberId: string): Promise<GameTimeStatus> {
    const response = await api.get<ApiResponse<GameTimeStatus>>(`/games/time/${memberId}`);
    return response.data.data;
  },
};
