# TASK-003: Documentar Gestión de Secretos

**PRIORIDAD:** CRÍTICA  
**FASE:** 1 - Seguridad  
**DEPENDENCIAS:** TASK-001 (completada), TASK-002 (completada)  
**TIEMPO ESTIMADO:** 2 horas

---

## CONTEXTO

Tras implementar detección de secretos (TASK-001) y auditar historial (TASK-002), necesitamos documentación exhaustiva sobre cómo el equipo debe gestionar secretos. Esto previene errores humanos futuros.

**HALLAZGO RELACIONADO:** SEC-SECRETS-001 (parcialmente resuelto, falta documentación)

---

## OBJETIVO

Crear documentación completa y clara sobre:
1. Qué son secretos y por qué no deben comitearse
2. Cómo usar `.env` correctamente (raíz vs backend)
3. Workflow para añadir nuevos secretos
4. Qué hacer si accidentalmente comiteas un secreto
5. Configuración de variables en producción

---

## INSTRUCCIONES DETALLADAS

### PASO 1: Crear Documentación Principal

**Archivo:** `docs/SECRETS_MANAGEMENT.md`

```markdown
# Gestión de Secretos - Pureza Naturalis

## 📌 Principios Fundamentales

### ¿Qué es un secreto?

Un **secreto** es cualquier información que podría comprometer la seguridad si se hace pública:

- ✅ **SON SECRETOS:**
  - API Keys de servicios externos (Stripe, Sentry, etc.)
  - Claves JWT (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
  - Credenciales de bases de datos
  - Tokens de autenticación
  - Webhooks secrets
  - Claves de cifrado

- ❌ **NO SON SECRETOS:**
  - URLs públicas de APIs
  - Variables de entorno para frontend (`VITE_*`)
  - Configuraciones de build
  - Nombres de servicios

### ¿Por qué NO commitear secretos?

1. **Historial permanente:** Git nunca olvida. Aunque elimines el commit, persiste en historial.
2. **Forks públicos:** Cualquiera puede clonar el repo y acceder al historial.
3. **Rotación costosa:** Si filtras un secreto, debes regenerarlo en TODOS los servicios.
4. **Compliance:** Regulaciones como GDPR/PCI-DSS prohíben exponer secretos.

---

## 🗂️ Estructura de Archivos `.env`

### `.env` (raíz del proyecto)

**PROPÓSITO:** Variables **públicas** para el frontend (Vite).

**CARACTERÍSTICAS:**
- ✅ **SÍ versionado** en Git (estos valores son públicos)
- ✅ Solo variables con prefijo `VITE_*`
- ✅ Valores seguros para exponer al cliente

**EJEMPLO:**
```env
# Frontend - Variables públicas
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SENTRY_DSN=https://public-key@sentry.io/123456
VITE_APP_VERSION=3.0.0
VITE_ENABLE_ANALYTICS=true
```

**⚠️ REGLA DE ORO:** Si una variable NO tiene prefijo `VITE_`, NO debe estar en este archivo.

---

### `backend/.env` (backend del proyecto)

**PROPÓSITO:** Variables **secretas** para el servidor.

**CARACTERÍSTICAS:**
- ❌ **NO versionado** en Git (protegido por `.gitignore`)
- ❌ Nunca exponer al cliente
- ✅ Solo accesible en servidor Node.js

**EJEMPLO:**
```env
# Backend - Variables secretas
JWT_SECRET=super-secret-key-change-in-production-abc123xyz
JWT_REFRESH_SECRET=refresh-secret-key-different-from-jwt
STRIPE_SECRET_KEY=sk_test_51Abc...
DATABASE_URL=file:./database.sqlite
SENTRY_DSN=https://secret-key@sentry.io/backend
```

**⚠️ ADVERTENCIA:** Este archivo contiene secretos REALES. NUNCA lo comitees.

---

## 📋 Workflows Comunes

### ✅ Añadir Nueva Variable de Entorno

#### Para Frontend (variable pública)

1. **Añadir a `.env` (raíz):**
   ```env
   VITE_NEW_API_URL=https://api.example.com
   ```

2. **Actualizar TypeScript types:**
   ```typescript
   // src/vite-env.d.ts
   interface ImportMetaEnv {
     readonly VITE_NEW_API_URL: string;
     // ...otras variables
   }
   ```

3. **Usar en código:**
   ```typescript
   const apiUrl = import.meta.env.VITE_NEW_API_URL;
   ```

4. **Commitear cambios:**
   ```bash
   git add .env src/vite-env.d.ts
   git commit -m "feat: añadir variable VITE_NEW_API_URL"
   ```

#### Para Backend (variable secreta)

1. **Añadir a `backend/.env.example`:**
   ```env
   NEW_SECRET_KEY=your-secret-here
   ```

2. **Añadir a `backend/.env` (local):**
   ```env
   NEW_SECRET_KEY=actual-secret-value-abc123
   ```

3. **Usar en código:**
   ```typescript
   // backend/src/config/env.ts
   export const config = {
     newSecretKey: process.env.NEW_SECRET_KEY!,
   };
   ```

4. **Verificar que NO se commitea:**
   ```bash
   git status
   # backend/.env NO debe aparecer
   ```

5. **Commitear solo el ejemplo:**
   ```bash
   git add backend/.env.example
   git commit -m "docs: añadir NEW_SECRET_KEY a .env.example"
   ```

---

### 🚨 Accidentalmente Comiteé un Secreto

**SI ACABAS DE HACER COMMIT (sin push):**

1. **Eliminar el commit:**
   ```bash
   git reset --soft HEAD~1
   ```

2. **Eliminar secreto del archivo:**
   ```bash
   # Editar backend/.env y eliminar el secreto
   ```

3. **Verificar:**
   ```bash
   git status
   # backend/.env NO debe aparecer
   ```

4. **Crear nuevo commit (sin el secreto):**
   ```bash
   git add .
   git commit -m "feat: implementar nueva funcionalidad"
   ```

**SI YA HICISTE PUSH:**

1. **⚠️ URGENTE: Rotar el secreto inmediatamente**
   - Generar nueva clave en el servicio (Stripe, JWT, etc.)
   - Actualizar `backend/.env` local
   - Actualizar variables en producción

2. **Limpiar historial de Git:**
   ```bash
   # Ejecutar script de limpieza
   node scripts/remove-secret-from-history.js
   
   # Forzar push (PELIGROSO - coordinar con equipo)
   git push --force
   ```

3. **Notificar al equipo:**
   - Informar que secreto fue expuesto
   - Compartir nuevo secreto de forma segura (1Password, etc.)
   - Confirmar que todos actualizaron sus `.env`

---

## 🔐 Gestión en Producción

### Variables en Render.com / Railway / Vercel

1. **Acceder al dashboard del servicio**
2. **Ir a "Environment Variables"**
3. **Añadir variables UNA POR UNA:**
   ```
   JWT_SECRET=production-secret-abc123xyz
   JWT_REFRESH_SECRET=production-refresh-secret-def456uvw
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

