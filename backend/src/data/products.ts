// Small backend-local fallback dataset for development.
// This is intentionally compact to avoid pulling files from outside the backend project
// (prevents TypeScript rootDir import errors while providing a working fallback).

export const productCategories = [
  { id: 'todos', name: 'Todos' },
  { id: 'vitaminas-minerales', name: 'Vitaminas y Minerales' },
  { id: 'aceites-esenciales', name: 'Aceites Esenciales' },
  { id: 'salud-digestiva', name: 'Salud Digestiva' },
];

export const products = [
  {
    id: 'legacy-1',
    name: 'Vitamina C 1000mg',
    category: 'vitaminas-minerales',
    price: 24.99,
    description:
      'Vitamina C de alta potencia para fortalecer el sistema inmunológico y promover la producción de colágeno.',
    images: [
      {
        thumbnail: '/Jpeg/C-1000 with Bioflavonoids Anverso.jpg',
        full: '/Jpeg/C-1000 with Bioflavonoids Anverso.jpg',
      },
    ],
    stock: 100,
    slug: 'vitamina-c-1000mg',
    updatedAt: '1970-01-01T00:00:00.000Z',
  },
  {
    id: 'legacy-2',
    name: 'Aceite Esencial de Lavanda',
    category: 'aceites-esenciales',
    price: 18.5,
    description:
      'Aceite esencial puro para aromaterapia y relajación profunda.',
    images: [
      {
        thumbnail: '/Jpeg/High%20Potency%20Lavender.jpg',
        full: '/Jpeg/High%20Potency%20Lavender.jpg',
      },
    ],
    stock: 120,
    slug: 'aceite-esencial-lavanda',
    updatedAt: '1970-01-01T00:00:00.000Z',
  },
  {
    id: 'legacy-3',
    name: 'Complejo Probiótico Premium',
    category: 'salud-digestiva',
    price: 32.75,
    description:
      'Fórmula avanzada con 12 cepas vivas para reforzar la microbiota intestinal.',
    images: [],
    stock: 60,
    slug: 'complejo-probiotico-premium',
    updatedAt: '1970-01-01T00:00:00.000Z',
  },
];

export default products;
