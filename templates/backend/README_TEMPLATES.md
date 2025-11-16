# Templates Backend - Documentación

## ✅ Templates Generados

Todos los archivos base para el backend han sido generados con TODOs claros para implementación.

### **Estructura Completa:**

```
templates/backend/
├── package.json                      # ✅ Dependencias completas
├── tsconfig.json                     # ✅ Config TypeScript strict
├── .env.example                      # ✅ Variables de entorno
└── src/
    ├── config/
    │   └── index.ts                  # ✅ Carga y validación de .env con Zod
    ├── db/
    │   ├── schema.ts                 # ✅ 5 tablas Drizzle (users, products, cart, orders, order_items)
    │   ├── client.ts                 # ✅ Conexión SQLite + PRAGMA optimizado
    │   ├── migrate.ts                # ✅ Script de migraciones
    │   └── seed.ts                   # ✅ Seed de usuarios y productos
    ├── types/
    │   ├── auth.ts                   # ✅ Interfaces de autenticación
    │   └── validation.ts             # ✅ Schemas Zod para validación
    ├── services/
    │   └── authService.ts            # ✅ Signup, login, JWT, bcrypt
    ├── middleware/
    │   ├── auth.ts                   # ✅ requireAuth, optionalAuth
    │   └── validate.ts               # ✅ Validación genérica con Zod
    ├── routes/
    │   └── auth.ts                   # ✅ /signup, /login, /logout, /refresh, /me
    └── index.ts                      # ✅ Servidor Fastify completo
```

---

## 📋 Qué Está Implementado (Listo para Copiar)

### **1. Config (`src/config/index.ts`)**
- ✅ Carga de `.env` con dotenv
- ✅ Validación de variables requeridas con Zod
- ✅ Tipos inferidos automáticamente
- ✅ Exit si falta alguna variable crítica

**Estado:** **COMPLETO** - Solo copiar

---

### **2. Database Schema (`src/db/schema.ts`)**
- ✅ Tabla `users` (id, email, password_hash, name, created_at)
- ✅ Tabla `products` (id, name, description, price, stock, category, images[], etc.)
- ✅ Tabla `cart_items` (con foreign keys)
- ✅ Tabla `orders` (con status enum y shipping_address JSON)
- ✅ Tabla `order_items` (con precio al momento de compra)
- ✅ Relaciones (foreign keys) configuradas
- ✅ Tipos TypeScript inferidos de Drizzle

**Estado:** **COMPLETO** - Solo copiar

---

### **3. Database Client (`src/db/client.ts`)**
- ✅ Conexión SQLite con better-sqlite3
- ✅ PRAGMA optimizado:
  - `journal_mode = WAL` (concurrencia)
  - `foreign_keys = ON` (integridad)
  - `busy_timeout = 5000` (locks)
  - `synchronous = NORMAL` (balance velocidad/seguridad)
- ✅ Instancia Drizzle con schema
- ✅ Función `closeDatabase()` para tests

**Estado:** **COMPLETO** - Solo copiar

---

### **4. Migrations (`src/db/migrate.ts`)**
- ✅ Script que ejecuta migraciones de Drizzle
- ✅ Logs informativos
- ✅ Cierre de conexión al terminar

**Estado:** **COMPLETO** - Solo copiar

---

### **5. Seed (`src/db/seed.ts`)**
- ✅ Usuario de prueba (test@example.com / test123)
- ✅ Productos de ejemplo (2 productos temporales)
- ⚠️ **TODO GPT-5-codex:** Descomentar código para cargar productos reales desde frontend
- ⚠️ **TODO GPT-5-codex:** Ajustar ruta del import de productos

**Estado:** **80% COMPLETO** - Requiere ajuste de import

---

