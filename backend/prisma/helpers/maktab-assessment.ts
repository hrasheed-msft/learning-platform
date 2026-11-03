import { PrismaClient } from '@prisma/client';

export type AssessmentQuestion = {
  externalId: string;
  type: string;
  questionText: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
};

/**
 * Adds a Mid-Year Assessment and Completion Assessment unit to a Maktab course.
 *
 * Idempotent: safe to call on every seed run. On first call (when mid-year unit
 * does not yet exist), shifts all second-half units up by 1 position (inside the
 * transaction, via negative values so the @@unique([courseId, orderIndex]) index
 * is never violated mid-update).
 * On subsequent calls the units are already at their final positions and the
 * upserts are no-ops.
 *
 * @param prisma                  PrismaClient instance
 * @param courseId                ID of the course to add assessments to
 * @param midYearSlug             Unique slug for the mid-year assessment unit
 * @param completionSlug          Unique slug for the completion assessment unit
 * @param midYearTitle            Display title for the mid-year assessment
 * @param completionTitle         Display title for the completion assessment
 * @param firstHalfLastOrderIndex orderIndex of the LAST unit in the first half
 *                                (mid-year is inserted immediately after this)
 * @param originalMaxOrderIndex   orderIndex of the LAST regular unit before
 *                                assessments were added
 * @param midYearQuestions        Questions for the mid-year unit
 * @param completionQuestions     Questions for the completion unit
 */
export async function seedMaktabAssessments(
  prisma: PrismaClient,
  courseId: string,
  midYearSlug: string,
  completionSlug: string,
  midYearTitle: string,
  completionTitle: string,
  firstHalfLastOrderIndex: number,
  originalMaxOrderIndex: number,
  midYearQuestions: AssessmentQuestion[],
  completionQuestions: AssessmentQuestion[],
): Promise<void> {
  const midYearOrderIndex = firstHalfLastOrderIndex + 1;
  // After shifting second-half units by +1, originalMaxOrderIndex+1 is the last
  // regular unit, so completion goes at +2.
  const completionOrderIndex = originalMaxOrderIndex + 2;

  const midYearContent = `
<h2>Mid-Year Assessment</h2>
<p>This assessment covers all topics studied in the first half of this coursebook. Work through each question carefully — good luck!</p>
`.trim();

  const completionContent = `
<h2>Course Completion Assessment</h2>
<p>This comprehensive assessment covers all topics studied throughout this coursebook. Answer every question to demonstrate your understanding of the complete course.</p>
`.trim();

  // Wrap guard-read, conditional shift, unit upserts, and question upserts in a
  // single transaction so a crash mid-way leaves the database in a consistent
  // state and a retry will safely re-enter without partial writes.
  await prisma.$transaction(async (tx) => {
    // Idempotency: only shift if mid-year assessment does not yet exist.
    const existing = await tx.unit.findFirst({
      where: { courseId, slug: midYearSlug },
      select: { id: true },
    });

    if (!existing) {
      // Shift in two steps via negative values: PostgreSQL checks a non-deferrable
      // unique index row by row, so a direct "+ 1" can collide with the next row.
      await tx.$executeRawUnsafe(
        `UPDATE units SET "orderIndex" = -("orderIndex" + 1)
         WHERE "courseId" = $1 AND "orderIndex" > $2`,
        courseId,
        firstHalfLastOrderIndex,
      );
      await tx.$executeRawUnsafe(
        `UPDATE units SET "orderIndex" = -"orderIndex"
         WHERE "courseId" = $1 AND "orderIndex" < 0`,
        courseId,
      );
    }

    const midYearUnit = await tx.unit.upsert({
      where: { courseId_slug: { courseId, slug: midYearSlug } },
      create: {
        slug: midYearSlug,
        courseId,
        orderIndex: midYearOrderIndex,
        title: midYearTitle,
        description: 'Mid-year assessment covering topics from the first half of this coursebook.',
        content: midYearContent,
      },
      update: {
        title: midYearTitle,
        description: 'Mid-year assessment covering topics from the first half of this coursebook.',
        content: midYearContent,
        orderIndex: midYearOrderIndex,
      },
    });

    const completionUnit = await tx.unit.upsert({
      where: { courseId_slug: { courseId, slug: completionSlug } },
      create: {
        slug: completionSlug,
        courseId,
        orderIndex: completionOrderIndex,
        title: completionTitle,
        description: 'Comprehensive completion assessment covering all topics in this coursebook.',
        content: completionContent,
      },
      update: {
        title: completionTitle,
        description: 'Comprehensive completion assessment covering all topics in this coursebook.',
        content: completionContent,
        orderIndex: completionOrderIndex,
      },
    });

    // Upsert all assessment questions
    const allQuestions = [
      ...midYearQuestions.map(q => ({ ...q, unitId: midYearUnit.id })),
      ...completionQuestions.map(q => ({ ...q, unitId: completionUnit.id })),
    ];

    for (const q of allQuestions) {
      await tx.question.upsert({
        where: { externalId: q.externalId },
        create: {
          externalId: q.externalId,
          unitId: q.unitId,
          type: q.type,
          questionText: q.questionText,
          options: q.options !== null ? JSON.stringify(q.options) : undefined,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'MEDIUM',
        },
        update: {
          unitId: q.unitId,
          type: q.type,
          questionText: q.questionText,
          options: q.options !== null ? JSON.stringify(q.options) : undefined,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: 'MEDIUM',
        },
      });
    }
  });

  console.log(
    `   📋 ${midYearTitle} → orderIndex ${midYearOrderIndex}, ` +
      `${midYearQuestions.length} questions`,
  );
  console.log(
    `   📋 ${completionTitle} → orderIndex ${completionOrderIndex}, ` +
      `${completionQuestions.length} questions`,
  );
}
