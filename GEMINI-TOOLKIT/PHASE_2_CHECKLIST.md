# ✅ FASE 2: CHECKLIST INTERACTIVO

## 📋 CÓMO USAR ESTE CHECKLIST

1. **Marca cada checkbox ✅ cuando completes el paso**
2. **NO saltes pasos** - hazlos en orden
3. **Si algo falla** - marca con ❌ y reporta al usuario
4. **Haz commit** después de completar cada corrección mayor
5. **Lee las instrucciones completas** en [`GEMINI_INSTRUCTIONS.md`](./GEMINI_INSTRUCTIONS.md) antes de empezar

---

## 🎯 OBJETIVO FASE 2

Completar correcciones de prioridad ALTA que impactan significativamente el tamaño del bundle, arquitectura y calidad del código.

**Meta:** Reducir bundle size ~400KB, mejorar arquitectura, eliminar duplicaciones

---

## ⚙️ PRE-REQUISITOS

### Setup Inicial

- [ ] Proyecto clonado y accesible
- [ ] Node.js v18+ instalado
- [ ] npm instalado
- [ ] Git configurado
- [ ] VS Code o editor similar disponible

### Verificaciones Previas

- [ ] `npm install` ejecutado exitosamente
- [ ] `npm run build` pasa sin errores
- [ ] `npm test` ejecutado (puede tener algunos fallos, es normal)
- [ ] Git status limpio (no hay cambios sin commitear)

### Backup

- [ ] Branch `main` verificado
- [ ] Nuevo branch `fase-2-corrections` creado
  ```bash
  git checkout -b fase-2-corrections
  ```
- [ ] Push del branch de backup realizado
  ```bash
  git push origin fase-2-corrections
  ```

**⚠️ SI ALGUNA VERIFICACIÓN FALLA:** No continúes. Reporta al usuario y espera instrucciones.

---

## E011: CONSOLIDAR IMPORTS MIXTOS

**📍 Archivo Principal:** `App.tsx`  
**⏱️ Tiempo Estimado:** 30-60 minutos  
**🎯 Objetivo:** Usar siempre el alias `@/` para imports internos

### Pasos

#### 1. Verificar Configuración

- [ ] Leído `tsconfig.json` para confirmar alias `@/`
- [ ] Alias apunta a `./src/*`

#### 2. Buscar Imports Mixtos

- [ ] Ejecutado: `grep -r "from '\./src/" src/ --include="*.tsx" --include="*.ts"`
- [ ] Ejecutado: `grep -r "from '\./contexts" src/ --include="*.tsx" --include="*.ts"`
- [ ] Ejecutado: `grep -r "from '\.\./contexts" src/ --include="*.tsx" --include="*.ts"`
- [ ] Anotados todos los archivos encontrados: ******\_******

#### 3. Actualizar App.tsx

- [ ] Backup creado: `cp App.tsx App.tsx.backup`
- [ ] Línea 3: Cambiado `'./src/contexts/CartContext'` → `'@/contexts/CartContext'`
- [ ] Línea 4: Cambiado `'./src/contexts/AuthContext'` → `'@/contexts/AuthContext'`
- [ ] Línea 5: Cambiado `'./src/contexts/WishlistContext'` → `'@/contexts/WishlistContext'`
- [ ] Otros imports de `./src/` cambiados a `@/`

#### 4. Verificar App.tsx

- [ ] `npm run build` ejecutado
- [ ] Build exitoso ✅ (Si falla ❌, restaurar backup y reportar)
- [ ] `npm test` ejecutado
- [ ] Sin nuevos errores

#### 5. Actualizar Otros Archivos

- [ ] Archivo 1: ******\_****** - Actualizado y verificado
- [ ] Archivo 2: ******\_****** - Actualizado y verificado
- [ ] Archivo 3: ******\_****** - Actualizado y verificado
- [ ] Archivo 4: ******\_****** - Actualizado y verificado
- [ ] (Agregar más según necesario)

#### 6. Verificación Final

