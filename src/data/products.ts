import { Product, ProductCategory } from '../types/product';

// Dataset legacy retirado para optimización de bundle (T-604).
// Los datos ahora residen en public/data/products.json y se cargan asíncronamente.
// Se mantiene este archivo para exportar productCategories y un array vacío por compatibilidad.

export const productCategories: ProductCategory[] = [
  { id: 'todos', name: 'Todos' },
  { id: 'vitaminas-minerales', name: 'Vitaminas y Minerales' },
  { id: 'salud-articular', name: 'Salud Articular' },
  { id: 'salud-digestiva', name: 'Salud Digestiva' },
  { id: 'salud-femenina', name: 'Salud Femenina' },
  { id: 'salud-masculina', name: 'Salud Masculina' },
  { id: 'aceites-esenciales', name: 'Aceites Esenciales' },
  { id: 'suplementos-especializados', name: 'Suplementos Especializados' },
];

export const products: Product[] = [];
