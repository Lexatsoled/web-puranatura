# Configuración de Variables de Entorno

**Fecha de Actualización**: 08 de diciembre de 2025  
**Estado**: ✅ Documentado para Fase 5 (Preparación Futura)

---

## Introducción

Este documento centraliza todas las variables de entorno críticas del proyecto PuraNatura. Las variables están organizadas por contexto (desarrollo, testing, producción) y por componente (backend, frontend, infraestructura).

---

## Variables de Backend (Críticas)

### Base de Datos

| Variable               | Dev                    | Prod                               | Tipo    | Descripción                                  |
| ---------------------- | ---------------------- | ---------------------------------- | ------- | -------------------------------------------- |
| `DATABASE_URL`         | `file:./prisma/dev.db` | `postgresql://...` o `mysql://...` | string  | Conexión Prisma (SQLite → upgrade futuro)    |
| `DATABASE_BACKUP_PATH` | `./backups/db.backup`  | `/var/backups/`                    | string  | Ruta de backups automáticos                  |
| `WAL_MODE`             | `true`                 | `true`                             | boolean | Write-Ahead Logging para SQLite (producción) |

**Notas Importantes**:

- SQLite es suficiente para MVP/producción inicial
- Para escalado futuro: considerar PostgreSQL/MySQL
- Backups diarios automáticos en `backups/` (git-ignored)
- WAL mode aumenta concurrencia en SQLite

---

### Autenticación y Seguridad

| Variable             | Dev                               | Prod                 | Tipo   | Descripción                          |
| -------------------- | --------------------------------- | -------------------- | ------ | ------------------------------------ |
| `JWT_SECRET`         | (en `Secretos/backend.env.local`) | (en secrets manager) | string | Secret para firmar JWT access tokens |
| `JWT_REFRESH`        | (en `Secretos/backend.env.local`) | (en secrets manager) | string | Secret para refresh tokens           |
| `JWT_EXPIRY`         | `3600`                            | `3600`               | number | Expiración access token (segundos)   |
| `JWT_REFRESH_EXPIRY` | `86400`                           | `86400`              | number | Expiración refresh token (segundos)  |

**Notas Importantes**:

- **NUNCA** commitear secretos en git
- Usar `Secretos/backend.env.local` en dev (git-ignored)
- En producción: usar GitHub Secrets o external secrets manager
- Rotar secrets cada 90 días (producción)
- Génesis de secrets: generar con `openssl rand -hex 32`

---

### Servidor y Red

| Variable          | Dev                     | Prod                     | Tipo   | Descripción                                 |
| ----------------- | ----------------------- | ------------------------ | ------ | ------------------------------------------- |
| `PORT`            | `3001`                  | `3001` o `8080`          | number | Puerto backend                              |
| `HOST`            | `localhost`             | `0.0.0.0`                | string | Host de escucha                             |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | `https://puranatura.com` | string | CORS origins (comma-separated)              |
| `NODE_ENV`        | `development`           | `production`             | string | Ambiente de ejecución                       |
| `LOG_LEVEL`       | `debug`                 | `info`                   | string | Nivel de logging (debug, info, warn, error) |

**Notas Importantes**:

- En producción: `NODE_ENV=production` activa compresión, caching headers, etc.
- `ALLOWED_ORIGINS` debe ser específico (no `*`)
- Soportar múltiples origins: `https://puranatura.com,https://api.puranatura.com`
- `HOST=0.0.0.0` es necesario en contenedores (no localhost)

---

### Seguridad HTTP

| Variable                  | Dev     | Prod       | Tipo    | Descripción                     |
| ------------------------- | ------- | ---------- | ------- | ------------------------------- |
| `SECURE_COOKIES`          | `false` | `true`     | boolean | Activar Secure flag en cookies  |
| `CSP_REPORT_ONLY`         | `true`  | `false`    | boolean | CSP en modo report (no enforce) |
| `HSTS_ENABLED`            | `false` | `true`     | boolean | Activar header HSTS             |
| `HSTS_MAX_AGE`            | —       | `31536000` | number  | HSTS max-age (segundos = 1 año) |
| `HSTS_INCLUDE_SUBDOMAINS` | —       | `true`     | boolean | HSTS para subdomains            |
| `HSTS_PRELOAD`            | —       | `true`     | boolean | Incluir en HSTS preload list    |

