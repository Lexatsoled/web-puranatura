# 🤖 INSTRUCCIONES EXHAUSTIVAS PARA GEMINI CODE ASSIST

## 📖 TABLA DE CONTENIDOS

1. [ANTES DE EMPEZAR](#antes-de-empezar)
2. [FASE 2: CORRECCIONES ALTAS](#fase-2-correcciones-altas)
3. [FASE 3: MEJORAS CALIDAD](#fase-3-mejoras-calidad)
4. [FASE 4: OPTIMIZACIONES](#fase-4-optimizaciones)
5. [VERIFICACIONES OBLIGATORIAS](#verificaciones-obligatorias)
6. [QUÉ HACER SI ALGO FALLA](#qué-hacer-si-algo-falla)

---

# ANTES DE EMPEZAR

## ⚠️ ADVERTENCIAS CRÍTICAS

**LEE ESTO COMPLETO ANTES DE HACER CUALQUIER CAMBIO:**

1. **NO ERES TAN CAPAZ COMO CLAUDE** - Por eso estas instrucciones son TAN detalladas
2. **NO ADIVINES** - Si no estás seguro, PREGUNTA al usuario
3. **NO CONTINÚES SI ALGO FALLA** - Detente y reporta
4. **UN CAMBIO A LA VEZ** - Nunca hagas múltiples cambios sin verificar
5. **VERIFICA SIEMPRE** - Después de cada cambio, ejecuta tests

## 📋 PRE-REQUISITOS

### **1. Verificar que tienes acceso al proyecto**

```bash
cd Pureza-Naturalis-V3
pwd
# Debes ver: .../Pureza-Naturalis-V3
```

### **2. Verificar que Git está configurado**

```bash
git status
# Debes ver el estado del repositorio sin errores
```

### **3. Verificar Node.js y npm**

```bash
node --version
# Debes ver: v18.x.x o superior

npm --version
# Debes ver: 9.x.x o superior
```

### **4. Instalar dependencias**

```bash
npm install
# Espera que complete sin errores
```

**⚠️ SI FALLA npm install:**

- Lee los errores completos
- Copia los errores y muéstralos al usuario
- NO CONTINÚES hasta resolver

### **5. Verificar que el proyecto compila**

```bash
npm run build
```

**DEBES VER:** Build exitoso sin errores

**⚠️ SI FALLA el build:**

- Copia el error COMPLETO
- Muéstralo al usuario
- NO CONTINÚES hasta resolver

### **6. Verificar que los tests pasan**

```bash
npm test
```

**ES NORMAL:** Algunos tests pueden fallar (eso lo vamos a arreglar)

**⚠️ NO ES NORMAL:** Errores de sintaxis o imports rotos

## 🔧 CREAR BACKUP

**ESTO ES OBLIGATORIO:**

```bash
# Asegúrate de estar en la rama main
git checkout main

# Crear rama de backup
git checkout -b fase-2-corrections

# Verificar que estás en la nueva rama
git branch
# Debes ver: * fase-2-corrections

# Hacer push del backup
git push origin fase-2-corrections
```

**⚠️ SI FALLA el push:**

- Es normal si es la primera vez
- Ejecuta: `git push --set-upstream origin fase-2-corrections`

## 🚫 QUÉ NO HACER - ANTI-PATTERNS

### **❌ NUNCA HAGAS ESTO:**

1. **No "alucines" código que no existe**

   ```typescript
   // ❌ MAL - Asumir que existe una función
   import { someFunction } from './utils'; // ¿Existe realmente?

   // ✅ BIEN - Verificar primero con read_file
   ```

2. **No borres archivos sin verificar**

   ```bash
   # ❌ MAL
   rm -rf public/Jpeg  # ¿Estás SEGURO de que no se usa?

   # ✅ BIEN - Buscar referencias primero
   grep -r "public/Jpeg" .
   ```

3. **No hagas cambios masivos sin verificar**

   ```bash
   # ❌ MAL - Cambiar 100 archivos a la vez
   find . -name "*.tsx" -exec sed -i 's/any/unknown/g' {} \;

   # ✅ BIEN - Cambiar archivo por archivo y verificar
   ```

4. **No asumas que los imports funcionan**

   ```typescript
   // ❌ MAL - Asumir que el path es correcto
   import { Cart } from './contexts/CartContext';

   // ✅ BIEN - Verificar con read_file que existe
   ```

5. **No continues sin verificar**

   ```bash
   # ❌ MAL
   npm run build  # No verificar si falló
   # Seguir con más cambios...

   # ✅ BIEN
   npm run build
   # Leer resultado
   # Si falla, DETENER y reportar
   ```

---

# FASE 2: CORRECCIONES ALTAS

## 📊 RESUMEN FASE 2

**Duración estimada:** 3-5 días  
**Nivel de dificultad:** MEDIO-ALTO  
**Impacto:** Reducción de ~400KB en bundle, mejor arquitectura

**Correcciones en esta fase:**

- E011: Consolidar imports mixtos
- E012-E013: Limpiar dependencies backend
- E014: Incluir tests en tsconfig
- E019: Eliminar duplicación de assets
- E020: Corregir formatos de imagen
- E021: Renombrar archivos incorrectos
- E022: Refactorizar products.ts
- E023: Optimizar vite.config chunks
- E024: Advertencias productos peligrosos

---

## E011: CONSOLIDAR IMPORTS MIXTOS

### **🎯 OBJETIVO**

Consolidar imports que mezclan `./contexts` y `./src/contexts` para usar siempre el alias `@/`.

### **📍 UBICACIÓN**

- Archivo principal: `App.tsx` (líneas 3-4)
- Otros archivos afectados: Múltiples componentes

### **🔍 PROBLEMA ACTUAL**

**Archivo:** `App.tsx`

```typescript
// LÍNEA 3 - Usa ./src/contexts ✅
import { CartProvider } from './src/contexts/CartContext';

// LÍNEA 4 - Usa ./src/contexts ✅
import { AuthProvider } from './src/contexts/AuthContext';

// LÍNEA 5 - Usa ./src/contexts ✅
import { WishlistProvider } from './src/contexts/WishlistContext';

// Pero en otros archivos usa ./contexts ❌
// Esto causa confusión y problemas de imports
```

### **✅ SOLUCIÓN**

Usar SIEMPRE el alias `@/` configurado en `tsconfig.json`:

```typescript
// ✅ DESPUÉS - Usar alias @/
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
```

### **📝 PASOS DETALLADOS**

#### **Paso 1: Verificar configuración del alias**

```bash
# Leer tsconfig.json
cat Pureza-Naturalis-V3/tsconfig.json | grep -A 3 "paths"
```

**DEBES VER:**

```json
"paths": {
  "@/*": ["./src/*"]
}
```

#### **Paso 2: Buscar todos los imports mixtos**

```bash
# Buscar imports que usan ./src/contexts
grep -r "from '\./src/contexts" --include="*.tsx" --include="*.ts" .

# Buscar imports que usan ./contexts
grep -r "from '\./contexts" --include="*.tsx" --include="*.ts" .

# Buscar imports que usan ../contexts
grep -r "from '\.\./contexts" --include="*.tsx" --include="*.ts" .
```

**ANOTA:** Todos los archivos que encuentres

#### **Paso 3: Actualizar App.tsx**

```bash
# Hacer backup del archivo
cp App.tsx App.tsx.backup

# Editar App.tsx
```

**CAMBIOS EN App.tsx:**

**ANTES (líneas 3-5):**

```typescript
import { CartProvider } from './src/contexts/CartContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { WishlistProvider } from './src/contexts/WishlistContext';
```

**DESPUÉS:**

```typescript
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
```

#### **Paso 4: Verificar que compila**

```bash
npm run build
```

**DEBES VER:** Build exitoso

**⚠️ SI FALLA:**

1. Lee el error completo
2. Restaura el backup: `cp App.tsx.backup App.tsx`
3. Reporta al usuario
4. NO CONTINÚES

#### **Paso 5: Actualizar otros archivos**

Para cada archivo encontrado en el Paso 2:

```bash
# Ejemplo para src/components/Header.tsx
# ANTES de editar, haz backup
cp src/components/Header.tsx src/components/Header.tsx.backup

# Editar el archivo
# Cambiar todos los imports de:
#   './contexts/...'  -> '@/contexts/...'
#   '../contexts/...' -> '@/contexts/...'
#   './src/contexts/...' -> '@/contexts/...'

# Después de cada archivo, verificar
npm run build
```

#### **Paso 6: Buscar otros imports comunes**

```bash
# Buscar otros patterns problemáticos
grep -r "from '\./src/" --include="*.tsx" --include="*.ts" . | grep -v "node_modules" | head -20
```

**CAMBIAR TODOS a usar @/**:

- `'./src/components/...'` → `'@/components/...'`
- `'./src/hooks/...'` → `'@/hooks/...'`
- `'./src/utils/...'` → `'@/utils/...'`
- `'./src/store/...'` → `'@/store/...'`

#### **Paso 7: Verificación final**

```bash
# Build completo
npm run build

# Tests
npm test

# Type check
npm run type-check
```

**TODOS DEBEN PASAR**

#### **Paso 8: Commit**

```bash
git add .
git commit -m "fix(E011): Consolidate mixed imports to use @/ alias

- Changed all './src/*' imports to '@/*'
- Changed all '../*' relative imports to '@/*'
- Ensures consistent import paths across codebase
- Verified build passes after changes"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] No existen imports con `./src/`
- [ ] No existen imports relativos para contexts, components, hooks, utils
- [ ] Build pasa sin errores
- [ ] Type check pasa sin errores
- [ ] Commit realizado

---

## E012-E013: LIMPIAR DEPENDENCIES BACKEND

### **🎯 OBJETIVO**

Eliminar dependencias de backend (Express, Mongoose, Helmet) que no se usan en un proyecto frontend React.

### **📍 UBICACIÓN**

Archivo: `package.json` (líneas 59-64)

### **🔍 PROBLEMA ACTUAL**

**package.json contiene:**

```json
{
  "dependencies": {
    "express": "^5.1.0", // ❌ Backend - NO se usa
    "helmet": "^8.1.0", // ❌ Backend - NO se usa
    "mongoose": "^8.17.0", // ❌ Backend - NO se usa
    "@types/express": "^5.0.3" // ❌ Types - Debe ir a devDependencies
  }
}
```

**Problemas:**

1. Aumenta el bundle size innecesariamente (+2MB)
2. Vulnerabilidades de seguridad potenciales
3. Confusión sobre la arquitectura del proyecto
4. `@types/*` debe estar en `devDependencies`, no en `dependencies`

### **✅ SOLUCIÓN**

1. Remover `express`, `mongoose`, `helmet`
2. Mover `@types/express` a `devDependencies` (si se necesita para scripts)
3. Verificar que nada se rompió

### **📝 PASOS DETALLADOS**

#### **Paso 1: Verificar que NO se usan**

```bash
# Buscar uso de express
grep -r "from 'express'" --include="*.ts" --include="*.tsx" src/

# Buscar uso de mongoose
grep -r "from 'mongoose'" --include="*.ts" --include="*.tsx" src/

# Buscar uso de helmet
grep -r "from 'helmet'" --include="*.ts" --include="*.tsx" src/

# Buscar imports alternativos
grep -r "import.*express" --include="*.ts" --include="*.tsx" src/
grep -r "require.*express" --include="*.ts" --include="*.tsx" src/
```

**DEBES VER:** Sin resultados (o solo en archivos de configuración backend que no se usan)

**⚠️ SI ENCUENTRAS USOS:**

1. Anota los archivos
2. Reporta al usuario
3. NO CONTINÚES sin aprobación

#### **Paso 2: Backup de package.json**

```bash
cp package.json package.json.backup
```

#### **Paso 3: Verificar bundle size ANTES**

```bash
npm run build

# Ver tamaño de los chunks
ls -lh dist/assets/*.js | awk '{print $5, $9}'
```

**ANOTA:** Los tamaños actuales (ejemplo: vendor-react.js: 450KB)

#### **Paso 4: Remover dependencies**

**Editar `package.json`:**

**ANTES (líneas ~59-64):**

```json
{
  "dependencies": {
    "@types/express": "^5.0.3",
    "express": "^5.1.0",
    "helmet": "^8.1.0",
    "mongoose": "^8.17.0"
  }
}
```

**DESPUÉS:**

```json
{
  "dependencies": {
    // Removidos: express, helmet, mongoose, @types/express
  }
}
```

**⚠️ IMPORTANTE:** También verifica `@types/express` en la sección de types:

```json
"dependencies": {
  // Buscar y remover @types/express de aquí
}
```

#### **Paso 5: Reinstalar dependencias**

```bash
# Limpiar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

**DEBES VER:** Instalación exitosa sin errores

**⚠️ SI FALLA npm install:**

1. Lee el error completo
2. Restaura backup: `cp package.json.backup package.json`
3. Ejecuta `npm install` de nuevo
4. Reporta al usuario

#### **Paso 6: Verificar que compila**

```bash
npm run build
```

**DEBES VER:** Build exitoso

**⚠️ SI FALLA:**

1. Lee los errores completos
2. Si habla de imports faltantes de express/mongoose/helmet
3. Busca dónde se usan con grep
4. Reporta al usuario

#### **Paso 7: Comparar bundle size**

```bash
# Ver nuevo tamaño de chunks
ls -lh dist/assets/*.js | awk '{print $5, $9}'
```

**DEBES VER:** Reducción en el tamaño (al menos 50-100KB menos)

#### **Paso 8: Tests**

```bash
npm test
```

**DEBES VER:** Mismos resultados que antes (o mejor)

#### **Paso 9: Mover @types a devDependencies**

Si el proyecto tiene otros `@types/*` en dependencies, muévelos:

**ANTES:**

```json
{
  "dependencies": {
    "@types/lodash": "^4.17.20",
    "@types/react": "^18.3.5"
  }
}
```

**DESPUÉS:**

```json
{
  "dependencies": {
    // Solo tipos de librerías que se usan en runtime
  },
  "devDependencies": {
    "@types/lodash": "^4.17.20",
    "@types/react": "^18.3.5"
  }
}
```

**REGLA:** `@types/*` debe ir en `devDependencies` salvo que se usen en runtime

#### **Paso 10: Reinstalar después de mover types**

```bash
npm install
npm run build
npm test
```

**TODO DEBE PASAR**

#### **Paso 11: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix(E012-E013): Remove unused backend dependencies

- Removed express (not used in frontend)
- Removed mongoose (not used in frontend)
- Removed helmet (not used in frontend)
- Moved @types/* to devDependencies where appropriate
- Bundle size reduced by ~XXX KB
- All builds and tests passing"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] `express` removido de dependencies
- [ ] `mongoose` removido de dependencies
- [ ] `helmet` removido de dependencies
- [ ] `@types/*` en devDependencies (no dependencies)
- [ ] Build pasa sin errores
- [ ] Tests pasan sin regresiones
- [ ] Bundle size reducido
- [ ] Commit realizado

---

## E014: INCLUIR TESTS EN COMPILACIÓN TYPESCRIPT

### **🎯 OBJETIVO**

Configurar TypeScript para incluir archivos de test en la compilación y verificación de tipos.

### **📍 UBICACIÓN**

Archivo: `tsconfig.json`

### **🔍 PROBLEMA ACTUAL**

**tsconfig.json NO incluye tests:**

```json
{
  "compilerOptions": {
    // ... configuración
  }
  // ❌ Falta: "include" con tests
}
```

**Resultado:** TypeScript no verifica tipos en archivos de test, causando:

- Errores no detectados hasta runtime
- Tests pueden tener tipos incorrectos
- No aprovecha TypeScript en tests

### **✅ SOLUCIÓN**

Agregar sección `include` y `exclude` apropiadas:

```json
{
  "compilerOptions": {
    // ... configuración existente
  },
  "include": ["src/**/*", "test/**/*", "*.tsx", "*.ts"],
  "exclude": ["node_modules", "dist", "build", "coverage"]
}
```

### **📝 PASOS DETALLADOS**

#### **Paso 1: Backup de tsconfig.json**

```bash
cp tsconfig.json tsconfig.json.backup
```

#### **Paso 2: Verificar estructura de tests**

```bash
# Ver qué archivos de test existen
find . -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" | grep -v node_modules

# Ver en qué directorios están
find . -type d -name "__tests__" -o -type d -name "test" -o -type d -name "tests" | grep -v node_modules
```

**ANOTA:** Las rutas donde están los tests (probablemente `test/` y `src/**/__tests__/`)

#### **Paso 3: Editar tsconfig.json**

**ANTES (actual):**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "allowJs": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**DESPUÉS (agregar al final):**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "allowJs": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "test/**/*", "*.tsx", "*.ts"],
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "coverage",
    "**/*.spec.js",
    "**/*.test.js"
  ]
}
```

#### **Paso 4: Verificar type checking**

```bash
npm run type-check
```

**POSIBLE RESULTADO:** Nuevos errores de TypeScript en tests

**⚠️ SI APARECEN ERRORES:**

1. Anota cuántos errores nuevos aparecieron
2. Lee los primeros 5 errores
3. **NO LOS ARREGLES AHORA** - Eso es para Fase 3
4. Esto es ESPERADO y CORRECTO

**Ejemplo de errores esperados:**

```
test/hooks/useLocalStorage.test.ts:15:7 - error TS2322: Type 'any' is not assignable to type 'string'
test/components/Header.test.tsx:23:10 - error TS7006: Parameter 'props' implicitly has an 'any' type
```

#### **Paso 5: Verificar que build funciona**

```bash
npm run build
```

**DEBES VER:** Build exitoso (el build NO ejecuta type-check por defecto)

#### **Paso 6: Verificar que tests corren**

```bash
npm test
```

**DEBES VER:** Tests ejecutándose (puede que algunos fallen, es normal)

#### **Paso 7: Commit**

```bash
git add tsconfig.json
git commit -m "fix(E014): Include test files in TypeScript compilation

- Added 'include' section to tsconfig.json
- Now includes src/**/* and test/**/*
- Added appropriate 'exclude' section
- TypeScript now type-checks test files
- May reveal additional type errors (to be fixed in Phase 3)"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] tsconfig.json tiene sección `include`
- [ ] tsconfig.json incluye `test/**/*`
- [ ] tsconfig.json tiene sección `exclude`
- [ ] `npm run type-check` ejecuta sin crashear
- [ ] Build pasa sin errores
- [ ] Commit realizado

---

## E019: ELIMINAR DUPLICACIÓN DE ASSETS

### **🎯 OBJETIVO**

Eliminar ~300MB de imágenes duplicadas en carpetas redundantes.

### **📍 UBICACIÓN**

- Carpeta principal: `public/Jpeg/` (MANTENER)
- Carpetas duplicadas:
  - `Imagenes Piping Rock/` (ELIMINAR)
  - Otras carpetas duplicadas (ELIMINAR)

### **🔍 PROBLEMA ACTUAL**

```
proyecto/
├── public/
│   └── Jpeg/              ✅ MANTENER - Usadas por la app
│       ├── imagen1.jpg
│       └── imagen2.jpg
├── Imagenes Piping Rock/  ❌ DUPLICADO - ~300MB
│   ├── imagen1.jpg        (mismo archivo)
│   └── imagen2.jpg        (mismo archivo)
└── otras_carpetas/        ❌ DUPLICADOS
```

**Problemas:**

- ~300MB de espacio desperdiciado
- Confusión sobre qué imágenes usar
- Deploy más lento
- Repository más pesado

### **⚠️ ADVERTENCIA EXTREMA**

**ANTES DE BORRAR CUALQUIER COSA:**

1. Verificar que las imágenes están duplicadas
2. Verificar que NO se usan las de las carpetas a eliminar
3. Hacer backup COMPLETO
4. Verificar UNA POR UNA

**SI BORRAS LAS IMÁGENES EQUIVOCADAS, ROMPES LA APP**

### **📝 PASOS DETALLADOS**

#### **Paso 1: Backup COMPLETO**

```bash
# Crear archivo tar con todas las imágenes
tar -czf imagenes-backup-$(date +%Y%m%d).tar.gz public/ "Imagenes Piping Rock/"

# Verificar que se creó
ls -lh imagenes-backup-*.tar.gz

# Mover a lugar seguro fuera del proyecto
mv imagenes-backup-*.tar.gz ../
```

**DEBES VER:** Archivo .tar.gz de ~300-500MB

#### **Paso 2: Inventario de carpetas**

```bash
# Listar todas las carpetas con imágenes
find . -type d -name "*[Ii]magen*" -o -name "*[Ii]mag*" -o -name "*[Jj]peg*" -o -name "*[Jj]pg*" | grep -v node_modules | grep -v ".git"

# Listar directorios con archivos .jpg o .jpeg
find . -name "*.jpg" -o -name "*.jpeg" | grep -v node_modules | cut -d'/' -f1-3 | sort | uniq
```

**ANOTA:** Todas las carpetas que encuentres

**Ejemplo de salida esperada:**

```
./public/Jpeg
./Imagenes Piping Rock
./public/images
```

#### **Paso 3: Buscar referencias a carpetas duplicadas**

```bash
# Buscar referencias a "Imagenes Piping Rock"
grep -r "Imagenes Piping Rock" --include="*.ts" --include="*.tsx" --include="*.json" src/

# Buscar referencias con diferentes mayúsculas
grep -ri "imagenes.piping.rock" --include="*.ts" --include="*.tsx" --include="*.json" src/

# Buscar en archivos de configuración
grep -r "Imagenes Piping Rock" vite.config.ts package.json
```

**DEBES VER:** Sin resultados (o solo en comentarios)

**⚠️ SI ENCUENTRAS REFERENCIAS:**

1. Anota TODOS los archivos
2. Reporta al usuario
3. NO ELIMINES las carpetas hasta saber cómo reemplazar

#### **Paso 4: Verificar que public/Jpeg existe y se usa**

```bash
# Verificar que existe
ls -la public/Jpeg/ | head -20

# Contar archivos
find public/Jpeg/ -type f | wc -l

# Buscar referencias a public/Jpeg
grep -r "public/Jpeg" --include="*.ts" --include="*.tsx" --include="*.json" src/ | head -10
grep -r "/Jpeg/" --include="*.ts" --include="*.tsx" --include="*.json" src/ | head -10
```

**DEBES VER:**

- Muchos archivos en public/Jpeg/
- Referencias en el código a estas imágenes

#### **Paso 5: Comparar archivos**

```bash
# Si tienes md5sum (Linux/Mac)
find public/Jpeg/ -type f -name "*.jpg" | head -5 | xargs md5sum > jpeg-hashes.txt
find "Imagenes Piping Rock/" -type f -name "*.jpg" | head -5 | xargs md5sum >> jpeg-hashes.txt

# Ver si hay hashes duplicados
cat jpeg-hashes.txt

# Si tienes PowerShell (Windows)
Get-FileHash -Path "public/Jpeg/*.jpg" -Algorithm MD5 | Select-Object Hash, Path | Format-Table
```

**OBJETIVO:** Confirmar que son el mismo archivo

#### **Paso 6: Eliminar carpeta "Imagenes Piping Rock"**

**⚠️ ÚLTIMO CHEQUEO ANTES DE BORRAR:**

```bash
# Listar contenido completo
ls -R "Imagenes Piping Rock/" | less

# Contar archivos a eliminar
find "Imagenes Piping Rock/" -type f | wc -l

# Ver tamaño total
du -sh "Imagenes Piping Rock/"
```

**ANOTA:** Número de archivos y tamaño total

**AHORA SÍ, ELIMINAR:**

```bash
# Eliminar carpeta (CUIDADO)
rm -rf "Imagenes Piping Rock/"

# Verificar que se eliminó
ls -la | grep -i "imagenes"
```

**DEBES VER:** La carpeta ya no existe

#### **Paso 7: Verificar que la app funciona**

```bash
# Build
npm run build
```

**DEBES VER:** Build exitoso

```bash
# Iniciar dev server
npm run dev
```

**PRUEBA MANUAL:**

1. Abre `http://localhost:3000` en el navegador
2. Ve a la página de Tienda
3. Verifica que las imágenes de productos cargan
4. Ve a varias páginas de productos
5. Verifica que TODAS las imágenes cargan

**⚠️ SI LAS IMÁGENES NO CARGAN:**

1. DETENTE INMEDIATAMENTE
2. Restaura el backup:
   ```bash
   cd ..
   tar -xzf imagenes-backup-*.tar.gz
   ```
3. Reporta al usuario

#### **Paso 8: Buscar otras carpetas duplicadas**

```bash
# Buscar otras carpetas sospechosas
find . -maxdepth 2 -type d | grep -v node_modules | grep -v ".git"
```

**Carpetas sospechosas para revisar:**

- Cualquier carpeta con "backup", "old", "copy"
- Carpetas con espacios en el nombre
- Carpetas con nombres muy similares

**Para cada una:**

1. Buscar referencias en el código
2. Si no hay referencias, es candidata para eliminar
3. Seguir mismo proceso que con "Imagenes Piping Rock"

#### **Paso 9: Verificar reducción de tamaño**

```bash
# Tamaño del proyecto antes (lo anotaste en Paso 6)
# Tamaño ahora
du -sh .

# Calcular reducción
# Antes - Ahora = Reducción
```

**DEBES VER:** Reducción de ~300MB

#### **Paso 10: Commit**

```bash
git add .
git commit -m "fix(E019): Remove duplicate image assets

- Removed 'Imagenes Piping Rock/' directory (duplicate)
- All images are already in public/Jpeg/
- Verified no code references to removed directory
- Reduced repository size by ~XXX MB
- All images loading correctly after removal"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] Backup creado y guardado fuera del proyecto
- [ ] Carpeta "Imagenes Piping Rock/" eliminada
- [ ] No hay referencias rotas en el código
- [ ] Build pasa sin errores
- [ ] App carga todas las imágenes correctamente
- [ ] Tamaño del proyecto reducido ~300MB
- [ ] Commit realizado

---

## E020: CORREGIR FORMATOS DE IMAGEN INCONSISTENTES

### **🎯 OBJETIVO**

Estandarizar formatos de imagen: convertir formatos inconsistentes (PNG grandes, BMP) a JPEG/WebP optimizado.

### **📍 UBICACIÓN**

Carpeta: `public/Jpeg/` y subcarpetas

### **🔍 PROBLEMA ACTUAL**

```bash
public/Jpeg/
├── producto1.jpg    ✅ Correcto
├── producto2.png    ❌ Debería ser .jpg o .webp
├── producto3.bmp    ❌ Formato antiguo
├── producto4.JPG    ❌ Extensión mayúscula
└── producto5.JPEG   ❌ Extensión mayúscula
```

**Problemas:**

- PNGs grandes (>500KB) cuando JPEG sería suficiente
- BMPs sin comprimir (muy pesados)
- Extensiones en mayúsculas causan problemas en Linux
- Inconsistencia en referencias

### **⚠️ ADVERTENCIA**

Este paso require herramientas externas (ImageMagick o similar). Si no las tienes, **REPORTA AL USUARIO**.

### **📝 PASOS DETALLADOS**

#### **Paso 1: Verificar herramientas disponibles**

```bash
# Verificar ImageMagick
convert --version

# O verificar si tienes ffmpeg con capacidad de imágenes
ffmpeg -version

# O verificar sharp-cli (Node.js)
npm list -g sharp-cli
```

**⚠️ SI NO TIENES NINGUNA HERRAMIENTA:**

1. Reporta al usuario
2. Usuario debe instalar:
   - **Linux:** `sudo apt-get install imagemagick`
   - **Mac:** `brew install imagemagick`
   - **Windows:** Descargar de imagemagick.org
   - **Node.js:** `npm install -g sharp-cli`

#### **Paso 2: Inventario de formatos**

```bash
# Contar archivos por extensión
echo "JPG files:"
find public/Jpeg/ -name "*.jpg" | wc -l
echo "JPEG files:"
find public/Jpeg/ -name "*.jpeg" | wc -l
echo "PNG files:"
find public/Jpeg/ -name "*.png" | wc -l
echo "BMP files:"
find public/Jpeg/ -name "*.bmp" | wc -l
echo "UPPERCASE extensions:"
find public/Jpeg/ -name "*.JPG" -o -name "*.JPEG" -o -name "*.PNG" | wc -l
```

**ANOTA:** Cuántos archivos hay de cada tipo

#### **Paso 3: Backup de imágenes**

```bash
# Backup solo de la carpeta a modificar
tar -czf jpeg-backup-$(date +%Y%m%d).tar.gz public/Jpeg/

# Mover fuera del proyecto
mv jpeg-backup-*.tar.gz ../

# Verificar
ls -lh ../jpeg-backup-*.tar.gz
```

#### **Paso 4: Convertir extensiones mayúsculas a minúsculas**

```bash
# Para cada archivo con extensión mayúscula
find public/Jpeg/ -name "*.JPG" -o -name "*.JPEG" -o -name "*.PNG" | while read file; do
  # Obtener nuevo nombre en minúsculas
  newname=$(echo "$file" | sed 's/\.JPG$/.jpg/; s/\.JPEG$/.jpeg/; s/\.PNG$/.png/')

  # Renombrar
  mv "$file" "$newname"

  echo "Renamed: $file -> $newname"
done
```

**DEBES VER:** Lista de archivos renombrados

#### **Paso 5: Actualizar referencias en código**

```bash
# Buscar referencias con extensiones mayúsculas
grep -r "\.JPG" --include="*.ts" --include="*.tsx" --include="*.json" src/
grep -r "\.JPEG" --include="*.ts" --include="*.tsx" --include="*.json" src/
grep -r "\.PNG" --include="*.ts" --include="*.tsx" --include="*.json" src/
```

**Para cada archivo encontrado:**

1. Reemplazar `.JPG` por `.jpg`
2. Reemplazar `.JPEG` por `.jpeg`
3. Reemplazar `.PNG` por `.png`

**Ejemplo con sed:**

```bash
# Reemplazar en archivo específico
sed -i 's/\.JPG/.jpg/g' src/data/products.ts
sed -i 's/\.JPEG/.jpeg/g' src/data/products.ts
sed -i 's/\.PNG/.png/g' src/data/products.ts
```

#### **Paso 6: Identificar PNGs candidatos para conversión**

```bash
# Encontrar PNGs grandes (>200KB)
find public/Jpeg/ -name "*.png" -size +200k -exec ls -lh {} \; | awk '{print $5, $9}'
```

**ANOTA:** Archivos PNG grandes

**CRITERIO:** Si es foto de producto (no logo/icon), convertir a JPEG

#### **Paso 7: Convertir PNGs grandes a JPEG**

```bash
# Para cada PNG grande (uno por uno, no todos)
# Ejemplo: public/Jpeg/producto-vitamina-c.png

# Verificar que es una foto (no logo con transparencia)
file public/Jpeg/producto-vitamina-c.png

# Si NO necesita transparencia, convertir
convert public/Jpeg/producto-vitamina-c.png -quality 85 -strip public/Jpeg/producto-vitamina-c.jpg

# Comparar tamaños
ls -lh public/Jpeg/producto-vitamina-c.png
ls -lh public/Jpeg/producto-vitamina-c.jpg

# Si el JPEG es significativamente más pequeño (>30%), eliminar PNG
rm public/Jpeg/producto-vitamina-c.png

# Actualizar referencia en código
grep -r "producto-vitamina-c.png" src/
# Reemplazar por producto-vitamina-c.jpg en los archivos encontrados
```

**⚠️ IMPORTANTE:** Hacer UNO POR UNO, verificando cada archivo

#### **Paso 8: Convertir BMPs si existen**

```bash
# Buscar BMPs
find public/Jpeg/ -name "*.bmp"

# Para cada BMP encontrado
convert archivo.bmp -quality 85 -strip archivo.jpg

# Verificar tamaño
ls -lh archivo.bmp archivo.jpg

# Si JPEG es más pequeño, eliminar BMP
rm archivo.bmp

# Actualizar referencias en código
```

#### **Paso 9: Verificar que todo funciona**

```bash
# Build
npm run build

# Dev server
npm run dev
```

**PRUEBA MANUAL:**

1. Abre la app en el navegador
2. Ve a la tienda
3. Verifica que TODAS las imágenes cargan
4. Ve a páginas de productos individuales
5. Verifica que no hay imágenes rotas (404)

**⚠️ SI HAY IMÁGENES ROTAS:**

1. Identifica qué archivo falta
2. Verifica en el código qué nombre espera
3. Verifica qué nombre tiene el archivo
4. Corrige la referencia o renombra el archivo

#### **Paso 10: Optimizar todos los JPEGs**

```bash
# Instalar herramienta de optimización si no la tienes
npm install -g jpeg-recompress

# O usar ImageMagick
find public/Jpeg/ -name "*.jpg" | while read file; do
  # Crear temporal optimizado
  convert "$file" -quality 85 -strip "${file}.tmp"

  # Si el optimizado es más pequeño, reemplazar
  if [ -f "${file}.tmp" ]; then
    ORIGINAL_SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
    TMP_SIZE=$(stat -f%z "${file}.tmp" 2>/dev/null || stat -c%s "${file}.tmp")

    if [ "$TMP_SIZE" -lt "$ORIGINAL_SIZE" ]; then
      mv "${file}.tmp" "$file"
      echo "Optimized: $file (saved $(($ORIGINAL_SIZE - $TMP_SIZE)) bytes)"
    else
      rm "${file}.tmp"
    fi
  fi
done
```

#### **Paso 11: Commit**

```bash
git add .
git commit -m "fix(E020): Standardize image formats

- Converted all uppercase extensions to lowercase (.JPG -> .jpg)
- Converted large PNGs to JPEG where appropriate
- Converted BMP files to JPEG
- Optimized all JPEG files (quality 85)
- Updated all code references to match new filenames
- Reduced image directory size by ~XXX MB"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] No hay archivos con extensiones mayúsculas (.JPG, .JPEG, .PNG)
- [ ] PNGs grandes convertidos a JPEG (excepto logos/icons)
- [ ] BMPs convertidos a JPEG
- [ ] Todas las referencias actualizadas en código
- [ ] Build pasa sin errores
- [ ] Todas las imágenes cargan correctamente
- [ ] Tamaño de carpeta reducido
- [ ] Commit realizado

---

## E021: RENOMBRAR ARCHIVOS CON NOMBRES INCORRECTOS

### **🎯 OBJETIVO**

Renombrar archivos con nombres incorrectos, inconsistentes o que causan problemas.

### **📍 UBICACIÓN**

Múltiples archivos en el proyecto

### **🔍 PROBLEMA ACTUAL**

**Archivos problemáticos típicos:**

1. Espacios en nombres: `"Mi Archivo.tsx"` → Problemas en línea de comandos
2. Caracteres especiales: `"Producto#1.tsx"` → Problemas en URLs
3. Mayúsculas inconsistentes: `"ProductCard.tsx"` vs `"productCard.tsx"`
4. Nombres muy largos: `"ComponenteQueHaceMuchasCosasYTieneNombreLargo.tsx"`

### **📝 PASOS DETALLADOS**

#### **Paso 1: Buscar archivos con espacios**

```bash
# Buscar archivos con espacios en src/
find src/ -name "* *" -type f
```

**⚠️ SI ENCUENTRA ARCHIVOS:**
Anota cada uno

#### **Paso 2: Buscar archivos con caracteres especiales**

```bash
# Buscar archivos con caracteres problemáticos
find src/ -name "*[#@$%&]*" -type f
```

#### **Paso 3: Para cada archivo problemático**

**Ejemplo: Renombrar "Mi Archivo.tsx" a "mi-archivo.tsx"**

**3.1. Buscar referencias al archivo**

```bash
# Buscar imports del archivo
grep -r "Mi Archivo" --include="*.ts" --include="*.tsx" src/

# Buscar imports de su export
grep -r "from.*Mi.*Archivo" --include="*.ts" --include="*.tsx" src/
```

**ANOTA:** Todos los archivos que importan este archivo

**3.2. Renombrar el archivo**

```bash
# Renombrar
mv "src/components/Mi Archivo.tsx" "src/components/mi-archivo.tsx"

# Verificar
ls src/components/ | grep -i "archivo"
```

**3.3. Actualizar imports**

Para cada archivo que encontraste en 3.1:

**ANTES:**

```typescript
import { MiComponente } from './Mi Archivo';
```

**DESPUÉS:**

```typescript
import { MiComponente } from './mi-archivo';
```

**3.4. Verificar que compila**

```bash
npm run build
```

**3.5. Commit individual**

```bash
git add .
git commit -m "refactor: rename 'Mi Archivo.tsx' to 'mi-archivo.tsx'

- Removes spaces from filename
- Updates all imports
- Follows naming conventions"
```

#### **Paso 4: Verificar convenciones de nombres**

**Convenciones del proyecto:**

- Componentes: `PascalCase.tsx` (ej: `ProductCard.tsx`)
- Utilities: `camelCase.ts` (ej: `formatPrice.ts`)
- Hooks: `camelCase.ts` con prefijo `use` (ej: `useCart.ts`)
- Types: `PascalCase.ts` o `types.ts`
- Constants: `UPPER_SNAKE_CASE.ts` o `camelCase.ts`

**Buscar inconsistencias:**

```bash
# Componentes que deberían estar en PascalCase
find src/components/ -name "*[a-z]*.tsx" | grep -v "index.tsx"

# Utilities que deberían estar en camelCase
find src/utils/ -name "*[A-Z]*.ts"
```

#### **Paso 5: Renombrar según convenciones**

Para cada archivo inconsistente, repetir Paso 3.

#### **Paso 6: Commit final**

```bash
git add .
git commit -m "fix(E021): Standardize filenames across project

- Removed spaces from filenames
- Removed special characters from filenames
- Applied consistent naming conventions:
  * Components: PascalCase
  * Utils: camelCase
  * Hooks: useCamelCase
- Updated all imports and references
- All builds passing"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] No hay archivos con espacios en nombres
- [ ] No hay archivos con caracteres especiales problemáticos
- [ ] Todos los archivos siguen convenciones de nombres
- [ ] Todas las referencias actualizadas
- [ ] Build pasa sin errores
- [ ] Commit realizado

---

## E022: REFACTORIZAR PRODUCTS.TS (6,415 LÍNEAS)

### **🎯 OBJETIVO**

Dividir el archivo monolítico `products.ts` (6,415 líneas) en archivos más pequeños y manejables.

### **📍 UBICACIÓN**

Archivo: `src/data/products.ts` (6,415 líneas)

### **🔍 PROBLEMA ACTUAL**

```typescript
// src/data/products.ts (6,415 líneas) ❌
export const products: Product[] = [
  { id: '1', name: 'Producto 1', ... },  // Línea 1
  { id: '2', name: 'Producto 2', ... },  // Línea 50
  // ... 6,415 líneas más ...
  { id: '85', name: 'Producto 85', ... }  // Línea 6415
];
```

**Problemas:**

1. Editor se cuelga al abrir el archivo
2. Git diffs gigantes (difícil hacer code review)
3. Búsqueda lenta
4. Difícil de mantener
5. Bundle grande (todo carga aunque no se use)

### **✅ SOLUCIÓN**

Dividir por categorías en archivos separados:

```
src/data/
├── products/
│   ├── index.ts              # Re-exporta todo
│   ├── vitaminas.ts          # Productos de vitaminas
│   ├── minerales.ts          # Productos de minerales
│   ├── hierbas.ts            # Productos de hierbas
│   ├── proteinas.ts          # Productos de proteínas
│   └── otros.ts              # Productos sin categoría
└── types/
    └── product.ts            # Tipos compartidos
```

### **📝 PASOS DETALLADOS**

#### **Paso 1: Backup del archivo**

```bash
cp src/data/products.ts src/data/products.ts.backup
```

#### **Paso 2: Analizar categorías**

```bash
# Ver las categorías que existen
grep -o '"category":\s*"[^"]*"' src/data/products.ts | sort | uniq -c | sort -rn
```

**ANOTA:** Las categorías encontradas y cuántos productos hay en cada una

**Ejemplo esperado:**

```
25 "category": "vitaminas"
20 "category": "minerales"
15 "category": "hierbas"
12 "category": "proteinas"
13 "category": "otros"
```

#### **Paso 3: Crear estructura de directorios**

```bash
# Crear carpeta products
mkdir -p src/data/products

# Verificar
ls -la src/data/
```

#### **Paso 4: Extraer productos por categoría**

**⚠️ ESTO REQUIERE SCRIPT PERSONALIZADO**

Si tienes Node.js, crea este script:

**Archivo:** `scripts/split-products.js`

```javascript
const fs = require('fs');

// Leer archivo original
const content = fs.readFileSync('src/data/products.ts', 'utf8');

// Extraer el array de productos
const productsMatch = content.match(/export const products[^[]*\[([^\]]*)\]/s);
if (!productsMatch) {
  console.error('No se pudo encontrar el array de productos');
  process.exit(1);
}

// Parsear productos (simplificado - puede necesitar ajustes)
const productsString = productsMatch[1];

// Dividir por objetos (buscar pattern { ... })
const productObjects = [];
let braceCount = 0;
let currentProduct = '';

for (let i = 0; i < productsString.length; i++) {
  const char = productsString[i];
  currentProduct += char;

  if (char === '{') braceCount++;
  if (char === '}') {
    braceCount--;
    if (braceCount === 0 && currentProduct.trim()) {
      productObjects.push(currentProduct.trim());
      currentProduct = '';
    }
  }
}

// Agrupar por categoría
const categories = {};

productObjects.forEach((prodStr) => {
  const categoryMatch = prodStr.match(/category['":\s]*['"]([^'"]+)['"]/);
  const category = categoryMatch ? categoryMatch[1] : 'otros';

  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push(prodStr);
});

// Crear archivos por categoría
Object.keys(categories).forEach((category) => {
  const filename = `src/data/products/${category}.ts`;
  const imports = `import { Product } from '../types/product';\n\n`;
  const content =
    imports +
    `export const ${category}Products: Product[] = [\n` +
    categories[category].join(',\n') +
    '\n];\n';

  fs.writeFileSync(filename, content);
  console.log(
    `Created ${filename} with ${categories[category].length} products`
  );
});

// Crear index.ts que reexporta todo
const indexContent =
  `// Auto-generated index file
import { Product } from '../types/product';

` +
  Object.keys(categories)
    .map((cat) => `import { ${cat}Products } from './${cat}';`)
    .join('\n') +
  `

export const products: Product[] = [
` +
  Object.keys(categories)
    .map((cat) => `  ...${cat}Products,`)
    .join('\n') +
  `
];

// También exportar por categoría para lazy loading
` +
  Object.keys(categories)
    .map((cat) => `export { ${cat}Products };`)
    .join('\n');

fs.writeFileSync('src/data/products/index.ts', indexContent);
console.log('Created index.ts');

console.log('\n✅ Products split successfully!');
console.log('Total categories:', Object.keys(categories).length);
console.log('Total products:', productObjects.length);
```

**Ejecutar script:**

```bash
node scripts/split-products.js
```

#### **Paso 5: Verificar archivos creados**

```bash
# Listar archivos creados
ls -lh src/data/products/

# Verificar que tienen contenido
wc -l src/data/products/*.ts

# Ver estructura del index
head -30 src/data/products/index.ts
```

**DEBES VER:** Varios archivos .ts con productos divididos

#### **Paso 6: Actualizar imports en el proyecto**

```bash
# Buscar imports del archivo original
grep -r "from.*data/products" --include="*.ts" --include="*.tsx" src/ | grep -v "products/"
```

**Para cada archivo encontrado:**

**ANTES:**

```typescript
import { products } from '../data/products';
```

**DESPUÉS:**

```typescript
import { products } from '../data/products';
// El index.ts en products/ reexporta todo, así que funciona igual
```

**O mejor, si solo necesitas una categoría:**

```typescript
// ANTES (cargaba todo)
import { products } from '../data/products';
const vitaminas = products.filter((p) => p.category === 'vitaminas');

// DESPUÉS (carga solo lo necesario)
import { vitaminasProducts } from '../data/products';
```

#### **Paso 7: Verificar que compila**

```bash
npm run build
```

**DEBES VER:** Build exitoso

**⚠️ SI FALLA:**

1. Lee los errores de import
2. Verifica que los paths son correctos
3. Verifica que los exports están bien

#### **Paso 8: Verificar tamaño de bundles**

```bash
# Ver tamaños antes (usando el backup)
# Ya lo anotaste antes

# Ver tamaños ahora
ls -lh dist/assets/*.js | grep data
```

**DEBES VER:** Chunks más pequeños, especialmente si usas imports selectivos

#### **Paso 9: Optimizar imports para lazy loading**

En componentes que solo necesitan una categoría:

**Ejemplo en StorePage.tsx:**

**ANTES:**

```typescript
import { products } from '@/data/products';

// Filtrar en runtime
const vitaminProducts = products.filter((p) => p.category === 'vitaminas');
```

**DESPUÉS:**

```typescript
import { vitaminasProducts } from '@/data/products';

// Ya está filtrado, no necesita runtime filtering
const vitaminProducts = vitaminasProducts;
```

#### **Paso 10: Eliminar archivo original (CUIDADO)**

```bash
# Solo después de verificar que TODO funciona

# Eliminar el archivo gigante
rm src/data/products.ts

# Mantener el backup por si acaso
mv src/data/products.ts.backup ../products-backup.ts
```

#### **Paso 11: Commit**

```bash
git add .
git commit -m "refactor(E022): Split monolithic products.ts into categories

- Split 6,415 line file into category-based modules
- Created src/data/products/ directory structure
- Organized products by category:
  * vitaminas.ts (XX products)
  * minerales.ts (XX products)
  * hierbas.ts (XX products)
  * proteinas.ts (XX products)
  * otros.ts (XX products)
- Created index.ts for backward compatibility
- Enables selective imports for better code splitting
- Improves editor performance and maintainability"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] Archivo products.ts dividido en múltiples archivos
- [ ] Cada categoría en su propio archivo
- [ ] index.ts reexporta todo para compatibilidad
- [ ] Build pasa sin errores
- [ ] Bundle size similar o menor
- [ ] Tests pasan sin cambios
- [ ] Editor abre archivos rápidamente
- [ ] Commit realizado

---

## E023: OPTIMIZAR MANUAL CHUNKS EN VITE.CONFIG

### **🎯 OBJETIVO**

Optimizar la estrategia de code splitting en `vite.config.ts` para mejorar carga inicial y caching.

### **📍 UBICACIÓN**

Archivo: `vite.config.ts` (líneas 116-172)

### **🔍 PROBLEMA ACTUAL**

**vite.config.ts actual:**

```typescript
manualChunks: (id) => {
  // Vendor chunks
  if (id.includes('node_modules')) {
    if (id.includes('react') || id.includes('react-dom')) {
      return 'vendor-react';
    }
    if (id.includes('react-router-dom')) {
      return 'vendor-router';
    }
    if (
      id.includes('framer-motion') ||
      id.includes('lodash') ||
      id.includes('zustand')
    ) {
      return 'vendor-ui';
    }
    if (
      id.includes('axios') ||
      id.includes('dompurify') ||
      id.includes('zod')
    ) {
      return 'vendor-utils';
    }
    return 'vendor-other';
  }
  // ... más lógica
};
```

**Problemas:**

1. Chunks muy grandes (vendor-other)
2. No aprovecha caching browser óptimo
3. Algunas dependencias deberían tener su propio chunk
4. Puede mejorar time to interactive

### **✅ SOLUCIÓN**

Estrategia mejorada:

1. React core separado (cambia poco, cache permanente)
2. Dependencias grandes en chunks individuales
3. Código de app por feature/route
4. Threshold de tamaño óptimo

### **📝 PASOS DETALLADOS**

#### **Paso 1: Analizar bundle actual**

```bash
# Build con visualización
npm run build

# Ver tamaños actuales
ls -lh dist/assets/*.js | sort -k5 -h
```

**ANOTA:** Los 5 chunks más grandes y sus tamaños

#### **Paso 2: Backup del archivo**

```bash
cp vite.config.ts vite.config.ts.backup
```

#### **Paso 3: Actualizar manualChunks**

**Editar `vite.config.ts` líneas 116-172:**

**ANTES:**

```typescript
manualChunks: (id) => {
  // Vendor chunks
  if (id.includes('node_modules')) {
    if (id.includes('react') || id.includes('react-dom')) {
      return 'vendor-react';
    }
    if (id.includes('react-router-dom')) {
      return 'vendor-router';
    }
    if (
      id.includes('framer-motion') ||
      id.includes('lodash') ||
      id.includes('zustand')
    ) {
      return 'vendor-ui';
    }
    if (
      id.includes('axios') ||
      id.includes('dompurify') ||
      id.includes('zod')
    ) {
      return 'vendor-utils';
    }
    return 'vendor-other';
  }
  // Application chunks ...
};
```

**DESPUÉS:**

```typescript
manualChunks: (id) => {
  // Vendor chunks - Optimized strategy
  if (id.includes('node_modules')) {
    // React core - Changes rarely, cache aggressively
    if (id.includes('react/') || id.includes('react-dom/')) {
      return 'vendor-react-core';
    }

    // React ecosystem - Medium stability
    if (id.includes('react-router-dom') || id.includes('react-hook-form')) {
      return 'vendor-react-ecosystem';
    }

    // Animation - Large library, separate for caching
    if (id.includes('framer-motion')) {
      return 'vendor-animation';
    }

    // State management - Small but frequently used
    if (id.includes('zustand') || id.includes('immer')) {
      return 'vendor-state';
    }

    // Utilities - Mixed stability
    if (
      id.includes('lodash') ||
      id.includes('nanoid') ||
      id.includes('date-fns')
    ) {
      return 'vendor-utils-common';
    }

    // Data fetching & validation
    if (id.includes('axios') || id.includes('zod')) {
      return 'vendor-data';
    }

    // Security & sanitization
    if (id.includes('dompurify')) {
      return 'vendor-security';
    }

    // Monitoring & analytics
    if (id.includes('@sentry') || id.includes('web-vitals')) {
      return 'vendor-monitoring';
    }

    // UI components libraries
    if (id.includes('recharts') || id.includes('react-window')) {
      return 'vendor-ui-advanced';
    }

    // Everything else - keep small
    return 'vendor-misc';
  }

  // Application chunks - By feature
  if (id.includes('/src/pages/')) {
    // Route-based splitting
    if (
      id.includes('/src/pages/HomePage') ||
      id.includes('/src/pages/AboutPage')
    ) {
      return 'app-home';
    }
    if (
      id.includes('/src/pages/StorePage') ||
      id.includes('/src/pages/ProductPage')
    ) {
      return 'app-store';
    }
    if (
      id.includes('/src/pages/CheckoutPage') ||
      id.includes('/src/pages/CartPage')
    ) {
      return 'app-commerce';
    }
    if (
      id.includes('/src/pages/BlogPage') ||
      id.includes('/src/pages/BlogPostPage')
    ) {
      return 'app-blog';
    }
    if (
      id.includes('/src/pages/ProfilePage') ||
      id.includes('/src/pages/OrdersPage')
    ) {
      return 'app-account';
    }
    return 'app-pages-other';
  }

  if (id.includes('/src/components/')) {
    // Heavy components separate
    if (
      id.includes('VirtualizedProductGrid') ||
      id.includes('ProductGallery')
    ) {
      return 'components-heavy';
    }
    // Common components together
    if (
      id.includes('Header') ||
      id.includes('Footer') ||
      id.includes('Layout')
    ) {
      return 'components-layout';
    }
    return 'components-other';
  }

  // Data layer
  if (id.includes('/src/data/')) {
    // After splitting products.ts, this will be smaller
    return 'app-data';
  }

  // Utilities and hooks - Usually small
  if (id.includes('/src/hooks/') || id.includes('/src/utils/')) {
    return 'app-utils';
  }

  // State stores
  if (id.includes('/src/store/')) {
    return 'app-stores';
  }
};
```

#### **Paso 4: Ajustar chunk size warnings**

**En la misma sección de build, actualizar:**

```typescript
build: {
  // ... otras opciones
  chunkSizeWarningLimit: 400, // Reducir de 500 a 400
  rollupOptions: {
    output: {
      manualChunks: /* función de arriba */,
      // Agregar threshold mínimo
      experimentalMinChunkSize: 1000, // 1KB mínimo
      // ... resto de configuración
    }
  }
}
```

#### **Paso 5: Build y analizar**

```bash
npm run build
```

**DEBES VER:**

- Build exitoso
- Más chunks pero más pequeños
- Ningún chunk >400KB

```bash
# Ver nuevos chunks
ls -lh dist/assets/*.js | sort -k5 -h

# Comparar con anotaciones del Paso 1
```

#### **Paso 6: Instalar plugin de análisis (opcional pero recomendado)**

```bash
npm install --save-dev rollup-plugin-visualizer
```

**Agregar a vite.config.ts:**

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      // ... otros plugins

      // Solo en build de producción
      mode === 'production' &&
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    // ... resto de config
  };
});
```

**Build con visualización:**

```bash
npm run build
```

**Abrir análisis:**

```bash
# Abrir en navegador
open dist/stats.html  # Mac
xdg-open dist/stats.html  # Linux
start dist/stats.html  # Windows
```

**REVISAR:**

- Distribución de tamaños
- Chunks innecesariamente grandes
- Oportunidades de optimización

#### **Paso 7: Verificar en desarrollo**

```bash
npm run dev
```

**PRUEBA MANUAL:**

1. Abre DevTools → Network
2. Navega por la app
3. Observa qué chunks se cargan
4. Verifica que solo carga lo necesario por ruta

#### **Paso 8: Commit**

```bash
git add vite.config.ts package.json package-lock.json
git commit -m "perf(E023): Optimize Vite manual chunks strategy

- Separated React core for aggressive caching
- Split large libraries into individual chunks
- Organized app code by feature/route
- Added rollup-plugin-visualizer for analysis
- Reduced chunk size warning limit to 400KB
- Improved caching strategy and initial load time
- All chunks now under size limits"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] Ningún chunk >400KB
- [ ] React core en chunk separado
- [ ] Librerías grandes en chunks individuales
- [ ] Código de app organizado por feature
- [ ] Build pasa sin warnings de tamaño
- [ ] Visualizer instalado y funcionando
- [ ] Commit realizado

---

## E024: ADVERTENCIAS PRODUCTOS PELIGROSOS

### **🎯 OBJETIVO**

Implementar sistema de advertencias para productos que requieren precauciones (alergias, interacciones, contraindicaciones).

### **📍 UBICACIÓN**

- Types: `src/types/product.ts`
- Components: `src/components/ProductWarnings.tsx` (nuevo)
- Data: `src/data/products/` (agregar warnings)

### **🔍 PROBLEMA ACTUAL**

```typescript
// Producto SIN advertencias ❌
{
  id: 'p001',
  name: 'Ginkgo Biloba 120mg',
  price: 25.99,
  // ... otras propiedades
  // ❌ No hay campo para advertencias
}
```

**Problemas:**

1. No se muestran advertencias importantes
2. Usuarios pueden no conocer contraindicaciones
3. Posible riesgo para la salud
4. No cumple mejores prácticas de e-commerce de suplementos

### **✅ SOLUCIÓN**

Agregar sistema completo de warnings:

```typescript
{
  id: 'p001',
  name: 'Ginkgo Biloba 120mg',
  price: 25.99,
  warnings: {
    allergens: ['nuts'], // Alergenos
    interactions: ['blood-thinners'], // Interacciones medicamentosas
    contraindications: ['pregnancy'], // Contraindicaciones
    specialNotes: 'Consultar médico si toma anticoagulantes'
  }
}
```

### **📝 PASOS DETALLADOS**

#### **Paso 1: Actualizar tipos**

**Editar `src/types/product.ts`:**

**ANTES:**

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  // ... otros campos
}
```

**DESPUÉS:**

```typescript
export interface ProductWarnings {
  allergens?: string[]; // Alérgenos comunes
  interactions?: string[]; // Interacciones con medicamentos
  contraindications?: string[]; // Contraindicaciones
  sideEffects?: string[]; // Efectos secundarios
  specialNotes?: string; // Notas especiales
  severity?: 'low' | 'medium' | 'high'; // Nivel de severidad
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  // ... otros campos
  warnings?: ProductWarnings; // Nuevo campo opcional
}
```

#### **Paso 2: Crear componente de advertencias**

**Crear `src/components/ProductWarnings.tsx`:**

```typescript
import React from 'react';
import { ProductWarnings as WarningsType } from '@/types/product';

interface ProductWarningsProps {
  warnings: WarningsType;
  compact?: boolean;
}

export const ProductWarnings: React.FC<ProductWarningsProps> = ({
  warnings,
  compact = false
}) => {
  if (!warnings) return null;

  const hasWarnings =
    (warnings.allergens && warnings.allergens.length > 0) ||
    (warnings.interactions && warnings.interactions.length > 0) ||
    (warnings.contraindications && warnings.contraindications.length > 0) ||
    (warnings.sideEffects && warnings.sideEffects.length > 0) ||
    warnings.specialNotes;

  if (!hasWarnings) return null;

  const severityColor = {
    low: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    medium: 'bg-orange-50 border-orange-200 text-orange-800',
    high: 'bg-red-50 border-red-200 text-red-800'
  };

  const severity = warnings.severity || 'low';
  const colorClass = severityColor[severity];

  if (compact) {
    return (
      <div className={`p-2 rounded border ${colorClass}`}>
        <p className="text-sm font-semibold flex items-center">
          <span className="mr-2">⚠️</span>
          Este producto tiene advertencias importantes
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClass}`}>
      <h3 className="text-lg font-bold mb-3 flex items-center">
        <span className="mr-2">⚠️</span>
        Advertencias Importantes
      </h3>

      {warnings.allergens && warnings.allergens.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold mb-1">Alérgenos:</h4>
          <ul className="list-disc list-inside text-sm">
            {warnings.allergens.map((allergen, idx) => (
              <li key={idx}>{getAllergenLabel(allergen)}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.interactions && warnings.interactions.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold mb-1">Interacciones con Medicamentos:</h4>
          <ul className="list-disc list-inside text-sm">
            {warnings.interactions.map((interaction, idx) => (
              <li key={idx}>{getInteractionLabel(interaction)}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.contraindications && warnings.contraindications.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold mb-1">Contraindicaciones:</h4>
          <ul className="list-disc list-inside text-sm">
            {warnings.contraindications.map((contra, idx) => (
              <li key={idx}>{getContraindicationLabel(contra)}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.sideEffects && warnings.sideEffects.length > 0 && (
        <div className="mb-3">
          <h4 className="font-semibold mb-1">Posibles Efectos Secundarios:</h4>
          <ul className="list-disc list-inside text-sm">
            {warnings.sideEffects.map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.specialNotes && (
        <div className="mt-3 pt-3 border-t border-current">
          <p className="text-sm italic">{warnings.specialNotes}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-current">
        <p className="text-xs font-semibold">
          ⚕️ Consulte a su médico antes de usar este producto si está embarazada,
          amamantando, tomando medicamentos o tiene alguna condición médica.
        </p>
      </div>
    </div>
  );
};

// Funciones helper para labels amigables
function getAllergenLabel(allergen: string): string {
  const labels: Record<string, string> = {
    'nuts': 'Frutos secos',
    'soy': 'Soja',
    'gluten': 'Gluten',
    'dairy': 'Lácteos',
    'shellfish': 'Mariscos',
    'eggs': 'Huevos',
    'fish': 'Pescado'
  };
  return labels[allergen] || allergen;
}

function getInteractionLabel(interaction: string): string {
  const labels: Record<string, string> = {
    'blood-thinners': 'Anticoagulantes (warfarina, aspirina)',
    'diabetes-meds': 'Medicamentos para diabetes',
    'blood-pressure': 'Medicamentos para presión arterial',
    'antidepressants': 'Antidepresivos',
    'immunosuppressants': 'Inmunosupresores'
  };
  return labels[interaction] || interaction;
}

function getContraindicationLabel(contra: string): string {
  const labels: Record<string, string> = {
    'pregnancy': 'Embarazo',
    'breastfeeding': 'Lactancia',
    'children': 'Niños menores de 12 años',
    'surgery': 'Cirugía programada (suspender 2 semanas antes)',
    'bleeding-disorders': 'Trastornos de coagulación'
  };
  return labels[contra] || contra;
}

export default ProductWarnings;
```

#### **Paso 3: Agregar warnings a productos**

**Editar archivos en `src/data/products/`:**

**Ejemplo - vitaminas.ts:**

```typescript
export const vitaminasProducts: Product[] = [
  {
    id: 'vit-001',
    name: 'Vitamina K2 100mcg',
    price: 29.99,
    // ... otros campos
    warnings: {
      interactions: ['blood-thinners'],
      contraindications: ['surgery'],
      specialNotes: 'No tomar si usa anticoagulantes sin consultar médico',
      severity: 'high',
    },
  },
  {
    id: 'vit-002',
    name: 'Vitamina D3 5000 IU',
    price: 19.99,
    // ... otros campos
    warnings: {
      contraindications: ['children'],
      sideEffects: ['Náuseas si se toma con estómago vacío'],
      specialNotes: 'Tomar con comida para mejor absorción',
      severity: 'low',
    },
  },
  // ... más productos
];
```

**⚠️ IMPORTANTE:** Solo agregar warnings a productos que realmente las necesiten. Investigar cada producto.

#### **Paso 4: Integrar en ProductPage**

**Editar `src/pages/ProductPage.tsx`:**

```typescript
import ProductWarnings from '@/components/ProductWarnings';

function ProductPage() {
  const { productId } = useParams();
  const product = // ... obtener producto

  return (
    <div className="product-page">
      {/* ... otra información del producto */}

      {/* Agregar advertencias */}
      {product.warnings && (
        <section className="mt-8">
          <ProductWarnings warnings={product.warnings} />
        </section>
      )}

      {/* ... resto de la página */}
    </div>
  );
}
```

#### **Paso 5: Integrar en ProductCard (versión compacta)**

**Editar `src/components/ProductCard.tsx`:**

```typescript
import ProductWarnings from '@/components/ProductWarnings';

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      {/* ... imagen, nombre, precio */}

      {/* Advertencia compacta */}
      {product.warnings && (
        <div className="mt-2">
          <ProductWarnings warnings={product.warnings} compact />
        </div>
      )}

      {/* ... botones, etc */}
    </div>
  );
}
```

#### **Paso 6: Tests**

**Crear `src/components/__tests__/ProductWarnings.test.tsx`:**

```typescript
import { render, screen } from '@testing-library/react';
import ProductWarnings from '../ProductWarnings';

