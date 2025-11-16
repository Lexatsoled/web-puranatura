import { describe, expect, it } from 'vitest';
import { config } from '../../config/index.js';
import { logger } from '../logger.js';

describe('logger configuration', () => {
  it('respects configured log level', () => {
    expect(logger.level).toBe(config.LOG_LEVEL ?? 'info');
  });
});