**Notas Importantes**:

- `CSP_REPORT_ONLY=true` en dev permite testing sin bloquear recursos
- `CSP_REPORT_ONLY=false` en prod enforza CSP (requiere testing exhaustivo)
- `HSTS_PRELOAD=true` requiere que dominio esté en lista oficial (preload.hstspreload.org)
- HSTS no se puede desactivar una vez activado (cuidado con periodo de gracia)

**Headers Asociados** (enviados automáticamente):

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' ...; style-src 'self' 'unsafe-inline' ...; img-src 'self' data: https:; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

### Rate Limiting y Protección

| Variable                  | Dev     | Prod    | Tipo    | Descripción                     |
| ------------------------- | ------- | ------- | ------- | ------------------------------- |
| `RATE_LIMIT_ENABLED`      | `false` | `true`  | boolean | Activar rate limiting           |
| `RATE_LIMIT_WINDOW`       | —       | `60000` | number  | Ventana rate limit (ms = 1 min) |
| `RATE_LIMIT_MAX_REQUESTS` | —       | `100`   | number  | Max requests en ventana         |
| `RATE_LIMIT_KEY_PREFIX`   | —       | `rl:`   | string  | Prefijo keys Redis (si aplica)  |

**Notas Importantes**:

- Dev: disabled para facilitar testing
- Prod: 100 req/min por IP es conservador (ajustar según uso real)
- Implementado con `express-rate-limit` + memory store (o Redis)

---

### Circuit Breaker

| Variable                | Dev     | Prod    | Tipo    | Descripción                       |
| ----------------------- | ------- | ------- | ------- | --------------------------------- |
| `BREAKER_ENABLED`       | `true`  | `true`  | boolean | Activar circuit breaker           |
| `BREAKER_THRESHOLD`     | `10`    | `10`    | number  | Fallos antes de abrir circuito    |
| `BREAKER_TIMEOUT`       | `60000` | `60000` | number  | Timeout en ms (1 min)             |
| `BREAKER_RESET_TIMEOUT` | `30000` | `30000` | number  | Tiempo reset a half-open (30 seg) |
| `BREAKER_FAILURE_RATE`  | `0.5`   | `0.5`   | number  | Tasa fallo para abrir (50%)       |

**Notas Importantes**:

- Protege backend contra cascadas de errores (ej: BD no disponible)
- `BREAKER_TIMEOUT`: después de este tiempo → intenta half-open
- Monitorear `BREAKER_OPEN_EVENT` en logs para detectar problemas

---

### Observabilidad y Métricas

| Variable          | Dev        | Prod       | Tipo    | Descripción                          |
| ----------------- | ---------- | ---------- | ------- | ------------------------------------ |
| `METRICS_ENABLED` | `false`    | `true`     | boolean | Activar endpoint `/metrics`          |
| `METRICS_PATH`    | `/metrics` | `/metrics` | string  | Path endpoint Prometheus             |
| `METRICS_PORT`    | —          | `9090`     | number  | Puerto métricas (opcional, separado) |
| `TRACES_ENABLED`  | `false`    | `false`    | boolean | Activar distributed tracing (futuro) |

**Notas Importantes**:

- `/metrics` debe estar protegido (no público)
- Endpoint retorna métricas en formato Prometheus
- En prod: proteger con IP whitelist o autenticación básica
- Futuro: integrar con Datadog, Prometheus, ELK

---

## Variables de Frontend (Críticas)

### API y Conectividad

| Variable           | Dev                     | Prod                         | Tipo   | Descripción             |
| ------------------ | ----------------------- | ---------------------------- | ------ | ----------------------- |
| `VITE_API_URL`     | `http://localhost:3001` | `https://api.puranatura.com` | string | URL base API backend    |
| `VITE_API_TIMEOUT` | `5000`                  | `5000`                       | number | Timeout peticiones (ms) |

**Notas Importantes**:

