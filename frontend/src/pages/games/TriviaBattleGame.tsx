import { getOptions } from '../../utils/gameHelpers';
import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { GameProgressBar, GameTimer, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

const TIMER_PER_QUESTION: Record<GameDifficulty, number> = { EASY: 20000, MEDIUM: 15000, HARD: 10000 };

export default function TriviaBattleGame({ gameId, difficulty: initialDifficulty }: Props) {
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
  const [timerKey, setTimerKey] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const round = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds ?? 0;

  // Simulated opponent scoring
  useEffect(() => {
    if (!gameStarted || !activeSession) return;
    const interval = setInterval(() => {
      setOpponentScore((s) => {
        const chance = difficulty === 'EASY' ? 0.4 : difficulty === 'MEDIUM' ? 0.55 : 0.7;
        return Math.random() < chance ? s + 10 : s;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [gameStarted, activeSession, difficulty]);

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
    setRoundStartTime(Date.now());
    setOpponentScore(0);
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
        setTimerKey((k) => k + 1);
        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1200);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, round, currentRound, roundStartTime, totalRounds]);

  const handleTimeUp = () => {
    // Auto-skip on timeout
    if (currentRound + 1 >= totalRounds) {
      completeGame('TIMED_OUT');
    } else {
      setRoundStartTime(Date.now());
      setTimerKey((k) => k + 1);
      submitAnswer(currentRound, { selectedOption: '' }, TIMER_PER_QUESTION[difficulty]).catch(() => {});
    }
  };

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setOpponentScore(0);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">⚔️</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Trivia Battle</h1>
        <p className="text-gray-500 mb-6">Race against an opponent in an Islamic trivia showdown!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          ⚔️ Start Battle
        </Button>
      </div>
    );
  }

  if (!round) {
    return <div className="text-center py-16 text-gray-500">Loading battle...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* VS Score Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-red-500 to-red-700 rounded-xl p-4 mb-6 text-white">
        <div className="text-center">
          <p className="text-xs uppercase opacity-80">You</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <span className="text-2xl font-bold">⚔️</span>
        <div className="text-center">
          <p className="text-xs uppercase opacity-80">Opponent</p>
          <p className="text-2xl font-bold">{opponentScore}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <StreakIndicator streak={streak} />
        <GameTimer key={timerKey} durationMs={TIMER_PER_QUESTION[difficulty]} onTimeUp={handleTimeUp} />
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      {/* Question */}
      <div className="bg-white border-2 border-red-200 rounded-2xl p-6 mb-6">
        <p className="text-lg text-gray-800 font-medium">{round.content.questionText || round.content.front || ''}</p>
        {round.content.arabicText && (
          <p className="text-xl font-arabic text-primary-700 mt-3 text-right" dir="rtl">{round.content.arabicText}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {getOptions(round.content.options).map((option, idx) => {
          const isSelected = selectedOption === option;
          const correct = showFeedback && option === round.content.correctAnswer;
          const wrong = showFeedback && isSelected && !isCorrect;
          const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              className={clsx(
                'p-4 rounded-xl text-white font-bold text-center transition-all',
                correct && 'ring-4 ring-green-300 opacity-100',
                wrong && 'ring-4 ring-red-300 opacity-60',
                !showFeedback && `${colors[idx % 4]} hover:opacity-90 cursor-pointer`,
                showFeedback && !correct && !wrong && `${colors[idx % 4]} opacity-40`,
                showFeedback && correct && 'bg-green-500',
                showFeedback && wrong && 'bg-red-500',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
