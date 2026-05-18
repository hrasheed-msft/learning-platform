import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Lightbulb, X } from 'lucide-react';
import { GameOverScreen, ScoreDisplay, GameProgressBar, StreakIndicator } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';
import { shuffle } from '@/utils/gameHelpers';

/**
 * Word Scramble — unscramble jumbled letters of a single word.
 */
export default function WordScrambleGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, streak, difficulty,
    submit, playAgain, exitToHub, submittedRounds,
  } = r;

  const c = currentContent?.content;
  const word: string = String(c?.correctAnswer ?? c?.front ?? '');
  const isArabic = /[\u0600-\u06FF]/.test(word);

  const letters = useMemo(() => {
    const src = (c?.scrambledWord as string) || shuffle(word.split('')).join('');
    return src.split('').map((ch, i) => ({ id: `${i}-${ch}`, ch }));
  }, [word, c]);

  const [bank, setBank] = useState(letters);
  const [picked, setPicked] = useState<typeof letters>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setBank(letters); setPicked([]); setFeedback(null); setShowHint(false);
  }, [letters, currentRound]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const pick = (idx: number) => {
    if (feedback) return;
    const letter = bank[idx];
    setBank((b) => b.filter((_, i) => i !== idx));
    setPicked((p) => [...p, letter]);
  };
  const unpick = (idx: number) => {
    if (feedback) return;
    const letter = picked[idx];
    setPicked((p) => p.filter((_, i) => i !== idx));
    setBank((b) => [...b, letter]);
  };
  const reset = () => {
    if (feedback) return;
    setBank(letters); setPicked([]);
  };

  const check = () => {
    const guess = picked.map((p) => p.ch).join('');
    const ok = guess.toLowerCase() === word.toLowerCase();
    setFeedback(ok ? 'correct' : 'wrong');
    setTimeout(() => submit({ guess, correct: ok }), 1100);
  };

  const results = submittedRounds.map((s) => s.isCorrect);

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-6" />

      {c?.questionText ? (
        <p className="text-center text-gray-600 mb-4">{c.questionText as string}</p>
      ) : (
        <p className="text-center text-gray-500 mb-4 text-sm">Unscramble the letters to spell the word.</p>
      )}

      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className={clsx(
          'min-h-[80px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap gap-2 items-center justify-center mb-4 transition-colors',
          feedback === 'correct' && 'border-green-400 bg-green-50',
          feedback === 'wrong' && 'border-red-400 bg-red-50',
          !feedback && 'border-amber-300 bg-amber-50/50',
        )}
      >
        {picked.length === 0 ? (
          <p className="text-gray-400 text-sm">Tap letters below to build the word…</p>
        ) : (
          picked.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => unpick(idx)}
              className={clsx(
                'w-12 h-12 rounded-lg bg-white border-2 border-amber-400 font-bold text-xl shadow-sm hover:bg-amber-50',
                isArabic && 'font-arabic text-2xl',
              )}
            >
              {l.ch}
            </button>
          ))
        )}
      </div>

      {showHint && (
        <p className="text-center text-sm text-amber-700 mb-3">
          💡 First letter: <strong className={clsx(isArabic && 'font-arabic text-xl')}>{word[0]}</strong>
        </p>
      )}

      <div className="flex flex-wrap gap-2 justify-center mb-6" dir={isArabic ? 'rtl' : 'ltr'}>
        {bank.map((l, idx) => (
          <button
            key={l.id}
            onClick={() => pick(idx)}
            disabled={!!feedback}
            className={clsx(
              'w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-xl shadow-md hover:scale-105 transition-transform',
              isArabic && 'font-arabic text-2xl',
            )}
          >
            {l.ch}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={reset} disabled={!!feedback || picked.length === 0}>
          <X className="w-4 h-4 mr-1" /> Reset
        </Button>
        {difficulty !== 'HARD' && (
          <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint || !!feedback}>
            <Lightbulb className="w-4 h-4 mr-1" /> Hint
          </Button>
        )}
        <Button variant="primary" onClick={check} disabled={!!feedback || bank.length > 0} className="flex-1">
          Check
        </Button>
      </div>

      {feedback && (
        <div className={clsx(
          'mt-4 p-3 rounded-xl text-center font-medium',
          feedback === 'correct' ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200',
        )}>
          {feedback === 'correct' ? '🌟 Excellent!' : <>The word was: <strong className={clsx(isArabic && 'font-arabic text-xl')}>{word}</strong></>}
        </div>
      )}

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
