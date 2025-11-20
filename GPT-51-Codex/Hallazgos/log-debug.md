**Audit Summary**: Summary of automated Lighthouse (desktop/mobile) and axe-core results for `http://localhost:5173/`.

- **Scan date**: 2025-11-20
- **Tools**: Lighthouse 13.0.0 (desktop/mobile emulation), axe-core (via Playwright, v4.8.0)

**Quick Verdict**: The site renders and E2E tests pass; accessibility scan found a critical color-contrast violation (CTA) and several "incomplete" contrast checks caused by gradients/overlays. Performance shows slow LCP (desktop 5.6s, mobile 5.5s) and room to reduce JS/CSS payloads.

**Lighthouse — Key Metrics**

- **Desktop**:
  - First Contentful Paint (FCP): 3.38 s
  - Largest Contentful Paint (LCP): 5.63 s (poor)
  - Speed Index: 5.16 s
  - Notes: Filmstrip shows late hero painting; median/100p thresholds indicate LCP is the main drag on Performance score.
- **Mobile (emulated)**:
  - FCP: 3.16 s
  - LCP: 5.50 s (poor)
  - Speed Index: 3.29 s
  - Notes: Mobile LCP also high; Speed Index is better but LCP dominates.

- 
- **Fecha:** 2025-11-20
 
Actionable Lighthouse opportunities (prioritized):

- **LCP / Hero image** — The hero/largest image is delayed. Remediations:
  - Use optimized/responsive images (serve properly sized images via `srcset`/`picture`).
  - Preload the hero LCP image via `<link rel="preload" as="image" href="...">` when safe.
  - Ensure the hero has a deterministic background (overlay or solid color) so contrast checks can be evaluated and the browser can paint meaningful content earlier.
- **Reduce main-thread work & JS bytes** — Large bundles increase CPU work.
  - Identify heavy vendor bundles (suspicious third-party code) and lazy-load non-critical routes/components.
  - Remove unused JS or split with dynamic imports.
- **Render-blocking resources** — Audit CSS/critical CSS.
  - Inline critical above-the-fold CSS or defer non-critical styles to reduce render-blocking.

**axe-core findings (reports/axe-report.json)**

- **Violations (critical/high priority)**:
  - `color-contrast`: CTA _"Ir a la Tienda"_ previously had insufficient contrast (contrast was ~3.29:1 with `bg-green-600` + white). Quick-fix: CTA updated to `bg-green-700` (and hover to `bg-green-800`) in `src/pages/HomePage.tsx` and `pages/HomePage.tsx` — re-run axe to validate.
- **Incomplete**:
  - Multiple `color-contrast` nodes marked `incomplete` because axe could not determine the effective background when text sits over gradients or background images (translucent overlays or complex backgrounds). Fixes below make these checks deterministic.
- **Passes**:
  - `button-name`, `link-name`, `meta-viewport` and many structural checks passed.

**Accessibility Remediations (high → low)**

- **Contrast determinism** (High):
  - Add a semi-opaque overlay behind text that sits over images, or ensure text is placed inside elements with an explicit background color. This eliminates `incomplete` contrast results and improves readability/LCP determinism.
- **Focus management & ARIA** (High → Medium):
  - Confirm all modals (e.g., CartModal) have `role="dialog"`, `aria-modal="true"`, `aria-labelledby` and focus trap + restore. `components/CartModal.tsx` already received basic improvements — run axe to confirm.
- **Keyboard affordances / visible focus** (Medium):
  - Ensure interactive controls have discernible :focus styles (avoid removing native outlines without replacement). Verify with keyboard navigation.
- **Images & alt text** (Medium):
  - Provide meaningful `alt` text for decorative vs. content images; mark purely decorative images with empty `alt=""`.

**Performance Remediations (immediate)**

- Preload hero image; use properly sized, compressed images (WebP/AVIF) and responsive `srcset`.
- Audit bundle size (`npm run build` + analyze output) and lazy-load non-critical components (e.g., large admin widgets, non‑critical third‑party libs).
- Ensure server/preview serves assets with efficient caching headers for CI/production.

**Security & Best Practices**

- Ensure production deploy serves over HTTPS (Lighthouse shows `is-on-https: true` for local preview, but production must have TLS). Keep dependencies up to date.

**Next Steps / TODO**

