/**
 * Flash Card Store (Zustand)
 * 
 * Manages flash card state, progress tracking, and study session state
 * for the Islamic Learning Platform.
 */

import { create } from 'zustand';
import type {
  FlashCard,
  FlashCardProgress,
  FlashCardWithProgress,
  FlashCardFilters,
  DueCardsFilters,
  FlashCardStatistics,
  CreateFlashCardInput,
  UpdateFlashCardInput,
  StudySession,
  SessionStatistics,
} from '@/types/flashcard.types';
import { flashcardService } from '@/services/flashcardService';

interface FlashCardState {
  // Flash card data
  flashCards: FlashCard[];
  selectedCard: FlashCard | null;
  totalCards: number;
  
  // Progress data
  dueCards: FlashCardWithProgress[];
  totalDueCards: number;
  statistics: FlashCardStatistics | null;
  recentReviews: FlashCardProgress[];
  
  // Study session
  currentSession: StudySession | null;
  
  // Metadata
  categories: string[];
  tags: string[];
  
  // UI state
  filters: FlashCardFilters;
  dueFilters: DueCardsFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions - CRUD Operations
  createFlashCard: (courseId: string, unitId: string, input: Omit<CreateFlashCardInput, 'courseId' | 'unitId'>) => Promise<void>;
  createFlashCardBatch: (courseId: string, unitId: string, cards: Omit<CreateFlashCardInput, 'courseId' | 'unitId'>[]) => Promise<void>;
  fetchUnitFlashCards: (courseId: string, unitId: string, filters?: Omit<FlashCardFilters, 'courseId' | 'unitId'>) => Promise<void>;
  fetchCourseFlashCards: (courseId: string, filters?: Omit<FlashCardFilters, 'courseId'>) => Promise<void>;
  fetchFlashCard: (id: string) => Promise<void>;
  updateFlashCard: (id: string, input: UpdateFlashCardInput) => Promise<void>;
  deleteFlashCard: (id: string) => Promise<void>;
  reorderFlashCards: (unitId: string, cardIds: string[]) => Promise<void>;
  
  // Actions - Metadata
  fetchCategories: (unitId?: string) => Promise<void>;
  fetchTags: (unitId?: string) => Promise<void>;
  fetchFlashCardCount: (filters?: FlashCardFilters) => Promise<void>;
  
  // Actions - Progress & Review
  initializeProgress: (flashCardId: string) => Promise<void>;
  submitReview: (flashCardId: string, rating: number, memberId: string) => Promise<FlashCardProgress>;
  fetchDueCards: (filters?: DueCardsFilters) => Promise<void>;
  fetchStatistics: (unitId?: string, courseId?: string) => Promise<void>;
  fetchUnitProgress: (unitId: string) => Promise<void>;
  fetchCourseProgress: (courseId: string) => Promise<void>;
  fetchRecentReviews: (limit?: number) => Promise<void>;
  resetProgress: (flashCardId: string) => Promise<void>;
  resetUnitProgress: (unitId: string) => Promise<void>;
  
  // Actions - Study Session Management
  startStudySession: (cards: FlashCardWithProgress[], mode: 'study' | 'review', selectedMemberId?: string, unitId?: string, courseId?: string) => void;
  endStudySession: () => SessionStatistics | null;
  nextCard: () => void;
  previousCard: () => void;
  rateCurrentCard: (rating: number) => Promise<void>;
  skipCard: () => void;
  
