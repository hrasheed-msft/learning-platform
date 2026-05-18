import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { CheckCircle2 } from 'lucide-react';
import { GameOverScreen, ScoreDisplay, GameProgressBar } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGameRunner } from '@/hooks/useGameRunner';

interface Cell { row: number; col: number }

/**
 * Word Search — find target words by clicking start cell + end cell (straight lines).
 */
export default function WordSearchGame() {
  const r = useGameRunner();
  const {
    activeSession, started, lastResult,
    currentRound, totalRounds, currentContent,
    score, submit, playAgain, exitToHub,
  } = r;

  const [start, setStart] = useState<Cell | null>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [hoverCells, setHoverCells] = useState<Set<string>>(new Set());

  const c = currentContent?.content;
  const grid: string[][] = useMemo(() => {
    const g = c?.grid;
    if (Array.isArray(g) && Array.isArray(g[0])) return g as string[][];
    return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))));
  }, [c]);
  const words: string[] = (c?.targetWords as string[]) || [];

  useEffect(() => {
    setStart(null); setFoundWords([]); setFoundCells(new Set()); setHoverCells(new Set());
  }, [currentRound]);

  useEffect(() => {
    if (words.length > 0 && foundWords.length === words.length && started) {
      const t = setTimeout(() => submit({ foundWords }), 600);
      return () => clearTimeout(t);
    }
  }, [foundWords, words.length, started, submit]);

  if (lastResult) return <GameOverScreen result={lastResult} onPlayAgain={playAgain} />;
  if (!started || !activeSession || !currentContent) {
    return <div className="flex items-center justify-center min-h-[40vh]"><Spinner size="lg" /></div>;
  }

  const cellsBetween = (a: Cell, b: Cell): Cell[] | null => {
    const dr = b.row - a.row, dc = b.col - a.col;
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    if (len === 0) return [a];
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
    const stepR = Math.sign(dr), stepC = Math.sign(dc);
    const cells: Cell[] = [];
    for (let i = 0; i <= len; i++) cells.push({ row: a.row + stepR * i, col: a.col + stepC * i });
    return cells;
  };

  const handleCellClick = (cell: Cell) => {
    if (!start) {
      setStart(cell);
      setHoverCells(new Set([`${cell.row},${cell.col}`]));
      return;
    }
    const path = cellsBetween(start, cell);
    setStart(null);
    setHoverCells(new Set());
    if (!path) return;
    const word = path.map((p) => grid[p.row]?.[p.col] ?? '').join('');
    const reversed = word.split('').reverse().join('');
    const match = words.find((w) => w.toUpperCase() === word.toUpperCase() || w.toUpperCase() === reversed.toUpperCase());
    if (match && !foundWords.includes(match)) {
      setFoundWords((prev) => [...prev, match]);
      const newCells = new Set(foundCells);
      path.forEach((p) => newCells.add(`${p.row},${p.col}`));
      setFoundCells(newCells);
    }
  };

  const handleCellHover = (cell: Cell) => {
    if (!start) return;
    const path = cellsBetween(start, cell);
    setHoverCells(new Set(path?.map((p) => `${p.row},${p.col}`) ?? []));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <ScoreDisplay score={score} />
        <span className="text-sm text-gray-500">Found <strong>{foundWords.length}</strong> / {words.length}</span>
      </div>
      <GameProgressBar current={currentRound} total={totalRounds} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-pink-100">
            {grid.map((row, ri) => (
              <div key={ri} className="flex">
                {row.map((ch, ci) => {
                  const key = `${ri},${ci}`;
                  const isFound = foundCells.has(key);
                  const isHover = hoverCells.has(key);
                  const isArabic = /[\u0600-\u06FF]/.test(ch);
                  return (
                    <button
                      key={key}
                      onClick={() => handleCellClick({ row: ri, col: ci })}
                      onMouseEnter={() => handleCellHover({ row: ri, col: ci })}
                      className={clsx(
                        'w-9 h-9 sm:w-10 sm:h-10 m-0.5 rounded-md font-bold text-sm flex items-center justify-center transition-colors',
                        isFound ? 'bg-emerald-500 text-white'
                          : isHover ? 'bg-pink-200 text-pink-900'
                          : 'bg-pink-50 hover:bg-pink-100 text-gray-700',
                        isArabic && 'font-arabic text-base',
                      )}
                      dir={isArabic ? 'rtl' : 'ltr'}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Click the first letter, then the last letter of a word.</p>
        </div>

        <div className="md:col-span-1">
          <h3 className="font-bold text-gray-800 mb-3">Find these:</h3>
          <ul className="space-y-2">
            {words.map((w) => {
              const found = foundWords.includes(w);
              const isArabic = /[\u0600-\u06FF]/.test(w);
              return (
                <li
                  key={w}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                    found ? 'bg-emerald-50 text-emerald-700 line-through' : 'bg-gray-50 text-gray-700',
                  )}
                >
                  {found && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  <span dir={isArabic ? 'rtl' : 'ltr'} className={clsx(isArabic && 'font-arabic text-base')}>{w}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button onClick={exitToHub} className="text-sm text-gray-400 hover:text-gray-600">Exit to Hub</button>
        {words.length > 0 && (
          <Button onClick={() => submit({ foundWords })} variant="outline" className="ml-3">
            Skip / Submit
          </Button>
        )}
      </div>
    </div>
  );
}
