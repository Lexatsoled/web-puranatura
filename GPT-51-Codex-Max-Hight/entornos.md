# Matriz de Entornos y Configuración

## Variables por entorno (ejemplo)
- NODE_ENV: development | staging | production
- PORT: 3001 (staging/prod puede diferir)
- ALLOWED_ORIGINS: lista explícita por entorno
- JWT_SECRET / JWT_REFRESH_SECRET: únicos por env; rotación trimestral
- JWT_EXPIRES_IN: 15m; JWT_REFRESH_EXPIRES_IN: 7d
- DATABASE_URL: sqlite (dev), postgres (stage/prod)
- GEMINI_API_KEY: solo en stage/prod, nunca en repo
- ADMIN_EMAILS: lista minificada
- MFA_STATIC_CODE: solo para QA; ausente en prod

## Paridad
- Infra como código (Terraform/Ansible opcional) para reproducir stage=prod (salvo escala).
- Seeds controladas: datos sintéticos en stage; sin PII.
- Feature flags: habilitar en dev/stage antes de prod.

## Configuración por ambiente
- Dev: tracing 100%, logs verbose, rate-limit relajado, CSP report-only.
- Stage: CSP enforce, rate-limit real, seeds sintéticos, backups de prueba.
- Prod: CSP enforce, rate-limit estricto, sampling trazas 1-5%, backups diarios cifrados.

## Provisionamiento rápido
- `npm install` (root + backend) usando lockfiles.
- `npm run build` + `npm --prefix backend run build`.
- `npm run dev` (frontend) con proxy a backend.
- `npm --prefix backend run dev` (si se agrega script nodemon).

## Gestión de secretos
- GitHub Actions secrets/variables; vault opcional.
- `.env.example` actualizado; no .env en repo.
- Rotación documentada en runbook DR.
