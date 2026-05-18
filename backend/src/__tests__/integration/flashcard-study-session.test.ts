/**
 * Integration Tests for Flashcard Study Session Flow
 * 
 * Tests the complete user journey of studying flashcards:
 * 1. Loading flashcards for a unit
 * 2. Rating cards during study session
 * 3. Verifying progress updates
 * 4. Checking statistics reflect changes
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, FlashCardStatus, FlashCardDifficulty } from '@prisma/client';
import * as progressService from '../../services/flashcard/flashcard-progress.service';
import * as flashCardService from '../../services/flashcard/flashcard.service';

const prisma = new PrismaClient();

describe('Flashcard Study Session Integration Tests', () => {
  let testMemberId: string;
  let testCourseId: string;
  let testUnitId: string;
  let flashCardIds: string[] = [];

  beforeAll(async () => {
    // Create test data
    const family = await prisma.family.create({
      data: {
        id: 'test-family-study',
        name: 'Test Study Family',
        subscriptionTier: 'premium',
      },
    });

    const member = await prisma.member.create({
      data: {
        id: 'test-member-study',
        familyId: family.id,
        email: 'study@test.com',
        firstName: 'Study',
        lastName: 'Test',
        role: 'parent',
        passwordHash: 'test',
      },
    });

    const course = await prisma.course.create({
      data: {
        id: 'test-course-study',
        title: 'Test Study Course',
        description: 'Course for study session testing',
        level: 'beginner',
        published: true,
      },
    });

    const unit = await prisma.unit.create({
      data: {
        id: 'test-unit-study',
        courseId: course.id,
        title: 'Test Study Unit',
        description: 'Unit for study session testing',
        orderIndex: 1,
      },
    });

    // Create 6 flashcards
    for (let i = 0; i < 6; i++) {
      const card = await prisma.flashCard.create({
        data: {
          courseId: course.id,
          unitId: unit.id,
          front: `Front ${i + 1}`,
          back: `Back ${i + 1}`,
          category: 'vocabulary',
          difficulty: FlashCardDifficulty.MEDIUM,
          orderIndex: i,
        },
      });
      flashCardIds.push(card.id);
    }

    testMemberId = member.id;
    testCourseId = course.id;
    testUnitId = unit.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.flashCardProgress.deleteMany({
      where: { memberId: testMemberId },
    });
    await prisma.flashCard.deleteMany({
      where: { courseId: testCourseId },
    });
    await prisma.unit.deleteMany({
      where: { courseId: testCourseId },
    });
    await prisma.course.deleteMany({
      where: { id: testCourseId },
    });
    await prisma.member.deleteMany({
      where: { id: testMemberId },
    });
    await prisma.family.deleteMany({
      where: { id: 'test-family-study' },
    });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Reset progress before each test
    await prisma.flashCardProgress.deleteMany({
      where: { memberId: testMemberId },
    });
  });

  describe('Complete Study Session with Perfect Recall', () => {
    it('should update card status from NEW to LEARNING after first perfect rating', async () => {
      const cardId = flashCardIds[0];

      // Get initial statistics
      const statsBefore = await progressService.getStatistics(
        testMemberId,
        testCourseId,
        testUnitId
      );
      
      expect(statsBefore.newCards).toBe(6); // All cards should be new
      expect(statsBefore.learningCards).toBe(0);

      // Rate card with 5 (perfect recall)
      const result = await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: cardId,
        rating: 5,
      });

      // Verify progress was updated
      expect(result.progress.status).toBe(FlashCardStatus.LEARNING);
      expect(result.progress.repetitions).toBe(1);
      expect(result.progress.lastRating).toBe(5);
      expect(result.progress.totalReviews).toBe(1);
      expect(result.progress.correctReviews).toBe(1);

      // Verify statistics reflect the change
      const statsAfter = await progressService.getStatistics(
        testMemberId,
        testCourseId,
        testUnitId
      );

      expect(statsAfter.newCards).toBe(5); // One less new card
      expect(statsAfter.learningCards).toBe(1); // One card in learning
    });

    it('should handle all 6 cards rated with perfect recall', async () => {
      // Rate all 6 cards with perfect recall (5)
      for (const cardId of flashCardIds) {
        await progressService.submitReview({
          memberId: testMemberId,
          flashCardId: cardId,
          rating: 5,
        });
      }

      // Check final statistics
      const stats = await progressService.getStatistics(
        testMemberId,
        testCourseId,
        testUnitId
      );

      expect(stats.newCards).toBe(0); // No new cards remaining
      expect(stats.learningCards).toBe(6); // All 6 in learning stage
      expect(stats.totalCards).toBe(6);
      
      // Verify each card individually
      for (const cardId of flashCardIds) {
        const progress = await progressService.getProgress(testMemberId, cardId);
        expect(progress).toBeDefined();
        expect(progress!.status).toBe(FlashCardStatus.LEARNING);
        expect(progress!.repetitions).toBe(1);
        expect(progress!.lastRating).toBe(5);
      }
    });

    it('should progress cards to REVIEWING after second successful review', async () => {
      const cardId = flashCardIds[0];

      // First review - goes to LEARNING
      await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: cardId,
        rating: 5,
      });

      // Second review - should go to REVIEWING
      const result2 = await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: cardId,
        rating: 5,
      });

      expect(result2.progress.status).toBe(FlashCardStatus.REVIEWING);
      expect(result2.progress.repetitions).toBe(2);
    });
  });

  describe('Mixed Ratings Study Session', () => {
    it('should handle varied performance (ratings 3-5)', async () => {
      const ratings = [5, 4, 5, 3, 4, 5];

      for (let i = 0; i < flashCardIds.length; i++) {
        await progressService.submitReview({
          memberId: testMemberId,
          flashCardId: flashCardIds[i],
          rating: ratings[i],
        });
      }

      const stats = await progressService.getStatistics(
        testMemberId,
        testCourseId,
        testUnitId
      );

      // All cards should have moved from NEW to LEARNING
      expect(stats.newCards).toBe(0);
      expect(stats.learningCards).toBe(6);
    });

    it('should handle failures (rating < 3) and keep cards in learning', async () => {
      const cardId = flashCardIds[0];

      // First success
      await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: cardId,
        rating: 5,
      });

      // Failure - should reset repetitions but keep in LEARNING
      const result = await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: cardId,
        rating: 2,
      });

      expect(result.progress.status).toBe(FlashCardStatus.LEARNING);
      expect(result.progress.repetitions).toBe(0); // Reset to 0
      expect(result.progress.totalReviews).toBe(2); // But total reviews increased
    });
  });

  describe('Due Cards and Next Review Dates', () => {
    it('should set correct next review dates based on intervals', async () => {
      const cardId = flashCardIds[0];

      // First review - interval should be 1 day
      const result1 = await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: cardId,
        rating: 5,
      });

      const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const reviewDate1 = new Date(result1.progress.nextReviewDate);
      
      // Check it's approximately 1 day from now (within 1 hour tolerance)
      const diffHours = Math.abs(reviewDate1.getTime() - oneDayFromNow.getTime()) / (1000 * 60 * 60);
      expect(diffHours).toBeLessThan(1);

      expect(result1.progress.interval).toBe(1);
    });

    it('should not include recently reviewed cards in due cards list', async () => {
      // Review all cards with perfect recall
      for (const cardId of flashCardIds) {
        await progressService.submitReview({
          memberId: testMemberId,
          flashCardId: cardId,
          rating: 5,
        });
      }

      // Get due cards (should be empty since all have future review dates)
      const dueCards = await progressService.getDueCards(testMemberId, {
        courseId: testCourseId,
        unitId: testUnitId,
      });

      expect(dueCards.dueCards).toHaveLength(0);
      expect(dueCards.total).toBe(0);
    });
  });

  describe('Statistics Accuracy', () => {
    it('should calculate correct mastery percentage', async () => {
      // Get 3 cards to MASTERED status (requires 5+ repetitions with rating 5)
      for (let i = 0; i < 3; i++) {
        const cardId = flashCardIds[i];
        
        // Do 5 successful reviews with perfect rating
        for (let rep = 0; rep < 5; rep++) {
          await progressService.submitReview({
            memberId: testMemberId,
            flashCardId: cardId,
            rating: 5,
          });
        }
      }

      const stats = await progressService.getStatistics(
        testMemberId,
        testCourseId,
        testUnitId
      );

      // 3 mastered out of 6 total = 50%
      expect(stats.masteredCards).toBe(3);
      expect(stats.masteryPercentage).toBe(50);
    });

    it('should count cards not yet started as NEW', async () => {
      // Review only 2 cards
      await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: flashCardIds[0],
        rating: 5,
      });
      await progressService.submitReview({
        memberId: testMemberId,
        flashCardId: flashCardIds[1],
        rating: 4,
      });

      const stats = await progressService.getStatistics(
        testMemberId,
        testCourseId,
        testUnitId
      );

      expect(stats.newCards).toBe(4); // 4 cards never reviewed
      expect(stats.learningCards).toBe(2); // 2 cards reviewed once
    });
  });
});
