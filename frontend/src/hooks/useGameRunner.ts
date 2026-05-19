import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGameStore } from '@/stores/gameStore';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import { SLUG_TO_TYPE } from '@/utils/gameHelpers';
import type { GameDifficulty, GameRound, RoundResult } from '@/types/game';

interface RunnerOptions {
  /** Optional override for difficulty — defaults to store's selectedDifficulty */
  difficulty?: GameDifficulty;
  /** Optional override for gameId — defaults to store's selectedGameId */
  gameId?: string | null;
  /** Auto-start the session as soon as gameId & member are known */
  autoStart?: boolean;
}

/**
 * Shared lifecycle hook used by all 9 game components.
 * Handles: auto-start, current round access, submitting answers,
 * round timing, and completing the session when last round is done.
 */
export function useGameRunner(opts: RunnerOptions = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeMemberId = useActiveMemberId();
  const {
    activeSession, currentRound, lastResult, rounds: submittedRounds,
    score, streak, lives, timeRemainingMs,
    selectedGameId, selectedGameSlug, selectedCourseId, selectedDifficulty,
    startGame, submitAnswer, completeGame, resetSession, isLoading, error,
  } = useGameStore();

  const gameId = opts.gameId ?? selectedGameId;
  const difficulty = opts.difficulty ?? selectedDifficulty;
  const courseId = searchParams.get('courseId') || selectedCourseId || undefined;
  const gameSlug = selectedGameSlug || undefined;
  const gameType = gameSlug ? SLUG_TO_TYPE[gameSlug] : undefined;
  const autoStart = opts.autoStart ?? true;

  const [started, setStarted] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const startAttempted = useRef(false);

  // Auto-start once when gameId + member are available
  useEffect(() => {
    if (!autoStart) return;
    if (started || startAttempted.current) return;
    if ((!gameId && !gameType) || !activeMemberId) return;
    startAttempted.current = true;
    (async () => {
      try {
        await startGame({
          gameId: gameId || undefined,
          gameType: gameType || undefined,
          memberId: activeMemberId,
          courseId,
          difficulty,
        });
        setStarted(true);
        setRoundStartTime(Date.now());
      } catch {
        startAttempted.current = false; // allow retry
      }
    })();
  }, [autoStart, gameId, gameType, activeMemberId, courseId, difficulty, started, startGame]);

  const totalRounds = activeSession?.totalRounds || 0;
  const currentContent: GameRound | undefined = activeSession?.rounds?.[currentRound];

  /** Submit answer for current round; auto-completes game on last round. */
  const submit = useCallback(
    async (answer: unknown): Promise<RoundResult | null> => {
      if (!activeSession) return null;
      const timeSpent = Date.now() - roundStartTime;
      try {
        const result = await submitAnswer(currentRound, answer, timeSpent);
        setRoundStartTime(Date.now());
        if (result.sessionState.roundsCompleted >= totalRounds) {
          await completeGame('FINISHED');
        }
        return result;
      } catch {
        return null;
      }
    },
    [activeSession, currentRound, roundStartTime, totalRounds, submitAnswer, completeGame],
  );

  const playAgain = useCallback(() => {
    resetSession();
    setStarted(false);
    startAttempted.current = false;
    // Re-trigger autostart effect
    setRoundStartTime(Date.now());
  }, [resetSession]);

  const exitToHub = useCallback(() => {
    resetSession();
    navigate('/games');
  }, [resetSession, navigate]);

  return {
    // session
    activeSession, started, isLoading, error, lastResult,
    currentRound, totalRounds, currentContent,
    score, streak, lives, timeRemainingMs,
    submittedRounds,
    // identity
    gameId, difficulty, activeMemberId,
    // actions
    submit, playAgain, exitToHub,
  };
}