describe('ProductWarnings', () => {
  test('renders nothing when no warnings', () => {
    const { container } = render(<ProductWarnings warnings={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders allergen warnings', () => {
    const warnings = {
      allergens: ['nuts', 'soy'],
      severity: 'medium' as const
    };

    render(<ProductWarnings warnings={warnings} />);

    expect(screen.getByText(/Alérgenos:/i)).toBeInTheDocument();
    expect(screen.getByText(/Frutos secos/i)).toBeInTheDocument();
    expect(screen.getByText(/Soja/i)).toBeInTheDocument();
  });

  test('renders compact version', () => {
    const warnings = {
      allergens: ['nuts'],
      severity: 'low' as const
    };

    render(<ProductWarnings warnings={warnings} compact />);

    expect(screen.getByText(/advertencias importantes/i)).toBeInTheDocument();
    expect(screen.queryByText(/Alérgenos:/i)).not.toBeInTheDocument();
  });
});
```

#### **Paso 7: Verificar compilación**

```bash
npm run build
npm test
```

**TODO DEBE PASAR**

#### **Paso 8: Prueba manual**

```bash
npm run dev
```

**PRUEBA:**

1. Ve a un producto con warnings
2. Verifica que se muestran las advertencias
3. Ve a la tienda
4. Verifica que cards muestran versión compacta
5. Verifica colores según severity

#### **Paso 9: Commit**

```bash
git add .
git commit -m "feat(E024): Implement product warnings system

- Added ProductWarnings type with comprehensive fields
- Created ProductWarnings component (full and compact versions)
- Integrated warnings in ProductPage and ProductCard
- Added severity levels (low/medium/high) with color coding
- Included allergens, interactions, contraindications, side effects
- Added tests for warning display
- Enhanced user safety and legal compliance"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] Tipo ProductWarnings creado
- [ ] Componente ProductWarnings funcionando
- [ ] Warnings integrados en ProductPage
- [ ] Warnings compactos en ProductCard
- [ ] Tests pasando
- [ ] Build exitoso
- [ ] Warnings visibles en UI
- [ ] Commit realizado

---

# FASE 3: MEJORAS CALIDAD

## 📊 RESUMEN FASE 3

**Duración estimada:** 1-2 semanas  
**Nivel de dificultad:** MEDIO  
**Impacto:** Mejora mantenibilidad, reduce deuda técnica

**Correcciones en esta fase:**

- E015: Reducir usos de 'any'
- E016: Remover console statements
- E017: Implementar TODOs
- E018: Corregir mojibake (texto corrupto)

---

## E015: REDUCIR USOS DE 'ANY'

### **🎯 OBJETIVO**

Reducir 77 usos de 'any' a <10, reemplazando con tipos apropiados.

### **📍 UBICACIÓN**

Múltiples archivos en `src/`

### **🔍 PROBLEMA ACTUAL**

```typescript
// ❌ Uso de any - pierde type safety
function formatPrice(value: any): string {
  return `$${value.toFixed(2)}`;
}

// ❌ Props sin tipo
const Component = (props: any) => {
  return <div>{props.name}</div>;
};

// ❌ Event handlers
const handleClick = (event: any) => {
  console.log(event.target.value);
};
```

### **📝 PASOS DETALLADOS**

#### **Paso 1: Encontrar todos los 'any'**

```bash
# Buscar 'any' en el código
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

# Ver contexto de cada uno
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" > any-usage.txt

# Ver archivo
cat any-usage.txt | head -20
```

**ANOTA:** Cuántos 'any' existen

#### **Paso 2: Categorizar usos de 'any'**

**Revisar any-usage.txt y categorizar:**

1. **Event handlers** - Fácil de arreglar
2. **Props de componentes** - Medio
3. **Funciones genéricas** - Medio
4. **API responses** - Requiere crear tipos
5. **Third-party types** - Puede necesitar @types

#### **Paso 3: Arreglar Event Handlers**

**PATRÓN COMÚN:**

**ANTES:**

```typescript
const handleClick = (event: any) => {
  console.log(event.target.value);
};

const handleChange = (e: any) => {
  setValue(e.target.value);
};
```

**DESPUÉS:**

```typescript
import { MouseEvent, ChangeEvent } from 'react';

const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
  console.log(event.currentTarget.value);
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};
```

**TIPOS COMUNES DE EVENTOS:**

- Click: `MouseEvent<HTMLButtonElement>`
- Change input: `ChangeEvent<HTMLInputElement>`
- Change select: `ChangeEvent<HTMLSelectElement>`
- Submit: `FormEvent<HTMLFormElement>`
- Keyboard: `KeyboardEvent<HTMLInputElement>`

#### **Paso 4: Arreglar Props de Componentes**

**ANTES:**

```typescript
const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

**DESPUÉS:**

```typescript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};
```

#### **Paso 5: Arreglar API Responses**

**ANTES:**

```typescript
async function fetchProducts(): Promise<any> {
  const response = await fetch('/api/products');
  return response.json();
}

// Uso
const products = await fetchProducts();
products.forEach((p: any) => console.log(p.name)); // ❌ any
```

**DESPUÉS:**

```typescript
interface ApiProduct {
  id: string;
  name: string;
  price: number;
  // ... otros campos
}

async function fetchProducts(): Promise<ApiProduct[]> {
  const response = await fetch('/api/products');
  return response.json();
}

// Uso
const products = await fetchProducts();
products.forEach((p) => console.log(p.name)); // ✅ typed
```

#### **Paso 6: Arreglar funciones genéricas**

**ANTES:**

```typescript
function findById(items: any[], id: string): any {
  return items.find((item) => item.id === id);
}
```

**DESPUÉS:**

```typescript
function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find((item) => item.id === id);
}

