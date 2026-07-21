import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FamilyMember, CreateMemberRequest } from '@/types';
import { familyService } from '@/services/familyService';

interface FamilyState {
  members: FamilyMember[];
  selectedMember: FamilyMember | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMembers: (familyId: string) => Promise<void>;
  fetchLearners: () => Promise<void>;
  addMember: (familyId: string, data: CreateMemberRequest) => Promise<FamilyMember>;
  updateMember: (familyId: string, memberId: string, data: Partial<CreateMemberRequest>) => Promise<void>;
  removeMember: (familyId: string, memberId: string) => Promise<void>;
  isParentInStudentMode: boolean;
  selectMember: (member: FamilyMember | null) => void;
  selfEnroll: () => Promise<FamilyMember>;
  clearSelectedMember: () => void;
  clearError: () => void;
  setParentInStudentMode: (value: boolean) => void;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      members: [],
      selectedMember: null,
      isLoading: false,
      error: null,
      isParentInStudentMode: false,

      fetchMembers: async (familyId: string) => {
        set({ isLoading: true, error: null });
        try {
          const members = await familyService.getMembers(familyId);
          set({ members, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch members',
            isLoading: false,
          });
        }
      },

      fetchLearners: async () => {
        set({ isLoading: true, error: null });
        try {
          const members = await familyService.getLearners();
          set({ members, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch learners',
            isLoading: false,
          });
        }
      },

      addMember: async (familyId: string, data: CreateMemberRequest) => {
        set({ isLoading: true, error: null });
        try {
          const newMember = await familyService.addMember(familyId, data);
          set((state) => ({
            members: [...state.members, newMember],
            isLoading: false,
          }));
          return newMember;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add member',
            isLoading: false,
          });
          throw error;
        }
      },

      updateMember: async (familyId: string, memberId: string, data: Partial<CreateMemberRequest>) => {
        set({ isLoading: true, error: null });
        try {
          const updatedMember = await familyService.updateMember(familyId, memberId, data);
          set((state) => ({
            members: state.members.map((m) => (m.id === memberId ? updatedMember : m)),
            selectedMember: state.selectedMember?.id === memberId ? updatedMember : state.selectedMember,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update member',
            isLoading: false,
          });
          throw error;
        }
      },

      removeMember: async (familyId: string, memberId: string) => {
        set({ isLoading: true, error: null });
        try {
          await familyService.removeMember(familyId, memberId);
          set((state) => ({
            members: state.members.filter((m) => m.id !== memberId),
            selectedMember: state.selectedMember?.id === memberId ? null : state.selectedMember,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove member',
            isLoading: false,
          });
          throw error;
        }
      },

      selectMember: (member: FamilyMember | null) => {
        set({ selectedMember: member });
      },

      selfEnroll: async () => {
        set({ isLoading: true, error: null });
        try {
          const member = await familyService.selfEnroll();
          set((state) => ({
            members: [...state.members, member],
            selectedMember: member,
            isLoading: false,
          }));
          return member;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to enroll',
            isLoading: false,
          });
          throw error;
        }
      },

      clearSelectedMember: () => {
        set({ selectedMember: null });
      },

      clearError: () => set({ error: null }),

      setParentInStudentMode: (value: boolean) => set({ isParentInStudentMode: value }),
    }),
    {
      name: 'family-storage',
      partialize: (state) => ({
        selectedMember: state.selectedMember,
        isParentInStudentMode: state.isParentInStudentMode,
      }),
    }
  )
);