- [ ] No hay imports con `./src/` en src/
- [ ] No hay imports relativos para contexts/components/hooks
- [ ] `npm run build` pasa
- [ ] `npm run type-check` pasa
- [ ] Tests pasan sin regresiones

#### 7. Commit

- [ ] `git add .` ejecutado
- [ ] Commit realizado con mensaje apropiado
- [ ] Push realizado: `git push origin fase-2-corrections`

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E012-E013: LIMPIAR DEPENDENCIES BACKEND

**📍 Archivo Principal:** `package.json`  
**⏱️ Tiempo Estimado:** 20-30 minutos  
**🎯 Objetivo:** Eliminar dependencias de backend no utilizadas

### Pasos

#### 1. Verificar Que NO Se Usan

- [ ] Ejecutado: `grep -r "from 'express'" src/`
- [ ] Resultado: Sin matches (o solo en archivos no usados)
- [ ] Ejecutado: `grep -r "from 'mongoose'" src/`
- [ ] Resultado: Sin matches
- [ ] Ejecutado: `grep -r "from 'helmet'" src/`
- [ ] Resultado: Sin matches

#### 2. Backup

- [ ] `cp package.json package.json.backup` ejecutado

#### 3. Medir Bundle Actual

- [ ] `npm run build` ejecutado
- [ ] Tamaños de chunks anotados:
  - vendor-react: **\_\_\_** KB
  - vendor-other: **\_\_\_** KB
  - Total JS: **\_\_\_** KB

#### 4. Remover Dependencies

- [ ] Abierto `package.json` en editor
- [ ] Removido `"express": "^5.1.0"`
- [ ] Removido `"mongoose": "^8.17.0"`
- [ ] Removido `"helmet": "^8.1.0"`
- [ ] Removido `"@types/express": "^5.0.3"` de dependencies

#### 5. Mover @types a devDependencies

- [ ] Verificado qué `@types/*` están en dependencies
- [ ] Movidos tipos apropiados a devDependencies
- [ ] Lista de tipos movidos: ******\_******

#### 6. Reinstalar

- [ ] `rm -rf node_modules package-lock.json` ejecutado
- [ ] `npm install` ejecutado
- [ ] Instalación exitosa ✅ (Si falla ❌, restaurar backup)

#### 7. Verificar Build

- [ ] `npm run build` ejecutado
- [ ] Build exitoso ✅
- [ ] Nuevos tamaños de chunks:
  - vendor-react: **\_\_\_** KB
  - vendor-other: **\_\_\_** KB
  - Total JS: **\_\_\_** KB
- [ ] Reducción confirmada: **\_\_\_** KB

#### 8. Tests

- [ ] `npm test` ejecutado
- [ ] Mismos resultados que antes (o mejor)

#### 9. Commit

- [ ] `git add package.json package-lock.json`
- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E014: INCLUIR TESTS EN COMPILACIÓN TYPESCRIPT

**📍 Archivo Principal:** `tsconfig.json`  
**⏱️ Tiempo Estimado:** 10-15 minutos  
**🎯 Objetivo:** TypeScript debe type-check archivos de test

### Pasos

#### 1. Backup

- [ ] `cp tsconfig.json tsconfig.json.backup` ejecutado

#### 2. Verificar Estructura de Tests

- [ ] Ejecutado: `find . -name "*.test.ts" -o -name "*.test.tsx" | grep -v node_modules`
- [ ] Directorios de tests anotados: ******\_******

#### 3. Editar tsconfig.json

- [ ] Abierto `tsconfig.json` en editor
- [ ] Agregada sección `"include"` con:
  ```json
  "include": [
    "src/**/*",
    "test/**/*",
    "*.tsx",
    "*.ts"
  ]
  ```
- [ ] Agregada sección `"exclude"` con:
  ```json
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "coverage"
  ]
  ```

#### 4. Verificar Type Checking

- [ ] `npm run type-check` ejecutado
- [ ] Número de errores nuevos: ******\_******
- [ ] **NOTA:** Errores nuevos en tests son ESPERADOS (se arreglan en Fase 3)

