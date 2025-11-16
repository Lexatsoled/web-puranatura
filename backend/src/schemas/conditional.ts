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