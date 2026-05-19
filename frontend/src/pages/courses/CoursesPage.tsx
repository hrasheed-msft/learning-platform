import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCourseStore, useFamilyStore } from '@/stores';
import { courseService } from '@/services/courseService';
import { useActiveMemberId } from '@/hooks/useActiveMemberId';
import type { CourseEnrollment } from '@/types';
import {
  Search,
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

type Tab = 'my-courses' | 'catalog';

const CATEGORY_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Quran', value: 'QURAN' },
  { label: 'Hadith', value: 'HADITH' },
  { label: 'Fiqh', value: 'FIQH' },
  { label: 'Seerah', value: 'SEERAH' },
  { label: 'Arabic', value: 'ARABIC' },
  { label: 'Islamic History', value: 'ISLAMIC_HISTORY' },
];

const AGE_LEVEL_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: 'All Ages', value: undefined },
  { label: 'Early Child', value: 'EARLY_CHILD' },
  { label: 'Child', value: 'CHILD' },
  { label: 'Pre-Teen', value: 'PRE_TEEN' },
  { label: 'Teen', value: 'TEEN' },
  { label: 'Adult', value: 'ADULT' },
];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: CourseEnrollment }) {
  const course = enrollment.course;
  if (!course) return null;

  const isCompleted = enrollment.status === 'COMPLETED';
  const progress = enrollment.progress ?? 0;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {/* Thumbnail */}
      <div className="h-36 bg-gradient-to-br from-primary-400 to-primary-600 relative">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-14 h-14 text-white/40" />
          </div>
        )}
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-primary-700 text-xs font-medium rounded-full">
          {course.category}
        </span>
        {isCompleted && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span className="font-medium text-primary-600">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        {/* Age levels */}
        <div className="flex flex-wrap gap-1">
          {course.ageLevels.map((level: string) => (
            <span
              key={level}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {level.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={`/courses/${enrollment.courseId}/learn`}
          className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition"
        >
          <PlayCircle className="w-4 h-4" />
          {isCompleted ? 'Review Course' : progress > 0 ? 'Continue Learning' : 'Start Learning'}
        </Link>
      </div>
    </div>
  );
}

function MyCourses({
  memberId,
  onBrowseCatalog,
}: {
  memberId: string | undefined;
  onBrowseCatalog: () => void;
}) {
  const { selectedMember } = useFamilyStore();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getEnrollments(memberId);
      setEnrollments(data);
    } catch {
      setError('Could not load your courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    load();
  }, [load]);

  const memberName = selectedMember?.name ?? 'You';

  if (!memberId) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No active learner selected</h3>
        <p className="text-gray-500 text-sm">
          Select a learner from the top bar to see their enrolled courses.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="h-36 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-red-100 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={load}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {memberName} isn't enrolled in any courses yet
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Browse the Course Catalog to find Islamic studies courses for every age and topic.
        </p>
        <button
          onClick={onBrowseCatalog}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
        >
          Browse Course Catalog
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const active = enrollments.filter((e) => e.status !== 'COMPLETED');
  const completed = enrollments.filter((e) => e.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {active.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            In Progress
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({active.length} {active.length === 1 ? 'course' : 'courses'})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Completed
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({completed.length} {completed.length === 1 ? 'course' : 'courses'})
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completed.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCatalogTab() {
  const { courses, fetchCourses, isLoading, filters, setFilters } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.ageCategory]);

  const filteredCourses = courses.filter(
    (course) =>
      !searchTerm ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              setFilters({ category: e.target.value ? (e.target.value as any) : undefined })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={filters.ageCategory || ''}
            onChange={(e) => setFilters({ ageCategory: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {AGE_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
            >
              <div className="h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="h-40 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/50" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-primary-700 text-xs font-medium rounded-full">
                  {course.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.unitCount || 0} units
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.enrolledCount || 0}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {course.ageLevels.map((level: string) => (
                    <span
                      key={level}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {level.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam === 'catalog' ? 'catalog' : 'my-courses',
  );
  const activeMemberId = useActiveMemberId();

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSearchParams(tab === 'my-courses' ? {} : { tab });
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'my-courses',
      label: 'My Courses',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      key: 'catalog',
      label: 'Course Catalog',
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-800">Courses 📚</h1>
        <p className="text-gray-600 mt-1">Your Islamic learning journey</p>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'my-courses' ? (
        <MyCourses
          memberId={activeMemberId}
          onBrowseCatalog={() => switchTab('catalog')}
        />
      ) : (
        <CourseCatalogTab />
      )}
    </div>
  );
}
