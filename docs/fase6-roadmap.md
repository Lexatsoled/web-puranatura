# Fase 6 — Roadmap detallado (Corrección y optimización)

Última actualización: 2025-11-29

Este documento es un desglose operativo para ejecutar la Fase 6 del Plan Maestro — acciones, prioridades y estimaciones para reducir la complejidad, mejorar la estabilidad y aplicar fixes críticos.

Objetivo: Cerrar hallazgos críticos, reducir la complejidad de hotspots y aumentar la cobertura de tests en componentes y utilidades.

Top prioridad (basado en reports/complexity-report.json):

- src/hooks/useAnalytics.ts — Complexidad: 45 (224 LOC)
  - Objetivo: dividir responsabilidades -> AnalyticsService (providers) + hook mínimo; añadir tests unitarios y e2e de tracking. Estimación: 2–3 días.

- src/utils/errorHandler.ts — Complexidad: 39
  - Objetivo: separar transform/mapper, agregar más tests de unidades y flujos (transformApiError, withErrorHandling), estandarizar mensajes. Estimación: 1–2 días.

- Componentes UI con alta complejidad (SearchBar, ShoppingCart, ProductDetailModal)
  - Objetivo: dividir en subcomponentes, extraer hooks y mover lógica compleja al dominio (services/hooks). Estimación: 3–6 días total (por componente ≥1 día).

- src/utils/api.ts — Complexidad: 33 (parcialmente mitigado)
  - Acción: extracción de RateLimiter a utilitario (hecho) y añadir pruebas unitarias. Refactor adicional: desacoplar manejo de errores y reintentos a un middleware. Estimación: 1–2 días.

- src/utils/sanitizer.ts — Complexidad: 32
  - Acción: añadir tests para casos de borde, simplificar reglas y normalizar las configuraciones de DOMPurify (mover configuración a una constante exportada). Estimación: 0.5–1 día.

Estrategia de trabajo (incremental):

1. Baseline + tests (0.5–1d) — Aumentar la cobertura en utilidades y hooks: RateLimiter (✅), sanitizers, api error flows.
2. Extraer servicios + pequeños commits (1–3d) — mover lógica compleja a servicios pequeños y probados (e.g., Analytics providers, API retry/middleware).
3. Component refactor (3–6d) — dividir componentes grandes en partes testables y con menor CC.
4. End-to-end validation (1–2d) — ejecutar regression-suite y E2E para verificar no-regresiones.
5. Ajustes finales y documenting (0.5–1d) — normalizar comentarios, ADRs y preparar release candidate.

Medidas de éxito / CA:

- Reducir CC de cada hotspot a < 12.
- Tests unitarios nuevos para cada módulo refactorizado con cobertura >= 80% en el área refactorizada.
- CI en `main` pasa con quality gates y performance mínima establecida.

Acción inmediata (estas ya las empiezo hoy):

- [x] Crear branch para Fase 6 (actual).
- [x] Extraer RateLimiter a `src/utils/rateLimiter.ts` y añadir tests (test/utils/rateLimiter.test.ts) ✅
- [ ] Analizar file-by-file y crear PRs pequeños para `useAnalytics`, `errorHandler` y `SearchBar`.
- [ ] Añadir pruebas para `useApi` y sanitizers.

Siguiente paso que propongo: analizar `useAnalytics.ts` (hotspot principal) y preparar un plan de extracción (servicio + tests) con un PR piloto pequeño para validar la estrategia.
