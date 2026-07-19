import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDashboardStore } from '@/stores';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  TrendingUp,
  Flame,
  Clock,
  Loader2,
  AlertCircle,
  Award,
} from 'lucide-react';

export default function ChildDetailView() {
  const { memberId } = useParams<{ memberId: string }>();
  const {
    selectedChildStats,
    activityFeed,
    activityTotal,
    activityPage,
    isLoadingStats,
    isLoadingActivity,
    error,
    fetchChildStats,
    fetchChildActivity,
    clearSelectedChild,
  } = useDashboardStore();

  useEffect(() => {
    if (memberId) {
      fetchChildStats(memberId);
      fetchChildActivity(memberId, 1);
    }
    return () => clearSelectedChild();
  }, [memberId, fetchChildStats, fetchChildActivity, clearSelectedChild]);

  if (isLoadingStats && !selectedChildStats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading child stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{error}</p>
          <Link
            to="/dashboard/parent"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!selectedChildStats) return null;

  const stats = selectedChildStats;
  const hasMoreActivity = activityFeed.length < activityTotal;

  return (
    <div className="space-y-8 animate-in">
      {/* Back + Header */}
      <div>
        <Link
          to="/dashboard/parent"
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Parent Dashboard
        </Link>
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {stats.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-800">{stats.name}</h1>
            <p className="text-gray-500 capitalize">{stats.ageCategory.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <BookOpen className="w-5 h-5 text-primary-500 mb-2" />
          <p className="text-xs text-gray-500">Courses</p>
          <p className="text-lg font-bold text-gray-800">
            {stats.coursesCompleted}/{stats.coursesEnrolled}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-xs text-gray-500">Avg Quiz Score</p>
          <p className="text-lg font-bold text-gray-800">
            {stats.avgQuizScore > 0 ? `${stats.avgQuizScore}%` : '—'}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Flame className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-xs text-gray-500">Streak</p>
          <p className="text-lg font-bold text-gray-800">
            {stats.currentStreak} <span className="text-xs text-gray-400">/ {stats.longestStreak} best</span>
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Clock className="w-5 h-5 text-accent-500 mb-2" />
          <p className="text-xs text-gray-500">Study Time</p>
          <p className="text-lg font-bold text-gray-800">
            {Math.round(stats.totalStudyTimeMinutes / 60)}h {stats.totalStudyTimeMinutes % 60}m
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <Brain className="w-5 h-5 text-secondary-500 mb-2" />
          <p className="text-xs text-gray-500">Flashcards</p>
          <p className="text-lg font-bold text-gray-800">
            {stats.flashcardsMastered}/{stats.flashcardsReviewed}
          </p>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-heading font-semibold text-gray-800 mb-4">Course Progress</h2>
        {stats.courseProgress.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No courses enrolled yet.</p>
        ) : (
          <div className="space-y-4">
            {stats.courseProgress.map((course) => (
              <div key={course.courseId}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{course.courseTitle}</span>
                    <p className="text-xs text-gray-400">
                      {course.completedUnits}/{course.totalUnits} units completed
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      course.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700'
                        : course.status === 'PAUSED'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-primary-100 text-primary-700'
                    }`}>
                      {course.status}
                    </span>
                    <span className="text-sm text-gray-500">{course.progress}%</span>
                  </div>
                </div>
                <ProgressBar
                  value={course.progress}
                  size="sm"
                  color={course.status === 'COMPLETED' ? 'success' : 'primary'}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quiz Score Trend */}
      {stats.quizScoreTrend.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-heading font-semibold text-gray-800 mb-4">Quiz Score Trend</h2>
          <div className="space-y-2">
            {stats.quizScoreTrend.map((point, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{point.quizTitle}</p>
                  <p className="text-xs text-gray-400">{new Date(point.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24">
                    <ProgressBar
                      value={point.score}
                      size="sm"
                      color={point.score >= 80 ? 'success' : point.score >= 60 ? 'warning' : 'primary'}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${
                    point.score >= 80 ? 'text-green-600' : point.score >= 60 ? 'text-yellow-600' : 'text-red-500'
                  }`}>
                    {point.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-lg font-heading font-semibold text-gray-800">Recent Activity</h2>
        </div>

        {activityFeed.length === 0 && !isLoadingActivity ? (
          <div className="p-6 text-center text-gray-500">No activity recorded yet.</div>
        ) : (
          <div className="divide-y">
            {activityFeed.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  event.type === 'course_completed' ? 'bg-green-100' :
                  event.type === 'badge_earned' ? 'bg-secondary-100' :
                  event.type === 'quiz_passed' ? 'bg-primary-100' :
                  event.type === 'streak_milestone' ? 'bg-orange-100' :
                  'bg-gray-100'
                }`}>
                  {event.type === 'badge_earned' ? (
                    <Award className="w-4 h-4 text-secondary-600" />
                  ) : event.type === 'streak_milestone' ? (
                    <Flame className="w-4 h-4 text-orange-600" />
                  ) : event.type === 'course_completed' ? (
                    <BookOpen className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMoreActivity && (
          <div className="p-4 text-center border-t">
            <button
              onClick={() => memberId && fetchChildActivity(memberId, activityPage + 1)}
              disabled={isLoadingActivity}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
            >
              {isLoadingActivity ? 'Loading...' : 'Load More Activity'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
