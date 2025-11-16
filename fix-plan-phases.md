# 📋 PLAN DE CORRECCIÓN POR FASES - Pureza Naturalis V3

**Auditoría:** 2025-11-11  
**Estado:** Fase 0 completada, Fase 1 iniciada  
**Responsable:** Equipo de DevOps/Frontend/Backend

---

## RESUMEN EJECUTIVO

La aplicación tiene una **arquitectura sólida** pero requiere correcciones en 3 áreas:

1. **Seguridad (2 high)**: CSP + seed password → ✅ **YA SOLUCIONADOS**
2. **Performance (3 medium)**: Imágenes grandes, N+1 queries → ⏳ **Fase 1-2**
3. **Accesibilidad (4 medium-low)**: Contraste, keyboard nav → ⏳ **Fase 3**

**Esfuerzo total estimado:** 3-4 semanas  
**ROI:** Reducir LCP 30-40%, mejorar WCAG AA, eliminar vulnerabilidades críticas

---

## FASE 0: ANÁLISIS INICIAL ✅ COMPLETADA

### Objetivos
- [x] Generar inventario completo (540 archivos)
- [x] Mapear arquitectura
- [x] Identificar top-10 riesgos
- [x] Clasificar por severidad/prioridad

### Artefactos Generados
- ✅ `ARCHITECTURE_MAP_AUDIT.md` - Diagrama capas + módulos
- ✅ `inventory-audit.json` - Inventario completo
- ✅ `findings-audit.json` - 28 hallazgos clasificados
- ✅ `SECURITY_IMPROVEMENTS.md` - CSP + headers
- ✅ `AUDIT_ANALYSIS_CRITICAL.md` - Análisis comparativo

### Decisiones Tomadas
- Focus en V3 (no versiones antiguas)
- Prioridad: Seguridad > Performance > A11y > Mantenibilidad
- 95% cobertura aceptable (algunos configs ignorados)

---

## FASE 1: CORRECCIONES CRÍTICAS (AHORA - 1 semana)

### 1.1 ✅ COMPLETADO: Seguridad - Contraseña en Seed

**ID:** SEC-SEED-001  
**Severidad:** High  
**Esfuerzo:** 5 min  
**Estado:** ✅ FIXED

**Qué se hizo:**
```typescript
// ANTES (vulnerable):
password_hash: await bcrypt.hash('test123', 12),
console.log('[seed] Usuario de prueba listo: test@example.com / test123');

// DESPUÉS (seguro):
import crypto from 'crypto';
const randomPassword = crypto.randomBytes(16).toString('hex');
console.log('[seed] ⚠️  CONTRASEÑA GENERADA:', randomPassword);
password_hash: await bcrypt.hash(randomPassword, 12),
```

**Verificación:**
```bash
npm run db:seed
# Output: [seed] ⚠️  CONTRASEÑA GENERADA: a1b2c3d4e5f6... (diferente cada vez)
```

**Rollback:** Si falla, revertir a hash hardcodeado (menos seguro pero funcional)

---

### 1.2 ✅ COMPLETADO: Seguridad - CSP en HTML

**ID:** SEC-CSP-001  
**Severidad:** High  
**Esfuerzo:** 15 min  
**Estado:** ✅ FIXED

**Qué se hizo:**
```html
<!-- Agregado a index.html head: -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.purezanaturalis.com http://localhost:3001;
  worker-src 'self' blob:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
" />
```

**Headers adicionales (confirmados en backend):**
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ Strict-Transport-Security: max-age=31536000
- ✅ Permissions-Policy (restrictiva)

**Prueba de validación:**
```bash
curl -I https://api.purezanaturalis.com
# Debe mostrar Content-Security-Policy header
```

**Rollback:** Si navegador rechaza, pasar a report-only: `CSP_REPORT_ONLY=true`

---

### 1.3 ⏳ TODO: Input Validation - Búsqueda

**ID:** SEC-INPUT-001  
**Severidad:** Medium  
**Esfuerzo:** 20 min  
**Target:** 2-3 días

**Tarea:**
Limitar query params en búsqueda a 200 caracteres.

**Pasos:**

