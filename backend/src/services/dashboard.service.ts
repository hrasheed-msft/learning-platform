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
        id: member.id,
        name: member.name,
        age: member.age,
        ageCategory: member.ageCategory,
        avatarUrl: member.avatarUrl,
        currentStreak: member.currentStreak,
        longestStreak: member.longestStreak,
        totalPoints: member.totalPoints,
        lastActiveAt: member.lastActiveAt,
        loginEnabled: member.loginEnabled,
        stats: {
          avgQuizScore,
          totalQuizzes: member._count.quizResults,
          totalFlashcardsReviewed: member._count.flashCardProgress,
          totalActivities: member._count.activityEvents,
          coursesEnrolled: member.enrollments.length,
          coursesCompleted: member.enrollments.filter(
            (e) => e.status === 'COMPLETED'
          ).length,
        },
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

    return {
      member: {
        id: member.id,
        name: member.name,
        age: member.age,
        ageCategory: member.ageCategory,
        currentStreak: member.currentStreak,
        longestStreak: member.longestStreak,
        totalPoints: member.totalPoints,
        lastActiveAt: member.lastActiveAt,
      },
      quizStats: {
        avgScore: avgQuizScore,
        totalQuizzes: quizResults.length,
        recentResults: quizResults.slice(0, 10).map((qr) => ({
          score: qr.score,
          passed: qr.passed,
          unitTitle: qr.unit.title,
          courseTitle: qr.unit.course.title,
          completedAt: qr.createdAt,
        })),
      },
      courseProgress: enrollments.map((e) => ({
        courseId: e.course.id,
        courseTitle: e.course.title,
        category: e.course.category,
        status: e.status,
        progress: e.progress,
        startedAt: e.startedAt,
        completedAt: e.completedAt,
        unitsCompleted: e.unitProgress.filter((up) => up.completedAt).length,
        totalUnits: e.unitProgress.length,
      })),
      flashcardStats: flashcardStats.reduce(
        (acc, fs) => ({ ...acc, [fs.status]: fs._count.id }),
        {} as Record<string, number>
      ),
      recentActivity,
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
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
    const totalQuizzes = members.reduce(
      (sum, m) => sum + m._count.quizResults,
      0
    );
    const totalActivities = members.reduce(
      (sum, m) => sum + m._count.activityEvents,
      0
    );
    const bestStreak = Math.max(...members.map((m) => m.currentStreak), 0);

    // Recent family activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentActivityCount = await prisma.activityEvent.count({
      where: {
        familyId,
        createdAt: { gte: weekAgo },
      },
    });

    return {
      family: { id: family.id, name: family.name },
      totalMembers: members.length,
      totalPoints,
      totalQuizzes,
      totalActivities,
      bestCurrentStreak: bestStreak,
      recentActivityCount,
      memberSummaries: members.map((m) => ({
        id: m.id,
        name: m.name,
        currentStreak: m.currentStreak,
        totalPoints: m.totalPoints,
        quizCount: m._count.quizResults,
        courseCount: m._count.enrollments,
      })),
    };
  }
}
