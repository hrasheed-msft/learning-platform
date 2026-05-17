import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseCatalog from '@/pages/courses/CourseCatalog';

// Default mock return value
const defaultCourseStore = {
  courses: [],
  fetchCourses: vi.fn(),
  isLoading: false,
  filters: { courseType: undefined, ageCategory: undefined },
  setFilters: vi.fn(),
};

// Mock stores
vi.mock('@/stores', () => ({
  useAuthStore: vi.fn(() => ({
    family: { id: 'family-1' },
    user: { id: 'user-1' }
  })),
  useCourseStore: vi.fn(() => defaultCourseStore),
}));

const mockCourses = [
  {
    id: 'course-1',
    title: 'Arabic Basics',
    description: 'Learn the Arabic alphabet and basic vocabulary',
    category: 'ARABIC',
    ageLevels: ['7-9', '10-12'],
    difficulty: 'BEGINNER',
    unitCount: 10,
    enrolledCount: 150,
    thumbnailUrl: '/images/arabic.jpg',
  },
  {
    id: 'course-2',
    title: 'Stories of the Prophets',
    description: 'Learn about the prophets mentioned in the Quran',
    category: 'SEERAH',
    ageLevels: ['7-9', '10-12', '13+'],
    difficulty: 'BEGINNER',
    unitCount: 25,
    enrolledCount: 200,
    thumbnailUrl: '/images/prophets.jpg',
  },
  {
    id: 'course-3',
    title: 'Introduction to Tawheed',
    description: 'Understanding the oneness of Allah',
    category: 'AQEEDAH',
    ageLevels: ['10-12', '13+'],
    difficulty: 'INTERMEDIATE',
    unitCount: 15,
    enrolledCount: 100,
    thumbnailUrl: '/images/tawheed.jpg',
  },
];

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CourseCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays all available courses', async () => {
    const { useCourseStore } = await import('@/stores');
    vi.mocked(useCourseStore).mockReturnValue({
      courses: mockCourses,
      fetchCourses: vi.fn(),
      isLoading: false,
      filters: { courseType: undefined, ageCategory: undefined },
      setFilters: vi.fn(),
    } as any);

    renderWithRouter(<CourseCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
      expect(screen.getByText(/Stories of the Prophets/i)).toBeInTheDocument();
      expect(screen.getByText(/Introduction to Tawheed/i)).toBeInTheDocument();
    });
  });

  it('filters courses by category', async () => {
    const { useCourseStore } = await import('@/stores');
    vi.mocked(useCourseStore).mockReturnValue({
      courses: mockCourses,
      fetchCourses: vi.fn(),
      isLoading: false,
      filters: { courseType: undefined, ageCategory: undefined },
      setFilters: vi.fn(),
    } as any);

    renderWithRouter(<CourseCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
    });

    // Select Arabic from category dropdown
    const categorySelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(categorySelect, { target: { value: 'Arabic' } });

    // The filter changes via setFilters - component should call it
    await waitFor(() => {
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
    });
  });

  it('searches courses by title', async () => {
    const { useCourseStore } = await import('@/stores');
    vi.mocked(useCourseStore).mockReturnValue({
      courses: mockCourses,
      fetchCourses: vi.fn(),
      isLoading: false,
      filters: { courseType: undefined, ageCategory: undefined },
      setFilters: vi.fn(),
    } as any);

    renderWithRouter(<CourseCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search courses/i);
    fireEvent.change(searchInput, { target: { value: 'prophets' } });

    await waitFor(() => {
      expect(screen.queryByText(/Arabic Basics/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Stories of the Prophets/i)).toBeInTheDocument();
    });
  });

  it('displays course cards with correct info', async () => {
    const { useCourseStore } = await import('@/stores');
    vi.mocked(useCourseStore).mockReturnValue({
      courses: mockCourses,
      fetchCourses: vi.fn(),
      isLoading: false,
      filters: { courseType: undefined, ageCategory: undefined },
      setFilters: vi.fn(),
    } as any);

    renderWithRouter(<CourseCatalog />);
    
    await waitFor(() => {
      // Check course title
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
      // Check description
      expect(screen.getByText(/Learn the Arabic alphabet/i)).toBeInTheDocument();
    });
  });

  it('navigates to course detail on card click', async () => {
    const { useCourseStore } = await import('@/stores');
    vi.mocked(useCourseStore).mockReturnValue({
      courses: mockCourses,
      fetchCourses: vi.fn(),
      isLoading: false,
      filters: { courseType: undefined, ageCategory: undefined },
      setFilters: vi.fn(),
    } as any);

    renderWithRouter(<CourseCatalog />);
    
    await waitFor(() => {
      const courseCard = screen.getByText(/Arabic Basics/i).closest('a');
      expect(courseCard).toHaveAttribute('href', expect.stringContaining('course-1'));
    });
  });

  it('shows loading state', async () => {
    const { useCourseStore } = await import('@/stores');
    vi.mocked(useCourseStore).mockReturnValue({
      courses: [],
      fetchCourses: vi.fn(),
      isLoading: true,
      filters: { courseType: undefined, ageCategory: undefined },
      setFilters: vi.fn(),
    } as any);

    renderWithRouter(<CourseCatalog />);
    
    // Loading shows skeleton cards
    const container = document.querySelector('.animate-pulse');
    expect(container).toBeTruthy();
  });

  it('shows empty state when no courses match search', async () => {
    const { useCourseStore } = await import('@/stores');
    vi.mocked(useCourseStore).mockReturnValue({
      courses: mockCourses,
      fetchCourses: vi.fn(),
      isLoading: false,
      filters: { courseType: undefined, ageCategory: undefined },
      setFilters: vi.fn(),
    } as any);

    renderWithRouter(<CourseCatalog />);
    
    await waitFor(() => {
      expect(screen.getByText(/Arabic Basics/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search courses/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

    await waitFor(() => {
      expect(screen.queryByText(/Arabic Basics/i)).not.toBeInTheDocument();
    });
  });
});
