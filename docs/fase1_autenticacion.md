# FASE 1: Autenticación Segura - Instrucciones Paso a Paso

## Objetivo

Implementar sistema de autenticación completo con bcrypt + JWT en cookies httpOnly y migrar el frontend para usar la API.

---

## Pre-requisitos

- ✅ Fase 0 completada y validada
- ✅ Servidor backend corriendo
- ✅ database.sqlite con tabla users

---

## Arquitectura de Autenticación

```
Cliente (React)                    Backend (Fastify)                Database
     │                                  │                              │
     │──POST /api/auth/signup──────────>│                              │
     │   {email, password, name}        │──hash password (bcrypt)──>   │
     │                                  │──INSERT user──────────────>  │
     │                                  │<─user created─────────────   │
     │                                  │──generate JWT (access+refresh)
     │<─Set-Cookie: httpOnly────────────│                              │
     │   {user: {id, email, name}}      │                              │
     │                                  │                              │
     │──POST /api/auth/login────────────>│                              │
     │   {email, password}              │──SELECT user──────────────>  │
     │                                  │<─user data────────────────   │
     │                                  │──bcrypt.compare(password)    │
     │                                  │──generate JWT                │
     │<─Set-Cookie: httpOnly────────────│                              │
     │                                  │                              │
     │──GET /api/products (protected)───>│                              │
     │   Cookie: accessToken            │──verify JWT                  │
     │                                  │──req.user = decoded          │
     │<─products list───────────────────│                              │
```

---

## Pasos de Ejecución

### **PASO 1: Crear tipos de autenticación**

**Archivo:** `backend/src/types/auth.ts`

```typescript
// TODO: Definir interfaces para auth
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
}

export interface AuthResponse {
  user: User;
}
```

**Comando:**

```powershell
Copy-Item "templates\backend\src\types\auth.ts" "backend\src\types\auth.ts"
```

---

### **PASO 2: Crear esquemas de validación Zod**

**Archivo:** `backend/src/types/validation.ts`

```typescript
import { z } from 'zod';

// TODO: Schema para signup
export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres')
});

// TODO: Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

**Comando:**

```powershell
Copy-Item "templates\backend\src\types\validation.ts" "backend\src\types\validation.ts"
```

---

### **PASO 3: Crear servicio de autenticación**

**Archivo:** `backend/src/services/authService.ts`

**Qué debe implementar GPT-5-codex:**

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/client';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { config } from '../config';
import type { SignupInput, LoginInput } from '../types/validation';
import type { User, TokenPayload } from '../types/auth';

const SALT_ROUNDS = 12;

// TODO: Implementar signup
export async function signup(data: SignupInput): Promise<User> {
  // 1. Verificar que email no exista
  // 2. Hash password con bcrypt.hash(password, SALT_ROUNDS)
  // 3. Insertar usuario en DB
  // 4. Retornar usuario (sin password_hash)
}

// TODO: Implementar login
export async function login(data: LoginInput): Promise<User | null> {
  // 1. Buscar usuario por email
  // 2. Si no existe, retornar null
  // 3. Comparar password con bcrypt.compare(password, user.password_hash)
  // 4. Si no coincide, retornar null
  // 5. Retornar usuario (sin password_hash)
}

// TODO: Generar access token
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
}

// TODO: Generar refresh token
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN
  });
}

// TODO: Verificar access token
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// TODO: Verificar refresh token
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
```

**Comando:**

```powershell
Copy-Item "templates\backend\src\services\authService.ts" "backend\src\services\authService.ts"
```

**Validación:**

```powershell
npm run type-check # debe pasar sin errores
```

---

### **PASO 4: Crear middleware de autenticación**

**Archivo:** `backend/src/middleware/auth.ts`

**Qué debe implementar GPT-5-codex:**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../services/authService';

// TODO: Declarar propiedad user en FastifyRequest
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: number;
      email: string;
    };
  }
}

// TODO: Middleware requireAuth
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 1. Obtener token de cookie: request.cookies.accessToken
  // 2. Si no hay token, retornar 401
  // 3. Verificar token con verifyAccessToken
  // 4. Si inválido, retornar 401
  // 5. Asignar request.user = decoded
}
```

**Comando:**

```powershell
Copy-Item "templates\backend\src\middleware\auth.ts" "backend\src\middleware\auth.ts"
```

---

### **PASO 5: Crear middleware de validación**

**Archivo:** `backend/src/middleware/validate.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema } from 'zod';

