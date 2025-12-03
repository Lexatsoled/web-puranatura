---
title: Fase 5 â€“ Estandarizar mantenimiento y ADR viva
status: accepted
---

## Context

Con las fases 0-4 superadas, el prÃ³ximo gate exige reducir deuda tÃ©cnica, asegurar la arquitectura y documentar las decisiones. El reporte de complejidad actual muestra mÃ³dulos con CC >30, y no todos los cambios estÃ¡n reflejados en la documentaciÃ³n viva o en una polÃ­tica clara de pre-commit.

## Decision

1. Ejecutar `scripts/check-complexity.cjs` como parte del gate de fase 5 y reducir los mÃ³dulos con CC elevado mediante refactors que separen UI/ lÃ³gica en hooks y servicios.
2. Crear el runbook `docs/runbooks/fase5-maintainability.md` que articule pasos para T5.1-T5.4 (refactor, clean architecture, pre-commit, ADRs).
3. Mantener `lint-staged`/`husky` y aÃ±adir `npm run synthetic:checks` + `npm run test:ci` como pasos obligatorios cuando el cambio toca backend+observabilidad.
4. Publicar esta ADR en `docs/phase-checkpoints.md` y `CheckList.md` para que revisores sepan quÃ© pruebas/documentos deben validarse antes de cerrar la fase.

## Consequences

- Mantenimiento mÃ¡s predecible y gate basado en mÃ©tricas (CC, tests, ADR).
- Dependencia explÃ­cita de `reports/complexity-report.json`, `reports/synthetic/` y `reports/observability/` como evidencia para cada release.
- Se refuerza la necesidad de actualizar ADRs y runbooks cada sprint, evitando drift documental.

## Progress (2025-12-02)

