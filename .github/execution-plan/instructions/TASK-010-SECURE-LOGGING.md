# TASK-010: Logging Seguro sin PII

**PRIORIDAD:** ALTA  
**FASE:** 1 - Seguridad  
**DEPENDENCIAS:** Ninguna  
**TIEMPO ESTIMADO:** 3-4 horas

---

## CONTEXTO

El sistema actual loggea información sin filtrar PII (Personally Identifiable Information), lo que viola GDPR y buenas prácticas. Logs pueden contener:

- Contraseñas en requests fallidos
- Emails, teléfonos, direcciones completas
- Tokens de sesión
- Datos de tarjetas de crédito

**RIESGO:** Leak de datos sensibles en logs, violación GDPR, exposición en monitoreo.

---

## OBJETIVO

Implementar logging seguro con:

1. **Redacción automática de PII** (passwords, tokens, emails)
2. **Niveles de log apropiados** (error, warn, info, debug)
3. **Rotación de archivos** (evitar logs infinitos)
4. **Structured logging** (JSON para parseo fácil)
5. **Integración Sentry** para errores críticos

---

## INSTRUCCIONES DETALLADAS

### PASO 1: Instalar Dependencias

```bash
cd backend
npm install pino pino-pretty rotating-file-stream
npm install --save-dev @types/pino
```

---

### PASO 2: Configurar Logger Base

**Archivo:** `backend/src/config/logger.ts` (crear)

```typescript
import pino from 'pino';
import { createStream } from 'rotating-file-stream';
import path from 'path';

/**
 * Lista de campos sensibles que deben ser redactados
 */
const SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
  'apiKey',
  'secret',
];

/**
 * Redactar valores sensibles en objetos
 */
function redactSensitiveData(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const redacted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    
    // Redactar si key contiene palabra sensible
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      redacted[key] = '[REDACTED]';
    }
    // Email: mostrar solo dominio
    else if (lowerKey === 'email' && typeof value === 'string') {
      const domain = value.split('@')[1];
      redacted[key] = `***@${domain}`;
    }
    // Teléfono: mostrar solo últimos 4 dígitos
    else if (lowerKey === 'phone' && typeof value === 'string') {
      redacted[key] = `***${value.slice(-4)}`;
    }
    // IP: parcialmente ocultar
    else if (lowerKey === 'ip' && typeof value === 'string') {
      const parts = value.split('.');
      if (parts.length === 4) {
        redacted[key] = `${parts[0]}.${parts[1]}.***.*

**`;
      } else {
        redacted[key] = value;
      }
    }
    // Recursivo para objetos anidados
    else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveData(value);
    }
    else {
      redacted[key] = value;
    }
  }

  return redacted;
}

/**
 * Crear stream de rotación para logs
 */
function createLogStream(filename: string) {
  return createStream(filename, {
    interval: '1d', // Rotar diariamente
    maxFiles: 30, // Mantener últimos 30 días
    compress: 'gzip', // Comprimir logs antiguos
    path: path.join(__dirname, '../../logs'),
  });
}

/**
 * Configuración de logger según ambiente
 */
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logger principal
 */
export const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    
    // Redactar campos sensibles
    redact: {
      paths: SENSITIVE_FIELDS,
      censor: '[REDACTED]',
    },
    
    // Serializers personalizados
    serializers: {
      req: (req: any) => ({
        method: req.method,
        url: req.url,
        headers: redactSensitiveData(req.headers),
        query: redactSensitiveData(req.query),
        params: redactSensitiveData(req.params),
        // NO loggear body completo (puede tener passwords)
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
      err: pino.stdSerializers.err,
    },
    
    // Formateo pretty en desarrollo
    ...(isDevelopment && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    }),
  },
  
  // Streams de salida
  isProduction
    ? pino.multistream([
        // Logs de aplicación
        { level: 'info', stream: createLogStream('app-%DATE%.log') },
        // Logs de errores (separados)
        { level: 'error', stream: createLogStream('error-%DATE%.log') },
        // También a stdout para Docker/cloud
        { level: 'info', stream: process.stdout },
      ])
    : process.stdout
);

/**
 * Helper para loggear request/response
 */
export function logRequest(req: any, res: any, duration: number) {
  const logData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  };

  if (res.statusCode >= 500) {
    logger.error(logData, 'Request error');
  } else if (res.statusCode >= 400) {
    logger.warn(logData, 'Request warning');
  } else {
    logger.info(logData, 'Request completed');
  }
}
```

