# FASE 0: Setup Backend - Instrucciones Paso a Paso

## Objetivo
Crear la estructura completa del backend con Fastify + Drizzle + SQLite y validar que el servidor arranca correctamente.

---

## Pre-requisitos
- ✅ Node.js 20+ instalado
- ✅ npm 10+ instalado
- ✅ Terminal PowerShell abierta
- ✅ Plan de migración completo leído

---

## Pasos de Ejecución

### **PASO 1: Crear estructura de carpetas**

```powershell
# Desde Pureza-Naturalis-V3/
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"

# Crear carpetas backend
New-Item -ItemType Directory -Force -Path "backend\src\config"
New-Item -ItemType Directory -Force -Path "backend\src\db\migrations"
New-Item -ItemType Directory -Force -Path "backend\src\routes"
New-Item -ItemType Directory -Force -Path "backend\src\middleware"
New-Item -ItemType Directory -Force -Path "backend\src\services"
New-Item -ItemType Directory -Force -Path "backend\src\types"
New-Item -ItemType Directory -Force -Path "backend\tests"

Write-Host "✅ Estructura creada" -ForegroundColor Green
```

**Validación:**
```powershell
Test-Path "backend\src" # debe retornar True
```

---

### **PASO 2: Crear package.json del backend**

**Acción:** Crear archivo `backend/package.json` con el contenido del template `templates/backend/package.json`.

**Contenido esperado:**
```json
{
  "name": "pureza-naturalis-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:once": "vitest run",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx src/db/migrate.ts",
    "db:seed": "tsx src/db/seed.ts",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@fastify/cookie": "^9.3.1",
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/rate-limit": "^9.1.0",
    "bcrypt": "^5.1.1",
    "better-sqlite3": "^11.5.0",
    "dotenv": "^16.4.5",
    "drizzle-orm": "^0.35.0",
    "fastify": "^4.28.0",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/better-sqlite3": "^7.6.11",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.7.0",
    "drizzle-kit": "^0.26.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0"
  }
}
```

**Comando:**
```powershell
# Copiar desde template (el template ya estará preparado)
Copy-Item "templates\backend\package.json" "backend\package.json"
```

**Validación:**
```powershell
Test-Path "backend\package.json" # debe retornar True
```

---

### **PASO 3: Crear tsconfig.json del backend**

**Acción:** Crear archivo `backend/tsconfig.json` con el contenido del template.

**Contenido esperado:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node", "vitest/globals"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Comando:**
```powershell
Copy-Item "templates\backend\tsconfig.json" "backend\tsconfig.json"
```

**Validación:**
```powershell
Test-Path "backend\tsconfig.json" # debe retornar True
```

---

### **PASO 4: Instalar dependencias**

```powershell
cd backend
npm install
```

**Tiempo estimado:** 2-3 minutos.

**Validación:**
```powershell
Test-Path "backend\node_modules" # debe retornar True
npm list fastify --depth=0 # debe mostrar fastify instalado
```

---

### **PASO 5: Crear archivo .env**

**Acción:** Crear `backend/.env` con configuración de desarrollo.

