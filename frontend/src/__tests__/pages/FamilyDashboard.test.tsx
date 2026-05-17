import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FamilyDashboard from '@/pages/dashboard/FamilyDashboard';

// Mock the stores
const mockFetchMembers = vi.fn();
const mockFetchEnrollments = vi.fn();

vi.mock('@/stores', () => ({
  useAuthStore: vi.fn(() => ({
    family: { id: 'family-1', name: 'Test Family' },
    user: { id: 'user-1', email: 'test@example.com', name: 'Parent User' }
  })),
  useFamilyStore: vi.fn(() => ({
    members: [
      { id: 'member-1', name: 'Ahmed', age: 10, role: 'CHILD', ageCategory: 'CHILD_7_10', avatar: null },
      { id: 'member-2', name: 'Fatima', age: 8, role: 'CHILD', ageCategory: 'CHILD_7_10', avatar: null },
    ],
    fetchMembers: mockFetchMembers,
    isLoading: false,
  })),
  useCourseStore: vi.fn(() => ({
    enrollments: [
      { id: 'e1', memberId: 'member-1', courseId: 'c1', status: 'ACTIVE' },
      { id: 'e2', memberId: 'member-1', courseId: 'c2', status: 'ACTIVE' },
      { id: 'e3', memberId: 'member-2', courseId: 'c1', status: 'ACTIVE' },
    ],
    fetchEnrollments: mockFetchEnrollments,
    isLoading: false,
  })),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FamilyDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays dashboard heading', async () => {
    renderWithRouter(<FamilyDashboard />);
    
    await waitFor(() => {
      // Use getAllByText since multiple elements may match
      const elements = screen.getAllByText(/Family|Dashboard/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('fetches members on mount', async () => {
    renderWithRouter(<FamilyDashboard />);
    
    await waitFor(() => {
      expect(mockFetchMembers).toHaveBeenCalledWith('family-1');
    });
  });

  it('displays all family members', async () => {
    renderWithRouter(<FamilyDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Ahmed/i)).toBeInTheDocument();
      expect(screen.getByText(/Fatima/i)).toBeInTheDocument();
    });
  });

  it('shows stats cards', async () => {
    renderWithRouter(<FamilyDashboard />);
    
    await waitFor(() => {
      // Should show stats section with courses/members info
      const statsElements = screen.getAllByText(/Active|Courses|Members/i);
      expect(statsElements.length).toBeGreaterThan(0);
    });
  });

  it('displays member cards with links', async () => {
    renderWithRouter(<FamilyDashboard />);
    
    await waitFor(() => {
      const ahmadLink = screen.getByText(/Ahmed/i).closest('a') || screen.getByText(/Ahmed/i).parentElement?.querySelector('a');
      expect(ahmadLink).toBeTruthy();
    });
  });

  it('shows add member button', async () => {
    renderWithRouter(<FamilyDashboard />);
    
    await waitFor(() => {
      // Should show an add button or plus icon
      const addBtn = document.querySelector('[class*="plus"]') || screen.queryByText(/Add|New/i);
      expect(addBtn).toBeTruthy();
    });
  });
});
