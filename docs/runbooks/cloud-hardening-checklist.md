# Checklist de Hardening para Nube (Fase 5 / Futuro)

**Fecha de Creación**: 08 de diciembre de 2025  
**Estado**: 📋 Borrador para Fase 5+ | Implementación Futura  
**Aplica a**: Despliegues en cloud (AWS, Azure, GCP) post-MVP

---

## Introducción

Este checklist proporciona una guía paso a paso para endurecer (harden) la aplicación PuraNatura cuando se despliegue a la nube. Cubre seguridad de infraestructura, red, aplicación y operaciones.

**Nota**: Este documento es un borrador. No ejecutar en producción sin revisión de expertos en seguridad.

---

## Fases de Implementación

### Fase 1: Pre-Despliegue (2 semanas antes)

- [ ] Audit de seguridad integral (OWASP Top 10)
- [ ] Penetration testing (contratación externa recomendada)
- [ ] Evaluación de cumplimiento (GDPR, RGPD si aplica)
- [ ] Backup strategy probado
- [ ] Disaster recovery plan documentado
- [ ] Incident response plan documentado

### Fase 2: Infraestructura (1 semana antes)

- [ ] Provisionamiento cloud (VPC, subnets, security groups)
- [ ] Certificado SSL/TLS válido (Let's Encrypt o CA comercial)
- [ ] Load balancer configurado con HTTPS
- [ ] WAF (Web Application Firewall) habilitado
- [ ] DDoS protection (AWS Shield, Azure DDoS Protection)

### Fase 3: Red y Firewall (Día antes)

- [ ] Firewall inbound: permitir solo puertos 80, 443, 22 (SSH admin)
- [ ] Firewall outbound: denegar todo excepto dominios necesarios
- [ ] VPC security groups: restrict por servicio (app, DB, cache)
- [ ] Rate limiting en load balancer
- [ ] Geo-blocking (si aplica, ej: bloquear ciertas regiones)

### Fase 4: Aplicación (Día antes)

- [ ] HTTPS obligatorio (redirect HTTP → HTTPS)
- [ ] HSTS header habilitado (incluyendo preload)
- [ ] CSP configurado en modo enforce (no report-only)
- [ ] Cookies con Secure flag
- [ ] SameSite=Strict en cookies sensibles
- [ ] CORS configurado específicamente (no `*`)
- [ ] X-Frame-Options=DENY (anti-clickjacking)
- [ ] X-Content-Type-Options=nosniff
- [ ] Referrer-Policy=strict-origin-when-cross-origin
- [ ] Permissions-Policy restrictive

### Fase 5: Base de Datos (Día antes)

- [ ] Backup automático configurado (diario, retenido 30 días)
- [ ] Point-in-time recovery probado
- [ ] Conexión DB solo desde app server (no internet)
- [ ] Credenciales BD en secrets manager (no en código)
- [ ] Encriptación en reposo habilitada
- [ ] Encriptación en tránsito (SSL/TLS) habilitada
- [ ] Audit logging para operaciones sensibles

### Fase 6: Monitoreo y Logging (Día antes)

- [ ] Centralized logging (CloudWatch, Azure Monitor, ELK)
- [ ] Alertas configuradas (CPU >80%, error rate >1%, latency p95 >2s)
- [ ] Log retention configurado (mínimo 30 días, máximo 1 año)
- [ ] Logs sanitizados (sin passwords, tokens, PII)
- [ ] Error tracking (Sentry, DataDog, Rollbar)
- [ ] Distributed tracing (OpenTelemetry, Jaeger)
- [ ] Uptime monitoring (status page)

### Fase 7: Despliegue (Día 0)

- [ ] Rollout gradual (blue-green deployment)
- [ ] Monitoreo activo durante primeras 24 horas
- [ ] Runbook de rollback listo
- [ ] Equipo on-call disponible
- [ ] Comunicación a stakeholders

### Fase 8: Post-Despliegue (Primeras 24 horas)

- [ ] Validar HTTPS en todos los endpoints
- [ ] Probar redirects HTTP → HTTPS
- [ ] Verificar headers de seguridad con `curl -I`
- [ ] Ejecutar security scanner (ZAP, Burp Community)
- [ ] Probar cada feature crítica en producción
- [ ] Monitorear logs de error y performance
- [ ] Validar backups se crean correctamente

---

## Seguridad de Red

### Firewall Inbound Rules

```
Rule 1: HTTP (puerto 80) desde anywhere
  - Acción: Permitir (solo para redirect a HTTPS)

Rule 2: HTTPS (puerto 443) desde anywhere
  - Acción: Permitir (tráfico normal)

Rule 3: SSH (puerto 22) desde admin IPs
  - Acción: Permitir (solo admins)
  - Fuentes: IP whitelist (ej: 192.168.1.0/24)

Rule 4: Todo lo demás
  - Acción: Denegar
```

**Comandos AWS Example**:

```bash
# Crear security group
aws ec2 create-security-group \
  --group-name puranatura-app \
  --description "PuraNatura app security group"

# Allow HTTP redirect
aws ec2 authorize-security-group-ingress \
  --group-name puranatura-app \
  --protocol tcp --port 80 --cidr 0.0.0.0/0

# Allow HTTPS
aws ec2 authorize-security-group-ingress \
  --group-name puranatura-app \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# Allow SSH (solo desde admin IP)
aws ec2 authorize-security-group-ingress \
  --group-name puranatura-app \
  --protocol tcp --port 22 --cidr 203.0.113.0/24
```

### Firewall Outbound Rules

```
Rule 1: DNS (puerto 53) a 8.8.8.8, 8.8.4.4 (Google DNS)
  - Acción: Permitir

Rule 2: HTTPS (puerto 443) a dominios autorizados
  - Dominios: npm registry, GitHub, API partners, CDN
  - Acción: Permitir

Rule 3: PostgreSQL (puerto 5432) a DB subnet
  - Acción: Permitir (si DB externa)

Rule 4: Redis (puerto 6379) a cache subnet
  - Acción: Permitir (si cache externa)

Rule 5: Todo lo demás
  - Acción: Denegar
```

### WAF (Web Application Firewall)

```
Rule Group 1: AWS Managed Rules - Core Rule Set (OWASP Top 10)
  - Bloquea inyección SQL, XSS, CSRF, etc.

Rule Group 2: Rate Limiting (por IP)
  - 2000 requests / 5 minutos
  - Acción: Block

Rule Group 3: Geo-Blocking (si aplica)
  - Bloquear países de alto riesgo
  - Acción: Block

Rule Group 4: Bot Control (opcional)
  - Detectar y bloquear bots maliciosos
  - Acción: Block
```

---

## Seguridad de Aplicación

### HTTPS y TLS

- [ ] Certificado SSL/TLS válido (no auto-signed en prod)
- [ ] Certificado renovado automáticamente (Let's Encrypt)
- [ ] TLS 1.2 mínimo (preferentemente 1.3)
- [ ] Ciphers fuertes (desactivar ciphers débiles)
- [ ] Perfect Forward Secrecy habilitado

**Verificación TLS**:

```bash
# Listar ciphers permitidos
openssl s_client -connect api.puranatura.com:443 -tls1_2

# Validar certificado
openssl x509 -in cert.pem -text -noout

# Test A grade
# https://www.ssllabs.com/ssltest/analyze.html?d=api.puranatura.com
```

### Headers de Seguridad HTTP

- [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  - Fuerza HTTPS por 1 año
  - Incluir en preload list: https://hstspreload.org/

- [ ] `Content-Security-Policy: ...` (enforce mode)
  - Bloquea inyección de scripts
  - No usar `unsafe-inline`, `unsafe-eval`

- [ ] `X-Frame-Options: DENY`
  - Previene clickjacking

- [ ] `X-Content-Type-Options: nosniff`
  - Previene MIME sniffing

- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
  - Limita información de referrer

- [ ] `Permissions-Policy: geolocation=(), microphone=(), camera=()`
  - Deshabilita permisos de browser

- [ ] `X-XSS-Protection: 1; mode=block` (Legacy, para IE10)

**Verificar headers**:

```bash
curl -I https://api.puranatura.com

# Expected output:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Content-Security-Policy: ...
# X-Frame-Options: DENY
# etc.
```

### Cookies

```javascript
// Backend (Express)
app.use(
  session({
    secure: true, // HTTPS only
    httpOnly: true, // No JS access
    sameSite: 'strict', // Strict SameSite
    maxAge: 3600000, // 1 hora
    domain: 'puranatura.com',
  })
);
```

### CORS

```javascript
// Backend (Express)
const allowedOrigins = [
  'https://puranatura.com',
  'https://www.puranatura.com',
  'https://admin.puranatura.com', // Si aplica
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

---

## Seguridad de Base de Datos

### Backup Strategy

```bash
# Backup automático (diario a las 2 AM UTC)
0 2 * * * /usr/local/bin/backup-db.sh

# Retención: 30 días
# Ubicación: S3 bucket con versioning
# Encriptación: KMS key

# Test restore mensual
15 3 1 * * /usr/local/bin/test-restore.sh
```

### Encriptación

- [ ] Encriptación en reposo (EBS, RDS con KMS)
- [ ] Encriptación en tránsito (SSL/TLS entre app y BD)
- [ ] Encriptación de datos sensibles en BD (passwords con bcrypt, PII con AES-256)

### Acceso a BD

- [ ] Conexión solo desde app server (security group)
- [ ] Credenciales BD en AWS Secrets Manager (rotadas automáticamente)
- [ ] Audit logging para `SELECT`, `INSERT`, `UPDATE`, `DELETE` en tablas sensibles
- [ ] No permitir conexiones remotas a BD (solo VPC privada)

---

## Monitoreo y Observabilidad

### Logging Centralizado

```yaml
# CloudWatch / Azure Monitor / ELK
Log Groups:
  - /puranatura/app/errors
  - /puranatura/app/access
  - /puranatura/db/audit
  - /puranatura/auth/attempts

Retention: 30 días (errores), 1 año (audit)
Sanitization: Remover password, token, PII patterns
```

### Alertas Críticas

| Métrica                | Umbral   | Acción                     |
| ---------------------- | -------- | -------------------------- |
| CPU                    | > 80%    | Escalar horizontalmente    |
| Memory                 | > 85%    | Verificar memory leaks     |
| Error Rate             | > 1%     | Page on-call               |
| Latency p95            | > 2s     | Investigar DB/API lento    |
| Auth Failures          | > 10/min | Posible ataque brute-force |
| SQL Injection Attempts | > 1/min  | WAF bloqueando, verificar  |
| Disk Space             | < 10%    | Limpiar logs, expandir     |

### Monitoreo de Seguridad

```javascript
// Eventos a loguear
- Login/logout exitosos
- Failed login attempts
- Privileged operations (admin access)
- Config changes
- API rate limit exceeded
- WAF block events
- Certificate expiry warnings
- Backup completion/failure
```

### Dashboards

```
Dashboard 1: Overview
  - Error rate (últimas 24h)
  - Latency p50, p95, p99
  - Requests/sec
  - CPU, Memory usage
  - Active users

Dashboard 2: Security
  - Failed login attempts
  - Rate limit blocks
  - WAF blocks by rule
  - Certificate expiry countdown
  - Backup status

Dashboard 3: Business
  - Orders/day
  - Revenue
  - User signups
  - Feature usage
```

---

## Incident Response

### Escalation Plan

```
Nivel 1 (Alert)
- Automatic alert sent
- On-call engineer paged

Nivel 2 (SEV 2 - Issue)
- Response SLA: 15 minutes
- Senior engineer alerted

Nivel 3 (SEV 1 - Outage)
- Response SLA: 5 minutes
- Engineering manager, on-call lead, CTO alerted
- War room conference call
```

### Runbooks

- [ ] Incident Response Runbook
- [ ] Rollback Runbook (si necesario)
- [ ] Database Failure Runbook
- [ ] DDoS Attack Runbook
- [ ] Data Breach Runbook

**Ejemplo: Database Failure**:

```markdown
# Database Failure Runbook

## Detection

- Alert: DB connection failed
- Metrics: Query latency spike, error rate > 5%

## Immediate Actions (0-5 min)

1. Confirm DB is down: `ping db.internal`
2. Check AWS RDS console for instance status
3. Page on-call DBA

## Mitigation (5-15 min)

1. If reboot helps: Perform RDS reboot
2. If disk full: Expand volume
3. If connection limit: Restart DB
4. If corruption: Initiate restore from backup

## Escalation

- If not resolved in 15 min: Page CTO
- Initiate incident bridge: #incident-response Slack channel

## Post-Mortem

- Document timeline and root cause
- Create preventive measures
```

---

## Compliance y Audit

### GDPR / Cumplimiento Data Privacy

- [ ] Privacy Policy actualizada
- [ ] Cookie Consent banner implementado
- [ ] Data Processing Agreement (DPA) con proveedores
- [ ] Derecho al olvido (delete personal data)
- [ ] Data portability (export datos en CSV/JSON)
- [ ] Incident notification process (72 horas)

### Auditoría de Seguridad

- [ ] Auditoría trimestral de accesos
- [ ] Renovación de credenciales cada 90 días
- [ ] Penetration testing anual
- [ ] Code review de cambios críticos
- [ ] Dependency scanning (npm audit, snyk)

### Compliance Checklist

- [ ] PCI DSS (si procesa pagos con tarjeta)
- [ ] SOC 2 Type II (si SaaS)
- [ ] ISO 27001 (si empresa crecida)
- [ ] HIPAA (si datos de salud)
- [ ] CCPA (si usuarios California)

---

## Kubernetes (Futuro, si aplica)

Si se migra a Kubernetes:

- [ ] Network policies (deny all by default)
- [ ] RBAC (Role-Based Access Control)
- [ ] Pod security policies
- [ ] Secrets management (Sealed Secrets o Vault)
- [ ] Image scanning (Trivy, Anchore)
- [ ] Admission controllers (OPA/Gatekeeper)
- [ ] API rate limiting
- [ ] Resource limits y requests

---

## Checklist Final Pre-Producción

```
SECURITY
- [ ] OWASP Top 10 audit completado
- [ ] Penetration testing completado
- [ ] Secrets rotation policy documentada
- [ ] Incident response runbooks escritos

INFRASTRUCTURE
- [ ] TLS certificate válido y renovable
- [ ] WAF habilitado
- [ ] DDoS protection habilitado
- [ ] VPC + security groups configurados

NETWORK
- [ ] Firewall inbound/outbound configurado
- [ ] HTTPS redirect (HTTP → HTTPS)
- [ ] Rate limiting habilitado

APPLICATION
- [ ] HSTS header habilitado y preload registrado
- [ ] CSP en modo enforce
- [ ] CORS específicamente configurado
- [ ] Security headers enviados

DATABASE
- [ ] Backup automático configurado
- [ ] Encriptación en reposo y tránsito
- [ ] Audit logging habilitado
- [ ] Acceso solo desde app server

MONITORING
- [ ] Logging centralizado activo
- [ ] Alertas críticas configuradas
- [ ] Dashboards de seguridad creados
- [ ] Error tracking integrado

COMPLIANCE
- [ ] Privacy policy updated
- [ ] Cookie consent implementado
- [ ] Audit trail configured
- [ ] Incident notification plan ready

TESTING
- [ ] Security headers verified con curl
- [ ] SSL Labs A grade
- [ ] Security scanner (ZAP) ejecutado
- [ ] Load testing completado
- [ ] Disaster recovery probado

RUNBOOKS
- [ ] Incident response runbook
- [ ] Database failure runbook
- [ ] Rollback runbook
- [ ] DDoS mitigation runbook
```

---

## Referencias

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/cis-controls/)
- [AWS Security Best Practices](https://docs.aws.amazon.com/security/)
- [Azure Security Best Practices](https://docs.microsoft.com/en-us/azure/security/fundamentals/)
- [GCP Security Best Practices](https://cloud.google.com/security/best-practices)

---

**Última Actualización**: 08 de diciembre de 2025  
**Próxima Revisión**: Antes de cualquier despliegue a producción

⚠️ **Aviso Legal**: Este checklist es un borrador. Antes de desplegar a producción, realizar auditoría de seguridad formal con profesionales especializados.
