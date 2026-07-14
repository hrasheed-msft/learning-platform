import prisma from '../config/database';
import { LearningPath } from '@prisma/client';
import { NotFoundError, BadRequestError, ConflictError } from '../middleware/error.middleware';

// ─── Shared types exported for Ibn Sina / frontend contract ──────────────────

export interface NextUnitShape {
  id: string;
  title: string;
  orderIndex: number;
  courseId: string;
  courseSlug: string | null;
}

export interface SubjectProgressEntry {
  courseId: string;
  courseTitle: string;
  category: string;
  progress: number;              // 0-100
  totalUnits: number;
  completedUnits: number;
  nextUnit: NextUnitShape | null;
  lastActivityAt: string | null; // ISO string
  unitsCompletedLast7Days: number;
}

export interface StageProgressSummary {
  stageId: string;
  stageName: string;
  totalCourses: number;
  completedCourses: number;
  overallProgress: number; // 0-100
  subjectProgress: SubjectProgressEntry[];
  nextUp: {
    subjectSlug: string;
    courseId: string;
    unit: NextUnitShape;
  } | null;
  streak: {
    current: number;
    longest: number;
    lastActivityAt: string | null;
  };
  weeklyActivity: { date: string; unitsCompleted: number }[];
}

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
  //
  // Phase 2 additions (additive only):
  //   subjectProgress[].nextUnit        — first incomplete unit per course
  //   subjectProgress[].lastActivityAt  — most recent UnitProgress activity
  //   subjectProgress[].unitsCompletedLast7Days
  //   nextUp                            — top-level "what to do next" CTA pointer
  //   streak                            — current / longest streak + lastActivityAt
  //   weeklyActivity                    — 7-day bar-chart data (oldest→newest)
  //
  // Query strategy: 4 batched queries, zero N+1 per course.

  static async getStageSummary(memberId: string): Promise<StageProgressSummary | null> {
    // ── Query 1: enrollment + stage + courses ─────────────────────────────
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
                slug: true,
                _count: { select: { units: true } },
              },
            },
          },
        },
      },
    });

    if (!enrollment) return null;

    const stage = enrollment.currentStage;
    const learningPath = enrollment.path; // AFTER_SCHOOL | WEEKEND
    const courseIds = stage.courses.map(c => c.id);

    // ── Query 2: CourseEnrollments for this member in the current stage ───
    const courseEnrollments = await prisma.courseEnrollment.findMany({
      where: { memberId, courseId: { in: courseIds } },
      select: { id: true, courseId: true, progress: true, status: true },
    });

    const ceMap = new Map(courseEnrollments.map(ce => [ce.courseId, ce]));
    const enrollmentIds = courseEnrollments.map(ce => ce.id);

    // ── Query 3: All UnitProgress rows across the stage (batched) ─────────
    // Index: unit_progress(enrollmentId, completedAt) covers both filters.
    const allUnitProgress = enrollmentIds.length > 0
      ? await prisma.unitProgress.findMany({
          where: { enrollmentId: { in: enrollmentIds } },
          select: { enrollmentId: true, unitId: true, completedAt: true, updatedAt: true },
        })
      : [];

    // Group by enrollmentId for per-course lookups
    const upByEnrollment = new Map<string, typeof allUnitProgress>();
    for (const up of allUnitProgress) {
      const list = upByEnrollment.get(up.enrollmentId);
      if (list) list.push(up); else upByEnrollment.set(up.enrollmentId, [up]);
    }

    // ── Query 4: All Units for courses in the stage (for nextUnit) ────────
    const allUnits = courseIds.length > 0
      ? await prisma.unit.findMany({
          where: { courseId: { in: courseIds } },
          select: { id: true, title: true, orderIndex: true, courseId: true, includedInPaths: true },
          orderBy: [{ orderIndex: 'asc' }, { id: 'asc' }],
        })
      : [];

    // Group units by courseId
    const unitsByCourse = new Map<string, typeof allUnits>();
    for (const unit of allUnits) {
      const list = unitsByCourse.get(unit.courseId);
      if (list) list.push(unit); else unitsByCourse.set(unit.courseId, [unit]);
    }

    // ── Streak + weekly-activity aggregation (UTC calendar days) ─────────
    const nowUtc = new Date();
    const todayUTC = utcDay(nowUtc);

    // Build weekly map: last 7 days, oldest first
    const weeklyMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      weeklyMap.set(utcDayOffset(nowUtc, -i), 0);
    }

    const completedDaySet = new Set<string>();
    let lastActivityAt: string | null = null;

    for (const up of allUnitProgress) {
      if (up.completedAt) {
        const day = utcDay(up.completedAt);
        completedDaySet.add(day);
        if (weeklyMap.has(day)) weeklyMap.set(day, (weeklyMap.get(day) ?? 0) + 1);
        const iso = up.completedAt.toISOString();
        if (!lastActivityAt || iso > lastActivityAt) lastActivityAt = iso;
      }
      // Also track updatedAt for lastActivityAt (per-course use)
    }

    const weeklyActivity = Array.from(weeklyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, unitsCompleted]) => ({ date, unitsCompleted }));

    // Longest streak (iterate sorted unique days)
    const sortedDays = Array.from(completedDaySet).sort();
    let longestStreak = 0;
    let currentRun = 0;
    let prevDay: string | null = null;
    for (const day of sortedDays) {
      if (prevDay === null) {
        currentRun = 1;
      } else {
        const diffMs = new Date(day).getTime() - new Date(prevDay).getTime();
        currentRun = diffMs === 86400000 ? currentRun + 1 : 1;
      }
      if (currentRun > longestStreak) longestStreak = currentRun;
      prevDay = day;
    }

    // Current streak: consecutive days ending today (or yesterday if not active today)
    let currentStreak = 0;
    const yesterdayUTC = utcDayOffset(nowUtc, -1);
    if (completedDaySet.has(todayUTC) || completedDaySet.has(yesterdayUTC)) {
      let checkDay = completedDaySet.has(todayUTC) ? todayUTC : yesterdayUTC;
      while (completedDaySet.has(checkDay)) {
        currentStreak++;
        checkDay = utcDayOffset(new Date(checkDay), -1);
      }
    }

    const sevenDaysAgoMs = new Date(Date.UTC(
      nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate() - 6
    )).getTime();

    // ── Per-subject aggregation ───────────────────────────────────────────
    const subjectProgress: SubjectProgressEntry[] = stage.courses.map(course => {
      const ce = ceMap.get(course.id);
      const ceId = ce?.id;
      const ups = ceId ? (upByEnrollment.get(ceId) ?? []) : [];

      const completedUnits = ups.filter(up => up.completedAt !== null).length;

      // lastActivityAt for this course: max(updatedAt, completedAt)
      let courseLastActivity: string | null = null;
      for (const up of ups) {
        const ts = [up.updatedAt?.toISOString(), up.completedAt?.toISOString()]
          .filter(Boolean)
          .reduce((max: string | null, v) =>
            v && (!max || v > max) ? v : max, null);
        if (ts && (!courseLastActivity || ts > courseLastActivity)) courseLastActivity = ts;
      }

      const unitsCompletedLast7Days = ups.filter(
        up => up.completedAt && up.completedAt.getTime() >= sevenDaysAgoMs
      ).length;

      // nextUnit: first eligible unit not yet completed
      const completedUnitIdsForCourse = new Set(
        ups.filter(up => up.completedAt !== null).map(up => up.unitId)
      );
      const courseUnits = unitsByCourse.get(course.id) ?? [];
      const eligibleUnits = courseUnits.filter(
        u => u.includedInPaths.length === 0 || u.includedInPaths.includes(learningPath)
      );
      const nextUnitRaw = eligibleUnits.find(u => !completedUnitIdsForCourse.has(u.id)) ?? null;

      const nextUnit: NextUnitShape | null = nextUnitRaw
        ? {
            id: nextUnitRaw.id,
            title: nextUnitRaw.title,
            orderIndex: nextUnitRaw.orderIndex,
            courseId: course.id,
            courseSlug: course.slug ?? null,
          }
        : null;

      return {
        courseId: course.id,
        courseTitle: course.title,
        category: course.category,
        progress: ce?.progress ?? 0,
        totalUnits: course._count.units,
        completedUnits,
        nextUnit,
        lastActivityAt: courseLastActivity,
        unitsCompletedLast7Days,
      };
    });

    // ── nextUp: first subject (stage course order) with an incomplete unit ─
    let nextUp: StageProgressSummary['nextUp'] = null;
    for (const sp of subjectProgress) {
      if (sp.nextUnit) {
        const course = stage.courses.find(c => c.id === sp.courseId)!;
        nextUp = {
          subjectSlug: course.slug ?? sp.courseId,
          courseId: sp.courseId,
          unit: sp.nextUnit,
        };
        break;
      }
    }

    const totalCourses = stage.courses.length;
    const completedCourses = courseEnrollments.filter(ce => ce.status === 'COMPLETED').length;
    const overallProgress =
      totalCourses > 0
        ? Math.round(subjectProgress.reduce((sum, sp) => sum + sp.progress, 0) / totalCourses)
        : 0;

    return {
      stageId: stage.id,
      stageName: stage.name,
      totalCourses,
      completedCourses,
      overallProgress,
      subjectProgress,
      nextUp,
      streak: { current: currentStreak, longest: longestStreak, lastActivityAt },
      weeklyActivity,
    };
  }

  // ─── Move Enrollment Stage ────────────────────────────────────────────────
  // Moves a ProgramEnrollment to a different stage within the same program and
  // bridges CourseEnrollment rows accordingly.
  //
  // Steps:
  //   1. Load enrollment + currentStage (with courses) + program.stages
  //   2. Resolve target stage by stageNumber within the program
  //   3. Transaction:
  //      a. Update currentStageId on the enrollment
  //      b. Fetch published courses on new stage
  //      c. Delete CourseEnrollment rows for OLD-stage courses NOT on new stage
  //      d. Create missing CourseEnrollment rows for new stage (skipDuplicates)
  //   4. Return updated enrollment (currentStage included)

  static async moveEnrollmentStage(enrollmentId: string, stageNumber: number) {
    // ── Load enrollment with old stage courses + all sibling stages ───────
    const enrollment = await prisma.programEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        currentStage: {
          include: {
            courses: {
              where: { isPublished: true },
              select: { id: true },
            },
          },
        },
        program: {
          include: {
            stages: { orderBy: { orderIndex: 'asc' } },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundError('Program enrollment not found');
    }

    // ── Resolve target stage ──────────────────────────────────────────────
    const targetStage = enrollment.program.stages.find(
      s => s.stageNumber === stageNumber
    );
    if (!targetStage) {
      throw new NotFoundError(
        `Stage number ${stageNumber} not found in program '${enrollment.program.name}'`
      );
    }

    if (targetStage.id === enrollment.currentStageId) {
      throw new BadRequestError('Enrollment is already on the requested stage');
    }

    const memberId = enrollment.familyMemberId;
    const oldStageCourseIds = new Set(enrollment.currentStage.courses.map(c => c.id));

    // ── Fetch published courses on the target stage ───────────────────────
    const newStageWithCourses = await prisma.programStage.findUnique({
      where: { id: targetStage.id },
      include: {
        courses: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    });

    const newStageCourseIds = new Set(
      (newStageWithCourses?.courses ?? []).map(c => c.id)
    );

    // Courses exclusive to old stage (not on new stage) — safe to remove
    const toDeleteCourseIds = [...oldStageCourseIds].filter(
      id => !newStageCourseIds.has(id)
    );

    const updatedEnrollment = await prisma.$transaction(async (tx) => {
      // a. Move enrollment to new stage
      await tx.programEnrollment.update({
        where: { id: enrollmentId },
        data: { currentStageId: targetStage.id },
      });

      // c. Delete stale CourseEnrollment rows (old-stage only courses)
      if (toDeleteCourseIds.length > 0) {
        const deleted = await tx.courseEnrollment.deleteMany({
          where: { memberId, courseId: { in: toDeleteCourseIds } },
        });
        console.debug(
          `[ProgramService.moveEnrollmentStage] deleted ${deleted.count} old-stage CourseEnrollment rows`
        );
      }

      // d. Create missing CourseEnrollment rows for new stage
      const newCourseData = [...newStageCourseIds].map(courseId => ({
        memberId,
        courseId,
        status: 'ACTIVE' as const,
        progress: 0,
      }));

      const { count } = await tx.courseEnrollment.createMany({
        data: newCourseData,
        skipDuplicates: true,
      });
      console.debug(
        `[ProgramService.moveEnrollmentStage] created ${count} new-stage CourseEnrollment rows`
      );

      // Return updated enrollment with new currentStage
      return tx.programEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          program: { select: { id: true, slug: true, name: true } },
          currentStage: {
            select: {
              id: true,
              stageNumber: true,
              name: true,
              ageMin: true,
              ageMax: true,
            },
          },
        },
      });
    });

    return updatedEnrollment;
  }
}

// ─── UTC day helpers ──────────────────────────────────────────────────────────

function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function utcDayOffset(d: Date, offsetDays: number): string {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + offsetDays)
  ).toISOString().slice(0, 10);
}