// TODO: Middleware genérico de validación
export function validate(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (error) {
      reply.status(400).send({
        error: 'Validación fallida',
        details: error.errors
      });
    }
  };
}
```

**Comando:**

```powershell
Copy-Item "templates\backend\src\middleware\validate.ts" "backend\src\middleware\validate.ts"
```

---

### **PASO 6: Crear rutas de autenticación**

**Archivo:** `backend/src/routes/auth.ts`

**Qué debe implementar GPT-5-codex:**

```typescript
import { FastifyInstance } from 'fastify';
import { signup, login, generateAccessToken, generateRefreshToken } from '../services/authService';
import { signupSchema, loginSchema } from '../types/validation';
import { validate } from '../middleware/validate';

// TODO: Registrar rutas
export async function authRoutes(app: FastifyInstance) {
  
  // POST /api/auth/signup
  app.post('/signup', {
    preHandler: validate(signupSchema)
  }, async (request, reply) => {
    // 1. Llamar signup service
    // 2. Si email ya existe, retornar 409 Conflict
    // 3. Generar tokens
    // 4. Setear cookies httpOnly:
    //    reply.setCookie('accessToken', token, {
    //      httpOnly: true,
    //      secure: process.env.NODE_ENV === 'production',
    //      sameSite: 'strict',
    //      maxAge: 15 * 60 * 1000 // 15 minutos
    //    })
    // 5. Retornar { user }
  });

  // POST /api/auth/login
  app.post('/login', {
    preHandler: validate(loginSchema)
  }, async (request, reply) => {
    // 1. Llamar login service
    // 2. Si credenciales inválidas, retornar 401
    // 3. Generar tokens
    // 4. Setear cookies httpOnly
    // 5. Retornar { user }
  });

  // POST /api/auth/logout
  app.post('/logout', async (request, reply) => {
    // 1. Limpiar cookies
    reply.clearCookie('accessToken');
    reply.clearCookie('refreshToken');
    return { message: 'Logout exitoso' };
  });

  // POST /api/auth/refresh
  app.post('/refresh', async (request, reply) => {
    // 1. Obtener refreshToken de cookie
    // 2. Verificar token
    // 3. Si válido, generar nuevo accessToken
    // 4. Setear nueva cookie
    // 5. Retornar { success: true }
  });
}
```

**Comando:**

```powershell
Copy-Item "templates\backend\src\routes\auth.ts" "backend\src\routes\auth.ts"
```

---

### **PASO 7: Registrar rutas en servidor**

**Archivo:** `backend/src/index.ts`

**Editar para añadir:**

```typescript
import { authRoutes } from './routes/auth';

// ... después de registrar plugins ...

// Registrar rutas
await app.register(authRoutes, { prefix: '/api/auth' });
```

**Comando:**

```powershell
# GPT-5-codex debe editar el archivo index.ts existente
# Añadir import y register después de los plugins
```

---

### **PASO 8: Probar endpoints con curl o Postman**

**Terminal:**

```powershell
# 1. Signup
curl -X POST http://localhost:3000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"email":"test2@example.com","password":"test12345","name":"Test User"}' `
  -c cookies.txt

# Esperado: {"user":{"id":2,"email":"test2@example.com","name":"Test User"}}
# Y Set-Cookie headers

# 2. Login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test2@example.com","password":"test12345"}' `
  -c cookies.txt

# Esperado: {"user":{...}}

# 3. Endpoint protegido (crear uno de prueba)
curl -X GET http://localhost:3000/api/protected `
  -b cookies.txt

# Esperado: datos protegidos (si token válido)
```

---

### **PASO 9: Crear tests de autenticación**

**Archivo:** `backend/tests/auth.test.ts`

**Qué debe implementar GPT-5-codex:**

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { build } from '../src/app'; // Exportar Fastify app desde index.ts

describe('Auth API', () => {
  let app;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/signup - crea usuario', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/signup',
      payload: {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('user');
    expect(response.cookies).toHaveLength(2); // accessToken + refreshToken
  });

  it('POST /api/auth/login - login exitoso', async () => {
    // TODO: test login
  });

  it('POST /api/auth/login - credenciales inválidas', async () => {
    // TODO: test credenciales incorrectas
  });

  it('POST /api/auth/logout - limpia cookies', async () => {
    // TODO: test logout
  });

  it('Middleware requireAuth - bloquea sin token', async () => {
    // TODO: test endpoint protegido sin token
  });
});
```

