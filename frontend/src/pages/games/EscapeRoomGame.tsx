import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { GameTimer, ScoreDisplay, GameProgressBar, HintButton, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Lock, Unlock, KeyRound } from 'lucide-react';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

const THEMES = [
  { name: "The Scholar's Library", emoji: '📚', bg: 'from-amber-800 to-yellow-900' },
  { name: 'The Mosque at Dawn', emoji: '🕌', bg: 'from-indigo-800 to-purple-900' },
  { name: 'The Desert Caravan', emoji: '🐫', bg: 'from-orange-700 to-red-900' },
];

const LOCKS_CONFIG: Record<GameDifficulty, number> = { EASY: 3, MEDIUM: 5, HARD: 7 };

export default function EscapeRoomGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, currentRound, lastResult, rounds: _submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [activeLock, setActiveLock] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [unlockedLocks, setUnlockedLocks] = useState<Set<number>>(new Set());
  const [hintsRemaining, setHintsRemaining] = useState(difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 1 : 0);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const totalLocks = LOCKS_CONFIG[difficulty];
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)] || THEMES[0];

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
    setUnlockedLocks(new Set());
    setRoundStartTime(Date.now());
  };

  const currentChallenge: GameRound | undefined = activeSession?.rounds?.[currentRound];

  const handleLockClick = (lockIndex: number) => {
    if (unlockedLocks.has(lockIndex) || lockIndex !== currentRound) return;
    setActiveLock(lockIndex);
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
        if (result.isCorrect) {
          setUnlockedLocks((prev) => new Set([...prev, currentRound]));
        }
        setShowFeedback(false);
        setSelectedOption(null);
        setActiveLock(null);
        setRoundStartTime(Date.now());

        if (result.sessionState.roundsCompleted >= totalLocks) {
          setTimeout(() => completeGame('FINISHED'), 500);
        }
      }, 1000);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, activeSession, currentRound, roundStartTime, totalLocks]);

  const handleHint = () => {
    setHintsRemaining((h) => h - 1);
    // Hint: highlight correct answer briefly (in real impl, would get hint from backend)
  };

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setActiveLock(null);
    setUnlockedLocks(new Set());
  };

  const handleTimeUp = () => completeGame('TIMED_OUT');

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🔐</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Escape Room</h1>
        <p className="text-gray-500 mb-6">Solve knowledge challenges to unlock each lock and escape!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <p className="text-sm text-gray-400 mb-6">{LOCKS_CONFIG[difficulty]} locks to solve</p>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Enter the Room
        </Button>
      </div>
    );
  }

  const timerDuration = difficulty === 'MEDIUM' ? 600000 : difficulty === 'HARD' ? 420000 : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Room Header */}
      <div className={clsx(
        'bg-gradient-to-r rounded-xl p-6 mb-6 text-white',
        theme.bg
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">{theme.emoji} {theme.name}</p>
            <h2 className="text-xl font-bold">Room {Math.floor(currentRound / 3) + 1}</h2>
          </div>
          <div className="flex items-center gap-3">
            <ScoreDisplay score={score} label="Score" className="text-white [&_p]:text-white/70 [&_p]:last:text-white" />
            {timerDuration > 0 && (
              <GameTimer durationMs={timerDuration} onTimeUp={handleTimeUp} />
            )}
          </div>
        </div>
      </div>

      {/* Lock Progress */}
      <div className="flex justify-center gap-3 mb-8">
        {Array.from({ length: totalLocks }, (_, i) => {
          const isUnlocked = unlockedLocks.has(i);
          const isCurrent = i === currentRound;
          return (
            <button
              key={i}
              onClick={() => handleLockClick(i)}
              disabled={!isCurrent}
              className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                isUnlocked && 'bg-green-100 text-green-600 scale-110',
                isCurrent && !isUnlocked && 'bg-primary-100 text-primary-600 ring-2 ring-primary-300 animate-pulse cursor-pointer',
                !isCurrent && !isUnlocked && 'bg-gray-100 text-gray-400',
              )}
            >
              {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {/* Challenge Overlay */}
      {activeLock !== null && currentChallenge && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-primary-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-primary-500" />
            <h3 className="font-bold text-gray-900">Lock {activeLock + 1} Challenge</h3>
            <HintButton
              hintsRemaining={hintsRemaining}
              maxHints={difficulty === 'EASY' ? 3 : 1}
              onUseHint={handleHint}
              className="ml-auto"
            />
          </div>

          <p className="text-lg text-gray-800 mb-4">
            {currentChallenge.content.questionText || currentChallenge.content.front}
          </p>
          {currentChallenge.content.arabicText && (
            <p className="text-xl font-arabic text-primary-700 mb-4">{currentChallenge.content.arabicText}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(currentChallenge.content.options || []).map((option, idx) => {
              const isSelected = selectedOption === option;
              const showCorrectness = showFeedback && isSelected;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className={clsx(
                    'p-3 rounded-xl border-2 text-left font-medium transition-all duration-200',
                    showCorrectness && isCorrect && 'bg-green-50 border-green-500 text-green-700',
                    showCorrectness && !isCorrect && 'bg-red-50 border-red-500 text-red-700',
                    !showFeedback && 'bg-white border-gray-200 hover:border-primary-300 cursor-pointer',
                    showFeedback && !isSelected && 'opacity-50',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeLock === null && (
        <div className="text-center py-8 text-gray-500">
          <Lock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>Click the glowing lock to begin the challenge!</p>
        </div>
      )}

      <GameProgressBar current={unlockedLocks.size} total={totalLocks} className="mt-6" />
    </div>
  );
}
