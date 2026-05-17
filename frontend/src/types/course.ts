// Course Types

export type CourseCategory = 'QURAN' | 'HADITH' | 'FIQH' | 'SEERAH' | 'ARABIC' | 'TAFSIR' | 'AQEEDAH';
export type AgeLevel = 'EARLY_CHILD' | 'CHILD' | 'PRE_TEEN' | 'TEEN' | 'ADULT';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  ageLevels: AgeLevel[];
  thumbnailUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  unitCount?: number;
  enrolledCount?: number;
}

export interface Unit {
  id: string;
  courseId?: string;
  orderIndex: number;
  title: string;
  description: string;
  content?: UnitContent | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnitContent {
  text?: string;
  videos?: VideoResource[];
  audio?: AudioResource[];
  arabicTerms?: ArabicTerm[];
}

export interface VideoResource {
  id: string;
  title: string;
  url: string;
  duration?: number;
  type: 'youtube' | 'server';
}

export interface AudioResource {
  id: string;
  title: string;
  url: string;
  duration?: number;
}

export interface ArabicTerm {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  audioUrl?: string;
  category: string;
}

// Course Filters

export interface CourseFilters {
  ageCategory?: string;
  category?: CourseCategory;
  courseType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
}
