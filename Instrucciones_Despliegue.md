# 🚀 INSTRUCCIONES DESPLIEGUE

> Guía completa de deployment: CI/CD, producción, monitoring, rollback  
> Stack: GitHub Actions + Vercel/Netlify + PostgreSQL + Sentry

---

## 1. Preparación Pre-Deployment

### 1.1 Checklist Pre-Deploy

```bash
# ✓ 1. Todos los tests pasan
npm run test:run
npm run test:e2e

# ✓ 2. Cobertura > 80%
npm run test:coverage

# ✓ 3. No hay errores TypeScript
npm run type-check

# ✓ 4. No hay errores ESLint
npm run lint

# ✓ 5. Build exitoso
npm run build

# ✓ 6. Auditoría de seguridad
npm audit --production

# ✓ 7. Verificar variables de entorno
node scripts/verify-env.mjs
```

### 1.2 Script de Verificación

```javascript
// scripts/verify-env.mjs
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const requiredVars = {
  frontend: [
    'VITE_API_URL',
    'VITE_ENV'
  ],
  backend: [
    'NODE_ENV',
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'CORS_ORIGIN'
  ]
};

function verifyEnv(type) {
  const missing = [];
  const vars = requiredVars[type];

  for (const varName of vars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error(`❌ Variables faltantes (${type}):`);
    missing.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log(`✅ Variables de entorno verificadas (${type})`);
}

verifyEnv('frontend');
verifyEnv('backend');
```

---

## 2. CI/CD con GitHub Actions

### 2.1 Workflow Principal

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20.x'
  POSTGRES_VERSION: '14'

jobs:
  # JOB 1: Tests Frontend
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm run test:run
      
      - name: Coverage
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: frontend

  # JOB 2: Tests Backend
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run migrations
        working-directory: ./backend
        run: npm run migrate:test
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: test_db
          DB_USER: test_user
          DB_PASSWORD: test_password
      
      - name: Backend tests
        working-directory: ./backend
        run: npm run test
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: test_db
          DB_USER: test_user
          DB_PASSWORD: test_password

  # JOB 3: Tests E2E
  test-e2e:
    runs-on: ubuntu-latest
    needs: [test-frontend, test-backend]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  # JOB 4: Build
  build:
    runs-on: ubuntu-latest
    needs: [test-frontend, test-backend, test-e2e]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  # JOB 5: Deploy (solo main branch)
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://puranatura.com
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifact
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Deploy backend
        run: |
          # SSH al servidor y deploy
          # O usar plataforma cloud (Heroku, Railway, etc.)
          echo "Deploying backend..."
      
      - name: Run migrations
        run: |
          # Ejecutar migraciones en producción
          npm run migrate:prod
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Notify Sentry
        run: |
          curl -X POST \
            -H 'Content-Type: application/json' \
            -d '{"version":"${{ github.sha }}"}' \
            ${{ secrets.SENTRY_WEBHOOK_URL }}
```

### 2.2 Workflow de Rollback

```yaml
# .github/workflows/rollback.yml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to (commit SHA)'
        required: true
        type: string

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment:
      name: production
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ inputs.version }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Rollback database
        run: npm run migrate:rollback
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Notify team
        run: |
          echo "Rollback completed to ${{ inputs.version }}"
```

---

## 3. Configuración de Entornos

### 3.1 Variables de Entorno - Producción

```bash
# .env.production (Frontend)
VITE_API_URL=https://api.puranatura.com
VITE_ENV=production
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_GA_ID=G-XXXXXXXXXX

# .env.production (Backend)
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/puranatura_prod
DB_SSL=true
DB_POOL_SIZE=20

# JWT
JWT_ACCESS_SECRET=your-production-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars

# CORS
CORS_ORIGIN=https://puranatura.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# Logging
LOG_LEVEL=error
SENTRY_DSN=https://your-backend-sentry-dsn
```

### 3.2 Variables de Entorno - Staging

```bash
# .env.staging (Frontend)
VITE_API_URL=https://api-staging.puranatura.com
VITE_ENV=staging

