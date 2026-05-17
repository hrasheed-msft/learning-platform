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

export default function FiqhScenarioGame({ gameId, difficulty: initialDifficulty }: Props) {
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
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const round = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds ?? 0;

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
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

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
        setRoundStartTime(Date.now());
        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 2000);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, round, currentRound, roundStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">⚖️</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Fiqh Scenario</h1>
        <p className="text-gray-500 mb-6">Choose the correct Islamic ruling for real-life scenarios</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Scenarios
        </Button>
      </div>
    );
  }

  if (!round) {
    return <div className="text-center py-16 text-gray-500">Loading scenario...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      {/* Scenario card */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">⚖️</span>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Scenario {currentRound + 1}</p>
            <p className="text-gray-800 leading-relaxed text-lg">
              {round.content.questionText || round.content.front || ''}
            </p>
          </div>
        </div>
        {round.content.arabicText && (
          <p className="text-lg font-arabic text-primary-700 mt-3 text-right" dir="rtl">
            {round.content.arabicText}
          </p>
        )}
      </div>

      {/* Ruling options */}
      <div className="space-y-3">
        {(round.content.options || []).map((option, idx) => {
          const isSelected = selectedOption === option;
          const correct = showFeedback && option === round.content.correctAnswer;
          const wrong = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              className={clsx(
                'w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3',
                correct && 'bg-green-50 border-green-500',
                wrong && 'bg-red-50 border-red-500',
                !showFeedback && 'border-gray-200 hover:border-slate-400 hover:bg-slate-50 cursor-pointer',
                showFeedback && !correct && !wrong && 'opacity-40',
              )}
            >
              <span className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                correct && 'bg-green-500 text-white',
                wrong && 'bg-red-500 text-white',
                !showFeedback && 'bg-gray-100 text-gray-600',
                showFeedback && !correct && !wrong && 'bg-gray-100 text-gray-400',
              )}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={clsx(
                'font-medium',
                correct && 'text-green-800',
                wrong && 'text-red-800',
                !showFeedback && 'text-gray-800',
              )}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {showFeedback && round.content.explanation && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-sm font-semibold text-emerald-700 mb-1">Explanation</p>
          <p className="text-sm text-emerald-800">{round.content.explanation}</p>
        </div>
      )}
    </div>
  );
}
