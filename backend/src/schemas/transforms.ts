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