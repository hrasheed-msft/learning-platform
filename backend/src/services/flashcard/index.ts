/**
 * Flash Card Services Index
 * 
 * Central export point for all flash card services
 */

export * as flashCardService from './flashcard.service';
export * as flashCardProgressService from './flashcard-progress.service';
export * as sm2AlgorithmService from './sm2-algorithm.service';

// Re-export types for convenience
export type {
  CreateFlashCardData,
  UpdateFlashCardData,
  FlashCardFilters,
} from './flashcard.service';

export type {
  SubmitReviewData,
  DueCardsFilters,
  FlashCardStatistics,
} from './flashcard-progress.service';

export type {
  SM2Input,
  SM2Result,
} from './sm2-algorithm.service';
