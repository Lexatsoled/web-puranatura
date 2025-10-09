export interface ProductImage {
  full: string;
  thumbnail: string;
  alt?: string;
}

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
    studyType: 'ensayo-clinico' | 'revision-sistematica' | 'meta-analisis' | 'estudio-observacional' | 'in-vitro' | 'animal';
    sampleSize?: number;
    keyFindings: string[];
  }[]; // Referencias científicas que respaldan la información del producto
}

export type SortOption =
  | 'default'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest'
  | 'best-sellers';

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