**Comando:**

```powershell
Copy-Item "templates\backend\tests\auth.test.ts" "backend\tests\auth.test.ts"
```

**Ejecutar tests:**

```powershell
npm run test:once
```

**Validación:**

```powershell
# Todos los tests deben pasar
# Coverage debe ser ≥ 80%
```

---

### **PASO 10: Migrar frontend - Adaptar AuthContext**

**Archivo:** `frontend/src/contexts/AuthContext.tsx`

**Cambios a realizar:**

```typescript
// ANTES (localStorage)
const login = async (email: string, password: string) => {
  const user = MOCK_USERS.find(u => u.email === email);
  // ...
  localStorage.setItem('user', JSON.stringify(user));
};

// DESPUÉS (API)
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // IMPORTANTE: enviar/recibir cookies
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const data = await response.json();
  setUser(data.user);
  // NO guardar en localStorage, las cookies se manejan automáticamente
};
```

**Comando:**

```powershell
# GPT-5-codex debe editar AuthContext.tsx
# Reemplazar lógica de localStorage por fetch calls
```

**Archivos a modificar:**

1. `frontend/src/contexts/AuthContext.tsx` - login, signup, logout
2. `frontend/src/services/authService.ts` - ELIMINAR (ya no es necesario)
3. `frontend/src/utils/secureStorage.ts` - ELIMINAR (secretos ya no en frontend)
4. `frontend/src/utils/jwtUtils.ts` - ELIMINAR (JWT se maneja en backend)

---

### **PASO 11: Crear cliente API en frontend**

**Archivo:** `frontend/src/services/apiClient.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // IMPORTANTE
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// Wrappers tipados
export const api = {
  auth: {
    signup: (data: SignupData) => apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    login: (data: LoginData) => apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    logout: () => apiRequest('/api/auth/logout', { method: 'POST' })
  }
};
```

**Comando:**

```powershell
Copy-Item "templates\frontend\src\services\apiClient.ts" "frontend\src\services\apiClient.ts"
```

---

### **PASO 12: Configurar CORS en Vite**

**Archivo:** `frontend/vite.config.ts`

**Añadir:**

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

---

### **PASO 13: Validar integración frontend-backend**

**Checklist manual:**

1. Arrancar backend: `cd backend && npm run dev`
2. Arrancar frontend: `cd frontend && npm run dev`
3. Abrir http://localhost:5173
4. Hacer signup con nuevo usuario
5. Verificar en DevTools → Application → Cookies:
   - `accessToken` presente (httpOnly)
   - `refreshToken` presente (httpOnly)
6. Hacer logout
7. Verificar cookies eliminadas
8. Hacer login
9. Verificar cookies restauradas

---

### **PASO 14: Ejecutar validación de fase**

```powershell
cd ..
.\scripts\validate_phase.ps1 -Phase 1
```

**Checklist automático:**

- [x] Backend: endpoints auth funcionan
- [x] Backend: tests pasan (coverage ≥ 80%)
- [x] Frontend: AuthContext usa API
- [x] Frontend: No hay localStorage de auth
- [x] Cookies httpOnly configuradas
- [x] CORS funciona
- [x] Type-check limpio (backend + frontend)

**Si todo pasa: ✅ FASE 1 COMPLETADA**

---

## Troubleshooting

### Error: "CORS policy blocked"

**Solución:**

```typescript
// En backend/src/index.ts
await app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true // IMPORTANTE
});
```

### Cookies no se envían

**Solución:**

- Verificar `credentials: 'include'` en fetch del frontend
- Verificar `credentials: true` en CORS del backend
- Verificar que backend y frontend estén en mismo dominio (o usar proxy de Vite)

### Error: "jwt malformed"

**Solución:**

- Verificar que JWT_SECRET esté configurado en .env
- Verificar que el token no esté corrupto
- Regenerar token haciendo login de nuevo

---

## Próximos pasos

Una vez completada Fase 1:

1. ✅ Validar checklist completo
2. ⏳ Proceder a `docs/fase2_productos_api.md`
3. ⏳ Migrar productos a API

---

**Tiempo estimado total:** 30-40 horas  
**Dificultad:** Alta  
**Bloqueadores conocidos:** CORS, cookies httpOnly
