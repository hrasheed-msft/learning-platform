import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma client - must be before importing services
vi.mock('../config/database', () => ({
  default: {
    course: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    courseEnrollment: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    unitProgress: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    unit: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    familyMember: {
      findFirst: vi.fn(),
    },
  },
}));

import { CourseService } from '../services/course.service';
import prisma from '../config/database';

const mockMember = {
  id: 'member-1',
  familyId: 'family-1',
  name: 'Ahmed',
  role: 'CHILD',
};

const mockCourses = [
  {
    id: 'course-1',
    title: 'Arabic Basics',
    description: 'Learn the Arabic alphabet',
    category: 'ARABIC',
    ageLevels: ['7-9', '10-12'],
    difficulty: 'BEGINNER',
    thumbnailUrl: '/images/arabic.jpg',
    isPublished: true,
    _count: { units: 2, enrollments: 150 },
  },
  {
    id: 'course-2',
    title: 'Stories of Prophets',
    description: 'Islamic stories',
    category: 'SEERAH',
    ageLevels: ['7-9', '10-12', '13+'],
    difficulty: 'BEGINNER',
    thumbnailUrl: '/images/prophets.jpg',
    isPublished: true,
    _count: { units: 5, enrollments: 200 },
  },
];

describe('CourseService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: member exists
    vi.mocked(prisma.familyMember.findFirst).mockResolvedValue(mockMember as any);
  });

  describe('getCourses', () => {
    it('should return all published courses with pagination', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue(mockCourses as any);
      vi.mocked(prisma.course.count).mockResolvedValue(2);

      const result = await CourseService.getCourses({});

      expect(result.courses).toHaveLength(2);
      expect(result.courses[0].title).toBe('Arabic Basics');
      expect(result.pagination.total).toBe(2);
    });

    it('should filter by category', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue([mockCourses[0]] as any);
      vi.mocked(prisma.course.count).mockResolvedValue(1);

      const result = await CourseService.getCourses({ category: 'ARABIC' });

      expect(result.courses).toHaveLength(1);
      expect(result.courses[0].category).toBe('ARABIC');
    });

    it('should filter by age level', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue(mockCourses as any);
      vi.mocked(prisma.course.count).mockResolvedValue(2);

      await CourseService.getCourses({ ageLevel: '10-12' });

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            ageLevels: { has: '10-12' },
          }),
        })
      );
    });

    it('should include unit and enrollment count', async () => {
      vi.mocked(prisma.course.findMany).mockResolvedValue(mockCourses as any);
      vi.mocked(prisma.course.count).mockResolvedValue(2);

      const result = await CourseService.getCourses({});

      expect(result.courses[0].unitCount).toBe(2);
      expect(result.courses[0].enrolledCount).toBe(150);
    });
  });

  describe('getCourse', () => {
    it('should return course with counts', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourses[0] as any);

      const result = await CourseService.getCourse('course-1');

      expect(result.title).toBe('Arabic Basics');
      expect(result.unitCount).toBe(2);
    });

    it('should throw NotFoundError for non-existent course', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(null);

      await expect(
        CourseService.getCourse('non-existent')
      ).rejects.toThrow('Course not found');
    });
  });

  describe('enrollMember', () => {
    it('should create enrollment successfully', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourses[0] as any);
      vi.mocked(prisma.courseEnrollment.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.courseEnrollment.create).mockResolvedValue({
        id: 'enrollment-1',
        courseId: 'course-1',
        memberId: 'member-1',
        status: 'ACTIVE',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        course: mockCourses[0],
      } as any);

      const result = await CourseService.enrollMember('family-1', 'member-1', 'course-1');

      expect(result.id).toBe('enrollment-1');
      expect(result.status).toBe('ACTIVE');
    });

    it('should throw ConflictError for duplicate enrollment', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourses[0] as any);
      vi.mocked(prisma.courseEnrollment.findUnique).mockResolvedValue({
        id: 'existing-enrollment',
        courseId: 'course-1',
        memberId: 'member-1',
        status: 'ACTIVE',
      } as any);

      await expect(
        CourseService.enrollMember('family-1', 'member-1', 'course-1')
      ).rejects.toThrow('Already enrolled in this course');
    });

    it('should throw NotFoundError for invalid course', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(null);

      await expect(
        CourseService.enrollMember('family-1', 'member-1', 'non-existent')
      ).rejects.toThrow('Course not found');
    });

    it('should throw ForbiddenError for invalid member', async () => {
      vi.mocked(prisma.familyMember.findFirst).mockResolvedValue(null);

      await expect(
        CourseService.enrollMember('family-1', 'member-1', 'course-1')
      ).rejects.toThrow('Member not found or does not belong to your family');
    });
  });

  describe('getMemberEnrollments', () => {
    it('should return all enrollments for member', async () => {
      vi.mocked(prisma.courseEnrollment.findMany).mockResolvedValue([
        {
          id: 'enrollment-1',
          courseId: 'course-1',
          memberId: 'member-1',
          status: 'ACTIVE',
          course: mockCourses[0],
          unitProgress: [],
        },
        {
          id: 'enrollment-2',
          courseId: 'course-2',
          memberId: 'member-1',
          status: 'ACTIVE',
          course: mockCourses[1],
          unitProgress: [],
        },
      ] as any);

      const result = await CourseService.getMemberEnrollments('family-1', 'member-1');

      expect(result).toHaveLength(2);
      expect(result[0].course.title).toBe('Arabic Basics');
    });

    it('should return empty array for member with no enrollments', async () => {
      vi.mocked(prisma.courseEnrollment.findMany).mockResolvedValue([]);

      const result = await CourseService.getMemberEnrollments('family-1', 'member-1');

      expect(result).toHaveLength(0);
    });

    it('should request unit progress sorted by latest activity for resume behavior', async () => {
      vi.mocked(prisma.courseEnrollment.findMany).mockResolvedValue([]);

      await CourseService.getMemberEnrollments('family-1', 'member-1');

      expect(prisma.courseEnrollment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            unitProgress: {
              orderBy: [
                { updatedAt: 'desc' },
                { createdAt: 'desc' },
              ],
              include: {
                unit: {
                  select: {
                    id: true,
                    orderIndex: true,
                  },
                },
              },
            },
          }),
        }),
      );
    });
  });

  describe('getUnits', () => {
    it('should return units for a course', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(mockCourses[0] as any);
      vi.mocked(prisma.unit.findMany).mockResolvedValue([
        { id: 'unit-1', title: 'Alphabet Introduction', orderIndex: 0 },
        { id: 'unit-2', title: 'Basic Words', orderIndex: 1 },
      ] as any);

      const result = await CourseService.getUnits('course-1');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Alphabet Introduction');
    });

    it('should throw NotFoundError for invalid course', async () => {
      vi.mocked(prisma.course.findUnique).mockResolvedValue(null);

      await expect(
        CourseService.getUnits('non-existent')
      ).rejects.toThrow('Course not found');
    });
  });

  describe('getUnit', () => {
    it('should return unit with resources', async () => {
      vi.mocked(prisma.unit.findFirst).mockResolvedValue({
        id: 'unit-1',
        title: 'Alphabet Introduction',
        description: 'Learn the Arabic alphabet',
        courseId: 'course-1',
        orderIndex: 0,
        videoResources: [],
        audioResources: [],
        arabicTerms: [],
      } as any);

      const result = await CourseService.getUnit('course-1', 'unit-1');

      expect(result.title).toBe('Alphabet Introduction');
    });

    it('should throw NotFoundError for invalid unit', async () => {
      vi.mocked(prisma.unit.findFirst).mockResolvedValue(null);

      await expect(
        CourseService.getUnit('course-1', 'non-existent')
      ).rejects.toThrow('Unit not found');
    });
  });

  describe('updateCourseProgress', () => {
    it('should count a unit as complete when readingCompleted is true (video/quiz not required)', async () => {
      vi.mocked(prisma.courseEnrollment.findUnique).mockResolvedValue({
        id: 'enrollment-1',
        status: 'ACTIVE',
        progress: 0,
        completedAt: null,
        course: {
          id: 'course-1',
          title: 'Arabic Basics',
          units: [{ id: 'unit-1' }, { id: 'unit-2' }],
        },
        unitProgress: [
          {
            unitId: 'unit-1',
            videoCompleted: false,
            readingCompleted: true,
            quizCompleted: false,
          },
          {
            unitId: 'unit-2',
            videoCompleted: false,
            readingCompleted: false,
            quizCompleted: false,
          },
        ],
      } as any);
      vi.mocked(prisma.courseEnrollment.update).mockResolvedValue({} as any);

      const result = await CourseService.updateCourseProgress('enrollment-1');

      expect(prisma.courseEnrollment.update).toHaveBeenCalledWith({
        where: { id: 'enrollment-1' },
        data: expect.objectContaining({
          progress: 50,
          status: 'ACTIVE',
          completedAt: null,
        }),
      });
      expect(result).toEqual(
        expect.objectContaining({
          progress: 50,
          status: 'ACTIVE',
        })
      );
    });
  });

  describe('getMemberProgress', () => {
    it('should report completed units based on readingCompleted only', async () => {
      vi.mocked(prisma.courseEnrollment.findMany).mockResolvedValue([
        {
          courseId: 'course-1',
          status: 'ACTIVE',
          progress: 50,
          course: {
            title: 'Arabic Basics',
            _count: { units: 2 },
          },
          unitProgress: [
            {
              unitId: 'unit-1',
              videoCompleted: false,
              readingCompleted: true,
              quizCompleted: false,
            },
            {
              unitId: 'unit-2',
              videoCompleted: false,
              readingCompleted: false,
              quizCompleted: false,
            },
          ],
        },
      ] as any);

      const result = await CourseService.getMemberProgress('family-1', 'member-1');

      expect(result[0]).toEqual(
        expect.objectContaining({
          completedUnits: 1,
          totalUnits: 2,
        })
      );
    });
  });
});
