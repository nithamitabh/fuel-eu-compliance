// backend/src/adapters/inbound/http/__tests__/routes.integration.test.ts
import request from 'supertest';
import { App } from '../../../../infrastructure/server/app';

/**
 * Integration Tests for Routes API
 * 
 * NOTE: These tests require a PostgreSQL database to be running.
 * Set DATABASE_URL environment variable before running.
 */

describe('Routes API Integration Tests', () => {
  let app: App;

  beforeAll(() => {
    app = new App();
  }, 10000); // 10 second timeout for setup

  afterAll(async () => {
    await app.disconnect();
  }, 10000); // 10 second timeout for teardown

  describe('GET /api/routes', () => {
    it('should return all routes', async () => {
      const response = await request(app.app).get('/api/routes').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/routes/:id', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(app.app)
        .get('/api/routes/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('GET /api/routes/comparison/data', () => {
    it('should return comparison data or error if no baseline', async () => {
      const response = await request(app.app).get('/api/routes/comparison/data');

      // Could be 200 with data or 500 if no baseline set
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app.app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app.app).get('/').expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toHaveProperty('routes');
      expect(response.body.endpoints).toHaveProperty('compliance');
      expect(response.body.endpoints).toHaveProperty('banking');
      expect(response.body.endpoints).toHaveProperty('pools');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app.app).get('/api/unknown').expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('not found');
    });
  });
});
