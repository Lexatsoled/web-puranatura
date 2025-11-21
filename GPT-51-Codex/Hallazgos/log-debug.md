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

1. Re-ejecutar .\scripts\run-axe-dev.ps1 para asegurar que las iolations de contraste desaparecen tras el ajuste del header/nav. - Status: pendiente
2. Ejecutar .\scripts\run-accessibility-audits.ps1 con Chrome iniciado en --remote-debugging-port para generar Lighthouse HTML/JSON actualizados. - Status: pendiente
3. (Opcional) Correr 
pm run build si se modifican assets antes del audit. - Status: opcional

**Actualizaci?n contrastes (2025-11-21):** Cabecera en SimpleLayout.tsx ahora usa fondo #0f5132, enlaces con fondos claros y foco visible, y botones de autenticaci?n/carrito con alto contraste (objetivo >= 4.5:1). Pendiente validar con axe/Lighthouse.

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

### QA-E2E-007 - Test tautologico

- **Fecha:** 2025-11-18
- **Archivo:** `e2e/search-filter-cart.spec.ts`.
- **Sintoma:** `expect(locator).toHaveCount(await locator.count())`.
- **Solucion:** capturar `initialCount`, verificar reduccion y texto relacionado; endurecer helper `clickWhenReady`.
- **Estado:** pendiente Fase 4 T4.1.
- **Actualizacion 2025-11-19:** se ejecuto la suite E2E local con `npm run test:e2e`. Resultado: 2 pruebas fallaron en Chromium.
  - Tests fallidos:
    - `Funcionalidades criticas: busqueda, filtros y carrito > debe permitir buscar productos` - Error: `expect(locator).toBeVisible()` fallo; selector `[data-testid="search-input"]` no encontrado/visible.
    - `Funcionalidades criticas: busqueda, filtros y carrito > debe permitir anadir productos al carrito` - Error: `locator.waitFor` timeout esperando el boton `[data-testid="add-to-cart"]` dentro de `.product-card`.
  - Artefactos generados (local):
    - `test-results/search-filter-cart-Funcion-2842e-e-permitir-buscar-productos-chromium/test-failed-1.png`
    - `test-results/search-filter-cart-Funcion-2842e-e-permitir-buscar-productos-chromium/video.webm`
    - `test-results/search-filter-cart-Funcion-d5bab-anadir-productos-al-carrito-chromium/test-failed-1.png`
    - `test-results/search-filter-cart-Funcion-d5bab-anadir-productos-al-carrito-chromium/video.webm`
  - Observaciones: la pagina se sirve correctamente (`http://localhost:5173`) pero algunos selectores usados por el test no resolvieron; puede deberse a cambios en los atributos `data-testid`, a tiempo de carga diferente, o a diferencias en el contenido inicial (manifest/imagenes/placeholder). Tambien se registraron logs de la pagina indicando uso de CDN de Tailwind (advertencia) y el `body` estaba vacio al primer intento de ver el DOM en el fallo (ver capturas).
- **Accion 2025-11-20:** iniciada tarea T4.1 - endurecer tests Playwright y corregir `e2e/search-filter-cart.spec.ts`.
  - **Cambios aplicados:**
    - Reescrito `e2e/search-filter-cart.spec.ts` para usar selectores robustos (`[data-testid^="product-card-"]`), capturar conteos iniciales y comprobaciones no tautologicas, verificar que los titulos de resultados contienen el termino buscado, y seleccionar el primer boton "Anadir" habilitado en lugar de asumir el primer card.
    - Mantener captura de consola y pageerror en el spec para facilitar debugging.
  - **Resultado de validacion:** ejecutada la suite E2E localmente con el nuevo orquestador; Playwright devolvio exit code `0` y los tests relevantes pasaron en esta maquina (2 passed). Persisten advertencias/NetworkError en el preview que no afectan los resultados gracias a fallbacks en la UI.
