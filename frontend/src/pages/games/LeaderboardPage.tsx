import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { TrendingUp, Target, Gamepad2 } from 'lucide-react';
import type { LeaderboardPeriod } from '@/types/game';

const PERIODS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'DAILY', label: 'Today' },
  { key: 'WEEKLY', label: 'This Week' },
  { key: 'MONTHLY', label: 'This Month' },
  { key: 'ALL_TIME', label: 'All Time' },
];

export default function LeaderboardPage() {
  const { selectedMember } = useFamilyStore();
  const { leaderboardEntries, myRank, isLoading, fetchLeaderboard } = useGameStore();
  const [period, setPeriod] = useState<LeaderboardPeriod>('WEEKLY');

  const memberId = selectedMember?.id;

  useEffect(() => {
    if (memberId) {
      fetchLeaderboard({ scope: 'FAMILY', period, memberId, limit: 20 });
    }
  }, [memberId, period]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-7 h-7 text-primary-500" />
        <h1 className="text-2xl font-bold text-gray-900">Family Leaderboard</h1>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              period === p.key ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : leaderboardEntries.length === 0 ? (
        <div className="text-center py-16">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No scores yet for this period. Play some games!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboardEntries.map((entry) => {
            const isMe = entry.member.id === memberId;
            const rankIcon = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
            return (
              <Card
                key={entry.rank}
                padding="sm"
                className={clsx(isMe && 'ring-2 ring-primary-300 bg-primary-50')}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold',
                    entry.rank === 1 && 'bg-yellow-100 text-yellow-700',
                    entry.rank === 2 && 'bg-gray-200 text-gray-700',
                    entry.rank === 3 && 'bg-amber-100 text-amber-700',
                    entry.rank > 3 && 'bg-gray-100 text-gray-500'
                  )}>
                    {rankIcon || entry.rank}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <p className={clsx('font-medium', isMe ? 'text-primary-700' : 'text-gray-900')}>
                      {entry.member.name} {isMe && '(You)'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="w-3 h-3" /> {entry.gamesPlayed} games
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" /> {Math.round(entry.accuracy * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">{entry.score.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {myRank > 0 && myRank > leaderboardEntries.length && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Your rank: #{myRank}
        </div>
      )}
    </div>
  );
}
