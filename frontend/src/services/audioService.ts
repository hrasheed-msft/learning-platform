import api from './api';

export interface AudioGenerationResponse {
  url: string;
  duration: number;
}

export const audioService = {
  /**
   * Generate TTS audio for a unit in the specified language.
   * Backend caches generated audio, so subsequent calls return the cached URL instantly.
   */
  async generateUnitAudio(
    unitId: string,
    language: 'ar' | 'en'
  ): Promise<AudioGenerationResponse> {
    const response = await api.post<AudioGenerationResponse>(
      `/units/${unitId}/audio`,
      { language }
    );
    return response.data;
  },
};
