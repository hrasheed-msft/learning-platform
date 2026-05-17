import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { ScoreDisplay, GameProgressBar, StreakIndicator, GameOverScreen, DifficultySelector } from '@/components/games';
import { Button } from '@/components/ui/Button';
import { Volume2 } from 'lucide-react';
import type { GameDifficulty, GameRound } from '@/types/game';

interface Props {
  gameId?: string;
  difficulty: GameDifficulty;
}

export default function ListeningQuizGame({ gameId, difficulty: initialDifficulty }: Props) {
  const { selectedMember } = useFamilyStore();
  const {
    activeSession, score, streak, currentRound, lastResult, rounds: submittedRounds,
    startGame, submitAnswer, completeGame, resetSession, isLoading,
  } = useGameStore();

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());

  const currentQuestion: GameRound | undefined = activeSession?.rounds?.[currentRound];
  const totalRounds = activeSession?.totalRounds || 0;

  const handleStart = async () => {
    if (!gameId || !selectedMember?.id) return;
    await startGame(gameId, selectedMember.id, difficulty);
    setGameStarted(true);
    setHasListened(false);
    setIsPlaying(false);
    setRoundStartTime(Date.now());
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setHasListened(true);
    }, 1500);
  };

  const handleAnswer = useCallback(async (answer: string) => {
    if (showFeedback || !activeSession || !hasListened) return;
    setSelectedOption(answer);
    setShowFeedback(true);

    const timeSpent = Date.now() - roundStartTime;
    try {
      const result = await submitAnswer(currentRound, { selectedOption: answer }, timeSpent);
      setIsCorrect(result.isCorrect);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
        setIsPlaying(false);
        setHasListened(false);
        setRoundStartTime(Date.now());

        if (result.sessionState.roundsCompleted >= totalRounds) {
          completeGame('FINISHED');
        }
      }, 1000);
    } catch {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  }, [showFeedback, activeSession, hasListened, currentRound, roundStartTime, totalRounds]);

  const handlePlayAgain = () => {
    resetSession();
    setGameStarted(false);
    setHasListened(false);
    setIsPlaying(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (lastResult) {
    return <GameOverScreen result={lastResult} onPlayAgain={handlePlayAgain} />;
  }

  if (!gameStarted || !activeSession) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <span className="text-6xl mb-4 block">🎧</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Listening Quiz</h1>
        <p className="text-gray-500 mb-6">Listen to the audio and answer the question!</p>
        <div className="flex justify-center mb-6">
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>
        <Button onClick={handleStart} variant="primary" size="lg" isLoading={isLoading}>
          Start Listening
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-16 text-gray-500">Loading question...</div>;
  }

  const audioContent = currentQuestion.content.arabicText || currentQuestion.content.front || '';
  const questionText = currentQuestion.content.questionText || 'What did you hear?';
  const options = currentQuestion.content.options || [];
  const results = submittedRounds.map((r) => r.isCorrect);

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

      {/* Speaker / Audio Area */}
      <div className="text-center mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
          Question {currentRound + 1} of {totalRounds}
        </p>

        <div className="inline-flex flex-col items-center">
          <button
            onClick={handlePlay}
            disabled={isPlaying && hasListened}
            className={clsx(
              'w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg mb-4',
              isPlaying
                ? 'bg-gradient-to-br from-teal-400 to-emerald-500 scale-110 animate-pulse shadow-emerald-200'
                : 'bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 hover:scale-105 cursor-pointer',
            )}
          >
            <Volume2 className="w-10 h-10 text-white" />
          </button>

          {!isPlaying && !hasListened && (
            <p className="text-sm text-gray-500">Tap to listen</p>
          )}

          {isPlaying && !hasListened && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full animate-bounce"
                    style={{
                      height: `${12 + Math.random() * 16}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-emerald-600 font-medium">Now playing...</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-500 rounded-full animate-bounce"
                    style={{
                      height: `${12 + Math.random() * 16}px`,
                      animationDelay: `${(i + 5) * 0.1}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Revealed text (simulated audio) */}
          {hasListened && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mt-2 max-w-sm">
              <p className="text-2xl font-arabic text-emerald-800 leading-relaxed">{audioContent}</p>
              {currentQuestion.content.transliteration && (
                <p className="text-xs text-gray-400 italic mt-2">{currentQuestion.content.transliteration}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question & Options */}
      {hasListened && (
        <>
          <h2 className="text-lg font-bold text-gray-900 text-center mb-6">{questionText}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const showCorrectness = showFeedback && isSelected;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                  className={clsx(
                    'p-4 rounded-xl border-2 text-left font-medium transition-all duration-200',
                    showCorrectness && isCorrect && 'bg-green-50 border-green-500 text-green-700',
                    showCorrectness && !isCorrect && 'bg-red-50 border-red-500 text-red-700 animate-pulse',
                    !showFeedback && !isSelected && 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50 cursor-pointer',
                    showFeedback && !isSelected && 'opacity-50',
                  )}
                >
                  <span className="text-sm text-gray-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
