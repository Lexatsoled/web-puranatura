# Runbook Fase 5 â€“ Refactor, deuda tÃ©cnica y prevenciÃ³n

Este runbook describe los pasos que estamos ejecutando para cerrar **T5.1â€“T5.4** del Plan Maestro y dejar la base lista para futuras iteraciones (mantenimiento X0, ADRs actualizados, pre-commit obligatorio).

## T5.1 â€“ Reducir complejidad (CC<10 / CI mantenible)

1. Analiza `reports/complexity-report.json` (generado por `npm run check:complexity`). Identifica los _top 5_ mÃ³dulos con mayor complejidad (por ejemplo `src/hooks/useProfile.ts`, `src/components/ProductCard.tsx`) y prioriza dividirlos en hooks/functions mÃ¡s pequeÃ±os con responsabilidades claras.
2. Aplica refactor objetivo en un mÃ³dulo a la vez, midiendo el impacto en el `complexity-report`. Documenta cada refactor como un paso en este runbook (`docs/runbooks/fase5-maintainability.md`) y referencia el archivo modificado.
3. Siempre corre `npm run lint` y `npm run test:ci` tras cada refactor para asegurar que el cambio no rompe; el gate de Fase 5 exige que la complejidad promedio baje (ideal <7) y que los tests/lint sigan verdes.
4. Log de refactors:
   - 2025-12-02: `src/hooks/useProfile.ts` â€” separada la inicializaciÃ³n (`buildInitialForm`), handlers memoizados (`useCallback`) y cÃ¡lculo de `memberSinceText` con `useMemo`. Resultado: sale del top 10 del `complexity-report`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado).
   - 2025-12-02: `src/components/OptimizedImage.tsx` â€” cÃ¡lculo derivado de dimensiones y srcSet con `useMemo`, placeholders y fallback extraÃ­dos en componentes puros; maneja blur-css sÃ³lo en cliente. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
   - 2025-12-02: `src/utils/sanitizer.ts` â€” funciones pequeÃ±as (`sanitizeUnknown`, `sanitizeArray`, `sanitizePrimitiveByKey`) para reducir ramas; mismo comportamiento recursivo. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
   - 2025-12-02: `src/components/ProductCard.tsx` â€” extraÃ­dos subcomponentes (`ImageCarousel`, `BadgeList`, `AddToCartButton`) y hook `useProductCardState`; se reducen ternarios y lÃ³gica duplicada. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
   - 2025-12-02: `pages/AddressesPage.tsx` â€” hook `useAddressesState` + subcomponentes (`Header`, `AddressList`, `AddressForm`, `CardActions`); separaciÃ³n de handlers y helpers de iconos. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.

