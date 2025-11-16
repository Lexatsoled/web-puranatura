# 🤖 Instrucciones para GPT-5-codex - Fase 0: Setup Backend

**Fecha:** 2025-11-05  
**Tarea:** Configurar backend Node.js + SQLite + Drizzle ORM  
**Tiempo estimado:** 30-40 minutos  
**Dificultad:** BAJA (templates completos provistos)

---

## 📋 **Contexto Previo**

Claude Sonnet 4.5 ha preparado:
- ✅ Plan de migración completo (5 fases)
- ✅ 12 templates de código backend (95% implementados)
- ✅ Scripts de automatización PowerShell
- ✅ Checklists de validación

**Tu trabajo:** Ejecutar Fase 0 usando los templates provistos (NO improvises código).

---

## 🎯 **Objetivo de Fase 0**

Crear backend funcional con:
- ✅ Estructura de carpetas
- ✅ Dependencias instaladas
- ✅ Base de datos SQLite con 5 tablas
- ✅ Usuario de prueba (test@example.com / test123)
- ✅ 167 productos cargados
- ✅ Servidor Fastify corriendo en http://localhost:3000
- ✅ Endpoints de autenticación funcionando

---

## 📖 **Paso 1: Leer Documentación (OBLIGATORIO)**

Lee **EN ORDEN**:

1. `docs/KIT_MIGRACION_README.md` - Visión general del proyecto
2. `docs/PLAN_MIGRACION_COMPLETO.md` - Plan maestro (5 fases)
3. `docs/fase0_setup_backend.md` - Instrucciones detalladas Fase 0
4. `templates/backend/README_TEMPLATES.md` - Guía de templates

**NO continúes sin leer estos 4 documentos.**

---

## 🚀 **Paso 2: Crear Estructura de Carpetas**

```powershell
# Desde raíz del proyecto (Web Puranatura\Pureza-Naturalis-V3)
cd "c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3"

# Crear carpetas backend
New-Item -ItemType Directory -Force -Path "backend\src\config"
New-Item -ItemType Directory -Force -Path "backend\src\db"
New-Item -ItemType Directory -Force -Path "backend\src\db\migrations"
New-Item -ItemType Directory -Force -Path "backend\src\types"
New-Item -ItemType Directory -Force -Path "backend\src\services"
New-Item -ItemType Directory -Force -Path "backend\src\middleware"
New-Item -ItemType Directory -Force -Path "backend\src\routes"
```

**Validar:**
```powershell
# Deberías ver estas carpetas:
Get-ChildItem backend\src -Directory
```

---

## 📦 **Paso 3: Copiar Templates Base**

```powershell
# Copiar archivos de configuración
Copy-Item "templates\backend\package.json" "backend\package.json"
Copy-Item "templates\backend\tsconfig.json" "backend\tsconfig.json"
Copy-Item "templates\backend\.env.example" "backend\.env"
```

**Validar:**
```powershell
Test-Path backend\package.json
Test-Path backend\tsconfig.json
Test-Path backend\.env
```

Deberían retornar `True`.

---

## 💻 **Paso 4: Copiar Código Fuente**

```powershell
# Copiar TODOS los archivos TypeScript
Copy-Item "templates\backend\src\config\index.ts" "backend\src\config\index.ts"
Copy-Item "templates\backend\src\db\schema.ts" "backend\src\db\schema.ts"
Copy-Item "templates\backend\src\db\client.ts" "backend\src\db\client.ts"
Copy-Item "templates\backend\src\db\migrate.ts" "backend\src\db\migrate.ts"
Copy-Item "templates\backend\src\db\seed.ts" "backend\src\db\seed.ts"
Copy-Item "templates\backend\src\index.ts" "backend\src\index.ts"
Copy-Item "templates\backend\src\services\authService.ts" "backend\src\services\authService.ts"
Copy-Item "templates\backend\src\types\auth.ts" "backend\src\types\auth.ts"
Copy-Item "templates\backend\src\types\validation.ts" "backend\src\types\validation.ts"
Copy-Item "templates\backend\src\middleware\auth.ts" "backend\src\middleware\auth.ts"
Copy-Item "templates\backend\src\middleware\validate.ts" "backend\src\middleware\validate.ts"
Copy-Item "templates\backend\src\routes\auth.ts" "backend\src\routes\auth.ts"
```

**Validar:**
```powershell
Get-ChildItem backend\src -Recurse -File | Measure-Object | Select-Object Count
```

