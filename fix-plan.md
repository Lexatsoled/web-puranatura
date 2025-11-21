# Plan de Remediación por Fases

## Fase 0 – Análisis inicial (1-3 días)

- **T0.1 Inventario completo y baseline**
  - **Objetivo:** consolidar `inventory.json`, confirmar exclusiones y mapear dependencias críticas (`frontend-core`, `content-data`, `backend-data`).
  - **Pasos:** revisar reporte de hashing, etiquetar módulos huérfanos, integrar escaneo de secretos (gitleaks/trivy).
  - **Pruebas:** `python -m json.tool inventory.json`, `gitleaks detect`.
  - **Métrica éxito:** 95% de archivos clasificados con `module_id` y 0 falsos positivos en secretos.
  - **Riesgos:** tiempo de ejecución alto en CI → usar cache.
  - **Rollback:** restaurar inventario previo desde control de versiones si rompe pipelines.

## Fase 1 – Seguridad & Estabilidad (1-2 semanas)

- **T1.1 Backend real para autenticación**
  - **Objetivo:** eliminar autenticación simulada en `contexts/AuthContext.tsx` (módulo `frontend-contexts`) y mover credenciales al servidor.
  - **Pasos:**
    1. Crear endpoints `/api/auth/login|register|refresh` (Node/Express o BFF existente).
    2. Reemplazar lectura de `localStorage` por llamadas `fetch/axios` seguras con `credentials: 'include'`.
    3. Guardar sólo perfil no sensible en contexto; tokens en cookie HttpOnly.
    4. Añadir manejo de errores/lockout y pruebas unitarias.
  - **Diff propuesto:**

    ```diff

    ```

- const foundUser = savedUsers.find((u: any) => u.email === email && u.password === password);
- if (foundUser) {
- const { password: \_, ...userWithoutPassword } = foundUser;
- setUser(userWithoutPassword);
- }

* const response = await api.post<AuthResponse>('/auth/login', { email, password }, { withCredentials: true });
* setUser(response.data.profile);
  ```
  - **Pruebas:** `npm run test:unit -- AuthContext`, `npx playwright test --grep auth`, pruebas de API con Postman/Newman.
  - **Métrica éxito:** 0 credenciales en `localStorage`, cobertura de pruebas de auth ≥80 %, errores 401 reducidos.
  - **Riesgos:** backend no listo → plan B deshabilitar registro público.
  - **Rollback:** volver a commit anterior + feature flag `VITE_ENABLE_AUTH_SIMULATION=false` mientras se activa BFF.
  ```

- **T1.2 Sanitizar contenido dinámico**
  - **Objetivo:** cerrar vector XSS en `components/BlogPostModal.tsx` y `src/components/Breadcrumbs.tsx`.
  - **Pasos:** importar `sanitizeHtml`/`DOMPurify`, sanear contenido antes de `dangerouslySetInnerHTML`, añadir pruebas con payload malicioso.
  - **Diff propuesto:**
    ```diff
    -import React, { useEffect } from 'react';
    +import React, { useEffect, useMemo } from 'react';
    +import { sanitizeHtml } from '../src/utils/sanitizer';
    @@
    ```
-        <div dangerouslySetInnerHTML={{ __html: post.content }} />

*        <div dangerouslySetInnerHTML={{ __html: safeContent }} />
  ```
  - **Pruebas:** `npm run test:unit -- BlogPostModal`, `npm run test:e2e -- --grep blog`.
  - **Métrica éxito:** payload `<img src=x onerror=alert(1)>` renderizado como texto plano, Lighthouse security headers ≥ A.
  - **Riesgos:** sanitizar de más (pierde estilos) → ajustar configuraciones DOMPurify.
  - **Rollback:** revertir archivo y mantener sanitización servidor-side temporalmente.
  ```

- **T1.3 Gestión de secretos y configuración**
  - **Objetivo:** sacar JWT/keys de `backend/.env` y publicar plantillas.
  - **Pasos:**
    1. Crear `backend/.env.example` sin valores, actualizar `.gitignore`.
    2. Rotar claves reales en el gestor (KeyVault/SSM).
    3. Añadir job de `secret-scan` en CI.
  - **Diff propuesto:**

    ```diff

    ```

- JWT_SECRET=dev_secret_cambiar_en_produccion_min_64_chars_1234567890abcdef
- JWT_REFRESH_SECRET=dev_refresh_secret_cambiar_en_produccion_min_64_chars

* JWT_SECRET=
* JWT_REFRESH_SECRET=
  ```
  - **Pruebas:** `npm run lint -- backend`, `gitleaks detect`.
  - **Métrica éxito:** 0 hallazgos críticos de secretos después de pipeline.
  - **Riesgos:** olvidar cargar variables en hosting → documentar `README`.
  - **Rollback:** restaurar `.env` local únicamente (no en git) y re-ejecutar pipeline manual.
  ```

## Fase 2 – Rendimiento & UX (1-2 semanas)

- **T2.1 Restaurar lazy-loading real de rutas**
  - **Objetivo:** reducir bundle inicial corrigiendo `withLazyLoading` (módulos `frontend-core` y `frontend-pages`).
  - **Pasos:** cambiar HOC para aceptar factory, actualizar `AppRoutes` y medir `vite build --analyze`.
  - **Diff propuesto:** ver hallazgo `PERF-LAZY-005`.
  - **Pruebas:** `npm run build`, `npx lighthouse http://localhost:4173`.
  - **Métrica éxito:** main chunk < 450 kB, LCP < 2.5 s en desktop.
  - **Riesgos:** fallback roto → añadir pruebas visuales Playwright.
  - **Rollback:** feature flag `USE_EAGER_ROUTES=true` que usa import estático.
