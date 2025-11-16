# Checklist de Seguridad

## Autenticación y Sesiones

- [ ] Contraseñas hasheadas con bcrypt (cost ≥ 12)
- [ ] JWT firmado con secret de 256+ bits
- [ ] Tokens en cookies httpOnly (NO localStorage)
- [ ] Cookies con flags: secure, sameSite=strict
- [ ] Refresh token con rotación automática
- [ ] Expiración de access token ≤ 15 minutos
- [ ] Rate limiting en login (máx 5 intentos/minuto)
- [ ] Logout invalida tokens correctamente
- [ ] No hay secretos hardcodeados en frontend
- [ ] Variables de entorno protegidas (.env en .gitignore)

## Base de Datos

- [ ] Permisos restrictivos en database.sqlite (chmod 600 o equivalente)
- [ ] Queries preparadas (sin SQL injection)
- [ ] Validación de input con Zod en todos los endpoints
- [ ] Índices en columnas frecuentes (email, product_id, user_id)
- [ ] Backup automático configurado
- [ ] Foreign keys habilitadas (PRAGMA foreign_keys = ON)
- [ ] Transacciones ACID para operaciones críticas

## API y Headers

- [ ] Helmet.js configurado correctamente
- [ ] CORS con whitelist específica (no '*')
- [ ] CSP sin unsafe-inline en producción
- [ ] HSTS habilitado (Strict-Transport-Security)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Rate limiting por IP (100 req/min)
- [ ] Rate limiting agresivo en auth endpoints

## Input Validation

- [ ] Zod schema en todos los POST/PUT/PATCH
- [ ] Sanitización de strings (trim, escape)
- [ ] Validación de tipos (email, URL, números)
- [ ] Límites de tamaño en requests (max 1MB)
- [ ] Validación de file uploads (si aplica)
- [ ] Prevención de mass assignment

## Secretos y Credenciales

- [ ] JWT_SECRET generado con openssl rand -base64 64
- [ ] JWT_REFRESH_SECRET diferente del access secret
- [ ] Secrets NO en código fuente
- [ ] Secrets cargados desde variables de entorno
- [ ] .env en .gitignore
- [ ] Documentación para regenerar secrets en producción

## Logs y Monitoreo

- [ ] Logs centralizados (no console.log en producción)
- [ ] Logs NO contienen información sensible
- [ ] Eventos de seguridad registrados (login fallido, cambio de contraseña)
- [ ] Alertas configuradas para intentos de acceso sospechosos
- [ ] Monitoreo de uso de API (detectar abuso)

## Dependencias

- [ ] npm audit sin vulnerabilidades críticas/altas
- [ ] Dependencias actualizadas (npm outdated)
- [ ] Lockfile commiteado (package-lock.json)
- [ ] Renovate o Dependabot configurado

## Deploy y Producción

- [ ] HTTPS obligatorio en producción
- [ ] NODE_ENV=production configurado
- [ ] Secrets de producción diferentes a desarrollo
- [ ] Servidor con firewall configurado
- [ ] Acceso SSH con clave pública (no password)
- [ ] Backups automáticos de DB
- [ ] Plan de respuesta ante incidentes documentado

## Notas

- **Prioridad crítica:** Autenticación, secretos, input validation
- **Herramientas recomendadas:** Snyk, OWASP ZAP, npm audit
- **Revisar cada 3 meses**
