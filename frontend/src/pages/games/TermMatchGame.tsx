import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { GameTimer, ScoreDisplay, GameProgressBar, StreakIndicator, HintButton, GameOverScreen } from '@/components/games';
import { DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

interface CardState {
  id: string;
  content: string;
  type: 'arabic' | 'translation';
  termId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GRID_CONFIG: Record<GameDifficulty, { cols: number; rows: number; pairs: number }> = {
  EASY: { cols: 3, rows: 2, pairs: 3 },
  MEDIUM: { cols: 4, rows: 3, pairs: 6 },
  HARD: { cols: 5, rows: 4, pairs: 10 },
};

export default function TermMatchGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const { activeSession, score, streak, lastResult, startGame, submitAnswer, completeGame, resetSession, isLoading } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [gameStarted, setGameStarted] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(difficulty === 'EASY' ? 2 : difficulty === 'MEDIUM' ? 1 : 0);

  const grid = GRID_CONFIG[difficulty];
  const totalPairs = grid.pairs;

  // Initialize game cards from session rounds
  useEffect(() => {
    if (activeSession?.rounds) {
      const newCards: CardState[] = [];
      activeSession.rounds.forEach((round) => {
        const c = round.content;
        newCards.push({
          id: `${c.id}-arabic`,
          content: c.arabicText || c.frontArabic || c.front || '',
          type: 'arabic',
          termId: c.id,
          isFlipped: false,
          isMatched: false,
        });
        newCards.push({
          id: `${c.id}-trans`,
          content: c.translation || c.back || '',
          type: 'translation',
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
    }
  }, [activeSession?.rounds]);

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setMatchedCount(0);
    setFlippedIds([]);
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
      const [first, second] = newFlipped.map((id) => cards.find((c) => c.id === id)!);

      setTimeout(async () => {
        if (first.termId === second.termId && first.type !== second.type) {
          // Match!
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
            setTimeout(() => completeGame('FINISHED'), 500);
          }
        } else {
          // No match — flip back
          setTimeout(() => {
            setCards((prev) => prev.map((c) =>
              newFlipped.includes(c.id) && !c.isMatched ? { ...c, isFlipped: false } : c
            ));
          }, 800);
        }
        setFlippedIds([]);
        setIsChecking(false);
      }, 300);
    }
  }, [cards, flippedIds, isChecking, matchedCount, activeSession, totalPairs]);

  const handleHint = () => {
    if (hintsRemaining <= 0) return;
    const unmatched = cards.filter((c) => !c.isMatched && !c.isFlipped);
    if (unmatched.length >= 2) {
      const term = unmatched[0];
      const partner = unmatched.find((c) => c.termId === term.termId && c.id !== term.id);
      if (partner) {
        setCards((prev) => prev.map((c) =>
          c.id === term.id || c.id === partner.id ? { ...c, isFlipped: true } : c
        ));
        setTimeout(() => {
          setCards((prev) => prev.map((c) =>
            (c.id === term.id || c.id === partner.id) && !c.isMatched ? { ...c, isFlipped: false } : c
          ));
        }, 1500);
      }
    }
    setHintsRemaining((h) => h - 1);
  };

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setCards([]);
    setMatchedCount(0);
  };

  const handleTimeUp = () => {
    completeGame('TIMED_OUT');
  };

  // Game Over
  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  // Pre-game: difficulty select + start
  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🃏</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Term Match</h1>
        <p className="text-gray-500 mb-6">Match Arabic terms to their translations by flipping cards!</p>
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

  // Active Game
  const timerDuration = difficulty === 'MEDIUM' ? 90000 : difficulty === 'HARD' ? 60000 : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        {timerDuration > 0 && (
          <GameTimer durationMs={timerDuration} onTimeUp={handleTimeUp} />
        )}
        <HintButton hintsRemaining={hintsRemaining} maxHints={difficulty === 'EASY' ? 2 : 1} onUseHint={handleHint} />
      </div>

      <GameProgressBar current={matchedCount} total={totalPairs} className="mb-6" />

      {/* Card Grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || isChecking}
            className={clsx(
              'aspect-[3/4] rounded-xl border-2 transition-all duration-300 transform',
              'flex items-center justify-center p-2 text-center',
              card.isMatched
                ? 'bg-green-50 border-green-300 scale-95 opacity-75'
                : card.isFlipped
                ? 'bg-white border-primary-300 shadow-md'
                : 'bg-gradient-to-br from-primary-500 to-primary-700 border-primary-600 hover:scale-105 hover:shadow-lg cursor-pointer',
              card.isFlipped && !card.isMatched && 'ring-2 ring-primary-200'
            )}
          >
            {card.isFlipped || card.isMatched ? (
              <span className={clsx(
                'text-sm font-medium',
                card.type === 'arabic' ? 'font-arabic text-lg' : 'text-gray-800'
              )}>
                {card.content}
              </span>
            ) : (
              <span className="text-2xl text-white/80 font-arabic">ع</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
