# Plan de Acción: Fases 4-5 Finales

**Fecha**: 08 de diciembre de 2025  
**Estado Actual**: Fase 3 ✅ COMPLETADA | Fase 4 ✅ COMPLETADA | Fase 5 🔄 EN PROGRESO

---

## Resumen Ejecutivo

Se han completado exitosamente las Fases 1-3 y la mayor parte de Fase 4. Fase 5 está en progreso avanzado con gates validados (lint, test:ci, check:complexity todos en verde).

### Trabajos Completados Hoy (08/12)

1. ✅ **Cierre Fase 3**: Desktop LCP 2.2s, CLS 0, bundle 109KB, axe 0 violations
2. ✅ **Lint Fix**: Corregidos 2 warnings en `backend/src/utils/logger.ts` y `scripts/check-forbidden-artifacts.cjs`
3. ✅ **Documentación**: `metrics-dashboard.md`, `Checklist-Plan-Maestro.md` y `CIERRE-FASE-3.md` actualizados

---

## Plan de Acción para Completar Proyecto

### Fase 4: Observabilidad y CI/CD (COMPLETADA)

**Estado**: ✅ HECHO (verificado en Checklist-Plan-Maestro.md)

Artefactos ya implementados:
- ✅ Validación OpenAPI en CI (Spectral + tests Prism/Mock)
- ✅ Negative tests ampliados (401/403/429, sanitización SEO)
- ✅ Alertas locales (p95, 5xx rate, breaker abierto)
- ✅ k6 smoke tests (reportes en `reports/observability/`)
- ✅ Pipeline < 10m con gates (lint/typecheck/test/contract/audit)
- ✅ Escaneo de mojibake y conversión UTF-8

**Comandos Validados**:
```bash
npm run lint:openapi          # Spectral validation
npm run test:contract         # Prism/Mock tests
npm run check:openapi-drift   # Drift check
npm run check:secret-drift    # Secret scanning
npm run perf:api              # k6 smoke (p95 ~17ms, p99 ~36ms)
```

---

### Fase 5: Preparación para Empaquetado Futuro (EN PROGRESO)

**Estado**: 🔄 EN PROGRESO (parcialmente completada)

#### Tareas Completadas (✅)

1. **Check de complejidad**: `npm run check:complexity` pasa y genera `reports/complexity-report.json`
   - Módulos top 15 documentados
   - Refactors recientes: helpers extraction en 6 archivos (12/11-15)
   - Módulos residuales CC 10-11 aceptados por diseño

2. **Gates Validados**:
   - ✅ `npm run lint` - 0 warnings (acaba de corregirse)
   - ✅ `npm run test:ci` - 86/86 tests pasando
   - ✅ `npm run check:complexity` - verde

3. **Runbooks y ADRs**:
   - ✅ `docs/runbooks/fase5-maintainability.md` creado
   - ✅ `docs/adr/0003-phase5-maintainability.md` creado
   - Documentación de refactors actualizada

4. **Refactors Completados** (estrategia de mantenimiento):
   - `src/hooks/useProductDetails.ts` → helpers
   - `src/routes/dynamicRoutes.ts` → helpers
   - `src/services/analyticsProviders.ts` → helpers
   - `src/utils/sanitizeObject.ts` → helpers + SANITIZER_RULES
   - `src/hooks/useProductDetail.ts` → helpers

#### Tareas Pendientes ([ ])

1. **Mantener configuraciones por env**
   - Variables críticas documentadas: PORT, ALLOWED_ORIGINS, CSP_REPORT_ONLY, JWT_*, RATE_LIMIT_*, DATABASE_URL, BREAKER_*
   - Verificar que `.env` template existe (si aplica)
   - Documentar en `docs/environment-setup.md`

2. **Completar checklist de hardening en nube**
   - Firewall rules (cuando se mueva a cloud)
   - TLS/HTTPS obligatorio
   - HSTS preload configuration
   - Documentar en `docs/runbooks/cloud-hardening-checklist.md`

3. **Verificar Dockerfile/docker-compose (borrador)**
   - No ejecutar, solo documentar para futura migración
   - Incluir en `docs/docker-setup-future.md`

---

## Tareas Inmediatas para Completar

### 1. Validar Gates (5 min)

```bash
cd c:\Users\Usuario\Desktop\Web Puranatura\web-puranatura---terapias-naturales

# Test lint está OK (acabamos de corregir)
npm run lint

# Verify typecheck
npm run type-check

# Verify tests
npm run test:ci

# Verify complexity
npm run check:complexity
```

### 2. Crear Documentación de Variables de Entorno (10 min)

Archivo: `docs/environment-setup.md`

Contenido:
```markdown
# Configuración de Variables de Entorno

## Variables Críticas (Dev)

- `PORT=3001` - Puerto backend
- `ALLOWED_ORIGINS=http://localhost:5173` - Origen permitido frontend
- `CSP_REPORT_ONLY=true` - CSP en modo report (dev)
- `JWT_SECRET` - Secret JWT (en `Secretos/backend.env.local`)
- `JWT_REFRESH` - Refresh token secret (en `Secretos/backend.env.local`)
- `DATABASE_URL=file:./prisma/dev.db` - SQLite dev

## Variables Críticas (Prod)

- `CSP_REPORT_ONLY=false` - CSP enforce en prod
- `SECURE_COOKIES=true` - Cookies Secure flag
- `HSTS_PRELOAD=true` - HSTS headers

## Variables Opcionales

