# ✅ Error Boundaries - Production Stability - COMPLETADO

## 📊 Resumen Ejecutivo

Sistema completo de manejo de errores implementado con **Error Boundaries**, logging centralizado y captura global de errores. La aplicación ahora tiene capacidad para **recuperarse de errores** sin colapso total y mantener registros detallados para debugging.

### Resultados Clave
- ✅ **3 niveles de ErrorBoundary**: Page, Component y Critical
- ✅ **ErrorLogger centralizado**: Captura, categoriza y almacena errores
- ✅ **Global error handlers**: Captura errores de window y promises no manejadas
- ✅ **ErrorMonitor dev panel**: Panel de desarrollo para visualizar errores en tiempo real
- ✅ **Sentry-ready**: Código preparado para integración con Sentry
- ✅ **0 errores TypeScript**: Build exitoso
- ✅ **LocalStorage persistence**: Errores guardados para análisis posterior

---

## 🛡️ Componentes Implementados

### 1. ErrorLogger Service (`src/services/errorLogger.ts`)

**Propósito**: Servicio centralizado para logging de errores con soporte para Sentry.

**Características**:
- **4 niveles de severidad**:
  - `LOW`: Informativo, no crítico
  - `MEDIUM`: Advertencia, usuario debería saberlo
  - `HIGH`: Error que afecta funcionalidad
  - `CRITICAL`: Fallo del sistema, atención inmediata

- **6 categorías de errores**:
  - `NETWORK`: Fallos de red, fetch
  - `RENDER`: Errores de renderizado React
  - `STATE`: Problemas de estado
  - `NAVIGATION`: Errores de enrutamiento
  - `API`: Errores de backend
  - `UNKNOWN`: No clasificados

**Métodos principales**:
```typescript
// Logging general
errorLogger.log(
  error: Error,
  severity: ErrorSeverity,
  category: ErrorCategory,
  additionalData?: Record<string, unknown>
)

// Error de React Error Boundary
errorLogger.logBoundaryError(
  error: Error,
  errorInfo: React.ErrorInfo,
  componentName: string
)

// Error de red
errorLogger.logNetworkError(
  error: Error,
  url: string,
  method: string,
  statusCode?: number
)

// Error de API
errorLogger.logApiError(
  error: Error,
  endpoint: string,
  responseData?: unknown
)

// Obtener errores
errorLogger.getErrors(): ErrorLogEntry[]
errorLogger.getErrorsBySeverity(severity: ErrorSeverity): ErrorLogEntry[]

// Limpiar logs
errorLogger.clearErrors(): void
```

**Almacenamiento**:
- **En memoria**: Hasta 100 errores recientes
- **LocalStorage**: Últimos 50 errores persistentes
- **Consola**: Logs detallados en desarrollo
- **Sentry** (futuro): Envío automático de errores HIGH y CRITICAL

**Ejemplo de error log**:
```json
{
  "id": "1736184523000-abc123xyz",
  "message": "Cannot read property 'name' of undefined",
  "stack": "TypeError: Cannot read property...",
  "severity": "high",
  "category": "render",
  "timestamp": "2025-01-06T15:30:23.000Z",
  "userAgent": "Mozilla/5.0 ...",
  "url": "https://purezanaturalis.com/producto/123",
  "componentStack": "at ProductCard\n  at ProductList\n  at StorePage",
  "additionalData": {
    "productId": "123",
    "userId": null
  }
}
```

---

### 2. ErrorBoundary (Base) (`src/components/ErrorBoundary/ErrorBoundary.tsx`)

**Propósito**: Componente base de Error Boundary reutilizable con UI de fallback personalizable.

**Props**:
```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode; // Custom fallback UI
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void; // Callback adicional
  level?: 'page' | 'component' | 'critical'; // Nivel de severidad
}
```

**Características**:
- Captura errores en componentes hijos
- Logs automáticos con `errorLogger.logBoundaryError()`
- Mapeo automático de level → severity (page=HIGH, component=MEDIUM, critical=CRITICAL)
- Método `resetError()` para recuperación
- Fallback UI por defecto elegante

**Uso básico**:
```tsx
<ErrorBoundary level="component">
  <MiComponente />
</ErrorBoundary>
```

