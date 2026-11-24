import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NURANIYYAH_TRANSLITERATIONS_STORAGE_KEY, useNuraniyyahTransliterations } from '@/hooks/useNuraniyyahTransliterations';

describe('useNuraniyyahTransliterations', () => {
  beforeEach(() => {
    vi.mocked(window.localStorage.getItem).mockReset().mockReturnValue(null);
    vi.mocked(window.localStorage.setItem).mockReset();
  });

  it('defaults off and persists both toggle directions', () => {
    const { result } = renderHook(useNuraniyyahTransliterations);
    expect(result.current.showTransliterations).toBe(false);

    act(() => result.current.toggleTransliterations());
    expect(result.current.showTransliterations).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenLastCalledWith(NURANIYYAH_TRANSLITERATIONS_STORAGE_KEY, 'true');

    act(() => result.current.toggleTransliterations());
    expect(result.current.showTransliterations).toBe(false);
    expect(window.localStorage.setItem).toHaveBeenLastCalledWith(NURANIYYAH_TRANSLITERATIONS_STORAGE_KEY, 'false');
  });

  it('restores an explicit opt-in, but not an invalid stored value', () => {
    vi.mocked(window.localStorage.getItem).mockReturnValue('true');
    const optedIn = renderHook(useNuraniyyahTransliterations);
    expect(optedIn.result.current.showTransliterations).toBe(true);
    optedIn.unmount();

    vi.mocked(window.localStorage.getItem).mockReturnValue('invalid');
    const invalid = renderHook(useNuraniyyahTransliterations);
    expect(invalid.result.current.showTransliterations).toBe(false);
  });

  it('works without accessible browser storage', () => {
    vi.mocked(window.localStorage.getItem).mockImplementation(() => { throw new Error('Blocked'); });
    vi.mocked(window.localStorage.setItem).mockImplementation(() => { throw new Error('Blocked'); });
    const { result } = renderHook(useNuraniyyahTransliterations);

    expect(result.current.showTransliterations).toBe(false);
    act(() => result.current.toggleTransliterations());
    expect(result.current.showTransliterations).toBe(true);
  });
});
