/**
 * Du'ā & 99 Names Progress Store (Zustand)
 *
 * Minimal store for cross-stage SRS progress views.
 * fetchDuaProgress / fetchNamesProgress are safe to call before Khwarizmi's
 * endpoint is live — errors are swallowed and items stay empty.
 */

import { create } from 'zustand';
import { duaProgressService } from '@/services/dua-progress.service';
import type { DuaProgressItem, NameProgressItem } from '@/types/duaProgress.types';

interface DuaProgressState {
  duaItems: DuaProgressItem[];
  namesItems: NameProgressItem[];
  duaDueCount: number;
  namesDueCount: number;
  isLoading: boolean;
  error: string | null;

  fetchDuaProgress: (memberId: string) => Promise<void>;
  fetchNamesProgress: (memberId: string) => Promise<void>;
  clearError: () => void;
}

export const useDuaProgressStore = create<DuaProgressState>((set) => ({
  duaItems: [],
  namesItems: [],
  duaDueCount: 0,
  namesDueCount: 0,
  isLoading: false,
  error: null,

  fetchDuaProgress: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await duaProgressService.getDuaProgress(memberId);
      set({
        duaItems: data.items,
        duaDueCount: data.dueCount,
        isLoading: false,
      });
    } catch {
      // Endpoint may not be live yet — fail silently so the page still renders
      set({ isLoading: false });
    }
  },

  fetchNamesProgress: async (memberId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await duaProgressService.getNamesProgress(memberId);
      set({
        namesItems: data.items,
        namesDueCount: data.dueCount,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
