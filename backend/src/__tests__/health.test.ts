import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Create a minimal app that mimics the health endpoint from index.ts
function createApp() {
  const app = express();
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  return app;
}

describe('Health Check Endpoint', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createApp();
  });

  it('should return 200 with status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should include a valid ISO timestamp', async () => {
    const response = await request(app).get('/health');
    expect(response.body.timestamp).toBeDefined();
    const date = new Date(response.body.timestamp);
    expect(date.toISOString()).toBe(response.body.timestamp);
  });

  it('should respond quickly (no DB dependency)', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);
  });
});
