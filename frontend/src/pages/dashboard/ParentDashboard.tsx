import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore, useNotificationStore } from '@/stores';
import {
  Users,
  BookOpen,
  Clock,
  Flame,
  ChevronRight,
  Bell,
  Loader2,
  AlertCircle,
  Trophy,
  TrendingUp,
} from 'lucide-react';

export default function ParentDashboard() {
  const {
    children,
    familySummary,
    isLoading,
    error,
    fetchChildren,
    fetchFamilySummary,
  } = useDashboardStore();

  const { notifications, unreadCount, fetchNotifications, markAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetchChildren();
    fetchFamilySummary();
    fetchNotifications();
  }, [fetchChildren, fetchFamilySummary, fetchNotifications]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => { fetchChildren(); fetchFamilySummary(); }}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-800">Parent Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor your children's learning progress</p>
      </div>

      {/* Family Summary Stats */}
      {familySummary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Study Time This Week</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {Math.round(familySummary.totalStudyTimeMinutesThisWeek / 60)}h{' '}
                  {familySummary.totalStudyTimeMinutesThisWeek % 60}m
                </p>
              </div>
              <div className="w-11 h-11 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Courses</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {familySummary.activeCoursesCount}
                </p>
              </div>
              <div className="w-11 h-11 bg-secondary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Children</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {familySummary.totalChildren}
                </p>
              </div>
              <div className="w-11 h-11 bg-accent-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Family Streak</p>
                <p className="text-2xl font-bold text-gray-800 mt-1 flex items-center">
                  {familySummary.averageFamilyStreak}
                  <Flame className="w-5 h-5 text-orange-500 ml-1" />
                </p>
              </div>
              <div className="w-11 h-11 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Children Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-xl font-heading font-semibold text-gray-800">Children Overview</h2>
        </div>

        {children.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No children found. Add family members in Settings and set their login credentials.</p>
            <Link
              to="/settings"
              className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Go to Settings
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {children.map((child) => (
              <Link
                key={child.memberId}
                to={`/dashboard/parent/child/${child.memberId}`}
                className="flex items-center justify-between p-5 hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {child.avatarUrl ? (
                      <img
                        src={child.avatarUrl}
                        alt={child.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-primary-600">
                        {child.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{child.name}</h3>
                    <p className="text-sm text-gray-500">
                      Age {child.age} • {child.ageCategory.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500">Courses</p>
                    <p className="font-semibold text-gray-800">{child.coursesEnrolled}</p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-gray-500">Avg Score</p>
                    <p className="font-semibold text-gray-800">
                      {child.avgQuizScore > 0 ? `${child.avgQuizScore}%` : '—'}
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-sm text-gray-500">Streak</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-end">
                      {child.currentStreak}
                      <Flame className="w-4 h-4 text-orange-500 ml-1" />
                    </p>
                  </div>
                  <div className="text-right hidden lg:block">
                    <p className="text-sm text-gray-500">Last Active</p>
                    <p className="text-sm text-gray-700">
                      {child.lastActiveAt
                        ? new Date(child.lastActiveAt).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-heading font-semibold text-gray-800">Notifications</h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No notifications yet. Milestones and alerts will show here.</p>
          </div>
        ) : (
          <div className="divide-y max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${!notification.isRead ? 'bg-primary-50/50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      notification.type === 'achievement'
                        ? 'bg-secondary-100'
                        : notification.type === 'milestone'
                        ? 'bg-green-100'
                        : notification.type === 'alert'
                        ? 'bg-red-100'
                        : 'bg-gray-100'
                    }`}>
                      {notification.type === 'achievement' ? (
                        <Trophy className="w-4 h-4 text-secondary-600" />
                      ) : notification.type === 'milestone' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <Bell className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                      {notification.memberName && (
                        <p className="text-xs text-gray-400 mt-1">For: {notification.memberName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <span className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