**Contenido:**
```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=./database.sqlite

# JWT Secrets (GENERAR NUEVOS EN PRODUCCIÓN)
JWT_SECRET=dev_secret_cambiar_en_produccion_min_64_chars_1234567890abcdef
JWT_REFRESH_SECRET=dev_refresh_secret_cambiar_en_produccion_min_64_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

**⚠️ IMPORTANTE:**
- Estos secrets son SOLO para desarrollo
- En producción: generar con `openssl rand -base64 64`

**Comando:**
```powershell
# Copiar desde template
Copy-Item "templates\backend\.env.example" "backend\.env"
```

**Validación:**
```powershell
Test-Path "backend\.env" # debe retornar True
```

---

### **PASO 6: Crear configuración (config/index.ts)**

**Acción:** Crear `backend/src/config/index.ts` con el template.

**Contenido esperado (ver template completo):**
```typescript
// TODO: Implementar carga de variables de entorno con dotenv
// TODO: Validar variables requeridas con Zod
// TODO: Exportar config tipado
```

**Comando:**
```powershell
Copy-Item "templates\backend\src\config\index.ts" "backend\src\config\index.ts"
```

**Qué debe implementar GPT-5-codex:**
1. Importar dotenv y cargar .env
2. Crear schema Zod para validar variables
3. Parsear y exportar config

**Validación:**
```powershell
Test-Path "backend\src\config\index.ts" # debe retornar True
```

---

### **PASO 7: Crear schema de base de datos (db/schema.ts)**

**Acción:** Crear `backend/src/db/schema.ts` con el template de Drizzle.

**Tablas a definir:**
1. `users` (id, email, password_hash, name, created_at)
2. `products` (id, name, description, price, stock, category, images, created_at)
3. `cart_items` (id, user_id, product_id, quantity)
4. `orders` (id, user_id, total, status, created_at)
5. `order_items` (id, order_id, product_id, quantity, price)

**Comando:**
```powershell
Copy-Item "templates\backend\src\db\schema.ts" "backend\src\db\schema.ts"
```

**Qué debe implementar GPT-5-codex:**
- Definir todas las tablas con drizzle-orm
- Relaciones (foreign keys)
- Índices en columnas frecuentes

**Validación:**
```powershell
Test-Path "backend\src\db\schema.ts" # debe retornar True
```

---

### **PASO 8: Crear cliente de base de datos (db/client.ts)**

**Acción:** Crear `backend/src/db/client.ts` para conexión SQLite.

**Comando:**
```powershell
Copy-Item "templates\backend\src\db\client.ts" "backend\src\db\client.ts"
```

**Qué debe implementar GPT-5-codex:**
```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// TODO: Crear conexión SQLite
// TODO: Configurar PRAGMA (journal_mode, foreign_keys, busy_timeout)
// TODO: Exportar instancia drizzle
```

**Validación:**
```powershell
Test-Path "backend\src\db\client.ts" # debe retornar True
```

---

### **PASO 9: Crear script de migraciones (db/migrate.ts)**

**Acción:** Crear `backend/src/db/migrate.ts` para ejecutar migraciones.

**Comando:**
```powershell
Copy-Item "templates\backend\src\db\migrate.ts" "backend\src\db\migrate.ts"
```

**Qué debe implementar GPT-5-codex:**
```typescript
// TODO: Ejecutar migraciones de drizzle-kit
// TODO: Loggear proceso
```

**Validación:**
```powershell
Test-Path "backend\src\db\migrate.ts" # debe retornar True
```

---

### **PASO 10: Generar migraciones SQL**

```powershell
cd backend
npm run db:generate
```

**Resultado esperado:**
- Carpeta `backend/src/db/migrations/` con archivos `.sql`

**Validación:**
```powershell
Test-Path "backend\src\db\migrations\*.sql" # debe retornar True
```

---

### **PASO 11: Ejecutar migraciones**

```powershell
npm run db:migrate
```

**Resultado esperado:**
- Archivo `backend/database.sqlite` creado
- Tablas: users, products, cart_items, orders, order_items

**Validación:**
```powershell
Test-Path "backend\database.sqlite" # debe retornar True

# Verificar tablas con SQLite CLI (si está instalado)
sqlite3 database.sqlite ".tables"
# Debe mostrar: users products cart_items orders order_items
```

---

### **PASO 12: Crear script de seed (db/seed.ts)**

**Acción:** Crear `backend/src/db/seed.ts` para cargar productos iniciales.

**Comando:**
```powershell
Copy-Item "templates\backend\src\db\seed.ts" "backend\src\db\seed.ts"
```

**Qué debe implementar GPT-5-codex:**
```typescript
// TODO: Leer productos de ../../frontend/src/data/products.ts
// TODO: Transformar formato a schema de DB
// TODO: Insertar en tabla products
// TODO: Crear usuario de prueba (email: test@example.com, password: test123)
```

**Validación:**
```powershell
Test-Path "backend\src\db\seed.ts" # debe retornar True
```

---

### **PASO 13: Ejecutar seed**

```powershell
npm run db:seed
```

**Resultado esperado:**
- 167 productos insertados
- 1 usuario de prueba creado

**Validación:**
```powershell
sqlite3 database.sqlite "SELECT COUNT(*) FROM products;"
# Debe mostrar: 167

