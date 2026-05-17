import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { RotateCcw, Home, Zap, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StarRating } from './StarRating';
import type { GameCompletionResult } from '@/types/game';

interface GameOverScreenProps {
  result: GameCompletionResult;
  onPlayAgain?: () => void;
  className?: string;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  result,
  onPlayAgain,
  className = '',
}) => {
  const navigate = useNavigate();
  const { session, gameScore, achievements, streakUpdate } = result;

  const accuracy = Math.round(session.accuracy * 100);
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
  const timeSeconds = Math.round(session.timeSpentMs / 1000);
  const minutes = Math.floor(timeSeconds / 60);
  const secs = timeSeconds % 60;

  return (
    <div className={clsx('max-w-lg mx-auto text-center py-8', className)}>
      {/* Stars */}
      <div className="flex justify-center mb-4">
        <StarRating stars={stars} size="lg" />
      </div>

      {/* Score */}
      <h2 className="text-4xl font-bold text-gray-900 mb-1">
        {gameScore.totalScore.toLocaleString()}
      </h2>
      <p className="text-gray-500 mb-6">points earned</p>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-3">
          <Target className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-700">{accuracy}%</p>
          <p className="text-xs text-green-600">Accuracy</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3">
          <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-amber-700">{session.streakBest}</p>
          <p className="text-xs text-amber-600">Best Streak</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-700">{minutes}:{secs.toString().padStart(2, '0')}</p>
          <p className="text-xs text-blue-600">Time</p>
        </div>
      </div>

      {/* XP Earned */}
      {gameScore.xpEarned > 0 && (
        <div className="bg-primary-50 rounded-xl p-3 mb-4 inline-flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary-600" />
          <span className="font-bold text-primary-700">+{gameScore.xpEarned} XP</span>
        </div>
      )}

      {/* Bonuses */}
      {gameScore.bonuses && Object.keys(gameScore.bonuses).length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Bonuses</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(gameScore.bonuses).map(([key, value]) => (
              <span key={key} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                {key}: +{value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">🏆 Achievements Unlocked!</p>
          {achievements.map((a) => (
            <div key={a.id} className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-3 mb-2">
              <p className="font-bold text-amber-800">{a.name}</p>
              <p className="text-xs text-amber-600">{a.description} · +{a.xpReward} XP</p>
            </div>
          ))}
        </div>
      )}

      {/* Streak Update */}
      {streakUpdate && streakUpdate.currentStreak > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            🔥 {streakUpdate.currentStreak} day streak
            {streakUpdate.currentStreak === streakUpdate.longestStreak && ' — new record!'}
          </p>
        </div>
      )}

      {/* SRS Summary */}
      {result.srsUpdates && result.srsUpdates.length > 0 && (
        <p className="text-xs text-gray-500 mb-6">
          📚 {result.srsUpdates.length} cards updated for spaced repetition
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        {onPlayAgain && (
          <Button onClick={onPlayAgain} variant="primary" leftIcon={<RotateCcw className="w-4 h-4" />}>
            Play Again
          </Button>
        )}
        <Button onClick={() => navigate('/games')} variant="outline" leftIcon={<Home className="w-4 h-4" />}>
          Back to Hub
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;
