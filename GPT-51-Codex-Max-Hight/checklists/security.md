# Checklist de Seguridad

- [x] `gitleaks` y `trivy` ejecutados localmente (`npm run scan:security`) sin hallazgos; `.env`/`.sqlite` están ignorados en `.gitignore`.
- [x] CSP reforzada con allowlist para GA/FB/Maps y reportOnly controlado por `env.cspReportOnly` en `backend/src/app.ts:24-70`.
- [ ] CORS restringido a orígenes controlados por `ALLOWED_ORIGINS`/`env.allowedOrigins`.
- [x] Endpoints mutantes (`/register`, `/login`, `/products` POST, `/orders` POST, `/api/ai/generate-text`) usan rate limit + body limit 1MB y authZ (`backend/src/routes/auth.ts`, `backend/src/routes/products.ts`, `backend/src/routes/orders.ts`, `backend/src/routes/ai.ts`).
- [x] Validaciones Zod y sanitización con DOMPurify/middleware para requests/responses (`backend/src/routes/*.ts`, `src/utils/sanitizer.ts`, `src/utils/sanitizationMiddleware.ts`).
- [x] Cookies `token`/`refreshToken` son httpOnly/Secure/SameSite=strict y CSRF doble submit activo (`backend/src/routes/auth.ts`, `backend/src/middleware/csrf.ts`).
- [x] Dependencias auditadas: `npm audit --production --audit-level=high` (no high) y SBOM CycloneDX disponible (`sbom.json`); queda pendiente coordinar el fix de `@lhci/cli` que trae `body-parser<2.2.1`.
- [x] Logs incluyen `traceId` en requestLogger y nowhere se exponen secretos ni se loguean claves sensibles (`backend/src/middleware/requestLogger.ts`, `backend/src/utils/logger.ts`).
