import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

interface CardState {
  id: string;
  content: string;
  type: 'term' | 'definition';
  termId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GRID_CONFIG: Record<GameDifficulty, { cols: number; rows: number; pairs: number }> = {
  EASY: { cols: 4, rows: 4, pairs: 8 },
  MEDIUM: { cols: 4, rows: 5, pairs: 10 },
  HARD: { cols: 5, rows: 6, pairs: 15 },
};

export default function MemoryMatchGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, lastResult,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);

  const grid = GRID_CONFIG[difficulty];
  const totalPairs = Math.min(grid.pairs, activeSession?.rounds?.length || grid.pairs);

  // Initialize cards from session rounds
  useEffect(() => {
    if (!activeSession?.rounds) return;

    const maxPairs = grid.pairs;
    const rounds = activeSession.rounds.slice(0, maxPairs);
    const newCards: CardState[] = [];

    rounds.forEach((round) => {
      const c = round.content;
      const term = c.arabicText || c.front || c.frontArabic || c.questionText || '';
      const definition = c.translation || c.back || c.correctAnswer || '';

      newCards.push({
        id: `${c.id}-term`,
        content: term,
        type: 'term',
        termId: c.id,
        isFlipped: false,
        isMatched: false,
      });
      newCards.push({
        id: `${c.id}-def`,
        content: definition,
        type: 'definition',
        termId: c.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
    setRoundStartTime(Date.now());
  }, [activeSession?.rounds, grid.pairs]);

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setMatchedCount(0);
    setFlippedIds([]);
    setAttempts(0);
  };

  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedIds.length >= 2) return;

    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, isFlipped: true } : c));
    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setAttempts((a) => a + 1);
      const [first, second] = newFlipped.map((id) => cards.find((c) => c.id === id)!);

      setTimeout(async () => {
        if (first.termId === second.termId && first.type !== second.type) {
          // Match found
          setCards((prev) => prev.map((c) =>
            c.termId === first.termId ? { ...c, isMatched: true, isFlipped: true } : c
          ));
          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);

          if (activeSession) {
            const timeSpent = Date.now() - roundStartTime;
            try {
              await submitAnswer(newMatched - 1, { matchedTermId: first.termId }, timeSpent);
            } catch { /* continue */ }
            setRoundStartTime(Date.now());
          }

          if (newMatched >= totalPairs) {
            setTimeout(() => completeGame('FINISHED'), 600);
          }
        } else {
          // No match — flip back after showing
          setTimeout(() => {
            setCards((prev) => prev.map((c) =>
              newFlipped.includes(c.id) && !c.isMatched ? { ...c, isFlipped: false } : c
            ));
          }, 700);
        }
        setFlippedIds([]);
        setIsChecking(false);
      }, 400);
    }
  }, [cards, flippedIds, isChecking, matchedCount, activeSession, totalPairs, roundStartTime]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setCards([]);
    setMatchedCount(0);
    setAttempts(0);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🧠</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Memory Match</h1>
        <p className="text-gray-500 mb-6">Flip cards and match terms with their definitions!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <p className="text-sm text-gray-400 mb-6">
          {grid.cols}×{grid.rows} grid · {grid.pairs} pairs
        </p>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Attempts: {attempts}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {matchedCount} / {totalPairs} matched
          </span>
        </div>
      </div>

      <GameProgressBar current={matchedCount} total={totalPairs} className="mb-6" />

      {/* Card Grid */}
      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="perspective-1000"
            style={{ perspective: '600px' }}
          >
            <button
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || isChecking}
              className={clsx(
                'relative w-full aspect-[3/4] transition-transform duration-500',
                !card.isFlipped && !card.isMatched && 'cursor-pointer',
              )}
              style={{
                transformStyle: 'preserve-3d',
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Card Back (face down) */}
              <div
                className={clsx(
                  'absolute inset-0 rounded-xl border-2 flex items-center justify-center',
                  'bg-gradient-to-br from-teal-500 to-emerald-600 border-teal-600',
                  !card.isFlipped && !card.isMatched && 'hover:from-teal-400 hover:to-emerald-500 hover:shadow-lg hover:scale-[1.03]',
                  'transition-all duration-200',
                )}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-3xl text-white/80">☪</span>
              </div>

              {/* Card Front (face up) */}
              <div
                className={clsx(
                  'absolute inset-0 rounded-xl border-2 flex items-center justify-center p-2 text-center',
                  card.isMatched
                    ? 'bg-green-50 border-green-300 shadow-sm shadow-green-100'
                    : 'bg-white border-amber-300 shadow-md',
                )}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className={clsx(
                  'text-sm font-medium leading-tight',
                  card.type === 'term' ? 'font-arabic text-base text-teal-700' : 'text-gray-700',
                  card.isMatched && 'text-green-600',
                )}>
                  {card.content}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
