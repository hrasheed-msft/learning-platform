import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TermMatchGame from './TermMatchGame';
import SpeedQuizGame from './SpeedQuizGame';
import FlashcardFlipGame from './FlashcardFlipGame';
import WordScrambleGame from './WordScrambleGame';
import FillInBlankGame from './FillInBlankGame';
import MemoryMatchGame from './MemoryMatchGame';
import TrueFalseGame from './TrueFalseGame';
import MultipleChoiceGame from './MultipleChoiceGame';
import SentenceBuildGame from './SentenceBuildGame';
import ListeningQuizGame from './ListeningQuizGame';
import CalligraphyTraceGame from './CalligraphyTraceGame';
import SpellingBeeGame from './SpellingBeeGame';
import StoryPuzzleGame from './StoryPuzzleGame';
import EscapeRoomGame from './EscapeRoomGame';
import MazeRunnerGame from './MazeRunnerGame';
import DailyChallengeGame from './DailyChallengeGame';
import { GameBlockedScreen } from '@/components/games';
import type { GameDifficulty } from '@/types/game';

const GAME_COMPONENTS: Record<string, React.ComponentType<{ gameId?: string; difficulty: GameDifficulty }>> = {
  'term-match': TermMatchGame,
  'speed-quiz': SpeedQuizGame,
  'flashcard-flip': FlashcardFlipGame,
  'word-scramble': WordScrambleGame,
  'fill-in-blank': FillInBlankGame,
  'memory-match': MemoryMatchGame,
  'true-false': TrueFalseGame,
  'multiple-choice': MultipleChoiceGame,
  'sentence-build': SentenceBuildGame,
  'listening-quiz': ListeningQuizGame,
  'calligraphy-trace': CalligraphyTraceGame,
  'spelling-bee': SpellingBeeGame,
  'story-puzzle': StoryPuzzleGame,
  'escape-room': EscapeRoomGame,
  'maze-runner': MazeRunnerGame,
  'daily-challenge': DailyChallengeGame,
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
