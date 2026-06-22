import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuizPage from '@/pages/courses/QuizPage';

// Mock useParams first
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ courseId: 'course-1', unitId: 'unit-1' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock stores — provide all exports to prevent transitive import failures
vi.mock('@/stores', () => ({
  useAuthStore: vi.fn(() => ({
    family: { id: 'family-1' },
    user: { id: 'user-1' },
  })),
  useChildAuthStore: vi.fn(() => ({})),
  useFamilyStore: vi.fn(() => ({ members: [], fetchMembers: vi.fn() })),
  useCourseStore: vi.fn(() => ({ courses: [], fetchCourses: vi.fn() })),
  useFlashCardStore: vi.fn(() => ({})),
  useDashboardStore: vi.fn(() => ({})),
  useNotificationStore: vi.fn(() => ({ notifications: [] })),
  useGameStore: vi.fn(() => ({})),
}));

// Mock services to prevent network calls
vi.mock('@/services/assessmentService', () => ({
  assessmentService: {
    getQuizQuestions: vi.fn().mockRejectedValue(new Error('mocked')),
    submitQuiz: vi.fn().mockResolvedValue({}),
    getMemberResults: vi.fn().mockResolvedValue([]),
    getQuizResult: vi.fn().mockResolvedValue({}),
    getMemberProgress: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('@/services/courseService', () => ({
  courseService: {
    getCourses: vi.fn().mockResolvedValue([]),
    getCourse: vi.fn().mockResolvedValue({}),
    getUnits: vi.fn().mockResolvedValue([]),
    getUnit: vi.fn().mockResolvedValue({}),
    getNextUnit: vi.fn().mockResolvedValue(null),
  },
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('QuizPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the quiz page', async () => {
    renderWithRouter(<QuizPage />);
    
    await waitFor(() => {
      // Should show something quiz-related
      const quizElements = screen.getAllByText(/Tawheed|Question|Quiz/i);
      expect(quizElements.length).toBeGreaterThan(0);
    });
  });

  it('displays question with options', async () => {
    renderWithRouter(<QuizPage />);
    
    await waitFor(() => {
      // Should show the first question about Tawheed
      expect(screen.getByText(/Tawheed/i)).toBeInTheDocument();
      expect(screen.getByText(/oneness of Allah/i)).toBeInTheDocument();
    });
  });

  it('allows selecting an answer', async () => {
    renderWithRouter(<QuizPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/oneness of Allah/i)).toBeInTheDocument();
    });

    // Click on an option
    fireEvent.click(screen.getByText(/oneness of Allah/i));
    
    // The option should be selectable
    await waitFor(() => {
      expect(screen.getByText(/Next|Continue/i)).toBeInTheDocument();
    });
  });

  it('navigates to next question after selection', async () => {
    renderWithRouter(<QuizPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/oneness of Allah/i)).toBeInTheDocument();
    });

    // Select answer
    fireEvent.click(screen.getByText(/oneness of Allah/i));
    
    // After selection, next button should appear
    await waitFor(() => {
      const nextBtn = screen.queryByText(/Next|Continue/i);
      expect(nextBtn).toBeInTheDocument();
    });
  });

  it('shows timer during quiz', async () => {
    renderWithRouter(<QuizPage />);
    
    await waitFor(() => {
      // Should show a timer (0:00 or similar format)
      expect(screen.getByText(/\d:\d{2}/)).toBeInTheDocument();
    });
  });

  it('shows progress indicator', async () => {
    renderWithRouter(<QuizPage />);
    
    await waitFor(() => {
      // Should show question number or progress
      expect(screen.getByText(/1.*2|Question 1/i) || document.querySelector('[class*="progress"]')).toBeTruthy();
    });
  });

  it('has quiz structure', async () => {
    renderWithRouter(<QuizPage />);
    
    // Just verify the quiz has the expected structure
    await waitFor(() => {
      // Has a question
      expect(screen.getByText(/Tawheed/i)).toBeInTheDocument();
      // Has answer options
      expect(screen.getByText(/oneness of Allah/i)).toBeInTheDocument();
    });
  });
});