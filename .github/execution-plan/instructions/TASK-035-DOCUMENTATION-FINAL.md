# TASK-035: Documentation Final

## 📋 INFORMACIÓN

**ID**: TASK-035 | **Fase**: 3 | **Prioridad**: CRÍTICA | **Estimación**: 4h

## 🎯 OBJETIVO

Crear documentación exhaustiva del proyecto: README, arquitectura, deployment y troubleshooting.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: README Principal

**Archivo**: `README.md`

```markdown
# 🌿 Pureza Naturalis - E-commerce Platform

> Modern, secure, and performant e-commerce platform for natural health products built with React, TypeScript, and Fastify.

[![CI](https://github.com/yourusername/purezanaturalis/workflows/CI/badge.svg)](https://github.com/yourusername/purezanaturalis/actions)
[![codecov](https://codecov.io/gh/yourusername/purezanaturalis/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/purezanaturalis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🛒 **Full E-commerce**: Products, cart, checkout, orders
- 🔍 **Advanced Search**: FTS5 search with BM25 ranking
- 🔐 **Security**: CSRF protection, rate limiting, security headers
- 📱 **PWA**: Offline support, installable, push notifications
- 🌐 **i18n**: Spanish & English support
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 📊 **Monitoring**: Sentry, Prometheus, Grafana
- 🚀 **Performance**: Code splitting, CDN, caching
- 🧪 **Testing**: Unit, integration, E2E (Playwright)

## 🏗️ Tech Stack

**Frontend:**
- React 18.3
- TypeScript 5.3
- Vite 5.0
- Zustand (state)
- React Router 6
- TailwindCSS 3

**Backend:**
- Fastify 4.25
- SQLite + Drizzle ORM
- Redis (caching)
- JWT authentication
- Pino logging

**DevOps:**
- GitHub Actions (CI/CD)
- Docker
- Netlify (frontend)
- Railway (backend)
- BunnyCDN

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Redis (optional, fallback in-memory)

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/purezanaturalis.git
cd purezanaturalis

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:migrate

# Seed data
npm run db:seed
\`\`\`

### Development

\`\`\`bash
# Start backend (port 3000)
npm run dev:backend

# Start frontend (port 5173)
npm run dev:frontend

# Or run both
npm run dev
\`\`\`

Visit http://localhost:5173

## 📁 Project Structure

\`\`\`
purezanaturalis/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── store/          # Zustand stores
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilities
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── vite.config.ts      # Vite config
│
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── db/             # Database
│   │   ├── plugins/        # Fastify plugins
│   │   └── middleware/     # Middlewares
│   └── drizzle.config.ts   # Drizzle config
│
├── k6/                     # Load tests
├── monitoring/             # Prometheus/Grafana
├── scripts/                # Utility scripts
└── docs/                   # Documentation
\`\`\`

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [API Reference](./docs/API.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)
- [Contributing](./CONTRIBUTING.md)

## 🧪 Testing

\`\`\`bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Load tests
npm run load-test

# Coverage
npm run test:coverage
\`\`\`

## 📊 Scripts

\`\`\`bash
# Development
npm run dev                 # Run both frontend & backend
npm run dev:frontend        # Frontend only
npm run dev:backend         # Backend only

# Build
npm run build               # Build both
npm run build:frontend      # Build frontend
npm run build:backend       # Build backend

# Testing
npm test                    # Unit tests
npm run test:e2e            # E2E tests
npm run test:coverage       # Coverage report

# Database
npm run db:migrate          # Run migrations
npm run db:seed             # Seed data
npm run db:backup           # Backup database

# Quality
npm run lint                # Lint code
npm run type-check          # TypeScript check
npm run format              # Format with Prettier

# Deployment
npm run deploy              # Deploy to production
npm run deploy:staging      # Deploy to staging
\`\`\`

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for security policies and reporting vulnerabilities.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📝 License

MIT © [Your Name](https://github.com/yourusername)
```

### Paso 2: Arquitectura

**Archivo**: `docs/ARCHITECTURE.md`

