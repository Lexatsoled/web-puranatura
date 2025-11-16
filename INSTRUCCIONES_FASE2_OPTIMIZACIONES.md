# FASE 2 - OPTIMIZACIONES DE RENDIMIENTO (Continuación)

## 📊 ESTADO ACTUAL (Noviembre 6, 2025)

### ✅ Completado:
- **Fase 0:** Backend SQLite + Fastify + API REST
- **Fase 1:** Autenticación JWT en servidor
- **Fase 2.1-2.2:** Migración productos al backend + Fix peticiones duplicadas

### 📈 Métricas Lighthouse Actuales:
- **Performance Score:** 62/100 ⚠️
- **FCP:** 448ms ✅ (Good)
- **LCP:** 3093ms ⚠️ (Needs Improvement - objetivo: <2.5s)
- **TBT:** 280ms ✅
- **CLS:** 0 ✅

### 🐛 Bug Crítico Resuelto:
**Problema:** 56 peticiones simultáneas idénticas a `/api/products?limit=12` causaban LCP de 26.4s

**Solución implementada:**
1. **`src/store/productStore.ts`:** Sistema de deduplicación con `fetchingKeys: Set<string>`
2. **`src/pages/StorePage.tsx`:** Arreglados useEffect para prevenir loops infinitos

**Resultado:** Solo 1 petición única por parámetros + LCP mejorado 88% (26.4s → 3.1s)

---

## 🎯 TAREAS PENDIENTES (Para GPT-5-codex Low)

### **2.3 Optimización de Assets** (ALTA PRIORIDAD)

#### Objetivo:
Reducir LCP de 3.1s a <2.5s mediante optimización de imágenes y lazy loading.

#### Tareas específicas:

**A. Audit de imágenes actuales:**
```bash
# Ejecutar para identificar imágenes pesadas
npx @next/bundle-analyzer
# O manualmente revisar carpeta public/
```

**B. Implementar lazy loading de imágenes:**
```typescript
// Actualizar componentes que usan imágenes:
// - src/components/ProductCard.tsx
// - src/components/ProductImage.tsx
// - src/pages/ProductPage.tsx

// Ejemplo:
<img 
  src={image} 
  alt={alt}
  loading="lazy" // <- Agregar
  decoding="async" // <- Agregar
/>
```

**C. Generar srcset responsivo:**
```typescript
// Crear helper: src/utils/image.ts
export const generateSrcSet = (imagePath: string) => {
  const sizes = [320, 640, 960, 1280];
  return sizes.map(size => 
    `${imagePath}?w=${size} ${size}w`
  ).join(', ');
};

// Uso:
<img 
  src={image}
  srcSet={generateSrcSet(image)}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**D. Preload imágenes críticas (LCP):**
```html
<!-- En index.html, agregar para imagen hero/logo -->
<link rel="preload" as="image" href="/logo.png" />
```

---

### **2.4 Virtualización Real del Grid** (MEDIA PRIORIDAD)

#### Problema:
`src/components/VirtualizedProductGrid.tsx` renderiza TODOS los productos a la vez, no solo los visibles.

#### Solución:
Usar `react-window` o `react-virtuoso` para scroll virtual verdadero.

**Opción A: react-window (más simple)**
```bash
npm install react-window
```

```typescript
// Reemplazar VirtualizedProductGrid.tsx
import { FixedSizeGrid } from 'react-window';

const VirtualizedProductGrid = ({ products }) => {
  const columnCount = 3;
  const rowCount = Math.ceil(products.length / columnCount);
  
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= products.length) return null;
    
    return (
      <div style={style}>
        <ProductCard product={products[index]} />
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={350}
      height={800}
      rowCount={rowCount}
      rowHeight={400}
      width={1100}
    >
      {Cell}
    </FixedSizeGrid>
  );
};
```

**Opción B: react-virtuoso (más flexible)**
```bash
npm install react-virtuoso
```

```typescript
import { VirtuosoGrid } from 'react-virtuoso';

const VirtualizedProductGrid = ({ products }) => {
  return (
    <VirtuosoGrid
      style={{ height: '100vh' }}
      totalCount={products.length}
      itemContent={index => <ProductCard product={products[index]} />}
      listClassName="product-grid"
    />
  );
};
```

---

### **2.5 Precargas Inteligentes** (BAJA PRIORIDAD)

#### Objetivo:
Adaptar precarga de categorías según calidad de red del usuario.

```typescript
// src/hooks/useNetworkAdaptive.ts
import { useEffect, useState } from 'react';

