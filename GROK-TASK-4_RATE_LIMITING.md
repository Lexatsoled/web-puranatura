# ⏱️ GROK-TASK-4: SEC-RATE-LIMIT-001 - Rate Limiting

**ID:** SEC-RATE-LIMIT-001  
**Severidad:** 🟡 MEDIUM  
**Tiempo estimado:** 30 minutos  
**Complejidad:** ⭐⭐ Fácil  
**Status:** ⏳ TODO

---

## 📋 RESUMEN DE TAREA

**Problema:**
- API GET `/products` no tiene límite de requests
- Atacante puede enviar 1000s de requests para derribar servidor
- Sin rate limiting, cualquier usuario puede hacer DoS

**Solución:**
- Limitar a 100 requests por minuto por IP
- POST más restrictiva: 10 requests por minuto
- Retornar error 429 (Too Many Requests) si se excede

---

## 🎯 PASO 1: VERIFICAR SI EXISTE PLUGIN

Verificar si ya existe archivo de rate limiting:

```powershell
# Listar archivos en backend/src/plugins
ls backend/src/plugins

# Si EXISTE: backend/src/plugins/rateLimit.ts → Saltar al PASO 2
# Si NO EXISTE: Crear en PASO 2
```

---

## 🎯 PASO 2: CREAR O EDITAR ARCHIVO

### Opción A: Si el archivo NO existe

**Crear archivo nuevo:**

```powershell
# Abrir editor
code backend/src/plugins/rateLimit.ts
```

**Copiar-pegar este contenido COMPLETO:**

```typescript
import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

export async function setupRateLimit(fastify: FastifyInstance) {
  // SEC-RATE-LIMIT-001: Register rate limiting plugin
  
  await fastify.register(rateLimit, {
    max: 100,           // 100 requests
    timeWindow: '1 minute',  // per minute
    
    // Skip rate limiting for health checks
    skip: (request) => {
      return request.url === '/health' || request.url === '/ping';
    },
    
    // Optional: Allow localhost to bypass
    allowList: ['127.0.0.1'],
    
    // Return 429 Too Many Requests when exceeded
    cache: 10000,  // Number of records to store in cache
  });

  console.log('[rate-limit] ✅ Rate limiting configured: 100 req/min');
}

// Hook for custom rate limiting per route
export function setupRouteSpecificLimits(fastify: FastifyInstance) {
  // POST endpoints (more restrictive): 10 req/min
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.method === 'POST') {
      // The global rate limit will apply
      // Additional POST-specific logic can go here if needed
    }
  });
}
```

**Guardar:** `Ctrl+S`

### Opción B: Si el archivo YA existe

**Abrir el archivo:**
```powershell
code backend/src/plugins/rateLimit.ts
```

**Verificar que contiene:**
```typescript
export async function setupRateLimit(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
```

Si el contenido es similar, saltar a **PASO 3** ✅

Si es diferente o vacío, reemplazar COMPLETO con el código de arriba.

---

## 🎯 PASO 3: REGISTRAR EN SERVIDOR

Ahora necesitamos registrar el plugin en el servidor principal.

**Abrir archivo:**
```powershell
code backend/src/server.ts
```

o si no existe:

```powershell
code backend/src/app.ts
```

o si no existe:

```powershell
code backend/src/index.ts
```

**Localizar donde se registran otros plugins:**

**ENCONTRAR ALGO COMO:**
```typescript
import Fastify from 'fastify';

async function start() {
  const fastify = Fastify({ logger: true });
  
  // Register other plugins
  await fastify.register(cors);
  await fastify.register(helmet);
  // ...
```

**BUSCAR EXACTAMENTE ESTA SECCIÓN:**
```typescript
async function start() {
  const fastify = Fastify({ logger: true });
  
  // Register plugins
```

**AGREGAR ESTAS LÍNEAS (después de otros registros, ANTES de rutas):**

```typescript
async function start() {
  const fastify = Fastify({ logger: true });
  
  // Register security plugins FIRST
  await fastify.register(helmet);
  
  // SEC-RATE-LIMIT-001: Register rate limiting EARLY
  const { setupRateLimit } = await import('./plugins/rateLimit');
  await setupRateLimit(fastify);
  
  // Register other plugins
  await fastify.register(cors);
  
  // Then register routes
  fastify.register(productsRoutes);
  // ... other routes
```

**Si el archivo usa módulos ES6:**
```typescript
// Importar al principio del archivo:
import { setupRateLimit } from './plugins/rateLimit';

// Usar en función start:
await setupRateLimit(fastify);
```

**PASOS EN VS CODE:**
1. `Ctrl+F` → Buscar: `fastify.register`
2. `Ctrl+H` → Find and Replace
3. Localizar el primer registro de plugins
4. Agregar líneas de setupRateLimit
5. `Ctrl+S` → Guardar

---

## ✅ PASO 4: VERIFICAR DEPENDENCIA

Verificar que `@fastify/rate-limit` está instalado:

```powershell
# Ir a carpeta backend
cd backend

# Verificar en package.json
findstr "@fastify/rate-limit" package.json

# Si NO está instalada:
npm install @fastify/rate-limit

# Si SÍ está instalada:
# npm list @fastify/rate-limit
```

**Si está instalado:** ✅ Continuar

**Si falta instalar:**
```powershell
npm install @fastify/rate-limit
npm run dev  # Reiniciar servidor
```

