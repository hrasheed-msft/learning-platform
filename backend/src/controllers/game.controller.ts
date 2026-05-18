import { Response, NextFunction } from 'express';
import { ActiveMemberRequest } from '../middleware/requireActiveMember.middleware';
import { GameService } from '../services/game.service';
import { AchievementService } from '../services/achievement.service';
import { BadRequestError } from '../middleware/error.middleware';
import { GameType, GameDifficulty } from '@prisma/client';

/**
 * Resolve the acting memberId from either the requireActiveMember middleware
 * or, as a fallback for child JWTs, from the request directly.
 * Returns a guaranteed non-undefined memberId or throws.
 */
function resolveMemberId(req: ActiveMemberRequest, _fromBody = false): string {
  // The requireActiveMember middleware sets this for all requests
  if (req.activeMemberId) return req.activeMemberId;
  // Child tokens also get it via the middleware, but double-check
  if (req.child) return req.child.memberId;
  throw new BadRequestError('No active learner profile selected. Please choose a learner profile before playing.');
}

function resolveFamilyId(req: ActiveMemberRequest): string {
  if (req.child) return req.child.familyId;
  if (req.user) return req.user.familyId;
  throw new BadRequestError('Cannot determine familyId');
}

export class GameController {
  // -----------------------------------------------------------------------
  // Game Discovery
  // -----------------------------------------------------------------------

  static async getAvailableGames(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const { courseId, unitId, category } = req.query as Record<string, string>;
      const games = await GameService.getAvailableGames(memberId, { courseId, unitId, category });
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  static async getGamesForUnit(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const games = await GameService.getGamesForUnit(req.params.unitId, memberId);
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  static async getGamesForCourse(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const games = await GameService.getGamesForCourse(req.params.courseId, memberId);
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  static async getStandaloneGames(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const games = await GameService.getStandaloneGames(memberId);
      res.json({ success: true, data: games });
    } catch (error) { next(error); }
  }

  static async getEligibleCourses(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const slug = req.params.slug;
      const courses = await GameService.getEligibleCourses(slug, memberId);
      res.json({ success: true, data: courses });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Session Lifecycle
  // -----------------------------------------------------------------------

  static async startGame(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req, true);
      const { gameType, gameId, unitId, courseId, difficulty } = req.body;

      const result = await GameService.startGame({
        memberId,
        gameType: gameType as GameType | undefined,
        gameId,
        unitId,
        courseId,
        difficulty: (difficulty as GameDifficulty) ?? 'MEDIUM',
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async submitRound(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sessionId, roundId } = req.params;
      const { answer, timeSpentMs } = req.body;

      const result = await GameService.submitRound(sessionId, roundId, answer, timeSpentMs ?? 0);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async completeGame(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
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

  static async getSession(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await GameService.getSession(req.params.sessionId);
      res.json({ success: true, data: session });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Scores & Leaderboard
  // -----------------------------------------------------------------------

  static async getScores(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
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

  static async getLeaderboard(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
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

  static async getAchievements(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const achievements = await AchievementService.getAll(memberId);
      res.json({ success: true, data: achievements });
    } catch (error) { next(error); }
  }

  static async getRecentAchievements(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const recent = await AchievementService.getRecent(memberId);
      res.json({ success: true, data: recent });
    } catch (error) { next(error); }
  }

  // -----------------------------------------------------------------------
  // Daily Challenge
  // -----------------------------------------------------------------------

  static async getDailyChallenge(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const memberId = resolveMemberId(req);
      const result = await GameService.getDailyChallenge(memberId);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  static async submitDailyChallengeAttempt(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
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

  static async getGameSettings(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.params;
      const settings = await import('../config/database').then((db) =>
        db.default.gameParentalSettings.findUnique({ where: { familyMemberId: memberId } }),
      );
      res.json({ success: true, data: settings });
    } catch (error) { next(error); }
  }

  static async updateGameSettings(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
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

  static async getGameTime(req: ActiveMemberRequest, res: Response, next: NextFunction): Promise<void> {
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
