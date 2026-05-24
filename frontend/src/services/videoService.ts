export interface VideoStatusResponse {
  status: 'generating' | 'ready';
  url?: string;
  estimatedTime?: number;
}

const VIDEO_DISABLED_ERROR = 'Video generation is temporarily disabled.';

export const videoService = {
  async generateUnitVideo(
    _unitId: string,
    _language: 'ar' | 'en'
  ): Promise<VideoStatusResponse> {
    throw new Error(VIDEO_DISABLED_ERROR);
  },

  async checkVideoStatus(
    _unitId: string,
    _language: 'ar' | 'en'
  ): Promise<VideoStatusResponse> {
    throw new Error(VIDEO_DISABLED_ERROR);
  },
};
