import { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SentenceBuildGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const correctSentence = currentQuestion?.content.correctAnswer || '';
  const correctWords = useMemo(() => correctSentence.split(/\s+/).filter(Boolean), [correctSentence]);
  const shuffledWords = useMemo(
    () => shuffleArray(correctWords.map((w, i) => ({ word: w, id: i }))),
    [correctWords],
  );

  const availableWords = shuffledWords.filter(
    (sw) => !placedWords.includes(`${sw.id}:${sw.word}`),
  );

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setPlacedWords([]);
    setRoundStartTime(Date.now());
  };

  const handleSelectWord = (id: number, word: string) => {
    if (showFeedback) return;
    setPlacedWords((prev) => [...prev, `${id}:${word}`]);
  };

  const handleRemoveWord = (index: number) => {
    if (showFeedback) return;
    setPlacedWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheck = useCallback(async () => {
    if (showFeedback || !activeSession) return;
    setShowFeedback(true);

    const answer = placedWords.map((pw) => pw.split(':').slice(1).join(':')).join(' ');
    const correct = answer === correctSentence;
    setIsCorrect(correct);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(currentRound, { selectedOption: answer }, timeSpent);

      setTimeout(() => {
        setShowFeedback(false);
        setPlacedWords([]);
        setRoundStartTime(Date.now());

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1200);
    } catch {
      setShowFeedback(false);
    }
  }, [showFeedback, activeSession, placedWords, correctSentence, currentRound, roundStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setPlacedWords([]);
    setShowFeedback(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🔤</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sentence Builder</h1>
        <p className="text-gray-500 mb-6">Arrange scrambled words to build the correct sentence!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Building
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading round...</div>;
  }

  const results = submittedRounds.map((r) => r.isCorrect);
  const allPlaced = placedWords.length === correctWords.length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        <span className="text-sm text-gray-500">
          {currentRound + 1} / {totalRounds}
        </span>
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Arabic original */}
      {currentQuestion.content.arabicText && (
        <div className="text-center mb-4">
          <p className="text-2xl font-arabic text-emerald-700 leading-relaxed">
            {currentQuestion.content.arabicText}
          </p>
          {currentQuestion.content.transliteration && (
            <p className="text-sm text-gray-400 italic mt-1">{currentQuestion.content.transliteration}</p>
          )}
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mb-4">
        Tap words below to build the sentence
      </p>

      {/* Sentence area */}
      <div
        className={clsx(
          'min-h-[80px] p-4 rounded-2xl border-2 border-dashed mb-6 flex flex-wrap gap-2 items-start transition-colors',
          showFeedback && isCorrect && 'border-green-400 bg-green-50',
          showFeedback && !isCorrect && 'border-red-400 bg-red-50',
          !showFeedback && 'border-amber-300 bg-amber-50/50',
        )}
      >
        {placedWords.length === 0 && (
          <p className="text-gray-400 text-sm italic m-auto">Tap words to place them here...</p>
        )}
        {placedWords.map((pw, idx) => {
          const word = pw.split(':').slice(1).join(':');
          return (
            <button
              key={`placed-${idx}`}
              onClick={() => handleRemoveWord(idx)}
              disabled={showFeedback}
              className={clsx(
                'px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-sm',
                showFeedback && isCorrect && 'bg-green-200 text-green-800',
                showFeedback && !isCorrect && 'bg-red-200 text-red-800',
                !showFeedback && 'bg-white text-emerald-800 border border-emerald-300 hover:bg-red-50 hover:border-red-300 cursor-pointer',
              )}
            >
              {word}
              {!showFeedback && <span className="ml-1 text-xs text-gray-400">✕</span>}
            </button>
          );
        })}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {availableWords.map((sw) => (
          <button
            key={`word-${sw.id}`}
            onClick={() => handleSelectWord(sw.id, sw.word)}
            disabled={showFeedback}
            className={clsx(
              'px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-md',
              'bg-gradient-to-b from-emerald-500 to-teal-600 text-white',
              'hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:-translate-y-0.5',
              'active:translate-y-0 active:shadow-sm',
              showFeedback && 'opacity-50 cursor-not-allowed',
            )}
          >
            {sw.word}
          </button>
        ))}
      </div>

      {/* Feedback message */}
      {showFeedback && (
        <div className={clsx(
          'text-center mb-4 p-3 rounded-xl font-semibold text-sm',
          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
        )}>
          {isCorrect ? '✨ Excellent! That\'s correct!' : `Not quite — the correct sentence is: "${correctSentence}"`}
        </div>
      )}

      {/* Check button */}
      {!showFeedback && (
        <div className="text-center">
          <Button
            onClick={handleCheck}
            variant="primary"
            size="lg"
            disabled={!allPlaced}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            ✓ Check Sentence
          </Button>
        </div>
      )}
    </div>
  );
}
