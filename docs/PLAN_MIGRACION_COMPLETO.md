# PLAN DE MIGRACIÓN COMPLETO: Backend SQLite + API REST

## Contexto y Objetivos

### Situación actual
- Frontend React 19 + Vite 6 funcional
- Productos embebidos en bundle (449KB) → bloquea FCP
- Autenticación simulada en localStorage → inseguro
- Sin backend real → no hay control de inventario ni sesiones seguras

### Objetivo final
- Backend Node.js + Fastify + SQLite con API REST
- Autenticación segura (bcrypt + JWT en cookies httpOnly)
- Productos servidos por API con paginación
- Control de inventario en tiempo real
- Bundle reducido de 449KB a ~50KB
- LCP < 2.5s, sin errores de seguridad

---

## Stack Técnico Definido

### Backend
```
Runtime:       Node.js 20+
Framework:     Fastify 4.x (más rápido que Express, mejor TypeScript)
ORM:           Drizzle ORM 0.35+ (type-safe, migraciones simples, perfecto SQLite)
Base de datos: SQLite 3.45+ con better-sqlite3 (driver síncrono)
Validación:    Zod 3.x (ya usado en frontend)
Auth:          bcrypt 5.x + jsonwebtoken 9.x
Testing:       Vitest 2.x (mismo del frontend)
```

### Estructura del proyecto
```
Pureza-Naturalis-V3/
├── frontend/              # React app existente (renombrar src/)
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/               # NUEVO
│   ├── src/
│   │   ├── index.ts       # Entry point Fastify
│   │   ├── config/        # Variables de entorno, constantes
│   │   ├── db/
│   │   │   ├── schema.ts  # Drizzle schema (tablas)
│   │   │   ├── migrations/
│   │   │   ├── seed.ts    # Cargar productos iniciales
│   │   │   └── client.ts  # Conexión SQLite
│   │   ├── routes/
│   │   │   ├── auth.ts    # POST /api/auth/login, /signup, /logout
│   │   │   ├── products.ts # GET /api/products, /api/products/:id
│   │   │   ├── cart.ts    # CRUD carrito
│   │   │   └── orders.ts  # CRUD pedidos
│   │   ├── middleware/
│   │   │   ├── auth.ts    # Verificar JWT
│   │   │   ├── validate.ts # Validar requests con Zod
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   └── inventoryService.ts
│   │   └── types/
│   │       └── index.ts
│   ├── database.sqlite    # Archivo de base de datos
│   ├── package.json
│   └── tsconfig.json
├── scripts/               # Scripts de automatización
│   ├── setup_backend.ps1
│   ├── validate_phase.ps1
│   ├── migrate_products.ps1
│   └── run_all_tests.ps1
└── docs/
    ├── fase0_setup_backend.md
    ├── fase1_autenticacion.md
    ├── fase2_productos_api.md
    ├── fase3_inventario.md
    ├── fase4_seguridad.md
    ├── fase5_deploy.md
    └── checklists/
        ├── seguridad.md
        ├── rendimiento.md
        └── accesibilidad.md
```

---

## Fases de Ejecución

### **FASE 0: Setup Backend (3-5 días, ~20-30 horas)**

**Objetivo:** Backend funcional con estructura base y endpoints mínimos.

**Tareas:**
1. Crear estructura backend/
2. Configurar package.json + dependencias
3. Configurar TypeScript (tsconfig.json)
4. Configurar Drizzle ORM + conexión SQLite
5. Crear schema inicial (users, products, cart, orders)
6. Script de seed con productos de frontend
7. Endpoint básico GET /health
8. Validar que el servidor arranca sin errores

**Criterios de éxito:**
- ✅ `npm run dev` arranca servidor en http://localhost:3000
- ✅ `npm run type-check` limpio (0 errores)
- ✅ `npm run test` pasa (tests básicos de health)
- ✅ database.sqlite creado con schema correcto
- ✅ Seed carga 167 productos

**Scripts usados:**
- `scripts/setup_backend.ps1`
- `scripts/validate_phase.ps1 -Phase 0`

---

### **FASE 1: Autenticación Segura (1 semana, ~30-40 horas)**

**Objetivo:** Login/signup funcional con bcrypt + JWT en cookies httpOnly.

