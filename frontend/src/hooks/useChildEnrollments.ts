import { useCallback, useEffect, useState } from 'react';
import { courseService } from '@/services/courseService';
import { useChildAuthStore } from '@/stores/childAuthStore';
import type { CourseEnrollment } from '@/types';

export function useChildEnrollments() {
  const { member } = useChildAuthStore();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEnrollments = useCallback(async () => {
    if (!member?.id) {
      setEnrollments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await courseService.getEnrollments(member.id);
      setEnrollments(data);
    } catch {
      setError('Could not load your courses right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [member?.id]);

  useEffect(() => {
    void loadEnrollments();
  }, [loadEnrollments]);

  return {
    member,
    enrollments,
    isLoading,
    error,
    reload: loadEnrollments,
  };
}
