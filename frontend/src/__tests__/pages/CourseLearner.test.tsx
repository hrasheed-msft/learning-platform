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

  function getUnitRow(unitTitle: string) {
    const row = screen.getByText(unitTitle).closest('.flex.items-center.justify-between.p-4');
    expect(row).not.toBeNull();
    return row as HTMLElement;
  }

  async function expectResumeRow(unitTitle: string) {
    await screen.findByText(unitTitle);
    const row = getUnitRow(unitTitle);
    expect(within(row).getByText(/continue where you left off/i)).toBeInTheDocument();
    expect(row.className).toContain('bg-primary-50/60');
    return row;
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

    await expectResumeRow('Unit 2');
    expect(within(getUnitRow('Unit 1')).queryByText(/continue where you left off/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue learning/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));

    expect(await screen.findByText('Unit page: unit-2')).toBeInTheDocument();
  });

  it('keeps the highlighted resume row aligned with the continue CTA after stale route state refreshes', async () => {
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
        progress: 80,
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
            quizCompleted: true,
          },
          {
            id: 'progress-3',
            enrollmentId: 'enrollment-1',
            unitId: 'unit-3',
            videoCompleted: true,
            readingCompleted: false,
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

    await waitFor(() => {
      expect(courseService.getEnrollments).toHaveBeenCalledWith('member-1');
    });

    await expectResumeRow('Unit 3');
    expect(within(getUnitRow('Unit 2')).queryByText(/continue where you left off/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));

    expect(await screen.findByText('Unit page: unit-3')).toBeInTheDocument();
  });

  it('calls getEnrollments with selectedMember.id when parent is in student-mode (no direct child login)', async () => {
    // Parent navigated to /child/ route; childMember is null; selectedMember has the child.
    vi.mocked(useChildAuthStore).mockReturnValue({
      member: null,
    } as any);

    vi.mocked(useFamilyStore).mockReturnValue({
      selectedMember: { id: 'selected-child-99', name: 'Ibrahim' },
    } as any);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/child/courses/course-1/learn',
            state: {
              enrollmentId: 'enrollment-1',
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
      // Enrollment refresh must use the family-store selected member's id, not fall through to undefined.
      expect(courseService.getEnrollments).toHaveBeenCalledWith('selected-child-99');
    });
  });

  it('does not call getEnrollments when there is no active member identity at all', async () => {
    // No child session and no selectedMember → activeMemberId is undefined.
    vi.mocked(useChildAuthStore).mockReturnValue({
      member: null,
    } as any);

    vi.mocked(useFamilyStore).mockReturnValue({
      selectedMember: null,
    } as any);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/child/courses/course-1/learn',
            state: { enrollmentId: 'enrollment-1' },
          },
        ]}
      >
        <Routes>
          <Route path="/child/courses/:courseId/learn" element={<CourseLearner />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(courseService.getUnits).toHaveBeenCalled();
    });

    // No member → no getEnrollments call.
    expect(courseService.getEnrollments).not.toHaveBeenCalled();
  });

  it('never renders a Lock icon for completed units even if predecessor progress is missing', async () => {
    // Simulate a Quran-style course: 5 units, progress rows exist only for units 1, 3, 5
    // (units 2 and 4 are "missing"). Units 1, 3, 5 are completed; units 2 and 4 are future.
    // The fixed logic: isLocked = index>0 && !isUnitUnlockable(prev) && !isResumeTarget && !isCompleted
    // So unit 3 (completed) must not be locked even though unit 2 has no progress row.
    vi.mocked(courseService.getUnits).mockResolvedValue([
      { id: 'u1', title: 'Ayah 1', description: '' },
      { id: 'u2', title: 'Ayah 2', description: '' },
      { id: 'u3', title: 'Ayah 3', description: '' },
      { id: 'u4', title: 'Ayah 4', description: '' },
      { id: 'u5', title: 'Ayah 5', description: '' },
    ] as any);

    vi.mocked(courseService.getEnrollments).mockResolvedValue([
      {
        id: 'enrollment-1',
        memberId: 'member-1',
        courseId: 'course-1',
        status: 'ACTIVE',
        progress: 60,
        startedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        unitProgress: [
          { id: 'p1', enrollmentId: 'enrollment-1', unitId: 'u1', status: 'completed', updatedAt: '2026-01-01T01:00:00Z' },
          { id: 'p3', enrollmentId: 'enrollment-1', unitId: 'u3', status: 'completed', updatedAt: '2026-01-01T03:00:00Z' },
          { id: 'p5', enrollmentId: 'enrollment-1', unitId: 'u5', status: 'completed', updatedAt: '2026-01-01T05:00:00Z' },
        ],
      },
    ] as any);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/child/courses/course-1/learn',
            state: { memberId: 'member-1', enrollmentId: 'enrollment-1' },
          },
        ]}
      >
        <Routes>
          <Route path="/child/courses/:courseId/learn" element={<CourseLearner />} />
          <Route path="/child/courses/:courseId/units/:unitId" element={<UnitPageProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    // Wait for all five unit titles to appear.
    await screen.findByText('Ayah 1');
    await screen.findByText('Ayah 3');
    await screen.findByText('Ayah 5');

    // All three completed units must NOT show a lock icon — get rows by title text.
    const completedTitles = ['Ayah 1', 'Ayah 3', 'Ayah 5'];
    for (const title of completedTitles) {
      const row = screen
        .getByText(title)
        .closest('.flex.items-center.justify-between.p-4') as HTMLElement;
      expect(row).not.toBeNull();
      // A locked row has opacity-50 and no hover cursor; completed rows must not have it.
      expect(row.className).not.toContain('opacity-50');
    }
  });

  it('first unit is always unlocked regardless of enrollment state', async () => {
    // No enrollment at all — a brand-new learner.
    vi.mocked(courseService.getEnrollments).mockResolvedValue([]);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/child/courses/course-1/learn',
            state: { memberId: 'member-1' },
          },
        ]}
      >
        <Routes>
          <Route path="/child/courses/:courseId/learn" element={<CourseLearner />} />
          <Route path="/child/courses/:courseId/units/:unitId" element={<UnitPageProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText('Unit 1');

    const firstRow = screen
      .getByText('Unit 1')
      .closest('.flex.items-center.justify-between.p-4') as HTMLElement;
    expect(firstRow).not.toBeNull();
    expect(firstRow.className).not.toContain('opacity-50');
  });

  it('genuinely future units beyond the resume target remain locked', async () => {
    // 4 units: 1 complete, 2 in-progress (resume target), 3 unlocked (predecessor in_progress),
    // 4 locked (predecessor unit-3 has no progress).
    vi.mocked(courseService.getUnits).mockResolvedValue([
      { id: 'unit-1', title: 'Unit 1', description: 'First unit' },
      { id: 'unit-2', title: 'Unit 2', description: 'Second unit' },
      { id: 'unit-3', title: 'Unit 3', description: 'Third unit' },
      { id: 'unit-4', title: 'Unit 4', description: 'Fourth unit' },
    ] as any);

    vi.mocked(courseService.getEnrollments).mockResolvedValue([
      {
        id: 'enrollment-1',
        memberId: 'member-1',
        courseId: 'course-1',
        status: 'ACTIVE',
        progress: 25,
        startedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        unitProgress: [
          { id: 'p1', enrollmentId: 'enrollment-1', unitId: 'unit-1', status: 'completed', updatedAt: '2026-01-01T01:00:00Z' },
          { id: 'p2', enrollmentId: 'enrollment-1', unitId: 'unit-2', status: 'in_progress', updatedAt: '2026-01-01T02:00:00Z' },
        ],
      },
    ] as any);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/child/courses/course-1/learn',
            state: { memberId: 'member-1', enrollmentId: 'enrollment-1' },
          },
        ]}
      >
        <Routes>
          <Route path="/child/courses/:courseId/learn" element={<CourseLearner />} />
          <Route path="/child/courses/:courseId/units/:unitId" element={<UnitPageProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText('Unit 4');

    // Unit 3 predecessor is unit-2 (in_progress) → isUnitUnlockable=true → NOT locked.
    const unit3Row = screen
      .getByText('Unit 3')
      .closest('.flex.items-center.justify-between.p-4') as HTMLElement;
    expect(unit3Row).not.toBeNull();
    expect(unit3Row.className).not.toContain('opacity-50');

    // Unit 4 predecessor is unit-3 (no progress) → isUnitUnlockable=false → LOCKED.
    const unit4Row = screen
      .getByText('Unit 4')
      .closest('.flex.items-center.justify-between.p-4') as HTMLElement;
    expect(unit4Row).not.toBeNull();
    expect(unit4Row.className).toContain('opacity-50');
  });

  it('highlights the true resume target even when an earlier unit is unfinished', async () => {
    vi.mocked(courseService.getEnrollments).mockResolvedValue([
      {
        id: 'enrollment-1',
        memberId: 'member-1',
        courseId: 'course-1',
        status: 'ACTIVE',
        progress: 40,
        startedAt: '2026-05-25T16:26:06-05:00',
        createdAt: '2026-05-25T16:26:06-05:00',
        updatedAt: '2026-05-25T16:26:06-05:00',
        unitProgress: [
          {
            id: 'progress-1',
            enrollmentId: 'enrollment-1',
            unitId: 'unit-1',
            status: 'completed',
            updatedAt: '2026-05-25T16:26:06-05:00',
          },
          {
            id: 'progress-3',
            enrollmentId: 'enrollment-1',
            unitId: 'unit-3',
            status: 'in_progress',
            updatedAt: '2026-07-04T00:52:00-04:00',
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

    await expectResumeRow('Unit 3');
    expect(within(getUnitRow('Unit 2')).queryByText(/continue where you left off/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /continue learning/i }));

    expect(await screen.findByText('Unit page: unit-3')).toBeInTheDocument();
  });
});