---

### PASO 3: Integrar con Fastify

**Archivo:** `backend/src/index.ts` (modificar)

```typescript
import { logger, logRequest } from './config/logger';

const app = fastify({
  logger, // Usar logger personalizado
});

// Hook para loggear requests/responses
app.addHook('onResponse', async (req, reply) => {
  const duration = reply.getResponseTime();
  logRequest(req, reply, duration);
});

// Hook para errores no capturados
app.addHook('onError', async (req, reply, error) => {
  logger.error(
    {
      err: error,
      req: {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
      },
    },
    'Unhandled error'
  );
});
```

---

### PASO 4: Crear Utility de Logging

**Archivo:** `backend/src/utils/logging.ts` (crear)

```typescript
import { logger } from '../config/logger';

/**
 * Helpers de logging para casos específicos
 */

export function logAuthAttempt(email: string, success: boolean, ip: string) {
  // Redactar email parcialmente
  const redactedEmail = email.split('@').map((part, i) => 
    i === 0 ? part.slice(0, 2) + '***' : part
  ).join('@');

  logger.info({
    event: 'auth_attempt',
    email: redactedEmail,
    success,
    ip,
  }, success ? 'Login successful' : 'Login failed');
}

export function logOrderCreated(orderId: string, userId: string, total: number) {
  logger.info({
    event: 'order_created',
    orderId,
    userId, // ID es OK, no es PII directo
    total,
  }, 'Order created successfully');
}

export function logDatabaseQuery(query: string, duration: number) {
  // Solo en desarrollo/debug
  if (process.env.LOG_LEVEL === 'debug') {
    logger.debug({
      query: query.substring(0, 100), // Limitar tamaño
      duration: `${duration}ms`,
    }, 'Database query');
  }
}

export function logSecurityEvent(event: string, details: Record<string, any>) {
  logger.warn({
    event: `security_${event}`,
    ...details,
  }, `Security event: ${event}`);
}

export function logCriticalError(error: Error, context?: Record<string, any>) {
  logger.error({
    err: error,
    context,
  }, 'Critical error occurred');

  // Enviar a Sentry si está configurado
  if (process.env.SENTRY_DSN) {
    // Sentry.captureException(error, { extra: context });
  }
}
```

---

### PASO 5: Usar Logger en Rutas

**Archivo:** `backend/src/routes/auth.ts` (modificar)

```typescript
import { logAuthAttempt, logSecurityEvent } from '../utils/logging';

app.post('/login', async (req, reply) => {
  const { email, password } = req.body;

  try {
    const user = await AuthService.login(email, password);
    
    logAuthAttempt(email, true, req.ip);
    
    return { user, token: user.accessToken };
  } catch (err: any) {
    logAuthAttempt(email, false, req.ip);
    
    // Detectar intentos de fuerza bruta
    const attempts = await getLoginAttempts(req.ip);
    if (attempts > 5) {
      logSecurityEvent('brute_force_detected', { ip: req.ip, email });
    }
    
    return reply.code(401).send({ error: 'Invalid credentials' });
  }
});
```

**Archivo:** `backend/src/routes/orders.ts` (modificar)

```typescript
import { logOrderCreated, logCriticalError } from '../utils/logging';

app.post('/orders', async (req, reply) => {
  try {
    const order = await OrderService.create(req.body, req.user.sub);
    
    logOrderCreated(order.id, req.user.sub, order.total);
    
    return { order };
  } catch (err: any) {
    logCriticalError(err, {
      userId: req.user.sub,
      // NO loggear items completos (pueden tener PII)
      itemCount: req.body.items?.length,
    });
    
    return reply.code(500).send({ error: 'Order creation failed' });
  }
});
```

---

### PASO 6: Configurar Rotación de Logs

**Archivo:** `backend/package.json` (añadir scripts)

```json
{
  "scripts": {
    "logs:clean": "find logs -name '*.gz' -mtime +30 -delete",
    "logs:view": "tail -f logs/app-*.log",
    "logs:errors": "tail -f logs/error-*.log"
  }
}
```

**Crear directorio de logs:**

```bash
mkdir -p backend/logs
```

**Añadir a `.gitignore`:**

```
backend/logs/*.log
backend/logs/*.gz
```

