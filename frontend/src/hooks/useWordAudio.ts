import { useEffect, type RefObject } from 'react';

let current: HTMLAudioElement | null = null;

function play(src: string) {
  current?.pause();
  const audio = new Audio(src);
  current = audio;
  void audio.play().catch(() => {
    // Autoplay restrictions or a missing file: nothing to do for a pronunciation clip
  });
}

/**
 * Makes `[data-audio]` elements inside lesson HTML playable: a click (or Enter / Space)
 * plays the clip at the element's `data-audio` URL. Only one clip plays at a time.
 */
export function useWordAudio(containerRef: RefObject<HTMLElement>, enabled: boolean, contentKey: unknown) {
  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    const trigger = (target: EventTarget | null) => {
      const el = (target as HTMLElement | null)?.closest<HTMLElement>('[data-audio]');
      if (el?.dataset.audio && container.contains(el)) {
        play(el.dataset.audio);
        return true;
      }
      return false;
    };

    const onClick = (event: MouseEvent) => {
      trigger(event.target);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && trigger(event.target)) {
        event.preventDefault();
      }
    };

    container.addEventListener('click', onClick);
    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('click', onClick);
      container.removeEventListener('keydown', onKeyDown);
      current?.pause();
    };
  }, [containerRef, enabled, contentKey]);
}
