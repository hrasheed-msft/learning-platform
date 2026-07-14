import { BookOpen, Brain, Trophy, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useChildEnrollments } from '@/hooks/useChildEnrollments';
import { useProgramStore } from '@/stores/programStore';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { WeeklyActivityDay } from '@/types/program';

// ─── helpers ────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDayLabel(dateStr: string): string {
  try {
    return DAY_LABELS[new Date(dateStr).getDay()] ?? dateStr.slice(5);
  } catch {
    return dateStr.slice(5);
  }
}

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return dateStr === today;
}

// ─── sub-components ─────────────────────────────────────────────────────────

function WeeklyActivityChart({ days }: { days: WeeklyActivityDay[] }) {
  const maxUnits = Math.max(...days.map((d) => d.unitsCompleted), 1);

  return (
    <div className="flex items-end gap-1.5 h-16" aria-label="Weekly activity chart">
      {days.map((day) => {
        const heightPct = day.unitsCompleted === 0 ? 8 : Math.max(20, (day.unitsCompleted / maxUnits) * 100);
        const today = isToday(day.date);
        return (
          <div key={day.date} className="flex flex-col items-center gap-1 flex-1" title={`${day.date}: ${day.unitsCompleted} unit${day.unitsCompleted !== 1 ? 's' : ''}`}>
            <div
              className={`w-full rounded-t-lg transition-all duration-500 ${
                day.unitsCompleted === 0
                  ? 'bg-gray-100'
                  : today
                  ? 'bg-orange-400 ring-2 ring-orange-300'
                  : 'bg-[#1a5632]/70'
              }`}
              style={{ height: `${heightPct}%` }}
              aria-hidden="true"
            />
            <span className={`text-[10px] ${today ? 'font-bold text-orange-500' : 'text-gray-400'}`}>
              {getDayLabel(day.date)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function ChildDashboardHome() {
  const { member } = useChildAuthStore();
  const { enrollments, isLoading } = useChildEnrollments();
  const {
    enrollments: programEnrollments,
    stageSummary,
    fetchMemberEnrollments,
    fetchMemberStageSummary,
  } = useProgramStore();
  const activeEnrollments = enrollments.filter((enrollment) => enrollment.status !== 'COMPLETED');
  const recentEnrollments = activeEnrollments.slice(0, 3);

  useEffect(() => {
    if (member?.id) {
      void fetchMemberEnrollments(member.id);
      void fetchMemberStageSummary(member.id);
    }
  }, [member?.id, fetchMemberEnrollments, fetchMemberStageSummary]);

  const activeProgramEnrollment = programEnrollments.find((e) => e.status === 'ACTIVE');

  // New Phase 2 fields — all optional; degrade gracefully when absent
  const nextUp = stageSummary?.nextUp ?? null;
  const streak = stageSummary?.streak ?? null;
  const weeklyActivity = stageSummary?.weeklyActivity ?? null;

  // Navigate path for a nextUnit
  function nextUnitPath(courseId: string, unitId: string): string {
    return `/child/courses/${courseId}/learn?unit=${unitId}`;
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          Assalamu Alaikum, {member?.name}! 🌟
        </h1>
        <p className="text-gray-600 mt-1">Keep up the great work on your learning journey!</p>
      </div>

      {/* Enrollment CTA — shown when not yet enrolled in any Maktab program */}
      {!isLoading && !activeProgramEnrollment && (
        <div className="bg-gradient-to-br from-[#1a5632]/10 to-[#0d3320]/5 border border-[#1a5632]/20 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🕌</div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Start your Maktab journey!</h2>
          <p className="text-gray-500 text-sm mb-4">Your Islamic curriculum is waiting — ask your parent to enroll you.</p>
          <Link to="/programs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a5632] text-white font-bold rounded-xl hover:bg-[#154526] transition text-sm">
            ✨ Enroll in Maktab
          </Link>
        </div>
      )}

      {/* ── Continue / All-caught-up hero ───────────────────────────────── */}
      {activeProgramEnrollment && (
        nextUp ? (
          <div className="bg-gradient-to-br from-[#1a5632] to-[#0d3320] rounded-2xl p-6 text-white shadow-md">
            <p className="text-green-200 text-xs font-semibold uppercase tracking-wide mb-1">
              Continue where you left off
            </p>
            <h2 className="text-xl font-heading font-bold mb-0.5">{nextUp.unit.title}</h2>
            {/* subject name from subjectProgress if available */}
            {(() => {
              const sp = stageSummary?.subjectProgress?.find((s) => s.courseId === nextUp.courseId);
              return sp ? (
                <p className="text-green-200 text-sm mb-4">{sp.courseTitle}</p>
              ) : null;
            })()}
            <Link
              to={nextUnitPath(nextUp.courseId, nextUp.unit.id)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#1a5632] font-bold rounded-xl hover:bg-green-50 transition min-h-[44px]"
              aria-label={`Continue lesson: ${nextUp.unit.title}`}
            >
              Continue →
            </Link>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-heading font-bold text-amber-800 mb-1">You're all caught up!</h2>
            <p className="text-amber-700 text-sm mb-4">Amazing work — every lesson is done for now.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/child/games"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition min-h-[44px]"
              >
                🎮 Play Games
              </Link>
              <Link
                to="/child/flashcards"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-amber-700 border border-amber-300 font-semibold rounded-xl hover:bg-amber-50 transition min-h-[44px]"
              >
                🃏 Review Flashcards
              </Link>
            </div>
          </div>
        )
      )}

      {/* ── Streak + weekly activity ─────────────────────────────────────── */}
      {(streak || weeklyActivity) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Streak card */}
          {streak && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-orange-500" aria-hidden="true" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 leading-none">
                  {streak.current}
                  <span className="text-lg font-medium text-gray-500 ml-1">day{streak.current !== 1 ? 's' : ''}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Current streak</p>
                {streak.longest > 0 && (
                  <p className="text-xs text-gray-400 mt-1">Longest: {streak.longest} day{streak.longest !== 1 ? 's' : ''}</p>
                )}
                {streak.lastActivityAt && (
                  <p className="text-xs text-gray-400">
                    Last active {formatDistanceToNow(new Date(streak.lastActivityAt), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Weekly activity chart */}
          {weeklyActivity && weeklyActivity.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">This Week</p>
              <WeeklyActivityChart days={weeklyActivity} />
            </div>
          )}
        </div>
      )}

      {/* ── My Maktab mini-card (enrolled) ───────────────────────────────── */}
      {activeProgramEnrollment && (
        <Link
          to="/child/maktab"
          className="flex items-center gap-4 bg-gradient-to-r from-[#1a5632]/10 to-[#0d3320]/5 border border-[#1a5632]/20 rounded-xl px-5 py-4 hover:shadow-sm transition"
        >
          <div className="text-3xl shrink-0">🕌</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1a5632] uppercase tracking-wide">My Maktab</p>
            <p className="font-semibold text-gray-800 truncate">
              {activeProgramEnrollment.currentStage.name}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-[#1a5632]">
              {Math.round(activeProgramEnrollment.stageProgress?.overallProgress ?? 0)}%
            </p>
            <p className="text-xs text-gray-500">complete</p>
          </div>
        </Link>
      )}

      {/* ── Quick stats grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/child/courses"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-sm text-gray-500">My Courses</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{isLoading ? '…' : enrollments.length}</p>
        </Link>

        <Link
          to="/child/flashcards"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mb-3">
            <Brain className="w-5 h-5 text-accent-600" />
          </div>
          <p className="text-sm text-gray-500">Flashcards Due</p>
          <p className="text-xl font-bold text-gray-800 mt-1">—</p>
        </Link>

        <Link
          to="/child/achievements"
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5 text-secondary-600" />
          </div>
          <p className="text-sm text-gray-500">Achievements</p>
          <p className="text-xl font-bold text-gray-800 mt-1">—</p>
        </Link>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <Flame className="w-5 h-5 text-orange-600" aria-hidden="true" />
          </div>
          <p className="text-sm text-gray-500">My Streak</p>
          <p className="text-xl font-bold text-gray-800 mt-1 flex items-center">
            {streak?.current ?? 0} <Flame className="w-4 h-4 text-orange-500 ml-1" aria-hidden="true" />
          </p>
        </div>
      </div>

      {/* ── Continue Learning (individual courses) ───────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-heading font-semibold text-gray-800">Continue Learning</h2>
          <Link to="/child/courses" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            See all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <div key={card} className="rounded-xl border border-gray-100 p-4 animate-pulse">
                <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-full bg-gray-100 rounded mb-2" />
                <div className="h-2 w-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : recentEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentEnrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                to="/child/courses"
                className="rounded-xl border border-gray-100 p-4 hover:border-primary-200 hover:shadow-sm transition"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                  {enrollment.course?.category || 'Course'}
                </p>
                <h3 className="text-lg font-semibold text-gray-800 mt-1">{enrollment.course?.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{enrollment.course?.description}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{enrollment.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${Math.max(0, Math.min(100, enrollment.progress ?? 0))}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Your enrolled courses will appear here.</p>
            <p className="text-sm mt-2">Ask your parent to enroll you in a course to get started.</p>
          </div>
        )}
      </div>

      {/* ── My Maktab section ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-heading font-semibold text-gray-800">🕌 My Maktab</h2>          {activeProgramEnrollment && (
            <Link to="/child/maktab" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              Full dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {activeProgramEnrollment ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                  Stage {activeProgramEnrollment.currentStage.stageNumber}
                </p>
                <h3 className="text-lg font-semibold text-gray-800 mt-0.5">
                  {activeProgramEnrollment.currentStage.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Ages {activeProgramEnrollment.currentStage.ageMin}–{activeProgramEnrollment.currentStage.ageMax}
                  {' · '}
                  {activeProgramEnrollment.path === 'AFTER_SCHOOL' ? '🕘 After-School' : '📅 Weekend'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold text-primary-600">
                  {Math.round(activeProgramEnrollment.stageProgress?.overallProgress ?? 0)}%
                </p>
                <p className="text-xs text-gray-500">complete</p>
              </div>
            </div>

            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-700"
                style={{ width: `${Math.round(activeProgramEnrollment.stageProgress?.overallProgress ?? 0)}%` }}
              />
            </div>

            <Link
              to="/child/maktab"
              className="inline-flex w-full items-center justify-center gap-2 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition min-h-[44px]"
            >
              📚 Open My Grade Dashboard
            </Link>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🌙</div>
            <p className="text-gray-600 font-medium mb-4">
              Your Maktab journey hasn't started yet!
            </p>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a5632] text-white font-semibold rounded-xl hover:bg-[#154526] transition min-h-[44px]"
            >
              ✨ Start Your Maktab Journey
            </Link>
          </div>
        )}
      </div>

      {/* ── Du'ā & 99 Names quick-access ─────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-gray-800 mb-3">📿 Islamic Practice</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/child/duas"
            className="bg-gradient-to-br from-[#1a5632] to-[#0d3320] rounded-2xl p-5 text-white hover:opacity-90 transition shadow-sm min-h-[44px]"
          >
            <div className="text-3xl mb-2">🕋</div>
            <p className="font-bold text-sm leading-snug">My Du'ās</p>
            <p className="text-green-200 text-xs mt-0.5">Track your du'ā memorisation</p>
          </Link>

          <Link
            to="/child/99-names"
            className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white hover:opacity-90 transition shadow-sm min-h-[44px]"
          >
            <div className="text-3xl mb-2">✨</div>
            <p className="font-bold text-sm leading-snug">99 Names</p>
            <p className="text-amber-100 text-xs mt-0.5">Learn the Names of Allāh</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
