import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Course API Tests
 * Tests: list courses, get course, enrollment
 */

vi.mock('../config/database', () => ({
  default: {
    course: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    unit: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    familyMember: {
      findFirst: vi.fn(),
    },
    courseEnrollment: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

vi.mock('../config/redis', () => ({
  default: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

import { CourseService } from '../services/course.service';
import prisma from '../config/database';

const mockCourse = {
  id: 'course-1',
  title: 'Introduction to Fiqh',
  description: 'Basic fiqh course',
  category: 'FIQH',
  ageLevels: ['TEEN', 'ADULT'],
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { units: 5, enrollments: 10 },
};

const mockUnit = {
  id: 'unit-1',
  title: 'Chapter 1: Taharah',
  description: 'Purification',
  orderIndex: 0,
  courseId: 'course-1',
  content: '<p>Content about taharah</p><p>More content here</p>',
  videoResources: [],
  audioResources: [],
  arabicTerms: [{ id: 'term-1', term: 'طهارة', transliteration: 'taharah', translation: 'purification' }],
  questions: [],
};

describe('CourseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCourses', () => {
    it('should return paginated list of published courses', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue([mockCourse] as any);
      vi.mocked(prisma.course.count).mockResolvedValue(1);

      const result = await CourseService.getCourses({});

      expect(result.courses).toHaveLength(1);
      expect(result.courses[0].title).toBe('Introduction to Fiqh');
      expect(result.courses[0].unitCount).toBe(5);
      expect(result.pagination.total).toBe(1);
    });

    it('should filter by category', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue([mockCourse] as any);
      vi.mocked(prisma.course.count).mockResolvedValue(1);

      await CourseService.getCourses({ category: 'FIQH' });

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'FIQH' }),
        })
      );
    });

    it('should filter by age level', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue([mockCourse] as any);
      vi.mocked(prisma.course.count).mockResolvedValue(1);

      await CourseService.getCourses({ ageLevel: 'TEEN' });

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ ageLevels: { has: 'TEEN' } }),
        })
      );
    });

    it('should support text search', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue([]);
      vi.mocked(prisma.course.count).mockResolvedValue(0);

      await CourseService.getCourses({ search: 'fiqh' });

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ title: { contains: 'fiqh', mode: 'insensitive' } }),
            ]),
          }),
        })
      );
    });

    it('should paginate correctly', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue([]);
      vi.mocked(prisma.course.count).mockResolvedValue(50);

      const result = await CourseService.getCourses({ page: 2, limit: 10 });

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 })
      );
      expect(result.pagination.totalPages).toBe(5);
    });
  });

  describe('getCourse', () => {
    it('should return a single course by ID', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourse as any);

      const result = await CourseService.getCourse('course-1');

      expect(result.title).toBe('Introduction to Fiqh');
      expect(result.unitCount).toBe(5);
    });

    it('should throw NotFoundError for non-existent course', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(null);

      await expect(CourseService.getCourse('nonexistent')).rejects.toThrow('Course not found');
    });
  });

  describe('getUnits', () => {
    it('should return units ordered by orderIndex', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourse as any);
      vi.mocked(prisma.unit.findMany).mockResolvedValue([
        { id: 'unit-1', title: 'Unit 1', orderIndex: 0 },
        { id: 'unit-2', title: 'Unit 2', orderIndex: 1 },
      ] as any);

      const result = await CourseService.getUnits('course-1');

      expect(result).toHaveLength(2);
      expect(prisma.unit.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { orderIndex: 'asc' } })
      );
    });

    it('should throw NotFoundError if course does not exist', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(null);

      await expect(CourseService.getUnits('nonexistent')).rejects.toThrow('Course not found');
    });
  });

  describe('getUnit', () => {
    it('should return unit with content, arabicTerms, and resources', async () => {
      vi.mocked(prisma.unit.findFirst).mockResolvedValue(mockUnit as any);

      const result = await CourseService.getUnit('course-1', 'unit-1');

      expect(result.id).toBe('unit-1');
      expect(result.content.text).toContain('taharah');
      expect(result.content.arabicTerms).toHaveLength(1);
    });

    it('should throw NotFoundError for non-existent unit', async () => {
      vi.mocked(prisma.unit.findFirst).mockResolvedValue(null);

      await expect(CourseService.getUnit('course-1', 'nonexistent')).rejects.toThrow('Unit not found');
    });
  });

  describe('enrollMember', () => {
    it('should create enrollment for valid member and course', async () => {
      vi.mocked(prisma.familyMember.findFirst).mockResolvedValue({ id: 'member-1', familyId: 'family-1' } as any);
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourse as any);
      vi.mocked(prisma.courseEnrollment.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.courseEnrollment.create).mockResolvedValue({
        id: 'enrollment-1',
        memberId: 'member-1',
        courseId: 'course-1',
        status: 'ACTIVE',
        progress: 0,
        course: mockCourse,
      } as any);

      const result = await CourseService.enrollMember('family-1', 'member-1', 'course-1');

      expect(result.status).toBe('ACTIVE');
      expect(result.progress).toBe(0);
    });

    it('should throw if member not in family', async () => {
      vi.mocked(prisma.familyMember.findFirst).mockResolvedValue(null);

      await expect(
        CourseService.enrollMember('family-1', 'stranger', 'course-1')
      ).rejects.toThrow();
    });

    it('should throw if already enrolled', async () => {
      vi.mocked(prisma.familyMember.findFirst).mockResolvedValue({ id: 'member-1', familyId: 'family-1' } as any);
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourse as any);
      vi.mocked(prisma.courseEnrollment.findUnique).mockResolvedValue({ id: 'existing' } as any);

      await expect(
        CourseService.enrollMember('family-1', 'member-1', 'course-1')
      ).rejects.toThrow('Already enrolled');
    });
  });
});
