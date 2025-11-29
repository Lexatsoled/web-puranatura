import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../../src/utils/rateLimiter';

describe('RateLimiter', () => {
  it('allows requests up to maxRequests within timeWindow', async () => {
    const limiter = new RateLimiter({
      maxRequests: 2,
      timeWindow: 200,
      retryAfter: 10,
    });

    const r1 = await limiter.checkRateLimit();
    const r2 = await limiter.checkRateLimit();

    expect(r1).toBe(true);
    expect(r2).toBe(true);
    // third should be rejected
    const r3 = await limiter.checkRateLimit();
    expect(r3).toBe(false);
  });

  it('waitForSlot resolves when window moves forward', async () => {
    const limiter = new RateLimiter({
      maxRequests: 1,
      timeWindow: 50,
      retryAfter: 10,
    });
    // consume the single slot
    const ok = await limiter.checkRateLimit();
    expect(ok).toBe(true);

    const start = Date.now();
    // Should block until a slot is free
    await limiter.waitForSlot();
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(40);
  });
});
