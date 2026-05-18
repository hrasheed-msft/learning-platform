import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { RotateCw } from 'lucide-react';
import { GameOverScreen, ScoreDisplay, GameProgressBar } from '@/components/games';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';

const RATINGS: { value: number; label: string; color: string; desc: string }[] = [
  { value: 1, label: 'Again', color: 'bg-red-500 hover:bg-red-600', desc: 'Forgot completely' },
  { value: 2, label: 'Hard',  color: 'bg-orange-500 hover:bg-orange-600', desc: 'Struggled' },
  { value: 4, label: 'Good',  color: 'bg-emerald-500 hover:bg-emerald-600', desc: 'Recalled with effort' },
  { value: 5, label: 'Easy',  color: 'bg-indigo-500 hover:bg-indigo-600', desc: 'Instant recall' },
];

/**
 * Flashcard Sprint — front → think → flip → self-rate. Feeds SRS.
 */
export default function FlashcardSprintGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, submit, playAgain, exitToHub,
  } = r;

  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setFlipped(false); }, [currentRound]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const c = currentContent.content;
  const front = c.front || c.frontArabic || c.questionText || '';
  const back = c.back || c.backArabic || c.translation || c.correctAnswer || '';
  const frontIsArabic = /[\u0600-\u06FF]/.test(String(front));
  const backIsArabic = /[\u0600-\u06FF]/.test(String(back));

  const handleRate = (rating: number) => {
    submit({ rating, knew: rating >= 4 });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ScoreDisplay score={score} />
        <span className="text-sm text-gray-500">{currentRound + 1} / {totalRounds}</span>
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      {/* Card */}
      <div className="relative h-72 perspective-1000 mb-6">
        <div
          className={clsx(
            'absolute inset-0 transition-transform duration-500 transform-style-3d cursor-pointer',
            flipped && 'rotate-y-180',
          )}
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
          onClick={() => !flipped && setFlipped(true)}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex flex-col items-center justify-center p-8 text-center shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xs uppercase tracking-widest text-white/70 mb-4">Front</p>
            <p
              dir={frontIsArabic ? 'rtl' : 'ltr'}
              className={clsx('text-2xl font-bold', frontIsArabic && 'font-arabic text-4xl leading-loose')}
            >
              {front}
            </p>
            {!flipped && <p className="text-sm text-white/60 mt-6">Tap to flip</p>}
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl bg-white border-2 border-indigo-200 text-gray-800 flex flex-col items-center justify-center p-8 text-center shadow-xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-xs uppercase tracking-widest text-indigo-500 mb-4">Back</p>
            <p
              dir={backIsArabic ? 'rtl' : 'ltr'}
              className={clsx('text-xl font-semibold', backIsArabic && 'font-arabic text-3xl leading-loose')}
            >
              {back}
            </p>
            {c.explanation && <p className="text-xs text-gray-500 mt-3">{c.explanation}</p>}
          </div>
        </div>
      </div>

      {/* Self-rate buttons OR show flip prompt */}
      {!flipped ? (
        <button
          onClick={() => setFlipped(true)}
          className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCw className="w-4 h-4" /> Flip Card
        </button>
      ) : (
        <div>
          <p className="text-center text-sm text-gray-500 mb-3">How well did you know it?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RATINGS.map((rt) => (
              <button
                key={rt.value}
                onClick={() => handleRate(rt.value)}
                className={clsx('px-3 py-3 rounded-xl text-white font-bold transition-all hover:scale-105 shadow-sm', rt.color)}
                title={rt.desc}
              >
                <div>{rt.label}</div>
                <div className="text-[10px] font-normal opacity-80 mt-0.5">{rt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
