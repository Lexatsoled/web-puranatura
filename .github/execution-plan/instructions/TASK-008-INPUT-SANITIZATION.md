# TASK-008: Sanitización Completa de Input/Output

**PRIORIDAD:** CRÍTICA  
**FASE:** 1 - Seguridad  
**DEPENDENCIAS:** Ninguna  
**TIEMPO ESTIMADO:** 4-5 horas

---

## CONTEXTO

El código actual NO sanitiza consistentemente inputs de usuario ni outputs antes de renderizar HTML. Esto expone a:

- **XSS (Cross-Site Scripting):** Inyección de JavaScript malicioso
- **HTML Injection:** Alteración de estructura de página
- **SQL Injection:** (mitigado por ORM, pero validar igualmente)

**HALLAZGO RELACIONADO:** SEC-INPUT-005 - Sanitización inconsistente

**RIESGO:** Usuario malicioso puede inyectar código JavaScript que roba sesiones, cookies, o datos sensibles.

---

## OBJETIVO

Implementar sanitización robusta de:

1. **Inputs de usuario** (formularios, queries, headers)
2. **Outputs HTML** (renderizado React)
3. **Queries de base de datos** (validación adicional a ORM)
4. **Validación de schemas** (Zod para runtime validation)

---

## INSTRUCCIONES DETALLADAS

### PASO 1: Instalar Dependencias

```bash
# Frontend
npm install dompurify zod
npm install --save-dev @types/dompurify

# Backend
cd backend
npm install zod validator
npm install --save-dev @types/validator
```

---

### PASO 2: Crear Utility de Sanitización (Frontend)

**Archivo:** `src/utils/sanitizer.ts` (crear)

```typescript
import DOMPurify from 'dompurify';

/**
 * Configuración de DOMPurify
 */
const config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
};

/**
 * Sanitizar HTML para prevenir XSS
 * 
 * Usa DOMPurify para limpiar HTML malicioso.
 * 
 * @example
 * ```ts
 * const userInput = '<img src=x onerror=alert(1)>';
 * const safe = sanitizeHtml(userInput);
 * // safe = '<img src="x">' (sin onerror)
 * ```
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, config);
}

/**
 * Sanitizar para uso como texto plano
 * 
 * Elimina TODOS los tags HTML.
 * 
 * @example
 * ```ts
 * const userInput = '<script>alert(1)</script>Hello';
 * const safe = sanitizeText(userInput);
 * // safe = 'Hello'
 * ```
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
}

/**
 * Sanitizar URL para prevenir javascript: protocol
 * 
 * @example
 * ```ts
 * const userUrl = 'javascript:alert(1)';
 * const safe = sanitizeUrl(userUrl);
 * // safe = 'about:blank'
 * ```
 */
export function sanitizeUrl(url: string): string {
  const cleanUrl = url.trim().toLowerCase();

  // Lista negra de protocolos peligrosos
  const dangerousProtocols = [
    'javascript:',
    'data:text/html',
    'vbscript:',
    'file:',
  ];

  if (dangerousProtocols.some(protocol => cleanUrl.startsWith(protocol))) {
    return 'about:blank';
  }

  // Solo permitir http, https, mailto
  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('mailto:') ||
    cleanUrl.startsWith('/') // Rutas relativas
  ) {
    return DOMPurify.sanitize(url, { ALLOWED_TAGS: [] });
  }

  return 'about:blank';
}

/**
 * Escapar caracteres para uso en attributes HTML
 * 
 * @example
 * ```ts
 * const userInput = '" onclick="alert(1)';
 * const safe = escapeHtmlAttribute(userInput);
 * // safe = '&quot; onclick=&quot;alert(1)'
 * ```
 */
export function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Validar y sanitizar email
 */
export function sanitizeEmail(email: string): string {
  const cleaned = email.trim().toLowerCase();
  
  // Regex básico de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }

  return cleaned;
}

/**
 * Sanitizar nombre de usuario
 * 
 * Solo permite alfanuméricos, guiones y underscores.
 */
export function sanitizeUsername(username: string): string {
  const cleaned = username.trim();
  
  // Solo permitir caracteres seguros
  const safeUsername = cleaned.replace(/[^a-zA-Z0-9_-]/g, '');
  
  if (safeUsername.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }

  if (safeUsername.length > 30) {
    throw new Error('Username must be at most 30 characters');
  }

  return safeUsername;
}

/**
 * Sanitizar número de teléfono
 */
export function sanitizePhone(phone: string): string {
  // Eliminar todo excepto dígitos, +, -, (, )
  const cleaned = phone.replace(/[^\d+\-()]/g, '');
  
  return cleaned;
}
```

