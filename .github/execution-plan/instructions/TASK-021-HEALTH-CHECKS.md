# TASK-021: Health Checks y Monitoring

## 📋 INFORMACIÓN

**ID**: TASK-021 | **Fase**: 2 | **Prioridad**: ALTA | **Estimación**: 2h

## 🎯 OBJETIVO

Implementar endpoints /health, /ready, /metrics para Kubernetes y monitoreo.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Plugin de Health Checks

**Archivo**: `backend/src/plugins/health.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { getConnectionPool } from '../db/index.js';

export const healthPlugin: FastifyPluginAsync = async (fastify) => {
  // Liveness probe - servidor respondiendo
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Readiness probe - servidor listo para tráfico
  fastify.get('/ready', async (request, reply) => {
    const checks = {
      database: false,
      memory: false,
    };

    try {
      // Check DB
      const pool = getConnectionPool();
      await pool.withConnection(db => {
        db.prepare('SELECT 1').get();
      });
      checks.database = true;

      // Check memory
      const usage = process.memoryUsage();
      const maxHeap = 512 * 1024 * 1024; // 512MB
      checks.memory = usage.heapUsed < maxHeap;

      const ready = Object.values(checks).every(c => c);

      return reply.code(ready ? 200 : 503).send({
        status: ready ? 'ready' : 'not ready',
        checks,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return reply.code(503).send({
        status: 'not ready',
        checks,
        error: (error as Error).message,
      });
    }
  });

  // Metrics endpoint (Prometheus format)
  fastify.get('/metrics', async () => {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const pool = getConnectionPool();
    const poolStats = pool.getStats();

    return `# HELP process_cpu_user_seconds_total User CPU time
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total ${cpuUsage.user / 1000000}

# HELP process_cpu_system_seconds_total System CPU time
# TYPE process_cpu_system_seconds_total counter
process_cpu_system_seconds_total ${cpuUsage.system / 1000000}

# HELP nodejs_heap_size_used_bytes Heap used
# TYPE nodejs_heap_size_used_bytes gauge
nodejs_heap_size_used_bytes ${memUsage.heapUsed}

# HELP nodejs_heap_size_total_bytes Heap total
# TYPE nodejs_heap_size_total_bytes gauge
nodejs_heap_size_total_bytes ${memUsage.heapTotal}

# HELP db_pool_connections_active Active DB connections
# TYPE db_pool_connections_active gauge
db_pool_connections_active ${poolStats.inUse}

# HELP db_pool_connections_idle Idle DB connections
# TYPE db_pool_connections_idle gauge
db_pool_connections_idle ${poolStats.available}

# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total ${(fastify as any).metrics?.requestCount || 0}
`;
  });
};
```

### Paso 2: Middleware de Métricas

**Archivo**: `backend/src/plugins/metrics.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';

interface Metrics {
  requestCount: number;
  requestDuration: number[];
  errorCount: number;
  statusCodes: Map<number, number>;
}

export const metricsPlugin: FastifyPluginAsync = async (fastify) => {
  const metrics: Metrics = {
    requestCount: 0,
    requestDuration: [],
    errorCount: 0,
    statusCodes: new Map(),
  };

  // Exponer métricas en fastify instance
  (fastify as any).metrics = metrics;

  fastify.addHook('onRequest', async (request) => {
    (request as any).startTime = Date.now();
  });

  fastify.addHook('onResponse', async (request, reply) => {
    metrics.requestCount++;

    const duration = Date.now() - (request as any).startTime;
    metrics.requestDuration.push(duration);

    // Mantener solo últimas 1000 mediciones
    if (metrics.requestDuration.length > 1000) {
      metrics.requestDuration.shift();
    }

    // Contar status codes
    const count = metrics.statusCodes.get(reply.statusCode) || 0;
    metrics.statusCodes.set(reply.statusCode, count + 1);

    // Contar errores
    if (reply.statusCode >= 500) {
      metrics.errorCount++;
    }
  });

  // Endpoint de stats
  fastify.get('/api/stats', {
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async () => {
    const avgDuration = metrics.requestDuration.length > 0
      ? metrics.requestDuration.reduce((a, b) => a + b, 0) / metrics.requestDuration.length
      : 0;

    return {
      requests: {
        total: metrics.requestCount,
        avgDuration: Math.round(avgDuration),
        errors: metrics.errorCount,
      },
      statusCodes: Object.fromEntries(metrics.statusCodes),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    };
  });
};
```

### Paso 3: Configuración Kubernetes

**Archivo**: `k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: purezanaturalis-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: purezanaturalis
  template:
    metadata:
      labels:
        app: purezanaturalis
    spec:
      containers:
      - name: backend
        image: purezanaturalis/backend:latest
        ports:
        - containerPort: 3000
        
        # Liveness probe
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        # Readiness probe
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Paso 4: Prometheus ServiceMonitor

**Archivo**: `k8s/servicemonitor.yaml`

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: purezanaturalis-metrics
spec:
  selector:
    matchLabels:
      app: purezanaturalis
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

### Paso 5: Script de Health Check

**Archivo**: `scripts/health-check.sh`

```bash
#!/bin/bash

URL="${1:-http://localhost:3000}"

echo "🔍 Checking health endpoints..."

# Health check
echo -n "Health: "
curl -s "${URL}/health" | jq -r '.status'

# Readiness check
echo -n "Ready: "
curl -s "${URL}/ready" | jq -r '.status'

# Metrics
echo -e "\n📊 Metrics:"
curl -s "${URL}/metrics" | grep -E "^(process_cpu|nodejs_heap|db_pool)"
```

### Paso 6: Tests

**Archivo**: `backend/src/__tests__/health.test.ts`

```typescript
import { test } from 'tap';
import { build } from '../app.js';

test('Health endpoints', async (t) => {
  const app = await build();

  t.test('/health should return ok', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    t.equal(response.statusCode, 200);
    const body = response.json();
    t.equal(body.status, 'ok');
    t.ok(body.timestamp);
    t.type(body.uptime, 'number');
  });

  t.test('/ready should check dependencies', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/ready',
    });

    t.ok([200, 503].includes(response.statusCode));
    const body = response.json();
    t.ok(['ready', 'not ready'].includes(body.status));
    t.ok(body.checks);
    t.type(body.checks.database, 'boolean');
  });

  t.test('/metrics should return Prometheus format', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/metrics',
    });

    t.equal(response.statusCode, 200);
    t.ok(response.body.includes('# HELP'));
    t.ok(response.body.includes('process_cpu_user_seconds_total'));
  });

  await app.close();
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] /health endpoint (liveness)
- [x] /ready endpoint (readiness)
- [x] /metrics endpoint (Prometheus)
- [x] Kubernetes probes configurados
- [x] Métricas de CPU, memoria, DB
- [x] Tests de health checks

## 🧪 VALIDACIÓN

```bash
# Health check
curl http://localhost:3000/health

# Readiness check
curl http://localhost:3000/ready

# Metrics
curl http://localhost:3000/metrics

# Script automatizado
bash scripts/health-check.sh http://localhost:3000
```

---

**Status**: COMPLETO ✅