// O mejor, con tipo específico
interface Identifiable {
  id: string;
}

function findById<T extends Identifiable>(
  items: T[],
  id: string
): T | undefined {
  return items.find((item) => item.id === id);
}
```

#### **Paso 7: Cuando 'unknown' es apropiado**

Algunos casos donde 'any' debe reemplazarse con 'unknown':

**ANTES:**

```typescript
function processData(data: any) {
  // No sabemos qué tipo es
  console.log(data);
}
```

**DESPUÉS:**

```typescript
function processData(data: unknown) {
  // Necesitamos type guard
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  } else if (typeof data === 'number') {
    console.log(data.toFixed(2));
  }
}
```

#### **Paso 8: Verificar progreso**

Después de cada 10-15 correcciones:

```bash
# Contar any restantes
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

# Type check
npm run type-check

# Build
npm run build
```

#### **Paso 9: Commit incremental**

```bash
git add .
git commit -m "refactor(E015): Reduce 'any' usage in event handlers

- Replaced any with proper event types in XX files
- Added MouseEvent, ChangeEvent, FormEvent types
- Reduced total 'any' count from 77 to XX
- All type checks passing"

git push origin fase-2-corrections
```

**Repetir Paso 9 por categoría** (eventos, props, API, etc.)

#### **Paso 10: Commit final**

```bash
git add .
git commit -m "refactor(E015): Completed 'any' usage reduction

