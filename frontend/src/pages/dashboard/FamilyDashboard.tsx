import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useFamilyStore, useCourseStore } from '@/stores';
import { Users, BookOpen, TrendingUp, Plus, ChevronRight, Flame, AlertCircle, LogOut } from 'lucide-react';

export default function FamilyDashboard() {
  const { family, logout } = useAuthStore();
  const { members, fetchMembers, isLoading, error } = useFamilyStore();
  const { enrollments, fetchAllFamilyEnrollments } = useCourseStore();

  useEffect(() => {
    if (family?.id) {
      fetchMembers(family.id);
    }
  }, [family?.id, fetchMembers]);

  // Fetch enrollments for all members when members are loaded
  useEffect(() => {
    if (members.length > 0) {
      const memberIds = members.map(m => m.id);
      fetchAllFamilyEnrollments(memberIds);
    }
  }, [members, fetchAllFamilyEnrollments]);

  // Calculate stats from enrollments
  const stats = useMemo(() => {
    const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE');
    const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED');
    return {
      activeCourses: activeEnrollments.length,
      completedCourses: completedEnrollments.length,
    };
  }, [enrollments]);

  // Get enrollment count per member
  const getMemberEnrollmentCount = (memberId: string): number => {
    return enrollments.filter(e => e.memberId === memberId).length;
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-800">
            Welcome, {family?.name || 'Family'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Track your family's learning progress and manage courses
          </p>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Browse Courses
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Family Members</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{members.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Courses</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeCourses}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Courses</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.completedCourses}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Learning Streak</p>
              <p className="text-2xl font-bold text-gray-800 mt-1 flex items-center">
                0 <Flame className="w-5 h-5 text-orange-500 ml-1 animate-flame" />
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Family Members Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            Family Members
          </h2>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition">
            <Plus className="w-4 h-4 mr-1" />
            Add Member
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading members...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Unable to load family members</h3>
            <p className="text-gray-500 mb-4">
              {error}. Please try logging out and logging back in.
            </p>
            <button
              onClick={() => logout()}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout and Retry
            </button>
          </div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No family members yet</h3>
            <p className="text-gray-500 mb-4">
              Add your children to start their learning journey
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/settings/family"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Member
              </Link>
              <button
                onClick={() => logout()}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout &amp; Re-login
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              If you just signed up or reseeded the database, try logging out and back in.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <Link
                key={member.id}
                to={`/dashboard/member/${member.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-primary-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-500">
                      Age {member.age} • {member.ageCategory.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-500">
                      {getMemberEnrollmentCount(member.id)} course{getMemberEnrollmentCount(member.id) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
