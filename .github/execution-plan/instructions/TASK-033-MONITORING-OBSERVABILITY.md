# TASK-033: Monitoring y Observability

## 📋 INFORMACIÓN

**ID**: TASK-033 | **Fase**: 3 | **Prioridad**: ALTA | **Estimación**: 4h

## 🎯 OBJETIVO

Implementar Sentry para error tracking, Grafana dashboards y alerting para monitoreo completo.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Sentry Frontend

**Archivo**: `frontend/src/sentry.ts`

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      
      // Performance
      tracesSampleRate: 0.1, // 10% de transacciones
      
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0, // 100% en errores
      
      // Environment
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION,
      
      // Filtros
      beforeSend(event, hint) {
        // No enviar errores de extensiones
        if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) {
          return null;
        }
        return event;
      },
      
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
      ],
    });
  }
}

// Error boundaries
export const SentryErrorBoundary = Sentry.ErrorBoundary;
```

**Archivo**: `frontend/src/main.tsx`

```typescript
import { initSentry, SentryErrorBoundary } from './sentry';

initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SentryErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </SentryErrorBoundary>
  </React.StrictMode>
);
```

### Paso 2: Sentry Backend

**Archivo**: `backend/src/plugins/sentry.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export const sentryPlugin: FastifyPluginAsync = async (fastify) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app: fastify.server }),
        new ProfilingIntegration(),
      ],
      
      tracesSampleRate: 0.1,
      profilesSampleRate: 0.1,
      
      environment: process.env.NODE_ENV,
      release: process.env.APP_VERSION,
    });

    // Request handler
    fastify.addHook('onRequest', async (request) => {
      Sentry.setContext('request', {
        url: request.url,
        method: request.method,
        headers: request.headers,
      });
    });

    // Error handler
    fastify.addHook('onError', async (request, reply, error) => {
      Sentry.captureException(error, {
        contexts: {
          request: {
            url: request.url,
            method: request.method,
            body: request.body,
          },
        },
      });
    });

    fastify.log.info('Sentry initialized');
  }
};
```

### Paso 3: Prometheus Metrics

**Archivo**: `backend/src/plugins/prometheus.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import client from 'prom-client';

const register = new client.Registry();

// Métricas por defecto
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
});

const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

export const prometheusPlugin: FastifyPluginAsync = async (fastify) => {
  // Track request duration
  fastify.addHook('onRequest', async (request) => {
    (request as any).startTime = Date.now();
    activeConnections.inc();
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const duration = (Date.now() - (request as any).startTime) / 1000;
    
    httpRequestDuration.observe(
      {
        method: request.method,
        route: request.routerPath || 'unknown',
        status_code: reply.statusCode,
      },
      duration
    );

    httpRequestTotal.inc({
      method: request.method,
      route: request.routerPath || 'unknown',
      status_code: reply.statusCode,
    });

    activeConnections.dec();
  });

  // Metrics endpoint
  fastify.get('/metrics', async (request, reply) => {
    reply.type('text/plain');
    return register.metrics();
  });
};

export { dbQueryDuration };
```

### Paso 4: Grafana Dashboard

**Archivo**: `monitoring/grafana-dashboard.json`

```json
{
  "dashboard": {
    "title": "Pureza Naturalis Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Active Connections",
        "targets": [
          {
            "expr": "active_connections"
          }
        ],
        "type": "gauge"
      },
      {
        "title": "Memory Usage",
        "targets": [
          {
            "expr": "process_resident_memory_bytes"
          }
        ],
        "type": "graph"
      },
      {
        "title": "CPU Usage",
        "targets": [
          {
            "expr": "rate(process_cpu_seconds_total[1m]) * 100"
          }
        ],
        "type": "graph"
      }
    ]
  }
}
```

### Paso 5: Alerting con Prometheus

**Archivo**: `monitoring/alerts.yml`

```yaml
groups:
  - name: api_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "P95 response time is {{ $value }} seconds"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes > 500000000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }} bytes"

      - alert: APIDown
        expr: up{job="purezanaturalis-api"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "API is down"
          description: "The API has been down for more than 1 minute"
```

### Paso 6: Custom Logging con Pino

**Archivo**: `backend/src/config/logger.ts`

```typescript
import pino from 'pino';
import pinoHttp from 'pino-http';

const targets = [];

// Console output en desarrollo
if (process.env.NODE_ENV !== 'production') {
  targets.push({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  });
}

// Loki en producción
if (process.env.NODE_ENV === 'production') {
  targets.push({
    target: 'pino-loki',
    options: {
      batching: true,
      interval: 5,
      host: process.env.LOKI_URL,
      labels: {
        application: 'purezanaturalis',
        environment: process.env.NODE_ENV,
      },
    },
  });
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets,
  },
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
});
```

### Paso 7: Uptime Monitoring

**Archivo**: `scripts/uptime-monitor.ts`

```typescript
#!/usr/bin/env node
import axios from 'axios';

const ENDPOINTS = [
  'https://api.purezanaturalis.com/health',
  'https://api.purezanaturalis.com/ready',
  'https://purezanaturalis.com',
];

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function checkEndpoint(url: string) {
  try {
    const start = Date.now();
    const response = await axios.get(url, { timeout: 5000 });
    const duration = Date.now() - start;

    return {
      url,
      status: 'up',
      code: response.status,
      duration,
    };
  } catch (error) {
    return {
      url,
      status: 'down',
      code: (error as any).response?.status || 0,
      duration: 0,
      error: (error as any).message,
    };
  }
}

async function notifySlack(results: any[]) {
  const downEndpoints = results.filter(r => r.status === 'down');
  
  if (downEndpoints.length > 0 && WEBHOOK_URL) {
    await axios.post(WEBHOOK_URL, {
      text: '🚨 Endpoints down detected',
      attachments: downEndpoints.map(e => ({
        color: 'danger',
        text: `${e.url}: ${e.error}`,
      })),
    });
  }
}

async function monitor() {
  console.log('🔍 Checking endpoints...');
  
  const results = await Promise.all(
    ENDPOINTS.map(checkEndpoint)
  );

  results.forEach(r => {
    const emoji = r.status === 'up' ? '✅' : '❌';
    console.log(`${emoji} ${r.url} - ${r.code} (${r.duration}ms)`);
  });

  await notifySlack(results);
}

// Run every 5 minutes
setInterval(monitor, 5 * 60 * 1000);
monitor();
```

### Paso 8: docker-compose para Stack

**Archivo**: `docker-compose.monitoring.yml`

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/alerts.yml:/etc/prometheus/alerts.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana-dashboard.json:/etc/grafana/provisioning/dashboards/dashboard.json

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./monitoring/promtail-config.yml:/etc/promtail/config.yml

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Sentry error tracking
- [x] Prometheus metrics
- [x] Grafana dashboards
- [x] Alerting configurado
- [x] Custom logging (Pino + Loki)
- [x] Uptime monitoring
- [x] Docker stack completo

## 🧪 VALIDACIÓN

```bash
# Start monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# View Prometheus
open http://localhost:9090

# View Grafana
open http://localhost:3001

# Test Sentry
# Trigger error en app y verificar en Sentry dashboard

# View metrics
curl http://localhost:3000/metrics

# Run uptime monitor
tsx scripts/uptime-monitor.ts
```

---

**Status**: COMPLETO ✅
