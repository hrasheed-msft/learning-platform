import { useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAudioSync, type WordTimestamp } from '@/hooks/useAudioSync';

interface SyncedTextPlayerProps {
  audioUrl: string;
  timestamps: WordTimestamp[];
  text: string;
  direction?: 'ltr' | 'rtl';
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SyncedTextPlayer({
  audioUrl,
  timestamps,
  text,
  direction = 'ltr',
}: SyncedTextPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const isRtl = direction === 'rtl';

  const {
    currentWordIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seek,
  } = useAudioSync({ timestamps, audioRef });

  // Split text into words
  const words = text.split(/\s+/).filter(Boolean);

  // Auto-scroll to keep highlighted word visible
  useEffect(() => {
    if (currentWordIndex < 0 || currentWordIndex >= wordRefs.current.length) return;
    const wordEl = wordRefs.current[currentWordIndex];
    if (!wordEl || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const wordRect = wordEl.getBoundingClientRect();

    // Check if word is outside visible area
    const isAbove = wordRect.top < containerRect.top;
    const isBelow = wordRect.bottom > containerRect.bottom;

    if (isAbove || isBelow) {
      wordEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentWordIndex]);

  const handleWordClick = useCallback((index: number) => {
    if (index < timestamps.length) {
      seek(timestamps[index].offset);
    }
  }, [timestamps, seek]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeSec = parseFloat(e.target.value);
    seek(timeSec * 1000);
  };

  const handleRestart = () => {
    seek(0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Highlight colors
  const highlightClass = isRtl
    ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300'
    : 'bg-amber-100 text-amber-900 ring-1 ring-amber-300';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Text Display Area */}
      <div
        ref={containerRef}
        dir={direction}
        className={`p-6 max-h-64 overflow-y-auto leading-relaxed ${
          isRtl ? 'text-right font-arabic text-xl' : 'text-left text-base'
        }`}
      >
        <p className="flex flex-wrap gap-x-1.5 gap-y-1">
          {words.map((word, index) => {
            const isActive = index === currentWordIndex;
            return (
              <span
                key={index}
                ref={(el) => { wordRefs.current[index] = el; }}
                onClick={() => handleWordClick(index)}
                className={`
                  inline-block px-1 py-0.5 rounded cursor-pointer transition-all duration-150
                  ${isActive ? `${highlightClass} scale-105 font-semibold` : 'hover:bg-gray-100'}
                `}
                role="button"
                tabIndex={0}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Word: ${word}${isActive ? ' (currently playing)' : ''}`}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>

      {/* Controls */}
      <div className={`flex items-center gap-3 px-4 py-3 bg-gray-50 border-t border-gray-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <audio ref={audioRef} src={audioUrl} preload="metadata" />

        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Restart */}
        <button
          onClick={handleRestart}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition"
          aria-label="Restart"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Progress bar */}
        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={duration || 1}
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
          <div className={`flex justify-between mt-0.5 text-xs text-gray-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* AI disclaimer badge */}
        <span className="shrink-0 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
          AI Audio
        </span>
      </div>
    </div>
  );
}
