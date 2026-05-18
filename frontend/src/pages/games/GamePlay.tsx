import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import QuickRecallGame from './QuickRecallGame';
import PairMatchGame from './PairMatchGame';
import FlashcardSprintGame from './FlashcardSprintGame';
import ClozeGame from './ClozeGame';
import WordSearchGame from './WordSearchGame';
import SequenceItGame from './SequenceItGame';
import WordScrambleGame from './WordScrambleGame';
import CalligraphyTraceGame from './CalligraphyTraceGame';
import FiqhScenarioGame from './FiqhScenarioGame';
import { GameBlockedScreen } from '@/components/games';
import { useGameStore } from '@/stores/gameStore';
import type { GameDifficulty } from '@/types/game';

const GAME_COMPONENTS: Record<string, React.ComponentType> = {
  'quick-recall': QuickRecallGame,
  'pair-match': PairMatchGame,
  'flashcard-sprint': FlashcardSprintGame,
  'cloze': ClozeGame,
  'word-search': WordSearchGame,
  'sequence-it': SequenceItGame,
  'word-scramble': WordScrambleGame,
  'calligraphy-trace': CalligraphyTraceGame,
  'fiqh-scenario': FiqhScenarioGame,
};

export default function GamePlay() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const [searchParams] = useSearchParams();
  const { setLauncherSelection, selectedGameId } = useGameStore();

  // Hydrate store from URL params if the user landed here directly
  // (e.g. after launcher navigation or a refresh).
  useEffect(() => {
    const gameId = searchParams.get('gameId') || undefined;
    const difficulty = (searchParams.get('difficulty') as GameDifficulty) || undefined;
    if (gameId || difficulty || gameSlug) {
      setLauncherSelection({
        gameSlug,
        gameId: gameId ?? selectedGameId ?? undefined,
        difficulty,
      });
    }
  }, [gameSlug, searchParams, setLauncherSelection, selectedGameId]);

  const GameComponent = gameSlug ? GAME_COMPONENTS[gameSlug] : undefined;

  if (!GameComponent) {
    return (
      <GameBlockedScreen
        reason="NOT_ALLOWED"
        message={`Game "${gameSlug}" is not available. Pick one from the Games Hub.`}
      />
    );
  }

  return <GameComponent />;
}