```markdown
# Architecture Documentation

## System Overview

Pureza Naturalis is a modern e-commerce platform with a decoupled frontend/backend architecture.

## High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  (React SPA + PWA + Service Worker)                     │
└────────────────┬────────────────────────────────────────┘
                 │ HTTPS/JSON
                 │
┌────────────────▼────────────────────────────────────────┐
│                    CDN Layer                             │
│  (BunnyCDN - Static Assets, Images)                     │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│                    API Gateway                           │
│  (Fastify - Rate Limiting, CORS, Auth)                  │
└─────┬──────────┬──────────┬───────────┬────────────────┘
      │          │          │           │
      │          │          │           │
┌─────▼──┐  ┌───▼───┐  ┌───▼────┐  ┌──▼────────┐
│Products│  │Search │  │Orders  │  │Auth       │
│Service │  │Service│  │Service │  │Service    │
└─────┬──┘  └───┬───┘  └───┬────┘  └──┬────────┘
      │          │          │           │
      └──────────┴──────────┴───────────┘
                 │
      ┌──────────▼──────────┐
      │   Data Layer        │
      │  (SQLite + Redis)   │
      └─────────────────────┘
\`\`\`

## Component Architecture

### Frontend

**State Management:**
- Zustand for global state
- React Query for server state
- Context for theme/auth

**Routing:**
- React Router 6 with lazy loading
- Code splitting per route

**Performance:**
- Code splitting (React.lazy)
- Image optimization
- Service Worker caching

### Backend

**Layered Architecture:**

\`\`\`
Routes → Services → Database
   ↓        ↓          ↓
Middleware Validation Schema
\`\`\`

**Services:**
- ProductService: CRUD, search, filters
- OrderService: Create, list, status
- AuthService: JWT, sessions, CSRF
- CacheService: Redis with fallback

**Middleware Stack:**
1. CORS
2. Rate Limiting
3. CSRF Protection
4. Authentication
5. Validation (Zod)
6. Error Handling

## Database Schema

\`\`\`sql
users
├── id (PK)
├── email
├── password_hash
└── created_at

products
├── id (PK)
├── name
├── description
├── price
├── stock
└── category

orders
├── id (PK)
├── user_id (FK)
├── status
├── total
└── created_at

order_items
├── id (PK)
├── order_id (FK)
├── product_id (FK)
├── quantity
└── price
\`\`\`

## Security Architecture

**Defense in Depth:**

1. **Network:** HTTPS, Security Headers
2. **Application:** CSRF, Rate Limiting, Input Validation
3. **Data:** Encryption at rest, Parameterized queries
4. **Access:** JWT, RBAC, Session management

## Deployment Architecture

\`\`\`
GitHub → Actions CI/CD
   ↓
   ├─→ Netlify (Frontend)
   └─→ Railway (Backend)
\`\`\`

**Environments:**
- Development: localhost
- Staging: staging.purezanaturalis.com
- Production: purezanaturalis.com

## Monitoring

**Stack:**
- Sentry: Error tracking
- Prometheus: Metrics
- Grafana: Dashboards
- Loki: Logs

**Key Metrics:**
- Request rate
- Error rate
- Response time (P95, P99)
- Active connections
- Memory/CPU usage
```

### Paso 3: Deployment Guide

**Archivo**: `docs/DEPLOYMENT.md`

```markdown
# Deployment Guide

## Prerequisites

- GitHub account
- Netlify account
- Railway account
- Domain name (optional)

## Environment Variables

### Frontend (.env)

\`\`\`bash
VITE_API_URL=https://api.purezanaturalis.com
VITE_SENTRY_DSN=your_sentry_dsn
VITE_APP_VERSION=1.0.0
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
\`\`\`

### Backend (.env)

\`\`\`bash
NODE_ENV=production
PORT=3000
DATABASE_URL=file:./database.db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
CSRF_SECRET=your_csrf_secret
SENTRY_DSN=your_sentry_dsn
\`\`\`

## Netlify Deployment (Frontend)

### Via GitHub Integration

1. **Connect Repository:**
   - Login to Netlify
   - New site from Git
   - Select repository

2. **Build Settings:**
   \`\`\`
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   \`\`\`

3. **Environment Variables:**
   - Go to Site settings → Environment variables
   - Add all VITE_* variables

4. **Deploy:**
   - Deploys automatically on push to main

### Via CLI

\`\`\`bash
npm install -g netlify-cli

# Build
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=dist
\`\`\`

## Railway Deployment (Backend)

### Via GitHub Integration

1. **New Project:**
   - Login to Railway
   - New Project → Deploy from GitHub repo

2. **Settings:**
   \`\`\`
   Root directory: backend
   Build command: npm run build
   Start command: npm start
   \`\`\`

3. **Environment Variables:**
   - Add all backend env vars

4. **Domain:**
   - Generate domain or add custom

### Via CLI

\`\`\`bash
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway up
\`\`\`

## Docker Deployment

\`\`\`bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
\`\`\`

## Database Migration

\`\`\`bash
# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Backup
npm run db:backup
\`\`\`

## Rollback Procedure

### Netlify

\`\`\`bash
# Via UI
1. Go to Deploys
2. Find previous deploy
3. Click "Publish deploy"

# Via CLI
netlify rollback
\`\`\`

### Railway

\`\`\`bash
# Via UI
1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

# Via GitHub Actions
gh workflow run rollback.yml -f commit_sha=abc123
\`\`\`

## Health Checks

\`\`\`bash
# API health
curl https://api.purezanaturalis.com/health

# Frontend
curl https://purezanaturalis.com

# Metrics
curl https://api.purezanaturalis.com/metrics
\`\`\`

## Monitoring Setup

1. **Sentry:**
   - Create project
   - Copy DSN
   - Add to env vars

2. **Grafana:**
   - Import dashboard from monitoring/grafana-dashboard.json
   - Configure Prometheus datasource

3. **Uptime:**
   - Setup uptime-monitor.ts cron job
   - Configure Slack webhook
```