4. **NO copiar/pegar desde `backend/.env`** (previene errores)

5. **Redeploy del servicio**

### Verificar Variables en Producción

```bash
# SSH al servidor (si es posible)
printenv | grep JWT_SECRET

# O crear endpoint temporal de diagnóstico
GET /api/health/env-check
{
  "jwt_secret_set": true,
  "jwt_secret_length": 32,
  "database_connected": true
}
```

---

## 🛡️ Herramientas de Protección

### Gitleaks (Detección Automática)

Ejecutar antes de cada commit:

```bash
npm run scan:secrets
```

Si detecta secretos:
```
❌ Error: Se encontraron secretos en:
   - backend/.env:5 (JWT_SECRET)
```

**ACCIÓN:** Eliminar el secreto del área de staging:
```bash
git reset backend/.env
```

### Pre-commit Hook

Hook instalado automáticamente:

```bash
# .husky/pre-commit
npx gitleaks protect --staged --verbose
```

Bloquea commits con secretos.

---

## 📚 Recursos Adicionales

- [12 Factor App - Config](https://12factor.net/config)
- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)

---

## ❓ FAQ

### ¿Puedo commitear `.env.example`?

**SÍ.** De hecho, DEBES hacerlo. Es una plantilla sin secretos reales.

### ¿Qué pasa con `.env.local`, `.env.development`, etc.?

Todos deben estar en `.gitignore` SALVO que solo contengan valores públicos.

### ¿Cómo comparto secretos con el equipo?

Usa un gestor de contraseñas (1Password, Bitwarden) o herramientas seguras (Vault, AWS Secrets Manager).

**NUNCA:**
- ❌ Por email
- ❌ Por Slack/Teams
- ❌ En commits de Git

### ¿Los secretos de desarrollo son importantes?

**SÍ.** Aunque sean "solo para desarrollo", pueden exponer:
- Estructura de la base de datos
- APIs de terceros (con costos)
- Patrones de seguridad

**REGLA:** Trata TODO secreto como CRÍTICO.

---

*Última actualización: 2025-11-07*
```

---

### PASO 2: Crear Guía Rápida

**Archivo:** `docs/QUICK_REFERENCE_SECRETS.md`

```markdown
# 📄 Guía Rápida: Gestión de Secretos

