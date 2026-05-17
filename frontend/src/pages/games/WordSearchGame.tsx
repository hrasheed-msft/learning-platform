import { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { ScoreDisplay, GameProgressBar, GameOverScreen, DifficultySelector, GameTimer } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

type Direction = [number, number];
const DIRECTIONS: Direction[] = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];
const ARABIC_LETTERS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
const GRID_SIZE: Record<GameDifficulty, number> = { EASY: 8, MEDIUM: 10, HARD: 12 };

function placeWord(grid: string[][], word: string, size: number): boolean {
  const dirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);
  for (const [dr, dc] of dirs) {
    const maxR = dr >= 0 ? size - word.length * dr : size - 1;
    const minR = dr < 0 ? -dr * (word.length - 1) : 0;
    const maxC = dc >= 0 ? size - word.length * dc : size - 1;
    const minC = dc < 0 ? -dc * (word.length - 1) : 0;

    for (let attempt = 0; attempt < 20; attempt++) {
      const r = minR + Math.floor(Math.random() * (maxR - minR + 1));
      const c = minC + Math.floor(Math.random() * (maxC - minC + 1));
      let canPlace = true;

      for (let i = 0; i < word.length; i++) {
        const nr = r + dr * i;
        const nc = c + dc * i;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) { canPlace = false; break; }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) { canPlace = false; break; }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[r + dr * i][c + dc * i] = word[i];
        }
        return true;
      }
    }
  }
  return false;
}

function buildGrid(words: string[], size: number): string[][] {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
  for (const word of words) placeWord(grid, word, size);
  // Fill empty cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') grid[r][c] = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
    }
  }
  return grid;
}

export default function WordSearchGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, lastResult,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<[number, number] | null>(null);
  const [currentSelection, setCurrentSelection] = useState<string[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const gridSize = GRID_SIZE[difficulty];

  const words = useMemo(() => {
    if (!activeSession?.rounds) return [];
    return activeSession.rounds.map((r: GameRound) =>
      r.content.arabicText || r.content.front || r.content.translation || ''
    ).filter(Boolean);
  }, [activeSession?.rounds]);

  const grid = useMemo(() => {
    if (words.length === 0) return [];
    return buildGrid(words, gridSize);
  }, [words, gridSize]);

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
    setRoundStartTime(Date.now());
  };

  const handleCellDown = (r: number, c: number) => {
    setIsSelecting(true);
    setSelectionStart([r, c]);
    setCurrentSelection([`${r},${c}`]);
  };

  const handleCellEnter = (r: number, c: number) => {
    if (!isSelecting || !selectionStart) return;
    const [sr, sc] = selectionStart;
    const dr = Math.sign(r - sr);
    const dc = Math.sign(c - sc);
    if (dr === 0 && dc === 0) return;

    const cells: string[] = [];
    let cr = sr, cc = sc;
    while (cr >= 0 && cr < gridSize && cc >= 0 && cc < gridSize) {
      cells.push(`${cr},${cc}`);
      if (cr === r && cc === c) break;
      cr += dr;
      cc += dc;
    }
    setCurrentSelection(cells);
  };

  const handleCellUp = useCallback(async () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    const selectedWord = currentSelection.map((key) => {
      const [r, c] = key.split(',').map(Number);
      return grid[r]?.[c] || '';
    }).join('');

    if (words.includes(selectedWord) && !foundWords.has(selectedWord)) {
      const newFound = new Set(foundWords);
      newFound.add(selectedWord);
      setFoundWords(newFound);

      const newCells = new Set(selectedCells);
      currentSelection.forEach((k) => newCells.add(k));
      setSelectedCells(newCells);

      const timeSpent = Date.now() - roundStartTime;
      try {
        await submitAnswer(newFound.size - 1, { selectedOption: selectedWord }, timeSpent);
        setRoundStartTime(Date.now());
      } catch { /* continue */ }

      if (newFound.size >= words.length) {
        setTimeout(() => completeGame('FINISHED'), 500);
      }
    }
    setCurrentSelection([]);
    setSelectionStart(null);
  }, [isSelecting, currentSelection, grid, words, foundWords, selectedCells, roundStartTime]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setSelectedCells(new Set());
    setFoundWords(new Set());
  };

  const handleTimeUp = () => completeGame('TIMED_OUT');

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🔍</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Word Search</h1>
        <p className="text-gray-500 mb-6">Find hidden Islamic terms in the letter grid</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <p className="text-xs text-gray-400 mb-6">{GRID_SIZE[difficulty]}×{GRID_SIZE[difficulty]} grid</p>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Search
        </Button>
      </div>
    );
  }

  if (grid.length === 0) {
    return <div className="text-center py-16 text-gray-500">Building grid...</div>;
  }

  const timerDuration = difficulty === 'HARD' ? 120000 : difficulty === 'MEDIUM' ? 180000 : 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        {timerDuration > 0 && <GameTimer durationMs={timerDuration} onTimeUp={handleTimeUp} />}
      </div>
      <GameProgressBar current={foundWords.size} total={words.length} className="mb-4" />

      {/* Word list */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {words.map((word, idx) => (
          <span
            key={idx}
            className={clsx(
              'px-3 py-1 rounded-full text-sm font-arabic',
              foundWords.has(word) ? 'bg-green-100 text-green-700 line-through' : 'bg-pink-100 text-pink-700',
            )}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        className="inline-grid border-2 border-gray-300 rounded-lg overflow-hidden select-none mx-auto"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        onMouseUp={handleCellUp}
        onMouseLeave={handleCellUp}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r},${c}`;
            const isFound = selectedCells.has(key);
            const isCurrent = currentSelection.includes(key);

            return (
              <div
                key={key}
                onMouseDown={() => handleCellDown(r, c)}
                onMouseEnter={() => handleCellEnter(r, c)}
                className={clsx(
                  'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-arabic text-sm sm:text-base cursor-pointer border border-gray-100 select-none',
                  isFound && 'bg-green-200 text-green-800',
                  isCurrent && !isFound && 'bg-pink-200 text-pink-800',
                  !isFound && !isCurrent && 'bg-white hover:bg-pink-50',
                )}
              >
                {cell}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
