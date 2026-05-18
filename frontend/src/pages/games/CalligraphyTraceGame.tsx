import { useEffect, useRef, useState } from 'react';
import { Eraser, Check } from 'lucide-react';
import { GameOverScreen, ScoreDisplay, GameProgressBar } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';

/**
 * Calligraphy Trace — trace Arabic letters/words on a canvas.
 */
export default function CalligraphyTraceGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, difficulty, submit, playAgain, exitToHub,
  } = r;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [pathPoints, setPathPoints] = useState<number>(0);

  const c = currentContent?.content;
  const letter = String(c?.letter ?? c?.arabicText ?? c?.front ?? 'ا');
  const showGuide = difficulty !== 'HARD';

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    setPathPoints(0);
  }, [currentRound]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const getPos = (e: React.PointerEvent) => {
    const cv = canvasRef.current!;
    const rect = cv.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (cv.width / rect.width), y: (e.clientY - rect.top) * (cv.height / rect.height) };
  };

  const onDown = (e: React.PointerEvent) => {
    setDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.strokeStyle = '#7c3aed';
    ctx.beginPath(); ctx.moveTo(x, y);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.lineTo(x, y); ctx.stroke();
    setPathPoints((p) => p + 1);
  };
  const onUp = () => setDrawing(false);

  const clear = () => {
    const cv = canvasRef.current; if (!cv) return;
    cv.getContext('2d')!.clearRect(0, 0, cv.width, cv.height);
    setPathPoints(0);
  };

  const scorePath = (): number => {
    const cv = canvasRef.current; if (!cv) return 0;
    const ctx = cv.getContext('2d')!;
    const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let inked = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) inked++;
    }
    const total = cv.width * cv.height;
    const coverage = inked / total;
    if (coverage < 0.01) return 0;
    if (coverage > 0.25) return 0.5;
    return Math.min(1, coverage / 0.10);
  };

  const handleSubmit = () => {
    const accuracy = scorePath();
    submit({ accuracy, strokePoints: pathPoints, correct: accuracy >= 0.5 });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ScoreDisplay score={score} />
        <span className="text-sm text-gray-500">{currentRound + 1} / {totalRounds}</span>
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      <div className="relative bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-200 mb-4 overflow-hidden">
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              dir="rtl"
              className="font-arabic text-[12rem] sm:text-[16rem] leading-none text-violet-200 opacity-60"
            >
              {letter}
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="w-full h-72 touch-none relative cursor-crosshair"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
      </div>

      <p className="text-xs text-gray-500 text-center mb-4">
        {showGuide
          ? 'Trace over the faded letter. Lift your finger between strokes.'
          : 'Write the letter from memory.'}
      </p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={clear}>
          <Eraser className="w-4 h-4 mr-1" /> Clear
        </Button>
        <Button variant="primary" onClick={handleSubmit} className="flex-1" disabled={pathPoints < 5}>
          <Check className="w-4 h-4 mr-1" /> Submit Trace
        </Button>
      </div>

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
