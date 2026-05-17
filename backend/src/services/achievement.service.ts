import prisma from '../config/database';
import { GameType, ActivityEventType } from '@prisma/client';
import { recordActivity } from './activity.service';

// ---------------------------------------------------------------------------
// Achievement Definitions (Phase 1: first 10 + #14)
// ---------------------------------------------------------------------------

interface AchievementDef {
  key: string;
  name: string;
  description: string;
  xpReward: number;
  check: (memberId: string) => Promise<boolean>;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    key: 'first_game',
    name: 'First Steps',
    description: 'Complete your first game',
    xpReward: 50,
    check: async (memberId) => {
      const count = await prisma.gameScore.count({ where: { memberId } });
      return count >= 1;
    },
  },
  {
    key: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score 100% accuracy in any game',
    xpReward: 100,
    check: async (memberId) => {
      const perfect = await prisma.gameSession.findFirst({
        where: { memberId, status: 'COMPLETED', accuracy: { gte: 100 } },
      });
      return !!perfect;
    },
  },
  {
    key: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a Speed Quiz with all answers under 3 seconds',
    xpReward: 150,
    check: async (memberId) => {
      const sessions = await prisma.gameSession.findMany({
        where: {
          memberId,
          status: 'COMPLETED',
          game: { template: { type: 'SPEED_QUIZ' as GameType } },
        },
        include: { rounds: true },
        take: 50,
        orderBy: { completedAt: 'desc' },
      });
      return sessions.some(
        (s) => s.rounds.length > 0 && s.rounds.every((r) => r.isCorrect && r.timeSpentMs < 3000),
      );
    },
  },
  {
    key: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day activity streak',
    xpReward: 75,
    check: async (memberId) => {
      const streak = await prisma.userStreakRecord.findUnique({ where: { memberId } });
      return (streak?.longestStreak ?? 0) >= 3;
    },
  },
  {
    key: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    xpReward: 150,
    check: async (memberId) => {
      const streak = await prisma.userStreakRecord.findUnique({ where: { memberId } });
      return (streak?.longestStreak ?? 0) >= 7;
    },
  },
  {
    key: 'streak_14',
    name: 'Fortnight Focus',
    description: 'Maintain a 14-day activity streak',
    xpReward: 250,
    check: async (memberId) => {
      const streak = await prisma.userStreakRecord.findUnique({ where: { memberId } });
      return (streak?.longestStreak ?? 0) >= 14;
    },
  },
  {
    key: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day activity streak',
    xpReward: 500,
    check: async (memberId) => {
      const streak = await prisma.userStreakRecord.findUnique({ where: { memberId } });
      return (streak?.longestStreak ?? 0) >= 30;
    },
  },
  {
    key: 'streak_100',
    name: 'Century of Learning',
    description: 'Maintain a 100-day activity streak',
    xpReward: 2000,
    check: async (memberId) => {
      const streak = await prisma.userStreakRecord.findUnique({ where: { memberId } });
      return (streak?.longestStreak ?? 0) >= 100;
    },
  },
  {
    key: 'vocab_50',
    name: 'Word Collector',
    description: 'Match 50 Arabic terms correctly in Term Match games',
    xpReward: 200,
    check: async (memberId) => {
      const count = await prisma.gameRound.count({
        where: {
          session: {
            memberId,
            game: { template: { type: 'TERM_MATCH' as GameType } },
          },
          contentType: 'ARABIC_TERM',
          isCorrect: true,
        },
      });
      return count >= 50;
    },
  },
  {
    key: 'daily_7',
    name: 'Daily Devotion',
    description: 'Complete 7 daily challenges',
    xpReward: 200,
    check: async (memberId) => {
      const count = await prisma.dailyChallengeAttempt.count({ where: { memberId } });
      return count >= 7;
    },
  },
  {
    key: 'all_game_types',
    name: 'Renaissance Learner',
    description: 'Play every game type at least once',
    xpReward: 300,
    check: async (memberId) => {
      const sessions = await prisma.gameSession.findMany({
        where: { memberId, status: 'COMPLETED' },
        include: { game: { include: { template: { select: { type: true } } } } },
      });
      const played = new Set(sessions.map((s) => s.game.template.type));
      // Phase 1 game types
      const phase1Types: GameType[] = ['TERM_MATCH', 'SPEED_QUIZ', 'FLASHCARD_FLIP', 'DAILY_CHALLENGE', 'WORD_SEARCH'];
      return phase1Types.every((t) => played.has(t));
    },
  },
];

// ---------------------------------------------------------------------------
// AchievementService
// ---------------------------------------------------------------------------

export class AchievementService {
  /**
   * Check and award any new achievements for a member.
   * Called after game completion.
   */
  static async checkAndAward(memberId: string): Promise<Array<{ type: string; name: string; xpReward: number }>> {
    const existing = await prisma.userAchievement.findMany({
      where: { memberId },
      select: { type: true },
    });
    const earnedTypes = new Set(existing.map((a) => a.type));
    const newlyEarned: Array<{ type: string; name: string; xpReward: number }> = [];

    for (const def of ACHIEVEMENT_DEFS) {
      if (earnedTypes.has(def.key)) continue;

      try {
        const qualified = await def.check(memberId);
        if (!qualified) continue;

        await prisma.userAchievement.create({
          data: {
            memberId,
            type: def.key,
            name: def.name,
            description: def.description,
            xpReward: def.xpReward,
          },
        });

        // Award XP
        await prisma.familyMember.update({
          where: { id: memberId },
          data: { totalPoints: { increment: def.xpReward } },
        });

        newlyEarned.push({ type: def.key, name: def.name, xpReward: def.xpReward });

        // Record activity for parent dashboard
        const member = await prisma.familyMember.findUnique({
          where: { id: memberId },
          select: { familyId: true },
        });
        if (member) {
          await recordActivity(memberId, member.familyId, ActivityEventType.BADGE_EARNED, {
            achievement: def.key,
            name: def.name,
            xpReward: def.xpReward,
          });
        }
      } catch (err) {
        console.error(`Achievement check failed for ${def.key}:`, err);
      }
    }

    return newlyEarned;
  }

  /** Get all achievements with earned status for a member. */
  static async getAll(memberId: string) {
    const earned = await prisma.userAchievement.findMany({
      where: { memberId },
      orderBy: { earnedAt: 'desc' },
    });

    const earnedMap = new Map(earned.map((a) => [a.type, a]));

    return ACHIEVEMENT_DEFS.map((def) => {
      const achievement = earnedMap.get(def.key);
      return {
        key: def.key,
        name: def.name,
        description: def.description,
        xpReward: def.xpReward,
        earned: !!achievement,
        earnedAt: achievement?.earnedAt ?? null,
      };
    });
  }

  /** Get recently earned achievements. */
  static async getRecent(memberId: string, limit: number = 5) {
    return prisma.userAchievement.findMany({
      where: { memberId },
      orderBy: { earnedAt: 'desc' },
      take: limit,
    });
  }
}