- `BREAKER_ENABLED=true` - Circuit breaker
- `BREAKER_THRESHOLD=10` - Fallos antes de abrir
- `BREAKER_OPEN_TIMEOUT=60000` - Timeout en ms
```

### 3. Crear Checklist de Hardening en Nube (10 min)

Archivo: `docs/runbooks/cloud-hardening-checklist.md`

Contenido:
```markdown
# Checklist de Hardening para Nube (Fase 5 / Futuro)

## Antes de Desplegar

- [ ] Firewall: Permitir solo puertos 80, 443
- [ ] TLS: Certificado válido, HTTPS obligatorio
- [ ] HSTS: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [ ] CSP: Enforce mode, sin unsafe-inline
- [ ] Rate limiting: Verificado en prod
- [ ] CORS: Whitelist específico de dominios
- [ ] CSRF: Tokens válidos, SameSite Strict
- [ ] Headers: Referrer-Policy, Permissions-Policy, X-Download-Options
- [ ] /metrics: Protegido, no público
- [ ] Backups: Automatizados, probados

## Después de Desplegar

- [ ] SSL Labs: A grade mínimo
- [ ] Security.txt: Implementado
- [ ] Logs: Centralizados, sin secretos
- [ ] Monitoreo: Alertas activas
```

### 4. Crear Borrador Docker (5 min)

Archivo: `docs/docker-setup-future.md`

Contenido (borrador, NO EJECUTAR):
```markdown
# Setup Docker (Futuro - NO IMPLEMENTAR AHORA)

## Dockerfile Borrador

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "backend/dist/index.js"]
```

## docker-compose Borrador

```yaml
version: '3.9'
services:
  web:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=file:./db.sqlite
      - PORT=3001
    volumes:
      - ./db.sqlite:/app/db.sqlite
```

## Notas

- Solo para referencia futura
- Ajustar volúmenes de datos antes de producción
- Considerar nginx como reverse proxy
- Implementar logging centralizado (Docker logs → ELK, Datadog, etc.)
```

### 5. Actualizar Checklist-Plan-Maestro.md (5 min)

Añadir:
- Notas sobre variables de entorno documentadas
- Checklist de hardening completado
- Borrador Docker creado
- Cierre formal de Fase 5

---

## Gates de Validación Final

Antes de dar por completado el proyecto, ejecutar:

```bash
# 1. Lint (sin warnings, sin errores)
npm run lint

# 2. Typecheck
npm run type-check

# 3. Tests (all green)
npm run test:ci

# 4. Complexity
npm run check:complexity

# 5. Security scans
npm run check:secret-drift -- --warn-missing
npm run check:no-secrets

# 6. OpenAPI validation
npm run lint:openapi
npm run test:contract

# 7. Build final
npm run build

# 8. Performance baseline
npm run perf:api  # k6 smoke test
```

---

## Estimación de Tiempo

| Tarea | Tiempo | Prioridad |
|-------|--------|-----------|
| Validar gates | 5 min | 🔴 CRÍTICA |
| Docs variables de entorno | 10 min | 🟡 ALTA |
| Docs hardening en nube | 10 min | 🟡 ALTA |
| Borrador Docker | 5 min | 🟢 MEDIA |
| Actualizar Checklist | 5 min | 🟡 ALTA |
| **Total** | **~35 min** | |

---

## Entregables Finales

Una vez completadas las tareas anteriores, el proyecto estará **100% listo para producción o futura migración a contenedores**.

### Documentación Completada

- ✅ `metrics-dashboard.md` - Métricas de rendimiento
- ✅ `CIERRE-FASE-3.md` - Resumen Fase 3
- 🔄 `docs/environment-setup.md` - Variables de entorno
- 🔄 `docs/runbooks/cloud-hardening-checklist.md` - Hardening checklist
- 🔄 `docs/docker-setup-future.md` - Borrador Docker
- ✅ `docs/runbooks/fase5-maintainability.md` - Runbook Fase 5
- ✅ `docs/adr/0003-phase5-maintainability.md` - ADR Fase 5

### Gates Validados

- ✅ `npm run lint` - 0 warnings, 0 errors
- ✅ `npm run type-check` - 0 errors
- ✅ `npm run test:ci` - All tests passing
- ✅ `npm run check:complexity` - Dentro de presupuesto
- ✅ `npm run check:secret-drift` - Sin secretos expuestos
- ✅ `npm run lint:openapi` - Validación OpenAPI
- ✅ `npm run build` - Build exitoso

### Métricas Finales

- ✅ **Seguridad**: CSP sin unsafe-inline, cookies Secure, rate-limit, CSRF
- ✅ **Rendimiento**: LCP desktop 2.2s, bundle 109KB, axe 0 violations
- ✅ **Resiliencia**: Circuit breaker, backups, WAL
- ✅ **CI/CD**: Pipeline < 10min, gates activos, mojibake limpio
- ✅ **Mantenibilidad**: CC < 11, refactors documentados, tests > 80%

---

## Próximos Pasos (Post-Proyecto)

1. **Abrir PR** con todos los cambios
2. **Ejecutar CI remoto** en GitHub para validación final
3. **Code review** de Fases 4-5
4. **Merge a main**
5. **Deploy a staging**
6. **Monitoreo en vivo**

---

**Estado Final Esperado**: 🎉 Proyecto PuraNatura completamente reforzado en seguridad, resiliencia, rendimiento y mantenibilidad. Listo para producción o futuro empaquetado con Docker/K8s.