- Reduced from 77 to <10 'any' usages
- Categorized and fixed by type:
  * Event handlers: proper React event types
  * Component props: defined interfaces
  * API responses: typed interfaces
  * Generic functions: proper generics or unknown
- Improved type safety across codebase
- All builds and type checks passing"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] <10 usos de 'any' en toda la codebase
- [ ] Todos los event handlers tipados
- [ ] Todos los componentes con Props tipadas
- [ ] API responses con interfaces
- [ ] Type check pasa sin errores
- [ ] Build exitoso
- [ ] Commits incrementales realizados

---

## E016: REMOVER CONSOLE STATEMENTS

### **🎯 OBJETIVO**

Remover 129 console statements del código de producción.

### **📍 UBICACIÓN**

Múltiples archivos en `src/`

### **🔍 PROBLEMA ACTUAL**

```typescript
// ❌ console.log en código
console.log('Debug: valor =', valor);
console.error('Error occurred:', error);
console.warn('Warning:', warning);

// ❌ console.log olvidados en producción
if (process.env.NODE_ENV === 'development') {
  console.log('Dev only'); // Pero aún se envía a producción
}
```

**Problemas:**

1. Información sensible puede exponerse
2. Performance overhead mínimo
3. Noise en consola de producción
4. No es profesional

