import { LearningPath, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maktab An Nasihah Program Seed
 *
 * Creates the published "Maktab An Nasihah" Program and its 12 ProgramStages,
 * linking each stage to the existing course seeds by slug.
 *
 * Special handling:
 *   - Stage 8 connects both boys and girls CB6 courses
 *   - Quran memorization courses are cross-cutting and connect to stages 1–11
 *   - Stage 12 is the dedicated Quran Memorization stage
 *
 * Can be run independently: npx ts-node prisma/seed-maktab-program.ts
 */

type StageDefinition = {
  stageNumber: number;
  name: string;
  description: string;
  ageMin: number;
  ageMax: number;
  orderIndex: number;
  courseSlugs: string[];
};

const PROGRAM_SLUG = 'maktab-an-nasihah';
const PROGRAM_NAME = 'Maktab An Nasihah';
const PROGRAM_DESCRIPTION =
  'A structured 12-stage maktab program spanning foundation years, coursebooks, further studies, and Quran memorization across after-school and weekend learning paths.';

// Juz Amma (short surahs) is appropriate for all stages (ages 4+).
// Longer Surahs (Yasin, Mulk, etc.) targets CHILD/PRE_TEEN/TEEN (ages 10+)
// and should only join from CB5 (stage 7) onwards.
const QURAN_JUZ_AMMA_SLUG = 'quran-memorization-juz-amma';
const QURAN_LONGER_SURAHS_SLUG = 'quran-memorization-longer-surahs';

/** First stage number (CB5, ages 10-11) where Longer Surahs is age-appropriate. */
const LONGER_SURAHS_MIN_STAGE = 7;

const STAGES: StageDefinition[] = [
  {
    stageNumber: 1,
    name: 'Foundation 1',
    description: 'Foundation stage for ages 4–5 using the Maktab Foundation 1 course.',
    ageMin: 4,
    ageMax: 5,
    orderIndex: 0,
    courseSlugs: ['maktab-foundation-1'],
  },
  {
    stageNumber: 2,
    name: 'Foundation 2',
    description: 'Foundation stage for ages 5–6 using the Maktab Foundation 2 course.',
    ageMin: 5,
    ageMax: 6,
    orderIndex: 1,
    courseSlugs: ['maktab-foundation-2'],
  },
  {
    stageNumber: 3,
    name: 'Coursebook 1',
    description: 'Core Maktab Coursebook 1 stage for ages 6–7.',
    ageMin: 6,
    ageMax: 7,
    orderIndex: 2,
    courseSlugs: ['maktab-coursebook-1'],
  },
  {
    stageNumber: 4,
    name: 'Coursebook 2',
    description: 'Core Maktab Coursebook 2 stage for ages 7–8.',
    ageMin: 7,
    ageMax: 8,
    orderIndex: 3,
    courseSlugs: ['maktab-coursebook-2'],
  },
  {
    stageNumber: 5,
    name: 'Coursebook 3',
    description: 'Core Maktab Coursebook 3 stage for ages 8–9.',
    ageMin: 8,
    ageMax: 9,
    orderIndex: 4,
    courseSlugs: ['maktab-coursebook-3'],
  },
  {
    stageNumber: 6,
    name: 'Coursebook 4',
    description: 'Core Maktab Coursebook 4 stage for ages 9–10.',
    ageMin: 9,
    ageMax: 10,
    orderIndex: 5,
    courseSlugs: ['maktab-coursebook-4'],
  },
  {
    stageNumber: 7,
    name: 'Coursebook 5',
    description: 'Core Maktab Coursebook 5 stage for ages 10–11.',
    ageMin: 10,
    ageMax: 11,
    orderIndex: 6,
    courseSlugs: ['maktab-coursebook-5'],
  },
  {
    stageNumber: 8,
    name: 'Coursebook 6',
    description: 'Core Maktab Coursebook 6 stage for ages 11–12 with both boys and girls variants.',
    ageMin: 11,
    ageMax: 12,
    orderIndex: 7,
    courseSlugs: ['maktab-coursebook-6-boys', 'maktab-coursebook-6-girls'],
  },
  {
    stageNumber: 9,
    name: 'Coursebook 7',
    description: 'Core Maktab Coursebook 7 stage for ages 12–13.',
    ageMin: 12,
    ageMax: 13,
    orderIndex: 8,
    courseSlugs: ['maktab-coursebook-7'],
  },
  {
    stageNumber: 10,
    name: 'Coursebook 8',
    description: 'Core Maktab Coursebook 8 stage for ages 13–14.',
    ageMin: 13,
    ageMax: 14,
    orderIndex: 9,
    courseSlugs: ['maktab-coursebook-8'],
  },
  {
    stageNumber: 11,
    name: 'Further Studies',
    description: 'Post-coursebook further studies stage for learners aged 14 and above.',
    ageMin: 14,
    ageMax: 99,
    orderIndex: 10,
    courseSlugs: ['maktab-further-studies-nw'],
  },
  {
    stageNumber: 12,
    name: 'Quran Memorization',
    description: 'Cross-cutting Quran memorization stage spanning the full maktab age range.',
    ageMin: 4,
    ageMax: 99,
    orderIndex: 11,
    courseSlugs: [QURAN_JUZ_AMMA_SLUG, QURAN_LONGER_SURAHS_SLUG],
  },
];

function getStageCourseSlugs(stage: StageDefinition): string[] {
  // Stage 12 is the dedicated Quran Memorization stage — its courseSlugs
  // already include both Quran courses; don't add extras.
  if (stage.stageNumber === 12) return stage.courseSlugs;

  const quranCourses: string[] = [];
  // Juz Amma runs alongside every coursebook stage (1-11).
  if (stage.stageNumber <= 11) quranCourses.push(QURAN_JUZ_AMMA_SLUG);
  // Longer Surahs is only age-appropriate from CB5 (stage 7, ages 10-11) onward.
  if (stage.stageNumber >= LONGER_SURAHS_MIN_STAGE && stage.stageNumber <= 11) {
    quranCourses.push(QURAN_LONGER_SURAHS_SLUG);
  }

  return [...new Set([...stage.courseSlugs, ...quranCourses])];
}

export async function seedMaktabProgram() {
  console.log('🏫 Seeding Maktab An Nasihah program...');

  const program = await prisma.program.upsert({
    where: { slug: PROGRAM_SLUG },
    create: {
      slug: PROGRAM_SLUG,
      name: PROGRAM_NAME,
      description: PROGRAM_DESCRIPTION,
      learningPaths: [LearningPath.AFTER_SCHOOL, LearningPath.WEEKEND],
      isPublished: true,
    },
    update: {
      name: PROGRAM_NAME,
      description: PROGRAM_DESCRIPTION,
      learningPaths: [LearningPath.AFTER_SCHOOL, LearningPath.WEEKEND],
      isPublished: true,
    },
  });

  console.log(`✅ Upserted program: ${program.name}`);

  const requiredCourseSlugs = [...new Set(STAGES.flatMap(getStageCourseSlugs))];
  const courses = await prisma.course.findMany({
    where: { slug: { in: requiredCourseSlugs } },
    select: { id: true, slug: true, title: true },
  });

  const coursesBySlug = new Map(
    courses
      .filter((course): course is { id: string; slug: string; title: string } => Boolean(course.slug))
      .map(course => [course.slug, course])
  );

  const missingCourseSlugs = requiredCourseSlugs.filter(slug => !coursesBySlug.has(slug));
  if (missingCourseSlugs.length > 0) {
    throw new Error(
      `Maktab program seed requires existing courses for these slugs: ${missingCourseSlugs.join(', ')}`
    );
  }

  for (const stage of STAGES) {
    const connect = getStageCourseSlugs(stage).map(slug => ({
      id: coursesBySlug.get(slug)!.id,
    }));

    await prisma.programStage.upsert({
      where: {
        programId_stageNumber: {
          programId: program.id,
          stageNumber: stage.stageNumber,
        },
      },
      create: {
        programId: program.id,
        stageNumber: stage.stageNumber,
        name: stage.name,
        description: stage.description,
        ageMin: stage.ageMin,
        ageMax: stage.ageMax,
        orderIndex: stage.orderIndex,
        courses: { connect },
      },
      update: {
        name: stage.name,
        description: stage.description,
        ageMin: stage.ageMin,
        ageMax: stage.ageMax,
        orderIndex: stage.orderIndex,
        courses: {
          set: [],
          connect,
        },
      },
    });

    console.log(
      `   • Stage ${stage.stageNumber}: ${stage.name} → ${getStageCourseSlugs(stage).join(', ')}`
    );
  }

  console.log('✅ Maktab An Nasihah program seeded successfully');
  console.log('   Quran memorization courses are linked across stages 1–11 and Stage 12.');
  console.log('');
}

if (require.main === module) {
  seedMaktabProgram()
    .catch((e) => {
      console.error('❌ Maktab program seed failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
