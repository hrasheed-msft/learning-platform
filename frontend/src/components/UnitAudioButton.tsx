import { useState, useCallback, useEffect } from 'react';
import { Volume2, Loader2, X } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import SyncedTextPlayer from './SyncedTextPlayer';
import { audioService, type AudioGenerationResponse, type WordTimestamp } from '@/services/audioService';

interface UnitAudioButtonProps {
  unitId: string;
  /** Whether unit has Arabic content */
  hasArabic?: boolean;
  /** Whether unit has English content */
  hasEnglish?: boolean;
  /** Optional text content to display with synced highlighting */
  unitText?: string;
}

type Language = 'ar' | 'en';

interface CachedAudio {
  url: string;
  duration: number;
}

interface CachedSyncedAudio {
  audioUrl: string;
  timestamps: WordTimestamp[];
  text: string;
}

export default function UnitAudioButton({
  unitId,
  hasArabic = true,
  hasEnglish = true,
  unitText,
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
            const text = unitText || result.timestamps.map(t => t.word).join(' ');
            setSyncedCache(prev => ({
              ...prev,
              [lang]: { audioUrl: result.audioUrl, timestamps: result.timestamps, text },
            }));
          }
        } catch {
          // Silent — synced mode is optional
        }
      }
    };
    prefetch();
  }, [unitId, hasEnglish, hasArabic, unitText]);

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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate audio';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [unitId, cache, syncedCache]);

  const handleClose = () => {
    setShowPlayer(false);
    setAudioData(null);
    setSyncedData(null);
    setError(null);
    setSelectedLang(null);
  };

  const isBilingual = hasArabic && hasEnglish;

  return (
    <div className="space-y-3">
      {/* Listen Button Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasEnglish && (
          <button
            onClick={() => handleListen('en')}
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
            onClick={() => handleListen('ar')}
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
            onClick={handleClose}
            className="ml-auto text-red-600 hover:text-red-800"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Synced Text Player — shown when timestamps are available */}
      {showPlayer && syncedData && !loading && !error && (
        <div className="relative">
          <SyncedTextPlayer
            audioUrl={syncedData.audioUrl}
            timestamps={syncedData.timestamps}
            text={syncedData.text}
            direction={selectedLang === 'ar' ? 'rtl' : 'ltr'}
          />
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition z-10"
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
