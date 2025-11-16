# FASE 2: API DE PRODUCTOS - INSTRUCCIONES PARA GPT-5-CODEX

## CONTEXTO
La Fase 1 (autenticación) está completada y funcionando. Ahora necesitamos migrar los productos del frontend al backend.

**Problema actual:**
- 128 productos hardcodeados en `src/data/products.ts` (causa bundle de 449KB)
- Productos ya están en SQLite (`backend/database.sqlite`) con UTF-8 correcto
- Frontend sigue usando datos locales en lugar de API

**Objetivo:**
- Crear API REST `/api/products` en backend
- Conectar frontend a la API
- Eliminar datos hardcodeados del frontend
- Reducir bundle de 449KB → ~50KB

---

## CAMPOS CRÍTICOS DEL PRODUCTO (NO OLVIDAR NINGUNO)

### 1. Información Básica
```typescript
{
  id: string,
  name: string,
  description: string,
  price: number,
  compareAtPrice?: number,
  rating: number,
  reviewCount: number,
  category: string,
  subcategory?: string,
  images: string[],
  stock: number,
  sku?: string,
  isFeatured: boolean,
  warnings?: string
}
```

### 2. Descripción Detallada (Subsección 1)
```typescript
{
  detailedDescription?: string,
  mechanismOfAction?: string,
  benefitsDescription?: string[],
  healthIssues?: string[]
}
```

### 3. Componentes (Subsección 2)
```typescript
{
  components?: Array<{
    name: string,
    description: string,
    amount: string
  }>
}
```

### 4. Modo de Empleo (Subsección 3)
```typescript
{
  usage?: string,
  dosage?: string,
  administrationMethod?: string
}
```

### 5. Preguntas Frecuentes (Subsección 4)
```typescript
{
  faqs?: Array<{
    question: string,
    answer: string
  }>
}
```

### 6. Referencias Científicas (Subsección 5)
```typescript
{
  scientificReferences?: Array<{
    title: string,
    authors: string[],
    journal: string,
    year: number,
    doi?: string,
    url?: string,
    summary?: string
  }>
}
```

---

## TAREAS A REALIZAR

### BACKEND (backend/src/)

#### 1. Crear `backend/src/services/productService.ts`
```typescript
// Funciones requeridas:
- getAllProducts(filters?: { category?, search?, featured? })
- getProductById(id: string)
- getProductsByCategory(category: string)
- searchProducts(query: string)
```

**IMPORTANTE:** Parsear campos JSON de la base de datos:
- `images` (TEXT → string[])
- `components` (TEXT → Component[])
- `faqs` (TEXT → FAQ[])
- `scientificReferences` (TEXT → Reference[])
- `benefitsDescription` (TEXT → string[])
- `healthIssues` (TEXT → string[])

#### 2. Crear `backend/src/routes/products.ts`
```typescript
// Rutas públicas (sin autenticación):
GET /api/products - Lista todos los productos con filtros opcionales
GET /api/products/:id - Obtiene un producto por ID
GET /api/products/category/:category - Productos por categoría
GET /api/products/search?q=query - Búsqueda de productos
GET /api/products/featured - Productos destacados
```

#### 3. Registrar rutas en `backend/src/index.ts`
```typescript
// Después de authRoutes:
const { productRoutes } = await import('./routes/products.js');
await app.register(productRoutes, { prefix: '/api/products' });
```

#### 4. Crear `backend/src/types/product.ts`
```typescript
// Definir interfaces completas del producto con todos los campos
// Incluir tipos de validación Zod si es necesario
```

---

### FRONTEND (src/)

#### 5. Crear `src/services/productService.ts`
```typescript
import { apiClient } from './apiClient';
import type { Product } from '../types/product';

// Funciones que usan apiClient:
export async function fetchProducts(filters?: { category?, search?, featured? }): Promise<Product[]>
export async function fetchProductById(id: string): Promise<Product | null>
export async function fetchProductsByCategory(category: string): Promise<Product[]>
export async function searchProducts(query: string): Promise<Product[]>
export async function fetchFeaturedProducts(): Promise<Product[]>
```

