/**
 * Flash Card Type Definitions
 * 
 * These types match the Prisma schema and provide TypeScript interfaces
 * for flash card operations throughout the backend.
 */

export enum FlashCardStatus {
  NEW = 'NEW',
  LEARNING = 'LEARNING',
  REVIEWING = 'REVIEWING',
  MASTERED = 'MASTERED',
}

export enum FlashCardDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface FlashCard {
  id: string;
  unitId: string;
  courseId: string;
  front: string;
  back: string;
  frontArabic?: string | null;
  backArabic?: string | null;
  category: string;
  tags: string[];
  difficulty: FlashCardDifficulty;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashCardProgress {
  id: string;
  memberId: string;
  flashCardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  totalReviews: number;
  correctReviews: number;
  lastRating: number;
  status: FlashCardStatus;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs (Data Transfer Objects)
export interface CreateFlashCardDTO {
  unitId: string;
  courseId: string;
  front: string;
  back: string;
  frontArabic?: string;
  backArabic?: string;
  category: string;
  tags?: string[];
  difficulty?: FlashCardDifficulty;
  orderIndex?: number;
}

export interface UpdateFlashCardDTO {
  front?: string;
  back?: string;
  frontArabic?: string;
  backArabic?: string;
  category?: string;
  tags?: string[];
  difficulty?: FlashCardDifficulty;
  orderIndex?: number;
}

export interface FlashCardFilters {
  courseId?: string;
  unitId?: string;
  category?: string;
  difficulty?: FlashCardDifficulty;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SubmitReviewDTO {
  flashCardId: string;
  rating: number; // 1-5
}

export interface FlashCardStatistics {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewingCards: number;
  masteredCards: number;
  dueToday: number;
  masteryPercentage: number;
  averageEaseFactor?: number;
  reviewStreak?: number;
}

export interface DueCardsFilters {
  courseId?: string;
  unitId?: string;
  limit?: number;
}

// SM-2 Algorithm Types
export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  status: FlashCardStatus;
}

export interface SM2Input {
  easeFactor: number;
  interval: number;
  repetitions: number;
  rating: number; // 1-5
  currentStatus: FlashCardStatus;
}
