# 🔥 PROMPT ULTRA-AGRESIVO: CORRECCIÓN DE INCUMPLIMIENTOS - PUREZA NATURALIS V3

## ⚠️ CONTEXTO CRÍTICO

GPT-4.1, has completado solo el **40-50%** del trabajo anterior. Este prompt corrige ESPECÍFICAMENTE los incumplimientos detectados en la verificación.

**PROYECTO**: Pureza Naturalis V3 - E-commerce React 19 + TypeScript 5.7 + Vite 6
**RUTA**: `c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3`

---

## 🎯 INCUMPLIMIENTOS DETECTADOS QUE DEBES CORREGIR

### ❌ INCUMPLIMIENTO #1: 167 console.* statements en producción
**ESTADO ACTUAL**: 167 instancias de `console.log/warn/error/debug` en `src/`
**REQUISITO**: 0 instancias

**ACCIÓN OBLIGATORIA**:
1. Buscar TODAS las instancias: `console.log`, `console.warn`, `console.error`, `console.debug`
2. Reemplazar con `errorLogger.captureError()` (ya existe en `src/utils/errorLogger.ts`)
3. Eliminar console.* de desarrollo que no aporten valor
4. Verificar con: `grep -r "console\." src/` → debe devolver 0 resultados

**ARCHIVOS CONOCIDOS CON VIOLACIONES**:
- `src/pages/AddressesPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/services/api.ts` (4 instancias)
- `src/utils/backgroundSync.ts` (11 instancias)
- `src/utils/accessibilityTest.ts` (2 instancias)
- `src/utils/errorHandler.ts`
- Y 160+ más en otros archivos

---

### ❌ INCUMPLIMIENTO #2: 30 tipos `any` explícitos
**ESTADO ACTUAL**: 30 instancias de `: any` en `src/`
**REQUISITO**: 0 instancias

**ACCIÓN OBLIGATORIA**:
1. Buscar TODOS los `: any` explícitos
2. Reemplazar con tipos específicos usando interfaces/types existentes o crear nuevos
3. Para casos complejos, usar `unknown` y type guards en lugar de `any`
4. Verificar con: `grep -r ": any" src/` → debe devolver 0 resultados

**ARCHIVOS CONOCIDOS CON VIOLACIONES**:
- `src/pages/WishlistPage.tsx` (9 instancias - flagged por ESLint)
- `src/services/api.ts`
- `src/middleware/sanitizationMiddleware.ts`
- `src/utils/errorHandler.ts`
- `src/types/analytics.d.ts`
- `src/vite-env.d.ts`
- Y 20+ más en otros archivos

---

### ❌ INCUMPLIMIENTO #3: 12 ESLint warnings
**ESTADO ACTUAL**: 12 warnings reportados
**REQUISITO**: 0 warnings

**ACCIÓN OBLIGATORIA**:
1. Ejecutar: `npm run lint`
2. Corregir TODOS los warnings encontrados:

**WARNINGS ESPECÍFICOS**:
- **SearchBar.tsx**: Unused parameter `index` → eliminar o prefixar con `_`
- **WishlistPage.tsx**: 9 explicit `any` types → reemplazar con tipos específicos
- **WishlistPage.tsx**: Accessibility - form elements without labels → añadir labels o aria-labels
- **orderStore.ts**: Unused parameters `get` y `error` → eliminar o prefixar con `_`

3. Verificar con: `npm run lint` → debe mostrar "✓ 0 problems (0 errors, 0 warnings)"

---

### ❌ INCUMPLIMIENTO #4: Tests fallando (Exit Code 1)
**ESTADO ACTUAL**: 33 archivos test.* creados pero `npm run test:coverage` falla
**REQUISITO**: Tests pasan + 95%+ coverage

**ACCIÓN OBLIGATORIA**:
1. Ejecutar: `npm run test` y leer TODOS los errores
2. Corregir errores de React Router detectados
3. Corregir todas las assertions que fallan
4. Asegurar que cada test pase individualmente
5. Ejecutar: `npm run test:coverage`
6. Verificar que la cobertura sea ≥95% en todos los archivos críticos
7. Si hay archivos < 95%, escribir tests adicionales hasta alcanzar el objetivo

**ERRORES CONOCIDOS EN TESTS**:
- Errores de React Router en la ejecución
- Assertions fallidas en múltiples tests
- Tests que no se completan correctamente

---

## 🔍 VERIFICACIONES OBLIGATORIAS ADICIONALES

