import prisma from '../config/database';
import { LearningPath } from '@prisma/client';
import { NotFoundError, BadRequestError, ConflictError } from '../middleware/error.middleware';

// ─── List Programs ────────────────────────────────────────────────────────────

export class ProgramService {
  static async listPrograms() {
    const programs = await prisma.program.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { stages: true, enrollments: true } },
      },
    });

    return programs.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      learningPaths: p.learningPaths,
      stageCount: p._count.stages,
      enrollmentCount: p._count.enrollments,
    }));
  }

  // ─── Get Program by Slug ──────────────────────────────────────────────────

  static async getProgramBySlug(slug: string) {
    const program = await prisma.program.findUnique({
      where: { slug },
      include: {
        stages: {
          orderBy: { orderIndex: 'asc' },
          include: {
            courses: {
              where: { isPublished: true },
              select: {
                id: true,
                title: true,
                description: true,
                category: true,
                slug: true,
                thumbnailUrl: true,
                _count: { select: { units: true } },
              },
            },
          },
        },
      },
    });

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    return {
      ...program,
      stages: program.stages.map(s => ({
        ...s,
        courses: s.courses.map(c => ({
          ...c,
          unitCount: c._count.units,
        })),
      })),
    };
  }

  // ─── Enroll Member ────────────────────────────────────────────────────────

  static async enrollMember(input: {
    programId: string;
    familyMemberId: string;
    path: LearningPath;
    stageNumber?: number;
  }) {
    const { programId, familyMemberId, path, stageNumber } = input;

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        stages: { orderBy: { orderIndex: 'asc' } },
      },
    });

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    if (!program.isPublished) {
      throw new BadRequestError('Program is not published');
    }

    if (program.stages.length === 0) {
      throw new BadRequestError('Program has no stages defined');
    }

    // Validate path is offered by this program
    if (program.learningPaths.length > 0 && !program.learningPaths.includes(path)) {
      throw new BadRequestError(
        `Program does not offer the '${path}' learning path`
      );
    }

    // Resolve starting stage
    let startingStage = program.stages[0];
    if (stageNumber !== undefined) {
      const found = program.stages.find(s => s.stageNumber === stageNumber);
      if (!found) {
        throw new NotFoundError(`Stage number ${stageNumber} not found in program`);
      }
      startingStage = found;
    }

    const existing = await prisma.programEnrollment.findUnique({
      where: { familyMemberId_programId: { familyMemberId, programId } },
    });

    if (existing) {
      throw new ConflictError('Member is already enrolled in this program');
    }

    // Fetch published courses on the starting stage so we can bridge to CourseEnrollment.
    const stageWithCourses = await prisma.programStage.findUnique({
      where: { id: startingStage.id },
      include: {
        courses: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });

    const enrollment = await prisma.$transaction(async (tx) => {
      const pe = await tx.programEnrollment.create({
        data: {
          familyMemberId,
          programId,
          path,
          currentStageId: startingStage.id,
        },
        include: {
          program: { select: { id: true, slug: true, name: true } },
          currentStage: { select: { id: true, stageNumber: true, name: true, ageMin: true, ageMax: true } },
        },
      });

      // Bridge: create CourseEnrollment rows for every published course in the
      // starting stage. skipDuplicates guards against re-enrollment edge cases.
      const courseData = (stageWithCourses?.courses ?? []).map(c => ({
        memberId: familyMemberId,
        courseId: c.id,
        status: 'ACTIVE' as const,
        progress: 0,
      }));

      const { count } = await tx.courseEnrollment.createMany({
        data: courseData,
        skipDuplicates: true,
      });

      console.debug(
        `[ProgramService.enrollMember] member=${familyMemberId} stage=${startingStage.id} → created ${count} CourseEnrollment rows`
      );

      return pe;
    });

    return enrollment;
  }

  // ─── Get Member Enrollments ───────────────────────────────────────────────

  static async getMemberEnrollments(memberId: string) {
    const enrollments = await prisma.programEnrollment.findMany({
      where: { familyMemberId: memberId },
      orderBy: { enrolledAt: 'desc' },
      include: {
        program: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            learningPaths: true,
            _count: { select: { stages: true } },
          },
        },
        currentStage: {
          select: {
            id: true,
            stageNumber: true,
            name: true,
            orderIndex: true,
            ageMin: true,
            ageMax: true,
            courses: {
              select: { id: true, title: true, slug: true, category: true },
            },
          },
        },
      },
    });

    return enrollments;
  }

  // ─── Stage Progress Summary ───────────────────────────────────────────────
  // Returns the StageProgressSummary shape the frontend expects, or null when
  // the member has no active enrollment.

  static async getStageSummary(memberId: string): Promise<{
    stageId: string;
    stageName: string;
    totalCourses: number;
    completedCourses: number;
    overallProgress: number; // 0-100
    subjectProgress: {
      courseId: string;
      courseTitle: string;
      category: string;
      progress: number;
      totalUnits: number;
      completedUnits: number;
    }[];
  } | null> {
    // Fetch the active enrollment and its current stage with published courses.
    // Uses ONLY `include` on every relation — no mixed select+include.
    const enrollment = await prisma.programEnrollment.findFirst({
      where: { familyMemberId: memberId, status: 'ACTIVE' },
      include: {
        currentStage: {
          include: {
            courses: {
              where: { isPublished: true },
              select: {
                id: true,
                title: true,
                category: true,
                _count: { select: { units: true } },
              },
            },
          },
        },
      },
    });

    if (!enrollment) return null;

    const stage = enrollment.currentStage;
    const courseIds = stage.courses.map(c => c.id);

    // Load course enrollments for this member within the current stage.
    const courseEnrollments = await prisma.courseEnrollment.findMany({
      where: { memberId, courseId: { in: courseIds } },
      select: {
        courseId: true,
        progress: true,   // 0-100 stored value
        status: true,
        unitProgress: {
          select: { completedAt: true },
        },
      },
    });

    const ceMap = new Map(courseEnrollments.map(ce => [ce.courseId, ce]));

    const subjectProgress = stage.courses.map(course => {
      const ce = ceMap.get(course.id);
      return {
        courseId: course.id,
        courseTitle: course.title,
        category: course.category,
        progress: ce?.progress ?? 0,
        totalUnits: course._count.units,
        completedUnits: ce
          ? ce.unitProgress.filter(up => up.completedAt !== null).length
          : 0,
      };
    });

    const totalCourses = stage.courses.length;
    const completedCourses = courseEnrollments.filter(
      ce => ce.status === 'COMPLETED'
    ).length;
    const overallProgress =
      totalCourses > 0
        ? Math.round(
            subjectProgress.reduce((sum, sp) => sum + sp.progress, 0) /
              totalCourses
          )
        : 0;

    return {
      stageId: stage.id,
      stageName: stage.name,
      totalCourses,
      completedCourses,
      overallProgress,
      subjectProgress,
    };
  }
}