---

### PASO 3: Crear Schemas de Validación con Zod (Backend)

**Archivo:** `backend/src/schemas/validation.ts` (crear)

```typescript
import { z } from 'zod';

/**
 * Schemas de validación con Zod
 * 
 * Valida y sanitiza inputs en runtime.
 */

// Usuario
export const createUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim()
    .max(255, 'Email too long'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name contains invalid characters'),
  
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone format')
    .optional(),
});

// Login
export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password required'),
});

// Producto
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name too long'),
  
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description too long'),
  
  price: z
    .number()
    .positive('Price must be positive')
    .max(1000000, 'Price too high'),
  
  stock: z
    .number()
    .int('Stock must be integer')
    .nonnegative('Stock cannot be negative'),
  
  category: z
    .string()
    .trim()
    .min(2)
    .max(100),
  
  images: z
    .array(z.string().url('Invalid image URL'))
    .max(10, 'Too many images'),
});

// Order
export const createOrderSchema = z.object({
  items: z
    .array(z.object({
      productId: z.string().uuid('Invalid product ID'),
      quantity: z.number().int().positive().max(100, 'Quantity too large'),
    }))
    .min(1, 'Order must have at least one item')
    .max(50, 'Too many items in order'),
  
  shippingAddress: z.object({
    street: z.string().trim().min(5).max(200),
    city: z.string().trim().min(2).max(100),
    postalCode: z.string().trim().regex(/^\d{5}$/, 'Invalid postal code'),
    country: z.string().trim().length(2, 'Country must be 2-letter code'),
  }),
  
  notes: z
    .string()
    .trim()
    .max(500, 'Notes too long')
    .optional(),
});

// Comentario/Review
export const createReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment too long')
    .refine(
      (val) => !/<script|javascript:|onerror/i.test(val),
      'Comment contains forbidden content'
    ),
});

// Query params
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive())
    .default('1'),
  
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive().max(100))
    .default('20'),
});

export const searchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, 'Search query too short')
    .max(200, 'Search query too long')
    .transform((val) => val.replace(/[<>'"]/g, '')), // Eliminar chars peligrosos
  
  category: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});
```

---

### PASO 4: Crear Middleware de Validación

**Archivo:** `backend/src/middleware/validate.ts` (crear)

```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ZodSchema } from 'zod';

/**
 * Middleware para validar request con schema Zod
 * 
 * @example
 * ```ts
 * app.post('/users', {
 *   preHandler: validate(createUserSchema),
 * }, async (req, reply) => {
 *   // req.body es typed y validado
 * });
 * ```
 */
export function validate(schema: ZodSchema) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validar y transformar body
      req.body = schema.parse(req.body);
    } catch (err: any) {
      return reply.code(400).send({
        error: 'Validation failed',
        details: err.errors?.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        })) || [],
      });
    }
  };
}

/**
 * Validar query params
 */
export function validateQuery(schema: ZodSchema) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      req.query = schema.parse(req.query);
    } catch (err: any) {
      return reply.code(400).send({
        error: 'Invalid query parameters',
        details: err.errors,
      });
    }
  };
}

/**
 * Validar params de URL
 */
export function validateParams(schema: ZodSchema) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      req.params = schema.parse(req.params);
    } catch (err: any) {
      return reply.code(400).send({
        error: 'Invalid URL parameters',
        details: err.errors,
      });
    }
  };
}
```

