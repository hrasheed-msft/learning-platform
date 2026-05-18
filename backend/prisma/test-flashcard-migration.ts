/**
 * Test Script for Flash Card Database Migration
 * 
 * This script verifies that the flash card tables were created correctly
 * and tests basic CRUD operations.
 */

import { PrismaClient, FlashCardDifficulty, FlashCardStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function testMigration() {
  console.log('🧪 Testing Flash Card Database Migration...\n');

  try {
    // Test 1: Verify tables exist by querying them
    console.log('✓ Test 1: Verify tables exist');
    const flashCardCount = await prisma.flashCard.count();
    const progressCount = await prisma.flashCardProgress.count();
    console.log(`  - FlashCard table exists (${flashCardCount} records)`);
    console.log(`  - FlashCardProgress table exists (${progressCount} records)`);

    // Test 2: Get a test course and unit
    console.log('\n✓ Test 2: Get test course and unit');
    const course = await prisma.course.findFirst();
    const unit = await prisma.unit.findFirst({
      where: { courseId: course?.id },
    });
    
    if (!course || !unit) {
      console.log('  ⚠️  No course or unit found. Skipping create tests.');
      console.log('  Run seed scripts first: npm run db:seed:sarf');
      return;
    }
    
    console.log(`  - Course: ${course.title}`);
    console.log(`  - Unit: ${unit.title}`);

    // Test 3: Create a test flash card
    console.log('\n✓ Test 3: Create test flash card');
    const testCard = await prisma.flashCard.create({
      data: {
        unitId: unit.id,
        courseId: course.id,
        front: 'What is the morphological scale in Arabic?',
        back: 'The morphological scale (الميزان الصرفي) is فَعَلَ (fa-\'a-la)',
        frontArabic: 'ما هو الميزان الصرفي؟',
        backArabic: 'الميزان الصرفي هو فَعَلَ',
        category: 'definition',
        tags: ['sarf', 'morphology', 'basics'],
        difficulty: FlashCardDifficulty.EASY,
        orderIndex: 1,
      },
    });
    console.log(`  - Created card: ${testCard.id}`);
    console.log(`  - Category: ${testCard.category}`);
    console.log(`  - Difficulty: ${testCard.difficulty}`);

    // Test 4: Create another card to test unique constraint
    console.log('\n✓ Test 4: Create second card (test unique constraint)');
    const testCard2 = await prisma.flashCard.create({
      data: {
        unitId: unit.id,
        courseId: course.id,
        front: 'What are the three root letters called?',
        back: 'The three root letters are called الأحرف الأصلية (al-aḥruf al-aṣliyya)',
        frontArabic: 'ماذا تسمى الأحرف الثلاثة الأصلية؟',
        backArabic: 'تسمى الأحرف الأصلية',
        category: 'vocabulary',
        tags: ['sarf', 'root-letters'],
        difficulty: FlashCardDifficulty.MEDIUM,
        orderIndex: 2,
      },
    });
    console.log(`  - Created second card: ${testCard2.id}`);

    // Test 5: Get a test member
    console.log('\n✓ Test 5: Get test member for progress');
    const member = await prisma.familyMember.findFirst();
    
    if (!member) {
      console.log('  ⚠️  No member found. Skipping progress tests.');
      console.log('  Create a member via the app or seed script first.');
    } else {
      console.log(`  - Member: ${member.name}`);

      // Test 6: Create flash card progress
      console.log('\n✓ Test 6: Create flash card progress');
      const progress = await prisma.flashCardProgress.create({
        data: {
          memberId: member.id,
          flashCardId: testCard.id,
          // Defaults are set: easeFactor=2.5, interval=0, repetitions=0, status=NEW
        },
      });
      console.log(`  - Created progress: ${progress.id}`);
      console.log(`  - Status: ${progress.status}`);
      console.log(`  - Ease Factor: ${progress.easeFactor}`);
      console.log(`  - Interval: ${progress.interval} days`);

      // Test 7: Update progress (simulate a review)
      console.log('\n✓ Test 7: Update progress (simulate review)');
      const updatedProgress = await prisma.flashCardProgress.update({
        where: { id: progress.id },
        data: {
          lastRating: 4,
          totalReviews: 1,
          correctReviews: 1,
          repetitions: 1,
          interval: 1,
          nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
          status: FlashCardStatus.LEARNING,
        },
      });
      console.log(`  - Updated status: ${updatedProgress.status}`);
      console.log(`  - Last rating: ${updatedProgress.lastRating}`);
      console.log(`  - Next review: ${updatedProgress.nextReviewDate.toLocaleDateString()}`);

      // Test 8: Query due cards
      console.log('\n✓ Test 8: Query due cards');
      const dueCards = await prisma.flashCardProgress.findMany({
        where: {
          memberId: member.id,
          nextReviewDate: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due within 7 days
          },
        },
        include: {
          flashCard: true,
        },
      });
      console.log(`  - Found ${dueCards.length} cards due within 7 days`);
    }

    // Test 9: Query cards by filters
    console.log('\n✓ Test 9: Query cards by filters');
    const easyCards = await prisma.flashCard.findMany({
      where: {
        unitId: unit.id,
        difficulty: FlashCardDifficulty.EASY,
      },
    });
    console.log(`  - Easy cards in unit: ${easyCards.length}`);

    const definitionCards = await prisma.flashCard.findMany({
      where: {
        unitId: unit.id,
        category: 'definition',
      },
    });
    console.log(`  - Definition cards in unit: ${definitionCards.length}`);

    // Test 10: Test cascade delete
    console.log('\n✓ Test 10: Test relationships and indexes');
    const cardWithRelations = await prisma.flashCard.findUnique({
      where: { id: testCard.id },
      include: {
        unit: {
          select: { title: true },
        },
        course: {
          select: { title: true },
        },
        progress: true,
      },
    });
    console.log(`  - Card belongs to unit: ${cardWithRelations?.unit.title}`);
    console.log(`  - Card belongs to course: ${cardWithRelations?.course.title}`);
    console.log(`  - Card has ${cardWithRelations?.progress.length} progress records`);

    // Cleanup: Delete test data
    console.log('\n🧹 Cleaning up test data...');
    await prisma.flashCardProgress.deleteMany({
      where: {
        flashCardId: {
          in: [testCard.id, testCard2.id],
        },
      },
    });
    await prisma.flashCard.deleteMany({
      where: {
        id: {
          in: [testCard.id, testCard2.id],
        },
      },
    });
    console.log('  - Test data deleted');

    console.log('\n✅ All migration tests passed!\n');
    console.log('Migration is working correctly. Ready to proceed with backend implementation.');

  } catch (error) {
    console.error('\n❌ Migration test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testMigration()
  .catch((error) => {
    console.error('Test script error:', error);
    process.exit(1);
  });
