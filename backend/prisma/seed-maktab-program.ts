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
// Qur'ān reading primer (Nūrāniyyah) shared by both foundation stages.
const NURANIYYAH_SLUG = 'nuraniyyah-qaidah';

/** First stage number (CB5, ages 10-11) where Longer Surahs is age-appropriate. */
const LONGER_SURAHS_MIN_STAGE = 7;

const STAGES: StageDefinition[] = [
  {
    stageNumber: 1,
    name: 'Foundation 1',
    description: 'Foundation stage for ages 4–5 using the Maktab Foundation 1 course and the Nūrāniyyah Qur\'ān reading course.',
    ageMin: 4,
    ageMax: 5,
    orderIndex: 0,
    courseSlugs: ['maktab-foundation-1', NURANIYYAH_SLUG],
  },
  {
    stageNumber: 2,
    name: 'Foundation 2',
    description: 'Foundation stage for ages 5–6 using the Maktab Foundation 2 course and the Nūrāniyyah Qur\'ān reading course.',
    ageMin: 5,
    ageMax: 6,
    orderIndex: 1,
    courseSlugs: ['maktab-foundation-2', NURANIYYAH_SLUG],
  },
  {
    stageNumber: 3,
    name: 'Stage 3',
    description: 'Maktab Stage 3 for ages 6–7. Covers the five pillars, taharah, ahadith on character, seerah of the Prophet SAW, stories of the prophets, seven articles of faith, and Islamic adab.',
    ageMin: 6,
    ageMax: 7,
    orderIndex: 2,
    courseSlugs: ['maktab-coursebook-1'],
  },
  {
    stageNumber: 4,
    name: 'Stage 4',
    description: 'Maktab Stage 4 for ages 7–8. Covers detailed wudu and salah rules, tayammum, ahadith on truth and social conduct, seerah of first revelation, stories of Hud and Salih, and Islamic etiquette.',
    ageMin: 7,
    ageMax: 8,
    orderIndex: 3,
    courseSlugs: ['maktab-coursebook-2'],
  },
  {
    stageNumber: 5,
    name: 'Stage 5',
    description: 'Maktab Stage 5 for ages 8–9. Covers taharah and najasah, ghusl, salah rules, ahadith on love and mercy, seerah of Hijrah and Isra Miraj, stories of Ibrahim and Ismail, and aqaid on prophethood and the Last Day.',
    ageMin: 8,
    ageMax: 9,
    orderIndex: 4,
    courseSlugs: ['maktab-coursebook-3'],
  },
  {
    stageNumber: 6,
    name: 'Stage 6',
    description: 'Maktab Stage 6 for ages 9–10. Covers masah, sajdah tilawah, sawm and tarawih, ahadith on charity and dhikr, seerah of Hijrah and Ghazwat, story of Yusuf AS, aqaid on signs of Qiyamah, and akhlaq on trust and neighbourliness.',
    ageMin: 9,
    ageMax: 10,
    orderIndex: 5,
    courseSlugs: ['maktab-coursebook-4'],
  },
  {
    stageNumber: 7,
    name: 'Stage 7',
    description: 'Maktab Stage 7 for ages 10–11. Covers advanced wudu, tayammum, salah and hajj, ahadith on character, seerah of Hudaybiyah and Fath Makkah, stories of Musa and Isa AS, aqaid on death and the Hereafter, and Islamic adab.',
    ageMin: 10,
    ageMax: 11,
    orderIndex: 6,
    courseSlugs: ['maktab-coursebook-5'],
  },
  {
    stageNumber: 8,
    name: 'Stage 8',
    description: 'Maktab Stage 8 for ages 11–12. Covers water categories and impurities, maturity and ghusl, imamah and janazah salah, major sins, shamail of the Prophet SAW, stories of Dawud and Sulayman, and aqaid of Ahlus Sunnah. Boys and girls variants available.',
    ageMin: 11,
    ageMax: 12,
    orderIndex: 7,
    courseSlugs: ['maktab-coursebook-6-boys', 'maktab-coursebook-6-girls'],
  },
  {
    stageNumber: 9,
    name: 'Stage 9',
    description: 'Maktab Stage 9 for ages 12–13. Covers advanced salah topics, zakah and inheritance, i\'tikaf, ahadith on time and rumours, seerah of Umar RA, stories of Zakariyya and Yahya AS, aqaid on qadar and the Barzakh, and Islamic social conduct.',
    ageMin: 12,
    ageMax: 13,
    orderIndex: 8,
    courseSlugs: ['maktab-coursebook-7'],
  },
  {
    stageNumber: 10,
    name: 'Stage 10',
    description: 'Maktab Stage 10 for ages 13–14. Covers nawafil salah, nikah and talaq, Islamic transactions, ahadith on worship and character, seerah of Uthman and Ali RA, stories of Ayyub AS and Islamic history, aqaid on divine attributes, and advanced akhlaq.',
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
