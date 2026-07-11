/**
 * Backfill script: create missing CourseEnrollment rows for all existing
 * ProgramEnrollment records.
 *
 * Run once against production after deploying the enrollment-bridge fix:
 *   npx tsx backend/scripts/backfill-program-course-enrollments.ts
 *
 * Idempotent — uses skipDuplicates; safe to run multiple times.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[backfill] Loading all active ProgramEnrollment rows...');

  const programEnrollments = await prisma.programEnrollment.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      familyMemberId: true,
      currentStageId: true,
    },
  });

  console.log(`[backfill] Found ${programEnrollments.length} active program enrollment(s).`);

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const pe of programEnrollments) {
    // Load published courses on this enrollment's current stage
    const stage = await prisma.programStage.findUnique({
      where: { id: pe.currentStageId },
      include: {
        courses: {
          where: { isPublished: true },
          select: { id: true, slug: true },
        },
      },
    });

    if (!stage || stage.courses.length === 0) {
      console.log(
        `[backfill]   enrollment=${pe.id} member=${pe.familyMemberId} → stage has no published courses, skipping`
      );
      totalSkipped++;
      continue;
    }

    const courseData = stage.courses.map(c => ({
      memberId: pe.familyMemberId,
      courseId: c.id,
      status: 'ACTIVE',
      progress: 0,
    }));

    const { count } = await prisma.courseEnrollment.createMany({
      data: courseData,
      skipDuplicates: true,
    });

    console.log(
      `[backfill]   enrollment=${pe.id} member=${pe.familyMemberId} stage=${stage.name} → created ${count}/${stage.courses.length} CourseEnrollment row(s)`
    );

    totalCreated += count;
    totalSkipped += stage.courses.length - count; // already existed
  }

  console.log(
    `\n[backfill] DONE — ${totalCreated} CourseEnrollment rows created, ${totalSkipped} already existed (skipped).`
  );
}

main()
  .catch(err => {
    console.error('[backfill] ERROR:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
