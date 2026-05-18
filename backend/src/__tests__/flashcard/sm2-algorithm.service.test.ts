/**
 * SM-2 Algorithm Service Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { FlashCardStatus } from '@prisma/client';
import {
  calculateNextReview,
  getRatingDescription,
  suggestRatingFromTime,
  predictFutureReviews,
  calculateDailyTarget,
  getStatusTransitionMessage,
  validateSM2Input,
} from '../../services/flashcard/sm2-algorithm.service';

describe('SM-2 Algorithm Service', () => {
  describe('calculateNextReview', () => {
    it('should handle first successful review (rating 4)', () => {
      const result = calculateNextReview({
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        rating: 4,
        currentStatus: FlashCardStatus.NEW,
      });

      expect(result.interval).toBe(1); // First review = 1 day
      expect(result.repetitions).toBe(1);
      expect(result.status).toBe(FlashCardStatus.LEARNING);
      expect(result.easeFactor).toBeGreaterThan(2.4); // Should increase slightly
    });

    it('should handle second successful review (rating 5)', () => {
      const result = calculateNextReview({
        easeFactor: 2.6,
        interval: 1,
        repetitions: 1,
        rating: 5,
        currentStatus: FlashCardStatus.LEARNING,
      });

      expect(result.interval).toBe(6); // Second review = 6 days
      expect(result.repetitions).toBe(2);
      expect(result.status).toBe(FlashCardStatus.REVIEWING);
      expect(result.easeFactor).toBeGreaterThan(2.6); // Perfect rating increases EF
    });

    it('should calculate interval using ease factor after 2nd review', () => {
      const result = calculateNextReview({
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        rating: 4,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(result.interval).toBeGreaterThan(6); // Should grow
      expect(result.interval).toBeLessThanOrEqual(Math.round(6 * 2.6)); // Based on EF
      expect(result.repetitions).toBe(3);
      expect(result.status).toBe(FlashCardStatus.REVIEWING);
    });

    it('should reset progress on failure (rating < 3)', () => {
      const result = calculateNextReview({
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
        rating: 2,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(result.interval).toBe(0);
      expect(result.repetitions).toBe(0);
      expect(result.status).toBe(FlashCardStatus.LEARNING);
      expect(result.easeFactor).toBeLessThan(2.5); // Failed review decreases EF
    });

    it('should not allow ease factor below 1.3', () => {
      const result = calculateNextReview({
        easeFactor: 1.3,
        interval: 5,
        repetitions: 2,
        rating: 1, // Complete failure
        currentStatus: FlashCardStatus.LEARNING,
      });

      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should mark card as mastered after 5 perfect reviews', () => {
      const result = calculateNextReview({
        easeFactor: 2.6,
        interval: 30,
        repetitions: 4,
        rating: 5,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(result.repetitions).toBe(5);
      expect(result.status).toBe(FlashCardStatus.MASTERED);
    });

    it('should not mark as mastered if ease factor too low', () => {
      const result = calculateNextReview({
        easeFactor: 2.3,
        interval: 30,
        repetitions: 4,
        rating: 5,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(result.status).toBe(FlashCardStatus.REVIEWING);
      expect(result.status).not.toBe(FlashCardStatus.MASTERED);
    });

    it('should throw error for invalid rating', () => {
      expect(() =>
        calculateNextReview({
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          rating: 6, // Invalid
          currentStatus: FlashCardStatus.NEW,
        })
      ).toThrow('Rating must be between 1 and 5');
    });

    it('should set next review date correctly', () => {
      const now = new Date();
      const result = calculateNextReview({
        easeFactor: 2.5,
        interval: 5,
        repetitions: 2,
        rating: 4,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      const daysDiff = Math.floor(
        (result.nextReviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysDiff).toBeGreaterThanOrEqual(result.interval - 1);
      expect(daysDiff).toBeLessThanOrEqual(result.interval + 1);
    });
  });

  describe('getRatingDescription', () => {
    it('should return correct descriptions for all ratings', () => {
      expect(getRatingDescription(1)).toBe('Complete blackout');
      expect(getRatingDescription(2)).toBe('Incorrect; correct answer remembered');
      expect(getRatingDescription(3)).toBe('Correct with serious difficulty');
      expect(getRatingDescription(4)).toBe('Correct after hesitation');
      expect(getRatingDescription(5)).toBe('Perfect recall');
    });

    it('should return Unknown for invalid rating', () => {
      expect(getRatingDescription(0)).toBe('Unknown');
      expect(getRatingDescription(6)).toBe('Unknown');
    });
  });

  describe('suggestRatingFromTime', () => {
    it('should suggest rating 5 for excellent time (EASY)', () => {
      expect(suggestRatingFromTime(2, 'EASY')).toBe(5);
    });

    it('should suggest rating 4 for good time (MEDIUM)', () => {
      expect(suggestRatingFromTime(7, 'MEDIUM')).toBe(4);
    });

    it('should suggest rating 3 for okay time (HARD)', () => {
      expect(suggestRatingFromTime(30, 'HARD')).toBe(3);
    });

    it('should suggest rating 2 for slow time', () => {
      expect(suggestRatingFromTime(50, 'EASY')).toBe(2);
    });
  });

  describe('predictFutureReviews', () => {
    it('should predict 5 future review dates', () => {
      const predictions = predictFutureReviews(1, 2.5, 5);

      expect(predictions).toHaveLength(5);
      expect(predictions[0]).toBeInstanceOf(Date);
    });

    it('should have increasing intervals', () => {
      const predictions = predictFutureReviews(1, 2.5, 3);

      const interval1 = predictions[0].getTime();
      const interval2 = predictions[1].getTime();
      const interval3 = predictions[2].getTime();

      expect(interval2).toBeGreaterThan(interval1);
      expect(interval3).toBeGreaterThan(interval2);
    });
  });

  describe('calculateDailyTarget', () => {
    it('should calculate reasonable daily target', () => {
      const target = calculateDailyTarget(100, 0.9);
      expect(target).toBeGreaterThan(5);
      expect(target).toBeLessThan(100);
    });

    it('should increase target for higher retention', () => {
      const target90 = calculateDailyTarget(100, 0.9);
      const target95 = calculateDailyTarget(100, 0.95);
      expect(target95).toBeGreaterThan(target90);
    });

    it('should have minimum of 5 cards', () => {
      const target = calculateDailyTarget(10, 0.9);
      expect(target).toBeGreaterThanOrEqual(5);
    });
  });

  describe('getStatusTransitionMessage', () => {
    it('should return message for NEW to LEARNING', () => {
      const msg = getStatusTransitionMessage(
        FlashCardStatus.NEW,
        FlashCardStatus.LEARNING
      );
      expect(msg).toBeTruthy();
      expect(msg).toContain('start');
    });

    it('should return message for REVIEWING to MASTERED', () => {
      const msg = getStatusTransitionMessage(
        FlashCardStatus.REVIEWING,
        FlashCardStatus.MASTERED
      );
      expect(msg).toBeTruthy();
      expect(msg).toContain('Mastered');
    });

    it('should return null for no status change', () => {
      const msg = getStatusTransitionMessage(
        FlashCardStatus.LEARNING,
        FlashCardStatus.LEARNING
      );
      expect(msg).toBeNull();
    });
  });

  describe('validateSM2Input', () => {
    it('should return no errors for valid input', () => {
      const errors = validateSM2Input({
        easeFactor: 2.5,
        interval: 5,
        repetitions: 2,
        rating: 4,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(errors).toHaveLength(0);
    });

    it('should detect invalid ease factor', () => {
      const errors = validateSM2Input({
        easeFactor: 1.0, // Too low
        interval: 5,
        repetitions: 2,
        rating: 4,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Ease factor');
    });

    it('should detect negative interval', () => {
      const errors = validateSM2Input({
        easeFactor: 2.5,
        interval: -1,
        repetitions: 2,
        rating: 4,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.includes('Interval'))).toBe(true);
    });

    it('should detect invalid rating', () => {
      const errors = validateSM2Input({
        easeFactor: 2.5,
        interval: 5,
        repetitions: 2,
        rating: 10,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.includes('Rating'))).toBe(true);
    });

    it('should detect multiple errors', () => {
      const errors = validateSM2Input({
        easeFactor: 0.5,
        interval: -5,
        repetitions: -1,
        rating: 10,
        currentStatus: FlashCardStatus.REVIEWING,
      });

      expect(errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rating 3 (borderline) correctly', () => {
      const result = calculateNextReview({
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        rating: 3, // Minimum passing
        currentStatus: FlashCardStatus.NEW,
      });

      expect(result.interval).toBeGreaterThan(0); // Should progress
      expect(result.repetitions).toBe(1);
    });

    it('should handle very high ease factor', () => {
      const result = calculateNextReview({
        easeFactor: 2.9,
        interval: 10,
        repetitions: 5,
        rating: 5,
        currentStatus: FlashCardStatus.MASTERED,
      });

      expect(result.easeFactor).toBeGreaterThan(2.9);
      expect(result.interval).toBeGreaterThan(10);
    });

    it('should handle zero interval correctly', () => {
      const result = calculateNextReview({
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        rating: 5,
        currentStatus: FlashCardStatus.NEW,
      });

      expect(result.interval).toBe(1);
      expect(result.nextReviewDate).toBeInstanceOf(Date);
    });
  });
});
