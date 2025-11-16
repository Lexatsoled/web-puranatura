# 🏛️ MAPA ARQUITECTÓNICO - Pureza Naturalis V3

**Auditoría realizada:** 2025-11-11  
**Analista:** Arquitecto Principal de Auditoría  
**Versión del mapa:** 1.0  
**Cobertura:** ~95% archivos, enfoque en V3

---

## 1. DIAGRAMA DE CAPAS (Stack)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO / NAVEGADOR                       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────────────────────────────────────┐
│  FRONTEND (Vite + React 18 + TypeScript)                       │
│  ├─ SPA (React Router v7)                                      │
│  ├─ State Management (Zustand)                                 │
│  ├─ Forms (React Hook Form + Zod)                              │
│  ├─ Data Fetching (TanStack Query v5)                          │
│  ├─ PWA (Vite PWA Plugin + Workbox)                            │
│  ├─ Styling (Tailwind CSS v3)                                  │
│  └─ Errors & Monitoring (Sentry, Web Vitals)                  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ (HTTPS + CORS)
                    ┌────────────────────────────┐
                    │  API Gateway / Proxy       │
                    │  (CORS, Rate Limit, CSP)  │
                    └────────────────────────────┘
                                 │
┌────────────────────────────────────────────────────────────────┐
│  BACKEND (Fastify + TypeScript)                                │
│  ├─ API v1 (REST)                                              │
│  ├─ Security Layer (CSRF, CSP, Headers, Rate Limit)           │
│  ├─ Authentication (JWT + Session)                             │
│  ├─ Middleware (Compression, CORS, Helmet)                    │
│  ├─ Error Handling & Logging (Sentry, Winston)                │
│  ├─ Performance (Prometheus metrics)                           │
│  └─ Webhooks & Background Jobs                                │
└────────────────────────────────┬────────────────────────────────┘
                                 │ (SQL)
┌────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                     │
│  ├─ SQLite (database.sqlite, 340 KB)                           │
│  ├─ ORM (Drizzle)                                              │
│  ├─ Schema (products, users, sessions, etc.)                   │
│  └─ Migrations                                                 │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────────────────────────────────────┐
│  ASSETS & CDN                                                   │
│  ├─ /public/Jpeg/ (1131 imágenes, ~200MB)                     │
│  ├─ /public/optimized/ (WebP/AVIF)                             │
│  ├─ Static assets (favicon, manifest)                          │
│  └─ Service Worker cache                                       │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. MÓDULOS PRINCIPALES (module_id)

### 2.1 Frontend Modules

| module_id | Descripción | Archivos clave | Estado |
|-----------|------------|-----------------|--------|
| **frontend-core** | SPA principal, enrutamiento | App.tsx, main.tsx, Router | ✅ |
| **frontend-pages** | Páginas principales | HomePage, ProductPage, CartPage | ✅ |
| **frontend-components** | Componentes reutilizables | ProductCard, ImageZoom, Header | ✅ |
| **frontend-store** | Estado global (Zustand) | cartStore, wishlistStore | ✅ |
| **frontend-forms** | Validación y formularios | useFormValidation, schemas | ✅ |
| **frontend-api** | Cliente HTTP | api.ts, axios config | ⚠️ Revisar |
| **frontend-pwa** | PWA y service worker | service-worker.ts, workbox | ✅ |
| **frontend-monitoring** | Sentry, analytics | sentry.ts, analytics.ts | ✅ |
| **frontend-a11y** | Accesibilidad | roles, ARIA, labels | ⚠️ Parcial |

### 2.2 Backend Modules

| module_id | Descripción | Archivos clave | Estado |
|-----------|------------|-----------------|--------|
| **backend-core** | Aplicación Fastify | app.ts, server setup | ✅ |
| **backend-api-v1** | Rutas REST v1 | routes/v1/products.ts | ✅ |
| **backend-security** | Headers, CSRF, CSP | plugins/securityHeaders.ts | ✅ |
| **backend-auth** | Autenticación JWT | routes/auth.ts, jwt.ts | ✅ |
| **backend-db** | ORM y esquema | db/schema.ts, db/client.ts | ✅ |
| **backend-logging** | Logger estructurado | config/logger.ts, errorLogger.ts | ✅ |
| **backend-monitoring** | Metrics, Sentry | plugins/prometheus.ts | ✅ |

---

## 3. FLUJOS DE DATOS CRÍTICOS

### 3.1 Flujo: Búsqueda de Productos

