---
title: Fase 5 – Estandarizar mantenimiento y ADR viva
status: accepted
---

# ADR 0003 – Fase 5: reduce complexity y prioriza documentación viva

## Context

Con las fases 0-4 superadas, el próximo gate exige reducir deuda técnica, asegurar la arquitectura y documentar las decisiones. El reporte de complejidad actual muestra módulos con CC >30, y no todos los cambios están reflejados en la documentación viva o en una política clara de pre-commit.

## Decision

1. Ejecutar `scripts/check-complexity.cjs` como parte del gate de fase 5 y reducir los módulos con CC elevado mediante refactors que separen UI/ lógica en hooks y servicios.
2. Crear el runbook `docs/runbooks/fase5-maintainability.md` que articule pasos para T5.1-T5.4 (refactor, clean architecture, pre-commit, ADRs).
3. Mantener `lint-staged`/`husky` y añadir `npm run synthetic:checks` + `npm run test:ci` como pasos obligatorios cuando el cambio toca backend+observabilidad.
4. Publicar esta ADR en `docs/phase-checkpoints.md` y `CheckList.md` para que revisores sepan qué pruebas/documentos deben validarse antes de cerrar la fase.

## Consequences

- Mantenimiento más predecible y gate basado en métricas (CC, tests, ADR).
- Dependencia explícita de `reports/complexity-report.json`, `reports/synthetic/` y `reports/observability/` como evidencia para cada release.
- Se refuerza la necesidad de actualizar ADRs y runbooks cada sprint, evitando drift documental.

## Progress (2025-12-02)

- Primer refactor aplicado a `src/hooks/useProfile.ts` (separación de inicialización, handlers memoizados y cálculo derivado). El archivo sale del top de complejidad tras ejecutar `npm run check:complexity`. Gates ejecutados: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado). Próximo foco: `src/components/OptimizedImage.tsx` y `src/utils/sanitizer.ts` para llevarlos por debajo de CC 15.
- Refactors adicionales: `src/components/OptimizedImage.tsx` (derivación con `useMemo`, placeholders/fallback desacoplados, blur-css sólo en cliente) y `src/utils/sanitizer.ts` (sanitización recursiva simplificada con helpers pequeños). Gates completados para ambos: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactors 2025-12-02 (cont.): `src/components/ProductCard.tsx` reestructurado con subcomponentes (`ImageCarousel`, `BadgeList`, `AddToCartButton`) y hook `useProductCardState`; `pages/AddressesPage.tsx` dividido en hook `useAddressesState` y subcomponentes (lista, formulario, acciones). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactors 2025-12-02 (extra): `src/components/FAQSection.tsx` dividido en hook `useFaqFilters` + subcomponentes, y `src/hooks/useSearchBar.ts` simplificado con helpers y mapa de acciones. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor adicional: `src/pages/ProductPage.tsx` ahora usa `useProductDetails` (fetch centralizado + fallback), `ProductHero` y `ProductInfo` desacoplados y breadcrumbs/SEO calculados en hooks/memos. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor API: `src/utils/api.ts` divide la lógica en helpers (`buildConfig`, `sendRequest`, `handleRateLimit`), detecta respuestas HTML y centraliza `RateLimiter`; la API pública conserva GET/POST/PUT/PATCH/DELETE y el logout en 401. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor ShoppingCart: `src/components/ShoppingCart.tsx` delega el listado en `CartItemsList`/`CartItemRow`/`CartQuantityControl` y el resumen en `CartSummary`/`CheckoutButton`, manteniendo el hook `useShoppingCart` para cálculos. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor StorePage: `pages/StorePage.tsx` usa `useStorePage` (fetch/filtros/orden/paginación) y subcomponentes para header, controles, grid y estados vacíos/errores. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- API (2ª pasada): `src/utils/api.ts` mueve helpers a `apiHelpers.ts` (`buildRequestConfig`, `sendRequest`, `handleRateLimitRetry`, `handleAuthError`) para reducir CC manteniendo la interfaz CRUD. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Cart (2ª pasada): `src/components/ShoppingCart.tsx` ahora orquesta subcomponentes en `components/cart/*` con el hook `useCartItemState` para cantidades/variantes, bajando CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Tipos/errores: `src/types/product.ts` agrupa opcionales en `Partial` y `src/utils/transformApiError.ts` usa mapa de mensajes en lugar de switch para reducir CC. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Métrica: los módulos refactorizados quedan por debajo del umbral de CC15 y salen del top del `complexity-report.json` generado por `npm run check:complexity`.
- Perfil/estado: `src/hooks/useProfile.ts` mueve helpers puros a `useProfile.helpers.ts` y aísla el flujo de éxito/error, reduciendo retornos y condicionales; el módulo deja el top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado).
- Grid virtual: `src/components/VirtualProductGrid.tsx` divide lógica en hooks (`useGridDimensions`, `useGridLayout`) y subcomponentes (`ProductGridCell`, `Placeholders`), manteniendo la API y sacando el archivo del top del `complexity-report`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Focus trap: `src/hooks/useFocusTrap.ts` delega tab/escape en helpers (`useFocusTrap.helpers.ts`) y reutiliza `useFocusables`; hook más plano y fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Wishlist: `pages/WishlistPage.tsx` separa estado en `useWishlistPage` y UI en subcomponentes (`WishlistHeader`, `WishlistItemRow`, `WishlistSummary`, `WishlistEmpty`, `AccessDenied`); mantiene comportamiento y baja CC. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Imágenes: `src/components/OptimizedImage.tsx` usa hook `useOptimizedImage` y helpers (`imageCalculations`, `imageEnv`) + subcomponentes (`Placeholder`, `ErrorFallback`), eliminando condicionales repetidos y saliendo del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Comparador: `src/components/ProductCompare.tsx` usa hook `useProductCompare` y subcomponentes (`CompareHeader`, `ProductCardCompare`, `AddProductCard`) para separar estado/render; sale del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Reseñas: `src/components/ProductReviews.tsx` usa `useProductReviews` y subcomponentes (`ReviewsSummary`, `ReviewCard`, `ReviewModal`), aplanando condicionales y eliminando duplicación. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Buscador: `src/hooks/useSearchBar.ts` mueve acciones/debounce/validación a helpers externos (`useSearchBar.helpers.ts`, `useSearchBar.types.ts`), bajando CC del hook principal. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Analytics: `src/api/analytics/events.ts` queda lineal tras mover validación/enriquecimiento a `events.helpers.ts`; mantiene API y reduce CC. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Store: `pages/store/useStorePage.ts` usa helpers puros para filtros/búsqueda/orden/paginación; API estable y CC menor. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Hotfix tienda: se eliminaron `data/products.js*` (artefactos CJS) para que el fallback ESM (`data/products.ts`) cargue sin `ReferenceError: exports is not defined` en `/tienda`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; la pagina vuelve a listar productos.
- Modales/galería: `src/components/ImageGallery.tsx` y `ProductDetailModal.tsx` divididos en subcomponentes/hooks (`imageGallery/*`, `productDetail/*`); fuera del top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Perfil: `pages/ProfilePage.tsx` usa `ProfileHeader`/`ProfileForm`; la página sólo compone. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Infra: `src/utils/errorHandler.ts` delega envolturas de promesas a `withErrorHandling.ts`; `apiHelpers` separa rate-limit/auth en `apiHelpers.handlers.ts`/`api.rateLimit.ts`, dejando el top <=16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Infra (final): `src/utils/withErrorHandling.ts` usa helpers (`withErrorHandling.helpers.ts`) y el reporte de complejidad queda con máximo 16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
