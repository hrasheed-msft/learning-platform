import { BookOpen, Brain, Trophy, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { useChildEnrollments } from '@/hooks/useChildEnrollments';

export default function ChildDashboardHome() {
  const { member } = useChildAuthStore();
  const { enrollments, isLoading } = useChildEnrollments();
  const activeEnrollments = enrollments.filter((enrollment) => enrollment.status !== 'COMPLETED');
  const recentEnrollments = activeEnrollments.slice(0, 3);

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          Assalamu Alaikum, {member?.name}! 🌟
        </h1>
        <p className="text-gray-600 mt-1">Keep up the great work on your learning journey!</p>
      </div>

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
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500">My Streak</p>
          <p className="text-xl font-bold text-gray-800 mt-1 flex items-center">
            0 <Flame className="w-4 h-4 text-orange-500 ml-1" />
          </p>
        </div>
      </div>

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
    </div>
  );
}