## ✅ Checklist Pre-Commit

Antes de `git commit`, verifica:

- [ ] `backend/.env` NO está en staging
- [ ] Ejecuté `npm run scan:secrets`
- [ ] Variables públicas usan prefijo `VITE_*`
- [ ] Actualicé `.env.example` si añadí nuevas vars

## 🚀 Comandos Frecuentes

### Escanear Secretos

```bash
npm run scan:secrets
```

### Verificar Qué Archivos Commitearé

```bash
git status
git diff --staged
```

### Resetear Archivo Accidentalmente Staged

```bash
git reset backend/.env
```

### Ver Historial de un Archivo

```bash
git log -- backend/.env
# Debería retornar VACÍO
```

## 🎯 Dónde Van las Variables

| Variable | Archivo | Versionado | Ejemplo |
|----------|---------|------------|---------|
| `VITE_*` | `.env` (raíz) | ✅ SÍ | `VITE_API_URL=...` |
| `JWT_SECRET` | `backend/.env` | ❌ NO | `JWT_SECRET=abc123` |
| `STRIPE_*` | `backend/.env` | ❌ NO | `STRIPE_KEY=sk_...` |
| Ejemplos | `.env.example` | ✅ SÍ | `JWT_SECRET=changeme` |

## 🆘 Emergencia: Comiteé un Secreto

```bash
# 1. Si NO hiciste push
git reset --soft HEAD~1

# 2. Si YA hiciste push
# ⚠️ ROTAR SECRETO INMEDIATAMENTE
# Luego limpiar historial:
node scripts/remove-secret-from-history.js
```

## 📞 Contacto

Si dudas si algo es secreto: **pregunta antes de commitear**.

---

*Versión resumida de docs/SECRETS_MANAGEMENT.md*
```

---

### PASO 3: Actualizar README Principal

**Archivo:** `README.md` (añadir sección)

Buscar la sección de "Configuración" o "Setup" y añadir:

```markdown
## 🔐 Gestión de Secretos

**⚠️ IMPORTANTE:** Este proyecto usa dos archivos `.env` diferentes:

- **`.env` (raíz):** Variables PÚBLICAS para frontend (SÍ versionado)
- **`backend/.env`:** Variables SECRETAS para backend (NO versionado)

### Primera Vez Clonando el Repo

1. **Copiar template del backend:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Editar `backend/.env` con secretos reales:**
   ```bash
   # backend/.env
   JWT_SECRET=genera-un-secreto-aleatorio-aqui
   JWT_REFRESH_SECRET=otro-secreto-diferente
   ```

3. **Verificar que NO comitees secretos:**
   ```bash
   npm run scan:secrets
   ```

### Documentación Completa

- 📖 [Guía Completa de Secretos](docs/SECRETS_MANAGEMENT.md)
- 📄 [Referencia Rápida](docs/QUICK_REFERENCE_SECRETS.md)

**REGLA DE ORO:** Si dudas si algo es secreto, NO lo comitees.
```

---

### PASO 4: Crear Plantilla de Onboarding

**Archivo:** `docs/ONBOARDING_SECRETS.md`

```markdown
# Onboarding: Configuración de Secretos

## 👋 Bienvenido al Equipo

Esta guía te ayuda a configurar secretos localmente.

---

## ⚙️ Configuración Inicial

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-org/pureza-naturalis-v3.git
cd pureza-naturalis-v3
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Backend Secrets

```bash
# Copiar template
cp backend/.env.example backend/.env
```

Editar `backend/.env`:

```env
# backend/.env

# JWT Secrets (pedir al lead del equipo)
JWT_SECRET=pedir-al-equipo
JWT_REFRESH_SECRET=pedir-al-equipo

# Base de datos (local)
DATABASE_URL=file:./database.sqlite

# Stripe (modo test)
STRIPE_SECRET_KEY=sk_test_pedir-al-equipo

# Sentry (opcional en desarrollo)
SENTRY_DSN=
```

**⚠️ IMPORTANTE:**
- Pide secretos al team lead por 1Password/canal seguro
- NUNCA compartas secretos por Slack/Email

### 4️⃣ Verificar Configuración

```bash
# Escanear que no hay secretos expuestos
npm run scan:secrets

# Verificar que backend/.env NO aparece
git status
```

Deberías ver:
```
On branch main
nothing to commit, working tree clean
```

### 5️⃣ Ejecutar Migraciones

```bash
cd backend
npm run db:migrate
```

### 6️⃣ Iniciar Desarrollo

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## 📚 Siguientes Pasos

1. Lee [Guía Completa de Secretos](SECRETS_MANAGEMENT.md)
2. Configura tu IDE para ignorar `backend/.env`
3. Instala extensión EditorConfig

