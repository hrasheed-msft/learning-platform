import { getOptions } from '../../utils/gameHelpers';
import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { ScoreDisplay, GameProgressBar, StreakIndicator, HintButton, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

export default function MultipleChoiceGame({ gameId, difficulty: initialDifficulty }: Props) {
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [hintsRemaining, setHintsRemaining] = useState(difficulty === 'EASY' ? 2 : difficulty === 'MEDIUM' ? 1 : 0);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const handleStart = async () => {
    if (!gameId || !activeMemberId) {
      console.warn('Cannot start game: no active family member found.');
      return;
    }
    await startGame(gameId, activeMemberId, difficulty);
    setGameStarted(true);
    setRoundStartTime(Date.now());
    setEliminatedOptions([]);
  };

  const handleAnswer = useCallback(async (answer: string) => {
    if (showFeedback || !activeSession) return;

    setSelectedOption(answer);
    setShowFeedback(true);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(currentRound, { selectedOption: answer }, timeSpent);
      setIsCorrect(result.isCorrect);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
        setRoundStartTime(Date.now());
        setEliminatedOptions([]);

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1500);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, activeSession, currentRound, roundStartTime, totalRounds]);

  const handleHint = () => {
    if (hintsRemaining <= 0 || !currentQuestion) return;
    const correctAnswer = currentQuestion.content.correctAnswer || '';
    const options = getOptions(currentQuestion.content.options);
    const wrongOptions = options.filter((o) => o !== correctAnswer && !eliminatedOptions.includes(o));
    if (wrongOptions.length > 0) {
      const toEliminate = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setEliminatedOptions((prev) => [...prev, toEliminate]);
    }
    setHintsRemaining((h) => h - 1);
  };

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setSelectedOption(null);
    setShowFeedback(false);
    setEliminatedOptions([]);
    setHintsRemaining(difficulty === 'EASY' ? 2 : difficulty === 'MEDIUM' ? 1 : 0);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">📚</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Multiple Choice</h1>
        <p className="text-gray-500 mb-6">Test your Islamic knowledge with multiple choice questions!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Quiz
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading question...</div>;
  }

  const questionText = currentQuestion.content.questionText || currentQuestion.content.front || '';
  const options = getOptions(currentQuestion.content.options);
  const correctAnswer = currentQuestion.content.correctAnswer || '';
  const results = submittedRounds.map((r) => r.isCorrect);

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionColors = [
    { idle: 'border-teal-200 hover:border-teal-400 hover:bg-teal-50', bg: 'bg-teal-100 text-teal-700' },
    { idle: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50', bg: 'bg-amber-100 text-amber-700' },
    { idle: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50', bg: 'bg-emerald-100 text-emerald-700' },
    { idle: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50', bg: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <ScoreDisplay score={score} multiplier={streak >= 5 ? 2 : streak >= 3 ? 1.5 : undefined} />
        <StreakIndicator streak={streak} />
        <HintButton hintsRemaining={hintsRemaining} maxHints={difficulty === 'EASY' ? 2 : 1} onUseHint={handleHint} />
      </div>

      <GameProgressBar current={currentRound} total={totalRounds} results={results} className="mb-8" />

      {/* Question */}
      <div className="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 rounded-2xl p-8 shadow-sm border border-teal-100 mb-8 text-center">
        <p className="text-xs text-teal-600 uppercase tracking-wider mb-3 font-semibold">
          Question {currentRound + 1} of {totalRounds}
        </p>
        <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
          {questionText}
        </h2>
        {currentQuestion.content.arabicText && (
          <p className="mt-4 text-3xl font-arabic text-teal-700 leading-loose">
            {currentQuestion.content.arabicText}
          </p>
        )}
        {currentQuestion.content.transliteration && (
          <p className="mt-2 text-sm text-teal-500 italic">
            {currentQuestion.content.transliteration}
          </p>
        )}
      </div>

      {/* Options — 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isEliminated = eliminatedOptions.includes(option);
          const isCorrectOption = showFeedback && option === correctAnswer;
          const color = optionColors[idx % optionColors.length];

          if (isEliminated && !showFeedback) {
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border-2 border-gray-100 bg-gray-50 opacity-30 text-center"
              >
                <span className="text-gray-400 line-through">{option}</span>
              </div>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback || isEliminated}
              className={clsx(
                'p-4 rounded-xl border-2 font-medium transition-all duration-300 flex items-start gap-3',
                isCorrectOption && 'bg-green-100 border-green-500 text-green-800 shadow-md shadow-green-100 scale-[1.02]',
                isSelected && showFeedback && !isCorrect && !isCorrectOption && 'bg-red-100 border-red-500 text-red-800 animate-pulse',
                !showFeedback && !isSelected && `bg-white ${color.idle} cursor-pointer hover:shadow-md`,
                showFeedback && !isSelected && !isCorrectOption && 'opacity-40',
              )}
            >
              <span className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                isCorrectOption ? 'bg-green-500 text-white' :
                isSelected && showFeedback && !isCorrect ? 'bg-red-500 text-white' :
                color.bg,
              )}>
                {optionLabels[idx]}
              </span>
              <span className="text-left pt-1">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation */}
      {showFeedback && (
        <div className={clsx(
          'mt-8 p-5 rounded-2xl text-center transition-all duration-300',
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200',
        )}>
          <p className={clsx(
            'font-bold text-lg',
            isCorrect ? 'text-green-700' : 'text-red-700',
          )}>
            {isCorrect ? '🌟 Masha\'Allah! Correct!' : `The correct answer is: ${correctAnswer}`}
          </p>
          {currentQuestion.content.explanation && (
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {currentQuestion.content.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
