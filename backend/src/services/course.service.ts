import prisma from '../config/database';
import { NotFoundError, BadRequestError, ConflictError, ForbiddenError } from '../middleware/error.middleware';
import { recordActivity } from './activity.service';

interface GetCoursesInput {
  category?: string;
  ageLevel?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface ProgressUpdateInput {
  videoCompleted?: boolean;
  readingCompleted?: boolean;
  quizCompleted?: boolean;
  quizScore?: number;
}

export class CourseService {
  static async getCourses(input: GetCoursesInput) {
    const { category, ageLevel, search, page = 1, limit = 20 } = input;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (ageLevel) {
      where.ageLevels = { has: ageLevel };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { units: true, enrollments: true } },
        },
      }),
      prisma.course.count({ where }),
    ]);

    return {
      courses: courses.map(c => ({
        ...c,
        unitCount: c._count.units,
        enrolledCount: c._count.enrollments,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCourse(courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        _count: { select: { units: true, enrollments: true } },
      },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    return {
      ...course,
      unitCount: course._count.units,
      enrolledCount: course._count.enrollments,
    };
  }

  static async getUnits(courseId: string) {
    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    const units = await prisma.unit.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        orderIndex: true,
        // Exclude full content for list view
      },
    });

    return units;
  }

  static async getUnit(courseId: string, unitId: string) {
    const unit = await prisma.unit.findFirst({
      where: { id: unitId, courseId },
      include: {
        videoResources: true,
        audioResources: true,
        arabicTerms: true,
        questions: true,
      },
    });

    if (!unit) {
      throw new NotFoundError('Unit not found');
    }

    // Transform unit data to match frontend expectations
    return {
      ...unit,
      content: {
        text: unit.content,
        videos: unit.videoResources.map((v) => ({
          ...v,
          type: v.url.includes('youtube.com') || v.url.includes('youtu.be') ? 'youtube' as const : 'server' as const,
        })),
        audio: unit.audioResources,
        arabicTerms: unit.arabicTerms,
      },
    };
  }

  static async enrollMember(familyId: string, memberId: string, courseId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        memberId_courseId: { memberId, courseId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictError('Already enrolled in this course');
    }

    // Create enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        memberId,
        courseId,
        status: 'ACTIVE',
        progress: 0,
      },
      include: { course: true },
    });

    return enrollment;
  }

  /**
   * Idempotent enrollment: if already enrolled, returns existing enrollment.
   * Used by the simplified POST /courses/:courseId/enroll endpoint.
   */
  static async enrollMemberIdempotent(familyId: string, memberId: string, courseId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    // Verify course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Return existing enrollment if present (idempotent)
    const existing = await prisma.courseEnrollment.findUnique({
      where: { memberId_courseId: { memberId, courseId } },
      include: { course: true },
    });

    if (existing) {
      return existing;
    }

    // Create enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        memberId,
        courseId,
        status: 'ACTIVE',
        progress: 0,
      },
      include: { course: true },
    });

    return enrollment;
  }

  static async getMemberEnrollments(familyId: string, memberId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { memberId },
      include: {
        course: true,
        unitProgress: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return enrollments;
  }

  static async unenrollMember(familyId: string, enrollmentId: string): Promise<void> {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { member: true },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    if (enrollment.member.familyId !== familyId) {
      throw new ForbiddenError('Cannot unenroll member from another family');
    }

    await prisma.courseEnrollment.delete({
      where: { id: enrollmentId },
    });
  }

  static async updateProgress(familyId: string, memberId: string, unitId: string, data: ProgressUpdateInput) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    // Get unit and verify enrollment
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      select: {
        id: true,
        title: true,
        courseId: true,
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!unit) {
      throw new NotFoundError('Unit not found');
    }

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        memberId_courseId: { memberId, courseId: unit.courseId },
      },
    });

    if (!enrollment) {
      throw new BadRequestError('Not enrolled in this course');
    }

    const existingProgress = await prisma.unitProgress.findUnique({
      where: {
        enrollmentId_unitId: { enrollmentId: enrollment.id, unitId },
      },
    });

    const nextProgressState = {
      videoCompleted: data.videoCompleted ?? existingProgress?.videoCompleted ?? false,
      readingCompleted: data.readingCompleted ?? existingProgress?.readingCompleted ?? false,
      quizCompleted: data.quizCompleted ?? existingProgress?.quizCompleted ?? false,
    };
    const nowCompleted = isUnitComplete(nextProgressState);

    const progress = await prisma.unitProgress.upsert({
      where: {
        enrollmentId_unitId: { enrollmentId: enrollment.id, unitId },
      },
      create: {
        enrollmentId: enrollment.id,
        unitId,
        videoCompleted: nextProgressState.videoCompleted,
        readingCompleted: nextProgressState.readingCompleted,
        quizCompleted: nextProgressState.quizCompleted,
        quizScore: data.quizScore,
        completedAt: nowCompleted ? new Date() : null,
      },
      update: {
        ...(data.videoCompleted !== undefined && { videoCompleted: data.videoCompleted }),
        ...(data.readingCompleted !== undefined && { readingCompleted: data.readingCompleted }),
        ...(data.quizCompleted !== undefined && { quizCompleted: data.quizCompleted }),
        ...(data.quizScore !== undefined && { quizScore: data.quizScore }),
        completedAt: nowCompleted ? existingProgress?.completedAt ?? new Date() : null,
      },
    });

    const enrollmentProgress = await this.updateCourseProgress(enrollment.id);

    await prisma.familyMember.update({
      where: { id: memberId },
      data: { lastActiveAt: new Date() },
    });

    if (enrollmentProgress?.previousStatus !== 'COMPLETED' && enrollmentProgress?.status === 'COMPLETED') {
      try {
        await recordActivity(memberId, familyId, 'COURSE_COMPLETED', {
          courseId: unit.courseId,
          courseTitle: unit.course.title,
          unitId: unit.id,
          unitTitle: unit.title,
        });
      } catch (err) {
        console.error('Failed to record course completion activity:', err);
      }
    }

    return progress;
  }

  static async getMemberProgress(familyId: string, memberId: string) {
    // Verify member belongs to family
    const member = await prisma.familyMember.findFirst({
      where: { id: memberId, familyId },
    });

    if (!member) {
      throw new ForbiddenError('Member not found or does not belong to your family');
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { memberId },
      include: {
        course: { include: { _count: { select: { units: true } } } },
        unitProgress: { include: { unit: true } },
      },
    });

    return enrollments.map(e => ({
      courseId: e.courseId,
      courseTitle: e.course.title,
      status: e.status,
      progress: e.progress,
      totalUnits: e.course._count.units,
      completedUnits: e.unitProgress.filter(
        up => up.videoCompleted && up.readingCompleted && up.quizCompleted
      ).length,
      unitProgress: e.unitProgress,
    }));
  }

  static async updateCourseProgress(enrollmentId: string) {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            units: {
              select: {
                id: true,
              },
            },
          },
        },
        unitProgress: true,
      },
    });

    if (!enrollment) {
      return null;
    }

    const totalUnits = enrollment.course.units.length;
    if (totalUnits === 0) {
      return {
        previousStatus: enrollment.status,
        status: enrollment.status,
        progress: enrollment.progress,
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
      };
    }

    const completedUnits = enrollment.unitProgress.filter(isUnitComplete).length;
    const progress = Math.round((completedUnits / totalUnits) * 100);
    const status = progress === 100 ? 'COMPLETED' : 'ACTIVE';

    await prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        status,
        completedAt: status === 'COMPLETED' ? enrollment.completedAt ?? new Date() : null,
      },
    });

    return {
      previousStatus: enrollment.status,
      status,
      progress,
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
    };
  }
}

function isUnitComplete(progress?: {
  videoCompleted?: boolean;
  readingCompleted?: boolean;
  quizCompleted?: boolean;
} | null): boolean {
  return Boolean(progress?.videoCompleted && progress?.readingCompleted && progress?.quizCompleted);
}