### ✅ VERIFICACIÓN #5: useEffect cleanups
**ACCIÓN**: 
1. Buscar TODOS los `useEffect` (50+ instancias detectadas)
2. Verificar que cada uno con side effects tenga `return () => {}` con cleanup
3. Casos específicos:
   - `addEventListener` → debe tener `removeEventListener` en cleanup
   - `setTimeout`/`setInterval` → debe tener `clearTimeout`/`clearInterval` en cleanup
   - Subscripciones → debe tener `.unsubscribe()` en cleanup
   - Observables → debe tener cleanup apropiado

**EJEMPLO CORRECTO**:
```typescript
useEffect(() => {
  const handleScroll = () => { /* ... */ };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

### ✅ VERIFICACIÓN #6: Event listeners cleanup
**ACCIÓN**:
1. Buscar TODOS los `addEventListener` (20+ instancias detectadas)
2. Verificar que cada uno tenga su correspondiente `removeEventListener`
3. Si está dentro de useEffect, el cleanup debe estar en el return
4. Si está en clase/hook custom, asegurar cleanup en unmount

**ARCHIVOS CONOCIDOS**:
- `src/utils/globalErrorHandler.ts`
- Múltiples hooks custom
- Componentes con scroll/keyboard listeners

---

### ✅ VERIFICACIÓN #7: Timers cleanup
**ACCIÓN**:
1. Buscar TODOS los `setTimeout` y `setInterval` (20+ instancias detectadas)
2. Verificar que cada uno tenga su `clearTimeout`/`clearInterval`
3. En useEffect, el cleanup debe estar en el return
4. Asegurar que no queden timers activos después de unmount

---

### ✅ VERIFICACIÓN #8: Bundle size
**ACCIÓN**:
1. Ejecutar: `npm run build`
2. Verificar en la salida que el bundle gzipped sea **< 300KB**
3. Si excede 300KB:
   - Implementar lazy loading adicional
   - Analizar con `npm run build -- --report`
   - Eliminar dependencias pesadas innecesarias
   - Split code agresivo

---

## 📋 CHECKLIST DE COMPLETITUD

Antes de decir "he terminado", verifica MANUALMENTE cada item:

### **PASO 1: Limpieza de Código**
- [ ] `grep -r "console\." src/` → **0 resultados**
- [ ] `grep -r ": any" src/` → **0 resultados** (excepto .d.ts si es inevitable)
- [ ] `npm run lint` → **✓ 0 problems (0 errors, 0 warnings)**
- [ ] `npm run type-check` → **✓ No TypeScript errors**

### **PASO 2: Tests y Cobertura**
- [ ] `npm run test` → **✓ All tests passing**
- [ ] `npm run test:coverage` → **✓ Coverage ≥95%**
- [ ] Revisar coverage report HTML para identificar gaps
- [ ] Escribir tests adicionales hasta alcanzar 95%+

### **PASO 3: Cleanups y Side Effects**
- [ ] Revisar CADA `useEffect` → todos tienen cleanup apropiado
- [ ] Revisar CADA `addEventListener` → todos tienen `removeEventListener`
- [ ] Revisar CADA `setTimeout`/`setInterval` → todos tienen `clear*`
- [ ] Revisar CADA subscription → todas tienen cleanup

### **PASO 4: Performance y Bundle**
- [ ] `npm run build` → **✓ Build successful**
- [ ] Bundle gzipped **< 300KB** (verificar en salida de build)
- [ ] Lazy loading implementado en rutas principales
- [ ] React.memo/useMemo/useCallback en componentes pesados
- [ ] Virtualización en listas largas (productos, wishlist, etc)

### **PASO 5: Security**
- [ ] DOMPurify usado en todos los innerHTML/dangerouslySetInnerHTML
- [ ] Zod schemas validando todas las inputs de usuario
- [ ] No hay eval(), new Function(), o innerHTML sin sanitizar
- [ ] API calls usan sanitization middleware

### **PASO 6: Accessibility**
- [ ] Todos los elementos interactivos tienen labels o aria-labels
- [ ] Navegación por teclado funciona correctamente
- [ ] Focus visible en todos los elementos interactivos
- [ ] ARIA attributes apropiados en componentes complejos
- [ ] Contraste de colores cumple WCAG 2.1 AA

### **PASO 7: Verificación Final**
- [ ] `npm run dev` → Aplicación carga sin errores en consola
- [ ] `npm run build` → Build exitoso < 300KB gzipped
- [ ] `npm run test:coverage` → 95%+ coverage
- [ ] `npm run lint` → 0 errors, 0 warnings
- [ ] Abrir aplicación y probar manualmente las rutas principales

---

## 🚨 REGLAS ULTRA-ESTRICTAS

### **CERO TOLERANCIA**:
1. **NO** dejar ningún `console.log/warn/error/debug` en `src/`
2. **NO** usar `any` en ningún lugar (excepto .d.ts de terceros si inevitable)
3. **NO** dejar warnings de ESLint sin resolver
4. **NO** dejar tests fallando
5. **NO** exceder 300KB gzipped en el bundle
6. **NO** dejar useEffect sin cleanup apropiado
7. **NO** dejar event listeners sin removeEventListener
8. **NO** dejar timers sin clearTimeout/clearInterval

### **COMPLETITUD AL 100%**:
- **CADA** archivo debe ser revisado
- **CADA** función debe tener tests
- **CADA** side effect debe tener cleanup
- **CADA** input de usuario debe estar validado
- **CADA** elemento HTML debe ser accesible

### **VERIFICACIÓN OBLIGATORIA**:
Ejecuta estos comandos y pega los resultados completos:
```bash
# 1. Verificar console.*
grep -r "console\." src/ | wc -l  # Debe ser 0

