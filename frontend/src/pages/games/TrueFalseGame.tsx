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

export default function TrueFalseGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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

  const handleAnswer = useCallback(async (answer: 'true' | 'false') => {
    if (showFeedback || !activeSession) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(currentRound, { selectedOption: answer }, timeSpent);
      setIsCorrect(result.isCorrect);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        setRoundStartTime(Date.now());

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1500);
    } catch {
      setShowFeedback(false);
      setSelectedAnswer(null);
    }
  }, [showFeedback, activeSession, currentRound, roundStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">⚖️</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">True or False</h1>
        <p className="text-gray-500 mb-6">Is the statement true or false? Test your knowledge!</p>
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

  const statement = currentQuestion.content.questionText || currentQuestion.content.front || '';
  const correctAnswer = (currentQuestion.content.correctAnswer || '').toLowerCase();
  const results = submittedRounds.map((r) => r.isCorrect);

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} multiplier={streak >= 5 ? 2 : streak >= 3 ? 1.5 : undefined} />
        <StreakIndicator streak={streak} />
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {currentRound + 1} / {totalRounds}
        </span>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Statement Card */}
      <div className={clsx(
        'rounded-2xl p-8 shadow-sm border-2 mb-10 text-center transition-all duration-500',
        showFeedback && isCorrect && 'bg-green-50 border-green-300',
        showFeedback && !isCorrect && 'bg-red-50 border-red-300',
        !showFeedback && 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
      )}>
        <p className="text-xs text-amber-600 uppercase tracking-wider mb-3 font-semibold">
          True or False?
        </p>
        <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
          {statement}
        </h2>
        {currentQuestion.content.arabicText && (
          <p className="mt-4 text-2xl font-arabic text-amber-700">
            {currentQuestion.content.arabicText}
          </p>
        )}
      </div>

      {/* True / False Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleAnswer('true')}
          disabled={showFeedback}
          className={clsx(
            'flex-1 max-w-[200px] py-6 rounded-2xl border-3 font-bold text-xl transition-all duration-300',
            'flex flex-col items-center gap-2',
            showFeedback && selectedAnswer === 'true' && isCorrect && 'bg-green-500 border-green-600 text-white scale-105 shadow-lg shadow-green-200',
            showFeedback && selectedAnswer === 'true' && !isCorrect && 'bg-red-500 border-red-600 text-white animate-pulse',
            showFeedback && selectedAnswer !== 'true' && correctAnswer === 'true' && 'bg-green-100 border-green-400 text-green-700',
            showFeedback && selectedAnswer !== 'true' && correctAnswer !== 'true' && 'opacity-40',
            !showFeedback && 'bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
          )}
        >
          <span className="text-3xl">✅</span>
          <span>True</span>
        </button>

        <button
          onClick={() => handleAnswer('false')}
          disabled={showFeedback}
          className={clsx(
            'flex-1 max-w-[200px] py-6 rounded-2xl border-3 font-bold text-xl transition-all duration-300',
            'flex flex-col items-center gap-2',
            showFeedback && selectedAnswer === 'false' && isCorrect && 'bg-green-500 border-green-600 text-white scale-105 shadow-lg shadow-green-200',
            showFeedback && selectedAnswer === 'false' && !isCorrect && 'bg-red-500 border-red-600 text-white animate-pulse',
            showFeedback && selectedAnswer !== 'false' && correctAnswer === 'false' && 'bg-green-100 border-green-400 text-green-700',
            showFeedback && selectedAnswer !== 'false' && correctAnswer !== 'false' && 'opacity-40',
            !showFeedback && 'bg-white border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
          )}
        >
          <span className="text-3xl">❌</span>
          <span>False</span>
        </button>
      </div>

      {/* Feedback & Explanation */}
      {showFeedback && (
        <div className={clsx(
          'text-center mt-8 p-5 rounded-2xl transition-all duration-300',
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200',
        )}>
          <p className={clsx(
            'font-bold text-lg',
            isCorrect ? 'text-green-700' : 'text-red-700',
          )}>
            {isCorrect ? '🌟 Masha\'Allah! Correct!' : `Not quite — the answer is ${correctAnswer}.`}
          </p>
          {currentQuestion.content.explanation && (
            <p className="text-sm text-gray-600 mt-2">{currentQuestion.content.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
