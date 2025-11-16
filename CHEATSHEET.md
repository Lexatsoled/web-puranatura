# 🚀 CHEATSHEET - Auditoría Fase 0 & Fixes

**Para:** Developers necesitando info rápida  
**Duración lectura:** 2 minutos  
**Nivel:** Todos

---

## 📍 LOCALIZACIÓN RÁPIDA

### ¿Dónde está cada cosa?

| Necesito | Archivo | Línea |
|----------|---------|-------|
| Resumen ejecutivo | RESUMEN_AUDITORIA_EJECUTIVO.md | - |
| Arquitectura | ARCHITECTURE_MAP_AUDIT.md | - |
| Todos mis hallazgos | findings-audit.json | - |
| Plan de fixes | fix-plan-phases.md | - |
| Instrucciones Fase 1 | QUICK_START_PHASE_1.md | - |
| CSP meta tag | index.html | head |
| Security headers | backend/src/plugins/securityHeaders.ts | - |
| Seed password | backend/src/db/seed.ts | 6-13 |
| ImageZoom import | src/components/ImageZoom.tsx | 1 |
| Cache-busting | src/components/ImageZoom.tsx | 54-61 |
| DOMPurify | src/pages/ProductPage.tsx | ~180 |
| Rate limiting | backend/src/plugins/rateLimit.ts | - |
| Input validation | src/utils/api.ts | search |

---

## 🎯 QUICK FACTS

### Security Status
```
✅ Críticas:    0 (fixed)
✅ Altos:       2 (fixed: CSP + Seed)
⏳ Medios:      8 (6 en Fases 2-3)
📊 Score:      8/10
🎯 Go-Live:    ✅ Listo (con Fase 1)
```

### Performance
```
LCP (now):     3.2s
LCP (target):  2.5s (-22%)
Lighthouse:    65 → 85
API P95:       800ms → 300ms
```

### Accesibilidad
```
WCAG AA:       60% (90% after Fase 3)
Contrast:      23 violations (Fase 3)
Keyboard nav:  Parcial (Fase 3)
```

---

## 🔧 FIXES IMPLEMENTADOS

```bash
# CSP + Security Headers
grep -r "Content-Security-Policy" index.html

# Seed password
grep -r "randomBytes" backend/src/db/seed.ts

# ImageZoom
head -5 src/components/ImageZoom.tsx

# DOMPurify
grep -r "DOMPurify" src/pages/ProductPage.tsx
```

---

## 📋 TODO LIST (Fase 1 - Faltantes)

### Task 1: Input Validation (20 min)
```bash
# Editar
code src/utils/api.ts          # Frontend: Add length check
code backend/src/routes/v1/products.ts  # Backend: Return 400

# Test
curl "http://localhost:3001/api/v1/products?q=x" # ✅ OK
curl "http://localhost:3001/api/v1/products?q=$(python -c 'print("x"*250)')" # 400
```

### Task 2: Rate Limiting (30 min)
```bash
# Editar
code backend/src/plugins/rateLimit.ts  # Add @fastify/rate-limit

# Test
ab -n 150 -c 10 http://localhost:3001/api/v1/products
# Esperado: ~100 OK, ~50 429
```

---

## ✅ VALIDACIÓN

### Automática (recomendada)
```powershell
.\validate-audits.ps1
# Esperado: ✅ 7/7 tests passing
```

### Manual
```bash
# Verificar cada fix
npm run build           # Sin errores
npm run lint            # Sin warnings
npm test                # Tests pasando
npm run dev             # Inicia sin problemas
```

---

## 🗺️ ROADMAP (4 Semanas)

```
SEMANA 1: 🔴 Seguridad     (5/7 tasks ✅)
SEMANA 2: 📈 Performance   (3 tasks)
SEMANA 3: 🌍 Accesibilidad (2 tasks)
SEMANA 4: 🛠️ Mantenibilidad (2 tasks)
```

---

## 📊 MÉTRICAS

| Métrica | Antes | Ahora | Target |
|---------|-------|-------|--------|
| Críticas | 2 | 0 ✅ | 0 |
| LCP | 3.2s | 3.2s | 2.5s |
| WCAG AA | 60% | 60% | 90% |
| Tests | 65% | 65% | 85% |

---

## 🔗 KEY REFERENCES

**Si tienes:** → **Revisa:**
- Pregunta de seguridad → findings-audit.json (search by ID)
- Pregunta de architecture → ARCHITECTURE_MAP_AUDIT.md
- Necesitas implementar algo → fix-plan-phases.md + diffs
- Necesitas validar → validate-audits.ps1
- Necesitas roadmap → RESUMEN_AUDITORIA_EJECUTIVO.md

