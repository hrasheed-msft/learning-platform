import { useState } from 'react';

export const NURANIYYAH_TRANSLITERATIONS_STORAGE_KEY = 'nuraniyyah-show-transliterations';

export function useNuraniyyahTransliterations() {
  const [showTransliterations, setShowTransliterations] = useState(() => {
    try {
      return window.localStorage.getItem(NURANIYYAH_TRANSLITERATIONS_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleTransliterations = () => {
    const nextValue = !showTransliterations;
    setShowTransliterations(nextValue);
    try {
      window.localStorage.setItem(NURANIYYAH_TRANSLITERATIONS_STORAGE_KEY, String(nextValue));
    } catch {
      // The control still works when browser storage is unavailable.
    }
  };

  return { showTransliterations, toggleTransliterations };
}
