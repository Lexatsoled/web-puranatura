# 🎯 KIT COMPLETO DE HERRAMIENTAS FASE 2

**Pureza Naturalis V3** - Fase 2: Rendimiento & UX  
📅 Actualizado: 11 de Noviembre 2025  
👤 Preparado para: Grok AI + Equipo de Desarrollo

---

## 📚 CONTENIDOS DEL KIT

Este directorio contiene todas las herramientas, scripts, tests e instrucciones para ejecutar **Fase 2** de forma profesional y automatizada.

### Estructura de Archivos

```
tools/
├── FASE_2_SETUP.ps1                      ✅ Setup inicial
├── FASE_2_VALIDATE.ps1                   ✅ Validador de tareas
├── FASE_2_MONITOR.ps1                    ✅ Dashboard en tiempo real
├── FASE_2_ROLLBACK.ps1                   ✅ Script de rollback
├── FASE_2_IMPLEMENTATION_GUIDE.md         ✅ Guía paso a paso
├── tests/
│   ├── perf-img.test.ts                  ✅ Tests para PERF-IMG-001
│   ├── perf-bundle.test.ts               ✅ Tests para PERF-BUNDLE-001
│   ├── perf-cache.test.ts                ✅ Tests para PERF-CACHE-001
│   ├── perf-n+1.test.ts                  ✅ Tests para PERF-N+1-001
│   └── ux-error.test.ts                  ✅ Tests para UX-ERROR-001
├── metrics/
│   └── baseline.json                     📊 Métricas base capturadas
├── reports/
│   └── *.json                            📄 Reportes de validación
└── logs/
    └── setup-status.json                 📋 Status del setup
```

---

## 🚀 FLUJO DE EJECUCIÓN (Quick Start)

### Día 1: Setup

```bash
# 1. Setup inicial
.\tools\FASE_2_SETUP.ps1

# 2. Verificar que todo esté listo
ls ./tools/metrics/baseline.json
```

**Resultado esperado:**
- ✅ Dependencias verificadas
- ✅ Herramientas instaladas
- ✅ Rama 'fase-2' creada
- ✅ Métricas base guardadas

### Días 2-5: Implementación

**Para cada tarea (ejecutar en orden):**

```bash
# 1. Leer instrucciones
cat .\tools\FASE_2_IMPLEMENTATION_GUIDE.md

# 2. Implementar según sección correspondiente
# PERF-IMG-001, PERF-BUNDLE-001, etc.

# 3. Ejecutar tests
npm run test -- tools/tests/perf-img.test.ts

# 4. Validar tarea
.\tools\FASE_2_VALIDATE.ps1 -Task perf-img-001

# 5. Monitorear métricas
.\tools\FASE_2_MONITOR.ps1

# 6. Commit cambios
git add -A
git commit -m "feat: implementar PERF-IMG-001"
```

### Día 6-7: Validación Final

```bash
# 1. Validar todas las tareas
.\tools\FASE_2_VALIDATE.ps1 -CheckAll

# 2. Ver dashboard
.\tools\FASE_2_MONITOR.ps1 -ShowDetails

# 3. Crear PR y merge
git checkout main
git merge fase-2 --no-ff
git push origin main
```

---

## 📋 HERRAMIENTAS DISPONIBLES

### 1. FASE_2_SETUP.ps1 - Setup Inicial

**Qué hace:**
- Verifica Node.js, npm, git
- Instala herramientas de análisis (Lighthouse, bundlesize, etc)
- Crea directorio de herramientas (/tools/metrics, /tools/tests, etc)
- Captura métricas base del estado actual
- Inicializa Git tracking

**Uso:**
```bash
.\tools\FASE_2_SETUP.ps1
.\tools\FASE_2_SETUP.ps1 -SkipMetrics  # Omitir captura de métricas
.\tools\FASE_2_SETUP.ps1 -Verbose      # Modo verbose
```

**Salida:**
```json
{
  "timestamp": "2025-11-11 12:00:00",
  "bundleSize": 450.5,
  "metrics": {
    "lcp": "~3.5s",
    "fcp": "~1.8s",
    "api_p95": "~450ms"
  }
}
```

---

### 2. FASE_2_VALIDATE.ps1 - Validador de Tareas

**Qué hace:**
- Verifica que archivos fueron modificados
- Ejecuta tests para cada tarea
- Compara métricas vs targets
- Genera reporte de validación
- Calcula score de completitud

**Uso:**
```bash
# Validar una tarea específica
.\tools\FASE_2_VALIDATE.ps1 -Task perf-img-001

# Validar todas las tareas
.\tools\FASE_2_VALIDATE.ps1 -CheckAll

# Verbose para debugging
.\tools\FASE_2_VALIDATE.ps1 -Task perf-bundle-001 -Verbose
```

**Salida esperada:**
```
✅ PERF-IMG-001: PASSED (Score 100%)
   ✅ Files Changed: 3/3 modificados
   ✅ Tests: PASARON (5/5 assertions)
   ✅ Metrics: LCP 2.3s (target 2.5s)
```

**Reportes guardados en:** `./tools/reports/`

