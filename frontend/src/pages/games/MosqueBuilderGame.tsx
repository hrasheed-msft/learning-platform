import { getOptions } from '../../utils/gameHelpers';
import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

const MOSQUE_PARTS = [
  { name: 'Foundation', emoji: '🧱', threshold: 0 },
  { name: 'Walls', emoji: '🏗️', threshold: 1 },
  { name: 'Windows', emoji: '🪟', threshold: 2 },
  { name: 'Roof', emoji: '🏠', threshold: 3 },
  { name: 'Minaret', emoji: '🗼', threshold: 4 },
  { name: 'Dome', emoji: '🕌', threshold: 6 },
  { name: 'Crescent', emoji: '☪️', threshold: 8 },
  { name: 'Garden', emoji: '🌳', threshold: 10 },
];

export default function MosqueBuilderGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, streak, currentRound, lastResult,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const round = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds ?? 0;
  const builtParts = MOSQUE_PARTS.filter((p) => correctCount >= p.threshold);

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
    setCorrectCount(0);
    setRoundStartTime(Date.now());
  };

  const handleAnswer = useCallback(async (answer: string) => {
    if (showFeedback || !round) return;
    setSelectedOption(answer);
    setShowFeedback(true);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(currentRound, { selectedOption: answer }, timeSpent);
      setIsCorrect(result.isCorrect);
      if (result.isCorrect) setCorrectCount((c) => c + 1);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
        setRoundStartTime(Date.now());
        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1500);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, round, currentRound, roundStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setCorrectCount(0);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🕌</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mosque Builder</h1>
        <p className="text-gray-500 mb-6">Answer correctly to build your mosque piece by piece!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          🕌 Start Building
        </Button>
      </div>
    );
  }

  if (!round) {
    return <div className="text-center py-16 text-gray-500">Preparing site...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-4" />

      {/* Mosque visualization */}
      <div className="bg-gradient-to-b from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-2xl p-6 mb-6">
        <div className="flex justify-center gap-1 flex-wrap mb-3">
          {builtParts.map((part) => (
            <span key={part.name} className="text-3xl" title={part.name}>{part.emoji}</span>
          ))}
          {builtParts.length === 0 && <span className="text-gray-400 text-sm">Answer correctly to start building!</span>}
        </div>
        <div className="flex justify-center gap-0.5">
          {MOSQUE_PARTS.map((part, idx) => (
            <div
              key={idx}
              className={clsx(
                'w-6 h-2 rounded-full',
                correctCount >= part.threshold ? 'bg-teal-500' : 'bg-gray-200',
              )}
              title={part.name}
            />
          ))}
        </div>
        <p className="text-center text-xs text-teal-600 mt-2">{builtParts.length}/{MOSQUE_PARTS.length} parts built</p>
      </div>

      {/* Question */}
      <div className="bg-white border-2 border-teal-200 rounded-2xl p-6 mb-6">
        <p className="text-lg text-gray-800">{round.content.questionText || round.content.front || ''}</p>
        {round.content.arabicText && (
          <p className="text-xl font-arabic text-primary-700 mt-3 text-right" dir="rtl">{round.content.arabicText}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {getOptions(round.content.options).map((option, idx) => {
          const isSelected = selectedOption === option;
          const correct = showFeedback && option === round.content.correctAnswer;
          const wrong = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              className={clsx(
                'p-4 rounded-xl border-2 text-center font-medium transition-all',
                correct && 'bg-green-50 border-green-500 text-green-800',
                wrong && 'bg-red-50 border-red-500 text-red-800',
                !showFeedback && 'border-gray-200 hover:border-teal-400 hover:bg-teal-50 cursor-pointer',
                showFeedback && !correct && !wrong && 'opacity-40',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={clsx('mt-4 p-3 rounded-xl text-sm text-center font-semibold',
          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
        )}>
          {isCorrect ? '🧱 New part added to your mosque!' : '❌ Keep trying — your mosque awaits!'}
        </div>
      )}
    </div>
  );
}
