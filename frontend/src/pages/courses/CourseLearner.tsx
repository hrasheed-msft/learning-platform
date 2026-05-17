import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useCourseStore } from '@/stores';
import { courseService } from '@/services/courseService';
import { ArrowLeft, Loader2, BookOpen, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import type { Unit } from '@/types/course';

interface LocationState {
  memberId?: string;
  enrollmentId?: string;
}

export default function CourseLearner() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  
  const { selectedCourse, fetchCourse, enrollments, isLoading: courseLoading } = useCourseStore();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find the enrollment for this course
  const enrollment = enrollments.find(e => e.courseId === courseId);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch course and units
        await fetchCourse(courseId);
        const unitsData = await courseService.getUnits(courseId);
        setUnits(unitsData);
        
      } catch (err) {
        console.error('Failed to load course:', err);
        setError('Failed to load course content');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, fetchCourse]);

  // Determine which unit to show based on progress
  const getFirstIncompleteUnit = (): Unit | null => {
    if (units.length === 0) return null;
    
    // If we have unit progress from enrollment, find first incomplete
    if (enrollment?.unitProgress && enrollment.unitProgress.length > 0) {
      const completedUnitIds = new Set(
        enrollment.unitProgress
          .filter(up => up.status === 'completed')
          .map(up => up.unitId)
      );
      
      const incompleteUnit = units.find(unit => !completedUnitIds.has(unit.id));
      return incompleteUnit || units[0];
    }
    
    // Default to first unit
    return units[0];
  };

  const handleStartUnit = (unitId: string) => {
    navigate(`/courses/${courseId}/units/${unitId}`, {
      state: { memberId: state?.memberId, enrollmentId: state?.enrollmentId }
    });
  };

  const handleAutoStart = () => {
    const targetUnit = getFirstIncompleteUnit();
    if (targetUnit) {
      handleStartUnit(targetUnit.id);
    }
  };

  if (loading || courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Course not found</p>
        <Link to="/courses" className="text-primary-600 hover:text-primary-700">
          Browse Courses
        </Link>
      </div>
    );
  }

  // If we have units, show the course overview with unit selection
  return (
    <div className="space-y-6 animate-in">
      {/* Back Link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 relative">
          {selectedCourse.thumbnailUrl ? (
            <img
              src={selectedCourse.thumbnailUrl}
              alt={selectedCourse.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/30" />
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {selectedCourse.category}
              </span>
              <h1 className="text-2xl font-heading font-bold text-gray-800 mt-2">
                {selectedCourse.title}
              </h1>
              <p className="text-gray-600 mt-1">{selectedCourse.description}</p>
            </div>
            <button
              onClick={handleAutoStart}
              disabled={units.length === 0}
              className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              {enrollment?.progress && enrollment.progress > 0 ? 'Continue Learning' : 'Start Learning'}
            </button>
          </div>

          {/* Progress Bar */}
          {enrollment && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Course Progress</span>
                <span className="font-medium text-primary-600">{enrollment.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${enrollment.progress || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Units List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            Course Units
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {units.length} units • Complete in order to earn your certificate
          </p>
        </div>

        <div className="divide-y">
          {units.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No units available yet. Check back soon!
            </div>
          ) : (
            units.map((unit, index) => {
              // Check if unit is completed based on enrollment progress
              const unitProgress = enrollment?.unitProgress?.find(up => up.unitId === unit.id);
              const isCompleted = unitProgress?.status === 'completed';
              const isInProgress = unitProgress?.status === 'in_progress';
              const isLocked = index > 0 && !enrollment?.unitProgress?.find(
                up => up.unitId === units[index - 1].id && up.status === 'completed'
              );

              return (
                <div
                  key={unit.id}
                  className={`flex items-center justify-between p-4 ${
                    isLocked ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'
                  } transition`}
                  onClick={() => !isLocked && handleStartUnit(unit.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isInProgress 
                          ? 'bg-primary-100' 
                          : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <span className={`text-sm font-medium ${
                          isInProgress ? 'text-primary-600' : 'text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{unit.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {unit.description}
                      </p>
                    </div>
                  </div>
                  {!isLocked && (
                    <PlayCircle className={`w-6 h-6 ${
                      isCompleted ? 'text-green-500' : 'text-primary-500'
                    }`} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
