import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChildDashboard from '@/pages/dashboard/ChildDashboard';

// Mock useParams first
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ memberId: 'member-1' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock the stores
vi.mock('@/stores', () => ({
  useFamilyStore: vi.fn(() => ({
    members: [
      { id: 'member-1', name: 'Ahmed', age: 10, role: 'CHILD', avatar: null }
    ],
    fetchMembers: vi.fn(),
    isLoading: false,
  })),
  useCourseStore: vi.fn(() => ({
    enrollments: [
      { 
        id: 'enroll-1', 
        memberId: 'member-1', 
        courseId: 'course-1', 
        status: 'ACTIVE',
        progress: 60,
        course: { 
          id: 'course-1',
          title: 'Arabic Basics', 
          category: 'ARABIC',
          description: 'Learn Arabic alphabet'
        }
      },
      { 
        id: 'enroll-2', 
        memberId: 'member-1', 
        courseId: 'course-2', 
        status: 'ACTIVE',
        progress: 30,
        course: { 
          id: 'course-2',
          title: 'Stories of Prophets', 
          category: 'SEERAH',
          description: 'Islamic stories'
        }
      }
    ],
    fetchEnrollments: vi.fn(),
    isLoading: false,
  })),
  useAuthStore: vi.fn(() => ({
    family: { id: 'family-1' },
    user: { id: 'user-1', email: 'demo@example.com' }
  })),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ChildDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dashboard', async () => {
    renderWithRouter(<ChildDashboard />);
    
    await waitFor(() => {
      // Should render without crashing - use getAllByText since Ahmed appears in greeting
      const elements = screen.getAllByText(/Ahmed/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('displays greeting with member name', async () => {
    renderWithRouter(<ChildDashboard />);
    
    await waitFor(() => {
      // Use getByRole to find the heading with the name
      expect(screen.getByRole('heading', { name: /Assalamu Alaikum.*Ahmed/i })).toBeInTheDocument();
    });
  });

  it('shows enrolled courses', async () => {
    renderWithRouter(<ChildDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
      expect(screen.getByText(/Stories of Prophets/i)).toBeInTheDocument();
    });
  });

  it('displays stats section', async () => {
    renderWithRouter(<ChildDashboard />);
    
    await waitFor(() => {
      // Should show stats cards
      const statsElements = screen.getAllByText(/Courses|Streak|Active/i);
      expect(statsElements.length).toBeGreaterThan(0);
    });
  });

  it('shows continue learning section', async () => {
    renderWithRouter(<ChildDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/continue|learning|my courses/i)).toBeInTheDocument();
    });
  });
});
