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

export default function AyahCompletionGame({ gameId, difficulty: initialDifficulty }: Props) {
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
      }, 1500);
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
        <span className="text-6xl mb-4 block">📖</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ayah Completion</h1>
        <p className="text-gray-500 mb-6">Complete the missing words in Quranic verses</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Begin
        </Button>
      </div>
    );
  }

  if (!round) {
    return <div className="text-center py-16 text-gray-500">Loading verse...</div>;
  }

  const verseText = round.content.arabicText || round.content.questionText || '';
  const displayText = verseText.replace(/___+/g, '______');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      {/* Verse display */}
      <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-6 mb-6 text-center">
        <p className="text-xs text-sky-600 uppercase tracking-wide mb-3">Complete the Ayah</p>
        <p className="text-2xl font-arabic leading-loose text-gray-900 dir-rtl" dir="rtl">
          {displayText}
        </p>
        {round.content.transliteration && (
          <p className="text-sm text-gray-400 mt-3 italic">{round.content.transliteration}</p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                'p-4 rounded-xl border-2 text-center font-arabic text-lg transition-all',
                correct && 'bg-green-50 border-green-500 text-green-800',
                wrong && 'bg-red-50 border-red-500 text-red-800',
                !showFeedback && 'border-gray-200 hover:border-sky-400 hover:bg-sky-50 cursor-pointer',
                showFeedback && !correct && !wrong && 'opacity-40',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && round.content.explanation && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          {round.content.explanation}
        </div>
      )}
    </div>
  );
}