```
[Usuario] → [Search Input] → [Validación Frontend] 
  ↓
[API /products?q=...] → [Backend Validation] 
  ↓
[DB Query] → [Sanitización] → [JSON Response]
  ↓
[Frontend Cache (React Query)] → [Renderizado] → [Display]
```

**Puntos críticos:**
- ✅ Validación en cliente (Zod)
- ✅ Validación en servidor (Zod Schema)
- ⚠️ **RIESGO**: Escape de caracteres especiales en búsqueda
- ✅ Sanitización con DOMPurify en salida

### 3.2 Flujo: Compra de Producto

```
[Producto] → [Agregar al Carrito] → [Zustand Store]
  ↓
[Checkout] → [Formulario] → [Validación Zod]
  ↓
[POST /api/orders] → [Autenticación JWT] → [Backend]
  ↓
[DB Insert] → [Email] → [Confirmación]
```

**Puntos críticos:**
- ✅ CSRF Token en peticiones POST
- ✅ JWT validado en servidor
- ✅ Rate limiting en API
- ⚠️ **RIESGO**: Validación de cantidad/precio podría ser manipulada

### 3.3 Flujo: Carga de Imágenes

```
[ProductPage] → [ImageZoom] → [Cache Busting (?v=session)]
  ↓
[Lazy Load] → [Placeholder] → [Final Image]
  ↓
[public/Jpeg/...] o [public/optimized/...]
```

**Puntos críticos:**
- ✅ Lazy loading implementado
- ✅ Cache-busting con timestamp de sesión
- ✅ Fallback a placeholder
- ⚠️ **RIESGO**: Imágenes JPG grandes sin optimización (ver findings)

---

## 4. ENTRYPOINTS (Puntos de Entrada)

### 4.1 Entrypoints Web

| Entrada | Manejador | Autenticación | Rate Limit |
|---------|-----------|---------------|-----------|
| GET / | HomePage | No | 100 req/min |
| GET /producto/:id | ProductPage | No | 100 req/min |
| POST /api/orders | OrderController | ✅ JWT | 10 req/min |
| GET /api/products | ProductController | No | 100 req/min |
| POST /api/auth/login | AuthController | ✅ Email/Pass | 5 req/min |
| GET /api/cart | CartController | ✅ JWT | 50 req/min |

### 4.2 Entrypoints Backend

| Entrada | Tipo | Manejador | Notas |
|---------|------|-----------|-------|
| Webhook: /api/webhooks | POST | WebhookHandler | Usar sig verification |
| Job: db:seed | CLI | seedFunction | ⚠️ CRÍTICO: Ver SEC-SEED-001 |
| Job: cleanup-sessions | Cron | cleanupJob | 24h cycle |
| Health: /health | GET | healthCheck | No auth |

---

## 5. LÍMITES DE CONFIANZA (Trust Boundaries)

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET (Untrusted)                     │
└────────────────────┬────────────────────────────────────────┘
                     │ [HTTPS + CSP]
    ┌────────────────┴──────────────────┐
    │ TRUST BOUNDARY #1: Client ↔ API  │
    └────────────────┬──────────────────┘
                     │ (JWT + CSRF)
┌────────────────────┴──────────────────────────────────────┐
│              Backend (Trusted)                             │
│  ├─ Validación + Sanitización (Zod)                       │
│  ├─ Autenticación (JWT)                                   │
│  └─ Rate Limiting                                         │
└────────────────────┬──────────────────────────────────────┘
                     │ [SQL Parameterized]
    ┌────────────────┴──────────────────┐
    │ TRUST BOUNDARY #2: DB ↔ Backend   │
    └────────────────┬──────────────────┘
                     │
