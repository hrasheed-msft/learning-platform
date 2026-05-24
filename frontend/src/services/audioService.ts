import api from './api';
import type { ApiRequestConfig } from './api';

export interface WordTimestamp {
  word: string;
  offset: number;   // ms from start
  duration: number; // ms
}

export interface AudioGenerationResponse {
  url: string;
  duration: number;
}

export interface AudioWithTimestampsResponse {
  audioUrl: string;
  timestamps: WordTimestamp[];
}

// Audio requests should never trigger page-level navigation on auth errors.
// They fail gracefully with inline error messages instead.
const audioRequestConfig: ApiRequestConfig = { skipAuthRedirect: true };

export const audioService = {
  /**
   * Generate TTS audio for a unit in the specified language.
   * Backend caches generated audio, so subsequent calls return the cached URL instantly.
   */
  async generateUnitAudio(
    unitId: string,
    language: 'ar' | 'en'
  ): Promise<AudioGenerationResponse> {
    const response = await api.post(
      `/units/${unitId}/audio`,
      { language },
      audioRequestConfig
    );
    return response.data.data;
  },

  /**
   * Fetch pre-generated audio with word-level timestamps for synced playback.
   * Returns null if no timestamps are available for this unit/language.
   */
  async getAudioWithTimestamps(
    unitId: string,
    language: 'ar' | 'en'
  ): Promise<AudioWithTimestampsResponse | null> {
    try {
      const response = await api.get(
        `/units/${unitId}/audio`,
        { params: { language }, ...audioRequestConfig }
      );
      const data = response.data.data;
      // Only return if timestamps exist
      if (data?.timestamps?.length) {
        return {
          audioUrl: data.audioUrl,
          timestamps: data.timestamps,
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};