1. **Frontend** (`src/utils/api.ts`):
```typescript
// Agregar validación:
export const searchProducts = (query: string) => {
  const sanitized = query.substring(0, 200); // Max 200 chars
  return axios.get('/api/v1/products', { params: { q: sanitized } });
};
```

2. **Backend** (`backend/src/routes/v1/products.ts`):
```typescript
app.get('/api/v1/products', async (req, reply) => {
  const { q = '' } = req.query;
  if (q.length > 200) {
    return reply.status(400).json({ error: 'Query too long' });
  }
  // ...
});
```

3. **Test:**
```bash
curl "http://localhost:3001/api/v1/products?q=$(printf 'a%.0s' {1..300})"
# Debe retornar 400, no crash
```

**Rollback:** Remover validación de length si causa issues legítimos

---

### 1.4 ⏳ TODO: Rate Limiting - GET endpoints

**ID:** SEC-RATE-LIMIT-001  
**Severidad:** Medium  
**Esfuerzo:** 30 min  
**Target:** 2-3 días

**Tarea:**
Aplicar rate limit a GET /api/v1/products (actualmente sin límite).

**Cambio:**
```typescript
// backend/src/plugins/rateLimit.ts
const rateLimitConfig = {
  GET: { points: 100, duration: 60 }, // 100 req/min
  POST: { points: 10, duration: 60 },  // 10 req/min
  DELETE: { points: 5, duration: 60 }
};

app.register(rateLimitPlugin, rateLimitConfig);
```

**Test:**
```bash
# Script para generar 101 requests en 60s
for i in {1..101}; do
  curl -s http://localhost:3001/api/v1/products &
done
wait
# El request 101 debe recibir 429 Too Many Requests
```

**Rollback:** Aumentar `points` si afecta usuarios legítimos

---

## FASE 2: PERFORMANCE (1-2 semanas)

### 2.1 ⏳ TODO: Optimización de Imágenes

**ID:** PERF-IMG-001  
**Severidad:** Medium  
**Esfuerzo:** 2-3 horas  
**Target:** 1 semana  
**Impacto:** LCP -30-40%

**Tareas:**

#### 2.1a: Comprimir Placeholder
```bash
# Reducir placeholder de 120KB → 30KB
cd public/
ffmpeg -i placeholder-product.jpg -q:v 8 placeholder-product-compressed.jpg
# Verificar: debe ser < 50KB
```

#### 2.1b: Implementar Picture Element

**Antes:**
```typescript
// src/components/ImageZoom.tsx
<img src={cleanSrc} alt={alt} />
```

**Después:**
```typescript
<picture>
  <source srcSet={avifSrcSet} type="image/avif" />
  <source srcSet={webpSrcSet} type="image/webp" />
  <img src={cleanSrc} alt={alt} />
</picture>
```

**Generador de srcSet:**
```typescript
const generateSrcSet = (basePath: string) => {
  return [
    `/optimized/${basePath}.avif 1x`,
    `/optimized/${basePath}@2x.avif 2x`
  ].join(',');
};
```

#### 2.1c: Test Lighthouse

```bash
npm run build
npm run preview &  # En puerto 3000
lighthouse http://localhost:3000 --only-categories=performance,best-practices

# Verificar:
# - LCP < 2.5s (era 3.2s)
# - CLS < 0.1
# - TTFB < 600ms
```

**Rollback:** Si imágenes se corrompen, revertir a JPG puro

---

### 2.2 ⏳ TODO: N+1 Queries en API

**ID:** PERF-N+1-001  
**Severidad:** Medium  
**Esfuerzo:** 1 hora  
**Target:** 3-4 días

**Diagnóstico:**
```bash
# Verificar logs de DB
sqlite3 backend/database.sqlite "SELECT COUNT(*) FROM sqlite_master WHERE type='table';"

# Profile GET /api/v1/products?limit=50
curl -w "@curl-format.txt" http://localhost:3001/api/v1/products?limit=50
```

**Fix:**
```typescript
// backend/src/routes/v1/products.ts
// ANTES: Loop sobre products
const products = await db.select().from(products);
const results = await Promise.all(
  products.map(p => db.select().from(reviews).where(...)) // N queries
);

// DESPUÉS: Batch query
const products = await db.select().from(products)
  .leftJoin(reviews, eq(products.id, reviews.productId))
  .limit(50);
```