  // Actions - Filters & State
  setFilters: (filters: Partial<FlashCardFilters>) => void;
  setDueFilters: (filters: Partial<DueCardsFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
  reset: () => void;
}

const defaultFilters: FlashCardFilters = {
  limit: 50,
  offset: 0,
};

const defaultDueFilters: DueCardsFilters = {
  limit: 20,
};

export const useFlashCardStore = create<FlashCardState>((set, get) => ({
  // Initial state
  flashCards: [],
  selectedCard: null,
  totalCards: 0,
  dueCards: [],
  totalDueCards: 0,
  statistics: null,
  recentReviews: [],
  currentSession: null,
  categories: [],
  tags: [],
  filters: defaultFilters,
  dueFilters: defaultDueFilters,
  isLoading: false,
  error: null,

  /**
   * CRUD Operations
   */

  createFlashCard: async (courseId, unitId, input) => {
    set({ isLoading: true, error: null });
    try {
      const newCard = await flashcardService.createFlashCard(courseId, unitId, input);
      set((state) => ({
        flashCards: [...state.flashCards, newCard],
        totalCards: state.totalCards + 1,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create flash card',
        isLoading: false,
      });
      throw error;
    }
  },

  createFlashCardBatch: async (courseId, unitId, cards) => {
    set({ isLoading: true, error: null });
    try {
      const result = await flashcardService.createFlashCardBatch(courseId, unitId, cards);
      set((state) => ({
        flashCards: [...state.flashCards, ...result.cards],
        totalCards: state.totalCards + result.count,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create flash cards',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchUnitFlashCards: async (courseId, unitId, filters) => {
    set({ isLoading: true, error: null });
    try {
      const { cards, total } = await flashcardService.getUnitFlashCards(courseId, unitId, filters);
      set({
        flashCards: cards,
        totalCards: total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch flash cards',
        isLoading: false,
      });
    }
  },

  fetchCourseFlashCards: async (courseId, filters) => {
    set({ isLoading: true, error: null });
    try {
      const { cards, total } = await flashcardService.getCourseFlashCards(courseId, filters);
      set({
        flashCards: cards,
        totalCards: total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch flash cards',
        isLoading: false,
      });
    }
  },

  fetchFlashCard: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const card = await flashcardService.getFlashCard(id);
      set({
        selectedCard: card,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch flash card',
        isLoading: false,
      });
    }
  },

  updateFlashCard: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCard = await flashcardService.updateFlashCard(id, input);
      set((state) => ({
        flashCards: state.flashCards.map((card) => (card.id === id ? updatedCard : card)),
        selectedCard: state.selectedCard?.id === id ? updatedCard : state.selectedCard,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update flash card',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteFlashCard: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await flashcardService.deleteFlashCard(id);
      set((state) => ({
        flashCards: state.flashCards.filter((card) => card.id !== id),
        totalCards: state.totalCards - 1,
        selectedCard: state.selectedCard?.id === id ? null : state.selectedCard,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete flash card',
        isLoading: false,
      });
      throw error;
    }
  },

  reorderFlashCards: async (unitId, cardIds) => {
    set({ isLoading: true, error: null });
    try {
      await flashcardService.reorderFlashCards(unitId, cardIds);
      // Update local order based on cardIds array
      set((state) => {
        const cardMap = new Map(state.flashCards.map((card) => [card.id, card]));
        const reorderedCards = cardIds
          .map((id, index) => {
            const card = cardMap.get(id);
            return card ? { ...card, orderIndex: index } : null;
          })
          .filter((card): card is FlashCard => card !== null);
        
        return {
          flashCards: reorderedCards,
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder flash cards',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Metadata Operations
   */

  fetchCategories: async (unitId) => {
    set({ isLoading: true, error: null });
    try {
      const categories = await flashcardService.getCategories(unitId);
      set({
        categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  fetchTags: async (unitId) => {
    set({ isLoading: true, error: null });
    try {
      const tags = await flashcardService.getTags(unitId);
      set({
        tags,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tags',
        isLoading: false,
      });
    }
  },

  fetchFlashCardCount: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const count = await flashcardService.getFlashCardCount(filters);
      set({
        totalCards: count,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch flash card count',
        isLoading: false,
      });
    }
  },

  /**
   * Progress & Review Operations
   */

  initializeProgress: async (flashCardId) => {
    set({ isLoading: true, error: null });
    try {
      await flashcardService.initializeProgress(flashCardId);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize progress',
        isLoading: false,
      });
      throw error;
    }
  },

  submitReview: async (flashCardId, rating, memberId) => {
    set({ isLoading: true, error: null });
    try {
      console.log(`[submitReview] Calling API with - flashCardId: ${flashCardId}, rating: ${rating}, memberId: ${memberId}`);
      const updatedProgress = await flashcardService.submitReview(flashCardId, rating, memberId);
      console.log(`[submitReview] API response received:`, updatedProgress);
      
      // Update due cards if this card is in the list
      set((state) => ({
        dueCards: state.dueCards.map((card) =>
          card.id === flashCardId ? { ...card, progress: updatedProgress } : card
        ),
        isLoading: false,
      }));

      return updatedProgress;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to submit review';
      console.error(`[submitReview] Error:`, errorMsg);
      set({
        error: errorMsg,
        isLoading: false,
      });
      throw error;
    }
  },

  fetchDueCards: async (filters) => {
    const currentFilters = filters || get().dueFilters;
    set({ isLoading: true, error: null, dueFilters: currentFilters });
    try {
      const { cards, total } = await flashcardService.getDueCards(currentFilters);
      set({
        dueCards: cards,
        totalDueCards: total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch due cards',
        isLoading: false,
      });
    }
  },

  fetchStatistics: async (unitId, courseId) => {
    set({ isLoading: true, error: null });
    try {
      const stats = await flashcardService.getStatistics(unitId, courseId);
      set({
        statistics: stats,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch statistics',
        isLoading: false,
      });
    }
  },

  fetchUnitProgress: async (unitId) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await flashcardService.getUnitProgress(unitId);
      // Store in recentReviews for now (could add separate state if needed)
      set({
        recentReviews: progress,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch unit progress',
        isLoading: false,
      });
    }
  },

  fetchCourseProgress: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await flashcardService.getCourseProgress(courseId);
      // Store in recentReviews for now (could add separate state if needed)
      set({
        recentReviews: progress,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch course progress',
        isLoading: false,
      });
    }
  },

  fetchRecentReviews: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const reviews = await flashcardService.getRecentReviews(limit);
      set({
        recentReviews: reviews,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recent reviews',
        isLoading: false,
      });
    }
  },

  resetProgress: async (flashCardId) => {
    set({ isLoading: true, error: null });
    try {
      await flashcardService.resetProgress(flashCardId);
      // Remove from due cards and update state
      set((state) => ({
        dueCards: state.dueCards.filter((card) => card.id !== flashCardId),
        totalDueCards: state.totalDueCards - 1,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reset progress',
        isLoading: false,
      });
      throw error;
    }
  },

  resetUnitProgress: async (unitId) => {
    set({ isLoading: true, error: null });
    try {
      await flashcardService.resetUnitProgress(unitId);
      // Clear due cards for this unit
      set((state) => ({
        dueCards: state.dueCards.filter((card) => card.unitId !== unitId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reset unit progress',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Study Session Management
   */

  startStudySession: (cards, mode, selectedMemberId, unitId, courseId) => {
    set({
      currentSession: {
        cards,
        mode,
        selectedMemberId,
        unitId,
        courseId,
        currentIndex: 0,
        startTime: new Date(),
        completed: 0,
        ratings: new Map(),
      },
    });
  },

  endStudySession: () => {
    const session = get().currentSession;
    if (!session) return null;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);
    
    const ratings = Array.from(session.ratings.values());
    const correctRatings = ratings.filter((r) => r >= 4).length;
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;

    const stats: SessionStatistics = {
      totalCards: session.cards.length,
      cardsStudied: session.completed,
      correctRatings,
      averageRating,
      sessionDuration: duration,
      cardsRemaining: session.cards.length - session.completed,
    };

    set({ currentSession: null });
    return stats;
  },

  nextCard: () => {
    set((state) => {
      if (!state.currentSession) return state;
      
      const newIndex = Math.min(
        state.currentSession.currentIndex + 1,
        state.currentSession.cards.length - 1
      );
      
      return {
        currentSession: {
          ...state.currentSession,
          currentIndex: newIndex,
        },
      };
    });
  },

  previousCard: () => {
    set((state) => {
      if (!state.currentSession) return state;
      
      const newIndex = Math.max(state.currentSession.currentIndex - 1, 0);
      
      return {
        currentSession: {
          ...state.currentSession,
          currentIndex: newIndex,
        },
      };
    });
  },

  rateCurrentCard: async (rating) => {
    const session = get().currentSession;
    if (!session) return;

    const currentCard = session.cards[session.currentIndex];
    if (!currentCard) return;

    console.log(`[FlashCard Store] Rating card ${currentCard.id} with rating ${rating}`);

    // Update session state first (optimistic update)
    const newRatings = new Map(session.ratings);
    newRatings.set(currentCard.id, rating);

    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          completed: state.currentSession.completed + 1,
          ratings: newRatings,
        },
      };
    });

    // Move to next card immediately
    get().nextCard();

    // Submit review to backend (non-blocking)
    try {
      const session = get().currentSession;
      console.log(`[rateCurrentCard] Current session state:`, {
        sessionExists: !!session,
        selectedMemberId: session?.selectedMemberId,
        cardId: currentCard.id,
        rating: rating,
      });
      
      const memberId = session?.selectedMemberId;
      if (!memberId) {
        throw new Error('No member selected for this session');
      }
      console.log(`[FlashCard Store] Submitting review - Card: ${currentCard.id}, Rating: ${rating}, Member: ${memberId}`);
      const result = await get().submitReview(currentCard.id, rating, memberId);
      console.log(`[FlashCard Store] Review saved, new status: ${result.status}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('[FlashCard Store] Failed to save review to backend:', errorMsg);
      // Don't block the session - rating is saved locally
    }
  },

  skipCard: () => {
    get().nextCard();
  },

  /**
   * Filter & State Management
   */

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  setDueFilters: (filters) => {
    set((state) => ({
      dueFilters: { ...state.dueFilters, ...filters },
    }));
  },

  clearFilters: () => {
    set({
      filters: defaultFilters,
      dueFilters: defaultDueFilters,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      flashCards: [],
      selectedCard: null,
      totalCards: 0,
      dueCards: [],
      totalDueCards: 0,
      statistics: null,
      recentReviews: [],
      currentSession: null,
      categories: [],
      tags: [],
      filters: defaultFilters,
      dueFilters: defaultDueFilters,
      isLoading: false,
      error: null,
    });
  },
}));
