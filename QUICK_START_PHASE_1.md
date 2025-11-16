# 🚀 QUICK START - Fase 1 (Seguridad)

**Objetivo:** Completar los 2 fixes faltantes de Fase 1 en menos de 1 hora  
**Duración estimada:** 50 minutos  
**Riesgo:** BAJO (cambios backward-compatible)  
**Pre-requisitos:** Git, Node.js, terminal

---

## 📋 ESTADO ACTUAL

```
✅ SEC-CSP-001 (CSP Policy)              - FIXED
✅ SEC-SEED-001 (Seed Password)          - FIXED
⏳ SEC-INPUT-001 (Input Validation)      - TODO (20 min)
⏳ SEC-RATE-LIMIT-001 (Rate Limiting)    - TODO (30 min)
```

---

## TAREA 1: Input Validation (20 min)

### Objetivo
Limitar longitud de query strings a 200 caracteres para prevenir DoS.

### Paso 1.1: Editar archivo frontend
**Archivo:** `src/utils/api.ts`

**Ubicación:** Buscar la función que hace búsqueda (normalmente llamada `searchProducts`)

**Cambio:**
```typescript
// ANTES:
export const searchProducts = async (query: string) => {
  const response = await fetch(`/api/v1/products?q=${encodeURIComponent(query)}`);
  return response.json();
};

// DESPUÉS:
export const searchProducts = async (query: string) => {
  // Prevenir DoS con límite de 200 caracteres
  const sanitizedQuery = query.substring(0, 200);
  if (sanitizedQuery !== query) {
    console.warn(`[SECURITY] Query truncada de ${query.length} a 200 caracteres`);
  }
  const response = await fetch(`/api/v1/products?q=${encodeURIComponent(sanitizedQuery)}`);
  return response.json();
};
```

**Comando (si prefieres hacerlo por terminal):**
```powershell
# Navega al proyecto
cd C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3

# Abre en VS Code en el archivo
code src/utils/api.ts
```

### Paso 1.2: Editar archivo backend
**Archivo:** `backend/src/routes/v1/products.ts`

**Ubicación:** Buscar el handler de GET `/products`

**Cambio:**
```typescript
// ANTES:
router.get('/products', async (request, reply) => {
  const { q } = request.query;
  // ... resto del código
});

// DESPUÉS:
router.get('/products', async (request, reply) => {
  let { q } = request.query;
  
  // SEC-INPUT-001: Validar longitud de query
  if (q && typeof q === 'string') {
    if (q.length > 200) {
      return reply.status(400).json({
        error: 'Query parameter too long (max 200 characters)'
      });
    }
    q = q.substring(0, 200);
  }
  
  // ... resto del código
});
```

### Paso 1.3: Prueba
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd src/.. (o en otra carpeta)
npm run dev

# Terminal 3: Prueba con curl
# Test 1: Query válida (< 200 chars)
curl "http://localhost:3001/api/v1/products?q=vitaminas"

# Test 2: Query larga (> 200 chars)
curl "http://localhost:3001/api/v1/products?q=$(python -c 'print("x" * 250)')"
# Resultado esperado: 400 Bad Request
```

**Validación exitosa:** ✅ Query normal funciona, query > 200 chars retorna 400

---

## TAREA 2: Rate Limiting (30 min)

### Objetivo
Limitar GET requests a 100 por minuto por IP para prevenir scraping/DoS.

### Paso 2.1: Revisar configuración de rate limiting
**Archivo:** `backend/src/plugins/rateLimit.ts`

**Buscar:** ¿Existe este archivo? Si no, créalo.

**Contenido (si no existe):**
```typescript
import { FastifyInstance } from 'fastify';
import RateLimitPlugin from '@fastify/rate-limit';

export async function setupRateLimit(fastify: FastifyInstance) {
  await fastify.register(RateLimitPlugin, {
    max: 100,        // 100 requests
    timeWindow: '1 minute', // per minute
    // Configuración por ruta
    skip: (request) => {
      // No limitar health checks
      return request.url === '/health';
    },
  });
}
```

### Paso 2.2: Aplicar rate limit diferenciado por método
**Archivo:** `backend/src/plugins/rateLimit.ts` (modificar)

**Cambio:**
```typescript
import { FastifyInstance } from 'fastify';
import RateLimitPlugin from '@fastify/rate-limit';

export async function setupRateLimit(fastify: FastifyInstance) {
  // Rate limit general: 100 GET / min, 10 POST / min
  await fastify.register(RateLimitPlugin, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1'], // localhost sin límite
    redis: process.env.REDIS_URL // opcional: usar Redis para distribuido
  });

  // Rate limit estricto para login: 5 attempts / min
  await fastify.register(RateLimitPlugin, {
    max: 5,
    timeWindow: '1 minute',
    skipOnError: true,
  });
}

// Hook para aplicar diferentes límites por ruta
export function setupRouteLimits(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request, reply) => {
    // POST requests: máximo 10/min
    if (request.method === 'POST') {
      const ip = request.ip;
      // Implementar counter en memoria o Redis
      // Por ahora, usar el plugin global
    }
  });
}
```

### Paso 2.3: Registrar rate limit en app
**Archivo:** `backend/src/server.ts` (o `backend/src/app.ts`)

**Buscar:** El lugar donde se registran plugins (normalmente al inicio del archivo)

**Cambio:**
```typescript
// En la función de inicialización del servidor:

import { setupRateLimit } from './plugins/rateLimit';