---

### PASO 5: Aplicar Validación a Rutas

**Archivo:** `backend/src/routes/auth.ts` (modificar)

```typescript
import { validate } from '../middleware/validate';
import { loginSchema, createUserSchema } from '../schemas/validation';

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    '/login',
    {
      preHandler: [validate(loginSchema)],
    },
    async (req, reply) => {
      // req.body ya está validado y sanitizado
      const { email, password } = req.body;
      
      // ... lógica de login ...
    }
  );

  app.post(
    '/register',
    {
      preHandler: [validate(createUserSchema)],
    },
    async (req, reply) => {
      const { email, password, name, phone } = req.body;
      
      // ... lógica de registro ...
    }
  );
}
```

**Archivo:** `backend/src/routes/products.ts` (modificar)

```typescript
import { validate, validateQuery } from '../middleware/validate';
import { createProductSchema, searchQuerySchema } from '../schemas/validation';

export default async function productsRoutes(app: FastifyInstance) {
  app.get(
    '/products',
    {
      preHandler: [validateQuery(searchQuerySchema)],
    },
    async (req, reply) => {
      const { q, category, minPrice, maxPrice } = req.query;
      
      // q ya está sanitizado (sin <, >, ', ")
      const products = await searchProducts(q, { category, minPrice, maxPrice });
      
      return { products };
    }
  );

  app.post(
    '/products',
    {
      preHandler: [authenticateUser, validate(createProductSchema)],
    },
    async (req, reply) => {
      const productData = req.body;
      
      // Validado: name, description, price, etc.
      const product = await createProduct(productData);
      
      return { product };
    }
  );
}
```

---

### PASO 6: Sanitizar Output en Frontend

**Archivo:** `src/components/ProductCard.tsx` (ejemplo)

```tsx
import { sanitizeHtml, sanitizeUrl } from '../utils/sanitizer';

interface ProductCardProps {
  product: {
    name: string;
    description: string;
    image: string;
    price: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  // Sanitizar descripción si viene de usuario
  const safeDescription = sanitizeHtml(product.description);
  
  // Sanitizar URL de imagen
  const safeImageUrl = sanitizeUrl(product.image);

  return (
    <div className="product-card">
      <img src={safeImageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      
      {/* Usar dangerouslySetInnerHTML solo con HTML sanitizado */}
      <div 
        className="description"
        dangerouslySetInnerHTML={{ __html: safeDescription }}
      />
      
      <p className="price">${product.price}</p>
    </div>
  );
}
```

**Mejor práctica:** Evitar `dangerouslySetInnerHTML` siempre que sea posible:

```tsx
// PREFERIDO: Texto plano
import { sanitizeText } from '../utils/sanitizer';

export function ProductCard({ product }: ProductCardProps) {
  const safeDescription = sanitizeText(product.description);

  return (
    <div className="product-card">
      <p className="description">{safeDescription}</p>
    </div>
  );
}
```

---

### PASO 7: Crear Hook de Sanitización

**Archivo:** `src/hooks/useSanitizedInput.ts` (crear)

```typescript
import { useState, useCallback } from 'react';
import { sanitizeText } from '../utils/sanitizer';

/**
 * Hook para inputs con sanitización automática
 */
export function useSanitizedInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const sanitized = sanitizeText(e.target.value);
    setValue(sanitized);
  }, []);

  const reset = useCallback(() => {
    setValue('');
  }, []);

  return { value, onChange: handleChange, reset };
}

/**
 * Ejemplo de uso:
 * 
 * ```tsx
 * function CommentForm() {
 *   const comment = useSanitizedInput();
 * 
 *   const handleSubmit = () => {
 *     api.post('/comments', { text: comment.value });
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <textarea {...comment} placeholder="Tu comentario" />
 *       <button type="submit">Enviar</button>
 *     </form>
 *   );
 * }
 * ```
 */
```

---

