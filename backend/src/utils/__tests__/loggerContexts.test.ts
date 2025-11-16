import { describe, expect, it } from 'vitest';
import { dbContext, userContext } from '../loggerContexts.js';

describe('loggerContexts', () => {
  it('redacts emails inside the user context builder', () => {
    const context = userContext({
      userId: 'user-123',
      email: 'secure@example.com',
      role: 'admin',
    });

    expect(context.email).toBe('se***@example.com');
    expect(context.userId).toBe('user-123');
  });

  it('marks queries as slow when duration exceeds 1000ms', () => {
    const result = dbContext('SELECT * FROM products', 1200);
    expect(result.slow).toBe(true);
    expect(result.thresholdMs).toBe(1000);
  });
});
