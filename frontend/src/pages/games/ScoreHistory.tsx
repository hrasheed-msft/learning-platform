import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useFamilyStore } from '@/stores/familyStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { History, Target, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { GAME_META } from '@/types/game';
import type { GameType } from '@/types/game';

export default function ScoreHistory() {
  const { selectedMember } = useFamilyStore();
  const { scoreHistory, scorePagination, isLoading, fetchScoreHistory } = useGameStore();
  const [page, setPage] = useState(1);

  const memberId = selectedMember?.id;

  useEffect(() => {
    if (memberId) {
      fetchScoreHistory({ memberId, page, limit: 20 });
    }
  }, [memberId, page]);

  if (isLoading && scoreHistory.length === 0) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-primary-500" />
        <h1 className="text-2xl font-bold text-gray-900">Score History</h1>
      </div>

      {scoreHistory.length === 0 ? (
        <div className="text-center py-16">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No games played yet. Start playing to see your scores here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scoreHistory.map((score) => {
            const meta = score.game?.type ? GAME_META[score.game.type as GameType] : null;
            const date = new Date(score.createdAt);
            const accuracy = Math.round(score.accuracy * 100);
            return (
              <Card key={score.id} hover padding="sm">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{meta?.emoji || '🎮'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{score.game?.name || 'Game'}</p>
                    <p className="text-xs text-gray-500">
                      {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{score.totalScore.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">pts</p>
                    </div>
                    <Badge variant={accuracy >= 80 ? 'success' : accuracy >= 60 ? 'warning' : 'danger'}>
                      <Target className="w-3 h-3 mr-1" />
                      {accuracy}%
                    </Badge>
                    {score.xpEarned > 0 && (
                      <Badge variant="primary">
                        <Zap className="w-3 h-3 mr-1" />
                        +{score.xpEarned}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {scorePagination.total > scorePagination.limit && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm text-gray-500">
            Page {page} of {Math.ceil(scorePagination.total / scorePagination.limit)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= Math.ceil(scorePagination.total / scorePagination.limit)}
            onClick={() => setPage((p) => p + 1)}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
