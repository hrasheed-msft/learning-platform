import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn((req: any, _res: any, next: any) => {
    req.user = { id: 'user-1', familyId: 'family-1', email: 'test@example.com', role: 'PARENT' };
    next();
  }),
  requireParent: vi.fn((_req: any, _res: any, next: any) => next()),
  validate: vi.fn(() => (_req: any, _res: any, next: any) => next()),
  normalizeArabicTerms: vi.fn((_req: any, res: any) => {
    res.json({
      success: true,
      data: {
        updatedUnits: 2,
        normalizedTerms: 5,
        clearedAudioCacheEntries: 7,
      },
    });
  }),
}));

vi.mock('../middleware/auth.middleware', () => ({
  authenticate: mocks.authenticate,
  requireParent: mocks.requireParent,
}));

vi.mock('../middleware/validate.middleware', () => ({
  validate: mocks.validate,
}));

vi.mock('../controllers/audio.controller', () => ({
  AudioController: {
    normalizeArabicTerms: mocks.normalizeArabicTerms,
  },
}));

import router from '../routes/audio-admin.routes';

describe('audio admin routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('protects and serves POST /api/v1/admin/normalize-arabic-terms', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/v1', router);

    const response = await request(app)
      .post('/api/v1/admin/normalize-arabic-terms')
      .send({ unitIds: ['550e8400-e29b-41d4-a716-446655440000'] });

    expect(response.status).toBe(200);
    expect(mocks.authenticate).toHaveBeenCalledTimes(1);
    expect(mocks.requireParent).toHaveBeenCalledTimes(1);
    expect(mocks.normalizeArabicTerms).toHaveBeenCalledTimes(1);
    expect(response.body.data).toEqual({
      updatedUnits: 2,
      normalizedTerms: 5,
      clearedAudioCacheEntries: 7,
    });
  });
});
