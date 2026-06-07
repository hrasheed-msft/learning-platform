import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictError, NotFoundError } from '../middleware/error.middleware';

/**
 * New course enrollment QA template
 *
 * Reusable deployment verification for newly launched courses.
 * These route-level tests keep enrollment checks isolated to the test environment
 * by mocking auth and course services instead of touching a live database.
 */

const COURSE_ID = 'a1b2c3d4-e5f6-4890-abcd-ef1234567001';
const MISSING_COURSE_ID = '550e8400-e29b-41d4-a716-446655440099';
const MEMBER_ID = '550e8400-e29b-41d4-a716-446655440001';
const FAMILY_ID = '550e8400-e29b-41d4-a716-446655440002';

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn((req: any, _res: any, next: any) => {
    req.user = {
      id: 'user-1',
      familyId: FAMILY_ID,
      email: 'parent@example.com',
      role: 'PARENT',
    };
    next();
  }),
  optionalAuth: vi.fn((_req: any, _res: any, next: any) => next()),
  requireParentRole: vi.fn((_req: any, _res: any, next: any) => next()),
  requireActiveMember: vi.fn((req: any, _res: any, next: any) => {
    req.activeMemberId = (req.headers['x-active-member-id'] as string | undefined) ?? MEMBER_ID;
    next();
  }),
  getCourse: vi.fn(),
  getUnits: vi.fn(),
  enrollMember: vi.fn(),
  enrollMemberIdempotent: vi.fn(),
}));

vi.mock('../middleware/auth.middleware', () => ({
  authenticate: mocks.authenticate,
  optionalAuth: mocks.optionalAuth,
  requireParentRole: mocks.requireParentRole,
}));

vi.mock('../middleware/requireActiveMember.middleware', () => ({
  requireActiveMember: mocks.requireActiveMember,
}));

vi.mock('../services/course.service', () => ({
  CourseService: {
    getCourse: mocks.getCourse,
    getUnits: mocks.getUnits,
    enrollMember: mocks.enrollMember,
    enrollMemberIdempotent: mocks.enrollMemberIdempotent,
  },
}));

import router from '../routes/course.routes';
import { errorHandler } from '../middleware/error.middleware';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/courses', router);
  app.use(errorHandler);
  return app;
}

describe('Enrollment QA template', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects slug-style course IDs before deployment checks reach the service layer', async () => {
    const response = await request(makeApp()).get('/api/v1/courses/al-masar');

    expect(response.status).toBe(422);
    expect(response.body.error.errors).toEqual({
      courseId: 'Valid course ID is required',
    });
    expect(mocks.getCourse).not.toHaveBeenCalled();
  });

  it('returns 200 for the deployed course when the courseId is a valid UUID', async () => {
    mocks.getCourse.mockResolvedValue({
      id: COURSE_ID,
      title: 'al-Masār',
      unitCount: 3,
      enrolledCount: 0,
    });

    const response = await request(makeApp()).get(`/api/v1/courses/${COURSE_ID}`);

    expect(response.status).toBe(200);
    expect(mocks.getCourse).toHaveBeenCalledWith(COURSE_ID);
    expect(response.body.data).toMatchObject({
      id: COURSE_ID,
      title: 'al-Masār',
    });
  });

  it('returns 404 for a valid-but-missing course UUID', async () => {
    mocks.getCourse.mockRejectedValue(new NotFoundError('Course not found'));

    const response = await request(makeApp()).get(`/api/v1/courses/${MISSING_COURSE_ID}`);

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('Course not found');
  });

  it('returns units for a valid course deployment', async () => {
    mocks.getUnits.mockResolvedValue([
      { id: '550e8400-e29b-41d4-a716-446655440010', title: 'Welcome', orderIndex: 0 },
      { id: '550e8400-e29b-41d4-a716-446655440011', title: 'Foundations', orderIndex: 1 },
    ]);

    const response = await request(makeApp())
      .get(`/api/v1/courses/${COURSE_ID}/units`)
      .set('Authorization', 'Bearer test-token');

    expect(response.status).toBe(200);
    expect(mocks.authenticate).toHaveBeenCalledTimes(1);
    expect(mocks.getUnits).toHaveBeenCalledWith(COURSE_ID);
    expect(response.body.data).toHaveLength(2);
  });

  it('creates an enrollment for a valid member and course', async () => {
    mocks.enrollMember.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440020',
      memberId: MEMBER_ID,
      courseId: COURSE_ID,
      status: 'ACTIVE',
      progress: 0,
    });

    const response = await request(makeApp())
      .post('/api/v1/courses/enrollments')
      .set('Authorization', 'Bearer test-token')
      .set('x-active-member-id', MEMBER_ID)
      .send({ memberId: MEMBER_ID, courseId: COURSE_ID });

    expect(response.status).toBe(201);
    expect(mocks.enrollMember).toHaveBeenCalledWith(FAMILY_ID, MEMBER_ID, COURSE_ID);
    expect(response.body.data).toMatchObject({
      memberId: MEMBER_ID,
      courseId: COURSE_ID,
      status: 'ACTIVE',
    });
  });

  it('returns 422 when enrollment is requested with a non-UUID courseId', async () => {
    const response = await request(makeApp())
      .post('/api/v1/courses/enrollments')
      .set('Authorization', 'Bearer test-token')
      .set('x-active-member-id', MEMBER_ID)
      .send({ memberId: MEMBER_ID, courseId: 'al-masar' });

    expect(response.status).toBe(422);
    expect(response.body.error.errors).toEqual({
      courseId: 'Valid course ID is required',
    });
    expect(mocks.enrollMember).not.toHaveBeenCalled();
  });

  it('returns 409 when a member is already enrolled through the parent enrollment route', async () => {
    mocks.enrollMember.mockRejectedValue(new ConflictError('Already enrolled in this course'));

    const response = await request(makeApp())
      .post('/api/v1/courses/enrollments')
      .set('Authorization', 'Bearer test-token')
      .set('x-active-member-id', MEMBER_ID)
      .send({ memberId: MEMBER_ID, courseId: COURSE_ID });

    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe('Already enrolled in this course');
  });

  it('supports authenticated one-click enrollment for the active learner', async () => {
    mocks.enrollMemberIdempotent.mockResolvedValue({
      id: '550e8400-e29b-41d4-a716-446655440021',
      memberId: MEMBER_ID,
      courseId: COURSE_ID,
      status: 'ACTIVE',
      progress: 0,
    });

    const response = await request(makeApp())
      .post(`/api/v1/courses/${COURSE_ID}/enroll`)
      .set('Authorization', 'Bearer test-token')
      .set('x-active-member-id', MEMBER_ID)
      .send();

    expect(response.status).toBe(200);
    expect(mocks.enrollMemberIdempotent).toHaveBeenCalledWith(FAMILY_ID, MEMBER_ID, COURSE_ID);
    expect(response.body.data).toMatchObject({
      memberId: MEMBER_ID,
      courseId: COURSE_ID,
      status: 'ACTIVE',
    });
  });
});