---

## 🧪 PASO 5: EJECUTAR PRUEBAS

### Test 1: Request normal (dentro del límite)

```powershell
# Hacer 5 requests normales - Deben pasar
for ($i = 1; $i -le 5; $i++) {
  curl -i http://localhost:3001/api/v1/products
  Write-Host "---"
}

# Resultado esperado: 200 OK en todos
```

✅ Si ves "200 OK", es correcto

### Test 2: Muchos requests rápidos (excede límite)

```powershell
# Hacer 150 requests rápidos seguidos
# Esperado: primeros 100 = 200 OK, resto = 429 Too Many Requests

$passed = 0
$limited = 0

for ($i = 1; $i -le 150; $i++) {
  $response = curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/v1/products
  
  if ($response -eq "200") {
    $passed++
  } elseif ($response -eq "429") {
    $limited++
  }
  
  # Pequeña pausa
  Start-Sleep -Milliseconds 10
}

Write-Host "Results:"
Write-Host "✅ 200 OK: $passed"
Write-Host "🚫 429 Limited: $limited"
Write-Host "Expected: ~100 OK, ~50 Limited"
```

✅ Si ves aproximadamente 100 OK y ~50 Limited (429), es correcto

### Test 3: Con herramienta ab (Apache Bench)

```powershell
# Si tienes ab instalado (generalmente en herramientas web)
ab -n 150 -c 10 http://localhost:3001/api/v1/products

# Resultado esperado:
# Requests per second: bajo (limitado)
# Failed requests: ~50 (429s)
# Successful requests: ~100
```

✅ Si ves fallos intentados limitados, es correcto

---

## 📊 PASO 6: VALIDACIÓN FINAL

```powershell
cd ..  # Volver a carpeta raíz

.\validate-audits.ps1

# Debe mostrar:
# ✅ [PASS] Dependency Versions (si @fastify/rate-limit está instalado)
```

**Si pasa:** ✅ TAREA 4 COMPLETADA

**Si falla:**
```
❌ [FAIL] Dependency Versions
```
→ Revisar que `@fastify/rate-limit` está en package.json

---

## 🎯 CHECKLIST DE COMPLETITUD

- [ ] Archivo `backend/src/plugins/rateLimit.ts` creado o verificado
- [ ] Contiene `setupRateLimit` función
- [ ] Configurado para 100 req/min
- [ ] Archivo server (`server.ts`, `app.ts`, o `index.ts`) abierto
- [ ] Agregué línea: `await setupRateLimit(fastify)`
- [ ] Guardé el archivo
- [ ] Ejecuté: `npm install @fastify/rate-limit` (si faltaba)
- [ ] Reinicié servidor con `npm run dev`
- [ ] Probé 5 requests normales → Pasaron ✅
- [ ] Probé 150 requests rápidos → ~100 pasaron, ~50 fueron 429 ✅
- [ ] Ejecuté `.\validate-audits.ps1` → Pasó ✅

---

## 📋 REFERENCIA: RATE LIMITING LEVELS

| Endpoint | Límite | Razón |
|----------|--------|-------|
| GET /api/v1/products | 100/min | Búsqueda pública |
| GET /api/v1/products/:id | 100/min | Lectura individual |
| POST /auth/login | 5/min | Prevenir brute-force |
| POST /api/v1/cart | 20/min | Compras reguladas |
| GET /health | Sin límite | Health checks |

En esta tarea implementamos el 100/min global.

---

## 📞 TROUBLESHOOTING

### Problema: "@fastify/rate-limit not found"
**Solución:**
```powershell
cd backend
npm install @fastify/rate-limit
npm run dev  # Reiniciar
```

### Problema: "setupRateLimit is not a function"
**Solución:** Verificar:
1. El archivo `backend/src/plugins/rateLimit.ts` existe
2. Tiene `export async function setupRateLimit`
3. El import es correcto en server.ts

### Problema: Rate limiting no funciona (todos pasan)
**Solución:** Verificar que el plugin se registró:
```typescript
// En server.ts debe estar:
await setupRateLimit(fastify);
```

### Problema: Todos los requests retornan 429
**Solución:** El límite está muy bajo. Aumentar:
```typescript
max: 200,  // Aumentar de 100 a 200
```

### Problema: "listen EADDRINUSE: address already in use"
**Solución:**
```powershell
# Matar proceso anterior
Get-Process node | Stop-Process -Force

# Luego reiniciar
npm run dev
```

---

## 🚀 PRÓXIMO PASO: VALIDACIÓN FINAL DE FASE 1

Una vez completada esta tarea:

1. Commit los cambios:
```powershell
git add backend/src/plugins/rateLimit.ts backend/src/server.ts
git commit -m "security(rate-limit): implement rate limiting to prevent DoS attacks"
```

2. Ejecutar validación final:
```powershell
.\validate-audits.ps1

# Debe mostrar:
# ✅ [PASS] 7/7 tests
# 🎉 TODAS LAS PRUEBAS PASARON - LISTO PARA PRODUCCIÓN
```

3. Si TODOS los tests pasan → **FASE 1 COMPLETADA ✅**

4. Ver: **GROK_PHASE_1_COMPLETE.md** para instrucciones finales

---

**STATUS:** ⏳ EN PROGRESO  
**TIEMPO INVERTIDO:** ~30 minutos  
**SIGUIENTE:** Validación final de Fase 1

