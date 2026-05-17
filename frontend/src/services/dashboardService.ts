import api from './api';
import type {
  ChildSummary,
  ChildDetailStats,
  ActivityFeedResponse,
  FamilySummary,
  Notification,
} from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const dashboardService = {
  async getChildren(): Promise<ChildSummary[]> {
    const response = await api.get<ApiResponse<ChildSummary[]>>('/dashboard/children');
    return response.data.data;
  },

  async getChildStats(memberId: string): Promise<ChildDetailStats> {
    const response = await api.get<ApiResponse<ChildDetailStats>>(
      `/dashboard/children/${memberId}/stats`
    );
    return response.data.data;
  },

  async getChildActivity(
    memberId: string,
    page = 1,
    pageSize = 20
  ): Promise<ActivityFeedResponse> {
    const response = await api.get<ApiResponse<ActivityFeedResponse>>(
      `/dashboard/children/${memberId}/activity`,
      { params: { page, pageSize } }
    );
    return response.data.data;
  },

  async getFamilySummary(): Promise<FamilySummary> {
    const response = await api.get<ApiResponse<FamilySummary>>('/dashboard/family/summary');
    return response.data.data;
  },

  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.data;
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  },
};
