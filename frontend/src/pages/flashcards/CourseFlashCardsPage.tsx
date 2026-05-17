import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, RefreshCw, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';
import { ProgressStats } from '@/components/flashcards';
import { flashcardService } from '@/services';
import { useFamilyStore } from '@/stores';
import type { FlashCardWithProgress } from '@/types';
import { getUnitTitle, getCourseTitle } from '@/types';
import { Button, Card } from '@/components/ui';

interface UnitSummary {
  unitId: string;
  unitTitle: string;
  totalCards: number;
  dueCards: number;
  newCards: number;
  learningCards: number;
  masteredCards: number;
}

export default function CourseFlashCardsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionMessage = location.state?.message as string | undefined;
  const { selectedMember, members } = useFamilyStore();

  const [flashcards, setFlashcards] = useState<FlashCardWithProgress[]>([]);
  const [unitSummaries, setUnitSummaries] = useState<UnitSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [statistics, setStatistics] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(sessionMessage || null);

  // Determine active member
  const activeMember = selectedMember || (members.length > 0 ? members[0] : null);

  // Clear success message after showing
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Load all flashcards for this course
  // location.key changes on every navigation, triggering a refresh when returning from session
  useEffect(() => {
    const loadFlashCards = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        const result = await flashcardService.getCourseFlashCards(courseId);
        const cards = result.cards as FlashCardWithProgress[];
        setFlashcards(cards);

        // Get course title from first card
        if (cards.length > 0) {
          setCourseTitle(getCourseTitle(cards[0]));
        }

        // Load statistics - always fetch fresh after returning from session
        const stats = await flashcardService.getStatistics(undefined, courseId, activeMember?.id);
        console.log('Loaded statistics:', stats);
        setStatistics(stats);

        // Group cards by unit and calculate summaries
        const unitMap = new Map<string, UnitSummary>();

        cards.forEach((card: FlashCardWithProgress) => {
          const unitId = card.unitId;
          const unitTitle = getUnitTitle(card);

          if (!unitMap.has(unitId)) {
            unitMap.set(unitId, {
              unitId,
              unitTitle,
              totalCards: 0,
              dueCards: 0,
              newCards: 0,
              learningCards: 0,
              masteredCards: 0,
            });
          }

          const summary = unitMap.get(unitId)!;
          summary.totalCards++;

          // Check if card is due
          if (!card.progress || new Date(card.progress.nextReviewDate) <= new Date()) {
            summary.dueCards++;
          }

          // Categorize by progress
          if (!card.progress || card.progress.repetitions === 0) {
            summary.newCards++;
          } else if (card.progress.repetitions < 5) {
            summary.learningCards++;
          } else if (card.progress.repetitions >= 5 && card.progress.easeFactor >= 2.5) {
            summary.masteredCards++;
          }
        });

        setUnitSummaries(Array.from(unitMap.values()));
      } catch (err) {
        console.error('Failed to load flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFlashCards();
  }, [courseId, location.key]);

  // Calculate course-wide statistics
  const dueCards = flashcards.filter(card => {
    if (!card.progress) return true;
    const nextReview = new Date(card.progress.nextReviewDate);
    return nextReview <= new Date();
  });

  // Navigate to study all cards in course
  const handleStudyAll = () => {
    navigate(`/courses/${courseId}/flashcards/study`);
  };

  // Navigate to review due cards in course
  const handleReviewDue = () => {
    if (dueCards.length === 0) {
      alert('No cards are due for review!');
      return;
    }
    navigate(`/courses/${courseId}/flashcards/review`);
  };

  // Navigate to specific unit's flashcards
  const handleViewUnit = (unitId: string) => {
    navigate(`/courses/${courseId}/units/${unitId}/flashcards`);
  };

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
        <Card className="max-w-lg w-full text-center p-8">
          <div className="text-red-500 mb-4">
            <BookOpen className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Flashcards</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success message from session */}
      {successMessage && (
        <div className="bg-green-50 border-b border-green-200 p-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to={`/courses/${courseId}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Course Flashcards</h1>
                <p className="text-sm text-gray-500">{courseTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        {flashcards.length === 0 ? (
          <Card className="text-center p-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-20 h-20 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Flashcards Yet</h2>
            <p className="text-gray-600 mb-6">
              Flashcards will appear here as you create them in course units.
            </p>
            <Button variant="primary" onClick={() => navigate(`/courses/${courseId}`)}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Course
            </Button>
          </Card>
        ) : (
          <>
            {/* Course-wide Progress Overview */}
            {statistics && (
              <div className="mb-6">
                <ProgressStats statistics={statistics} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Study All Cards</h3>
                    <p className="text-sm text-gray-600">
                      Review all {flashcards.length} flashcards across all units
                    </p>
                  </div>
                  <Button variant="primary" onClick={handleStudyAll}>
                    <Play className="w-4 h-4 mr-2" />
                    Study
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Review Due Cards</h3>
                    <p className="text-sm text-gray-600">
                      {dueCards.length} {dueCards.length === 1 ? 'card' : 'cards'} due across all units
                    </p>
                  </div>
                  <Button
                    variant={dueCards.length > 0 ? 'secondary' : 'outline'}
                    onClick={handleReviewDue}
                    disabled={dueCards.length === 0}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </div>
              </Card>
            </div>

            {/* Units Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Flashcards by Unit</h2>
              <div className="space-y-3">
                {unitSummaries.map(unit => (
                  <Card key={unit.unitId} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {unit.unitTitle}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Total</p>
                            <p className="text-lg font-semibold text-gray-900">{unit.totalCards}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due</p>
                            <p className="text-lg font-semibold text-orange-600">{unit.dueCards}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">New</p>
                            <p className="text-lg font-semibold text-blue-600">{unit.newCards}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Learning</p>
                            <p className="text-lg font-semibold text-yellow-600">{unit.learningCards}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Mastered</p>
                            <p className="text-lg font-semibold text-green-600">{unit.masteredCards}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleViewUnit(unit.unitId)}
                        className="ml-4"
                      >
                        View
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
