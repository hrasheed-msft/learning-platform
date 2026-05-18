import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft, BookOpen, Play, Sparkles, Zap, Flame, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useFamilyStore } from '@/stores/familyStore';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';
import { gameService } from '@/services/gameService';
import { SLUG_TO_TYPE } from '@/utils/gameHelpers';
import { GAME_META } from '@/types/game';
import type { GameDifficulty } from '@/types/game';

interface EligibleCourse {
  gameId: string;
  courseId?: string;
  courseName: string;
  contentCount: number;
  suggestedDifficulty: GameDifficulty;
}

const DIFFICULTIES: { value: GameDifficulty; label: string; desc: string; icon: React.FC<{ className?: string }>; color: string }[] = [
  { value: 'EASY',   label: 'Easy',   desc: 'No timer • Hints on • 4 options',  icon: Sparkles, color: 'from-emerald-400 to-green-500' },
  { value: 'MEDIUM', label: 'Medium', desc: 'Timed • Few hints • 4 options',     icon: Zap,      color: 'from-amber-400 to-orange-500' },
  { value: 'HARD',   label: 'Hard',   desc: 'Fast timer • No hints • Streak ×',  icon: Flame,    color: 'from-rose-500 to-red-600' },
];

export default function GameLauncher() {
  const navigate = useNavigate();
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const [searchParams] = useSearchParams();
  const { members, selectedMember, fetchMembers } = useFamilyStore();
  const { setLauncherSelection } = useGameStore();

  const [eligible, setEligible] = useState<EligibleCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<EligibleCourse | null>(null);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('MEDIUM');

  const activeMemberId = selectedMember?.id;
  const activeType = gameSlug ? SLUG_TO_TYPE[gameSlug] : undefined;
  const meta = activeType ? GAME_META[activeType] : null;
  const isDaily = searchParams.get('daily') === '1';

  useEffect(() => {
    if (members.length === 0) {
      const family = useAuthStore.getState().family;
      if (family?.id) fetchMembers(family.id);
    }
  }, [members.length, fetchMembers]);

  useEffect(() => {
    if (!gameSlug || !activeMemberId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    gameService
      .getEligibleCourses(gameSlug, activeMemberId)
      .then((courses) => {
        if (cancelled) return;
        setEligible(courses);
        if (courses.length > 0) {
          setSelectedCourse(courses[0]);
          setDifficulty(courses[0].suggestedDifficulty);
        }
      })
      .catch(() => {
        if (!cancelled) setEligible([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [gameSlug, activeMemberId]);

  const handleStart = () => {
    if (!selectedCourse || !gameSlug) return;
    setLauncherSelection({
      gameSlug,
      gameId: selectedCourse.gameId,
      courseId: selectedCourse.courseId,
      difficulty,
    });
    navigate(`/games/${gameSlug}/play?gameId=${selectedCourse.gameId}&difficulty=${difficulty}`);
  };

  if (!meta) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-gray-500">Unknown game.</p>
        <Button onClick={() => navigate('/games')} variant="primary" className="mt-4">
          Back to Hub
        </Button>
      </div>
    );
  }

  if (!activeMemberId) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <p className="text-lg font-semibold text-gray-700 mb-2">No learner selected</p>
        <p className="text-gray-500 mb-4">Pick who's playing to start a game.</p>
        <Button onClick={() => navigate('/select-learner')} variant="primary">
          Select a Learner
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <button
        onClick={() => navigate('/games')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Games Hub
      </button>

      <Card padding="none" className="overflow-hidden">
        <div className={clsx('h-2.5', meta.color)} />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-2">
            <span className="text-5xl">{meta.emoji}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{meta.name}</h1>
              <p className="text-gray-500 mt-1">{meta.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {meta.whatItTests && <Badge variant="secondary" size="sm">Tests: {meta.whatItTests}</Badge>}
                {meta.restriction && <Badge variant="accent" size="sm">{meta.restriction}</Badge>}
                {isDaily && <Badge variant="primary" size="sm">Daily Challenge</Badge>}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Course Picker */}
      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" /> Choose a Course
        </h2>
        <p className="text-sm text-gray-500 mb-4">Pick which course to draw questions from.</p>

        {loading ? (
          <div className="py-8 flex items-center justify-center text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading eligible courses…
          </div>
        ) : eligible.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No eligible courses found for <strong>{meta.name}</strong>.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {meta.restriction
                ? `This game requires a ${meta.restriction.toLowerCase()} course.`
                : 'Enroll in a course to unlock games.'}
            </p>
            <Button onClick={() => navigate('/courses')} variant="primary" className="mt-4">
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {eligible.map((c) => {
              const isSelected = selectedCourse?.gameId === c.gameId;
              return (
                <button
                  key={c.gameId}
                  onClick={() => { setSelectedCourse(c); setDifficulty(c.suggestedDifficulty); }}
                  className={clsx(
                    'text-left p-4 rounded-xl border-2 transition-all',
                    isSelected
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-gray-200 hover:border-primary-300 bg-white',
                  )}
                >
                  <p className="font-semibold text-gray-900 truncate">{c.courseName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {c.contentCount > 0 ? `${c.contentCount} items available` : 'Auto-selected content'}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Difficulty Picker */}
      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Choose Difficulty</h2>
        <p className="text-sm text-gray-500 mb-4">You can change this any time.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DIFFICULTIES.map((d) => {
            const Icon = d.icon;
            const isSelected = difficulty === d.value;
            return (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={clsx(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-transparent text-white shadow-lg scale-[1.02] bg-gradient-to-br ' + d.color
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800',
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-5 h-5" />
                  <span className="font-bold">{d.label}</span>
                </div>
                <p className={clsx('text-xs', isSelected ? 'text-white/90' : 'text-gray-500')}>{d.desc}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Action row */}
      <div className="flex items-center justify-between gap-3 sticky bottom-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
        <Button onClick={() => navigate('/games')} variant="ghost">
          Cancel
        </Button>
        <Button
          onClick={handleStart}
          disabled={!selectedCourse}
          variant="primary"
          size="lg"
          rightIcon={<Play className="w-4 h-4" />}
        >
          Start Playing
        </Button>
      </div>
    </div>
  );
}