---

### 3. FASE_2_MONITOR.ps1 - Dashboard en Tiempo Real

**Qué hace:**
- Monitorea Lighthouse scores (LCP, FCP, CLS)
- Tracka bundle size
- Mide API response times (P95, median)
- Monitorea cache hit rates
- Muestra cambios en Git

**Uso:**
```bash
# Dashboard con actualización cada 30s
.\tools\FASE_2_MONITOR.ps1

# Intervalo personalizado
.\tools\FASE_2_MONITOR.ps1 -Interval 10

# Exportar métricas a JSON
.\tools\FASE_2_MONITOR.ps1 -Export

# Mostrar detalles
.\tools\FASE_2_MONITOR.ps1 -ShowDetails
```

**Interfaz:**
```
╔════════════════════════════════════════════════════╗
║  📊 DASHBOARD FASE 2 - MONITOREO EN TIEMPO REAL   ║
║  12:34:56                                         ║
╚════════════════════════════════════════════════════╝

🔍 LIGHTHOUSE SCORES:
  ✅ LCP: 2.3s (target: 2.5s)
  ✅ FCP: 1.6s (target: 1.8s)

📦 BUNDLE SIZE:
  ⚠️  Bundle: 365KB (target: 350KB)
  📈 Mejora: 18.9% vs baseline

⚡ API PERFORMANCE:
  ✅ P95: 280ms (target: 300ms)
```

---

### 4. FASE_2_ROLLBACK.ps1 - Script de Rollback

**Qué hace:**
- Revierte commits específicos
- Revierte tarea específica
- Limpia build y reinstala dependencias
- Restaura DB desde backup
- Validación post-rollback

**Uso:**
```bash
# Revertir últimos 3 commits
.\tools\FASE_2_ROLLBACK.ps1 -RevertLastCommit -Commits 3

# Revertir tarea específica
.\tools\FASE_2_ROLLBACK.ps1 -Task perf-bundle-001

# Limpieza de build
.\tools\FASE_2_ROLLBACK.ps1 -CleanBuild

# Rollback completo (CUIDADO!)
.\tools\FASE_2_ROLLBACK.ps1 -FullRollback
```

**Procedimiento de rollback:**
1. Valida estado actual del repo
2. Crea backup de cambios en stash
3. Revierte a punto anterior
4. Valida que todo está limpio
5. Muestra logs de cambios

---

### 5. FASE_2_IMPLEMENTATION_GUIDE.md - Guía Step-by-Step

**Contiene:**
- Setup inicial detallado
- Instrucciones por cada tarea (PERF-IMG-001 a UX-ERROR-001)
- Código de ejemplo para cada implementación
- Comandos para validación
- Troubleshooting y contactos

**Secciones:**
1. Setup Inicial
2. PERF-IMG-001: Optimizar Imágenes (picture element)
3. PERF-BUNDLE-001: Reducir Bundle (code splitting, tree-shaking)
4. PERF-CACHE-001: Estrategias de Caché (HTTP headers, Redis)
5. PERF-N+1-001: Eliminar N+1 Queries (JOINs, profiling)
6. UX-ERROR-001: Mejorar Errores (retry, fallback UI)
7. Validación Final

---

## 🧪 TESTS AUTOMÁTICOS

Todos los tests están en `tools/tests/` y se ejecutan con:

```bash
npm run test -- tools/tests/perf-img.test.ts
```

### Test Suite por Tarea

#### ✅ perf-img.test.ts (PERF-IMG-001)
- Picture element implementation
- Srcset con múltiples resoluciones
- AVIF/WebP/JPEG fallback
- Reducción de tamaño de imagen
- LCP < 2.5s
- Cache-Control headers
- Accessibility (alt text)

#### ✅ perf-bundle.test.ts (PERF-BUNDLE-001)
- Bundle < 350KB
- Vendor < 200KB
- Code splitting (múltiples chunks)
- Tree-shaking & minificación
- Asset optimization
- Degradation check

#### ✅ perf-cache.test.ts (PERF-CACHE-001)
- HTTP Cache-Control headers
- ETag validation
- Cache hit rate > 60%
- 304 responses (Not Modified)
- Redis backend cache
- Client-side caching
- Invalidation en POST/PUT/DELETE

#### ✅ perf-n+1.test.ts (PERF-N+1-001)
- Eliminación de N+1 queries
- JOINs vs separate queries
- Query profiling (X-Query-Count header)
- P95 < 300ms
- 80% reducción de queries
- Lazy loading elimination

#### ✅ ux-error.test.ts (UX-ERROR-001)
- Contextual error messages
- Error codes y details
- Auto-retry con exponential backoff
- Diferenciación 4xx vs 5xx
- Error recovery > 90%
- Fallback UI & skeletons
- Error analytics & logging

---

## 📊 MÉTRICAS Y TARGETS