- **T2.2 Automatizar optimización de imágenes**
  - **Objetivo:** reemplazar `scripts/optimizeImages.ts` corrupto y garantizar artefactos en `public/optimized`.
  - **Pasos:** importar `processProductImages`, validar carpetas, emitir métricas y fallar con exit code ≠0 si no hay conversiones.
  - **Diff propuesto:** ver hallazgo `OPS-SCRIPT-008`.
  - **Pruebas:** `npm run optimize-images`, comparar tamaños con `du -h public/optimized`.
  - **Métrica éxito:** ≥90 % de assets JPEG/Png convertidos a WebP/AVIF, build sin advertencias.
  - **Riesgos:** sharp no instalado en CI Windows → documentar dependencias.
  - **Rollback:** comentar script en `package.json` temporalmente y subir assets precalculados.
- **T2.3 Normalizar analytics y consentimiento**
  - **Objetivo:** hacer que `useAnalytics` use `import.meta.env` + flag de consentimiento.
  - **Pasos:** crear `useConsentStore`, cargar IDs desde `.env`, evitar inyección si no hay permiso, mockear en tests.
  - **Pruebas:** `npm run test -- useAnalytics`, `npx playwright test --grep consent`.
  - **Métrica éxito:** eventos GA/FB visibles tras habilitar flag, 0 scripts si no hay consentimiento.
  - **Riesgos:** perder telemetría temporal → monitorear dashboards.
  - **Rollback:** reintroducir fallback al comportamiento anterior detrás de `VITE_ENABLE_ANALYTICS_LEGACY`.

## Fase 3 – Accesibilidad & Compatibilidad (1 semana)

- **T3.1 Corregir mojibake y formatos**
  - **Objetivo:** reescribir literales dañados (`CartModal.tsx`, `SimpleLayout.tsx`, CSVs) y centralizar formateo.
  - **Pasos:** definir util `intlCurrency`, mover textos a módulo `i18n`, reexportar desde contexts, validar con herramientas a11y.
  - **Diff propuesto:** ver hallazgo `I18N-ENC-009`.
  - **Pruebas:** `npm run test:unit -- CartModal`, `npx playwright test --grep cart`, `npx axe-linter ./dist`.
  - **Métrica éxito:** 100 % de strings auditados en UTF-8, AXE score > 90.
  - **Riesgos:** breaking changes en snapshots → actualizar tests.
  - **Rollback:** conservar copia de textos anteriores para restaurar rápidamente.
- **T3.2 Formularios accesibles**
  - **Objetivo:** aplicar WCAG 2.1 AA a modales/forms (`AuthModal`, `ContactPage`).
  - **Pasos:** añadir `aria-*`, focus traps, mensajes legibles, validación con `zod`.
  - **Pruebas:** `npm run test -- AuthModal`, `npx playwright test --grep form`, `npx axe http://localhost:4173/contacto`.
  - **Métrica éxito:** 0 errores críticos en axe-core, contraste validado.
  - **Riesgos:** interacción con framer-motion → verificar animaciones.
  - **Rollback:** revertir cambios específicos de CSS manteniendo etiquetas accesibles.

## Fase 4 – Observabilidad, CI/CD y Prevención (1-2 semanas)

- **T4.1 Endurecer E2E y helpers**
  - **Objetivo:** evitar falsos positivos en Playwright (`e2e-tests`).
  - **Pasos:** actualizar `search-filter-cart.spec.ts` con aserciones reales, mejorar `clickWhenReady` para registrar errores, integrar en CI.
  - **Pruebas:** `npx playwright test`, ejecutar en pipeline paralelo.
  - **Métrica éxito:** pipelines fallan cuando búsqueda no filtra, flaky rate <5 %.
  - **Riesgos:** tests más lentos → usar `--grep`.
  - **Rollback:** usar versión anterior del helper mientras se estabiliza.
- **T4.2 Pipelines de control**
  - **Objetivo:** añadir jobs automáticos: `npm run lint`, `npm run test`, `npm run optimize-images`, `secret-scan`.
  - **Pasos:** crear workflow (GitHub Actions/Azure DevOps), caches para `node_modules`, publicar artefactos Lighthouse.
  - **Pruebas:** ejecutar workflow en branch feature, revisar SARIF.
  - **Métrica éxito:** CI < 12 min, gates obligatorios antes de deploy.
  - **Riesgos:** runners saturados → activar concurrency.
  - **Rollback:** deshabilitar workflow vía `skip-ci` mientras se corrigen fallas.
- **T4.3 Métricas compartidas**
  - **Objetivo:** instrumentar dashboards (ver `metrics-dashboard.md`) y exponer hook `useMetrics` para enviar datos a GA/LogRocket.
  - **Pasos:** definir eventos clave, enviar a backend, añadir cuadros en Data Studio.
  - **Pruebas:** smoke `npm run dev`, verificar events en GA real.
  - **Métrica éxito:** 100 % de KPIs actualizados semanalmente.
  - **Riesgos:** ruido de datos → aplicar muestreo.
  - **Rollback:** deshabilitar envío de métricas vía flag `VITE_METRICS_ENABLED`.
