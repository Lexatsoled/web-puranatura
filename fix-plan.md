# Plan de Mejora - Web Puranatura

> [!NOTE]
> Este plan se basa en la auditoría del 13/12/2025. Se prioriza la seguridad estructural y la accesibilidad.

## Fase 0: Análisis e Inventario (Completado)
- [x] Inventario de archivos (`inventory.json`)
- [x] Mapa de arquitectura (`architecture-map.md`)
- [x] Detección de hallazgos (`findings.json`)

## Fase 1: Seguridad y Estabilidad (Semana 1)
**Objetivo**: Fortalecer la autenticación y prevenir regresiones de seguridad.

### Tareas Prioritarias
1.  **[SEC-AUTH-001] Migración de JWT a Cookies HttpOnly**
    -   **Objetivo**: Eliminar JWT de `localStorage`.
    -   **Pasos**:
        -   Actualizar `backend/src/controllers/authController.ts` para setear cookie `token`.
        -   Actualizar `src/store/authStore.ts` para dejar de persistir `token`.
        -   Asegurar que `auth.ts` middleware lea de cookie (ya implementado).
    -   **Rollback**: Revertir a persistencia en localStorage.

2.  **[SEC-ENV] Hardening de Variables de Entorno**
    -   **Objetivo**: Asegurar que no se usen secretos por defecto en Prod.
    -   **Pasos**:
        -   Verificar que `env.ts` lanza error fatal si `JWT_SECRET` es default en NODE_ENV=production.

### Pruebas de Regresión
-   Ejecutar `npm run test:e2e` (Login flow).
-   Ejecutar `npm run test:unit` (Auth store).

## Fase 2: Rendimiento y UX (Semana 2)
**Objetivo**: Mantener la excelencia actual y pulir detalles.

### Tareas
1.  **[PERF-MON] Implementar Performance Budget en CI**
    -   **Objetivo**: Alertar si el bundle size excede límites.
    -   **Pasos**: Configurar `vite.config.ts` o script de CI para fallar si `vendor` chunk > 500kb.

2.  **[UX-ERR] Mejorar Feedback de Errores**
    -   **Objetivo**: Unified Error UI.
    -   **Pasos**: Revisar `ErrorBoundary.tsx` y asegurar que cubre fallos de carga diferida (lazy load chunks).

## Fase 3: Accesibilidad y Compatibilidad (Semana 3)
**Objetivo**: Cumplir WCAG 2.1 AA.

### Tareas
1.  **[A11Y-INT-001] Refactor de Elementos Interactivos**
    -   **Objetivo**: Eliminar `div` con `onClick`.
    -   **Pasos**:
        -   Auditar `AuthModal.tsx` y otros modales.
        -   Reemplazar por `<button>` o asegurar `onKeyDown` + `role` correctos.
    -   **Verificación**: `npm run a11y` (Axe scan).

## Fase 4: Observabilidad y Deuda Técnica
**Objetivo**: Preparar para escalado.

### Tareas
1.  **[ARCH-BE-001] Expandir Circuit Breakers**
    -   **Objetivo**: Proteger DB de sobrecarga en búsquedas.
    -   **Pasos**: Aplicar `CatalogBreaker` a endpoints de búsqueda intensiva.