export const useNetworkQuality = () => {
  const [quality, setQuality] = useState<'slow' | 'medium' | 'fast'>('medium');

  useEffect(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      const effectiveType = conn?.effectiveType;
      
      if (effectiveType === '4g') setQuality('fast');
      else if (effectiveType === '3g') setQuality('medium');
      else setQuality('slow');
    }
  }, []);

  return quality;
};

// Uso en StorePage.tsx:
const networkQuality = useNetworkQuality();

useEffect(() => {
  if (networkQuality === 'slow') {
    // No precargar, solo fetch bajo demanda
    return;
  }
  
  if (networkQuality === 'medium') {
    // Precargar solo primera categoría
    fetchProducts({ category: firstCategory, limit: 12 });
  }
  
  if (networkQuality === 'fast') {
    // Precargar múltiples categorías
    categories.forEach(cat => 
      fetchProducts({ category: cat, limit: 12 })
    );
  }
}, [networkQuality]);
```

---

## 📋 CHECKLIST DE VALIDACIÓN

Después de implementar cada optimización, ejecutar:

```bash
# 1. Type check
npm run type-check

# 2. Build
npm run build

# 3. Lighthouse audit
lighthouse http://localhost:5173/tienda --output=html --output-path=./lighthouse-optimized.html --only-categories=performance
```

### Métricas objetivo:
- ✅ **Performance Score:** >90
- ✅ **FCP:** <1.8s (actual: 448ms ✓)
- ✅ **LCP:** <2.5s (actual: 3.1s ✗)
- ✅ **TBT:** <200ms (actual: 280ms ~)
- ✅ **CLS:** <0.1 (actual: 0 ✓)

---

## 🔧 ARCHIVOS CLAVE A MODIFICAR

### Prioridad 1 (Optimización Assets):
- `src/components/ProductCard.tsx`
- `src/components/ProductImage.tsx`
- `src/pages/ProductPage.tsx`
- `index.html` (preload crítico)
- `src/utils/image.ts` (crear)

### Prioridad 2 (Virtualización):
- `src/components/VirtualizedProductGrid.tsx`
- `package.json` (agregar react-window o react-virtuoso)

### Prioridad 3 (Network Adaptive):
- `src/hooks/useNetworkAdaptive.ts` (crear)
- `src/pages/StorePage.tsx`

---

## ⚠️ ADVERTENCIAS

1. **NO modificar:** 
   - `src/store/productStore.ts` (sistema de deduplicación ya arreglado)
   - `src/pages/StorePage.tsx` useEffect dependencies (ya optimizados)

2. **Cuidado con:**
   - Lazy loading puede causar CLS si no se reserva espacio
   - Virtualización requiere altura fija del contenedor
   - Network API no disponible en todos los navegadores (usar fallback)

3. **Testing crítico:**
   - Verificar que imágenes carguen correctamente con lazy loading
   - Scroll del grid virtual debe ser fluido
   - No debe haber peticiones duplicadas (revisar DevTools Network)

---

## 📊 COMPARACIÓN ANTES/DESPUÉS

### Antes del fix de peticiones duplicadas:
- Performance: 0/100
- FCP: 13.4s
- LCP: 26.4s
- 56 peticiones simultáneas idénticas

### Después del fix (estado actual):
- Performance: 62/100
- FCP: 448ms ✅
- LCP: 3.1s ⚠️
- 1 petición única ✅

### Objetivo final (después de optimizaciones):
- Performance: >90/100
- FCP: <1s
- LCP: <2.5s
- Bundle size: <200KB (gzip)

---

## 🚀 ORDEN DE EJECUCIÓN RECOMENDADO

1. **Primero:** Optimización de assets (2.3) - Mayor impacto en LCP
2. **Segundo:** Virtualización del grid (2.4) - Mejora scroll y memoria
3. **Tercero:** Precargas adaptativas (2.5) - Nice to have

**Prioridad absoluta:** Bajar LCP de 3.1s a <2.5s (solo necesitas ganar 600ms)

---

## 📝 NOTAS ADICIONALES

- Backend corriendo en puerto 3000
- Frontend corriendo en puerto 5173
- Base de datos: SQLite con 64 productos (42 completos, 22 básicos)
- Seguridad: JWT, CORS, Rate Limiting ya implementados
- Cache: 30 segundos TTL en productStore

**Estado del sistema:** ✅ ESTABLE y FUNCIONAL

**Próximo hito:** LCP <2.5s para pasar Core Web Vitals
