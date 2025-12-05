# Plan de Mejora - PuraNatura

## Fase 0: Análisis y Quick Wins (Días 1-2)

_Objetivo: Establecer línea base y corregir fallos obvios._

- [ ] **[DOCS]** Completar inventario de endpoints API (Swagger/OpenAPI).
- [ ] **[SEC]** Sanitizar logs en `backend/src/server.ts` (eliminar `console.log` de config).
- [ ] **[UX]** Reemplazar "Cargando..." en `App.tsx` por componente Skeleton.
- [ ] **[DEV]** Configurar `husky` pre-commit hooks para linting (ya existe script, verificar ejecución).

## Fase 1: Seguridad Crítica (Semana 1)

_Objetivo: Endurecer la aplicación contra ataques comunes._

- [ ] **[SEC]** Revisar y activar reglas de `eslint-plugin-security`.
- [ ] **[SEC]** Implementar validación estricta con Zod en todos los endpoints del backend (Boundary 1).
- [ ] **[SEC]** Verificar configuración de CORS y Helmet en `backend/src/app.ts` (pendiente de lectura profunda).
- [ ] **[SEC]** Auditoría de dependencias (`npm audit` y revisión manual de `package.json`).

## Fase 2: Rendimiento y Estabilidad (Semana 2)

_Objetivo: Mejorar Core Web Vitals y robustez del backend._

- [ ] **[PERF]** Optimizar carga de imágenes (verificar `vite-imagetools` config).
- [ ] **[PERF]** Code splitting granular en rutas pesadas.
- [ ] **[BACK]** Mejorar manejo de errores en `server.ts` (evitar `any`, graceful shutdown).
- [ ] **[DB]** Revisar índices en `schema.prisma` para queries frecuentes (ej. búsqueda de productos).

## Fase 3: Accesibilidad y Testing (Semana 3)

_Objetivo: Cumplimiento WCAG y red de seguridad._

- [ ] **[A11Y]** Auditoría automatizada con `axe-core` en CI (verificar scripts existentes).
- [ ] **[TEST]** Aumentar cobertura de tests unitarios en `backend/src/services`.
- [ ] **[TEST]** Crear tests E2E críticos (Login, Checkout) con Playwright.

## Fase 4: Observabilidad y Mantenimiento (Semana 4)

_Objetivo: Preparar para producción._

- [ ] **[OPS]** Implementar logger estructurado (Winston/Pino).
- [ ] **[OPS]** Configurar métricas básicas (Prometheus client ya está en deps, verificar uso).
- [ ] **[CODE]** Refactorizar componentes grandes en Frontend.
