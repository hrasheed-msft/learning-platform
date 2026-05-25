import { useRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAudioSync, type WordTimestamp } from '@/hooks/useAudioSync';

const timestamps: WordTimestamp[] = [
  { word: 'Hello', offset: 0, duration: 400 },
  { word: 'world', offset: 500, duration: 400 },
];

function TestHarness({ highlightOffsetMs = 1200 }: { highlightOffsetMs?: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentWordIndex } = useAudioSync({ timestamps, audioRef, highlightOffsetMs });

  return (
    <div>
      <audio ref={audioRef} data-testid="audio" />
      <span data-testid="word-index">{currentWordIndex}</span>
    </div>
  );
}

describe('useAudioSync', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  it('delays highlight progression by the configured offset', () => {
    render(<TestHarness />);

    const audio = screen.getByTestId('audio') as HTMLAudioElement;
    Object.defineProperty(audio, 'paused', { configurable: true, value: false });
    Object.defineProperty(audio, 'currentTime', { configurable: true, writable: true, value: 0.55 });

    act(() => {
      audio.dispatchEvent(new Event('timeupdate'));
    });

    expect(screen.getByTestId('word-index')).toHaveTextContent('0');
  });

  it('can disable the offset for exact timestamp matching', () => {
    render(<TestHarness highlightOffsetMs={0} />);

    const audio = screen.getByTestId('audio') as HTMLAudioElement;
    Object.defineProperty(audio, 'paused', { configurable: true, value: false });
    Object.defineProperty(audio, 'currentTime', { configurable: true, writable: true, value: 0.55 });

    act(() => {
      audio.dispatchEvent(new Event('timeupdate'));
    });

    expect(screen.getByTestId('word-index')).toHaveTextContent('1');
  });
});
