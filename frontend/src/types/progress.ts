// Progress Types

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED';
export type UnitStatus = 'not_started' | 'in_progress' | 'completed';
export type SkillLevel = 'novice' | 'developing' | 'proficient' | 'advanced' | 'mastery';

export interface CourseEnrollment {
  id: string;
  memberId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // percentage
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  course?: {
    id: string;
    title: string;
    description: string;
    category: string;
    ageLevels: string[];
    thumbnailUrl?: string | null;
    isPublished: boolean;
  };
  unitProgress?: UnitProgress[];
}

export interface UnitProgress {
  id: string;
  enrollmentId: string;
  unitId: string;
  createdAt?: string;
  updatedAt?: string;
  unit?: {
    id: string;
    orderIndex: number;
  };
  status?: UnitStatus;
  attempts?: number;
  bestScore?: number;
  currentScore?: number;
  timeSpentMinutes?: number;
  videoCompleted?: boolean;
  readingCompleted?: boolean;
  quizCompleted?: boolean;
  quizScore?: number;
  startedAt?: string;
  completedAt?: string | null;
}

export interface MemberProgress {
  memberId: string;
  memberName: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpentMinutes: number;
  skills: SkillProgress[];
  recentActivity: ActivityItem[];
  achievements: Achievement[];
}

export interface SkillProgress {
  skill: string;
  level: SkillLevel;
  percentage: number;
}

export interface ActivityItem {
  id: string;
  type: 'lesson_completed' | 'quiz_passed' | 'badge_earned' | 'course_completed' | 'review_completed';
  title: string;
  description: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt?: string;
  isEarned: boolean;
  progress?: number; // for in-progress achievements
  target?: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  isActiveToday: boolean;
}