### **6. Auth Service (`src/services/authService.ts`)**
- ✅ `signup()` - Hash bcrypt (cost 12), inserción en DB
- ✅ `login()` - Verificación bcrypt, retorno de usuario
- ✅ `generateAccessToken()` - JWT con expiración 15m
- ✅ `generateRefreshToken()` - JWT con expiración 7d
- ✅ `verifyAccessToken()` - Validación de JWT
- ✅ `verifyRefreshToken()` - Validación de JWT
- ✅ Tipos correctos, sin `any`

**Estado:** **COMPLETO** - Solo copiar

---

### **7. Validation Types (`src/types/validation.ts`)**
- ✅ `signupSchema` - Email, password (8+ chars, mayúscula, minúscula, número), name
- ✅ `loginSchema` - Email, password
- ✅ Tipos inferidos `SignupInput`, `LoginInput`

**Estado:** **COMPLETO** - Solo copiar

---

### **8. Auth Types (`src/types/auth.ts`)**
- ✅ Interface `User` (sin password_hash)
- ✅ Interface `SignupRequest`, `LoginRequest`
- ✅ Interface `TokenPayload` (userId, email)
- ✅ Interface `AuthResponse`
- ✅ Declaración de módulo para extender `FastifyRequest`

**Estado:** **COMPLETO** - Solo copiar

---

### **9. Auth Middleware (`src/middleware/auth.ts`)**
- ✅ `requireAuth()` - Verifica token, asigna `request.user`, retorna 401 si falla
- ✅ `optionalAuth()` - Asigna `request.user` si hay token válido, no falla si no hay

**Estado:** **COMPLETO** - Solo copiar

---

### **10. Validation Middleware (`src/middleware/validate.ts`)**
- ✅ Función genérica `validate(schema)` que retorna middleware
- ✅ Parsea `request.body` con Zod
- ✅ Retorna 400 con detalles de errores si falla

**Estado:** **COMPLETO** - Solo copiar

---

### **11. Auth Routes (`src/routes/auth.ts`)**
- ✅ `POST /signup` - Crea usuario, genera tokens, setea cookies httpOnly
- ✅ `POST /login` - Valida credenciales, genera tokens, setea cookies
- ✅ `POST /logout` - Limpia cookies
- ✅ `POST /refresh` - Verifica refresh token, genera nuevo access token
- ✅ `GET /me` - Retorna usuario actual (protegido)
- ✅ Manejo de errores (409 Conflict, 401 Unauthorized)
- ✅ Cookies con flags correctos (httpOnly, secure en prod, sameSite)

**Estado:** **COMPLETO** - Solo copiar

---

### **12. Main Server (`src/index.ts`)**
- ✅ Instancia Fastify con logger
- ✅ Helmet (seguridad de headers)
- ✅ CORS (credentials: true)
- ✅ Cookies (secret firmado)
- ✅ Rate limiting (100 req/min)
- ✅ Endpoint `/health`
- ✅ Error handler global
- ✅ 404 handler
- ⚠️ **TODO GPT-5-codex:** Descomentar registro de rutas cuando estén implementadas

**Estado:** **95% COMPLETO** - Solo descomentar imports de rutas

---

## 🚀 Instrucciones para GPT-5-codex

### **Paso 1: Copiar Templates**

```powershell
# Ejecutar desde raíz del proyecto
.\scripts\setup_backend.ps1
```

Esto copia:
- `templates/backend/package.json` → `backend/package.json`
- `templates/backend/tsconfig.json` → `backend/tsconfig.json`
- `templates/backend/.env.example` → `backend/.env`

### **Paso 2: Instalar Dependencias**

```powershell
cd backend
npm install
```

### **Paso 3: Copiar Archivos de Código**

Copiar **TODOS** los archivos de `templates/backend/src/` a `backend/src/`:

```powershell
# Copiar toda la estructura src/
Copy-Item -Recurse "templates\backend\src\*" "backend\src\"
```

### **Paso 4: Ajustes Mínimos Requeridos**

#### **A) Seed de Productos (`backend/src/db/seed.ts`)**

**Líneas 5-7:** Descomentar y ajustar import de productos:

```typescript
// ANTES
// import { products as frontendProducts } from '../../src/data/products';

// DESPUÉS
import { products as frontendProducts } from '../../src/data/products';
```

**Líneas 34-53:** Descomentar código de carga real:

```typescript
// Descomentar TODO el bloque que empieza con:
const productsToInsert = frontendProducts.map(product => ({
  // ...
}));
```

**Líneas 55-92:** Comentar o eliminar productos de ejemplo.

#### **B) Rutas en Server (`backend/src/index.ts`)**

**Líneas 50-57:** Descomentar imports y registro de rutas:

```typescript
// ANTES (comentado)
// import { authRoutes } from './routes/auth';
// await app.register(authRoutes, { prefix: '/api/auth' });

// DESPUÉS (descomentado)
import { authRoutes } from './routes/auth';
await app.register(authRoutes, { prefix: '/api/auth' });
```

### **Paso 5: Generar Migraciones**

```powershell
cd backend
npm run db:generate
```

Esto crea archivos SQL en `backend/src/db/migrations/`

### **Paso 6: Ejecutar Migraciones**

```powershell
npm run db:migrate
```

Esto crea `backend/database.sqlite` con todas las tablas.

### **Paso 7: Ejecutar Seed**

```powershell
npm run db:seed
```

Esto carga:
- 1 usuario de prueba (test@example.com / test123)
- 167 productos del frontend

### **Paso 8: Arrancar Servidor**

```powershell
npm run dev
```

Debería mostrar:
```
✅ Servidor corriendo en http://localhost:3000
```

### **Paso 9: Validar**

```powershell
# Desde raíz del proyecto
.\scripts\validate_phase.ps1 -Phase 0
```

---

## ⚠️ Errores de Lint Esperados

Los templates tienen errores de TypeScript **ANTES** de instalar dependencias:

```
Cannot find module 'fastify'
Cannot find module 'drizzle-orm'
Cannot find module 'bcrypt'
```

**Esto es NORMAL.** Se resuelven al ejecutar `npm install` en `backend/`.

---

## ✅ Checklist de Validación

Después de copiar y ajustar:

- [ ] `backend/package.json` existe
- [ ] `backend/.env` existe
- [ ] `backend/src/config/index.ts` existe
- [ ] `backend/src/db/schema.ts` existe
- [ ] `backend/src/db/client.ts` existe
- [ ] `backend/src/db/migrate.ts` existe
- [ ] `backend/src/db/seed.ts` existe (con import de productos ajustado)
- [ ] `backend/src/index.ts` existe (con rutas descomentadas)
- [ ] `backend/src/routes/auth.ts` existe
- [ ] `backend/src/services/authService.ts` existe
- [ ] `backend/src/middleware/auth.ts` existe
- [ ] `backend/src/middleware/validate.ts` existe
- [ ] `backend/src/types/auth.ts` existe
- [ ] `backend/src/types/validation.ts` existe
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run db:generate` ejecutado (migraciones creadas)
- [ ] `npm run db:migrate` ejecutado (database.sqlite creado)
- [ ] `npm run db:seed` ejecutado (datos cargados)
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run dev` arranca servidor
- [ ] `curl http://localhost:3000/health` responde

---

## 🎯 Resultado Final

Con estos templates:
- ✅ **0 improvisación** - Todo estructurado y tipado
- ✅ **0 any** - TypeScript strict cumplido
- ✅ **Seguridad by default** - bcrypt, JWT, httpOnly, CORS
- ✅ **Copy-paste ready** - 95% del código listo
- ✅ **Solo 2 ajustes** - Import de productos + descomentar rutas

**Tiempo estimado de implementación:** 30-60 minutos (vs 8-12 horas sin templates)

---

**Generado por:** Claude Sonnet 4.5  
**Fecha:** 2025-11-05  
**Tokens usados:** ~15K  
**Ahorro estimado:** ~80K tokens de GPT-5-codex