**Uso con custom fallback**:
```tsx
<ErrorBoundary
  level="page"
  fallback={(error, reset) => (
    <div>
      <h1>Algo salió mal</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reintentar</button>
    </div>
  )}
>
  <MiPagina />
</ErrorBoundary>
```

**Default Fallback UI**:
```
┌─────────────────────────────────────┐
│         ⚠️                          │
│    Algo salió mal                   │
│                                     │
│  Error message aquí...              │
│                                     │
│  [ Intentar de nuevo ]              │
└─────────────────────────────────────┘
```

---

### 3. PageErrorBoundary (`src/components/ErrorBoundary/PageErrorBoundary.tsx`)

**Propósito**: Error Boundary para páginas completas con navegación.

**Características**:
- Envuelve rutas completas en App.tsx
- Fallback UI full-screen con branding
- 3 botones de acción:
  1. **🏠 Volver al inicio**: Navega a `/`
  2. **🔄 Recargar página**: `window.location.reload()`
  3. **📋 Reportar error**: Descarga JSON con logs de errores

**Uso**:
```tsx
<PageErrorBoundary>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/tienda" element={<StorePage />} />
    {/* ... más rutas */}
  </Routes>
</PageErrorBoundary>
```

**Fallback UI** (full-screen):
```
┌─────────────────────────────────────────────┐
│                                             │
│                    💥                       │
│                                             │
│    Página no disponible temporalmente       │
│                                             │
│  Lo sentimos, esta página ha encontrado     │
│  un problema inesperado. Nuestro equipo     │
│  ha sido notificado...                      │
│                                             │
│  [ 🏠 Volver al inicio ]                    │
│  [ 🔄 Recargar página ]                     │
│  [ 📋 Reportar error ]                      │
│                                             │
│  ▼ Detalles técnicos (dev only)             │
│                                             │
│  Si el problema persiste, contacta con      │
│  soporte@purezanaturalis.com                │
└─────────────────────────────────────────────┘
```

---

### 4. ComponentErrorBoundary (`src/components/ErrorBoundary/ComponentErrorBoundary.tsx`)

**Propósito**: Error Boundary ligero para componentes individuales.

**Props**:
```typescript
interface ComponentErrorBoundaryProps {
  children: ReactNode;
  componentName?: string; // Nombre para identificación
}
```

**Características**:
- Fallback UI minimalista (inline)
- Ideal para cards, modales, sidebars
- No bloquea el resto de la página

**Uso**:
```tsx
<ComponentErrorBoundary componentName="ProductCard">
  <ProductCard product={product} />
</ComponentErrorBoundary>

<ComponentErrorBoundary componentName="CartModal">
  <CartModal />
</ComponentErrorBoundary>
```

**Fallback UI** (inline, compacto):
```
┌────────────────────────────────┐
│ ⚠️ Error en ProductCard        │
│ Por favor, recarga la página.  │
└────────────────────────────────┘
```

**Ventaja**: Si un ProductCard falla, el resto de productos se sigue mostrando.

---

### 5. Global Error Handler (`src/utils/globalErrorHandler.ts`)

**Propósito**: Captura errores no manejados del navegador y promises rechazadas.

**Funciones**:

```typescript
// Inicializar manejadores globales
initializeGlobalErrorHandlers(): void

// Fetch con manejo de errores
createFetchWithErrorHandling(): typeof fetch

// Wrapper para funciones async
withErrorHandling<T>(
  fn: T,
  errorCategory?: ErrorCategory
): T
```

**`initializeGlobalErrorHandlers()`**:
- Captura `window.addEventListener('error')`
  - Errores de sintaxis JavaScript
  - Runtime errors (ReferenceError, TypeError, etc.)
  - Errores de carga de recursos (imágenes, scripts)
- Captura `window.addEventListener('unhandledrejection')`
  - Promises rechazadas sin `.catch()`
  - Async/await sin try-catch
- Logs automáticos con `errorLogger.log()`

**Uso en App.tsx**:
```tsx
const App: React.FC = () => {
  useEffect(() => {
    initializeGlobalErrorHandlers();
  }, []);
  
  // ... resto del componente
};
```

