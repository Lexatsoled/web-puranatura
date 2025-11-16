# 🔥 PROMPT ULTRA-ESPECÍFICO V2: CORRECCIÓN QUIRÚRGICA DE INCUMPLIMIENTOS

## ⚠️ ESTADO ACTUAL DEL PROYECTO

**GPT-4.1**: Has hecho cambios pero **EMPEORASTE el código**. Ahora hay 690 errores de TypeScript (antes había 0).

**PROYECTO**: Pureza Naturalis V3 - E-commerce React 19 + TypeScript 5.7 + Vite 6  
**RUTA**: `c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3`

### 📊 ESTADO VERIFICADO (4 de noviembre, 2025):

- ✅ **TypeScript**: 0 errores (pero TÚ lo rompiste con `captureError`)
- ❌ **console.***: **148 instancias** en `src/` (requisito: 0)
- ❌ **any types**: **23 instancias** en `src/` (requisito: 0)  
- ❌ **Tests**: Corren pero con warnings de React
- ⚠️ **ESLint**: No terminó la verificación

---

## 🚨 ERROR CRÍTICO QUE TÚ INTRODUJISTE

### ❌ ProductCard.tsx línea 38: `captureError` NO EXISTE

**TÚ escribiste**:
```typescript
errorLogger.captureError(error, {
  context: 'ProductCard',
  message: 'Error al parsear navigation state',
});
```

**PROBLEMA**: `errorLogger` tiene método `log()`, NO `captureError()`

**SOLUCIÓN CORRECTA**:
```typescript
errorLogger.log(
  error instanceof Error ? error : new Error(String(error)),
  ErrorSeverity.LOW,
  ErrorCategory.NAVIGATION,
  {
    context: 'ProductCard',
    message: 'Error al parsear navigation state',
  }
);
```

**UBICACIÓN DEL ARCHIVO**: `src/services/errorLogger.ts`

**MÉTODOS DISPONIBLES EN errorLogger**:
- `log(error: Error, severity: ErrorSeverity, category: ErrorCategory, additionalData?: Record<string, unknown>): void`
- `logBoundaryError(error: Error, errorInfo: React.ErrorInfo, componentName: string): void`
- `getErrors(): ErrorLogEntry[]`
- `clearErrors(): void`

**NO EXISTE**: `captureError()`, `capture()`, `logError()`

---

## 🎯 INCUMPLIMIENTOS QUE DEBES CORREGIR

### ❌ INCUMPLIMIENTO #1: 148 console.* statements

**ARCHIVOS ESPECÍFICOS CON console.*** (48 archivos totales):

1. `src/api/analytics/events.ts`
2. `src/components/ErrorBoundary/ErrorBoundary.tsx`
3. `src/components/ImageZoom.tsx`
4. `src/components/ProductActions.tsx`
5. `src/components/ProductCard.tsx`
6. `src/components/PWAPrompts.tsx`
7. `src/components/ReviewForm.tsx`
8. `src/components/ScrollManager.tsx`
9. `src/components/SystemCard.tsx`
10. `src/contexts/WishlistContext.tsx`
11. `src/data/products/loader.ts`
12. `src/hooks/useAnalytics.ts`
13. `src/hooks/useLocalStorage.ts`
14. `src/hooks/usePerformanceAlertHook.ts`
15. `src/hooks/usePerformanceReport.ts`
16. `src/hooks/usePrefetch.ts`
17. `src/hooks/useRateLimit.ts`
18. `src/hooks/useWebVitals.ts`
19. `src/infrastructure/di/Container.ts`
20. `src/pages/AddressesPage.tsx`
21. `src/pages/ContactPage.tsx`
22. `src/services/addressService.ts`
23. `src/services/authService.ts`
24. `src/services/errorLogger.ts` (puede tener console en DEV, verificar)
25. `src/services/orderService.ts`
26. `src/services/securityReportingService.ts`
27. `src/store/authStore.ts`
28. `src/store/checkoutStore.ts`
29. `src/utils/performance/alerts.ts`
30. `src/utils/security/cspConfig.ts`
31. `src/utils/security/csrfProtection.ts`
32. `src/utils/security/sanitization.ts`
33. `src/utils/security/sslConfig.ts`
34. `src/utils/accessibilityTest.ts`
35. `src/utils/api.ts` ← **4 console.error aquí**
36. `src/utils/authErrorHandler.ts`
37. `src/utils/backgroundSync.ts`
38. `src/utils/encoding.ts`
39. `src/utils/errorHandler.ts`
40. `src/utils/globalErrorHandler.ts`
41. `src/utils/imageProcessor.ts`
42. `src/utils/jwtUtils.ts`
43. `src/utils/logger.ts`
44. `src/utils/pushNotifications.ts`
45. `src/utils/rateLimitMonitoring.ts`
46. `src/utils/sanitizationMiddleware.ts`
47. `src/utils/secureStorage.ts`

