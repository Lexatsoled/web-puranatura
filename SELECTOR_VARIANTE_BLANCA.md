# 🎨 **Selector de Cantidad con Variante Blanca**

## 🎯 **Problema Identificado**

En las páginas individuales de productos, el selector de cantidad con fondo transparente se confundía visualmente con el fondo verde de la página, dificultando la legibilidad y experiencia de usuario.

## ✅ **Solución Implementada**

### **Nueva Prop `variant`**

Se añadió una nueva propiedad al componente `QuantitySelector` para controlar el estilo visual:

```tsx
interface QuantitySelectorProps {
  // ... otras props
  variant?: 'default' | 'white';
}
```

### **Variantes Disponibles**

#### **🔗 `default` - Para Tarjetas de Producto**

- **Fondo**: Transparente
- **Borde**: Gris claro
- **Texto**: Gris oscuro
- **Uso**: Escaparate de productos (ProductCard)

```tsx
<QuantitySelector
  size="sm"
  variant="default" // ← Por defecto
/>
```

#### **⚪ `white` - Para Páginas Individuales**

- **Fondo**: Blanco sólido
- **Borde**: Gris claro con sombra sutil
- **Texto**: Negro/gris oscuro
- **Uso**: Páginas individuales de productos (ProductPage)

```tsx
<QuantitySelector
  size="md"
  variant="white" // ← Para mejor contraste
/>
```

## 🎨 **Estilos Específicos por Variante**

### **Variante Default (Transparente)**

```css
/* Contenedor */
bg-transparent border-gray-300

/* Botones */
text-gray-600 hover:bg-gray-50 border-gray-300

/* Input */
text-gray-700 bg-transparent
```

### **Variante White (Blanca)**

```css
/* Contenedor */
bg-white border-gray-300 shadow-sm

/* Botones */
text-gray-700 hover:bg-gray-50 border-gray-300

/* Input */
text-gray-900 bg-white
```

## 🔄 **Implementación Automática**

### **En Tarjetas de Producto (Escaparate)**

```tsx
// Mantiene el estilo transparente por defecto
<QuantitySelector
  size="sm"
  // variant="default" es automático
/>
```

### **En Páginas Individuales**

```tsx
// Nuevo estilo blanco para mejor contraste
<QuantitySelector
  size="md"
  variant="white" // ← Especificado para contraste
/>
```

## 🚀 **Beneficios de la Mejora**

1. **✨ Mejor Legibilidad**: Texto negro sobre fondo blanco en páginas individuales
2. **🎯 Contraste Óptimo**: No hay confusión visual con el fondo verde
3. **🔧 Flexibilidad**: Dos variantes para diferentes contextos
4. **📱 Consistencia**: Mantiene la estética general del sitio
5. **♿ Accesibilidad**: Mejor contraste para usuarios con dificultades visuales

## 🎨 **Resultado Visual**

### **Antes:**

- Selector semi-transparente que se perdía en fondos verdes
- Dificultad para leer números y distinguir botones

### **Después:**

- **Escaparate**: Selector transparente (perfecto para tarjetas blancas)
- **Páginas individuales**: Selector blanco sólido (contraste perfecto con fondo verde)

La experiencia de usuario ahora es **clara, consistente y accesible** en todos los contextos. 🛍️✨
