/**
 * Flash Card Type Definitions - Frontend
 * 
 * These types match the backend API responses and provide TypeScript interfaces
 * for flash card operations in the frontend.
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
  createdAt: string;
  updatedAt: string;
  // Related data from API
  unit?: { id: string; title: string };
  course?: { id: string; title: string };
  notes?: string;
}

// Helper to get title from related data
export const getUnitTitle = (card: FlashCard): string => 
  card.unit?.title || 'Unknown Unit';

export const getCourseTitle = (card: FlashCard): string => 
  card.course?.title || 'Unknown Course';

export interface FlashCardProgress {
  id: string;
  memberId: string;
  flashCardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  nextReview?: string; // Alias for nextReviewDate
  totalReviews: number;
  correctReviews: number;
  lastRating: number;
  status: FlashCardStatus;
  createdAt: string;
  updatedAt: string;
}

// Combined type for flash cards with progress
export interface FlashCardWithProgress extends FlashCard {
  progress?: FlashCardProgress;
}

// Create/Update DTOs
export interface CreateFlashCardInput {
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

export interface UpdateFlashCardInput {
  front?: string;
  back?: string;
  frontArabic?: string;
  backArabic?: string;
  category?: string;
  tags?: string[];
  difficulty?: FlashCardDifficulty;
  orderIndex?: number;
}

// Query parameters
export interface FlashCardFilters {
  courseId?: string;
  unitId?: string;
  category?: string;
  difficulty?: FlashCardDifficulty;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface DueCardsFilters {
  courseId?: string;
  unitId?: string;
  limit?: number;
}

// Statistics
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

// Study session types
export interface StudySession {
  unitId?: string;
  courseId?: string;
  selectedMemberId?: string; // The family member conducting this study session
  mode: 'study' | 'review';
  cards: FlashCardWithProgress[];
  currentIndex: number;
  startTime: Date;
  completed: number;
  ratings: Map<string, number>;
}

// Rating submission
export interface SubmitReviewInput {
  flashCardId: string;
  rating: number; // 1-5
}

export interface ReviewResult {
  nextReviewDate: string;
  interval: number;
  status: FlashCardStatus;
  message?: string;
}

// UI State types
export interface FlashCardState {
  isFlipped: boolean;
  showAnswer: boolean;
}

export interface SessionStatistics {
  totalCards: number;
  cardsStudied: number;
  correctRatings: number; // Ratings 4-5
  averageRating: number;
  sessionDuration: number; // seconds
  cardsRemaining: number;
}
