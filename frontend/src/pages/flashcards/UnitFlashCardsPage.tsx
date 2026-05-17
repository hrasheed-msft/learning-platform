import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, RefreshCw, Plus, Search, Filter, BookOpen, CheckCircle } from 'lucide-react';
import { FlashCardList, ProgressStats } from '@/components/flashcards';
import { flashcardService } from '@/services';
import { useFamilyStore } from '@/stores';
import type { FlashCardWithProgress } from '@/types';
import { getUnitTitle } from '@/types';
import { Button, Card } from '@/components/ui';

export default function UnitFlashCardsPage() {
  const { courseId, unitId } = useParams<{ courseId: string; unitId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionMessage = location.state?.message as string | undefined;
  const { selectedMember, members } = useFamilyStore();

  const [flashcards, setFlashcards] = useState<FlashCardWithProgress[]>([]);
  const [filteredCards, setFilteredCards] = useState<FlashCardWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [unitTitle, setUnitTitle] = useState('');
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

  // Load flashcards for this unit
  // location.key changes on every navigation, triggering a refresh when returning from session
  useEffect(() => {
    const loadFlashCards = async () => {
      if (!unitId || !courseId) return;

      try {
        setLoading(true);
        setError(null);

        const result = await flashcardService.getUnitFlashCards(courseId, unitId);
        const cards = result.cards as FlashCardWithProgress[];
        setFlashcards(cards);
        setFilteredCards(cards);

        // Load statistics - always fetch fresh after returning from session
        const stats = await flashcardService.getStatistics(unitId, courseId, activeMember?.id);
        console.log('Loaded statistics:', stats);
        setStatistics(stats);

        // Get unit title from first card (or could fetch from API)
        if (cards.length > 0) {
          setUnitTitle(`Unit: ${getUnitTitle(cards[0])}`);
        }
      } catch (err) {
        console.error('Failed to load flashcards:', err);
        setError('Failed to load flashcards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFlashCards();
  }, [unitId, courseId, location.key]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...flashcards];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(card => {
        const progress = card.progress;
        if (!progress) return filterStatus === 'new';
        
        if (filterStatus === 'new') return progress.repetitions === 0;
        if (filterStatus === 'learning') return progress.repetitions > 0 && progress.repetitions < 5;
        if (filterStatus === 'mastered') return progress.repetitions >= 5 && progress.easeFactor >= 2.5;
        
        return true;
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card =>
        card.front.toLowerCase().includes(query) ||
        card.back.toLowerCase().includes(query) ||
        card.notes?.toLowerCase().includes(query)
      );
    }

    setFilteredCards(filtered);
  }, [flashcards, filterStatus, searchQuery]);

  // Calculate due cards count
  const dueCards = flashcards.filter(card => {
    if (!card.progress) return true;
    const nextReview = new Date(card.progress.nextReviewDate);
    return nextReview <= new Date();
  });

  // Navigate to study session
  const handleStudyAll = () => {
    navigate(`/courses/${courseId}/units/${unitId}/flashcards/study`);
  };

  // Navigate to review session (due cards only)
  const handleReviewDue = () => {
    if (dueCards.length === 0) {
      alert('No cards are due for review!');
      return;
    }
    navigate(`/courses/${courseId}/units/${unitId}/flashcards/review`);
  };

  // Navigate to create flashcard
  const handleCreateCard = () => {
    navigate(`/courses/${courseId}/units/${unitId}/flashcards/create`);
  };

  // Handle edit flashcard
  const handleEdit = (card: FlashCardWithProgress) => {
    navigate(`/courses/${courseId}/units/${unitId}/flashcards/edit/${card.id}`);
  };

  // Handle delete flashcard
  const handleDelete = async (card: FlashCardWithProgress) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      await flashcardService.deleteFlashCard(card.id);
      setFlashcards(prev => prev.filter(c => c.id !== card.id));
    } catch (err) {
      console.error('Failed to delete flashcard:', err);
      alert('Failed to delete flashcard. Please try again.');
    }
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
            <Button variant="outline" onClick={() => navigate(`/courses/${courseId}/units/${unitId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Unit
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
                to={`/courses/${courseId}/units/${unitId}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Flashcards</h1>
                <p className="text-sm text-gray-500">{unitTitle}</p>
              </div>
            </div>
            <Button variant="primary" onClick={handleCreateCard} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create Card
            </Button>
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
              Create your first flashcard to start learning this unit's content.
            </p>
            <Button variant="primary" onClick={handleCreateCard}>
              <Plus className="w-5 h-5 mr-2" />
              Create First Flashcard
            </Button>
          </Card>
        ) : (
          <>
            {/* Progress Overview */}
            {statistics && (
              <div className="mb-6">
                <ProgressStats statistics={statistics} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Study All Cards</h3>
                    <p className="text-sm text-gray-600">
                      Review all {flashcards.length} flashcards in this unit
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
                      {dueCards.length} {dueCards.length === 1 ? 'card' : 'cards'} due for review
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

            {/* Search and Filter */}
            <Card className="p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search flashcards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-5 h-5" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Cards ({flashcards.length})</option>
                    <option value="new">New Cards</option>
                    <option value="learning">Learning</option>
                    <option value="mastered">Mastered</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Flashcard List */}
            {filteredCards.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-gray-600">No flashcards match your search or filter.</p>
              </Card>
            ) : (
              <FlashCardList
                cards={filteredCards}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
