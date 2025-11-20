# Quick Reference - Secretos Criticos

## Tabla rapida

| Variable                | Entorno          | Donde se configura             | Rotacion sugerida              | Owner              |
| ----------------------- | ---------------- | ------------------------------ | ------------------------------ | ------------------ |
| JWT_SECRET              | Backend prod     | Railway > Variables            | 90 dias                        | Security Lead      |
| JWT_REFRESH_SECRET      | Backend prod     | Railway > Variables            | 90 dias                        | Security Lead      |
| STRIPE_SECRET_KEY       | Backend prod/stg | Dashboard Stripe + Railway     | 90 dias / auditoria PCI        | Finanzas + Backend |
| STRIPE_WEBHOOK_SECRET   | Backend prod/stg | Stripe > Developers > Webhooks | Antes de cada despliegue mayor | Finanzas           |
| SUPABASE_SERVICE_ROLE   | Workers          | Supabase > Settings > API      | 180 dias                       | Data Team          |
| SUPABASE_ANON_KEY       | Frontend         | Supabase > Settings > API      | Cuando cambian scopes          | Security           |
| REDIS_URL               | Backend          | Railway/Upstash                | 180 dias                       | DevOps             |
| DATABASE_URL            | Todos            | Railway SQLite / Prisma        | Al rotar credenciales DB       | DBA                |
| EMAIL_SMTP_PASSWORD     | Backend          | Resend / SMTP provider         | 90 dias                        | Marketing          |
| BUNNYCDN_API_KEY        | Infra            | Bunny portal                   | 180 dias                       | DevOps             |
| SENTRY_DSN_BACKEND      | Backend          | Sentry project                 | 90 dias                        | DevOps             |
| SENTRY_DSN_FRONTEND     | Frontend         | Sentry project                 | 90 dias                        | DevOps             |
| WORKER_API_TOKEN        | Scripts          | Cloudflare Workers             | Segun proveedor                | Automation         |
| K6_CLOUD_TOKEN          | Testing          | Grafana Cloud                  | Cambio de QA Lead              | QA                 |
| PROMETHEUS_REMOTE_WRITE | Monitoring       | Grafana/Prometheus             | Con cada certificado           | DevOps             |

## Ubicaciones claves

- `.env` raiz: valores VITE\_\* para cliente.
- `.env.local`: copia privada, nunca se sincroniza.
- `backend/.env`: requerido para API.
- `backend/.env.example`: plantilla oficial.
- GitHub Actions > Environments > production/staging.
- Railway: variables por servicio.
- Netlify: variables VITE\_.

## Flujos mas comunes

### Agregar secreto backend

1. Crear ticket SECURITY-SECRETS.
2. Generar valor con openssl o dashboard proveedor.
3. Guardar en 1Password / Pureza Naturalis / Backend.
4. Actualizar backend/.env.example con placeholder.
5. Ajustar docs/SECRETS_MANAGEMENT.md inventario.
6. Configurar Railway/CI segun necesidad.
7. Confirmar con npm run audit:secret-history que no quedo registro.

### Agregar variable publica

1. Validar que puede exponerse.
2. Agregar a `.env` con prefijo VITE\_.
3. Actualizar src/vite-env.d.ts.
4. Documentar en este archivo (Tabla rapida > Frontend Publico).
5. Comunicar en #frontend-alerts.

### Rotar secreto comprometido

1. Revocar inmediatamente en proveedor.
2. Generar nuevo valor.
3. Actualizar entornos (Railway, GitHub, Netlify).
4. Ejecutar gitleaks y audit:secret-history.
5. Documentar incidente en reports/execution-YYYY-MM-DD.
6. Completar runbook en docs/SECRETS_MANAGEMENT.md.

## Comandos utiles

```bash
# Escaneo rapido
npm run scan:secrets

# Historial completo
npm run scan:secrets:history

# Auditoria de ruta especifica
gitleaks detect --no-git --source backend

# Rotar secretos en Railway
railway variables set JWT_SECRET="$(openssl rand -base64 64)"
```

## Contactos

- Security Lead: security@purezanaturalis.com
- DevOps On-call: devops@purezanaturalis.com
- Soporte de pagos: billing@purezanaturalis.com

## SLA

| Evento                   | Tiempo objetivo |
| ------------------------ | --------------- |
| Confirmar leak           | < 15 min        |
| Rotar secreto            | < 60 min        |
| Actualizar documentacion | < 24 h          |
| Completar postmortem     | < 72 h          |
