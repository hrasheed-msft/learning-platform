import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CourseDetail from '@/pages/courses/CourseDetail';

const mockFetchCourse = vi.fn();
const mockFetchUnits = vi.fn();
const mockEnrollMember = vi.fn();
const mockFetchMembers = vi.fn();

const members = [
  {
    id: 'member-1',
    familyId: 'family-1',
    name: 'Amina',
    age: 9,
    ageCategory: 'children',
    createdAt: '2026-05-24T09:29:31.355-05:00',
    isActive: true,
  },
  {
    id: 'member-2',
    familyId: 'family-1',
    name: 'Yusuf',
    age: 12,
    ageCategory: 'teens',
    createdAt: '2026-05-24T09:29:31.355-05:00',
    isActive: true,
  },
  {
    id: 'member-3',
    familyId: 'family-1',
    name: 'Maryam',
    age: 7,
    ageCategory: 'children',
    createdAt: '2026-05-24T09:29:31.355-05:00',
    isActive: true,
  },
];

const defaultCourseStore = {
  selectedCourse: {
    id: 'course-1',
    title: 'Foundations of Salah',
    description: 'Learn the essentials of prayer.',
    category: 'FIQH',
    ageLevels: ['CHILD'],
    unitCount: 3,
    enrolledCount: 2,
  },
  units: [],
  fetchCourse: mockFetchCourse,
  fetchUnits: mockFetchUnits,
  enrollMember: mockEnrollMember,
  isLoading: false,
};

const defaultFamilyStore = {
  members,
  selectedMember: members[0],
  fetchMembers: mockFetchMembers,
};

vi.mock('@/stores', () => ({
  useAuthStore: vi.fn(() => ({
    family: { id: 'family-1' },
  })),
  useCourseStore: vi.fn(() => defaultCourseStore),
  useFamilyStore: vi.fn(() => defaultFamilyStore),
}));

function renderCourseDetail() {
  return render(
    <MemoryRouter initialEntries={['/courses/course-1']}>
      <Routes>
        <Route path="/courses/:courseId" element={<CourseDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('CourseDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows all family members in the enrollment control even when a learner is already selected', async () => {
    const { useFamilyStore } = await import('@/stores');
    vi.mocked(useFamilyStore).mockReturnValue({
      ...defaultFamilyStore,
      selectedMember: members[0],
    } as any);

    renderCourseDetail();

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /family member/i })).toBeInTheDocument();
    });

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options.map((option) => option.textContent)).toEqual([
      'Amina (current learner)',
      'Yusuf',
      'Maryam',
    ]);
  });

  it('enrolls the member chosen in the dropdown', async () => {
    const { useCourseStore, useFamilyStore } = await import('@/stores');
    vi.mocked(useFamilyStore).mockReturnValue({
      ...defaultFamilyStore,
      selectedMember: members[0],
    } as any);
    vi.mocked(useCourseStore).mockReturnValue({
      ...defaultCourseStore,
      enrollMember: mockEnrollMember,
    } as any);

    renderCourseDetail();

    const select = await screen.findByRole('combobox', { name: /family member/i });
    fireEvent.change(select, { target: { value: 'member-3' } });
    fireEvent.click(screen.getByRole('button', { name: /enroll now/i }));

    await waitFor(() => {
      expect(mockEnrollMember).toHaveBeenCalledWith('member-3', 'course-1');
    });
  });
});
