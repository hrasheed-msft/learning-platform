import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TermMatchGame from './TermMatchGame';
import SpeedQuizGame from './SpeedQuizGame';
import FlashcardFlipGame from './FlashcardFlipGame';
import DailyChallengeGame from './DailyChallengeGame';
import EscapeRoomGame from './EscapeRoomGame';
import MazeNavigatorGame from './MazeNavigatorGame';
import { GameBlockedScreen } from '@/components/games';
import type { GameDifficulty } from '@/types/game';

const GAME_COMPONENTS: Record<string, React.ComponentType<{ gameId?: string; difficulty: GameDifficulty }>> = {
  'term-match': TermMatchGame,
  'speed-quiz': SpeedQuizGame,
  'flashcard-flip': FlashcardFlipGame,
  'daily-challenge': DailyChallengeGame,
  'escape-room': EscapeRoomGame,
  'maze': MazeNavigatorGame,
};

export default function GamePlay() {
  const { gameType } = useParams<{ gameType: string }>();
  const [searchParams] = useSearchParams();

  const gameId = searchParams.get('gameId') || undefined;
  const difficulty = (searchParams.get('difficulty') as GameDifficulty) || 'MEDIUM';

  const GameComponent = gameType ? GAME_COMPONENTS[gameType] : undefined;

  if (!GameComponent) {
    return (
      <GameBlockedScreen
        reason="NOT_ALLOWED"
        message={`Game type "${gameType}" is not available yet. Check back soon!`}
      />
    );
  }

  return <GameComponent gameId={gameId} difficulty={difficulty} />;
}
