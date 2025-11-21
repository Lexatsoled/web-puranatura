# fix-plan.md

## Fase 0 – Análisis inicial (1-2 días)

- **id:** F0-INV
- **objetivo:** Consolidar inventario, riesgos y dependencias críticas.
- **pasos:**
  1. Validar `inventory.json` vs árbol real (spot-check hashes de módulos críticos).
  2. Documentar diagrama actualizado en `architecture-map.md` y alinear módulos/owners.
  3. Priorizar hallazgos usando matriz impacto × probabilidad.
- **diff propuesto:** No aplica (documentación entregada). Mantener archivo versionado.
- **pruebas:** Revisar inventario + checklist manual en PR.
- **métrica de éxito:** Cobertura ≥95 % de archivos auditados; stakeholders alineados en top-5 riesgos.
- **riesgos:** Falta de contexto funcional → suposiciones erróneas.
- **rollback:** Recalcular inventario con script `inventory.json` previo.

---

## Fase 1 – Seguridad & Estabilidad (1-2 semanas)

### Tarea SEC-AUTH-001

- **objetivo:** Externalizar autenticación y eliminar contraseñas en claro.
- **pasos:**
  1. Crear endpoints `/auth/register` y `/auth/login` en backend (hash argon2 + JWT httpOnly).
  2. Reemplazar `AuthContext` para consumir API y guardar solo `sessionId` efímero (sessionStorage/Zustand).
  3. Añadir expiración y renovación automática; invalidar `puranatura-users` legacy en migración.
- **diff propuesto:**
  ```diff
  - const savedUsers = JSON.parse(localStorage.getItem('puranatura-users') || '[]');
  - const userWithPassword = { ...newUser, password: userData.password };
  - savedUsers.push(userWithPassword);
  - localStorage.setItem('puranatura-users', JSON.stringify(savedUsers));
  + const { data } = await api.post('/auth/register', userData);
  + setUser(data.user);
  + sessionStorage.setItem('puranatura-session', data.sessionId);
  ```
- **pruebas:** `npm run test:unit -- AuthContext`, `npm run test:e2e -- --grep auth`, pruebas de API (Supertest) contra backend.
- **métrica de éxito:** `stored_passwords_in_client = 0`, cobertura de pruebas de auth ≥80 %.
- **riesgos:** Cortar acceso a usuarios existentes; dependencia del backend listo.
- **rollback:** Re-habilitar modo legacy guardado en feature flag `VITE_ENABLE_LEGACY_AUTH` mientras se resuelve.

### Tarea SEC-SECRETS-002

- **objetivo:** Sacar secretos/backups del repositorio.
- **pasos:**
  1. Añadir reglas en `.gitignore` y purgar objetos sensibles (`git filter-repo` si aplica).
  2. Crear `.env.example` y documentación en `docs/ONBOARDING_SECRETS.md`.
  3. Mover backups a storage cifrado (S3/GCS) y automatizar tareas via pipeline con claves rotadas.
- **diff propuesto:**
  ```diff
  +backend/.env
  +backend/database.sqlite*
  +backend/backups/
  *.gz
  ```
- **pruebas:** Ejecutar `trufflehog`/`gitleaks` en CI; verificar que `npm run build` falla si falta `.env` requerido.
- **métrica de éxito:** `secrets_in_repo = 0`, todos los pipelines usan secretos gestionados.
- **riesgos:** Historia del repo puede seguir conteniendo secretos; requiere coordinación legal.
- **rollback:** Mantener copia cifrada offline antes de purgar para restaurar si algo falla.

### Tarea SEC-XSS-003

- **objetivo:** Sanitizar contenido HTML dinámico.
- **pasos:**
  1. Importar `sanitizeHtml` (DOMPurify) en `BlogPostModal`, `ProductPage`, cualquier componente con `dangerouslySetInnerHTML`.
  2. Añadir validación/escape adicional en backend (`storeEvent`, futuros CMS endpoints).
  3. Configurar CSP mínima (docs/SECURITY_HEADERS_GUIDE.md) y habilitar en proxy/hosting.
- **diff propuesto:**
  ```diff
  - <div dangerouslySetInnerHTML={{ __html: post.content }} />
  + <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
  ```
- **pruebas:** Unit tests de sanitizador (`npm run test -- sanitizer`), Playwright PoC de inyección (`e2e/blog-xss.spec.ts`).
- **métrica de éxito:** `exploitable_poc = false`, cobertura de transformaciones DOMPurify ≥90 %.
- **riesgos:** Sanitizar demasiado puede truncar contenido legítimo.
- **rollback:** Feature flag `VITE_DISABLE_SANITIZER` temporal mientras se ajusta la whitelist.

---

## Fase 2 – Rendimiento & UX (1-2 semanas)

### Tarea PERF-DATA-004

- **objetivo:** Reducir tamaño del bundle y mejorar tiempos de tienda/blog.
- **pasos:**
  1. Exponer endpoints `/products`, `/blog` paginados (con cache) y migrar `StorePage` a React Query.
  2. Implementar virtualización/lazy loading (react-window) y filtros server-side.
  3. Automatizar optimización de imágenes (Sharp) y generar `srcset`/`sizes`.
- **diff propuesto:**
  ```diff
  - const products = require('../data/products');
  + const { data: products = [] } = useQuery(['products', filters], fetchProducts);
  ```
- **pruebas:** `npm run test:coverage`, `npm run test:e2e -- --grep store`, perfilado con `k6`/Lighthouse.
- **métrica de éxito:** `bundle_kb_store <= 250`, `LCP <= 2.5s`, `CLS <= 0.1`.
- **riesgos:** Nuevas latencias de API si no se cachea; requiere backend escalable.
- **rollback:** Mantener fallback local (`if (!apiAvailable) useLocalData`) hasta estabilizar.