- **Actualizacion 2025-11-22:** fixtures E2E interceptan `/api/**` (productos/auth/orders) con datasets seguros alineados al contrato del BFF; se sanitizo `MutationObserver` para evitar errores; el spec usa `test-fixtures` y `npm run test:e2e` pasa localmente (preview termino en puerto 5182 por puertos ocupados).
- **Estado:** cerrado (T4.1 completada; monitorear en CI).
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
 - **Nota adicional (2025-11-21):** Tras revisar las advertencias, corregí un warning de Prettier en `scripts/orchestrator.mjs` (formato de `execSync(...)`) para cumplir la configuración `--max-warnings 0`. Realicé una ejecución local completa con Node v25.1: lint → pasó después del ajuste; vitest → passed; Playwright → 2 tests pasados; build → completado con warnings de chunks grandes (ver log). Se recomienda actualizar `package-lock.json` en la rama si el lockfile cambia al regenerarlo con Node 20.
- **Estado:** in progress → ready for review (T4.2 parcialmente resuelto).

### CI-WORKFLOW-003 - Solicitud de revisión del pipeline en GitHub Actions
- **Fecha:** 2025-11-20
- **Archivo:** `GPT-51-Codex/PRs/ci-orchestrator-lint-pr.md`
- **Acción requerida:** abrir PR con los cambios propuestos y validar la ejecución completa del workflow `ci.yml` en un runner Ubuntu Linux; comprobar migraciones `prisma migrate deploy` + fallback `prisma db push`, y ejecución de Playwright con `npx playwright install --with-deps`.
- **Solicito a:** `@DevOpsTeam`, `@QA`, `@Lexatsoled` — revisar logs y confirmar que `reports`/`test-results` se suben como artifacts. Si todo va bien, marcar `T4.2` como completado y mergear.
- **Notas:** Si la pipeline falla en `prisma migrate`, usar `npx prisma db push --accept-data-loss` como fallback (documentar en PR), y si Playwright falla por dependencias del SO en runner, revisar `npx playwright install --with-deps` y/o cambiar a contenedor de GitHub Actions con dependencias de navegador.

### CI-WORKFLOW-004 - Node/lockfile mismatch in CI

- **Fecha:** 2025-11-20
- **Síntoma:** `npm ci` falla en GitHub Actions con `EBADENGINE` y `EUSAGE` errors: packages in the lock file require Node >=20 while setup-node used v18; `package-lock.json` is out of sync with `package.json`.
- **Acción propuesta:**
  1. Cambiar `ci.yml` para usar `node-version: '20'` (ya implementado en PR `fix/ci-orchestrator-lint`).
  2. Ejecutar localmente `npm install` en Node v20 y commitear el `package-lock.json` actualizado al PR.
  3. Añadir `engines.node` >= 20 en `package.json` y `backend/package.json` para indicar explícitamente la dependencia del runtime.
  4. Si actualizaciones de lock no pueden realizarse inmediatamente, como fallback temporal usar `npm install` en CI para evitar bloqueos, pero preferimos `npm ci` para reproducibilidad.
- **Impacto:** evita fallos en `npm ci` y EBADENGINE en runners; asegura que `Next` y otras dependencias que requieren Node 20 se instalan correctamente.


### CI-WORKFLOW-005 - Prisma CLI 7 rompe schema.prisma

