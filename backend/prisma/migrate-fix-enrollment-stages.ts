/**
 * One-shot migration: fix two maktab stage enrollments
 *
 * Problem:
 *   - Ibn Sharif  (b32bf819-1662-47c5-b80f-2e2ca6bd26ab, age 10) → Foundation 1 (stageNum=1) ❌
 *   - Ibn Sharif 2 (c73a8265-fc19-4dd4-a607-ba6c14b73341, age 11) → Coursebook 2 (stageNum=4) ❌
 *   Both should be → Coursebook 5 (stageNum=7, ages 10-11)
 *
 * Usage (prod):
 *   DATABASE_URL="<prod_url>" npx ts-node -e "require('./prisma/migrate-fix-enrollment-stages.ts')"
 *   or:
 *   DATABASE_URL="<prod_url>" npx ts-node backend/prisma/migrate-fix-enrollment-stages.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MEMBER_IDS = [
  'b32bf819-1662-47c5-b80f-2e2ca6bd26ab', // Ibn Sharif, age 10
  'c73a8265-fc19-4dd4-a607-ba6c14b73341', // Ibn Sharif 2, age 11
];

const TARGET_STAGE_NUMBER = 7; // Coursebook 5 (CB5), ages 10-11

async function main() {
  console.log('=== migrate-fix-enrollment-stages ===');
  console.log(`Target stage number: ${TARGET_STAGE_NUMBER}`);

  for (const memberId of MEMBER_IDS) {
    console.log(`\n── Processing member ${memberId}`);

    // Load the active enrollment for this member
    const enrollment = await prisma.programEnrollment.findFirst({
      where: { familyMemberId: memberId, status: 'ACTIVE' },
      include: {
        currentStage: {
          include: {
            courses: {
              where: { isPublished: true },
              select: { id: true, title: true },
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
      console.warn(`  ⚠ No active ProgramEnrollment found — skipping`);
      continue;
    }

    console.log(
      `  Current stage: ${enrollment.currentStage.name} (stageNum=${enrollment.currentStage.stageNumber})`
    );

    const targetStage = enrollment.program.stages.find(
      s => s.stageNumber === TARGET_STAGE_NUMBER
    );

    if (!targetStage) {
      console.error(
        `  ✗ Stage ${TARGET_STAGE_NUMBER} not found in program '${enrollment.program.name}' — skipping`
      );
      continue;
    }

    if (targetStage.id === enrollment.currentStageId) {
      console.log(`  ✓ Already on stage ${TARGET_STAGE_NUMBER} — nothing to do`);
      continue;
    }

    console.log(`  Target stage: ${targetStage.name} (stageNum=${targetStage.stageNumber})`);

    // Fetch published courses on old and new stages
    const oldStageCourseIds = new Set(enrollment.currentStage.courses.map(c => c.id));

    const newStageWithCourses = await prisma.programStage.findUnique({
      where: { id: targetStage.id },
      include: {
        courses: {
          where: { isPublished: true },
          select: { id: true, title: true },
        },
      },
    });

    const newStageCourses = newStageWithCourses?.courses ?? [];
    const newStageCourseIds = new Set(newStageCourses.map(c => c.id));

    const toDeleteCourseIds = [...oldStageCourseIds].filter(id => !newStageCourseIds.has(id));

    console.log(`  Old-stage courses (${oldStageCourseIds.size}):`, [...oldStageCourseIds]);
    console.log(`  New-stage courses (${newStageCourseIds.size}):`, [...newStageCourseIds]);
    console.log(`  CourseEnrollments to delete (${toDeleteCourseIds.length}):`, toDeleteCourseIds);

    await prisma.$transaction(async (tx) => {
      // a. Move enrollment to new stage
      await tx.programEnrollment.update({
        where: { id: enrollment.id },
        data: { currentStageId: targetStage.id },
      });
      console.log(`  ✓ Updated ProgramEnrollment.currentStageId → ${targetStage.id}`);

      // c. Delete stale CourseEnrollments (old-stage-only courses)
      if (toDeleteCourseIds.length > 0) {
        const deleted = await tx.courseEnrollment.deleteMany({
          where: { memberId, courseId: { in: toDeleteCourseIds } },
        });
        console.log(`  ✓ Deleted ${deleted.count} old-stage CourseEnrollment rows`);
      }

      // d. Create missing CourseEnrollments for new stage
      const { count } = await tx.courseEnrollment.createMany({
        data: newStageCourses.map(c => ({
          memberId,
          courseId: c.id,
          status: 'ACTIVE',
          progress: 0,
        })),
        skipDuplicates: true,
      });
      console.log(`  ✓ Created ${count} new-stage CourseEnrollment rows`);
    });

    console.log(`  ✅ Member ${memberId} moved to ${targetStage.name} (stageNum=${TARGET_STAGE_NUMBER})`);
  }

  console.log('\n=== Done ===');
}

main()
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
