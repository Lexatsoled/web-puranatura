export interface RateLimitConfig {
  maxRequests: number; // Número máximo de solicitudes
  timeWindow: number; // Ventana de tiempo en milisegundos
  retryAfter: number; // Tiempo de espera antes de reintentar en milisegundos
}

const defaultRateLimitConfig: RateLimitConfig = {
  maxRequests: 60,
  timeWindow: 60000,
  retryAfter: 1000,
};

export class RateLimiter {
  private requests: number[] = [];
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...defaultRateLimitConfig, ...config };
  }

  async checkRateLimit(): Promise<boolean> {
    const now = Date.now();

    // Limpiar solicitudes antiguas
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.config.timeWindow
    );

    // Verificar si excedemos el límite
    if (this.requests.length >= this.config.maxRequests) {
      return false;
    }

    // Registrar nueva solicitud
    this.requests.push(now);
    return true;
  }

  async waitForSlot(): Promise<void> {
    while (!(await this.checkRateLimit())) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.retryAfter)
      );
    }
  }
}

export default RateLimiter;
