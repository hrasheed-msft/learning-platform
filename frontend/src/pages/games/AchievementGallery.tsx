import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Spinner } from '@/components/ui/Spinner';
import { Trophy, Medal, Star, Zap, Award } from 'lucide-react';

const TIER_COLORS: Record<string, string> = {
  BRONZE: 'bg-amber-100 text-amber-800',
  SILVER: 'bg-gray-200 text-gray-700',
  GOLD: 'bg-yellow-100 text-yellow-800',
  PLATINUM: 'bg-purple-100 text-purple-800',
};

export default function AchievementGallery() {
  const { selectedMember } = useFamilyStore();
  const { achievements, totalXp, earnedBadges, availableBadges, isLoading, fetchAchievements, fetchBadges } = useGameStore();

  const memberId = selectedMember?.id;

  useEffect(() => {
    if (memberId) {
      fetchAchievements(memberId);
      fetchBadges(memberId);
    }
  }, [memberId]);

  if (isLoading && achievements.length === 0) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-900">Achievements & Badges</h1>
        </div>
        {totalXp > 0 && (
          <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-xl">
            <Zap className="w-5 h-5 text-primary-600" />
            <span className="font-bold text-primary-700">{totalXp.toLocaleString()} XP</span>
          </div>
        )}
      </div>

      {/* Earned Badges */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-primary-500" />
          Earned Badges ({earnedBadges.length})
        </h2>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((ub, i) => (
              <Card key={i} padding="sm" className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${TIER_COLORS[ub.badge.tier] || 'bg-gray-100'}`}>
                  <Award className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-gray-900">{ub.badge.name}</p>
                <Badge variant="gray" size="sm" className="mt-1">{ub.badge.tier}</Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(ub.earnedAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No badges earned yet. Keep playing!</p>
        )}
      </section>

      {/* Badge Progress */}
      {availableBadges.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            In Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableBadges.map((bp, i) => (
              <Card key={i} padding="sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${TIER_COLORS[bp.badge.tier] || 'bg-gray-100'} opacity-50`}>
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{bp.badge.name}</p>
                    <ProgressBar
                      value={bp.progress.current}
                      max={bp.progress.target}
                      size="sm"
                      color="primary"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {bp.progress.current} / {bp.progress.target}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Achievements ({achievements.length})
        </h2>
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.map((a) => (
              <Card key={a.id} padding="sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="primary" size="sm">+{a.xpReward} XP</Badge>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(a.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No achievements unlocked yet. Play games to earn your first!</p>
          </div>
        )}
      </section>
    </div>
  );
}