**Tareas:**
1. Implementar POST /api/auth/signup
   - Validar email/password con Zod
   - Hash password con bcrypt (cost 12)
   - Insertar usuario en DB
   - Generar JWT (access + refresh tokens)
   - Setear cookies httpOnly
2. Implementar POST /api/auth/login
   - Buscar usuario por email
   - Comparar password con bcrypt
   - Generar JWT
   - Setear cookies
3. Implementar POST /api/auth/logout
   - Limpiar cookies
4. Implementar middleware de autenticación
   - Verificar JWT en requests protegidas
5. Adaptar frontend AuthContext.tsx
   - Reemplazar localStorage por API calls
   - Manejar cookies automáticamente
6. Tests: unitarios + integración

**Criterios de éxito:**
- ✅ Signup crea usuario con password hasheado
- ✅ Login retorna JWT en cookies httpOnly
- ✅ Middleware protege rutas correctamente
- ✅ Frontend AuthContext usa API (0 localStorage)
- ✅ Tests: coverage ≥ 80%
- ✅ No hay secretos en frontend

**Scripts usados:**
- `scripts/validate_phase.ps1 -Phase 1`
- `scripts/run_all_tests.ps1`

---

### **FASE 2: Productos por API (1-2 semanas, ~40-60 horas)**

**Objetivo:** Migrar productos de bundle a API con paginación y virtualización real.

**Tareas:**
1. Implementar GET /api/products
   - Paginación (offset/limit)
   - Filtros (category, minPrice, maxPrice, search)
   - Ordenamiento (price, name, rating)
   - Retornar { products, total, page, totalPages }
2. Implementar GET /api/products/:id
3. Adaptar ProductService.ts en frontend
   - Usar fetch/axios para llamar API
   - Implementar React Query para cache
4. Virtualización REAL del ProductGrid
   - react-window o react-virtual
   - Renderizar solo items visibles
5. Lazy loading de imágenes mejorado
6. Eliminar src/data/products.ts del bundle
7. Tests: E2E con Playwright

**Criterios de éxito:**
- ✅ GET /api/products?page=1&limit=20 funciona
- ✅ Frontend carga productos desde API
- ✅ Bundle baja de 449KB a ~50KB
- ✅ LCP < 2.5s (Lighthouse)
- ✅ Grid virtualizado renderiza solo visible
- ✅ Tests E2E pasan

**Scripts usados:**
- `scripts/migrate_products.ps1` (cargar productos a SQLite)
- `scripts/validate_phase.ps1 -Phase 2`

---

### **FASE 3: Inventario y Carrito (1 semana, ~30-40 horas)**

**Objetivo:** Control de stock en tiempo real y carrito persistente.

**Tareas:**
1. Triggers SQLite para control de stock
   - Decrementar stock al crear orden
   - Validar disponibilidad
2. Implementar POST /api/cart/add
3. Implementar GET /api/cart
4. Implementar DELETE /api/cart/:itemId
5. Implementar POST /api/orders
   - Validar stock disponible
   - Crear orden + items
   - Decrementar inventario
6. Adaptar cartStore.tsx (usar API en lugar de localStorage)
7. Tests: transacciones, concurrencia

**Criterios de éxito:**
- ✅ Stock se decrementa correctamente
- ✅ No se puede comprar sin stock
- ✅ Carrito persiste en DB (no localStorage)
- ✅ Transacciones ACID funcionan
- ✅ Tests de concurrencia pasan

**Scripts usados:**
- `scripts/validate_phase.ps1 -Phase 3`

---

### **FASE 4: Seguridad y Optimización (1 semana, ~30-40 horas)**

**Objetivo:** Endurecer seguridad y optimizar rendimiento.

**Tareas:**
1. Rate limiting (express-rate-limit)
   - Login: 5 intentos/min
   - API: 100 req/min por IP
2. Helmet.js para headers de seguridad
3. CSP strict (sin unsafe-inline en producción)
4. CORS configurado (whitelist)
5. Logs centralizados (backend + frontend)
6. Monitoreo de métricas (opcional: Prometheus)
7. Auditoría de seguridad (npm audit, Snyk)
8. Compresión de respuestas (gzip/brotli)

**Criterios de éxito:**
- ✅ Rate limiting funciona
- ✅ Headers de seguridad correctos
- ✅ CSP sin unsafe-inline
- ✅ CORS solo dominios permitidos
- ✅ Logs funcionan
- ✅ npm audit clean

