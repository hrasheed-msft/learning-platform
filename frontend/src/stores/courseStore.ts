import { create } from 'zustand';
import type { Course, CourseFilters, Unit, CourseEnrollment } from '@/types';
import { courseService } from '@/services/courseService';

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  units: Unit[];
  selectedUnit: Unit | null;
  enrollments: CourseEnrollment[];
  filters: CourseFilters;
  totalCourses: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCourses: (filters?: CourseFilters) => Promise<void>;
  fetchCourse: (courseId: string) => Promise<void>;
  fetchUnits: (courseId: string) => Promise<void>;
  fetchUnit: (courseId: string, unitId: string) => Promise<void>;
  fetchEnrollments: (memberId: string) => Promise<void>;
  fetchAllFamilyEnrollments: (memberIds: string[]) => Promise<void>;
  enrollMember: (memberId: string, courseId: string) => Promise<void>;
  unenrollMember: (enrollmentId: string) => Promise<void>;
  setFilters: (filters: Partial<CourseFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
  clearEnrollments: () => void;
}

const defaultFilters: CourseFilters = {
  page: 1,
  limit: 50,
};

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  selectedCourse: null,
  units: [],
  selectedUnit: null,
  enrollments: [],
  filters: defaultFilters,
  totalCourses: 0,
  isLoading: false,
  error: null,

  fetchCourses: async (filters?: CourseFilters) => {
    const currentFilters = filters || get().filters;
    set({ isLoading: true, error: null, filters: currentFilters });
    try {
      const response = await courseService.getCourses(currentFilters);
      set({
        courses: response.courses,
        totalCourses: response.total,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
        isLoading: false,
      });
    }
  },

  fetchCourse: async (courseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const course = await courseService.getCourse(courseId);
      set({ selectedCourse: course, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch course',
        isLoading: false,
      });
    }
  },

  fetchUnits: async (courseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const units = await courseService.getUnits(courseId);
      set({ units, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch units',
        isLoading: false,
      });
    }
  },

  fetchUnit: async (courseId: string, unitId: string) => {
    set({ isLoading: true, error: null });
    try {
      const unit = await courseService.getUnit(courseId, unitId);
      set({ selectedUnit: unit, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch unit',
        isLoading: false,
      });
    }
  },

  fetchEnrollments: async (memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      const newEnrollments = await courseService.getEnrollments(memberId);
      // Replace enrollments for this member, keep others
      set((state) => {
        const otherMemberEnrollments = state.enrollments.filter(e => e.memberId !== memberId);
        return {
          enrollments: [...otherMemberEnrollments, ...newEnrollments],
          isLoading: false,
        };
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch enrollments',
        isLoading: false,
      });
    }
  },

  fetchAllFamilyEnrollments: async (memberIds: string[]) => {
    set({ isLoading: true, error: null, enrollments: [] });
    try {
      const allEnrollments: CourseEnrollment[] = [];
      for (const memberId of memberIds) {
        const memberEnrollments = await courseService.getEnrollments(memberId);
        allEnrollments.push(...memberEnrollments);
      }
      set({ enrollments: allEnrollments, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch enrollments',
        isLoading: false,
      });
    }
  },

  enrollMember: async (memberId: string, courseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const enrollment = await courseService.enroll(memberId, courseId);
      set((state) => ({
        enrollments: [...state.enrollments, enrollment],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to enroll in course',
        isLoading: false,
      });
      throw error;
    }
  },

  unenrollMember: async (enrollmentId: string) => {
    set({ isLoading: true, error: null });
    try {
      await courseService.unenroll(enrollmentId);
      set((state) => ({
        enrollments: state.enrollments.filter((e) => e.id !== enrollmentId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to unenroll from course',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters: Partial<CourseFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearFilters: () => set({ filters: defaultFilters }),

  clearError: () => set({ error: null }),

  clearEnrollments: () => set({ enrollments: [] }),
}));
