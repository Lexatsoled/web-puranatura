# PROMPT PARA GPT-5-CODEX LOW

Copia y pega esto completo:

---

Hola GPT-5. Necesito que completes la **Fase 2 de optimizaciones de rendimiento** de mi aplicación web.

## 📁 Documentos de referencia:

Lee primero estos archivos en orden:

1. **`INSTRUCCIONES_FASE2_OPTIMIZACIONES.md`** ← PRINCIPAL (contiene todas las instrucciones)
2. **`PLAN_MIGRACION_COMPLETO.md`** ← Contexto del plan general
3. **`lighthouse-fixed.html`** ← Reporte actual de performance

## 🎯 Objetivo:

Mejorar el **LCP (Largest Contentful Paint)** de **3.1s a <2.5s** para pasar Core Web Vitals.

**Tareas específicas:**

### 2.3 Optimización de Assets (PRIORIDAD ALTA):
- Implementar lazy loading en todas las imágenes
- Generar srcset responsivo con helper `generateSrcSet()`
- Agregar preload para imágenes críticas en `index.html`
- Archivos a modificar:
  - `src/components/ProductCard.tsx`
  - `src/components/ProductImage.tsx`
  - `src/pages/ProductPage.tsx`
  - `src/utils/image.ts` (crear)
  - `index.html`

### 2.4 Virtualización Real del Grid (PRIORIDAD MEDIA):
- Reemplazar `src/components/VirtualizedProductGrid.tsx` con scroll virtual verdadero
- Usar `react-window` o `react-virtuoso`
- El grid actual renderiza TODOS los productos, debe renderizar solo los visibles

### 2.5 Precargas Inteligentes (OPCIONAL):
- Crear hook `useNetworkQuality()` para adaptar carga según red del usuario
- Solo si queda tiempo y el LCP ya está <2.5s

## ⚠️ ADVERTENCIAS CRÍTICAS:

### NO MODIFICAR (ya están arreglados):
- ❌ `src/store/productStore.ts` → Sistema de deduplicación de peticiones funcionando
- ❌ `src/pages/StorePage.tsx` useEffect dependencies → Ya optimizados para prevenir loops

### SÍ MODIFICAR:
- ✅ Componentes de imágenes (agregar lazy loading)
- ✅ VirtualizedProductGrid (reemplazar con librería de virtualización)
- ✅ Crear helpers de imágenes nuevos

## 📊 Validación:

Después de cada cambio importante:

```bash
# 1. Verificar tipos
npm run type-check

# 2. Probar build
npm run build

# 3. Ejecutar Lighthouse (con servidores corriendo)
lighthouse http://localhost:5173/tienda --output=html --output-path=./lighthouse-final.html --only-categories=performance
```

**Métricas objetivo:**
- Performance Score: >90 (actual: 62)
- FCP: <1.8s (actual: 448ms ✅)
- **LCP: <2.5s (actual: 3.1s ❌) ← PRIORIDAD**
- TBT: <200ms (actual: 280ms)
- CLS: <0.1 (actual: 0 ✅)

## 🚀 Orden de ejecución sugerido:

1. **Primero:** Lazy loading de imágenes (mayor impacto en LCP)
2. **Segundo:** Virtualización del grid (mejora scroll y memoria)
3. **Tercero:** (Opcional) Precargas adaptativas

## ✅ Checklist final:

Cuando termines, verifica:

- [ ] Todas las imágenes tienen `loading="lazy"` y `decoding="async"`
- [ ] Existe helper `generateSrcSet()` en `src/utils/image.ts`
- [ ] VirtualizedProductGrid usa react-window o react-virtuoso
- [ ] `npm run type-check` pasa sin errores
- [ ] `npm run build` completa exitosamente
- [ ] Lighthouse muestra LCP <2.5s
- [ ] NO hay peticiones duplicadas en DevTools Network (debe haber solo 1-2 a `/api/products`)

## 📝 Contexto adicional:

- Backend: Fastify en puerto 3000 (ya corriendo)
- Frontend: Vite en puerto 5173 (ya corriendo)
- Base de datos: SQLite con 64 productos
- Sistema de cache: 30s TTL en productStore
- **Estado actual:** Sistema estable, solo necesita optimización de assets

---

**Pregunta si necesitas aclaración sobre algún punto antes de empezar.**

**Cuando termines, genera un reporte con:**
1. Archivos modificados
2. Métricas Lighthouse finales
3. Comparación antes/después
4. Cualquier issue pendiente

¡Adelante! 🚀