- 2025-12-02: `src/components/FAQSection.tsx` â€” se divide en hook `useFaqFilters` y subcomponentes (`FaqHeader`, `FaqSearch`, `FaqCategoryTabs`, `FaqList`, `FaqEmptyState`, `FaqSupport`). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-02: `src/hooks/useSearchBar.ts` â€” simplificaciÃ³n con key-actions map, reset helper y debounce memorizado; mantiene API. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-02: `src/pages/ProductPage.tsx` â€” hook `useProductDetails`, subcomponentes `ProductHero` y `ProductInfo`, y lÃ³gica de breadcrumbs/SEO aislada; fetch fallbacks centralizados en `useProductDetails`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-02: `src/utils/api.ts` â€” helpers `buildConfig`, `sendRequest` y `handleRateLimit` desenredan el request/retry, detectan respuestas HTML y reutilizan `RateLimiter` global. La API mantiene GET/POST/PUT/PATCH/DELETE y reaplica la validaciÃ³n de logout en 401. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/components/ShoppingCart.tsx` â€” refactor a subcomponentes (`CartItemsList`, `CartItemRow`, `CartSummary`, acciones), se separan controles y resumen, la lÃ³gica de cÃ¡lculo vuelve al hook `useShoppingCart` y el componente solo compone. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `pages/StorePage.tsx` â€” hook `useStorePage` para fetch, filtros, orden y paginaciÃ³n; subcomponentes (`StoreHeader`, `StoreControls`, `StoreBody`, `PaginationControls`, `ErrorAlert`, `LoadingState`, `EmptyState`). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; `reports/complexity-report.json` ya no lista StorePage en el top.
- 2025-12-03: `src/utils/api.ts` (2Âª pasada) â€” lÃ³gica movida a `apiHelpers.ts` (`buildRequestConfig`, `sendRequest`, `handleRateLimitRetry`, `handleAuthError`) para bajar CC sin cambiar la interfaz. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/components/ShoppingCart.tsx` (2Âª pasada) â€” subcomponentes movidos a `components/cart/*` y hook `useCartItemState` para manejar cantidad/variantes; CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/types/product.ts` y `src/utils/transformApiError.ts` simplificados (agrupando opcionales en `Partial` y mapa de mensajes en lugar de switch) para limpiar el top de complejidad.
- Resultado: `reports/complexity-report.json` ya no incluye estos mÃ³dulos en el top; todas las piezas refactorizadas quedan <15 de CC segÃºn la mÃ©trica interna.
- 2025-12-03: `src/hooks/useProfile.ts` + `src/hooks/useProfile.helpers.ts` â€” extracciÃ³n de helpers puros (`buildInitialForm`, `computeMemberSince`, payload builder) y handlers de Ã©xito/error para aplanar la lÃ³gica del hook; sigue el mismo comportamiento y sale del top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado).
- 2025-12-03: `src/components/VirtualProductGrid.tsx` â€” UI dividida en `virtualGrid/ProductGridCell`, `Placeholders` y hooks `useGridDimensions`/`useGridLayout`; el contenedor sÃ³lo ensambla y el archivo deja de aparecer en el top del `complexity-report`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/hooks/useFocusTrap.ts` â€” lÃ³gica de tab/escape movida a helpers (`useFocusTrap.helpers.ts`) reutilizando `useFocusables`; el hook queda plano y fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `pages/WishlistPage.tsx` â€” estado y handlers en `useWishlistPage`, subcomponentes (`WishlistHeader`, `WishlistItemRow`, `WishlistSummary`, `WishlistEmpty`, `AccessDenied`) para separar render/acciones. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/components/OptimizedImage.tsx` â€” hook `useOptimizedImage` + helpers (`imageCalculations`, `imageEnv`) y subcomponentes (`Placeholder`, `ErrorFallback`) para reducir condicionales y mantener API. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; el archivo deja el top.
- 2025-12-03: `src/components/ProductCompare.tsx` â€” extraÃ­do hook `useProductCompare` y subcomponentes (`CompareHeader`, `ProductCardCompare`, `AddProductCard`); se aislan variantes/beneficios y sale del top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/components/ProductReviews.tsx` â€” hook `useProductReviews` para estado (helpful/report/write) y subcomponentes (`ReviewsSummary`, `ReviewCard`, `ReviewModal`); mismo comportamiento y fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/hooks/useSearchBar.ts` â€” helpers externos (`useSearchBar.helpers.ts`, `useSearchBar.types.ts`) para acciones/validaciÃ³n y debounce; CC baja y sale del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/api/analytics/events.ts` â€” validaciÃ³n/enriquecimiento movido a `events.helpers.ts`; handler principal queda lineal y sale del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `pages/store/useStorePage.ts` â€” filtros/bÃºsqueda/paginaciÃ³n separados en helpers puros (`applyCategory`, `applySearch`, `sortProducts`, `paginate`); mantiene API y reduce CC. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/components/ImageGallery.tsx` y `src/components/ProductDetailModal.tsx` â€” divididos en subcomponentes (`imageGallery/*`, `productDetail/*`) y hook `useImageGallery`; CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `pages/ProfilePage.tsx` â€” subcomponentes `ProfileHeader` y `ProfileForm`; la pÃ¡gina sÃ³lo ensambla. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/utils/errorHandler.ts` â†’ manejo de promesas movido a `withErrorHandling.ts`, dejando el archivo principal en CC<15. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/utils/apiHelpers.ts` separado en `apiHelpers.handlers.ts` y rate-limit en `api.rateLimit.ts` para bajar CC; el top del reporte queda <=16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- 2025-12-03: `src/utils/withErrorHandling.ts` extrae helpers (`withErrorHandling.helpers.ts`) para bajar CC a 16; reporte de complejidad queda con mÃ¡ximo 16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.

- 2025-12-03: Hotfix tienda: se eliminaron los artefactos CJS `data/products.js*` para que el fallback ESM (`data/products.ts`) cargue sin `ReferenceError: exports is not defined` en `/tienda`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; la pagina vuelve a listar productos.

## T5.2 â€“ Clean Architecture y separaciÃ³n

1. Revisa los lÃ­mites entre capas en el backend (rutas â†’ servicios â†’ prisma). Define carpetas `backend/src/controllers`, `backend/src/services`, `backend/src/repositories` si no existen y mueve la lÃ³gica allÃ­; cada servicio debe recibir una interfaz clara (DTO).
2. En el frontend, separa UI, estado y datos: props de los componentes solo deben derivar de store/hooks, los effects/extracts se centralizan en `src/hooks`.
3. Registra cada decisiÃ³n arquitectÃ³nica en una ADR (ej. `docs/adr/0003-phase5-maintainability.md`) y enlaza al plan de sprint. Esto alimentarÃ¡ T5.4.

## T5.3 â€“ Pre-commit y normas de revisiÃ³n

1. MantÃ©n `husky` + `lint-staged` activados (`package.json`). AÃ±ade un script `npm run precommit:phase5` (si no existe) que combine `npm run lint` y `npm run test:ci` si el cambio toca backend.
2. Actualiza `docs/runbooks/ci-canary.md` y `docs/runbooks/observability.md` con el checklist de revisiÃ³n (linters, tests, artefactos).
3. Define en este runbook la lista de verificaciones obligatorias para reviewers (ej. â€œÂ¿Se actualizÃ³ ADR?â€, â€œÂ¿SintÃ©ticos pasaron?â€).

## T5.4 â€“ ADRs / documentaciÃ³n viva

1. Crea o actualiza ADRs para decisiones crÃ­ticas que surgieron durante Fase 4 (traza-metrics, canary, backup). AÃ±ade `docs/adr/0003-phase5-maintainability.md`.
2. Publica diagramas/resumen en `GPT-51-Codex-Max-Hight/architecture` si alguna decisiÃ³n modifica la topologÃ­a (por ejemplo, separaciÃ³n de servicios).
3. Cada sprint documenta quÃ© ADR se actualizÃ³ y cuÃ¡l es la evidencia (`docs/phase-checkpoints.md` y `CheckList.md` referencian el ADR).

## Evidencia mÃ­nima para cerrar Fase 5

- `reports/complexity-report.json` mostrando caÃ­da en CC.
- `docs/runbooks/fase5-maintainability.md` + ADR confirmando la estrategia.
- Hooks/pre-commit documentados y ejecutados.
- Al menos un mÃ³dulo refactorizado (evidence en git history) y tests/lint verdes.

Fin del runbook â€“ cuando la evidencia estÃ© recopilada, actualiza `CheckList.md` y `docs/phase-checkpoints.md` para marcar Fase 5 como completada.

- 2025-12-03: Gates finales (lint, type-check, test:ci, check:complexity) verdes tras corregir tipos en ProductPage, SearchBar, Cart, Reviews, Wishlist, ImageGallery, VirtualProductGrid, errorHandler y api.rateLimit; `reports/complexity-report.json` mantiene m�ximo 15.
