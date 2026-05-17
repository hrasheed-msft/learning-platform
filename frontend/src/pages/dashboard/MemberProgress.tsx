import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFamilyStore, useCourseStore } from '@/stores';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award, 
  CheckCircle,
  PlayCircle,
  Brain,
  Flame
} from 'lucide-react';
import { Card, ProgressBar, Spinner, Badge } from '@/components/ui';

export default function MemberProgress() {
  const { memberId } = useParams<{ memberId: string }>();
  const { members, isLoading: membersLoading } = useFamilyStore();
  const { enrollments, fetchEnrollments, isLoading: enrollmentsLoading } = useCourseStore();

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
    const completed = memberEnrollments.filter(e => e.status === 'COMPLETED');
    const totalProgress = active.reduce((sum, e) => sum + (e.progress || 0), 0);
    const avgProgress = active.length > 0 ? Math.round(totalProgress / active.length) : 0;
    
    return {
      activeCourses: active.length,
      completedCourses: completed.length,
      totalEnrollments: memberEnrollments.length,
      averageProgress: avgProgress,
    };
  }, [memberEnrollments]);

  useEffect(() => {
    if (memberId) {
      fetchEnrollments(memberId);
    }
  }, [memberId, fetchEnrollments]);

  const isLoading = membersLoading || enrollmentsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-6 animate-in">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <Card className="p-8 text-center">
          <p className="text-gray-500">Member not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {member.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-800">
                {member.name}'s Progress
              </h1>
              <p className="text-gray-500">Age: {member.age} years old</p>
            </div>
          </div>
        </div>
        <Link
          to={`/child/${memberId}`}
          className="btn-secondary"
        >
          View Child Dashboard
        </Link>
      </div>

      {/* Stats Overview */}
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
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.completedCourses}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.averageProgress}%</p>
              <p className="text-xs text-gray-500">Avg Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">7</p>
              <p className="text-xs text-gray-500">Day Streak</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            Course Progress
          </h2>
        </div>
        <div className="divide-y">
          {memberEnrollments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No courses enrolled</h3>
              <p className="text-gray-500 mb-4">
                Enroll {member.name} in courses to start tracking progress.
              </p>
              <Link to="/courses" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            memberEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {enrollment.course?.title || 'Course'}
                      </h3>
                      <Badge 
                        variant={enrollment.status === 'COMPLETED' ? 'success' : 
                                enrollment.status === 'PAUSED' ? 'warning' : 'primary'}
                      >
                        {enrollment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {enrollment.course?.category || 'Category'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {enrollment.progress || 0}%
                    </p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>
                
                <ProgressBar 
                  value={enrollment.progress || 0} 
                  max={100}
                  className="mb-4"
                />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Started {new Date(enrollment.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {(enrollment.course as any)?.unitCount || (enrollment.course as any)?.units?.length || 0} units
                    </span>
                  </div>
                  <Link
                    to={`/courses/${enrollment.courseId}/learn`}
                    state={{ memberId: member.id, enrollmentId: enrollment.id }}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Continue
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Review Stats */}
      <Card>
        <div className="p-6 border-b">
          <h2 className="text-xl font-heading font-semibold text-gray-800 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Spaced Repetition Review
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-500">Cards Due</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">0</p>
              <p className="text-sm text-gray-500">Cards Reviewed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">0%</p>
              <p className="text-sm text-gray-500">Retention Rate</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/reviews"
              className="btn-secondary"
            >
              Start Review Session
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
