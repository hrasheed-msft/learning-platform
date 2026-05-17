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

interface ChainLink {
  id: string;
  name: string;
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

export default function HadithChainGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, lastResult,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [orderedLinks, setOrderedLinks] = useState<ChainLink[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctPositions, setCorrectPositions] = useState<boolean[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const links: ChainLink[] = useMemo(() => {
    if (!activeSession?.rounds) return [];
    return activeSession.rounds.map((round: GameRound, idx: number) => ({
      id: round.content.id,
      name: round.content.questionText || round.content.front || round.content.arabicText || `Narrator ${idx + 1}`,
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
    if (gameStarted && links.length > 0 && orderedLinks.length === 0) {
      setOrderedLinks(shuffleArray(links));
    }
  }, [gameStarted, links]);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setOrderedLinks((prev) => {
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

    const positions = orderedLinks.map((link, idx) => link.originalIndex === idx);
    setCorrectPositions(positions);

    const answer = orderedLinks.map((l) => l.id).join(',');
    const timeSpent = Date.now() - roundStartTime;

    try {
      await submitAnswer(0, { selectedOption: answer }, timeSpent);
      setTimeout(() => completeGame('FINISHED'), 2000);
    } catch {
      setShowFeedback(false);
    }
  }, [showFeedback, activeSession, orderedLinks, roundStartTime]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setOrderedLinks([]);
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
        <span className="text-6xl mb-4 block">🔗</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hadith Chain</h1>
        <p className="text-gray-500 mb-6">Arrange the narrators in the correct chain of transmission (isnad)</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <p className="text-xs text-gray-400 mb-6">Tap a narrator to select, then tap another to swap</p>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Chain
        </Button>
      </div>
    );
  }

  if (orderedLinks.length === 0) {
    return <div className="text-center py-16 text-gray-500">Loading chain...</div>;
  }

  const allCorrect = correctPositions.length > 0 && correctPositions.every(Boolean);
  const correctCount = correctPositions.filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <ScoreDisplay score={score} />
        <span className="text-sm text-gray-500">{orderedLinks.length} narrators</span>
      </div>

      <p className="text-center text-sm text-gray-500 mb-2">Arrange the isnad from source to narrator</p>
      {!showFeedback && (
        <p className="text-center text-xs text-gray-400 mb-6">
          {selectedIndex !== null ? 'Tap another to swap' : 'Tap to select'}
        </p>
      )}

      {/* Chain links with connector lines */}
      <div className="space-y-1 mb-8">
        {orderedLinks.map((link, idx) => {
          const isSelected = selectedIndex === idx;
          const feedbackCorrect = showFeedback && correctPositions[idx];
          const feedbackWrong = showFeedback && correctPositions.length > 0 && !correctPositions[idx];

          return (
            <div key={link.id}>
              <button
                onClick={() => handleSelect(idx)}
                disabled={showFeedback}
                className={clsx(
                  'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3',
                  isSelected && 'border-amber-400 bg-amber-50 shadow-lg scale-[1.02]',
                  feedbackCorrect && 'border-green-400 bg-green-50',
                  feedbackWrong && 'border-red-400 bg-red-50',
                  !isSelected && !showFeedback && 'border-gray-200 bg-white hover:border-stone-400 hover:bg-stone-50 cursor-pointer shadow-sm',
                  showFeedback && 'cursor-default',
                )}
              >
                <span className={clsx(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                  isSelected && 'bg-amber-400 text-white',
                  feedbackCorrect && 'bg-green-500 text-white',
                  feedbackWrong && 'bg-red-500 text-white',
                  !isSelected && !showFeedback && 'bg-stone-100 text-stone-500',
                )}>
                  {feedbackCorrect ? '✓' : feedbackWrong ? '✗' : idx + 1}
                </span>
                <span className="font-medium text-gray-800">{link.name}</span>
              </button>
              {idx < orderedLinks.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-0.5 h-4 bg-stone-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showFeedback && (
        <div className={clsx(
          'text-center mb-6 p-4 rounded-2xl font-semibold',
          allCorrect ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
        )}>
          {allCorrect
            ? '🌟 Perfect chain! All narrators in correct order!'
            : `${correctCount} of ${orderedLinks.length} narrators correctly placed`}
        </div>
      )}

      {!showFeedback && (
        <div className="text-center">
          <Button
            onClick={handleCheck}
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-stone-600 to-stone-800 hover:from-stone-700 hover:to-stone-900"
          >
            🔗 Check Chain
          </Button>
        </div>
      )}
    </div>
  );
}
