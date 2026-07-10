/**
 * Production Content Seed — Safe, Targeted, Idempotent
 *
 * This script runs ONLY the new content seeds against production.
 * It does NOT delete any existing data. All operations are upserts.
 *
 * Seeds included:
 *   1. Foundation 1 (course + units + flashcards + quizzes)
 *   2. Foundation 2 (course + units + flashcards + quizzes)
 *   3. Quran Longer Surahs (course + units, fetches from api.quran.com)
 *   4. Weekend Path Tags (marks after-school-only units)
 *   5. FlashCard Tags (backfills stageTag/subjectTag)
 *   6. Maktab Program (creates Program + 12 ProgramStages + links courses)
 *
 * Usage: DATABASE_URL="postgresql://..." npx ts-node prisma/seed-production.ts
 */

import { seedMaktabFoundation1 } from './seed-maktab-foundation1';
import { seedMaktabFoundation2 } from './seed-maktab-foundation2';
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

  // 2. Longer surahs (fetches from API — may take a minute)
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
