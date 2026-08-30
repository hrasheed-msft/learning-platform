import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ChildLayout from '@/components/layouts/ChildLayout';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useAuthStore } from '@/stores/authStore';
import { useFamilyStore } from '@/stores/familyStore';
import { authService } from '@/services/authService';

vi.mock('@/stores/childAuthStore', () => ({
  useChildAuthStore: vi.fn(),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/stores/familyStore', () => ({
  useFamilyStore: vi.fn(),
}));

vi.mock('@/services/authService', () => ({
  authService: {
    getParentPinStatus: vi.fn().mockResolvedValue({ hasPin: false }),
  },
}));

// ParentPinModal touches DOM in complex ways; keep it out of layout tests.
vi.mock('@/components/auth/ParentPinModal', () => ({
  default: () => null,
}));

function renderChildLayout() {
  return render(
    <MemoryRouter initialEntries={['/child/dashboard']}>
      <Routes>
        <Route path="/child/*" element={<ChildLayout />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ChildLayout — active member display', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(authService.getParentPinStatus).mockResolvedValue({ hasPin: false });
  });

  it('shows child name and age category when a child logs in directly', () => {
    vi.mocked(useChildAuthStore).mockReturnValue({
      member: { id: 'child-1', name: 'Amina', ageCategory: 'children' },
      logout: vi.fn(),
      isChildSession: true,
    } as any);

    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
    } as any);

    vi.mocked(useFamilyStore).mockReturnValue({
      isParentInStudentMode: false,
      selectedMember: null,
      setParentInStudentMode: vi.fn(),
      selectMember: vi.fn(),
    } as any);

    renderChildLayout();

    // Name appears in sidebar and top-bar — use getAllByText.
    const nameElements = screen.getAllByText('Amina');
    expect(nameElements.length).toBeGreaterThan(0);
    // Age category rendered as "Children" (title-cased).
    expect(screen.getByText('Children')).toBeInTheDocument();
    // Avatar initial in sidebar — "A" for Amina, not "S" for Student.
    const avatarInitials = screen.getAllByText('A');
    expect(avatarInitials.length).toBeGreaterThan(0);
  });

  it('shows child name and age category when a parent selects a child in student-mode', () => {
    // No direct child login — childAuthStore.member is null.
    vi.mocked(useChildAuthStore).mockReturnValue({
      member: null,
      logout: vi.fn(),
      isChildSession: false,
    } as any);

    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
    } as any);

    vi.mocked(useFamilyStore).mockReturnValue({
      isParentInStudentMode: true,
      selectedMember: { id: 'child-2', name: 'Ibrahim', ageCategory: 'children' },
      setParentInStudentMode: vi.fn(),
      selectMember: vi.fn(),
    } as any);

    renderChildLayout();

    // Must show the selected child's name in sidebar and/or top bar.
    const nameElements = screen.getAllByText('Ibrahim');
    expect(nameElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText('Children').length).toBeGreaterThan(0);

    // Avatar initial must be "I" (Ibrahim), not "S" (Student fallback).
    const avatarInitials = screen.getAllByText('I');
    expect(avatarInitials.length).toBeGreaterThan(0);
  });

  it('does NOT display "Student" for name or role when a parent is in student-mode', () => {
    vi.mocked(useChildAuthStore).mockReturnValue({
      member: null,
      logout: vi.fn(),
      isChildSession: false,
    } as any);

    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
    } as any);

    vi.mocked(useFamilyStore).mockReturnValue({
      isParentInStudentMode: true,
      selectedMember: { id: 'child-3', name: 'Fatimah', ageCategory: 'young_children' },
      setParentInStudentMode: vi.fn(),
      selectMember: vi.fn(),
    } as any);

    renderChildLayout();

    // "Student" must not appear as name or role.
    const studentElements = screen.queryAllByText('Student');
    expect(studentElements).toHaveLength(0);
  });

  it('shows the correct initial in the top-bar badge for a parent-selected child', () => {
    vi.mocked(useChildAuthStore).mockReturnValue({
      member: null,
      logout: vi.fn(),
      isChildSession: false,
    } as any);

    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
    } as any);

    vi.mocked(useFamilyStore).mockReturnValue({
      isParentInStudentMode: true,
      selectedMember: { id: 'child-4', name: 'Yusuf', ageCategory: 'teens' },
      setParentInStudentMode: vi.fn(),
      selectMember: vi.fn(),
    } as any);

    renderChildLayout();

    // Both sidebar avatar and top-bar badge show "Y" (Yusuf), not "S" (Student).
    const yInitials = screen.getAllByText('Y');
    // At least 2: sidebar avatar + top-bar badge.
    expect(yInitials.length).toBeGreaterThanOrEqual(2);
  });
});
