import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { GameTimer, ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { getOptions } from '../../utils/gameHelpers';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

const TIME_PER_Q: Record<GameDifficulty, number> = { EASY: 15000, MEDIUM: 10000, HARD: 7000 };

export default function SpeedQuizGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [timerKey, setTimerKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;
  const timerDuration = TIME_PER_Q[difficulty];

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
    setRoundStartTime(Date.now());
    setTimerKey(0);
  };

  const handleAnswer = useCallback(async (answer: string) => {
    if (showFeedback || !activeSession || submitting) return;

    setSubmitting(true);
    setSelectedOption(answer);
    setShowFeedback(true);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(currentRound, { selectedOption: answer }, timeSpent);
      setIsCorrect(result.isCorrect);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
        setSubmitting(false);
        setRoundStartTime(Date.now());
        setTimerKey((k) => k + 1);

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 800);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
      setSubmitting(false);
    }
  }, [showFeedback, activeSession, submitting, currentRound, roundStartTime, totalRounds]);

  const handleTimeUp = useCallback(() => {
    if (!showFeedback && !submitting) {
      handleAnswer('__TIMEOUT__');
    }
  }, [showFeedback, submitting, handleAnswer]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  // Game Over
  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  // Pre-game
  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">⚡</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Speed Quiz</h1>
        <p className="text-gray-500 mb-6">Answer rapid-fire questions against the clock!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <p className="text-sm text-gray-400 mb-6">
          {TIME_PER_Q[difficulty] / 1000}s per question
        </p>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Quiz
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading question...</div>;
  }

  const options = getOptions(currentQuestion.content.options);
  const questionText = currentQuestion.content.questionText || currentQuestion.content.front || '';
  const results = submittedRounds.map((r) => r.isCorrect);

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} multiplier={streak >= 10 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : undefined} />
        <StreakIndicator streak={streak} />
        <GameTimer
          key={timerKey}
          durationMs={timerDuration}
          warningAtMs={5000}
          criticalAtMs={2000}
          onTimeUp={handleTimeUp}
          isPaused={showFeedback}
        />
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Question */}
      <div className="text-center mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
          Question {currentRound + 1} of {totalRounds}
        </p>
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {questionText}
        </h2>
        {currentQuestion.content.arabicText && (
          <p className="mt-2 text-2xl font-arabic text-primary-700">
            {currentQuestion.content.arabicText}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const showCorrectness = showFeedback && isSelected;
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              className={clsx(
                'p-4 rounded-xl border-2 text-left font-medium transition-all duration-200',
                showCorrectness && isCorrect && 'bg-green-50 border-green-500 text-green-700',
                showCorrectness && !isCorrect && 'bg-red-50 border-red-500 text-red-700 animate-pulse',
                !showFeedback && !isSelected && 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer',
                showFeedback && !isSelected && 'opacity-50',
              )}
            >
              <span className="text-sm text-gray-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
