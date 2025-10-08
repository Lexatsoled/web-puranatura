# 📊 Documentación de Componentes
*Pureza Naturalis - Guía de Componentes React*

## 🎯 Introducción

Esta documentación describe todos los componentes React disponibles en la aplicación Pureza Naturalis, incluyendo sus props, casos de uso y ejemplos de implementación.

---

## 🧩 Componentes Principales

### 🛒 CartModal

Modal para gestionar el carrito de compras con funcionalidades completas.

**Props:**
```typescript
interface CartModalProps {
  isOpen: boolean;           // Estado de visibilidad del modal
  onClose: () => void;       // Función para cerrar el modal
}
```

**Uso:**
```tsx
import CartModal from '@/components/CartModal';

<CartModal 
  isOpen={isCartModalOpen} 
  onClose={() => setIsCartModalOpen(false)} 
/>
```

**Características:**
- ✅ Gestión completa del carrito
- ✅ Cálculo automático de totales
- ✅ Selector de cantidad
- ✅ Eliminación de productos
- ✅ Integración con notificaciones

---

### 🎴 ProductCard

Tarjeta de producto con información completa y acciones.

**Props:**
```typescript
interface ProductCardProps {
  product: Product;          // Objeto producto completo
  className?: string;        // Clases CSS adicionales
}
```

**Uso:**
```tsx
import ProductCard from '@/components/ProductCard';

<ProductCard 
  product={productData}
  className="hover:shadow-lg"
/>
```

**Características:**
- ✅ Imagen optimizada con lazy loading
- ✅ Información de precios y descuentos
- ✅ Badges de características (orgánico, vegano, etc.)
- ✅ Rating y reseñas
- ✅ Botones de acción (agregar al carrito, wishlist)

---

### 🏠 Header

Cabecera principal con navegación y funcionalidades.

**Props:**
```typescript
interface HeaderProps {
  className?: string;        // Clases CSS adicionales
}
```

**Uso:**
```tsx
import Header from '@/components/Header';

<Header className="shadow-lg" />
```

**Características:**
- ✅ Logo responsive
- ✅ Menú de navegación
- ✅ Carrito con contador
- ✅ Buscador (próxima implementación)
- ✅ Menú móvil hamburguesa

---

### 🦶 Footer

Pie de página con información y enlaces importantes.

**Props:**
```typescript
interface FooterProps {
  className?: string;        // Clases CSS adicionales
}
```

**Uso:**
```tsx
import Footer from '@/components/Footer';

<Footer className="bg-gray-900" />
```

**Características:**
- ✅ Enlaces de navegación
- ✅ Información de contacto
- ✅ Redes sociales
- ✅ Copyright y términos legales

---

### 🔔 CartNotification

Notificación toast para acciones del carrito.

**Props:**
```typescript
interface CartNotificationProps {
  isVisible: boolean;        // Visibilidad de la notificación
  type: 'success' | 'error'; // Tipo de notificación
  message: string;           // Mensaje a mostrar
  onClose: () => void;       // Función para cerrar
}
```

**Uso:**
```tsx
import CartNotification from '@/components/CartNotification';

<CartNotification
  isVisible={showNotification}
  type="success"
  message="Producto agregado al carrito"
  onClose={() => setShowNotification(false)}
/>
```

**Características:**
- ✅ Animaciones suaves
- ✅ Auto-cierre configurable
- ✅ Tipos visuales (success, error, info)
- ✅ Posicionamiento estratégico

---

### 🔍 ProductDetailModal

Modal detallado para visualizar información completa del producto.

**Props:**
```typescript
interface ProductDetailModalProps {
  product: Product | null;   // Producto a mostrar (null si cerrado)
  isOpen: boolean;           // Estado de visibilidad
  onClose: () => void;       // Función para cerrar
}
```