### Tarea UX-FOCUS-005

- **objetivo:** Accesibilidad en modales y navegación (WCAG 2.1 AA).
- **pasos:**
  1. Añadir `role="dialog"`, `aria-modal`, trampa de foco y manejo de tab en `CartModal`, `BlogPostModal`, `AuthModal`.
  2. Incluir enlaces de "Saltar al contenido" y landmarks `<main>/<nav>` en `SimpleLayout`.
  3. Configurar pruebas axe-core en CI.
- **diff propuesto:**
  ```diff
  - <motion.div className="fixed inset-0 ..." onClick={onClose}>
  + <motion.div role="dialog" aria-modal="true" aria-labelledby="cart-title" ...>
  ```
- **pruebas:** `npm run test:unit -- modal`, `npx axe http://localhost:5173`, Playwright + axe plugin.
- **métrica de éxito:** Puntuación A11y Lighthouse ≥ 90, `axe` sin violaciones críticas.
- **riesgos:** Cambios de foco pueden romper accesibilidad existente si no se testea teclado.
- **rollback:** Mantener prop `disableFocusTrap` por componente.

---

## Fase 3 – Compatibilidad & SEO (1 semana)

### Tarea COMP-NEXT-005

- **objetivo:** Reemplazar dependencias incompatibles (next-seo / next/router).
- **pasos:**
  1. Sustituir `next-seo` por `react-helmet-async` o `@vitejs/plugin-react-pages` para metadatos.
  2. Actualizar `useSeo` para usar `useLocation`/`window.location` y exponer un `<Seo>` wrapper reutilizable.
  3. Añadir pruebas que validen `<title>`, `<meta>` y JSON-LD.
- **diff propuesto:**
  ```diff
  - import { useRouter } from 'next/router';
  - import { NextSeo } from 'next-seo';
  + import { useLocation } from 'react-router-dom';
  + import { Helmet } from 'react-helmet-async';
  ```
- **pruebas:** `npm run test -- seo`, `npm run test:e2e -- --grep seo`, snapshot HTML en CI.
- **métrica de éxito:** Cero errores de build por dependencias Next, metas correctas verificadas por `npm run lint:seo`.
- **riesgos:** Necesario actualizar documentación/marketing; Helmet requiere provider.
- **rollback:** Mantener branch con next-seo hasta validar quiebre.

### Tarea COMP-ROUTING-006

- **objetivo:** Consolidar rutas y código compartido (SimpleLayout vs Layout/Header).
- **pasos:**
  1. Definir Layout único (`components/Layout.tsx`) y eliminar duplicidades (`SimpleLayout`, `Header.tsx`).
  2. Activar lazy routes reales usando `React.lazy` y `Suspense` (sin wrappers innecesarios).
  3. Documentar contractos en `src/routes/AppRoutes.tsx`.
- **diff propuesto:**
  ```diff
  - import SimpleLayout from './SimpleLayout';
  + import Layout from './components/Layout';
  ```
- **pruebas:** `npm run test -- routes`, navegación manual + Playwright.
- **métrica de éxito:** Menos de 1 Layout duplicado, tiempos de transición suaves (<100ms JS).
- **riesgos:** Rutas podrían perder estilos hasta ajustar CSS.
- **rollback:** Feature flag `VITE_USE_SIMPLE_LAYOUT`.

---

## Fase 4 – Observabilidad, CI/CD y prevención (1-2 semanas)

### Tarea PRIV-AN-006

- **objetivo:** Cumplir GDPR/LPDP y asegurar canal analytics.
- **pasos:**
  1. Añadir banner de consentimiento persistente y gating en `useAnalytics` (no scripts sin opt-in).
  2. Consumir env vars via `import.meta.env`, validar payload server-side (zod/drizzle) y aplicar rate limiting/CSRF (helmet/csurf + Redis si hay backend en Node).
  3. Emitir eventos a un topic interno (Kafka/queue) en lugar de logging directo.
- **diff propuesto:**
  ```diff
  - if (process.env.REACT_APP_GA_ID) { this.loadScript(...); }
  + const gaId = import.meta.env.VITE_GA_ID;
  + if (!gaId || !hasConsent()) return;
  + this.loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
  ```
- **pruebas:** `npm run test -- analytics`, `npm run test:e2e -- --grep consent`, contract tests del endpoint.
- **métrica de éxito:** `consent_opt_in_rate >= 0.8`, 0 errores de env en build, `429` entregados ante flooding.
- **riesgos:** Disminución de métricas hasta que los usuarios acepten tracking.
- **rollback:** Fallback a tracking básico sin datos personales hasta estabilizar.

### Tarea CI-HARDEN-007

- **objetivo:** Endurecer pipeline de calidad.
- **pasos:**
  1. Añadir jobs en CI para lint, unit tests, e2e Playwright (headless) y secret scan.
  2. Configurar `regression-suite.md` como checklist y publicar resultados (SARIF + badges).
  3. Integrar monitoreo (Sentry/logging estructurado) siguiendo `docs/LOGGING.md` + `monitoring/` stack.
- **diff propuesto:** YAML en pipeline (ej. GitHub Actions) ejecutando `npm run test`, `npm run test:e2e`, `trufflehog`. (Referenciar docs existentes.)
- **pruebas:** Ejecutar pipeline en PR piloto, validar artifacts (coverage, SARIF).
- **métrica de éxito:** Tiempo de pipeline <15 min, cero merges sin tests verdes.
- **riesgos:** Coste en minutos CI; flakiness e2e si ambiente no está listo.
- **rollback:** Ejecutar e2e solo nightly hasta estabilizar.
