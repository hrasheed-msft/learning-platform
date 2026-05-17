import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, CheckCircle, RotateCcw, Volume2, ChevronRight, Loader2, Users } from 'lucide-react';
import { RATING_LABELS, type Rating, type MemorizationItem } from '@/types/srs';
import { srsService } from '@/services/srsService';
import { familyService } from '@/services/familyService';
import { useAuthStore } from '@/stores';
import type { FamilyMember } from '@/types/user';

const SRS_RATINGS: Rating[] = [1, 2, 3, 4, 5];

export default function ReviewSession() {
  const { user } = useAuthStore();
  
  const [items, setItems] = useState<MemorizationItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, easy: 0, good: 0, hard: 0, again: 0 });
  
  // Loading and member states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewStartTime, setReviewStartTime] = useState<number>(Date.now());

  // Fetch family members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (!user?.familyId) return;
        const memberList = await familyService.getMembers(user.familyId);
        setMembers(memberList);
        // Default to first member or current user
        if (memberList.length > 0) {
          setSelectedMemberId(memberList[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch members:', err);
      }
    };
    fetchMembers();
  }, []);

  // Fetch due reviews for selected member
  const fetchDueReviews = useCallback(async () => {
    if (!selectedMemberId) return;
    
    try {
      setLoading(true);
      setError(null);
      const dueData = await srsService.getDueReviews(selectedMemberId);
      // Combine overdue and due today into review items
      const allDueItems = [...dueData.overdue, ...dueData.dueToday];
      setItems(allDueItems);
      setCurrentIndex(0);
      setShowAnswer(false);
      setCompleted(false);
      setStats({ reviewed: 0, easy: 0, good: 0, hard: 0, again: 0 });
    } catch (err) {
      console.error('Failed to fetch due reviews:', err);
      setError('Failed to load review items. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMemberId]);

  useEffect(() => {
    fetchDueReviews();
  }, [fetchDueReviews]);

  // Reset timer when showing new card
  useEffect(() => {
    setReviewStartTime(Date.now());
  }, [currentIndex]);

  const currentItem = items[currentIndex];

  const handleRating = async (rating: Rating) => {
    if (!currentItem || !selectedMemberId || submitting) return;
    
    // Calculate time spent
    const timeSpent = Math.round((Date.now() - reviewStartTime) / 1000);
    
    // Update stats locally
    const ratingKey = rating === 1 ? 'again' : rating === 2 ? 'hard' : rating === 3 ? 'good' : 'easy';
    setStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      [ratingKey]: prev[ratingKey] + 1,
    }));

    // Submit rating to SRS API
    try {
      setSubmitting(true);
      await srsService.submitReview(selectedMemberId, currentItem.id, {
        rating,
        timeSpent,
      });
    } catch (err) {
      console.error('Failed to submit review:', err);
      // Continue anyway - the local stats are updated
    } finally {
      setSubmitting(false);
    }

    // Move to next or complete
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === 'Space' && !showAnswer) {
        e.preventDefault();
        setShowAnswer(true);
      } else if (showAnswer && ['1', '2', '3', '4', '5'].includes(e.key)) {
        handleRating(parseInt(e.key) as Rating);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAnswer, currentItem, selectedMemberId]);

  const playAudio = (url?: string) => {
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading review items...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-red-50 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDueReviews}
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No items due
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in">
        {/* Member Selector */}
        {members.length > 1 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-gray-400" />
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            All caught up! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            {selectedMemberId ? `No reviews due for ${members.find(m => m.id === selectedMemberId)?.name || 'this member'}.` : 'You have no reviews due right now.'} Keep learning and come back later!
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
            Review Complete! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Great job reviewing your items. Keep up the great work!
          </p>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.reviewed}</p>
                <p className="text-xs text-gray-500">Reviewed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.easy}</p>
                <p className="text-xs text-gray-500">Easy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.good}</p>
                <p className="text-xs text-gray-500">Good</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.hard + stats.again}</p>
                <p className="text-xs text-gray-500">Needs Work</p>
              </div>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
          >
            Back to Dashboard
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit Review
        </Link>
        <div className="flex items-center space-x-2 text-gray-600">
          <Brain className="w-5 h-5" />
          <span>{currentIndex + 1} / {items.length}</span>
        </div>
      </div>

      {/* Member Selector */}
      {members.length > 1 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-400" />
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
              disabled={currentIndex > 0}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex) / items.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Type Badge */}
        <div className="px-6 pt-4">
          <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
            {currentItem.contentType.toUpperCase().replace('_', ' ')}
          </span>
        </div>

        {/* Question Side */}
        <div className="p-8 text-center">
          {currentItem.arabicText && (
            <div className="mb-4">
              <p className="font-arabic text-4xl text-gray-800 mb-2">{currentItem.arabicText}</p>
              {currentItem.source && (
                <p className="text-gray-500 italic">{currentItem.source}</p>
              )}
              {currentItem.audioUrl && (
                <button
                  onClick={() => playAudio(currentItem.audioUrl)}
                  className="mt-2 p-2 text-primary-500 hover:bg-primary-50 rounded-full transition"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              )}
            </div>
          )}
          <p className="text-xl text-gray-800">{currentItem.title}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-200" />

        {/* Answer Side */}
        <div className="p-8 bg-gray-50">
          {showAnswer ? (
            <div className="text-center animate-in">
              <p className="text-lg text-gray-700">{currentItem.translation}</p>
              {currentItem.narrator && (
                <p className="text-sm text-gray-500 mt-2">Narrated by: {currentItem.narrator}</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowAnswer(true)}
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Show Answer
              </button>
            </div>
          )}
        </div>

        {/* Rating Buttons */}
        {showAnswer && (
          <div className="p-6 bg-white border-t animate-in">
            <p className="text-center text-sm text-gray-500 mb-4">How well did you know this?</p>
            <div className="grid grid-cols-5 gap-2">
              {SRS_RATINGS.map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  disabled={submitting}
                  className={`p-3 rounded-lg text-center transition ${
                    rating === 1 ? 'bg-red-100 hover:bg-red-200 text-red-700' :
                    rating === 2 ? 'bg-orange-100 hover:bg-orange-200 text-orange-700' :
                    rating === 3 ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' :
                    rating === 4 ? 'bg-green-100 hover:bg-green-200 text-green-700' :
                    'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                  } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-2xl block mb-1">{RATING_LABELS[rating].emoji}</span>
                  <span className="text-sm font-medium">{RATING_LABELS[rating].label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center text-sm text-gray-400">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd> to show answer, 
        <kbd className="px-2 py-1 bg-gray-100 rounded ml-1">1-5</kbd> to rate
      </div>
    </div>
  );
}
