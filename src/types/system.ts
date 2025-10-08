export interface System {
  id: string;
  name: string;
  description: string;
  icon: string;
  products: string[]; // IDs de productos relacionados
  benefits: string[];
  keyIngredients: string[];
  color?: string;
  backgroundImage?: string;
  featured?: boolean;
  targetAudience?: string[];
  relatedSystems?: string[];
}

export interface SystemFilters {
  category?: string;
  featured?: boolean;
  targetAudience?: string;
}