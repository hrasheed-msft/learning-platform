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

    const enrollment = await prisma.programEnrollment.create({
      data: {
        familyMemberId,
        programId,
        path,
        currentStageId: startingStage.id,
      },
      include: {
        program: { select: { id: true, slug: true, name: true } },
        currentStage: { select: { id: true, stageNumber: true, name: true } },
      },
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
          select: { id: true, stageNumber: true, name: true, orderIndex: true },
        },
      },
    });

    return enrollments;
  }

  // ─── Stage Progress Summary ───────────────────────────────────────────────

  static async getStageSummary(memberId: string) {
    const enrollments = await prisma.programEnrollment.findMany({
      where: { familyMemberId: memberId, status: 'ACTIVE' },
      include: {
        program: {
          select: { id: true, slug: true, name: true },
          include: {
            stages: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                stageNumber: true,
                name: true,
                orderIndex: true,
                _count: { select: { courses: true } },
              },
            },
          },
        },
        currentStage: {
          select: { id: true, stageNumber: true, name: true, orderIndex: true },
        },
      },
    });

    return enrollments.map(e => {
      const stages = e.program.stages;
      const currentIdx = stages.findIndex(s => s.id === e.currentStageId);
      const completedStages = currentIdx > 0 ? currentIdx : 0;
      const totalStages = stages.length;

      return {
        enrollmentId: e.id,
        program: {
          id: e.program.id,
          slug: e.program.slug,
          name: e.program.name,
        },
        path: e.path,
        status: e.status,
        currentStage: e.currentStage,
        completedStages,
        totalStages,
        progressPct: totalStages > 0
          ? Math.round((completedStages / totalStages) * 100)
          : 0,
        stages: stages.map(s => ({
          ...s,
          courseCount: s._count.courses,
          isCurrent: s.id === e.currentStageId,
          isCompleted: s.orderIndex < (e.currentStage?.orderIndex ?? 0),
        })),
      };
    });
  }
}
