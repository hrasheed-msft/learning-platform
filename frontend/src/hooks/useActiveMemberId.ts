import { useEffect } from 'react';
import { useFamilyStore } from '@/stores/familyStore';
import { useAuthStore } from '@/stores/authStore';

/**
 * Returns the active family member ID, falling back to the first member
 * if no member has been explicitly selected. Ensures members are fetched
 * if they haven't been loaded yet.
 */
export function useActiveMemberId(): string | undefined {
  const { selectedMember, members, fetchMembers } = useFamilyStore();

  useEffect(() => {
    if (members.length === 0) {
      const family = useAuthStore.getState().family;
      if (family?.id) fetchMembers(family.id);
    }
  }, [members.length, fetchMembers]);

  return selectedMember?.id || members[0]?.id;
}
