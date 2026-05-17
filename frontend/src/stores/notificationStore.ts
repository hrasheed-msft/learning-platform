import { create } from 'zustand';
import type { Notification } from '@/types';
import { dashboardService } from '@/services/dashboardService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await dashboardService.getNotifications();
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await dashboardService.markNotificationRead(notificationId);
      set((state) => {
        const notifications = state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        return { notifications, unreadCount };
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