| Métrica | Baseline | Target | Mejora |
|---------|----------|--------|--------|
| LCP | 3.5s | 2.5s | ↓ 30% |
| FCP | 1.8s | 1.8s | ↓ 0% |
| CLS | 0.15 | 0.1 | ↓ 33% |
| Bundle | 450KB | 350KB | ↓ 22% |
| API P95 | 450ms | 300ms | ↓ 33% |
| Cache Hit | ~20% | >60% | ↑ 200% |
| Queries | 11+ | 2-3 | ↓ 80% |

---

## 🛠️ DEPENDENCIAS INSTALADAS

El script de setup instala automáticamente:

```json
{
  "devDependencies": {
    "lighthouse": "^10.0.0",
    "bundlesize": "^0.18.0",
    "size-limit": "^8.0.0",
    "@vitest/ui": "^0.34.0",
    "autocannon": "^7.10.0",
    "sharp": "^0.33.0",
    "imagemin": "^8.0.0"
  }
}
```

---

## 📋 CHECKLIST PRE-IMPLEMENTACIÓN

Antes de comenzar Fase 2:

- [ ] Ejecutar `FASE_2_SETUP.ps1`
- [ ] Verificar rama 'fase-2' creada
- [ ] Revisar métricas base en `./tools/metrics/baseline.json`
- [ ] Leer `FASE_2_IMPLEMENTATION_GUIDE.md`
- [ ] Asignar tareas a team members
- [ ] Configurar canal de comunicación
- [ ] Establecer daily sync-ups

---

## 🚨 TROUBLESHOOTING

### Tests no pasan

```bash
# 1. Limpiar e reinstalar
rm -r node_modules
npm install

# 2. Limpiar build
npm run build:clean
npm run build

# 3. Ejecutar tests con verbosity
npm run test -- --reporter=verbose
```

### Rollback necesario

```bash
# Opción 1: Revertir commits específicos
.\tools\FASE_2_ROLLBACK.ps1 -RevertLastCommit -Commits 2

# Opción 2: Revertir tarea
.\tools\FASE_2_ROLLBACK.ps1 -Task perf-img-001

# Opción 3: Limpieza de build
.\tools\FASE_2_ROLLBACK.ps1 -CleanBuild
```

### Backend no responde

```bash
# Verificar que backend está corriendo
curl http://localhost:3001/health

# Si no responde
cd backend
npm run dev

# En otra terminal, correr frontend
npm run dev
```

---

## 👥 RESPONSABILIDADES

| Task | Owner | Dependencies |
|------|-------|--------------|
| PERF-IMG-001 | Frontend Lead | Sharp, imagemin |
| PERF-BUNDLE-001 | Frontend Lead | Vite, terser |
| PERF-CACHE-001 | Backend Lead | Redis, Fastify |
| PERF-N+1-001 | Backend Lead | Drizzle ORM |
| UX-ERROR-001 | Frontend Lead | React, Error Boundary |

---

## 📞 CONTACTOS Y SOPORTE

- **Lead de Proyecto:** [Nombre]
- **Frontend Lead:** [Nombre]
- **Backend Lead:** [Nombre]
- **DevOps:** [Nombre]

Contactar si hay problemas con:
- Setup o instalación
- Tests fallando
- Métricas no mejorando
- Problemas de performance en stage

---

## 📈 TIMELINE ESTIMADO

| Fase | Duración | Tasks |
|------|----------|-------|
| Setup | 1 día | FASE_2_SETUP.ps1 |
| Implementación | 4 días | 5 tasks en paralelo |
| Testing | 1 día | Validación completa |
| Deployment | 0.5 día | Merge a main |
| **Total** | **~1 semana** | |

---

## ✅ DEFINICIÓN DE "HECHO"

Fase 2 se considera completada cuando:

- ✅ Todos los tests pasan
- ✅ `FASE_2_VALIDATE.ps1 -CheckAll` retorna 100% en todas las tareas
- ✅ Métricas mejoran 30-50% vs baseline
- ✅ PR aprobado y mergeado a main
- ✅ Deployment a staging/producción exitoso
- ✅ Monitoreo activo en producción

---

## 📚 RECURSOS ADICIONALES

- [FASE_2_IMPLEMENTATION_GUIDE.md](./FASE_2_IMPLEMENTATION_GUIDE.md) - Guía detallada
- [CHECKLIST_FASE_2.md](../CHECKLIST_FASE_2.md) - Checklist operativo
- [REFERENCIA_RAPIDA.md](../REFERENCIA_RAPIDA.md) - Quick reference
- [FASE_2_PLAN.md](../FASE_2_PLAN.md) - Plan estratégico

---

## 🎯 SIGUIENTE PASO

```bash
# 1. Ejecutar setup
.\tools\FASE_2_SETUP.ps1

# 2. Leer guía de implementación
cat .\tools\FASE_2_IMPLEMENTATION_GUIDE.md

# 3. Comenzar con PERF-IMG-001
# (Seguir secciones en guía)

# 4. Durante desarrollo, monitorear
.\tools\FASE_2_MONITOR.ps1

# 5. Al terminar, validar
.\tools\FASE_2_VALIDATE.ps1 -CheckAll
```

---

**Última actualización:** 11 de Noviembre 2025  
**Versión:** 1.0.0  
**Status:** ✅ Listo para Implementación

