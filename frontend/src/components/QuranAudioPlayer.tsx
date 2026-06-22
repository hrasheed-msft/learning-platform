import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Repeat } from 'lucide-react';

interface QuranAudioPlayerProps {
  audioEl: HTMLAudioElement;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5] as const;
type SpeedOption = typeof SPEED_OPTIONS[number];

function isSpeedOption(v: number): v is SpeedOption {
  return (SPEED_OPTIONS as readonly number[]).includes(v);
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Custom audio player for Quran memorization units.
 * Mounts directly onto an existing <audio> DOM element.
 * Supports loop/repeat toggle and per-ayah playback speed.
 */
export default function QuranAudioPlayer({ audioEl }: QuranAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(!audioEl.paused);
  const [currentTime, setCurrentTime] = useState(audioEl.currentTime);
  const [duration, setDuration] = useState(isFinite(audioEl.duration) ? audioEl.duration : 0);
  const [loop, setLoop] = useState(audioEl.loop);
  const [playbackRate, setPlaybackRateState] = useState<SpeedOption>(
    isSpeedOption(audioEl.playbackRate) ? audioEl.playbackRate : 1,
  );

  useEffect(() => {
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audioEl.currentTime);
    const onDurationChange = () => {
      if (isFinite(audioEl.duration)) setDuration(audioEl.duration);
    };
    const onLoadedMetadata = () => {
      if (isFinite(audioEl.duration)) setDuration(audioEl.duration);
    };

    audioEl.addEventListener('play', onPlay);
    audioEl.addEventListener('pause', onPause);
    audioEl.addEventListener('ended', onEnded);
    audioEl.addEventListener('timeupdate', onTimeUpdate);
    audioEl.addEventListener('durationchange', onDurationChange);
    audioEl.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audioEl.removeEventListener('play', onPlay);
      audioEl.removeEventListener('pause', onPause);
      audioEl.removeEventListener('ended', onEnded);
      audioEl.removeEventListener('timeupdate', onTimeUpdate);
      audioEl.removeEventListener('durationchange', onDurationChange);
      audioEl.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [audioEl]);

  const togglePlay = useCallback(() => {
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
    } else {
      audioEl.pause();
    }
  }, [audioEl]);

  const restart = useCallback(() => {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  }, [audioEl]);

  const toggleLoop = useCallback(() => {
    const next = !audioEl.loop;
    audioEl.loop = next;
    setLoop(next);
  }, [audioEl]);

  const handleSpeedChange = useCallback(
    (speed: SpeedOption) => {
      audioEl.playbackRate = speed;
      setPlaybackRateState(speed);
    },
    [audioEl],
  );

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      audioEl.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [audioEl],
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="quran-audio-player mt-3 p-3 bg-white border border-amber-200 rounded-xl shadow-sm"
      dir="ltr"
      aria-label="Quran audio player"
    >
      {/* Main controls row */}
      <div className="flex items-center gap-2">
        {/* Restart */}
        <button
          type="button"
          onClick={restart}
          className="w-9 h-9 flex items-center justify-center rounded-full text-amber-700 hover:bg-amber-100 transition-colors flex-shrink-0"
          aria-label="Restart ayah"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Play / Pause — large touch target for children */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-600 text-white hover:bg-amber-700 active:scale-95 transition-all shadow-sm flex-shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>

        {/* Seek bar + timestamps */}
        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #d97706 ${progress}%, #e5e7eb ${progress}%)`,
            }}
            aria-label="Seek"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 select-none">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Loop toggle */}
        <button
          type="button"
          onClick={toggleLoop}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all flex-shrink-0 ${
            loop
              ? 'bg-green-100 text-green-700 ring-2 ring-green-400 shadow-sm'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
          aria-label={loop ? 'Loop on — tap to disable' : 'Loop off — tap to enable'}
          aria-pressed={loop}
          title={loop ? 'Loop: ON' : 'Loop: OFF'}
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Playback speed row */}
      <div className="flex items-center gap-1.5 mt-2.5 justify-center flex-wrap">
        <span className="text-xs font-medium text-gray-500 mr-0.5">Speed:</span>
        {SPEED_OPTIONS.map((speed) => (
          <button
            key={speed}
            type="button"
            onClick={() => handleSpeedChange(speed)}
            className={`min-w-[2.75rem] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              playbackRate === speed
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
            aria-label={`Set speed to ${speed}×`}
            aria-pressed={playbackRate === speed}
          >
            {speed}×
          </button>
        ))}
      </div>
    </div>
  );
}
