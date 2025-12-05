export type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface BreakerConfig {
  failureThreshold?: number;
  windowMs?: number;
  openTimeoutMs?: number;
  halfOpenProbes?: number;
}

type ResolvedConfig = {
  failureThreshold: number;
  windowMs: number;
  openTimeoutMs: number;
  halfOpenProbes: number;
};

const defaultConfig: ResolvedConfig = {
  failureThreshold: 5,
  windowMs: 30_000,
  openTimeoutMs: 60_000,
  halfOpenProbes: 2,
};

export class CatalogBreaker {
  private state: BreakerState = 'CLOSED';
  private failures: number[] = [];
  private openedAt?: number;
  private halfOpenAttempts = 0;
  private config: ResolvedConfig;

  constructor(config: BreakerConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  shouldShortCircuit(): boolean {
    if (this.state === 'OPEN') {
      const elapsed = Date.now() - (this.openedAt || 0);
      if (elapsed >= this.config.openTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.halfOpenAttempts = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.halfOpenAttempts += 1;
      if (this.halfOpenAttempts >= this.config.halfOpenProbes) {
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  recordFailure(): void {
    const now = Date.now();
    this.failures = this.failures.filter(
      (t) => now - t <= this.config.windowMs
    );
    this.failures.push(now);

    if (this.state === 'HALF_OPEN') {
      this.trip();
      return;
    }

    if (this.failures.length >= this.config.failureThreshold) {
      this.trip();
    }
  }

  private trip(): void {
    this.state = 'OPEN';
    this.openedAt = Date.now();
    this.halfOpenAttempts = 0;
    // logging opcional aquí
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failures = [];
    this.halfOpenAttempts = 0;
    // logging opcional aquí
  }
}
