import { useState, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Eraser, Check } from 'lucide-react';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

export default function CalligraphyTraceGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const arabicText = currentQuestion?.content.arabicText || currentQuestion?.content.front || '';

  // Draw the watermark guide text on canvas
  useEffect(() => {
    if (!gameStarted || !arabicText) return;
    drawWatermark();
  }, [gameStarted, currentRound, arabicText]);

  const drawWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Watermark text
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#065f46';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = Math.min(canvas.width / (arabicText.length * 0.6 || 1), 160);
    ctx.font = `${fontSize}px "Noto Naskh Arabic", "Amiri", serif`;
    ctx.direction = 'rtl';
    ctx.fillText(arabicText, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      if (!touch) return null;
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    setIsDrawing(true);
    setHasDrawn(true);
    lastPointRef.current = pos;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    if (!pos) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !lastPointRef.current) return;

    ctx.beginPath();
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPointRef.current = pos;
  };

  const endDraw = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    setHasDrawn(false);
    drawWatermark();
  };

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setHasDrawn(false);
    setRoundStartTime(Date.now());
  };

  const handleSubmit = useCallback(async () => {
    if (showFeedback || !activeSession || !currentQuestion) return;
    setShowFeedback(true);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(
        currentRound,
        { selectedOption: currentQuestion.content.id },
        timeSpent,
      );

      setTimeout(() => {
        setShowFeedback(false);
        setHasDrawn(false);
        setRoundStartTime(Date.now());

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1000);
    } catch {
      setShowFeedback(false);
    }
  }, [showFeedback, activeSession, currentQuestion, currentRound, roundStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setHasDrawn(false);
    setShowFeedback(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">✍️</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Calligraphy Trace</h1>
        <p className="text-gray-500 mb-6">Trace Arabic letters and words to practice your writing!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Tracing
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading round...</div>;
  }

  const results = submittedRounds.map((r) => r.isCorrect);

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        <span className="text-sm text-gray-500">
          {currentRound + 1} / {totalRounds}
        </span>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-6" />

      {/* Reference text */}
      <div className="text-center mb-4">
        <p className="text-4xl font-arabic text-emerald-800 leading-relaxed">{arabicText}</p>
        {currentQuestion.content.transliteration && (
          <p className="text-sm text-gray-500 italic mt-1">{currentQuestion.content.transliteration}</p>
        )}
        {currentQuestion.content.translation && (
          <p className="text-sm text-gray-400 mt-1">{currentQuestion.content.translation}</p>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mb-3">
        Trace over the guide below with your mouse or finger
      </p>

      {/* Canvas */}
      <div className={clsx(
        'rounded-2xl overflow-hidden shadow-lg border-2 mb-6 touch-none transition-colors',
        showFeedback ? 'border-green-400' : 'border-amber-200',
      )}>
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full cursor-crosshair"
          style={{ touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="text-center mb-4 p-3 rounded-xl bg-green-100 text-green-700 font-semibold text-sm">
          ✨ Beautiful work! Keep practising your calligraphy!
        </div>
      )}

      {/* Action buttons */}
      {!showFeedback && (
        <div className="flex justify-center gap-3">
          <Button
            onClick={clearCanvas}
            variant="outline"
            leftIcon={<Eraser className="w-4 h-4" />}
          >
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={!hasDrawn}
            leftIcon={<Check className="w-4 h-4" />}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            Submit Trace
          </Button>
        </div>
      )}
    </div>
  );
}