#### 5. Verificar Build

- [ ] `npm run build` ejecutado
- [ ] Build exitoso ✅

#### 6. Verificar Tests Corren

- [ ] `npm test` ejecutado
- [ ] Tests se ejecutan (algunos pueden fallar, es normal)

#### 7. Commit

- [ ] `git add tsconfig.json`
- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E019: ELIMINAR DUPLICACIÓN DE ASSETS

**📍 Carpetas:** `public/Jpeg/` (mantener) vs carpetas duplicadas  
**⏱️ Tiempo Estimado:** 30-45 minutos  
**🎯 Objetivo:** Eliminar ~300MB de imágenes duplicadas

### ⚠️ ADVERTENCIA CRÍTICA

**LEER ANTES DE CONTINUAR:**

- Este paso puede ROMPER la app si eliminas archivos incorrectos
- Verifica TODO antes de borrar
- Haz backup COMPLETO antes de empezar
- Si tienes dudas, PREGUNTA al usuario

### Pasos

#### 1. Backup COMPLETO

- [ ] `tar -czf imagenes-backup-$(date +%Y%m%d).tar.gz public/ "Imagenes Piping Rock/"` ejecutado
- [ ] Archivo tar creado exitosamente
- [ ] Tamaño del backup: **\_\_\_** MB
- [ ] `mv imagenes-backup-*.tar.gz ../` ejecutado

#### 2. Inventario de Carpetas

- [ ] Ejecutado: `find . -type d -name "*[Ii]magen*" | grep -v node_modules`
- [ ] Carpetas encontradas:
  - [ ] `./public/Jpeg` ✅ MANTENER
  - [ ] `./Imagenes Piping Rock` ❌ REVISAR PARA ELIMINAR
  - [ ] Otras: ******\_****** ❌ REVISAR

#### 3. Buscar Referencias

- [ ] `grep -r "Imagenes Piping Rock" src/` ejecutado
- [ ] Resultado: ******\_****** (Debe ser: sin resultados)
- [ ] `grep -r "public/Jpeg" src/` ejecutado
- [ ] Resultado: ******\_****** (Debe tener resultados)

#### 4. Comparar Archivos (Muestra)

- [ ] Verificado que archivos en "Imagenes Piping Rock" son duplicados
- [ ] Método usado: ******\_****** (md5sum, visual, etc.)
- [ ] Confirmado que son duplicados: SÍ ✅ / NO ❌

#### 5. Eliminar "Imagenes Piping Rock"

- [ ] **ÚLTIMO CHEQUEO:** Backup existe ✅
- [ ] **ÚLTIMO CHEQUEO:** No hay referencias en código ✅
- [ ] `rm -rf "Imagenes Piping Rock/"` ejecutado
- [ ] `ls -la | grep -i "imagenes"` ejecutado
- [ ] Carpeta eliminada confirmado ✅

#### 6. Verificar Build

- [ ] `npm run build` ejecutado
- [ ] Build exitoso ✅

#### 7. Prueba Manual OBLIGATORIA

- [ ] `npm run dev` ejecutado
- [ ] Abierto `http://localhost:3000` en navegador
- [ ] Página Home carga ✅
- [ ] Imágenes en Home visible ✅
- [ ] Navegado a /tienda ✅
- [ ] Productos muestran imágenes ✅
- [ ] Clickeado en 3+ productos diferentes
  - Producto 1: ******\_****** - Imágenes OK ✅
  - Producto 2: ******\_****** - Imágenes OK ✅
  - Producto 3: ******\_****** - Imágenes OK ✅

#### 8. Verificar Reducción

- [ ] `du -sh .` ejecutado antes: **\_\_\_** GB
- [ ] `du -sh .` ejecutado ahora: **\_\_\_** GB
- [ ] Reducción: **\_\_\_** MB

#### 9. Otras Carpetas Duplicadas

- [ ] Revisado si hay otras carpetas sospechosas
- [ ] Carpetas adicionales eliminadas: ******\_******
- [ ] O: No hay otras carpetas para eliminar ✅

