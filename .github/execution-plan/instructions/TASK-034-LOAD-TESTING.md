# TASK-034: Load Testing

## 📋 INFORMACIÓN

**ID**: TASK-034 | **Fase**: 3 | **Prioridad**: MEDIA | **Estimación**: 3h

## 🎯 OBJETIVO

Implementar load testing con k6, identificar bottlenecks y optimizar capacidad del sistema.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Instalar k6

```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Paso 2: Basic Load Test

**Archivo**: `k6/load-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp-up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Spike to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
    errors: ['rate<0.1'],              // Custom error rate < 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Homepage
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    'homepage status 200': (r) => r.status === 200,
    'homepage load time < 1s': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(1);

  // Products list
  res = http.get(`${BASE_URL}/api/products`);
  check(res, {
    'products status 200': (r) => r.status === 200,
    'products has data': (r) => JSON.parse(r.body).data.length > 0,
  }) || errorRate.add(1);

  sleep(2);

  // Product detail
  const products = JSON.parse(res.body).data;
  if (products.length > 0) {
    const productId = products[0].id;
    res = http.get(`${BASE_URL}/api/products/${productId}`);
    check(res, {
      'product detail status 200': (r) => r.status === 200,
    }) || errorRate.add(1);
  }

  sleep(1);
}
```

### Paso 3: Spike Test

**Archivo**: `k6/spike-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 1000 }, // Sudden spike
    { duration: '3m', target: 1000 },
    { duration: '10s', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  http.get(`${BASE_URL}/api/products`);
  sleep(1);
}
```

### Paso 4: Stress Test

**Archivo**: `k6/stress-test.js`

```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'], // 5% error tolerance
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/products`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
```

### Paso 5: Soak Test (Endurance)

**Archivo**: `k6/soak-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 100 },
    { duration: '8h', target: 100 }, // Long duration
    { duration: '5m', target: 0 },
  ],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  http.get(`${BASE_URL}/api/products`);
  sleep(3);
}
```

### Paso 6: Scenario-Based Test

**Archivo**: `k6/scenario-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    browse_products: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 100 },
        { duration: '10m', target: 100 },
        { duration: '5m', target: 0 },
      ],
      gracefulRampDown: '30s',
      exec: 'browseProducts',
    },
    search_products: {
      executor: 'constant-vus',
      vus: 50,
      duration: '20m',
      exec: 'searchProducts',
    },
    add_to_cart: {
      executor: 'per-vu-iterations',
      vus: 20,
      iterations: 100,
      maxDuration: '20m',
      exec: 'addToCart',
    },
  },
  thresholds: {
    'http_req_duration{scenario:browse_products}': ['p(95)<500'],
    'http_req_duration{scenario:search_products}': ['p(95)<300'],
    'http_req_duration{scenario:add_to_cart}': ['p(95)<400'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export function browseProducts() {
  http.get(`${BASE_URL}/api/products`);
  sleep(2);
}

export function searchProducts() {
  http.get(`${BASE_URL}/api/search?q=vitamina`);
  sleep(1);
}

export function addToCart() {
  const res = http.get(`${BASE_URL}/api/products`);
  const products = JSON.parse(res.body).data;
  
  if (products.length > 0) {
    http.post(`${BASE_URL}/api/cart`, JSON.stringify({
      productId: products[0].id,
      quantity: 1,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  sleep(3);
}
```

### Paso 7: Scripts de Ejecución

**Archivo**: `package.json`

```json
{
  "scripts": {
    "load-test": "k6 run k6/load-test.js",
    "load-test:prod": "k6 run k6/load-test.js --env BASE_URL=https://api.purezanaturalis.com",
    "spike-test": "k6 run k6/spike-test.js",
    "stress-test": "k6 run k6/stress-test.js",
    "soak-test": "k6 run k6/soak-test.js",
    "scenario-test": "k6 run k6/scenario-test.js",
    "load-test:cloud": "k6 cloud k6/load-test.js"
  }
}
```

### Paso 8: CI Integration

**Archivo**: `.github/workflows/load-test.yml`

```yaml
name: Load Test

on:
  schedule:
    - cron: '0 2 * * 0' # Weekly on Sundays at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup k6
        run: |
          sudo gpg -k
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      
      - name: Run load test
        run: k6 run k6/load-test.js --out json=results.json
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: results.json
      
      - name: Analyze results
        run: |
          jq '.metrics.http_req_duration | {avg: .values.avg, p95: .values["p(95)"], p99: .values["p(99)"]}' results.json
```

### Paso 9: Análisis de Resultados

**Archivo**: `scripts/analyze-load-test.js`

```javascript
const fs = require('fs');

const results = JSON.parse(fs.readFileSync('results.json', 'utf8'));

// Extract metrics
const metrics = {
  requests: {
    total: results.metrics.http_reqs.values.count,
    rate: results.metrics.http_reqs.values.rate,
  },
  duration: {
    avg: results.metrics.http_req_duration.values.avg,
    p95: results.metrics.http_req_duration.values['p(95)'],
    p99: results.metrics.http_req_duration.values['p(99)'],
    max: results.metrics.http_req_duration.values.max,
  },
  errors: {
    rate: results.metrics.http_req_failed.values.rate * 100,
  },
};

console.log('📊 Load Test Results');
console.log('====================');
console.log(`Total Requests: ${metrics.requests.total}`);
console.log(`Request Rate: ${metrics.requests.rate.toFixed(2)} req/s`);
console.log(`Avg Duration: ${metrics.duration.avg.toFixed(2)}ms`);
console.log(`P95 Duration: ${metrics.duration.p95.toFixed(2)}ms`);
console.log(`P99 Duration: ${metrics.duration.p99.toFixed(2)}ms`);
console.log(`Error Rate: ${metrics.errors.rate.toFixed(2)}%`);

// Check thresholds
const thresholds = {
  p95: 500,
  errorRate: 1,
};

const passed = 
  metrics.duration.p95 < thresholds.p95 &&
  metrics.errors.rate < thresholds.errorRate;

console.log(`\nTest ${passed ? '✅ PASSED' : '❌ FAILED'}`);

process.exit(passed ? 0 : 1);
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Load test básico
- [x] Spike test
- [x] Stress test
- [x] Soak test
- [x] Scenario-based tests
- [x] CI integration
- [x] Results analysis
- [x] Thresholds configurados

## 🧪 VALIDACIÓN

```bash
# Run basic load test
npm run load-test

# Run against production
npm run load-test:prod

# Run spike test
npm run spike-test

# Run with custom options
k6 run k6/load-test.js --vus 10 --duration 30s

# Cloud execution
k6 cloud k6/load-test.js

# Analyze results
node scripts/analyze-load-test.js
```

## 📊 TARGETS

- P95 latency: < 500ms
- P99 latency: < 1000ms
- Error rate: < 1%
- Throughput: > 1000 req/s

---

**Status**: COMPLETO ✅
