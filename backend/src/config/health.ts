import { config } from './index.js';

export const healthConfig = {
  enabled: config.HEALTH_CHECK_ENABLED,
  interval: Math.max(1000, config.HEALTH_CHECK_INTERVAL),
  databaseTimeout: 5000,
  redisTimeout: 3000,
  filesystemTimeout: 2000,
  memoryThresholdRatio: 0.9,
};
