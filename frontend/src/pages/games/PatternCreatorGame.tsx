import { getOptions } from '../../utils/gameHelpers';
import { useState, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { ScoreDisplay, GameProgressBar, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

const COLORS = ['#1B7A4A', '#C5A028', '#2563EB', '#9333EA', '#DC2626', '#0D9488'];

export default function PatternCreatorGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, currentRound, lastResult,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const round = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds ?? 0;

  // Draw decorative pattern on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameStarted) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const segments = difficulty === 'EASY' ? 6 : difficulty === 'MEDIUM' ? 8 : 12;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.4;

    ctx.strokeStyle = COLORS[currentRound % COLORS.length];
    ctx.lineWidth = 2;

    for (let i = 0; i < segments; i++) {
      const angle = (i * 2 * Math.PI) / segments;
      const nextAngle = ((i + 1) * 2 * Math.PI) / segments;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.lineTo(cx + radius * Math.cos(nextAngle), cy + radius * Math.sin(nextAngle));
      ctx.closePath();
      ctx.stroke();

      // Inner pattern
      const innerR = radius * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
      ctx.lineTo(cx + innerR * Math.cos(nextAngle), cy + innerR * Math.sin(nextAngle));
      ctx.stroke();
    }

    // Missing segment indicator
    ctx.fillStyle = '#FEF3C7';
    const missingAngle = (0 * 2 * Math.PI) / segments;
    const missingNext = (1 * 2 * Math.PI) / segments;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(missingAngle), cy + radius * Math.sin(missingAngle));
    ctx.lineTo(cx + radius * Math.cos(missingNext), cy + radius * Math.sin(missingNext));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#92400E';
    ctx.font = '14px sans-serif';
    ctx.fillText('?', cx + radius * 0.3, cy + 5);
  }, [gameStarted, currentRound, difficulty]);

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
        <span className="text-6xl mb-4 block">🎨</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pattern Creator</h1>
        <p className="text-gray-500 mb-6">Complete Islamic geometric patterns by answering knowledge questions</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          🎨 Create Patterns
        </Button>
      </div>
    );
  }

  if (!round) {
    return <div className="text-center py-16 text-gray-500">Preparing pattern...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <span className="text-sm text-gray-500">Pattern {currentRound + 1}/{totalRounds}</span>
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-4" />

      {/* Pattern display */}
      <div className="flex justify-center mb-6">
        <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 shadow-inner">
          <canvas ref={canvasRef} className="mx-auto" />
          <p className="text-center text-xs text-purple-500 mt-2">Complete the missing piece!</p>
        </div>
      </div>

      {/* Question */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 text-center">
        <p className="text-gray-800">{round.content.questionText || round.content.front || ''}</p>
        {round.content.arabicText && (
          <p className="text-lg font-arabic text-primary-700 mt-2" dir="rtl">{round.content.arabicText}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
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
                correct && 'bg-green-50 border-green-500',
                wrong && 'bg-red-50 border-red-500',
                !showFeedback && 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer',
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
          {isCorrect ? '✨ Pattern piece complete!' : '❌ Try again next round'}
        </div>
      )}
    </div>
  );
}
