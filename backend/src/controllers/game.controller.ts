import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { GameService } from '../services/game.service';
import { AchievementService } from '../services/achievement.service';
import { BadRequestError } from '../middleware/error.middleware';
import { GameType, GameDifficulty } from '@prisma/client';

/**
 * Resolve the acting memberId from either a child JWT or request body/query.
 * Child tokens carry memberId directly; parent tokens require it in the request.
 */
function resolveMemberId(req: AuthenticatedRequest, fromBody = false): string {
  if (req.child) return req.child.memberId;
  const memberId = fromBody ? req.body?.memberId : (req.query?.memberId as string);
  if (!memberId) throw new BadRequestError('memberId is required');
  return memberId;
}

function resolveFamilyId(req: AuthenticatedRequest): string {
  if (req.child) return req.child.familyId;
  if (req.user) return req.user.familyId;
  throw new BadRequestError('Cannot determine familyId');
}

export class GameController {
  // -----------------------------------------------------------------------
  // Game Discovery
  // -----------------------------------------------------------------------

  static async getAvailableGames(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const { courseId, unitId, category } = req.query as Record<string, string>;
      const games = await GameService.getAvailableGames(memberId, { courseId, unitId, category });
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  static async getGamesForUnit(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const games = await GameService.getGamesForUnit(req.params.unitId, memberId);
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  static async getGamesForCourse(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const games = await GameService.getGamesForCourse(req.params.courseId, memberId);
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  static async getStandaloneGames(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const games = await GameService.getStandaloneGames(memberId);
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Session Lifecycle
  // -----------------------------------------------------------------------

  static async startGame(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req, true);
      const { gameType, gameId, unitId, courseId, difficulty } = req.body;

      if (!gameType || !difficulty) {
        throw new BadRequestError('gameType and difficulty are required');
      }

      const result = await GameService.startGame({
        memberId,
        gameType: gameType as GameType,
        gameId,
        unitId,
        courseId,
        difficulty: difficulty as GameDifficulty,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async submitRound(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, roundId } = req.params;
      const { answer, timeSpentMs } = req.body;

      const result = await GameService.submitRound(sessionId, roundId, answer, timeSpentMs ?? 0);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async completeGame(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { reason } = req.body;

      const result = await GameService.completeGame(sessionId, reason);

      // Check achievements after completion
      const session = await GameService.getSession(sessionId);
      const newAchievements = await AchievementService.checkAndAward(session.memberId);

      res.json({
        success: true,
        data: {
          ...result,
          achievements: newAchievements,
        },
      });
    } catch (error) { next(error); }
  }

  static async getSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await GameService.getSession(req.params.sessionId);
      res.json({ success: true, data: session });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Scores & Leaderboard
  // -----------------------------------------------------------------------

  static async getScores(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const { gameType, page, limit } = req.query as Record<string, string>;
      const result = await GameService.getScores(memberId, {
        gameType,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async getLeaderboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const familyId = resolveFamilyId(req);
      const gameType = req.params.gameType === 'all' ? null : req.params.gameType;
      const { period } = req.query as Record<string, string>;
      const result = await GameService.getLeaderboard(gameType, familyId, period);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Achievements
  // -----------------------------------------------------------------------

  static async getAchievements(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const achievements = await AchievementService.getAll(memberId);
      res.json({ success: true, data: achievements });
    } catch (error) { next(error); }
  }

  static async getRecentAchievements(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const recent = await AchievementService.getRecent(memberId);
      res.json({ success: true, data: recent });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Daily Challenge
  // -----------------------------------------------------------------------

  static async getDailyChallenge(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const result = await GameService.getDailyChallenge(memberId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async submitDailyChallengeAttempt(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req, true);
      const { challengeId, answers } = req.body;

      if (!challengeId || !answers) {
        throw new BadRequestError('challengeId and answers are required');
      }

      const result = await GameService.submitDailyChallengeAttempt(challengeId, memberId, answers);

      // Check achievements
      const newAchievements = await AchievementService.checkAndAward(memberId);

      res.json({
        success: true,
        data: {
          ...result,
          achievements: newAchievements,
        },
      });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Parental Controls
  // -----------------------------------------------------------------------

  static async getGameSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const settings = await import('../config/database').then((db) =>
        db.default.gameParentalSettings.findUnique({ where: { familyMemberId: memberId } }),
      );
      res.json({ success: true, data: settings });
    } catch (error) { next(error); }
  }

  static async updateGameSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const userId = req.user?.id;
      if (!userId) throw new BadRequestError('Parent authentication required');

      const {
        dailyLimitMinutes,
        weekendLimitMinutes,
        allowedGameTypes,
        maxDifficulty,
        enforceAfterHour,
        isActive,
      } = req.body;

      const db = (await import('../config/database')).default;
      const settings = await db.gameParentalSettings.upsert({
        where: { familyMemberId: memberId },
        create: {
          familyMemberId: memberId,
          updatedBy: userId,
          dailyLimitMinutes: dailyLimitMinutes ?? 30,
          weekendLimitMinutes: weekendLimitMinutes ?? 60,
          allowedGameTypes: allowedGameTypes ?? [],
          maxDifficulty: maxDifficulty ?? 'EASY',
          enforceAfterHour: enforceAfterHour ?? null,
          isActive: isActive ?? true,
        },
        update: {
          updatedBy: userId,
          ...(dailyLimitMinutes !== undefined && { dailyLimitMinutes }),
          ...(weekendLimitMinutes !== undefined && { weekendLimitMinutes }),
          ...(allowedGameTypes !== undefined && { allowedGameTypes }),
          ...(maxDifficulty !== undefined && { maxDifficulty }),
          ...(enforceAfterHour !== undefined && { enforceAfterHour }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({ success: true, data: settings });
    } catch (error) { next(error); }
  }

  static async getGameTime(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const db = (await import('../config/database')).default;

      const today = new Date().toISOString().slice(0, 10);
      const dayOfWeek = new Date().getDay();
      const isWeekend = [0, 6].includes(dayOfWeek);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const [settings, log] = await Promise.all([
        db.gameParentalSettings.findUnique({ where: { familyMemberId: memberId } }),
        db.gameTimeLog.findUnique({ where: { familyMemberId_date: { familyMemberId: memberId, date: today } } }),
      ]);

      const minutesPlayed = log?.minutesPlayed ?? 0;
      const sessionsPlayed = log?.sessionsPlayed ?? 0;
      const dailyLimit = settings
        ? (isWeekend ? settings.weekendLimitMinutes : settings.dailyLimitMinutes)
        : null;
      const minutesRemaining = dailyLimit !== null ? Math.max(0, dailyLimit - minutesPlayed) : null;

      res.json({
        success: true,
        data: {
          date: today,
          dayOfWeek: dayNames[dayOfWeek],
          minutesPlayedToday: minutesPlayed,
          sessionsPlayedToday: sessionsPlayed,
          dailyLimitMinutes: dailyLimit,
          minutesRemainingToday: minutesRemaining,
          percentageUsed: dailyLimit ? Math.round((minutesPlayed / dailyLimit) * 100) : null,
          lastSessionEndedAt: log?.lastSessionEndedAt ?? null,
          parentalSettingsActive: !!(settings?.isActive),
          enforceAfterHour: settings?.enforceAfterHour ?? null,
        },
      });
    } catch (error) { next(error); }
  }
}
