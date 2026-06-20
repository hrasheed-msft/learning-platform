import api from './api';
import type {
  Course,
  CourseFilters,
  CourseListResponse,
  Unit,
  CourseEnrollment,
} from '@/types';

// Backend response wrapper type
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Backend pagination structure
interface BackendCourseListResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const courseService = {
  async getCourses(filters?: CourseFilters): Promise<CourseListResponse> {
    const response = await api.get<ApiResponse<BackendCourseListResponse>>('/courses', { params: filters });
    const data = response.data.data;
    // Transform backend response to frontend expected format
    return {
      courses: data.courses,
      total: data.pagination.total,
      page: data.pagination.page,
      limit: data.pagination.limit,
    };
  },

  async getCourse(courseId: string): Promise<Course> {
    const response = await api.get<ApiResponse<Course>>(`/courses/${courseId}`);
    return response.data.data;
  },

  async getUnits(courseId: string): Promise<Unit[]> {
    const response = await api.get<ApiResponse<Unit[]>>(`/courses/${courseId}/units`);
    return response.data.data;
  },

  async getUnit(courseId: string, unitId: string): Promise<Unit> {
    const response = await api.get<ApiResponse<Unit>>(`/courses/${courseId}/units/${unitId}`);
    return response.data.data;
  },

  async getEnrollments(memberId: string): Promise<CourseEnrollment[]> {
    const response = await api.get<ApiResponse<CourseEnrollment[]>>(
      `/courses/enrollments/member/${memberId}`
    );
    return response.data.data;
  },

  async enroll(memberId: string, courseId: string): Promise<CourseEnrollment> {
    const response = await api.post<ApiResponse<CourseEnrollment>>('/courses/enrollments', {
      memberId,
      courseId,
    });
    return response.data.data;
  },

  async unenroll(enrollmentId: string): Promise<void> {
    await api.delete(`/courses/enrollments/${enrollmentId}`);
  },

  async updateProgress(unitId: string, progress: {
    videoCompleted?: boolean;
    readingCompleted?: boolean;
    quizCompleted?: boolean;
  }): Promise<void> {
    await api.post('/courses/progress', {
      unitId,
      ...progress,
    });
  },

  async getMemberProgress(memberId: string): Promise<unknown> {
    const response = await api.get<ApiResponse<unknown>>(`/courses/progress/member/${memberId}`);
    return response.data.data;
  },

  async getUnitProgress(memberId: string, unitId: string): Promise<{ videoCompleted: boolean; readingCompleted: boolean; quizCompleted: boolean } | null> {
    interface UnitProgressRecord {
      unitId: string;
      videoCompleted: boolean;
      readingCompleted: boolean;
      quizCompleted: boolean;
    }
    interface CourseProgressRecord {
      courseId: string;
      unitProgress: UnitProgressRecord[];
    }
    const response = await api.get<ApiResponse<CourseProgressRecord[]>>(`/courses/progress/member/${memberId}`);
    const courses = response.data.data;
    for (const course of courses) {
      const found = course.unitProgress.find(up => up.unitId === unitId);
      if (found) return { videoCompleted: found.videoCompleted, readingCompleted: found.readingCompleted, quizCompleted: found.quizCompleted };
    }
    return null;
  },
};
