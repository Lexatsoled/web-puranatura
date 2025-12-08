# Plan de Mejora - PuraNatura (Anti-Lost-In-The-Middle)

## Fase 0: Cimientos y Limpieza (1-2 Días)

**Objetivo**: Eliminar ambigüedades arquitectónicas y asegurar el entorno.

- [x] **ARCH-01**: Unificar carpetas `components` y `src/components`. Mover todo a `src/components`.
- [ ] **ARCH-02**: Separar dependencias de backend en `backend/package.json` vs root `package.json` para evitar builds pesados en frontend.
- [x] **DOCS-01**: Actualizar `README.md` con mapa de arquitectura real.

## Fase 1: Seguridad Crítica (AppSec) (1 Semana)

**Objetivo**: Cerrar vulnerabilidades de privacidad y configuración.

- [x] **SEC-PRIV-01**: Anonimizar `userIp` en `AnalyticsEvent` antes de persistir.
  - _Propuesta_: Crear utilitario `anonymizeIp(ip)` usando salt rotativa.
- [x] **SEC-CONF-01**: Parametrizar `trust proxy` en `app.ts`.
  - _Test_: Verificar headers `X-Forwarded-For` en staging.
- [ ] **SEC-Input-01**: Migrar validación de forms (AuthModal) a `zod` + `react-hook-form` para paridad cliente-servidor.

## Fase 2: Componentes y Mantenibilidad (2 Semanas)

**Objetivo**: Reducir deuda técnica en componentes 'God Object'.

- [x] **REFACTOR-01**: Desacoplar `AuthModal.tsx`.
  - [x] Crear `components/auth/LoginForm.tsx`.
  - [x] Crear `components/auth/RegisterForm.tsx`.
  - [x] Extraer `useAuthForm` hook (implementado via componentes separados).
- [x] **REFACTOR-02**: Optimizar imports de iconos. Usar dynamic imports o sprites si es posible para reducir JS bundle. (Centralizado en `icons/index.tsx`)

## Fase 3: UX y Rendimiento (1 Semana)

**Objetivo**: Mejorar Core Web Vitals y Feedback.

- [x] **PERF-01**: Implementar Lazy Loading en Modales (`AuthModal`, `CartModal`).
  - _Impacto_: Reducción de TBT y LCP inicial. (Implementado en `SimpleLayout.tsx`)
- [ ] **UX-01**: Internacionalización (i18n). Extraer strings hardcodeados a archivos de recursos JSON.

## Fase 4: Observabilidad y Compliance (Ongoing)

- [ ] **OPS-01**: Implementar retención de logs y purga automática de `AnalyticsEvent` antiguos (> 90 días).
- [x] **GDPR-01**: Añadir banner de cookies real conectado a la inicialización de Analytics (ahora parece cargar scripts externos en CSP).
