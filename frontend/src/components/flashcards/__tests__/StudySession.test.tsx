/**
 * StudySession Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudySession } from '../StudySession';
import { useFlashCardStore } from '@/stores';
import { FlashCardDifficulty, FlashCardStatus } from '@/types';
import type { FlashCardWithProgress } from '@/types';

// Mock the store
vi.mock('@/stores', () => ({
  useFlashCardStore: vi.fn(),
}));

const mockCards: FlashCardWithProgress[] = [
  {
    id: '1',
    unitId: 'unit-1',
    courseId: 'course-1',
    front: 'What is Salah?',
    back: 'Prayer - one of the five pillars of Islam',
    frontArabic: 'ما هي الصلاة؟',
    backArabic: 'الصلاة',
    category: 'Basics',
    tags: ['prayer', 'pillars'],
    difficulty: FlashCardDifficulty.EASY,
    orderIndex: 0,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    progress: {
      id: 'progress-1',
      memberId: 'member-1',
      flashCardId: '1',
      status: FlashCardStatus.NEW,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      nextReviewDate: new Date().toISOString(),
      totalReviews: 0,
      correctReviews: 0,
      lastRating: 0,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
  },
  {
    id: '2',
    unitId: 'unit-1',
    courseId: 'course-1',
    front: 'What is Zakat?',
    back: 'Charity - one of the five pillars of Islam',
    frontArabic: null,
    backArabic: null,
    category: 'Basics',
    tags: ['charity', 'pillars'],
    difficulty: FlashCardDifficulty.MEDIUM,
    orderIndex: 1,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    progress: {
      id: 'progress-2',
      memberId: 'member-1',
      flashCardId: '2',
      status: FlashCardStatus.LEARNING,
      easeFactor: 2.3,
      interval: 1,
      repetitions: 1,
      nextReviewDate: new Date().toISOString(),
      totalReviews: 1,
      correctReviews: 1,
      lastRating: 3,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    },
  },
];

describe('StudySession', () => {
  const mockStartStudySession = vi.fn();
  const mockEndStudySession = vi.fn();
  const mockRateCurrentCard = vi.fn();
  const mockNextCard = vi.fn();
  const mockPreviousCard = vi.fn();
  const mockSkipCard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    (useFlashCardStore as any).mockReturnValue({
      currentSession: null,
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });
  });

  it('initializes session on mount', () => {
    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    expect(mockStartStudySession).toHaveBeenCalledWith(
      mockCards,
      'study',
      'unit-1',
      'course-1'
    );
  });

  it('renders progress information', () => {
    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 0,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    expect(screen.getByText(/Card 1 of 2/)).toBeInTheDocument();
  });

  it('shows answer on reveal button click', () => {
    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 0,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    const revealButton = screen.getByRole('button', { name: /show answer/i });
    fireEvent.click(revealButton);

    expect(screen.queryByRole('button', { name: /show answer/i })).not.toBeInTheDocument();
  });

  it('calls rateCurrentCard when rating button clicked', async () => {
    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 0,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    // Reveal answer first
    const revealButton = screen.getByRole('button', { name: /show answer/i });
    fireEvent.click(revealButton);

    // Click rating button
    const rating3Button = screen.getByRole('button', { name: /3 Good/i });
    fireEvent.click(rating3Button);

    await waitFor(() => {
      expect(mockRateCurrentCard).toHaveBeenCalledWith(3);
    });
  });

  it('calls skipCard when skip button clicked', () => {
    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 0,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    const skipButton = screen.getByRole('button', { name: /skip/i });
    fireEvent.click(skipButton);

    expect(mockSkipCard).toHaveBeenCalled();
  });

  it('calls previousCard when previous button clicked', () => {
    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 1,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [{ flashCardId: '1', rating: 3 }],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    const previousButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(previousButton);

    expect(mockPreviousCard).toHaveBeenCalled();
  });

  it('disables previous button on first card', () => {
    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 0,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    const previousButton = screen.getByRole('button', { name: /previous/i });
    expect(previousButton).toBeDisabled();
  });

  it('calls onComplete when session ends', async () => {
    const onComplete = vi.fn();
    const mockStats = {
      totalCards: 2,
      completedCards: 2,
      averageRating: 3.5,
      duration: 120,
    };
    
    mockEndStudySession.mockReturnValue(mockStats);

    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 1,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [
          { flashCardId: '1', rating: 3 },
          { flashCardId: '2', rating: 4 },
        ],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
        onComplete={onComplete}
      />
    );

    // Reveal answer
    const revealButton = screen.getByRole('button', { name: /show answer/i });
    fireEvent.click(revealButton);

    // Rate last card
    const rating4Button = screen.getByRole('button', { name: /4 Easy/i });
    fireEvent.click(rating4Button);

    await waitFor(() => {
      expect(mockEndStudySession).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith(mockStats);
    });
  });

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();

    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 0,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
        onCancel={onCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /end session/i });
    fireEvent.click(cancelButton);

    expect(mockEndStudySession).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders all 5 rating buttons after revealing answer', () => {
    (useFlashCardStore as any).mockReturnValue({
      currentSession: {
        cards: mockCards,
        currentIndex: 0,
        mode: 'study',
        unitId: 'unit-1',
        courseId: 'course-1',
        ratings: [],
        startTime: new Date().toISOString(),
      },
      startStudySession: mockStartStudySession,
      endStudySession: mockEndStudySession,
      rateCurrentCard: mockRateCurrentCard,
      nextCard: mockNextCard,
      previousCard: mockPreviousCard,
      skipCard: mockSkipCard,
    });

    render(
      <StudySession
        cards={mockCards}
        mode="study"
        unitId="unit-1"
        courseId="course-1"
      />
    );

    // Reveal answer
    const revealButton = screen.getByRole('button', { name: /show answer/i });
    fireEvent.click(revealButton);

    expect(screen.getByRole('button', { name: /1 Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /2 Hard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /3 Good/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /4 Easy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /5 Perfect/i })).toBeInTheDocument();
  });
});