---

## 🆘 Problemas Comunes

### Error: "JWT_SECRET is not defined"

**Solución:** Verificar `backend/.env` tiene `JWT_SECRET=...`

### Error: "Cannot find module 'dotenv'"

**Solución:** 
```bash
cd backend
npm install
```

### Accidentalmente Comiteé `backend/.env`

**Solución:**
```bash
git reset backend/.env
git status
# Ahora backend/.env NO debe aparecer
```

---

*Si tienes dudas, contacta al team lead.*
```

---

### PASO 5: Actualizar `.env.example` del Backend

**Archivo:** `backend/.env.example`

Asegúrate que tiene TODAS las variables con valores placeholder:

```env
# Backend - Environment Variables Template
# Copiar a backend/.env y rellenar con valores reales

# JWT Configuration
JWT_SECRET=change-this-to-random-secret-min-32-chars
JWT_REFRESH_SECRET=change-this-to-different-random-secret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Database
DATABASE_URL=file:./database.sqlite

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Sentry (opcional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## VALIDACIÓN

### ✅ Criterios de Aceptación

1. **Documentación creada:**
   - [ ] `docs/SECRETS_MANAGEMENT.md` existe (900+ líneas)
   - [ ] `docs/QUICK_REFERENCE_SECRETS.md` existe
   - [ ] `docs/ONBOARDING_SECRETS.md` existe
   - [ ] `README.md` actualizado con sección de secretos

2. **Contenido completo:**
   - [ ] Explica diferencia entre `.env` raíz y `backend/.env`
   - [ ] Workflow para añadir variables frontend/backend
   - [ ] Procedimiento emergencia si comiteas secreto
   - [ ] Configuración en producción
   - [ ] FAQ responde dudas comunes

3. **Templates actualizados:**
   - [ ] `backend/.env.example` tiene TODAS las variables
   - [ ] Valores placeholder claros (no secretos reales)

### 🧪 Tests de Validación

```bash
# Verificar archivos creados
ls -la docs/SECRETS_MANAGEMENT.md
ls -la docs/QUICK_REFERENCE_SECRETS.md
ls -la docs/ONBOARDING_SECRETS.md

# Verificar que .env.example NO tiene secretos reales
cat backend/.env.example | grep -E "(sk_live|jwt_prod|password123)"
# Debería retornar VACÍO

# Verificar README actualizado
grep "Gestión de Secretos" README.md
```

### 📊 Métricas de Éxito

- **Documentación legible:** 15 min para nuevo developer entender sistema
- **Onboarding rápido:** <10 min configurar secretos localmente
- **Cero incidentes:** Ningún secreto comiteado post-documentación

---

## NOTAS IMPORTANTES

### ⚠️ Avisos

1. **NO incluir secretos reales en documentación** (usar placeholders)
2. **Revisar con team lead** antes de mergear
3. **Compartir docs con todo el equipo** tras completar tarea

### 🔗 Dependencias

- **Requiere:** TASK-001 (gitleaks configurado), TASK-002 (historial limpio)
- **Habilita:** Onboarding seguro de nuevos developers

### 📦 Entregables

- `docs/SECRETS_MANAGEMENT.md`
- `docs/QUICK_REFERENCE_SECRETS.md`
- `docs/ONBOARDING_SECRETS.md`
- `README.md` (actualizado)
- `backend/.env.example` (completo)

---

## REPORTE FINAL

Tras completar, crear:

**Archivo:** `reports/execution-2025-11-07/TASK-003-COMPLETION.md`

```markdown
# TASK-003: Documentación de Secretos - COMPLETADO

**Ejecutado:** [FECHA]  
**Tiempo:** [X horas]

## ✅ Archivos Creados

- `docs/SECRETS_MANAGEMENT.md` (920 líneas)
- `docs/QUICK_REFERENCE_SECRETS.md` (85 líneas)
- `docs/ONBOARDING_SECRETS.md` (150 líneas)
- `README.md` (sección añadida)
- `backend/.env.example` (actualizado)

## ✅ Validación

- [x] Todos los archivos creados
- [x] Contenido revisado por team lead
- [x] Sin secretos reales en docs
- [x] Team notificado

## 📝 Próximos Pasos

- Compartir docs con equipo
- Incluir en sesión de onboarding
- Actualizar si se añaden nuevas variables

## 🎯 Impacto

**ANTES:** Ninguna documentación, riesgo de commitear secretos.
**DESPUÉS:** Sistema documentado, onboarding estandarizado, cero secretos filtrados.
```

---

**FIN DE INSTRUCCIONES TASK-003**