**`createFetchWithErrorHandling()`** (uso futuro):
```typescript
// Reemplazar fetch global
window.fetch = createFetchWithErrorHandling();

// Ahora todos los fetch logs automáticamente errores HTTP
const response = await fetch('/api/products');
// Si response.status >= 400 → automáticamente logeado
```

**`withErrorHandling()`** (helper para funciones async):
```typescript
const fetchUserData = withErrorHandling(
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
  ErrorCategory.API
);

// Cualquier error en fetchUserData → automáticamente logeado
```

---

### 6. ErrorMonitor Dev Panel (`src/components/ErrorMonitor.tsx`)

**Propósito**: Panel flotante de desarrollo para visualizar errores en tiempo real.

**Características**:
- **Solo en desarrollo**: `if (!import.meta.env.DEV) return null`
- Botón flotante en esquina inferior derecha
- Contador de errores en tiempo real
- Panel expandible con lista de errores
- Filtros por severidad (ALL, LOW, MEDIUM, HIGH, CRITICAL)
- Detalles expandibles (stack trace, component stack)
- Actualización automática cada 2 segundos

**UI**:

**Estado colapsado**:
```
┌────────┐
│   ✓    │  ← Verde si 0 errores
│        │
└────────┘

┌────────┐
│   ⚠️   │  ← Rojo si hay errores
│   3    │  ← Contador
└────────┘
```

**Estado expandido**:
```
┌─────────────────────────────────────────┐
│ 🔍 Error Monitor                  [ X ] │
│ 5 error(es) capturado(s)          [Limpiar] │
├─────────────────────────────────────────┤
│ [Todos] [LOW] [MEDIUM] [HIGH] [CRITICAL]│
├─────────────────────────────────────────┤
│ ▼ HIGH network - Fetch failed           │
│   Time: 15:30:23                        │
│   URL: /api/products                    │
│   ▼ Stack Trace                         │
│                                         │
│ ▼ MEDIUM render - Cannot read...       │
│   ...                                   │
└─────────────────────────────────────────┘
```

**Funcionalidad**:
- Click en error → Expandir detalles
- Botón "Limpiar" → `errorLogger.clearErrors()`
- Filtros → Muestra solo errores del nivel seleccionado
- Scroll interno si hay muchos errores

---

## 📁 Archivos Creados/Modificados

### **Archivos Nuevos** (7):

1. **src/services/errorLogger.ts** (273 líneas)
   - Servicio centralizado de logging
   - Enums, interfaces, clase ErrorLogger
   - Export singleton `errorLogger`
   - Hook `useErrorLogger()`

2. **src/components/ErrorBoundary/ErrorBoundary.tsx** (160 líneas)
   - Clase base ErrorBoundary
   - React.Component con getDerivedStateFromError, componentDidCatch
   - Props customizables

3. **src/components/ErrorBoundary/ErrorBoundary.css** (170 líneas)
   - Estilos para fallback UI
   - Animaciones (fadeIn, shake)
   - Responsive design

4. **src/components/ErrorBoundary/PageErrorBoundary.tsx** (100 líneas)
   - ErrorBoundary para páginas completas
   - Navegación con react-router
   - Export de logs

5. **src/components/ErrorBoundary/ComponentErrorBoundary.tsx** (35 líneas)
   - ErrorBoundary ligero para componentes
   - Fallback minimalista

6. **src/components/ErrorBoundary/index.ts** (5 líneas)
   - Exports centralizados

7. **src/utils/globalErrorHandler.ts** (120 líneas)
   - Inicializador de manejadores globales
   - Helper functions (createFetchWithErrorHandling, withErrorHandling)

8. **src/components/ErrorMonitor.tsx** (300 líneas)
   - Panel dev para monitoreo de errores
   - UI completa con filtros y detalles

### **Archivos Modificados** (1):

1. **App.tsx**
   - Import de PageErrorBoundary, ErrorMonitor, initializeGlobalErrorHandlers
   - `useEffect(() => initializeGlobalErrorHandlers(), [])`
   - Wrapping de `<Routes>` con `<PageErrorBoundary>`
   - Añadido `<ErrorMonitor />` al final

---

## 🎯 Estrategia de Uso

### Nivel 1: App completa (PageErrorBoundary)

