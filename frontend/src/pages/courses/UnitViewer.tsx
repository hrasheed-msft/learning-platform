import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Headphones, BookOpen, ChevronRight, ChevronLeft, CheckCircle, Loader2, SquareStack, Play, Pause } from 'lucide-react';
import { courseService } from '@/services/courseService';
import UnitAudioButton, { type UnitAudioSyncState } from '@/components/UnitAudioButton';
import SyncedTextContent from '@/components/SyncedTextContent';
import type { Unit, VideoResource, AudioResource, ArabicTerm } from '@/types/course';

interface UnitProgress {
  videoCompleted: boolean;
  readingCompleted: boolean;
  quizCompleted: boolean;
}

export default function UnitViewer() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  
  const [unit, setUnit] = useState<Unit | null>(null);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UnitProgress>({
    videoCompleted: false,
    readingCompleted: false,
    quizCompleted: false,
  });
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [audioSyncState, setAudioSyncState] = useState<UnitAudioSyncState | null>(null);

  useEffect(() => {
    setAudioSyncState(null);
  }, [unitId]);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!courseId || !unitId) return;
      
      try {
        setLoading(true);
        const data = await courseService.getUnit(courseId, unitId);
        const unitsData = await courseService.getUnits(courseId);
        setUnit(data);
        setAllUnits(unitsData);
      } catch (err) {
        console.error('Failed to fetch unit:', err);
        setError('Failed to load unit content');
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [courseId, unitId]);

  const handleMarkComplete = async (type: 'video' | 'reading') => {
    if (!unitId) return;
    
    try {
      setUpdatingProgress(true);
      const updateData = type === 'video' 
        ? { videoCompleted: true }
        : { readingCompleted: true };
      
      await courseService.updateProgress(unitId, updateData);
      
      setProgress(prev => ({
        ...prev,
        [type === 'video' ? 'videoCompleted' : 'readingCompleted']: true,
      }));
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Find current unit index and navigation units
  const currentUnitIndex = allUnits.findIndex(u => u.id === unitId);
  const previousUnit = currentUnitIndex > 0 ? allUnits[currentUnitIndex - 1] : null;
  const nextUnit = currentUnitIndex < allUnits.length - 1 ? allUnits[currentUnitIndex + 1] : null;

  const handlePrevious = () => {
    if (previousUnit && courseId) {
      navigate(`/courses/${courseId}/units/${previousUnit.id}`);
    }
  };

  const handleNext = () => {
    if (nextUnit && courseId) {
      navigate(`/courses/${courseId}/units/${nextUnit.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading unit content...</p>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Unit</h2>
          <p className="text-red-600 mb-4">{error || 'Unit not found'}</p>
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const videos: VideoResource[] = unit.content?.videos || [];
  const audioResources: AudioResource[] = unit.content?.audio || [];
  const arabicTerms: ArabicTerm[] = unit.content?.arabicTerms || [];
  const textContent = unit.content?.text || '<p>No content available for this unit yet.</p>';
  const shouldShowFloatingAudioControl = Boolean(audioSyncState?.togglePlayPause)
    && (audioSyncState?.isPlaying || ((audioSyncState?.currentTime ?? 0) > 0 && (audioSyncState?.currentTime ?? 0) < (audioSyncState?.duration ?? 0)));

  return (
    <div className="space-y-6 animate-in">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Course
        </Link>
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={handlePrevious}
            disabled={!previousUnit}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 px-2">
            {currentUnitIndex + 1} / {allUnits.length}
          </span>
          <button 
            type="button"
            onClick={handleNext}
            disabled={!nextUnit}
            className="px-4 py-2 bg-primary-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg hover:bg-primary-600 transition flex items-center"
          >
            Next Unit
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Unit Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-heading font-bold text-gray-800">
          {unit.title}
        </h1>
        <p className="text-gray-600 mt-2">{unit.description}</p>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            📚 Study Aids
          </h3>
          <div>
            <span className="text-xs font-medium text-gray-500 mb-1 block">🔊 Listen</span>
            <UnitAudioButton
              unitId={unitId!}
              hasArabic={arabicTerms.length > 0 || textContent.includes('arabic') || textContent.includes('bilingual')}
              hasEnglish={true}
              onSyncStateChange={setAudioSyncState}
            />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Section - Only show if videos exist */}
          {videos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                {videos[0].type === 'youtube' ? (
                  <iframe
                    src={videos[0].url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={videos[0].url} controls className="w-full h-full" />
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{videos[0].title}</h3>
                  {videos[0].duration && (
                    <p className="text-sm text-gray-500">
                      Duration: {Math.round(videos[0].duration / 60)} minutes
                    </p>
                  )}
                </div>
                {!progress.videoCompleted && (
                  <button
                    type="button"
                    onClick={() => handleMarkComplete('video')}
                    disabled={updatingProgress}
                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                  >
                    {updatingProgress ? 'Saving...' : 'Mark Complete'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-500" />
                Lesson Content
              </h3>
              {!progress.readingCompleted && (
                <button
                  type="button"
                  onClick={() => handleMarkComplete('reading')}
                  disabled={updatingProgress}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  {updatingProgress ? 'Saving...' : 'Mark as Read'}
                </button>
              )}
            </div>
            <style>{`
              .unit-content h2 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1f2937;
                margin-top: 1.5rem;
                margin-bottom: 1rem;
              }
              .unit-content h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: #374151;
                margin-top: 1.25rem;
                margin-bottom: 0.75rem;
              }
              .unit-content h4 {
                font-size: 1.1rem;
                font-weight: 600;
                color: #4b5563;
                margin-top: 1rem;
                margin-bottom: 0.5rem;
              }
              .unit-content p {
                color: #374151;
                line-height: 1.75;
                margin-bottom: 1rem;
              }
              .unit-content ul, .unit-content ol {
                margin-left: 1.5rem;
                margin-bottom: 1rem;
                color: #374151;
                line-height: 1.75;
              }
              .unit-content li {
                margin-bottom: 0.5rem;
              }
              .unit-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
              }
              .unit-content th, .unit-content td {
                border: 1px solid #e5e7eb;
                padding: 0.75rem;
                text-align: left;
              }
              .unit-content th {
                background-color: #f3f4f6;
                font-weight: 600;
              }
              .unit-content .example-box {
                background-color: #eff6ff;
                border-left: 4px solid #3b82f6;
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
              .unit-content .example-box h4 {
                color: #1e40af;
                margin-top: 0;
              }
              .unit-content .warning-box {
                background-color: #fef2f2;
                border-left: 4px solid #ef4444;
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
              .unit-content .warning-box h4 {
                color: #991b1b;
                margin-top: 0;
              }
              .unit-content .activity-box {
                background-color: #f0fdf4;
                border-left: 4px solid #10b981;
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
              .unit-content .activity-box h4 {
                color: #065f46;
                margin-top: 0;
              }
              .unit-content .qa-box {
                background-color: #faf5ff;
                border-left: 4px solid #a855f7;
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
              }
              .unit-content .qa-box h4 {
                color: #6b21a8;
                margin-top: 0;
                font-weight: 600;
              }
              .unit-content .quran-verse {
                background-color: #f8f4e6;
                border: 1px solid #e0d5b7;
                padding: 1.5rem;
                border-radius: 0.5rem;
                text-align: center;
                margin: 1.5rem 0;
              }
              .unit-content .arabic {
                font-size: 1.25rem;
                color: #1f2937;
                font-weight: 500;
              }
              .unit-content .arabic-large {
                font-size: 2rem;
                color: #1f2937;
              }
              .unit-content .hadith-box {
                background-color: #f9fafb;
                border-left: 4px solid #8b5cf6;
                padding: 1rem;
                border-radius: 0.5rem;
                margin: 1rem 0;
                font-style: italic;
              }
              .unit-content .diagrams-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1.25rem;
                margin: 1rem 0 1.5rem;
              }
              .unit-content .diagram {
                background-color: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                overflow: hidden;
                text-align: center;
              }
              .unit-content .diagram img {
                width: 100%;
                height: auto;
                display: block;
                object-fit: contain;
              }
            `}</style>
            <SyncedTextContent
              html={textContent}
              currentWordIndex={audioSyncState?.currentWordIndex ?? -1}
              language={audioSyncState?.language ?? null}
              isPlaying={audioSyncState?.isPlaying ?? false}
              className="unit-content prose-lg max-w-none text-gray-700 leading-relaxed"
            />
            
            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
              <Link
                to={`/courses/${courseId}/units/${unitId}/quiz`}
                className="inline-flex items-center px-6 py-3 bg-secondary-500 text-white font-medium rounded-lg hover:bg-secondary-600 transition"
              >
                Take Quiz
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              
              {nextUnit ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
                >
                  Next Unit: {nextUnit.title}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <Link
                  to={`/courses/${courseId}`}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Back to Course
                </Link>
              )}
            </div>
          </div>

          {/* Arabic Terms */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-secondary-500" />
              Key Arabic Terms
            </h3>
            {arabicTerms.length > 0 ? (
              <div className="space-y-3">
                {arabicTerms.map((term) => (
                  <div key={term.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-arabic text-2xl text-gray-800 text-right mb-2">
                      {term.arabic}
                    </p>
                    <p className="text-gray-600 font-medium">{term.transliteration}</p>
                    <p className="text-sm text-gray-500">{term.translation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No Arabic terms for this unit
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Video</span>
                <CheckCircle className={`w-5 h-5 ${progress.videoCompleted ? 'text-green-500' : 'text-gray-300'}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reading</span>
                <CheckCircle className={`w-5 h-5 ${progress.readingCompleted ? 'text-green-500' : 'text-gray-300'}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quiz</span>
                <CheckCircle className={`w-5 h-5 ${progress.quizCompleted ? 'text-green-500' : 'text-gray-300'}`} />
              </div>
            </div>
          </div>

          {/* Flashcards Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <SquareStack className="w-5 h-5 mr-2 text-primary-500" />
              Flashcards
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Review and practice key concepts from this unit
            </p>
            <Link
              to={`/courses/${courseId}/units/${unitId}/flashcards`}
              className="block w-full px-4 py-2 bg-primary-50 text-primary-600 font-medium rounded-lg text-center hover:bg-primary-100 transition"
            >
              View Flashcards
            </Link>
          </div>

          {/* Take Quiz Button */}
          <Link
            to={`/courses/${courseId}/units/${unitId}/quiz`}
            className="block w-full px-6 py-3 bg-primary-500 text-white font-medium rounded-xl text-center hover:bg-primary-600 transition"
          >
            Take Quiz
            <ChevronRight className="w-5 h-5 inline ml-2" />
          </Link>

          {/* Audio Resources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Headphones className="w-5 h-5 mr-2 text-accent-500" />
              Audio Resources
            </h3>
            {audioResources.length > 0 ? (
              <div className="space-y-2">
                {audioResources.map((audio) => (
                  <div key={audio.id} className="p-3 bg-gray-50 rounded-lg">
                    <audio src={audio.url} controls className="w-full" />
                    <p className="text-sm text-gray-600 mt-1">{audio.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No audio resources for this unit
              </div>
            )}
          </div>
        </div>
      </div>

      {shouldShowFloatingAudioControl && audioSyncState && (
        <button
          type="button"
          onClick={audioSyncState.togglePlayPause}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-primary-600 shadow-lg ring-1 ring-gray-200 backdrop-blur transition hover:bg-white hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label={audioSyncState.isPlaying ? 'Pause audio' : 'Play audio'}
          title={audioSyncState.isPlaying ? 'Pause audio' : 'Resume audio'}
        >
          {audioSyncState.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
}