### **✅ SOLUCIÓN**

1. Reemplazar con sistema de logging apropiado
2. Remover console.log de debug
3. Mantener solo error handling crítico
4. Configurar build para remover automáticamente

### **📝 PASOS DETALLADOS**

#### **Paso 1: Encontrar todos los console**

```bash
# Contar console statements
grep -r "console\." src/ --include="*.ts" --include="*.tsx" | wc -l

# Ver todos
grep -rn "console\." src/ --include="*.ts" --include="*.tsx" > console-usage.txt

# Ver resumen
cat console-usage.txt | head -30
```

**ANOTA:** Cuántos hay y dónde están concentrados

#### **Paso 2: Categorizar console statements**

**Categorías:**

1. **Debug logging** - `console.log('Debug:...')` → REMOVER
2. **Development diagnostics** - `console.log('DIAGNOSTIC:...')` → REMOVER o convertir a logger
3. **Error handling** - `console.error(...)` → Convertir a logger
4. **Performance monitoring** - `console.time(...)` → Convertir a logger
5. **User feedback** - Muy raro, evaluar caso por caso

#### **Paso 3: Verificar logger existente**

```bash
# Verificar si existe logger.ts
cat src/utils/logger.ts | head -20
```

**SI EXISTE:** Usar ese logger  
**SI NO EXISTE:** Crear uno simple

