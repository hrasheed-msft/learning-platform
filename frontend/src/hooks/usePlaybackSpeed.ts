import { useCallback, useEffect, useState, type RefObject } from 'react';

export const AUDIO_PLAYBACK_SPEED_STORAGE_KEY = 'unit-audio-playback-rate';
export const AUDIO_PLAYBACK_SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2] as const;
export const DEFAULT_AUDIO_PLAYBACK_SPEED = 1;

export type AudioPlaybackSpeed = typeof AUDIO_PLAYBACK_SPEED_OPTIONS[number];

function isPlaybackSpeed(value: number): value is AudioPlaybackSpeed {
  return AUDIO_PLAYBACK_SPEED_OPTIONS.includes(value as AudioPlaybackSpeed);
}

function getStoredPlaybackSpeed(): AudioPlaybackSpeed {
  if (typeof window === 'undefined') {
    return DEFAULT_AUDIO_PLAYBACK_SPEED;
  }

  const storedValue = Number(window.localStorage.getItem(AUDIO_PLAYBACK_SPEED_STORAGE_KEY));
  return isPlaybackSpeed(storedValue) ? storedValue : DEFAULT_AUDIO_PLAYBACK_SPEED;
}

export function formatPlaybackSpeed(playbackRate: AudioPlaybackSpeed): string {
  return `${playbackRate}x`;
}

interface UsePlaybackSpeedOptions {
  audioRef: RefObject<HTMLAudioElement | null>;
  sourceKey: string;
}

export function usePlaybackSpeed({ audioRef, sourceKey }: UsePlaybackSpeedOptions) {
  const [playbackRate, setPlaybackRateState] = useState<AudioPlaybackSpeed>(() => getStoredPlaybackSpeed());

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.playbackRate = playbackRate;
  }, [audioRef, playbackRate, sourceKey]);

  const setPlaybackRate = useCallback((nextPlaybackRate: AudioPlaybackSpeed) => {
    setPlaybackRateState(nextPlaybackRate);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUDIO_PLAYBACK_SPEED_STORAGE_KEY, String(nextPlaybackRate));
    }

    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = nextPlaybackRate;
    }
  }, [audioRef]);

  const cyclePlaybackRate = useCallback(() => {
    const currentIndex = AUDIO_PLAYBACK_SPEED_OPTIONS.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % AUDIO_PLAYBACK_SPEED_OPTIONS.length;
    setPlaybackRate(AUDIO_PLAYBACK_SPEED_OPTIONS[nextIndex]);
  }, [playbackRate, setPlaybackRate]);

  return {
    playbackRate,
    playbackRateLabel: formatPlaybackSpeed(playbackRate),
    setPlaybackRate,
    cyclePlaybackRate,
  };
}
