# TASK-006: Sistema de Rotación de Tokens JWT

**PRIORIDAD:** ALTA  
**FASE:** 1 - Seguridad  
**DEPENDENCIAS:** TASK-005 (CSRF implementado)  
**TIEMPO ESTIMADO:** 4-5 horas

---

## CONTEXTO

Sistema JWT actual NO implementa rotación de refresh tokens. Esto significa:

- Refresh tokens NUNCA expiran (hasta logout manual)
- Si un token es robado, permanece válido indefinidamente
- No hay tracking de qué dispositivos tienen sesiones activas

**HALLAZGO RELACIONADO:** SEC-AUTH-004 - Falta rotación de refresh tokens

**RIESGO:** Un atacante con acceso a refresh token puede mantener acceso persistente sin detección.

---

## OBJETIVO

Implementar rotación automática de refresh tokens con:

1. **Refresh Token Rotation:** Cada uso de refresh token genera uno nuevo e invalida el anterior
2. **Token Families (jti):** Tracking de cadenas de rotación para detectar reuso
3. **Automatic Reuse Detection:** Revocar TODA la familia si se detecta reuso sospechoso
4. **Session Management:** UI para ver/revocar sesiones activas

---

## FUNDAMENTOS TEÓRICOS

### ¿Qué es Token Rotation?

**SIN rotación:**

```
1. Login → Refresh Token = abc123
2. Refresh → Access Token nuevo, Refresh Token = abc123 (MISMO)
3. Si abc123 se roba → válido SIEMPRE
```

**CON rotación:**

```
1. Login → Refresh Token = abc123 (familia: fam001)
2. Refresh → Access Token + Refresh Token = xyz789 (familia: fam001)
3. Refresh → Access Token + Refresh Token = def456 (familia: fam001)
4. Si abc123 se reusa → DETECTADO (ya fue usado) → Revocar fam001
```

### ¿Qué es jti (JWT ID)?

`jti` es un identificador único por token para tracking.

**Ejemplo:**

```json
{
  "sub": "user-123",
  "jti": "token-abc-xyz-001",
  "family": "fam-456-def-789",
  "iat": 1699999999,
  "exp": 1700000000
}
```

---

## INSTRUCCIONES DETALLADAS

### PASO 1: Crear Schema de Sesiones

**Archivo:** `backend/src/db/schema/sessions.ts` (crear)

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Tabla de sesiones activas
 * 
 * Trackea refresh tokens válidos y detecta reuso.
 */
