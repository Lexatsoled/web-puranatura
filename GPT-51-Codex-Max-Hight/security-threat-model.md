# Threat Model (OWASP / STRIDE)

## Activos y superficies
- Tokens JWT (auth/refresh), cookies httpOnly.
- Datos de usuarios, órdenes, productos.
- Credenciales de IA (GEMINI_API_KEY), claves JWT, DB.
- Endpoints: /api/auth, /api/products, /api/orders, /api/ai, /api/analytics (nuevo), /metrics.
- Frontend: rutas SPA, modales, catálogos, mapas/iframes, GA/FB scripts.

## Amenazas (STRIDE)
- Spoofing: robo de token (mitigar con httpOnly, SameSite, Secure, rotación).
- Tampering: manipulación de payloads (zod, tipos, transacciones Prisma).
- Repudiation: falta de trazas (traceId en logs/headers, logger estructurado).
- Information disclosure: XSS (DOMPurify), secrets en repo (gitleaks), CSP incompleta.
- DoS: abuse en /auth, /orders, /ai (rate-limit, body limit, captchas opcionales).
- Elevation of privilege: roles admin vía adminEmails; validar en requireAdmin.

## Controles clave
- Autenticación: JWT firmado, expiración corta; refresh rotation; MFA opcional header.
- Autorización: middleware requireAuth/requireAdmin en mutaciones y admin ops.
- Validación: zod en todas las rutas; sanitizeObject en cliente; limitar longitud de campos.
- CSRF: double submit cookie/header; SameSite=strict; secure en prod.
- CSP: script/style/connect/frame/src/img configurados; report-only → enforce.
- Storage: DB fuera del repo; backups cifrados; .env solo en vault/CI.
- Observabilidad: prom-client + traceId; alertas de error rate y latencia.

## Supuestos y riesgos residuales
- SQLite en repo (actual) debe eliminarse; riesgo de fuga hasta que se limpie y roten secretos.
- GA/FB Pixel requieren dominios en CSP; riesgo de rotura si se omiten.
- IA endpoint: riesgo de abuso sin rate-limit estricto y sin sanitizar prompts (corregir).
- Frontend StrictMode duplica efectos; asegurar idempotencia de efectos y fetch con guards.

## Plan de validación
- SAST/DAST per release; gitleaks en cada PR.
- Pentest liviano de endpoints críticos (auth/orders/ai).
- Revisiones de roles y adminEmails en despliegues.
