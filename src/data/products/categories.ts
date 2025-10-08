import { ProductCategory } from '@/types/product';

/**
 * Categorías de productos - Siempre cargadas (ligero: ~1 KB)
 */
export const productCategories: ProductCategory[] = [
  { id: 'todos', name: 'Todos' },
  { id: 'vitaminas-minerales', name: 'Vitaminas y Minerales' },
  { id: 'salud-articular', name: 'Salud Articular' },
  { id: 'salud-digestiva', name: 'Salud Digestiva' },
  { id: 'salud-femenina', name: 'Salud Femenina' },
  { id: 'salud-masculina', name: 'Salud Masculina' },
  { id: 'aceites-esenciales', name: 'Aceites Esenciales' },
  { id: 'suplementos-especializados', name: 'Suplementos Especializados' },
  { id: 'sistema-inmunologico', name: '🛡️ Sistema Inmunológico' },
  { id: 'sistema-cardiovascular', name: '❤️ Sistema Cardiovascular' },
  { id: 'sistema-oseo-mineral', name: '🦴 Sistema Óseo Mineral' },
  { id: 'sistema-nervioso', name: '🧠 Sistema Nervioso' },
  { id: 'sistema-endocrino', name: '⚖️ Sistema Endocrino' },
  { id: 'sistema-detox', name: '🌿 Sistema Detox' },
];
