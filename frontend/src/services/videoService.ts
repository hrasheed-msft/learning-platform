import api from './api';

export interface VideoStatusResponse {
  status: 'generating' | 'ready';
  url?: string;
  estimatedTime?: number;
}

export const videoService = {
  /**
   * Request video generation for a unit. If already generated, returns status 'ready' with URL.
   * If not yet generated, triggers generation and returns status 'generating'.
   */
  async generateUnitVideo(
    unitId: string,
    language: 'ar' | 'en'
  ): Promise<VideoStatusResponse> {
    const response = await api.post<VideoStatusResponse>(
      `/units/${unitId}/video`,
      { language }
    );
    return response.data;
  },

  /**
   * Poll video generation status. Same endpoint, same contract.
   */
  async checkVideoStatus(
    unitId: string,
    language: 'ar' | 'en'
  ): Promise<VideoStatusResponse> {
    const response = await api.post<VideoStatusResponse>(
      `/units/${unitId}/video`,
      { language }
    );
    return response.data;
  },
};
