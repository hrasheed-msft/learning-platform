import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

export default function FlashcardFlipGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStartTime, setCardStartTime] = useState(Date.now());
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentCard: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setCardStartTime(Date.now());
  };

  const handleRate = useCallback(async (knew: boolean) => {
    if (isAnimating || !activeSession) return;
    setIsAnimating(true);
    setSwipeDirection(knew ? 'right' : 'left');

    const timeSpent = Date.now() - cardStartTime;
    const rating = knew ? 4 : 2;

    try {
      const result = await submitAnswer(currentRound, { rating, knew }, timeSpent);

      setTimeout(() => {
        setIsFlipped(false);
        setSwipeDirection(null);
        setIsAnimating(false);
        setCardStartTime(Date.now());

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 400);
    } catch {
      setIsAnimating(false);
      setSwipeDirection(null);
    }
  }, [isAnimating, activeSession, currentRound, cardStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setIsFlipped(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🔄</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Flashcard Flip</h1>
        <p className="text-gray-500 mb-6">Review cards — swipe right if you know it, left if you don't!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Review
        </Button>
      </div>
    );
  }

  if (!currentCard) {
    return <div className="text-center py-16 text-gray-500">Loading card...</div>;
  }

  const front = currentCard.content.front || currentCard.content.arabicText || currentCard.content.questionText || '';
  const frontArabic = currentCard.content.frontArabic || currentCard.content.arabicText || '';
  const back = currentCard.content.back || currentCard.content.translation || currentCard.content.correctAnswer || '';
  const backArabic = currentCard.content.backArabic || '';
  const results = submittedRounds.map((r) => r.isCorrect);

  return (
    <div className="max-w-lg mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        <span className="text-sm text-gray-500">
          {currentRound + 1} / {totalRounds}
        </span>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Card */}
      <div className="perspective-1000 mb-8">
        <div
          onClick={() => !isAnimating && setIsFlipped(!isFlipped)}
          className={clsx(
            'relative w-full aspect-[3/4] cursor-pointer transition-all duration-500 preserve-3d',
            isFlipped && 'rotate-y-180',
            swipeDirection === 'right' && 'translate-x-[120%] rotate-12 opacity-0',
            swipeDirection === 'left' && '-translate-x-[120%] -rotate-12 opacity-0',
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped
              ? `rotateY(180deg)${swipeDirection === 'right' ? ' translateX(120%) rotate(12deg)' : swipeDirection === 'left' ? ' translateX(-120%) rotate(-12deg)' : ''}`
              : swipeDirection === 'right'
                ? 'translateX(120%) rotate(12deg)'
                : swipeDirection === 'left'
                  ? 'translateX(-120%) rotate(-12deg)'
                  : '',
            transition: 'transform 0.5s ease, opacity 0.3s ease',
            opacity: swipeDirection ? 0 : 1,
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border-2 border-gray-100 flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {frontArabic && (
              <p className="text-3xl font-arabic text-primary-700 mb-4 leading-relaxed">{frontArabic}</p>
            )}
            <p className="text-lg text-gray-800 text-center">{front}</p>
            <p className="text-xs text-gray-400 mt-6">Tap to flip</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl shadow-lg border-2 border-primary-200 flex flex-col items-center justify-center p-8 backface-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {backArabic && (
              <p className="text-2xl font-arabic text-primary-700 mb-4">{backArabic}</p>
            )}
            <p className="text-lg text-gray-800 text-center font-medium">{back}</p>
          </div>
        </div>
      </div>

      {/* Rating Buttons */}
      {isFlipped && !isAnimating && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleRate(false)}
            variant="outline"
            size="lg"
            leftIcon={<ThumbsDown className="w-5 h-5" />}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Still Learning
          </Button>
          <Button
            onClick={() => handleRate(true)}
            variant="primary"
            size="lg"
            leftIcon={<ThumbsUp className="w-5 h-5" />}
            className="bg-green-600 hover:bg-green-700"
          >
            I Knew It!
          </Button>
        </div>
      )}
    </div>
  );
}
