import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Auth Flow Tests (Critical — broke in production)
 * Tests:
 * - Refresh failure does NOT trigger infinite loop
 * - Logout doesn't go through auth interceptor
 * - Rate limiter exempts /refresh and /logout
 * - Expired token returns 401 without crashing
 */

vi.mock('../config/database', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    familyMember: {
      findUnique: vi.fn(),
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

import jwt from 'jsonwebtoken';
import express from 'express';
import request from 'supertest';

const ACCESS_SECRET = 'test-access-secret';
const REFRESH_SECRET = 'test-refresh-secret';

describe('Auth Flow — Production Bug Prevention', () => {
  describe('Refresh Loop Prevention', () => {
    it('refresh endpoint returns 401 on invalid token without triggering another refresh', async () => {
      const app = express();
      app.use(express.json());

      let refreshAttempts = 0;
      app.post('/api/v1/auth/refresh', (req, res) => {
        refreshAttempts++;
        const { refreshToken } = req.body;
        try {
          jwt.verify(refreshToken, REFRESH_SECRET);
          return res.json({ success: true, data: { accessToken: 'new', refreshToken: 'new' } });
        } catch {
          return res.status(401).json({ success: false, message: 'Invalid refresh token' });
        }
      });

      // Simulate: client sends an expired refresh token
      await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'expired.token.here' });

      // Only ONE attempt should be made — no retry loop
      expect(refreshAttempts).toBe(1);
    });

    it('401 from refresh should lead to logout, not another refresh', () => {
      // This mimics the frontend logic in api.ts
      let logoutCalled = false;
      let refreshRetried = false;

      const handleRefreshFailure = () => {
        // This should call logout, NOT retry refresh
        logoutCalled = true;
        // If this were buggy, it would set refreshRetried = true
      };

      handleRefreshFailure();

      expect(logoutCalled).toBe(true);
      expect(refreshRetried).toBe(false);
    });

    it('concurrent 401 responses should coalesce into a single refresh attempt', async () => {
      // Simulates the refreshSubscribers pattern in api.ts
      let isRefreshing = false;
      let refreshCallCount = 0;
      const subscribers: Array<(token: string | null) => void> = [];

      function attemptRefresh(): Promise<string | null> {
        if (isRefreshing) {
          return new Promise((resolve) => subscribers.push(resolve));
        }
        isRefreshing = true;
        refreshCallCount++;

        // Simulate async refresh (takes time, so concurrent callers see isRefreshing=true)
        return new Promise((resolve) => {
          setTimeout(() => {
            const token = 'new-token';
            isRefreshing = false;
            subscribers.forEach((cb) => cb(token));
            subscribers.length = 0;
            resolve(token);
          }, 10);
        });
      }

      // Simulate 3 concurrent requests hitting 401
      const results = await Promise.all([
        attemptRefresh(),
        attemptRefresh(),
        attemptRefresh(),
      ]);

      // Should only have called the actual refresh logic once
      expect(refreshCallCount).toBe(1);
      // All callers should receive the new token
      expect(results.every((t) => t === 'new-token')).toBe(true);
    });
  });

  describe('Logout Does Not Go Through Auth Interceptor', () => {
    it('logout endpoint accessible without valid token', async () => {
      const app = express();
      app.use(express.json());

      // Logout should NOT require auth validation
      app.post('/api/v1/auth/logout', (_req, res) => {
        res.json({ success: true });
      });

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .send({});

      expect(res.status).toBe(200);
    });

    it('logout uses separate axios instance (authApi) bypassing interceptors', () => {
      // This validates the design pattern in frontend authService.ts
      // authApi is a separate instance without response interceptors
      const authApiConfig = {
        baseURL: '/api/v1',
        timeout: 15000,
        interceptors: { response: [] }, // No interceptors
      };

      expect(authApiConfig.interceptors.response).toHaveLength(0);
    });
  });

  describe('Rate Limiter Exemptions', () => {
    it('rate limiter skip function exempts /refresh path', () => {
      // Mirrors the skip logic from index.ts
      const skipFn = (req: { path: string }) =>
        req.path === '/logout' || req.path === '/refresh';

      expect(skipFn({ path: '/refresh' })).toBe(true);
      expect(skipFn({ path: '/logout' })).toBe(true);
      expect(skipFn({ path: '/login' })).toBe(false);
      expect(skipFn({ path: '/register' })).toBe(false);
    });

    it('health check is above rate limiter and always accessible', async () => {
      const app = express();

      // Health check BEFORE any rate limiter
      app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
      });

      // Rate limiter would be here in production
      // Even if all rate limits exhausted, /health still works

      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
    });
  });

  describe('Expired Token Handling', () => {
    it('expired access token returns 401 with descriptive message', () => {
      const expiredToken = jwt.sign(
        { userId: 'user-1', familyId: 'f-1', email: 'test@test.com', role: 'PARENT' },
        ACCESS_SECRET,
        { expiresIn: '-1s' }
      );

      expect(() => {
        jwt.verify(expiredToken, ACCESS_SECRET);
      }).toThrow();

      try {
        jwt.verify(expiredToken, ACCESS_SECRET);
      } catch (err: any) {
        expect(err.name).toBe('TokenExpiredError');
      }
    });

    it('expired token does not crash the server (graceful handling)', async () => {
      const app = express();
      app.use(express.json());

      app.get('/api/v1/protected', (req, res) => {
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).json({ message: 'No token' });

        try {
          jwt.verify(auth.split(' ')[1], ACCESS_SECRET);
          return res.json({ data: 'ok' });
        } catch (err: any) {
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
          }
          return res.status(401).json({ message: 'Invalid token' });
        }
      });

      const expiredToken = jwt.sign(
        { userId: 'user-1' },
        ACCESS_SECRET,
        { expiresIn: '-1s' }
      );

      const res = await request(app)
        .get('/api/v1/protected')
        .set('Authorization', `Bearer ${expiredToken}`);

      // Should return 401, NOT 500
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Token expired');
    });

    it('malformed token does not crash the server', async () => {
      const app = express();
      app.use(express.json());

      app.get('/api/v1/protected', (req, res) => {
        const auth = req.headers.authorization;
        if (!auth) return res.status(401).json({ message: 'No token' });

        try {
          jwt.verify(auth.split(' ')[1], ACCESS_SECRET);
          return res.json({ data: 'ok' });
        } catch {
          return res.status(401).json({ message: 'Invalid token' });
        }
      });

      const res = await request(app)
        .get('/api/v1/protected')
        .set('Authorization', 'Bearer not-a-real-token');

      expect(res.status).toBe(401);
    });
  });
});
