/**
 * Diagnostic Script: Check Current Progress Status
 * 
 * This script checks the current status of all flash card progress records
 * to see if there are any cards stuck in NEW status despite being reviewed.
 * 
 * Usage:
 *   npx ts-node scripts/check-progress-status.ts
 */

import prisma from '../src/config/database';

async function checkProgressStatus() {
  console.log('🔍 Checking Flash Card Progress Status...\n');

  try {
    // Get all progress records
    const allProgress = await prisma.flashCardProgress.findMany({
      include: {
        flashCard: {
          select: {
            id: true,
            front: true,
            unitId: true,
            courseId: true,
          },
        },
        member: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log(`📊 Total progress records: ${allProgress.length}\n`);

    if (allProgress.length === 0) {
      console.log('ℹ️  No progress records found. This is normal if no reviews have been submitted yet.');
      return;
    }

    // Group by status
    const statusCounts = {
      NEW: 0,
      LEARNING: 0,
      REVIEWING: 0,
      MASTERED: 0,
    };

    // Find suspicious records (NEW status but has reviews)
    const suspiciousRecords = [];

    for (const progress of allProgress) {
      statusCounts[progress.status]++;

      // Check for bug: NEW status but has been reviewed
      if (progress.status === 'NEW' && progress.totalReviews > 0) {
        suspiciousRecords.push(progress);
      }
    }

    console.log('📊 Progress by Status:');
    console.log(`   NEW: ${statusCounts.NEW}`);
    console.log(`   LEARNING: ${statusCounts.LEARNING}`);
    console.log(`   REVIEWING: ${statusCounts.REVIEWING}`);
    console.log(`   MASTERED: ${statusCounts.MASTERED}\n`);

    // Show suspicious records
    if (suspiciousRecords.length > 0) {
      console.error(`❌ BUG DETECTED: ${suspiciousRecords.length} cards are in NEW status despite being reviewed!\n`);
      
      suspiciousRecords.forEach((record, index) => {
        console.error(`Record ${index + 1}:`);
        console.error(`  Member: ${record.member.name} (${record.memberId})`);
        console.error(`  Card: "${record.flashCard.front.substring(0, 50)}..." (${record.flashCardId})`);
        console.error(`  Status: ${record.status} ❌ Should NOT be NEW`);
        console.error(`  Total Reviews: ${record.totalReviews}`);
        console.error(`  Correct Reviews: ${record.correctReviews}`);
        console.error(`  Last Rating: ${record.lastRating}`);
        console.error(`  Repetitions: ${record.repetitions}`);
        console.error(`  Updated: ${record.updatedAt.toISOString()}`);
        console.error('');
      });
    } else {
      console.log('✅ No suspicious records found. All reviewed cards have appropriate status.');
    }

    // Show recent reviews
    console.log('\n📋 Most Recent Reviews (last 10):');
    allProgress.slice(0, 10).forEach((progress, index) => {
      const statusEmoji = {
        NEW: '🆕',
        LEARNING: '📚',
        REVIEWING: '🔄',
        MASTERED: '🎓',
      };

      console.log(`${index + 1}. ${statusEmoji[progress.status]} ${progress.member.name} - "${progress.flashCard.front.substring(0, 40)}..."`);
      console.log(`   Status: ${progress.status} | Reviews: ${progress.totalReviews} | Rating: ${progress.lastRating || 'N/A'} | Reps: ${progress.repetitions}`);
    });

    // Show statistics by member
    console.log('\n📊 Progress by Member:');
    const memberStats = new Map<string, { name: string; counts: typeof statusCounts }>();

    for (const progress of allProgress) {
      if (!memberStats.has(progress.memberId)) {
        memberStats.set(progress.memberId, {
          name: progress.member.name,
          counts: { NEW: 0, LEARNING: 0, REVIEWING: 0, MASTERED: 0 },
        });
      }
      const stats = memberStats.get(progress.memberId)!;
      stats.counts[progress.status]++;
    }

    memberStats.forEach((stats, memberId) => {
      console.log(`\n   ${stats.name}:`);
      console.log(`      NEW: ${stats.counts.NEW}`);
      console.log(`      LEARNING: ${stats.counts.LEARNING}`);
      console.log(`      REVIEWING: ${stats.counts.REVIEWING}`);
      console.log(`      MASTERED: ${stats.counts.MASTERED}`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkProgressStatus()
  .catch(console.error);
