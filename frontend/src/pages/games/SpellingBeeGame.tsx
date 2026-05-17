import { useState, useCallback, useRef, useEffect } from 'react';
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

export default function SpellingBeeGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const clue = currentQuestion?.content.questionText
    || currentQuestion?.content.front
    || currentQuestion?.content.translation
    || '';
  const correctAnswer = currentQuestion?.content.correctAnswer || currentQuestion?.content.back || '';

  // Auto-focus input when round changes
  useEffect(() => {
    if (gameStarted && !showFeedback) {
      inputRef.current?.focus();
    }
  }, [gameStarted, currentRound, showFeedback]);

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setTypedAnswer('');
    setShowHint(false);
    setRoundStartTime(Date.now());
  };

  const handleSubmit = useCallback(async () => {
    if (showFeedback || !activeSession || !typedAnswer.trim()) return;
    setShowFeedback(true);

    const correct = typedAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();
    setIsCorrect(correct);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(
        currentRound,
        { selectedOption: typedAnswer.trim() },
        timeSpent,
      );

      setTimeout(() => {
        setShowFeedback(false);
        setTypedAnswer('');
        setShowHint(false);
        setRoundStartTime(Date.now());

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1500);
    } catch {
      setShowFeedback(false);
    }
  }, [showFeedback, activeSession, typedAnswer, correctAnswer, currentRound, roundStartTime, totalRounds]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setTypedAnswer('');
    setShowFeedback(false);
    setShowHint(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🐝</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Spelling Bee</h1>
        <p className="text-gray-500 mb-6">Read the clue and spell the correct answer!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Spelling
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading round...</div>;
  }

  const results = submittedRounds.map((r) => r.isCorrect);

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} />
        <StreakIndicator streak={streak} />
        <HintButton
          hintsRemaining={showHint ? 0 : 1}
          maxHints={1}
          onUseHint={() => setShowHint(true)}
        />
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Clue */}
      <div className="text-center mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Question {currentRound + 1} of {totalRounds}
        </p>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
          <p className="text-lg font-bold text-gray-900 leading-relaxed">{clue}</p>
          {currentQuestion.content.arabicText && (
            <p className="text-2xl font-arabic text-emerald-700 mt-3">{currentQuestion.content.arabicText}</p>
          )}
        </div>
      </div>

      {/* Hint */}
      {showHint && currentQuestion.content.transliteration && (
        <div className="text-center mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200">
          <span className="text-sm text-teal-700">
            💡 Hint: <span className="font-medium italic">{currentQuestion.content.transliteration}</span>
          </span>
        </div>
      )}

      {/* Input area */}
      <div className="mb-6">
        <input
          ref={inputRef}
          type="text"
          value={typedAnswer}
          onChange={(e) => setTypedAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={showFeedback}
          placeholder="Type your answer..."
          className={clsx(
            'w-full text-center text-2xl font-bold py-5 px-6 rounded-2xl border-3 outline-none transition-all',
            showFeedback && isCorrect && 'border-green-400 bg-green-50 text-green-700',
            showFeedback && !isCorrect && 'border-red-400 bg-red-50 text-red-700',
            !showFeedback && 'border-amber-300 bg-white text-gray-900 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200',
          )}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={clsx(
          'text-center mb-6 p-4 rounded-2xl font-semibold',
          isCorrect
            ? 'bg-green-100 text-green-700 text-lg'
            : 'bg-red-100 text-red-700',
        )}>
          {isCorrect ? (
            <span>🎉 Correct! Well spelled!</span>
          ) : (
            <span>
              Not quite! The answer is: <span className="font-bold underline">{correctAnswer}</span>
            </span>
          )}
        </div>
      )}

      {/* Submit button */}
      {!showFeedback && (
        <div className="text-center">
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            disabled={!typedAnswer.trim()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white min-w-[200px]"
          >
            🐝 Submit Answer
          </Button>
        </div>
      )}
    </div>
  );
}
