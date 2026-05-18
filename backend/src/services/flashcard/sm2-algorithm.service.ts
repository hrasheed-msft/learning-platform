/**
 * SM-2 (SuperMemo 2) Spaced Repetition Algorithm
 * 
 * This service implements the SM-2 algorithm for calculating optimal review intervals
 * for flash cards based on user performance.
 * 
 * Rating Scale:
 * 1 - Complete blackout (total failure to recall)
 * 2 - Incorrect response; correct one remembered
 * 3 - Correct response recalled with serious difficulty
 * 4 - Correct response after a hesitation
 * 5 - Perfect response (immediate recall)
 * 
 * Algorithm:
 * - EF (Ease Factor) starts at 2.5
 * - EF is adjusted based on rating
 * - Interval grows based on EF and repetition count
 * - Cards move through status: NEW → LEARNING → REVIEWING → MASTERED
 */

import { FlashCardStatus } from '@prisma/client';

export interface SM2Input {
  easeFactor: number;      // Current ease factor (1.3 - 2.5+)
  interval: number;        // Current interval in days
  repetitions: number;     // Number of successful reviews
  rating: number;          // User rating (1-5)
  currentStatus: FlashCardStatus;
}

export interface SM2Result {
  easeFactor: number;      // New ease factor
  interval: number;        // New interval in days
  repetitions: number;     // Updated repetition count
  nextReviewDate: Date;    // When to review next
  status: FlashCardStatus; // New learning status
}

/**
 * Calculate the next review interval and ease factor using SM-2 algorithm
 */
export function calculateNextReview(input: SM2Input): SM2Result {
  const { easeFactor, interval, repetitions, rating, currentStatus } = input;

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Calculate new ease factor
  let newEaseFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  
  // Ease factor should not go below 1.3
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  let newInterval: number;
  let newRepetitions: number;
  let newStatus: FlashCardStatus;

  // Rating < 3 means failure - reset interval but keep some of the ease factor
  if (rating < 3) {
    newInterval = 0;
    newRepetitions = 0;
    newStatus = FlashCardStatus.LEARNING;
  } else {
    // Successful review
    newRepetitions = repetitions + 1;

    // Calculate new interval based on repetition count
    if (newRepetitions === 1) {
      newInterval = 1; // First successful review: 1 day
      newStatus = FlashCardStatus.LEARNING;
    } else if (newRepetitions === 2) {
      newInterval = 6; // Second successful review: 6 days
      newStatus = FlashCardStatus.REVIEWING;
    } else {
      // Subsequent reviews: previous interval * ease factor
      newInterval = Math.round(interval * newEaseFactor);
      
      // Determine status based on performance
      if (newRepetitions >= 5 && newEaseFactor >= 2.5 && rating === 5) {
        newStatus = FlashCardStatus.MASTERED;
      } else {
        newStatus = FlashCardStatus.REVIEWING;
      }
    }
  }

  // Calculate next review date
  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
    status: newStatus,
  };
}

/**
 * Get the difficulty description for a rating
 */
export function getRatingDescription(rating: number): string {
  const descriptions: Record<number, string> = {
    1: 'Complete blackout',
    2: 'Incorrect; correct answer remembered',
    3: 'Correct with serious difficulty',
    4: 'Correct after hesitation',
    5: 'Perfect recall',
  };
  return descriptions[rating] || 'Unknown';
}

/**
 * Get the recommended rating based on time taken to answer
 * This can be used as a helper for auto-rating based on response time
 */
export function suggestRatingFromTime(
  timeSeconds: number,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
): number {
  // Expected time thresholds (in seconds) by difficulty
  const thresholds = {
    EASY: { excellent: 3, good: 5, okay: 10 },
    MEDIUM: { excellent: 5, good: 10, okay: 20 },
    HARD: { excellent: 10, good: 20, okay: 40 },
  };

  const threshold = thresholds[difficulty];

  if (timeSeconds <= threshold.excellent) {
    return 5; // Perfect recall
  } else if (timeSeconds <= threshold.good) {
    return 4; // Good recall
  } else if (timeSeconds <= threshold.okay) {
    return 3; // Acceptable
  } else {
    return 2; // Too long, needs more practice
  }
}

/**
 * Predict future review dates for a card
 * Useful for showing users their upcoming review schedule
 */
export function predictFutureReviews(
  currentInterval: number,
  easeFactor: number,
  numberOfPredictions: number = 5
): Date[] {
  const predictions: Date[] = [];
  let interval = currentInterval;
  let currentDate = new Date();

  for (let i = 0; i < numberOfPredictions; i++) {
    // Calculate next interval
    if (i === 0) {
      interval = currentInterval;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // Calculate date
    currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
    predictions.push(new Date(currentDate));
  }

  return predictions;
}

/**
 * Calculate optimal daily review target based on retention goals
 * 
 * @param totalCards - Total number of cards in deck
 * @param targetRetention - Desired retention rate (0.8 = 80%)
 * @returns Recommended daily review count
 */
export function calculateDailyTarget(
  totalCards: number,
  targetRetention: number = 0.9
): number {
  // Rule of thumb: review ~10% of deck daily for 90% retention
  // Adjust based on target retention
  const baseRate = 0.1;
  const adjustedRate = baseRate * (targetRetention / 0.9);
  
  return Math.max(5, Math.ceil(totalCards * adjustedRate));
}

/**
 * Get the status transition message for user feedback
 */
export function getStatusTransitionMessage(
  oldStatus: FlashCardStatus,
  newStatus: FlashCardStatus
): string | null {
  if (oldStatus === newStatus) return null;

  const messages: Record<string, string> = {
    'NEW_LEARNING': '🎯 Great start! Keep practicing.',
    'LEARNING_REVIEWING': '📈 Nice progress! You\'re getting it.',
    'REVIEWING_MASTERED': '🎉 Mastered! This card is firmly in your memory.',
    'REVIEWING_LEARNING': '🔄 Let\'s reinforce this one.',
    'MASTERED_REVIEWING': '🔙 Time for a refresher.',
    'LEARNING_LEARNING': '💪 Keep going!',
  };

  const key = `${oldStatus}_${newStatus}`;
  return messages[key] || null;
}

/**
 * Validate SM-2 input parameters
 */
export function validateSM2Input(input: SM2Input): string[] {
  const errors: string[] = [];

  if (input.easeFactor < 1.3 || input.easeFactor > 3.0) {
    errors.push('Ease factor must be between 1.3 and 3.0');
  }

  if (input.interval < 0) {
    errors.push('Interval must be non-negative');
  }

  if (input.repetitions < 0) {
    errors.push('Repetitions must be non-negative');
  }

  if (input.rating < 1 || input.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  return errors;
}

export default {
  calculateNextReview,
  getRatingDescription,
  suggestRatingFromTime,
  predictFutureReviews,
  calculateDailyTarget,
  getStatusTransitionMessage,
  validateSM2Input,
};