export const sessions = sqliteTable('sessions', {
  // ID único de sesión (jti del refresh token)
  id: text('id').primaryKey(),
  
  // ID del usuario propietario
  userId: text('user_id').notNull(),
  
  // Familia de tokens (para rotación)
  familyId: text('family_id').notNull(),
  
  // Hash del refresh token (NO el token original)
  tokenHash: text('token_hash').notNull().unique(),
  
  // Metadata del dispositivo
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  
  // Estado
  isRevoked: integer('is_revoked', { mode: 'boolean' }).default(false).notNull(),
  
  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  revokedReason: text('revoked_reason'),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
```

---

### PASO 2: Crear Migración

**Generar migración:**

```bash
cd backend
npm run db:generate
```

**Verificar archivo generado:** `backend/drizzle/XXXX_create_sessions.sql`

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  family_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address TEXT,
  is_revoked INTEGER DEFAULT 0 NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_used_at INTEGER,
  revoked_at INTEGER,
  revoked_reason TEXT
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_family_id ON sessions(family_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

**Aplicar migración:**

```bash
npm run db:migrate
```

---

### PASO 3: Crear Service de Sesiones

**Archivo:** `backend/src/services/sessionService.ts` (crear)

```typescript
import { eq, and, lt } from 'drizzle-orm';
import { db } from '../db/client';
import { sessions } from '../db/schema/sessions';
import { createHash, randomBytes } from 'crypto';

export class SessionService {
  /**
   * Generar hash seguro de token
   */
  private static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Crear nueva sesión (al login o refresh)
   */
  static async createSession(params: {
    userId: string;
    familyId: string;
    token: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<Session> {
    const tokenHash = this.hashToken(params.token);
    const sessionId = randomBytes(16).toString('hex');

    const [session] = await db
      .insert(sessions)
      .values({
        id: sessionId,
        userId: params.userId,
        familyId: params.familyId,
        tokenHash,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress,
        expiresAt: params.expiresAt,
      })
      .returning();

    return session;
  }

  /**
   * Verificar si token es válido
   * 
   * Retorna sesión si válida, null si inválida/expirada/revocada.
   */
  static async verifyToken(token: string): Promise<Session | null> {
    const tokenHash = this.hashToken(token);

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash))
      .limit(1);

    if (!session) return null;

    // Verificar revocación
    if (session.isRevoked) {
      throw new Error('Token has been revoked');
    }

    // Verificar expiración
    if (session.expiresAt < new Date()) {
      await this.revokeSession(session.id, 'expired');
      throw new Error('Token has expired');
    }

    // Actualizar lastUsedAt
    await db
      .update(sessions)
      .set({ lastUsedAt: new Date() })
      .where(eq(sessions.id, session.id));

    return session;
  }

  /**
   * Detectar reuso de token
   * 
   * Si token ya fue usado (tiene lastUsedAt), es reuso sospechoso.
   */
  static async detectReuse(token: string): Promise<boolean> {
    const tokenHash = this.hashToken(token);

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash))
      .limit(1);

    if (!session) return false;

    // Si lastUsedAt existe, token ya fue rotado
    return session.lastUsedAt !== null;
  }

  /**
   * Revocar sesión individual
   */
  static async revokeSession(
    sessionId: string,
    reason: string
  ): Promise<void> {
    await db
      .update(sessions)
      .set({
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
      })
      .where(eq(sessions.id, sessionId));
  }

  /**
   * Revocar toda la familia de tokens
   * 
   * Usado cuando se detecta reuso sospechoso.
   */
  static async revokeFamilyTokens(
    familyId: string,
    reason: string
  ): Promise<void> {
    await db
      .update(sessions)
      .set({
        isRevoked: true,
        revokedAt: new Date(),
        revokedReason: reason,
      })
      .where(
        and(
          eq(sessions.familyId, familyId),
          eq(sessions.isRevoked, false)
        )
      );
  }

  /**
   * Obtener sesiones activas de un usuario
   */
  static async getUserSessions(userId: string): Promise<Session[]> {
    return db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.userId, userId),
          eq(sessions.isRevoked, false),
          lt(new Date(), sessions.expiresAt)
        )
      )
      .orderBy(sessions.lastUsedAt);
  }

  /**
   * Limpiar sesiones expiradas (cron job)
   */
  static async cleanupExpiredSessions(): Promise<number> {
    const result = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, new Date()))
      .returning({ id: sessions.id });

    return result.length;
  }
}

export type Session = typeof sessions.$inferSelect;
```

---

### PASO 4: Actualizar AuthService para Rotación

**Archivo:** `backend/src/services/authService.ts`

Modificar método `refreshTokens`:

```typescript
import { SessionService } from './sessionService';
import { randomBytes } from 'crypto';

export class AuthService {
  // ... código existente ...

  /**
   * Refrescar tokens con rotación
   */
  static async refreshTokens(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verificar token actual
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }

    // 2. DETECTAR REUSO
    const isReused = await SessionService.detectReuse(refreshToken);
    if (isReused) {
      // ⚠️ TOKEN REUSADO - Posible ataque
      await SessionService.revokeFamilyTokens(
        payload.family,
        'token_reuse_detected'
      );
      throw new Error('Token reuse detected - all sessions revoked');
    }

    // 3. Verificar sesión en DB
    const session = await SessionService.verifyToken(refreshToken);
    if (!session) {
      throw new Error('Session not found or revoked');
    }

