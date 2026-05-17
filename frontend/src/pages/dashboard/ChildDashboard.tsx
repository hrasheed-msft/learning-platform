import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFamilyStore, useCourseStore } from '@/stores';
import { flashcardService } from '@/services';
import { Flame, Star, Trophy, BookOpen, Brain, Target, PlayCircle, ChevronRight } from 'lucide-react';
import { Card, ProgressBar, Spinner } from '@/components/ui';

export default function ChildDashboard() {
  const { memberId } = useParams<{ memberId: string }>();
  const { members } = useFamilyStore();
  const { enrollments, fetchEnrollments, isLoading } = useCourseStore();
  const [reviewsDue, setReviewsDue] = useState(0);

  // Find the member
  const member = useMemo(() => {
    return members.find(m => m.id === memberId);
  }, [members, memberId]);

  // Filter enrollments for this member
  const memberEnrollments = useMemo(() => {
    return enrollments.filter(e => e.memberId === memberId);
  }, [enrollments, memberId]);

  // Calculate stats
  const stats = useMemo(() => {
    const active = memberEnrollments.filter(e => e.status === 'ACTIVE');
    return {
      activeCourses: active.length,
      reviewsDue,
      weeklyGoal: 85,
      badges: 0,
    };
  }, [memberEnrollments, reviewsDue]);

  useEffect(() => {
    if (memberId) {
      fetchEnrollments(memberId);
      
      // Fetch flashcard due reviews
      flashcardService.getDueCards()
        .then(data => {
          setReviewsDue(data.total);
        })
        .catch(err => {
          console.error('Failed to fetch flashcard stats:', err);
          setReviewsDue(0);
        });
    }
  }, [memberId, fetchEnrollments]);

  const memberName = member?.name || 'Learner';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold">{memberName.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                Assalamu Alaikum, {memberName}! 👋
              </h1>
              <p className="text-primary-100 mt-1">Ready to learn today?</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center text-3xl font-bold">
                7 <Flame className="w-8 h-8 ml-1 animate-flame" />
              </div>
              <p className="text-sm text-primary-100">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold flex items-center">
                450 <Star className="w-6 h-6 ml-1 text-yellow-300" />
              </p>
              <p className="text-sm text-primary-100">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.activeCourses}</p>
              <p className="text-xs text-gray-500">Active Courses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.badges}</p>
              <p className="text-xs text-gray-500">Badges Earned</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.reviewsDue}</p>
              <p className="text-xs text-gray-500">Reviews Due</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.weeklyGoal}%</p>
              <p className="text-xs text-gray-500">Weekly Goal</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Courses */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            My Courses
          </h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            Browse More <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="p-6">
          {memberEnrollments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-4">
                Ask your parent to enroll you in some courses!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {memberEnrollments.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  to={`/courses/${enrollment.courseId}/learn`}
                  state={{ memberId, enrollmentId: enrollment.id }}
                  className="block p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {enrollment.course?.title || 'Course'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {enrollment.course?.category || 'Category'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-primary-600">
                        {enrollment.progress || 0}%
                      </span>
                      <PlayCircle className="w-8 h-8 text-primary-500" />
                    </div>
                  </div>
                  <ProgressBar value={enrollment.progress || 0} max={100} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            My Achievements 🏆
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Placeholder badges */}
            {['First Lesson', '7-Day Streak', 'Quiz Master', 'Early Bird'].map((badge, idx) => (
              <div
                key={idx}
                className="text-center p-4 rounded-lg bg-gray-50 opacity-50"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">{badge}</p>
                <p className="text-xs text-gray-400">🔒 Locked</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl p-6 border border-secondary-200">
        <div className="text-center">
          <p className="text-lg text-secondary-800 italic mb-2">
            "Seek knowledge from the cradle to the grave."
          </p>
          <p className="text-sm text-secondary-600">— Prophet Muhammad ﷺ</p>
        </div>
      </div>
    </div>
  );
}
