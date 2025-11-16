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
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

// Filter schemas
export const ProductFiltersSchema = PaginationSchema.extend({
  category: z.string().optional(),
  priceMin: z.coerce.number().positive().optional(),
  priceMax: z.coerce.number().positive().optional(),
  inStock: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  q: z.string().max(100).optional(), // Nueva propiedad para búsquedas
  page: z.coerce.number().int().min(1).optional(), // Nueva propiedad para paginación
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