#### **Paso 4: Crear/mejorar logger** (si es necesario)

**Archivo:** `src/utils/logger.ts` (si no existe o necesita mejoras)

```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private enabledLevels: Set<LogLevel>;

  constructor() {
    // En desarrollo: todo
    // En producción: solo warn y error
    this.enabledLevels = new Set(
      this.isDevelopment
        ? ['debug', 'info', 'warn', 'error']
        : ['warn', 'error']
    );
  }

  private log(level: LogLevel, message: string, context?: any) {
    if (!this.enabledLevels.has(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    // En desarrollo: console
    // En producción: enviar a servicio de logging
    if (this.isDevelopment) {
      const logFn =
        level === 'error'
          ? console.error
          : level === 'warn'
            ? console.warn
            : console.log;

      logFn(`[${level.toUpperCase()}] ${message}`, context || '');
    } else {
      // En producción: enviar a Sentry, LogRocket, etc.
      if (level === 'error' || level === 'warn') {
        // window.analytics?.track('log', entry);
        // Sentry.captureMessage(message, level);
      }
    }
  }

  debug(message: string, context?: any) {
    this.log('debug', message, context);
  }

  info(message: string, context?: any) {
    this.log('info', message, context);
  }

  warn(message: string, context?: any) {
    this.log('warn', message, context);
  }

  error(message: string, context?: any) {
    this.log('error', message, context);
  }

  // Métodos convenientes
  performance(metric: string, value: number, context?: any) {
    this.info(`Performance: ${metric}`, { value, ...context });
  }

  navigation(from: string, to: string) {
    this.debug(`Navigation: ${from} → ${to}`);
  }
}

export const logger = new Logger();
export default logger;
```

