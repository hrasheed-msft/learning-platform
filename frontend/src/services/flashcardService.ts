/**
 * Flash Card Service
 * 
 * Handles all flash card API operations including CRUD, progress tracking,
 * and spaced repetition review functionality.
 */

import api from './api';
import type {
  FlashCard,
  FlashCardProgress,
  FlashCardWithProgress,
  CreateFlashCardInput,
  UpdateFlashCardInput,
  FlashCardFilters,
  DueCardsFilters,
  FlashCardStatistics,
} from '@/types/flashcard.types';

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Backend response with pagination (flat structure - pagination at root level)
interface FlashCardListResponse {
  success: boolean;
  data: FlashCard[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const flashcardService = {
  /**
   * CRUD Operations
   */

  // Create a single flash card
  async createFlashCard(
    courseId: string,
    unitId: string,
    input: Omit<CreateFlashCardInput, 'courseId' | 'unitId'>
  ): Promise<FlashCard> {
    const response = await api.post<ApiResponse<FlashCard>>(
      `/courses/${courseId}/units/${unitId}/flashcards`,
      input
    );
    return response.data.data;
  },

  // Create multiple flash cards in batch
  async createFlashCardBatch(
    courseId: string,
    unitId: string,
    cards: Omit<CreateFlashCardInput, 'courseId' | 'unitId'>[]
  ): Promise<{ count: number; cards: FlashCard[] }> {
    const response = await api.post<ApiResponse<{ count: number; cards: FlashCard[] }>>(
      `/courses/${courseId}/units/${unitId}/flashcards/batch`,
      { cards }
    );
    return response.data.data;
  },

  // Get flash cards for a unit
  async getUnitFlashCards(
    courseId: string,
    unitId: string,
    filters?: Omit<FlashCardFilters, 'courseId' | 'unitId'>
  ): Promise<{ cards: FlashCard[]; total: number }> {
    const response = await api.get<FlashCardListResponse>(
      `/courses/${courseId}/units/${unitId}/flashcards`,
      { params: filters }
    );
    return {
      cards: response.data.data,
      total: response.data.pagination.total,
    };
  },

  // Get all flash cards for a course
  async getCourseFlashCards(
    courseId: string,
    filters?: Omit<FlashCardFilters, 'courseId'>
  ): Promise<{ cards: FlashCard[]; total: number }> {
    const response = await api.get<FlashCardListResponse>(
      `/courses/${courseId}/flashcards`,
      { params: filters }
    );
    return {
      cards: response.data.data,
      total: response.data.pagination.total,
    };
  },

  // Get a single flash card by ID
  async getFlashCard(id: string): Promise<FlashCard> {
    const response = await api.get<ApiResponse<FlashCard>>(`/flashcards/${id}`);
    return response.data.data;
  },

  // Update a flash card
  async updateFlashCard(id: string, input: UpdateFlashCardInput): Promise<FlashCard> {
    const response = await api.put<ApiResponse<FlashCard>>(`/flashcards/${id}`, input);
    return response.data.data;
  },

  // Delete a flash card
  async deleteFlashCard(id: string): Promise<void> {
    await api.delete(`/flashcards/${id}`);
  },

  /**
   * Utility Operations
   */

  // Reorder flash cards in a unit
  async reorderFlashCards(unitId: string, cardIds: string[]): Promise<void> {
    await api.put(`/units/${unitId}/flashcards/reorder`, { cardIds });
  },

  // Get distinct categories (optionally filtered by unit)
  async getCategories(unitId?: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/flashcards/metadata/categories', {
      params: unitId ? { unitId } : undefined,
    });
    return response.data.data;
  },

  // Get distinct tags (optionally filtered by unit)
  async getTags(unitId?: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/flashcards/metadata/tags', {
      params: unitId ? { unitId } : undefined,
    });
    return response.data.data;
  },

  // Get total count of flash cards with optional filters
  async getFlashCardCount(filters?: FlashCardFilters): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>('/flashcards/count', {
      params: filters,
    });
    return response.data.data.count;
  },

  /**
   * Progress & Review Operations
   */

  // Initialize progress for a flash card
  async initializeProgress(flashCardId: string): Promise<FlashCardProgress> {
    const response = await api.post<ApiResponse<FlashCardProgress>>(
      `/flashcards/${flashCardId}/initialize`
    );
    return response.data.data;
  },

  // Submit a review for a flash card
  async submitReview(flashCardId: string, rating: number, memberId: string): Promise<FlashCardProgress> {
    console.log(`[flashcardService] Submitting review - flashCardId: ${flashCardId}, rating: ${rating}, memberId: ${memberId}`);
    const response = await api.post<ApiResponse<FlashCardProgress>>(
      `/flashcards/${flashCardId}/review`,
      { memberId, rating }
    );
    console.log(`[flashcardService] Response:`, response.data);
    return response.data.data;
  },

  // Get due cards for review
  async getDueCards(filters?: DueCardsFilters): Promise<{ cards: FlashCardWithProgress[]; total: number }> {
    const response = await api.get<ApiResponse<{ dueCards: FlashCardWithProgress[]; total: number }>>(
      '/members/me/flashcards/due',
      { params: filters }
    );
    return {
      cards: response.data.data.dueCards,
      total: response.data.data.total,
    };
  },

  // Get progress statistics
  async getStatistics(unitId?: string, courseId?: string, memberId?: string): Promise<FlashCardStatistics> {
    const response = await api.get<ApiResponse<FlashCardStatistics>>(
      '/members/me/flashcards/stats',
      { params: { memberId, unitId, courseId } }
    );
    return response.data.data;
  },

  // Get progress for a specific unit
  async getUnitProgress(unitId: string): Promise<FlashCardProgress[]> {
    const response = await api.get<ApiResponse<FlashCardProgress[]>>(
      `/members/me/units/${unitId}/flashcards/progress`
    );
    return response.data.data;
  },

  // Get progress for a specific course
  async getCourseProgress(courseId: string): Promise<FlashCardProgress[]> {
    const response = await api.get<ApiResponse<FlashCardProgress[]>>(
      `/members/me/courses/${courseId}/flashcards/progress`
    );
    return response.data.data;
  },

  // Get recent review history
  async getRecentReviews(limit: number = 10): Promise<FlashCardProgress[]> {
    const response = await api.get<ApiResponse<FlashCardProgress[]>>(
      '/members/me/flashcards/recent',
      { params: { limit } }
    );
    return response.data.data;
  },

  // Reset progress for a single flash card
  async resetProgress(flashCardId: string): Promise<void> {
    await api.delete(`/flashcards/${flashCardId}/progress`);
  },

  // Reset progress for all cards in a unit
  async resetUnitProgress(unitId: string): Promise<void> {
    await api.delete(`/units/${unitId}/flashcards/progress`);
  },
};