#### 6. Crear `src/store/productStore.ts` (Zustand)
```typescript
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchProducts: (filters?) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  clearError: () => void;
}
```

#### 7. Modificar `src/pages/ProductPage.tsx`
```typescript
// REEMPLAZAR:
import { products } from '../data/products';

// POR:
import { useProductStore } from '../store/productStore';

// Usar:
const { fetchProductById } = useProductStore();
const product = await fetchProductById(productId);
```

#### 8. Modificar `src/pages/StorePage.tsx`
```typescript
// REEMPLAZAR:
import { products } from '../data/products';

// POR:
import { useProductStore } from '../store/productStore';

// Usar:
const { products, loading, fetchProducts } = useProductStore();
```

#### 9. Modificar `src/pages/HomePage.tsx`
```typescript
// Para productos destacados:
import { useProductStore } from '../store/productStore';
const { products, fetchProducts } = useProductStore();

// Llamar con filtro:
await fetchProducts({ featured: true });
```

#### 10. ELIMINAR archivos obsoletos
```
src/data/products.ts (128 productos hardcodeados)
src/data/products/loader.ts (si solo carga archivos locales)
```

---

## VALIDACIONES IMPORTANTES

### Backend
- ✅ Todos los campos JSON se parsean correctamente
- ✅ Errores 404 si producto no existe
- ✅ Paginación opcional para `/api/products` (query params: `?page=1&limit=20`)
- ✅ CORS permite requests desde `http://localhost:5173`

### Frontend
- ✅ Loading states durante fetches
- ✅ Error handling con mensajes amigables
- ✅ Cache en Zustand para evitar re-fetches innecesarios
- ✅ Fallback si API falla (mostrar mensaje de error)

---

## ESTRUCTURA DE DATOS EN SQLITE (REFERENCIA)

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  compare_at_price REAL,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category TEXT,
  subcategory TEXT,
  images TEXT,              -- JSON: ["url1", "url2"]
  stock INTEGER DEFAULT 0,
  sku TEXT,
  is_featured INTEGER DEFAULT 0,
  warnings TEXT,
  
  -- Campos adicionales (pueden ser NULL):
  detailed_description TEXT,
  mechanism_of_action TEXT,
  benefits_description TEXT,   -- JSON: ["benefit1", "benefit2"]
  health_issues TEXT,          -- JSON: ["issue1", "issue2"]
  components TEXT,             -- JSON: [{name, description, amount}]
  usage TEXT,
  dosage TEXT,
  administration_method TEXT,
  faqs TEXT,                   -- JSON: [{question, answer}]
  scientific_references TEXT,  -- JSON: [{title, authors, journal...}]
  
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
```

---

## EJEMPLO DE RESPUESTA API

### GET /api/products/:id
```json
{
  "product": {
    "id": "1",
    "name": "Vitamina C 1000mg",
    "description": "Vitamina C de alta potencia...",
    "price": 24.99,
    "compareAtPrice": 29.99,
    "rating": 4.5,
    "reviewCount": 128,
    "category": "vitaminas-minerales",
    "images": ["/Jpeg/c-1000-with-bioflavonoid.jpg"],
    "stock": 100,
    "isFeatured": true,
    "detailedDescription": "La vitamina C es esencial...",
    "mechanismOfAction": "La vitamina C actúa como...",
    "benefitsDescription": [
      "Refuerza el sistema inmunológico",
      "Potente antioxidante"
    ],
    "healthIssues": ["Defensas bajas", "Estrés oxidativo"],
    "components": [
      {
        "name": "Vitamina C (ácido ascórbico)",
        "description": "Forma pura de vitamina C",
        "amount": "1000mg"
      }
    ],
    "usage": "Tomar 1 cápsula al día con alimentos",
    "dosage": "1000mg diarios",
    "administrationMethod": "Vía oral con agua",
    "faqs": [
      {
        "question": "¿Puedo tomar más de una cápsula al día?",
        "answer": "No se recomienda exceder la dosis..."
      }
    ],
    "scientificReferences": [
      {
        "title": "Vitamin C and Immune Function",
        "authors": ["Smith J", "Doe A"],
        "journal": "Nature",
        "year": 2020,
        "doi": "10.1038/...",
        "url": "https://..."
      }
    ]
  }
}
```

### GET /api/products (con filtros)
```json
{
  "products": [...],
  "total": 128,
  "page": 1,
  "limit": 20,
  "totalPages": 7
}
```

---

## CHECKLIST DE COMPLETITUD

### Backend
- [ ] `productService.ts` creado con todas las funciones
- [ ] `routes/products.ts` con 5 endpoints
- [ ] Rutas registradas en `index.ts`
- [ ] Tipos TypeScript completos
- [ ] Parseo correcto de campos JSON
- [ ] Error handling (404, 500)
- [ ] Backend reiniciado y probado manualmente

### Frontend
- [ ] `productService.ts` creado (llamadas API)
- [ ] `productStore.ts` creado (Zustand)
- [ ] `ProductPage.tsx` modificado (usa store)
- [ ] `StorePage.tsx` modificado (usa store)
- [ ] `HomePage.tsx` modificado (usa store)
- [ ] `src/data/products.ts` ELIMINADO
- [ ] Frontend reiniciado y probado

### Validación E2E
- [ ] GET /api/products devuelve 128 productos
- [ ] GET /api/products/1 devuelve producto con todas las subsecciones
- [ ] Frontend muestra productos desde API
- [ ] Página de producto muestra las 5 subsecciones correctamente
- [ ] Búsqueda funciona
- [ ] Filtro por categoría funciona
- [ ] No hay errores en consola
- [ ] Bundle reducido (verificar con `npm run build`)

---

## COMANDO FINAL DE VERIFICACIÓN

```bash
# Backend (debe devolver 128 productos)
curl http://localhost:3000/api/products

