import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProgramStore } from '@/stores/programStore';
import { useChildAuthStore } from '@/stores/childAuthStore';
import type { SubjectProgress } from '@/types/program';

const SUBJECT_EMOJI: Record<string, string> = {
  QURAN: '📗',
  DUA: '🕋',
  NAMES: '✨',
  FIQH: '🕌',
  HADITH: '📜',
  SEERAH: '🌙',
  TARIKH: '📖',
  AQEEDAH: '☪️',
  AKHLAQ: '🌸',
  ADAB: '🤲',
};

function getSubjectEmoji(category: string): string {
  const key = category.toUpperCase().replace(/[^A-Z]/g, '');
  return SUBJECT_EMOJI[key] ?? '📚';
}

function ProgressRing({ percent, size = 120 }: { percent: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={8}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a5632"
          strokeWidth={8}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-[#1a5632]">{Math.round(percent)}%</p>
        <p className="text-xs text-gray-500">done</p>
      </div>
    </div>
  );
}

function SubjectCard({ subject, onClick }: { subject: SubjectProgress; onClick?: () => void }) {
  const emoji = getSubjectEmoji(subject.category);
  const pct = Math.round(subject.progress);

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition text-left w-full min-h-[44px] group"
      aria-label={`${subject.courseTitle}: ${pct}% complete`}
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-bold text-gray-800 group-hover:text-[#1a5632] transition text-sm leading-snug mb-3">
        {subject.courseTitle}
      </h3>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{subject.completedUnits} of {subject.totalUnits} units</span>
          <span className="font-semibold text-[#1a5632]">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#1a5632] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {pct === 100 && (
        <div className="mt-2 text-xs font-semibold text-green-700 flex items-center gap-1">
          ✅ Complete!
        </div>
      )}
    </button>
  );
}

const PATH_LABELS: Record<string, string> = {
  AFTER_SCHOOL: '🕘 After-School',
  WEEKEND: '📅 Weekend',
};

export default function GradeDashboard() {
  const { member } = useChildAuthStore();
  const {
    enrollments,
    stageSummary,
    isLoading,
    error,
    fetchMemberEnrollments,
    fetchMemberStageSummary,
  } = useProgramStore();

  useEffect(() => {
    if (!member?.id) return;
    void fetchMemberEnrollments(member.id);
    void fetchMemberStageSummary(member.id);
  }, [member?.id, fetchMemberEnrollments, fetchMemberStageSummary]);

  const activeEnrollment = enrollments.find((e) => e.status === 'ACTIVE');

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-36 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Not enrolled
  if (!activeEnrollment) {
    return (
      <div className="space-y-6 animate-in">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-800">My Maktab 🕌</h1>
          <p className="text-gray-600 mt-1">Your Islamic learning journey starts here.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <div className="text-5xl mb-4">🌙</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">You haven't started yet!</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Ask your parent to enroll you in the Maktab curriculum so you can begin your journey.
          </p>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a5632] text-white font-bold rounded-xl hover:bg-[#154526] transition min-h-[44px]"
          >
            ✨ Start Your Maktab Journey
          </Link>
        </div>
      </div>
    );
  }

  const { currentStage, path } = activeEnrollment;
  const summary = stageSummary ?? activeEnrollment.stageProgress;
  const overallPct = Math.round(summary?.overallProgress ?? 0);
  const isStageComplete = overallPct === 100;

  return (
    <div className="space-y-8 animate-in">
      {/* Inline error banner — shown when stage-summary or enrollments fetch fails */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-sm text-red-700">
          <span>⚠️</span>
          <span>{error} — Some progress data may be unavailable.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a5632] to-[#0d3320] rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                Stage {currentStage.stageNumber}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                {PATH_LABELS[path] ?? path}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1">
              {currentStage.name}
            </h1>
            <p className="text-green-100 text-sm">
              Ages {currentStage.ageMin}–{currentStage.ageMax}
              {currentStage.description ? ` · ${currentStage.description}` : ''}
            </p>
          </div>
          <ProgressRing percent={overallPct} size={120} />
        </div>

        {/* Progress summary bar */}
        {summary && (
          <div className="mt-4 bg-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm text-green-100 mb-2">
              <span>
                {summary.completedCourses} of {summary.totalCourses} subjects complete
              </span>
              <span className="font-bold text-white">{overallPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stage complete celebration */}
      {isStageComplete && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-center text-white shadow-lg">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold mb-2">Masha'Allah! Stage Complete!</h2>
          <p className="text-yellow-100 mb-4">
            You've finished every subject in this stage. You're ready for the next level!
          </p>
          <button className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-yellow-50 transition min-h-[44px]">
            🚀 Ready for Next Stage!
          </button>
        </div>
      )}

      {/* Encouraging message */}
      {!isStageComplete && overallPct > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">🌟</span>
          <p className="text-amber-800 font-medium">
            {overallPct < 30
              ? 'Great start! Keep going, you\'re building something beautiful!'
              : overallPct < 60
              ? 'Amazing progress! You\'re more than halfway there!'
              : 'So close! Just a little more — you\'ve got this!'}
          </p>
        </div>
      )}

      {/* Subject grid */}
      <div>
        <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4">
          Your Subjects
        </h2>

        {summary?.subjectProgress && summary.subjectProgress.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {summary.subjectProgress.map((subject) => (
              <SubjectCard
                key={subject.courseId}
                subject={subject}
                onClick={() => {
                const cat = subject.category.toUpperCase();
                if (cat === 'DUA') {
                  window.location.href = '/child/duas';
                } else if (cat === 'NAMES' || cat === '99NAMES') {
                  window.location.href = '/child/99-names';
                } else {
                  window.location.href = `/child/courses/${subject.courseId}/learn`;
                }
              }}
            />
            ))}
          </div>
        ) : (currentStage?.courses ?? []).length > 0 ? (
          // Placeholder cards when progress data isn't loaded yet but stage has course list
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(currentStage.courses ?? []).map((course) => (
              <SubjectCard
                key={course.id}
                subject={{
                  courseId: course.id,
                  courseTitle: course.title,
                  category: course.category,
                  progress: course.progress ?? 0,
                  totalUnits: 0,
                  completedUnits: 0,
                }}
                onClick={() => {
                  const cat = course.category.toUpperCase();
                  if (cat === 'DUA') {
                    window.location.href = '/child/duas';
                  } else if (cat === 'NAMES' || cat === '99NAMES') {
                    window.location.href = '/child/99-names';
                  } else {
                    window.location.href = `/child/courses/${course.id}/learn`;
                  }
                }}
              />
            ))}
          </div>
        ) : (
          // No course data available — stage-summary failed and enrollment has no courses array
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-3">🕌</div>
            <h3 className="font-semibold text-gray-700 mb-2">Your Maktab journey is being prepared</h3>
            <p className="text-gray-500 text-sm">
              No lessons available yet. Check back soon, or ask your parent for help.
            </p>
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="text-center text-sm text-gray-500">
        <Link to="/child/courses" className="text-[#1a5632] hover:text-green-800 font-medium">
          View all my courses →
        </Link>
      </div>
    </div>
  );
}
