import api from './api';

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

  /**
   * Fetch pre-generated audio with word-level timestamps for synced playback.
   * Returns null if no timestamps are available for this unit/language.
   */
  async getAudioWithTimestamps(
    unitId: string,
    language: 'ar' | 'en'
  ): Promise<AudioWithTimestampsResponse | null> {
    try {
      const response = await api.get<AudioWithTimestampsResponse>(
        `/units/${unitId}/audio`,
        { params: { language } }
      );
      // Only return if timestamps exist
      if (response.data?.timestamps?.length) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  },
};