# .env.staging (Backend)
NODE_ENV=staging
DATABASE_URL=postgresql://user:password@host:5432/puranatura_staging
LOG_LEVEL=info
```

---

## 4. Database Migrations

### 4.1 Sistema de Migraciones

```typescript
// backend/src/migrations/001_initial_schema.ts
export async function up(db: Database) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(500) UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS auth_audit_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(50) NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      details JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
    CREATE INDEX idx_audit_log_user_id ON auth_audit_log(user_id);
    CREATE INDEX idx_audit_log_created_at ON auth_audit_log(created_at);
  `);
}

export async function down(db: Database) {
  await db.query(`
    DROP TABLE IF EXISTS auth_audit_log CASCADE;
    DROP TABLE IF EXISTS refresh_tokens CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `);
}
```

### 4.2 Runner de Migraciones

```typescript
// backend/src/scripts/migrate.ts
import { db } from '@/config/database';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function runMigrations(direction: 'up' | 'down' = 'up') {
  try {
    // Crear tabla de migraciones si no existe
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Obtener migraciones aplicadas
    const { rows: applied } = await db.query(
      'SELECT name FROM migrations ORDER BY id'
    );
    const appliedMigrations = new Set(applied.map(r => r.name));

    // Leer archivos de migraciones
    const migrationsDir = join(__dirname, '../migrations');
    const files = await readdir(migrationsDir);
    const migrations = files
      .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
      .sort();

    // Ejecutar migraciones
    for (const file of migrations) {
      const name = file.replace(/\.(ts|js)$/, '');
      
      if (direction === 'up' && appliedMigrations.has(name)) {
        console.log(`⏭️  Skipping ${name} (already applied)`);
        continue;
      }

      if (direction === 'down' && !appliedMigrations.has(name)) {
        console.log(`⏭️  Skipping ${name} (not applied)`);
        continue;
      }

      console.log(`🔄 Running ${direction}: ${name}`);
      
      const migration = await import(join(migrationsDir, file));
      await migration[direction](db);

      if (direction === 'up') {
        await db.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [name]
        );
      } else {
        await db.query(
          'DELETE FROM migrations WHERE name = $1',
          [name]
        );
      }

      console.log(`✅ Completed ${direction}: ${name}`);
    }

    console.log('\n✨ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Ejecutar
const direction = process.argv[2] === 'down' ? 'down' : 'up';
runMigrations(direction);
```

```bash
# Ejecutar migraciones
npm run migrate        # up
npm run migrate:down   # down (rollback)
```

---

## 5. Monitoring y Logging

### 5.1 Sentry (Error Tracking)

```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export function initSentry() {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
        new Sentry.Replay()
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.VITE_ENV,
      release: import.meta.env.VITE_APP_VERSION
    });
  }
}

// src/main.tsx
import { initSentry } from './utils/sentry';

initSentry();
```

### 5.2 Logging Backend

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';
import * as Sentry from '@sentry/node';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Integrar con Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
  });

  logger.on('error', (error) => {
    Sentry.captureException(error);
  });
}

export default logger;
```

---

## 6. Health Checks

### 6.1 Endpoint de Health

```typescript
// backend/src/routes/health.routes.ts
import { Router } from 'express';
import { db } from '@/config/database';
import os from 'os';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    checks: {}
  };

  try {
    // Check database
    await db.query('SELECT 1');
    health.checks.database = { status: 'ok' };
  } catch (error) {
    health.checks.database = { status: 'error', message: error.message };
    health.status = 'degraded';
  }

  // Check memory
  const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  const totalMemory = os.totalmem() / 1024 / 1024;
  health.checks.memory = {
    status: usedMemory < totalMemory * 0.9 ? 'ok' : 'warning',
    used: `${usedMemory.toFixed(2)} MB`,
    total: `${totalMemory.toFixed(2)} MB`
  };

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

router.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

