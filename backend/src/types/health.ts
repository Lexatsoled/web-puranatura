export type HealthStatus = 'healthy' | 'degraded' | 'disabled';

export interface HealthCheckResult {
  name: string;
  healthy: boolean;
  error?: string;
  durationMs?: number;
  details?: Record<string, unknown>;
}

export interface HealthSnapshot {
  checks: HealthCheckResult[];
  status: HealthStatus;
  timestamp: string;
}

export interface HealthChecksService {
  getSnapshot: () => HealthSnapshot;
  runChecks: () => Promise<HealthSnapshot>;
}

declare module 'fastify' {
  interface FastifyInstance {
    healthChecks?: HealthChecksService;
  }
}