**Uso:**
```tsx
import ProductDetailModal from '@/components/ProductDetailModal';

<ProductDetailModal
  product={selectedProduct}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

**Características:**
- ✅ Galería de imágenes con zoom
- ✅ Información nutricional completa
- ✅ Referencias científicas
- ✅ Selector de variantes
- ✅ Dosificación y precauciones

---

### 📊 QuantitySelector

Selector numérico para cantidad de productos.

**Props:**
```typescript
interface QuantitySelectorProps {
  quantity: number;          // Cantidad actual
  onQuantityChange: (qty: number) => void; // Callback de cambio
  min?: number;              // Cantidad mínima (default: 1)
  max?: number;              // Cantidad máxima (default: 99)
  className?: string;        // Clases CSS adicionales
}
```

**Uso:**
```tsx
import QuantitySelector from '@/components/QuantitySelector';

<QuantitySelector
  quantity={itemQuantity}
  onQuantityChange={setItemQuantity}
  min={1}
  max={10}
/>
```

**Características:**
- ✅ Botones + / - intuitivos
- ✅ Input directo con validación
- ✅ Límites configurables
- ✅ Estilos consistentes

---

## 🪝 Custom Hooks

### 🗄️ useLocalStorage

Hook para gestionar datos en localStorage con TypeScript.

**Signatura:**
```typescript
function useLocalStorage<T>(
  key: string,               // Clave de localStorage
  initialValue: T            // Valor inicial por defecto
): [T, (value: T | ((val: T) => T)) => void]
```

**Uso:**
```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

const [cartItems, setCartItems] = useLocalStorage('cart', []);
const [userPrefs, setUserPrefs] = useLocalStorage('preferences', {
  theme: 'light',
  language: 'es'
});
```

**Características:**
- ✅ TypeScript completamente tipado
- ✅ Sincronización automática
- ✅ Manejo de errores
- ✅ SSR compatible

---

## 🌐 Context Providers

### 🛒 CartContext

Contexto global para gestión del carrito de compras.

**API:**
```typescript
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

**Uso:**
```tsx
import { useCart } from '@/contexts/CartContext';

const { items, addItem, removeItem } = useCart();
```

---

### 🔔 NotificationContext

Sistema de notificaciones global.

**API:**
```typescript
interface NotificationContextType {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
}
```

**Uso:**
```tsx
import { useNotification } from '@/contexts/NotificationContext';

const { showNotification } = useNotification();
showNotification('Operación exitosa!', 'success');
```

---

## 🎨 Estilos y Theming

### Clases CSS Predefinidas

**Colores de marca:**
```css
.text-primary    /* Verde principal #16a34a */
.bg-primary      /* Fondo verde principal */
.text-secondary  /* Gris secundario #6b7280 */
.bg-secondary    /* Fondo gris secundario */
```

**Utilidades comunes:**
```css
.card-shadow     /* Sombra para tarjetas */
.transition-all  /* Transiciones suaves */
.blur-backdrop   /* Efecto blur para modales */
.fade-in         /* Animación de entrada */
```

### Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## 🔧 Configuración y Personización

### Agregar Nuevos Componentes

1. **Crear el componente:**
```tsx
// components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

2. **Agregar tipos (si es necesario):**
```typescript
// src/types/components.ts
export interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}
```

3. **Crear tests:**
```tsx
// test/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Mejores Prácticas

**📝 Naming Conventions:**
- Componentes: `PascalCase`
- Hooks: `camelCase` con prefijo `use`
- Archivos: `PascalCase.tsx` para componentes
- Props: Interfaces terminadas en `Props`

**🔧 Performance:**
- Usar `React.memo()` para componentes pesados
- Implementar `useMemo()` y `useCallback()` cuando sea necesario
- Lazy loading para componentes grandes

**♿ Accesibilidad:**
- Siempre incluir `aria-label` en botones icónicos
- Usar elementos semánticos (`button`, `nav`, `main`)
- Implementar navegación por teclado

---

## 📚 Recursos y Referencias

- **🔗 React Docs:** [https://react.dev](https://react.dev)
- **🔗 TypeScript:** [https://typescriptlang.org](https://typescriptlang.org)
- **🔗 Tailwind CSS:** [https://tailwindcss.com](https://tailwindcss.com)
- **🔗 Testing Library:** [https://testing-library.com](https://testing-library.com)

---

*📧 **Desarrollo:** dev@purezanaturalis.com*  
*📝 **Documentación actualizada:** 2024-10-07*