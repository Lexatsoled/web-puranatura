# TASK-027: Performance Monitoring

## 📋 INFORMACIÓN

**ID**: TASK-027 | **Fase**: 3 | **Prioridad**: ALTA | **Estimación**: 3h

## 🎯 OBJETIVO

Implementar monitoreo de Web Vitals, Lighthouse CI, bundle analyzer y performance budgets.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Web Vitals Tracking

**Archivo**: `frontend/src/utils/webVitals.ts`

```typescript
import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

interface AnalyticsPayload {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Enviar métricas al backend
 */
function sendToAnalytics({ name, value, rating, delta, id }: AnalyticsPayload) {
  const body = JSON.stringify({ name, value, rating, delta, id });
  
  // Usar sendBeacon para garantizar envío
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    });
  }
}

/**
 * Iniciar tracking de Web Vitals
 */
export function initWebVitals() {
  onCLS((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onFID((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onFCP((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onLCP((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onTTFB((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onINP((metric: Metric) => sendToAnalytics(formatMetric(metric)));
}

function formatMetric(metric: Metric): AnalyticsPayload {
  return {
    name: metric.name,
    value: metric.value,
    rating: metric.rating!,
    delta: metric.delta,
    id: metric.id,
  };
}

/**
 * Log Web Vitals en consola (dev)
 */
export function logWebVitals() {
  if (import.meta.env.DEV) {
    onCLS(console.log);
    onFID(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
    onINP(console.log);
  }
}
```

### Paso 2: Performance Observer

**Archivo**: `frontend/src/utils/performanceMonitor.ts`

```typescript
/**
 * Monitorear long tasks (> 50ms)
 */
export function observeLongTasks() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        console.warn('Long task detected:', {
          duration: entry.duration,
          startTime: entry.startTime,
        });
        
        // Enviar al backend
        fetch('/api/analytics/long-tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: entry.duration,
            startTime: entry.startTime,
          }),
        });
      }
    }
  });

  observer.observe({ entryTypes: ['longtask'] });
}

/**
 * Monitorear layout shifts
 */
export function observeLayoutShifts() {
  if (!('PerformanceObserver' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const cls = entry as any;
      if (cls.value > 0.1) {
        console.warn('Layout shift:', cls.value, cls.sources);
      }
    }
  });

  observer.observe({ type: 'layout-shift', buffered: true });
}

/**
 * Medir tiempo de carga de recursos
 */
export function measureResourceTiming() {
  const resources = performance.getEntriesByType('resource');
  
  const slowResources = resources.filter(r => r.duration > 1000);
  
  if (slowResources.length > 0) {
    console.warn('Slow resources:', slowResources.map(r => ({
      name: r.name,
      duration: r.duration,
    })));
  }
}
```

### Paso 3: Bundle Analyzer

**Archivo**: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    reportCompressedSize: true,
  },
});
```

### Paso 4: Performance Budgets

**Archivo**: `frontend/.lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "max-potential-fid": ["error", { "maxNumericValue": 100 }],
        "speed-index": ["error", { "maxNumericValue": 3000 }],
        "interactive": ["error", { "maxNumericValue": 3500 }],
        
        "performance-budget": ["error", {
          "maxNumericValue": 0,
          "budgets": [
            {
              "resourceType": "script",
              "budget": 300
            },
            {
              "resourceType": "stylesheet",
              "budget": 50
            },
            {
              "resourceType": "image",
              "budget": 200
            },
            {
              "resourceType": "total",
              "budget": 600
            }
          ]
        }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### Paso 5: Backend Analytics Endpoint

**Archivo**: `backend/src/routes/analytics.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

const vitalsStore: WebVital[] = [];

export const analyticsRoutes: FastifyPluginAsync = async (fastify) => {
  // Recibir Web Vitals
  fastify.post('/api/analytics/vitals', async (request, reply) => {
    const vital = request.body as WebVital;
    
    vitalsStore.push({
      ...vital,
      timestamp: Date.now(),
      userAgent: request.headers['user-agent'],
      url: request.headers.referer,
    } as any);

    // Mantener solo últimos 1000
    if (vitalsStore.length > 1000) {
      vitalsStore.shift();
    }

    return reply.code(204).send();
  });

  // Ver métricas (admin)
  fastify.get('/api/admin/analytics/vitals', {
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async () => {
    const metrics = {
      lcp: calculateMetric('LCP'),
      fid: calculateMetric('FID'),
      cls: calculateMetric('CLS'),
      fcp: calculateMetric('FCP'),
      ttfb: calculateMetric('TTFB'),
      inp: calculateMetric('INP'),
    };

    return metrics;
  });
});

function calculateMetric(name: string) {
  const values = vitalsStore
    .filter(v => v.name === name)
    .map(v => v.value);

  if (values.length === 0) return null;

  return {
    p50: percentile(values, 0.5),
    p75: percentile(values, 0.75),
    p95: percentile(values, 0.95),
    count: values.length,
  };
}

function percentile(arr: number[], p: number): number {
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * p) - 1;
  return sorted[index];
}
```

### Paso 6: GitHub Actions CI

**Archivo**: `.github/workflows/lighthouse-ci.yml`

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

### Paso 7: Performance Dashboard

**Archivo**: `frontend/src/pages/AdminPerformance.tsx`

```typescript
import { useEffect, useState } from 'react';

interface Metrics {
  lcp: MetricData;
  fid: MetricData;
  cls: MetricData;
}

interface MetricData {
  p50: number;
  p75: number;
  p95: number;
  count: number;
}

export function AdminPerformance() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics/vitals')
      .then(r => r.json())
      .then(setMetrics);
  }, []);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="performance-dashboard">
      <h1>Performance Metrics</h1>
      
      <MetricCard
        name="Largest Contentful Paint (LCP)"
        data={metrics.lcp}
        threshold={{ good: 2500, poor: 4000 }}
        unit="ms"
      />
      
      <MetricCard
        name="First Input Delay (FID)"
        data={metrics.fid}
        threshold={{ good: 100, poor: 300 }}
        unit="ms"
      />
      
      <MetricCard
        name="Cumulative Layout Shift (CLS)"
        data={metrics.cls}
        threshold={{ good: 0.1, poor: 0.25 }}
        unit=""
      />
    </div>
  );
}

function MetricCard({ name, data, threshold, unit }: any) {
  const getRating = (value: number) => {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  return (
    <div className="metric-card">
      <h3>{name}</h3>
      <div className={`metric-value ${getRating(data.p75)}`}>
        {data.p75.toFixed(2)}{unit}
        <span className="percentile">P75</span>
      </div>
      <div className="metric-details">
        <span>P50: {data.p50.toFixed(2)}{unit}</span>
        <span>P95: {data.p95.toFixed(2)}{unit}</span>
        <span>Count: {data.count}</span>
      </div>
    </div>
  );
}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Web Vitals tracking
- [x] Performance Observer
- [x] Bundle analyzer
- [x] Lighthouse CI
- [x] Performance budgets
- [x] Analytics backend
- [x] Dashboard admin
- [x] CI/CD integration

## 🧪 VALIDACIÓN

```bash
# Run Lighthouse
npx lighthouse http://localhost:3000 --view

# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Bundle analysis
npm run build && npm run analyze

# Ver Web Vitals en consola
# (abrir DevTools > Console)
```

## 📊 TARGETS

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Bundle: < 300KB

---

**Status**: COMPLETO ✅
