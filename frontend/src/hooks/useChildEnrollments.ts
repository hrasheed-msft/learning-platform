import { useCallback, useEffect, useState } from 'react';
import { courseService } from '@/services/courseService';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useFamilyStore } from '@/stores/familyStore';
import type { CourseEnrollment, ChildMember } from '@/types';

export function useChildEnrollments() {
  const { member: childMember } = useChildAuthStore();
  const { selectedMember } = useFamilyStore();

  // When a parent navigates into the /child/* tree, childAuthStore.member is null.
  // Fall back to the familyStore's selectedMember so pages work for both auth paths.
  const effectiveMemberId = childMember?.id ?? selectedMember?.id;
  const member: ChildMember | null = childMember ?? (
    selectedMember
      ? {
          id: selectedMember.id,
          name: selectedMember.name,
          ageCategory: selectedMember.ageCategory,
          avatarUrl: selectedMember.avatarUrl,
          familyId: selectedMember.familyId,
          age: selectedMember.age,
        }
      : null
  );

  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEnrollments = useCallback(async () => {
    if (!effectiveMemberId) {
      setEnrollments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await courseService.getEnrollments(effectiveMemberId);
      setEnrollments(data);
    } catch {
      setError('Could not load your courses right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [effectiveMemberId]);

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