#### 10. Commit

- [ ] `git add .`
- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E020: CORREGIR FORMATOS DE IMAGEN

**📍 Carpeta:** `public/Jpeg/`  
**⏱️ Tiempo Estimado:** 45-60 minutos  
**🎯 Objetivo:** Estandarizar formatos y optimizar imágenes

### Pasos

#### 1. Verificar Herramientas

- [ ] `convert --version` ejecutado (ImageMagick)
- [ ] Herramienta disponible: SÍ ✅ / NO ❌
- [ ] Si NO disponible: Reportado al usuario y esperando instalación

#### 2. Inventario

- [ ] Archivos .jpg: **\_\_\_** archivos
- [ ] Archivos .jpeg: **\_\_\_** archivos
- [ ] Archivos .png: **\_\_\_** archivos
- [ ] Archivos .bmp: **\_\_\_** archivos
- [ ] Archivos .JPG/.JPEG/.PNG (mayúsculas): **\_\_\_** archivos

#### 3. Backup

- [ ] `tar -czf jpeg-backup-$(date +%Y%m%d).tar.gz public/Jpeg/` ejecutado
- [ ] Movido fuera del proyecto

#### 4. Convertir Mayúsculas a Minúsculas

- [ ] Script ejecutado para renombrar extensiones
- [ ] Archivos renombrados: **\_\_\_** archivos
- [ ] Verificado con `find public/Jpeg/ -name "*.JPG"` (debe ser 0)

#### 5. Actualizar Referencias en Código

- [ ] `grep -r "\.JPG" src/` ejecutado
- [ ] Archivos encontrados: ******\_******
- [ ] Todos actualizados a `.jpg`
- [ ] `grep -r "\.JPEG" src/` ejecutado y actualizado
- [ ] `grep -r "\.PNG" src/` ejecutado y actualizado

#### 6. Identificar PNGs Grandes

- [ ] `find public/Jpeg/ -name "*.png" -size +200k` ejecutado
- [ ] PNGs grandes encontrados: ******\_******

#### 7. Convertir PNGs a JPEG (Selectivo)

- [ ] PNG 1: ******\_******
  - Verificado que no necesita transparencia ✅
  - Convertido a JPEG ✅
  - Tamaño antes: **\_\_\_** KB, después: **\_\_\_** KB
- [ ] PNG 2: ******\_****** (repetir para cada uno)
- [ ] Referencias actualizadas en código

#### 8. Convertir BMPs

- [ ] BMPs encontrados: ******\_******
- [ ] Todos convertidos a JPEG ✅
- [ ] Referencias actualizadas en código

#### 9. Verificar Build y App

- [ ] `npm run build` ejecutado ✅
- [ ] `npm run dev` ejecutado
- [ ] Todas las imágenes cargan correctamente ✅
- [ ] Sin imágenes rotas (404) ✅

#### 10. Optimizar JPEGs

- [ ] Script de optimización ejecutado
- [ ] Reducción total: **\_\_\_** MB

#### 11. Commit

- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E021: RENOMBRAR ARCHIVOS INCORRECTOS

**📍 Múltiples archivos  
**⏱️ Tiempo Estimado:** 20-30 minutos  
**🎯 Objetivo:\*\* Nombres de archivos consistentes

### Pasos

#### 1. Buscar Archivos con Espacios

- [ ] `find src/ -name "* *" -type f` ejecutado
- [ ] Archivos encontrados: ******\_******

#### 2. Buscar Caracteres Especiales

- [ ] `find src/ -name "*[#@$%&]*" -type f` ejecutado
- [ ] Archivos encontrados: ******\_******

#### 3. Por Cada Archivo Problemático

- [ ] Archivo 1: ******\_******
  - Referencias encontradas ✅
  - Renombrado ✅
  - Referencias actualizadas ✅
  - Build verificado ✅
  - Commit realizado ✅

#### 4. Verificar Convenciones

