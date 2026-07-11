import { useEffect, useMemo } from 'react';
import { BookOpen, CheckCircle2, Clock3, PlayCircle, RefreshCw, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChildEnrollments } from '@/hooks/useChildEnrollments';
import { useProgramStore } from '@/stores/programStore';
import type { CourseEnrollment } from '@/types';

function getLearnerState(memberId: string | undefined, enrollment: CourseEnrollment) {
  return {
    memberId,
    enrollmentId: enrollment.id,
    enrollment,
  };
}

function MaktabBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
      <GraduationCap className="w-3 h-3" />
      Maktab
    </span>
  );
}

export default function ChildCoursesPage() {
  const { member, enrollments, isLoading, error, reload } = useChildEnrollments();
  const { enrollments: programEnrollments, fetchMemberEnrollments } = useProgramStore();

  useEffect(() => {
    if (member?.id) void fetchMemberEnrollments(member.id);
  }, [member?.id, fetchMemberEnrollments]);

  // Build a set of courseIds that belong to a Maktab program stage
  const maktabCourseIds = useMemo(() => {
    const ids = new Set<string>();
    programEnrollments.forEach((pe) => {
      (pe.currentStage?.courses ?? []).forEach((c) => ids.add(c.id));
    });
    return ids;
  }, [programEnrollments]);

  const activeEnrollments = enrollments.filter((e) => e.status !== 'COMPLETED');
  const completedEnrollments = enrollments.filter((e) => e.status === 'COMPLETED');

  const isMaktab = (enrollment: CourseEnrollment) => {
    const id = enrollment.course?.id ?? enrollment.courseId;
    return maktabCourseIds.has(id);
  };

  const maktabActive = activeEnrollments.filter(isMaktab);
  const individualActive = activeEnrollments.filter((e) => !isMaktab(e));
  const hasMaktab = programEnrollments.some((pe) => pe.status === 'ACTIVE');

  const renderCourseCard = (enrollment: CourseEnrollment, showMaktabBadge = false) => {
    const progress = Math.max(0, Math.min(100, enrollment.progress ?? 0));
    const courseId = enrollment.course?.id ?? enrollment.courseId;
    const isCompleted = enrollment.status === 'COMPLETED';

    return (
      <div key={enrollment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className={`text-xs font-semibold uppercase tracking-wide ${isCompleted ? 'text-green-600' : 'text-primary-600'}`}>
                {enrollment.course?.category || 'Course'}
              </p>
              {showMaktabBadge && <MaktabBadge />}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{enrollment.course?.title}</h3>
          </div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              <Clock3 className="w-3 h-3" />
              {progress}% complete
            </span>
          )}
        </div>
        {!isCompleted && <p className="text-sm text-gray-600">{enrollment.course?.description}</p>}
        <div className="space-y-3">
          {!isCompleted && (
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${progress}%` }} />
            </div>
          )}
          <Link
            to={`/child/courses/${courseId}/learn`}
            state={getLearnerState(member?.id, enrollment)}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isCompleted
                ? 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            {isCompleted ? 'Review Course' : progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-600 mt-1">See every course you have been enrolled in.</p>
      </div>

      {error ? (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => void reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3].map((card) => (
            <div key={card} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-pulse">
              <div className="h-5 w-2/3 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-full bg-gray-100 rounded mb-2" />
              <div className="h-2 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {member?.name || 'You'} {hasMaktab ? 'have no individual courses yet' : 'do not have any courses yet'}
          </h2>
          {hasMaktab ? (
            <p className="text-gray-500">
              Your Maktab subjects are on your{' '}
              <Link to="/child/maktab" className="text-primary-600 hover:text-primary-700 font-medium">
                Maktab dashboard
              </Link>
              . Ask your parent to enroll you in additional individual courses here.
            </p>
          ) : (
            <p className="text-gray-500">
              Ask your parent to enroll you in a course or a{' '}
              <Link to="/child/maktab" className="text-primary-600 hover:text-primary-700 font-medium">
                Maktab program
              </Link>{' '}
              to start learning here.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* My Maktab Subjects */}
          {maktabActive.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                  My Maktab Subjects
                </h2>
                <span className="text-sm text-gray-500">{maktabActive.length} active</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {maktabActive.map((e) => renderCourseCard(e, true))}
              </div>
            </section>
          )}

          {/* Other / Individual Courses */}
          {individualActive.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {maktabActive.length > 0 ? 'Other Courses' : 'In Progress'}
                </h2>
                <span className="text-sm text-gray-500">{individualActive.length} active</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {individualActive.map((e) => renderCourseCard(e, false))}
              </div>
            </section>
          )}

          {/* Completed */}
          {completedEnrollments.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Completed</h2>
                <span className="text-sm text-gray-500">{completedEnrollments.length} finished</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedEnrollments.map((e) => renderCourseCard(e, isMaktab(e)))}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="text-sm text-gray-500">
        Looking for today's next step? Go back to your{' '}
        <Link to="/child/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
          dashboard
        </Link>
        .
      </div>
    </div>
  );
}