Debería mostrar **12 archivos**.

---

## 🔧 **Paso 5: Ajustar Imports (CRÍTICO)**

### **A) Archivo: `backend\src\db\seed.ts`**

**Línea 6:** Descomentar import de productos:

```typescript
// ANTES
// import { products as frontendProducts } from '../../src/data/products';

// DESPUÉS
import { products as frontendProducts } from '../../../src/data/products';
```

**⚠️ IMPORTANTE:** La ruta es `../../../src/data/products` (3 niveles arriba desde `backend/src/db/`).

**Líneas 34-53:** Descomentar todo el bloque de mapeo de productos:

```typescript
// DESCOMENTAR desde aquí:
const productsToInsert = frontendProducts.map(product => ({
  name: product.name,
  description: product.description,
  // ... (resto del código)
}));

await db.insert(products).values(productsToInsert);
console.log(`✅ ${productsToInsert.length} productos cargados`);
// HASTA aquí
```

**Líneas 55-92:** **ELIMINAR o comentar** los productos de ejemplo (Omega-3, Té Verde).

---

### **B) Archivo: `backend\src\index.ts`**

**Líneas 50-57:** Descomentar imports y registro de rutas:

```typescript
// ANTES
// import { authRoutes } from './routes/auth';
// await app.register(authRoutes, { prefix: '/api/auth' });

// DESPUÉS
import { authRoutes } from './routes/auth';

// ... (dentro de app.listen)
await app.register(authRoutes, { prefix: '/api/auth' });
```

---

## 📦 **Paso 6: Instalar Dependencias**

```powershell
cd backend
npm install
```

**Esto instalará:**
- fastify 4.x
- drizzle-orm 0.35+
- better-sqlite3
- bcrypt 5.x
- jsonwebtoken 9.x
- zod 3.x
- dotenv 16.x
- helmet, cors, rate-limit

**Tiempo estimado:** 2-3 minutos.

**Validar:**
```powershell
Test-Path node_modules\fastify
Test-Path node_modules\drizzle-orm
Test-Path node_modules\bcrypt
```

---

## 🗄️ **Paso 7: Generar Migraciones**

```powershell
npm run db:generate
```

**Qué hace:** Genera archivos SQL en `backend/src/db/migrations/` basándose en `schema.ts`.

**Output esperado:**
```
✅ Migración generada: 0000_init.sql
```

**Validar:**
```powershell
Get-ChildItem src\db\migrations
```

Debería mostrar al menos 1 archivo `.sql`.

---

## 🚀 **Paso 8: Ejecutar Migraciones**

```powershell
npm run db:migrate
```

**Qué hace:** Crea `backend/database.sqlite` con las 5 tablas.

**Output esperado:**
```
✅ Migraciones ejecutadas correctamente
```

**Validar:**
```powershell
Test-Path database.sqlite
```

Debería retornar `True`.

---

## 🌱 **Paso 9: Ejecutar Seed**

```powershell
npm run db:seed
```

**Qué hace:** 
1. Crea usuario `test@example.com` (password: `test123`)
2. Carga 167 productos desde `src/data/products.ts`

**Output esperado:**
```
✅ Usuario de prueba creado: test@example.com
✅ 167 productos cargados
✅ Seed completado
```

**⚠️ SI FALLA:**
- Verifica que ajustaste el import en `seed.ts` (paso 5A)
- Verifica que existe `src/data/products.ts` en el proyecto

---

## 🏃 **Paso 10: Arrancar Servidor**

```powershell
npm run dev
```

**Output esperado:**
```
[fastify] Server listening at http://localhost:3000
✅ Servidor corriendo en http://localhost:3000
```

**NO cierres esta terminal** - deja el servidor corriendo.

---

## ✅ **Paso 11: Probar Endpoints (Nueva Terminal)**

Abre una **NUEVA terminal PowerShell** y ejecuta:

```powershell
# Test 1: Health check
curl http://localhost:3000/health

# Debería responder:
# {"status":"ok","timestamp":"..."}

# Test 2: Signup
curl -X POST http://localhost:3000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"email":"prueba@test.com","password":"Test1234","name":"Usuario Prueba"}'

# Debería responder:
# {"user":{"id":2,"email":"prueba@test.com","name":"Usuario Prueba"},"message":"Usuario creado correctamente"}

# Test 3: Login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"test123"}' `
  -c cookies.txt