router.get('/health/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});

export default router;
```

---

## 7. Rollback Procedures

### 7.1 Rollback Manual

```bash
# 1. Identificar versión anterior
git log --oneline -10

# 2. Revertir a commit anterior
git revert <commit-sha>

# 3. Push (trigger CI/CD)
git push origin main

# 4. Rollback database (si necesario)
npm run migrate:rollback

# 5. Verificar
curl https://api.puranatura.com/health
```

### 7.2 Rollback Automático

```typescript
// scripts/rollback.mjs
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function rollback(version) {
  try {
    console.log(`🔄 Rolling back to ${version}...`);

    // 1. Checkout version
    await execAsync(`git checkout ${version}`);

    // 2. Install dependencies
    console.log('📦 Installing dependencies...');
    await execAsync('npm ci');

    // 3. Build
    console.log('🔨 Building...');
    await execAsync('npm run build');

    // 4. Deploy
    console.log('🚀 Deploying...');
    await execAsync('vercel --prod');

    // 5. Rollback database
    console.log('🗃️  Rolling back database...');
    await execAsync('npm run migrate:rollback');

    console.log('✅ Rollback completed successfully');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  }
}

const version = process.argv[2];
if (!version) {
  console.error('Usage: node rollback.mjs <version>');
  process.exit(1);
}

rollback(version);
```

---

## 8. Post-Deployment

### 8.1 Verificación Post-Deploy

```bash
# scripts/verify-deployment.sh
#!/bin/bash

BASE_URL="https://puranatura.com"
API_URL="https://api.puranatura.com"

echo "🔍 Verificando deployment..."

# 1. Health check
echo "1. Health check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
if [ $STATUS -eq 200 ]; then
  echo "✅ API health: OK"
else
  echo "❌ API health: FAILED ($STATUS)"
  exit 1
fi

# 2. Frontend accesible
echo "2. Frontend check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
if [ $STATUS -eq 200 ]; then
  echo "✅ Frontend: OK"
else
  echo "❌ Frontend: FAILED ($STATUS)"
  exit 1
fi

# 3. Database conectada
echo "3. Database check..."
RESPONSE=$(curl -s $API_URL/health)
DB_STATUS=$(echo $RESPONSE | jq -r '.checks.database.status')
if [ "$DB_STATUS" = "ok" ]; then
  echo "✅ Database: OK"
else
  echo "❌ Database: FAILED"
  exit 1
fi

# 4. SSL válido
echo "4. SSL check..."
SSL=$(curl -s -o /dev/null -w "%{ssl_verify_result}" $BASE_URL)
if [ $SSL -eq 0 ]; then
  echo "✅ SSL: OK"
else
  echo "⚠️  SSL: WARNING"
fi

echo ""
echo "✨ Deployment verification completed"
```

### 8.2 Smoke Tests

```typescript
// scripts/smoke-tests.mjs
import axios from 'axios';

const BASE_URL = 'https://puranatura.com';
const API_URL = 'https://api.puranatura.com';

async function smokeTests() {
  const tests = [
    {
      name: 'Homepage loads',
      test: async () => {
        const response = await axios.get(BASE_URL);
        return response.status === 200;
      }
    },
    {
      name: 'Products API works',
      test: async () => {
        const response = await axios.get(`${API_URL}/api/products`);
        return response.status === 200 && Array.isArray(response.data);
      }
    },
    {
      name: 'CSRF token endpoint works',
      test: async () => {
        const response = await axios.get(`${API_URL}/api/csrf-token`);
        return response.status === 200 && response.data.csrfToken;
      }
    },
    {
      name: 'Health endpoint responds',
      test: async () => {
        const response = await axios.get(`${API_URL}/health`);
        return response.status === 200 && response.data.status === 'ok';
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.test();
      if (result) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

smokeTests();
```

---

## 9. Checklist Final de Deployment

### 9.1 Pre-Deploy

- [ ] Todos los tests pasan (unit, integration, E2E)
- [ ] Cobertura > 80%
- [ ] No hay errores TypeScript
- [ ] No hay errores ESLint
- [ ] Build exitoso
- [ ] npm audit clean
- [ ] Variables de entorno configuradas
- [ ] Migraciones preparadas
- [ ] Changelog actualizado

### 9.2 Deploy

- [ ] CI/CD pipeline exitoso
- [ ] Frontend deployado
- [ ] Backend deployado
- [ ] Migraciones ejecutadas
- [ ] Cache limpiado
- [ ] CDN actualizado

### 9.3 Post-Deploy

- [ ] Health checks pasan
- [ ] Smoke tests pasan
- [ ] Frontend accesible
- [ ] API responde
- [ ] Database conectada
- [ ] SSL válido
- [ ] Monitoring activo
- [ ] Logs sin errores críticos

### 9.4 Rollback Ready

- [ ] Versión anterior identificada
- [ ] Script de rollback probado
- [ ] Backup de database disponible
- [ ] Plan de comunicación preparado

---

**Estado**: ✅ Guía de Despliegue Completa