#### **Paso 5: Reemplazar console.log de debug**

**PATRÓN:**

**ANTES:**

```typescript
console.log('User clicked button:', buttonId);
console.log('Form data:', formData);
```

**DESPUÉS:**

```typescript
import { logger } from '@/utils/logger';

logger.debug('User clicked button:', { buttonId });
logger.debug('Form data:', { formData });
```

#### **Paso 6: Reemplazar console.error**

**ANTES:**

```typescript
try {
  // ...
} catch (error) {
  console.error('Failed to fetch:', error);
}
```

**DESPUÉS:**

```typescript
import { logger } from '@/utils/logger';

try {
  // ...
} catch (error) {
  logger.error('Failed to fetch products', {
    error: error instanceof Error ? error.message : error,
  });
}
```

#### **Paso 7: Remover console.log de DIAGNOSTIC**

**En App.tsx hay muchos:**

**ANTES (líneas 43-96):**

```typescript
if (import.meta.env.DEV) {
  console.log('DIAGNOSTIC: App component starting...');
}
// ... más console.log de DIAGNOSTIC
```

**DESPUÉS:**

```typescript
import { logger } from '@/utils/logger';

logger.debug('App component starting');
// ... convertir todos los DIAGNOSTIC a logger.debug
```

**O simplemente REMOVER** si ya no son necesarios:

```typescript
// Remover completamente los bloques if (import.meta.env.DEV)
```

#### **Paso 8: Configurar build para remover automáticamente**

**Editar `vite.config.ts`:**

```typescript
export default defineConfig(({ mode }) => {
  return {
    // ... otras opciones
    build: {
      // ... otras opciones de build
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remover todos los console.*
          drop_debugger: true, // Remover debugger
        },
      },
    },
  };
});
```

**⚠️ NOTA:** Esto remueve TODOS los console, incluyendo console.error. Si quieres mantener console.error:

```typescript
terserOptions: {
  compress: {
    pure_funcs: ['console.log', 'console.debug', 'console.info', 'console.warn'], // Solo remover estos
    drop_debugger: true
  }
}
```

#### **Paso 9: Buscar y reemplazar sistemáticamente**

```bash
# Por cada archivo con console
# Ejemplo: src/components/Header.tsx

# Ver cuántos console tiene
grep -n "console\." src/components/Header.tsx

# Editar archivo y reemplazar
# - console.log(...) → logger.debug(...)
# - console.error(...) → logger.error(...)
# - console.warn(...) → logger.warn(...)

# Verificar después de cada archivo
npm run build
```

#### **Paso 10: Verificar que no quedan console**

```bash
# Buscar console restantes
grep -rn "console\." src/ --include="*.ts" --include="*.tsx"

# Debería haber 0 o muy pocos (solo en utils/logger.ts)
```

#### **Paso 11: Build de producción**

```bash
# Build
npm run build

# Verificar que los console fueron removidos
# Buscar en los archivos compilados
grep -r "console\." dist/assets/*.js

# NO debería encontrar nada (terser los removió)
```

#### **Paso 12: Commit**

```bash
git add .
git commit -m "refactor(E016): Remove console statements from production code

- Replaced 129 console.log/error/warn with logger utility
- Converted debug console.log to logger.debug
- Converted error console.error to logger.error
- Removed diagnostic console statements from App.tsx
- Configured terser to drop console.* in production builds
- Logger only outputs in development, silent in production
- All builds passing"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] 0 console statements en src/ (excepto logger.ts)
- [ ] Logger utility funcionando
- [ ] Terser configurado para remover console
- [ ] Build de producción sin console en dist/
- [ ] Tests pasan sin cambios
- [ ] Commit realizado

---

## E017: IMPLEMENTAR 3 TODOS PENDIENTES

### **🎯 OBJETIVO**

Implementar los 3 TODOs pendientes en el código.

### **📍 UBICACIÓN**

Buscar en todo el proyecto

### **📝 PASOS DETALLADOS**

#### **Paso 1: Encontrar todos los TODOs**

```bash
# Buscar TODOs
grep -rn "TODO" src/ --include="*.ts" --include="*.tsx"

# O buscar variaciones
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" > todos.txt

