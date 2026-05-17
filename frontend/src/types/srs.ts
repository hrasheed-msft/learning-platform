// Spaced Repetition System Types

export type ContentType = 'quran_verse' | 'quran_surah' | 'hadith' | 'dua' | 'term';
export type MemorizationStatus = 'learning' | 'young' | 'mature' | 'mastered';
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface MemorizationItem {
  id: string;
  studentId: string;
  contentType: ContentType;
  contentId: string;
  
  // Content details
  title: string;
  arabicText: string;
  translation: string;
  audioUrl?: string;
  narrator?: string; // for hadith
  source?: string; // book source
  
  // SRS Data
  currentInterval: number;
  easeFactor: number;
  repetitionCount: number;
  
  // Scheduling
  lastReviewedAt?: string;
  nextReviewAt: string;
  
  // Performance
  averageRating: number;
  lastRating?: number;
  
  // Metadata
  learnedAt: string;
  status: MemorizationStatus;
  notes?: string;
}

export interface ReviewDueResponse {
  dueToday: MemorizationItem[];
  overdue: MemorizationItem[];
  upcoming: {
    tomorrow: number;
    thisWeek: number;
    nextWeek: number;
  };
  stats: ReviewStats;
}

export interface ReviewStats {
  totalItems: number;
  mastered: number;
  mature: number;
  young: number;
  learning: number;
  reviewStreak: number;
  reviewsThisWeek: number;
}

export interface SubmitReviewRequest {
  rating: Rating;
  timeSpent: number; // seconds
}

export interface SubmitReviewResponse {
  success: boolean;
  nextReviewDate: string;
  intervalDays: number;
  message: string;
  newStatus: MemorizationStatus;
}

export interface ReviewSchedule {
  date: string;
  itemCount: number;
  items: MemorizationItem[];
}

export interface ReviewLog {
  id: string;
  memorizationItemId: string;
  reviewedAt: string;
  rating: Rating;
  intervalBefore: number;
  intervalAfter: number;
  timeSpent: number;
}

// Rating labels for UI
export const RATING_LABELS: Record<Rating, { label: string; emoji: string; description: string }> = {
  1: { label: 'Again', emoji: '😣', description: "I couldn't remember it at all" },
  2: { label: 'Hard', emoji: '😟', description: 'I struggled but eventually got it' },
  3: { label: 'Good', emoji: '😊', description: 'I remembered it with some effort' },
  4: { label: 'Easy', emoji: '😃', description: 'I remembered it easily' },
  5: { label: 'Perfect', emoji: '🌟', description: 'I know this by heart' },
};
