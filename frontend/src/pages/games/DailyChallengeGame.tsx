import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { GameTimer, ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Flame, Sparkles } from 'lucide-react';
import type { GameDifficulty, GameRound, RoundResult } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

export default function DailyChallengeGame({ gameId, difficulty: initialDifficulty }: Props) {
  const navigate = useNavigate();
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, currentRound, lastResult, dailyChallenge, rounds: _submittedRounds,
    startGame, submitAnswer, completeGame, fetchDailyChallenge, isLoading,
  } = useGameStore();

  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [timerKey, setTimerKey] = useState(0);

  const memberId = selectedMember?.id;
  const difficulty = dailyChallenge?.difficulty || initialDifficulty;
  const timerDuration = difficulty === 'EASY' ? 20000 : difficulty === 'MEDIUM' ? 15000 : 10000;

  useEffect(() => {
    if (memberId) {
      fetchDailyChallenge(memberId);
    }
  }, [memberId]);

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const handleStart = async () => {
    if (!gameId && !dailyChallenge?.id) return;
    if (!memberId) return;
    // Use the daily challenge game ID or fallback
    const gId = gameId || dailyChallenge?.id || '';
    await startGame(gId, memberId, difficulty);
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
        setTimerKey((k) => k + 1);

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1200); // Longer delay for daily challenge — show explanation
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, activeSession, currentRound, roundStartTime, totalRounds]);

  const handleTimeUp = useCallback(() => {
    if (!showFeedback) handleAnswer('__TIMEOUT__');
  }, [showFeedback, handleAnswer]);

  if (lastResult) {
    return (
      <div>
        {/* Streak calendar-like display */}
        {lastResult.streakUpdate && (
          <div className="max-w-lg mx-auto text-center mb-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 inline-flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-500" />
              <div className="text-left">
                <p className="font-bold text-orange-700">{lastResult.streakUpdate.currentStreak} Day Streak!</p>
                <p className="text-xs text-orange-600">Longest: {lastResult.streakUpdate.longestStreak} days</p>
              </div>
            </div>
          </div>
        )}
        <GameOverScreen result={lastResult} />
      </div>
    );
  }

  // Already attempted
  if (dailyChallenge?.attempted) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">✅</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Challenge Complete!</h1>
        <p className="text-gray-500 mb-6">You've already completed today's challenge. Come back tomorrow!</p>
        <Button onClick={() => navigate('/games')} variant="outline" size="lg">
          Back to Games Hub
        </Button>
      </div>
    );
  }

  // Pre-game
  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Daily Challenge</h1>
        <p className="text-gray-500 mb-2">
          {dailyChallenge?.questionCount || 10} questions from your enrolled courses
        </p>
        {dailyChallenge?.streak && (
          <p className="text-sm text-amber-600 mb-6 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4" />
            {dailyChallenge.streak.currentStreak} day streak
          </p>
        )}
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Begin Challenge
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  const options = currentQuestion.content.options || [];
  const questionText = currentQuestion.content.questionText || currentQuestion.content.front || '';
  const results = _submittedRounds.map((r: RoundResult) => r.isCorrect);

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
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
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">{questionText}</h2>
        {currentQuestion.content.arabicText && (
          <p className="mt-2 text-2xl font-arabic text-primary-700">{currentQuestion.content.arabicText}</p>
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
                showCorrectness && !isCorrect && 'bg-red-50 border-red-500 text-red-700',
                !showFeedback && 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer',
                showFeedback && !isSelected && 'opacity-50',
              )}
            >
              <span className="text-sm text-gray-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation on feedback */}
      {showFeedback && currentQuestion.content.explanation && (
        <div className={clsx(
          'mt-4 p-4 rounded-xl text-sm',
          isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        )}>
          {currentQuestion.content.explanation}
        </div>
      )}
    </div>
  );
}