// ... otras importaciones ...

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  // Registrar rate limiting ANTES que otras rutas
  await setupRateLimit(fastify);
  
  // ... resto de registros de plugins ...
  
  // Rutas
  fastify.register(productsRoutes);
  // ... otras rutas ...

  await fastify.listen({ port: 3001 });
}
```

### Paso 2.4: Prueba de rate limit
```powershell
# Test que genera 101 requests en 60 segundos
# Esperado: Primeros 100 = 200 OK, request 101 = 429 Too Many Requests

# Script de prueba (crear archivo test-rate-limit.ps1):

$count = 0
$success = 0
$rateLimited = 0

for ($i = 1; $i -le 105; $i++) {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/products" `
        -Method Get `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        $success++
    } elseif ($response.StatusCode -eq 429) {
        $rateLimited++
        Write-Host "Request $i: 429 Too Many Requests ✅"
    }
    
    # Pequeña pausa entre requests
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "Resultados:"
Write-Host "✅ Success (200): $success"
Write-Host "🚫 Rate Limited (429): $rateLimited"
Write-Host "Expected: ~100 success, ~5 rate limited"
```

**Ejecutar prueba:**
```powershell
.\test-rate-limit.ps1
```

**Validación exitosa:** ✅ Primeros ~100 requests = 200, request 101+ = 429

---

## VALIDACIÓN FINAL

### Opción A: Script automático (recomendado)
```powershell
# Desde el directorio del proyecto
.\validate-audits.ps1

# Resultado esperado:
# ✅ [PASS] 7/7 tests
# 🎉 TODAS LAS PRUEBAS PASARON - LISTO PARA PRODUCCIÓN
```

### Opción B: Manual (verificación visual)

#### 1. Verificar input validation en ProductPage
```typescript
// src/pages/ProductPage.tsx o SearchBar.tsx
// Buscar que la búsqueda limite a 200 caracteres

const handleSearch = (query: string) => {
  const sanitized = query.substring(0, 200);
  // ...
};
```

#### 2. Verificar rate limit en backend
```bash
curl -i http://localhost:3001/api/v1/products
# Buscar header: RateLimit-Remaining: 99
# Buscar header: RateLimit-Reset: <timestamp>
```

#### 3. Test stress
```bash
# Generar 150 requests rápidos
ab -n 150 -c 10 http://localhost:3001/api/v1/products

# Resultado esperado:
# Requests per second: ~10-20 (limitado)
# Failed requests: ~50 (429 rate limit)
# Complete requests: ~100
```

---

## ⏱️ TIMELINE

```
Minuto 0-5:    Leer este documento
Minuto 5-15:   Implementar SEC-INPUT-001 (frontend + backend)
Minuto 15-25:  Pruebas SEC-INPUT-001
Minuto 25-40:  Implementar SEC-RATE-LIMIT-001
Minuto 40-50:  Pruebas SEC-RATE-LIMIT-001
Minuto 50-60:  Validación final + git commit
```

---

## GIT WORKFLOW

### Paso 1: Crear rama de trabajo
```powershell
git checkout -b security/phase-1-remaining-fixes
```

### Paso 2: Hacer cambios
```powershell
# Edita los archivos según los pasos anteriores
```

### Paso 3: Commit
```powershell
git add .

git commit -m "security(phase-1): implement input validation and rate limiting

- SEC-INPUT-001: Limit query parameters to 200 chars to prevent DoS
- SEC-RATE-LIMIT-001: Apply 100 req/min limit to GET endpoints
- Tests: All 7 validation tests passing
- Risk: LOW (backward compatible)

Fixes #phase-1 @security-team"
```

### Paso 4: Push y PR
```powershell
git push origin security/phase-1-remaining-fixes

# Crear PR en GitHub/GitLab con descripción:
# Title: "Security: Phase 1 - Input Validation & Rate Limiting"
# Description: <enlace a fix-plan-phases.md Fase 1>
```

---

## 🐛 TROUBLESHOOTING

### Problema: Rate limit no se aplica
**Causa:** Plugin no está registrado en el orden correcto  
**Solución:** Verificar que `setupRateLimit()` se llama ANTES de registrar rutas

### Problema: Input validation trunca queries válidas
**Causa:** Frontend no comunica truncamiento  
**Solución:** Añadir validación en la UI mostrando advertencia

### Problema: Tests fallan después de cambios
**Causa:** Tests esperan comportamiento anterior  
**Solución:** Actualizar tests para esperar 429 en queries largas

---

## ✅ CHECKLIST DE COMPLETITUD

Marca cada item conforme termines:

- [ ] SEC-INPUT-001 implementado (frontend)
- [ ] SEC-INPUT-001 implementado (backend)
- [ ] Test input validation: ✅ Query normal funciona
- [ ] Test input validation: ✅ Query > 200 chars retorna 400
- [ ] SEC-RATE-LIMIT-001 implementado
- [ ] Test rate limit: ✅ 100 requests = 200 OK
- [ ] Test rate limit: ✅ Request 101 = 429 Too Many Requests
- [ ] Ejecutar `validate-audits.ps1` = 7/7 ✅
- [ ] Build production sin errores: `npm run build`
- [ ] Lint sin warnings: `npm run lint`
- [ ] Git commit & push
- [ ] PR creado y aprobado
- [ ] Fase 1 completada ✅

---

## 📞 SOPORTE

Si te atascas:

1. **Revisar:** `findings-audit.json` (búscar "SEC-INPUT-001" o "SEC-RATE-LIMIT-001")
2. **Revisar:** `fix-plan-phases.md` (Fase 1, sección de tasks)
3. **Contactar:** #security-team o @security-lead

---

**Tiempo estimado:** 50 minutos  
**Complejidad:** ⭐⭐ (Media)  
**Riesgo:** 🟢 BAJO  
**ROI:** 🔴 CRÍTICO (seguridad)

**¡A por ello!** 🚀

