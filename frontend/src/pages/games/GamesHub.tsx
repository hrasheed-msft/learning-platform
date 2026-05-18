import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Flame, Trophy, Filter, Gamepad2,
  ChevronRight, Sparkles, TrendingUp, Medal,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { DifficultySelector } from '@/components/games/DifficultySelector';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { useAuthStore } from '@/stores/authStore';
import { GAME_META } from '@/types/game';
import type { GameDifficulty, GameCategory, Game } from '@/types/game';

type CategoryFilter = 'ALL' | GameCategory;

export default function GamesHub() {
  const navigate = useNavigate();
  const { members, selectedMember, fetchMembers } = useFamilyStore();
  const {
    availableGames, dailyChallenge, isLoadingGames, streakInfo,
    achievements, leaderboardEntries,
    fetchAvailableGames, fetchStreak, fetchAchievements, fetchLeaderboard,
  } = useGameStore();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [selectedDifficulties, setSelectedDifficulties] = useState<Record<string, GameDifficulty>>({});

  const activeMemberId = selectedMember?.id || members[0]?.id;

  // Ensure family members are loaded
  useEffect(() => {
    if (members.length === 0) {
      const family = useAuthStore.getState().family;
      if (family?.id) fetchMembers(family.id);
    }
  }, [members.length, fetchMembers]);

  useEffect(() => {
    if (activeMemberId) {
      fetchAvailableGames({ memberId: activeMemberId });
      fetchStreak(activeMemberId);
      fetchAchievements(activeMemberId);
      fetchLeaderboard({ scope: 'FAMILY', period: 'WEEKLY', memberId: activeMemberId, limit: 5 });
    }
  }, [activeMemberId]);

  const filteredGames = availableGames.filter((g) =>
    categoryFilter === 'ALL' || g.template.category === categoryFilter
  );

  const handlePlayGame = (game: Game) => {
    const difficulty = selectedDifficulties[game.id] || game.suggestedDifficulty || 'MEDIUM';
    const gameTypeSlug = game.template.type.toLowerCase().replace(/_/g, '-');
    navigate(`/games/play/${gameTypeSlug}?gameId=${game.id}&difficulty=${difficulty}`);
  };

  const getDifficultyForGame = (game: Game): GameDifficulty => {
    return selectedDifficulties[game.id] || game.suggestedDifficulty || 'MEDIUM';
  };

  if (isLoadingGames && availableGames.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-primary-500" />
            Games Hub
          </h1>
          <p className="text-gray-500 mt-1">Learn through play — earn points, badges, and keep your streak alive!</p>
        </div>
        {streakInfo && streakInfo.currentStreak > 0 && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <p className="font-bold text-orange-700">{streakInfo.currentStreak} day streak!</p>
              <p className="text-xs text-orange-600">
                {streakInfo.daysToNextMilestone > 0
                  ? `${streakInfo.daysToNextMilestone} days to next milestone`
                  : 'Keep it up!'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Daily Challenge Banner */}
      {dailyChallenge && (
        <Card className="bg-gradient-to-r from-primary-500 to-primary-700 text-white border-0" padding="lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-yellow-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Daily Challenge</h2>
                <p className="text-white/80 text-sm">
                  {dailyChallenge.attempted
                    ? '✅ Completed today!'
                    : `${dailyChallenge.questionCount} questions from your courses`}
                </p>
                {dailyChallenge.streak && (
                  <p className="text-white/60 text-xs mt-1">
                    🔥 {dailyChallenge.streak.currentStreak} day streak
                  </p>
                )}
              </div>
            </div>
            {!dailyChallenge.attempted && (
              <Button
                onClick={() => navigate('/games/play/daily-challenge')}
                className="bg-white text-primary-700 hover:bg-white/90 border-0"
                size="lg"
              >
                Play Now
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        {[
          { key: 'ALL' as CategoryFilter, label: 'All Games' },
          { key: 'COURSE_INTEGRATED' as CategoryFilter, label: 'Course Games' },
          { key: 'STANDALONE' as CategoryFilter, label: 'Standalone' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategoryFilter(tab.key)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              categoryFilter === tab.key
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, index) => {
          const meta = GAME_META[game.template.type];
          return (
            <Card key={`${game.id}-${game.template.type}-${index}`} hover padding="none" className="overflow-hidden">
              {/* Color header */}
              <div className={clsx('h-2', meta?.color || 'bg-primary-500')} />
              <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{meta?.emoji || '🎮'}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{game.template.name}</h3>
                      {game.courseName && (
                        <p className="text-xs font-medium text-primary-600 mt-0.5">{game.courseName}</p>
                      )}
                      <p className="text-xs text-gray-500">{game.template.description}</p>
                    </div>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant={game.template.category === 'COURSE_INTEGRATED' ? 'primary' : 'accent'} size="sm">
                    {game.template.category === 'COURSE_INTEGRATED' ? 'Course' : 'Standalone'}
                  </Badge>
                  {game.bestScore !== undefined && (
                    <Badge variant="secondary" size="sm">
                      Best: {game.bestScore.toLocaleString()}
                    </Badge>
                  )}
                  {game.contentCount > 0 && (
                    <Badge variant="gray" size="sm">
                      {game.contentCount} items
                    </Badge>
                  )}
                </div>

                {/* Difficulty */}
                <div className="mb-4">
                  <DifficultySelector
                    selected={getDifficultyForGame(game)}
                    onChange={(d) => setSelectedDifficulties((prev) => ({ ...prev, [game.id]: d }))}
                  />
                </div>

                {/* Last played */}
                {game.lastPlayed && (
                  <p className="text-xs text-gray-400 mb-3">
                    Last played: {new Date(game.lastPlayed).toLocaleDateString()}
                  </p>
                )}

                {/* Play button */}
                <Button
                  onClick={() => handlePlayGame(game)}
                  variant="primary"
                  fullWidth
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Play
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredGames.length === 0 && !isLoadingGames && (
        <div className="text-center py-16">
          <Gamepad2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No games available yet. Enroll in a course to unlock games!</p>
        </div>
      )}

      {/* Bottom sections: Leaderboard + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard Preview */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Family Leaderboard
            </h3>
            <Link to="/games/leaderboard" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {leaderboardEntries.length > 0 ? (
            <div className="space-y-3">
              {leaderboardEntries.slice(0, 5).map((entry) => (
                <div key={entry.member.id} className="flex items-center gap-3">
                  <span className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold',
                    entry.rank === 1 ? 'bg-yellow-100 text-yellow-700'
                      : entry.rank === 2 ? 'bg-gray-100 text-gray-600'
                      : entry.rank === 3 ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-50 text-gray-500'
                  )}>
                    {entry.rank}
                  </span>
                  <span className="flex-1 font-medium text-gray-800">{entry.member.name}</span>
                  <span className="font-bold text-primary-600">{entry.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Play games to appear on the leaderboard!</p>
          )}
        </Card>

        {/* Achievement Showcase */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Recent Achievements
            </h3>
            <Link to="/games/achievements" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
                  <Medal className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-500 truncate">{a.description}</p>
                  </div>
                  <span className="text-xs font-bold text-primary-600">+{a.xpReward} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Play games to unlock achievements!</p>
          )}
        </Card>
      </div>
    </div>
  );
}
