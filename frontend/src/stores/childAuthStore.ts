import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildMember, ChildLoginRequest, ChildAuthResponse } from '@/types';
import { childAuthService } from '@/services/childAuthService';

interface ChildAuthState {
  member: ChildMember | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isChildSession: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: ChildLoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useChildAuthStore = create<ChildAuthState>()(
  persist(
    (set) => ({
      member: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isChildSession: false,
      isLoading: false,
      error: null,

      login: async (credentials: ChildLoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response: ChildAuthResponse = await childAuthService.childLogin(credentials);
          set({
            member: response.member,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken ?? null,
            isAuthenticated: true,
            isChildSession: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          member: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isChildSession: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'child-auth-storage',
      partialize: (state) => ({
        member: state.member,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isChildSession: state.isChildSession,
      }),
    }
  )
);
