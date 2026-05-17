import { useState, useEffect, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { GameTimer, ScoreDisplay, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

type Cell = 'wall' | 'path' | 'gate' | 'start' | 'end' | 'collectible';

const MAZE_SIZE: Record<GameDifficulty, number> = { EASY: 8, MEDIUM: 10, HARD: 12 };

function generateMaze(size: number): Cell[][] {
  const maze: Cell[][] = Array.from({ length: size }, () => Array(size).fill('wall'));

  const visited = new Set<string>();
  const key = (r: number, c: number) => `${r},${c}`;
  const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];

  function carve(r: number, c: number) {
    visited.add(key(r, c));
    maze[r][c] = 'path';

    const shuffled = [...directions].sort(() => Math.random() - 0.5);
    for (const [dr, dc] of shuffled) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited.has(key(nr, nc))) {
        maze[r + dr / 2][c + dc / 2] = 'path';
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);
  maze[1][1] = 'start';
  maze[size - 2][size - 2] = 'end';

  // Add gates at intersections
  let gateCount = 0;
  const maxGates = Math.floor(size / 2);
  for (let r = 3; r < size - 3; r += 2) {
    for (let c = 3; c < size - 3; c += 2) {
      if (maze[r][c] === 'path' && gateCount < maxGates && Math.random() > 0.6) {
        maze[r][c] = 'gate';
        gateCount++;
      }
    }
  }

  // Add collectible stars
  for (let r = 1; r < size - 1; r++) {
    for (let c = 1; c < size - 1; c++) {
      if (maze[r][c] === 'path' && Math.random() > 0.9) {
        maze[r][c] = 'collectible';
      }
    }
  }

  return maze;
}

export default function MazeRunnerGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, currentRound, lastResult, rounds: _submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<[number, number]>([1, 1]);
  const [collectedStars, setCollectedStars] = useState(0);
  const [gateQuestion, setGateQuestion] = useState<GameRound | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [solvedGates, setSolvedGates] = useState<Set<string>>(new Set());
  const [blockedGates, setBlockedGates] = useState<Set<string>>(new Set());
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [stepsCount, setStepsCount] = useState(0);

  const mazeSize = MAZE_SIZE[difficulty];
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    const newMaze = generateMaze(mazeSize);
    setMaze(newMaze);
    setPlayerPos([1, 1]);
    setGameStarted(true);
    setCollectedStars(0);
    setStepsCount(0);
    setSolvedGates(new Set());
    setBlockedGates(new Set());
    setRoundStartTime(Date.now());
  };

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted || gateQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const moves: Record<string, [number, number]> = {
        ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
        w: [-1, 0], s: [1, 0], a: [0, -1], d: [0, 1],
        W: [-1, 0], S: [1, 0], A: [0, -1], D: [0, 1],
      };
      const move = moves[e.key];
      if (move) {
        e.preventDefault();
        movePlayer(move[0], move[1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gateQuestion, maze, playerPos, solvedGates, blockedGates]);

  const movePlayer = useCallback((dr: number, dc: number) => {
    const [r, c] = playerPos;
    const nr = r + dr;
    const nc = c + dc;

    if (nr < 0 || nr >= mazeSize || nc < 0 || nc >= mazeSize) return;
    const cell = maze[nr]?.[nc];
    if (cell === 'wall') return;

    const posKey = `${nr},${nc}`;

    // Gate encounter
    if (cell === 'gate' && !solvedGates.has(posKey)) {
      if (blockedGates.has(posKey)) return;
      const question = activeSession?.rounds?.[currentRound];
      if (question) {
        setGateQuestion(question);
        setRoundStartTime(Date.now());
      }
      return;
    }

    // Collect star
    if (cell === 'collectible') {
      setCollectedStars((s) => s + 1);
      setMaze((prev) => {
        const next = prev.map((row) => [...row]);
        next[nr][nc] = 'path';
        return next;
      });
    }

    setPlayerPos([nr, nc]);
    setStepsCount((s) => s + 1);

    // Reached the finish
    if (cell === 'end') {
      setTimeout(() => completeGame('FINISHED'), 400);
    }
  }, [playerPos, maze, mazeSize, solvedGates, blockedGates, activeSession, currentRound]);

  const handleGateAnswer = useCallback(async (answer: string) => {
    if (showFeedback || !gateQuestion) return;
    setSelectedOption(answer);
    setShowFeedback(true);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(currentRound, { selectedOption: answer }, timeSpent);
      setIsCorrect(result.isCorrect);

      setTimeout(() => {
        const [r, c] = playerPos;
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          const posKey = `${nr},${nc}`;
          if (maze[nr]?.[nc] === 'gate' && !solvedGates.has(posKey)) {
            if (result.isCorrect) {
              setSolvedGates((prev) => new Set([...prev, posKey]));
              setMaze((prev) => {
                const next = prev.map((row) => [...row]);
                next[nr][nc] = 'path';
                return next;
              });
              setPlayerPos([nr, nc]);
              setStepsCount((s) => s + 1);
            } else {
              setBlockedGates((prev) => new Set([...prev, posKey]));
            }
            break;
          }
        }

        setShowFeedback(false);
        setSelectedOption(null);
        setGateQuestion(null);
      }, 800);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
      setGateQuestion(null);
    }
  }, [showFeedback, gateQuestion, playerPos, maze, solvedGates, currentRound, roundStartTime]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setMaze([]);
    setGateQuestion(null);
    setCollectedStars(0);
    setStepsCount(0);
  };

  const handleTimeUp = () => completeGame('TIMED_OUT');

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🏃</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Maze Runner</h1>
        <p className="text-gray-500 mb-6">
          Navigate the maze, collect stars, and answer questions at gates to reach the finish!
        </p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <div className="text-sm text-gray-400 mb-2">{MAZE_SIZE[difficulty]}×{MAZE_SIZE[difficulty]} maze</div>
        <div className="flex justify-center gap-4 text-xs text-gray-400 mb-6">
          <span>🧑‍🎓 You</span>
          <span>🚪 Gate</span>
          <span>⭐ Star</span>
          <span>🏁 Finish</span>
        </div>
        <p className="text-xs text-gray-400 mb-6">Arrow keys / WASD to move · D-pad on mobile</p>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Enter the Maze
        </Button>
      </div>
    );
  }

  const cellSize = Math.min(40, Math.floor(600 / mazeSize));
  const timerDuration = difficulty === 'HARD' ? 600000 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-600">
            <span>⭐</span>
            <span className="text-sm font-bold">{collectedStars}</span>
          </div>
          <div className="text-xs text-gray-400">
            Steps: {stepsCount}
          </div>
        </div>
        {timerDuration > 0 && <GameTimer durationMs={timerDuration} type="linear" onTimeUp={handleTimeUp} />}
      </div>

      {/* Maze Grid */}
      <div ref={containerRef} className="flex justify-center mb-4">
        <div
          className="border-2 border-emerald-800 rounded-xl overflow-hidden shadow-lg"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${mazeSize}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${mazeSize}, ${cellSize}px)`,
          }}
        >
          {maze.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = playerPos[0] === r && playerPos[1] === c;
              const posKey = `${r},${c}`;
              const isBlocked = blockedGates.has(posKey);
              return (
                <div
                  key={`${r}-${c}`}
                  className={clsx(
                    'flex items-center justify-center text-xs transition-colors duration-150',
                    cell === 'wall' && 'bg-emerald-900',
                    cell === 'path' && 'bg-amber-50',
                    cell === 'start' && 'bg-green-100',
                    cell === 'end' && 'bg-amber-200',
                    cell === 'gate' && !isBlocked && 'bg-yellow-200',
                    cell === 'gate' && isBlocked && 'bg-red-200',
                    cell === 'collectible' && 'bg-amber-50',
                    isPlayer && 'bg-teal-300',
                  )}
                  style={{ width: cellSize, height: cellSize }}
                >
                  {isPlayer && '🧑‍🎓'}
                  {!isPlayer && cell === 'end' && '🏁'}
                  {!isPlayer && cell === 'gate' && !isBlocked && '🚪'}
                  {!isPlayer && cell === 'gate' && isBlocked && '🚫'}
                  {!isPlayer && cell === 'collectible' && '⭐'}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile D-pad */}
      <div className="flex justify-center mt-4 lg:hidden">
        <div className="grid grid-cols-3 gap-1.5" style={{ width: 140 }}>
          <div />
          <button
            onClick={() => movePlayer(-1, 0)}
            className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-center font-bold text-lg active:scale-95 transition-transform"
          >
            ↑
          </button>
          <div />
          <button
            onClick={() => movePlayer(0, -1)}
            className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-center font-bold text-lg active:scale-95 transition-transform"
          >
            ←
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-center font-bold text-lg active:scale-95 transition-transform"
          >
            ↓
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-xl text-center font-bold text-lg active:scale-95 transition-transform"
          >
            →
          </button>
        </div>
      </div>

      {/* Gate Question Modal */}
      {gateQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-amber-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
              🚪 Gate Challenge
            </h3>
            <p className="text-gray-800 mb-4 leading-relaxed">
              {gateQuestion.content.questionText || gateQuestion.content.front}
            </p>
            {gateQuestion.content.arabicText && (
              <p className="text-xl font-arabic text-emerald-700 mb-4 text-center">
                {gateQuestion.content.arabicText}
              </p>
            )}
            <div className="space-y-2">
              {(gateQuestion.content.options || []).map((option, idx) => {
                const isSelected = selectedOption === option;
                const showCorrectness = showFeedback && isSelected;
                return (
                  <button
                    key={idx}
                    onClick={() => handleGateAnswer(option)}
                    disabled={showFeedback}
                    className={clsx(
                      'w-full p-3 rounded-xl border-2 text-left font-medium transition-all',
                      showCorrectness && isCorrect && 'bg-green-50 border-green-500 text-green-700',
                      showCorrectness && !isCorrect && 'bg-red-50 border-red-500 text-red-700',
                      !showFeedback && 'border-gray-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer',
                      showFeedback && !isSelected && 'opacity-50',
                    )}
                  >
                    <span className="text-sm text-gray-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