### PASO 8: Validar Queries SQL (Defensa en Profundidad)

Aunque Drizzle ORM previene SQL injection, añadir validación adicional:

**Archivo:** `backend/src/db/helpers.ts` (crear)

```typescript
import validator from 'validator';

/**
 * Validar UUID antes de usar en query
 */
export function validateUuid(id: string): string {
  if (!validator.isUUID(id)) {
    throw new Error('Invalid UUID format');
  }
  return id;
}

/**
 * Validar que string no contiene SQL keywords peligrosos
 */
export function validateSearchTerm(term: string): string {
  const dangerous = /(\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|--|;|\/\*|\*\/)/i;
  
  if (dangerous.test(term)) {
    throw new Error('Search term contains forbidden characters');
  }

  return term.trim();
}

/**
 * Ejemplo de uso:
 * 
 * ```ts
 * const productId = validateUuid(req.params.id);
 * const product = await db.query.products.findFirst({
 *   where: eq(products.id, productId)
 * });
 * ```
 */
```

---

### PASO 9: Crear Tests de Sanitización

**Archivo:** `src/utils/__tests__/sanitizer.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText, sanitizeUrl, sanitizeEmail } from '../sanitizer';

describe('Sanitizer', () => {
  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const dirty = '<script>alert(1)</script>Hello';
      const clean = sanitizeHtml(dirty);
      expect(clean).toBe('Hello');
    });

    it('should remove event handlers', () => {
      const dirty = '<img src=x onerror=alert(1)>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('onerror');
    });

    it('should allow safe tags', () => {
      const dirty = '<p><strong>Bold</strong> text</p>';
      const clean = sanitizeHtml(dirty);
      expect(clean).toBe('<p><strong>Bold</strong> text</p>');
    });
  });

  describe('sanitizeText', () => {
    it('should remove all HTML', () => {
      const dirty = '<p>Hello <strong>world</strong></p>';
      const clean = sanitizeText(dirty);
      expect(clean).toBe('Hello world');
    });
  });

  describe('sanitizeUrl', () => {
    it('should block javascript: URLs', () => {
      const dirty = 'javascript:alert(1)';
      const clean = sanitizeUrl(dirty);
      expect(clean).toBe('about:blank');
    });

    it('should allow https URLs', () => {
      const dirty = 'https://example.com';
      const clean = sanitizeUrl(dirty);
      expect(clean).toBe('https://example.com');
    });
  });

  describe('sanitizeEmail', () => {
    it('should trim and lowercase email', () => {
      const dirty = '  USER@EXAMPLE.COM  ';
      const clean = sanitizeEmail(dirty);
      expect(clean).toBe('user@example.com');
    });

    it('should throw on invalid email', () => {
      expect(() => sanitizeEmail('not-an-email')).toThrow();
    });
  });
});
```

**Ejecutar:**

```bash
npm run test -- sanitizer.test.ts
```

---

### PASO 10: Documentar Guías de Sanitización

**Archivo:** `docs/SANITIZATION_GUIDE.md` (crear)

```markdown
# Guía de Sanitización de Input/Output

## Principios

1. **Nunca confíes en input de usuario**
2. **Validar en backend Y frontend**
3. **Sanitizar antes de almacenar Y antes de renderizar**
4. **Usar listas blancas, no listas negras**

---

## Frontend

### Formularios

```tsx
import { useSanitizedInput } from '../hooks/useSanitizedInput';

function MyForm() {
  const name = useSanitizedInput();

  return (
    <input {...name} placeholder="Tu nombre" />
  );
}
```

### Renderizado de HTML

```tsx
import { sanitizeHtml } from '../utils/sanitizer';

// ❌ NUNCA hagas esto
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sanitiza primero
const safe = sanitizeHtml(userInput);
<div dangerouslySetInnerHTML={{ __html: safe }} />

// ✅✅ MEJOR: Evita dangerouslySetInnerHTML
const safeText = sanitizeText(userInput);
<div>{safeText}</div>
```

### URLs

```tsx
import { sanitizeUrl } from '../utils/sanitizer';

