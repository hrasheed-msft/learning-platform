import api from './api';
import type {
  MemorizationItem,
  ReviewDueResponse,
  SubmitReviewRequest,
  SubmitReviewResponse,
  ReviewSchedule,
} from '@/types';

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const srsService = {
  // Get items due for review
  async getDueReviews(memberId: string): Promise<ReviewDueResponse> {
    const response = await api.get<ApiResponse<ReviewDueResponse>>(`/srs/due/${memberId}`);
    return response.data.data;
  },

  // Submit a review with rating (1-4)
  async submitReview(
    memberId: string,
    itemId: string,
    data: SubmitReviewRequest
  ): Promise<SubmitReviewResponse> {
    const response = await api.post<ApiResponse<SubmitReviewResponse>>(
      '/srs/review',
      { memberId, itemId, ...data }
    );
    return response.data.data;
  },

  // Get review history for a member
  async getReviewHistory(memberId: string): Promise<ReviewSchedule[]> {
    const response = await api.get<ApiResponse<ReviewSchedule[]>>(
      `/srs/history/${memberId}`
    );
    return response.data.data;
  },

  // Get all memorization items for a member
  async getMemorizationItems(memberId: string): Promise<MemorizationItem[]> {
    const response = await api.get<ApiResponse<MemorizationItem[]>>(
      `/srs/items/${memberId}`
    );
    return response.data.data;
  },

  // Add new memorization item
  async addMemorizationItem(
    memberId: string,
    data: {
      type: 'AYAH' | 'HADITH' | 'DUA' | 'TERM';
      front: string;
      back: string;
      arabicText?: string;
      transliteration?: string;
      sourceUnitId?: string;
    }
  ): Promise<MemorizationItem> {
    const response = await api.post<ApiResponse<MemorizationItem>>(
      '/srs/items',
      { memberId, ...data }
    );
    return response.data.data;
  },

  // Get SRS statistics for a member
  async getStats(memberId: string): Promise<unknown> {
    const response = await api.get<ApiResponse<unknown>>(`/srs/stats/${memberId}`);
    return response.data.data;
  },
};