---

## 🎓 CONCEPTOS CLAVE

### CSP (Content Security Policy)
- **Qué:** Previene XSS diciéndole al navegador de dónde cargar recursos
- **Dónde:** index.html (meta tag) + backend headers
- **Validación:** DevTools → Security tab, debería mostrar CSP headers

### Cache-Busting
- **Qué:** Agregar versión a URL para evitar caché viejo (?v=timestamp)
- **Dónde:** src/components/ImageZoom.tsx
- **Validación:** Inspeccionar Network, ver ?v=123456789 en URLs

### Rate Limiting
- **Qué:** Limitar requests por IP para prevenir DoS/scraping
- **Dónde:** backend/src/plugins/rateLimit.ts
- **Validación:** 101+ requests/min → recibir 429 status

### Input Validation
- **Qué:** Verificar longitud/formato antes de procesar
- **Dónde:** Frontend + Backend (defense in depth)
- **Validación:** Query > 200 chars → 400 Bad Request

---

## 🚨 HALLAZGOS CRÍTICOS (YA FIXED)

| ID | Problema | Fix | Impacto |
|----|---------|----|---------|
| SEC-CSP-001 | Sin CSP | Agregar meta tag + headers | XSS mitigation +99% |
| SEC-SEED-001 | test123 hardcoded | Random generation | Previene backdoor |

---

## ⚠️ HALLAZGOS MEDIOS (EN PROGRESO)

| ID | Problema | Fase | Timeline |
|----|---------|------|----------|
| PERF-IMG-001 | Imágenes sin WebP | 2 | 1-2 sem |
| A11Y-CONTRAST-001 | Contraste < 4.5:1 | 3 | Semana 3 |
| PERF-N+1-001 | N+1 queries | 2 | 1-2 sem |
| SEC-INPUT-001 | Sin validación | 1 | 20 min ⏳ |
| SEC-RATE-LIMIT-001 | Sin rate limit | 1 | 30 min ⏳ |

---

## 💡 PRO TIPS

1. **Ejecutar validación primero**
   ```powershell
   .\validate-audits.ps1
   ```
   Te dice exactamente qué está faltando

2. **Leer findings-audit.json primero**
   - Estructurado, fácil de buscar
   - Incluye diffs de código
   - Validación tests incluida

3. **Para implementar Fase 1**
   - Seguir QUICK_START_PHASE_1.md exactamente
   - No saltarse los tests
   - Validar después con script

4. **Para arquitectura**
   - ARCHITECTURE_MAP_AUDIT.md tiene diagramas
   - inventory-audit.json tiene lista de archivos
   - Útil para onboarding

5. **Performance gains son huge en Fase 2**
   - -30-40% LCP
   - -63% API latency
   - +2-3% conversión esperada

---

## 🎯 NEXT ACTIONS (Por rol)

**Developer implementando:**
→ Abrir QUICK_START_PHASE_1.md + terminal

**Tech Lead revisando:**
→ Ejecutar validate-audits.ps1 + leer ARCHITECTURE_MAP_AUDIT.md

**Manager tracking:**
→ Leer RESUMEN_AUDITORIA_EJECUTIVO.md (5 min)

**DevOps deploying:**
→ Usar validate-audits.ps1 en CI/CD

---

## 📞 QUICK HELP

```
¿Qué es CSP?
→ ARCHITECTURE_MAP_AUDIT.md, Security section

¿Por qué necesitamos rate limiting?
→ findings-audit.json, search "SEC-RATE-LIMIT"

¿Cuánto tiempo lleva cada fix?
→ QUICK_START_PHASE_1.md, timeline section

¿Cómo valido los cambios?
→ Ejecutar: .\validate-audits.ps1

¿Dónde están los diffs?
→ fix-plan-phases.md o findings-audit.json
```

---

## 🎓 CHEAT CODES (One-liners)

```powershell
# Ver todos los hallazgos de seguridad
findstr /r "SEC-" findings-audit.json | head -10

# Contar hallazgos por severidad
(Get-Content inventory-audit.json | ConvertFrom-Json).findings | Group-Object severity | Select-Object Name, Count

# Validar proyecto
.\validate-audits.ps1

# Ver CSP headers
curl -i http://localhost:3001/api/v1/products | findstr /i "content-security-policy"

# Build sin warnings
npm run build 2>&1 | findstr "warning"
```

---

**Version:** 1.0  
**Last updated:** 2025-11-11  
**Print-friendly:** ✅ (este documento)

*Guarda este cheatsheet en tus favoritos - lo usarás frecuentemente*

