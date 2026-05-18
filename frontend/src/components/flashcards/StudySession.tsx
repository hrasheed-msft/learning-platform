/**
 * StudySession Component
 * 
 * Interactive study session with spaced repetition review.
 * Displays flashcards one at a time with rating buttons (1-5).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, ProgressBar } from '@/components/ui';
import { FlashCard } from './FlashCard';
import { ChevronLeft, ChevronRight, SkipForward, X } from 'lucide-react';
import { useFlashCardStore, useFamilyStore, useAuthStore } from '@/stores';
import type { FlashCardWithProgress } from '@/types';

interface StudySessionProps {
  cards: FlashCardWithProgress[];
  mode: 'study' | 'review';
  unitId?: string;
  courseId?: string;
  onComplete?: (stats: {
    totalCards: number;
    cardsStudied: number;
    correctRatings: number;
    averageRating: number;
    sessionDuration: number;
  }) => void;
  onCancel?: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({
  cards,
  mode,
  unitId,
  courseId,
  onComplete,
  onCancel,
}) => {
  const {
    currentSession,
    startStudySession,
    endStudySession,
    nextCard,
    previousCard,
    rateCurrentCard,
    skipCard,
  } = useFlashCardStore();
  
  const { selectedMember, members, fetchMembers } = useFamilyStore();
  const { family } = useAuthStore();

  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determine which member to use for this session
  const activeMember = selectedMember || (members.length > 0 ? members[0] : null);

  // Load family members if not already loaded
  useEffect(() => {
    console.log('[StudySession] Member state:', {
      selectedMember: selectedMember?.id,
      membersCount: members.length,
      activeMember: activeMember?.id,
      family: family?.id,
    });
    
    if (family && members.length === 0) {
      console.log('[StudySession] Loading family members...');
      fetchMembers(family.id).catch((err) => {
        console.error('[StudySession] Failed to load family members:', err);
      });
    }
  }, [family, members.length, fetchMembers, selectedMember?.id, activeMember?.id]);

  const handleRate = useCallback(async (rating: number) => {
    if (!currentSession) return;
    setIsSubmitting(true);
    try {
      await rateCurrentCard(rating);
      setShowAnswer(false);
      // Note: Session completion is detected via useEffect below
      // since rateCurrentCard updates the store asynchronously
    } catch (error) {
      console.error('Failed to rate card:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentSession, rateCurrentCard]);

  // Detect session completion when all cards have been rated
  useEffect(() => {
    if (currentSession && currentSession.completed >= currentSession.cards.length) {
      const stats = endStudySession();
      if (stats && onComplete) {
        onComplete(stats);
      }
    }
  }, [currentSession?.completed, currentSession?.cards.length, endStudySession, onComplete]);

  // Keyboard shortcuts for study session
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar to flip/reveal
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setShowAnswer(prev => !prev);
      }
      // Number keys 1-5 for rating (when answer is shown)
      if (showAnswer && !isSubmitting && ['1', '2', '3', '4', '5'].includes(e.key)) {
        handleRate(parseInt(e.key));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAnswer, isSubmitting, handleRate]);

  useEffect(() => {
    console.log('[StudySession] Session startup check:', {
      currentSession: !!currentSession,
      cardsLength: cards.length,
      activeMemberId: activeMember?.id,
      shouldStart: !currentSession && cards.length > 0 && activeMember,
    });
    
    if (!currentSession && cards.length > 0 && activeMember) {
      console.log('[StudySession] Starting session with member:', activeMember.id);
      startStudySession(cards, mode, activeMember.id, unitId, courseId);
    }
  }, [cards, mode, activeMember?.id, unitId, courseId, currentSession, startStudySession]);

  if (!currentSession) {
    return null;
  }

  const currentCard = currentSession.cards[currentSession.currentIndex];
  const progress = (currentSession.completed / currentSession.cards.length) * 100;
  const isLastCard = currentSession.currentIndex === currentSession.cards.length - 1;
  const canGoBack = currentSession.currentIndex > 0;

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleSkip = () => {
    skipCard();
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    previousCard();
    setShowAnswer(false);
  };

  const handleCancel = () => {
    endStudySession();
    if (onCancel) {
      onCancel();
    }
  };

  const ratingDescriptions = [
    { rating: 1, label: 'Again', description: 'Complete blackout', color: 'bg-red-500 hover:bg-red-600' },
    { rating: 2, label: 'Hard', description: 'Incorrect response', color: 'bg-orange-500 hover:bg-orange-600' },
    { rating: 3, label: 'Good', description: 'Correct with hesitation', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { rating: 4, label: 'Easy', description: 'Perfect response', color: 'bg-green-500 hover:bg-green-600' },
    { rating: 5, label: 'Perfect', description: 'Instant recall', color: 'bg-blue-500 hover:bg-blue-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'study' ? 'Study Session' : 'Review Session'}
            </h2>
            <p className="text-gray-600">
              Card {currentSession.currentIndex + 1} of {currentSession.cards.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X className="w-4 h-4" />}
            onClick={handleCancel}
          >
            End Session
          </Button>
        </div>
        <ProgressBar value={progress} className="mb-2" />
        <p className="text-sm text-gray-600">
          {currentSession.completed} completed · {currentSession.cards.length - currentSession.completed} remaining
        </p>
      </div>

      {/* Flashcard */}
      <div className="mb-6">
        <FlashCard
          card={currentCard}
          showAnswer={showAnswer}
          onFlip={() => setShowAnswer(!showAnswer)}
        />
      </div>

      {/* Controls */}
      <Card className="p-6">
        {!showAnswer ? (
          /* Show answer button */
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleReveal}
              fullWidth
              className="max-w-md"
            >
              Show Answer
            </Button>
          </div>
        ) : (
          /* Rating buttons */
          <div className="space-y-4">
            <p className="text-center text-lg font-semibold text-gray-900 mb-4">
              How well did you know this?
            </p>
            <div className="grid grid-cols-5 gap-2">
              {ratingDescriptions.map(({ rating, label, description, color }) => (
                <button
                  key={rating}
                  onClick={() => handleRate(rating)}
                  disabled={isSubmitting}
                  className={`
                    ${color} text-white p-4 rounded-lg
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex flex-col items-center justify-center
                    hover:scale-105
                  `}
                >
                  <span className="text-2xl font-bold mb-1">{rating}</span>
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs mt-1 opacity-90">{description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            onClick={handlePrevious}
            disabled={!canGoBack || isSubmitting}
          >
            Previous
          </Button>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<SkipForward className="w-4 h-4" />}
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip
          </Button>

          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ChevronRight className="w-4 h-4" />}
            onClick={() => {
              nextCard();
              setShowAnswer(false);
            }}
            disabled={isLastCard || isSubmitting}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Progress indicator */}
      {currentCard?.progress && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Next review: {new Date(currentCard.progress?.nextReviewDate || '').toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudySession;