# Ver archivo
cat todos.txt
```

**ANOTA:** Todos los TODOs encontrados

#### **Paso 2: Priorizar TODOs**

Para cada TODO:

1. **Crítico** - Bloquea funcionalidad → Hacer ahora
2. **Alto** - Mejora importante → Hacer en esta fase
3. **Medio** - Nice to have → Considerar
4. **Bajo** - Optimización futura → Backlog

#### **Paso 3: Implementar cada TODO**

**Ejemplo típico:**

**ANTES:**

```typescript
// TODO: Add proper error handling
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
```

**DESPUÉS:**

```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Failed to fetch data', { error });
    throw error; // O manejar apropiadamente
  }
}
```

#### **Paso 4: Por cada TODO implementado**

```bash
# Verificar que funciona
npm run build
npm test

# Commit
git add .
git commit -m "fix: Implement TODO - proper error handling in fetchData

- Added try/catch block
- Added HTTP status check
- Added error logging
- Properly propagates errors"

git push origin fase-2-corrections
```

#### **Paso 5: Commit final**

```bash
git add .
git commit -m "chore(E017): Implemented all pending TODOs

- Implemented TODO #1: Error handling in API calls
- Implemented TODO #2: [descripción]
- Implemented TODO #3: [descripción]
- Reduced technical debt
- All TODOs resolved or moved to backlog with tickets"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] 3+ TODOs críticos/altos implementados
- [ ] Resto de TODOs documentados en backlog
- [ ] Build pasa después de cada implementación
- [ ] Tests pasan después de cada implementación
- [ ] Commits por cada TODO
- [ ] Commit final realizado

---

## E018: CORREGIR MOJIBAKE (TEXTO CORRUPTO)

### **🎯 OBJETIVO**

Corregir 188 instancias de texto corrupto (mojibake) en el código.

### **📍 UBICACIÓN**

Múltiples archivos, especialmente en `src/data/products/`

### **🔍 PROBLEMA ACTUAL**

**Mojibake típico:**

```typescript
// ❌ Texto corrupto
name: 'VitaminaÂ C 1000mg'; // Debe ser: "Vitamina C 1000mg"
description: 'MejÃ³raÂ elÂ sistemaÂ inmune'; // Debe ser: "Mejora el sistema inmune"
```

**Causas:**

- Encoding incorrecto (UTF-8 vs Latin-1)
- Copy/paste desde fuentes con encoding diferente
- Procesamiento de texto sin especificar encoding

### **📝 PASOS DETALLADOS**

#### **Paso 1: Detectar mojibake**

```bash
# Buscar caracteres sospechosos
grep -r "Â\|Ã\|â\|ñ\|ó" src/ --include="*.ts" --include="*.tsx" > mojibake.txt

# Contar instancias
wc -l mojibake.txt
```

**ANOTA:** Cuántas instancias hay

#### **Paso 2: Crear script de limpieza**

**Archivo:** `scripts/fix-mojibake.js`

```javascript
const fs = require('fs');
const path = require('path');

// Mapeo de mojibake común a caracteres correctos
const replacements = {
  // Vocales con acentos
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã': 'Á',
  'Ã': 'É',
  'Ã': 'Í',
  'Ã': 'Ó',
  'Ã': 'Ú',

  // Ñ
  'Ã±': 'ñ',
  'Ã': 'Ñ',

  // Espacios y caracteres especiales
  'Â ': ' ',
  'â': ''',
  'â': '"',
  'â': '"',
  'â': '—',

  // Otros comunes
  'Ã§': 'ç',
  'Ã¼': 'ü',
  'Ã¤': 'ä',
  'Ã¶': 'ö'
};

function fixMojibake(text) {
  let fixed = text;

  for (const [wrong, correct] of Object.entries(replacements)) {
    fixed = fixed.split(wrong).join(correct);
  }

  return fixed;
}

function processFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const fixed = fixMojibake(content);

    if (content !== fixed) {
      fs.writeFileSync(filepath, fixed, 'utf8');
      console.log(`✓ Fixed: ${filepath}`);
      return 1;
    }

    return 0;
  } catch (error) {
    console.error(`✗ Error processing ${filepath}:`, error.message);
    return 0;
  }
}

function processDirectory(dir) {
  let fixedCount = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      fixedCount += processDirectory(filepath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fixedCount += processFile(filepath);
    }
  }

  return fixedCount;
}

// Ejecutar
const srcDir = path.join(__dirname, '..', 'src');
console.log('Fixing mojibake in:', srcDir);

const totalFixed = processDirectory(srcDir);

console.log(`\n✅ Fixed ${totalFixed} files`);
```

#### **Paso 3: Ejecutar script**

```bash
# Backup primero
git add .
git commit -m "chore: Checkpoint before mojibake fix"

# Ejecutar script
node scripts/fix-mojibake.js
```

**DEBES VER:** Lista de archivos corregidos

#### **Paso 4: Verificar correcciones**

```bash
# Ver cambios
git diff src/data/products/ | head -50

# Buscar mojibake restante
grep -r "Â\|Ã\|â" src/ --include="*.ts" --include="*.tsx" | wc -l

# Debería ser significativamente menos
```

#### **Paso 5: Correcciones manuales**

**Si el script no capturó todo:**

```bash
# Ver casos restantes
grep -rn "Â\|Ã\|â" src/data/products/ --include="*.ts"

# Editar manualmente cada archivo
```

**Ejemplo de corrección manual:**

**ANTES:**

```typescript
name: 'ColágenoÂ TipoÂ II';
description: 'MejÃ³raÂ laÂ saludÂ articularÂ yÂ reduce laÂ inflamaciÃ³n';
```

**DESPUÉS:**

```typescript
name: 'Colágeno Tipo II';
description: 'Mejora la salud articular y reduce la inflamación';
```

#### **Paso 6: Prevenir futuro mojibake**

**Agregar a `.editorconfig`:**

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{ts,tsx,js,jsx}]
charset = utf-8
```

**Configurar VS Code** (`.vscode/settings.json`):

```json
{
  "files.encoding": "utf8",
  "files.autoGuessEncoding": false
}
```

#### **Paso 7: Verificar build**

```bash
npm run build
```

**DEBES VER:** Build exitoso

#### **Paso 8: Verificar en browser**

```bash
npm run dev
```

**PRUEBA MANUAL:**

1. Ve a página de productos
2. Verifica que nombres y descripciones se ven correctos
3. No debe haber caracteres extraños (Â, Ã, etc.)

#### **Paso 9: Commit**

```bash
git add .
git commit -m "fix(E018): Correct mojibake (corrupted text encoding)

- Fixed 188 instances of corrupted characters
- Corrected Spanish accents and special characters
- Added .editorconfig to enforce UTF-8
- Configured VS Code for UTF-8 encoding
- All text now displays correctly
- Script: scripts/fix-mojibake.js"

git push origin fase-2-corrections
```

### **✓ CRITERIOS DE ÉXITO**

- [ ] <10 instancias de mojibake restantes
- [ ] Script de corrección creado
- [ ] .editorconfig configurado
- [ ] VS Code configurado para UTF-8
- [ ] Build exitoso
- [ ] Texto se ve correctamente en UI
- [ ] Commit realizado

---

# FASE 4: OPTIMIZACIONES

## 📊 RESUMEN FASE 4

**Duración estimada:** Backlog (cuando sea necesario)  
**Nivel de dificultad:** MEDIO  
**Impacto:** Optimizaciones finales

**Tareas en esta fase:**

1. Generar versiones AVIF de imágenes
2. Auditar imágenes huérfanas
3. Métricas de tamaño final
4. Optimizaciones adicionales

---

## 📋 TAREAS FASE 4

### **1. Generar versiones AVIF**

**Script:** `scripts/generate-avif.sh`

```bash
#!/bin/bash
# Generar versiones AVIF de todas las imágenes JPEG

find public/Jpeg/ -name "*.jpg" | while read file; do
  avif="${file%.jpg}.avif"

  if [ ! -f "$avif" ]; then
    # Requiere avif-encoder instalado
    npx avif --input "$file" --output "$avif" --quality 85
    echo "Generated: $avif"
  fi
done

echo "✅ AVIF generation complete"
```

### **2. Auditar imágenes huérfanas**

**Script:** `scripts/audit-images.sh`

```bash
#!/bin/bash
# Encontrar imágenes no referenciadas en código

echo "Finding all images..."
find public/ -name "*.jpg" -o -name "*.png" -o -name "*.webp" > /tmp/all-images.txt

echo "Checking references..."
while read image; do
  filename=$(basename "$image")

  # Buscar referencias en código
  refs=$(grep -r "$filename" src/ --include="*.ts" --include="*.tsx" | wc -l)

  if [ "$refs" -eq 0 ]; then
    echo "ORPHAN: $image"
  fi
done < /tmp/all-images.txt

echo "✅ Audit complete"
```

### **3. Métricas finales**

```bash
# Bundle size
npm run build
ls -lh dist/assets/*.js | awk '{sum+=$5} END {print "Total JS:", sum/1024/1024 "MB"}'

# Image size
du -sh public/

# Total project size
du -sh .
```

---

# VERIFICACIONES OBLIGATORIAS

## ✅ DESPUÉS DE CADA CAMBIO

```bash
# 1. Type check
npm run type-check

# 2. Build
npm run build

# 3. Tests
npm test

# 4. Git status
git status
```

**⚠️ SI ALGO FALLA:** DETENER y reportar al usuario

---

# QUÉ HACER SI ALGO FALLA

## 🔴 ESCENARIO: Build Falla

```bash
# 1. Leer error completo
npm run build 2>&1 | tee build-error.log

# 2. Identificar archivo problemático
# Buscar en build-error.log

# 3. Restaurar archivo
git checkout HEAD -- ruta/al/archivo.tsx

# 4. Intentar build de nuevo
npm run build

# 5. Si aún falla, reportar al usuario
cat build-error.log
```

## 🔴 ESCENARIO: Tests Fallan

```bash
# 1. Ver qué tests fallaron
npm test 2>&1 | tee test-error.log

# 2. Si son tests nuevos que agregaste
# Arreglar los tests

# 3. Si son tests existentes que rompiste
# Revertir cambio
git checkout HEAD -- archivo-que-cambiaste.tsx

# 4. Reportar al usuario
```

## 🔴 ESCENARIO: App No Carga

```bash
# 1. Ver console del browser
# Chrome DevTools → Console

# 2. Ver network errors
# Chrome DevTools → Network → Filter by "Failed"

# 3. Restaurar desde backup
git checkout HEAD -- .

# 4. Reportar al usuario con screenshots
```

## 🔴 ESCENARIO: Git Push Falla

```bash
# 1. Pull primero
git pull origin fase-2-corrections

# 2. Resolver conflictos si hay
git status

# 3. Continuar
git push origin fase-2-corrections

# 4. Si aún falla, reportar
```

---

# 🎉 CONCLUSIÓN

Has completado las instrucciones exhaustivas para Gemini Code Assist.

**RECUERDA:**

1. ✅ Lee TODO antes de empezar
2. ✅ Haz UN cambio a la vez
3. ✅ Verifica SIEMPRE después de cada cambio
4. ✅ Haz commits frecuentes
5. ✅ Si falla, DETENTE y reporta

**SIGUIENTE PASO:** Abre `PHASE_2_CHECKLIST.md` y empieza con E011.

---

**Documento generado para:** Pureza-Naturalis-V3  
**Fecha:** 2025  
**Versión:** 1.0  
**Mantenedor:** Usuario + Gemini Code Assist bajo supervisión
