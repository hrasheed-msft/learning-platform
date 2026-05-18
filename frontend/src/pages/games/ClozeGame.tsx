import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { GameOverScreen, ScoreDisplay, GameProgressBar, StreakIndicator } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';
import { getOptions, shuffle } from '@/utils/gameHelpers';

/**
 * Cloze (Fill the Gap) — sentence/ayah/hadith with blanks.
 * EASY: word bank (tap to fill)
 * MEDIUM/HARD: free typing
 */
export default function ClozeGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, streak, difficulty,
    submit, playAgain, exitToHub, submittedRounds,
  } = r;

  const [typed, setTyped] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setTyped(''); setFeedback(null); setShowHint(false); setAttempts(0);
  }, [currentRound]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const c = currentContent.content;
  const sentence: string = (c.questionText || c.front || '') as string;
  const correct: string = String(c.correctAnswer ?? '');
  const arabic = c.arabicText as string | undefined;
  const isArabicAnswer = /[\u0600-\u06FF]/.test(correct);

  // Replace blank marker for display
  const displayedSentence = sentence.replace(/_+|\{blank\}/gi, '_____');

  // Word bank for EASY (use options or shuffle correct + distractors)
  const bank = useMemo(() => {
    const opts = getOptions(c.options);
    if (opts.length > 0) return shuffle(opts);
    return [correct];
  }, [c.options, correct]);

  const normalize = (s: string) =>
    difficulty === 'HARD' ? s.trim() : s.trim().toLowerCase().replace(/[\u064B-\u0652]/g, ''); // strip diacritics

  const check = () => {
    if (!typed.trim()) return;
    const ok = normalize(typed) === normalize(correct);
    setAttempts((a) => a + 1);
    if (ok) {
      setFeedback('correct');
      setTimeout(() => submit({ answer: typed, correct: true }), 900);
    } else if (attempts === 0 && difficulty !== 'HARD') {
      // first miss in EASY/MEDIUM: hint
      setShowHint(true);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => submit({ answer: typed, correct: false }), 900);
    }
  };

  const handleBankPick = (word: string) => {
    setTyped(word);
    setTimeout(() => {
      const ok = normalize(word) === normalize(correct);
      setFeedback(ok ? 'correct' : 'wrong');
      setTimeout(() => submit({ answer: word, correct: ok }), 900);
    }, 50);
  };

  const results = submittedRounds.map((s) => s.isCorrect);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-6" />

      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-8 shadow-sm border border-teal-100 mb-6">
        <p className="text-xs text-teal-700 uppercase tracking-wider mb-3 font-semibold text-center">
          Fill the Gap — {currentRound + 1} / {totalRounds}
        </p>
        {arabic && (
          <p className="text-3xl font-arabic text-teal-900 leading-loose text-center mb-4" dir="rtl">
            {arabic}
          </p>
        )}
        <p className="text-lg text-gray-800 leading-relaxed text-center whitespace-pre-line">
          {displayedSentence}
        </p>
        {showHint && (
          <p className="text-xs text-amber-700 mt-3 text-center">
            💡 Hint: starts with <strong>{correct[0]}</strong>
          </p>
        )}
      </div>

      {difficulty === 'EASY' && bank.length > 1 ? (
        <div>
          <p className="text-center text-sm text-gray-500 mb-3">Tap the missing word:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {bank.map((word, idx) => (
              <button
                key={idx}
                disabled={!!feedback}
                onClick={() => handleBankPick(word)}
                className={clsx(
                  'px-4 py-2.5 rounded-xl border-2 font-medium transition-all',
                  typed === word && feedback === 'correct' && 'bg-green-100 border-green-500 text-green-800',
                  typed === word && feedback === 'wrong' && 'bg-red-100 border-red-500 text-red-800',
                  typed !== word && 'bg-white border-teal-200 hover:bg-teal-50 hover:border-teal-400',
                  isArabicAnswer && 'font-arabic text-xl',
                )}
                dir={isArabicAnswer ? 'rtl' : 'ltr'}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder="Type the missing word…"
            disabled={!!feedback && feedback === 'correct'}
            dir={isArabicAnswer ? 'rtl' : 'ltr'}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border-2 text-lg text-center outline-none transition-colors',
              feedback === 'correct' && 'border-green-500 bg-green-50',
              feedback === 'wrong' && 'border-red-500 bg-red-50 animate-pulse',
              !feedback && 'border-teal-300 focus:border-teal-500',
              isArabicAnswer && 'font-arabic text-2xl',
            )}
          />
          <Button onClick={check} variant="primary" fullWidth disabled={!typed.trim() || feedback === 'correct'}>
            Submit
          </Button>
        </div>
      )}

      {feedback && (
        <div className={clsx(
          'mt-4 p-3 rounded-xl text-center font-medium',
          feedback === 'correct' ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200',
        )}>
          {feedback === 'correct' ? '🌟 Masha\'Allah!' : `Correct answer: ${correct}`}
        </div>
      )}

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
