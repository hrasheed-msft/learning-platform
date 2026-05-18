import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseStore } from '@/stores';
import { Search, BookOpen, Clock, Users, ChevronRight } from 'lucide-react';

// Map display labels to the API category values
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

export default function CourseCatalog() {
  const { courses, fetchCourses, isLoading, filters, setFilters } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Initial fetch
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Re-fetch when category or ageCategory filter changes
  useEffect(() => {
    fetchCourses(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.ageCategory]);

  // Client-side search (instant, no round-trip)
  const filteredCourses = courses.filter(course =>
    !searchTerm ||
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-gray-800">
          Course Catalog 📚
        </h1>
        <p className="text-gray-600 mt-1">
          Explore Islamic courses for the whole family
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ category: e.target.value ? e.target.value as any : undefined })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value ?? ''}>{opt.label}</option>
            ))}
          </select>

          {/* Age Level Filter */}
          <select
            value={filters.ageCategory || ''}
            onChange={(e) => setFilters({ ageCategory: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            {AGE_LEVEL_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
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
          <p className="text-gray-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {/* Course Image */}
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
                {/* Category Badge */}
                <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-primary-700 text-xs font-medium rounded-full">
                  {course.category}
                </span>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {course.description}
                </p>

                {/* Meta Info */}
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

                {/* Age Level */}
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
