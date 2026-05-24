import prisma from '../config/database';
import { NotFoundError } from '../middleware/error.middleware';

export class DashboardService {
  static async getChildrenWithStats(familyId: string) {
    const members = await prisma.familyMember.findMany({
      where: { familyId },
      orderBy: { createdAt: 'asc' },
      include: {
        enrollments: {
          include: { course: { select: { id: true, title: true } } },
        },
        quizResults: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            quizResults: true,
            flashCardProgress: true,
            activityEvents: true,
          },
        },
      },
    });

    return members.map((member) => {
      const avgQuizScore =
        member.quizResults.length > 0
          ? Math.round(
              member.quizResults.reduce((sum, qr) => sum + qr.score, 0) /
                member.quizResults.length
            )
          : 0;

      return {
        memberId: member.id,
        name: member.name,
        age: member.age,
        ageCategory: member.ageCategory,
        avatarUrl: member.avatarUrl,
        coursesEnrolled: member.enrollments.length,
        avgQuizScore,
        currentStreak: member.currentStreak,
        lastActiveAt: member.lastActiveAt,
      };
    });
  }

  static async getChildDetailedStats(familyId: string, memberId: string) {
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new NotFoundError('Family member not found');
    }

    // Get quiz results with unit/course info
    const quizResults = await prisma.quizResult.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        unit: {
          select: { title: true, course: { select: { title: true } } },
        },
      },
    });

    // Get course progress
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { memberId },
      include: {
        course: { select: { id: true, title: true, category: true } },
        unitProgress: true,
      },
    });

    // Get flashcard stats
    const flashcardStats = await prisma.flashCardProgress.groupBy({
      by: ['status'],
      where: { memberId },
      _count: { id: true },
    });

    // Get recent activity
    const recentActivity = await prisma.activityEvent.findMany({
      where: { familyMemberId: memberId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const avgQuizScore =
      quizResults.length > 0
        ? Math.round(
            quizResults.reduce((sum, qr) => sum + qr.score, 0) /
              quizResults.length
          )
        : 0;

    // Flatten flashcard stats
    const flashcardStatsMap = flashcardStats.reduce(
      (acc, fs) => ({ ...acc, [fs.status]: fs._count.id }),
      {} as Record<string, number>
    );
    const flashcardsReviewed = Object.values(flashcardStatsMap).reduce((a, b) => a + b, 0);
    const flashcardsMastered = flashcardStatsMap['MASTERED'] || 0;

    // Build quiz score trend from recent results
    const quizScoreTrend = quizResults.slice(0, 10).map((qr) => ({
      date: qr.createdAt.toISOString(),
      score: qr.score,
      quizTitle: `${qr.unit.course.title} — ${qr.unit.title}`,
    }));

    // Estimate study time from activity events (count × 5 min average)
    const totalStudyTimeMinutes = recentActivity.length * 5;

    return {
      memberId: member.id,
      name: member.name,
      ageCategory: member.ageCategory,
      coursesEnrolled: enrollments.length,
      coursesCompleted: enrollments.filter((e) => e.status === 'COMPLETED').length,
      avgQuizScore,
      currentStreak: member.currentStreak,
      longestStreak: member.longestStreak,
      totalStudyTimeMinutes,
      flashcardsReviewed,
      flashcardsMastered,
      courseProgress: enrollments.map((e) => ({
        courseId: e.course.id,
        courseTitle: e.course.title,
        progress: e.progress,
        status: e.status,
      })),
      quizScoreTrend,
    };
  }

  static async getChildActivity(
    familyId: string,
    memberId: string,
    page = 1,
    limit = 20
  ) {
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new NotFoundError('Family member not found');
    }

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.activityEvent.findMany({
        where: { familyMemberId: memberId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activityEvent.count({
        where: { familyMemberId: memberId },
      }),
    ]);

    return {
      activities: activities.map((a) => ({
        id: a.id,
        type: a.eventType.toLowerCase().replace(/_/g, '_'),
        title: formatEventTitle(a.eventType),
        description: a.metadata ? summarizeMetadata(a.metadata) : '',
        timestamp: a.createdAt.toISOString(),
        metadata: a.metadata as Record<string, unknown> | undefined,
      })),
      total,
      page,
      pageSize: limit,
    };
  }

  static async getFamilySummary(familyId: string) {
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      select: { id: true, name: true },
    });

    if (!family) {
      throw new NotFoundError('Family not found');
    }

    const members = await prisma.familyMember.findMany({
      where: { familyId },
      select: {
        id: true,
        name: true,
        currentStreak: true,
        totalPoints: true,
        _count: {
          select: {
            quizResults: true,
            enrollments: true,
            activityEvents: true,
          },
        },
      },
    });

    const totalPoints = members.reduce((sum, m) => sum + m.totalPoints, 0);
    const bestStreak = Math.max(...members.map((m) => m.currentStreak), 0);
    const averageStreak = members.length > 0
      ? Math.round(members.reduce((sum, m) => sum + m.currentStreak, 0) / members.length)
      : 0;

    // Count active enrollments across all members
    const activeCoursesCount = members.reduce(
      (sum, m) => sum + m._count.enrollments,
      0
    );

    // Recent family activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentActivityCount = await prisma.activityEvent.count({
      where: {
        familyId,
        createdAt: { gte: weekAgo },
      },
    });

    // Estimate weekly study time from recent activity (count × 5 min average)
    const totalStudyTimeMinutesThisWeek = recentActivityCount * 5;

    return {
      totalStudyTimeMinutesThisWeek,
      activeCoursesCount,
      totalChildren: members.length,
      averageFamilyStreak: averageStreak,
    };
  }
}

function formatEventTitle(eventType: string): string {
  const titles: Record<string, string> = {
    QUIZ_COMPLETED: 'Completed a quiz',
    COURSE_STARTED: 'Started a course',
    COURSE_COMPLETED: 'Completed a course',
    FLASHCARD_REVIEWED: 'Reviewed flashcards',
    GAME_PLAYED: 'Played a game',
    BADGE_EARNED: 'Earned a badge',
    STREAK_REACHED: 'Reached a streak milestone',
  };
  return titles[eventType] || eventType.replace(/_/g, ' ').toLowerCase();
}

function summarizeMetadata(metadata: unknown): string {
  if (!metadata || typeof metadata !== 'object') return '';
  const m = metadata as Record<string, unknown>;
  const parts: string[] = [];
  if (m.courseTitle) parts.push(String(m.courseTitle));
  if (m.unitTitle) parts.push(String(m.unitTitle));
  if (m.score !== undefined) parts.push(`Score: ${m.score}%`);
  return parts.join(' — ') || '';
}