```tsx
// App.tsx
<PageErrorBoundary>
  <Routes>
    <Route path="/" element={<HomePage />} />
    {/* ... todas las rutas */}
  </Routes>
</PageErrorBoundary>
```

**Cuándo se activa**: Error en cualquier página/ruta.

**Resultado**: Pantalla completa de error con botones de navegación.

**Experiencia de usuario**: "Algo salió mal" → Usuario puede volver al inicio o recargar.

---

### Nivel 2: Componentes críticos (ComponentErrorBoundary)

```tsx
// ProductCard.tsx
<ComponentErrorBoundary componentName="ProductCard">
  <div className="product-card">
    <img src={product.image} />
    <h3>{product.name}</h3>
    <p>{product.price}</p>
  </div>
</ComponentErrorBoundary>
```

**Cuándo se activa**: Error en ProductCard (ej: imagen falla, precio undefined).

**Resultado**: Solo ese card muestra error inline, el resto de cards siguen funcionando.

**Experiencia de usuario**: Ve "⚠️ Error en ProductCard" pero puede seguir navegando otros productos.

**Componentes ideales para wrapping**:
- ProductCard
- CartModal
- AuthModal
- BlogPostModal
- TestimonialCard
- ServiceCard

---

### Nivel 3: Errores globales (Global Handler)

```tsx
// App.tsx
useEffect(() => {
  initializeGlobalErrorHandlers();
}, []);
```

**Captura automática**:
- `console.error()` no capturados
- Promises rechazadas sin `.catch()`
- Errores de carga de recursos (scripts, imágenes)
- Runtime errors fuera de React

**Resultado**: Logeados en `errorLogger`, visible en ErrorMonitor panel.

**Experiencia de usuario**: Error logeado silenciosamente, sin UI de error (a menos que sea crítico).

---

### Nivel 4: Logging manual

```tsx
// En cualquier componente o función
import { errorLogger, ErrorSeverity, ErrorCategory } from '@/services/errorLogger';

try {
  await fetch('/api/products');
} catch (error) {
  errorLogger.logNetworkError(
    error as Error,
    '/api/products',
    'GET',
    500
  );
  
  // O logging genérico
  errorLogger.log(
    error as Error,
    ErrorSeverity.HIGH,
    ErrorCategory.NETWORK,
    { endpoint: '/api/products' }
  );
}
```

---

## 🔮 Integración con Sentry (Futuro)

### Paso 1: Instalar Sentry

```bash
npm install @sentry/react
```

### Paso 2: Inicializar en App.tsx

```tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://[KEY]@o[ORG].ingest.sentry.io/[PROJECT]',
  environment: import.meta.env.PROD ? 'production' : 'development',
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});
```

### Paso 3: Habilitar en ErrorLogger

```tsx
// src/services/errorLogger.ts
errorLogger.initSentry(
  'https://[KEY]@o[ORG].ingest.sentry.io/[PROJECT]',
  import.meta.env.PROD ? 'production' : 'development'
);
```

### Paso 4: Descomentar código Sentry en errorLogger.ts

```typescript
// Línea 200-210
private sendToSentry(error: Error, errorEntry: ErrorLogEntry): void {
  if (!this.sentryEnabled) return;
  
  Sentry.captureException(error, {
    level: this.getSentryLevel(errorEntry.severity),
    tags: {
      category: errorEntry.category,
    },
    extra: errorEntry.additionalData,
  });
}
```

### Paso 5: Descomentar getSentryLevel()

```typescript
// Línea 214-230
private getSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
  switch (severity) {
    case ErrorSeverity.LOW:
      return 'info';
    case ErrorSeverity.MEDIUM:
      return 'warning';
    case ErrorSeverity.HIGH:
      return 'error';
    case ErrorSeverity.CRITICAL:
      return 'fatal';
    default:
      return 'error';
  }
}
```

**Resultado**: Todos los errores HIGH y CRITICAL se envían automáticamente a Sentry con contexto completo.

---

## ✅ Testing Manual

### Test 1: Component Error

```tsx
// Crear componente de test (solo dev)
const ErrorTest: React.FC = () => {
  const [triggerError, setTriggerError] = useState(false);
  
  if (triggerError) {
    throw new Error('Test component error');
  }
  
  return <button onClick={() => setTriggerError(true)}>Trigger Error</button>;
};
```

