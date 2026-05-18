/**
 * Diagnostic Script: Trace Statistics Calculation
 * 
 * This script traces through the exact statistics calculation
 * to identify why cards might show as NEW in the statistics.
 * 
 * Usage:
 *   npx ts-node scripts/trace-statistics.ts <memberId> <courseId> <unitId>
 */

import prisma from '../src/config/database';
import { FlashCardStatus } from '@prisma/client';

async function traceStatistics(memberId?: string, courseId?: string, unitId?: string) {
  console.log('🔍 Tracing Statistics Calculation...\n');

  try {
    // If no parameters provided, use first available data
    if (!memberId) {
      const member = await prisma.familyMember.findFirst();
      if (!member) {
        console.error('❌ No family members found. Please provide memberId or seed data.');
        return;
      }
      memberId = member.id;
      console.log(`Using member: ${member.name} (${memberId})`);
    }

    if (!courseId) {
      const course = await prisma.course.findFirst();
      if (course) {
        courseId = course.id;
        console.log(`Using course: ${course.title} (${courseId})`);
      }
    }

    if (!unitId) {
      const unit = await prisma.unit.findFirst({
        where: courseId ? { courseId } : undefined,
      });
      if (unit) {
        unitId = unit.id;
        console.log(`Using unit: ${unit.title} (${unitId})`);
      }
    }

    console.log('\n--- Step 1: Total Cards in Unit ---');
    
    const flashCardWhere = {
      ...(courseId && { courseId }),
      ...(unitId && { unitId }),
    };

    const totalCards = await prisma.flashCard.count({
      where: flashCardWhere,
    });

    console.log(`Total cards in unit: ${totalCards}`);

    console.log('\n--- Step 2: Progress Records ---');
    
    const progressWhere = {
      memberId,
      ...(courseId || unitId ? {
        flashCard: flashCardWhere,
      } : {}),
    };

    const allProgress = await prisma.flashCardProgress.findMany({
      where: progressWhere,
      include: {
        flashCard: {
          select: {
            id: true,
            front: true,
          },
        },
      },
    });

    console.log(`Progress records found: ${allProgress.length}\n`);

    if (allProgress.length > 0) {
      console.log('Individual Records:');
      allProgress.forEach((progress, index) => {
        console.log(`  ${index + 1}. ${progress.status} - "${progress.flashCard.front.substring(0, 40)}..."`);
        console.log(`     Reviews: ${progress.totalReviews}, Last Rating: ${progress.lastRating}, Reps: ${progress.repetitions}`);
      });
    }

    console.log('\n--- Step 3: Group by Status ---');
    
    const progressByStatus = await prisma.flashCardProgress.groupBy({
      by: ['status'],
      where: progressWhere,
      _count: {
        status: true,
      },
    });

    let newCards = 0;
    let learningCards = 0;
    let reviewingCards = 0;
    let masteredCards = 0;

    console.log('Status counts from database:');
    progressByStatus.forEach((group) => {
      const count = group._count.status;
      console.log(`  ${group.status}: ${count}`);
      
      switch (group.status) {
        case FlashCardStatus.NEW:
          newCards = count;
          break;
        case FlashCardStatus.LEARNING:
          learningCards = count;
          break;
        case FlashCardStatus.REVIEWING:
          reviewingCards = count;
          break;
        case FlashCardStatus.MASTERED:
          masteredCards = count;
          break;
      }
    });

    console.log('\n--- Step 4: Not Started Cards ---');
    
    const progressCount = await prisma.flashCardProgress.count({
      where: progressWhere,
    });
    const notStartedCards = totalCards - progressCount;
    
    console.log(`Total cards: ${totalCards}`);
    console.log(`Cards with progress: ${progressCount}`);
    console.log(`Not started cards: ${notStartedCards}`);
    console.log(`These will be ADDED to NEW count`);

    newCards += notStartedCards;

    console.log('\n--- Step 5: Final Statistics ---');
    console.log(`NEW: ${newCards} (${progressByStatus.find(g => g.status === 'NEW')?._count.status || 0} with progress + ${notStartedCards} not started)`);
    console.log(`LEARNING: ${learningCards}`);
    console.log(`REVIEWING: ${reviewingCards}`);
    console.log(`MASTERED: ${masteredCards}`);
    console.log(`TOTAL: ${newCards + learningCards + reviewingCards + masteredCards}`);

    console.log('\n--- Step 6: Identify Issues ---');
    
    const reviewedButNew = allProgress.filter(p => p.status === 'NEW' && p.totalReviews > 0);
    
    if (reviewedButNew.length > 0) {
      console.error(`\n❌ BUG FOUND: ${reviewedButNew.length} cards are NEW but have been reviewed!`);
      reviewedButNew.forEach((progress, index) => {
        console.error(`  ${index + 1}. "${progress.flashCard.front.substring(0, 40)}..."`);
        console.error(`     Status: ${progress.status} (should be LEARNING or higher)`);
        console.error(`     Total Reviews: ${progress.totalReviews}`);
        console.error(`     Last Rating: ${progress.lastRating}`);
        console.error(`     Repetitions: ${progress.repetitions}`);
      });
      
      console.error(`\n💡 These ${reviewedButNew.length} cards are causing the NEW count to be inflated!`);
    } else {
      console.log('✅ All reviewed cards have appropriate status (not NEW)');
    }

    console.log('\n--- Step 7: Due Cards ---');
    
    const dueTodayCount = await prisma.flashCardProgress.count({
      where: {
        ...progressWhere,
        nextReviewDate: {
          lte: new Date(),
        },
      },
    });

    console.log(`Cards due for review: ${dueTodayCount}`);

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const memberId = args[0];
const courseId = args[1];
const unitId = args[2];

// Run the trace
traceStatistics(memberId, courseId, unitId)
  .catch(console.error);
