// Dashboard & Notification Types

import type { AgeCategory } from './user';

export interface ChildSummary {
  memberId: string;
  name: string;
  age: number;
  ageCategory: AgeCategory;
  avatarUrl?: string;
  coursesEnrolled: number;
  avgQuizScore: number;
  currentStreak: number;
  lastActiveAt: string | null;
}

export interface ChildDetailStats {
  memberId: string;
  name: string;
  ageCategory: AgeCategory;
  coursesEnrolled: number;
  coursesCompleted: number;
  avgQuizScore: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTimeMinutes: number;
  flashcardsReviewed: number;
  flashcardsMastered: number;
  courseProgress: CourseProgressItem[];
  quizScoreTrend: QuizScorePoint[];
}

export interface CourseProgressItem {
  courseId: string;
  courseTitle: string;
  progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

export interface QuizScorePoint {
  date: string;
  score: number;
  quizTitle: string;
}

export interface ActivityEvent {
  id: string;
  type: 'lesson_completed' | 'quiz_passed' | 'quiz_failed' | 'badge_earned' | 'course_completed' | 'review_completed' | 'flashcard_review' | 'streak_milestone';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface FamilySummary {
  totalStudyTimeMinutesThisWeek: number;
  activeCoursesCount: number;
  totalChildren: number;
  averageFamilyStreak: number;
}

export interface Notification {
  id: string;
  type: 'milestone' | 'alert' | 'achievement' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  memberId?: string;
  memberName?: string;
}

export interface ActivityFeedResponse {
  activities: ActivityEvent[];
  total: number;
  page: number;
  pageSize: number;
}
