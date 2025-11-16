# 🎨 INSTRUCCIONES FRONTEND - React + TypeScript

> Guía de patrones, componentes y mejores prácticas para desarrollo frontend  
> Stack: React 18.3 + TypeScript 5.7 + Vite 6.2 + Zustand + React Router 7

---

## 1. Arquitectura Frontend

### 1.1 Estructura de Carpetas

```text
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Botones, inputs, modales
│   ├── layout/         # Header, Footer, SimpleLayout
│   └── features/       # Componentes de funcionalidades
├── pages/              # Páginas/vistas
├── hooks/              # Custom hooks
├── contexts/           # React contexts
├── store/              # Zustand stores
├── services/           # Servicios de API
├── api/                # Configuración de API client
├── utils/              # Utilidades y helpers
├── types/              # TypeScript types/interfaces
└── styles/             # Estilos globales
```

### 1.2 Patrones de Componentes

#### Componente Funcional con TypeScript

```typescript
import { FC, useState, useEffect } from 'react';

interface ProductCardProps {
  productId: string;
  name: string;
  price: number;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export const ProductCard: FC<ProductCardProps> = ({
  productId,
  name,
  price,
  onAddToCart,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart?.(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`product-card ${className}`}>
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
      <button onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? 'Agregando...' : 'Agregar al Carrito'}
      </button>
    </div>
  );
};
```

#### Custom Hook Pattern

```typescript
import { useState, useEffect } from 'react';
import { Product } from '@/types/Product';
import { ProductService } from '@/services/ProductService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const data = await ProductService.getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}
```

---

## 2. Estado Global con Zustand

### 2.1 Crear Store

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set) => ({
      items: [],
      total: 0,

      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.productId === item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          state.items.push(item);
        }
        state.total = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      }),

      removeItem: (productId) => set((state) => {
        state.items = state.items.filter(i => i.productId !== productId);
        state.total = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      }),

      updateQuantity: (productId, quantity) => set((state) => {
        const item = state.items.find(i => i.productId === productId);
        if (item) {
          item.quantity = quantity;
          state.total = state.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        }
      }),

      clearCart: () => set({ items: [], total: 0 })
    })),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

### 2.2 Usar Store en Componente

```typescript
import { useCartStore } from '@/store/cartStore';

export function CartButton() {
  const { items, total } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button className="cart-button">
      🛒 Carrito ({itemCount})
      <span className="total">${total.toFixed(2)}</span>
    </button>
  );
}
```

---

## 3. Routing con React Router 7

### 3.1 Configuración de Rutas

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import SimpleLayout from '@/components/layout/SimpleLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy loading de páginas
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'productos', element: <ProductsPage /> },
      { path: 'productos/:id', element: <ProductDetailPage /> },
      { path: 'carrito', element: <CartPage /> },
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
]);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

### 3.2 Navegación Programática

```typescript
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    navigate(-1); // Volver atrás
  };

  const handleGoToCart = () => {
    navigate('/carrito');
  };

  const category = searchParams.get('category');

  return (
    <div>
      <button onClick={handleBack}>← Volver</button>
      <h1>Producto {id}</h1>
      {category && <p>Categoría: {category}</p>}
    </div>
  );
}
```

---

## 4. Context API para Estado Compartido

### 4.1 Crear Context

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/User';
import { AuthService } from '@/services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });
    setUser(response.user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 5. Formularios con React Hook Form + Zod

### 5.1 Schema de Validación

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email requerido'),
  
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener mayúscula')
    .regex(/[a-z]/, 'Debe contener minúscula')
    .regex(/[0-9]/, 'Debe contener número')
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### 5.2 Formulario con Validación

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/auth';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

---

## 6. Optimización de Rendimiento

### 6.1 Memoización con React.memo

```typescript
import { memo } from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  onClick: () => void;
}

export const ProductCard = memo<ProductCardProps>(({ name, price, onClick }) => {
  console.log('ProductCard rendered:', name);
  
  return (
    <div onClick={onClick}>
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
```

### 6.2 useMemo y useCallback

```typescript
import { useMemo, useCallback } from 'react';

export function ProductList({ products, onAddToCart }) {
  // Computación costosa memoizada
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  // Función memoizada para evitar re-renders
  const handleAddToCart = useCallback((productId: string) => {
    onAddToCart(productId);
  }, [onAddToCart]);

  return (
    <div>
      {sortedProducts.map(product => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
```

### 6.3 Lazy Loading de Componentes

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('@/components/HeavyComponent'));

export function Page() {
  return (
    <div>
      <h1>Mi Página</h1>
      <Suspense fallback={<div>Cargando...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}
```

---

## 7. Manejo de Errores

### 7.1 Error Boundary

```typescript
import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h1>Algo salió mal</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 8. Estilización con Tailwind CSS

### 8.1 Clases Condicionales

```typescript
import { clsx } from 'clsx';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({ variant, size, isLoading, children }: ButtonProps) {
  const className = clsx(
    'font-semibold rounded transition-colors',
    {
      'bg-blue-600 hover:bg-blue-700 text-white': variant === 'primary',
      'bg-gray-200 hover:bg-gray-300 text-gray-800': variant === 'secondary',
      'bg-red-600 hover:bg-red-700 text-white': variant === 'danger',
      'px-2 py-1 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
      'opacity-50 cursor-not-allowed': isLoading
    }
  );

  return (
    <button className={className} disabled={isLoading}>
      {isLoading ? 'Cargando...' : children}
    </button>
  );
}
```

---

## 9. Mejores Prácticas

### 9.1 Nomenclatura

- **Componentes**: PascalCase (`ProductCard`, `UserProfile`)
- **Hooks**: camelCase con prefijo `use` (`useAuth`, `useProducts`)
- **Funciones**: camelCase (`handleClick`, `fetchData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_ITEMS`)
- **Tipos**: PascalCase (`User`, `Product`, `CartItem`)

### 9.2 Estructura de Archivos

```text
ProductCard/
├── ProductCard.tsx          # Componente principal
├── ProductCard.test.tsx     # Tests
├── ProductCard.stories.tsx  # Storybook (opcional)
└── index.ts                 # Export barrel
```

### 9.3 Props Destructuring

```typescript
// ✓ Correcto
export function ProductCard({ name, price, onAddToCart }: Props) {
  // ...
}

// ✗ Evitar
export function ProductCard(props: Props) {
  return <div>{props.name}</div>;
}
```

### 9.4 Key Props en Listas

```typescript
// ✓ Correcto - ID único
{products.map(product => (
  <ProductCard key={product.id} {...product} />
))}

// ✗ Evitar - Índice como key
{products.map((product, index) => (
  <ProductCard key={index} {...product} />
))}
```

---

## 10. Checklist de Componente

Antes de considerar un componente completo:

- [ ] TypeScript types definidos para props
- [ ] Props con valores por defecto cuando aplique
- [ ] Manejo de loading y error states
- [ ] Accesibilidad (ARIA labels, keyboard navigation)
- [ ] Responsive design (mobile-first)
- [ ] Memoización si es necesario
- [ ] Tests unitarios escritos
- [ ] Comentarios en lógica compleja
- [ ] Sin console.logs en producción
- [ ] PropTypes o TypeScript para validación

---

**Estado**: ✅ Guía Frontend Completa
