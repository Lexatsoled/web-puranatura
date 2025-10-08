# 🎯 PLAN DE EJECUCIÓN - CONSOLIDACIÓN ARQUITECTURA

## Estado: EN EJECUCIÓN

### DECISIONES TOMADAS:

#### 1. HomePage - Mantener versión SRC
- ✅ **src/pages/HomePage.tsx** es superior:
  - Usa OptimizedBackgroundImage (mejor performance)
  - Tiene useScrollToTop hook
  - Componente FeatureCard extraído
  - Mejor responsive (flex-col sm:flex-row)
  - Hover effects en cards
- ❌ **pages/HomePage.tsx** será eliminada (versión legacy con imagen hardcodeada)

#### 2. ServicesPage - Mantener versión ROOT
- ✅ **pages/ServicesPage.tsx** es superior:
  - Tiene Link to="/servicios/${service.id}" (navegación funcional)
  - Muestra duración y precio
  - Beneficios preview
  - Más completa y funcional
- ❌ **src/pages/ServicesPage.tsx** será eliminada (versión incompleta sin Links, código comentado)

#### 3. CartContext - Mantener versión ROOT
- ✅ **contexts/CartContext.tsx** es la versión COMPLETA:
  - addToCart, removeFromCart, updateQuantity, clearCart
  - Usa useLocalStorage para persistencia
  - Calcula cartCount y totalPrice
  - Tipos completos
- ❌ **src/contexts/CartContext.tsx** será eliminada (versión minimalista inútil)

---

## FASE 1: BACKUP Y PREPARACIÓN

```bash
# Crear carpeta de backup (por seguridad)
mkdir -p .backup-consolidation
cp -r contexts .backup-consolidation/
cp -r pages .backup-consolidation/
cp -r hooks .backup-consolidation/
cp -r data .backup-consolidation/
cp -r types .backup-consolidation/
```

---

## FASE 2: MOVER ARCHIVOS A src/

### 2.1 Contexts (4 archivos) → src/contexts/

```plaintext
✅ contexts/AuthContext.tsx → src/contexts/AuthContext.tsx (NEW)
✅ contexts/CartContext.tsx → src/contexts/CartContext.tsx (REPLACE)
✅ contexts/WishlistContext.tsx → src/contexts/WishlistContext.tsx (NEW)
✅ contexts/NotificationContext.tsx → comparar y decidir cuál mantener
```

### 2.2 Pages (15 archivos) → src/pages/

```plaintext
✅ pages/AboutPage.tsx → src/pages/AboutPage.tsx
✅ pages/AddressesPage.tsx → src/pages/AddressesPage.tsx
✅ pages/BlogPage.tsx → src/pages/BlogPage.tsx
✅ pages/BlogPostPage.tsx → src/pages/BlogPostPage.tsx
✅ pages/CartPage.tsx → src/pages/CartPage.tsx
✅ pages/ContactPage.tsx → src/pages/ContactPage.tsx
❌ pages/HomePage.tsx → ELIMINAR (mantener src/pages/HomePage.tsx)
✅ pages/OrdersPage.tsx → src/pages/OrdersPage.tsx
✅ pages/ProfilePage.tsx → src/pages/ProfilePage.tsx
✅ pages/ServicePage.tsx → src/pages/ServicePage.tsx
✅ pages/ServicesPage.tsx → src/pages/ServicesPage.tsx (REPLACE)
✅ pages/StorePage.tsx → src/pages/StorePage.tsx (o renombrar a StorePageLegacy?)
✅ pages/SystemsTestPage.tsx → src/pages/SystemsTestPage.tsx
✅ pages/TestimonialsPage.tsx → src/pages/TestimonialsPage.tsx
✅ pages/WishlistPage.tsx → src/pages/WishlistPage.tsx
```

### 2.3 Hooks (1 archivo) → src/hooks/

```plaintext
✅ hooks/useLocalStorage.ts → verificar si ya existe en src/hooks/
```

### 2.4 Data (4 archivos) → src/data/

```plaintext
✅ data/blog.ts → src/data/blog.ts
✅ data/products.ts → src/data/products.ts
✅ data/services.ts → src/data/services.ts
✅ data/testimonials.ts → src/data/testimonials.ts
```

### 2.5 Types (1 archivo) → src/types/

```plaintext
✅ types/index.ts → mergear con src/types/index.ts
```

---

## FASE 3: ACTUALIZAR IMPORTS

### 3.1 App.tsx - Actualizar TODOS los imports

**ANTES:**
```tsx
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import NotificationContainer from './src/components/NotificationContainer';
import CartNotification from './src/components/CartNotification';
import ScrollManager from './src/components/ScrollManager';
import { useCartNotificationStore } from './src/store/cartNotificationStore';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import StorePage from './pages/StorePage';
import ProductPage from './src/pages/ProductPage';
import CheckoutPage from './src/pages/CheckoutPage';
import OrderConfirmationPage from './src/pages/OrderConfirmationPage';
import TestimonialsPage from './pages/TestimonialsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AddressesPage from './pages/AddressesPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import SistemasSinergicosPage from './src/pages/SistemasSinergicosPage';
import SimpleLayout from './SimpleLayout';
```

