import { useState, useCallback, useEffect, useRef, type ChangeEvent, type MouseEvent } from 'react';
import { Volume2, Loader2, X, Play, Pause, RotateCcw } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { useAudioSync } from '@/hooks/useAudioSync';
import { audioService, type AudioGenerationResponse, type WordTimestamp } from '@/services/audioService';

interface UnitAudioButtonProps {
  unitId: string;
  /** Whether unit has Arabic content */
  hasArabic?: boolean;
  /** Whether unit has English content */
  hasEnglish?: boolean;
  onSyncStateChange?: (state: UnitAudioSyncState | null) => void;
}

export type Language = 'ar' | 'en';

export interface UnitAudioSyncState {
  language: Language;
  timestamps: WordTimestamp[];
  currentWordIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface CachedAudio {
  url: string;
  duration: number;
}

interface CachedSyncedAudio {
  audioUrl: string;
  timestamps: WordTimestamp[];
}

interface SyncedAudioControlsProps {
  audioUrl: string;
  timestamps: WordTimestamp[];
  language: Language;
  onSyncStateChange?: (state: UnitAudioSyncState | null) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function SyncedAudioControls({
  audioUrl,
  timestamps,
  language,
  onSyncStateChange,
}: SyncedAudioControlsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isRtl = language === 'ar';

  const stopAudioClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const {
    currentWordIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    seek,
  } = useAudioSync({ timestamps, audioRef });

  useEffect(() => {
    onSyncStateChange?.({
      language,
      timestamps,
      currentWordIndex,
      isPlaying,
      currentTime,
      duration,
    });
  }, [currentTime, currentWordIndex, duration, isPlaying, language, onSyncStateChange, timestamps]);

  useEffect(() => () => {
    onSyncStateChange?.(null);
  }, [onSyncStateChange]);

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    seek(parseFloat(event.target.value) * 1000);
  };

  const handleTogglePlay = (event: MouseEvent<HTMLButtonElement>) => {
    stopAudioClick(event);
    togglePlayPause();
  };

  const handleRestart = (event: MouseEvent<HTMLButtonElement>) => {
    stopAudioClick(event);
    seek(0);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm ${isRtl ? 'flex-row-reverse' : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      title="AI-generated audio"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        type="button"
        onClick={handleTogglePlay}
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>

      <button
        type="button"
        onClick={handleRestart}
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
        aria-label="Restart"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

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
        <div className={`flex justify-between mt-1 text-xs text-gray-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <span className="shrink-0 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
        AI Audio
      </span>
    </div>
  );
}

export default function UnitAudioButton({
  unitId,
  hasArabic = true,
  hasEnglish = true,
  onSyncStateChange,
}: UnitAudioButtonProps) {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<CachedAudio | null>(null);
  const [syncedData, setSyncedData] = useState<CachedSyncedAudio | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Cache per language so switching doesn't re-generate
  const [cache, setCache] = useState<Partial<Record<Language, CachedAudio>>>({});
  const [syncedCache, setSyncedCache] = useState<Partial<Record<Language, CachedSyncedAudio | null>>>({});

  // Try to pre-fetch timestamps on mount (non-blocking)
  useEffect(() => {
    const prefetch = async () => {
      const langs: Language[] = [];
      if (hasEnglish) langs.push('en');
      if (hasArabic) langs.push('ar');

      for (const lang of langs) {
        try {
          const result = await audioService.getAudioWithTimestamps(unitId, lang);
          if (result) {
            setSyncedCache(prev => ({
              ...prev,
              [lang]: { audioUrl: result.audioUrl, timestamps: result.timestamps },
            }));
          }
        } catch {
          // Silent — synced mode is optional
        }
      }
    };
    prefetch();
  }, [unitId, hasEnglish, hasArabic]);

  useEffect(() => {
    if (!showPlayer || !syncedData || loading || error || !selectedLang) {
      onSyncStateChange?.(null);
    }
  }, [error, loading, onSyncStateChange, selectedLang, showPlayer, syncedData]);

  const handleListen = useCallback(async (lang: Language) => {
    setError(null);

    // Check synced cache first — prefer synced view
    if (syncedCache[lang]) {
      setSyncedData(syncedCache[lang]!);
      setAudioData(null);
      setSelectedLang(lang);
      setShowPlayer(true);
      return;
    }

    // Check regular cache
    if (cache[lang]) {
      setAudioData(cache[lang]!);
      setSyncedData(null);
      setSelectedLang(lang);
      setShowPlayer(true);
      return;
    }

    setSelectedLang(lang);
    setLoading(true);
    setShowPlayer(true);

    try {
      const result: AudioGenerationResponse = await audioService.generateUnitAudio(unitId, lang);
      const cached = { url: result.url, duration: result.duration };
      setCache(prev => ({ ...prev, [lang]: cached }));
      setAudioData(cached);
      setSyncedData(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : 'Failed to generate audio');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [unitId, cache, syncedCache]);

  const handleListenClick = (lang: Language) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    void handleListen(lang);
  };

  const handleClose = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    setShowPlayer(false);
    setAudioData(null);
    setSyncedData(null);
    setError(null);
    setSelectedLang(null);
    onSyncStateChange?.(null);
  };

  const isBilingual = hasArabic && hasEnglish;

  return (
    <div className="space-y-3">
      {/* Listen Button Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasEnglish && (
          <button
            type="button"
            onClick={handleListenClick('en')}
            disabled={loading && selectedLang === 'en'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition
              ${selectedLang === 'en' && showPlayer
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="AI-generated audio"
          >
            {loading && selectedLang === 'en' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {isBilingual ? '🔊 Listen (English)' : '🔊 Listen'}
          </button>
        )}

        {hasArabic && (
          <button
            type="button"
            onClick={handleListenClick('ar')}
            disabled={loading && selectedLang === 'ar'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition
              ${selectedLang === 'ar' && showPlayer
                ? 'bg-secondary-100 text-secondary-700 border border-secondary-300'
                : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border border-secondary-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            dir="rtl"
            title="AI-generated audio"
          >
            {loading && selectedLang === 'ar' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            {isBilingual ? '🔊 استمع (عربي)' : '🔊 استمع'}
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && showPlayer && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-pulse">
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
          <span className="text-sm text-gray-600">Generating audio...</span>
        </div>
      )}

      {/* Error state */}
      {error && showPlayer && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm text-red-700">{error}</span>
          <button
            type="button"
            onClick={handleClose}
            className="ml-auto text-red-600 hover:text-red-800"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Synced audio controls — highlighting now happens in the main lesson content */}
      {showPlayer && syncedData && !loading && !error && selectedLang && (
        <div className="relative">
          <SyncedAudioControls
            audioUrl={syncedData.audioUrl}
            timestamps={syncedData.timestamps}
            language={selectedLang}
            onSyncStateChange={onSyncStateChange}
          />
          <button
            type="button"
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition"
            aria-label="Close player"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Regular Audio Player — fallback when no timestamps */}
      {showPlayer && audioData && !syncedData && !loading && !error && (
        <div className="relative">
          <AudioPlayer
            src={audioData.url}
            duration={audioData.duration}
            isRtl={selectedLang === 'ar'}
            onClose={handleClose}
          />
          <button
            type="button"
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition"
            aria-label="Close player"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="text-xs text-gray-400 mt-1 italic">AI-generated audio</p>
        </div>
      )}
    </div>
  );
}
