export type LearningPath = 'AFTER_SCHOOL' | 'WEEKEND';

export interface Program {
  id: string;
  slug: string;
  name: string;
  description?: string;
  learningPaths: LearningPath[];
  isPublished: boolean;
  stages: ProgramStage[];
}

export interface ProgramStage {
  id: string;
  stageNumber: number;
  name: string;
  description?: string;
  ageMin: number;
  ageMax: number;
  orderIndex: number;
  courses: CourseSummary[];
}

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  progress?: number; // 0-100, from enrollment
}

export interface ProgramEnrollment {
  id: string;
  path: LearningPath;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  enrolledAt: string;
  program: Program;
  currentStage: ProgramStage;
  stageProgress: StageProgressSummary;
}

export interface StageProgressSummary {
  stageId: string;
  stageName: string;
  totalCourses: number;
  completedCourses: number;
  overallProgress: number; // 0-100
  subjectProgress: SubjectProgress[];
  /** Primary "what to do next" pointer across all subjects */
  nextUp?: NextUp | null;
  streak?: StreakData;
  weeklyActivity?: WeeklyActivityDay[];
}


export interface NextUnit {
  id: string;
  title: string;
  orderIndex: number;
  courseId: string;
  courseSlug: string;
  type?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivityAt: string | null;
}

export interface WeeklyActivityDay {
  /** 'YYYY-MM-DD' */
  date: string;
  unitsCompleted: number;
}

export interface NextUp {
  subjectSlug: string;
  courseId: string;
  unit: NextUnit;
}

export interface SubjectProgress {
  courseId: string;
  courseTitle: string;
  category: string;
  progress: number;
  totalUnits: number;
  completedUnits: number;
  /** First incomplete unit for this subject — null when all done */
  nextUnit?: NextUnit | null;
  lastActivityAt?: string | null;
  unitsCompletedLast7Days?: number;
}
