/**
 * Archivo de esquemas de validación usando Zod.
 * Propósito: Definir y exportar esquemas de validación para formularios y datos de la aplicación.
 * Lógica: Usa la librería Zod para crear validaciones tipadas y reutilizables.
 * Entradas: Ninguna (define esquemas).
 * Salidas: Esquemas de validación y tipos inferidos.
 * Dependencias: Librería Zod.
 * Efectos secundarios: Ninguno.
 */

import { z } from 'zod';

/**
 * Esquema de validación para datos de usuarios.
 * Propósito: Validar información de registro y perfil de usuarios.
 * Lógica: Define reglas de validación para email, contraseña, nombres y teléfono.
 * Entradas: Objeto con campos de usuario.
 * Salidas: Objeto validado o error de validación.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const userSchema = z.object({
  email: z
    .string()
    .email('Por favor, ingresa un correo electrónico válido')
    .max(100, 'El correo electrónico no puede exceder los 100 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder los 128 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(
      /[^A-Za-z0-9]/,
      'La contraseña debe contener al menos un carácter especial'
    ),
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .regex(
      /^[a-zA-Z\s]+$/,
      'El apellido solo puede contener letras y espacios'
    ),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      'Por favor, ingresa un número de teléfono válido'
    )
    .optional(),
});

/**
 * Esquema de validación para datos de productos.
 * Propósito: Validar información de productos para creación/edición.
 * Lógica: Define reglas de validación para nombre, descripción, precio, stock, categoría, marca y SKU.
 * Entradas: Objeto con campos de producto.
 * Salidas: Objeto validado o error de validación.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre del producto debe tener al menos 2 caracteres')
    .max(100, 'El nombre del producto no puede exceder los 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder los 1000 caracteres'),
  price: z
    .number()
    .positive('El precio debe ser mayor a 0')
    .max(999999.99, 'El precio no puede exceder los 999,999.99'),
  stock: z
    .number()
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .max(99999, 'El stock no puede exceder los 99,999'),
  category: z
    .string()
    .min(2, 'La categoría debe tener al menos 2 caracteres')
    .max(50, 'La categoría no puede exceder los 50 caracteres'),
  brand: z
    .string()
    .max(50, 'La marca no puede exceder los 50 caracteres')
    .optional(),
  sku: z
    .string()
    .regex(
      /^[A-Z0-9-]+$/,
      'El SKU solo puede contener letras mayúsculas, números y guiones'
    )
    .max(20, 'El SKU no puede exceder los 20 caracteres')
    .optional(),
});

/**
 * Esquema de validación para formularios de contacto extendidos.
 * Propósito: Validar formularios de contacto con campos adicionales como asunto.
 * Lógica: Define reglas para nombre, email, asunto, mensaje y teléfono opcional.
 * Entradas: Objeto con campos del formulario de contacto.
 * Salidas: Objeto validado o error de validación.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z
    .string()
    .email('Por favor, ingresa un correo electrónico válido')
    .max(100, 'El correo electrónico no puede exceder los 100 caracteres'),
  subject: z
    .string()
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'El asunto no puede exceder los 200 caracteres'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder los 2000 caracteres'),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      'Por favor, ingresa un número de teléfono válido'
    )
    .optional(),
});

/**
 * Esquema de validación para suscripción al newsletter.
 * Propósito: Validar datos para suscripción al boletín informativo.
 * Lógica: Requiere email válido y nombre opcional.
 * Entradas: Objeto con email y nombre opcional.
 * Salidas: Objeto validado o error de validación.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Por favor, ingresa un correo electrónico válido')
    .max(100, 'El correo electrónico no puede exceder los 100 caracteres'),
  name: z
    .string()
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .optional(),
});

/**
 * Esquema de validación para reseñas de productos.
 * Propósito: Validar reseñas y calificaciones de usuarios.
 * Lógica: Define reglas para calificación (1-5), comentario y nombre del usuario.
 * Entradas: Objeto con rating, comment y userName.
 * Salidas: Objeto validado o error de validación.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Por favor, selecciona una calificación')
    .max(5, 'La calificación máxima es 5'),
  comment: z
    .string()
    .min(10, 'La reseña debe tener al menos 10 caracteres')
    .max(500, 'La reseña no puede exceder los 500 caracteres'),
  userName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
});

/**
 * Esquema de validación para formulario de contacto básico.
 * Propósito: Validar formularios de contacto simples.
 * Lógica: Requiere nombre, email y mensaje con validaciones básicas.
 * Entradas: Objeto con name, email y message.
 * Salidas: Objeto validado o error de validación.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  email: z.string().email('Por favor, ingresa un correo electrónico válido'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder los 1000 caracteres'),
});

/**
 * Esquema de validación para proceso de checkout.
 * Propósito: Validar información de envío y facturación durante el checkout.
 * Lógica: Incluye datos personales, contacto y dirección completa.
 * Entradas: Objeto con datos personales y dirección.
 * Salidas: Objeto validado o error de validación.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres'),
  email: z.string().email('Por favor, ingresa un correo electrónico válido'),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      'Por favor, ingresa un número de teléfono válido'
    ),
  address: z.object({
    street: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    state: z
      .string()
      .min(2, 'La provincia/estado debe tener al menos 2 caracteres'),
    zipCode: z
      .string()
      .regex(/^\d{5}$/, 'El código postal debe tener 5 dígitos'),
  }),
});

/**
 * Tipos TypeScript inferidos de los esquemas de validación.
 * Propósito: Proporcionar tipos tipados automáticamente basados en los esquemas Zod.
 * Lógica: Usa z.infer para extraer tipos de los esquemas definidos.
 * Entradas: Ninguna (tipos generados).
 * Salidas: Tipos TypeScript para uso en componentes.
 * Dependencias: Zod y esquemas definidos arriba.
 * Efectos secundarios: Ninguno.
 */
export type UserData = z.infer<typeof userSchema>;
export type ProductData = z.infer<typeof productSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

/**
 * Validadores reutilizables para campos comunes.
 * Propósito: Proporcionar validadores preconstruidos para uso en múltiples formularios.
 * Lógica: Define validadores comunes como contraseña, teléfono, URL y fecha.
 * Entradas: Valores de campos individuales.
 * Salidas: Validadores Zod configurados.
 * Dependencias: Zod.
 * Efectos secundarios: Ninguno.
 */
export const validators = {
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(
      /[^A-Za-z0-9]/,
      'La contraseña debe contener al menos un carácter especial'
    ),

  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      'Por favor, ingresa un número de teléfono válido'
    ),

  url: z.string().url('Por favor, ingresa una URL válida'),

  date: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Por favor, ingresa una fecha válida (YYYY-MM-DD)'
    ),
};
