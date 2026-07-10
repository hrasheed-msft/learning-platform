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
}

export interface SubjectProgress {
  courseId: string;
  courseTitle: string;
  category: string;
  progress: number;
  totalUnits: number;
  completedUnits: number;
}