- Prefijo `VITE_` es requerido por Vite para exponer a cliente
- En producción: **SIEMPRE** usar HTTPS
- CORS debe estar configurado en backend para este origin

---

### Analytics y Tracking

| Variable                     | Dev         | Prod           | Tipo    | Descripción                               |
| ---------------------------- | ----------- | -------------- | ------- | ----------------------------------------- |
| `VITE_GA_ID`                 | (optional)  | `G-XXXXXXXXXX` | string  | Google Analytics ID (si aplica)           |
| `VITE_ANALYTICS_ENABLED`     | `false`     | `true`         | boolean | Habilitar analytics                       |
| `VITE_CSP_NONCE_PLACEHOLDER` | `{{nonce}}` | `{{nonce}}`    | string  | Placeholder nonce CSP (backend reemplaza) |

**Notas Importantes**:

- CSP nonce previene inyección de scripts no autorizados
- Analytics se deshabilita en dev para no contaminar datos
- GDPR: mostrar cookie consent antes de enviar datos

---

### Feature Flags

| Variable                | Dev    | Prod   | Tipo    | Descripción             |
| ----------------------- | ------ | ------ | ------- | ----------------------- |
| `VITE_FEATURE_COMPARE`  | `true` | `true` | boolean | Comparador de productos |
| `VITE_FEATURE_REVIEWS`  | `true` | `true` | boolean | Reviews de clientes     |
| `VITE_FEATURE_WISHLIST` | `true` | `true` | boolean | Lista de deseos         |
| `VITE_FEATURE_CART`     | `true` | `true` | boolean | Carrito de compras      |

**Notas Importantes**:

- Permiten activar/desactivar features sin recompilación
- Útiles para A/B testing y rollout gradual
- Cambios requieren rebuild de frontend

---

## Configuración por Ambiente

### Desarrollo

```bash
# Backend (.env.local, git-ignored)
NODE_ENV=development
PORT=3001
HOST=localhost
ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=dev-secret-do-not-use-in-prod
JWT_REFRESH=dev-refresh-secret
CSP_REPORT_ONLY=true
SECURE_COOKIES=false
RATE_LIMIT_ENABLED=false
BREAKER_ENABLED=true
METRICS_ENABLED=false
LOG_LEVEL=debug

# Frontend (.env.local, git-ignored)
VITE_API_URL=http://localhost:3001
VITE_ANALYTICS_ENABLED=false
VITE_FEATURE_COMPARE=true
VITE_FEATURE_REVIEWS=true
VITE_FEATURE_WISHLIST=true
VITE_FEATURE_CART=true
```

### Testing / CI

```bash
# Backend
NODE_ENV=test
DATABASE_URL=file:./prisma/test.db  # Separada de dev
SECURE_COOKIES=false
CSP_REPORT_ONLY=true
RATE_LIMIT_ENABLED=false
METRICS_ENABLED=false
LOG_LEVEL=warn  # Menos ruido en CI
```

### Producción

```bash
# Backend (en GitHub Secrets)
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
ALLOWED_ORIGINS=https://puranatura.com,https://www.puranatura.com
DATABASE_URL=file:./prisma/prod.db  # O PostgreSQL/MySQL
JWT_SECRET=<64-char-random-from-secrets-manager>
JWT_REFRESH=<64-char-random-from-secrets-manager>
CSP_REPORT_ONLY=false
SECURE_COOKIES=true
HSTS_ENABLED=true
HSTS_PRELOAD=true
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100
BREAKER_ENABLED=true
METRICS_ENABLED=true
LOG_LEVEL=info

# Frontend
VITE_API_URL=https://api.puranatura.com
VITE_ANALYTICS_ENABLED=true
VITE_GA_ID=G-XXXXXXXXXX
VITE_FEATURE_COMPARE=true
VITE_FEATURE_REVIEWS=true
VITE_FEATURE_WISHLIST=true
VITE_FEATURE_CART=true
```

---

## Cómo Cargar Variables de Entorno

### Desarrollo Local

1. **Crear archivo** `.env.local` en raíz del proyecto (git-ignored)
2. **Crear archivo** `backend/.env.local` para backend (git-ignored)
3. **O crear archivo** `Secretos/backend.env.local` (git-ignored)

