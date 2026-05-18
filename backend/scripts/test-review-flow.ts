/**
 * Diagnostic Script: Test Review Flow
 * 
 * This script tests the complete review submission flow to identify
 * why cards might be staying in NEW status after being rated.
 * 
 * Usage:
 *   npx ts-node scripts/test-review-flow.ts
 */

import prisma from '../src/config/database';
import * as progressService from '../src/services/flashcard/flashcard-progress.service';
import { FlashCardStatus } from '@prisma/client';

async function testReviewFlow() {
  console.log('🔍 Testing Review Flow...\n');

  try {
    // Step 1: Find a real flash card and member in the database
    console.log('Step 1: Finding flash card and member...');
    
    const flashCard = await prisma.flashCard.findFirst({
      include: {
        unit: true,
        course: true,
      },
    });

    if (!flashCard) {
      console.error('❌ No flash cards found in database. Please seed data first.');
      return;
    }

    console.log(`✅ Found flash card: ${flashCard.id} - "${flashCard.front}"`);

    // Find a family member
    const member = await prisma.familyMember.findFirst();

    if (!member) {
      console.error('❌ No family members found in database. Please seed data first.');
      return;
    }

    console.log(`✅ Found member: ${member.id} - ${member.name}\n`);

    // Step 2: Check current progress
    console.log('Step 2: Checking current progress...');
    
    const existingProgress = await prisma.flashCardProgress.findUnique({
      where: {
        memberId_flashCardId: {
          memberId: member.id,
          flashCardId: flashCard.id,
        },
      },
    });

    if (existingProgress) {
      console.log(`📊 Current progress:
        Status: ${existingProgress.status}
        Repetitions: ${existingProgress.repetitions}
        Total Reviews: ${existingProgress.totalReviews}
        Last Rating: ${existingProgress.lastRating}
        Ease Factor: ${existingProgress.easeFactor}
        Interval: ${existingProgress.interval}
      `);
    } else {
      console.log('📊 No existing progress (will be created on first review)');
    }

    // Step 3: Submit a review with perfect rating
    console.log('\nStep 3: Submitting review with rating 5 (perfect recall)...');
    
    const result = await progressService.submitReview({
      memberId: member.id,
      flashCardId: flashCard.id,
      rating: 5,
    });

    console.log(`✅ Review submitted successfully!`);
    console.log(`📊 Updated progress:
        Status: ${result.progress.status}
        Repetitions: ${result.progress.repetitions}
        Total Reviews: ${result.progress.totalReviews}
        Last Rating: ${result.progress.lastRating}
        Ease Factor: ${result.progress.easeFactor}
        Interval: ${result.progress.interval}
        Next Review: ${result.nextReviewDate.toISOString()}
      `);

    // Step 4: Verify in database
    console.log('\nStep 4: Verifying data in database...');
    
    const verifiedProgress = await prisma.flashCardProgress.findUnique({
      where: {
        memberId_flashCardId: {
          memberId: member.id,
          flashCardId: flashCard.id,
        },
      },
    });

    if (verifiedProgress) {
      console.log(`✅ Database verification:
        Status: ${verifiedProgress.status}
        Repetitions: ${verifiedProgress.repetitions}
        Total Reviews: ${verifiedProgress.totalReviews}
      `);

      // Check if status changed correctly
      if (verifiedProgress.status === FlashCardStatus.NEW) {
        console.error(`\n❌ BUG CONFIRMED: Status is still NEW after rating 5!`);
        console.error(`Expected: LEARNING`);
        console.error(`Actual: ${verifiedProgress.status}`);
      } else if (verifiedProgress.status === FlashCardStatus.LEARNING) {
        console.log(`\n✅ SUCCESS: Status correctly changed to LEARNING!`);
      } else {
        console.log(`\n⚠️  Status is ${verifiedProgress.status} (expected LEARNING for first review)`);
      }
    } else {
      console.error(`\n❌ Could not find progress in database after submission!`);
    }

    // Step 5: Check statistics
    console.log('\nStep 5: Checking statistics...');
    
    const stats = await progressService.getStatistics(member.id, flashCard.courseId, flashCard.unitId);
    
    console.log(`📊 Statistics for course ${flashCard.courseId}, unit ${flashCard.unitId}:
        Total Cards: ${stats.totalCards}
        New: ${stats.newCards}
        Learning: ${stats.learningCards}
        Reviewing: ${stats.reviewingCards}
        Mastered: ${stats.masteredCards}
      `);

    console.log('\n✅ Test complete!');

  } catch (error) {
    console.error('\n❌ Error during test:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testReviewFlow()
  .catch(console.error);
