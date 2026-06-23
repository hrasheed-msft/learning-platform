import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Repeat, SkipForward } from 'lucide-react';

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
 * Supports loop/repeat toggle, playback speed, and playlist (data-playlist) for sequential ayah playback.
 */
export default function QuranAudioPlayer({ audioEl }: QuranAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(!audioEl.paused);
  const [currentTime, setCurrentTime] = useState(audioEl.currentTime);
  const [duration, setDuration] = useState(isFinite(audioEl.duration) ? audioEl.duration : 0);
  const [loop, setLoop] = useState(audioEl.loop);
  const [playbackRate, setPlaybackRateState] = useState<SpeedOption>(
    isSpeedOption(audioEl.playbackRate) ? audioEl.playbackRate : 1,
  );

  // Playlist support: parse comma-separated URLs from data-playlist
  const playlistAttr = audioEl.dataset.playlist || '';
  const playlist = playlistAttr ? playlistAttr.split(',') : [];
  const hasPlaylist = playlist.length > 1;
  const [trackIndex, setTrackIndex] = useState(0);
  const trackIndexRef = useRef(0);

  useEffect(() => {
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      if (hasPlaylist && !audioEl.loop) {
        const nextIdx = trackIndexRef.current + 1;
        if (nextIdx < playlist.length) {
          trackIndexRef.current = nextIdx;
          setTrackIndex(nextIdx);
          const source = audioEl.querySelector('source');
          if (source) {
            source.src = playlist[nextIdx];
          } else {
            audioEl.src = playlist[nextIdx];
          }
          audioEl.load();
          audioEl.playbackRate = audioEl.playbackRate; // preserve speed
          audioEl.play().catch(() => {});
          return;
        } else if (loop) {
          // Loop the entire playlist from the beginning
          trackIndexRef.current = 0;
          setTrackIndex(0);
          const source = audioEl.querySelector('source');
          if (source) {
            source.src = playlist[0];
          } else {
            audioEl.src = playlist[0];
          }
          audioEl.load();
          audioEl.play().catch(() => {});
          return;
        }
      }
      setIsPlaying(false);
    };
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
  }, [audioEl, hasPlaylist, loop, playlist]);

  const togglePlay = useCallback(() => {
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
    } else {
      audioEl.pause();
    }
  }, [audioEl]);

  const restart = useCallback(() => {
    if (hasPlaylist) {
      // Restart from beginning of playlist
      trackIndexRef.current = 0;
      setTrackIndex(0);
      const source = audioEl.querySelector('source');
      if (source) {
        source.src = playlist[0];
      } else {
        audioEl.src = playlist[0];
      }
      audioEl.load();
      audioEl.playbackRate = audioEl.playbackRate;
      audioEl.play().catch(() => {});
    } else {
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {});
    }
  }, [audioEl, hasPlaylist, playlist]);

  const skipNext = useCallback(() => {
    if (!hasPlaylist) return;
    const nextIdx = trackIndexRef.current + 1;
    if (nextIdx < playlist.length) {
      trackIndexRef.current = nextIdx;
      setTrackIndex(nextIdx);
      const source = audioEl.querySelector('source');
      if (source) {
        source.src = playlist[nextIdx];
      } else {
        audioEl.src = playlist[nextIdx];
      }
      audioEl.load();
      audioEl.playbackRate = audioEl.playbackRate;
      audioEl.play().catch(() => {});
    }
  }, [audioEl, hasPlaylist, playlist]);

  const toggleLoop = useCallback(() => {
    const next = !loop;
    if (!hasPlaylist) {
      audioEl.loop = next;
    }
    setLoop(next);
  }, [audioEl, hasPlaylist, loop]);

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
      {/* Track indicator for playlists */}
      {hasPlaylist && (
        <div className="text-xs text-center text-amber-700 font-medium mb-2">
          Ayah {trackIndex + 1} of {playlist.length}
        </div>
      )}

      {/* Main controls row */}
      <div className="flex items-center gap-2">
        {/* Restart */}
        <button
          type="button"
          onClick={restart}
          className="w-9 h-9 flex items-center justify-center rounded-full text-amber-700 hover:bg-amber-100 transition-colors flex-shrink-0"
          aria-label={hasPlaylist ? 'Restart surah' : 'Restart ayah'}
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

        {/* Skip next (playlist only) */}
        {hasPlaylist && (
          <button
            type="button"
            onClick={skipNext}
            disabled={trackIndex >= playlist.length - 1}
            className="w-9 h-9 flex items-center justify-center rounded-full text-amber-700 hover:bg-amber-100 transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next ayah"
            title="Next ayah"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        )}

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
          title={loop ? (hasPlaylist ? 'Loop surah: ON' : 'Loop: ON') : (hasPlaylist ? 'Loop surah: OFF' : 'Loop: OFF')}
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
