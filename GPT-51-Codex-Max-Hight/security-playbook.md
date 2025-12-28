# Security Playbook (defensa en profundidad)

## Principios
- Least privilege, deny-by-default, zero trust entre capas.
- No secretos en repo; rotación periódica; observabilidad sin PII.
- Validar entrada (zod), sanitizar salida (escape/DOMPurify), limitar superficie (CORS, CSP, rate-limit).

## Controles por capa
- Red/Edge: CSP completa (script/style/connect/frame/src/img), HSTS, X-Frame-Options DENY, Referrer-Policy no-referrer, X-Content-Type-Options nosniff.
- AuthN/AuthZ: JWT cookies httpOnly Secure SameSite=strict; refresh rotation; MFA; adminEmails lista blanca; lockout.
- CSRF: cookie + header (double submit), cookies secure; excluir GET/HEAD/OPTIONS.
- Inputs: zod en todas las rutas (auth/products/orders/ai/analytics); tipos estrictos.
- Salida: JSON escape; DOMPurify en cliente para HTML; sin render sin sanitizar.
- Rate limiting: auth/orders/ai/analytics dedicados; global limiter.
- Secrets: .env.example solo placeholders; usar vault/gh-secrets; GEMINI_API_KEY no se loguea; claves rotadas trimestral; zeroization ante fuga.
- Dependencias: SBOM CycloneDX; `npm audit --production --audit-level=high`; overrides documentados; política de licencias (allowlist).
- SAST/DAST: eslint-plugin-security, trivy fs, zap-baseline; gitleaks en pre-commit y CI; fuzzing ligero en endpoints críticos.
- Logs: estructurados, niveles, sin datos sensibles; traceId en todas las respuestas; scrub de tokens/PII; truncar payloads grandes.
- Storage: DB cifrable (migrar a Postgres en prod), backups cifrados, RPO 24h, RTO 2h; firma/attestation de artefactos (cosign opcional).

## Checklist rápida (por PR)
- [ ] No secretos/DB en repo; env en vault/CI.
- [ ] Rutas nuevas con zod + authz + rate-limit si mutan estado.
- [ ] CSP y CORS revisados tras cambios de terceros (GA/FB/Maps).
- [ ] Logs sin PII ni claves; traceId presente.
- [ ] Tests de seguridad ejecutados (`npm run scan:security`).
- [ ] OpenAPI actualizado con codigos de error y rate-limit headers.
- [ ] SBOM generado; licencias en allowlist; overrides documentados.

## Parches inmediatos (hallazgos actuales)
- SEC-SECRET-001: remover .env/.sqlite del repo, rotar claves, reforzar .gitignore.
- SEC-AI-002: eliminar logging de GEMINI_API_KEY; validar tamaño de prompt; timeout 10s; rate-limit /api/ai.
- SEC-CSP-003: CSP explícita con dominios de analytics/iframes permitidos.
- Analytics 404: implementar /api/analytics/events con validación y rate-limit.
