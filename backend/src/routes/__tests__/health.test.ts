import type { FastifyInstance } from 'fastify';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const healthyResult = (name: string) => ({ name, healthy: true });

const databaseMock = vi.fn();
const redisMock = vi.fn();
const filesystemMock = vi.fn();
const memoryMock = vi.fn();

vi.mock('../../utils/healthCheckers.js', () => ({
  checkDatabase: () => databaseMock(),
  checkRedis: () => redisMock(),
  checkFilesystem: () => filesystemMock(),
  checkMemory: () => memoryMock(),
}));
vi.resetModules();

let buildApp: typeof import('../../app.js').buildApp;
let app: FastifyInstance;

const setHealthyDefaults = () => {
  databaseMock.mockResolvedValue(healthyResult('database'));
  redisMock.mockResolvedValue(healthyResult('redis'));
  filesystemMock.mockResolvedValue(healthyResult('filesystem'));
  memoryMock.mockReturnValue(healthyResult('memory'));
};

describe('Health endpoints', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET =
      process.env.JWT_SECRET || 'test_jwt_secret_value_that_is_long_enough_123456789';
    process.env.JWT_REFRESH_SECRET =
      process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_value_that_is_long_enough_987654321';
    process.env.COOKIE_SECRET = process.env.COOKIE_SECRET ?? 'cookie_secret_for_tests_123456789';
    process.env.DATABASE_URL = process.env.DATABASE_URL || ':memory:';
    process.env.REDIS_ENABLED = 'false';

    vi.resetModules();
    const module = await import('../../app.js');
    buildApp = module.buildApp;
    app = await buildApp({ logger: false });
    await app.ready();
  });

  beforeEach(async () => {
    setHealthyDefaults();
    await app.healthChecks?.runChecks();
  });

  afterEach(() => {
    databaseMock.mockReset();
    redisMock.mockReset();
    filesystemMock.mockReset();
    memoryMock.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 when every check is healthy', async () => {
    await app.healthChecks?.runChecks();
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('healthy');
    expect(Array.isArray(body.checks)).toBe(true);
    expect(body.checks.length).toBeGreaterThanOrEqual(4);
  });

  it('should return 503 when the database check fails', async () => {
    databaseMock.mockResolvedValue({ name: 'database', healthy: false, error: 'boom' });
    await app.healthChecks?.runChecks();

    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(503);
    expect(response.json().status).toBe('degraded');
  });

  it('should return 503 if redis check fails', async () => {
    redisMock.mockResolvedValue({ name: 'redis', healthy: false, error: 'redis down' });
    await app.healthChecks?.runChecks();

    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(503);
    const redisCheck = response.json().checks.find((check: any) => check.name === 'redis');
    expect(redisCheck.healthy).toBe(false);
  });

  it('should verify readiness by checking critical dependencies', async () => {
    redisMock.mockResolvedValue({ name: 'redis', healthy: false, error: 'redis down' });
    await app.healthChecks?.runChecks();

    const response = await app.inject({ method: 'GET', url: '/health/ready' });
    expect(response.statusCode).toBe(503);
    expect(response.json().status).toBe('not ready');
  });

  it('should always return 200 for the liveness endpoint', async () => {
    await app.healthChecks?.runChecks();
    const response = await app.inject({ method: 'GET', url: '/health/live' });
    expect(response.statusCode).toBe(200);
    expect(response.json().status).toBe('alive');
  });
});
