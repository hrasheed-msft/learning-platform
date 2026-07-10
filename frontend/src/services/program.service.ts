import api from './api';
import type {
  Program,
  ProgramEnrollment,
  StageProgressSummary,
  LearningPath,
} from '@/types/program';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const programService = {
  async getPrograms(): Promise<Program[]> {
    const response = await api.get<ApiResponse<Program[]>>('/programs');
    return response.data.data;
  },

  async getProgram(slug: string): Promise<Program> {
    const response = await api.get<ApiResponse<Program>>(`/programs/slug/${slug}`);
    return response.data.data;
  },

  async enrollInProgram(
    programId: string,
    familyMemberId: string,
    path: LearningPath,
    stageNumber?: number
  ): Promise<ProgramEnrollment> {
    const response = await api.post<ApiResponse<ProgramEnrollment>>(`/programs/${programId}/enroll`, {
      familyMemberId,
      path,
      stageNumber,
    });
    return response.data.data;
  },

  async getMemberEnrollments(memberId: string): Promise<ProgramEnrollment[]> {
    const response = await api.get<ApiResponse<ProgramEnrollment[]>>(
      `/programs/enrollment/${memberId}`
    );
    return response.data.data;
  },

  async getMemberStageSummary(memberId: string): Promise<StageProgressSummary | null> {
    const response = await api.get<ApiResponse<StageProgressSummary | null>>(
      `/programs/enrollment/${memberId}/stage-summary`
    );
    return response.data.data;
  },
};
