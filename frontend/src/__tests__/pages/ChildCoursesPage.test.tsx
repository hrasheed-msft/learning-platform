import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChildCoursesPage from '@/pages/child/ChildCoursesPage';
import { useChildEnrollments } from '@/hooks/useChildEnrollments';

vi.mock('@/hooks/useChildEnrollments', () => ({
  useChildEnrollments: vi.fn(),
}));

function renderPage() {
  return render(
    <BrowserRouter>
      <ChildCoursesPage />
    </BrowserRouter>,
  );
}

describe('ChildCoursesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the enrolled courses for the logged-in student', () => {
    vi.mocked(useChildEnrollments).mockReturnValue({
      member: { id: 'member-1', name: 'Amina', ageCategory: 'CHILD' },
      enrollments: [
        {
          id: 'enrollment-1',
          memberId: 'member-1',
          courseId: 'course-1',
          status: 'ACTIVE',
          progress: 40,
          startedAt: '2026-05-24T09:39:57.085-05:00',
          createdAt: '2026-05-24T09:39:57.085-05:00',
          updatedAt: '2026-05-24T09:39:57.085-05:00',
          course: {
            id: 'course-1',
            title: 'Arabic Basics',
            description: 'Learn foundational Arabic vocabulary.',
            category: 'ARABIC',
            ageLevels: ['CHILD'],
            isPublished: true,
          },
        },
      ],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Arabic Basics')).toBeInTheDocument();
    expect(screen.getByText(/40% complete/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue learning/i })).toHaveAttribute('href', '/child/courses/course-1/learn');
  });

  it('shows a helpful empty state when the student has no enrollments', () => {
    vi.mocked(useChildEnrollments).mockReturnValue({
      member: { id: 'member-1', name: 'Amina', ageCategory: 'CHILD' },
      enrollments: [],
      isLoading: false,
      error: null,
      reload: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/Amina do not have any courses yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Ask your parent to enroll you in a course/i)).toBeInTheDocument();
  });
});
