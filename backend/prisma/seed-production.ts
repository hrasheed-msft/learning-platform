/**
 * Production Content Seed — Safe, Targeted, Idempotent
 *
 * This script runs ONLY the new content seeds against production.
 * It does NOT delete any existing data. All operations are upserts.
 *
 * Seeds included:
 *   1. Foundation 1 (course + units + flashcards + quizzes)
 *   2. Foundation 2 (course + units + flashcards + quizzes)
 *   3. Quran Short Surahs / Juz Amma (course + units + vocab + flashcards, fetches from api.quran.com)
 *   4. Quran Longer Surahs (course + units + vocab + flashcards, fetches from api.quran.com)
 *   5. Weekend Path Tags (marks after-school-only units)
 *   6. FlashCard Tags (backfills stageTag/subjectTag)
 *   7. Maktab Program (creates Program + 12 ProgramStages + links courses)
 *
 * Usage: DATABASE_URL="postgresql://..." npx ts-node prisma/seed-production.ts
 */

import { seedMaktabFoundation1 } from './seed-maktab-foundation1';
import { seedMaktabFoundation2 } from './seed-maktab-foundation2';
import { seedQuranMemorizationCourse } from './seed-quran-memorization';
import { seedQuranLongerSurahs } from './seed-quran-longer-surahs';
import { seedWeekendPathTags } from './seed-weekend-path-tags';
import { seedFlashcardTags } from './seed-flashcard-tags';
import { seedMaktabProgram } from './seed-maktab-program';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Production Content Seed — Starting...');
  console.log('   ⚠️  This is ADDITIVE ONLY. No data will be deleted.');
  console.log('');

  // 1. Foundation stages (new courses)
  await seedMaktabFoundation1();
  await seedMaktabFoundation2();

  // 2. Short surahs / Juz Amma (fetches from API — may take a minute)
  await seedQuranMemorizationCourse();

  // 3. Longer surahs (fetches from API — may take a minute)
  await seedQuranLongerSurahs();

  // 3. Post-processing: path tags
  await seedWeekendPathTags();

  // 4. Post-processing: flashcard tags
  await seedFlashcardTags();

  // 5. Program structure (links everything together)
  await seedMaktabProgram();

  console.log('');
  console.log('🎉 Production content seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Production seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
