import { create } from 'zustand';
import type { Program, ProgramEnrollment, StageProgressSummary, LearningPath } from '@/types/program';
import { programService } from '@/services/program.service';

interface ProgramState {
  programs: Program[];
  selectedProgram: Program | null;
  enrollments: ProgramEnrollment[];
  stageSummary: StageProgressSummary | null;
  isLoading: boolean;
  isEnrolling: boolean;
  error: string | null;

  fetchPrograms: () => Promise<void>;
  fetchProgram: (slug: string) => Promise<void>;
  enrollInProgram: (programId: string, memberId: string, path: LearningPath, stageNumber?: number) => Promise<void>;
  fetchMemberEnrollments: (memberId: string) => Promise<void>;
  fetchMemberStageSummary: (memberId: string) => Promise<void>;
  clearError: () => void;
}

export const useProgramStore = create<ProgramState>((set) => ({
  programs: [],
  selectedProgram: null,
  enrollments: [],
  stageSummary: null,
  isLoading: false,
  isEnrolling: false,
  error: null,

  fetchPrograms: async () => {
    set({ isLoading: true, error: null });
    try {
      const programs = await programService.getPrograms();
      set({ programs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch programs',
        isLoading: false,
      });
    }
  },

  fetchProgram: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const program = await programService.getProgram(slug);
      set({ selectedProgram: program, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch program',
        isLoading: false,
      });
    }
  },

  enrollInProgram: async (programId, memberId, path, stageNumber) => {
    set({ isEnrolling: true, error: null });
    try {
      const enrollment = await programService.enrollInProgram(programId, memberId, path, stageNumber);
      set((state) => ({
        enrollments: [...state.enrollments.filter((e) => e.id !== enrollment.id), enrollment],
        isEnrolling: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to enroll in program',
        isEnrolling: false,
      });
      throw error;
    }
  },

  fetchMemberEnrollments: async (memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      const enrollments = await programService.getMemberEnrollments(memberId);
      set({ enrollments, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch enrollments',
        isLoading: false,
      });
    }
  },

  fetchMemberStageSummary: async (memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stageSummary = await programService.getMemberStageSummary(memberId);
      set({ stageSummary, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch stage summary',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
