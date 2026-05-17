import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MemberProgress from '@/pages/dashboard/MemberProgress';

// Mock react-router-dom useParams first
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ memberId: 'member-1' }),
  };
});

// Mock the stores
vi.mock('@/stores', () => ({
  useFamilyStore: vi.fn(() => ({
    members: [
      { id: 'member-1', name: 'Ahmed', age: 10, role: 'CHILD' }
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
        progress: 45,
        course: { title: 'Arabic Basics', category: 'ARABIC' }
      }
    ],
    fetchEnrollments: vi.fn(),
    isLoading: false,
  })),
  useAuthStore: vi.fn(() => ({
    family: { id: 'family-1' }
  })),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MemberProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the member progress page', async () => {
    renderWithRouter(<MemberProgress />);
    
    await waitFor(() => {
      // Should show something related to progress or member
      const progressElements = screen.getAllByText(/Progress|Ahmed|Courses/i);
      expect(progressElements.length).toBeGreaterThan(0);
    });
  });

  it('displays member name', async () => {
    renderWithRouter(<MemberProgress />);
    
    await waitFor(() => {
      expect(screen.getByText(/Ahmed/i)).toBeInTheDocument();
    });
  });

  it('shows enrolled course', async () => {
    renderWithRouter(<MemberProgress />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
    });
  });

  it('displays stats section', async () => {
    renderWithRouter(<MemberProgress />);
    
    await waitFor(() => {
      // Should show some stats
      const statsElements = screen.getAllByText(/Courses|Enrolled|Progress|Active/i);
      expect(statsElements.length).toBeGreaterThan(0);
    });
  });

  it('shows back link to dashboard', async () => {
    renderWithRouter(<MemberProgress />);
    
    await waitFor(() => {
      const backLink = document.querySelector('a[href*="dashboard"]') || screen.getByText(/back|dashboard/i);
      expect(backLink).toBeTruthy();
    });
  });
});
