import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, Headphones, BookOpen, ChevronRight, ChevronLeft, CheckCircle, Loader2, SquareStack } from 'lucide-react';
import { courseService } from '@/services/courseService';
import { type UnitAudioSyncState } from '@/components/UnitAudioButton';
import SyncedTextContent from '@/components/SyncedTextContent';
import QuranAudioPlayer from '@/components/QuranAudioPlayer';
import type { Unit, VideoResource, AudioResource, ArabicTerm } from '@/types/course';
import { getCourseLearnPath, getQuizPath, getUnitPath } from '@/utils/courseRoutePaths';

interface UnitProgress {
  videoCompleted: boolean;
  readingCompleted: boolean;
  quizCompleted: boolean;
}

const MASAAR_LESSON_PATH_PATTERN = /\/lessons\/masaar-irab-sarf\/week-\d+\.html/i;

export default function UnitViewer() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const courseLearnPath = courseId ? getCourseLearnPath(location.pathname, courseId) : '/courses';
  const quizPath = courseId && unitId ? getQuizPath(location.pathname, courseId, unitId) : '/courses';
  const currentUnitState = location.state as { memberId?: string; enrollmentId?: string } | null;
  
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
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAudioSyncState(null);
  }, [unitId]);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!courseId || !unitId) return;
      
      try {
        setLoading(true);
        const memberId = currentUnitState?.memberId;
        const [data, unitsData, savedProgress] = await Promise.all([
          courseService.getUnit(courseId, unitId),
          courseService.getUnits(courseId),
          memberId ? courseService.getUnitProgress(memberId, unitId).catch(() => null) : Promise.resolve(null),
        ]);
        setUnit(data);
        setAllUnits(unitsData);
        if (savedProgress) {
          setProgress({
            videoCompleted: savedProgress.videoCompleted,
            readingCompleted: savedProgress.readingCompleted,
            quizCompleted: savedProgress.quizCompleted,
          });
        }
      } catch (err) {
        console.error('Failed to fetch unit:', err);
        setError('Failed to load unit content');
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [courseId, unitId]);

  // Enhance .quran-verse audio elements with custom player (loop, speed, progress)
  useEffect(() => {
    if (loading || !unit) return;

    const container = contentContainerRef.current;
    if (!container) return;

    const roots: ReturnType<typeof createRoot>[] = [];

    // Defer until after paint so dangerouslySetInnerHTML DOM is ready
    const timerId = window.setTimeout(() => {
      const audioEls = container.querySelectorAll<HTMLAudioElement>('.quran-verse audio');

      audioEls.forEach((audioEl) => {
        if (audioEl.dataset.qapEnhanced) return;
        audioEl.dataset.qapEnhanced = '1';
        audioEl.removeAttribute('controls');

        const host = document.createElement('div');
        host.className = 'quran-audio-player-host';
        audioEl.after(host);

        const root = createRoot(host);
        root.render(<QuranAudioPlayer audioEl={audioEl} />);
        roots.push(root);
      });
    }, 50);

    return () => {
      window.clearTimeout(timerId);
      roots.forEach((root) => root.unmount());
      container.querySelectorAll<HTMLElement>('.quran-audio-player-host').forEach((el) => el.remove());
      container.querySelectorAll<HTMLAudioElement>('.quran-verse audio[data-qap-enhanced]').forEach((el) => {
        delete el.dataset.qapEnhanced;
        el.setAttribute('controls', '');
      });
    };
  }, [loading, unit]);

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
      navigate(getUnitPath(location.pathname, courseId, previousUnit.id), { state: currentUnitState ?? undefined });
    }
  };

  const handleNext = () => {
    if (nextUnit && courseId) {
      navigate(getUnitPath(location.pathname, courseId, nextUnit.id), { state: currentUnitState ?? undefined });
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
            to={courseLearnPath}
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
  const hasInteractiveLessonLink = MASAAR_LESSON_PATH_PATTERN.test(textContent);
  const interactiveLessonUrl = hasInteractiveLessonLink
    ? `/lessons/masaar-irab-sarf/week-${unit.orderIndex + 1}.html`
    : null;

  return (
    <div className="space-y-6 animate-in">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={courseLearnPath}
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

        {/* Audio buttons hidden until faithful Arabic pronunciation is available */}
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
              {progress.readingCompleted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Read
                </span>
              ) : (
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
            {interactiveLessonUrl && (
              <a
                href={interactiveLessonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary-600 px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
              >
                <BookOpen className="h-5 w-5" />
                <span>Open Full Interactive Lesson</span>
                <span aria-hidden="true" className="text-lg leading-none">↗</span>
              </a>
            )}
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
              .unit-content a {
                color: #2563eb;
                font-weight: 600;
                text-decoration: underline;
                text-underline-offset: 0.2em;
              }
              .unit-content a:hover {
                color: #1d4ed8;
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
                font-family: 'Amiri', serif;
                font-size: 2.75rem;
                line-height: 2;
                color: #1f2937;
              }
              @media (min-width: 768px) {
                .unit-content .arabic-large {
                  font-size: 3rem;
                }
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
            <div ref={contentContainerRef}>
              <SyncedTextContent
                html={textContent}
                currentWordIndex={audioSyncState?.currentWordIndex ?? -1}
                language={audioSyncState?.language ?? null}
                isPlaying={audioSyncState?.isPlaying ?? false}
                className="unit-content prose-lg max-w-none text-gray-700 leading-relaxed"
              />
            </div>
            
            {/* Mark as Read — prominent bottom CTA */}
            {progress.readingCompleted ? (
              <div className="flex justify-center mt-6 mb-2">
                <p className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 text-green-700 font-medium rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Lesson completed ✅
                </p>
              </div>
            ) : (
              <div className="flex justify-center mt-6 mb-2">
                <button
                  type="button"
                  onClick={() => handleMarkComplete('reading')}
                  disabled={updatingProgress}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-semibold text-base rounded-xl hover:bg-green-600 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {updatingProgress ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {updatingProgress ? 'Saving…' : "✅ I've read this lesson"}
                </button>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-200">
              {progress.readingCompleted ? (
                <Link
                  to={quizPath}
                  className="inline-flex items-center px-6 py-3 bg-secondary-500 text-white font-medium rounded-lg hover:bg-secondary-600 transition"
                >
                  Take Quiz
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Complete the lesson reading first"
                  className="inline-flex items-center px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                >
                  Take Quiz
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
              
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
                  to={courseLearnPath}
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
          {progress.readingCompleted ? (
            <Link
              to={quizPath}
              className="block w-full px-6 py-3 bg-primary-500 text-white font-medium rounded-xl text-center hover:bg-primary-600 transition"
            >
              Take Quiz
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              title="Complete the lesson reading first"
              className="block w-full px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-xl text-center cursor-not-allowed"
            >
              Take Quiz
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          )}

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

      {/* Floating audio control hidden until faithful Arabic pronunciation is available */}
    </div>
  );
}
