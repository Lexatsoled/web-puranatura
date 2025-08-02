import { z } from 'zod';

// Esquema de validación para el formulario de reseñas
export const reviewSchema = z.object({
  rating: z.number()
    .min(1, 'Por favor, selecciona una calificación')
    .max(5, 'La calificación máxima es 5'),
  comment: z.string()
    .min(10, 'La reseña debe tener al menos 10 caracteres')
    .max(500, 'La reseña no puede exceder los 500 caracteres'),
  userName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
});

// Esquema de validación para el formulario de contacto
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  email: z.string()
    .email('Por favor, ingresa un correo electrónico válido'),
  message: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder los 1000 caracteres'),
});

// Esquema de validación para el formulario de checkout
export const checkoutSchema = z.object({
  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres'),
  email: z.string()
    .email('Por favor, ingresa un correo electrónico válido'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Por favor, ingresa un número de teléfono válido'),
  address: z.object({
    street: z.string()
      .min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string()
      .min(2, 'La ciudad debe tener al menos 2 caracteres'),
    state: z.string()
      .min(2, 'La provincia/estado debe tener al menos 2 caracteres'),
    zipCode: z.string()
      .regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
  }),
});

// Tipos inferidos de los esquemas
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Validadores de campos comunes
export const validators = {
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Por favor, ingresa un número de teléfono válido'),
  
  url: z.string()
    .url('Por favor, ingresa una URL válida'),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Por favor, ingresa una fecha válida (YYYY-MM-DD)')
};
