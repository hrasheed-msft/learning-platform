import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, Award, PartyPopper, Target } from 'lucide-react';
import { StudySession } from '@/components/flashcards';
import { flashcardService } from '@/services';
import { useFlashCardStore } from '@/stores';
import type { SessionStatistics, FlashCardWithProgress } from '@/types';
import { Button, Card } from '@/components/ui';

export default function ReviewSessionPage() {
  const navigate = useNavigate();
  const { endStudySession } = useFlashCardStore();

  const [cards, setCards] = useState<FlashCardWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [sessionStartTime] = useState<number>(Date.now());
  const [completed, setCompleted] = useState(false);
  const [completionStats, setCompletionStats] = useState<SessionStatistics | null>(null);

  // Load due flashcards for review
  useEffect(() => {
    const loadDueCards = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cards that are due for review
        const result = await flashcardService.getDueCards();
        
        if (result.cards.length === 0) {
          setError('No cards due for review! Come back later.');
          setDueCount(0);
          return;
        }

        setDueCount(result.total);
        setCards(result.cards);
      } catch (err) {
        console.error('Failed to load due cards:', err);
        setError('Failed to load review cards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDueCards();

    // Cleanup on unmount
    return () => {
      endStudySession();
    };
  }, [endStudySession]);

  // Handle review session completion
  const handleComplete = (stats: {
    totalCards: number;
    cardsStudied: number;
    correctRatings: number;
    averageRating: number;
    sessionDuration: number;
  }) => {
    setCompletionStats(stats as any); // Cast for now until we update SessionStatistics type
    setCompleted(true);

    // Track streak (this could be enhanced with backend logic)
    const currentStreak = parseInt(localStorage.getItem('reviewStreak') || '0');
    const lastReviewDate = localStorage.getItem('lastReviewDate');
    const today = new Date().toDateString();

    if (lastReviewDate !== today) {
      const newStreak = currentStreak + 1;
      localStorage.setItem('reviewStreak', newStreak.toString());
      localStorage.setItem('lastReviewDate', today);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      endStudySession();
      navigate('/dashboard');
    }
  };

  // Continue with non-due cards
  const handleContinueStudy = () => {
    endStudySession();
    navigate('/courses');
  };

  // Return to dashboard
  const handleReturnDashboard = () => {
    endStudySession();
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review cards...</p>
        </div>
      </div>
    );
  }

  if (error && !completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center p-8">
          {dueCount === 0 ? (
            <>
              <div className="text-green-500 mb-4">
                <Award className="w-20 h-20 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
              <p className="text-gray-600 mb-6">
                Great work! You have no cards due for review right now. Keep up the good work and check back later.
              </p>
              <div className="flex flex-col gap-3">
                <Button variant="primary" onClick={() => navigate('/courses')}>
                  <Target className="w-4 h-4 mr-2" />
                  Study New Content
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-red-500 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Reviews</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  // Completion Screen
  if (completed && completionStats) {
    const streak = parseInt(localStorage.getItem('reviewStreak') || '1');
    const minutes = Math.floor((Date.now() - sessionStartTime) / 60000);
    const seconds = Math.floor(((Date.now() - sessionStartTime) % 60000) / 1000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="text-primary-500 mb-4">
              <PartyPopper className="w-20 h-20 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Complete!</h2>
            <p className="text-gray-600 mb-8">
              You've reviewed {completionStats.cardsStudied} cards in {minutes}m {seconds}s
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{completionStats.totalCards}</p>
                <p className="text-xs text-gray-600">Total Cards</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{completionStats.correctRatings}</p>
                <p className="text-xs text-gray-600">Correct</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600">{completionStats.averageRating.toFixed(1)}</p>
                <p className="text-xs text-gray-600">Avg Rating</p>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="text-3xl font-bold text-orange-600">{streak}</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Keep it up! Come back tomorrow to continue your streak.</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={handleContinueStudy} size="lg">
                <Target className="w-5 h-5 mr-2" />
                Study More Content
              </Button>
              <Button variant="outline" onClick={handleReturnDashboard}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Review Session</h1>
                <p className="text-sm text-gray-500">
                  {dueCount} cards due for review today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Session Component */}
      <div className="py-8">
        {cards.length > 0 && (
          <StudySession
            cards={cards}
            mode="review"
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
