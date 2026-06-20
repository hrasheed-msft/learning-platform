import api from './api';
import type {
  QuizQuestion,
  QuizSubmission,
  QuizSubmissionResponse,
  MemberProgress,
  CooldownStatus,
} from '@/types';

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const assessmentService = {
  // Get questions for a unit
  async getQuizQuestions(unitId: string): Promise<QuizQuestion[]> {
    const response = await api.get<ApiResponse<QuizQuestion[]>>(
      `/assessments/units/${unitId}/questions`
    );
    return response.data.data;
  },

  // Submit quiz answers
  async submitQuiz(submission: QuizSubmission): Promise<QuizSubmissionResponse> {
    const response = await api.post<ApiResponse<QuizSubmissionResponse>>(
      '/assessments/submit',
      submission
    );
    return response.data.data;
  },

  // Check cooldown status before a retry
  async getCooldownStatus(unitId: string): Promise<CooldownStatus> {
    const response = await api.get<ApiResponse<CooldownStatus>>(
      `/assessments/units/${unitId}/cooldown-status`
    );
    return response.data.data;
  },

  // Get quiz results for a member
  async getMemberResults(memberId: string): Promise<unknown[]> {
    const response = await api.get<ApiResponse<unknown[]>>(
      `/assessments/results/member/${memberId}`
    );
    return response.data.data;
  },

  // Get a single quiz result
  async getQuizResult(resultId: string): Promise<unknown> {
    const response = await api.get<ApiResponse<unknown>>(
      `/assessments/results/${resultId}`
    );
    return response.data.data;
  },

  // Legacy methods mapped to course progress
  async getMemberProgress(memberId: string): Promise<MemberProgress> {
    const response = await api.get<ApiResponse<MemberProgress>>(
      `/courses/progress/member/${memberId}`
    );
    return response.data.data;
  },
};