sqlite3 database.sqlite "SELECT email FROM users LIMIT 1;"
# Debe mostrar: test@example.com
```

---

### **PASO 14: Crear servidor Fastify (index.ts)**

**Acción:** Crear `backend/src/index.ts` con servidor básico.

**Comando:**
```powershell
Copy-Item "templates\backend\src\index.ts" "backend\src\index.ts"
```

**Qué debe implementar GPT-5-codex:**
```typescript
// TODO: Importar Fastify
// TODO: Registrar plugins (helmet, cors, cookie, rate-limit)
// TODO: Registrar rutas
// TODO: Endpoint GET /health
// TODO: Error handler
// TODO: Arrancar servidor en PORT
```

**Contenido mínimo esperado:**
```typescript
import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { config } from './config';

const app = Fastify({ logger: true });

// Plugins
await app.register(helmet);
await app.register(cors, { origin: config.ALLOWED_ORIGINS });
await app.register(cookie);

// Health check
app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// Start
app.listen({ port: config.PORT, host: '0.0.0.0' });
```

**Validación:**
```powershell
Test-Path "backend\src\index.ts" # debe retornar True
```

---

### **PASO 15: Arrancar servidor**

```powershell
npm run dev
```

**Resultado esperado:**
```
Server listening at http://0.0.0.0:3000
```

**Validación:**
```powershell
# En otra terminal
curl http://localhost:3000/health
# Debe retornar: {"status":"ok","timestamp":"2025-11-05T..."}
```

---

### **PASO 16: Ejecutar type-check**

```powershell
npm run type-check
```

**Resultado esperado:**
```
✓ 0 errores TypeScript
```

**Si hay errores:**
- Leer mensaje de error
- Revisar archivo indicado
- Corregir tipos
- Volver a ejecutar

---

### **PASO 17: Ejecutar tests básicos**

```powershell
npm run test:once
```

**Resultado esperado:**
```
✓ health endpoint returns status ok
```

**Si fallan tests:**
- Leer output de error
- Revisar test fallido
- Corregir código
- Volver a ejecutar

---

## Validación Final de Fase 0

Ejecutar script de validación:

```powershell
cd ..
.\scripts\validate_phase.ps1 -Phase 0
```

**Checklist automático:**
- [x] Estructura backend/ existe
- [x] package.json válido
- [x] Dependencias instaladas
- [x] database.sqlite creado
- [x] 167 productos en DB
- [x] Servidor arranca en :3000
- [x] GET /health responde
- [x] npm run type-check limpio
- [x] npm run test pasa

**Si todo pasa: ✅ FASE 0 COMPLETADA**

---

## Troubleshooting

### Error: "Cannot find module 'fastify'"
**Solución:**
```powershell
cd backend
npm install
```

### Error: "database.sqlite locked"
**Solución:**
```powershell
# Cerrar servidor dev (Ctrl+C)
# Eliminar database.sqlite
Remove-Item database.sqlite
# Volver a ejecutar migraciones y seed
npm run db:migrate
npm run db:seed
```

### Error: "Port 3000 already in use"
**Solución:**
```powershell
# Cambiar puerto en .env
# O matar proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error de tipos en schema.ts
**Solución:**
- Verificar que drizzle-orm y better-sqlite3 estén instalados
- Revisar imports en schema.ts
- Consultar docs: https://orm.drizzle.team/docs/sql-schema-declaration

---

## Próximos pasos

Una vez completada Fase 0:
1. ✅ Validar checklist completo
2. ⏳ Proceder a `docs/fase1_autenticacion.md`
3. ⏳ Implementar endpoints de auth

---

**Tiempo estimado total:** 3-5 horas  
**Dificultad:** Media  
**Bloqueadores conocidos:** Ninguno