    // 4. Generar NUEVOS tokens (misma familia)
    const newAccessToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        family: payload.family, // MISMA familia
        jti: randomBytes(16).toString('hex'), // NUEVO jti
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // 5. Revocar token anterior
    await SessionService.revokeSession(session.id, 'rotated');

    // 6. Crear nueva sesión
    await SessionService.createSession({
      userId: payload.sub,
      familyId: payload.family,
      token: newRefreshToken,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Login - generar tokens iniciales
   */
  static async login(
    email: string,
    password: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    // ... validación de credenciales ...

    const user = await UserService.findByEmail(email);
    if (!user || !await this.verifyPassword(password, user.passwordHash)) {
      throw new Error('Invalid credentials');
    }

    // Generar familia de tokens (nueva sesión)
    const familyId = randomBytes(16).toString('hex');

    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        family: familyId,
        jti: randomBytes(16).toString('hex'),
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Guardar sesión
    await SessionService.createSession({
      userId: user.id,
      familyId,
      token: refreshToken,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken, user };
  }

  /**
   * Logout - revocar sesión actual
   */
  static async logout(refreshToken: string): Promise<void> {
    const session = await SessionService.verifyToken(refreshToken);
    if (session) {
      await SessionService.revokeSession(session.id, 'user_logout');
    }
  }

  /**
   * Logout de todos los dispositivos
   */
  static async logoutAll(userId: string): Promise<void> {
    const sessions = await SessionService.getUserSessions(userId);
    
    for (const session of sessions) {
      await SessionService.revokeSession(session.id, 'user_logout_all');
    }
  }
}
```

---

### PASO 5: Actualizar Ruta de Auth

**Archivo:** `backend/src/routes/auth.ts`

```typescript
app.post('/refresh', async (req, reply) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return reply.code(400).send({ error: 'Refresh token required' });
  }

  try {
    const tokens = await AuthService.refreshTokens(
      refreshToken,
      req.headers['user-agent'],
      req.ip
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  } catch (err: any) {
    if (err.message === 'Token reuse detected - all sessions revoked') {
      return reply.code(401).send({
        error: 'Security alert',
        message: 'Token reuse detected. All sessions have been revoked for security.',
      });
    }

    return reply.code(401).send({
      error: 'Invalid token',
      message: err.message,
    });
  }
});

app.post('/login', async (req, reply) => {
  const { email, password } = req.body;

  try {
    const result = await AuthService.login(
      email,
      password,
      req.headers['user-agent'],
      req.ip
    );

    return result;
  } catch (err: any) {
    return reply.code(401).send({ error: err.message });
  }
});

app.post('/logout', async (req, reply) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return reply.code(400).send({ error: 'Refresh token required' });
  }

  await AuthService.logout(refreshToken);
  return { message: 'Logged out successfully' };
});

app.post('/logout-all', {
  preHandler: [authenticateUser], // Requiere estar autenticado
}, async (req, reply) => {
  const userId = req.user.sub;

  await AuthService.logoutAll(userId);
  return { message: 'All sessions logged out' };
});
```

---

### PASO 6: Crear Endpoint de Gestión de Sesiones

**Archivo:** `backend/src/routes/sessions.ts` (crear)

```typescript
import type { FastifyInstance } from 'fastify';
import { SessionService } from '../services/sessionService';
import { authenticateUser } from '../middleware/auth';