**Scripts usados:**
- `scripts/validate_phase.ps1 -Phase 4`
- `docs/checklists/seguridad.md`

---

### **FASE 5: Deploy y CI/CD (1 semana, ~30-40 horas)**

**Objetivo:** Preparar deploy a VPS y automatizar calidad.

**Tareas:**
1. Dockerfile (backend + frontend)
2. Docker Compose (desarrollo)
3. GitHub Actions
   - Lint + type-check
   - Tests unitarios + E2E
   - Build
   - Auditorías de seguridad
4. Nginx como reverse proxy
5. PM2 o Docker para producción
6. Scripts de backup SQLite
7. Documentación de deploy

**Criterios de éxito:**
- ✅ Docker Compose levanta stack completo
- ✅ GitHub Actions pasa en todos los commits
- ✅ Build de producción funciona
- ✅ Backup automático configurado
- ✅ Documentación completa

**Scripts usados:**
- `scripts/validate_phase.ps1 -Phase 5`

---

## Métricas de Éxito

### Rendimiento
- **LCP:** ≤ 2.5s (actualmente >10s)
- **FID:** ≤ 100ms
- **CLS:** ≤ 0.1
- **Bundle principal:** ≤ 300KB (actualmente 274KB OK, pero chunk productos 449KB → 50KB)
- **API P95:** ≤ 300ms

### Seguridad
- **Secretos en frontend:** 0 (actualmente 2)
- **Tokens en localStorage:** 0 (actualmente todos)
- **CSP unsafe-inline:** NO (actualmente SÍ en producción)
- **npm audit:** 0 vulnerabilidades críticas/altas

### Calidad
- **Type-check:** 0 errores (ya cumplido ✅)
- **Lint:** 0 warnings (ya cumplido ✅)
- **Tests coverage:** ≥ 80%
- **Tests E2E:** Todos pasan

### Accesibilidad
- **Lighthouse:** ≥ 90/100
- **Textos rotos:** 0 (arreglar encoding UTF-8)
- **Navegación por teclado:** 100% funcional

---

## Dependencias y Recursos

### Dependencias del backend (package.json)
```json
{
  "dependencies": {
    "fastify": "^4.28.0",
    "@fastify/cookie": "^9.3.1",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/rate-limit": "^9.1.0",
    "drizzle-orm": "^0.35.0",
    "better-sqlite3": "^11.5.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/better-sqlite3": "^7.6.11",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.7.0",
    "drizzle-kit": "^0.26.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

### Variables de entorno (.env)
```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=./database.sqlite

# JWT
JWT_SECRET=<generar con: openssl rand -base64 64>
JWT_REFRESH_SECRET=<generar con: openssl rand -base64 64>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

---

## Riesgos y Mitigaciones

### Riesgo 1: Pérdida de datos durante migración
**Mitigación:**
- Backup completo antes de cada fase
- Validar seed con checksums
- Tests de integridad de datos

### Riesgo 2: Incompatibilidad frontend ↔ backend
**Mitigación:**
- Contratos de API documentados (OpenAPI)
- Tests de integración frontend + backend
- Versionado de API (/api/v1/)

### Riesgo 3: Rendimiento de SQLite en producción
**Mitigación:**
- Índices en columnas frecuentes
- PRAGMA optimize
- Monitoreo de queries lentas
- Plan de migración a PostgreSQL si escala

### Riesgo 4: Agotamiento de tokens GPT-5-codex
**Mitigación:**
- Instrucciones ultra-detalladas (menos improvisación)
- Scripts automatizados (menos interacción)
- Fallback a GPT-4.1 (ilimitado)

---

## Próximos Pasos Inmediatos

1. ✅ **Leer este plan completo**
2. ⏳ **Revisar fase0_setup_backend.md**
3. ⏳ **Ejecutar scripts/setup_backend.ps1**
4. ⏳ **Validar con scripts/validate_phase.ps1 -Phase 0**

---

**Preparado por:** Claude Sonnet 4.5 (GitHub Copilot)  
**Fecha:** 2025-11-05  
**Para ejecutar con:** GPT-5-codex (razonamiento LOW) + fallback GPT-4.1
