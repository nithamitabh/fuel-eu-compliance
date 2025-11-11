// backend/src/adapters/inbound/http/__tests__/compliance.integration.test.ts
import request from 'supertest';
import { App } from '../../../../infrastructure/server/app';

/**
 * Integration Tests for Compliance API
 * 
 * NOTE: These tests require a PostgreSQL database to be running.
 * Set DATABASE_URL environment variable before running:
 * DATABASE_URL="postgresql://user:password@localhost:5432/test_db" npm test integration
 * 
 * To skip these tests, run: npm test -- --testPathIgnorePatterns=integration
 */

describe.skip('Compliance API Integration Tests', () => {
  let app: App;

  beforeAll(() => {
    app = new App();
  });

  afterAll(async () => {
    await app.disconnect();
  });

  describe('GET /api/compliance/ship/:shipId/year/:year', () => {
    it('should return 404 for non-existent compliance record', async () => {
      const response = await request(app.app)
        .get('/api/compliance/ship/TEST_SHIP/year/2025')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('POST /api/compliance/compute', () => {
    it('should return 400 when shipId or year is missing', async () => {
      const response = await request(app.app)
        .post('/api/compliance/compute')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('required');
    });

    it('should return error when no routes found for ship', async () => {
      const response = await request(app.app)
        .post('/api/compliance/compute')
        .send({ shipId: 'NON_EXISTENT', year: 2025 })
        .expect(500);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/compliance/ship/:shipId', () => {
    it('should return empty array for ship with no compliance records', async () => {
      const response = await request(app.app)
        .get('/api/compliance/ship/NEW_SHIP')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.count).toBe(0);
    });
  });

  describe('GET /api/compliance/year/:year', () => {
    it('should return compliance records for a year', async () => {
      const response = await request(app.app)
        .get('/api/compliance/year/2025')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
