/**
 * Define las imágenes asociadas a un producto.
 * Propósito: Estructurar las URLs de imágenes del producto en diferentes formatos.
 * Lógica: Proporciona URLs para imagen completa y miniatura, con texto alternativo opcional.
 * Entradas: Ninguna (es una estructura de datos).
 * Salidas: Ninguna (es una estructura de datos).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export interface ProductImage {
  full: string;
  thumbnail: string;
  alt?: string;
}

/**
 * Define la configuración SEO para un producto.
 * Propósito: Estructurar metadatos para optimización en motores de búsqueda y redes sociales.
 * Lógica: Incluye títulos, descripciones, palabras clave y datos estructurados para mejorar el posicionamiento.
 * Entradas: Ninguna (es una estructura de datos).
 * Salidas: Ninguna (es una estructura de datos).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  jsonLd?: {
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    image: string[];
    brand?: string;
    manufacturer?: string;
    offers: {
      '@type': string;
      price: number;
      priceCurrency: string;
      availability: string;
      seller?: {
        '@type': string;
        name: string;
      };
    };
  };
}

/**
 * Define la estructura completa de un producto en el sistema.
 * Propósito: Representar toda la información necesaria de un producto para su visualización y gestión.
 * Lógica: Combina información básica, comercial, técnica y científica del producto en una sola interfaz.
 * Entradas: Ninguna (es una estructura de datos).
 * Salidas: Ninguna (es una estructura de datos).
 * Dependencias: Depende de ProductImage y ProductSEO.
 * Efectos secundarios: Ninguno.
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceNote?: string | string[]; // Nota adicional sobre el precio (ej: precio por unidad)
  categories: string[]; // CAMBIO: De category único a categories múltiples
  images: ProductImage[];
  stock: number;
  sku: string;
  tags: string[];
  specifications?: {
    [key: string]: string;
  };
  relatedProducts?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  brand?: string;
  manufacturer?: string;
  benefits?: string[];
  usage?: string;
  ingredients?: string[];
  warnings?: string[];
  seo?: ProductSEO;
  // Campos adicionales para las pestañas
  detailedDescription?: string; // Descripción Detallada
  mechanismOfAction?: string; // Mecanismo de acción
  benefitsDescription?: string[]; // Beneficios descritos
  healthIssues?: string[]; // Problemas de salud que puede ayudar
  components?: {
    name: string;
    description: string;
    amount?: string;
  }[]; // Componentes con descripción
  dosage?: string; // Dosis recomendada
  administrationMethod?: string; // Forma de tomarlo
  faqs?: {
    question: string;
    answer: string;
  }[]; // Preguntas frecuentes
  scientificReferences?: {
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi?: string;
    pmid?: string;
    url?: string;
    summary: string;
    relevance: 'alta' | 'media' | 'baja';
    studyType:
      | 'ensayo-clinico'
      | 'revision-sistematica'
      | 'meta-analisis'
      | 'estudio-observacional'
      | 'in-vitro'
      | 'animal'
      | 'estudio-animal';
    sampleSize?: number;
    keyFindings: string[];
  }[]; // Referencias científicas que respaldan la información del producto
}

/**
 * Define las opciones disponibles para ordenar productos.
 * Propósito: Proporcionar un tipo seguro para las opciones de ordenamiento en listados de productos.
 * Lógica: Enumera todas las formas posibles de ordenar productos por diferentes criterios.
 * Entradas: Ninguna (es un tipo enumerado).
 * Salidas: Ninguna (es un tipo enumerado).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export type SortOption =
  | 'default'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest'
  | 'best-sellers';

/**
 * Define los filtros disponibles para buscar y filtrar productos.
 * Propósito: Estructurar los criterios de filtrado para consultas de productos.
 * Lógica: Proporciona campos opcionales para filtrar productos por diferentes atributos.
 * Entradas: Ninguna (es una estructura de datos).
 * Salidas: Ninguna (es una estructura de datos).
 * Dependencias: Depende del tipo SortOption.
 * Efectos secundarios: Ninguno.
 */
export interface ProductFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
  sortBy?: SortOption;
  tags?: string[];
  inStock?: boolean;
  onSale?: boolean;
  rating?: number;
  brand?: string;
}

/**
 * Define la estructura de una categoría de producto.
 * Propósito: Representar las categorías jerárquicas para organizar productos.
 * Lógica: Incluye información básica, jerarquía, apariencia visual y metadatos SEO.
 * Entradas: Ninguna (es una estructura de datos).
 * Salidas: Ninguna (es una estructura de datos).
 * Dependencias: Ninguna.
 * Efectos secundarios: Ninguno.
 */
export type ProductCategory = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  level?: number; // Jerarquía: 0=meta, 1=primaria, 2=funcional
  parent?: string; // ID de la categoría padre
  color?: string; // Color para UI
  icon?: string; // Icono representativo
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};
