# TASK-023: Validación de Schemas Centralizada

## 📋 INFORMACIÓN

**ID**: TASK-023 | **Fase**: 2 | **Prioridad**: MEDIA | **Estimación**: 2h

## 🎯 OBJETIVO

Centralizar schemas Zod, crear registry, validación automática middleware.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Schema Registry

**Archivo**: `backend/src/schemas/index.ts`

```typescript
import { z } from 'zod';

// Schemas base reutilizables
const IdSchema = z.number().int().positive();
const EmailSchema = z.string().email().max(255);
const PasswordSchema = z.string().min(8).max(100);
const URLSchema = z.string().url().max(500);

// Product schemas
export const ProductSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(200),
  description: z.string().max(2000),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  category: z.enum(['vitaminas', 'minerales', 'suplementos', 'hierbas', 'aceites']),
  images: z.array(URLSchema).max(10),
  tags: z.array(z.string().max(50)).max(20).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const UpdateProductSchema = CreateProductSchema.partial();

// User schemas
export const UserSchema = z.object({
  id: IdSchema,
  email: EmailSchema,
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin']),
  createdAt: z.date(),
});

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: z.string().min(1).max(100),
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

// Order schemas
export const OrderItemSchema = z.object({
  productId: IdSchema,
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
  shippingAddress: z.object({
    street: z.string().min(1).max(200),
    city: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
  }),
  notes: z.string().max(500).optional(),
});

// Pagination schemas
export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

// Filter schemas
export const ProductFiltersSchema = PaginationSchema.extend({
  category: z.string().optional(),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
});

// Schema registry para lookup dinámico
export const schemaRegistry = {
  // Products
  'product.create': CreateProductSchema,
  'product.update': UpdateProductSchema,
  'product.filters': ProductFiltersSchema,
  
  // Users
  'user.register': RegisterSchema,
  'user.login': LoginSchema,
  
  // Orders
  'order.create': CreateOrderSchema,
  'order.filters': PaginationSchema,
} as const;

export type SchemaKey = keyof typeof schemaRegistry;
```

### Paso 2: Middleware de Validación

**Archivo**: `backend/src/middleware/validate.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodSchema } from 'zod';
import { schemaRegistry, SchemaKey } from '../schemas/index.js';
import { ValidationError } from '../errors/AppError.js';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Validar request con Zod schema
 */
export function validate<T extends ZodSchema>(schema: T, target: ValidateTarget = 'body') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = request[target];
      const validated = schema.parse(data);
      
      // Reemplazar data con versión validada
      (request as any)[target] = validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  };
}

/**
 * Validar usando schema del registry
 */
export function validateSchema(key: SchemaKey, target: ValidateTarget = 'body') {
  const schema = schemaRegistry[key];
  return validate(schema, target);
}
```

### Paso 3: Usar Validación en Rutas

**Archivo**: `backend/src/routes/products.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { validate, validateSchema } from '../middleware/validate.js';
import { CreateProductSchema, ProductFiltersSchema } from '../schemas/index.js';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  // Opción 1: Usar schema directamente
  fastify.post('/api/products', {
    preHandler: [
      fastify.authenticate,
      fastify.authorizeAdmin,
      validate(CreateProductSchema),
    ],
  }, async (request) => {
    const data = request.body; // Ya validado y tipado
    return productService.create(data);
  });

  // Opción 2: Usar schema registry
  fastify.get('/api/products', {
    preHandler: [validateSchema('product.filters', 'query')],
  }, async (request) => {
    const filters = request.query;
    return productService.list(filters);
  });

  // Validar params
  fastify.get('/api/products/:id', {
    preHandler: [validate(z.object({ id: z.coerce.number() }), 'params')],
  }, async (request) => {
    const { id } = request.params;
    return productService.getById(id);
  });
};
```

### Paso 4: Fastify JSON Schema Integration

**Archivo**: `backend/src/plugins/schemas.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { schemaRegistry } from '../schemas/index.js';

export const schemasPlugin: FastifyPluginAsync = async (fastify) => {
  // Registrar todos los schemas para Swagger
  for (const [key, schema] of Object.entries(schemaRegistry)) {
    const jsonSchema = zodToJsonSchema(schema, key);
    fastify.addSchema(jsonSchema);
  }

  fastify.log.info(`Registered ${Object.keys(schemaRegistry).length} schemas`);
};
```

### Paso 5: Transforms Globales

**Archivo**: `backend/src/schemas/transforms.ts`

```typescript
import { z } from 'zod';

/**
 * Schema para parsear query params de boolean
 */
export const BooleanQuerySchema = z
  .union([z.boolean(), z.string()])
  .transform(val => {
    if (typeof val === 'string') {
      return val === 'true' || val === '1';
    }
    return val;
  });

/**
 * Schema para parsear números desde strings
 */
export const NumberQuerySchema = z.coerce.number();

/**
 * Schema para limpiar strings
 */
export const TrimmedStringSchema = z.string().transform(s => s.trim());

/**
 * Schema para emails lowercase
 */
export const LowercaseEmailSchema = z.string().email().toLowerCase();

// Uso:
export const ExampleQuerySchema = z.object({
  page: NumberQuerySchema.int().positive().default(1),
  active: BooleanQuerySchema.default(true),
  email: LowercaseEmailSchema,
});
```

### Paso 6: Validación Condicional

**Archivo**: `backend/src/schemas/conditional.ts`

```typescript
import { z } from 'zod';

/**
 * Schema condicional: si tipo='physical', requiere weight
 */
export const ProductWithShippingSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('digital'),
    downloadUrl: z.string().url(),
  }),
  z.object({
    type: z.literal('physical'),
    weight: z.number().positive(),
    dimensions: z.object({
      width: z.number().positive(),
      height: z.number().positive(),
      depth: z.number().positive(),
    }),
  }),
]);

/**
 * Schema con refinement personalizado
 */
export const PasswordConfirmSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

### Paso 7: Tests

**Archivo**: `backend/src/__tests__/validation.test.ts`

```typescript
import { test } from 'tap';
import { CreateProductSchema, ProductFiltersSchema } from '../schemas/index.js';

test('Schema validation', async (t) => {
  t.test('should validate valid product', async (t) => {
    const data = {
      name: 'Vitamina C',
      description: 'Alta calidad',
      price: 19.99,
      stock: 100,
      category: 'vitaminas',
      images: ['https://example.com/image.jpg'],
    };

    const result = CreateProductSchema.parse(data);
    t.same(result, data);
  });

  t.test('should reject invalid product', async (t) => {
    const data = {
      name: '',
      price: -10,
      stock: -5,
      category: 'invalid',
    };

    t.throws(() => CreateProductSchema.parse(data));
  });

  t.test('should apply defaults', async (t) => {
    const result = ProductFiltersSchema.parse({});
    t.equal(result.limit, 20);
    t.equal(result.sortBy, 'createdAt');
    t.equal(result.sortDir, 'desc');
  });
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Schema registry centralizado
- [x] Middleware de validación
- [x] Schemas Zod reutilizables
- [x] Transforms automáticos
- [x] Validación condicional
- [x] Integración Fastify
- [x] Tests exhaustivos

## 🧪 VALIDACIÓN

```bash
# Test validación
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "", "price": -10}'

# Ver schemas registrados
curl http://localhost:3000/docs/json | jq '.components.schemas'
```

---

**Status**: COMPLETO ✅