export default async function sessionsRoutes(app: FastifyInstance) {
  /**
   * GET /api/sessions
   * 
   * Listar sesiones activas del usuario actual
   */
  app.get('/sessions', {
    preHandler: [authenticateUser],
  }, async (req, reply) => {
    const userId = req.user.sub;

    const sessions = await SessionService.getUserSessions(userId);

    return {
      sessions: sessions.map(s => ({
        id: s.id,
        device: s.userAgent,
        ipAddress: s.ipAddress,
        createdAt: s.createdAt,
        lastUsedAt: s.lastUsedAt,
        expiresAt: s.expiresAt,
        isCurrent: s.tokenHash === req.headers['authorization']?.split(' ')[1], // Aproximación
      })),
    };
  });

  /**
   * DELETE /api/sessions/:id
   * 
   * Revocar sesión específica
   */
  app.delete('/sessions/:id', {
    preHandler: [authenticateUser],
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const userId = req.user.sub;

    // Verificar que sesión pertenece al usuario
    const sessions = await SessionService.getUserSessions(userId);
    const session = sessions.find(s => s.id === id);

    if (!session) {
      return reply.code(404).send({ error: 'Session not found' });
    }

    await SessionService.revokeSession(id, 'user_revoked_session');

    return { message: 'Session revoked' };
  });
}
```

**Registrar en `backend/src/index.ts`:**

```typescript
import sessionsRoutes from './routes/sessions';

await app.register(sessionsRoutes, { prefix: '/api' });
```

---

### PASO 7: Crear Cron Job de Limpieza

**Archivo:** `backend/src/jobs/cleanupSessions.ts` (crear)

```typescript
import { SessionService } from '../services/sessionService';

/**
 * Limpiar sesiones expiradas
 * 
 * Ejecutar cada 24 horas con cron.
 */
export async function cleanupExpiredSessions() {
  console.log('[CRON] Iniciando limpieza de sesiones...');

  const deleted = await SessionService.cleanupExpiredSessions();

  console.log(`[CRON] ${deleted} sesiones expiradas eliminadas`);
}

// Ejecutar cada 24 horas
setInterval(cleanupExpiredSessions, 24 * 60 * 60 * 1000);
```

**Importar en `backend/src/index.ts`:**

```typescript
import './jobs/cleanupSessions';
```

---

### PASO 8: Actualizar Frontend - Gestión de Sesiones

**Archivo:** `src/pages/AccountSettings.tsx` (crear sección)

```tsx
import { useState, useEffect } from 'react';
import api from '../services/api';

interface Session {
  id: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export function SessionsManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(response.data.sessions);
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (!confirm('¿Revocar esta sesión?')) return;

