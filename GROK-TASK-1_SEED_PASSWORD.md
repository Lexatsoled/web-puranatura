# 🔐 GROK-TASK-1: SEC-SEED-001 - Seed Password Aleatoria

**ID:** SEC-SEED-001  
**Severidad:** 🔴 HIGH  
**Tiempo estimado:** 5 minutos  
**Complejidad:** ⭐ Muy fácil  
**Status:** ⏳ TODO

---

## 📋 RESUMEN DE TAREA

**Problema:**
- Script `backend/src/db/seed.ts` usa contraseña hardcodeada `'test123'`
- Si seed se ejecuta en producción, crea backdoor con credenciales conocidas
- Esto es una vulnerabilidad HIGH de seguridad

**Solución:**
- Generar contraseña aleatoria en cada ejecución
- Mostrar en logs para que se guarde
- Nunca hardcodear en el código

---

## 🎯 PASO 1: ABRIR ARCHIVO

```powershell
# Comando para abrir archivo en editor
code backend/src/db/seed.ts
```

**Ubicación esperada:**
```
C:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3\backend\src\db\seed.ts
```

---

## ✏️ PASO 2: LOCALIZAR EL CÓDIGO A CAMBIAR

En el archivo `backend/src/db/seed.ts`, buscar esta sección (aproximadamente líneas 1-20):

```typescript
import crypto from 'crypto';
import bcrypt from 'bcrypt';

async function main() {
  const user = {
    id: crypto.randomUUID(),
    name: 'Admin User',
    email: 'admin@purezanaturalis.com',
    password_hash: await bcrypt.hash('test123', 12),  // ⚠️ ESTO DEBE CAMBIAR
    role: 'admin',
  };

  console.log('[seed] Usuario de prueba: admin@purezanaturalis.com / test123');
}
```

---

## 🔄 PASO 3: HACER EL CAMBIO

### Opción A: Copiar-Pega Exacto (RECOMENDADO)

**BUSCAR EXACTAMENTE ESTO:**
```typescript
async function main() {
  const user = {
    id: crypto.randomUUID(),
    name: 'Admin User',
    email: 'admin@purezanaturalis.com',
    password_hash: await bcrypt.hash('test123', 12),
    role: 'admin',
  };

  console.log('[seed] Usuario de prueba: admin@purezanaturalis.com / test123');
}
```

**REEMPLAZAR CON ESTO:**
```typescript
async function main() {
  // SEC-SEED-001: Generate random password instead of hardcoded
  const randomPassword = crypto.randomBytes(16).toString('hex');
  
  const user = {
    id: crypto.randomUUID(),
    name: 'Admin User',
    email: 'admin@purezanaturalis.com',
    password_hash: await bcrypt.hash(randomPassword, 12),
    role: 'admin',
  };

  console.log('[seed] ⚠️  CONTRASEÑA GENERADA:', randomPassword);
  console.log('[seed] Usuario: admin@purezanaturalis.com');
}
```

**PASOS EN VS CODE:**
1. Presionar `Ctrl+F` para abrir Find
2. Buscar: `password_hash: await bcrypt.hash('test123', 12),`
3. Click en "Replace" (o `Ctrl+H`)
4. En el campo de reemplazo, pegar el nuevo código
5. Click "Replace" (no "Replace All")
6. Guardar con `Ctrl+S`

### Opción B: Manual (Si copiar-pega no funciona)

**Cambio 1:** En la línea con `password_hash`, cambiar:
- **DE:** `password_hash: await bcrypt.hash('test123', 12),`
- **A:** `password_hash: await bcrypt.hash(randomPassword, 12),`

**Cambio 2:** Agregar ANTES de `const user = {...}`:
```typescript
const randomPassword = crypto.randomBytes(16).toString('hex');
```

**Cambio 3:** En los `console.log`, cambiar:
- **DE:** `console.log('[seed] Usuario de prueba: admin@purezanaturalis.com / test123');`
- **A:** `console.log('[seed] ⚠️  CONTRASEÑA GENERADA:', randomPassword);`
- **Agregar:** `console.log('[seed] Usuario: admin@purezanaturalis.com');`

---

## ✅ PASO 4: VERIFICAR EL CAMBIO

**En VS Code:**
- [ ] Archivo muestra punto blanco/naranja en la pestaña (sin guardar)
- [ ] Presionar `Ctrl+S` para guardar
- [ ] Punto desaparece (archivo guardado ✅)

