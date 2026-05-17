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

// Question without correct answer (for frontend)
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question?: string;
  questionText?: string;
  options?: string[];
  points?: number;
  difficulty?: QuestionDifficulty;
  correctAnswer?: string;
  explanation?: string;
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

export interface QuizResult {
  questionId: string;
  correct: boolean;
  correctAnswer: string | string[];
  userAnswer: string | string[];
  explanation: string;
  pointsEarned: number;
  pointsPossible: number;
}

export interface QuizSubmissionResponse {
  score: number;
  passed: boolean;
  results: QuizResult[];
  attemptNumber: number;
  bestScore: number;
  masteryThreshold: number;
}