    try {
      await api.delete(`/sessions/${sessionId}`);
      await loadSessions();
    } catch (err) {
      console.error('Error revoking session:', err);
    }
  };

  const logoutAll = async () => {
    if (!confirm('¿Cerrar sesión en TODOS los dispositivos?')) return;

    try {
      await api.post('/auth/logout-all');
      window.location.href = '/login';
    } catch (err) {
      console.error('Error logging out all:', err);
    }
  };

  if (loading) return <div>Cargando sesiones...</div>;

  return (
    <div className="sessions-manager">
      <h2>Sesiones Activas</h2>

      <button onClick={logoutAll} className="btn-danger">
        Cerrar Sesión en Todos los Dispositivos
      </button>

      <div className="sessions-list">
        {sessions.map(session => (
          <div key={session.id} className="session-card">
            <div className="session-info">
              <strong>{session.device || 'Dispositivo Desconocido'}</strong>
              {session.isCurrent && <span className="badge">Actual</span>}
              <p>IP: {session.ipAddress}</p>
              <p>Última actividad: {new Date(session.lastUsedAt).toLocaleString()}</p>
              <p>Expira: {new Date(session.expiresAt).toLocaleString()}</p>
            </div>

            {!session.isCurrent && (
              <button
                onClick={() => revokeSession(session.id)}
                className="btn-secondary"
              >
                Revocar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### PASO 9: Crear Tests

**Archivo:** `backend/src/services/__tests__/sessionService.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { SessionService } from '../sessionService';
import { db } from '../../db/client';
import { sessions } from '../../db/schema/sessions';

describe('SessionService', () => {
  beforeEach(async () => {
    // Limpiar tabla
    await db.delete(sessions);
  });

  it('should create session', async () => {
    const session = await SessionService.createSession({
      userId: 'user-123',
      familyId: 'fam-abc',
      token: 'token-xyz',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    expect(session).toBeDefined();
    expect(session.userId).toBe('user-123');
    expect(session.familyId).toBe('fam-abc');
  });

  it('should detect token reuse', async () => {
    const token = 'reusable-token';

    // Crear sesión y marcar como usada
    await SessionService.createSession({
      userId: 'user-123',
      familyId: 'fam-abc',
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await SessionService.verifyToken(token); // Marca lastUsedAt

    // Detectar reuso
    const isReused = await SessionService.detectReuse(token);
    expect(isReused).toBe(true);
  });

  it('should revoke family tokens', async () => {
    const familyId = 'fam-test';

    // Crear múltiples sesiones de misma familia
    await SessionService.createSession({
      userId: 'user-123',
      familyId,
      token: 'token-1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await SessionService.createSession({
      userId: 'user-123',
      familyId,
      token: 'token-2',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Revocar familia
    await SessionService.revokeFamilyTokens(familyId, 'test');

    // Verificar revocación
    const userSessions = await SessionService.getUserSessions('user-123');
    expect(userSessions.length).toBe(0); // Todas revocadas
  });

  it('should cleanup expired sessions', async () => {
    // Crear sesión expirada
    await SessionService.createSession({
      userId: 'user-123',
      familyId: 'fam-abc',
      token: 'expired-token',
      expiresAt: new Date(Date.now() - 1000), // Expirada hace 1 segundo
    });

    const deleted = await SessionService.cleanupExpiredSessions();
    expect(deleted).toBe(1);
  });
});
```

**Ejecutar:**

```bash
cd backend
npm run test -- sessionService.test.ts
```

---

## VALIDACIÓN

### ✅ Criterios de Aceptación

1. **Base de Datos:**
   - [ ] Tabla `sessions` creada con índices
   - [ ] Migración aplicada correctamente

2. **Backend:**
   - [ ] SessionService completo con métodos CRUD
   - [ ] AuthService integrado con rotación
   - [ ] Endpoint `/api/sessions` funcional
   - [ ] Detección de reuso implementada
   - [ ] Cron job de limpieza activo

3. **Frontend:**
   - [ ] UI para ver sesiones activas
   - [ ] Botón "Cerrar todas las sesiones"
   - [ ] Confirmaciones antes de revocar

4. **Seguridad:**
   - [ ] Tokens hasheados en DB (NO plain text)
   - [ ] Rotación automática en cada refresh
   - [ ] Revocación de familia ante reuso

### 🧪 Tests de Validación

```bash
# Tests unitarios
cd backend
npm run test -- sessionService.test.ts

# Test manual - Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  | jq

# Test manual - Refresh (debería rotar token)
REFRESH_TOKEN="..."
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}" \
  | jq

# Test manual - Reuso (debería revocar familia)
# Usar mismo REFRESH_TOKEN dos veces → segunda debería fallar
```

### 📊 Métricas de Éxito

- **Detección:** 100% reuso detectado y familia revocada
- **Performance:** <10ms overhead por refresh
- **UX:** Sesiones visibles en settings

---

## NOTAS IMPORTANTES

### ⚠️ Avisos

1. **Breaking Change:** Todos los refresh tokens existentes quedan inválidos
2. **Migración:** Usuarios deben re-login tras deploy
3. **Storage:** Tabla sessions crece con uso (limpiar regularmente)

### 🔗 Dependencias

- **Requiere:** TASK-005 (CSRF para logout seguro)
- **Habilita:** Auditoría de sesiones, revocación remota

### 📦 Entregables

- `backend/src/db/schema/sessions.ts`
- `backend/drizzle/XXXX_create_sessions.sql`
- `backend/src/services/sessionService.ts`
- `backend/src/routes/sessions.ts`
- `backend/src/jobs/cleanupSessions.ts`
- `src/pages/AccountSettings.tsx` (actualizado)

---

**FIN DE INSTRUCCIONES TASK-006**
