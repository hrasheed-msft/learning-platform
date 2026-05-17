import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, X, Clock, BarChart, Keyboard } from 'lucide-react';
import { StudySession } from '@/components/flashcards';
import { flashcardService } from '@/services';
import { useFlashCardStore } from '@/stores';
import type { FlashCardWithProgress } from '@/types';
import { Button, Card } from '@/components/ui';

export default function StudySessionPage() {
  const { unitId, courseId } = useParams<{ unitId?: string; courseId?: string }>();
  const navigate = useNavigate();
  const { endStudySession } = useFlashCardStore();

  const [cards, setCards] = useState<FlashCardWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStartTime] = useState<number>(Date.now());
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // Reset session callback
  const resetSession = useCallback(() => {
    endStudySession();
  }, [endStudySession]);

  // Load flashcards for the session
  useEffect(() => {
    const loadFlashCards = async () => {
      try {
        setLoading(true);
        setError(null);

        let loadedCards: FlashCardWithProgress[] = [];
        
        if (unitId && courseId) {
          // Get flashcards for specific unit
          const result = await flashcardService.getUnitFlashCards(courseId, unitId);
          loadedCards = result.cards as FlashCardWithProgress[];
        } else if (courseId) {
          // Get all flashcards for course
          const result = await flashcardService.getCourseFlashCards(courseId);
          loadedCards = result.cards as FlashCardWithProgress[];
        } else {
          setError('No unit or course specified');
          return;
        }

        if (loadedCards.length === 0) {
          setError('No flashcards available for this content');
          return;
        }

        // Shuffle cards for variety
        const shuffled = [...loadedCards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
      } catch (err) {
        console.error('Failed to load flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFlashCards();

    // Cleanup on unmount
    return () => {
      resetSession();
    };
  }, [unitId, courseId, resetSession]);

  // Handle session completion
  const handleComplete = (stats: {
    totalCards: number;
    cardsStudied: number;
    correctRatings: number;
    averageRating: number;
    sessionDuration: number;
  }) => {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(sessionDuration / 60);
    const seconds = sessionDuration % 60;

    // Navigate back to flashcards list with success message
    if (unitId) {
      navigate(`/courses/${courseId}/units/${unitId}/flashcards`, {
        state: {
          message: `Session complete! Studied ${stats.cardsStudied} cards in ${minutes}m ${seconds}s`,
          stats,
        },
      });
    } else {
      navigate(`/courses/${courseId}/flashcards`, {
        state: {
          message: `Session complete! Studied ${stats.cardsStudied} cards in ${minutes}m ${seconds}s`,
          stats,
        },
      });
    }
  };

  // Handle exit/cancel
  const handleExit = () => {
    const message = cards.length > 0 
      ? 'Are you sure you want to exit? Rated cards have already been saved. Unrated cards will not be counted.' 
      : 'Are you sure you want to exit?';
    
    if (window.confirm(message)) {
      // Get the session stats before ending
      const stats = endStudySession();
      
      // Navigate back with stats (even partial)
      if (unitId) {
        navigate(`/courses/${courseId}/units/${unitId}/flashcards`, {
          state: stats ? {
            message: `Session ended. ${stats.cardsStudied} cards studied.`,
            stats,
          } : undefined,
        });
      } else if (courseId) {
        navigate(`/courses/${courseId}/flashcards`, {
          state: stats ? {
            message: `Session ended. ${stats.cardsStudied} cards studied.`,
            stats,
          } : undefined,
        });
      } else {
        navigate('/dashboard');
      }
    }
  };

  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else {
      document.exitFullscreen();
      setFullScreen(false);
    }
  };

  // Listen for ESC key to exit
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullScreen) {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [fullScreen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="text-red-500 mb-4">
            <BarChart className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Start Session</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            variant="primary"
            onClick={() => navigate(unitId ? `/courses/${courseId}/units/${unitId}` : `/courses/${courseId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${fullScreen ? 'bg-gray-50' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to={unitId ? `/courses/${courseId}/units/${unitId}/flashcards` : `/courses/${courseId}/flashcards`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Study Session</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor((Date.now() - sessionStartTime) / 60000)}m elapsed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(!showShortcuts)}
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullScreen}
                title="Toggle Fullscreen"
              >
                <BarChart className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                title="Exit Session"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && (
        <div className="bg-blue-50 border-b border-blue-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Space</kbd>
                <span className="ml-2 text-gray-600">Flip card</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">1-5</kbd>
                <span className="ml-2 text-gray-600">Rate card</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">←/→</kbd>
                <span className="ml-2 text-gray-600">Navigate</span>
              </div>
              <div>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">ESC</kbd>
                <span className="ml-2 text-gray-600">Exit fullscreen</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Study Session Component */}
      <div className="py-8">
        {cards.length > 0 && (
          <StudySession
            cards={cards}
            mode="study"
            unitId={unitId}
            courseId={courseId || ''}
            onComplete={handleComplete}
            onCancel={handleExit}
          />
        )}
      </div>
    </div>
  );
}
