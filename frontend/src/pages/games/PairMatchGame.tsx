import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { GameOverScreen, ScoreDisplay, GameProgressBar } from '@/components/games';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';
import { shuffle } from '@/utils/gameHelpers';

type Mode = 'MEMORY' | 'CONNECT';

interface Pair { id: string; term: string; definition: string }
interface Tile { key: string; pairId: string; label: string; side: 'term' | 'def' }

/**
 * Pair Match — Memory (face-down flip-2) or Connect (all face-up, click two to link)
 */
export default function PairMatchGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, difficulty,
    submit, playAgain, exitToHub,
  } = r;

  // Easy=memory by default, Hard=connect; can toggle pre-round
  const defaultMode: Mode = difficulty === 'EASY' ? 'MEMORY' : 'CONNECT';
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [flipped, setFlipped] = useState<string[]>([]);    // currently flipped tile keys (memory)
  const [matched, setMatched] = useState<Set<string>>(new Set()); // matched pairIds
  const [selectedConnect, setSelectedConnect] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string[]>([]);

  const pairs: Pair[] = useMemo(() => {
    const raw = currentContent?.content.pairs as Pair[] | undefined;
    if (!raw) return [];
    return raw.slice(0, difficulty === 'EASY' ? 4 : difficulty === 'MEDIUM' ? 8 : 12);
  }, [currentContent, difficulty]);

  const tiles: Tile[] = useMemo(() => {
    const t: Tile[] = [];
    for (const p of pairs) {
      t.push({ key: `${p.id}-T`, pairId: p.id, label: p.term, side: 'term' });
      t.push({ key: `${p.id}-D`, pairId: p.id, label: p.definition, side: 'def' });
    }
    return shuffle(t);
  }, [pairs]);

  // Reset on new round
  useEffect(() => {
    setFlipped([]); setMatched(new Set()); setSelectedConnect(null); setWrongFlash([]);
    setMode(defaultMode);
  }, [currentRound, defaultMode]);

  // All matched? auto-submit
  useEffect(() => {
    if (pairs.length > 0 && matched.size === pairs.length && started) {
      const t = setTimeout(() => submit({ matched: Array.from(matched), mode }), 700);
      return () => clearTimeout(t);
    }
  }, [matched, pairs.length, started, mode, submit]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const handleTileClick = (tile: Tile) => {
    if (matched.has(tile.pairId)) return;
    if (mode === 'MEMORY') {
      if (flipped.length === 2 || flipped.includes(tile.key)) return;
      const next = [...flipped, tile.key];
      setFlipped(next);
      if (next.length === 2) {
        const [a, b] = next.map((k) => tiles.find((t) => t.key === k)!);
        if (a.pairId === b.pairId && a.side !== b.side) {
          setTimeout(() => {
            setMatched((prev) => new Set(prev).add(a.pairId));
            setFlipped([]);
          }, 600);
        } else {
          setWrongFlash(next);
          setTimeout(() => { setFlipped([]); setWrongFlash([]); }, 900);
        }
      }
    } else {
      // CONNECT mode
      if (!selectedConnect) { setSelectedConnect(tile.key); return; }
      if (selectedConnect === tile.key) { setSelectedConnect(null); return; }
      const a = tiles.find((t) => t.key === selectedConnect)!;
      const b = tile;
      if (a.pairId === b.pairId && a.side !== b.side) {
        setMatched((prev) => new Set(prev).add(a.pairId));
        setSelectedConnect(null);
      } else {
        setWrongFlash([a.key, b.key]);
        setTimeout(() => { setSelectedConnect(null); setWrongFlash([]); }, 700);
      }
    }
  };

  const cols = pairs.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' : pairs.length <= 8 ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-4 sm:grid-cols-6';
  const results = r.submittedRounds.map((s) => s.isCorrect);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Mode:</span>
          <button onClick={() => setMode('MEMORY')} className={clsx('px-3 py-1 rounded-full font-medium', mode === 'MEMORY' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600')}>Memory</button>
          <button onClick={() => setMode('CONNECT')} className={clsx('px-3 py-1 rounded-full font-medium', mode === 'CONNECT' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600')}>Connect</button>
        </div>
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-3" />
      <p className="text-center text-sm text-gray-500 mb-4">
        Matched <strong>{matched.size}</strong> of {pairs.length} pairs
      </p>

      <div className={clsx('grid gap-2 sm:gap-3', cols)}>
        {tiles.map((tile) => {
          const isMatched = matched.has(tile.pairId);
          const isFlipped = mode === 'MEMORY' ? flipped.includes(tile.key) : true;
          const isSelected = selectedConnect === tile.key;
          const isWrong = wrongFlash.includes(tile.key);
          const showFace = isFlipped || isMatched;
          const isArabic = /[\u0600-\u06FF]/.test(tile.label);
          return (
            <button
              key={tile.key}
              onClick={() => handleTileClick(tile)}
              disabled={isMatched}
              className={clsx(
                'aspect-square sm:aspect-[3/2] rounded-xl border-2 p-2 text-sm font-medium transition-all duration-300 flex items-center justify-center text-center',
                isMatched && 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-70',
                isWrong && 'bg-red-100 border-red-400 animate-pulse',
                !isMatched && !isWrong && isSelected && 'bg-purple-100 border-purple-500 ring-2 ring-purple-300',
                !isMatched && !isWrong && !isSelected && showFace && 'bg-white border-purple-200 hover:bg-purple-50',
                !showFace && 'bg-gradient-to-br from-purple-500 to-purple-700 border-purple-700 text-white',
              )}
            >
              <span dir={isArabic ? 'rtl' : 'ltr'} className={clsx(isArabic && 'font-arabic text-lg')}>
                {showFace ? tile.label : '?'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
      </div>
    </div>
  );
}
