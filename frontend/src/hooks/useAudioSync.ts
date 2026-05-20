import { useState, useRef, useCallback, useEffect } from 'react';

export interface WordTimestamp {
  word: string;
  offset: number;   // ms from start
  duration: number; // ms
}

interface UseAudioSyncOptions {
  timestamps: WordTimestamp[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

interface UseAudioSyncReturn {
  currentWordIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (timeMs: number) => void;
}

/**
 * Binary search to find the active word index for a given time (ms).
 * Returns the index of the last timestamp whose offset <= currentTimeMs.
 */
function findWordIndex(timestamps: WordTimestamp[], currentTimeMs: number): number {
  if (timestamps.length === 0) return -1;

  let lo = 0;
  let hi = timestamps.length - 1;
  let result = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (timestamps[mid].offset <= currentTimeMs) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  // Check if we're still within the duration of the found word
  if (result >= 0) {
    const ts = timestamps[result];
    if (currentTimeMs > ts.offset + ts.duration) {
      // We're in a gap between words — still highlight the last word
      // until the next word starts
      if (result + 1 < timestamps.length && currentTimeMs < timestamps[result + 1].offset) {
        return result;
      }
      // Past last word's end with no next word
      if (result === timestamps.length - 1) {
        return currentTimeMs <= ts.offset + ts.duration + 200 ? result : -1;
      }
    }
  }

  return result;
}

export function useAudioSync({ timestamps, audioRef }: UseAudioSyncOptions): UseAudioSyncReturn {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) {
      rafRef.current = null;
      return;
    }

    const timeMs = audio.currentTime * 1000;
    setCurrentTime(audio.currentTime);

    const idx = findWordIndex(timestamps, timeMs);
    setCurrentWordIndex(idx);

    rafRef.current = requestAnimationFrame(tick);
  }, [timestamps, audioRef]);

  const startLoop = useCallback(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  // Sync with audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      startLoop();
    };
    const onPause = () => {
      setIsPlaying(false);
      stopLoop();
    };
    const onEnded = () => {
      setIsPlaying(false);
      stopLoop();
      setCurrentWordIndex(-1);
    };
    const onSeeked = () => {
      const timeMs = audio.currentTime * 1000;
      setCurrentTime(audio.currentTime);
      setCurrentWordIndex(findWordIndex(timestamps, timeMs));
    };
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('seeked', onSeeked);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('seeked', onSeeked);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      stopLoop();
    };
  }, [audioRef, timestamps, startLoop, stopLoop]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, [audioRef]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, [audioRef]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [audioRef]);

  const seek = useCallback((timeMs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = timeMs / 1000;
  }, [audioRef]);

  return {
    currentWordIndex,
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    togglePlayPause,
    seek,
  };
}
