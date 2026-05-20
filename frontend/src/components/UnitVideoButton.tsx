import { useState, useCallback, useEffect, useRef } from 'react';
import { Film, Loader2, X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { videoService, type VideoStatusResponse } from '@/services/videoService';

interface UnitVideoButtonProps {
  unitId: string;
  hasArabic?: boolean;
  hasEnglish?: boolean;
}

type Language = 'ar' | 'en';
type VideoState = 'idle' | 'generating' | 'ready' | 'error';

export default function UnitVideoButton({
  unitId,
  hasArabic = true,
  hasEnglish = true,
}: UnitVideoButtonProps) {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [videoState, setVideoState] = useState<VideoState>('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  // Cache per language
  const [cache, setCache] = useState<Partial<Record<Language, string>>>({});

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = useCallback((lang: Language) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      try {
        const result: VideoStatusResponse = await videoService.checkVideoStatus(unitId, lang);
        if (result.status === 'ready' && result.url) {
          setVideoState('ready');
          setVideoUrl(result.url);
          setCache(prev => ({ ...prev, [lang]: result.url }));
          setShowPlayer(true);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // Continue polling on transient errors
      }
    }, 5000);
  }, [unitId]);

  const handleWatch = useCallback(async (lang: Language) => {
    setError(null);
    setSelectedLang(lang);

    // Check cache first
    if (cache[lang]) {
      setVideoUrl(cache[lang]!);
      setVideoState('ready');
      setShowPlayer(true);
      return;
    }

    setVideoState('generating');

    try {
      const result: VideoStatusResponse = await videoService.generateUnitVideo(unitId, lang);

      if (result.status === 'ready' && result.url) {
        setVideoState('ready');
        setVideoUrl(result.url);
        setCache(prev => ({ ...prev, [lang]: result.url }));
        setShowPlayer(true);
      } else {
        // Video is being generated — start polling
        setEstimatedTime(result.estimatedTime || null);
        startPolling(lang);
      }
    } catch (err) {
      setVideoState('error');
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    }
  }, [unitId, cache, startPolling]);

  const handleClose = () => {
    setShowPlayer(false);
    setVideoUrl(null);
    setVideoState('idle');
    setError(null);
    setSelectedLang(null);
    setEstimatedTime(null);
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const isBilingual = hasArabic && hasEnglish;

  return (
    <div className="space-y-3">
      {/* Watch Button Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasEnglish && (
          <button
            onClick={() => handleWatch('en')}
            disabled={videoState === 'generating' && selectedLang === 'en'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition
              ${selectedLang === 'en' && showPlayer
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="AI-generated video"
          >
            {videoState === 'generating' && selectedLang === 'en' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Film className="w-4 h-4" />
            )}
            {isBilingual ? '🎬 Watch (English)' : '🎬 Watch'}
          </button>
        )}

        {hasArabic && (
          <button
            onClick={() => handleWatch('ar')}
            disabled={videoState === 'generating' && selectedLang === 'ar'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition
              ${selectedLang === 'ar' && showPlayer
                ? 'bg-secondary-100 text-secondary-700 border border-secondary-300'
                : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border border-secondary-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            dir="rtl"
            title="AI-generated video"
          >
            {videoState === 'generating' && selectedLang === 'ar' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Film className="w-4 h-4" />
            )}
            {isBilingual ? '🎬 شاهد (عربي)' : '🎬 شاهد'}
          </button>
        )}
      </div>

      {/* Generating state */}
      {videoState === 'generating' && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-xl">
          <div className="relative">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-primary-200 animate-ping opacity-30" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Generating video...</span>
            {estimatedTime && (
              <span className="text-xs text-gray-500 ml-2">
                ~{estimatedTime < 60 ? `${estimatedTime}s` : `${Math.ceil(estimatedTime / 60)} min`}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {videoState === 'error' && error && (
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

      {/* Video Player */}
      {showPlayer && videoUrl && videoState === 'ready' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">📺 AI-Generated Lesson Video</span>
          </div>
          <VideoPlayer
            src={videoUrl}
            isRtl={selectedLang === 'ar'}
            onClose={handleClose}
          />
          <p className="text-xs text-gray-400 italic">
            This video was automatically generated from course content
          </p>
        </div>
      )}
    </div>
  );
}