- [ ] Componentes en PascalCase verificados
- [ ] Utils en camelCase verificados
- [ ] Hooks en useCamelCase verificados
- [ ] Inconsistencias corregidas

#### 5. Commit Final

- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E022: REFACTORIZAR PRODUCTS.TS

**📍 Archivo:** `src/data/products.ts` (6,415 líneas)  
**⏱️ Tiempo Estimado:** 60-90 minutos  
**🎯 Objetivo:** Dividir en archivos por categoría

### Pasos

#### 1. Backup

- [ ] `cp src/data/products.ts src/data/products.ts.backup` ejecutado

#### 2. Analizar Categorías

- [ ] Ejecutado script para contar categorías
- [ ] Categorías encontradas:
  - vitaminas: **\_\_\_** productos
  - minerales: **\_\_\_** productos
  - hierbas: **\_\_\_** productos
  - proteinas: **\_\_\_** productos
  - otros: **\_\_\_** productos

#### 3. Crear Estructura

- [ ] `mkdir -p src/data/products` ejecutado
- [ ] Carpeta creada ✅

#### 4. Ejecutar Script de División

- [ ] Script `scripts/split-products.js` creado
- [ ] Script ejecutado: `node scripts/split-products.js`
- [ ] Archivos creados:
  - [ ] `src/data/products/vitaminas.ts`
  - [ ] `src/data/products/minerales.ts`
  - [ ] `src/data/products/hierbas.ts`
  - [ ] `src/data/products/proteinas.ts`
  - [ ] `src/data/products/otros.ts`
  - [ ] `src/data/products/index.ts`

#### 5. Verificar Archivos

- [ ] Cada archivo tiene contenido válido
- [ ] index.ts reexporta correctamente
- [ ] Sintaxis TypeScript correcta

#### 6. Actualizar Imports

- [ ] Buscados imports antiguos: `grep -r "from.*data/products'" src/`
- [ ] Imports funcionan con nueva estructura ✅
- [ ] O imports actualizados según necesario

#### 7. Verificar Build

- [ ] `npm run build` ejecutado ✅
- [ ] Bundle size similar o menor

#### 8. Eliminar Archivo Original

- [ ] `rm src/data/products.ts` ejecutado
- [ ] Backup movido fuera del proyecto

#### 9. Commit

- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E023: OPTIMIZAR VITE CHUNKS

**📍 Archivo:** `vite.config.ts`  
**⏱️ Tiempo Estimado:** 30-45 minutos  
**🎯 Objetivo:** Mejorar estrategia de code splitting

### Pasos

#### 1. Analizar Bundle Actual

- [ ] `npm run build` ejecutado
- [ ] Top 5 chunks más grandes:
  1. ******\_****** - **\_\_\_** KB
  2. ******\_****** - **\_\_\_** KB
  3. ******\_****** - **\_\_\_** KB
  4. ******\_****** - **\_\_\_** KB
  5. ******\_****** - **\_\_\_** KB

#### 2. Backup

- [ ] `cp vite.config.ts vite.config.ts.backup` ejecutado

#### 3. Actualizar manualChunks

- [ ] Abierto `vite.config.ts` en editor
- [ ] Función `manualChunks` actualizada según instrucciones
- [ ] React core separado
- [ ] Librerías grandes en chunks individuales
- [ ] Código de app por feature

#### 4. Ajustar chunk size warning

- [ ] `chunkSizeWarningLimit` reducido a 400
- [ ] `experimentalMinChunkSize` agregado (1000)

#### 5. Instalar Visualizer (Opcional)

- [ ] `npm install --save-dev rollup-plugin-visualizer` ejecutado
- [ ] Plugin agregado a vite.config.ts
- [ ] Configurado para generar stats.html

#### 6. Build y Analizar

- [ ] `npm run build` ejecutado ✅
- [ ] Nuevo tamaño de chunks:
  - vendor-react-core: **\_\_\_** KB
  - vendor-animation: **\_\_\_** KB
  - app-store: **\_\_\_** KB
  - (listar los más grandes)
- [ ] Ningún chunk >400KB ✅

