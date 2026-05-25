import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, BookOpen, PlayCircle, CheckCircle, Lock } from 'lucide-react';
import { useCourseStore } from '@/stores';
import { useFamilyStore } from '@/stores/familyStore';
import { useChildAuthStore } from '@/stores/childAuthStore';
import { courseService } from '@/services/courseService';
import { getUnitPath } from '@/utils/courseRoutePaths';
import type { CourseEnrollment } from '@/types';
import type { Unit } from '@/types/course';

interface LocationState {
  memberId?: string;
  enrollmentId?: string;
  enrollment?: CourseEnrollment;
}

type EnrollmentUnitProgress = NonNullable<CourseEnrollment['unitProgress']>[number];

function isUnitCompleted(progress?: EnrollmentUnitProgress) {
  if (!progress) {
    return false;
  }

  if (progress.status) {
    return progress.status === 'completed';
  }

  return Boolean(progress.videoCompleted && progress.readingCompleted && progress.quizCompleted);
}

function hasUnitStarted(progress?: EnrollmentUnitProgress) {
  if (!progress) {
    return false;
  }

  if (progress.status) {
    return progress.status === 'in_progress' || progress.status === 'completed';
  }

  return Boolean(progress.videoCompleted || progress.readingCompleted || progress.quizCompleted);
}

export default function CourseLearner() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { selectedMember } = useFamilyStore();
  const { member: childMember } = useChildAuthStore();
  const { selectedCourse, fetchCourse, enrollments, isLoading: courseLoading } = useCourseStore();

  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedEnrollment, setResolvedEnrollment] = useState<CourseEnrollment | null>(state?.enrollment ?? null);

  const resumeUnitRef = useRef<HTMLDivElement | null>(null);
  const isChildRoute = location.pathname.startsWith('/child/');
  const backLinkPath = isChildRoute ? '/child/courses' : '/dashboard';
  const browseCoursesPath = isChildRoute ? '/child/courses' : '/courses';
  const storeEnrollment = enrollments.find((enrollment) => enrollment.courseId === courseId);
  const activeMemberId = state?.memberId ?? (isChildRoute ? childMember?.id : selectedMember?.id);

  useEffect(() => {
    if (state?.enrollment) {
      setResolvedEnrollment(state.enrollment);
      return;
    }

    if (storeEnrollment) {
      setResolvedEnrollment(storeEnrollment);
    }
  }, [state?.enrollment, storeEnrollment]);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [_, unitsData] = await Promise.all([fetchCourse(courseId), courseService.getUnits(courseId)]);
        setUnits(unitsData);

        let nextEnrollment = state?.enrollment?.courseId === courseId ? state.enrollment : storeEnrollment ?? null;

        if ((!nextEnrollment || nextEnrollment.unitProgress === undefined) && activeMemberId) {
          const memberEnrollments = await courseService.getEnrollments(activeMemberId);
          nextEnrollment = memberEnrollments.find((enrollment) => {
            if (state?.enrollmentId) {
              return enrollment.id === state.enrollmentId;
            }

            return enrollment.courseId === courseId;
          }) ?? nextEnrollment;
        }

        setResolvedEnrollment(nextEnrollment ?? null);
      } catch (err) {
        console.error('Failed to load course:', err);
        setError('Failed to load course content');
      } finally {
        setLoading(false);
      }
    };

    void loadCourseData();
  }, [activeMemberId, courseId, fetchCourse, state?.enrollment, state?.enrollmentId, storeEnrollment]);

  const resumeUnit = (() => {
    if (units.length === 0) {
      return null;
    }

    const unitProgress = resolvedEnrollment?.unitProgress ?? [];
    const partiallyStartedUnit = unitProgress.find((progress) => !isUnitCompleted(progress) && hasUnitStarted(progress));

    if (partiallyStartedUnit) {
      return units.find((unit) => unit.id === partiallyStartedUnit.unitId) ?? units[0];
    }

    const completedUnitIds = new Set(
      unitProgress.filter((progress) => isUnitCompleted(progress)).map((progress) => progress.unitId),
    );

    return units.find((unit) => !completedUnitIds.has(unit.id)) ?? units[0];
  })();

  useEffect(() => {
    if (!resumeUnitRef.current || !resumeUnit) {
      return;
    }

    resumeUnitRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [resumeUnit]);

  const handleStartUnit = (unitId: string) => {
    if (!courseId) {
      return;
    }

    navigate(getUnitPath(location.pathname, courseId, unitId), {
      state: {
        memberId: activeMemberId,
        enrollmentId: resolvedEnrollment?.id ?? state?.enrollmentId,
        enrollment: resolvedEnrollment ?? undefined,
      },
    });
  };

  const handleAutoStart = () => {
    if (resumeUnit) {
      handleStartUnit(resumeUnit.id);
    }
  };

  const isContinuing = (resolvedEnrollment?.progress ?? 0) > 0
    || Boolean(resolvedEnrollment?.unitProgress?.some((progress) => hasUnitStarted(progress)));

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
        <Link to={backLinkPath} className="text-primary-600 hover:text-primary-700">
          {isChildRoute ? 'Return to My Courses' : 'Return to Dashboard'}
        </Link>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Course not found</p>
        <Link to={browseCoursesPath} className="text-primary-600 hover:text-primary-700">
          Browse Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <Link
        to={backLinkPath}
        className="inline-flex items-center text-gray-600 hover:text-primary-600 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {isChildRoute ? 'Back to My Courses' : 'Back to Dashboard'}
      </Link>

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
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
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
              type="button"
              onClick={handleAutoStart}
              disabled={units.length === 0}
              className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              {isContinuing ? 'Continue Learning' : 'Start Learning'}
            </button>
          </div>

          {resolvedEnrollment && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Course Progress</span>
                <span className="font-medium text-primary-600">{resolvedEnrollment.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${resolvedEnrollment.progress || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
              const unitProgress = resolvedEnrollment?.unitProgress?.find((progress) => progress.unitId === unit.id);
              const previousProgress = index > 0
                ? resolvedEnrollment?.unitProgress?.find((progress) => progress.unitId === units[index - 1].id)
                : undefined;
              const isCompleted = isUnitCompleted(unitProgress);
              const isInProgress = !isCompleted && hasUnitStarted(unitProgress);
              const isLocked = index > 0 && !isUnitCompleted(previousProgress);
              const isResumeTarget = resumeUnit?.id === unit.id;

              return (
                <div
                  key={unit.id}
                  ref={isResumeTarget ? resumeUnitRef : null}
                  className={`flex items-center justify-between p-4 ${
                    isLocked ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'
                  } ${isResumeTarget ? 'bg-primary-50/60 ring-1 ring-inset ring-primary-200' : ''} transition`}
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
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-gray-800">{unit.title}</h3>
                        {isResumeTarget && !isLocked && !isCompleted && (
                          <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
                            Continue where you left off
                          </span>
                        )}
                      </div>
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