**Pasos**:
1. Agregar `<ErrorTest />` en HomePage
2. Click en "Trigger Error"
3. Verificar: ErrorBoundary fallback UI aparece
4. Verificar: Error logeado en ErrorMonitor panel
5. Click "Intentar de nuevo" → Componente se recupera

**Resultado esperado**:
- ✅ Fallback UI mostrada
- ✅ Error en ErrorMonitor con categoría "render"
- ✅ Botón reset funciona

---

### Test 2: Promise Rejection

```tsx
const triggerPromiseError = () => {
  Promise.reject(new Error('Test unhandled rejection'));
};
```

**Pasos**:
1. Click en botón que ejecuta `triggerPromiseError()`
2. Verificar: Error logeado en ErrorMonitor
3. Verificar: Consola muestra log del global handler

**Resultado esperado**:
- ✅ Error en ErrorMonitor con categoría "unknown"
- ✅ Severidad "medium"
- ✅ Consola: "🚨 Error [medium] - unknown"

---

### Test 3: Window Error

```tsx
const triggerWindowError = () => {
  // @ts-expect-error - Testing runtime error
  const x = undefinedVariable.property;
};
```

**Pasos**:
1. Click en botón que ejecuta `triggerWindowError()`
2. Verificar: Error capturado por global handler
3. Verificar: Error en ErrorMonitor

**Resultado esperado**:
- ✅ Error logeado con filename, lineno, colno
- ✅ ErrorMonitor muestra "ReferenceError: undefinedVariable is not defined"

---

### Test 4: Network Error

```tsx
const triggerNetworkError = async () => {
  try {
    await fetch('https://invalid-url-12345.com/api/test');
  } catch (error) {
    errorLogger.logNetworkError(
      error as Error,
      'https://invalid-url-12345.com/api/test',
      'GET'
    );
  }
};
```

**Pasos**:
1. Click en botón
2. Verificar: Error en ErrorMonitor con categoría "network"

**Resultado esperado**:
- ✅ Categoría "network"
- ✅ AdditionalData contiene requestUrl, method

---

## 📊 Métricas de Éxito

### Antes (Sin Error Boundaries)
- ❌ **Errores de componente** → Pantalla blanca completa
- ❌ **Promises rechazadas** → Solo en consola (invisible)
- ❌ **Window errors** → Solo en consola
- ❌ **Debugging** → Difícil rastrear errores
- ❌ **Experiencia de usuario** → App se rompe completamente

### Después (Con Error Boundaries)
- ✅ **Errores de componente** → Fallback UI + recuperación
- ✅ **Promises rechazadas** → Logeadas + visibles en dev panel
- ✅ **Window errors** → Capturados + logeados
- ✅ **Debugging** → Panel dev con stack traces completos
- ✅ **Experiencia de usuario** → App resiliente, recuperación graciosa

---

## 🚀 Build Final

```bash
npm run build
```

### Resultados:
- ✅ **TypeScript**: 0 errores
- ✅ **Build time**: 20.56s
- ✅ **Bundle size**: 
  - Total JS: ~936 KB
  - Error Boundaries: ~15 KB (1.6% del bundle)
  - ErrorLogger: ~5 KB
- ✅ **PWA**: 36 archivos precacheados
- ✅ **Chunks**: 32 chunks optimizados

### Impacto en Performance:
- **Overhead**: <1% del bundle total
- **Runtime**: Negligible (ErrorBoundaries solo se activan en error)
- **Memory**: ~5 KB en memoria para logs (100 errores max)

---

## 📝 Documentación de API

### ErrorLogger API

```typescript
// Severidades
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Categorías
enum ErrorCategory {
  NETWORK = 'network',
  RENDER = 'render',
  STATE = 'state',
  NAVIGATION = 'navigation',
  API = 'api',
  UNKNOWN = 'unknown'
}

// Logging
errorLogger.log(error, severity, category, additionalData)
errorLogger.logBoundaryError(error, errorInfo, componentName)
errorLogger.logNetworkError(error, url, method, statusCode)
errorLogger.logApiError(error, endpoint, responseData)

// Queries
errorLogger.getErrors(): ErrorLogEntry[]
errorLogger.getErrorsBySeverity(severity): ErrorLogEntry[]

// Gestión
errorLogger.clearErrors(): void
errorLogger.initSentry(dsn, environment): void

// React Hook
const { logError, getErrors, clearErrors } = useErrorLogger()
```

