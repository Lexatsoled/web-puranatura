# TASK-005: Implementar Protección CSRF

**PRIORIDAD:** CRÍTICA  
**FASE:** 1 - Seguridad  
**DEPENDENCIAS:** Ninguna  
**TIEMPO ESTIMADO:** 3-4 horas

---

## CONTEXTO

El backend NO tiene protección contra ataques CSRF (Cross-Site Request Forgery). Endpoints como `/api/auth/login`, `/api/orders`, y otros aceptan requests sin validar origen.

**HALLAZGO RELACIONADO:** SEC-AUTH-003 - Falta protección CSRF en rutas autenticadas

**RIESGO:** Un sitio malicioso podría forzar al navegador de un usuario autenticado a realizar acciones no deseadas (crear orders, cambiar perfil, etc.).

---

## OBJETIVO

Implementar protección CSRF completa usando `@fastify/csrf-protection` para:

1. Generar tokens CSRF en respuestas
2. Validar tokens en requests mutantes (POST/PUT/DELETE)
3. Configurar cookies seguras
4. Integrar con frontend (axios interceptors)

---

## INSTRUCCIONES DETALLADAS

### PASO 1: Instalar Dependencias

```bash
cd backend
npm install @fastify/csrf-protection @fastify/cookie
```

**Verificación:**

```bash
npm list @fastify/csrf-protection @fastify/cookie
```

Deberías ver ambas librerías instaladas.

---

### PASO 2: Configurar Plugin CSRF

**Archivo:** `backend/src/plugins/csrf.ts` (crear nuevo)

```typescript
import fp from 'fastify-plugin';
import csrf from '@fastify/csrf-protection';
import cookie from '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

/**
 * Plugin de protección CSRF
 * 
 * Genera y valida tokens CSRF para prevenir ataques cross-site.
 * 
 * @see https://github.com/fastify/csrf-protection
 */
export default fp(async function csrfPlugin(fastify: FastifyInstance) {
  // Registrar plugin de cookies primero (requerido por CSRF)
  await fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET || process.env.JWT_SECRET,
    parseOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  });

  // Registrar protección CSRF
  await fastify.register(csrf, {
    // Almacenar token en cookie
    cookieOpts: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      signed: true,
    },
    // Leer token de header personalizado
    getToken: (req) => {
      // Prioridad: Header > Body > Query
      return (
        req.headers['x-csrf-token'] ||
        req.body?._csrf ||
        req.query?._csrf
      );
    },
  });

  fastify.log.info('CSRF protection enabled');
}, {
  name: 'csrf-protection',
});
```

---

### PASO 3: Registrar Plugin en Servidor

**Archivo:** `backend/src/index.ts`

Buscar donde registras otros plugins y añadir:

```typescript
import csrfPlugin from './plugins/csrf';

// ... código existente ...

// Registrar CSRF DESPUÉS de helmet y CORS, ANTES de rutas
await app.register(csrfPlugin);

// ... registrar rutas ...
```

**Orden correcto de plugins:**

```typescript
// 1. Helmet (headers de seguridad)
await app.register(helmet, { /* ... */ });

// 2. CORS
await app.register(cors, { /* ... */ });

// 3. Rate limiting
await app.register(rateLimit, { /* ... */ });

// 4. CSRF (nuevo)
await app.register(csrfPlugin);

// 5. Rutas
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(orderRoutes, { prefix: '/api/orders' });
```

---

### PASO 4: Crear Endpoint para Obtener Token

**Archivo:** `backend/src/routes/csrf.ts` (crear nuevo)

```typescript
import type { FastifyInstance } from 'fastify';

/**
 * Rutas para gestión de tokens CSRF
 */
export default async function csrfRoutes(app: FastifyInstance) {
  /**
   * GET /api/csrf-token
   * 
   * Devuelve token CSRF válido para el cliente.
   * El token también se envía en cookie (httpOnly).
   */
  app.get('/csrf-token', async (req, reply) => {
    // Generar token CSRF
    const token = await reply.generateCsrf();

    return {
      csrfToken: token,
      expiresIn: '1h',
    };
  });
}
```