┌────────────────────┴──────────────────────────────────────┐
│           Base de Datos (Trusted, Isolated)               │
└────────────────────────────────────────────────────────────┘
```

**Supuestos de confianza:**
- ✅ Usuario navegador: **NO TRUSTED** (HTTPS validado)
- ✅ Backend: **TRUSTED** (código controlado)
- ✅ DB: **TRUSTED** (no acceso directo de usuarios)
- ⚠️ **RIESGO**: Imagen/asset servida por CDN: Validar integridad (SRI)

---

## 6. SINKS (Puntos de Salida de Datos Sensibles)

| Sink | Datos | Riesgo | Mitigación |
|------|-------|--------|-----------|
| Consola (logs) | PII, Errores | ⚠️ PII en logs | piiRedactor.ts ✅ |
| Response HTTP | JSON, HTML | ✅ Bajo | CSP, Headers |
| Emails | Confirmaciones | ✅ Bajo | Usar SMTP seguro |
| DB | Contraseñas | ✅ Hash bcrypt | Nunca plaintext |
| Analytics | Eventos | ⚠️ Revisar | No PII en eventos |
| Service Worker | Cache | ✅ Local | Datos no sensibles |
| IndexedDB | Session | ⚠️ Revisar | Encriptar si PII |

---

## 7. DEPENDENCIAS CRÍTICAS (Package.json)

### 7.1 Seguridad

| Paquete | Versión | Propósito | Riesgo |
|---------|---------|----------|--------|
| dompurify | ^3.2.6 | Sanitización XSS | ✅ Bajo (actualizado) |
| zod | ^3.23.8 | Validación schema | ✅ Bajo |
| jsonwebtoken | (en backend) | JWT | ✅ Estándar |
| bcrypt | (en backend) | Hash passwords | ✅ Estándar |
| helmet | (en backend) | Headers seguridad | ✅ Activo |

### 7.2 Performance

| Paquete | Versión | Propósito | Riesgo |
|---------|---------|----------|--------|
| @tanstack/react-query | ^5.90.5 | Caching datos | ✅ Bajo |
| react-window | ^2.2.1 | Virtual scroll | ✅ Bajo |
| framer-motion | ^12.23.12 | Animaciones | ⚠️ +50KB |
| sharp | ^0.34.3 | Optimización imágenes | ✅ Crítico |
| vite-imagetools | ^7.1.0 | WebP/AVIF | ✅ Crítico |

### 7.3 Monitoreo

| Paquete | Versión | Propósito | Riesgo |
|---------|---------|----------|--------|
| @sentry/react | ^10.23.0 | Error tracking | ✅ Bajo |
| web-vitals | ^5.1.0 | Core Web Vitals | ✅ Bajo |
| (Prometheus backend) | - | Metrics | ✅ Interno |

---

## 8. CONFIGURACIÓN POR ENTORNO

```
.env.local (NO commiteado)
├─ VITE_API_URL = http://localhost:3001
├─ VITE_SENTRY_DSN = (development)
└─ JWT_SECRET = (dev key)

.env.example (Plantilla)
├─ VITE_API_URL = (placeholder)
├─ VITE_SENTRY_DSN = (placeholder)
└─ JWT_SECRET = (instrucciones)

Backend
├─ NODE_ENV = development | production
├─ API_BASE_URL = https://api.purezanaturalis.com
├─ CSP_REPORT_URI = https://api.purezanaturalis.com/api/csp-report
└─ (secrets en ENV, NEVER en .env)
```

---

## 9. CI/CD Y DEPLOYMENT

```
[Git Push] 
  ↓
[GitHub Actions] 
  ├─ Run lint
  ├─ Run tests (unit + e2e)
  ├─ Run security scans (gitleaks)
  └─ Build + Deploy
      ↓
    [Vercel / Server] (Frontend)
    [Server / Docker] (Backend)
```

**Pipelines:**
- ✅ Pre-commit hooks (lint-staged)
- ✅ CI gates (test:ci required)
- ⚠️ **TODO**: SecurityScan en CI (gitleaks ya presente)
- ⚠️ **TODO**: Audit de dependencias en CI

---

## 10. RESUMEN DE ARQUITECTURA

| Aspecto | Status | Detalle |
|--------|--------|---------|
| **Separación de Capas** | ✅ Excelente | Frontend/Backend bien separados |
| **ORM Usage** | ✅ Correcto | Drizzle + Prepared Statements |
| **Validación** | ✅ Bueno | Zod en cliente y servidor |
| **Autenticación** | ✅ Implementada | JWT + Sessions |
| **Sanitización** | ✅ Presente | DOMPurify activo |
| **CSP** | ✅ Nuevamente Implementada | Migrado a este proyecto |
| **Rate Limiting** | ✅ Activo | Backend plugin |
| **Logging** | ✅ Estructurado | Sentry + Winston |
| **Monitoreo** | ✅ Implementado | Prometheus + Sentry |
| **PWA** | ✅ Implementada | Service Worker + Workbox |
| **Error Handling** | ✅ Robusto | Error boundaries + Sentry |
| **Testing** | ⚠️ Parcial | Unit OK, E2E básico |

---

**Conclusión**: Arquitectura **sólida con buena separación de concerns**. Requiere ajustes en seguridad menor (seeds) y performance (imágenes grandes).

