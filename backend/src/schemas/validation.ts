import { z } from 'zod';
import validator from 'validator';
import { orderStatusEnum } from '../db/schema/orders';

const sanitizeString = (value: string) => validator.escape(validator.trim(value ?? ''));

const stripHtml = (input: string) =>
  validator.stripLow(
    input
      .replace(/<[^>]*>/g, ' ')
      .replace(/&lt;[^&]*&gt;/g, ' ')
      .replace(/&#x2F;/gi, ' ')
      .replace(/&[\w#]+;/g, ' '),
    true,
  );

const stringField = (label: string, min = 1, max = 255) =>
  z
    .string({ required_error: `${label} es requerido` })
    .trim()
    .min(min, `${label} debe tener al menos ${min} caracteres`)
    .max(max, `${label} supera el máximo permitido (${max})`)
    .transform((val) =>
      sanitizeString(stripHtml(val))
        .replace(/\s+/g, ' ')
        .trim(),
    );

const optionalStringField = (label: string, max = 255) =>
  z
    .string()
    .trim()
    .max(max, `${label} supera el máximo permitido (${max})`)
    .transform((val) => (val ? sanitizeString(val) : ''))
    .optional()
    .transform((val) => (val ? val : undefined));

const emailField = z
  .string({ required_error: 'Email requerido' })
  .trim()
  .email('Email inválido')
  .transform((val) => {
    const normalized = validator.normalizeEmail(val);
    return normalized ? normalized : sanitizeString(val);
  });

const booleanFromString = z
  .union([z.string(), z.boolean()])
  .transform((val) => (typeof val === 'boolean' ? val : val.toLowerCase() === 'true'));

const numberFromQuery = (label: string, min: number, max: number, fallback: number) =>
  z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'number' ? val : Number.parseInt(val, 10)))
    .refine((val) => !Number.isNaN(val), { message: `${label} debe ser numérico` })
    .transform((val) => Math.max(min, Math.min(max, val)))
    .optional()
    .transform((val) => val ?? fallback);

const optionalNumberFromQuery = (label: string, min: number, max: number) =>
  z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'number' ? val : Number.parseFloat(val)))
    .refine((val) => !Number.isNaN(val), { message: `${label} debe ser numerico` })
    .refine((val) => val >= min, { message: `${label} debe ser mayor o igual a ${min}` })
    .refine((val) => val <= max, { message: `${label} supera el maximo permitido (${max})` })
    .optional();

export const signupSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir una mayúscula')
    .regex(/[0-9]/, 'Debe incluir un número')
    .transform((val) => val.trim()),
  name: stringField('Nombre', 2, 100),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Contraseña requerida'),
});

export const productListQuerySchema = z.object({
  category: optionalStringField('Categor�a', 120),
  search: optionalStringField('B�squeda', 200),
  featured: booleanFromString.optional(),
  limit: numberFromQuery('limit', 1, 100, 20),
  page: numberFromQuery('page', 1, 500, 1),
  cursor: optionalStringField('Cursor', 200),
  priceMin: optionalNumberFromQuery('priceMin', 0, 100000),
  priceMax: optionalNumberFromQuery('priceMax', 0, 100000),
  inStock: booleanFromString.optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

export const productSearchQuerySchema = z.object({
  q: stringField('Query', 1, 200),
  limit: numberFromQuery('limit', 1, 50, 20),
});

export const searchQuerySchema = z.object({
  q: stringField('Busqueda', 1, 200),
  limit: numberFromQuery('limit', 1, 50, 20),
  offset: numberFromQuery('offset', 0, 10000, 0),
  category: optionalStringField('Categoria', 120),
  priceMin: optionalNumberFromQuery('priceMin', 0, 100000),
  priceMax: optionalNumberFromQuery('priceMax', 0, 100000),
  inStock: booleanFromString.optional(),
});

export const searchSuggestQuerySchema = z.object({
  q: stringField('Busqueda', 1, 120),
  limit: numberFromQuery('limit', 1, 20, 5),
});

export const idParamSchema = z.object({
  id: stringField('ID', 1, 120),
});

export const categoryParamSchema = z.object({
  category: stringField('Categoría', 1, 120),
});

export const systemParamSchema = z.object({
  systemId: stringField('Sistema', 1, 120),
});

export const orderParamSchema = z.object({
  orderId: stringField('Orden', 1, 120),
});

const addressSchema = z.object({
  firstName: stringField('Nombre', 1, 100),
  lastName: stringField('Apellido', 1, 100),
  company: optionalStringField('Empresa', 120),
  street: stringField('Calle', 1, 120),
  apartment: optionalStringField('Apartamento', 120),
  city: stringField('Ciudad', 1, 120),
  state: stringField('Estado/Provincia', 1, 120),
  postalCode: stringField('Código Postal', 1, 30),
  country: stringField('País', 1, 80),
  phone: z.string().min(6).max(30).transform((val) => validator.whitelist(val, '+0-9 ()-')),
});

const paymentMethodSchema = z.object({
  type: z.enum(['credit_card', 'debit_card', 'bank_transfer', 'cash_on_delivery']),
});

const moneySchema = z.number().nonnegative();

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: stringField('ID de producto', 1, 64),
        productName: stringField('Nombre de producto', 1, 200),
        productImage: optionalStringField('Imagen'),
        variantId: optionalStringField('ID de variante'),
        variantName: optionalStringField('Nombre de variante'),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  shippingAddress: addressSchema,
  paymentMethod: paymentMethodSchema,
  orderNotes: optionalStringField('Notas', 500),
  summary: z.object({
    subtotal: moneySchema,
    shipping: moneySchema,
    tax: moneySchema,
    discount: moneySchema.optional(),
    total: z.number().positive(),
  }),
});

const isoDateField = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), { message: 'Fecha invalida' })
  .transform((val) => new Date(val));

export const orderListQuerySchema = z.object({
  cursor: optionalStringField('Cursor', 200),
  limit: numberFromQuery('limit', 1, 50, 20),
  status: z.enum(orderStatusEnum).optional(),
  search: optionalStringField('Busqueda', 200),
  from: isoDateField.optional(),
  to: isoDateField.optional(),
  userId: optionalStringField('Usuario', 120),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(orderStatusEnum, {
    required_error: 'Estado requerido',
  }),
  trackingNumber: optionalStringField('Tracking', 120),
  adminNotes: optionalStringField('Notas de admin', 500),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchSuggestQuery = z.infer<typeof searchSuggestQuerySchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
