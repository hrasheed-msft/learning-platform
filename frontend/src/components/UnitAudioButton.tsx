import { useState, useCallback } from 'react';
import { Volume2, Loader2, X } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { audioService, type AudioGenerationResponse } from '@/services/audioService';

interface UnitAudioButtonProps {
  unitId: string;
  /** Whether unit has Arabic content */
  hasArabic?: boolean;
  /** Whether unit has English content */
  hasEnglish?: boolean;
}

type Language = 'ar' | 'en';

interface CachedAudio {
  url: string;
  duration: number;
}

export default function UnitAudioButton({
  unitId,
  hasArabic = true,
  hasEnglish = true,
}: UnitAudioButtonProps) {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<CachedAudio | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Cache per language so switching doesn't re-generate
  const [cache, setCache] = useState<Partial<Record<Language, CachedAudio>>>({});

  const handleListen = useCallback(async (lang: Language) => {
    setError(null);

    // Check cache first
    if (cache[lang]) {
      setAudioData(cache[lang]!);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate audio';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [unitId, cache]);

  const handleClose = () => {
    setShowPlayer(false);
    setAudioData(null);
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

      {/* Audio Player */}
      {showPlayer && audioData && !loading && !error && (
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