const safeUrl = sanitizeUrl(userProvidedUrl);
<a href={safeUrl}>Link</a>
```

---

## Backend

### Validación de Rutas

```ts
import { validate } from '../middleware/validate';
import { mySchema } from '../schemas/validation';

app.post('/endpoint', {
  preHandler: [validate(mySchema)],
}, async (req, reply) => {
  // req.body ya validado
});
```

### Schemas con Zod

```ts
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().toLowerCase(),
});
```

---

## Casos Comunes

### Búsqueda

```ts
// Backend
const searchSchema = z.object({
  q: z.string().trim().max(200)
    .transform(val => val.replace(/[<>'"]/g, ''))
});

// Frontend
const query = sanitizeText(userInput);
api.get(`/search?q=${encodeURIComponent(query)}`);
```

### Comentarios/Reviews

```ts
const reviewSchema = z.object({
  comment: z.string().trim().min(10).max(1000)
    .refine(val => !/<script/i.test(val), 'Forbidden content')
});
```

### File Uploads

```ts
const allowedExtensions = ['.jpg', '.png', '.webp'];
const ext = path.extname(filename).toLowerCase();

if (!allowedExtensions.includes(ext)) {
  throw new Error('Invalid file type');
}
```

---

## Checklist de Revisión

- [ ] Todos los inputs validados con Zod
- [ ] HTML sanitizado con DOMPurify
- [ ] URLs validadas antes de usar
- [ ] Queries SQL usan ORM (no raw queries)
- [ ] File uploads validan extensión
- [ ] Emails validados y normalizados
- [ ] Tests cubren casos maliciosos

---

*Consulta `src/utils/sanitizer.ts` y `backend/src/schemas/validation.ts` para más ejemplos.*
```

---

## VALIDACIÓN

### ✅ Criterios de Aceptación

1. **Frontend:**
   - [ ] DOMPurify instalado y configurado
   - [ ] Utilidades de sanitización creadas
   - [ ] Hook `useSanitizedInput` funcional
   - [ ] Componentes usan sanitización

2. **Backend:**
   - [ ] Zod schemas para todas las rutas
   - [ ] Middleware de validación aplicado
   - [ ] Queries DB con validación adicional

3. **Tests:**
   - [ ] Tests de sanitización pasando
   - [ ] Casos maliciosos cubiertos

4. **Documentación:**
   - [ ] Guía de sanitización completa
   - [ ] Ejemplos de uso claros

### 🧪 Tests de Validación

```bash
# Tests frontend
npm run test -- sanitizer.test.ts

# Test manual - XSS
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>Product"}' 
# Esperado: 400 Bad Request (validación falla)

# Test manual - SQL Injection (debería ser bloqueado por ORM)
curl http://localhost:3000/api/products?q="'; DROP TABLE products;--"
# Esperado: Sanitizado, sin impacto en DB
```

### 📊 Métricas de Éxito

- **Cobertura:** 100% inputs validados
- **Performance:** <1ms overhead por sanitización
- **Seguridad:** 0 vulnerabilidades XSS/injection

---

## NOTAS IMPORTANTES

### ⚠️ Avisos

1. **DOMPurify solo frontend:** No funciona en Node.js (usar isomorphic-dompurify si necesitas SSR)
2. **Zod performance:** Validaciones complejas pueden ser lentas (cachear schemas)
3. **False sense of security:** Sanitización NO reemplaza autenticación/autorización

### 🔗 Dependencias

- **Requiere:** React, Fastify
- **Habilita:** Protección contra XSS, injection attacks

### 📦 Entregables

- `src/utils/sanitizer.ts`
- `src/hooks/useSanitizedInput.ts`
- `backend/src/schemas/validation.ts`
- `backend/src/middleware/validate.ts`
- `backend/src/db/helpers.ts`
- `docs/SANITIZATION_GUIDE.md`

---

**FIN DE INSTRUCCIONES TASK-008**