- **Fecha:** 2025-11-22
- **Síntoma:** el job Run DB migrations (non-interactive) falló con Error P1012 porque 
px prisma ... descargó Prisma CLI 7 (la raíz no tenía dependencia). Prisma 7 eliminó url dentro del datasource, pero nuestro ackend/prisma/schema.prisma (Prisma 5) sigue usando url = env("DATABASE_URL").
- **Causa-raíz:** el workflow ejecuta 
px --yes prisma ... --schema=backend/prisma/schema.prisma desde la raíz y, al no encontrar prisma local, instaló la versión más reciente (7.x) en runtime.
- **Acción 2025-11-22:** se añadió prisma@5.22.0 como devDependency en la raíz (package.json + package-lock.json) para que 
px prisma utilice una versión compatible con el schema actual. El cambio se documenta aquí y se incluyó en el PR #3.
- **Seguimiento:** ajustar el workflow para ejecutar 
pm --prefix backend run migrate o 
px --prefix backend prisma ... y planificar una migración gradual a Prisma 7 (mover la URL a prisma.config.ts) cuando haya capacidad.
- **Estado:** mitigado localmente; pendiente validar en la próxima ejecución de ci.yml.
### BUILD-TS-013 -

pm run build fallaba tras integrar el BFF

- **Fecha:** 2025-11-21
- **Archivos:** components/CartModal.tsx, components/UserMenu.tsx, pages/ProfilePage.tsx, pages/StorePage.tsx, pages/ProductPage.tsx, src/types/product.ts, src/utils/productMapper.ts, src/utils/schemaGenerators.ts, e2e/helpers/cart.ts, playwright.config.ts.
- **Síntoma:** el pipeline
  pm run build detenía la entrega (T1.6) por errores TS2339/TS2300 (props inexistentes y tipos duplicados), estados sin declarar en CartModal, fechas undefined en UserMenu/ProfilePage, importaciones rotas (ProductImage, Product), config de Playwright obsoleta y helpers E2E con firmas anacrónicas.
- **Acción 2025-11-21:** se normalizó src/types/product.ts (alt opcional, brand, sin duplicados), se añadió el estado orderError, se protegieron las fechas del perfil, se corrigieron importaciones/mappers y se simplificó playwright.config.ts. Tras los ajustes
  pm run build ejecuta sc y ite build con éxito.
- **Estado:** cerrado (desbloquea continuación de T1.2/T2.x).



### CI-WORKFLOW-006 - Validacion local de pipeline y sanitizacion de imagenes

- **Fecha:** 2025-11-22
- **Archivos:** pages/StorePage.tsx, src/utils/contentSanitizers.ts.
- **Sintoma:** `npm run lint` fallaba por usar un helper llamado `useFallback` dentro de `fetchProducts` (rules-of-hooks); `npm run test:ci` fallaba porque `sanitizeProductContent` dejaba `javascript:alert(1)` como `/javascript:alert(1)` en los `images`, rompiendo la expectativa de URLs https seguras.
- **Accion 2025-11-22:** se renombro el helper a `applyFallback` y se declararon dependencias reales del efecto (api + fallbackProducts) para eliminar el `eslint-disable`; `sanitizeProductContent` ahora fuerza un placeholder https seguro (`FALLBACK_IMAGE`) cuando la ruta no es relativa (`/...`) ni http(s). Se ejecutaron `npm run lint`, `npm run test:ci`, `npm run build` y `npm run test:e2e` con exito (avisos conocidos: advertencias de `use client` en framer-motion y el preview de Vite quedo en el puerto 5180 por puertos ocupados).
- **Estado:** cerrado (T4.2 validado localmente; pendiente ejecucion en runner CI).


### OBS-MET-011 - Dashboard de metricas

- **Fecha:** 2025-11-22
- **Archivos:** pages/MetricsDashboardPage.tsx, data/metricsDashboard.ts, metrics-dashboard.md, App.tsx, SimpleLayout.tsx.
- **Sintoma:** no existia un dashboard visible para LCP/TTFB/bundle/coverage; metricas solo en markdown con valores obsoletos.
- **Accion:** se creo la ruta `/metricas` con tarjetas, series Recharts y comandos de actualizacion; se documentaron valores basicos en metrics-dashboard.md y se anadio dataset tipado en data/metricsDashboard.ts. Navegacion actualizada para exponer la pagina.
- **Estado:** cerrado (T5.1 completada; pendiente conectar fuentes reales GA/APM en futuras iteraciones).
