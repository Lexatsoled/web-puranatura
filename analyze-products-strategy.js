// Análisis estratégico de productos para referencias científicas
// import fs from 'fs'; // Not used in this script

// Categorización estratégica de productos por evidencia científica y impacto comercial
const productTiers = {
  tier1: {
    name: 'Tier 1: Productos Estrella (Evidencia Robusta + Alto Impacto)',
    description: 'Bestsellers con evidencia científica sólida - Máximo ROI',
    products: [
      'pr-ashwagandha', // Ashwagandha 4500mg - Adaptógeno con evidencia sólida
      '102', // CoQ10 100mg - Energía mitocondrial
      'pr-collagen-peptides', // Colágeno - Belleza y articulaciones
      '2', // Vitamina D3 10000 UI - Inmunidad y huesos
      'pr-magnesium-citrate', // Magnesio Citrato - Músculos y sueño
      '1', // Vitamina C 1000mg - Inmunidad
      'pr-probiotics', // Probióticos - Digestión e inmunidad
    ],
  },
  tier2: {
    name: 'Tier 2: Vitaminas y Minerales Esenciales',
    description: 'Fundamentos nutricionales con evidencia establecida',
    products: [
      '3', // Vitamina K2 - Huesos y cardiovascular
      '4', // Calcio Magnesio - Huesos
      'pr-magnesium-oxide', // Óxido de Magnesio
      'pr-magnesium-malate', // Malato de Magnesio
      'pr-zinc', // Zinc
      'pr-iron', // Hierro
      'pr-b-complex', // Complejo B
      'pr-multivitamin', // Multivitamínico
    ],
  },
  tier3: {
    name: 'Tier 3: Hierbas Tradicionales',
    description:
      'Productos herbales con evidencia mixta pero demanda comercial',
    products: [
      'pr-bacopa', // Bacopa Monnieri - Cognitivo
      'pr-ginkgo', // Ginkgo Biloba - Circulación cerebral
      'pr-tribulus', // Tribulus Terrestris - Función sexual
      'pr-maca', // Maca - Energía y hormonal
      '103', // GABA - Relajación
      'pr-ashwa-melatonin', // Ashwagandha + Melatonina + L-Teanina
      'pr-cranberry-vitamin-c', // Arándano + Vitamina C
    ],
  },
  tier4: {
    name: 'Tier 4: Productos Especializados',
    description: 'Productos de nicho con evidencia limitada',
    products: [
      'pr-bamboo-extract', // Extracto de Bambú - Sílice
      'pr-chlorophyll', // Clorofila
      'pr-horsetail', // Cola de Caballo
      'pr-nettle', // Ortiga
      'pr-cleanse-more', // Desintoxicación
      'pr-circulation-complex', // Complejo Circulación
    ],
  },
};

// Mapeo de productos por categoría de evidencia científica
const evidenceMap = {
  // Evidencia científica ROBUSTA (Meta-análisis, ensayos clínicos múltiples)
  robust: [
    'pr-ashwagandha', // Adaptógeno - múltiples estudios
    '102', // CoQ10 - cardiovascular y energía
    '2', // Vitamina D3 - inmunidad, huesos
    '1', // Vitamina C - inmunidad, antioxidante
    'pr-collagen-peptides', // Colágeno - piel y articulaciones
    'pr-magnesium-citrate', // Magnesio - músculos, sueño
    'pr-probiotics', // Probióticos - microbiota
  ],

  // Evidencia ESTABLECIDA (Estudios consistentes, uso clínico)
  established: [
    '3', // Vitamina K2 - huesos, cardiovascular
    '4', // Calcio - huesos
    'pr-magnesium-oxide', // Magnesio - formas diversas
    'pr-magnesium-malate', // Magnesio malato - fibromialgia
    'pr-zinc', // Zinc - inmunidad
    'pr-iron', // Hierro - anemia
    'pr-b-complex', // Vitaminas B - energía
  ],

  // Evidencia MIXTA (Algunos estudios positivos, otros neutros)
  mixed: [
    'pr-ginkgo', // Ginkgo - circulación cerebral
    'pr-bacopa', // Bacopa - cognitivo
    '103', // GABA - relajación
    'pr-cranberry-vitamin-c', // Arándano - tracto urinario
  ],

  // Evidencia LIMITADA (Estudios preliminares, tradicional)
  limited: [
    'pr-tribulus', // Tribulus - función sexual
    'pr-maca', // Maca - energía
    'pr-bamboo-extract', // Bambú - sílice
    'pr-chlorophyll', // Clorofila
    'pr-horsetail', // Cola de Caballo
    'pr-nettle', // Ortiga
  ],
};

// Función para generar el plan de implementación
function generateImplementationPlan() {
  console.log('🔬 PLAN ESTRATÉGICO DE REFERENCIAS CIENTÍFICAS - PURANATURA');
  console.log('=' * 70);

  Object.entries(productTiers).forEach(([, tier]) => {
    console.log(`\n${tier.name}`);
    console.log(`📝 ${tier.description}`);
    console.log(`📦 Productos (${tier.products.length}):`);

    tier.products.forEach((productId, index) => {
      // Determinar nivel de evidencia
      let evidenceLevel = '📊 Limitada';
      if (evidenceMap.robust.includes(productId)) evidenceLevel = '🏆 Robusta';
      else if (evidenceMap.established.includes(productId))
        evidenceLevel = '✅ Establecida';
      else if (evidenceMap.mixed.includes(productId))
        evidenceLevel = '⚖️ Mixta';

      console.log(`   ${index + 1}. ${productId} - ${evidenceLevel}`);
    });
  });

  console.log('\n🎯 ESTRATEGIA DE IMPLEMENTACIÓN:');
  console.log('1. Tier 1: Prioridad MÁXIMA - Impacto comercial inmediato');
  console.log('2. Tier 2: Alta prioridad - Fundamentos nutricionales');
  console.log('3. Tier 3: Media prioridad - Diferenciación herbal');
  console.log('4. Tier 4: Baja prioridad - Completitud del catálogo');
}

// Ejecutar análisis
generateImplementationPlan();

export { productTiers, evidenceMap };