# 2. Verificar any types
grep -r ": any" src/ | wc -l  # Debe ser 0

# 3. Verificar ESLint
npm run lint  # Debe mostrar "✓ 0 problems"

# 4. Verificar TypeScript
npm run type-check  # Debe mostrar "✓ No errors"

# 5. Verificar Tests
npm run test:coverage  # Todos pasan + coverage ≥95%

# 6. Verificar Build
npm run build  # Exitoso + bundle < 300KB gzipped
```

---

## 🎯 RESULTADO ESPERADO

**ANTES DE DECIR "HE TERMINADO"**, debes poder ejecutar:

```bash
npm run lint && npm run type-check && npm run test:coverage && npm run build
```

Y obtener:
```
✓ ESLint: 0 problems (0 errors, 0 warnings)
✓ TypeScript: No errors
✓ Tests: All passing (33/33)
✓ Coverage: 95.7% (≥95% required)
✓ Build: Successful
  - dist/index.html: 1.23 kB
  - dist/assets/index-ABC123.js: 245.67 kB │ gzip: 78.34 kB
✓ Bundle size: < 300KB gzipped
```

**ADEMÁS**:
```bash
grep -r "console\." src/ | wc -l
# Output: 0

grep -r ": any" src/ | wc -l
# Output: 0
```

---

## 💀 MODO ULTRA-AGRESIVO ACTIVADO

- **SIN EXCUSAS**: Si algo no funciona, debuggea hasta que funcione
- **SIN ATAJOS**: No dejes código sucio "para después"
- **SIN COMPROMISOS**: 100% de los requisitos o no has terminado
- **VERIFICACIÓN TOTAL**: Ejecuta TODOS los comandos de verificación antes de reportar

**GPT-4.1, tienes acceso completo al proyecto. CORRIGE TODOS ESTOS INCUMPLIMIENTOS AHORA.**

---

## 📝 FORMATO DE REPORTE AL TERMINAR

Cuando completes TODOS los incumplimientos, reporta así:

```
✅ INCUMPLIMIENTO #1 CORREGIDO: console.* statements
   - 167 instancias eliminadas/reemplazadas
   - Verificación: grep -r "console\." src/ | wc -l → 0

✅ INCUMPLIMIENTO #2 CORREGIDO: any types
   - 30 instancias reemplazadas con tipos específicos
   - Verificación: grep -r ": any" src/ | wc -l → 0

✅ INCUMPLIMIENTO #3 CORREGIDO: ESLint warnings
   - 12 warnings corregidos
   - Verificación: npm run lint → ✓ 0 problems (0 errors, 0 warnings)

✅ INCUMPLIMIENTO #4 CORREGIDO: Tests
   - Todos los tests ahora pasan (33/33)
   - Coverage: 96.2% (≥95% required)
   - Verificación: npm run test:coverage → ✓ All passing

✅ VERIFICACIÓN #5 COMPLETADA: useEffect cleanups
   - 50+ useEffect revisados
   - Todos tienen cleanup apropiado

✅ VERIFICACIÓN #6 COMPLETADA: Event listeners
   - 20+ addEventListener revisados
   - Todos tienen removeEventListener en cleanup

✅ VERIFICACIÓN #7 COMPLETADA: Timers
   - 20+ timers revisados
   - Todos tienen clearTimeout/clearInterval

✅ VERIFICACIÓN #8 COMPLETADA: Bundle size
   - Bundle: 267KB gzipped (< 300KB ✓)

🎉 RESULTADO FINAL:
   npm run lint && npm run type-check && npm run test:coverage && npm run build
   → ✓ ALL CHECKS PASSED
```

**SOLO entonces puedes decir que has terminado.**

---

**INICIO DE CORRECCIONES: AHORA** 🔥
