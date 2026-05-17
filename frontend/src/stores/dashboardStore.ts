import { create } from 'zustand';
import type {
  ChildSummary,
  ChildDetailStats,
  ActivityEvent,
  FamilySummary,
} from '@/types';
import { dashboardService } from '@/services/dashboardService';

interface DashboardState {
  children: ChildSummary[];
  selectedChildStats: ChildDetailStats | null;
  activityFeed: ActivityEvent[];
  activityTotal: number;
  activityPage: number;
  familySummary: FamilySummary | null;
  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingActivity: boolean;
  error: string | null;

  fetchChildren: () => Promise<void>;
  fetchChildStats: (memberId: string) => Promise<void>;
  fetchChildActivity: (memberId: string, page?: number) => Promise<void>;
  fetchFamilySummary: () => Promise<void>;
  clearSelectedChild: () => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  children: [],
  selectedChildStats: null,
  activityFeed: [],
  activityTotal: 0,
  activityPage: 1,
  familySummary: null,
  isLoading: false,
  isLoadingStats: false,
  isLoadingActivity: false,
  error: null,

  fetchChildren: async () => {
    set({ isLoading: true, error: null });
    try {
      const children = await dashboardService.getChildren();
      set({ children, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch children',
        isLoading: false,
      });
    }
  },

  fetchChildStats: async (memberId: string) => {
    set({ isLoadingStats: true, error: null });
    try {
      const stats = await dashboardService.getChildStats(memberId);
      set({ selectedChildStats: stats, isLoadingStats: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch child stats',
        isLoadingStats: false,
      });
    }
  },

  fetchChildActivity: async (memberId: string, page = 1) => {
    set({ isLoadingActivity: true, error: null });
    try {
      const response = await dashboardService.getChildActivity(memberId, page);
      if (page === 1) {
        set({
          activityFeed: response.activities,
          activityTotal: response.total,
          activityPage: page,
          isLoadingActivity: false,
        });
      } else {
        set((state) => ({
          activityFeed: [...state.activityFeed, ...response.activities],
          activityTotal: response.total,
          activityPage: page,
          isLoadingActivity: false,
        }));
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch activity',
        isLoadingActivity: false,
      });
    }
  },

  fetchFamilySummary: async () => {
    try {
      const summary = await dashboardService.getFamilySummary();
      set({ familySummary: summary });
    } catch (error) {
      console.error('Failed to fetch family summary:', error);
    }
  },

  clearSelectedChild: () => {
    set({ selectedChildStats: null, activityFeed: [], activityTotal: 0, activityPage: 1 });
  },

  clearError: () => set({ error: null }),
}));