---

### PASO 7: Logging de Performance

**Archivo:** `backend/src/middleware/performanceLogger.ts` (crear)

```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../config/logger';

/**
 * Middleware para loggear requests lentos
 */
export async function performanceLogger(req: FastifyRequest, reply: FastifyReply) {
  const start = Date.now();

  reply.addHook('onSend', async () => {
    const duration = Date.now() - start;

    // Loggear si request tarda más de 1 segundo
    if (duration > 1000) {
      logger.warn({
        method: req.method,
        url: req.url,
        duration: `${duration}ms`,
      }, 'Slow request detected');
    }
  });
}
```

**Registrar en rutas:**

```typescript
app.addHook('onRequest', performanceLogger);
```

---

### PASO 8: Crear Dashboard de Logs (Opcional)

**Archivo:** `scripts/analyze-logs.js` (crear)

```javascript
/**
 * Analizar logs y generar estadísticas
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function analyzeLogs() {
  const logsDir = path.join(__dirname, '../backend/logs');
  const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.log'));

  const stats = {
    totalRequests: 0,
    errorCount: 0,
    warnCount: 0,
    authAttempts: { success: 0, failed: 0 },
    slowRequests: 0,
    endpoints: {},
  };

  for (const file of files) {
    const filePath = path.join(logsDir, file);
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream });

    for await (const line of rl) {
      try {
        const log = JSON.parse(line);

        if (log.method && log.url) {
          stats.totalRequests++;
          const endpoint = `${log.method} ${log.url}`;
          stats.endpoints[endpoint] = (stats.endpoints[endpoint] || 0) + 1;

          if (log.duration && parseInt(log.duration) > 1000) {
            stats.slowRequests++;
          }
        }

        if (log.level === 'error' || log.level >= 50) {
          stats.errorCount++;
        }

        if (log.level === 'warn' || log.level >= 40) {
          stats.warnCount++;
        }

        if (log.event === 'auth_attempt') {
          if (log.success) {
            stats.authAttempts.success++;
          } else {
            stats.authAttempts.failed++;
          }
        }
      } catch (err) {
        // Skip líneas inválidas
      }
    }
  }

  console.log('\n📊 ESTADÍSTICAS DE LOGS\n');
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Errors: ${stats.errorCount}`);
  console.log(`Warnings: ${stats.warnCount}`);
  console.log(`Slow Requests (>1s): ${stats.slowRequests}`);
  console.log(`\nAuth Attempts:`);
  console.log(`  Success: ${stats.authAttempts.success}`);
  console.log(`  Failed: ${stats.authAttempts.failed}`);
  console.log(`\nTop Endpoints:`);
  
  const sortedEndpoints = Object.entries(stats.endpoints)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  sortedEndpoints.forEach(([endpoint, count]) => {
    console.log(`  ${endpoint}: ${count}`);
  });
}

analyzeLogs().catch(console.error);
```

**Ejecutar:**

```bash
node scripts/analyze-logs.js
```

---

### PASO 9: Documentar Política de Logging

**Archivo:** `docs/LOGGING_POLICY.md` (crear)

```markdown
# Política de Logging

## Principios

1. **Nunca loggear PII sin redacción**
2. **Usar niveles apropiados** (error > warn > info > debug)
3. **Rotar logs automáticamente** (evitar crecimiento infinito)
4. **Structured logging** (JSON, no texto plano)
5. **Monitoring en tiempo real** (Sentry para errores críticos)

---

## Qué NO Loggear

❌ **Nunca loggear:**
- Passwords (ni siquiera hasheados)
- Tokens de sesión completos
- Números de tarjeta de crédito
- SSN, DNI, pasaportes
- Direcciones completas
- Emails sin redacción

---

## Qué SÍ Loggear

✅ **Loggear (con redacción):**
- IDs de usuario (no nombres)
- Emails parciales (`***@domain.com`)
- IPs parciales (`192.168.***.***`)
- Timestamps
- Códigos de error
- Duraciones de requests
- Eventos de seguridad

---

## Niveles de Log

### ERROR (50)

**Cuándo:** Errores críticos que requieren acción inmediata

```ts
logger.error({ err, context }, 'Critical error');
```

**Ejemplos:**
- Database down
- Payment gateway error
- Unhandled exceptions

### WARN (40)

**Cuándo:** Problemas potenciales, no críticos

