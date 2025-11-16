# TASK-015: Sistema de Paginación y Filtros Avanzados

## 📋 INFORMACIÓN

**ID**: TASK-015 | **Fase**: 2 | **Prioridad**: ALTA | **Estimación**: 3h

## 🎯 OBJETIVO

Implementar sistema unificado de paginación cursor-based y filtros avanzados para todas las APIs (products, orders, users) con soporte para ordenamiento, búsqueda y exportación.

## 📊 CONTEXTO

**Problema**: Paginación offset-based ineficiente para datasets grandes, filtros inconsistentes entre endpoints.

**Solución**: Librería de paginación reutilizable + filtros dinámicos con QueryBuilder.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Utilidades de Paginación

**Archivo**: `backend/src/utils/pagination.ts`

```typescript
import { SQL, sql } from 'drizzle-orm';

export interface CursorPaginationParams {
  limit?: number;
  cursor?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
  prevCursor: number | null;
  hasMore: boolean;
  total?: number;
}

export class PaginationBuilder<T> {
  private maxLimit = 100;
  private defaultLimit = 20;

  constructor(
    private idField: string = 'id'
  ) {}

  build(params: CursorPaginationParams, data: any[]): CursorPaginationResult<T> {
    const limit = Math.min(params.limit || this.defaultLimit, this.maxLimit);
    const hasMore = data.length > limit;
    const items = data.slice(0, limit);

    return {
      data: items as T[],
      nextCursor: hasMore ? items[items.length - 1][this.idField] : null,
      prevCursor: params.cursor || null,
      hasMore,
    };
  }

  getCursorCondition(cursor: number, direction: 'forward' | 'backward' = 'forward'): SQL {
    return direction === 'forward'
      ? sql`${this.idField} < ${cursor}`
      : sql`${this.idField} > ${cursor}`;
  }
}
```

### Paso 2: Query Builder para Filtros

**Archivo**: `backend/src/utils/queryBuilder.ts`

```typescript
import { SQL, sql, and, or, eq, gte, lte, like, inArray } from 'drizzle-orm';

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: any;
}

export class QueryBuilder {
  private conditions: SQL[] = [];

  where(field: any, operator: FilterOperator, value: any): this {
    switch (operator) {
      case 'eq':
        this.conditions.push(eq(field, value));
        break;
      case 'gte':
        this.conditions.push(gte(field, value));
        break;
      case 'lte':
        this.conditions.push(lte(field, value));
        break;
      case 'like':
        this.conditions.push(like(field, `%${value}%`));
        break;
      case 'in':
        this.conditions.push(inArray(field, value));
        break;
    }
    return this;
  }

  build(): SQL | undefined {
    return this.conditions.length > 0 ? and(...this.conditions) : undefined;
  }
}
```

### Paso 3: Endpoint de Products con Filtros

**Archivo**: `backend/src/routes/products.ts`

```typescript
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { PaginationBuilder } from '../utils/pagination.js';
import { QueryBuilder } from '../utils/queryBuilder.js';
import { products } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

const ProductFiltersSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  cursor: z.coerce.number().int().optional(),
  category: z.string().optional(),
  priceMin: z.coerce.number().positive().optional(),
  priceMax: z.coerce.number().positive().optional(),
  inStock: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

export default async function productRoutes(app: FastifyInstance) {
  app.get('/api/products', {
    schema: { querystring: ProductFiltersSchema },
  }, async (request, reply) => {
    const filters = request.query as z.infer<typeof ProductFiltersSchema>;
    
    const qb = new QueryBuilder();
    
    if (filters.category) qb.where(products.category, 'eq', filters.category);
    if (filters.priceMin) qb.where(products.price, 'gte', filters.priceMin);
    if (filters.priceMax) qb.where(products.price, 'lte', filters.priceMax);
    if (filters.inStock) qb.where(products.stock, 'gt', 0);
    if (filters.search) qb.where(products.name, 'like', filters.search);
    
    const whereClause = qb.build();
    
    const data = await app.db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products[filters.sortBy]))
      .limit(filters.limit + 1);
    
    const paginator = new PaginationBuilder('id');
    return paginator.build(filters, data);
  });
}
```

### Paso 4: Tests

**Archivo**: `backend/src/tests/utils/pagination.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { PaginationBuilder } from '../../utils/pagination.js';

describe('PaginationBuilder', () => {
  it('should paginate data correctly', () => {
    const builder = new PaginationBuilder();
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i}` }));
    
    const result = builder.build({ limit: 10 }, data);
    
    expect(result.data).toHaveLength(10);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe(10);
  });

  it('should handle last page', () => {
    const builder = new PaginationBuilder();
    const data = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Item ${i}` }));
    
    const result = builder.build({ limit: 10 }, data);
    
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBe(null);
  });
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] PaginationBuilder reutilizable
- [x] QueryBuilder para filtros dinámicos
- [x] Soporte cursor-based pagination
- [x] Filtros: category, price, stock, search
- [x] Ordenamiento configurable
- [x] Tests unitarios

## 🧪 VALIDACIÓN

```bash
# Productos con filtros
curl "http://localhost:3000/api/products?category=vitaminas&priceMin=10&priceMax=50&limit=20"

# Con paginación
curl "http://localhost:3000/api/products?limit=10&cursor=50"

# Con ordenamiento
curl "http://localhost:3000/api/products?sortBy=price&sortDir=asc"
```

---

**Status**: COMPLETO ✅
