/**
 * Archivo centralizado de exportaciones de tipos - Fuente única de verdad para todas las interfaces.
 * Propósito: Proporcionar un punto único de importación para todos los tipos de la aplicación.
 * Lógica: Reexporta tipos desde módulos específicos organizados por dominio.
 * Entradas: Ninguna (solo exportaciones).
 * Salidas: Tipos disponibles para importación en otros módulos.
 * Dependencias: Módulos de tipos específicos (product, cart, blog, services, system).
 * Efectos secundarios: Ninguno.
 */

// Tipos relacionados con productos
export type {
  Product,
  ProductImage,
  ProductSEO,
  ProductCategory,
  ProductFilters,
  SortOption,
} from './product';

// Tipos relacionados con el carrito de compras
export type { CartItem, Cart, CartContextType } from './cart';

// Tipos relacionados con el blog
export type { BlogPost, BlogFilters } from './blog';

// Tipos relacionados con servicios
export type { Service, Testimonial } from './services';

// Tipos relacionados con sistemas
export type { System, SystemFilters } from './system';

// Tipos legacy (a remover después de la migración)
export type {
  Product as LegacyProduct,
  ProductImage as LegacyProductImage,
  BlogPost as LegacyBlogPost,
  Service as LegacyService,
  Testimonial as LegacyTestimonial,
} from '../types';
