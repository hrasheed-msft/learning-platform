import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Clock } from 'lucide-react';
import { GameOverScreen, ScoreDisplay, GameProgressBar, StreakIndicator, HintButton } from '@/components/games';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';
import { getOptions } from '@/utils/gameHelpers';

/**
 * Quick Recall — MCQ (4-opt) + True/False (2-opt) merged.
 * Decides binary mode automatically when options.length === 2 OR
 * content.gameMode === 'TRUE_FALSE'.
 */
export default function QuickRecallGame() {
  const r = useGameRunner();
  const {
    activeSession, started, isLoading, lastResult,
    currentRound, totalRounds, currentContent,
    score, streak, submittedRounds, difficulty,
    submit, playAgain, exitToHub,
  } = r;

  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [hints, setHints] = useState(difficulty === 'EASY' ? 2 : difficulty === 'MEDIUM' ? 1 : 0);
  // Per-question timer (MEDIUM/HARD)
  const perQTime = difficulty === 'HARD' ? 10000 : difficulty === 'MEDIUM' ? 20000 : 0;
  const [questionDeadline, setQuestionDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!questionDeadline) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [questionDeadline]);

  useEffect(() => {
    setSelected(null); setFeedback(null); setEliminated([]);
    if (perQTime > 0 && currentContent) setQuestionDeadline(Date.now() + perQTime);
    else setQuestionDeadline(null);
  }, [currentRound, perQTime, currentContent]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const c = currentContent.content;
  const questionText = c.questionText || c.front || '';
  const correct = (c.correctAnswer ?? '') as string;
  const rawOptions = getOptions(c.options);
  // Detect binary mode
  const isBinary =
    c.gameMode === 'TRUE_FALSE' ||
    rawOptions.length === 2 ||
    (rawOptions.length === 0 && (correct === 'TRUE' || correct === 'FALSE' || correct === 'true' || correct === 'false'));
  const options = isBinary && rawOptions.length === 0 ? ['TRUE', 'FALSE'] : rawOptions;

  const handleAnswer = async (answer: string) => {
    if (feedback) return;
    setSelected(answer);
    const ok = String(answer).toLowerCase() === String(correct).toLowerCase();
    setFeedback(ok ? 'correct' : 'wrong');
    setQuestionDeadline(null);
    setTimeout(() => submit({ selectedOption: answer }), 1100);
  };

  const handleTimeout = () => {
    if (feedback) return;
    setFeedback('wrong');
    setTimeout(() => submit({ selectedOption: null, timedOut: true }), 800);
  };

  const handleHint = () => {
    if (hints <= 0 || !options.length) return;
    const wrong = options.filter((o) => o !== correct && !eliminated.includes(o));
    if (wrong.length === 0) return;
    setEliminated((prev) => [...prev, wrong[Math.floor(Math.random() * wrong.length)]]);
    setHints((h) => h - 1);
  };

  const results = submittedRounds.map((s) => s.isCorrect);

  const optionLabels = isBinary ? ['✓', '✗'] : ['A', 'B', 'C', 'D', 'E'];
  const optionTone = isBinary
    ? ['bg-green-100 text-green-700 border-green-200 hover:bg-green-50', 'bg-red-100 text-red-700 border-red-200 hover:bg-red-50']
    : Array(5).fill('bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ScoreDisplay score={score} multiplier={streak >= 5 ? 2 : streak >= 3 ? 1.5 : undefined} />
        <StreakIndicator streak={streak} />
        {difficulty !== 'HARD' && <HintButton hintsRemaining={hints} maxHints={difficulty === 'EASY' ? 2 : 1} onUseHint={handleHint} />}
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-3" />

      {questionDeadline && (() => {
        const remainingMs = Math.max(0, questionDeadline - now);
        const pct = Math.max(0, Math.min(100, (remainingMs / perQTime) * 100));
        if (remainingMs === 0 && !feedback) {
          handleTimeout();
        }
        return (
          <div className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-4',
            pct < 25 ? 'bg-red-50 text-red-700' : pct < 50 ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700',
          )}>
            <Clock className="w-4 h-4" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{Math.ceil(remainingMs / 1000)}s</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all duration-200',
                    pct < 25 ? 'bg-red-500' : pct < 50 ? 'bg-amber-500' : 'bg-blue-500')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 shadow-sm border border-orange-100 mb-6 text-center">
        <p className="text-xs text-orange-600 uppercase tracking-wider mb-3 font-semibold">
          {isBinary ? 'True or False' : 'Question'} {currentRound + 1} of {totalRounds}
        </p>
        <h2 className="text-xl font-bold text-gray-800 leading-relaxed">{questionText}</h2>
        {c.arabicText && (
          <p className="mt-4 text-3xl font-arabic text-orange-700 leading-loose" dir="rtl">
            {c.arabicText}
          </p>
        )}
      </div>

      <div className={clsx('grid gap-3', isBinary ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2')}>
        {options.map((opt, idx) => {
          const isSelected = selected === opt;
          const isCorrectOpt = feedback && opt === correct;
          const isEliminated = eliminated.includes(opt);
          if (isEliminated && !feedback) {
            return (
              <div key={idx} className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50 opacity-30 text-center">
                <span className="text-gray-400 line-through">{opt}</span>
              </div>
            );
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              disabled={!!feedback || isEliminated}
              className={clsx(
                'p-4 rounded-xl border-2 font-medium transition-all flex items-center gap-3',
                !feedback && optionTone[idx],
                isCorrectOpt && 'bg-green-100 border-green-500 text-green-800 scale-[1.02] shadow-md',
                isSelected && feedback === 'wrong' && !isCorrectOpt && 'bg-red-100 border-red-500 text-red-800 animate-pulse',
                feedback && !isSelected && !isCorrectOpt && 'opacity-40',
              )}
            >
              <span className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                isCorrectOpt ? 'bg-green-500 text-white'
                  : isSelected && feedback === 'wrong' ? 'bg-red-500 text-white'
                  : 'bg-orange-100 text-orange-700',
              )}>
                {optionLabels[idx]}
              </span>
              <span className="text-left">{opt}</span>
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={clsx(
          'mt-6 p-4 rounded-xl text-center',
          feedback === 'correct' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700',
        )}>
          <p className="font-bold">
            {feedback === 'correct' ? '🌟 Masha\'Allah! Correct!' : `Correct answer: ${correct}`}
          </p>
          {c.explanation && <p className="text-sm text-gray-600 mt-2">{c.explanation}</p>}
        </div>
      )}

      {isLoading && <div className="mt-4 text-center text-gray-400 text-sm">Loading…</div>}

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
