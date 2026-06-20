// Assessment Types

export type QuestionType = 'multiple-choice' | 'true-false' | 'fill-blank' | 'ordering' | 'matching';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  unitId: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: QuestionDifficulty;
}

// Shape returned by GET /assessments/units/:unitId/questions
// correctAnswer and explanation are intentionally omitted — the backend withholds
// them until after submission to prevent answer leakage.
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question?: string;
  questionText?: string;
  options?: string[];
  points?: number;
  difficulty?: QuestionDifficulty;
}

export interface QuizSubmission {
  enrollmentId?: string;
  memberId?: string;
  unitId: string;
  answers: QuizAnswer[];
  timeSpent?: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
}

// Per-answer result returned inside QuizSubmissionResponse.answers
export interface GradedAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  correctAnswer?: string | null;
  explanation?: string | null;
}

// Shape returned by POST /assessments/submit
export interface QuizSubmissionResponse {
  id: string;
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  pointsEarned: number;
  answers: GradedAnswer[];
}