# Backend (debe devolver producto completo)
curl http://localhost:3000/api/products/1

# Frontend (verificar bundle)
cd Pureza-Naturalis-V3
npm run build
# Buscar en output: dist/assets/index-*.js < 100KB
```

---

## NOTAS ADICIONALES

1. **No usar autenticación** en rutas de productos (son públicas)
2. **Mantener compatibilidad** con tipos existentes en `src/types/product.ts`
3. **UTF-8:** Base de datos ya tiene encoding correcto
4. **Imágenes:** URLs son rutas relativas (`/Jpeg/...`), no necesitan cambios
5. **Cache:** Implementar cache básico en Zustand (30 segundos TTL)

---

## PRIORIDAD DE IMPLEMENTACIÓN

1. **CRÍTICO:** Backend productService + routes (sin esto nada funciona)
2. **CRÍTICO:** Frontend productService (conecta con API)
3. **CRÍTICO:** productStore en Zustand (gestión de estado)
4. **IMPORTANTE:** Modificar ProductPage, StorePage, HomePage
5. **IMPORTANTE:** Eliminar archivos obsoletos
6. **VALIDACIÓN:** Pruebas E2E

---

## ARCHIVOS A CREAR/MODIFICAR

### Crear (Backend)
- `backend/src/services/productService.ts`
- `backend/src/routes/products.ts`
- `backend/src/types/product.ts`

### Modificar (Backend)
- `backend/src/index.ts` (registrar rutas)

### Crear (Frontend)
- `src/services/productService.ts`
- `src/store/productStore.ts`

### Modificar (Frontend)
- `src/pages/ProductPage.tsx`
- `src/pages/StorePage.tsx`
- `src/pages/HomePage.tsx`

### Eliminar (Frontend)
- `src/data/products.ts`
- `src/data/products/loader.ts` (si procede)

---

**IMPORTANTE:** Implementa TODO en una sola iteración para evitar estados intermedios rotos. Prueba cada endpoint backend ANTES de modificar el frontend.
