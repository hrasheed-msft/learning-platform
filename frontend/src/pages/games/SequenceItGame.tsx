import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowUp, ArrowDown, CheckCircle2, GripVertical } from 'lucide-react';
import { GameOverScreen, ScoreDisplay, GameProgressBar } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';
import { shuffle } from '@/utils/gameHelpers';

interface Item { id: string; label: string; meta?: string }

/**
 * Sequence It — drag (or click-arrow) items into correct order.
 * Mode auto-detected from content: timeline / isnad / syntax / narrative.
 */
export default function SequenceItGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, difficulty, submit, playAgain, exitToHub,
  } = r;

  const c = currentContent?.content;

  // Detect items + mode
  const { items, mode, correctOrder } = useMemo(() => {
    if (!c) return { items: [] as Item[], mode: 'sequence', correctOrder: [] as string[] };
    if (Array.isArray(c.narrators) && c.narrators.length) {
      const its = c.narrators.map((n: any) => ({ id: n.id, label: n.name, meta: n.role }));
      return { items: its, mode: 'isnad', correctOrder: its.map((i) => i.id) };
    }
    if (Array.isArray(c.events) && c.events.length) {
      const its = c.events.map((e: any) => ({ id: e.id, label: e.title, meta: difficulty === 'HARD' ? undefined : e.year }));
      return { items: its, mode: 'timeline', correctOrder: its.map((i) => i.id) };
    }
    if (Array.isArray(c.segments) && c.segments.length) {
      const its = c.segments.map((s: any) => ({ id: s.id, label: s.text }));
      return { items: its, mode: 'narrative', correctOrder: its.map((i) => i.id) };
    }
    if (Array.isArray(c.words) && c.words.length) {
      const correct = Array.isArray(c.correctOrder) ? c.correctOrder as string[] : c.words as string[];
      const its = (c.words as string[]).map((w, i) => ({ id: `w-${i}-${w}`, label: w }));
      const idMap: Record<string, string> = {};
      its.forEach((it) => { idMap[it.label] = it.id; });
      return { items: its, mode: 'syntax', correctOrder: correct.map((w) => idMap[w] || w) };
    }
    return { items: [], mode: 'sequence', correctOrder: [] };
  }, [c, difficulty]);

  const [order, setOrder] = useState<Item[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setOrder(shuffle(items));
    setSubmitted(false);
  }, [items, currentRound]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const move = (idx: number, dir: -1 | 1) => {
    const tgt = idx + dir;
    if (tgt < 0 || tgt >= order.length) return;
    const next = [...order];
    [next[idx], next[tgt]] = [next[tgt], next[idx]];
    setOrder(next);
  };

  const handleDrop = (targetIdx: number) => {
    if (!dragId) return;
    const fromIdx = order.findIndex((i) => i.id === dragId);
    if (fromIdx === -1 || fromIdx === targetIdx) return;
    const next = [...order];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(targetIdx, 0, moved);
    setOrder(next);
    setDragId(null);
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const userOrder = order.map((i) => i.id);
    const ok = userOrder.every((id, idx) => id === correctOrder[idx]);
    setTimeout(() => submit({ order: userOrder, correct: ok }), 1100);
  };

  const modeLabel = {
    isnad: 'Isnad — order the narrators',
    timeline: 'Timeline — order by date',
    syntax: 'Syntax — order the words',
    narrative: 'Narrative — order the story',
    sequence: 'Sequence',
  }[mode];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ScoreDisplay score={score} />
        <span className="text-xs uppercase tracking-wider font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
          {modeLabel}
        </span>
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      <div className="space-y-2 mb-6">
        {order.map((item, idx) => {
          const isArabic = /[\u0600-\u06FF]/.test(item.label);
          const correctHere = submitted && correctOrder[idx] === item.id;
          const wrongHere = submitted && correctOrder[idx] !== item.id;
          return (
            <div
              key={item.id}
              draggable={!submitted}
              onDragStart={() => setDragId(item.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              className={clsx(
                'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                correctHere && 'bg-emerald-50 border-emerald-400',
                wrongHere && 'bg-red-50 border-red-300',
                !submitted && 'bg-white border-cyan-200 hover:border-cyan-400 cursor-grab active:cursor-grabbing',
              )}
            >
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  dir={isArabic ? 'rtl' : 'ltr'}
                  className={clsx('font-medium text-gray-800', isArabic && 'font-arabic text-xl')}
                >
                  {item.label}
                </p>
                {item.meta && <p className="text-xs text-gray-500">{item.meta}</p>}
              </div>
              {correctHere && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(idx, -1)} disabled={submitted || idx === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button onClick={() => move(idx, 1)} disabled={submitted || idx === order.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={handleSubmit} variant="primary" fullWidth disabled={submitted || order.length === 0}>
        Check Order
      </Button>

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