**ACCIÓN OBLIGATORIA**:

1. **PRIMERO**: Corrige el error de `captureError` en `ProductCard.tsx` línea 38
2. **SEGUNDO**: Para CADA archivo de la lista:
   - Buscar TODOS los `console.log`, `console.warn`, `console.error`, `console.debug`
   - Reemplazar con `errorLogger.log()` usando la firma correcta
   - Si es información de desarrollo, envolver en `if (import.meta.env.DEV) { }`
   - Si no aporta valor, ELIMINAR completamente

**EJEMPLO DE REEMPLAZO CORRECTO**:

**ANTES** (src/utils/api.ts línea 152):
```typescript
console.error('localStorage access error:', error);
```

**DESPUÉS**:
```typescript
import { errorLogger, ErrorSeverity, ErrorCategory } from '@/services/errorLogger';

errorLogger.log(
  error instanceof Error ? error : new Error('localStorage access error'),
  ErrorSeverity.MEDIUM,
  ErrorCategory.STATE,
  { context: 'api.ts', operation: 'localStorage access' }
);
```

**EJEMPLO DE console.log de desarrollo**:

**ANTES**:
```typescript
console.log('✅ Global error handlers initialized');
```

**DESPUÉS**:
```typescript
// Eliminar completamente o envolver si es útil para debug:
if (import.meta.env.DEV) {
  // Logger estructurado para desarrollo si lo necesitas
}
```

---

### ❌ INCUMPLIMIENTO #2: 23 tipos `any` explícitos

**ARCHIVOS ESPECÍFICOS CON `: any`**:

1. **src/types/rateLimit.ts** línea 136:
   ```typescript
   onFailure?: (error: any) => void;
   ```
   **Corrección**:
   ```typescript
   onFailure?: (error: Error) => void;
   ```

