/**
 * Du'ā & 99 Names Progress Service
 *
 * Calls Khwarizmi's planned endpoints:
 *   GET /api/v1/flashcards/progress?memberId={id}&subjectTag=DUA
 *   GET /api/v1/flashcards/progress?memberId={id}&subjectTag=99NAMES
 *
 * When those endpoints are not yet live the service rejects gracefully;
 * the store falls back to an empty list so pages still render.
 */

import api from './api';
import type {
  DuaProgressApiResponse,
  NamesProgressApiResponse,
} from '@/types/duaProgress.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const duaProgressService = {
  /** Fetch all du'ā flashcards with SRS progress for a given member. */
  async getDuaProgress(memberId: string): Promise<DuaProgressApiResponse> {
    const response = await api.get<ApiResponse<DuaProgressApiResponse>>(
      '/flashcards/progress',
      { params: { memberId, subjectTag: 'DUA' } }
    );
    return response.data.data;
  },

  /** Fetch all 99-Names flashcards with SRS progress for a given member. */
  async getNamesProgress(memberId: string): Promise<NamesProgressApiResponse> {
    const response = await api.get<ApiResponse<NamesProgressApiResponse>>(
      '/flashcards/progress',
      { params: { memberId, subjectTag: '99NAMES' } }
    );
    return response.data.data;
  },
};
