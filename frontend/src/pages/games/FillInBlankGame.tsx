import { getOptions } from '../../utils/gameHelpers';
import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

export default function FillInBlankGame({ gameId, difficulty: initialDifficulty }: Props) {
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

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

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
    if (showFeedback || !activeSession) return;

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
      }, 1200);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, activeSession, currentRound, roundStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">📝</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Fill in the Blank</h1>
        <p className="text-gray-500 mb-6">Complete sentences by choosing the correct word!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Game
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading question...</div>;
  }

  const rawQuestion = currentQuestion.content.questionText || currentQuestion.content.front || '';
  const hasBlank = rawQuestion.includes('___');
  const displayQuestion = hasBlank ? rawQuestion : `What is: ${rawQuestion}?`;
  const options = getOptions(currentQuestion.content.options);
  const correctAnswer = currentQuestion.content.correctAnswer || '';
  const results = submittedRounds.map((r) => r.isCorrect);

  // Build sentence display with blank highlighted
  const renderQuestion = () => {
    if (!hasBlank) {
      return <span>{displayQuestion}</span>;
    }
    const parts = displayQuestion.split('___');
    return (
      <>
        {parts[0]}
        <span className={clsx(
          'inline-block min-w-[100px] mx-1 px-3 py-1 rounded-lg border-2 border-dashed text-center transition-all duration-300',
          showFeedback && isCorrect && 'border-green-400 bg-green-100 text-green-700',
          showFeedback && !isCorrect && 'border-red-400 bg-red-100 text-red-700',
          !showFeedback && selectedOption && 'border-teal-400 bg-teal-50 text-teal-700',
          !showFeedback && !selectedOption && 'border-amber-300 bg-amber-50 text-amber-400',
        )}>
          {selectedOption || '?'}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {currentRound + 1} / {totalRounds}
        </span>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Question Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-sm border border-emerald-100 mb-8">
        <p className="text-xs text-emerald-600 uppercase tracking-wider mb-3 font-semibold">
          Complete the sentence
        </p>
        <p className="text-xl text-gray-800 leading-relaxed font-medium">
          {renderQuestion()}
        </p>
        {currentQuestion.content.arabicText && (
          <p className="mt-4 text-2xl font-arabic text-emerald-700 text-center">
            {currentQuestion.content.arabicText}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = showFeedback && option === correctAnswer;
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              className={clsx(
                'p-4 rounded-xl border-2 text-left font-medium transition-all duration-300',
                isCorrectOption && 'bg-green-50 border-green-500 text-green-700 shadow-md shadow-green-100',
                isSelected && showFeedback && !isCorrect && !isCorrectOption && 'bg-red-50 border-red-500 text-red-700 animate-pulse',
                !showFeedback && !isSelected && 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer hover:shadow-md',
                !showFeedback && isSelected && 'bg-teal-50 border-teal-400 text-teal-700',
                showFeedback && !isSelected && !isCorrectOption && 'opacity-50',
              )}
            >
              <span className="text-sm text-gray-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={clsx(
          'text-center mt-6 p-4 rounded-xl transition-all duration-300',
          isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
        )}>
          <p className="font-semibold text-lg">
            {isCorrect ? '✨ Excellent!' : `The answer was: ${correctAnswer}`}
          </p>
          {currentQuestion.content.explanation && (
            <p className="text-sm mt-1 opacity-80">{currentQuestion.content.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