```ts
logger.warn({ details }, 'Warning message');
```

**Ejemplos:**
- Login fallido (posible brute force)
- Rate limit exceeded
- Deprecated API usage

### INFO (30)

**Cuándo:** Eventos importantes normales

```ts
logger.info({ details }, 'Info message');
```

**Ejemplos:**
- User login successful
- Order created
- Server started

### DEBUG (20)

**Cuándo:** Información detallada para debugging

```ts
logger.debug({ details }, 'Debug message');
```

**Ejemplos:**
- Database query executed
- Cache hit/miss
- Middleware execution

---

## Redacción de Datos

### Email

```ts
// ❌ Incorrecto
logger.info({ email: 'user@example.com' });

// ✅ Correcto
logger.info({ email: '***@example.com' });
```

### Teléfono

```ts
// ✅ Correcto
logger.info({ phone: '***1234' }); // Solo últimos 4 dígitos
```

### IP

```ts
// ✅ Correcto
logger.info({ ip: '192.168.***.***' });
```

---

## Rotación

Logs rotan automáticamente:
- **Diariamente** a medianoche
- **Comprimidos** con gzip
- **Retenidos** 30 días
- **Eliminados** automáticamente tras 30 días

---

## Monitoreo

### Sentry (Errores Críticos)

Errores nivel `ERROR` se envían automáticamente a Sentry para alertas.

### CloudWatch / Datadog (Producción)

Logs en producción se envían a servicio de monitoreo cloud.

---

## Ejemplos

### Login

```ts
// ✅ Correcto
logAuthAttempt('user@example.com', true, req.ip);
// Log: { event: 'auth_attempt', email: 'us***@example.com', success: true, ip: '192.168.***.***' }
```

### Order

```ts
// ✅ Correcto
logOrderCreated(order.id, user.id, order.total);
// Log: { event: 'order_created', orderId: 'xxx', userId: 'yyy', total: 99.99 }

// ❌ Incorrecto
logger.info({ order }); // Puede tener dirección, email, etc.
```

### Error

```ts
// ✅ Correcto
logCriticalError(err, { userId: user.id });
// Log: { err: { message, stack }, context: { userId: 'xxx' } }
```

---

*Revisar código antes de mergear para verificar compliance con esta política.*
```

---

## VALIDACIÓN

### ✅ Criterios de Aceptación

1. **Logger configurado:**
   - [ ] Pino instalado y configurado
   - [ ] Redacción automática de PII
   - [ ] Niveles apropiados (error, warn, info, debug)
   - [ ] Rotación diaria con retención 30 días

2. **Integración:**
   - [ ] Fastify usa logger personalizado
   - [ ] Hooks para request/response logging
   - [ ] Utilities de logging creadas

3. **Documentación:**
   - [ ] Política de logging documentada
   - [ ] Ejemplos de uso claros

4. **Tests:**
   - [ ] Verificar redacción de passwords
   - [ ] Verificar redacción de emails
   - [ ] Verificar niveles de log

### 🧪 Tests de Validación

```bash
# Verificar que logs se crean
cd backend
npm run dev &
curl http://localhost:3000/api/products
ls -la logs/
# Esperado: app-YYYY-MM-DD.log existe

# Verificar redacción
grep -r "password" logs/
# Esperado: [REDACTED] o vacío

# Analizar logs
node scripts/analyze-logs.js

# Ver logs en tiempo real
npm run logs:view
```

### 📊 Métricas de Éxito

- **Compliance:** 0 PII sin redactar en logs
- **Performance:** <0.5ms overhead por log
- **Disk usage:** Logs comprimidos <100MB/mes

---

## NOTAS IMPORTANTES

### ⚠️ Avisos

1. **GDPR:** Logs con PII pueden violar regulaciones
2. **Disk space:** Monitorear espacio en disco
3. **Producción:** Usar servicio de logging cloud (CloudWatch, Datadog)

### 🔗 Dependencias

- **Requiere:** Ninguna
- **Habilita:** Compliance GDPR, debugging seguro

### 📦 Entregables

- `backend/src/config/logger.ts`
- `backend/src/utils/logging.ts`
- `backend/src/middleware/performanceLogger.ts`
- `scripts/analyze-logs.js`
- `docs/LOGGING_POLICY.md`

---

**FIN DE INSTRUCCIONES TASK-010**