- Primer refactor aplicado a `src/hooks/useProfile.ts` (separaciÃ³n de inicializaciÃ³n, handlers memoizados y cÃ¡lculo derivado). El archivo sale del top de complejidad tras ejecutar `npm run check:complexity`. Gates ejecutados: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado). PrÃ³ximo foco: `src/components/OptimizedImage.tsx` y `src/utils/sanitizer.ts` para llevarlos por debajo de CC 15.
- Refactors adicionales: `src/components/OptimizedImage.tsx` (derivaciÃ³n con `useMemo`, placeholders/fallback desacoplados, blur-css sÃ³lo en cliente) y `src/utils/sanitizer.ts` (sanitizaciÃ³n recursiva simplificada con helpers pequeÃ±os). Gates completados para ambos: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactors 2025-12-02 (cont.): `src/components/ProductCard.tsx` reestructurado con subcomponentes (`ImageCarousel`, `BadgeList`, `AddToCartButton`) y hook `useProductCardState`; `pages/AddressesPage.tsx` dividido en hook `useAddressesState` y subcomponentes (lista, formulario, acciones). Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactors 2025-12-02 (extra): `src/components/FAQSection.tsx` dividido en hook `useFaqFilters` + subcomponentes, y `src/hooks/useSearchBar.ts` simplificado con helpers y mapa de acciones. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor adicional: `src/pages/ProductPage.tsx` ahora usa `useProductDetails` (fetch centralizado + fallback), `ProductHero` y `ProductInfo` desacoplados y breadcrumbs/SEO calculados en hooks/memos. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor API: `src/utils/api.ts` divide la lÃ³gica en helpers (`buildConfig`, `sendRequest`, `handleRateLimit`), detecta respuestas HTML y centraliza `RateLimiter`; la API pÃºblica conserva GET/POST/PUT/PATCH/DELETE y el logout en 401. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor ShoppingCart: `src/components/ShoppingCart.tsx` delega el listado en `CartItemsList`/`CartItemRow`/`CartQuantityControl` y el resumen en `CartSummary`/`CheckoutButton`, manteniendo el hook `useShoppingCart` para cÃ¡lculos. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Refactor StorePage: `pages/StorePage.tsx` usa `useStorePage` (fetch/filtros/orden/paginaciÃ³n) y subcomponentes para header, controles, grid y estados vacÃ­os/errores. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- API (2Âª pasada): `src/utils/api.ts` mueve helpers a `apiHelpers.ts` (`buildRequestConfig`, `sendRequest`, `handleRateLimitRetry`, `handleAuthError`) para reducir CC manteniendo la interfaz CRUD. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Cart (2Âª pasada): `src/components/ShoppingCart.tsx` ahora orquesta subcomponentes en `components/cart/*` con el hook `useCartItemState` para cantidades/variantes, bajando CC fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Tipos/errores: `src/types/product.ts` agrupa opcionales en `Partial` y `src/utils/transformApiError.ts` usa mapa de mensajes en lugar de switch para reducir CC. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- MÃ©trica: los mÃ³dulos refactorizados quedan por debajo del umbral de CC15 y salen del top del `complexity-report.json` generado por `npm run check:complexity`.
- Perfil/estado: `src/hooks/useProfile.ts` mueve helpers puros a `useProfile.helpers.ts` y aÃ­sla el flujo de Ã©xito/error, reduciendo retornos y condicionales; el mÃ³dulo deja el top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity` (artefacto actualizado).
- Grid virtual: `src/components/VirtualProductGrid.tsx` divide lÃ³gica en hooks (`useGridDimensions`, `useGridLayout`) y subcomponentes (`ProductGridCell`, `Placeholders`), manteniendo la API y sacando el archivo del top del `complexity-report`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Focus trap: `src/hooks/useFocusTrap.ts` delega tab/escape en helpers (`useFocusTrap.helpers.ts`) y reutiliza `useFocusables`; hook mÃ¡s plano y fuera del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Wishlist: `pages/WishlistPage.tsx` separa estado en `useWishlistPage` y UI en subcomponentes (`WishlistHeader`, `WishlistItemRow`, `WishlistSummary`, `WishlistEmpty`, `AccessDenied`); mantiene comportamiento y baja CC. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- ImÃ¡genes: `src/components/OptimizedImage.tsx` usa hook `useOptimizedImage` y helpers (`imageCalculations`, `imageEnv`) + subcomponentes (`Placeholder`, `ErrorFallback`), eliminando condicionales repetidos y saliendo del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Comparador: `src/components/ProductCompare.tsx` usa hook `useProductCompare` y subcomponentes (`CompareHeader`, `ProductCardCompare`, `AddProductCard`) para separar estado/render; sale del top. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- ReseÃ±as: `src/components/ProductReviews.tsx` usa `useProductReviews` y subcomponentes (`ReviewsSummary`, `ReviewCard`, `ReviewModal`), aplanando condicionales y eliminando duplicaciÃ³n. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Buscador: `src/hooks/useSearchBar.ts` mueve acciones/debounce/validaciÃ³n a helpers externos (`useSearchBar.helpers.ts`, `useSearchBar.types.ts`), bajando CC del hook principal. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Analytics: `src/api/analytics/events.ts` queda lineal tras mover validaciÃ³n/enriquecimiento a `events.helpers.ts`; mantiene API y reduce CC. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Store: `pages/store/useStorePage.ts` usa helpers puros para filtros/bÃºsqueda/orden/paginaciÃ³n; API estable y CC menor. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Hotfix tienda: se eliminaron `data/products.js*` (artefactos CJS) para que el fallback ESM (`data/products.ts`) cargue sin `ReferenceError: exports is not defined` en `/tienda`. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`; la pagina vuelve a listar productos.
- Modales/galerÃ­a: `src/components/ImageGallery.tsx` y `ProductDetailModal.tsx` divididos en subcomponentes/hooks (`imageGallery/*`, `productDetail/*`); fuera del top de complejidad. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Perfil: `pages/ProfilePage.tsx` usa `ProfileHeader`/`ProfileForm`; la pÃ¡gina sÃ³lo compone. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Infra: `src/utils/errorHandler.ts` delega envolturas de promesas a `withErrorHandling.ts`; `apiHelpers` separa rate-limit/auth en `apiHelpers.handlers.ts`/`api.rateLimit.ts`, dejando el top <=16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.
- Infra (final): `src/utils/withErrorHandling.ts` usa helpers (`withErrorHandling.helpers.ts`) y el reporte de complejidad queda con mÃ¡ximo 16. Gates: `npm run lint`, `npm run test:ci`, `npm run check:complexity`.

- Gates finales (2025-12-03): lint, type-check, test:ci, check:complexity todos verdes; refactors tipados en ProductPage, SearchBar, Cart, Reviews, Wishlist, ImageGallery, VirtualProductGrid, errorHandler y api.rateLimit. CC m�ximo=15 (`reports/complexity-report.json`).