```bash
# .env.local (frontend)
VITE_API_URL=http://localhost:3001
VITE_ANALYTICS_ENABLED=false

# backend/.env.local o Secretos/backend.env.local
NODE_ENV=development
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=dev-secret-do-not-use
```

### CI/CD (GitHub Actions)

Variables se almacenan en **Settings → Secrets and variables → Repository secrets**.

En workflow:

```yaml
env:
  NODE_ENV: production
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  JWT_REFRESH: ${{ secrets.JWT_REFRESH }}
  ALLOWED_ORIGINS: https://puranatura.com
```

### Contenedor (Docker, futuro)

Pasar variables en `docker run`:

```bash
docker run \
  -e PORT=3001 \
  -e DATABASE_URL=file:./db.sqlite \
  -e JWT_SECRET=$JWT_SECRET \
  -e ALLOWED_ORIGINS=https://example.com \
  puranatura-app
```

O en `docker-compose.yml`:

```yaml
services:
  app:
    environment:
      - PORT=3001
      - DATABASE_URL=file:./db.sqlite
      - JWT_SECRET=${JWT_SECRET}
```

---

## Validación y Testing

### Script de Validación (npm run check:env)

Verificar que variables críticas existen antes de iniciar:

```javascript
// scripts/validate-env.cjs
const requiredEnv = {
  development: ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH'],
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH',
    'ALLOWED_ORIGINS',
    'SECURE_COOKIES',
  ],
};

const missing =
  requiredEnv[process.env.NODE_ENV]?.filter((key) => !process.env[key]) || [];

if (missing.length > 0) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  process.exit(1);
}
```

**Ejecutar antes de iniciar**:

```bash
npm run check:env && npm start
```

---

## Seguridad: Checklist

- [ ] **Nunca** commitear `.env*` o `Secretos/*`
- [ ] Usar `.gitignore`: `.env*.local`, `Secretos/`, `backups/`
- [ ] Secretos en GitHub Secrets (no en código)
- [ ] Rotación de secrets cada 90 días (prod)
- [ ] Auditar accesos a secrets en logs (GitHub)
- [ ] CSP configurado sin `unsafe-inline` (prod)
- [ ] HTTPS obligatorio en prod (HSTS preload)
- [ ] Rate limiting habilitado en prod
- [ ] Cookies con Secure + SameSite=Strict flags
- [ ] Logs no contienen secretos (sanitizar antes de escribir)

---

## Migración de Ambientes

### De Desarrollo a Staging

1. Copiar variables de `.env.local` → GitHub Secrets
2. Cambiar `VITE_API_URL` → staging API URL
3. Cambiar `ALLOWED_ORIGINS` → staging domain
4. Ejecutar CI/CD para verificar

### De Staging a Producción

1. Verificar todas las variables en prod secrets
2. Cambiar `CSP_REPORT_ONLY=false` (enforce CSP)
3. Activar `SECURE_COOKIES=true`
4. Activar `HSTS_PRELOAD=true`
5. Ejecutar security scan antes de deploy
6. Monitorear logs post-deploy (primeras 24h)

---

## Referencia Rápida

| Acción                   | Comando                                                     |
| ------------------------ | ----------------------------------------------------------- |
| Ver variables (dev)      | `npm run env` (si existe) o `set` (Windows) / `env` (Linux) |
| Validar variables        | `npm run check:env`                                         |
| Limpiar secretos de logs | `npm run sanitize-logs`                                     |
| Generar nuevo JWT_SECRET | `openssl rand -hex 32`                                      |
| Test env vars en CI      | Ver `npm run test:ci` output                                |

---

## Notas Finales

- **Principio de Mínimo Privilegio**: cada componente solo accede a sus variables
- **Rotación**: secretos cada 90 días en producción
- **Auditoría**: loguear accesos a endpoints sensibles (ej: `/metrics`)
- **Backup**: mantener copia segura de secrets para disaster recovery
- **Documentación**: actualizar este archivo cuando añadas nuevas variables

---

**Última Actualización**: 08 de diciembre de 2025  
**Próxima Revisión**: 08 de marzo de 2026 (Q1 2026)