**DESPUÉS:**
```tsx
import { CartProvider } from './src/contexts/CartContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { WishlistProvider } from './src/contexts/WishlistContext';
import NotificationContainer from './src/components/NotificationContainer';
import CartNotification from './src/components/CartNotification';
import ScrollManager from './src/components/ScrollManager';
import { useCartNotificationStore } from './src/store/cartNotificationStore';
import HomePage from './src/pages/HomePage';
import AboutPage from './src/pages/AboutPage';
import ServicesPage from './src/pages/ServicesPage';
import StorePage from './src/pages/StorePage';
import ProductPage from './src/pages/ProductPage';
import CheckoutPage from './src/pages/CheckoutPage';
import OrderConfirmationPage from './src/pages/OrderConfirmationPage';
import TestimonialsPage from './src/pages/TestimonialsPage';
import BlogPage from './src/pages/BlogPage';
import BlogPostPage from './src/pages/BlogPostPage';
import ServicePage from './src/pages/ServicePage';
import ContactPage from './src/pages/ContactPage';
import ProfilePage from './src/pages/ProfilePage';
import OrdersPage from './src/pages/OrdersPage';
import AddressesPage from './src/pages/AddressesPage';
import WishlistPage from './src/pages/WishlistPage';
import CartPage from './src/pages/CartPage';
import SistemasSinergicosPage from './src/pages/SistemasSinergicosPage';
import SimpleLayout from './SimpleLayout';
```

### 3.2 Todas las páginas ROOT - Actualizar antes de mover

Cada archivo `pages/*.tsx` debe actualizar:
- `../contexts/` → `../src/contexts/`
- `../data/` → `../src/data/`
- `../hooks/` → `../src/hooks/`

### 3.3 SimpleLayout.tsx - Actualizar imports

**ANTES:**
```tsx
import { useAuth } from './contexts/AuthContext';
```

**DESPUÉS:**
```tsx
import { useAuth } from './src/contexts/AuthContext';
```

### 3.4 Tests - Actualizar imports

#### test/integration/App.test.tsx:
```tsx
// ANTES:
import App from '../App';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { AuthProvider } from '../contexts/AuthContext';

// DESPUÉS:
import App from '../App';
import { CartProvider } from '../src/contexts/CartContext';
import { WishlistProvider } from '../src/contexts/WishlistContext';
import { NotificationProvider } from '../src/contexts/NotificationContext';
import { AuthProvider } from '../src/contexts/AuthContext';
```

#### test/components/*.test.tsx:
```tsx
// ANTES:
import { AuthProvider } from '../../contexts/AuthContext';
import ProductCard from '../../components/ProductCard';

// DESPUÉS:
import { AuthProvider } from '../../src/contexts/AuthContext';
import ProductCard from '../../src/components/ProductCard';
```

#### test/hooks/useLocalStorage.test.ts:
```tsx
// ANTES:
import { useLocalStorage } from '../../hooks/useLocalStorage';

// DESPUÉS:
import { useLocalStorage } from '../../src/hooks/useLocalStorage';
```

---

## FASE 4: ELIMINAR CARPETAS ROOT

```bash
# Solo después de validar que todo funciona:
rm -rf contexts/
rm -rf pages/
rm -rf hooks/
rm -rf data/
rm -rf types/
```

---

## FASE 5: ACTUALIZAR CONFIGURACIONES

### tsconfig.json

**ANTES:**
```jsonc
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  },
  "exclude": [
    "node_modules",
    "dist",
    "test/components",
    "test/integration"
  ]
}
```

**DESPUÉS:**
```jsonc
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@contexts/*": ["./src/contexts/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@data/*": ["./src/data/*"],
      "@store/*": ["./src/store/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### vite.config.ts

```ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@data': path.resolve(__dirname, './src/data'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  }
});
```

---

## FASE 6: VALIDACIÓN

```bash
# 1. TypeScript check
npm run type-check

# 2. Run tests
npm run test

# 3. Build production
npm run build

# 4. Preview
npm run preview

# 5. Lint
npm run lint
```

---

## CHECKLIST FINAL

- [ ] Contexts consolidados en src/contexts/
- [ ] Pages consolidados en src/pages/
- [ ] Hooks consolidados en src/hooks/
- [ ] Data consolidados en src/data/
- [ ] Types consolidados en src/types/
- [ ] App.tsx actualizado
- [ ] SimpleLayout.tsx actualizado
- [ ] Tests actualizados
- [ ] tsconfig.json actualizado
- [ ] vite.config.ts actualizado
- [ ] Carpetas ROOT eliminadas
- [ ] npm run type-check ✅
- [ ] npm run test ✅
- [ ] npm run build ✅
- [ ] Commit realizado

---

**Fecha inicio**: ${new Date().toISOString()}