**Registrar en `backend/src/index.ts`:**

```typescript
import csrfRoutes from './routes/csrf';

// ...

await app.register(csrfRoutes, { prefix: '/api' });
```

---

### PASO 5: Proteger Rutas Existentes

**OPCIÓN A: Proteger automáticamente (recomendado)**

Modificar `backend/src/index.ts`:

```typescript
// Hook global para validar CSRF en métodos mutantes
app.addHook('preValidation', async (req, reply) => {
  const exemptPaths = [
    '/api/csrf-token',
    '/api/health',
    '/api/metrics',
  ];

  const exemptMethods = ['GET', 'HEAD', 'OPTIONS'];

  // Skip CSRF para rutas exentas o métodos seguros
  if (
    exemptPaths.includes(req.routerPath) ||
    exemptMethods.includes(req.method)
  ) {
    return;
  }

  // Validar token CSRF
  try {
    await req.csrfProtection(req, reply);
  } catch (err) {
    reply.code(403).send({
      error: 'Invalid CSRF token',
      message: 'Request rejected due to invalid or missing CSRF token',
    });
  }
});
```

**OPCIÓN B: Proteger manualmente por ruta**

```typescript
// backend/src/routes/orders.ts

app.post(
  '/orders',
  {
    // Aplicar protección CSRF a esta ruta específica
    csrfProtection: true,
  },
  async (req, reply) => {
    // ... lógica de creación de order ...
  }
);
```

**⚠️ IMPORTANTE:** Usa Opción A (hook global) para no olvidar proteger nuevas rutas.

---

### PASO 6: Actualizar Variables de Entorno

**Archivo:** `backend/.env.example`

Añadir:

```env
# CSRF & Cookies
COOKIE_SECRET=change-this-to-random-secret-different-from-jwt
```

**Archivo:** `backend/.env` (local)

```env
COOKIE_SECRET=genera-secreto-aleatorio-aqui-abc123xyz
```

**Generar secreto:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### PASO 7: Integrar con Frontend

**Archivo:** `src/services/api.ts` (modificar)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // Enviar cookies
});

// Interceptor para obtener CSRF token
let csrfToken: string | null = null;

const getCsrfToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;

  const response = await axios.get('/api/csrf-token', {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  csrfToken = response.data.csrfToken;
  return csrfToken;
};

// Añadir token CSRF a requests mutantes
api.interceptors.request.use(async (config) => {
  const mutantMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (mutantMethods.includes(config.method?.toUpperCase() || '')) {
    const token = await getCsrfToken();
    config.headers['X-CSRF-Token'] = token;
  }

  return config;
});

// Renovar token si expira
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.error === 'Invalid CSRF token') {
      // Token expirado, renovar
      csrfToken = null;
      const token = await getCsrfToken();

      // Reintentar request original
      const config = error.config;
      config.headers['X-CSRF-Token'] = token;

      return axios.request(config);
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

### PASO 8: Actualizar Stores que Hacen Requests

**Archivo:** `src/store/checkoutStore.ts` (ejemplo)

**ANTES:**

```typescript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData),
});
```

**DESPUÉS:**

```typescript
import api from '../services/api';

// ...

const response = await api.post('/orders', orderData);
```

**Ventajas:**
- ✅ CSRF token añadido automáticamente
- ✅ Renovación automática si expira
- ✅ Cookies gestionadas correctamente

---

### PASO 9: Configurar CORS Correctamente

**Archivo:** `backend/src/index.ts`

Asegúrate que CORS permite credentials:

```typescript
await app.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true, // ⚠️ CRÍTICO para CSRF cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token', // ⚠️ Permitir header CSRF
  ],
  exposedHeaders: ['Set-Cookie'],
});
```

---

### PASO 10: Crear Tests

**Archivo:** `backend/src/routes/__tests__/csrf.test.ts` (crear)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { build } from '../app';
import type { FastifyInstance } from 'fastify';

describe('CSRF Protection', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await build();
    await app.ready();
  });

  it('should provide CSRF token on GET /api/csrf-token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/csrf-token',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('csrfToken');
    expect(response.json().csrfToken).toBeTruthy();
  });

  it('should reject POST without CSRF token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/orders',
      payload: { items: [] },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json()).toHaveProperty('error', 'Invalid CSRF token');
  });

  it('should accept POST with valid CSRF token', async () => {
    // Obtener token
    const tokenResponse = await app.inject({
      method: 'GET',
      url: '/api/csrf-token',
    });

    const token = tokenResponse.json().csrfToken;
    const cookies = tokenResponse.cookies;

    // Hacer POST con token
    const response = await app.inject({
      method: 'POST',
      url: '/api/orders',
      headers: {
        'X-CSRF-Token': token,
        Cookie: cookies.map(c => `${c.name}=${c.value}`).join('; '),
      },
      payload: { items: [] },
    });

    expect(response.statusCode).not.toBe(403);
  });

  it('should reject POST with invalid CSRF token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/orders',
      headers: {
        'X-CSRF-Token': 'token-invalido-abc123',
      },
      payload: { items: [] },
    });

    expect(response.statusCode).toBe(403);
  });

  it('should allow GET without CSRF token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
    });

    expect(response.statusCode).not.toBe(403);
  });
});
```

**Ejecutar tests:**

```bash
cd backend
npm run test -- csrf.test.ts
```

---

### PASO 11: Documentar Uso para Desarrolladores

**Archivo:** `backend/docs/CSRF_PROTECTION.md` (crear)

```markdown
# Protección CSRF