### Paso 4: Troubleshooting

**Archivo**: `docs/TROUBLESHOOTING.md`

```markdown
# Troubleshooting Guide

## Common Issues

### Build Errors

**Issue:** `Cannot find module '@/components/Header'`

**Solution:**
\`\`\`bash
# Check tsconfig paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
\`\`\`

**Issue:** `Out of memory during build`

**Solution:**
\`\`\`bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
\`\`\`

### Runtime Errors

**Issue:** `CORS error in browser`

**Solution:**
\`\`\`typescript
// backend/src/index.ts
fastify.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true
});
\`\`\`

**Issue:** `JWT token expired`

**Solution:**
\`\`\`typescript
// Refresh token
const newToken = await authService.refreshToken(oldToken);
\`\`\`

### Database Issues

**Issue:** `database is locked`

**Solution:**
\`\`\`bash
# Enable WAL mode
sqlite3 database.db "PRAGMA journal_mode=WAL;"
\`\`\`

**Issue:** `Migration failed`

**Solution:**
\`\`\`bash
# Rollback last migration
npm run db:rollback

# Re-run migration
npm run db:migrate
\`\`\`

### Performance Issues

**Issue:** `Slow page load`

**Solution:**
1. Check bundle size: `npm run analyze-bundle`
2. Enable compression
3. Verify CDN caching
4. Check DB query performance

**Issue:** `High memory usage`

**Solution:**
\`\`\`bash
# Monitor memory
node --inspect backend/dist/index.js

# Check for memory leaks
npm install -g clinic
clinic doctor -- node backend/dist/index.js
\`\`\`

### Deployment Issues

**Issue:** `Netlify build fails`

**Solution:**
1. Check build logs
2. Verify Node version (18+)
3. Clear cache and retry
4. Check environment variables

**Issue:** `Railway deployment timeout`

**Solution:**
- Increase timeout in railway.json
- Optimize build process
- Use build cache

## Debug Commands

\`\`\`bash
# Check API health
curl http://localhost:3000/health

# View logs
npm run logs

# Database console
sqlite3 database.db

# Redis console
redis-cli

# Check open connections
lsof -i :3000

# View process memory
ps aux | grep node
\`\`\`

## Getting Help

- GitHub Issues: https://github.com/yourusername/purezanaturalis/issues
- Discussions: https://github.com/yourusername/purezanaturalis/discussions
- Email: support@purezanaturalis.com
```

### Paso 5: API Documentation

**Archivo**: `docs/API.md`

```markdown
# API Reference

Base URL: `https://api.purezanaturalis.com`

## Authentication

All protected endpoints require JWT token in Authorization header:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Endpoints

### Products

#### GET /api/products

List products with pagination and filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `sort`: Sort field (name, price, created_at)
- `order`: Sort order (asc, desc)

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "Vitamin C 1000mg",
      "price": 19.99,
      "stock": 100,
      "category": "vitamins"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "hasNext": true
  }
}
\`\`\`

#### GET /api/products/:id

Get product by ID.

**Response:**
\`\`\`json
{
  "id": 1,
  "name": "Vitamin C 1000mg",
  "description": "High potency vitamin C",
  "price": 19.99,
  "stock": 100,
  "images": ["url1.jpg", "url2.jpg"],
  "category": "vitamins"
}
\`\`\`

### Orders

#### POST /api/orders

Create new order. Requires authentication.

**Request:**
\`\`\`json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Madrid",
    "postalCode": "28001"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 123,
  "status": "pending",
  "total": 39.98,
  "createdAt": "2024-01-01T12:00:00Z"
}
\`\`\`

### Search

#### GET /api/search

Full-text search across products.

**Query Parameters:**
- `q`: Search query
- `limit`: Results limit (default: 20)

**Response:**
\`\`\`json
{
  "results": [
    {
      "id": 1,
      "name": "Vitamin C 1000mg",
      "rank": 0.85
    }
  ]
}
\`\`\`

## Error Responses

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
\`\`\`

## Rate Limits

- Authenticated: 1000 requests/hour
- Anonymous: 100 requests/hour

Headers:
- `X-RateLimit-Limit`: Max requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] README exhaustivo
- [x] Architecture documentation
- [x] Deployment guide
- [x] Troubleshooting guide
- [x] API reference
- [x] Contributing guidelines

## 🧪 VALIDACIÓN

```bash
# Verify all docs exist
ls docs/

# Check markdown formatting
npx markdownlint docs/

# Verify links
npx markdown-link-check README.md
```

---

**Status**: COMPLETO ✅
