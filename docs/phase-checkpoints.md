# Estado de fases y punto de entrada canonical

Este índice en `docs/` resume dónde se encuentra el plan maestro y cuáles son los checkpoints visibles para referencias externas.

Fuente canonical:

- `Plan-mejora/Checklist-Plan-Maestro.md` (checklist maestro, evidencias y pasos por fase).
- `GPT-51-Codex-Max-Hight/CheckList.md` (CheckList maestro - referencia compartida para validación y sincronización).

Última actualización: 2025-12-05 – sincronizado con el checklist maestro tras cerrar la observabilidad y avanzar la fase 5.

Estado actual (resumen):

- **Fase 4 COMPLETADA**: trazas + métricas (T4.1/T4.2), pipeline/canary + SBOM (T4.3/T4.4), backup/DR + sintéticos (T4.5/T4.6) y gates de observabilidad (`npm run perf:api`, `npm run lint:openapi`, `npm run test:contract`, `npm run verify:observability`). Artefactos listos: `docs/runbooks/observabilidad.md`, `docs/runbooks/ci-canary.md`, `reports/observability/`, `reports/observability/perf-summary.md`, `reports/observability/observability-artifacts.zip`, `reports/observability/metrics-snapshot.txt`, `sbom.json`.
  - Observación operativa: el gate `npm run perf:api` se ejecuta tras aplicar migraciones + seed; produce p95 ≈ 17 ms, p99 ≈ 36 ms y 0 % en `http_req_failed`. Antes de marcar un gate verde hay que guardar `perf-summary`, `observability-artifacts.zip` y `metrics-snapshot.txt`, adjuntarlos a la nota de release/PR y asegurarse de que `metrics-dashboard.md` (y los dashboards) reflejan esos percentiles.
  - Reejecución en staging/CI: aplicar el mismo seed (`backend/src/prisma/seed.ts` o `backend/src/server.ts` automágico), relanzar `npm run perf:api`, regenerar los artefactos y subirlos junto al gate.

- **Fase 5 EN PROGRESO**: mantenimiento y documentación viva (T5.1–T5.4). Evidencia centralizada: `reports/complexity-report.json`, el runbook `docs/runbooks/fase5-maintainability.md`, el ADR `docs/adr/0003-phase5-maintainability.md`, y la validación continua con `npm run lint`, `npm run test:ci` y `npm run check:complexity`.
  - Cada refactor relevante (hooks, components, utilidades, APIs) se documenta en el runbook y se refleja en el dashboard de complejidad; mantener gates verdes es requisito para cerrar la fase.
  - Fase 5 también incluye checklist de configuraciones (puertos, origins, rutas métricas) y hardening (firewall, TLS, HSTS preload) para dejar la base lista antes de empaquetar. Actualiza este índice cuando se cierre cada subobjetivo.
  - 2025-12-05: refactor `src/utils/contentSanitizers.product.ts` para extraer helpers `sanitizeOptional`, `mapOptional` y `mapOrEmpty`, manteniendo `components`/`faqs` undefined cuando no existen y asegurando `tags` como array vacío; gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) pasados y logueados en el runbook/ADR.
  - 2025-12-06: `src/utils/imageProcessor.helpers.ts` define `DEFAULT_OPTIONS`, `resizePipeline` y `formatProcessors` para aplanar la combinación resize+formato y evitar switches; gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) completados.
  - 2025-12-06: limpieza general con `npx prettier --write` en frontend/scripts/tests y ajuste de `scripts/check-secret-drift.cjs` (sin `err` innecesario) garantiza que `npm run lint` pase sin warnings; gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) documentados.
  - 2025-12-07: `src/utils/sanitizeObject.ts` delega en `src/utils/sanitizeObject.helpers.ts`, `src/components/virtualGrid/useGridLayout.ts` en `src/components/virtualGrid/useGridLayout.helpers.ts` y `src/hooks/seo/buildSeoConfig.ts` en `src/hooks/seo/buildSeoConfig.helpers.ts`, manteniendo funciones puras separadas para reducir la complejidad; gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) completados.
- 2025-12-08: `src/hooks/useAnalytics.ts` se apoya en `src/hooks/analytics/useAnalytics.helpers.ts` para separar la inicialización del consentimiento, la sincronización, el trackeo y la creación de eventos; gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) completados.
- 2025-12-10: `src/hooks/wishlist/useWishlistSelection.ts` encapsula la gestión de selección múltiple, selectAll y clearSelection para `Wishlist.tsx`, dejando el componente plano y los gates verdes (`npm run lint`, `npm run test:ci`, `npm run check:complexity`).
- 2025-12-11: `src/hooks/useProductDetails.ts` ahora delega el fetch y el fallback al helper `src/hooks/product/useProductDetails.helpers.ts`, que cachea los productos de `../../data/products.ts` y mantiene la bandera activa antes de setear estados `loading/ready/error`; la documentación del runbook y el ADR refleja este helper y los gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) siguen verdes.
- 2025-12-12: `src/routes/dynamicRoutes.ts` se reduce a un descriptor de rutas y deja toda la lógica de metadata/fetching al helper `src/routes/dynamicRoutes.helpers.ts`, que expone `fetchJson`, metadata builders y generators de paths para categorías/productos/posts; el checkpoint y el runbook registran el cambio y los gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) siguen limpios.
- 2025-12-13: `src/services/analyticsProviders.ts` queda más directo después de mover la carga de scripts y el `trackCustomEvent` a `src/services/analyticsProviders.helpers.ts` (helpers reutilizables que garantizan `gtag/fbq` con `loadExternalScript` y la cola en `dataLayer`); el checkpoint documenta el helper y los mismos gates siguen limpios (`npm run lint`, `npm run test:ci`, `npm run check:complexity`).
- 2025-12-14: `src/utils/sanitizeObject.helpers.ts` reutiliza `SANITIZER_RULES` y `findSanitizer` para mapear claves como `html`/`url` a los sanitizadores correctos y mantiene `sanitizeUnknown` recursivo sin lógica duplicada; el checkpoint menciona el helper y deja registro de los gates verdes.
- 2025-12-15: `src/hooks/useProductDetail.ts` reduce su responsabilidad al delegar el manejo del teclado y del botón “Añadir al carrito” a `src/hooks/product/useProductDetail.helpers.ts`; el helper y la estrategia se describen en el checkpoint y los tres gates siguen limpios.
- 2025-12-15: Se deja constancia de que los módulos con CC 10-11 restantes (utilidades base como `api.ts`, `intl.ts`, middlewares) se mantienen por ser control de flujo legítimo con bajo retorno de seguir fragmentando; el checkpoint lo registra y los gates (`npm run lint`, `npm run test:ci`, `npm run check:complexity`) permanecen verdes.
- 2025-12-15: Se cierra formalmente la fase 5 tras validar gates (lint, test:ci, check:complexity) y dejar documentado que los módulos residuales con CC 10-11 son aceptables; checklist y runbook sincronizados.

Nota: para cualquier actualización operativa edita la checklist canonical y actualiza este índice. La documentación viva debe permanecer sincronizada con los artefactos y las evidencias.