## ¿Qué es CSRF?

Cross-Site Request Forgery es un ataque donde un sitio malicioso engaña al navegador para ejecutar acciones en nuestra app sin consentimiento del usuario.

**Ejemplo:**
1. Usuario inicia sesión en `pureza-naturalis.com`
2. Visita sitio malicioso `evil.com`
3. `evil.com` tiene código: `<form action="https://pureza-naturalis.com/api/orders" method="POST">...</form>`
4. Browser envía cookies de sesión automáticamente
5. **SIN CSRF:** Order se crea sin autorización
6. **CON CSRF:** Request rechazado por token inválido

## Cómo Funciona

1. **Cliente pide token:**
   ```
   GET /api/csrf-token
   → { csrfToken: "abc123..." }
   → Set-Cookie: _csrf=xyz789; HttpOnly
   ```

2. **Cliente envía token en requests mutantes:**
   ```
   POST /api/orders
   Headers: X-CSRF-Token: abc123...
   Cookies: _csrf=xyz789
   ```

3. **Servidor valida:**
   - Token en header coincide con cookie
   - Si NO coincide → 403 Forbidden

## Uso en Frontend

### Con Axios (Configurado)

```typescript
import api from './services/api';

// Token CSRF añadido automáticamente
await api.post('/orders', orderData);
```

### Con Fetch (Manual)

```typescript
// 1. Obtener token
const tokenRes = await fetch('/api/csrf-token', {
  credentials: 'include',
});
const { csrfToken } = await tokenRes.json();

// 2. Usar en request
await fetch('/api/orders', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
});
```

## Testing

```typescript
// Obtener token para test
const tokenRes = await app.inject({ method: 'GET', url: '/api/csrf-token' });
const token = tokenRes.json().csrfToken;

// Usar en request
await app.inject({
  method: 'POST',
  url: '/api/orders',
  headers: { 'X-CSRF-Token': token },
  cookies: tokenRes.cookies,
});
```

## Troubleshooting

### Error: "Invalid CSRF token"

**Causas:**
- Token expirado (renew cada 1h)
- Cookies bloqueadas (verificar `withCredentials: true`)
- CORS mal configurado (`credentials: true`)

**Solución:**
```typescript
// Renovar token
csrfToken = null;
await getCsrfToken();
```

### Token no llega al servidor

**Verificar:**
1. `withCredentials: true` en axios
2. CORS permite `credentials: true`
3. Header `X-CSRF-Token` permitido en CORS

## Seguridad

