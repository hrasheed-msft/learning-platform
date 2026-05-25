import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';
import { usePlaybackSpeed } from '@/hooks/usePlaybackSpeed';

interface AudioPlayerProps {
  src: string;
  duration?: number;
  isRtl?: boolean;
  onClose?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ src, duration, isRtl = false, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [error, setError] = useState(false);
  const { playbackRateLabel, cyclePlaybackRate } = usePlaybackSpeed({
    audioRef,
    sourceKey: src,
  });

  const stopAudioClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };
    const onEnded = () => setIsPlaying(false);
    const onError = () => setError(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [src]);

  const togglePlay = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    stopAudioClick(event);

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setError(true));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleCycleSpeed = (event: MouseEvent<HTMLButtonElement>) => {
    stopAudioClick(event);
    cyclePlaybackRate();
  };

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <p className="text-sm text-red-700">Failed to load audio. Please try again.</p>
        {onClose && (
          <button
            type="button"
            onClick={(event) => {
              stopAudioClick(event);
              onClose();
            }}
            className="ml-auto text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Dismiss
          </button>
        )}
      </div>
    );
  }

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      title="AI-generated audio"
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Progress Section */}
      <div className="flex-1 min-w-0">
        <input
          type="range"
          min={0}
          max={totalDuration || 1}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary-600
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600"
          style={{
            background: `linear-gradient(to ${isRtl ? 'left' : 'right'}, rgb(var(--color-primary-600, 79 70 229)) ${progress}%, #e5e7eb ${progress}%)`,
          }}
          aria-label="Audio progress"
        />
        <div className={`flex justify-between mt-1 text-xs text-gray-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Speed Control */}
      <button
        type="button"
        onClick={handleCycleSpeed}
        className="shrink-0 px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
        aria-label={`Playback speed: ${playbackRateLabel}`}
        title="Change playback speed"
      >
        {playbackRateLabel}
      </button>

      {/* Volume indicator */}
      <Volume2 className="w-4 h-4 text-gray-400 shrink-0" />
    </div>
  );
}