#### 7. Revisar Visualización

- [ ] `dist/stats.html` abierto en navegador
- [ ] Distribución revisada
- [ ] Sin chunks innecesariamente grandes

#### 8. Prueba en Dev

- [ ] `npm run dev` ejecutado
- [ ] DevTools Network abierto
- [ ] Navegado por la app
- [ ] Solo carga chunks necesarios por ruta ✅

#### 9. Commit

- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## E024: ADVERTENCIAS PRODUCTOS PELIGROSOS

**📍 Múltiples archivos  
**⏱️ Tiempo Estimado:** 45-60 minutos  
**🎯 Objetivo:\*\* Sistema de warnings para productos

### Pasos

#### 1. Actualizar Types

- [ ] Abierto `src/types/product.ts`
- [ ] Interface `ProductWarnings` agregada
- [ ] Campo `warnings?: ProductWarnings` agregado a `Product`

#### 2. Crear Componente

- [ ] Archivo `src/components/ProductWarnings.tsx` creado
- [ ] Componente implementado según especificaciones
- [ ] Versión completa y compacta incluidas
- [ ] Helper functions agregadas

#### 3. Agregar Warnings a Productos

- [ ] Identificados productos que necesitan warnings
- [ ] Agregados warnings a vitaminas.ts (si aplica)
- [ ] Agregados warnings a otros archivos de productos
- [ ] Solo productos que realmente lo necesitan

#### 4. Integrar en ProductPage

- [ ] `src/pages/ProductPage.tsx` editado
- [ ] Import de ProductWarnings agregado
- [ ] Componente integrado en la página
- [ ] Warnings se muestran correctamente

#### 5. Integrar en ProductCard

- [ ] `src/components/ProductCard.tsx` editado
- [ ] Versión compacta integrada
- [ ] Warnings visibles en cards

#### 6. Tests

- [ ] Archivo `src/components/__tests__/ProductWarnings.test.tsx` creado
- [ ] Tests implementados
- [ ] `npm test` ejecutado
- [ ] Tests pasan ✅

#### 7. Verificación Manual

- [ ] `npm run dev` ejecutado
- [ ] Producto con warnings abierto
- [ ] Warnings se muestran en página de producto ✅
- [ ] Warnings compactos en tienda ✅
- [ ] Colores según severity correctos ✅

#### 8. Build Final

- [ ] `npm run build` ejecutado ✅

#### 9. Commit

- [ ] Commit realizado
- [ ] Push realizado

**Estado:** ⬜ No Iniciado | 🔄 En Progreso | ✅ Completado | ❌ Falló

---

## 🎉 FASE 2 COMPLETADA

### Verificación Final

- [ ] Todos los items E011-E024 marcados como ✅ Completado
- [ ] `npm run build` pasa sin errores ni warnings
- [ ] `npm test` ejecutado (resultados anotados)
- [ ] `npm run type-check` ejecutado
- [ ] Bundle size reducido (anotar reducción): **\_\_\_** KB
- [ ] Todos los commits pushed a `fase-2-corrections`
- [ ] App funciona correctamente en dev: `npm run dev`

### Métricas Finales

**Bundle Size:**

- Antes: **\_\_\_** KB
- Después: **\_\_\_** KB
- Reducción: **\_\_\_** KB (objetivo: ~400KB)

**Código:**

- Imports consolidados: ✅
- Dependencies limpias: ✅
- Assets optimizados: ✅
- Chunks optimizados: ✅

### Siguiente Paso

- [ ] Merge a main (después de aprobación del usuario)
- [ ] O continuar con Fase 3: [`PHASE_3_CHECKLIST.md`](./PHASE_3_CHECKLIST.md)

### Notas y Observaciones

```
[Escribe aquí cualquier nota, problema encontrado, o decisión tomada durante la fase]




```

---

**📝 Documento Vivo:** Actualiza este checklist a medida que avanzas  
**🔄 Última Actualización:** [Fecha]  
**👤 Ejecutado por:** Gemini Code Assist + Usuario
