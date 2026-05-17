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

const ZONES = [
  { name: 'Oasis of Aqeedah', emoji: '🏜️', color: 'from-amber-400 to-yellow-500' },
  { name: 'Valley of Fiqh', emoji: '🏔️', color: 'from-stone-400 to-stone-600' },
  { name: 'Garden of Seerah', emoji: '🌿', color: 'from-green-400 to-emerald-500' },
  { name: 'River of Hadith', emoji: '🌊', color: 'from-blue-400 to-cyan-500' },
  { name: 'Summit of Tafseer', emoji: '⛰️', color: 'from-purple-400 to-violet-500' },
];

export default function KnowledgeExpeditionGame({ gameId, difficulty: initialDifficulty }: Props) {
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
  const currentZone = ZONES[Math.min(Math.floor((currentRound / Math.max(totalRounds, 1)) * ZONES.length), ZONES.length - 1)];

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
        <span className="text-6xl mb-4 block">🗻</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Expedition</h1>
        <p className="text-gray-500 mb-6">Journey through zones of Islamic knowledge — answer correctly to advance!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {ZONES.map((z) => (
            <span key={z.name} title={z.name} className="text-xl">{z.emoji}</span>
          ))}
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Begin Expedition
        </Button>
      </div>
    );
  }

  if (!round) {
    return <div className="text-center py-16 text-gray-500">Preparing expedition...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Zone banner */}
      <div className={clsx('bg-gradient-to-r rounded-xl p-4 mb-6 text-white text-center', currentZone.color)}>
        <span className="text-3xl">{currentZone.emoji}</span>
        <p className="text-sm font-semibold mt-1">{currentZone.name}</p>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      {/* Question */}
      <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 mb-6">
        <p className="text-lg text-gray-800 leading-relaxed">
          {round.content.questionText || round.content.front || ''}
        </p>
        {round.content.arabicText && (
          <p className="text-xl font-arabic text-primary-700 mt-3 text-right" dir="rtl">
            {round.content.arabicText}
          </p>
        )}
      </div>

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
                'p-4 rounded-xl border-2 text-center font-medium transition-all',
                correct && 'bg-green-50 border-green-500 text-green-800',
                wrong && 'bg-red-50 border-red-500 text-red-800',
                !showFeedback && 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer',
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
          {isCorrect ? '🌟 Correct! Advancing...' : '❌ Not quite — keep exploring!'}
        </div>
      )}
    </div>
  );
}
