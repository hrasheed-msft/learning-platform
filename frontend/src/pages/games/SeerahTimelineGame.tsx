import { useState, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { ScoreDisplay, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

interface TimelineEvent {
  id: string;
  text: string;
  originalIndex: number;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SeerahTimelineGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, lastResult,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [orderedEvents, setOrderedEvents] = useState<TimelineEvent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctPositions, setCorrectPositions] = useState<boolean[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const events: TimelineEvent[] = useMemo(() => {
    if (!activeSession?.rounds) return [];
    return activeSession.rounds.map((round: GameRound, idx: number) => ({
      id: round.content.id,
      text: round.content.questionText || round.content.front || round.content.translation || `Event ${idx + 1}`,
      originalIndex: idx,
    }));
  }, [activeSession?.rounds]);

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
    setRoundStartTime(Date.now());
  };

  useMemo(() => {
    if (gameStarted && events.length > 0 && orderedEvents.length === 0) {
      setOrderedEvents(shuffleArray(events));
    }
  }, [gameStarted, events]);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setOrderedEvents((prev) => {
        const next = [...prev];
        [next[selectedIndex], next[index]] = [next[index], next[selectedIndex]];
        return next;
      });
      setSelectedIndex(null);
    }
  };

  const handleCheck = useCallback(async () => {
    if (showFeedback || !activeSession) return;
    setShowFeedback(true);

    const positions = orderedEvents.map((ev, idx) => ev.originalIndex === idx);
    setCorrectPositions(positions);

    const answer = orderedEvents.map((e) => e.id).join(',');
    const timeSpent = Date.now() - roundStartTime;

    try {
      await submitAnswer(0, { selectedOption: answer }, timeSpent);
      setTimeout(() => completeGame('FINISHED'), 2000);
    } catch {
      setShowFeedback(false);
    }
  }, [showFeedback, activeSession, orderedEvents, roundStartTime]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setOrderedEvents([]);
    setSelectedIndex(null);
    setShowFeedback(false);
    setCorrectPositions([]);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">📜</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Seerah Timeline</h1>
        <p className="text-gray-500 mb-6">Order events from the Prophet's life (ﷺ) chronologically</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <p className="text-xs text-gray-400 mb-6">Tap to select, then tap another to swap positions</p>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          📜 Start Timeline
        </Button>
      </div>
    );
  }

  if (orderedEvents.length === 0) {
    return <div className="text-center py-16 text-gray-500">Loading events...</div>;
  }

  const allCorrect = correctPositions.length > 0 && correctPositions.every(Boolean);
  const correctCount = correctPositions.filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <ScoreDisplay score={score} />
        <span className="text-sm text-gray-500">{orderedEvents.length} events</span>
      </div>

      <p className="text-center text-sm text-gray-500 mb-2">Arrange events from earliest to latest</p>
      {!showFeedback && (
        <p className="text-center text-xs text-gray-400 mb-6">
          {selectedIndex !== null ? 'Tap another event to swap' : 'Tap an event to select'}
        </p>
      )}

      {/* Timeline */}
      <div className="relative mb-8">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-orange-200" />

        <div className="space-y-3">
          {orderedEvents.map((event, idx) => {
            const isSelected = selectedIndex === idx;
            const feedbackCorrect = showFeedback && correctPositions[idx];
            const feedbackWrong = showFeedback && correctPositions.length > 0 && !correctPositions[idx];

            return (
              <button
                key={event.id}
                onClick={() => handleSelect(idx)}
                disabled={showFeedback}
                className={clsx(
                  'w-full text-left pl-14 pr-4 py-4 rounded-xl border-2 transition-all relative',
                  isSelected && 'border-amber-400 bg-amber-50 shadow-lg',
                  feedbackCorrect && 'border-green-400 bg-green-50',
                  feedbackWrong && 'border-red-400 bg-red-50',
                  !isSelected && !showFeedback && 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50 cursor-pointer shadow-sm',
                  showFeedback && 'cursor-default',
                )}
              >
                {/* Timeline dot */}
                <span className={clsx(
                  'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2',
                  isSelected && 'bg-amber-400 border-amber-500 text-white',
                  feedbackCorrect && 'bg-green-500 border-green-600 text-white',
                  feedbackWrong && 'bg-red-500 border-red-600 text-white',
                  !isSelected && !showFeedback && 'bg-white border-orange-300 text-orange-600',
                )}>
                  {feedbackCorrect ? '✓' : feedbackWrong ? '✗' : idx + 1}
                </span>

                <p className={clsx(
                  'font-medium leading-relaxed',
                  feedbackCorrect && 'text-green-800',
                  feedbackWrong && 'text-red-800',
                  !showFeedback && 'text-gray-800',
                )}>
                  {event.text}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <div className={clsx(
          'text-center mb-6 p-4 rounded-2xl font-semibold',
          allCorrect ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
        )}>
          {allCorrect
            ? "🌟 Perfect! You know the Prophet's (ﷺ) life well!"
            : `${correctCount} of ${orderedEvents.length} events in the correct position`}
        </div>
      )}

      {!showFeedback && (
        <div className="text-center">
          <Button
            onClick={handleCheck}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            📜 Check Timeline
          </Button>
        </div>
      )}
    </div>
  );
}