2. **src/utils/security/cspConfig.ts** línea 173 (3 veces):
   ```typescript
   applyCSP(_req: any, res: any, next: any) {
   ```
   **Corrección**:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   applyCSP(_req: Request, res: Response, next: NextFunction) {
   ```

3. **src/utils/security/cspConfig.ts** línea 185 (2 veces):
   ```typescript
   handleCSPViolation(req: any, res: any) {
   ```
   **Corrección**:
   ```typescript
   import { Request, Response } from 'express';
   handleCSPViolation(req: Request, res: Response) {
   ```

4. **src/utils/security/csrfProtection.ts** línea 134:
   ```typescript
   extractTokenFromRequest(req: any): string | null {
   ```
   **Corrección**:
   ```typescript
   import { Request } from 'express';
   extractTokenFromRequest(req: Request): string | null {
   ```

5. **src/utils/security/csrfProtection.ts** línea 157:
   ```typescript
   getSessionIdFromRequest(req: any): string | null {
   ```
   **Corrección**:
   ```typescript
   import { Request } from 'express';
   getSessionIdFromRequest(req: Request): string | null {
   ```

6. **src/utils/security/csrfProtection.ts** línea 190 (3 veces):
   ```typescript
   csrfToken(req: any, res: any, next: any) {
   ```
   **Corrección**:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   csrfToken(req: Request, res: Response, next: NextFunction) {
   ```

7. **src/utils/security/csrfProtection.ts** línea 214 (3 veces):
   ```typescript
   csrfProtection(req: any, res: any, next: any) {
   ```
   **Corrección**:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   csrfProtection(req: Request, res: Response, next: NextFunction) {
   ```

8. **src/utils/security/csrfProtection.ts** línea 262 (3 veces):
   ```typescript
   csrf(req: any, res: any, next: any) {
   ```
   **Corrección**:
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   csrf(req: Request, res: Response, next: NextFunction) {
   ```

**TOTAL**: 23 instancias en principalmente 2 archivos de seguridad.

**ACCIÓN OBLIGATORIA**:
1. Instalar tipos de Express si no están: `npm install --save-dev @types/express`
2. Reemplazar TODOS los `: any` con tipos específicos usando los ejemplos exactos de arriba
3. Verificar con: `grep -r ": any" src/` → debe devolver 0 resultados

---

### ❌ INCUMPLIMIENTO #3: Tests con warnings

**PROBLEMA**: Tests corren pero con warnings de React:

```
Warning: React does not recognize the `whileInView` prop on a DOM element.
Warning: An update to WishlistPage inside a test was not wrapped in act(...).
```

**ACCIÓN OBLIGATORIA**:

1. **whileInView props** (de framer-motion):
   - Verificar que framer-motion esté correctamente configurado en tests
   - En `vitest.setup.tsx`, asegurar que framer-motion use `motion` components

2. **act() warnings**:
   - Envolver updates de estado en `act()` en tests
   - Usar `waitFor()` de `@testing-library/react` para operaciones asíncronas

**EJEMPLO DE CORRECCIÓN EN TESTS**:

**ANTES**:
```typescript
fireEvent.click(removeButton);
expect(mockRemoveItem).toHaveBeenCalledWith('1');
```

**DESPUÉS**:
```typescript
import { act, waitFor } from '@testing-library/react';

await act(async () => {
  fireEvent.click(removeButton);
});
await waitFor(() => expect(mockRemoveItem).toHaveBeenCalledWith('1'));
```

---

## 📋 CHECKLIST DE CORRECCIÓN PASO A PASO

### **FASE 1: CORRECCIÓN CRÍTICA (5-10 minutos)**

- [ ] **1.1**: Corregir `errorLogger.captureError` → `errorLogger.log` en `ProductCard.tsx` línea 38
- [ ] **1.2**: Verificar que la corrección compile: `npm run type-check`
- [ ] **1.3**: Corregir el mismo error en `ProductActions.tsx` si existe

### **FASE 2: ELIMINACIÓN DE console.* (30-60 minutos)**

- [ ] **2.1**: Importar `errorLogger`, `ErrorSeverity`, `ErrorCategory` en archivos que lo necesiten
- [ ] **2.2**: Procesar archivos en orden alfabético de la lista de 48 archivos
- [ ] **2.3**: Para cada archivo:
  - [ ] Abrir archivo
  - [ ] Buscar todos los `console.*`
  - [ ] Reemplazar con `errorLogger.log()` o eliminar
  - [ ] Guardar
  - [ ] Ejecutar `npm run type-check` para verificar
- [ ] **2.4**: Verificar con: `grep -r "console\." src/ | wc -l` → debe ser **0**

### **FASE 3: ELIMINACIÓN DE any TYPES (15-30 minutos)**

- [ ] **3.1**: Instalar tipos Express: `npm install --save-dev @types/express`
- [ ] **3.2**: Corregir `src/types/rateLimit.ts` línea 136
- [ ] **3.3**: Corregir `src/utils/security/cspConfig.ts`:
  - [ ] Línea 173: `applyCSP` (3 any → Request, Response, NextFunction)
  - [ ] Línea 185: `handleCSPViolation` (2 any → Request, Response)
- [ ] **3.4**: Corregir `src/utils/security/csrfProtection.ts`:
  - [ ] Línea 134: `extractTokenFromRequest` (1 any → Request)
  - [ ] Línea 157: `getSessionIdFromRequest` (1 any → Request)
  - [ ] Línea 190: `csrfToken` (3 any → Request, Response, NextFunction)
  - [ ] Línea 214: `csrfProtection` (3 any → Request, Response, NextFunction)
  - [ ] Línea 262: `csrf` (3 any → Request, Response, NextFunction)
- [ ] **3.5**: Verificar con: `grep -r ": any" src/ | wc -l` → debe ser **0**

### **FASE 4: CORRECCIÓN DE TESTS (10-20 minutos)**

- [ ] **4.1**: Revisar `vitest.setup.tsx` para configuración de framer-motion
- [ ] **4.2**: Buscar tests con warnings de `act()`
- [ ] **4.3**: Envolver state updates en `act()` y usar `waitFor()`
- [ ] **4.4**: Ejecutar tests: `npm run test`
- [ ] **4.5**: Verificar que no hay warnings de React

### **FASE 5: VERIFICACIÓN FINAL (5 minutos)**

- [ ] **5.1**: `npm run type-check` → **0 errores**
- [ ] **5.2**: `npm run lint` → **0 errors, 0 warnings**
- [ ] **5.3**: `npm run test` → **All passing, no warnings**
- [ ] **5.4**: `npm run build` → **Exitoso, bundle < 300KB gzipped**
- [ ] **5.5**: Comandos de verificación:
  ```bash
  grep -r "console\." src/ | wc -l  # Debe ser 0
  grep -r ": any" src/ | wc -l     # Debe ser 0
  ```

---

## 🔍 COMANDOS DE VERIFICACIÓN OBLIGATORIOS

Ejecuta estos comandos ANTES y DESPUÉS de cada fase:

### **Windows PowerShell**:
```powershell
# Contar console.*
(Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "console\.(log|warn|error|debug)" | Measure-Object).Count

# Contar any types
(Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String -Pattern ":\s*any\b" | Measure-Object).Count

# TypeScript
npm run type-check

# ESLint
npm run lint

# Tests
npm run test

# Build
npm run build
```

---

## 🎯 RESULTADO ESPERADO AL FINALIZAR

### **Comandos de verificación exitosos**:

```bash
✓ console.*: 0 instancias (actualmente: 148)
✓ any types: 0 instancias (actualmente: 23)
✓ TypeScript: 0 errors (actualmente: 690 por tu error de captureError)
✓ ESLint: 0 errors, 0 warnings
✓ Tests: All passing, no React warnings
✓ Build: Successful, bundle < 300KB gzipped
```

### **Salida esperada**:

```powershell
PS> (Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "console\.(log|warn|error|debug)" | Measure-Object).Count
0

PS> (Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | Select-String -Pattern ":\s*any\b" | Measure-Object).Count
0

PS> npm run type-check
✓ TypeScript: No errors found

PS> npm run lint
✓ 0 problems (0 errors, 0 warnings)

PS> npm run test
✓ All tests passing (33/33)
✓ No React warnings

PS> npm run build
✓ Build successful
dist/assets/index-ABC123.js: 245.67 kB │ gzip: 78.34 kB
```

---

## 💀 REGLAS ULTRA-ESTRICTAS

### **CERO TOLERANCIA**:
1. **NO** uses `captureError` - USA `errorLogger.log()`
2. **NO** dejes ningún `console.*` en `src/`
3. **NO** uses `any` en ningún lugar
4. **NO** introduzcas nuevos errores de TypeScript
5. **NO** dejes warnings de React en tests

### **METODOLOGÍA**:
1. **UNO A LA VEZ**: Corrige un archivo, verifica, continúa
2. **VERIFICA CONSTANTEMENTE**: Ejecuta `npm run type-check` después de cada cambio
3. **USA LOS TIPOS CORRECTOS**: Copia exactamente los ejemplos de corrección de arriba
4. **PRUEBA AL FINAL**: Ejecuta TODOS los comandos de verificación

### **FORMATO DE REPORTE**:

Después de CADA FASE, reporta:

```
✅ FASE X COMPLETADA
   - Archivos modificados: [lista]
   - console.* restantes: X (objetivo: 0)
   - any types restantes: X (objetivo: 0)
   - TypeScript errors: X (objetivo: 0)
   - Verificación: [comando ejecutado] → [resultado]
```

---

## 🚀 INICIO DE CORRECCIONES

**GPT-4.1, sigue este prompt AL PIE DE LA LETRA.**

**COMIENZA POR LA FASE 1, TAREA 1.1: Corregir ProductCard.tsx línea 38**

**NO CONTINUES A LA SIGUIENTE FASE HASTA COMPLETAR LA ANTERIOR**

**REPORTA DESPUÉS DE CADA FASE**

**INICIO: AHORA** 🔥