- ✅ Cookies con `HttpOnly`, `Secure`, `SameSite=strict`
- ✅ Token renovable cada request
- ✅ Validación en TODOS los métodos mutantes (POST/PUT/DELETE)
- ❌ NO desactivar para "simplificar desarrollo"

## Referencias

- [@fastify/csrf-protection](https://github.com/fastify/csrf-protection)
- [OWASP CSRF Guide](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
```

---

## VALIDACIÓN

### ✅ Criterios de Aceptación

1. **Backend:**
   - [ ] `@fastify/csrf-protection` instalado
   - [ ] Plugin configurado en `backend/src/plugins/csrf.ts`
   - [ ] Endpoint `/api/csrf-token` funcional
   - [ ] Hook global protege POST/PUT/DELETE automáticamente
   - [ ] Variables `COOKIE_SECRET` en `.env.example`

2. **Frontend:**
   - [ ] Axios configurado con interceptor CSRF
   - [ ] Token renovable automáticamente si expira
   - [ ] Stores usan `api` service (no fetch directo)

3. **CORS:**
   - [ ] `credentials: true` configurado
   - [ ] Header `X-CSRF-Token` permitido

4. **Tests:**
   - [ ] Tests pasando con CSRF habilitado
   - [ ] Request sin token → 403
   - [ ] Request con token válido → éxito

### 🧪 Tests de Validación

```bash
# Tests unitarios
cd backend
npm run test -- csrf.test.ts

# Test manual - Obtener token
curl http://localhost:3000/api/csrf-token

# Test manual - POST sin token (debería fallar)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[]}'
# Esperado: 403 Forbidden

# Test manual - POST con token (debería funcionar)
TOKEN=$(curl -s http://localhost:3000/api/csrf-token | jq -r .csrfToken)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -b cookies.txt -c cookies.txt \
  -d '{"items":[]}'
# Esperado: 200 OK (u otro error de validación, pero NO 403)
```

### 📊 Métricas de Éxito

- **Protección:** 100% rutas mutantes protegidas
- **Performance:** <2ms overhead por request
- **UX:** Transparente (usuario no nota cambio)

---

## NOTAS IMPORTANTES

### ⚠️ Avisos

1. **Producción:** Asegúrate `NODE_ENV=production` para cookies `secure: true`
2. **Testing:** Playwright tests necesitan actualización para pasar token
3. **Mobile:** Considerar si app móvil nativa usa misma API (CSRF NO aplica a apps nativas)

### 🔗 Dependencias

- **Requiere:** CORS correctamente configurado
- **Habilita:** Seguridad contra CSRF attacks

### 📦 Entregables

- `backend/src/plugins/csrf.ts`
- `backend/src/routes/csrf.ts`
- `backend/src/routes/__tests__/csrf.test.ts`
- `backend/docs/CSRF_PROTECTION.md`
- `src/services/api.ts` (actualizado)
- `backend/.env.example` (actualizado)

---

## REPORTE FINAL

**Archivo:** `reports/execution-2025-11-07/TASK-005-COMPLETION.md`

```markdown
# TASK-005: Protección CSRF - COMPLETADO

**Ejecutado:** [FECHA]  
**Tiempo:** [X horas]

## ✅ Implementación

- [x] Plugin CSRF configurado
- [x] Endpoint `/api/csrf-token` creado
- [x] Hook global protege rutas mutantes
- [x] Frontend integrado (axios interceptor)
- [x] CORS actualizado
- [x] Tests pasando

## ✅ Validación

```bash
# Tests unitarios
✓ should provide CSRF token (15ms)
✓ should reject POST without token (8ms)
✓ should accept POST with valid token (12ms)
✓ should reject invalid token (6ms)
✓ should allow GET without token (5ms)

Tests: 5 passed, 5 total
```

## 🎯 Impacto

**ANTES:** Vulnerable a CSRF attacks.  
**DESPUÉS:** Protección completa contra cross-site requests.

**Nivel de Seguridad:** CRÍTICO → RESUELTO ✅
```

---

**FIN DE INSTRUCCIONES TASK-005**
