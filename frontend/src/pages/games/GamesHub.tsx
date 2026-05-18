import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Flame, Trophy, Sparkles, ChevronRight, Gamepad2, TrendingUp, Medal, Lock,
  Brain, BookOpen, Layers, Edit3, Search, ListOrdered, Type, Brush, Scale,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { useAuthStore } from '@/stores/authStore';
import { GAME_META } from '@/types/game';
import { ACTIVE_GAME_TYPES, TYPE_TO_SLUG, mapToActiveType } from '@/utils/gameHelpers';
import type { ActiveGameType } from '@/types/game';

// Lucide icons per active mechanic (more polished than emoji-only)
const ICONS: Record<ActiveGameType, React.FC<{ className?: string }>> = {
  QUICK_RECALL: Brain,
  PAIR_MATCH: Layers,
  FLASHCARD_SPRINT: BookOpen,
  CLOZE: Edit3,
  WORD_SEARCH: Search,
  SEQUENCE_IT: ListOrdered,
  WORD_SCRAMBLE: Type,
  CALLIGRAPHY_TRACE: Brush,
  FIQH_SCENARIO: Scale,
};

interface AggregatedStats {
  bestScore?: number;
  lastPlayed?: string;
  contentCount: number;
  available: boolean;
}

export default function GamesHub() {
  const navigate = useNavigate();
  const { members, selectedMember, fetchMembers } = useFamilyStore();
  const {
    availableGames, dailyChallenge, isLoadingGames, streakInfo,
    achievements, leaderboardEntries,
    fetchAvailableGames, fetchStreak, fetchAchievements, fetchLeaderboard,
    clearLauncherSelection,
  } = useGameStore();

  const activeMemberId = selectedMember?.id;

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

  // Aggregate stats per active mechanic across all underlying Game records
  const statsByType = useMemo<Record<ActiveGameType, AggregatedStats>>(() => {
    const empty: AggregatedStats = { contentCount: 0, available: false };
    const map: Record<ActiveGameType, AggregatedStats> = {
      QUICK_RECALL: { ...empty }, PAIR_MATCH: { ...empty }, FLASHCARD_SPRINT: { ...empty },
      CLOZE: { ...empty }, WORD_SEARCH: { ...empty }, SEQUENCE_IT: { ...empty },
      WORD_SCRAMBLE: { ...empty }, CALLIGRAPHY_TRACE: { ...empty }, FIQH_SCENARIO: { ...empty },
    };
    for (const g of availableGames) {
      const t = mapToActiveType(g.template.type);
      const slot = map[t];
      slot.available = true;
      slot.contentCount += g.contentCount || 0;
      if (g.bestScore !== undefined && (slot.bestScore === undefined || g.bestScore > slot.bestScore)) {
        slot.bestScore = g.bestScore;
      }
      if (g.lastPlayed && (!slot.lastPlayed || new Date(g.lastPlayed) > new Date(slot.lastPlayed))) {
        slot.lastPlayed = g.lastPlayed;
      }
    }
    return map;
  }, [availableGames]);

  const handlePickGame = (type: ActiveGameType) => {
    clearLauncherSelection();
    navigate(`/games/${TYPE_TO_SLUG[type]}/launch`);
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
          <p className="text-gray-500 mt-1">Nine games. One way to learn — through play.</p>
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

      {/* Daily Challenge — Hero card */}
      {dailyChallenge && (
        <Card className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white border-0 overflow-hidden relative" padding="lg">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-1">Featured Today</p>
                <h2 className="text-2xl font-bold">Daily Challenge</h2>
                <p className="text-white/80 text-sm">
                  {dailyChallenge.attempted
                    ? '✅ Completed today — masha\'Allah!'
                    : `${dailyChallenge.questionCount} hand-picked questions from your courses`}
                </p>
              </div>
            </div>
            {!dailyChallenge.attempted && (
              <Button
                onClick={() => navigate('/games/quick-recall/launch?daily=1')}
                className="bg-white text-primary-700 hover:bg-white/90 border-0 shadow-lg"
                size="lg"
              >
                Play Now <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* 9 Game Cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          Choose Your Game
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACTIVE_GAME_TYPES.map((type) => {
            const meta = GAME_META[type];
            const stats = statsByType[type];
            const Icon = ICONS[type];
            const locked = !stats.available;

            return (
              <Card
                key={type}
                padding="none"
                className={clsx(
                  'overflow-hidden transition-all duration-200 group',
                  locked ? 'opacity-60' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer',
                )}
                hover={!locked}
              >
                <button
                  onClick={() => !locked && handlePickGame(type)}
                  disabled={locked}
                  className="w-full text-left"
                >
                  {/* Color band */}
                  <div className={clsx('h-2', meta.color)} />
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={clsx(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        meta.color, 'bg-opacity-15 text-white',
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 leading-tight">{meta.name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5 leading-snug">{meta.description}</p>
                      </div>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap gap-1.5 mb-3 min-h-[26px]">
                      {meta.whatItTests && (
                        <Badge variant="secondary" size="sm">{meta.whatItTests}</Badge>
                      )}
                      {meta.restriction && (
                        <Badge variant="accent" size="sm">
                          <Lock className="w-3 h-3 mr-1 inline" />
                          {meta.restriction}
                        </Badge>
                      )}
                      {!locked && stats.contentCount > 0 && (
                        <Badge variant="gray" size="sm">{stats.contentCount} items</Badge>
                      )}
                    </div>

                    {/* Personal stats footer */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="text-gray-500">
                        {stats.bestScore !== undefined ? (
                          <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            Best <span className="font-bold text-gray-700">{stats.bestScore.toLocaleString()}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400">Not played yet</span>
                        )}
                      </div>
                      <div className="text-gray-400">
                        {stats.lastPlayed
                          ? new Date(stats.lastPlayed).toLocaleDateString()
                          : locked ? 'Unavailable' : 'Ready to play'}
                      </div>
                    </div>

                    {!locked && (
                      <div className="mt-3 flex items-center justify-end text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform">
                        Set up <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bottom: Leaderboard + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              {leaderboardEntries.slice(0, 5).map((entry, idx) => (
                <div key={entry.member?.id || `lb-${entry.rank}-${idx}`} className="flex items-center gap-3">
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
              {achievements.slice(0, 3).map((a, idx) => (
                <div key={a.id || `ach-${a.type || 'unknown'}-${idx}`} className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
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