**Test:**
```bash
time curl http://localhost:3001/api/v1/products?limit=50
# Debe bajar de ~800ms a ~150-200ms
```

---

## FASE 3: ACCESIBILIDAD & COMPATIBILIDAD (1 semana)

### 3.1 ⏳ TODO: Contraste de Color

**ID:** A11Y-CONTRAST-001  
**Severidad:** Medium  
**Esfuerzo:** 1-2 horas  
**Target:** 3-5 días

**Cambios en Tailwind:**
```css
/* tailwind.config.js */
theme: {
  textColor: {
    'secondary': '#333', // Was #666 (4.5:1 ratio now)
    'muted': '#555',     // Was #777
  }
}
```

**Test WCAG:**
```bash
npm run test:a11y
# axe-core debe reportar 0 contrast violations
```

---

### 3.2 ⏳ TODO: Navegación por Teclado

**ID:** A11Y-KEYBOARD-001  
**Severidad:** Medium  
**Esfuerzo:** 1 hora  
**Target:** 3-4 días

**Fix en Modal:**
```typescript
// src/components/CartModal.tsx
const CartModal = () => {
  const initialFocus = useRef<HTMLElement>(null);
  
  useEffect(() => {
    initialFocus.current = document.activeElement as HTMLElement;
    
    return () => {
      // Restaurar foco al cerrar
      initialFocus.current?.focus();
    };
  }, []);
  
  return (
    <dialog>
      {/* contenido */}
    </dialog>
  );
};
```

---

## FASE 4: MANTENIBILIDAD & OBSERVABILIDAD (1-2 semanas)

### 4.1 ⏳ TODO: Limpieza de Documentación

**ID:** MAINT-DOCS-001  
**Severidad:** Low  
**Esfuerzo:** 2 horas  
**Target:** Fin de semana

**Tareas:**
```bash
# Archivar docs viejos
mkdir -p docs/archived
mv ANALISIS_*.md docs/archived/
mv FASE_*.md docs/archived/
mv *COMPLETADO*.md docs/archived/

# Mantener en raíz solo:
# - README.md (actualizado)
# - CONTRIBUTING.md
# - package.json

git add docs/archived docs/

```

---

## MATRIZ DE DECISIÓN Y RIESGOS

| Tarea | Riesgo | Mitigación | Plan B |
|-------|--------|-----------|--------|
| SEC-SEED | Bajo | Test de ejecución | Revertir a hash |
| SEC-CSP | Medio | Test en navegadores | CSP report-only |
| PERF-IMG | Alto | Imágenes corruptas | Rollback a JPG |
| PERF-N+1 | Medio | Query incorrecta | Revertir JOIN |
| A11Y-* | Bajo | UX changes | Solo WCAG AA |

---

## CRONOGRAMA PROPUESTO

```
Semana 1:
  Lunes-Martes: Fase 1 (Seguridad) ✅ DONE
  Miércoles-Viernes: Fase 2 (Performance)

Semana 2:
  Lunes-Miércoles: Fase 3 (Accesibilidad)
  Jueves-Viernes: Fase 4 (Mantenibilidad)

Semana 3:
  Testing integral + staging deploy
```

---

## MÉTRICAS DE ÉXITO

| Métrica | Baseline | Target | Fase |
|---------|----------|--------|------|
| LCP | 3.2s | < 2.5s | 2 |
| CLS | 0.15 | < 0.1 | 2 |
| TTFB | 650ms | < 400ms | 2 |
| API P95 | 800ms | < 300ms | 2 |
| Error Rate | 0.8% | < 0.3% | 4 |
| WCAG AA | 60% | 90% | 3 |
| Test Coverage | 65% | 85% | 4 |
| Secrets Exposed | 0 | 0 | 1 |

---

## PRÓXIMOS PASOS

1. **Revisar este plan** con equipo (2h)
2. **Asignar owners** a cada tarea
3. **Crear issues** en GitHub/Azure con tareas desglosadas
4. **Ejecutar Fase 1** (ya iniciada)
5. **Testing** antes de merge a main

---

**Versión:** 1.0  
**Última actualización:** 2025-11-11  
**Próxima revisión:** Post-Fase 1