**Validación visual:**
```typescript
// Debe verse así DESPUÉS del cambio:

const randomPassword = crypto.randomBytes(16).toString('hex');

const user = {
  id: crypto.randomUUID(),
  name: 'Admin User',
  email: 'admin@purezanaturalis.com',
  password_hash: await bcrypt.hash(randomPassword, 12),  // ✅ VARIABLE, no string
  role: 'admin',
};

console.log('[seed] ⚠️  CONTRASEÑA GENERADA:', randomPassword);  // ✅ VARIABLE
console.log('[seed] Usuario: admin@purezanaturalis.com');
```

---

## 🧪 PASO 5: EJECUTAR PRUEBA

Abrir terminal y ejecutar el seed:

```powershell
# Navegar a carpeta backend
cd backend

# Ejecutar seed
npm run db:seed

# Resultado esperado:
# [seed] ⚠️  CONTRASEÑA GENERADA: a1b2c3d4e5f6g7h8i9j0k1l2m3n4
# [seed] Usuario: admin@purezanaturalis.com
# [seed] Base de datos inicializada
```

**IMPORTANTE:** La contraseña será DIFERENTE cada vez que ejecutes. Eso es correcto. ✅

**Si ves esto, es éxito:**
```
[seed] ⚠️  CONTRASEÑA GENERADA: <algo como hexadecimal>
[seed] Usuario: admin@purezanaturalis.com
```

**Si ves esto, hay error:**
```
Error: randomBytes is not defined
```
→ Solución: Asegurar que `import crypto from 'crypto';` esté en la línea 1

---

## 📊 PASO 6: VALIDACIÓN FINAL

Ejecutar script de validación:

```powershell
# Volver a carpeta raíz
cd ..

# Ejecutar validación
.\validate-audits.ps1

# Buscar la línea que dice:
# ✅ [PASS] Seed Password Segura
```

**Si pasa:** ✅ TAREA 1 COMPLETADA

**Si falla:** ❌ Revisar qué salió mal
```
# Posibles errores:
# 1. "randomBytes is not defined" → Falta import
# 2. "test123" aparece en el code → Cambio no se aplicó
# 3. File not saved → Presionar Ctrl+S
```

---

## 🎯 CHECKLIST DE COMPLETITUD

Marca cada item conforme lo hagas:

- [ ] Archivo `backend/src/db/seed.ts` abierto
- [ ] Localicé la línea con `password_hash: await bcrypt.hash('test123', 12)`
- [ ] Cambié por versión con `randomPassword`
- [ ] Agregué línea: `const randomPassword = crypto.randomBytes(16).toString('hex');`
- [ ] Guardé el archivo (`Ctrl+S`)
- [ ] Ejecuté: `npm run db:seed` en carpeta backend
- [ ] Vi contraseña aleatoria en output (diferente cada ejecución)
- [ ] Ejecuté: `.\validate-audits.ps1` desde carpeta raíz
- [ ] Validación pasó: ✅ [PASS] Seed Password Segura

---

## 🚀 PRÓXIMO PASO

Una vez completada esta tarea:

1. Commit los cambios:
```powershell
git add backend/src/db/seed.ts
git commit -m "security(seed): generate random password instead of hardcoded 'test123'"
```

2. Ir a: **GROK-TASK-2.md** (CSP - Content Security Policy)

---

## 📞 TROUBLESHOOTING

### Problema: "crypto is not defined"
**Solución:** Verificar que el archivo comience con:
```typescript
import crypto from 'crypto';
import bcrypt from 'bcrypt';
```

### Problema: "npm run db:seed no existe"
**Solución:** Verificar en `package.json` que exista el script. Si no, ejecutar:
```powershell
npm run seed  # o cualquier variante
```

### Problema: Comando `code` no funciona
**Solución:** Abrir manualmente en VS Code:
1. Ctrl+O (abrir archivo)
2. Navegar a `backend/src/db/seed.ts`
3. Abrir

### Problema: No sé si el cambio está correcto
**Solución:** En VS Code, presionar `Ctrl+Z` para deshacer si es necesario, y comenzar de nuevo

---

**STATUS:** ⏳ EN PROGRESO  
**TIEMPO INVERTIDO:** ~5 minutos  
**SIGUIENTE:** GROK-TASK-2.md