1. Re-run axe (dev) and Lighthouse after the CTA fix and overlay changes: `.\scripts\run-axe-dev.ps1` then `.\scripts\run-accessibility-audits.ps1` (or run Lighthouse with Chrome remote debugging to avoid chrome-launcher EPERM). — Status: pending
1. Re-run axe (dev) and Lighthouse after the CTA fix and overlay changes: `.\scripts\run-axe-dev.ps1` then `.\scripts\run-accessibility-audits.ps1` (or run Lighthouse with Chrome remote debugging to avoid chrome-launcher EPERM). — Status: completado (axe ejecutado: `reports/axe-report.json` actualizado; timestamp 2025-11-20T15:09:33Z; `incomplete: []`).
1. Make overlay fixes for any hero/heading text over images and re-run axe to clear `incomplete` contrast nodes. — Status: completado (se añadió panel opaco en hero; `reports/axe-report.json` muestra `incomplete: []`).
1. Audit bundle & reduce JS: run a production build and analyze (e.g., `vite build` + bundle visualizer). — Status: pending
1. Harden ARIA/landmarks across remaining modals/menus; run axe to validate. — Status: in progress (CartModal updated)

- **Cambio adicional:** `SimpleLayout.tsx` header cambiado a color sólido (`#16a34a`) para dar un fondo determinístico y evitar `bgGradient`/`bgOverlap` en axe.

5. Document final scores/artifacts (place `reports/axe-report.json`, `reports/lighthouse-desktop.report.json`, `reports/lighthouse-mobile.report.json` alongside this log). — Status: partial (axe JSON present; lighthouse JSONs present but earlier runs had EPERM for HTML exports)

- **Post-fix notes:** `reports/axe-report.json` actualizado — `incomplete: []`; sin embargo aparecen nuevas `violations` relacionadas con contraste en la navegación (ver sección "Hallazgo post-fix" más abajo).

**Hallazgo post-fix**

- `violations` después de los cambios:
  - `color-contrast`: enlaces de navegación (`.nav-link`) — `#fbbf24` vs `#16a34a` (ratio ≈ 1.97), `white` vs `#16a34a` (ratio ≈ 3.29) y botones de cabecera con overlay (`Mi Carrito`) con contraste insuficiente. Recomendación: ajustar color de enlace activo, o añadir un fondo para los enlaces.

Siguientes pasos propuestos:

1. Ajustar `NavLink` en `SimpleLayout.tsx` — proponer un color alternativo accesible o añadir fondo claro para enlaces.
2. Re-ejecutar `.\scripts\run-axe-dev.ps1` para asegurar que las `violations` desaparecen.
3. Ejecutar `.\scripts\run-accessibility-audits.ps1` con Chrome iniciado en `--remote-debugging-port` para generar Lighthouse HTML/JSON y completar evidencias de la Fase 3.

**Artifacts**

- `reports/axe-report.json` (axe results)
- `reports/lighthouse-desktop.report.json` (Lighthouse raw JSON)
- `reports/lighthouse-mobile.report.json` (Lighthouse raw JSON)

If you want, I can now:

- [ ] Re-run axe immediately and attach the updated JSON
- [ ] Apply overlay contrast fixes in the hero component(s) and re-run both axe + Lighthouse (using Chrome remote debugging to avoid EPERM)
- [ ] Generate a prioritized GitHub-style TODO list and apply the highest-priority code fixes

---

Log generated by GitHub Copilot (GPT-5 mini) on the developer workstation.

# Log de Debugging

- **Estado:** cerrado (T0.1).

### DOC-CLEAN-011 – Archivos de planes obsoletos

- **Fecha:** 2025-11-19
- **Acción:** inventario `docs_inventory.json` generado y archivos antiguos (`Analisis GPT 51`, `docs/`, `reports/`, `Problemas Encontrados en GitHub`, `temp_trace_extract1`) movidos a `archive/` siguiendo [doc-cleanup](../Templates/doc-cleanup.md).
- **Impacto:** el repositorio queda libre de planes duplicados; la documentación vigente reside en `GPT-51-Codex`.
- **Estado:** cerrado (T0.1).

---

version: 1.0
updated: 2025-11-20
owner: Debug Squad

Este documento sintetiza cada hallazgo con fechas, síntomas, causa-raíz, solución propuesta y vínculo a evidencias (capturas o archivos externos). Use los IDs para actualizar el plan maestro y los ToDo.

