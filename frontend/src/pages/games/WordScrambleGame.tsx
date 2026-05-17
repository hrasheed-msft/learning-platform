import { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { ScoreDisplay, GameProgressBar, StreakIndicator, HintButton, GameOverScreen, DifficultySelector } from '@/components/games';
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

export default function WordScrambleGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scrambleKey, setScrambleKey] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 2 : 1);

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const targetWord = currentQuestion
    ? (currentQuestion.content.correctAnswer || currentQuestion.content.translation || currentQuestion.content.back || '')
    : '';

  const hint = currentQuestion
    ? (currentQuestion.content.questionText || currentQuestion.content.front || '')
    : '';

  const scrambledLetters = useMemo(() => {
    if (!targetWord) return [];
    const letters = targetWord.toUpperCase().split('');
    let shuffled = shuffleArray(letters);
    // Ensure the shuffle isn't identical to the answer
    if (shuffled.join('') === letters.join('') && letters.length > 1) {
      shuffled = shuffleArray(letters);
    }
    return shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetWord, scrambleKey]);

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setRoundStartTime(Date.now());
    setSelectedIndices([]);
    setScrambleKey(0);
  };

  const handleLetterClick = useCallback((index: number) => {
    if (showFeedback) return;
    if (selectedIndices.includes(index)) return;

    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    const newWord = newSelected.map((i) => scrambledLetters[i]).join('');

    // Auto-submit when all letters placed
    if (newWord.length === targetWord.length) {
      const correct = newWord.toLowerCase() === targetWord.toLowerCase();
      setIsCorrect(correct);
      setShowFeedback(true);

      const timeSpent = Date.now() - roundStartTime;
      submitAnswer(currentRound, { selectedOption: newWord }, timeSpent)
        .then((result) => {
          setTimeout(() => {
            setShowFeedback(false);
            setSelectedIndices([]);
            setRoundStartTime(Date.now());
            setScrambleKey((k) => k + 1);

            if (result.sessionState.roundsCompleted >= totalRounds) {
              completeGame('FINISHED');
            }
          }, correct ? 800 : 1200);
        })
        .catch(() => {
          setShowFeedback(false);
          setSelectedIndices([]);
        });
    }
  }, [showFeedback, selectedIndices, scrambledLetters, targetWord, currentRound, roundStartTime, totalRounds]);

  const handleDeselectLetter = useCallback((positionIndex: number) => {
    if (showFeedback) return;
    setSelectedIndices((prev) => prev.filter((_, i) => i !== positionIndex));
  }, [showFeedback]);

  const handleHint = () => {
    if (hintsRemaining <= 0 || showFeedback) return;
    // Reveal the next correct letter
    const correctLetters = targetWord.toUpperCase().split('');
    const nextPos = selectedIndices.length;
    if (nextPos >= correctLetters.length) return;

    const neededLetter = correctLetters[nextPos];
    const availableIndex = scrambledLetters.findIndex(
      (l, i) => l === neededLetter && !selectedIndices.includes(i)
    );
    if (availableIndex !== -1) {
      handleLetterClick(availableIndex);
    }
    setHintsRemaining((h) => h - 1);
  };

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setSelectedIndices([]);
    setShowFeedback(false);
    setHintsRemaining(difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 2 : 1);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🔤</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Word Scramble</h1>
        <p className="text-gray-500 mb-6">Unscramble the letters to spell the correct word!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Game
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading question...</div>;
  }

  const results = submittedRounds.map((r) => r.isCorrect);

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        <HintButton hintsRemaining={hintsRemaining} maxHints={difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 2 : 1} onUseHint={handleHint} />
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Question / Hint */}
      <div className="text-center mb-6">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
          Round {currentRound + 1} of {totalRounds}
        </p>
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 shadow-sm border border-teal-100">
          <p className="text-lg text-gray-700 font-medium">{hint}</p>
          {currentQuestion.content.arabicText && (
            <p className="mt-2 text-2xl font-arabic text-teal-700">
              {currentQuestion.content.arabicText}
            </p>
          )}
        </div>
      </div>

      {/* Build Area */}
      <div className={clsx(
        'flex flex-wrap justify-center gap-2 min-h-[60px] p-4 rounded-2xl border-2 border-dashed mb-6 transition-all duration-300',
        showFeedback && isCorrect && 'border-green-400 bg-green-50',
        showFeedback && !isCorrect && 'border-red-400 bg-red-50 animate-pulse',
        !showFeedback && 'border-amber-300 bg-amber-50/50',
      )}>
        {selectedIndices.length === 0 && (
          <p className="text-amber-400 text-sm self-center">Tap letters below to spell the word</p>
        )}
        {selectedIndices.map((letterIdx, posIdx) => (
          <button
            key={posIdx}
            onClick={() => handleDeselectLetter(posIdx)}
            disabled={showFeedback}
            className={clsx(
              'w-11 h-11 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-200 shadow-sm',
              showFeedback && isCorrect && 'bg-green-500 text-white scale-110',
              showFeedback && !isCorrect && 'bg-red-500 text-white',
              !showFeedback && 'bg-white text-teal-800 border-2 border-teal-300 hover:border-red-300 hover:bg-red-50 cursor-pointer',
            )}
          >
            {scrambledLetters[letterIdx]}
          </button>
        ))}
      </div>

      {/* Scrambled Letters */}
      <div className="flex flex-wrap justify-center gap-2">
        {scrambledLetters.map((letter, idx) => {
          const isUsed = selectedIndices.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleLetterClick(idx)}
              disabled={isUsed || showFeedback}
              className={clsx(
                'w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-200',
                isUsed
                  ? 'bg-gray-100 text-gray-300 border-2 border-gray-200 scale-90'
                  : 'bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-md border-2 border-amber-500 hover:from-amber-500 hover:to-amber-600 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer active:translate-y-0',
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      {showFeedback && (
        <div className={clsx(
          'text-center mt-6 text-lg font-semibold transition-opacity duration-300',
          isCorrect ? 'text-green-600' : 'text-red-600',
        )}>
          {isCorrect ? '✨ Masha\'Allah! Correct!' : `The answer was: ${targetWord}`}
        </div>
      )}
    </div>
  );
}
