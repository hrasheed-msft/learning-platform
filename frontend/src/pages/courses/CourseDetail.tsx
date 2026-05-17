import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore, useFamilyStore, useAuthStore } from '@/stores';
import { 
  ArrowLeft, Clock, Users, BookOpen, Lock, CheckCircle, Loader2, SquareStack, ChevronRight
} from 'lucide-react';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { family } = useAuthStore();
  const { selectedCourse, units, fetchCourse, fetchUnits, enrollMember, isLoading } = useCourseStore();
  const { members, fetchMembers } = useFamilyStore();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
      fetchUnits(courseId);
    }
  }, [courseId, fetchCourse, fetchUnits]);

  useEffect(() => {
    if (family?.id) {
      fetchMembers(family.id);
    }
  }, [family?.id, fetchMembers]);

  if (isLoading || !selectedCourse) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!selectedMemberId || !courseId) return;
    
    setEnrolling(true);
    setEnrollError(null);
    setEnrollSuccess(false);
    
    try {
      await enrollMember(selectedMemberId, courseId);
      setEnrollSuccess(true);
      setSelectedMemberId('');
      // Refresh course data to update enrollment count
      fetchCourse(courseId);
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Back Link */}
      <Link
        to="/courses"
        className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
          {selectedCourse.thumbnailUrl ? (
            <img
              src={selectedCourse.thumbnailUrl}
              alt={selectedCourse.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-white/30" />
            </div>
          )}
          <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-primary-700 text-sm font-medium rounded-full">
            {selectedCourse.category}
          </span>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold text-gray-800">
            {selectedCourse.title}
          </h1>
          <p className="text-gray-600 mt-2">{selectedCourse.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {selectedCourse.unitCount || 0} units
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {selectedCourse.enrolledCount || 0} enrolled
            </span>
          </div>

          {/* Age Levels */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCourse.ageLevels.map((level: string) => (
              <span
                key={level}
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {level.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Enroll Family Member</h2>
        
        {enrollSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Successfully enrolled in course!
          </div>
        )}
        
        {enrollError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {enrollError}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            disabled={enrolling}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:bg-gray-100"
          >
            <option value="">Select a family member...</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleEnroll}
            disabled={!selectedMemberId || enrolling}
            className="px-6 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {enrolling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enrolling...
              </>
            ) : (
              'Enroll Now'
            )}
          </button>
        </div>
      </div>

      {/* Flashcards Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 shadow-sm border border-primary-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <SquareStack className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Course Flashcards</h2>
              <p className="text-sm text-gray-600 mb-3">
                Practice and memorize key concepts with spaced repetition flashcards
              </p>
              <Link
                to={`/courses/${courseId}/flashcards`}
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition text-sm"
              >
                View All Flashcards
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Course Units */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            Course Units
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {units.length} units • Complete in order
          </p>
        </div>

        <div className="divide-y">
          {units.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No units available yet
            </div>
          ) : (
            units.map((unit, index) => (
              <div
                key={unit.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{unit.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {unit.description}
                    </p>
                  </div>
                </div>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