> Las capturas importadas se guardarán como `Evidencias/ci-fail-01.png`, etc. En esta iteración se referencian directamente las fuentes (PR #2 y los `.txt` de GitHub Copilot) hasta recibir los binarios.

---

### SEC-AUTH-002 – Auth solo en cliente

- **Fecha:** 2025-11-18
- **Archivo:** contexts/AuthContext.tsx, src/components/AuthModal.tsx, src/utils/api.ts.
- **Síntoma:** los usuarios/contraseñas vivían en localStorage y se simulaba un backend con setTimeout.
- **Acción 2025-11-20:** el frontend ahora consume `/api/auth/login|register` del BFF (Axios + JWT), se almacena solo el token recibido y los contextos sincronizan al usuario desde la API.
- **Estado:** cerrado (T1.1 integró auth real contra el BFF).

### SEC-SECRETS-004 - .env versionado

- **Fecha:** 2025-11-18
- **Archivo:** backend/.env
- **Síntoma:** `JWT_SECRET` y `JWT_REFRESH_SECRET` hardcodeados en repo.
- **Acción 2025-11-21:** se añadió una política común en `.gitignore` para excluir `.env*` (raíz y backend), se eliminaron los archivos versionados del historial vigente y se documentaron los valores requeridos en `/.env.example` y `backend/.env.example`. Las llaves dev se rotaron localmente y ahora cada entorno debe generar las suyas siguiendo la instrucción (`openssl rand -base64 64`).
- **Estado:** cerrado (T1.2 completada).

### SEC-XSS-003 – HTML sin sanitizar

- **Fecha:** 2025-11-18
- **Archivo:** `components/BlogPostModal.tsx`, `src/components/Breadcrumbs.tsx`, `src/pages/ProductPage.tsx`.
- **Síntoma:** `dangerouslySetInnerHTML` con contenido externo (`post.content`).
- **Solución:** usar `sanitizeHtml` (DOMPurify) antes de renderizar y añadir pruebas.
- **Actualización 2025-11-20:** `sanitizeHtml` integrado en `BlogPostModal`, `Breadcrumbs` y `ProductPage`; `useMemo` evita recomputar y nuevas pruebas unitarias (`src/components/__tests__/BlogPostModal.test.tsx`, `src/components/__tests__/Breadcrumbs.test.tsx`) validan que scripts/atributos peligrosos no llegan al DOM.
- **Actualización 2025-11-20 (PM):** `BlogPage`/`StorePage` consumen datasets ya saneados mediante `src/utils/contentSanitizers.ts` + nuevas pruebas (`src/utils/__tests__/contentSanitizers.test.ts`).
- **Estado:** cerrado (T1.3 completada 2025-11-20).

### PERF-LAZY-005 - Lazy loading roto

- **Fecha:** 2025-11-18
- **Archivo:** `src/hooks/usePerformance.tsx`, `src/routes/AppRoutes.tsx`.
- **Síntoma:** `withLazyLoading` envolvía `React.lazy(() => Promise.resolve(...))`, bloqueando el code-splitting y dejando el bundle inicial >2 MB.
- **Acción 2025-11-21:** `withLazyLoading` ahora recibe un loader (`() => import(...)`) y delega directamente en `React.lazy`; `AppRoutes` usa factories reales, habilitando los chunks por página.
- **Estado:** cerrado (T2.1 completada).

### OPS-SCRIPT-008 - Optimización de imágenes ficticia

- **Fecha:** 2025-11-18
- **Archivo:** `scripts/optimizeImages.ts`.
- **Síntoma:** el script solo imprimía logs corruptos y nunca invocaba `sharp` ni `processProductImages`.
- **Solución:** llamar `processProductImages(inputDir, outputDir)` y fallar si no hay outputs.
- **Acción 2025-11-21:** `scripts/optimizeImages.ts` ahora valida directorios, ejecuta `processProductImages` y cuenta los archivos optimizados; si no hay resultados, aborta con código distinto de cero.
- **Estado:** cerrado (T2.2 completada).

### OBS-ANA-006 - Analytics sin env ni consentimiento

- **Fecha:** 2025-11-18
- **Archivo:** `src/hooks/useAnalytics.ts`.
- **Síntoma:** el hook leía `process.env` estilo CRA y siempre inyectaba GA/FB aunque el usuario no otorgara consentimiento.
- **Acción 2025-11-21:** se migró a `import.meta.env.VITE_*`, se consulta `puranatura-consent-analytics` antes de cargar scripts y se bloquea cualquier tracking (incluido el backend) sin consentimiento.
- **Estado:** cerrado (T2.3 completada).

### QA-E2E-007 – Test tautológico

- **Fecha:** 2025-11-18
- **Archivo:** `e2e/search-filter-cart.spec.ts`.
- **Síntoma:** `expect(locator).toHaveCount(await locator.count())`.
- **Solución:** capturar `initialCount`, verificar reducción y texto relacionado; endurecer helper `clickWhenReady`.
- **Estado:** pendiente Fase 4 T4.1.
- **Actualización 2025-11-19:** se ejecutó la suite E2E local con `npm run test:e2e`. Resultado: 2 pruebas fallaron en Chromium.
  - Tests fallidos:
    - `Funcionalidades críticas: búsqueda, filtros y carrito › debe permitir buscar productos` — Error: `expect(locator).toBeVisible()` falló; selector `[data-testid="search-input"]` no encontrado/visible.
    - `Funcionalidades críticas: búsqueda, filtros y carrito › debe permitir añadir productos al carrito` — Error: `locator.waitFor` timeout esperando el botón `[data-testid="add-to-cart"]` dentro de `.product-card`.
  - Artefactos generados (local):
    - `test-results/search-filter-cart-Funcion-2842e-e-permitir-buscar-productos-chromium/test-failed-1.png`
    - `test-results/search-filter-cart-Funcion-2842e-e-permitir-buscar-productos-chromium/video.webm`
    - `test-results/search-filter-cart-Funcion-d5bab-añadir-productos-al-carrito-chromium/test-failed-1.png`
    - `test-results/search-filter-cart-Funcion-d5bab-añadir-productos-al-carrito-chromium/video.webm`
  - Observaciones: la página se sirve correctamente (`http://localhost:5173`) pero algunos selectores usados por el test no resolvieron; puede deberse a cambios en los atributos `data-testid`, a tiempo de carga diferente, o a diferencias en el contenido inicial (manifest/imágenes/placeholder). También se registraron logs de la página indicando uso de CDN de Tailwind (advertencia) y el `body` estaba vacío al primer intento de ver el DOM en el fallo (ver capturas).
- **Estado:** en investigación (T4.1) — se requiere revisar selectores E2E y sincronización (timeouts/clickWhenReady).
- **Acción 2025-11-20:** iniciada tarea T4.1 — endurecer tests Playwright y corregir `e2e/search-filter-cart.spec.ts`.
  - **Cambios aplicados:**
    - Reescrito `e2e/search-filter-cart.spec.ts` para usar selectores robustos (`[data-testid^="product-card-"]`), capturar conteos iniciales y comprobaciones no tautológicas, verificar que los títulos de resultados contienen el término buscado, y seleccionar el primer botón «Añadir» habilitado en lugar de asumir el primer card.
    - Mantener captura de consola y pageerror en el spec para facilitar debugging.
  - **Resultado de validación:** ejecutada la suite E2E localmente con el nuevo orquestador; Playwright devolvió exit code `0` y los tests relevantes pasaron en esta máquina (2 passed). Persisten advertencias/NetworkError en el preview que no afectan los resultados gracias a fallbacks en la UI.
  - **Estado:** en progreso (T4.1 parcialmente completada). Próximo paso: revisar fallos intermitentes en entornos CI y, si reaparecen, ajustar `useApi` o introducir mocks HTTP en Playwright.

### I18N-ENC-009 – Mojibake general

- **Fecha:** 2025-11-18
- **Archivos:** `components/CartModal.tsx`, `SimpleLayout.tsx`, dataset CSV, etc.
- **Síntoma:** textos con caracteres corruptos en UI (mojibake) por archivos guardados con encodings inconsistentes.
- **Solución:** forzar UTF-8 sin BOM, usar `Intl.NumberFormat('es-DO', { currency: 'DOP' })`, centralizar strings y reconstruir los archivos afectados desde fuentes con encoding correcto.
- **Acción 2025-11-19:** convertidos archivos clave a UTF-8 sin BOM (`GPT-51-Codex/Hallazgos/log-debug.md`, `GPT-51-Codex/ToDo/backlog.md` y otros archivos detectados), corregidos textos corruptos y registrada la acción en este log. Se ejecutó `npm run build` para verificar la compilación.
- **Estado:** en progreso (T3.1).
- **Acción 2025-11-19:** convertidos archivos clave a UTF-8 sin BOM (`GPT-51-Codex/Hallazgos/log-debug.md`, `GPT-51-Codex/ToDo/backlog.md` y otros archivos detectados), corregidos textos corruptos y registrada la acción en este log. Se ejecutó `npm run build` para verificar la compilación; la construcción local finalizó con éxito (se observaron warnings sobre chunking y directivas "use client" en dependencias externas que no afectan la ejecución local).
- **Estado:** cerrado (T3.1 completada).

### IMG-ASSET-010 - Imágenes de productos inexistentes

- **Fecha:** 2025-11-19
- **Archivo:** `data/products.ts`, `public/Jpeg/`
- **Síntoma:** la mayoría de `<img>` muestran 404 porque las rutas (`/Jpeg/C-1000 with Bioflavonoids Anverso.jpg`, con espacios y nombres distintos) no existen en `public/Jpeg` (los archivos reales tienen guiones bajos y nombres diferentes). En Linux/CI (case-sensitive) los errores son constantes.
- **Causa-raíz:** catálogos escritos manualmente sin validar contra el sistema de archivos; `scripts/optimizeImages.ts` nunca generaba un manifest fiable.
- **Acción 2025-11-21:** `scripts/image-manifest.ps1` ahora crea `data/image-manifest.json` con slug normalizados/paths reales y `data/products.ts` consume ese manifest (alias + placeholder controlado) para evitar 404 aun cuando falte un asset.
- **Estado:** cerrado (T2.4 completada).

### CI-WORKFLOW-001 - Añadido workflow CI básico

- **Fecha:** 2025-11-20
- **Archivo:** `.github/workflows/ci.yml`
- **Síntoma / motivo:** el repositorio no contenía workflows en la rama actual; las ejecuciones de CI fallaban por configuraciones inconsistentes (dependencias de navegador para Playwright, uso de `prisma migrate dev` interactivo, arranque del backend con herramientas de desarrollo en CI).
- **Acción aplicada:** creado `ci.yml` que instala dependencias, compila backend y frontend, arranca el BFF desde `backend/dist/server.js`, espera a `/api/health`, ejecuta tests unitarios y e2e, instala navegadores de Playwright y sube artefactos a `reports/` y `test-results/`.
- **Impacto esperado:** reduce fallos por falta de navegadores en runners, evita nodemon/ts-node en CI y evita pasos interactivos; prepara la base para estabilizar `T4.2`.
- **Pendientes / recomendaciones:**
  - Añadir paso de migraciones no interactivas (`npx prisma migrate deploy` o `prisma db push + migrate diff`) antes de arrancar backend si las migraciones son necesarias en CI.
  - Añadir secrets de producción/preview en GitHub (si la pipeline necesita secretos).
  - Ejecutar workflow en GitHub Actions y revisar logs, ajustar timeouts si el build tarda más.
  - Si aún hay fallos en Playwright por dependencias de SO, añadir `npx playwright install --with-deps` o usar contenedores con capas de sistema compatibles.

### DOC-CMT-012 - Comentarios mixtos en contextos/hooks

- **Fecha:** 2025-11-20
- **Archivos:** contexts/AuthContext.tsx, contexts/CartContext.tsx, contexts/NotificationContext.tsx, contexts/WishlistContext.tsx, src/hooks/useAnalytics.ts, src/hooks/usePerformance.tsx, src/hooks/useLocalStorage.ts, src/hooks/useSeo.ts, src/services/reviewsService.ts.
- **Síntoma:** faltaban encabezados descriptivos y quedaban mensajes/comentarios en inglés, lo que incumple el estándar.
- **Acción:** se documentó el propósito de cada contexto/hook, se tradujeron mensajes de error y se normalizaron comentarios (p.ej. logging de analytics).
- **Estado:** cerrado (T1.4 completada 2025-11-20).

### DB-MIGRATE-012 - prisma migrate dev falla en Windows

- **Fecha:** 2025-11-20
- **Archivo/Comando:** backend/prisma/schema.prisma,
  px prisma migrate dev
- **Síntoma:** el CLI devuelve "Schema engine error" o marca el entorno como no interactivo, impidiendo crear la migración inicial.
- **Acción:** sincronizamos con `prisma db push --force-reset` y generamos la migración con `prisma migrate diff --from-empty`, marcándola como aplicada (`prisma migrate resolve --applied 20251120170000_init`). Posteriormente `prisma migrate deploy` funciona.
- **Seguimiento:** Documentar que en este entorno `migrate dev` no puede usarse (CLI lo bloquea por ser no interactivo); usar `db push + diff` hasta movernos a CI/Linux.
- **Estado:** cerrado (T1.6 baseline listo).

### CI-WORKFLOW-002 - Orquestador y lint en CI
- **Fecha:** 2025-11-20
- **Archivo:** `scripts/orchestrator.mjs`, `components/UserMenu.tsx`, `src/pages/ProductPage.tsx`, `scripts/run-e2e.cjs`, `vitest.setup.ts`.
- **Síntoma:** el orquestador `node scripts/orchestrator.mjs ci` fallaba si el script `ci:security` no existía; además el lint del CI fallaba por reglas `react-hooks/rules-of-hooks` y warnings `no-unused-vars` en `catch`.
- **Acción aplicada:**
  1. `scripts/orchestrator.mjs`: añadido guard para ejecutar `ci:security` solo si existe en `package.json`.
  2. `components/UserMenu.tsx`, `src/pages/ProductPage.tsx`: movidos los `useMemo` para evitar hooks condicionales.
  3. `scripts/run-e2e.cjs`, `vitest.setup.ts`, `components/CartModal.tsx`: cambiado `catch (e)` a `catch { }` y añadido comentario explicativo en español; se mitigaron warnings `no-unused-vars`.
- **Resultado:** `node scripts/orchestrator.mjs ci` ejecuta lint, unit y e2e localmente; los tests unitarios y e2e pasan en mi máquina. El orquestador no falla por falta de `ci:security`.
- **Estado:** in progress → ready for review (T4.2 parcialmente resuelto).

### CI-WORKFLOW-003 - Solicitud de revisión del pipeline en GitHub Actions
- **Fecha:** 2025-11-20
- **Archivo:** `GPT-51-Codex/PRs/ci-orchestrator-lint-pr.md`
- **Acción requerida:** abrir PR con los cambios propuestos y validar la ejecución completa del workflow `ci.yml` en un runner Ubuntu Linux; comprobar migraciones `prisma migrate deploy` + fallback `prisma db push`, y ejecución de Playwright con `npx playwright install --with-deps`.
- **Solicito a:** `@DevOpsTeam`, `@QA`, `@Lexatsoled` — revisar logs y confirmar que `reports`/`test-results` se suben como artifacts. Si todo va bien, marcar `T4.2` como completado y mergear.
- **Notas:** Si la pipeline falla en `prisma migrate`, usar `npx prisma db push --accept-data-loss` como fallback (documentar en PR), y si Playwright falla por dependencias del SO en runner, revisar `npx playwright install --with-deps` y/o cambiar a contenedor de GitHub Actions con dependencias de navegador.


### BUILD-TS-013 -

pm run build fallaba tras integrar el BFF

- **Fecha:** 2025-11-21
- **Archivos:** components/CartModal.tsx, components/UserMenu.tsx, pages/ProfilePage.tsx, pages/StorePage.tsx, pages/ProductPage.tsx, src/types/product.ts, src/utils/productMapper.ts, src/utils/schemaGenerators.ts, e2e/helpers/cart.ts, playwright.config.ts.
- **Síntoma:** el pipeline
  pm run build detenía la entrega (T1.6) por errores TS2339/TS2300 (props inexistentes y tipos duplicados), estados sin declarar en CartModal, fechas undefined en UserMenu/ProfilePage, importaciones rotas (ProductImage, Product), config de Playwright obsoleta y helpers E2E con firmas anacrónicas.
- **Acción 2025-11-21:** se normalizó src/types/product.ts (alt opcional, brand, sin duplicados), se añadió el estado orderError, se protegieron las fechas del perfil, se corrigieron importaciones/mappers y se simplificó playwright.config.ts. Tras los ajustes
  pm run build ejecuta sc y ite build con éxito.
- **Estado:** cerrado (desbloquea continuación de T1.2/T2.x).