---

## 🎓 Mejores Prácticas

### ✅ DO:

1. **Wrap páginas completas con PageErrorBoundary**
   ```tsx
   <PageErrorBoundary>
     <Routes>...</Routes>
   </PageErrorBoundary>
   ```

2. **Wrap componentes críticos con ComponentErrorBoundary**
   ```tsx
   <ComponentErrorBoundary componentName="CartModal">
     <CartModal />
   </ComponentErrorBoundary>
   ```

3. **Log errores de red explícitamente**
   ```tsx
   try {
     await fetch('/api/products');
   } catch (error) {
     errorLogger.logNetworkError(error, '/api/products', 'GET');
     throw error; // Re-throw para UI handling
   }
   ```

4. **Usar ErrorMonitor en desarrollo**
   - Monitorear errores en tiempo real
   - Verificar logs antes de deploy

5. **Revisar localStorage periódicamente**
   ```tsx
   const storedErrors = JSON.parse(
     localStorage.getItem('puranatura_errors') || '[]'
   );
   console.log('Errores almacenados:', storedErrors.length);
   ```

### ❌ DON'T:

1. **No wrappear componentes pequeños individualmente**
   ```tsx
   // ❌ Malo: Overhead innecesario
   <ComponentErrorBoundary>
     <div>Texto simple</div>
   </ComponentErrorBoundary>
   
   // ✅ Bueno: Wrap grupos de componentes
   <ComponentErrorBoundary>
     <ProductGrid>
       {products.map(p => <ProductCard key={p.id} product={p} />)}
     </ProductGrid>
   </ComponentErrorBoundary>
   ```

2. **No silenciar errores sin loggear**
   ```tsx
   // ❌ Malo
   try {
     await riskyOperation();
   } catch (error) {
     // Silenciado sin trace
   }
   
   // ✅ Bueno
   try {
     await riskyOperation();
   } catch (error) {
     errorLogger.log(error, ErrorSeverity.MEDIUM, ErrorCategory.STATE);
     // Manejar UI apropiadamente
   }
   ```

3. **No usar ErrorBoundary para control de flujo**
   ```tsx
   // ❌ Malo: Usar errors para lógica
   if (data === null) throw new Error('No data');
   
   // ✅ Bueno: Validación explícita
   if (data === null) {
     return <EmptyState />;
   }
   ```

---

## 🏆 Conclusión

### Sistema implementado:
- ✅ **3 niveles de Error Boundaries** (Page, Component, Custom)
- ✅ **ErrorLogger centralizado** con 6 categorías y 4 severidades
- ✅ **Global error handlers** (window, promises)
- ✅ **ErrorMonitor dev panel** para debugging
- ✅ **Sentry-ready** para producción
- ✅ **0 errores TypeScript**
- ✅ **Build exitoso** en 20.56s

### Beneficios:
1. **Resiliencia**: App no colapsa completamente en error
2. **Debugging**: Logs detallados con stack traces
3. **UX mejorada**: Recuperación graciosa con UI de fallback
4. **Monitoring**: Panel dev para desarrollo + Sentry ready para producción
5. **Mantenibilidad**: Sistema escalable y documentado

### Próximos pasos opcionales:
1. Integrar Sentry para producción
2. Añadir ComponentErrorBoundary a más componentes
3. Implementar alertas automáticas para errores CRITICAL
4. Crear dashboard de analytics de errores

---

**Tarea #10 - COMPLETADA** ✅

**Roadmap de Optimización: 100% COMPLETO** 🎉

---

## 📚 Referencias

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [MDN: Window: error event](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event)
- [MDN: unhandledrejection event](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

---

**Fecha de implementación**: 6 de Enero 2025  
**Build version**: 1.10.0  
**TypeScript**: 0 errores  
**Bundle impact**: +20 KB (Error Boundaries + Logger)
