import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useWordAudio } from '@/hooks/useWordAudio';

function Harness({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useWordAudio(ref, enabled, 'content');
  return (
    <div ref={ref}>
      <div data-audio="/audio/nuraniyyah/cd01-004.mp3" role="button" tabIndex={0}>
        <span data-testid="inner">ب</span>
      </div>
      <p data-testid="plain">no audio</p>
    </div>
  );
}

describe('useWordAudio', () => {
  const play = vi.fn(() => Promise.resolve());
  const pause = vi.fn();
  const created: string[] = [];

  beforeEach(() => {
    play.mockClear();
    pause.mockClear();
    created.length = 0;
    vi.stubGlobal(
      'Audio',
      class {
        constructor(src: string) {
          created.push(src);
        }
        play = play;
        pause = pause;
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('plays the clip when a [data-audio] element (or a child) is clicked', () => {
    const { getByTestId } = render(<Harness />);
    fireEvent.click(getByTestId('inner'));
    expect(created).toEqual(['/audio/nuraniyyah/cd01-004.mp3']);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('plays on Enter and ignores clicks elsewhere', () => {
    const { getByRole, getByTestId } = render(<Harness />);
    fireEvent.click(getByTestId('plain'));
    expect(play).not.toHaveBeenCalled();
    fireEvent.keyDown(getByRole('button'), { key: 'Enter' });
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('stops the previous clip before playing the next one', () => {
    const { getByTestId } = render(<Harness />);
    fireEvent.click(getByTestId('inner'));
    fireEvent.click(getByTestId('inner'));
    expect(pause).toHaveBeenCalled();
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('does nothing while disabled', () => {
    const { getByTestId } = render(<Harness enabled={false} />);
    fireEvent.click(getByTestId('inner'));
    expect(play).not.toHaveBeenCalled();
  });
});
