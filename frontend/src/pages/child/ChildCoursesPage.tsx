import { BookOpen, CheckCircle2, Clock3, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChildEnrollments } from '@/hooks/useChildEnrollments';

export default function ChildCoursesPage() {
  const { member, enrollments, isLoading, error, reload } = useChildEnrollments();
  const activeEnrollments = enrollments.filter((enrollment) => enrollment.status !== 'COMPLETED');
  const completedEnrollments = enrollments.filter((enrollment) => enrollment.status === 'COMPLETED');

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
            {member?.name || 'You'} do not have any courses yet
          </h2>
          <p className="text-gray-500">Ask your parent to enroll you in a course to start learning here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">In Progress</h2>
              <span className="text-sm text-gray-500">{activeEnrollments.length} active</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                        {enrollment.course?.category || 'Course'}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-800 mt-1">{enrollment.course?.title}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                      <Clock3 className="w-3 h-3" />
                      {enrollment.progress ?? 0}% complete
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{enrollment.course?.description}</p>
                  <div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${Math.max(0, Math.min(100, enrollment.progress ?? 0))}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {completedEnrollments.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Completed</h2>
                <span className="text-sm text-gray-500">{completedEnrollments.length} finished</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                          {enrollment.course?.category || 'Course'}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-800 mt-1">{enrollment.course?.title}</h3>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="text-sm text-gray-500">
        Looking for today’s next step? Go back to your <Link to="/child/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">dashboard</Link>.
      </div>
    </div>
  );
}
