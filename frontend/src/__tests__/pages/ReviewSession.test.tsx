import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReviewSession from '@/pages/review/ReviewSession';

// Mock stores
vi.mock('@/stores', () => ({
  useAuthStore: vi.fn(() => ({
    family: { id: 'family-1' },
    user: { id: 'user-1', familyId: 'family-1' }
  })),
  useFamilyStore: vi.fn(() => ({
    members: [{ id: 'member-1', name: 'Ahmed' }],
    fetchMembers: vi.fn(),
  })),
}));

// Mock services to prevent network calls
vi.mock('@/services/srsService', () => ({
  srsService: {
    getDueReviews: vi.fn().mockResolvedValue({
      overdue: [
        {
          id: 'item-1',
          studentId: 'member-1',
          contentType: 'dua',
          contentId: 'content-1',
          title: 'Dua before eating',
          arabicText: 'بسم الله',
          translation: 'In the name of Allah',
          currentInterval: 1,
          easeFactor: 2.5,
          repetitionCount: 0,
          nextReviewAt: new Date().toISOString(),
        },
        {
          id: 'item-2',
          studentId: 'member-1',
          contentType: 'term',
          contentId: 'content-2',
          title: 'Tawheed',
          arabicText: 'التوحيد',
          translation: 'The oneness of Allah',
          currentInterval: 1,
          easeFactor: 2.5,
          repetitionCount: 0,
          nextReviewAt: new Date().toISOString(),
        },
        {
          id: 'item-3',
          studentId: 'member-1',
          contentType: 'hadith',
          contentId: 'content-3',
          title: 'Salat hadith',
          arabicText: 'الصلاة',
          translation: 'Prayer',
          currentInterval: 1,
          easeFactor: 2.5,
          repetitionCount: 0,
          nextReviewAt: new Date().toISOString(),
        },
      ],
      dueToday: [],
      totalDue: 3,
    }),
    submitReview: vi.fn().mockResolvedValue({ success: true }),
    getReviewHistory: vi.fn().mockResolvedValue([]),
    getMemorizationItems: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('@/services/familyService', () => ({
  familyService: {
    getMembers: vi.fn().mockResolvedValue([
      { id: 'member-1', name: 'Ahmed', role: 'CHILD' }
    ]),
    getFamily: vi.fn().mockResolvedValue({ id: 'family-1', name: 'Test Family' }),
  },
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ReviewSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays the first review item', async () => {
    renderWithRouter(<ReviewSession />);
    
    await waitFor(() => {
      // Check that a review question is displayed (from mock data in component)
      const items = screen.getAllByText(/Tawheed|Salat|dua/i);
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it('displays show answer button initially', async () => {
    renderWithRouter(<ReviewSession />);
    
    await waitFor(() => {
      // Use getByRole to find the button specifically
      expect(screen.getByRole('button', { name: /Show Answer/i })).toBeInTheDocument();
    });
  });

  it('reveals answer on show answer click', async () => {
    renderWithRouter(<ReviewSession />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Show Answer/i })).toBeInTheDocument();
    });

    const showButton = screen.getByRole('button', { name: /Show Answer/i });
    fireEvent.click(showButton);

    await waitFor(() => {
      // After clicking, rating buttons should appear
      expect(screen.getByRole('button', { name: /Good/i })).toBeInTheDocument();
    });
  });

  it('displays Arabic text for review items', async () => {
    renderWithRouter(<ReviewSession />);
    
    await waitFor(() => {
      // Check for Arabic characters in the component
      const arabicText = document.querySelector('.font-arabic');
      expect(arabicText).toBeTruthy();
    });
  });

  it('shows rating buttons after revealing answer', async () => {
    renderWithRouter(<ReviewSession />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Show Answer/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Show Answer/i }));

    await waitFor(() => {
      // Should show all rating buttons
      expect(screen.getByRole('button', { name: /Again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Hard/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Good/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Easy/i })).toBeInTheDocument();
    });
  });

  it('advances to next item after rating', async () => {
    renderWithRouter(<ReviewSession />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Show Answer/i })).toBeInTheDocument();
    });

    // Show answer
    fireEvent.click(screen.getByRole('button', { name: /Show Answer/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Good/i })).toBeInTheDocument();
    });

    // Click a rating
    fireEvent.click(screen.getByRole('button', { name: /Good/i }));

    await waitFor(() => {
      // Should show next Show Answer button or completion
      const showAnswerBtn = screen.queryByRole('button', { name: /Show Answer/i });
      const completedText = screen.queryByText(/completed|finished|done|session/i);
      expect(showAnswerBtn || completedText).toBeTruthy();
    });
  });

  it('shows progress indicator', async () => {
    renderWithRouter(<ReviewSession />);
    
    await waitFor(() => {
      // Should show progress like "1 / 3"
      expect(screen.getByText(/1.*\/.*3|1 of 3/)).toBeInTheDocument();
    });
  });
});