# Debería responder:
# {"user":{...},"message":"Login exitoso"}

# Test 4: Get user (autenticado)
curl http://localhost:3000/api/auth/me -b cookies.txt

# Debería responder:
# {"id":1,"email":"test@example.com","name":"Usuario Test"}
```

**Si todos los tests pasan → ✅ Fase 0 COMPLETADA**

---

## 🧪 **Paso 12: Validación Automática**

Vuelve a la raíz del proyecto:

```powershell
cd ..
.\scripts\validate_phase.ps1 -Phase 0
```

**Output esperado:**
```
✅ Fase 0: Setup Backend - COMPLETADO
  ✅ Estructura de carpetas
  ✅ Dependencias instaladas
  ✅ Migraciones generadas
  ✅ Base de datos creada
  ✅ Seed ejecutado
  ✅ TypeScript sin errores
  ✅ Servidor arranca correctamente
```

---

## 📊 **Checklist Final**

Marca cada item:

- [ ] Carpetas `backend/src/*` creadas
- [ ] Archivos base copiados (package.json, tsconfig.json, .env)
- [ ] 12 archivos TypeScript copiados
- [ ] Import de productos ajustado en `seed.ts`
- [ ] Rutas descomentadas en `index.ts`
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run db:generate` generó migraciones
- [ ] `npm run db:migrate` creó database.sqlite
- [ ] `npm run db:seed` cargó 167 productos + usuario test
- [ ] `npm run dev` arranca servidor en puerto 3000
- [ ] `/health` responde correctamente
- [ ] `/api/auth/signup` crea usuarios
- [ ] `/api/auth/login` autentica usuarios
- [ ] `/api/auth/me` retorna datos del usuario autenticado
- [ ] Script de validación pasa sin errores

---

## ⚠️ **Troubleshooting**

### **Error: "Cannot find module 'fastify'"**
**Solución:** Ejecuta `npm install` en `backend/`.

### **Error: "products is not defined" en seed.ts**
**Solución:** Verifica el import en línea 6: debe ser `../../../src/data/products`.

### **Error: "database is locked"**
**Solución:** 
```powershell
# Detener servidor (Ctrl+C)
Remove-Item backend\database.sqlite
npm run db:migrate
npm run db:seed
```

### **Error: "Port 3000 already in use"**
**Solución:** 
```powershell
# Opción 1: Matar proceso
Get-Process -Name node | Stop-Process -Force

# Opción 2: Cambiar puerto en backend\.env
# PORT=3001
```

### **Error: TypeScript no encuentra tipos**
**Solución:**
```powershell
cd backend
npm install --save-dev @types/node @types/bcrypt @types/jsonwebtoken
```

---

## 📝 **Reportar Progreso**

Cuando termines, copia y pega este mensaje al usuario:

```
✅ FASE 0 COMPLETADA

Backend configurado exitosamente:
- ✅ Servidor Fastify corriendo en http://localhost:3000
- ✅ Base de datos SQLite con 5 tablas
- ✅ 167 productos cargados
- ✅ Usuario test: test@example.com / test123
- ✅ Endpoints de autenticación funcionando

Próximos pasos:
1. ¿Deseas que continúe con FASE 1 (Frontend Auth)?
2. ¿O prefieres revisar el backend antes de continuar?

Tiempo invertido: [X minutos]
Errores encontrados: [N]
```

---

## 🎯 **Siguiente Fase**

Una vez validada Fase 0, la **Fase 1** consiste en:
1. Conectar frontend a endpoints de auth
2. Reemplazar `authContext.tsx` por llamadas a API
3. Eliminar `secureStorage.ts` y `jwtUtils.ts`
4. Implementar cookies httpOnly en frontend

**Documentación:** `docs/fase1_autenticacion.md`

---

## 💡 **Notas Importantes**

1. **NO modifiques los templates** - están completamente implementados
2. **NO agregues código nuevo** - solo copia y ajusta imports
3. **NO uses `any`** - todo está tipado con TypeScript strict
4. **SI encuentras un error** - repórtalo antes de improvisar soluciones
5. **USA los scripts de validación** - automatizan verificaciones

---

**Generado por:** Claude Sonnet 4.5  
**Para:** GPT-5-codex  
**Consumo estimado:** 10-15K tokens  
**ROI:** ~5-6x (vs implementación desde cero)

---

## 🚀 **¡Adelante! Comienza con el Paso 1.**
