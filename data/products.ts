import { Product } from '../types';

export const productCategories = [
  'Todos',
  'Vitaminas y Minerales',
  'Salud Articular',
  'Salud Digestiva',
  'Salud Femenina',
  'Suplementos Especializados',
];

export const products: Product[] = [
  // Vitaminas y Minerales
  {
    id: "1",
    name: 'Vitamina C 1000mg',
    category: 'Vitaminas y Minerales',
    price: 24.99,
    description:
      'Vitamina C de alta potencia para fortalecer el sistema inmunológico y promover la producción de colágeno.',
    images: [
      {
        thumbnail: '/Jpeg/vitamina_c_1000_500x500.jpg',
        full: '/Jpeg/vitamina_c_1000_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Vitamina_C_Now_Anverso.jpg',
        full: '/Jpeg/Vitamina_C_Now_Anverso.jpg',
      },
    ],
  },
  {
    id: "2",
    name: 'Vitamina D3 10000 UI',
    category: 'Vitaminas y Minerales',
    price: 29.99,
    description:
      'Vitamina D3 de alta potencia para la salud ósea y el sistema inmunológico.',
    images: [
      {
        thumbnail: '/Jpeg/vitamina_d3_10000_500x500.jpg',
        full: '/Jpeg/vitamina_d3_10000_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Vitamina_D3_10000_Anverso.jpg',
        full: '/Jpeg/Vitamina_D3_10000_Anverso.jpg',
      },
    ],
  },
  {
    id: "3",
    name: 'Vitamina K2',
    category: 'Vitaminas y Minerales',
    price: 27.99,
    description: 'Vitamina K2 para la salud ósea y cardiovascular.',
    images: [
      {
        thumbnail: '/Jpeg/vitamina_k2_500x500.jpg',
        full: '/Jpeg/vitamina_k2_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Vitamina_K2_Anverso.jpg',
        full: '/Jpeg/Vitamina_K2_Anverso.jpg',
      },
    ],
  },
  {
    id: "4",
    name: 'Calcio Magnesio',
    category: 'Vitaminas y Minerales',
    price: 22.99,
    description:
      'Combinación de calcio y magnesio para la salud ósea y muscular.',
    images: [
      {
        thumbnail: '/Jpeg/Calcio Magnesio Etiqueta_500x500.jpg',
        full: '/Jpeg/Calcio Magnesio Etiqueta_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Calcio_Magnesio_Anverso.jpg',
        full: '/Jpeg/Calcio_Magnesio_Anverso.jpg',
      },
    ],
  },
  // Salud Articular
  {
    id: "5",
    name: 'Glucosamina y Condroitina',
    category: 'Salud Articular',
    price: 34.99,
    description:
      'Fórmula completa para el mantenimiento y la salud de las articulaciones.',
    images: [
      {
        thumbnail: '/Jpeg/glucosamina_condroitina_500x500.jpg',
        full: '/Jpeg/glucosamina_condroitina_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Glucosamina_Condroitina_Anverso.jpg',
        full: '/Jpeg/Glucosamina_Condroitina_Anverso.jpg',
      },
    ],
  },
  // Salud Digestiva
  {
    id: "6",
    name: 'Ultimate Flora',
    category: 'Salud Digestiva',
    price: 39.99,
    description:
      'Probiótico de amplio espectro para una salud digestiva óptima.',
    images: [
      {
        thumbnail: '/Jpeg/ultimate_flora_500x500.jpg',
        full: '/Jpeg/ultimate_flora_500x500.jpg',
      },
    ],
  },
  {
    id: "7",
    name: 'Digestive Duo',
    category: 'Salud Digestiva',
    price: 32.99,
    description: 'Combinación de enzimas digestivas para una mejor digestión.',
    images: [
      {
        thumbnail: '/Jpeg/Digestive Duo Etiqueta_reducida_500x500.jpg',
        full: '/Jpeg/Digestive Duo Etiqueta_reducida_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Digestive_Duo_Anverso.jpg',
        full: '/Jpeg/Digestive_Duo_Anverso.jpg',
      },
    ],
  },
  {
    id: "8",
    name: 'Cleanse More',
    category: 'Salud Digestiva',
    price: 28.99,
    description:
      'Fórmula natural para apoyar la limpieza intestinal y la regularidad.',
    images: [
      {
        thumbnail: '/Jpeg/cleanse_more_500x500.jpg',
        full: '/Jpeg/cleanse_more_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Cleanse_More_Anverso.jpg',
        full: '/Jpeg/Cleanse_More_Anverso.jpg',
      },
    ],
  },
  // Suplementos Especializados
  {
    id: "9",
    name: 'Ácido Hialurónico',
    category: 'Suplementos Especializados',
    price: 35.99,
    description: 'Suplemento para el cuidado de la piel y las articulaciones.',
    images: [
      {
        thumbnail: '/Jpeg/Acido_Hialuronico_Etiqueta.jpg',
        full: '/Jpeg/Acido_Hialuronico_Etiqueta.jpg',
      },
      {
        thumbnail: '/Jpeg/Acido_Hialuronico_Anverso.jpg',
        full: '/Jpeg/Acido_Hialuronico_Anverso.jpg',
      },
    ],
  },
  {
    id: "10",
    name: 'Triple Extracto de Hongos',
    category: 'Suplementos Especializados',
    price: 42.99,
    description:
      'Potente mezcla de hongos medicinales para el sistema inmunológico.',
    images: [
      {
        thumbnail: '/Jpeg/triple_extracto_hongos_500x500.jpg',
        full: '/Jpeg/triple_extracto_hongos_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Triple_extacto_Hongos_Anverso.jpg',
        full: '/Jpeg/Triple_extacto_Hongos_Anverso.jpg',
      },
    ],
  },
  {
    id: "11",
    name: 'Mezcla Hígado',
    category: 'Suplementos Especializados',
    price: 31.99,
    description: 'Fórmula herbal para apoyar la función hepática.',
    images: [
      {
        thumbnail: '/Jpeg/mezcla_higado_500x500.jpg',
        full: '/Jpeg/mezcla_higado_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Mezcla_Higado_Anverso.jpg',
        full: '/Jpeg/Mezcla_Higado_Anverso.jpg',
      },
    ],
  },
  // Salud Femenina
  {
    id: "12",
    name: 'Menopause Plus',
    category: 'Salud Femenina',
    price: 37.99,
    description: 'Fórmula natural para el apoyo durante la menopausia.',
    images: [
      {
        thumbnail: '/Jpeg/menopause_plus_500x500.jpg',
        full: '/Jpeg/menopause_plus_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Menopause_Plus_Anverso.jpg',
        full: '/Jpeg/Menopause_Plus_Anverso.jpg',
      },
    ],
  },
  {
    id: "13",
    name: 'Cranberry Concentrado',
    category: 'Salud Femenina',
    price: 26.99,
    description: 'Concentrado de arándano para la salud del tracto urinario.',
    images: [
      {
        thumbnail: '/Jpeg/Cranberry_Etiqueta_500x500.jpg',
        full: '/Jpeg/Cranberry_Etiqueta_500x500.jpg',
      },
      {
        thumbnail: '/Jpeg/Cranberry_Concentrado_Anverso.jpg',
        full: '/Jpeg/Cranberry_Concentrado_Anverso.jpg',
      },
    ],
  },
];
