import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import CourseLearner from '@/pages/courses/CourseLearner';
import { useCourseStore } from '@/stores';
import { useFamilyStore } from '@/stores/familyStore';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { courseService } from '@/services/courseService';

vi.mock('@/stores', () => ({
  useCourseStore: vi.fn(),
}));

vi.mock('@/stores/familyStore', () => ({
  useFamilyStore: vi.fn(),
}));

vi.mock('@/stores/childAuthStore', () => ({
  useChildAuthStore: vi.fn(),
}));

vi.mock('@/services/courseService', () => ({
  courseService: {
    getUnits: vi.fn(),
    getEnrollments: vi.fn(),
  },
}));

describe('CourseLearner', () => {
  function UnitPageProbe() {
    const { unitId } = useParams<{ unitId: string }>();
    return <div>Unit page: {unitId}</div>;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();

    vi.mocked(useCourseStore).mockReturnValue({
      selectedCourse: {
        id: 'course-1',
        title: 'Arabic Basics',
        description: 'Learn foundational Arabic vocabulary.',
        category: 'ARABIC',
        ageLevels: ['CHILD'],
        isPublished: true,
        orderIndex: 1,
      },
      fetchCourse: vi.fn().mockResolvedValue(undefined),
      enrollments: [],
      isLoading: false,
    } as any);

    vi.mocked(useFamilyStore).mockReturnValue({
      selectedMember: null,
    } as any);

    vi.mocked(useChildAuthStore).mockReturnValue({
      member: { id: 'member-1', name: 'Amina' },
    } as any);

    vi.mocked(courseService.getUnits).mockResolvedValue([
      { id: 'unit-1', title: 'Unit 1', description: 'First unit' },
      { id: 'unit-2', title: 'Unit 2', description: 'Second unit' },
      { id: 'unit-3', title: 'Unit 3', description: 'Third unit' },
    ] as any);

    vi.mocked(courseService.getEnrollments).mockResolvedValue([
      {
        id: 'enrollment-1',
        memberId: 'member-1',
        courseId: 'course-1',
        status: 'ACTIVE',
        progress: 33,
        startedAt: '2026-05-25T16:26:06-05:00',
        createdAt: '2026-05-25T16:26:06-05:00',
        updatedAt: '2026-05-25T16:26:06-05:00',
        unitProgress: [
          {
            id: 'progress-1',
            enrollmentId: 'enrollment-1',
            unitId: 'unit-1',
            videoCompleted: true,
            readingCompleted: true,
            quizCompleted: true,
          },
          {
            id: 'progress-2',
            enrollmentId: 'enrollment-1',
            unitId: 'unit-2',
            videoCompleted: true,
            readingCompleted: false,
            quizCompleted: false,
          },
        ],
      },
    ] as any);
  });

  it('highlights the next unit for a child learner and continues there', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/child/courses/course-1/learn',
            state: {
              memberId: 'member-1',
              enrollmentId: 'enrollment-1',
              enrollment: {
                id: 'enrollment-1',
                memberId: 'member-1',
                courseId: 'course-1',
                status: 'ACTIVE',
                progress: 33,
                startedAt: '2026-05-25T16:26:06-05:00',
                createdAt: '2026-05-25T16:26:06-05:00',
                updatedAt: '2026-05-25T16:26:06-05:00',
                unitProgress: [
                  {
                    id: 'progress-1',
                    enrollmentId: 'enrollment-1',
                    unitId: 'unit-1',
                    videoCompleted: true,
                    readingCompleted: true,
                    quizCompleted: true,
                  },
                  {
                    id: 'progress-2',
                    enrollmentId: 'enrollment-1',
                    unitId: 'unit-2',
                    videoCompleted: true,
                    readingCompleted: false,
                    quizCompleted: false,
                  },
                ],
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/child/courses/:courseId/learn" element={<CourseLearner />} />
          <Route path="/child/courses/:courseId/units/:unitId" element={<UnitPageProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/continue where you left off/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue learning/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));

    expect(await screen.findByText('Unit page: unit-2')).toBeInTheDocument();
  });

  it('prefers latest enrollment progress over stale route state when resuming', async () => {
    vi.mocked(useCourseStore).mockReturnValue({
      selectedCourse: {
        id: 'course-1',
        title: 'Arabic Basics',
        description: 'Learn foundational Arabic vocabulary.',
        category: 'ARABIC',
        ageLevels: ['CHILD'],
        isPublished: true,
        orderIndex: 1,
      },
      fetchCourse: vi.fn().mockResolvedValue(undefined),
      enrollments: [
        {
          id: 'enrollment-1',
          memberId: 'member-1',
          courseId: 'course-1',
          status: 'ACTIVE',
          progress: 0,
          startedAt: '2026-05-25T16:26:06-05:00',
          createdAt: '2026-05-25T16:26:06-05:00',
          updatedAt: '2026-05-25T16:26:06-05:00',
          unitProgress: [],
        },
      ],
      isLoading: false,
    } as any);

    vi.mocked(courseService.getEnrollments).mockResolvedValue([
      {
        id: 'enrollment-1',
        memberId: 'member-1',
        courseId: 'course-1',
        status: 'ACTIVE',
        progress: 66,
        startedAt: '2026-05-25T16:26:06-05:00',
        createdAt: '2026-05-25T16:26:06-05:00',
        updatedAt: '2026-05-25T16:26:06-05:00',
        unitProgress: [
          {
            id: 'progress-1',
            enrollmentId: 'enrollment-1',
            unitId: 'unit-1',
            videoCompleted: true,
            readingCompleted: true,
            quizCompleted: true,
          },
          {
            id: 'progress-2',
            enrollmentId: 'enrollment-1',
            unitId: 'unit-2',
            videoCompleted: true,
            readingCompleted: true,
            quizCompleted: false,
          },
        ],
      },
    ] as any);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/child/courses/course-1/learn',
            state: {
              memberId: 'member-1',
              enrollmentId: 'enrollment-1',
              enrollment: {
                id: 'enrollment-1',
                memberId: 'member-1',
                courseId: 'course-1',
                status: 'ACTIVE',
                progress: 0,
                startedAt: '2026-05-25T16:26:06-05:00',
                createdAt: '2026-05-25T16:26:06-05:00',
                updatedAt: '2026-05-25T16:26:06-05:00',
                unitProgress: [],
              },
            },
          },
        ]}
      >
        <Routes>
          <Route path="/child/courses/:courseId/learn" element={<CourseLearner />} />
          <Route path="/child/courses/:courseId/units/:unitId" element={<UnitPageProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(courseService.getEnrollments).toHaveBeenCalledWith('member-1');
    });

    const resumeBadge = await screen.findByText(/continue where you left off/i);
    const resumeRow = resumeBadge.closest('div');
    expect(resumeRow).not.toBeNull();
    expect(within(resumeRow as HTMLElement).getByText('Unit 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));

    expect(await screen.findByText('Unit page: unit-2')).toBeInTheDocument();
  });
});
