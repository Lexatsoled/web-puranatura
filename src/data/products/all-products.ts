import { Product } from '@/types/product';

/**
 * ARCHIVO DE TODOS LOS PRODUCTOS
 * Este archivo se carga dinámicamente solo cuando es necesario
 * No se incluye en el bundle inicial para optimizar el tamaño
 */

export const products: Product[] = [
  // Vitaminas y Minerales
  {
    id: "1",
    name: 'Vitamina C 1000mg',
    categories: ['vitaminas-minerales'],
    price: 24.99,
    description:
      'Vitamina C de alta potencia para fortalecer el sistema inmunológico y promover la producción de colágeno.',
    images: [
      {
        thumbnail: '/Jpeg/C-1000 with Bioflavonoids Anverso.jpg',
        full: '/Jpeg/C-1000 with Bioflavonoids Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/C-1000 with Bioflavonoids Reverso.jpg',
        full: '/Jpeg/C-1000 with Bioflavonoids Reverso.jpg',
      },
    ],
    stock: 100,
    sku: 'VC1000',
    tags: ['vitamina', 'inmunidad', 'antioxidante'],
    // Información para pestañas
    detailedDescription: 'La Vitamina C (ácido ascórbico) es un nutriente esencial soluble en agua que el cuerpo no puede producir por sí mismo. Esta formulación de alta potencia de 1000mg proporciona el 1667% del valor diario recomendado, asegurando una óptima absorción y utilización por el organismo. La vitamina C es conocida por ser uno de los antioxidantes más potentes que ayuda a combatir los radicales libres, fortalece el sistema inmunológico y es fundamental para la producción de colágeno, esencial para la salud de la piel, articulaciones y tejido conectivo.',
    mechanismOfAction: 'La vitamina C funciona como un potente antioxidante que neutraliza los radicales libres, moléculas inestables que pueden dañar las células del cuerpo. También es esencial para la síntesis de colágeno, la proteína estructural más abundante en el cuerpo que forma parte de los tejidos conectivos como piel, cartílago y huesos. Además, la vitamina C mejora la absorción de hierro no hemo (de fuentes vegetales) y participa en la producción de neurotransmisores como la norepinefrina, fundamental para la función cerebral.',
    benefitsDescription: [
      'Fortalecimiento del sistema inmunológico y mayor resistencia a infecciones',
      'Potente acción antioxidante que combate el daño de los radicales libres',
      'Apoyo a la producción de colágeno para una piel más saludable y tejidos conectivos fuertes',
      'Mejora de la absorción del hierro de fuentes vegetales',
      'Contribución a la reducción de la fatiga y el cansancio',
      'Protección de las células contra el estrés oxidativo'
    ],
    healthIssues: [
      'Deficiencia de vitamina C o escorbuto',
      'Función inmunitaria debilitada',
      'Salud de la piel y problemas de cicatrización',
      'Salud cardiovascular',
      'Estrés oxidativo celular',
      'Absorción deficiente de hierro'
    ],
    components: [
      {
        name: 'Vitamina C (como ácido ascórbico)',
        description: 'Forma pura y altamente biodisponible de vitamina C que facilita la absorción y utilización óptima por el organismo.',
        amount: '1000 mg (1667% del Valor Diario)'
      },
      {
        name: 'Bioflavonoides cítricos',
        description: 'Compuestos naturales que mejoran la absorción de la vitamina C y potencian sus efectos antioxidantes.',
        amount: '25 mg'
      },
      {
        name: 'Escaramujo (Rosa canina)',
        description: 'Fuente natural de vitamina C y otros antioxidantes que complementan la acción del ácido ascórbico.',
        amount: '10 mg'
      }
    ],
    dosage: 'Tomar 1 cápsula al día con alimentos, o según lo recomendado por un profesional de la salud. En casos de necesidades aumentadas (infecciones, estrés intenso), puede incrementarse hasta 2 cápsulas diarias, divididas en 2 tomas.',
    administrationMethod: 'Ingerir la cápsula entera con un vaso de agua, preferiblemente con las comidas para mejorar la absorción y reducir la posible acidez estomacal. La vitamina C es hidrosoluble, por lo que puede tomarse en cualquier momento del día, aunque mantener un horario regular puede maximizar sus beneficios.',
    faqs: [
      {
        question: '¿Puedo tomar más de 1000mg de vitamina C al día?',
        answer: 'Aunque la vitamina C es generalmente segura incluso en dosis altas, el límite superior tolerable se establece en 2000mg diarios. Dosis más altas pueden causar molestias digestivas como diarrea o náuseas en algunas personas. Consulte con un profesional de la salud antes de superar la dosis recomendada.'
      },
      {
        question: '¿Es mejor tomar vitamina C natural o sintética?',
        answer: 'Ambas formas son igualmente efectivas en términos de la absorción de ácido ascórbico. Nuestra fórmula combina ácido ascórbico puro (que es químicamente idéntico a la vitamina C natural) con componentes naturales como bioflavonoides y escaramujo para una mejor biodisponibilidad y efectos sinérgicos.'
      },
      {
        question: '¿Cuánto tiempo debo tomar este suplemento?',
        answer: 'La vitamina C es un nutriente esencial que debe consumirse diariamente ya que el cuerpo no puede almacenarla en grandes cantidades. Puede tomarse de forma continua como parte de una rutina de mantenimiento de la salud o en ciclos específicos durante temporadas de mayor necesidad (invierno, períodos de estrés, etc.).'
      },
      {
        question: '¿La vitamina C realmente previene resfriados?',
        answer: 'Aunque la vitamina C no previene los resfriados en la población general, los estudios muestran que puede reducir la duración y severidad de los síntomas. En personas sometidas a estrés físico intenso (como atletas), puede ayudar a reducir la incidencia de resfriados hasta en un 50%.'
      },
      {
        question: '¿Quiénes deberían tener especial cuidado con los suplementos de vitamina C?',
        answer: 'Las personas con problemas renales, hemocromatosis (acumulación excesiva de hierro), o quienes toman ciertos medicamentos como anticoagulantes, deben consultar con un médico antes de tomar suplementos de vitamina C. También aquellos con tendencia a desarrollar cálculos renales de oxalato deben ser cautelosos con dosis altas.'
      }
    ]
  },
  {
    id: "2",
    name: 'Vitamina D3 10000 UI',
    categories: ['vitaminas-minerales'],
    price: 29.99,
    description:
      'Vitamina D3 de alta potencia para la salud ósea y el sistema inmunológico.',
    images: [
      {
        thumbnail: '/Jpeg/High Potency Vitamin D3, 10,000 IU Anverso.jpg',
        full: '/Jpeg/High Potency Vitamin D3, 10,000 IU Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/High Potency Vitamin D3, 10,000 IU Reverso.jpg',
        full: '/Jpeg/High Potency Vitamin D3, 10,000 IU Reverso.jpg',
      },
    ],
    stock: 80,
    sku: 'VD310000',
    tags: ['vitamina', 'huesos', 'inmunidad'],
    // Información para pestañas
    detailedDescription: 'La Vitamina D3 (colecalciferol) es una forma altamente potente y biodisponible de vitamina D que ofrece 10000 UI por cápsula. A menudo llamada la "vitamina del sol", la D3 es crucial para la salud ósea, inmunológica y general del organismo. Esta formulación de alta potencia está especialmente diseñada para personas con deficiencia severa de vitamina D, aquellos con limitada exposición solar, o con necesidades aumentadas por razones específicas de salud. La vitamina D3 es fundamental para la absorción del calcio y fósforo, contribuyendo así a la mineralización ósea y al mantenimiento de músculos, dientes y función cerebral saludables.',
    mechanismOfAction: 'La vitamina D3 funciona como una prohormona en el cuerpo, lo que significa que debe activarse para ejercer sus efectos. Tras su absorción, se transporta al hígado donde se convierte en calcidiol (25-hidroxivitamina D), y luego a los riñones donde se transforma en calcitriol (1,25-dihidroxivitamina D), su forma biológicamente activa. En esta forma, regula más de 200 genes en el cuerpo y participa en numerosos procesos metabólicos. Su función principal incluye la regulación de los niveles de calcio y fósforo en sangre, promoviendo la absorción intestinal de estos minerales para la formación y mantenimiento de huesos fuertes. Además, la vitamina D3 activa juega un papel crucial en la modulación del sistema inmunológico y la expresión genética relacionada con la respuesta inflamatoria.',
    benefitsDescription: [
      'Optimización de la absorción de calcio y fósforo para la salud ósea',
      'Fortalecimiento del sistema inmunológico y modulación de la respuesta inmune',
      'Apoyo a la función muscular y reducción del riesgo de caídas en adultos mayores',
      'Contribución a la salud cardiovascular y presión arterial saludable',
      'Mejora del estado de ánimo y apoyo a la función cognitiva',
      'Regulación del metabolismo energético y la sensibilidad a la insulina'
    ],
    healthIssues: [
      'Deficiencia de vitamina D y raquitismo/osteomalacia',
      'Osteoporosis y salud ósea comprometida',
      'Función inmunitaria debilitada',
      'Trastornos del estado de ánimo, especialmente depresión estacional',
      'Salud cardiovascular y presión arterial',
      'Resistencia a la insulina y problemas metabólicos'
    ],
    components: [
      {
        name: 'Vitamina D3 (como colecalciferol)',
        description: 'Forma activa y natural de vitamina D derivada de lanolina de alta calidad, idéntica a la forma producida por la piel humana cuando se expone a la luz solar.',
        amount: '10000 UI (2500% del Valor Diario)'
      },
      {
        name: 'Aceite de oliva extra virgen',
        description: 'Medio de transporte que mejora la absorción de la vitamina D3, ya que esta es una vitamina liposoluble que requiere grasa para su óptima asimilación.',
        amount: ''
      },
      {
        name: 'Cubierta de la cápsula blanda',
        description: 'Gelatina bovina de alta calidad que garantiza la integridad y estabilidad del contenido.',
        amount: ''
      }
    ],
    dosage: '⚠️ IMPORTANTE: Esta dosis de 10000 UI excede significativamente el límite superior seguro de 4000 UI diarios establecido por las autoridades sanitarias. Solo debe usarse bajo estricta supervisión médica para corregir deficiencias severas durante períodos cortos. Para uso general, considere dosis de 1000-2000 UI diarias. Se recomienda tomar 1 cápsula cada 2-3 días ÚNICAMENTE bajo prescripción médica y con monitorización regular de los niveles séricos de 25-hidroxivitamina D.',
    administrationMethod: 'Ingerir la cápsula blanda con un vaso de agua durante una comida que contenga algo de grasa para optimizar la absorción. Por ser liposoluble, la vitamina D3 se absorbe mejor cuando se consume con alimentos que contienen grasas saludables como aguacate, frutos secos o aceite de oliva.',
    faqs: [
      {
        question: '¿Por qué esta fórmula contiene 10000 UI? ¿No es una dosis muy alta?',
        answer: '⚠️ CORRECCIÓN MÉDICA: 10000 UI supera ampliamente el límite superior seguro de 4000 UI diarios según WebMD y las autoridades sanitarias. Esta dosis solo está justificada para corrección rápida de deficiencias severas bajo supervisión médica estricta y por períodos limitados. El uso prolongado puede causar hipercalcemia y toxicidad. Para la mayoría de personas, dosis de 1000-2000 UI diarias son suficientes y seguras según Examine.com.'
      },
      {
        question: '¿Cuáles son los signos de una deficiencia de vitamina D?',
        answer: 'Los síntomas comunes de deficiencia incluyen fatiga crónica, dolor óseo y muscular, debilidad muscular, infecciones frecuentes, cicatrización lenta de heridas, pérdida de densidad ósea y estado de ánimo deprimido, especialmente durante los meses de menor luz solar. Sin embargo, muchas personas con deficiencia pueden no presentar síntomas evidentes, por lo que los análisis de sangre son el método más confiable para detectarla.'
      },
      {
        question: '¿Es posible tomar demasiada vitamina D?',
        answer: '⚠️ SÍ - RIESGO REAL: Según WebMD, dosis superiores a 4000 UI diarias por períodos prolongados pueden causar toxicidad. Los síntomas incluyen hipercalcemia (exceso de calcio), náuseas, vómitos, debilidad, confusión, arritmias cardíacas y daño renal permanente. Esta formulación de 10000 UI requiere supervisión médica obligatoria con análisis regulares de calcio sérico y 25-hidroxivitamina D para prevenir intoxicación.'
      },
      {
        question: '¿Quiénes tienen mayor riesgo de deficiencia de vitamina D?',
        answer: 'Los grupos con mayor riesgo incluyen: personas con poca exposición solar (trabajadores nocturnos, residentes en latitudes altas), adultos mayores (la piel produce menos vitamina D con la edad), individuos con piel oscura, personas con obesidad o enfermedades digestivas que afectan la absorción de grasas, y quienes siguen dietas vegetarianas o veganas estrictas.'
      },
      {
        question: '¿Puede interactuar esta vitamina D3 con otros medicamentos?',
        answer: 'Sí, la vitamina D puede interactuar con varios medicamentos, incluyendo algunos diuréticos, esteroides, anticonvulsivos, medicamentos para reducir el colesterol y para tratar la tuberculosis. También debe usarse con precaución si se toman suplementos con aluminio (como antiácidos). Siempre informe a su médico sobre todos los suplementos que está tomando.'
      }
    ]
  },
  {
    id: "3",
    name: 'Vitamina K2',
    categories: ['vitaminas-minerales'],
    price: 27.99,
    description: 'Vitamina K2 para la salud ósea y cardiovascular.',
    images: [
      {
        thumbnail: '/Jpeg/Vitamina_K2_Anverso.jpg',
        full: '/Jpeg/Vitamina_K2_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/vitamina_k2_500x500.jpg',
        full: '/Jpeg/vitamina_k2_500x500.jpg',
      },
    ],
    stock: 70,
    sku: 'VK2',
    tags: ['vitamina', 'huesos', 'corazon'],
    // Información para pestañas
    detailedDescription: 'La vitamina K2 (menaquinona) es una forma de vitamina K que juega un papel crucial en la salud ósea y cardiovascular. A diferencia de la vitamina K1 que se encuentra principalmente en vegetales de hoja verde, la K2 se encuentra en alimentos fermentados y productos animales. La forma MK-7 de vitamina K2 utilizada en este suplemento tiene una vida media más larga en el cuerpo, lo que permite una mayor biodisponibilidad y eficacia.',
    mechanismOfAction: 'La vitamina K2 funciona principalmente activando proteínas dependientes de vitamina K que regulan la distribución del calcio en el organismo. Activa la osteocalcina, una proteína que ayuda a incorporar el calcio en los huesos, y la proteína Matrix Gla (MGP), que evita que el calcio se deposite en arterias y tejidos blandos. Esto crea un efecto dual único: fortalece los huesos mientras protege el sistema cardiovascular.',
    benefitsDescription: [
      'Fortalecimiento de la estructura ósea al promover la mineralización adecuada del hueso',
      'Reducción del riesgo de calcificación arterial y mejora de la elasticidad vascular',
      'Complemento perfecto para la suplementación con vitamina D3 y calcio',
      'Apoyo a la salud dental al fortalecer el esmalte dental',
      'Contribuye a un sistema inmunológico saludable'
    ],
    healthIssues: [
      'Osteoporosis y baja densidad ósea',
      'Salud cardiovascular y calcificación arterial',
      'Deficiencia de vitamina K2 por dietas restrictivas',
      'Complemento para tratamientos con vitamina D y calcio',
      'Salud dental'
    ],
    components: [
      {
        name: 'Vitamina K2 (como MK-7, menaquinona-7)',
        description: 'Forma natural y biodisponible de vitamina K2 derivada de natto (soja fermentada). La forma MK-7 tiene una vida media más larga en el cuerpo, proporcionando beneficios sostenidos.',
        amount: '100 mcg (125% del Valor Diario)'
      },
      {
        name: 'Aceite de oliva',
        description: 'Utilizado como base para la vitamina K2 al ser liposoluble, mejorando su absorción y estabilidad.',
        amount: ''
      },
      {
        name: 'Cubierta de la cápsula vegetal',
        description: 'Hecha de celulosa vegetal, apta para vegetarianos y veganos.',
        amount: ''
      }
    ],
    dosage: 'Tomar 1 cápsula al día con alimentos, preferiblemente que contengan algo de grasa para mejorar la absorción.',
    administrationMethod: 'Ingerir la cápsula entera con un vaso de agua. Preferiblemente tomar con una comida que contenga grasas para optimizar la absorción, ya que la vitamina K2 es liposoluble.',
    faqs: [
      {
        question: '¿Puedo tomar vitamina K2 junto con medicamentos anticoagulantes?',
        answer: 'Las personas que toman anticoagulantes como la warfarina (Coumadin) deben consultar con su médico antes de tomar suplementos de vitamina K, ya que podría interferir con estos medicamentos. Siempre consulte a un profesional de la salud antes de iniciar cualquier suplementación si está bajo tratamiento médico.'
      },
      {
        question: '¿Cuál es la diferencia entre la vitamina K1 y K2?',
        answer: 'La vitamina K1 (filoquinona) se encuentra principalmente en vegetales de hoja verde y está más asociada con la coagulación de la sangre. La vitamina K2 (menaquinona) se encuentra en alimentos fermentados y productos animales, y tiene un papel más importante en la salud ósea y cardiovascular al regular el metabolismo del calcio.'
      },
      {
        question: '¿Es necesario tomar vitamina K2 si ya tomo calcio y vitamina D?',
        answer: 'Sí, puede ser especialmente importante. La vitamina D aumenta la absorción de calcio, pero la vitamina K2 ayuda a asegurar que ese calcio se dirija a los huesos y no a las arterias. Sin suficiente K2, el calcio puede acumularse en los vasos sanguíneos en lugar de en los huesos donde es necesario.'
      },
      {
        question: '¿Cuánto tiempo debo tomar este suplemento para ver resultados?',
        answer: 'Los efectos de la suplementación con vitamina K2 suelen notarse después de 3-4 meses de uso regular. Sin embargo, los beneficios para la salud ósea y cardiovascular son a largo plazo y pueden requerir una suplementación constante.'
      },
      {
        question: '¿Quién se beneficia más de la suplementación con vitamina K2?',
        answer: 'Los adultos mayores con riesgo de osteoporosis, personas con dietas restrictivas que limitan los alimentos fermentados, quienes toman suplementos de vitamina D y calcio, y aquellos preocupados por la salud cardiovascular pueden beneficiarse particularmente de la suplementación con vitamina K2.'
      }
    ]
  },
  {
    id: "4",
    name: 'Calcio Magnesio',
    categories: ['vitaminas-minerales'],
    price: 22.99,
    description:
      'Combinación de calcio y magnesio para la salud ósea y muscular.',
    images: [
      {
        thumbnail: '/Jpeg/Calcium Magnesium Zinc Anverso.jpg',
        full: '/Jpeg/Calcium Magnesium Zinc Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Calcium Magnesium Zinc Reverso.jpg',
        full: '/Jpeg/Calcium Magnesium Zinc Reverso.jpg',
      },
    ],
    stock: 90,
    sku: 'CMAG',
    tags: ['mineral', 'huesos', 'musculos'],
    // Información para pestañas
    detailedDescription: 'El suplemento de Calcio y Magnesio ofrece una combinación equilibrada de estos dos minerales esenciales en una proporción óptima de 2:1, diseñada para maximizar sus beneficios sinérgicos. Esta fórmula avanzada contiene calcio en forma de citrato y carbonato para una absorción superior, junto con magnesio en formato de citrato y glicinato, formas altamente biodisponibles que son suaves para el sistema digestivo. Los minerales trabajan en conjunto para promover la salud ósea, apoyar la función muscular adecuada y contribuir al equilibrio nervioso y cardiovascular. Ideal para adultos de todas las edades, especialmente aquellos preocupados por la salud ósea a largo plazo, personas activas que desean optimizar su recuperación muscular, y quienes buscan mantener un equilibrio electrolítico adecuado.',
    mechanismOfAction: 'El calcio y el magnesio trabajan en estrecha colaboración en el organismo, donde mantienen una delicada relación de equilibrio. El calcio es fundamental para la mineralización ósea, contracción muscular, transmisión nerviosa y coagulación sanguínea. El magnesio, por su parte, actúa como un cofactor en más de 300 reacciones enzimáticas, incluidas aquellas que regulan la utilización del calcio. Funciona como un relajante natural para los músculos, contrarrestando el efecto contractivo del calcio. En el sistema óseo, el magnesio ayuda a regular la distribución del calcio, asegurando que se deposite en los huesos y dientes en lugar de en los tejidos blandos. Esta fórmula balanceada aprovecha la interacción complementaria entre ambos minerales, promoviendo una salud ósea y muscular óptima mientras apoya las funciones neurológicas y cardiovasculares.',
    benefitsDescription: [
      'Fortalecimiento de la estructura ósea y prevención de la pérdida de densidad mineral',
      'Mejora de la función muscular y reducción de calambres y espasmos musculares',
      'Apoyo al sistema nervioso para un equilibrio emocional saludable',
      'Contribución a la salud cardiovascular y presión arterial normal',
      'Optimización del metabolismo energético y producción de ATP',
      'Mejora de la calidad del sueño y reducción del estrés'
    ],
    healthIssues: [
      'Salud ósea, osteopenia y prevención de osteoporosis',
      'Tensión muscular, calambres y espasmos',
      'Estrés, ansiedad y trastornos del sueño',
      'Salud cardiovascular y ritmo cardíaco irregular',
      'Desequilibrios electrolíticos, especialmente en deportistas',
      'Síndrome premenstrual y molestias asociadas'
    ],
    components: [
      {
        name: 'Calcio (como citrato y carbonato)',
        description: 'Combinación de dos formas de calcio que ofrecen una absorción óptima. El citrato de calcio se absorbe bien incluso con el estómago vacío, mientras que el carbonato proporciona una alta concentración elemental de calcio.',
        amount: '500 mg (50% del Valor Diario)'
      },
      {
        name: 'Magnesio (como citrato y glicinato)',
        description: 'Formas altamente biodisponibles de magnesio que son suaves para el sistema digestivo. El citrato de magnesio ayuda a la motilidad intestinal, mientras que el glicinato es especialmente bien tolerado.',
        amount: '250 mg (60% del Valor Diario)'
      },
      {
        name: 'Vitamina D3 (colecalciferol)',
        description: 'Mejora la absorción de calcio en el intestino y favorece su correcta utilización en el organismo.',
        amount: '400 UI (100% del Valor Diario)'
      },
      {
        name: 'Vitamina K2 (menaquinona-7)',
        description: 'Dirige el calcio hacia los huesos y dientes, y previene su depósito en tejidos blandos y arterias.',
        amount: '45 mcg (50% del Valor Diario)'
      }
    ],
    dosage: 'Tomar 2 comprimidos al día, preferiblemente divididos (1 con el almuerzo y 1 con la cena) para optimizar la absorción. La dosis puede ajustarse según las recomendaciones de un profesional de la salud basadas en necesidades individuales.',
    administrationMethod: 'Ingerir los comprimidos con un vaso completo de agua durante las comidas para maximizar la absorción y minimizar cualquier posible molestia digestiva. No tomar simultáneamente con alimentos ricos en oxalatos (espinacas, ruibarbo) o fitatos (cereales integrales), ya que pueden interferir con la absorción del calcio. Para óptimos resultados, separar la toma de este suplemento al menos 2 horas de la ingesta de medicamentos con los que pueda interactuar.',
    faqs: [
      {
        question: '¿Por qué es importante la proporción 2:1 de calcio y magnesio?',
        answer: 'Esta proporción refleja la relación óptima en la que estos minerales trabajan en el organismo. Mientras que el calcio es necesario para la contracción muscular y la densidad ósea, el magnesio actúa como un relajante natural que equilibra estos efectos. Un exceso de calcio sin suficiente magnesio puede provocar desequilibrios que afecten la salud muscular, cardiovascular y nerviosa.'
      },
      {
        question: '¿Puedo tomar este suplemento si estoy tomando medicamentos para la presión arterial?',
        answer: '⚠️ INTERACCIONES IMPORTANTES: Según WebMD, el calcio puede interactuar con múltiples medicamentos incluyendo bloqueadores de canales de calcio (diltiazem, verapamil), diuréticos tiazídicos, antibióticos (quinolonas, tetraciclinas), levotiroxina y digoxina. OBLIGATORIO consultar con su médico antes de usar si toma cualquier medicamento, especialmente para trastornos cardíacos, tiroideos o antibióticos. Separar las tomas al menos 2-4 horas de estos medicamentos.'
      },
      {
        question: '¿Es mejor tomar calcio y magnesio juntos o separados?',
        answer: 'Para la mayoría de las personas, tomar estos minerales juntos en la proporción adecuada (2:1) es beneficioso debido a su naturaleza sinérgica. Sin embargo, en casos específicos de deficiencias severas de uno u otro mineral, un profesional de la salud podría recomendar suplementación por separado. Nuestra fórmula está diseñada para ofrecer un equilibrio óptimo para el mantenimiento general de la salud.'
      },
      {
        question: '¿Este suplemento puede causar problemas digestivos?',
        answer: 'Hemos formulado este producto con formas de calcio y magnesio que son generalmente bien toleradas. El citrato y glicinato de magnesio son menos propensos a causar efectos laxantes que otras formas como el óxido. Sin embargo, si experimenta molestias, recomendamos dividir la dosis durante el día y tomarla con alimentos.'
      },
      {
        question: '¿Quiénes se benefician más de la suplementación con calcio-magnesio?',
        answer: 'Este suplemento es especialmente beneficioso para: mujeres postmenopáusicas y personas mayores (prevención de pérdida ósea), personas con dietas bajas en lácteos o alimentos ricos en estos minerales, individuos activos físicamente (recuperación muscular y prevención de calambres), personas con estrés crónico (el magnesio se depleta con el estrés), y quienes sufren de trastornos del sueño (el magnesio promueve la relajación).'
      }
    ]
  },
  // Salud Articular
  {
    id: "5",
    name: 'Glucosamina y Condroitina',
    categories: ['salud-articular'],
    price: 34.99,
    description:
      'Fórmula completa para el mantenimiento y la salud de las articulaciones.',
    images: [
      {
        thumbnail: '/Jpeg/Glucosamine Chondroitin Anverso.jpg',
        full: '/Jpeg/Glucosamine Chondroitin Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Glucosamine Chondroitin Reverso.jpg',
        full: '/Jpeg/Glucosamine Chondroitin Reverso.jpg',
      },
    ],
    stock: 60,
    sku: 'GLUCON',
    tags: ['articulaciones', 'cartilago'],
    // Información para pestañas
    detailedDescription: 'La fórmula avanzada de Glucosamina y Condroitina combina dos compuestos fundamentales para la salud articular en dosis clínicamente estudiadas. La glucosamina, un aminoazúcar natural presente en el cartílago, se presenta en su forma de sulfato de alta biodisponibilidad (1500mg), mientras que la condroitina sulfato (1200mg) es un componente estructural clave del cartílago que ayuda a retener agua y nutrientes. Esta sinergia se potencia con la adición de MSM (Metilsulfonilmetano), un compuesto de azufre orgánico que apoya la flexibilidad de las articulaciones, junto con extractos naturales de cúrcuma y jengibre conocidos por sus propiedades antiinflamatorias. El resultado es un suplemento integral que no solo promueve la regeneración del cartílago, sino que también ayuda a mantener la lubricación articular y reduce la inflamación asociada con el uso diario, el ejercicio y el proceso natural de envejecimiento.',
    mechanismOfAction: 'La glucosamina y la condroitina actúan en sinergia para mantener y restaurar la salud del cartílago articular. La glucosamina sulfato es un precursor esencial para la síntesis de glucosaminoglucanos y proteoglicanos, componentes estructurales fundamentales del cartílago. Proporciona los bloques de construcción necesarios para la formación y reparación del tejido cartilaginoso. La condroitina sulfato, por su parte, atrae y retiene agua dentro del cartílago, creando un efecto amortiguador que absorbe los impactos mientras mejora la elasticidad y resistencia del tejido. También inhibe ciertas enzimas que degradan el cartílago y promueve la síntesis de ácido hialurónico, componente esencial del líquido sinovial que lubrica las articulaciones. El MSM aporta azufre orgánico, necesario para la formación de enlaces cruzados en el colágeno, mejorando la integridad estructural del tejido conectivo. Los extractos de cúrcuma y jengibre complementan estos efectos al modular las vías inflamatorias, reduciendo la producción de citoquinas proinflamatorias y enzimas que contribuyen al deterioro articular.',
    benefitsDescription: [
      'Apoyo a la regeneración y mantenimiento del cartílago articular',
      'Mejora de la movilidad y flexibilidad de las articulaciones',
      'Reducción del dolor e incomodidad asociados con el uso y el envejecimiento',
      'Amortiguación del impacto y protección contra el desgaste articular',
      'Disminución de la inflamación y el estrés oxidativo en las articulaciones',
      'Mejora de la calidad y viscosidad del líquido sinovial'
    ],
    healthIssues: [
      'Desgaste articular relacionado con la edad o el uso',
      'Molestias articulares después del ejercicio o actividad física',
      'Rigidez articular matutina o después de períodos de inactividad',
      'Recuperación después de lesiones articulares menores',
      'Apoyo preventivo para personas con predisposición a problemas articulares',
      'Mantenimiento de la salud articular en atletas y personas activas'
    ],
    components: [
      {
        name: 'Glucosamina Sulfato',
        description: 'Forma altamente biodisponible de glucosamina derivada de mariscos, que proporciona los bloques fundamentales para la síntesis de cartílago.',
        amount: '1500 mg'
      },
      {
        name: 'Condroitina Sulfato',
        description: 'Compuesto que mejora la elasticidad del cartílago y bloquea las enzimas que lo degradan. Ayuda a mantener la hidratación del tejido articular.',
        amount: '1200 mg'
      },
      {
        name: 'MSM (Metilsulfonilmetano)',
        description: 'Compuesto orgánico de azufre que apoya la formación de enlaces disulfuro en el tejido conectivo, mejorando la flexibilidad y reduciendo la inflamación.',
        amount: '500 mg'
      },
      {
        name: 'Extracto de Cúrcuma (estandarizado al 95% de curcuminoides)',
        description: 'Potente antiinflamatorio natural que inhibe diversas vías inflamatorias implicadas en el dolor articular.',
        amount: '100 mg'
      },
      {
        name: 'Extracto de Jengibre',
        description: 'Apoya la reducción de la inflamación y proporciona compuestos antioxidantes que protegen las articulaciones.',
        amount: '50 mg'
      }
    ],
    dosage: 'Tomar 3 comprimidos al día, preferiblemente distribuidos a lo largo del día con las comidas (1 con el desayuno, 1 con el almuerzo y 1 con la cena). Durante las primeras 4-6 semanas puede tomarse una dosis de carga de 4 comprimidos diarios para acelerar la acumulación de estos nutrientes en los tejidos articulares. Los resultados óptimos generalmente se observan después de 2-3 meses de uso regular.',
    administrationMethod: 'Ingerir los comprimidos con un vaso completo de agua durante las comidas para mejorar la absorción y reducir cualquier posible malestar estomacal. La glucosamina y la condroitina son compuestos de absorción lenta, por lo que mantener niveles constantes en sangre mediante dosis divididas puede optimizar sus beneficios. Para personas sensibles, comenzar con una dosis menor e ir aumentando gradualmente puede mejorar la tolerancia.',
    faqs: [
      {
        question: '¿Cuánto tiempo debo tomar este suplemento antes de notar resultados?',
        answer: 'La glucosamina y la condroitina actúan gradualmente, acumulándose en los tejidos articulares con el tiempo. Aunque algunas personas experimentan alivio después de 2-4 semanas, los estudios científicos sugieren que los beneficios óptimos se observan después de 2-3 meses de uso consistente. Los efectos son acumulativos, por lo que la suplementación regular a largo plazo proporciona los mejores resultados para la salud articular.'
      },
      {
        question: '¿Este suplemento es adecuado para vegetarianos o veganos?',
        answer: 'Esta fórmula específica no es adecuada para vegetarianos o veganos, ya que la glucosamina se deriva de mariscos (exoesqueletos de crustáceos) y la condroitina típicamente se obtiene de cartílago bovino o porcino. Las personas con alergias a mariscos deben tener precaución y consultar con un profesional de la salud antes de usarla.'
      },
      {
        question: '¿Puedo tomar este suplemento si estoy tomando anticoagulantes?',
        answer: 'La glucosamina y la condroitina pueden tener un leve efecto anticoagulante, que podría potencialmente interactuar con medicamentos como la warfarina. Además, los componentes antiinflamatorios como la cúrcuma también pueden influir en la coagulación. Si está tomando anticoagulantes o tiene un trastorno de coagulación, consulte con su médico antes de usar este suplemento.'
      },
      {
        question: '¿Es seguro tomar este suplemento junto con medicamentos antiinflamatorios (AINE)?',
        answer: 'Generalmente, se considera seguro tomar glucosamina y condroitina junto con medicamentos antiinflamatorios no esteroideos (AINE) como el ibuprofeno. De hecho, algunos estudios sugieren que esta combinación puede permitir reducir la dosis de AINE necesaria para el control del dolor. Sin embargo, siempre es aconsejable consultar con un profesional de la salud antes de combinar suplementos con medicamentos.'
      },
      {
        question: '¿Este suplemento contiene ingredientes que puedan afectar los niveles de azúcar en sangre?',
        answer: 'Algunos estudios han sugerido que la glucosamina podría afectar el metabolismo de la glucosa en algunas personas. Aunque el efecto es generalmente leve, las personas con diabetes o resistencia a la insulina deben monitorear sus niveles de azúcar en sangre cuando comiencen a tomar este suplemento y consultar con su médico si notan cambios significativos.'
      }
    ]
  },
  // Salud Digestiva
  {
    id: "6",
    name: 'Ultimate Flora',
    categories: ['salud-digestiva'],
    price: 39.99,
    description:
      'Probiótico de amplio espectro para una salud digestiva óptima.',
    images: [
      {
        thumbnail: '/Jpeg/Immune Probiotic Go Pack Anverso.jpg',
        full: '/Jpeg/Immune Probiotic Go Pack Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Immune Probiotic Go Pack Reverso.jpg',
        full: '/Jpeg/Immune Probiotic Go Pack Reverso.jpg',
      },
    ],
    stock: 75,
    sku: 'ULTFLORA',
    tags: ['probiotico', 'digestivo', 'flora-intestinal'],
    // Información para pestañas
    detailedDescription: 'Ultimate Flora es un probiótico de amplio espectro con 50 mil millones de UFC (Unidades Formadoras de Colonias) por cápsula, que contiene 12 cepas clínicamente estudiadas pertenecientes a los géneros Lactobacillus y Bifidobacterium. Esta potente fórmula ha sido diseñada para repoblar el tracto digestivo con bacterias beneficiosas que apoyan el equilibrio de la microbiota intestinal. La diversidad de cepas asegura que cada sección del sistema digestivo reciba los probióticos específicos que necesita: las cepas de Lactobacillus principalmente colonizan el intestino delgado, mientras que las Bifidobacterium actúan principalmente en el colon. Las cápsulas utilizan tecnología de liberación dirigida con recubrimiento entérico que protege las bacterias beneficiosas del ácido estomacal, asegurando que lleguen vivas e intactas al intestino donde pueden ejercer sus efectos beneficiosos.',
    mechanismOfAction: 'Ultimate Flora actúa a través de múltiples mecanismos para restaurar y mantener la salud intestinal. Las bacterias probióticas compiten con los patógenos por los sitios de adhesión en la pared intestinal, creando un efecto barrera que previene la colonización por microorganismos dañinos. También producen ácidos grasos de cadena corta (como butirato, propionato y acetato) mediante la fermentación de fibras, los cuales nutren las células del colon, reducen la inflamación y mantienen un pH intestinal adecuado que inhibe el crecimiento de bacterias perjudiciales. Además, algunas cepas específicas producen bacteriocinas, compuestos antimicrobianos naturales que inhiben directamente el crecimiento de patógenos. Los probióticos también modulan el sistema inmunológico intestinal (GALT - tejido linfoide asociado al intestino), que representa aproximadamente el 70% del sistema inmunitario del cuerpo, mejorando la función de barrera intestinal y regulando las respuestas inflamatorias locales y sistémicas. Por último, ciertas cepas influyen en el eje intestino-cerebro, afectando positivamente la producción de neurotransmisores y la comunicación neuronal.',
    benefitsDescription: [
      'Restauración del equilibrio de la microbiota intestinal después de alteraciones como el uso de antibióticos',
      'Mejora de la digestión y absorción de nutrientes, reduciendo síntomas como hinchazón y gases',
      'Fortalecimiento del sistema inmunológico intestinal y sistémico',
      'Reducción de la inflamación intestinal y alivio de síntomas de trastornos digestivos',
      'Apoyo a la regulación intestinal, mejorando tanto el estreñimiento como la diarrea',
      'Contribución a la salud mental a través del eje intestino-cerebro'
    ],
    healthIssues: [
      'Síndrome del intestino irritable (SII) y malestar digestivo crónico',
      'Diarrea asociada a antibióticos o infecciones',
      'Estreñimiento crónico o irregular',
      'Hinchazón, gases y distensión abdominal',
      'Intolerancia a la lactosa y dificultades digestivas',
      'Disbiosis intestinal y crecimiento bacteriano excesivo'
    ],
    components: [
      {
        name: 'Complejo de Bifidobacterium (30 mil millones de UFC)',
        description: 'Contiene B. lactis, B. breve, B. longum y B. bifidum. Estas cepas colonizan principalmente el colon, donde fermentan fibras y producen ácidos grasos de cadena corta beneficiosos. Particularmente efectivas para el estreñimiento y la salud del colon.',
        amount: '30 mil millones de UFC'
      },
      {
        name: 'Complejo de Lactobacillus (20 mil millones de UFC)',
        description: 'Incluye L. acidophilus, L. rhamnosus, L. plantarum, L. casei, L. salivarius, L. bulgaricus, L. gasseri y L. paracasei. Estas cepas colonizan principalmente el intestino delgado, apoyan la digestión de lácteos y protegen contra patógenos.',
        amount: '20 mil millones de UFC'
      },
      {
        name: 'Inulina de achicoria (prebiótico)',
        description: 'Fibra soluble que sirve como alimento para las bacterias probióticas, ayudando a su establecimiento y proliferación en el intestino.',
        amount: '100 mg'
      },
      {
        name: 'Cápsula vegetariana con recubrimiento entérico',
        description: 'Protege los probióticos del ácido estomacal, asegurando que lleguen vivos al intestino donde pueden ejercer sus efectos beneficiosos.',
        amount: ''
      }
    ],
    dosage: 'Tomar 1 cápsula al día, preferiblemente con el estómago vacío por la mañana o antes de acostarse. Para condiciones agudas o después de un ciclo de antibióticos, se puede aumentar temporalmente a 2 cápsulas diarias (mañana y noche) durante 2 semanas. Para mantenimiento a largo plazo, 1 cápsula al día es suficiente.',
    administrationMethod: 'Ingerir la cápsula entera con un vaso de agua, preferiblemente con el estómago vacío (30 minutos antes de comer o 2 horas después) para maximizar la supervivencia de los probióticos a través del ambiente ácido del estómago. Para personas sensibles, puede tomarse con una comida ligera. Almacenar en el refrigerador para mantener la potencia y viabilidad de las bacterias, especialmente en climas cálidos.',
    faqs: [
      {
        question: '¿Es seguro tomar probióticos mientras estoy tomando antibióticos?',
        answer: 'Sí, de hecho es especialmente beneficioso tomar probióticos durante y después de un tratamiento con antibióticos para repoblar la flora intestinal. Sin embargo, para maximizar la eficacia, se recomienda separar la toma de ambos por al menos 2 horas. Idealmente, continúe con los probióticos durante al menos 2 semanas después de terminar los antibióticos para restaurar completamente su microbiota.'
      },
      {
        question: '¿Por qué este probiótico necesita refrigeración?',
        answer: 'Ultimate Flora contiene bacterias vivas que son sensibles al calor, la humedad y la luz. La refrigeración ayuda a preservar la viabilidad y potencia de estas cepas probióticas, asegurando que reciba la cantidad completa de UFC indicada en la etiqueta hasta la fecha de caducidad. Aunque el producto es estable a temperatura ambiente durante períodos cortos (como durante el transporte o un viaje), el almacenamiento a largo plazo debe ser en refrigeración.'
      },
      {
        question: '¿Cuánto tiempo debo tomar este probiótico para ver resultados?',
        answer: 'Los efectos varían según la persona y la condición específica. Algunos usuarios experimentan mejoras en los síntomas digestivos en los primeros días, mientras que efectos más profundos en el equilibrio de la microbiota pueden tomar de 4 a 8 semanas de uso consistente. Para condiciones crónicas, se recomienda un mínimo de 3 meses de suplementación seguida de una evaluación de los resultados.'
      },
      {
        question: '¿Puedo abrir la cápsula y mezclar el contenido con alimentos o bebidas?',
        answer: 'No se recomienda abrir las cápsulas, ya que el recubrimiento entérico está diseñado específicamente para proteger las bacterias del ácido estomacal. Si tiene dificultad para tragar cápsulas, consulte sobre nuestras formulaciones probióticas en polvo que están diseñadas para mezclar con alimentos o bebidas.'
      },
      {
        question: '¿Pueden los niños tomar este probiótico?',
        answer: 'Ultimate Flora está formulado con una alta potencia (50 mil millones de UFC) dirigida a adultos. Para niños menores de 12 años, recomendamos nuestras formulaciones específicas para niños que contienen cepas y dosis adaptadas a sus necesidades. Consulte siempre con un pediatra antes de dar suplementos probióticos a niños pequeños.'
      }
    ]
  },
  {
    id: "7",
    name: 'Digestive Duo',
    categories: ['salud-digestiva'],
    price: 32.99,
    description: 'Combinación de enzimas digestivas para una mejor digestión.',
    images: [
      {
        thumbnail: '/Jpeg/Digestive_Duo_Anverso.jpg',
        full: '/Jpeg/Digestive_Duo_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Digestive Duo Etiqueta_reducida_500x500.jpg',
        full: '/Jpeg/Digestive Duo Etiqueta_reducida_500x500.jpg',
      },
    ],
    stock: 65,
    sku: 'DIGIDUO',
    tags: ['enzimas', 'digestivo'],
    // Información para pestañas
    detailedDescription: 'Digestive Duo es una fórmula avanzada que combina un potente complejo de enzimas digestivas con probióticos seleccionados para ofrecer un apoyo digestivo integral. Cada cápsula contiene una mezcla de enzimas vegetales (amilasa, proteasa, lipasa, lactasa, celulasa y más) que ayudan a descomponer eficientemente proteínas, grasas, carbohidratos, fibra y lácteos. Este enfoque de amplio espectro asegura una digestión completa de todos los grupos de alimentos, reduciendo la carga digestiva y maximizando la absorción de nutrientes. El componente probiótico incluye 5 mil millones de UFC de cepas resistentes al ácido que complementan la acción enzimática, contribuyendo al equilibrio de la microbiota y la salud intestinal general. La fórmula está diseñada para aliviar molestias digestivas comunes como hinchazón, gases, pesadez y malestar después de las comidas, mientras apoya la función digestiva óptima a largo plazo.',
    mechanismOfAction: 'Digestive Duo actúa a través de dos mecanismos complementarios que trabajan sinérgicamente para optimizar la digestión. En primer lugar, el complejo enzimático funciona en diferentes puntos del tracto digestivo para descomponer eficazmente los macronutrientes en sus componentes básicos. La amilasa comienza a degradar los carbohidratos complejos en la boca y continúa en el intestino delgado; las proteasas descomponen las proteínas en aminoácidos; la lipasa fragmenta las grasas en ácidos grasos; y enzimas específicas como la lactasa y la alfa-galactosidasa ayudan a procesar azúcares difíciles de digerir presentes en lácteos y legumbres respectivamente. Este proceso facilita una digestión más completa, reduciendo la cantidad de alimentos no digeridos que podrían fermentar en el colon y causar malestar. Paralelamente, los probióticos trabajan reforzando la microbiota intestinal, mejorando el ambiente del colon, produciendo enzimas adicionales y ácidos grasos de cadena corta que nutren las células intestinales, fortaleciendo la barrera intestinal y regulando la respuesta inmune local. Juntos, estos dos componentes crean un sistema digestivo más eficiente y equilibrado.',
    benefitsDescription: [
      'Mejora de la digestión de todos los grupos de alimentos, incluyendo aquellos difíciles de procesar',
      'Reducción significativa de síntomas como hinchazón, gases y pesadez después de las comidas',
      'Aumento de la absorción de nutrientes esenciales gracias a una digestión más completa',
      'Alivio de la intolerancia a lactosa y otros azúcares específicos',
      'Apoyo para la digestión de alimentos ricos en fibra y proteína',
      'Contribución al equilibrio de la microbiota intestinal y la salud digestiva a largo plazo'
    ],
    healthIssues: [
      'Digestión ineficiente y malestar postprandial',
      'Intolerancia a lactosa y dificultad para digerir productos lácteos',
      'Hinchazón, gases y distensión abdominal después de las comidas',
      'Sensibilidad a alimentos específicos como legumbres, cereales o proteínas',
      'Insuficiencia pancreática leve y producción reducida de enzimas digestivas',
      'Cambios digestivos relacionados con la edad o el estrés'
    ],
    components: [
      {
        name: 'Complejo enzimático DigestZyme®',
        description: 'Mezcla patentada de enzimas vegetales de amplio espectro que actúan sobre diferentes grupos de alimentos, optimizando la digestión completa de la dieta.',
        amount: '300 mg'
      },
      {
        name: 'Amilasa',
        description: 'Descompone los carbohidratos complejos y almidones en azúcares más simples como maltosa y glucosa.',
        amount: '10,000 DU (Unidades Diastásicas)'
      },
      {
        name: 'Proteasa',
        description: 'Fragmenta proteínas en péptidos y aminoácidos más pequeños para facilitar su absorción.',
        amount: '50,000 HUT (Unidades de Actividad Hemoglobina)'
      },
      {
        name: 'Lipasa',
        description: 'Ayuda a descomponer las grasas en ácidos grasos y glicerol, facilitando su digestión y absorción.',
        amount: '3,000 FIP (Unidades Lipasa)'
      },
      {
        name: 'Lactasa',
        description: 'Descompone la lactosa (azúcar de la leche) en glucosa y galactosa, aliviando los síntomas de intolerancia a lactosa.',
        amount: '1,000 ALU (Unidades Lactasa)'
      },
      {
        name: 'Celulasa',
        description: 'Ayuda a descomponer la celulosa y otras fibras vegetales que el cuerpo humano no puede digerir naturalmente.',
        amount: '500 CU (Unidades Celulasa)'
      },
      {
        name: 'Complejo probiótico (Lactobacillus acidophilus, Bifidobacterium lactis, Lactobacillus rhamnosus)',
        description: 'Cepas seleccionadas por su resistencia al ácido estomacal y su capacidad para complementar la acción enzimática.',
        amount: '5 mil millones de UFC (Unidades Formadoras de Colonias)'
      }
    ],
    dosage: 'Tomar 1 cápsula al comienzo de cada comida principal. Para comidas especialmente pesadas o problemáticas, se puede aumentar a 2 cápsulas. La dosis máxima recomendada es de 6 cápsulas al día. Para obtener beneficios digestivos óptimos, es importante tomar el suplemento justo antes o al inicio de la comida, ya que las enzimas necesitan estar presentes cuando el alimento llega al estómago e intestino.',
    administrationMethod: 'Ingerir la cápsula con un vaso de agua al comienzo de la comida para que las enzimas puedan actuar eficazmente durante el proceso digestivo. La temperatura óptima para la actividad enzimática coincide con la temperatura corporal, por lo que la activación ocurrirá naturalmente en el tracto digestivo. Para personas con dificultad para tragar cápsulas, estas pueden abrirse y mezclarse con una pequeña cantidad de alimento o líquido tibio (no caliente, ya que las altas temperaturas pueden degradar las enzimas).',
    faqs: [
      {
        question: '¿Es seguro tomar enzimas digestivas a diario?',
        answer: 'Para la mayoría de las personas, tomar enzimas digestivas diariamente es seguro y puede ser beneficioso, especialmente para quienes experimentan malestar digestivo regularmente. Sin embargo, las personas con ciertas condiciones médicas como pancreatitis aguda, úlceras sangrantes o alergias a los componentes del suplemento, deberían consultar con un profesional de la salud antes de su uso continuado. El uso prolongado no genera dependencia ni disminuye la producción natural de enzimas del organismo.'
      },
      {
        question: '¿Cuál es la diferencia entre tomar probióticos y enzimas digestivas?',
        answer: 'Aunque ambos apoyan la salud digestiva, funcionan de manera diferente. Las enzimas digestivas actúan directamente sobre los alimentos para ayudar a descomponerlos en componentes más pequeños y fáciles de absorber, aliviando así síntomas inmediatos como hinchazón o pesadez. Los probióticos, por otro lado, son microorganismos vivos que colonizan el intestino, mejorando el equilibrio de la microbiota y ofreciendo beneficios a largo plazo para la salud digestiva e inmunológica. Digestive Duo combina ambos para proporcionar tanto alivio inmediato como beneficios sostenidos.'
      },
      {
        question: '¿Puedo tomar este suplemento si soy vegetariano o vegano?',
        answer: 'Digestive Duo utiliza enzimas de origen vegetal (derivadas de hongos y bacterias) y no contiene componentes de origen animal en su complejo enzimático. Sin embargo, la cápsula está hecha de gelatina bovina, por lo que no es adecuada para vegetarianos estrictos o veganos. Estamos desarrollando una versión con cápsulas vegetarianas que estará disponible próximamente.'
      },
      {
        question: '¿Este producto puede ayudarme con mi intolerancia a la lactosa?',
        answer: 'Sí, Digestive Duo contiene lactasa, la enzima específica que descompone la lactosa en azúcares simples que el cuerpo puede absorber fácilmente. Muchas personas con intolerancia a la lactosa experimentan una reducción significativa de síntomas como hinchazón, gases y malestar cuando toman este suplemento antes de consumir productos lácteos. Sin embargo, la efectividad puede variar según el grado de intolerancia y la cantidad de lácteos consumidos.'
      },
      {
        question: '¿Cuánto tiempo tarda en hacer efecto?',
        answer: 'Las enzimas comienzan a trabajar inmediatamente al entrar en contacto con los alimentos, por lo que muchas personas notan una mejora en la digestión y una reducción de los síntomas como hinchazón y pesadez después de la primera dosis. El componente probiótico puede tomar más tiempo para establecerse y ofrecer beneficios completos, generalmente entre 2-4 semanas de uso regular. Para condiciones digestivas crónicas, se recomienda un uso consistente durante al menos un mes para evaluar todos los beneficios.'
      }
    ]
  },
  {
    id: "8",
    name: 'Cleanse More',
    categories: ['salud-digestiva'],
    price: 28.99,
    description:
      'Fórmula natural para apoyar la limpieza intestinal y la regularidad.',
    images: [
      {
        thumbnail: '/Jpeg/Cleanse_More_Anverso.jpg',
        full: '/Jpeg/Cleanse_More_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/cleanse_more_500x500.jpg',
        full: '/Jpeg/cleanse_more_500x500.jpg',
      },
    ],
    stock: 50,
    sku: 'CLEANSEM',
    tags: ['detox', 'limpieza', 'digestivo'],
    // Información para pestañas
    detailedDescription: 'Cleanse More es una fórmula avanzada de limpieza intestinal que combina hierbas tradicionales con nutrientes modernos para promover una desintoxicación suave pero efectiva del tracto digestivo. A diferencia de los laxantes agresivos que pueden causar dependencia, esta fórmula trabaja de forma sinérgica para restaurar el movimiento intestinal natural, hidratar el colon, eliminar toxinas acumuladas y promover un ambiente intestinal saludable. Su diseño único no solo apoya la regularidad intestinal, sino que también nutre la flora intestinal beneficiosa y fortalece los músculos del colon para una función digestiva óptima a largo plazo. Cleanse More es ideal para personas que experimentan estreñimiento ocasional, se sienten "bloqueadas", están comenzando un programa de desintoxicación o simplemente desean una limpieza intestinal profunda para renovar su sistema digestivo. La fórmula también contiene electrolitos y minerales esenciales para prevenir desequilibrios durante el proceso de limpieza.',
    mechanismOfAction: 'Cleanse More funciona a través de múltiples mecanismos complementarios que promueven una limpieza intestinal completa y natural. En primer lugar, las hierbas como la cáscara sagrada y la hoja de sen contienen antraquinonas que estimulan suavemente los plexos nerviosos del colon, aumentando las contracciones peristálticas y facilitando el movimiento intestinal sin crear dependencia. El magnesio, en sus formas de óxido e hidróxido, actúa como un laxante osmótico que atrae agua al intestino, ablandando las heces y facilitando su paso. Paralelamente, la raíz de malvavisco y el psilio proporcionan mucílago, una fibra soluble que forma un gel hidratante que lubrica el tracto digestivo y aumenta el volumen de las heces. Los probióticos específicos incluidos en la fórmula ayudan a equilibrar la microbiota intestinal, mejorando la producción de ácidos grasos de cadena corta que nutren las células del colon y regulan su función. Los componentes minerales como el potasio y el magnesio ayudan a mantener el equilibrio electrolítico, crucial durante cualquier proceso de limpieza, mientras que los antioxidantes de las hierbas protegen el revestimiento intestinal del estrés oxidativo asociado con la desintoxicación.',
    benefitsDescription: [
      'Promueve la regularidad intestinal de forma suave y efectiva sin causar dependencia',
      'Elimina toxinas y residuos acumulados en el tracto digestivo',
      'Hidrata y lubrica el colon para una función óptima',
      'Apoya el equilibrio de la flora intestinal beneficiosa',
      'Reduce la hinchazón abdominal y la sensación de pesadez',
      'Mejora la absorción de nutrientes al optimizar la salud intestinal'
    ],
    healthIssues: [
      'Estreñimiento ocasional o crónico',
      'Tránsito intestinal lento',
      'Hinchazón y distensión abdominal',
      'Acumulación de toxinas y desechos en el colon',
      'Preparación para programas de desintoxicación',
      'Desequilibrios de la microbiota intestinal'
    ],
    components: [
      {
        name: 'Magnesio (como óxido e hidróxido)',
        description: 'Mineral esencial que actúa como laxante osmótico suave, atrayendo agua al intestino para ablandar las heces y estimular el movimiento intestinal.',
        amount: '400 mg (100% del Valor Diario)'
      },
      {
        name: 'Cáscara Sagrada (Rhamnus purshiana)',
        description: 'Hierba tradicionalmente utilizada para estimular suavemente el peristaltismo intestinal. Contiene antraquinonas que promueven las contracciones musculares del colon.',
        amount: '300 mg'
      },
      {
        name: 'Hoja de Sen (Senna alexandrina)',
        description: 'Planta con propiedades laxantes suaves que estimula la motilidad intestinal y facilita la evacuación.',
        amount: '200 mg'
      },
      {
        name: 'Raíz de Malvavisco (Althaea officinalis)',
        description: 'Rica en mucílago que forma un gel protector en el revestimiento intestinal, proporcionando un efecto calmante y lubricante.',
        amount: '150 mg'
      },
      {
        name: 'Semillas de Psilio (Plantago ovata)',
        description: 'Fibra soluble que absorbe agua, aumenta el volumen de las heces y facilita su paso a través del tracto intestinal.',
        amount: '100 mg'
      },
      {
        name: 'Aloe Vera (gel interno de la hoja)',
        description: 'Ayuda a suavizar el paso de las heces mientras calma el revestimiento intestinal y reduce la inflamación.',
        amount: '50 mg'
      },
      {
        name: 'Mezcla probiótica (L. acidophilus, B. bifidum)',
        description: 'Bacterias beneficiosas que apoyan la salud del microbioma intestinal durante el proceso de limpieza.',
        amount: '2 mil millones de UFC'
      }
    ],
    dosage: 'Comenzar con 1 cápsula al día, preferiblemente antes de acostarse con un vaso grande de agua. La dosis puede aumentarse gradualmente hasta 2 cápsulas si es necesario. No exceder de 2 cápsulas en 24 horas a menos que sea recomendado por un profesional de la salud. Para una limpieza intestinal, usar durante 10-14 días consecutivos, seguido de un descanso de al menos 2 semanas antes de repetir si es necesario.',
    administrationMethod: 'Ingerir la cápsula con al menos 8 onzas (250 ml) de agua. Es crucial mantener una hidratación adecuada (8-10 vasos de agua al día) mientras se usa este producto para optimizar sus efectos y prevenir la deshidratación. Tomar preferentemente por la noche, ya que los efectos suelen comenzar dentro de 6-12 horas. No usar más de dos semanas consecutivas sin consultar a un profesional de la salud.',
    faqs: [
      {
        question: '¿Es seguro usar Cleanse More regularmente?',
        answer: 'Cleanse More está formulado para uso ocasional y no debe utilizarse como solución a largo plazo para el estreñimiento crónico. Recomendamos usarlo por períodos de 10-14 días, seguidos de un descanso de al menos dos semanas. El uso prolongado o frecuente de cualquier producto laxante, incluso los naturales, puede alterar la función intestinal normal y crear dependencia. Si experimenta estreñimiento crónico, es importante abordar las causas subyacentes (dieta, hidratación, actividad física, estrés) y consultar con un profesional de la salud.'
      },
      {
        question: '¿Cuándo debo esperar resultados después de tomar Cleanse More?',
        answer: 'La mayoría de las personas experimentan un movimiento intestinal dentro de 6-12 horas después de tomar el producto, por lo que recomendamos tomarlo por la noche. Sin embargo, los tiempos de respuesta pueden variar según la fisiología individual, la dieta, el nivel de hidratación y la severidad del estreñimiento. Algunas personas con estreñimiento más persistente pueden necesitar 24-48 horas para el primer movimiento intestinal significativo. Si no experimenta resultados después de dos días con la dosis máxima recomendada, discontinúe el uso y consulte a un profesional de la salud.'
      },
      {
        question: '¿Puedo tomar Cleanse More si estoy tomando medicamentos?',
        answer: 'Cleanse More puede alterar la absorción de medicamentos orales debido a su efecto en el tránsito intestinal. Como regla general, tome cualquier medicación al menos 2 horas antes o después de Cleanse More. Sin embargo, para medicamentos con índice terapéutico estrecho (como anticoagulantes, anticonvulsivos, medicamentos para el corazón o la tiroides), consulte con su médico antes de usar este producto. También es importante señalar que las hierbas como la cáscara sagrada y el sen pueden interactuar con ciertos medicamentos, incluyendo diuréticos, corticosteroides y medicamentos cardíacos.'
      },
      {
        question: '¿Experimentaré calambres o malestar con este producto?',
        answer: 'Cleanse More está formulado para proporcionar una limpieza suave con mínimas molestias. Sin embargo, algunas personas pueden experimentar calambres leves, especialmente durante los primeros días de uso o si están particularmente estreñidas. Comenzar con la dosis más baja (1 cápsula) y mantener una buena hidratación ayuda a minimizar cualquier malestar. Si experimenta calambres severos, dolor abdominal, náuseas o diarrea, discontinúe el uso inmediatamente y consulte a un profesional de la salud. Estos síntomas podrían indicar una sensibilidad a alguno de los ingredientes o una condición médica subyacente.'
      },
      {
        question: '¿Cleanse More interferirá con mi microbiota intestinal beneficiosa?',
        answer: 'A diferencia de los laxantes agresivos que pueden alterar significativamente el microbioma, Cleanse More está formulado con una mezcla de probióticos para apoyar la flora intestinal durante el proceso de limpieza. Sin embargo, cualquier cambio significativo en el tránsito intestinal puede causar alteraciones temporales en la microbiota. Para minimizar este efecto, recomendamos tomar un probiótico de alta calidad durante y después de completar el ciclo de limpieza. También es beneficioso incluir alimentos fermentados y ricos en fibra prebiótica en su dieta para nutrir sus bacterias beneficiosas.'
      }
    ]
  },
  // Suplementos Especializados
  {
    id: "9",
    name: 'Ácido Hialurónico',
    categories: ['suplementos-especializados'],
    price: 35.99,
    description: 'Suplemento para el cuidado de la piel y las articulaciones.',
    images: [
      {
        thumbnail: '/Jpeg/Acido_Hialuronico_Anverso.jpg',
        full: '/Jpeg/Acido_Hialuronico_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Acido_Hialuronico_Etiqueta.jpg',
        full: '/Jpeg/Acido_Hialuronico_Etiqueta.jpg',
      },
    ],
    stock: 45,
    sku: 'AHIAL',
    tags: ['piel', 'articulaciones', 'belleza'],
    // Información para pestañas
    detailedDescription: 'El Ácido Hialurónico es un polisacárido natural presente en el cuerpo humano, particularmente concentrado en la piel, articulaciones y tejido conectivo. Nuestra fórmula avanzada contiene 200mg de ácido hialurónico de bajo peso molecular (50-150 kDa), específicamente diseñado para una óptima biodisponibilidad y absorción en el organismo. Esta molécula extraordinaria tiene la capacidad única de retener hasta 1000 veces su peso en agua, lo que la convierte en un componente esencial para mantener la hidratación de la piel, la lubricación articular y la elasticidad de los tejidos. A medida que envejecemos, la producción natural de ácido hialurónico disminuye significativamente, contribuyendo a la aparición de arrugas, piel seca y molestias articulares. Este suplemento proporciona un aporte diario que ayuda a restaurar los niveles óptimos, promoviendo una piel radiante y tersa desde el interior, así como una mayor flexibilidad y confort en las articulaciones.',
    mechanismOfAction: 'El ácido hialurónico administrado por vía oral es parcialmente absorbido en el tracto gastrointestinal y distribuido a través del sistema circulatorio a los diferentes tejidos del cuerpo, con afinidad particular por la piel y las articulaciones. Los estudios científicos indican que, aunque es una molécula grande, el ácido hialurónico de bajo peso molecular puede absorberse parcialmente intacto y también a través de sus metabolitos. Una vez en la circulación, se incorpora a la matriz extracelular de la piel, donde atrae y retiene moléculas de agua, mejorando la hidratación, elasticidad y firmeza cutánea. En las articulaciones, se integra al líquido sinovial, aumentando su viscosidad y capacidad lubricante, lo que reduce la fricción entre las superficies articulares y proporciona amortiguación frente a impactos. Además, el ácido hialurónico interactúa con receptores celulares específicos (CD44) que modulan procesos inflamatorios, estimulan la producción de colágeno por los fibroblastos y promueven la regeneración tisular. Este suplemento también incluye vitamina C, que actúa como cofactor esencial en la síntesis endógena de colágeno y contribuye a la regeneración del ácido hialurónico oxidado.',
    benefitsDescription: [
      'Hidratación profunda de la piel desde el interior, reduciendo la apariencia de líneas finas y arrugas',
      'Mejora de la elasticidad y firmeza cutánea, promoviendo un aspecto más juvenil',
      'Lubricación de las articulaciones para un movimiento más fluido y menos molestias',
      'Aumento de la viscosidad del líquido sinovial, protegiendo el cartílago articular',
      'Apoyo a los tejidos conectivos del cuerpo, incluyendo encías, ojos y vasos sanguíneos',
      'Potenciación de los procesos naturales de regeneración de la piel y recuperación tisular'
    ],
    healthIssues: [
      'Envejecimiento cutáneo, sequedad y pérdida de elasticidad de la piel',
      'Arrugas, líneas de expresión y signos visibles de la edad',
      'Molestias articulares asociadas al uso, la edad o actividad física intensa',
      'Rigidez matutina o después de periodos de inactividad',
      'Recuperación después de lesiones articulares menores',
      'Sequedad ocular y otros problemas relacionados con la hidratación tisular'
    ],
    components: [
      {
        name: 'Ácido Hialurónico de bajo peso molecular',
        description: 'Forma altamente biodisponible con peso molecular optimizado (50-150 kDa) para maximizar la absorción oral y distribución a los tejidos diana.',
        amount: '200 mg'
      },
      {
        name: 'Vitamina C (como ascorbato de sodio)',
        description: 'Antioxidante esencial y cofactor necesario para la síntesis de colágeno y la regeneración del ácido hialurónico en los tejidos.',
        amount: '60 mg (100% del Valor Diario)'
      },
      {
        name: 'Extracto de bambú (70% sílice orgánica)',
        description: 'Rica fuente natural de sílice que apoya la producción endógena de ácido hialurónico y refuerza la matriz del tejido conectivo.',
        amount: '25 mg'
      },
      {
        name: 'Coenzima Q10',
        description: 'Antioxidante que protege las células de la piel del estrés oxidativo y apoya la producción de energía celular necesaria para la síntesis de componentes estructurales.',
        amount: '15 mg'
      },
      {
        name: 'Bioperina® (extracto de pimienta negra)',
        description: 'Potenciador natural de la biodisponibilidad que mejora la absorción de los nutrientes, incluyendo el ácido hialurónico.',
        amount: '5 mg'
      }
    ],
    dosage: 'Tomar 1 cápsula al día con agua, preferiblemente con una comida que contenga algo de grasa para mejorar la absorción. Para beneficios óptimos, se recomienda un uso continuado durante al menos 3 meses. Los resultados pueden comenzar a notarse después de 3-4 semanas de uso consistente, con mejoras progresivas a lo largo del tiempo.',
    administrationMethod: 'Ingerir la cápsula entera con un vaso completo de agua, preferentemente durante una comida para maximizar la absorción. La suplementación constante es clave para mantener niveles óptimos en los tejidos, ya que el ácido hialurónico se degrada y renueva constantemente en el organismo. Para potenciar sus efectos, se recomienda mantener una hidratación adecuada (al menos 8 vasos de agua al día) y seguir una dieta rica en antioxidantes que protejan el ácido hialurónico del daño oxidativo.',
    faqs: [
      {
        question: '¿El ácido hialurónico oral realmente llega a la piel o es mejor aplicarlo tópicamente?',
        answer: 'Ambas formas son efectivas pero actúan de manera diferente. El ácido hialurónico tópico proporciona hidratación inmediata a las capas superficiales de la piel, mientras que la suplementación oral puede nutrir la piel desde dentro, llegando a capas más profundas donde los productos tópicos no pueden penetrar. Estudios clínicos han demostrado que el ácido hialurónico de bajo peso molecular, como el utilizado en nuestra fórmula, puede ser parcialmente absorbido y distribuido a los tejidos, incluyendo la dermis. Para resultados óptimos, muchos dermatólogos recomiendan un enfoque combinado: suplementación oral para beneficios sistémicos y profundos, junto con productos tópicos para efectos inmediatos en la superficie.'
      },
      {
        question: '¿Cuánto tiempo tardará en ver resultados en mi piel?',
        answer: 'La mayoría de las personas comienzan a notar mejoras en la hidratación y suavidad de la piel después de 3-4 semanas de uso diario. Los efectos más significativos en la elasticidad, reducción de líneas finas y apariencia general suelen observarse después de 2-3 meses de suplementación consistente. Es importante entender que los resultados son acumulativos y varían según factores individuales como la edad, estilo de vida, genética y estado inicial de la piel. Mantener una buena hidratación, protección solar y una dieta saludable potenciará los beneficios del suplemento.'
      },
      {
        question: '¿Este suplemento puede ayudar con el dolor articular?',
        answer: 'Sí, muchos usuarios reportan una mejora en el confort articular con el uso regular de ácido hialurónico oral. El ácido hialurónico es un componente natural del líquido sinovial que lubrica nuestras articulaciones. La suplementación puede ayudar a aumentar la viscosidad de este líquido, mejorando la amortiguación y reduciendo la fricción entre las superficies articulares. Los estudios sugieren que puede ser particularmente beneficioso para personas con molestias articulares leves a moderadas relacionadas con el uso, el envejecimiento o la actividad física. Sin embargo, para condiciones articulares específicas o dolor severo, siempre es recomendable consultar con un profesional de la salud.'
      },
      {
        question: '¿Es seguro tomar ácido hialurónico durante el embarazo o lactancia?',
        answer: 'Aunque el ácido hialurónico es una sustancia natural presente en el cuerpo y generalmente se considera seguro, no existen suficientes estudios científicos que evalúen específicamente su seguridad durante el embarazo o lactancia cuando se toma como suplemento oral. Como precaución, recomendamos a las mujeres embarazadas o en periodo de lactancia que consulten con su médico antes de comenzar cualquier suplementación. Siempre es mejor ser cauteloso cuando se trata de suplementos durante estas etapas sensibles.'
      },
      {
        question: '¿Existen efectos secundarios o interacciones con medicamentos?',
        answer: 'El ácido hialurónico oral es generalmente bien tolerado y los efectos secundarios son raros. Ocasionalmente, algunas personas pueden experimentar leves molestias digestivas. No se han reportado interacciones significativas con medicamentos, pero dado que puede tener efectos en la coagulación en algunos individuos, las personas que toman anticoagulantes o tienen trastornos de coagulación deben consultar con un profesional de la salud antes de su uso. También se recomienda precaución si está tomando medicamentos inmunosupresores o si tiene historial de alergias a productos derivados de la fermentación microbiana.'
      }
    ]
  },
  {
    id: "10",
    name: 'Triple Extracto de Hongos',
    categories: ['suplementos-especializados'],
    price: 42.99,
    description:
      'Potente mezcla de hongos medicinales para el sistema inmunológico.',
    images: [
      {
        thumbnail: '/Jpeg/Triple_extacto_Hongos_Anverso.jpg',
        full: '/Jpeg/Triple_extacto_Hongos_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/triple_extracto_hongos_500x500.jpg',
        full: '/Jpeg/triple_extracto_hongos_500x500.jpg',
      },
    ],
    stock: 30,
    sku: 'HONGOS',
    tags: ['inmunidad', 'adaptogeno'],
    // Información para pestañas
    detailedDescription: 'Triple Extracto de Hongos es una formulación avanzada que combina tres de los hongos medicinales más estudiados y respetados en la micoterapia tradicional: Reishi (Ganoderma lucidum), Shiitake (Lentinula edodes) y Maitake (Grifola frondosa). Cada uno de estos hongos ha sido utilizado durante milenios en las medicinas tradicionales de Asia, particularmente en China y Japón, donde se les conoce como "hongos de la inmortalidad" por sus profundos efectos en la longevidad y vitalidad. Nuestra fórmula contiene extractos estandarizados de cuerpos fructíferos completos, cultivados orgánicamente y procesados mediante extracción dual (agua caliente y alcohol) para garantizar el espectro completo de compuestos bioactivos, incluyendo beta-glucanos, triterpenos, polisacáridos, antioxidantes y otros fitonutrientes. Con una concentración de 30% de polisacáridos y 4% de triterpenos, esta potente sinergia de hongos medicinales ofrece un apoyo integral para el sistema inmunológico, la capacidad adaptogénica y la vitalidad general.',
    mechanismOfAction: 'Los hongos medicinales ejercen sus efectos principalmente a través de complejos polisacáridos llamados beta-glucanos, que interactúan con receptores específicos en células inmunitarias como macrófagos, neutrófilos y células Natural Killer (NK). Esta interacción activa vías de señalización que modulan la respuesta inmune, aumentando la vigilancia y eficacia del sistema inmunológico sin sobreestimularlo. El Reishi contiene además triterpenos y ácidos ganodéricos que tienen propiedades inmunomoduladoras y anti-inflamatorias, regulando la producción de citoquinas y factores inflamatorios. El Shiitake aporta lentinano, un beta-glucano específico con potente actividad inmunopotenciadora y capacidad para estimular la producción de interferón. El Maitake contiene el complejo D-fracción, que activa células dendríticas y mejora la comunicación entre el sistema inmune innato y adaptativo. Adicionalmente, estos hongos contienen potentes antioxidantes que neutralizan los radicales libres, compuestos que mejoran la circulación sanguínea, y sustancias adaptogénicas que ayudan al cuerpo a adaptarse al estrés físico y mental, manteniendo el equilibrio homeostático incluso en condiciones adversas.',
    benefitsDescription: [
      'Fortalece y modula el sistema inmunológico, mejorando las defensas naturales del organismo',
      'Proporciona potentes propiedades adaptogénicas que ayudan al cuerpo a adaptarse al estrés',
      'Apoya la función hepática y los procesos naturales de desintoxicación',
      'Contribuye al bienestar cardiovascular, favoreciendo niveles saludables de colesterol y presión arterial',
      'Potencia la energía y vitalidad, combatiendo la fatiga y aumentando la resistencia',
      'Promueve la salud cognitiva y el equilibrio emocional'
    ],
    healthIssues: [
      'Sistemas inmunológicos comprometidos o debilitados',
      'Fatiga crónica y baja energía',
      'Estrés excesivo y dificultad para adaptarse a situaciones estresantes',
      'Procesos inflamatorios recurrentes o crónicos',
      'Recuperación después de enfermedades o tratamientos médicos',
      'Apoyo durante temporadas de alta exigencia física o mental',
      'Exposición frecuente a agentes infecciosos (viajes, trabajo con público, etc.)'
    ],
    components: [
      {
        name: 'Extracto de Reishi (Ganoderma lucidum)',
        description: 'Conocido como el "hongo de la inmortalidad", contiene triterpenos y polisacáridos con propiedades inmunomoduladoras y adaptogénicas. Estandarizado al 30% de polisacáridos y 4% de triterpenos.',
        amount: '200 mg'
      },
      {
        name: 'Extracto de Shiitake (Lentinula edodes)',
        description: 'Rico en lentinano, un beta-glucano con potentes efectos inmunoestimulantes, además de aminoácidos esenciales, minerales y vitaminas del complejo B. Estandarizado al 30% de polisacáridos.',
        amount: '200 mg'
      },
      {
        name: 'Extracto de Maitake (Grifola frondosa)',
        description: 'Contiene la D-fracción, un complejo de polisacáridos único que potencia las células T y células NK del sistema inmunológico. Estandarizado al 30% de polisacáridos.',
        amount: '200 mg'
      },
      {
        name: 'Extracto de raíz de Astragalus (Astragalus membranaceus)',
        description: 'Hierba adaptogénica que complementa los hongos, potenciando la inmunidad y aumentando la resistencia a factores de estrés. Estandarizado al 0.5% de astragalósidos.',
        amount: '100 mg'
      },
      {
        name: 'Vitamina C (como ascorbato de calcio)',
        description: 'Potente antioxidante que trabaja sinérgicamente con los hongos para fortalecer el sistema inmunológico y potenciar la producción de glóbulos blancos.',
        amount: '60 mg (100% del Valor Diario)'
      },
      {
        name: 'Zinc (como bisglicínato de zinc)',
        description: 'Mineral esencial para la función inmunitaria normal y el metabolismo celular, en forma altamente biodisponible.',
        amount: '5 mg (45% del Valor Diario)'
      }
    ],
    dosage: 'Tomar 2 cápsulas al día, preferiblemente con alimentos. Para un efecto inmunológico preventivo, tomar 1 cápsula al día. Durante períodos de mayor necesidad o estrés inmunológico, se puede aumentar temporalmente a 2 cápsulas dos veces al día durante 1-2 semanas. Para obtener beneficios óptimos, se recomienda un uso continuo durante al menos 2-3 meses, ya que los efectos de los hongos medicinales son acumulativos y alcanzan su máximo potencial con el uso consistente.',
    administrationMethod: 'Ingerir las cápsulas con un vaso completo de agua, preferentemente con alimentos para mejorar la absorción de los compuestos liposolubles. Para maximizar los beneficios adaptogénicos, se recomienda tomar la dosis de la mañana con el desayuno. Los hongos medicinales funcionan mejor cuando se integran como parte de un estilo de vida saludable que incluye una alimentación equilibrada, ejercicio regular, hidratación adecuada y manejo del estrés. A diferencia de muchos medicamentos, los hongos medicinales no producen efectos inmediatos, sino que construyen resilencia y vitalidad progresivamente.',
    faqs: [
      {
        question: '¿Cuánto tiempo tardará en notar los efectos de este suplemento?',
        answer: 'Los hongos medicinales funcionan de manera progresiva y acumulativa. Algunas personas notan mejoras en la energía y el bienestar general dentro de 2-3 semanas, mientras que los efectos completos sobre el sistema inmunológico y la capacidad adaptogénica pueden tardar de 2 a 3 meses en manifestarse plenamente. La consistencia es clave; estos hongos han sido tradicionalmente utilizados como tónicos a largo plazo para construir una salud resiliente, más que como soluciones rápidas. Los resultados varían según factores individuales como el estado de salud inicial, la dieta, el estilo de vida y el nivel de estrés. Para condiciones específicas, considere consultar con un profesional de salud que pueda personalizar las recomendaciones.'
      },
      {
        question: '¿Estos hongos son alucinógenos o tienen efectos psicoactivos?',
        answer: 'No, estos hongos medicinales (Reishi, Shiitake y Maitake) no contienen compuestos psicoactivos como la psilocibina presente en los hongos "mágicos". Son completamente diferentes y se han utilizado durante milenios como alimentos funcionales y medicinas tradicionales. El Reishi, Shiitake y Maitake son reconocidos mundialmente por sus propiedades terapéuticas para el sistema inmunológico y la salud general, sin causar ningún efecto psicodélico o alteración de la conciencia. Son seguros para el uso diario, incluso en entornos profesionales, y no afectan las capacidades cognitivas o motoras.'
      },
      {
        question: '¿Puedo tomar este suplemento junto con medicamentos?',
        answer: 'Los hongos medicinales son generalmente seguros y bien tolerados, pero pueden interactuar con ciertos medicamentos. Si está tomando anticoagulantes o antiagregantes plaquetarios (como warfarina, aspirina o clopidogrel), inmunosupresores, medicamentos para la diabetes o para la presión arterial, debe consultar con un profesional de la salud antes de usar este suplemento, ya que podría potenciar sus efectos. También es recomendable una consulta médica si está próximo a someterse a una cirugía, ya que algunos componentes pueden afectar la coagulación sanguínea. Siempre informe a su médico sobre todos los suplementos que está tomando.'
      },
      {
        question: '¿Este suplemento es adecuado para vegetarianos y veganos?',
        answer: 'Sí, este suplemento es completamente adecuado para vegetarianos y veganos. Las cápsulas están hechas de celulosa vegetal (HPMC) y no contienen ingredientes de origen animal. Los hongos medicinales se cultivan en sustratos vegetales orgánicos y se procesan sin utilizar productos animales en ninguna etapa de su producción. Además, no se realizan pruebas en animales para la fabricación de este producto. Todos los excipientes e ingredientes adicionales también son de origen vegetal, haciendo de este un suplemento alineado con una dieta y filosofía vegana.'
      },
      {
        question: '¿Es seguro para uso a largo plazo?',
        answer: 'Sí, estos hongos medicinales tienen un excelente perfil de seguridad para uso prolongado. De hecho, en las tradiciones médicas asiáticas, hongos como el Reishi se han consumido diariamente durante años como "tónicos" para promover la longevidad y el bienestar general. Los estudios modernos confirman su seguridad para uso continuo, con muy pocos efectos secundarios reportados incluso en períodos de consumo de varios años. Como con cualquier suplemento, se recomienda hacer pausas ocasionales (por ejemplo, 1 semana cada 3-4 meses) para permitir que el cuerpo descanse y optimizar la respuesta a los compuestos bioactivos cuando se reinicia el consumo.'
      }
    ]
  },
  {
    id: "11",
    name: 'Mezcla Hígado',
    categories: ['suplementos-especializados'],
    price: 31.99,
    description: 'Fórmula herbal para apoyar la función hepática.',
    images: [
      {
        thumbnail: '/Jpeg/Mezcla_Higado_Anverso.jpg',
        full: '/Jpeg/Mezcla_Higado_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/mezcla_higado_500x500.jpg',
        full: '/Jpeg/mezcla_higado_500x500.jpg',
      },
    ],
    stock: 40,
    sku: 'HIGADO',
    tags: ['detox', 'higado', 'herbal'],
    // Información para pestañas
    detailedDescription: 'Mezcla Hígado es una formulación fitoterapéutica avanzada diseñada específicamente para apoyar la salud hepática integral. Esta sinergia de hierbas cuidadosamente seleccionadas combina el conocimiento de la herbolaria tradicional europea, ayurvédica y china, respaldada por investigaciones científicas modernas. El hígado es el principal órgano detoxificador del cuerpo, responsable de procesar nutrientes, filtrar toxinas, producir proteínas esenciales y almacenar vitaminas. Nuestra fórmula contiene extractos estandarizados de cardo mariano, diente de león, alcachofa, boldo y otros ingredientes reconocidos por su capacidad para estimular la función hepática, proteger los hepatocitos (células del hígado) del daño oxidativo, promover la producción y flujo de bilis, y apoyar los procesos naturales de desintoxicación. Cada ingrediente ha sido seleccionado por su efecto complementario, creando una solución integral para mantener y restaurar la salud óptima del hígado, especialmente en nuestro mundo moderno donde este órgano vital está sometido a numerosas cargas tóxicas.',
    mechanismOfAction: 'Mezcla Hígado actúa a través de múltiples mecanismos complementarios que optimizan la función hepática. La silimarina del cardo mariano estabiliza las membranas celulares de los hepatocitos y estimula la producción de glutatión, el antioxidante principal del hígado, mientras promueve la regeneración de células hepáticas dañadas. Los compuestos amargos del diente de león y la alcachofa (particularmente la cinarina) estimulan el flujo biliar (efecto colerético) y la contracción de la vesícula biliar (efecto colagogo), facilitando la digestión de grasas y la eliminación de toxinas a través de la bilis. El boldo aporta boldina y otros alcaloides que refuerzan estas acciones coleréticas y además ofrecen protección contra el estrés oxidativo. El cúrcuma contribuye con curcuminoides antiinflamatorios que reducen la inflamación hepática y regulan enzimas del citocromo P450, responsables de la desintoxicación de múltiples sustancias. Adicionalmente, el extracto de regaliz aporta glicirricina, que protege contra el daño hepático, mientras que la N-acetilcisteína (NAC) funciona como precursor directo del glutatión, potenciando las fases de conjugación de la detoxificación hepática. Este enfoque multimodal asegura un soporte completo para todas las funciones hepáticas esenciales.',
    benefitsDescription: [
      'Protege las células del hígado contra daños causados por toxinas, medicamentos, alcohol y contaminantes ambientales',
      'Estimula la producción y flujo de bilis, mejorando la digestión de grasas y la eliminación de toxinas',
      'Apoya los procesos naturales de detoxificación hepática (Fases I y II)',
      'Promueve la regeneración del tejido hepático, ayudando a restaurar la función después del estrés metabólico',
      'Reduce la inflamación hepática y ayuda a normalizar los niveles de enzimas hepáticas',
      'Mejora la sensación de energía y vitalidad al optimizar la función de este órgano central del metabolismo'
    ],
    healthIssues: [
      'Sobrecarga metabólica por dieta alta en grasas, azúcares refinados o alimentos procesados',
      'Exposición a toxinas ambientales, pesticidas, metales pesados o productos químicos',
      'Consumo regular o excesivo de alcohol',
      'Uso prolongado de medicamentos que pueden afectar el hígado',
      'Aumento de enzimas hepáticas en análisis sanguíneos',
      'Digestión lenta o dificultad para digerir alimentos grasos',
      'Fatiga inexplicada, niebla mental o cambios en el metabolismo'
    ],
    components: [
      {
        name: 'Extracto de semilla de cardo mariano (Silybum marianum)',
        description: 'Estandarizado al 80% de silimarina, el complejo flavonoide conocido por su potente acción hepatoprotectora y capacidad para estimular la regeneración de las células del hígado.',
        amount: '200 mg'
      },
      {
        name: 'Extracto de raíz de diente de león (Taraxacum officinale)',
        description: 'Rico en compuestos amargos que estimulan la secreción biliar y apoyan la función digestiva, además de aportar inulina que favorece la microbiota intestinal.',
        amount: '150 mg'
      },
      {
        name: 'Extracto de hoja de alcachofa (Cynara scolymus)',
        description: 'Estandarizado al 5% de cinarina, compuesto que aumenta la producción de bilis, ayuda a reducir el colesterol y posee propiedades antioxidantes.',
        amount: '100 mg'
      },
      {
        name: 'Extracto de hoja de boldo (Peumus boldus)',
        description: 'Contiene boldina y otros alcaloides con propiedades coleréticas, colagogas y antioxidantes que favorecen la desintoxicación hepática.',
        amount: '75 mg'
      },
      {
        name: 'Extracto de rizoma de cúrcuma (Curcuma longa)',
        description: 'Estandarizado al 95% de curcuminoides, potentes anti-inflamatorios naturales que protegen el hígado y mejoran el metabolismo lipídico.',
        amount: '50 mg'
      },
      {
        name: 'N-Acetil Cisteína (NAC)',
        description: 'Precursor del glutatión, el principal antioxidante producido por el hígado, esencial para los procesos de desintoxicación de Fase II.',
        amount: '50 mg'
      },
      {
        name: 'Extracto de raíz de regaliz (Glycyrrhiza glabra)',
        description: 'Contiene glicirricina y flavonoides que protegen el hígado y poseen propiedades anti-inflamatorias, en una concentración segura que no afecta la presión arterial.',
        amount: '25 mg'
      }
    ],
    dosage: 'Tomar 2 cápsulas al día, una con el desayuno y otra con la cena. Para un programa intensivo de apoyo hepático, puede aumentarse a 2 cápsulas dos veces al día durante 2-4 semanas, preferiblemente bajo supervisión profesional. Para mantenimiento, una cápsula al día puede ser suficiente. Se recomienda un ciclo de 3 meses seguido de 2-4 semanas de descanso antes de reiniciar si es necesario. Para maximizar los beneficios, tomar 30 minutos antes de las comidas para optimizar el efecto sobre la producción de bilis y la digestión.',
    administrationMethod: 'Ingerir las cápsulas enteras con un vaso grande de agua. Para potenciar sus efectos, se recomienda mantener una hidratación adecuada (al menos 2 litros de agua al día) para facilitar los procesos de eliminación. Como complemento, considerar reducir temporalmente el consumo de alimentos procesados, alcohol, cafeína y azúcares refinados durante el tratamiento. La fórmula es más efectiva cuando se combina con una dieta rica en verduras crucíferas (brócoli, coliflor, col rizada), que contienen compuestos que activan naturalmente las enzimas de detoxificación hepática.',
    faqs: [
      {
        question: '¿Puedo tomar este suplemento si estoy usando medicamentos recetados?',
        answer: 'Algunos componentes de esta fórmula, particularmente el cardo mariano, pueden interactuar con ciertos medicamentos al afectar las enzimas hepáticas del citocromo P450 que participan en su metabolismo. Si está tomando medicamentos recetados, especialmente para diabetes, hipertensión, colesterol alto, anticoagulantes o psicofármacos, consulte con su médico antes de usar este suplemento. Como precaución general, se recomienda separar la toma de este suplemento de otros medicamentos por al menos 2 horas. El regaliz, aunque presente en dosis bajas en esta fórmula, podría potencialmente interactuar con medicamentos para la presión arterial, diuréticos o corticosteroides.'
      },
      {
        question: '¿Cómo sabré si el suplemento está funcionando para mi hígado?',
        answer: 'Los beneficios de este suplemento pueden manifestarse de diversas formas: mejora en la digestión (especialmente de alimentos grasos), aumento de energía, claridad mental, reducción de hinchazón abdominal y mejora en la calidad de la piel. Sin embargo, muchos de los efectos más significativos ocurren a nivel bioquímico y pueden no ser inmediatamente perceptibles. Para una evaluación objetiva, considere realizar análisis de sangre para monitorear enzimas hepáticas (ALT, AST, GGT) antes y después de un ciclo de 2-3 meses. Una reducción en estos valores, si estaban elevados, puede indicar una mejora en la función hepática. Recuerde que los resultados varían según factores individuales como el estado inicial del hígado, dieta, estilo de vida y consistencia de uso.'
      },
      {
        question: '¿Es seguro usar este suplemento para problemas hepáticos diagnosticados como hígado graso o hepatitis?',
        answer: 'Aunque los ingredientes de esta fórmula, especialmente el cardo mariano, han sido estudiados en diversas condiciones hepáticas con resultados prometedores, este suplemento no debe reemplazar el tratamiento médico convencional para enfermedades hepáticas diagnosticadas. Puede considerarse como un complemento al tratamiento prescrito por su médico, pero siempre con su conocimiento y aprobación. En casos de hepatitis viral activa, cirrosis avanzada u otras enfermedades hepáticas graves, consulte siempre con un hepatólogo antes de usar cualquier suplemento. Para condiciones como el hígado graso no alcohólico (NAFLD), este suplemento puede ser particularmente beneficioso como parte de un enfoque integral que incluya cambios en la dieta y el estilo de vida.'
      },
      {
        question: '¿Es normal experimentar cambios digestivos al comenzar este suplemento?',
        answer: 'Sí, es relativamente común experimentar cambios transitorios en los patrones digestivos durante los primeros días de uso. El aumento en la producción y flujo de bilis puede ocasionar heces más frecuentes o ligeramente más blandas. Algunas personas también pueden notar cambios en el color de las heces o la orina debido a los pigmentos naturales de las hierbas y al aumento de la eliminación de toxinas. Estos cambios son generalmente temporales y reflejan la activación de los procesos de desintoxicación. Si experimenta malestar abdominal significativo, diarrea persistente o cualquier otro síntoma preocupante, reduzca la dosis o discontinúe el uso y consulte con un profesional de salud.'
      },
      {
        question: '¿Puedo usar este suplemento como parte de un programa de desintoxicación?',
        answer: 'Absolutamente, este suplemento es ideal como parte de un programa de desintoxicación integral, ya que apoya directamente los mecanismos de detoxificación hepática. Para maximizar sus beneficios en este contexto, considere complementarlo con: 1) Una dieta rica en vegetales frescos y bajos en procesados, 2) Hidratación adecuada (preferiblemente con agua filtrada), 3) Reducción o eliminación temporal de alcohol, cafeína, azúcares refinados y grasas trans, 4) Actividad física moderada para estimular la circulación linfática, y 5) Técnicas de manejo del estrés, ya que el estrés crónico puede afectar negativamente la función hepática. Un programa de desintoxicación completo con este suplemento podría durar entre 2-4 semanas, idealmente bajo la supervisión de un profesional de la salud.'
      }
    ]
  },
  // Salud Femenina
  {
    id: "12",
    name: 'Menopause Plus',
    categories: ['salud-femenina'],
    price: 37.99,
    description: 'Fórmula natural para el apoyo durante la menopausia.',
    images: [
      {
        thumbnail: '/Jpeg/Menopause_Plus_Anverso.jpg',
        full: '/Jpeg/Menopause_Plus_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/menopause_plus_500x500.jpg',
        full: '/Jpeg/menopause_plus_500x500.jpg',
      },
    ],
    stock: 25,
    sku: 'MENOP',
    tags: ['mujer', 'menopausia', 'hormonal'],
    // Información para pestañas
    detailedDescription: 'Menopause Plus es una fórmula sinérgica avanzada, especialmente desarrollada para apoyar a las mujeres durante la transición menopáusica y posmenopáusica. Esta etapa natural de la vida femenina viene acompañada de cambios hormonales significativos que pueden manifestarse como sofocos, sudores nocturnos, alteraciones del sueño, cambios de humor, sequedad vaginal y disminución de la densidad ósea, entre otros síntomas. Nuestra formulación única combina fitoestrógenos naturales, adaptógenos, vitaminas y minerales esenciales que trabajan en armonía para ayudar a equilibrar los niveles hormonales de forma suave y natural, sin los efectos secundarios asociados a la terapia hormonal convencional. Cada ingrediente ha sido cuidadosamente seleccionado basándose en evidencia científica y sabiduría tradicional para abordar de manera integral los diversos aspectos de la menopausia, promoviendo el bienestar físico, emocional y cognitivo durante esta importante transición. Menopause Plus no solo alivia los síntomas incómodos, sino que también apoya la salud ósea, cardiovascular y cognitiva a largo plazo.',
    mechanismOfAction: 'Menopause Plus actúa a través de múltiples mecanismos complementarios para abordar las diversas manifestaciones de la menopausia. Las isoflavonas de soja y trébol rojo funcionan como moduladores selectivos de los receptores de estrógeno (SERMs naturales), que se unen a ciertos receptores estrogénicos en el cuerpo, particularmente los receptores beta, proporcionando un efecto estrogénico suave donde se necesita, sin estimular tejidos sensibles como el útero o las mamas. El cohosh negro (Cimicifuga racemosa) contiene triterpenos que regulan la actividad de los neurotransmisores involucrados en los sofocos y la termorregulación hipotalámica. La salvia posee propiedades estrogénicas leves y efectos inhibidores de la sudoración que ayudan a reducir los sofocos y sudores nocturnos. El ginseng y la ashwagandha actúan como adaptógenos, ayudando al cuerpo a adaptarse al estrés y los cambios hormonales, regulando el eje hipotálamo-hipófisis-adrenal y mejorando la resistencia física y mental. El magnesio y la vitamina D3 trabajan sinérgicamente para mantener la salud ósea, mientras que los antioxidantes como la vitamina E protegen las células del estrés oxidativo aumentado durante la menopausia. Esta combinación integral de mecanismos ofrece un enfoque multifacético para equilibrar los sistemas endocrino, nervioso y cardiovascular durante la transición menopáusica.',
    benefitsDescription: [
      'Reduce significativamente la frecuencia e intensidad de los sofocos y sudores nocturnos',
      'Apoya el equilibrio emocional y mejora los cambios de humor relacionados con las fluctuaciones hormonales',
      'Promueve un sueño reparador y reduce el insomnio asociado a la menopausia',
      'Mantiene la salud ósea y ayuda a prevenir la pérdida de densidad mineral ósea',
      'Apoya la salud cardiovascular y ayuda a mantener niveles saludables de colesterol',
      'Mejora la energía, vitalidad y resistencia física y mental',
      'Contribuye al bienestar general y calidad de vida durante la transición menopáusica'
    ],
    healthIssues: [
      'Sofocos frecuentes o intensos y sudores nocturnos',
      'Alteraciones del sueño y fatiga relacionadas con la menopausia',
      'Cambios de humor, irritabilidad o ansiedad vinculados a cambios hormonales',
      'Sequedad vaginal y disminución de la libido',
      'Preocupación por la salud ósea y prevención de osteoporosis',
      'Dificultades cognitivas como "niebla mental" durante la perimenopausia y menopausia',
      'Deseo de abordar los síntomas menopáusicos con un enfoque natural'
    ],
    components: [
      {
        name: 'Extracto estandarizado de isoflavonas de soja (Glycine max)',
        description: 'Contiene fitoestrógenos naturales (daidzeína, genisteína y gliciteína) que ayudan a modular los receptores de estrógeno y aliviar los síntomas menopáusicos. Estandarizado al 40% de isoflavonas.',
        amount: '150 mg'
      },
      {
        name: 'Extracto de cohosh negro (Cimicifuga racemosa)',
        description: 'Hierba tradicional para el equilibrio hormonal femenino, especialmente efectiva para los sofocos, sudores nocturnos y cambios de humor. Estandarizada al 2.5% de triterpenos glucósidos.',
        amount: '80 mg'
      },
      {
        name: 'Extracto de trébol rojo (Trifolium pratense)',
        description: 'Rica fuente de isoflavonas complementarias (biochanina A y formononetina) que ofrecen beneficios sinérgicos con las isoflavonas de soja. Estandarizado al 8% de isoflavonas.',
        amount: '60 mg'
      },
      {
        name: 'Extracto de raíz de ashwagandha (Withania somnifera)',
        description: 'Adaptógeno que ayuda al cuerpo a gestionar el estrés físico y emocional durante la transición menopáusica. Estandarizado al 5% de withanólidos.',
        amount: '125 mg'
      },
      {
        name: 'Extracto de hoja de salvia (Salvia officinalis)',
        description: 'Tradicionalmente utilizada para reducir los sofocos y la sudoración excesiva, con propiedades estrogénicas suaves. Estandarizada al 2.5% de ácido rosmarínico.',
        amount: '100 mg'
      },
      {
        name: 'Extracto de raíz de ginseng coreano (Panax ginseng)',
        description: 'Apoya la energía, el estado de ánimo y la función cognitiva, ayudando a combatir la fatiga y la "niebla mental". Estandarizado al 5% de ginsenósidos.',
        amount: '50 mg'
      },
      {
        name: 'Vitamina D3 (como colecalciferol)',
        description: 'Esencial para la absorción de calcio y la salud ósea, particularmente importante durante la menopausia cuando aumenta el riesgo de osteoporosis.',
        amount: '20 µg (800 UI, 100% del Valor Diario)'
      },
      {
        name: 'Calcio (como citrato de calcio)',
        description: 'Mineral fundamental para mantener la densidad ósea y prevenir la pérdida de masa ósea acelerada durante la menopausia.',
        amount: '100 mg (8% del Valor Diario)'
      },
      {
        name: 'Magnesio (como bisglicinato de magnesio)',
        description: 'Trabaja en sinergia con el calcio para la salud ósea, además de apoyar la relajación, el sueño y el equilibrio del estado de ánimo.',
        amount: '50 mg (12% del Valor Diario)'
      },
      {
        name: 'Vitamina E (como d-alfa tocoferol natural)',
        description: 'Antioxidante que ayuda a proteger las células del estrés oxidativo y puede contribuir a reducir la intensidad de los sofocos.',
        amount: '10 mg (67% del Valor Diario)'
      }
    ],
    dosage: 'Tomar 2 cápsulas al día, preferiblemente con alimentos. Se recomienda distribuir la dosis tomando 1 cápsula por la mañana y 1 por la noche para mantener niveles estables durante todo el día. Los beneficios comenzarán a notarse gradualmente, con mejoras iniciales en algunas mujeres a partir de las 2-4 semanas, aunque los efectos completos suelen manifestarse después de 8-12 semanas de uso constante. Para resultados óptimos, se recomienda un uso continuado. La fórmula es adecuada para uso a largo plazo sin efectos de habituación.',
    administrationMethod: 'Ingerir las cápsulas enteras con un vaso completo de agua, preferentemente con las comidas para optimizar la absorción de los nutrientes liposolubles e isoflavonas. La consistencia en la toma diaria es importante para mantener niveles estables de los compuestos activos en el organismo. Para potenciar los efectos de la fórmula, se recomienda: 1) Mantener una hidratación adecuada (al menos 1.5-2 litros de agua al día), 2) Seguir una dieta rica en vegetales, frutas, granos enteros y proteínas magras, 3) Reducir el consumo de alcohol, cafeína y alimentos picantes que pueden exacerbar los sofocos, 4) Incorporar actividad física regular, especialmente ejercicios de resistencia para la salud ósea, y 5) Practicar técnicas de manejo del estrés como yoga, meditación o respiración profunda.',
    faqs: [
      {
        question: '¿Cuánto tiempo tardará en hacer efecto este suplemento?',
        answer: 'La respuesta varía entre mujeres y depende de los síntomas específicos. Generalmente, algunas mujeres notan mejoras en los sofocos y sudores nocturnos entre 2-4 semanas de uso consistente. Los beneficios para el estado de ánimo y el sueño suelen manifestarse en un período similar. Sin embargo, los efectos completos, especialmente en los aspectos relacionados con la salud ósea y cardiovascular, pueden tardar 2-3 meses en desarrollarse plenamente. Es importante tener expectativas realistas: este es un enfoque gradual y natural, no una solución instantánea como podría ser la terapia hormonal sintética. La consistencia es clave; se recomienda un período inicial de al menos 3 meses para evaluar adecuadamente la efectividad para su situación personal.'
      },
      {
        question: '¿Puedo tomar este suplemento si estoy utilizando terapia hormonal?',
        answer: 'No se recomienda combinar este suplemento con terapia hormonal sustitutiva (THS) sin supervisión médica, ya que podría haber interacciones entre los fitoestrógenos y las hormonas sintéticas. Si está considerando hacer la transición desde la THS hacia este suplemento natural, consulte con su médico sobre un plan de reducción gradual de la THS antes de comenzar con Menopause Plus. Las mujeres que han dejado la THS deben esperar aproximadamente 2-4 semanas antes de comenzar con este suplemento. Si está utilizando anticonceptivos hormonales durante la perimenopausia, también debe consultar con su médico antes de añadir este suplemento a su régimen.'
      },
      {
        question: '¿Es seguro este suplemento para mujeres con antecedentes de cáncer de mama u otros cánceres sensibles a hormonas?',
        answer: 'Esta es un área que requiere precaución y consideración individualizada. Las isoflavonas y algunos componentes de esta fórmula tienen efectos moduladores de estrógenos, aunque generalmente son selectivos para receptores beta-estrogénicos (con menos efecto en tejidos como mama y útero) y son mucho más débiles que los estrógenos humanos. La investigación actual muestra resultados mixtos, y el consenso médico no es definitivo. Por precaución, las mujeres con historia personal o familiar significativa de cáncer de mama, ovario, útero u otros cánceres hormonodependientes deben consultar con su oncólogo antes de usar este suplemento. Existen alternativas con ingredientes no fitoestrógénicos que podrían ser más apropiadas en estos casos.'
      },
      {
        question: '¿Este suplemento ayudará con la sequedad vaginal y los problemas de intimidad?',
        answer: 'Los fitoestrógenos en esta fórmula pueden ofrecer cierto beneficio para la sequedad vaginal al proporcionar un efecto estrogénico suave en los tejidos vaginales, pero los resultados son variables y generalmente menos pronunciados que con tratamientos locales. Para muchas mujeres, los efectos en este aspecto pueden ser sutiles y requerir un uso más prolongado para notarse. Para problemas significativos de sequedad vaginal o atrofia vulvovaginal, se recomienda complementar este suplemento con hidratantes vaginales o, bajo supervisión médica, estrógenos locales de baja dosis que actúan principalmente en los tejidos locales con mínima absorción sistémica. El bienestar sexual durante la menopausia también se beneficia de un enfoque holístico que incluya comunicación abierta con la pareja, tiempo adecuado para la excitación y, cuando sea necesario, lubricantes compatibles.'
      },
      {
        question: '¿Puedo tomar este suplemento si aún tengo períodos menstruales irregulares (perimenopausia)?',
        answer: 'Sí, Menopause Plus es adecuado para la etapa de perimenopausia, cuando los ciclos se vuelven irregulares y comienzan a aparecer los primeros síntomas de la transición menopáusica. Durante esta fase, muchas mujeres experimentan fluctuaciones hormonales significativas que pueden causar sofocos, cambios de humor y alteraciones del sueño, incluso antes de la cesación completa de los períodos. Los adaptógenos y moduladores hormonales suaves en esta fórmula pueden ayudar a equilibrar estas fluctuaciones. Sin embargo, tenga en cuenta que este suplemento no es un anticonceptivo; si existe la posibilidad de embarazo, se deben mantener los métodos anticonceptivos adecuados. Además, si experimenta sangrados menstruales excesivamente abundantes, prolongados o irregulares, consulte con su médico antes de usar cualquier suplemento, ya que estos síntomas podrían requerir evaluación médica.'
      }
    ]
  },
  {
    id: "13",
    name: 'Cranberry Concentrado',
    categories: ['salud-femenina'],
    price: 26.99,
    description: 'Concentrado de arándano para la salud del tracto urinario.',
    images: [
      {
        thumbnail: '/Jpeg/Cranberry_Concentrado_Anverso.jpg',
        full: '/Jpeg/Cranberry_Concentrado_Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Cranberry_Etiqueta_500x500.jpg',
        full: '/Jpeg/Cranberry_Etiqueta_500x500.jpg',
      },
    ],
    stock: 55,
    sku: 'CRAN',
    tags: ['mujer', 'urinario', 'antioxidante'],
    // Información para pestañas
    detailedDescription: 'El Cranberry Concentrado (Vaccinium macrocarpon) es un potente suplemento elaborado a partir de arándanos rojos norteamericanos, específicamente seleccionados por su alto contenido en proantocianidinas (PACs) tipo A, los compuestos bioactivos responsables de sus beneficios para la salud urinaria. Nuestra fórmula contiene un concentrado 50:1, equivalente a 25.000 mg de arándanos frescos por dosis, garantizando un mínimo de 36 mg de PACs tipo A medidos mediante el método DMAC (4-dimetilamino-cinamaldehído), el estándar de referencia para asegurar la potencia y efectividad. El arándano rojo ha sido utilizado tradicionalmente por los nativos americanos durante siglos y, en la actualidad, cuenta con un sólido respaldo científico por sus propiedades para mantener la salud del tracto urinario. A diferencia de los zumos comerciales, que suelen contener altas cantidades de azúcar y bajas concentraciones de principios activos, nuestro suplemento proporciona los compuestos beneficiosos del arándano sin azúcares añadidos, en una forma conveniente y de fácil absorción.',
    mechanismOfAction: 'Las proantocianidinas (PACs) tipo A del arándano rojo funcionan mediante un mecanismo anti-adherencia único: se adhieren a las fimbrias (pequeñas proyecciones similares a pelos) de ciertas bacterias como la Escherichia coli, impidiendo su capacidad para adherirse a las paredes del tracto urinario. Este mecanismo es particularmente importante porque, sin adherencia, las bacterias no pueden colonizar el tracto urinario y son eliminadas naturalmente con el flujo de orina. A diferencia de los antibióticos, que matan las bacterias y pueden generar resistencia, los PACs del arándano simplemente impiden la adhesión bacteriana sin crear presión selectiva, por lo que no generan resistencia. Además, los compuestos antioxidantes del arándano rojo (flavonoides, antocianinas, ácido ursólico y otros polifenoles) ayudan a reducir la inflamación, neutralizan los radicales libres y promueven un ambiente menos favorable para el crecimiento bacteriano al mantener un pH urinario ligeramente ácido. Estudios recientes también sugieren que el arándano puede inhibir la formación de biopelículas bacterianas, estructuras que protegen a las bacterias y dificultan su eliminación.',
    benefitsDescription: [
      'Promueve la salud del tracto urinario y ayuda a mantener su funcionamiento normal',
      'Reduce significativamente las posibilidades de adherencia bacteriana a las paredes del tracto urinario',
      'Proporciona potentes antioxidantes que combaten los radicales libres y reducen la inflamación',
      'Contribuye a mantener un pH urinario óptimo, menos favorable para el crecimiento bacteriano',
      'Apoya la salud cardiovascular gracias a sus efectos beneficiosos sobre la función endotelial y la presión arterial',
      'Favorece la salud dental al inhibir la adherencia de bacterias cariogénicas al esmalte dental'
    ],
    healthIssues: [
      'Incomodidades recurrentes del tracto urinario, especialmente en mujeres',
      'Personas propensas a problemas urinarios después de actividad sexual',
      'Personas con historia de problemas urinarios recurrentes',
      'Apoyo durante y después de tratamientos antibióticos para prevenir recurrencias',
      'Personas mayores con mayor susceptibilidad a problemas urinarios',
      'Situaciones que pueden comprometer el sistema inmunitario o aumentar el riesgo de colonización bacteriana'
    ],
    components: [
      {
        name: 'Extracto de arándano rojo (Vaccinium macrocarpon) 50:1',
        description: 'Concentrado de alta potencia equivalente a 25.000 mg de arándanos rojos frescos por dosis, estandarizado para contener un mínimo de 36 mg de proantocianidinas (PACs) tipo A por el método DMAC.',
        amount: '500 mg'
      },
      {
        name: 'Vitamina C (como ascorbato de calcio)',
        description: 'Antioxidante que refuerza el sistema inmunitario, contribuye a la producción de colágeno para la salud de los tejidos del tracto urinario y potencia los efectos del arándano.',
        amount: '60 mg (100% del Valor Diario)'
      },
      {
        name: 'D-Manosa',
        description: 'Azúcar simple que complementa la acción del arándano al unirse a las fimbrias bacterianas, impidiendo su adhesión a las paredes del tracto urinario.',
        amount: '50 mg'
      },
      {
        name: 'Extracto de hibisco (Hibiscus sabdariffa)',
        description: 'Rico en antocianinas y ácidos orgánicos que ayudan a mantener un pH urinario óptimo y complementan las propiedades antioxidantes del arándano.',
        amount: '25 mg'
      },
      {
        name: 'Extracto de hoja de uva ursi (Arctostaphylos uva-ursi)',
        description: 'Contiene arbutina, un compuesto con propiedades antisépticas urinarias que trabaja sinérgicamente con el arándano rojo.',
        amount: '15 mg'
      }
    ],
    dosage: 'Tomar 1 cápsula al día con alimentos. En períodos de mayor necesidad o como medida preventiva intensiva, se puede aumentar a 2 cápsulas al día (mañana y noche) durante 1-2 semanas. Para obtener los mejores resultados, se recomienda un uso regular y continuo. La ingesta constante es clave para mantener niveles suficientes de PACs en el tracto urinario, ya que estos compuestos se eliminan del cuerpo en aproximadamente 24 horas.',
    administrationMethod: 'Ingerir la cápsula entera con un vaso completo de agua, preferentemente con alimentos para optimizar la absorción. Para potenciar sus beneficios, es recomendable mantener una buena hidratación durante el día (al menos 1.5-2 litros de agua). Evitar el consumo excesivo de bebidas azucaradas, cafeína y alcohol mientras se está tomando el suplemento. No es necesario ajustar el horario de toma, aunque algunas personas prefieren tomarlo por la noche para mantener niveles protectores durante las horas de sueño.',
    faqs: [
      {
        question: '¿Puedo tomar Cranberry Concentrado si estoy usando antibióticos para una infección urinaria?',
        answer: 'Sí, el Cranberry Concentrado puede tomarse como complemento a un tratamiento antibiótico prescrito por un médico, ya que actúan por mecanismos diferentes y no interfieren entre sí. Mientras los antibióticos eliminan las bacterias existentes, el arándano ayuda a prevenir que nuevas bacterias se adhieran al tracto urinario. Sin embargo, es importante completar el ciclo completo de antibióticos según las indicaciones médicas, independientemente de la mejora de los síntomas. Después del tratamiento antibiótico, continuar con el suplemento de arándano puede ser especialmente beneficioso como estrategia preventiva.'
      },
      {
        question: '¿Cuánto tiempo debo tomar este suplemento para ver resultados?',
        answer: 'Los beneficios del arándano rojo comienzan a actuar desde la primera toma, ya que los compuestos activos empiezan a circular por el sistema urinario aproximadamente 2-4 horas después de su ingestión. Sin embargo, para resultados óptimos en la prevención, se recomienda un uso regular durante al menos 4-6 semanas. Para personas con problemas recurrentes, un uso continuo a largo plazo es perfectamente seguro y recomendable. Es importante entender que el arándano actúa principalmente como preventivo, no como tratamiento para infecciones establecidas, para las cuales debe consultarse a un profesional de la salud.'
      },
      {
        question: '¿Este suplemento tiene efectos secundarios?',
        answer: 'El arándano rojo es generalmente muy bien tolerado. En raras ocasiones, algunas personas pueden experimentar leves molestias digestivas, que suelen resolverse tomando el suplemento con alimentos. A diferencia de los zumos de arándano, que pueden contener altos niveles de oxalatos y azúcares, nuestro suplemento concentrado minimiza estos componentes, haciéndolo adecuado incluso para personas propensas a cálculos renales (aunque siempre es aconsejable consultar con un médico en estos casos). El arándano rojo puede interactuar con anticoagulantes como la warfarina, por lo que personas en tratamiento con estos medicamentos deben consultar con su médico antes de usar el suplemento.'
      },
      {
        question: '¿Las mujeres embarazadas o en periodo de lactancia pueden tomar este suplemento?',
        answer: 'Aunque el arándano rojo se considera generalmente seguro y es un alimento común, las mujeres embarazadas o en periodo de lactancia deben consultar con su médico antes de tomar cualquier suplemento. Algunos estudios sugieren que el arándano puede ser seguro durante estos periodos, pero la evidencia no es concluyente y las necesidades individuales pueden variar. Si su médico lo aprueba, este suplemento podría ser una opción para apoyar la salud del tracto urinario durante el embarazo, cuando algunas mujeres pueden ser más susceptibles a incomodidades urinarias debido a los cambios fisiológicos.'
      },
      {
        question: '¿Este suplemento sirve tanto para hombres como para mujeres?',
        answer: 'Sí, aunque tradicionalmente se ha asociado más con la salud urinaria femenina debido a la mayor prevalencia de problemas urinarios en mujeres (por factores anatómicos), los beneficios del arándano rojo son igualmente aplicables a los hombres. Los compuestos activos del arándano funcionan de la misma manera independientemente del género, impidiendo la adherencia bacteriana en el tracto urinario. En hombres, puede ser especialmente útil para la salud de la próstata y el tracto urinario, particularmente en adultos mayores o tras procedimientos urológicos. La dosificación recomendada es la misma para ambos géneros.'
      }
    ]
  },

  // ===== PRODUCTOS PIPING ROCK =====
  
  // Suplementos Digestivos y Detox
  {
    id: "pr-alpha-gpc",
    name: 'Alpha GPC 200mg - 120 Cápsulas Vegetarianas',
    categories: ['suplementos-especializados'],
    price: 893.37,
    description: 'Alpha GPC (Glicerofosfocolina) es un compuesto natural que apoya la función cognitiva y la salud cerebral. Ideal para mejorar la memoria y el rendimiento mental.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14653_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Alpha GPC, 200 mg Anverso.jpg',
        full: '/Jpeg/Alpha GPC, 200 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Alpha GPC, 200 mg Reverso.jpg',
        full: '/Jpeg/Alpha GPC, 200 mg Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-AGPC-200',
    tags: ['cognitivo', 'memoria', 'cerebro', 'nootrópico'],
    // Información detallada
    detailedDescription: 'Alpha GPC (L-alfa-glicerilfosforilcolina) es un compuesto natural derivado de la fosfatidilcolina que actúa como uno de los nootrópicos más potentes y bien estudiados disponibles. Esta formulación proporciona 200mg de Alpha GPC de grado farmacéutico que cruza eficientemente la barrera hematoencefálica para entregar colina directamente al cerebro. Alpha GPC es un precursor directo de acetilcolina, el neurotransmisor primario responsable de la memoria, aprendizaje y función cognitiva. También apoya la síntesis de fosfolípidos cerebrales, manteniendo la integridad de las membranas neuronales y optimizando la comunicación sináptica.',
    mechanismOfAction: 'Alpha GPC actúa como precursor directo de acetilcolina, liberando colina al cerebro después de cruzar la barrera hematoencefálica. La colina es convertida por la enzima colina acetiltransferasa en acetilcolina en las terminales sinápticas colinérgicas. Este neurotransmisor es fundamental para la transmisión neuronal en el hipocampo (centro de memoria), córtex (funciones ejecutivas) y otras regiones cognitivas. Además, Alpha GPC estimula la liberación de hormona del crecimiento y apoya la síntesis de fosfatidilcolina, un fosfolípido esencial para la estructura y fluidez de las membranas neuronales.',
    benefitsDescription: [
      'Mejora significativa de la memoria a corto y largo plazo',
      'Incremento del enfoque mental y concentración sostenida',
      'Optimización del aprendizaje y retención de información nueva',
      'Apoyo a las funciones ejecutivas y toma de decisiones',
      'Mejora del rendimiento cognitivo bajo estrés o fatiga',
      'Neuroprotección y mantenimiento de la salud cerebral',
      'Apoyo a la neuroplasticidad y formación de nuevas conexiones',
      'Mejora de la claridad mental y agilidad cognitiva'
    ],
    healthIssues: [
      'Declive cognitivo relacionado con la edad',
      'Problemas de memoria y olvidos frecuentes',
      'Dificultades de concentración y enfoque mental',
      'Bajo rendimiento académico o laboral cognitivo',
      'Fatiga mental y niebla cerebral',
      'Dificultades de aprendizaje y retención',
      'Estrés cognitivo y sobrecarga mental',
      'Deterioro de funciones ejecutivas'
    ],
    components: [
      {
        name: 'Alpha GPC (L-alfa-glicerilfosforilcolina)',
        description: 'Forma más biodisponible de colina que cruza eficientemente la barrera hematoencefálica, proporcionando 40% de colina pura al cerebro.',
        amount: '200 mg por cápsula (equivalente a 80mg de colina biodisponible)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día, preferiblemente por la mañana o antes de actividades que requieran rendimiento cognitivo. Para estudios intensivos, puede tomarse 30-60 minutos antes.',
    administrationMethod: 'Puede tomarse con o sin alimentos. Para máxima efectividad cognitiva, tomar con el estómago vacío 30-60 minutos antes de actividades mentales demandantes. Evitar tomar tarde en el día ya que puede interferir con el sueño en personas sensibles.',
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en hacer efecto Alpha GPC?',
        answer: 'Los efectos agudos pueden notarse dentro de 30-60 minutos después de la ingesta, con pico de efectos entre 1-2 horas. Los beneficios a largo plazo en memoria y cognición se desarrollan después de 2-4 semanas de uso regular.'
      },
      {
        question: '¿Es seguro tomar Alpha GPC todos los días?',
        answer: 'Sí, Alpha GPC es seguro para uso diario. Es un compuesto natural presente en pequeñas cantidades en alimentos como huevos y soja. No causa dependencia y puede usarse a largo plazo para mantener salud cognitiva.'
      },
      {
        question: '¿Puedo combinarlo con otros nootrópicos?',
        answer: 'Alpha GPC se combina bien con otros nootrópicos como racetams, modafinil o cafeína + L-teanina. De hecho, Alpha GPC es considerado la base ideal para muchas combinaciones nootrópicas (stacks).'
      },
      {
        question: '¿Tiene efectos secundarios?',
        answer: 'Alpha GPC es muy bien tolerado. Ocasionalmente puede causar dolor de cabeza leve (por exceso de acetilcolina), náuseas o insomnio si se toma tarde. Comenzar con 1 cápsula para evaluar tolerancia individual.'
      }
    ]
  },

  {
    id: "pr-chlorophyll",
    name: 'Clorofila 60mg - 120 Cápsulas de Liberación Rápida',
    categories: ['suplementos-especializados'],
    price: 864.73,
    description: 'Clorofila natural que actúa como un potente desintoxicante y antioxidante. Ayuda a purificar la sangre y apoya la salud digestiva.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14154_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Chlorophyll Anverso.jpg',
        full: '/Jpeg/Chlorophyll Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Chlorophyll Reverso.jpg',
        full: '/Jpeg/Chlorophyll Reverso.jpg',
      },
    ],
    stock: 30,
    sku: 'PR-CHLO-60',
    tags: ['detox', 'antioxidante', 'digestivo', 'purificante'],
    // Información detallada
    detailedDescription: 'La clorofila es el pigmento verde fundamental de las plantas que facilita la fotosíntesis y posee extraordinarias propiedades purificantes y antioxidantes para el organismo humano. Esta formulación de liberación rápida proporciona 60mg de clorofila concentrada derivada de alfalfa (Medicago sativa), optimizada para máxima biodisponibilidad y absorción. La clorofila actúa como un potente desintoxicante a nivel celular, neutralizando radicales libres, quelando metales pesados y toxinas, mientras apoya la oxigenación celular y la purificación sanguínea. Su estructura molecular es sorprendentemente similar a la hemoglobina humana, diferenciándose únicamente en el átomo central (magnesio en lugar de hierro), lo que le confiere propiedades únicas para apoyar la salud cardiovascular y hematológica.',
    mechanismOfAction: 'La clorofila actúa como quelante natural, uniéndose a toxinas, metales pesados y carcinógenos para facilitar su eliminación del organismo. Su capacidad antioxidante neutraliza radicales libres y especies reactivas de oxígeno que causan daño celular y envejecimiento. A nivel digestivo, la clorofila inhibe el crecimiento de bacterias patógenas mientras promueve el desarrollo de flora beneficiosa, creando un ambiente intestinal saludable. También activa enzimas hepáticas de fase II que facilitan la detoxificación, mejora la oxigenación tisular al optimizar el transporte de oxígeno, y posee propiedades alcalinizantes que ayudan a mantener el equilibrio ácido-base del organismo.',
    benefitsDescription: [
      'Desintoxicación profunda y eliminación de toxinas ambientales',
      'Potente acción antioxidante que protege contra daño celular',
      'Purificación y oxigenación de la sangre',
      'Mejora significativa de la digestión y salud intestinal',
      'Neutralización natural del mal aliento y olores corporales',
      'Apoyo a la función hepática y procesos de detoxificación',
      'Estimulación del sistema inmunológico',
      'Propiedades anti-inflamatorias y cicatrizantes',
      'Mejora de los niveles de energía y vitalidad',
      'Apoyo a la salud cardiovascular y circulatoria'
    ],
    healthIssues: [
      'Exposición a toxinas ambientales y contaminantes',
      'Mal aliento crónico y problemas de olor corporal',
      'Problemas digestivos y mala salud intestinal',
      'Fatiga crónica y bajos niveles de energía',
      'Estrés oxidativo y envejecimiento acelerado',
      'Función hepática comprometida',
      'Anemia leve y problemas circulatorios',
      'Inflamación crónica y procesos inflamatorios',
      'Desequilibrios en el pH corporal (acidosis)',
      'Recuperación lenta de heridas o lesiones'
    ],
    components: [
      {
        name: 'Clorofila (de alfalfa)',
        description: 'Pigmento verde natural con estructura molecular similar a la hemoglobina, proporcionando propiedades desintoxicantes, antioxidantes y oxigenantes excepcionales.',
        amount: '60 mg por cápsula (equivalente a clorofila biodisponible)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con abundante agua, preferiblemente con las comidas para minimizar posibles molestias estomacales. Para detoxificación intensiva, puede aumentarse a 3 cápsulas diarias bajo supervisión.',
    administrationMethod: 'Tomar con las comidas principales y abundante agua (250-300ml) para optimizar absorción y prevenir molestias digestivas. Para máximo efecto desintoxicante, combinar con una dieta rica en verduras y mantener hidratación adecuada durante el día.',
    faqs: [
      {
        question: '¿Es normal que las heces cambien de color al tomar clorofila?',
        answer: 'Sí, es completamente normal. La clorofila puede dar un tinte verdoso a las heces, lo cual indica que el suplemento está siendo procesado correctamente por el organismo. Este efecto es temporal y desaparece al suspender el suplemento.'
      },
      {
        question: '¿Cuánto tiempo tarda en notarse el efecto desintoxicante?',
        answer: 'Los primeros beneficios como mejora del aliento y digestión pueden notarse en 3-7 días. Los efectos desintoxicantes más profundos y el aumento de energía se desarrollan gradualmente durante 2-4 semanas de uso regular.'
      },
      {
        question: '¿Puede causar efectos secundarios?',
        answer: 'La clorofila es muy segura y bien tolerada. Ocasionalmente puede causar molestias estomacales leves, náuseas o diarrea si se toma con el estómago vacío. Se recomienda tomar con alimentos y reducir dosis si ocurren molestias.'
      },
      {
        question: '¿Se puede tomar junto con medicamentos?',
        answer: 'La clorofila generalmente es segura con medicamentos, pero puede afectar la absorción de algunos fármacos. Consultar con profesional de salud si se toman medicamentos anticoagulantes o para condiciones específicas.'
      }
    ]
  },

  {
    id: "pr-konjac-fiber",
    name: 'Fibra de Raíz de Konjac - Glucomanano 600mg - 120 Cápsulas',
    categories: ['salud-digestiva'],
    price: 1789.74,
    description: 'Fibra natural de glucomanano que ayuda a la pérdida de peso, controla el apetito y mejora la salud digestiva. Absorbe agua formando un gel en el estómago.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14242_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Konjac Root Fiber Glucomannan Anverso.jpg',
        full: '/Jpeg/Konjac Root Fiber Glucomannan Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Konjac Root Fiber Glucomannan Reverso.jpg',
        full: '/Jpeg/Konjac Root Fiber Glucomannan Reverso.jpg',
      },
    ],
    stock: 20,
    sku: 'PR-KONJ-600',
    tags: ['fibra', 'pérdida peso', 'saciedad', 'digestivo'],
    // Información detallada
    detailedDescription: 'El glucomanano es una fibra dietética soluble extraordinaria extraída de la raíz de Konjac (Amorphophallus konjac), una planta tradicionalmente cultivada en Asia durante siglos. Esta fibra posee la capacidad de absorción de agua más alta conocida entre las fibras naturales, expandiéndose hasta 50 veces su peso original al formar un gel viscoso en el estómago. Con 600mg de glucomanano puro por cápsula, esta formulación proporciona una herramienta poderosa y natural para el control de peso, manejo del apetito y optimización de la salud digestiva. El glucomanano ha sido aprobado por la EFSA (Autoridad Europea de Seguridad Alimentaria) como efectivo para la pérdida de peso cuando se combina con una dieta hipocalórica, y está respaldado por numerosos estudios clínicos que demuestran su eficacia y seguridad.',
    mechanismOfAction: 'El glucomanano actúa mediante múltiples mecanismos sinérgicos. Al entrar en contacto con agua en el estómago, se expande formando un gel viscoso que ocupa espacio significativo, generando sensación de saciedad temprana y prolongada. Este gel ralentiza el vaciado gástrico, extendiendo la sensación de plenitud y reduciendo el apetito entre comidas. A nivel intestinal, el glucomanano forma una barrera que reduce la absorción de grasas y carbohidratos, disminuyendo el índice glicémico de los alimentos. Además, actúa como prebiótico, alimentando bacterias beneficiosas en el colon, mejorando la salud intestinal y la producción de ácidos grasos de cadena corta que favorecen el metabolismo.',
    benefitsDescription: [
      'Pérdida de peso efectiva y sostenible mediante control natural del apetito',
      'Reducción significativa de la sensación de hambre entre comidas',
      'Control del índice glicémico y estabilización de niveles de azúcar',
      'Mejora de la salud digestiva y regulación del tránsito intestinal',
      'Reducción de la absorción de grasas dietéticas',
      'Apoyo al crecimiento de flora intestinal beneficiosa (efecto prebiótico)',
      'Reducción de los niveles de colesterol LDL (malo)',
      'Mejora de la sensibilidad a la insulina',
      'Control de porciones naturales durante las comidas',
      'Detoxificación intestinal y eliminación de residuos'
    ],
    healthIssues: [
      'Sobrepeso y obesidad',
      'Apetito descontrolado y ansiedad por comer',
      'Picos de azúcar en sangre y resistencia a la insulina',
      'Estreñimiento crónico y problemas digestivos',
      'Colesterol elevado y problemas cardiovasculares',
      'Síndrome metabólico',
      'Desequilibrios en la flora intestinal',
      'Digestión lenta y pesadez postprandial',
      'Descontrol en el tamaño de las porciones',
      'Acumulación de toxinas intestinales'
    ],
    components: [
      {
        name: 'Glucomanano (de raíz de Konjac)',
        description: 'Fibra soluble con la capacidad de absorción de agua más alta conocida, creando un gel viscoso que proporciona saciedad, controla el apetito y mejora la salud digestiva.',
        amount: '600 mg por cápsula (fibra dietética soluble pura)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas 30 minutos antes de cada comida principal con 1-2 vasos grandes de agua (400-500ml). Para máxima efectividad en pérdida de peso, tomar 3 cápsulas diarias antes de las 3 comidas principales.',
    administrationMethod: 'CRÍTICO: Siempre tomar con abundante agua (mínimo 2 vasos grandes) y tragar inmediatamente para evitar expansión en la garganta. Tomar 30 minutos antes de las comidas para permitir la formación del gel saciante. No tomar antes de acostarse. Aumentar gradualmente la dosis para permitir adaptación digestiva.',
    faqs: [
      {
        question: '¿Por qué es tan importante tomar mucha agua con glucomanano?',
        answer: 'El glucomanano puede expandirse hasta 50 veces su tamaño con agua. Sin suficiente líquido, puede expandirse en la garganta o esófago causando obstrucción. Siempre tomar con 2 vasos grandes de agua y tragar inmediatamente las cápsulas.'
      },
      {
        question: '¿Cuánto peso se puede perder con glucomanano?',
        answer: 'Estudios clínicos muestran pérdidas de 2-3 kg adicionales en 8-16 semanas cuando se combina con dieta hipocalórica. Los resultados varían según adherencia a la dieta, ejercicio y metabolismo individual.'
      },
      {
        question: '¿Puede causar efectos secundarios digestivos?',
        answer: 'Al inicio puede causar gases, hinchazón o cambios en el tránsito intestinal. Estos efectos son temporales y mejoran conforme el sistema digestivo se adapta. Comenzar con 1 cápsula diaria y aumentar gradualmente.'
      },
      {
        question: '¿Interfiere con la absorción de medicamentos?',
        answer: 'Sí, puede reducir la absorción de algunos medicamentos al formar un gel en el intestino. Tomar medicamentos al menos 1 hora antes o 4 horas después del glucomanano. Consultar con médico si se toman medicamentos críticos.'
      }
    ]
  },

  {
    id: "pr-tribulus",
    name: 'Ultra Tribulus Max 1000mg - 100 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 715.54,
    description: 'Extracto concentrado de Tribulus Terrestris que apoya la energía natural, la vitalidad y el rendimiento físico. Tradicionalmente usado para apoyar la salud masculina.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/1/11907_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Tribulus Mega Anverso.jpg',
        full: '/Jpeg/Tribulus Mega Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Tribulus Mega Reverso.jpg',
        full: '/Jpeg/Tribulus Mega Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-TRIB-1000',
    tags: ['energía', 'vitalidad', 'rendimiento', 'masculino'],
    // Información detallada
    detailedDescription: 'Tribulus Terrestris, conocido como Abrojo o Espina de Cristo, es una planta adaptógena tradicionalmente valorada en la medicina ayurvédica y china por sus propiedades energizantes y revitalizantes. Esta formulación Ultra Max proporciona 1000mg de extracto concentrado de fruto de Tribulus terrestris, estandarizado para garantizar máxima potencia y biodisponibilidad. El Tribulus contiene compuestos bioactivos únicos llamados saponinas furostanólicas, particularmente protodioscina, que han demostrado apoyar naturalmente la vitalidad, energía física, resistencia y bienestar general. Esta planta adaptógena ayuda al organismo a responder mejor al estrés físico y mental, optimizando el rendimiento deportivo y la recuperación muscular.',
    mechanismOfAction: 'Tribulus terrestris actúa como adaptógeno, modulando el eje hipotálamo-hipófisis-adrenal para optimizar la respuesta del organismo al estrés. Las saponinas furostanólicas, especialmente la protodioscina, estimulan la liberación natural de óxido nítrico, mejorando la circulación y el flujo sanguíneo a tejidos musculares y órganos vitales. Estos compuestos también apoyan la función mitocondrial, optimizando la producción de energía celular (ATP). Adicionalmente, el Tribulus modula neurotransmisores como dopamina y serotonina, contribuyendo a mejorar el estado de ánimo, motivación y sensación de bienestar general.',
    benefitsDescription: [
      'Aumento natural de energía física y resistencia',
      'Mejora del rendimiento deportivo y recuperación muscular',
      'Apoyo a la vitalidad y vigor general',
      'Optimización de la circulación y flujo sanguíneo',
      'Mejora del estado de ánimo y motivación',
      'Apoyo a la función adaptógena ante el estrés',
      'Incremento de la resistencia física y mental',
      'Mejora de la calidad del sueño y recuperación',
      'Apoyo a la salud cardiovascular y circulatoria',
      'Optimización del bienestar general y calidad de vida'
    ],
    healthIssues: [
      'Fatiga crónica y bajos niveles de energía',
      'Bajo rendimiento físico y deportivo',
      'Falta de motivación y vigor',
      'Estrés crónico y agotamiento adrenal',
      'Recuperación lenta después del ejercicio',
      'Circulación deficiente y problemas vasculares',
      'Bajo estado de ánimo y falta de vitalidad',
      'Resistencia física disminuida',
      'Problemas de adaptación al estrés',
      'Deterioro general del bienestar físico'
    ],
    components: [
      {
        name: 'Extracto de Tribulus Terrestris (fruto)',
        description: 'Extracto concentrado de la planta adaptógena que contiene saponinas furostanólicas, incluyendo protodioscina, responsables de sus efectos energizantes y adaptógenos.',
        amount: '1000 mg por cápsula (extracto concentrado 4:1)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con las comidas, preferiblemente una por la mañana y otra antes del entrenamiento o actividad física. Para atletas, puede aumentarse a 3 cápsulas diarias durante períodos de entrenamiento intenso.',
    administrationMethod: 'Tomar con alimentos para optimizar absorción y minimizar posibles molestias estomacales. Para máximo efecto energizante, tomar 30-60 minutos antes del ejercicio. Ciclar uso: 8 semanas de uso seguidas de 2 semanas de descanso para mantener efectividad.',
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en notarse el efecto energizante?',
        answer: 'Los efectos iniciales en energía y vitalidad pueden notarse dentro de 1-2 semanas de uso regular. Los beneficios completos en rendimiento físico y adaptación al estrés se desarrollan gradualmente durante 4-6 semanas.'
      },
      {
        question: '¿Es seguro para uso a largo plazo?',
        answer: 'Tribulus es generalmente seguro para uso prolongado, pero se recomienda ciclarlo (8 semanas uso, 2 semanas descanso) para mantener efectividad y prevenir adaptación. Consultar con profesional de salud para uso superior a 3 meses continuos.'
      },
      {
        question: '¿Puede tomarse junto con otros suplementos deportivos?',
        answer: 'Sí, Tribulus se combina bien con otros suplementos como creatina, proteínas, BCAA y vitaminas. Evitar combinación con estimulantes fuertes como cafeína en altas dosis para prevenir sobreestimulación.'
      },
      {
        question: '¿Tiene efectos secundarios?',
        answer: 'Tribulus es bien tolerado por la mayoría de personas. Ocasionalmente puede causar molestias estomacales leves, insomnio si se toma tarde, o sobreestimulación en personas sensibles. Comenzar con 1 cápsula para evaluar tolerancia.'
      }
    ]
  },

  {
    id: "pr-inositol",
    name: 'Inositol 650mg - 180 Cápsulas de Liberación Rápida',
    categories: ['suplementos-especializados'],
    price: 954.25,
    description: 'Inositol, un nutriente similar a las vitaminas B que apoya la función nerviosa, el metabolismo de las grasas y la salud mental. Beneficioso para el equilibrio hormonal.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14098_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Inositol Anverso.jpg',
        full: '/Jpeg/Inositol Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Inositol Reverso.jpg',
        full: '/Jpeg/Inositol Reverso.jpg',
      },
    ],
    stock: 28,
    sku: 'PR-INOS-650',
    tags: ['nervioso', 'hormonal', 'metabolismo', 'mental'],
    // Información detallada
    detailedDescription: 'El Inositol, conocido anteriormente como vitamina B8, es un nutriente esencial similar a las vitaminas del complejo B que desempeña funciones críticas en múltiples procesos celulares y metabólicos. Esta formulación proporciona 650mg de myo-inositol puro, la forma más biodisponible y ampliamente estudiada de este compuesto. El inositol es fundamental para la integridad de las membranas celulares, la señalización celular, el metabolismo de las grasas y la neurotransmisión. Se concentra especialmente en el cerebro, hígado, riñones y músculos, donde actúa como segundo mensajero en múltiples vías de señalización hormonal, incluyendo insulina, serotonina y otras hormonas reproductivas. Su papel en la salud mental, equilibrio hormonal y función metabólica lo convierte en un suplemento valioso para el bienestar integral.',
    mechanismOfAction: 'El inositol actúa como componente estructural de fosfolípidos de membrana (fosfatidilinositol) y como segundo mensajero en vías de señalización celular. Modula la sensibilidad a la insulina mejorando la captación de glucosa y el metabolismo lipídico. En el sistema nervioso, influye en la neurotransmisión serotoninérgica, dopaminérgica y GABAérgica, contribuyendo a la regulación del estado de ánimo y función cognitiva. A nivel reproductivo, mejora la sensibilidad ovárica a hormonas como FSH y LH, optimizando la función reproductiva. También regula el metabolismo de lípidos hepáticos y la síntesis de lecitina, apoyando la salud cardiovascular y hepática.',
    benefitsDescription: [
      'Mejora significativa de la sensibilidad a la insulina y metabolismo de glucosa',
      'Apoyo al equilibrio hormonal reproductivo, especialmente en mujeres',
      'Regulación del estado de ánimo y reducción de ansiedad',
      'Optimización del metabolismo de grasas y función hepática',
      'Mejora de la calidad del sueño y descanso',
      'Apoyo a la función reproductiva y fertilidad',
      'Reducción de inflamación y estrés oxidativo',
      'Mejora de la salud de la piel y cabello',
      'Apoyo a la función cognitiva y mental',
      'Regulación de neurotransmisores y bienestar emocional'
    ],
    healthIssues: [
      'Síndrome de ovarios poliquísticos (SOP)',
      'Resistencia a la insulina y síndrome metabólico',
      'Ansiedad, depresión y trastornos del estado de ánimo',
      'Desequilibrios hormonales reproductivos',
      'Problemas de fertilidad masculina y femenina',
      'Trastornos del sueño e insomnio',
      'Hígado graso y problemas metabólicos hepáticos',
      'Trastorno obsesivo-compulsivo (TOC)',
      'Ataques de pánico y trastornos de ansiedad',
      'Problemas de piel relacionados con hormonas'
    ],
    components: [
      {
        name: 'Myo-Inositol',
        description: 'Forma más biodisponible y activa del inositol, esencial para la señalización celular, metabolismo de grasas, función hormonal y neurotransmisión.',
        amount: '650 mg por cápsula (myo-inositol puro de grado farmacéutico)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con las comidas, preferiblemente divididas (una por la mañana y otra por la noche). Para condiciones específicas como SOP, pueden requerirse dosis mayores bajo supervisión profesional.',
    administrationMethod: 'Tomar con alimentos para optimizar absorción y minimizar molestias digestivas leves. Puede tomarse con el estómago vacío si no causa molestias. Para trastornos del sueño, tomar 1 cápsula 30-60 minutos antes de acostarse.',
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en mostrar efectos en el SOP?',
        answer: 'Para síndrome de ovarios poliquísticos, los beneficios en regulación hormonal y sensibilidad a insulina pueden notarse en 4-6 semanas, con efectos completos desarrollándose durante 3-6 meses de uso consistente.'
      },
      {
        question: '¿Es seguro durante el embarazo y lactancia?',
        answer: 'El inositol es generalmente considerado seguro durante embarazo y lactancia, e incluso puede ser beneficioso para prevenir diabetes gestacional. Sin embargo, siempre consultar con profesional de salud antes de usar durante estos períodos.'
      },
      {
        question: '¿Puede ayudar con la ansiedad y depresión?',
        answer: 'Sí, estudios clínicos han demostrado que el inositol puede ser efectivo para reducir síntomas de ansiedad, ataques de pánico y algunos tipos de depresión al modular neurotransmisores como serotonina.'
      },
      {
        question: '¿Tiene efectos secundarios?',
        answer: 'El inositol es muy bien tolerado. Ocasionalmente puede causar molestias digestivas leves, náuseas o gases al inicio. Estos efectos son temporales y mejoran con la adaptación. Comenzar con 1 cápsula diaria.'
      }
    ]
  },

  {
    id: "pr-magnesium-threonate",
    name: 'L-Treonato de Magnesio - 90 Cápsulas',
    categories: ['vitaminas-minerales'],
    price: 3800.88,
    description: 'Forma avanzada de magnesio que puede cruzar la barrera hematoencefálica. Especialmente formulado para apoyar la función cognitiva y la salud cerebral.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17486_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Magnesium L-Threonate Anverso.jpg',
        full: '/Jpeg/Magnesium L-Threonate Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Magnesium L-Threonate Reverso.jpg',
        full: '/Jpeg/Magnesium L-Threonate Reverso.jpg',
      },
    ],
    stock: 15,
    sku: 'PR-MAGTHR-90',
    tags: ['magnesio', 'cognitivo', 'cerebro', 'memoria'],
    // Información detallada
    detailedDescription: 'El L-Treonato de Magnesio representa una innovación revolucionaria en suplementación de magnesio, siendo la única forma de este mineral esencial capaz de cruzar eficientemente la barrera hematoencefálica y alcanzar concentraciones terapéuticas en el cerebro. Desarrollado por investigadores del MIT, esta forma patentada de magnesio está específicamente diseñada para optimizar la función cognitiva, memoria y salud neurológica. A diferencia de otras formas de magnesio que tienen limitada penetración cerebral, el L-treonato actúa como un transportador molecular que facilita la entrega directa de magnesio a las neuronas, donde participa en más de 300 reacciones enzimáticas cerebrales críticas. Esta formulación premium proporciona la concentración óptima para apoyar la plasticidad sináptica, formación de memorias y protección neuronal.',
    mechanismOfAction: 'El L-treonato de magnesio funciona como un transportador especializado que utiliza receptores específicos para cruzar la barrera hematoencefálica. Una vez en el cerebro, el magnesio regula los canales de calcio neuronales, modula la actividad de receptores NMDA esenciales para la memoria, y activa enzimas involucradas en la síntesis de neurotransmisores. El magnesio cerebral optimiza la función mitocondrial neuronal, mejora la plasticidad sináptica facilitando la formación de nuevas conexiones neuronales, y protege contra la excitotoxicidad neuronal. También regula la expresión de genes relacionados con la neuroplasticidad y apoya la síntesis de proteínas necesarias para la consolidación de memorias a largo plazo.',
    benefitsDescription: [
      'Mejora significativa de la memoria de trabajo y a largo plazo',
      'Incremento de la capacidad de aprendizaje y retención',
      'Optimización de la función cognitiva y claridad mental',
      'Mejora de la plasticidad neuronal y formación de conexiones',
      'Apoyo a la concentración y enfoque sostenido',
      'Protección neuronal contra el envejecimiento cerebral',
      'Mejora de la calidad del sueño y recuperación neuronal',
      'Reducción del estrés neurológico y ansiedad',
      'Apoyo a la función ejecutiva y toma de decisiones',
      'Optimización del rendimiento cognitivo bajo estrés'
    ],
    healthIssues: [
      'Deterioro cognitivo relacionado con la edad',
      'Problemas de memoria y olvidos frecuentes',
      'Dificultades de concentración y atención',
      'Bajo rendimiento académico o laboral cognitivo',
      'Declive en la función ejecutiva',
      'Estrés mental crónico y sobrecarga cognitiva',
      'Trastornos del sueño que afectan la cognición',
      'Fatiga mental y niebla cerebral',
      'Ansiedad relacionada con el rendimiento cognitivo',
      'Preocupaciones sobre el envejecimiento cerebral'
    ],
    components: [
      {
        name: 'L-Treonato de Magnesio',
        description: 'Forma patentada de magnesio que cruza la barrera hematoencefálica para entregar magnesio directamente al cerebro, optimizando la función neuronal y cognitiva.',
        amount: 'Equivalente a 144 mg de magnesio elemental por dosis diaria (3 cápsulas)'
      }
    ],
    dosage: 'Tomar 3 cápsulas al día: 2 cápsulas por la mañana y 1 cápsula por la noche, preferiblemente con el estómago vacío para máxima absorción. No exceder la dosis recomendada.',
    administrationMethod: 'Tomar preferiblemente con el estómago vacío para optimizar absorción cerebral. Si causa molestias digestivas, puede tomarse con comida ligera. Para beneficios en memoria y aprendizaje, tomar la dosis matutina 30-60 minutos antes de actividades cognitivas demandantes.',
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en mejorar la memoria?',
        answer: 'Los primeros efectos en claridad mental pueden notarse en 1-2 semanas. Las mejoras significativas en memoria y función cognitiva se desarrollan gradualmente durante 4-12 semanas de uso consistente, con beneficios óptimos después de 3 meses.'
      },
      {
        question: '¿Es diferente a otros suplementos de magnesio?',
        answer: 'Sí, es único porque puede cruzar la barrera hematoencefálica. Otras formas de magnesio (óxido, citrato, glicinato) no alcanzan concentraciones significativas en el cerebro, por lo que son menos efectivas para beneficios cognitivos específicos.'
      },
      {
        question: '¿Puede causar efectos secundarios?',
        answer: 'Es generalmente bien tolerado. Ocasionalmente puede causar molestias digestivas leves, somnolencia (si se toma durante el día) o sueños más vívidos. Comenzar con 1-2 cápsulas para evaluar tolerancia individual.'
      },
      {
        question: '¿Se puede combinar con otros nootrópicos?',
        answer: 'Sí, se combina bien con otros suplementos cognitivos como Alpha GPC, vitaminas B, omega-3, y otros nootrópicos. De hecho, puede potenciar los efectos de otros suplementos para la memoria.'
      }
    ]
  },

  // Aceites Esenciales y Omega
  {
    id: "pr-fish-oil",
    name: 'Aceite de Pescado Omega-3 - 415mg - 200 Cápsulas Mini',
    categories: ['suplementos-especializados'],
    price: 1014.03,
    description: 'Aceite de pescado purificado rico en ácidos grasos Omega-3 EPA y DHA. Apoya la salud cardiovascular, cerebral y articular. Cápsulas mini fáciles de tragar.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14633_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Mini Omega-3 Fish Oil Lemon Anverso.jpg',
        full: '/Jpeg/Mini Omega-3 Fish Oil Lemon Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Mini Omega-3 Fish Oil Lemon Reverso.jpg',
        full: '/Jpeg/Mini Omega-3 Fish Oil Lemon Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'PR-FISH-415',
    tags: ['omega-3', 'cardiovascular', 'cerebral', 'articular'],
  },

  // Adaptógenos y Energía
  {
    id: "pr-maca",
    name: 'Maca 4800mg - 150 Cápsulas de Liberación Rápida',
    categories: ['suplementos-especializados'],
    price: 1073.71,
    description: 'Extracto concentrado de raíz de Maca peruana. Adaptógeno natural que apoya la energía, resistencia y vitalidad. Tradicionalmente usado para equilibrar hormonas.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14404_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Maca, 4800 mg Anverso.jpg',
        full: '/Jpeg/Maca, 4800 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Maca, 4800 mg Reverso.jpg',
        full: '/Jpeg/Maca, 4800 mg Reverso.jpg',
      },
    ],
    stock: 32,
    sku: 'PR-MACA-4800',
    tags: ['adaptógeno', 'energía', 'hormonal', 'resistencia'],
  },

  // Salud Hepática y Desintoxicación
  {
    id: "pr-same",
    name: 'SAMe - Recuperimiento Entérico 200mg - 30 Tabletas',
    categories: ['suplementos-especializados'],
    price: 595.64,
    description: 'S-Adenosil-L-Metionina con recubrimiento entérico para máxima absorción. Apoya la salud hepática, articular y el bienestar emocional.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14509_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/SAM-e Enteric Coated Anverso.jpg',
        full: '/Jpeg/SAM-e Enteric Coated Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/SAM-e Enteric Coated Reverso.jpg',
        full: '/Jpeg/SAM-e Enteric Coated Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-SAME-200',
    tags: ['hepático', 'articular', 'emocional', 'metilación'],
  },

  {
    id: "pr-bamboo-extract",
    name: 'Extracto de Bambú 3000mg - 250 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 952.56,
    description: 'Extracto concentrado de bambú, fuente natural de sílice. Apoya la salud de cabello, piel, uñas y tejido conectivo. Rico en minerales esenciales.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14158_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Bamboo Extract, 3000 mg Anverso.jpg',
        full: '/Jpeg/Bamboo Extract, 3000 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Bamboo Extract, 3000 mg Reverso.jpg',
        full: '/Jpeg/Bamboo Extract, 3000 mg Reverso.jpg',
      },
    ],
    stock: 30,
    sku: 'PR-BAMB-3000',
    tags: ['sílice', 'cabello', 'piel', 'uñas'],
  },

  {
    id: "pr-borage-oil",
    name: 'Aceite de Borraja (GLA) 1000mg - 120 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 714.42,
    description: 'Aceite de borraja rico en ácido gamma-linolénico (GLA). Apoya la salud de la piel, equilibrio hormonal y respuesta inflamatoria saludable.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14154_2.jpg
    images: [
      {
        thumbnail: '/Jpeg/Borage Oil (GLA) Anverso.jpg',
        full: '/Jpeg/Borage Oil (GLA) Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Borage Oil (GLA) Reverso.jpg',
        full: '/Jpeg/Borage Oil (GLA) Reverso.jpg',
      },
    ],
    stock: 28,
    sku: 'PR-BOR-1000',
    tags: ['GLA', 'piel', 'hormonal', 'inflamación'],
  },

  {
    id: "pr-liver-cleanse",
    name: '3-Day Liver Cleanse - 12 Cápsulas Vegetarianas',
    categories: ['salud-digestiva'],
    price: 891.66,
    description: 'Programa de limpieza hepática de 3 días con hierbas tradicionales. Diseñado para apoyar la función de desintoxicación natural del hígado.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16486_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/3-Day Liver Cleanse Anverso.jpg',
        full: '/Jpeg/3-Day Liver Cleanse Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/3-Day Liver Cleanse Reverso.jpg',
        full: '/Jpeg/3-Day Liver Cleanse Reverso.jpg',
      },
    ],
    stock: 20,
    sku: 'PR-LIVER-3D',
    tags: ['hígado', 'detox', 'limpieza', 'hierbas'],
  },

  // Sueño y Relajación
  {
    id: "pr-ashwa-melatonin",
    name: 'Ashwagandha Melatonin plus L-Theanine - 60 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 356.90,
    description: 'Fórmula sinérgica que combina Ashwagandha, Melatonina y L-Teanina para promover relajación profunda y sueño reparador de calidad.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17265_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Sleep Formula Anverso.jpg',
        full: '/Jpeg/Sleep Formula Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Sleep Formula Reverso.jpg',
        full: '/Jpeg/Sleep Formula Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-ASHMEL-60',
    tags: ['sueño', 'relajación', 'melatonina', 'adaptógeno'],
  },

  // Aceites Esenciales
  {
    id: "pr-basil-oil",
    name: 'Aceite Esencial de Albahaca Puro - 15mL',
    categories: ['suplementos-especializados'],
    price: 356.90,
    description: 'Aceite esencial de albahaca 100% puro y natural. Ideal para aromaterapia, masajes y uso tópico diluido. Aroma fresco y revitalizante.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14001_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Passion Flower Anverso.jpg',
        full: '/Jpeg/Passion Flower Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Passion Flower Reverso.jpg',
        full: '/Jpeg/Passion Flower Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-BASIL-15',
    tags: ['aceite esencial', 'aromaterapia', 'natural', 'albahaca'],
  },

  // Deportes y Rendimiento
  {
    id: "pr-creatine",
    name: 'Creatina Micronizada 5000mg - 150 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1789.32,
    description: 'Creatina monohidrato micronizada de alta pureza. Apoya la fuerza muscular, potencia y recuperación en entrenamientos intensos.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14520_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Creatine (Micronized) Anverso.jpg',
        full: '/Jpeg/Creatine (Micronized) Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Creatine (Micronized) Reverso.jpg',
        full: '/Jpeg/Creatine (Micronized) Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'PR-CREAT-5000',
    tags: ['creatina', 'músculo', 'fuerza', 'rendimiento'],
  },

  // Aceites Esenciales Adicionales
  {
    id: "pr-chamomile-oil",
    name: 'Mezcla de Aceite Esencial de Manzanilla - 15mL',
    categories: ['suplementos-especializados'],
    price: 318.72,
    description: 'Mezcla premium de aceite esencial de manzanilla. Conocido por sus propiedades calmantes y relajantes. Ideal para relajación y cuidado de la piel.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14008_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Rhodiola Rosea Anverso.jpg',
        full: '/Jpeg/Rhodiola Rosea Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Rhodiola Rosea Reverso.jpg',
        full: '/Jpeg/Rhodiola Rosea Reverso.jpg',
      },
    ],
    stock: 30,
    sku: 'PR-CHAM-15',
    tags: ['aceite esencial', 'calmante', 'relajante', 'manzanilla'],
  },

  {
    id: "pr-sandalwood-oil",
    name: 'Mezcla de Aceite Esencial de Sándalo - 15mL',
    categories: ['suplementos-especializados'],
    price: 318.72,
    description: 'Mezcla exquisita de aceite esencial de sándalo. Aroma exótico y relajante, tradicionalmente usado en meditación y cuidado espiritual.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14045_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Valerian Root Anverso.jpg',
        full: '/Jpeg/Valerian Root Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Valerian Root Reverso.jpg',
        full: '/Jpeg/Valerian Root Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-SAND-15',
    tags: ['aceite esencial', 'meditación', 'relajante', 'sándalo'],
  },

  // Neurotransmisores y Estado de Ánimo
  {
    id: "pr-5htp",
    name: '5-HTP 200mg - 180 Cápsulas de Liberación Rápida',
    categories: ['suplementos-especializados'],
    price: 2815.88,
    description: '5-Hidroxitriptófano, precursor natural de la serotonina. Apoya el estado de ánimo positivo, sueño saludable y control del apetito.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14401_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/5-HTP, 200 mg Anverso.jpg',
        full: '/Jpeg/5-HTP, 200 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/5-HTP, 200 mg Reverso.jpg',
        full: '/Jpeg/5-HTP, 200 mg Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-5HTP-200',
    tags: ['serotonina', 'ánimo', 'sueño', 'apetito'],
    // Información detallada
    detailedDescription: 'Esta formulación de 5-HTP proporciona 200mg de 5-Hidroxitriptófano puro, un aminoácido natural extraído de las semillas de Griffonia simplicifolia. El 5-HTP es el precursor inmediato de la serotonina, el neurotransmisor clave responsable del estado de ánimo, sueño, apetito y bienestar general. A diferencia del triptófano, el 5-HTP cruza eficientemente la barrera hematoencefálica sin competir con otros aminoácidos, proporcionando un aumento directo y natural de los niveles de serotonina cerebral. Este suplemento es especialmente valioso para personas con baja serotonina, depresión, ansiedad, insomnio o problemas de control del apetito.',
    mechanismOfAction: 'El 5-HTP actúa como precursor directo de la serotonina, siendo convertido por la enzima descarboxilasa de aminoácidos aromáticos (AADC) en serotonina (5-HT) en las neuronas serotoninérgicas. A diferencia del triptófano, el 5-HTP no requiere la enzima triptófano hidroxilasa (paso limitante) y cruza fácilmente la barrera hematoencefálica. La serotonina producida modula el estado de ánimo, sueño, apetito, dolor y función intestinal. También actúa como precursor de melatonina en la glándula pineal, mejorando los patrones de sueño naturales.',
    benefitsDescription: [
      'Mejora natural del estado de ánimo y reducción de la depresión leve',
      'Apoyo significativo a la calidad del sueño y regulación circadiana',
      'Control natural del apetito y reducción de antojos por carbohidratos',
      'Reducción de la ansiedad y promoción de la calma mental',
      'Alivio de dolores de cabeza y migrañas relacionadas con serotonina',
      'Mejora del bienestar general y estabilidad emocional',
      'Apoyo a la función digestiva y motilidad intestinal',
      'Reducción de la agresividad e irritabilidad'
    ],
    healthIssues: [
      'Depresión leve a moderada y bajo estado de ánimo',
      'Insomnio y trastornos del sueño relacionados con serotonina',
      'Ansiedad generalizada y ataques de pánico',
      'Problemas de control del apetito y antojos por carbohidratos',
      'Síndrome premenstrual y cambios de humor hormonales',
      'Migrañas y dolores de cabeza por tensión',
      'Trastorno afectivo estacional (depresión invernal)',
      'Problemas digestivos relacionados con estrés'
    ],
    components: [
      {
        name: '5-HTP (5-Hidroxitriptófano)',
        description: 'Precursor natural de serotonina extraído de semillas de Griffonia simplicifolia, que cruza eficientemente la barrera hematoencefálica.',
        amount: '200 mg por cápsula (dosis terapéutica óptima)'
      }
    ],
    dosage: 'Comenzar con 100mg (1/2 cápsula) al día, preferiblemente por la noche. Si se tolera bien, incrementar gradualmente a 200mg. Rango terapéutico documentado: 150-800mg diarios. Para efectos sobre el sueño: tomar 1-2 horas antes de acostarse. Para control de peso: puede requerirse hasta 300mg diarios bajo supervisión médica.',
    administrationMethod: 'Tomar preferiblemente con el estómago vacío o con una pequeña cantidad de carbohidratos para mejorar la absorción. Evitar tomar con proteínas que contengan triptófano. Para uso diurno, tomar en dosis divididas. Comenzar siempre con dosis bajas para evaluar tolerancia. IMPORTANTE: Consultar médico antes del uso, especialmente si toma medicamentos.',
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en mejorar el estado de ánimo?',
        answer: 'Los efectos sobre el estado de ánimo pueden comenzar a notarse dentro de 1-2 semanas de uso regular. Los beneficios completos sobre depresión y ansiedad generalmente se desarrollan después de 4-6 semanas de suplementación consistente.'
      },
      {
        question: '¿Puedo tomar 5-HTP con antidepresivos?',
        answer: 'NO debe combinarse con antidepresivos SSRI, SNRI o IMAO sin supervisión médica estricta, ya que puede causar síndrome serotoninérgico, una condición potencialmente peligrosa. Tampoco debe usarse con triptófano, tramadol, dextrometorfano o hierba de San Juan. Consulte siempre con su médico.'
      },
      {
        question: '¿Qué es el síndrome EMS y cómo prevenirlo?',
        answer: 'El síndrome de eosinofilia-mialgia (EMS) es una condición rara pero grave asociada con algunos suplementos de 5-HTP contaminados. Síntomas incluyen dolor muscular severo, fatiga y cambios en la sangre. Use solo productos de alta calidad de fabricantes reputados y suspenda el uso si experimenta dolor muscular inexplicable.'
      },
      {
        question: '¿Por qué comenzar con dosis bajas?',
        answer: 'El 5-HTP puede causar náuseas, diarrea o mareos inicialmente en algunas personas. Comenzar con 100mg permite que el cuerpo se adapte gradualmente al aumento de serotonina, minimizando efectos secundarios.'
      },
      {
        question: '¿Puede ayudar con el control del peso?',
        answer: 'Sí, el 5-HTP puede reducir significativamente los antojos por carbohidratos y azúcares al aumentar la serotonina, que regula el apetito. Muchas personas experimentan control natural del apetito y pérdida de peso gradual.'
      }
    ]
  },

  // Antioxidantes y Antiinflamatorios
  // Hierbas Tradicionales
  {
    id: "pr-bacopa",
    name: 'Bacopa Monnieri 1000mg - 180 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 895.15,
    description: 'Extracto estandarizado de Bacopa Monnieri, hierba ayurvédica tradicionalmente usada para apoyar la memoria, concentración y función cognitiva.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14203_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Bacopa Monnieri Anverso.jpg',
        full: '/Jpeg/Bacopa Monnieri Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Bacopa Monnieri Reverso.jpg',
        full: '/Jpeg/Bacopa Monnieri Reverso.jpg',
      },
    ],
    stock: 28,
    sku: 'PR-BACO-1000',
    tags: ['ayurvédico', 'memoria', 'concentración', 'cognitivo'],
  },

  {
    id: "pr-pqq",
    name: 'PQQ Pirroloquinolina Quinona 20mg - 60 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1790.90,
    description: 'Pirroloquinolina Quinona, cofactor que apoya la biogénesis mitocondrial y función cerebral. Potente antioxidante para energía celular.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14589_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/PQQ Pyrroloquinoline Quinone Anverso.jpg',
        full: '/Jpeg/PQQ Pyrroloquinoline Quinone Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/PQQ Pyrroloquinoline Quinone Reverso.jpg',
        full: '/Jpeg/PQQ Pyrroloquinoline Quinone Reverso.jpg',
      },
    ],
    stock: 20,
    sku: 'PR-PQQ-20',
    tags: ['mitocondrial', 'cerebral', 'antioxidante', 'energía'],
  },

  // Minerales Especializados
  {
    id: "pr-iodine",
    name: 'Ajo Inodoro 500mg - 200 Cápsulas Blandas',
    categories: ['suplementos-especializados'],
    price: 793.64,
    description: 'Extracto concentrado de ajo sin olor, estandarizado en alicina. Apoya la salud cardiovascular y función inmunológica.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14156_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Odorless Garlic Anverso.jpg',
        full: '/Jpeg/Odorless Garlic Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Odorless Garlic Reverso.jpg',
        full: '/Jpeg/Odorless Garlic Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-GAR-500',
    tags: ['ajo', 'cardiovascular', 'inmune', 'alicina'],
  },

  {
    id: "pr-kudzu-root",
    name: 'Raíz de Kudzu 1600mg - 100 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 942.32,
    description: 'Extracto tradicional de raíz de Kudzu, hierba china usada para apoyar el bienestar general y función hepática saludable.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14348_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Kudzu Root Anverso.jpg',
        full: '/Jpeg/Kudzu Root Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Kudzu Root Reverso.jpg',
        full: '/Jpeg/Kudzu Root Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-KUDZ-1600',
    tags: ['kudzu', 'hepático', 'tradicional', 'bienestar'],
  },

  // Salud Digestiva Avanzada
  {
    id: "pr-apple-cider-vinegar",
    name: 'Dieta de Vinagre de Sidra de Manzana - 84 Cápsulas',
    categories: ['salud-digestiva'],
    price: 865.30,
    description: 'Vinagre de sidra de manzana concentrado en cápsulas convenientes. Apoya la digestión saludable y el metabolismo natural.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14089_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Apple Cider Vinegar Anverso.jpg',
        full: '/Jpeg/Apple Cider Vinegar Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Apple Cider Vinegar Reverso.jpg',
        full: '/Jpeg/Apple Cider Vinegar Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'PR-ACV-84',
    tags: ['vinagre', 'digestión', 'metabolismo', 'manzana'],
  },

  {
    id: "pr-activated-charcoal",
    name: 'Carbón Activado 780mg - 180 Cápsulas',
    categories: ['salud-digestiva'],
    price: 495.05,
    description: 'Carbón activado de alta calidad para apoyo digestivo ocasional. Tradicionalmente usado para absorber gases y toxinas intestinales.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14126_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Activated Coconut Charcoal Anverso.jpg',
        full: '/Jpeg/Activated Coconut Charcoal Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Activated Coconut Charcoal Reverso.jpg',
        full: '/Jpeg/Activated Coconut Charcoal Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-CHAR-780',
    tags: ['carbón', 'digestivo', 'desintoxicante', 'gases'],
  },

  // Suplementos Especializados Adicionales


  // Salud Cerebral y Cognitiva
  {
    id: "pr-soy-lecithin",
    name: 'Soya Lecithin 1200mg - 100 Softgels',
    categories: ['suplementos-especializados'],
    price: 149.19,
    description: 'Lecitina de soya rica en fosfatidilcolina. Apoya la función cerebral, metabolismo de grasas y salud celular.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14476_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Lecithin - NON GMO, 1200 mg Anverso.jpg',
        full: '/Jpeg/Lecithin - NON GMO, 1200 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Lecithin - NON GMO, 1200 mg Reverso.jpg',
        full: '/Jpeg/Lecithin - NON GMO, 1200 mg Reverso.jpg',
      },
    ],
    stock: 50,
    sku: 'PR-SOY-1200',
    tags: ['lecitina', 'cerebral', 'fosfolípidos', 'económico'],
  },

  {
    id: "pr-clove-oil",
    name: 'Aceite Esencial de Clavo Puro - 59mL',
    categories: ['suplementos-especializados'],
    price: 356.50,
    description: 'Aceite esencial de clavo 100% puro. Conocido por sus propiedades antimicrobianas y uso tradicional en cuidado bucal.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14012_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Oil of Oregano, 4000 mg Anverso.jpg',
        full: '/Jpeg/Oil of Oregano, 4000 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Oil of Oregano, 4000 mg Reverso.jpg',
        full: '/Jpeg/Oil of Oregano, 4000 mg Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-CLOVE-59',
    tags: ['aceite esencial', 'antimicrobiano', 'bucal', 'clavo'],
  },

  // Antioxidantes y Vitaminas
  {
    id: "pr-cranberry-vitamin-c",
    name: 'Cranberry Plus Vitamin C 8400mg - 100 Softgels',
    categories: ['suplementos-especializados'],
    price: 149.19,
    description: 'Combinación potente de arándano rojo concentrado y vitamina C. Apoya la salud del tracto urinario y función inmunológica.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14189_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Cranberry_Plus_C_30_000 Anverso.jpg',
        full: '/Jpeg/Cranberry_Plus_C_30_000 Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Cranberry Plus C, 30,000 Reverso.jpg',
        full: '/Jpeg/Cranberry Plus C, 30,000 Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'PR-CRAN-8400',
    tags: ['cranberry', 'vitamina C', 'urinario', 'inmune'],
  },

  // Belleza y Colágeno
  {
    id: "pr-collagen-peptides",
    name: 'Collagen Grass Fed Peptides Powder Type I & III - 198g',
    categories: ['suplementos-especializados'],
    price: 1197.14,
    description: 'Péptidos de colágeno alimentado con pasto, tipos I y III. Apoya la salud de piel, cabello, uñas y articulaciones. En polvo fácil de mezclar.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17234_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Grassfed Collagen Peptides Anverso.jpg',
        full: '/Jpeg/Grassfed Collagen Peptides Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Grassfed Collagen Peptides Reverso.jpg',
        full: '/Jpeg/Grassfed Collagen Peptides Reverso.jpg',
      },
    ],
    stock: 20,
    sku: 'PR-COLL-198',
    tags: ['colágeno', 'piel', 'articulaciones', 'grass-fed'],
  },

  // Probióticos y Enzimas
  {
    id: "pr-digestive-duo",
    name: 'Digestive Duo Probiotic + Multi Enzyme - 30 Cápsulas',
    categories: ['salud-digestiva'],
    price: 267.84,
    description: 'Combinación sinérgica de probióticos y enzimas digestivas múltiples. Apoya la digestión saludable y equilibrio de la flora intestinal.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16789_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Digestive Duo Probiotic Anverso.jpg',
        full: '/Jpeg/Digestive Duo Probiotic Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Digestive Duo Probiotic Reverso.jpg',
        full: '/Jpeg/Digestive Duo Probiotic Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-DIG-30',
    tags: ['probióticos', 'enzimas', 'digestión', 'flora'],
  },

  // Aceites MCT y Energía
  {
    id: "pr-mct-oil",
    name: 'Aceite de MCT (Triglicéridos de Cadena Media) 3600mg - 150 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 760.34,
    description: 'Aceite de MCT para energía rápida y apoyo metabólico. Ideal para dietas cetogénicas y rendimiento mental sostenido.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17489_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/MCT Oil, 3600 mg Anverso.jpg',
        full: '/Jpeg/MCT Oil, 3600 mg Anverso.jpg',
      },
    ],
    stock: 30,
    sku: 'PR-MCT-3600',
    tags: ['MCT', 'energía', 'cetogénico', 'mental'],
  },

  // Productos Adicionales de Piping Rock








  {
    id: "pr-turmeric-advanced",
    name: 'Cúrcuma Avanzada con Curcumina 1500mg - 120 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 2234.85,
    description: 'Fórmula avanzada de cúrcuma con curcumina estandarizada al 95%. Máxima potencia antiinflamatoria natural con biodisponibilidad mejorada y piperrina.',
    images: [
      {
        thumbnail: '/Jpeg/Standardized Turmeric Curcumin Anverso.jpg',
        full: '/Jpeg/Standardized Turmeric Curcumin Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Standardized Turmeric Curcumin Reverso.jpg',
        full: '/Jpeg/Standardized Turmeric Curcumin Reverso.jpg',
      },
    ],
    stock: 12,
    sku: 'PR-TURMERIC-ADV',
    tags: ['cúrcuma', 'curcumina', 'antiinflamatorio', 'articulaciones'],
    // Información detallada
    detailedDescription: 'Esta formulación avanzada de Cúrcuma combina 1500mg de extracto de raíz de Curcuma longa estandarizado al 95% de curcuminoides activos, proporcionando una de las concentraciones más altas disponibles. Los curcuminoides (curcumina, demetoxicurcumina y bisdemetoxicurcumina) son los compuestos responsables de los potentes efectos antiinflamatorios y antioxidantes de la cúrcuma. La fórmula incluye piperrina (extracto de pimienta negra) para mejorar la biodisponibilidad hasta 20 veces, superando la limitación natural de absorción de la curcumina. Esta hierba milenaria de la medicina ayurvédica ofrece apoyo integral para la salud articular, digestiva y general.',
    mechanismOfAction: 'Los curcuminoides ejercen sus efectos antiinflamatorios inhibiendo múltiples vías inflamatorias, incluyendo COX-2, 5-LOX, y el factor de transcripción NF-κB, que regula la expresión de genes proinflamatorios. La curcumina también inhibe la producción de citoquinas inflamatorias como TNF-α, IL-1β e IL-6. Sus propiedades antioxidantes provienen de su capacidad para neutralizar radicales libres y activar enzimas antioxidantes endógenas como SOD y catalasa. Además, modula la señalización celular relacionada con apoptosis, angiogénesis y metastatización, contribuyendo a sus efectos protectores generales.',
    benefitsDescription: [
      'Potente efecto antiinflamatorio natural comparable a medicamentos',
      'Alivio significativo del dolor y rigidez articular',
      'Apoyo a la salud digestiva y función gastrointestinal',
      'Protección antioxidante superior contra el estrés oxidativo',
      'Apoyo a la función cardiovascular y salud del corazón',
      'Mejora de la función hepática y desintoxicación natural',
      'Apoyo al sistema inmunológico y respuesta inmune balanceada',
      'Propiedades neuroprotectoras y apoyo a la salud cerebral'
    ],
    healthIssues: [
      'Artritis, artrosis y dolor articular crónico',
      'Inflamación sistémica y procesos inflamatorios crónicos',
      'Problemas digestivos e inflamación gastrointestinal',
      'Alto estrés oxidativo y daño por radicales libres',
      'Problemas cardiovasculares relacionados con inflamación',
      'Función hepática comprometida y sobrecarga tóxica',
      'Dolor muscular y inflamación post-ejercicio',
      'Condiciones inflamatorias de la piel'
    ],
    components: [
      {
        name: 'Extracto de raíz de Cúrcuma (Curcuma longa)',
        description: 'Estandarizado al 95% de curcuminoides activos (curcumina, demetoxicurcumina, bisdemetoxicurcumina) para máxima potencia terapéutica.',
        amount: '1500 mg por porción (1425 mg de curcuminoides activos)'
      },
      {
        name: 'Extracto de Pimienta Negra (Piper nigrum)',
        description: 'Estandarizado al 95% de piperrina para mejorar la biodisponibilidad de la curcumina hasta 20 veces.',
        amount: '5 mg (4.75 mg de piperrina)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con alimentos que contengan grasas. Para condiciones inflamatorias agudas, puede incrementarse a 3 cápsulas diarias divididas en las comidas.',
    administrationMethod: 'Tomar siempre con alimentos que contengan grasas (aceite de oliva, aguacate, frutos secos) para optimizar la absorción de los curcuminoides liposolubles. La piperrina incluida mejora significativamente la biodisponibilidad. Dividir la dosis a lo largo del día para mantener niveles sanguíneos constantes.',
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en reducir la inflamación?',
        answer: 'Los efectos antiinflamatorios pueden comenzar a notarse dentro de 1-2 semanas de uso regular. Para condiciones crónicas como artritis, los beneficios completos generalmente se observan después de 4-8 semanas de suplementación consistente.'
      },
      {
        question: '¿Por qué incluye pimienta negra?',
        answer: 'La piperrina de la pimienta negra inhibe las enzimas hepáticas que metabolizan la curcumina, aumentando su biodisponibilidad hasta 20 veces. Sin piperrina, la curcumina se metaboliza rápidamente y se elimina del cuerpo.'
      },
      {
        question: '¿Puedo tomarlo si tengo problemas estomacales?',
        answer: 'La cúrcuma es generalmente gentil con el estómago y puede ayudar con la digestión. Sin embargo, en dosis altas puede causar irritación gástrica en personas sensibles. Siempre tomar con alimentos y comenzar con dosis menores.'
      },
      {
        question: '¿Interfiere con medicamentos anticoagulantes?',
        answer: 'SÍ, la cúrcuma puede potenciar los efectos anticoagulantes de warfarina y otros medicamentos. También puede interactuar con medicamentos para diabetes, cáncer, y afectar la absorción de ciertos fármacos. IMPORTANTE: Suspender 2 semanas antes de cirugías. Consultar médico si toma medicamentos.'
      },
      {
        question: '¿Es seguro durante embarazo y lactancia?',
        answer: 'NO se recomienda durante embarazo ya que puede estimular contracciones uterinas. Durante lactancia, evitar dosis medicinales y usar solo cantidades culinarias. Personas con problemas de vesícula biliar también deben evitarlo según WebMD.'
      }
    ]
  },

  // Nuevos productos con imágenes reales de Piping Rock
  {
    id: "101",
    name: 'Ashwagandha 4500mg - 120 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1845.75,
    description: 'Extracto estandarizado de raíz de Ashwagandha (Withania somnifera) de máxima potencia. Adaptógeno ayurvédico tradicional para el manejo natural del estrés y mejora del bienestar general.',
    images: [
      {
        thumbnail: '/Jpeg/Ashwagandha, 4500 mg Anverso.jpg',
        full: '/Jpeg/Ashwagandha, 4500 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Ashwagandha, 4500 mg Reverso.jpg',
        full: '/Jpeg/Ashwagandha, 4500 mg Reverso.jpg',
      },
    ],
    stock: 45,
    sku: 'PR-ASH-4500',
    tags: ['adaptógeno', 'estrés', 'energía', 'ashwagandha', 'ayurveda'],
    // Información detallada
    detailedDescription: 'Esta formulación de Ashwagandha proporciona 4500mg del extracto más concentrado de raíz de Withania somnifera, estandarizado para garantizar niveles óptimos de witanólidos activos. El Ashwagandha es considerado el "ginseng indio" y es uno de los adaptógenos más poderosos de la medicina ayurvédica tradicional. Esta hierba rasayana (rejuvenecedora) ha sido utilizada durante más de 3000 años para fortalecer el sistema inmunológico, aumentar la energía, mejorar la concentración y ayudar al cuerpo a manejar el estrés físico y mental. Nuestra fórmula utiliza extracto de raíz puro, la parte más potente de la planta, procesado para preservar todos los compuestos bioactivos naturales.',
    mechanismOfAction: 'El Ashwagandha actúa como adaptógeno modulando el eje hipotálamo-hipófisis-adrenal (HPA), reduciendo los niveles de cortisol y normalizando la respuesta al estrés. Los witanólidos, sus compuestos activos principales, tienen efectos neuroprotectores y neuroregeneradores, mejorando la función cognitiva y la resistencia al estrés. Además, modula los neurotransmisores GABA, serotonina y dopamina, promoviendo la calma mental y el bienestar emocional. También tiene efectos sobre la función tiroidea, testosterona y hormona del crecimiento, optimizando el equilibrio hormonal general.',
    benefitsDescription: [
      'Reducción significativa del estrés y la ansiedad de forma natural',
      'Mejora de la energía física y resistencia sin estimulantes',
      'Apoyo a la función cognitiva, memoria y concentración',
      'Promoción de un sueño reparador y de calidad',
      'Fortalecimiento del sistema inmunológico y resistencia general',
      'Equilibrio hormonal y apoyo a la función endocrina',
      'Mejora del rendimiento físico y recuperación muscular',
      'Propiedades antiinflamatorias y antioxidantes naturales'
    ],
    healthIssues: [
      'Estrés crónico y ansiedad generalizada',
      'Fatiga adrenal y agotamiento físico o mental',
      'Insomnio y trastornos del sueño',
      'Bajo rendimiento cognitivo y problemas de concentración',
      'Sistema inmunológico debilitado',
      'Desequilibrios hormonales y problemas de tiroides',
      'Bajo rendimiento físico y recuperación lenta',
      'Inflamación crónica y estrés oxidativo'
    ],
    components: [
      {
        name: 'Extracto de raíz de Ashwagandha (Withania somnifera)',
        description: 'Extracto estandarizado de alta potencia que contiene un mínimo de 2.5% de witanólidos activos, los compuestos responsables de los efectos adaptogénicos.',
        amount: '4500 mg por porción (equivalente a 45g de raíz fresca)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día, preferiblemente con alimentos. Para efectos contra el estrés, tomar por la mañana. Para mejorar el sueño, tomar 1-2 horas antes de acostarse.',
    administrationMethod: 'Tomar con alimentos para mejorar la absorción y minimizar cualquier molestia gástrica. Puede tomarse con leche tibia (preparación tradicional ayurvédica) para potenciar sus efectos calmantes. Usar consistentemente durante al menos 2-4 semanas para obtener beneficios óptimos.',
    faqs: [
      {
        question: '¿Cuánto tiempo tarda en hacer efecto el Ashwagandha?',
        answer: 'Los efectos iniciales sobre el estrés y la energía pueden notarse dentro de 1-2 semanas de uso regular. Los beneficios completos sobre el equilibrio hormonal y la función cognitiva se desarrollan típicamente después de 4-6 semanas de suplementación consistente.'
      },
      {
        question: '¿Puedo tomar Ashwagandha con otros medicamentos?',
        answer: 'El Ashwagandha puede interactuar con medicamentos para la tiroides, diabetes y presión arterial. Consulte con su médico antes de usar si toma medicamentos o tiene condiciones médicas, especialmente trastornos autoinmunes.'
      },
      {
        question: '¿Es normal sentir somnolencia al principio?',
        answer: 'Algunas personas pueden experimentar relajación inicial que puede percibirse como somnolencia. Esto generalmente se normaliza después de unos días. Si persiste, considere tomar la dosis por la noche o reducir la cantidad inicial.'
      },
      {
        question: '¿Cuál es la diferencia entre este extracto y el polvo de raíz?',
        answer: 'Nuestro extracto 4500mg está altamente concentrado y estandarizado para witanólidos activos, proporcionando potencia consistente. El polvo de raíz regular contiene menos compuestos activos y requiere dosis mucho más altas para obtener los mismos beneficios.'
      }
    ]
  },

  {
    id: "102",
    name: 'CoQ10 100mg - 120 Cápsulas Blandas',
    categories: ['vitaminas-minerales'],
    price: 2156.80,
    description: 'Coenzima Q10 de alta absorción para la producción de energía celular, salud cardiovascular y protección antioxidante. Esencial para el funcionamiento mitocondrial óptimo.',
    images: [
      {
        thumbnail: '/Jpeg/CoQ10, 100 mg Anverso.jpg',
        full: '/Jpeg/CoQ10, 100 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/CoQ10, 100 mg Reverso.jpg',
        full: '/Jpeg/CoQ10, 100 mg Reverso.jpg',
      },
    ],
    stock: 30,
    sku: 'PR-COQ10-100',
    tags: ['coenzima', 'cardiovascular', 'energía', 'antioxidante', 'mitocondrial'],
    // Información detallada
    detailedDescription: 'Esta formulación de CoQ10 proporciona 100mg de ubiquinona pura en cápsulas blandas para máxima biodisponibilidad. La Coenzima Q10 es un compuesto esencial presente en todas las células del cuerpo, especialmente concentrado en órganos de alta demanda energética como el corazón, hígado, riñones y músculos. Actúa como un componente crítico de la cadena de transporte de electrones mitocondrial, donde es fundamental para la producción de ATP (la moneda energética celular). Además, funciona como un potente antioxidante liposoluble, protegiendo las membranas celulares del daño oxidativo. Los niveles de CoQ10 disminuyen naturalmente con la edad y ciertos medicamentos, haciendo la suplementación especialmente beneficiosa.',
    mechanismOfAction: 'La CoQ10 funciona como cofactor esencial en el complejo III de la cadena respiratoria mitocondrial, facilitando la transferencia de electrones y la síntesis de ATP. En su forma reducida (ubiquinol), actúa como antioxidante lipofílico, neutralizando radicales libres y regenerando otros antioxidantes como la vitamina E. También estabiliza las membranas celulares, mejora la función endotelial vascular, y tiene efectos antiinflamatorios. Su papel en la bioenergética celular es crítico para órganos con alta demanda energética, especialmente el músculo cardíaco.',
    benefitsDescription: [
      'Mejora significativa de la función cardiovascular y salud del corazón',
      'Incremento de la energía celular y reducción de la fatiga',
      'Protección antioxidante superior contra el estrés oxidativo',
      'Apoyo a la función mitocondrial y metabolismo energético',
      'Mejora del rendimiento físico y recuperación muscular',
      'Protección contra el envejecimiento celular prematuro',
      'Apoyo a la salud neurológica y función cognitiva',
      'Mantenimiento de la presión arterial saludable'
    ],
    healthIssues: [
      'Enfermedades cardiovasculares y insuficiencia cardíaca',
      'Fatiga crónica y baja energía celular',
      'Deficiencia de CoQ10 por edad o medicamentos (especialmente estatinas)',
      'Alto estrés oxidativo y daño por radicales libres',
      'Bajo rendimiento físico y recuperación muscular lenta',
      'Problemas de presión arterial y función endotelial',
      'Trastornos mitocondriales y metabolismo energético comprometido',
      'Envejecimiento acelerado y deterioro celular'
    ],
    components: [
      {
        name: 'Coenzima Q10 (como ubiquinona)',
        description: 'Forma estándar y estable de CoQ10 que el cuerpo convierte naturalmente en ubiquinol (forma activa), proporcionando soporte energético y antioxidante completo.',
        amount: '100 mg (cantidad terapéutica óptima)'
      }
    ],
    dosage: 'Tomar 1 cápsula blanda al día con una comida rica en grasas para optimizar la absorción. Para condiciones específicas, puede incrementarse a 2 cápsulas bajo supervisión profesional.',
    administrationMethod: 'Tomar con la comida más rica en grasas del día (almuerzo o cena) ya que la CoQ10 es liposoluble y requiere grasas para su absorción óptima. Evitar tomar con fibra en exceso que puede interferir con la absorción. Para mejores resultados, dividir dosis altas en 2 tomas.',
    faqs: [
      {
        question: '¿Cuál es la diferencia entre ubiquinona y ubiquinol?',
        answer: 'La ubiquinona es la forma oxidada y estable de CoQ10 que nuestro cuerpo convierte naturalmente en ubiquinol (forma reducida activa). La ubiquinona es más estable, económica y ha sido más estudiada, siendo efectiva para la mayoría de personas.'
      },
      {
        question: '¿Debo tomar CoQ10 si uso estatinas?',
        answer: 'Sí, las estatinas pueden reducir significativamente los niveles de CoQ10. La suplementación es especialmente importante para personas que toman estatinas, ya que puede ayudar a prevenir los efectos secundarios musculares asociados con estos medicamentos.'
      },
      {
        question: '¿Cuánto tiempo tarda en notarse los efectos?',
        answer: 'Los efectos energéticos pueden comenzar a notarse después de 2-4 semanas de uso regular. Los beneficios cardiovasculares completos generalmente se desarrollan después de 8-12 semanas de suplementación consistente.'
      },
      {
        question: '¿Es seguro tomar CoQ10 a largo plazo?',
        answer: 'Sí, la CoQ10 es muy segura para uso a largo plazo. Es un compuesto natural presente en nuestro cuerpo y los alimentos. No se han reportado efectos secundarios significativos con el uso prolongado en las dosis recomendadas.'
      }
    ]
  },

  {
    id: "103",
    name: 'GABA 750mg - 100 Cápsulas Vegetarianas',
    categories: ['suplementos-especializados'],
    price: 1567.80,
    description: 'Ácido Gamma-Aminobutírico puro para promover la relajación natural, reducir el estrés y mejorar la calidad del sueño sin somnolencia diurna.',
    images: [
      {
        thumbnail: '/Jpeg/GABA Anverso.jpg',
        full: '/Jpeg/GABA Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/GABA Reverso.jpg',
        full: '/Jpeg/GABA Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'PR-GABA-750',
    tags: ['relajación', 'sueño', 'calma', 'neurotransmisor', 'estrés'],
    // Información detallada
    detailedDescription: 'Esta formulación de GABA proporciona 750mg de ácido gamma-aminobutírico puro, el neurotransmisor inhibitorio principal del sistema nervioso central. GABA es naturalmente producido en el cerebro donde actúa como un "freno" neurológico, contrarrestando la excitación excesiva y promoviendo estados de calma y relajación. Este aminoácido no proteico es fundamental para mantener el equilibrio entre la excitación e inhibición neuronal, siendo crucial para la regulación del estrés, ansiedad y sueño. Nuestra formulación utiliza GABA de alta pureza en cápsulas vegetarianas para máxima biodisponibilidad y efectividad.',
    mechanismOfAction: 'GABA funciona principalmente como neurotransmisor inhibitorio en el sistema nervioso central, pero la absorción oral y el paso a través de la barrera hematoencefálica es limitado. Los efectos pueden ocurrir através de receptores GABA periféricos y modulación del nervio vago. Los estudios muestran efectos variados y la evidencia científica sobre la efectividad de GABA oral es limitada e inconsistente. Puede ejercer algunos efectos relajantes, aunque el mecanismo exacto en suplementación oral no está completamente establecido.',
    benefitsDescription: [
      'Promoción natural de la relajación y reducción del estrés mental',
      'Mejora de la calidad del sueño sin efectos sedantes residuales',
      'Reducción de la ansiedad y nerviosismo de forma natural',
      'Apoyo al equilibrio neurológico y estabilidad del estado de ánimo',
      'Mejora de la concentración al reducir la hiperactividad mental',
      'Apoyo a la recuperación del sistema nervioso tras estrés',
      'Promoción de sensaciones de calma y bienestar general',
      'Apoyo natural para la relajación muscular y tensión'
    ],
    healthIssues: [
      'Estrés crónico y ansiedad generalizada',
      'Insomnio y dificultades para conciliar el sueño',
      'Hiperactividad mental y pensamientos acelerados',
      'Tensión nerviosa y irritabilidad',
      'Problemas de concentración por exceso de estimulación',
      'Desequilibrios neurotransmisores y agitación',
      'Síndrome de estrés postraumático y ansiedad social',
      'Fatiga del sistema nervioso por sobreestimulación'
    ],
    components: [
      {
        name: 'GABA (Ácido Gamma-Aminobutírico)',
        description: 'Neurotransmisor inhibitorio puro de grado farmacéutico que promueve la relajación neurológica y el equilibrio del sistema nervioso.',
        amount: '750 mg por cápsula (dosis terapéutica óptima)'
      }
    ],
    dosage: 'Tomar 1 cápsula al día, preferiblemente 1-2 horas antes de acostarse. NOTA: Los estudios científicos han utilizado dosis más bajas (20-300mg) con efectos variables. Para manejo de estrés diurno, puede tomarse 1 cápsula por la mañana con el estómago vacío. Comenzar con dosis menores si es sensible.',
    administrationMethod: 'Tomar con el estómago vacío para máxima absorción, al menos 30 minutos antes de las comidas o 2 horas después. Para efectos sobre el sueño, tomar 1-2 horas antes de acostarse. IMPORTANTE: La evidencia científica sobre la efectividad de GABA oral es limitada según investigaciones actuales.',
    faqs: [
      {
        question: '¿Es efectivo GABA oral?',
        answer: 'La evidencia científica sobre GABA oral es limitada e inconsistente. WebMD indica que puede no cruzar eficientemente la barrera hematoencefálica, y los estudios muestran resultados variables. Algunos usuarios reportan beneficios, pero la efectividad no está completamente establecida científicamente.'
      },
      {
        question: '¿GABA causa somnolencia durante el día?',
        answer: 'GABA promueve relajación natural sin causar sedación excesiva. Si toma durante el día, comience con dosis menores para evaluar su respuesta individual. La mayoría de personas pueden mantener alertness normal mientras experimentan reducción del estrés.'
      },
      {
        question: '¿Puedo combinarlo con melatonina para el sueño?',
        answer: 'Sí, GABA y melatonina tienen mecanismos complementarios para el sueño. GABA promueve relajación neurológica mientras que melatonina regula el ritmo circadiano. Pueden usarse juntos bajo supervisión profesional.'
      },
      {
        question: '¿Cuánto tiempo tarda en hacer efecto?',
        answer: 'Los efectos relajantes de GABA pueden comenzar a notarse dentro de 30-60 minutos después de la ingesta. Los beneficios completos sobre el sueño y manejo del estrés se desarrollan con uso regular durante 1-2 semanas.'
      },
      {
        question: '¿Es seguro para uso a largo plazo?',
        answer: 'GABA es generalmente seguro para uso a largo plazo ya que es un neurotransmisor natural del cuerpo. Sin embargo, para uso prolongado o si tiene condiciones neurológicas, consulte con un profesional de la salud.'
      }
    ]
  },

  {
    id: "104",
    name: 'L-Theanine 200mg - 120 Cápsulas Vegetarianas',
    categories: ['suplementos-especializados'],
    price: 1789.95,
    description: 'L-Teanina pura para la relajación mental sin somnolencia. Promueve la calma, mejora la concentración y reduce el estrés de forma natural.',
    images: [
      {
        thumbnail: '/Jpeg/L-Theanine, 200 mg Anverso.jpg',
        full: '/Jpeg/L-Theanine, 200 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/L-Theanine, 200 mg Reverso.jpg',
        full: '/Jpeg/L-Theanine, 200 mg Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-LTHEA-200',
    tags: ['relajación', 'concentración', 'té verde', 'calma', 'estrés'],
    // Información detallada
    detailedDescription: 'Esta formulación de L-Teanina proporciona 200mg del aminoácido único encontrado casi exclusivamente en las hojas de té verde (Camellia sinensis). La L-Teanina es responsable del efecto relajante característico del té verde, promoviendo un estado de alerta calmada sin la somnolencia asociada con otros relajantes. Este aminoácido atraviesa fácilmente la barrera hematoencefálica y modula la actividad de las ondas cerebrales, incrementando las ondas alfa asociadas con relajación y concentración enfocada. Nuestra L-Teanina es de grado farmacéutico, pura y libre de cafeína, ofreciendo todos los beneficios relajantes sin estimulación.',
    mechanismOfAction: 'La L-Teanina ejerce sus efectos únicos atravesando la barrera hematoencefálica y modulando varios neurotransmisores clave. Incrementa la producción de GABA, serotonina y dopamina, neurotransmisores asociados con relajación, bienestar y concentración. Simultáneamente, modula las ondas cerebrales aumentando la actividad alfa (8-12 Hz), el mismo patrón observado durante la meditación y estados de relajación alerta. También atenúa la respuesta al estrés reduciendo los niveles de cortisol y modulando la actividad del sistema nervioso simpático, lo que resulta en relajación sin sedación.',
    benefitsDescription: [
      'Promoción de relajación mental sin causar somnolencia o fatiga',
      'Mejora de la concentración y enfoque mental sostenido',
      'Reducción natural del estrés y la ansiedad sin efectos sedantes',
      'Incremento de la actividad de ondas alfa cerebrales (estado meditativo)',
      'Mejora de la calidad del sueño cuando se combina con rutinas nocturnas',
      'Reducción de los efectos negativos de la cafeína (nerviosismo, ansiedad)',
      'Apoyo al sistema inmunológico a través de la reducción del estrés',
      'Promoción de un estado de alerta calmada ideal para el trabajo mental'
    ],
    healthIssues: [
      'Estrés mental y ansiedad sin necesidad de sedación',
      'Dificultades de concentración y distracción mental',
      'Nerviosismo por consumo excesivo de cafeína',
      'Ansiedad de rendimiento y estrés laboral',
      'Hiperactividad mental y pensamientos acelerados',
      'Tensión mental y agitación sin causa física',
      'Problemas para entrar en estados de relajación o meditación',
      'Estrés que interfiere con la concentración y productividad'
    ],
    components: [
      {
        name: 'L-Teanina (γ-glutamiletilamida)',
        description: 'Aminoácido único derivado del té verde, químicamente puro y libre de cafeína, que cruza la barrera hematoencefálica para ejercer efectos directos sobre el cerebro.',
        amount: '200 mg por cápsula (dosis clínicamente estudiada)'
      }
    ],
    dosage: 'Tomar 1 cápsula al día según necesidad. Para estrés general: por la mañana. Para mejorar concentración: 30 minutos antes del trabajo mental. Para relajación nocturna: 1-2 horas antes de acostarse.',
    administrationMethod: 'Puede tomarse con o sin alimentos. Para maximizar efectos sobre concentración, tomar con el estómago vacío. Se combina bien con cafeína para crear un estado de alerta calmada. No requiere ciclado y puede usarse según necesidad.',
    faqs: [
      {
        question: '¿Puedo combinar L-Teanina con cafeína?',
        answer: 'Sí, de hecho es una combinación muy popular. La L-Teanina suaviza los efectos negativos de la cafeína (nerviosismo, ansiedad) mientras mantiene la alerta mental. La proporción típica es 2:1 (200mg L-Teanina con 100mg cafeína).'
      },
      {
        question: '¿Causará somnolencia si la tomo durante el día?',
        answer: 'No, la L-Teanina promueve relajación sin somnolencia. De hecho, mejora la concentración y el enfoque mental mientras reduce el estrés. Es ideal para usar durante el día cuando necesita mantener alerta pero calmado.'
      },
      {
        question: '¿Cuánto tiempo tarda en hacer efecto?',
        answer: 'Los efectos de la L-Teanina suelen comenzar dentro de 30-60 minutos después de la ingesta y pueden durar 6-8 horas. Los efectos son suaves y graduales, sin el pico y caída de otros suplementos.'
      },
      {
        question: '¿Es seguro tomar L-Teanina todos los días?',
        answer: 'Sí, la L-Teanina es muy segura para uso diario. Es un componente natural del té verde que se ha consumido durante miles de años. No causa dependencia ni tolerancia, y puede usarse a largo plazo sin problemas. Sin embargo, embarazadas y mujeres lactantes deben evitar la suplementación según WebMD.'
      }
    ]
  },

  {
    id: "105",
    name: 'Magnesium Citrate 400mg - 180 Cápsulas',
    categories: ['vitaminas-minerales'],
    price: 1234.75,
    description: 'Citrato de magnesio de alta absorción para función muscular, relajación nerviosa y apoyo cardiovascular. Forma quelada con máxima biodisponibilidad.',
    images: [
      {
        thumbnail: '/Jpeg/Magnesium Citrate, 400 mg Anverso.jpg',
        full: '/Jpeg/Magnesium Citrate, 400 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Magnesium Citrate, 400 mg Reverso.jpg',
        full: '/Jpeg/Magnesium Citrate, 400 mg Reverso.jpg',
      },
    ],
    stock: 60,
    sku: 'PR-MAG-CIT-400',
    tags: ['magnesio', 'músculos', 'nervios', 'citrato', 'relajación'],
    // Información detallada
    detailedDescription: 'Esta formulación de Citrato de Magnesio proporciona 400mg de magnesio elemental en forma de citrato, una de las formas más biodisponibles de este mineral esencial. El magnesio es el cuarto mineral más abundante en el cuerpo humano y cofactor en más de 300 reacciones enzimáticas. Es fundamental para la función muscular y nerviosa, síntesis de proteínas, control glucémico, regulación de la presión arterial y formación ósea. La deficiencia de magnesio es común en la dieta moderna, haciendo la suplementación especialmente importante para la salud óptima. El citrato de magnesio ofrece absorción superior comparado con óxido de magnesio y es gentil con el sistema digestivo.',
    mechanismOfAction: 'El magnesio funciona como cofactor enzimático esencial en reacciones que involucran ATP, la moneda energética celular. En los músculos, regula la contracción al controlar el flujo de calcio en los filamentos de actina y miosina, permitiendo relajación muscular apropiada. En el sistema nervioso, estabiliza las membranas neuronales y modula la liberación de neurotransmisores. A nivel cardiovascular, actúa como bloqueador natural de canales de calcio, promoviendo vasodilatación y regulación de la presión arterial. También participa en la síntesis de ADN, ARN y el antioxidante glutatión.',
    benefitsDescription: [
      'Relajación muscular natural y reducción de calambres y espasmos',
      'Apoyo a la función nerviosa normal y reducción de la irritabilidad',
      'Mejora de la calidad del sueño y relajación nocturna',
      'Apoyo cardiovascular y mantenimiento de presión arterial saludable',
      'Fortalecimiento de huesos y dientes junto con calcio y vitamina D',
      'Mejora del metabolismo energético y reducción de fatiga',
      'Apoyo a la función digestiva normal y regularidad intestinal',
      'Reducción del estrés y apoyo al sistema nervioso bajo presión'
    ],
    healthIssues: [
      'Deficiencia de magnesio y calambres musculares frecuentes',
      'Insomnio y dificultades para relajarse naturalmente',
      'Estrés crónico y tensión nerviosa',
      'Presión arterial elevada y problemas cardiovasculares',
      'Fatiga crónica y bajo metabolismo energético',
      'Síndrome premenstrual y molestias menstruales',
      'Problemas digestivos y estreñimiento ocasional',
      'Dolor de cabeza tensional y migrañas'
    ],
    components: [
      {
        name: 'Magnesio (como citrato de magnesio)',
        description: 'Forma quelada de magnesio con ácido cítrico que proporciona absorción superior y es gentil con el sistema digestivo.',
        amount: '400 mg de magnesio elemental (95% del Valor Diario)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con alimentos. Para relajación y sueño: tomar 1-2 cápsulas 1-2 horas antes de acostarse. Para apoyo general: dividir la dosis entre las comidas.',
    administrationMethod: 'Tomar con alimentos para minimizar molestias gástricas menores y mejorar la absorción. Para efectos relajantes, tomar por la noche. Espaciar de suplementos de calcio o zinc al menos 2 horas para evitar competencia por absorción. Beber abundante agua.',
    faqs: [
      {
        question: '¿Por qué citrato de magnesio en lugar de óxido?',
        answer: 'El citrato de magnesio tiene una biodisponibilidad aproximadamente 4 veces superior al óxido de magnesio y es mucho más gentil con el sistema digestivo. El óxido puede causar diarrea en dosis menores, mientras que el citrato es mejor tolerado.'
      },
      {
        question: '¿Puede ayudar con calambres musculares nocturnos?',
        answer: 'Sí, el magnesio es especialmente efectivo para calambres musculares, particularmente nocturnos. Tomar 1-2 cápsulas antes de acostarse puede prevenir calambres en piernas y pies durante la noche.'
      },
      {
        question: '¿Cuándo veré mejoras en el sueño?',
        answer: 'Los efectos relajantes del magnesio sobre el sueño pueden notarse dentro de 1-2 semanas de uso regular. Para mejores resultados, tomar 1-2 horas antes de acostarse como parte de una rutina nocturna consistente.'
      },
      {
        question: '¿Puede interferir con medicamentos?',
        answer: 'El magnesio puede reducir la absorción de algunos antibióticos (tetraciclinas, quinolonas) y medicamentos para la osteoporosis. Espacie al menos 2-4 horas de estos medicamentos. Consulte con su médico si toma medicamentos para el corazón o diuréticos.'
      }
    ]
  },

  // Nuevos Productos Piping Rock - Hierbas Tradicionales
  {
    id: "pr-stinging-nettles",
    name: 'Ortiga (Stinging Nettles) 900mg - 180 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1245.80,
    description: 'Extracto de hoja de ortiga tradicionalmente usado para apoyar la salud de la próstata, alivio de alergias estacionales y bienestar urinario.',
    // IMAGEN PIPING ROCK: Stinging Nettles
    images: [
      {
        thumbnail: '/Jpeg/Stinging Nettles Anverso.jpg',
        full: '/Jpeg/Stinging Nettles Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Stinging Nettles Reverso.jpg',
        full: '/Jpeg/Stinging Nettles Reverso.jpg',
      },
    ],
    stock: 45,
    sku: 'PR-NETTLE-900',
    tags: ['ortiga', 'próstata', 'alergias', 'urinario'],
    // Información detallada
    detailedDescription: 'Esta formulación de Ortiga (Urtica dioica) proporciona 900mg de extracto estandarizado de hoja de ortiga en cápsulas vegetarianas de alta potencia. La ortiga ha sido utilizada tradicionalmente en la fitoterapia europea durante siglos para apoyar la salud urogenital masculina, especialmente la próstata, y para el manejo natural de las alergias estacionales. Rica en silicio, potasio, vitaminas y flavonoides, esta hierba perenne ofrece beneficios antiinflamatorios naturales y propiedades diuréticas suaves. Nuestro extracto preserva los compuestos bioactivos esenciales, incluyendo ácidos cafeicos, quercetina y beta-sitosterol, responsables de sus efectos terapéuticos.',
    mechanismOfAction: 'La ortiga ejerce sus efectos a través de múltiples mecanismos bioactivos. Los beta-sitosteroles y otros fitosteroles inhiben la enzima 5-alfa-reductasa, reduciendo la conversión de testosterona a dihidrotestosterona (DHT), beneficiando la salud prostática. Sus propiedades antihistamínicas naturales provienen de la inhibición de la liberación de histamina por los mastocitos, aliviando los síntomas alérgicos. Los compuestos fenólicos ejercen efectos antiinflamatorios al inhibir las citoquinas proinflamatorias como TNF-α e IL-1β. Además, sus propiedades diuréticas suaves apoyan la función renal y urinaria saludable.',
    benefitsDescription: [
      'Apoyo natural a la salud prostática y función urinaria masculina',
      'Alivio de alergias estacionales y síntomas de rinitis alérgica',
      'Propiedades antiinflamatorias naturales para articulaciones y tejidos',
      'Efecto diurético suave que apoya la función renal saludable',
      'Rica fuente de minerales esenciales, especialmente silicio y potasio',
      'Apoyo a la salud del cabello y fortalecimiento capilar',
      'Beneficios para la piel y mantenimiento de la salud dermatológica',
      'Propiedades antioxidantes que protegen contra el estrés oxidativo'
    ],
    healthIssues: [
      'Hiperplasia prostática benigna (HPB) y problemas urinarios relacionados',
      'Alergias estacionales, rinitis alérgica y síntomas respiratorios',
      'Inflamación articular y molestias musculoesqueléticas',
      'Retención de líquidos y problemas de función renal menor',
      'Deficiencias minerales, especialmente de silicio',
      'Problemas de cabello débil y pérdida capilar',
      'Condiciones inflamatorias de la piel',
      'Estrés oxidativo y procesos inflamatorios crónicos'
    ],
    components: [
      {
        name: 'Extracto de hoja de Ortiga (Urtica dioica)',
        description: 'Extracto estandarizado rico en beta-sitosteroles, flavonoides (quercetina, rutina), ácidos fenólicos y minerales esenciales como silicio y potasio.',
        amount: '900 mg por cápsula (relación 4:1 equivalente a 3600mg de hoja fresca)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con alimentos, preferiblemente divididas entre las comidas. Para apoyo prostático, usar consistentemente durante al menos 8-12 semanas.',
    administrationMethod: 'Tomar con alimentos para minimizar cualquier molestia gástrica menor. Beber abundante agua durante el uso para apoyar la función diurética natural. Para alergias, comenzar la suplementación 2-4 semanas antes de la temporada alérgica para mejores resultados preventivos.',
    faqs: [
      {
        question: '¿Es seguro tomar ortiga a largo plazo?',
        answer: 'Sí, la ortiga tiene un historial milenario de uso seguro en la fitoterapia tradicional. Es segura para uso a largo plazo en las dosis recomendadas. Sin embargo, consulte con su médico si tiene condiciones médicas específicas.'
      },
      {
        question: '¿Puede ayudar con los síntomas de próstata agrandada?',
        answer: 'Los estudios clínicos han mostrado que la ortiga puede ayudar a mejorar los síntomas urinarios asociados con HPB, incluyendo frecuencia urinaria, flujo urinario y vaciado vesical. Sin embargo, siempre consulte con su urólogo para evaluación adecuada.'
      },
      {
        question: '¿Cuándo es mejor tomarla para las alergias estacionales?',
        answer: 'Para mejores resultados en alergias, comience a tomar ortiga 2-4 semanas antes de su temporada alérgica típica. Esto permite que los compuestos antihistamínicos naturales se acumulen en su sistema para máxima efectividad preventiva.'
      },
      {
        question: '¿Tiene alguna interacción con medicamentos?',
        answer: 'La ortiga puede potenciar los efectos de medicamentos diuréticos y para la presión arterial. También puede afectar la coagulación sanguínea. Consulte con su médico si toma medicamentos, especialmente anticoagulantes o para la presión arterial.'
      }
    ]
  },

  {
    id: "pr-pau-darco",
    name: 'Pau d\'Arco Corteza Interior 1000mg - 180 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1156.75,
    description: 'Extracto de corteza interior de Pau d\'Arco (Lapacho), hierba tradicional amazónica rica en lapachol. Apoya el sistema inmunológico y bienestar general.',
    // IMAGEN PIPING ROCK: Pau d'Arco Inner Bark
    images: [
      {
        thumbnail: '/Jpeg/Pau d\'Arco Inner Bark Anverso.jpg',
        full: '/Jpeg/Pau d\'Arco Inner Bark Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Pau d\'Arco Inner Bark Reverso.jpg',
        full: '/Jpeg/Pau d\'Arco Inner Bark Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-PAUDARC-1000',
    tags: ['pau d\'arco', 'lapacho', 'inmune', 'amazónico'],
    // Información detallada
    detailedDescription: 'Esta formulación de Pau d\'Arco contiene 1000mg de extracto puro de corteza interior de Tabebuia impetiginosa, también conocido como Lapacho o Ipe roxo en la tradición amazónica. Esta venerada hierba medicinal ha sido utilizada durante siglos por las tribus indígenas de Brasil, Argentina y Paraguay como tónico general y apoyo inmunológico. La corteza interior (floema) es la parte más potente del árbol, rica en naftoquinonas bioactivas como lapachol y beta-lapachona, junto con saponinas, taninos y minerales. Nuestro extracto se procesa cuidadosamente para preservar estos compuestos activos naturales que le confieren sus propiedades terapéuticas tradicionales.',
    mechanismOfAction: 'Los compuestos activos del Pau d\'Arco, especialmente las naftoquinonas como lapachol y beta-lapachona, ejercen efectos antimicrobianos, antiinflamatorios e inmunomoduladores. Estas moléculas interfieren con el metabolismo microbiano al inhibir la síntesis de ADN y afectar la cadena respiratoria mitocondrial de patógenos. Sus propiedades inmunoestimulantes provienen de la activación de macrófagos y células NK, mejorando la respuesta inmunológica innata. Además, los taninos proporcionan efectos astringentes y antioxidantes, mientras que las saponinas contribuyen a sus propiedades antiinflamatorias y de apoyo circulatorio.',
    benefitsDescription: [
      'Fortalecimiento natural del sistema inmunológico y resistencia a infecciones',
      'Propiedades antimicrobianas tradicionales contra hongos, bacterias y levaduras',
      'Apoyo a la salud digestiva y equilibrio de la microflora intestinal',
      'Efectos antiinflamatorios naturales para el bienestar general',
      'Propiedades antioxidantes que protegen contra el estrés oxidativo',
      'Apoyo a la salud respiratoria y función pulmonar',
      'Beneficios tradicionales para la salud de la piel',
      'Efectos tonificantes generales y aumento de la vitalidad'
    ],
    healthIssues: [
      'Sistema inmunológico comprometido o infecciones recurrentes',
      'Desequilibrios de la microflora intestinal y problemas digestivos',
      'Infecciones fúngicas y por levaduras (como Candida)',
      'Inflamación crónica y procesos inflamatorios',
      'Problemas respiratorios y congestión',
      'Fatiga crónica y baja vitalidad',
      'Problemas de piel relacionados con hongos o inflamación',
      'Estrés oxidativo elevado y daño por radicales libres'
    ],
    components: [
      {
        name: 'Extracto de corteza interior de Pau d\'Arco (Tabebuia impetiginosa)',
        description: 'Extracto concentrado rico en naftoquinonas activas (lapachol, beta-lapachona), saponinas, taninos y minerales traza de la selva amazónica.',
        amount: '1000 mg por cápsula (relación 4:1 equivalente a 4000mg de corteza fresca)'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con alimentos, preferiblemente entre comidas. Para apoyo inmunológico intensivo, puede incrementarse temporalmente bajo supervisión de un profesional.',
    administrationMethod: 'Tomar con abundante agua, preferiblemente entre comidas para optimizar la absorción. Puede tomarse con una pequeña cantidad de alimento si experimenta sensibilidad gástrica. Para mejores resultados como apoyo inmunológico, usar en ciclos de 6-8 semanas con descansos de 1-2 semanas.',
    faqs: [
      {
        question: '¿Es seguro tomar Pau d\'Arco a largo plazo?',
        answer: 'El Pau d\'Arco es tradicionalmente seguro, pero se recomienda usarlo en ciclos: 6-8 semanas de uso seguidas de 1-2 semanas de descanso. Esto permite que el cuerpo procese los compuestos activos y mantiene la efectividad del suplemento.'
      },
      {
        question: '¿Puede ayudar con problemas de Candida?',
        answer: 'El Pau d\'Arco ha sido tradicionalmente usado para equilibrar la microflora intestinal y sus propiedades antimicrobianas pueden ser beneficiosas. Sin embargo, para problemas específicos de Candida, es importante seguir un protocolo integral bajo supervisión profesional.'
      },
      {
        question: '¿Cuándo es mejor momento para tomarlo?',
        answer: 'Es mejor tomarlo entre comidas con abundante agua para optimizar la absorción de los compuestos activos. Si experimenta molestias gástricas, puede tomarlo con una pequeña cantidad de alimento.'
      },
      {
        question: '¿Tiene alguna contraindicación importante?',
        answer: 'No debe usarse durante el embarazo o lactancia. Personas con trastornos de coagulación deben consultar con su médico. También puede potenciar los efectos de anticoagulantes, por lo que se requiere supervisión médica si toma estos medicamentos.'
      }
    ]
  },

  // Vitaminas Esenciales
  {
    id: "pr-vitamin-a",
    name: 'Vitamina A 10,000 UI - 250 Cápsulas Blandas',
    categories: ['vitaminas-minerales'],
    price: 892.45,
    description: 'Vitamina A de alta potencia para la salud visual, función inmunológica y mantenimiento de tejidos epiteliales. Esencial para la visión nocturna.',
    // IMAGEN PIPING ROCK: Vitamin A 10,000 IU
    images: [
      {
        thumbnail: '/Jpeg/Vitamin A, 10,000 IU Anverso.jpg',
        full: '/Jpeg/Vitamin A, 10,000 IU Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Vitamin A, 10,000 IU Reverso.jpg',
        full: '/Jpeg/Vitamin A, 10,000 IU Reverso.jpg',
      },
    ],
    stock: 55,
    sku: 'PR-VITA-10000',
    tags: ['vitamina A', 'visión', 'inmune', 'piel'],
    // Información detallada
    detailedDescription: 'Esta formulación de Vitamina A proporciona 10,000 UI (3000 mcg) de retinol palmitato en cápsulas blandas de fácil absorción. La vitamina A es una vitamina liposoluble esencial que juega roles críticos en la visión, función inmunológica, reproducción y comunicación celular. Esta forma pre-formada de vitamina A (retinol) es directamente utilizable por el cuerpo, a diferencia de los carotenoides que requieren conversión. Es especialmente importante para mantener la visión nocturna, la integridad de las superficies mucosas y el funcionamiento óptimo del sistema inmunológico.',
    mechanismOfAction: 'La vitamina A funciona uniéndose a receptores nucleares específicos (RAR y RXR) que actúan como factores de transcripción, regulando la expresión de más de 500 genes. En la visión, el retinal (forma aldehído de la vitamina A) se combina con la opsina para formar rodopsina en los bastones retinianos, esencial para la visión en condiciones de poca luz. Además, regula la diferenciación celular, mantiene la integridad epitelial y modula las respuestas inmunológicas innatas y adaptativas.',
    benefitsDescription: [
      'Mejora significativa de la visión nocturna y adaptación a la oscuridad',
      'Fortalecimiento robusto del sistema inmunológico y resistencia a infecciones',
      'Mantenimiento de la salud y integridad de piel, mucosas y tejidos epiteliales',
      'Apoyo esencial al crecimiento y desarrollo celular normal',
      'Mejora de la función reproductiva y salud hormonal',
      'Protección antioxidante contra el daño oxidativo celular',
      'Apoyo a la cicatrización y reparación de tejidos'
    ],
    healthIssues: [
      'Deficiencia de vitamina A y ceguera nocturna',
      'Sistema inmunológico comprometido o infecciones frecuentes',
      'Problemas de piel seca, descamación o queratinización anormal',
      'Trastornos de la visión y adaptación lumínica deficiente',
      'Problemas de crecimiento y desarrollo en niños',
      'Cicatrización lenta y problemas de reparación tisular',
      'Sequedad de mucosas y problemas respiratorios recurrentes'
    ],
    components: [
      {
        name: 'Vitamina A (como palmitato de retinilo)',
        description: 'Forma pre-formada y altamente biodisponible de vitamina A que no requiere conversión, proporcionando máxima eficacia terapéutica.',
        amount: '10,000 UI (3000 mcg) (333% del Valor Diario)'
      }
    ],
    dosage: 'Tomar 1 cápsula blanda al día con una comida que contenga grasas para optimizar la absorción. No exceder la dosis recomendada sin supervisión médica.',
    administrationMethod: 'Tomar con alimentos ricos en grasas (aceite de oliva, frutos secos, aguacate) ya que la vitamina A es liposoluble y requiere grasas para su absorción óptima. Evitar el alcohol durante la suplementación.',
    faqs: [
      {
        question: '¿Cuál es la diferencia entre vitamina A y betacaroteno?',
        answer: 'Esta vitamina A es retinol pre-formado, directamente utilizable por el cuerpo sin necesidad de conversión. El betacaroteno debe convertirse a vitamina A, proceso que puede ser ineficiente en algunas personas. El retinol proporciona beneficios más directos y predecibles.'
      },
      {
        question: '¿Es segura esta dosis de 10,000 UI?',
        answer: 'Sí, 10,000 UI está dentro del rango seguro para adultos sanos. Sin embargo, no debe excederse sin supervisión médica, especialmente en mujeres embarazadas o que planean embarazarse, donde dosis altas pueden ser teratogénicas.'
      },
      {
        question: '¿Puedo tomar vitamina A si tengo problemas hepáticos?',
        answer: 'Las personas con problemas hepáticos deben consultar con su médico antes de suplementar, ya que la vitamina A se almacena en el hígado y el exceso puede acumularse en casos de función hepática comprometida.'
      },
      {
        question: '¿Cuándo notaré mejoras en la visión nocturna?',
        answer: 'Los beneficios en la visión nocturna generalmente se observan dentro de 2-4 semanas de suplementación regular, siempre que la deficiencia sea la causa del problema visual.'
      }
    ]
  },

  {
    id: "pr-vitamin-e",
    name: 'Vitamina E 200 UI - 250 Cápsulas Blandas',
    categories: ['vitaminas-minerales'],
    price: 734.60,
    description: 'Vitamina E natural (d-alfa tocoferol) con potente actividad antioxidante. Protege las células del estrés oxidativo y apoya la salud cardiovascular.',
    // IMAGEN PIPING ROCK: Vitamin E 200 IU
    images: [
      {
        thumbnail: '/Jpeg/Vitamin E, 200 IU Anverso.jpg',
        full: '/Jpeg/Vitamin E, 200 IU Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Vitamin E, 200 IU Reverso.jpg',
        full: '/Jpeg/Vitamin E, 200 IU Reverso.jpg',
      },
    ],
    stock: 50,
    sku: 'PR-VITE-200',
    tags: ['vitamina E', 'antioxidante', 'cardiovascular', 'tocoferol'],
    // Información detallada
    detailedDescription: 'Esta formulación de Vitamina E contiene 200 UI (134 mg) de d-alfa tocoferol natural en cápsulas blandas de máxima biodisponibilidad. La vitamina E es el antioxidante liposoluble más importante del cuerpo, protegiendo las membranas celulares del daño oxidativo causado por radicales libres. Como antioxidante de ruptura de cadena, interrumpe las reacciones en cadena de peroxidación lipídica, preservando la integridad estructural de las células y tejidos. Esta forma natural (d-alfa tocoferol) es significativamente más potente y mejor retenida por el organismo que las formas sintéticas.',
    mechanismOfAction: 'La vitamina E funciona como antioxidante primario en las membranas celulares, donando electrones a los radicales peroxilo para formar radicales tocoferilo relativamente estables, interrumpiendo así las reacciones en cadena de peroxidación lipídica. Se regenera a través de interacciones sinérgicas con otros antioxidantes como la vitamina C y el glutatión. Además, modula la expresión génica, inhibe la agregación plaquetaria, mejora la función inmunológica y tiene efectos antiinflamatorios a través de la inhibición de la proteína quinasa C.',
    benefitsDescription: [
      'Protección antioxidante superior contra el daño de radicales libres',
      'Preservación de la integridad y elasticidad de las membranas celulares',
      'Apoyo cardiovascular y protección contra la oxidación del colesterol LDL',
      'Fortalecimiento del sistema inmunológico y función inmune óptima',
      'Protección de la piel contra el fotoenvejecimiento y daño UV',
      'Mejora de la circulación sanguínea y función endotelial',
      'Apoyo a la salud reproductiva y fertilidad',
      'Protección neurológica contra el estrés oxidativo cerebral'
    ],
    healthIssues: [
      'Deficiencia de vitamina E y estrés oxidativo elevado',
      'Problemas cardiovasculares y oxidación del colesterol LDL',
      'Sistema inmunológico comprometido o respuesta inmune deficiente',
      'Envejecimiento prematuro de la piel y daño por radicales libres',
      'Problemas de circulación y función endotelial comprometida',
      'Exposición a contaminantes ambientales y toxinas',
      'Trastornos neurológicos relacionados con estrés oxidativo',
      'Problemas de fertilidad en hombres y mujeres'
    ],
    components: [
      {
        name: 'Vitamina E (como d-alfa tocoferol natural)',
        description: 'Forma natural más potente y biodisponible de vitamina E, superior a las formas sintéticas en absorción y retención tisular.',
        amount: '200 UI (134 mg) (893% del Valor Diario)'
      }
    ],
    dosage: 'Tomar 1 cápsula blanda al día con una comida que contenga grasas para optimizar la absorción. Para necesidades aumentadas, consultar con un profesional de la salud.',
    administrationMethod: 'Tomar con alimentos ricos en grasas para maximizar la absorción de esta vitamina liposoluble. Evitar tomar simultáneamente con suplementos de hierro ya que pueden interferir entre sí. Espaciar al menos 8 horas si se toman anticoagulantes.',
    faqs: [
      {
        question: '¿Cuál es la diferencia entre vitamina E natural y sintética?',
        answer: 'La vitamina E natural (d-alfa tocoferol) es aproximadamente 2 veces más potente que la sintética (dl-alfa tocoferol) y se retiene mejor en los tejidos. La forma natural se deriva de aceites vegetales, mientras que la sintética es producida químicamente.'
      },
      {
        question: '¿Puedo tomar vitamina E si estoy en tratamiento anticoagulante?',
        answer: 'La vitamina E puede potenciar los efectos anticoagulantes. Si toma warfarina u otros anticoagulantes, consulte con su médico antes de suplementar y espacie las tomas al menos 8 horas.'
      },
      {
        question: '¿Es seguro tomar 200 UI diariamente?',
        answer: 'Sí, 200 UI está bien dentro del límite superior tolerable de 1000 UI diarios para adultos. Esta dosis proporciona beneficios antioxidantes óptimos sin riesgo de toxicidad.'
      },
      {
        question: '¿Cuándo es mejor momento para tomar vitamina E?',
        answer: 'Es mejor tomarla con la comida más rica en grasas del día (generalmente almuerzo o cena) para maximizar la absorción. La vitamina E es liposoluble y requiere grasas para su absorción óptima.'
      }
    ]
  },

  {
    id: "pr-yohimbe-max",
    name: 'Yohimbe Max 2000mg - 90 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1567.90,
    description: 'Extracto concentrado de corteza de Yohimbe tradicionalmente usado para apoyar la vitalidad masculina y energía. Estandarizado para máxima potencia.',
    // IMAGEN PIPING ROCK: Yohimbe Max
    images: [
      {
        thumbnail: '/Jpeg/Yohimbe Max Anverso.jpg',
        full: '/Jpeg/Yohimbe Max Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Yohimbe Max Reverso.jpg',
        full: '/Jpeg/Yohimbe Max Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-YOHIMBE-2000',
    tags: ['yohimbe', 'vitalidad', 'masculino', 'energía'],
    // Información detallada
    detailedDescription: 'Esta formulación de Yohimbe Max proporciona 2000mg de extracto concentrado de corteza de Pausinystalia johimbe, árbol nativo de África Occidental. La corteza de yohimbe ha sido utilizada tradicionalmente en la medicina africana durante siglos para apoyar la vitalidad masculina y el bienestar general. Nuestro extracto está estandarizado para garantizar niveles consistentes de yohimbina HCl, el alcaloide activo principal responsable de sus efectos tradicionales. Este suplemento está diseñado exclusivamente para hombres adultos y requiere uso responsable bajo supervisión profesional debido a su potencia.',
    mechanismOfAction: 'El yohimbe contiene yohimbina, un alcaloide indólico que actúa como antagonista selectivo de los receptores alfa-2 adrenérgicos, particularmente en el sistema vascular periférico. Este mecanismo puede influir en el flujo sanguíneo y la respuesta vascular. También tiene efectos sobre el sistema nervioso simpático y puede influir en los niveles de noradrenalina. Los efectos tradicionales se atribuyen a esta modulación del sistema adrenérgico y sus efectos sobre la circulación periférica.',
    benefitsDescription: [
      'Apoyo tradicional a la vitalidad masculina y bienestar general',
      'Efectos tradicionales sobre la energía y resistencia física',
      'Apoyo circulatorio periférico según uso tradicional',
      'Beneficios energéticos y de vitalidad en medicina tradicional africana',
      'Apoyo al bienestar masculino según usos etnobotánicos'
    ],
    healthIssues: [
      'Baja vitalidad y energía en hombres adultos',
      'Fatiga y cansancio general',
      'Problemas circulatorios periféricos menores',
      'Falta de energía y resistencia física'
    ],
    components: [
      {
        name: 'Extracto de corteza de Yohimbe (Pausinystalia johimbe)',
        description: 'Extracto estandarizado de corteza que contiene yohimbina HCl y otros alcaloides naturales responsables de los efectos tradicionales.',
        amount: '2000 mg por cápsula (estandarizado al 8% de yohimbina HCl)'
      }
    ],
    dosage: 'SOLO para hombres adultos: Comenzar con 1/2 cápsula al día con el estómago vacío. Si se tolera bien, puede incrementarse gradualmente hasta 1 cápsula al día. NO exceder 1 cápsula diaria.',
    administrationMethod: 'Tomar con el estómago vacío, al menos 2 horas después de comer y 1 hora antes de la siguiente comida. Evitar tomar con alimentos, alcohol o cafeína. Comenzar siempre con dosis menor para evaluar tolerancia individual. Tomar con abundante agua.',
    faqs: [
      {
        question: '¿Quién NO debe tomar Yohimbe?',
        answer: 'NO apto para mujeres, menores de 18 años, personas con problemas cardíacos, presión arterial alta o baja, ansiedad, depresión, problemas renales o hepáticos. NO usar si toma antidepresivos, medicamentos para la presión arterial o cualquier medicamento recetado sin consultar médico.'
      },
      {
        question: '¿Qué efectos secundarios puede tener?',
        answer: 'Puede causar ansiedad, nerviosismo, insomnio, aumento de presión arterial, palpitaciones, mareos, náuseas o dolor de cabeza. Si experimenta cualquier efecto adverso, suspenda inmediatamente y consulte un médico.'
      },
      {
        question: '¿Se puede combinar con otros suplementos?',
        answer: 'NO combine con estimulantes, cafeína en exceso, otros suplementos para vitalidad masculina, o cualquier medicamento sin supervisión médica. Las interacciones pueden ser peligrosas.'
      },
      {
        question: '¿Cuánto tiempo puedo usarlo?',
        answer: 'Use solo según necesidades específicas y no de forma continua. Se recomienda usar en ciclos cortos con descansos, bajo supervisión de un profesional de la salud capacitado en fitoterapia.'
      }
    ]
  },

  // Suplementos Deportivos y Circulación
  {
    id: "pr-nitric-oxide-max",
    name: 'Óxido Nítrico Max 1200mg - 180 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1389.50,
    description: 'Fórmula avanzada de precursores de óxido nítrico con L-Arginina y L-Citrulina. Apoya el flujo sanguíneo, rendimiento deportivo y salud cardiovascular.',
    // IMAGEN PIPING ROCK: Nitric Oxide Max
    images: [
      {
        thumbnail: '/Jpeg/Nitric Oxide Max Anverso.jpg',
        full: '/Jpeg/Nitric Oxide Max Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Nitric Oxide Max Reverso.jpg',
        full: '/Jpeg/Nitric Oxide Max Reverso.jpg',
      },
    ],
    stock: 30,
    sku: 'PR-NO-MAX-1200',
    tags: ['óxido nítrico', 'deportivo', 'circulación', 'arginina'],
    // Información detallada
    detailedDescription: 'Esta formulación avanzada de Óxido Nítrico Max combina 1200mg de aminoácidos precursores clave para la síntesis natural de óxido nítrico (NO) en el organismo. La fórmula incluye L-Arginina y L-Citrulina en proporciones optimizadas, junto con otros cofactores nutricionales que apoyan la vía NO-sintasa. El óxido nítrico es una molécula de señalización crucial que regula la vasodilatación, mejorando el flujo sanguíneo y la entrega de oxígeno y nutrientes a los tejidos. Esta fórmula está especialmente diseñada para atletas, personas activas y quienes buscan apoyo cardiovascular natural.',
    mechanismOfAction: 'La L-Arginina actúa como sustrato directo para la enzima óxido nítrico sintasa endotelial (eNOS), que convierte la arginina en óxido nítrico y citrulina. La L-Citrulina es convertida a L-Arginina en los riñones, proporcionando un suministro sostenido de sustrato para la síntesis de NO y evitando la degradación hepática de primera pasada. El óxido nítrico producido activa la enzima guanilato ciclasa, aumentando los niveles de cGMP, lo que resulta en relajación del músculo liso vascular y vasodilatación. Este proceso mejora el flujo sanguíneo, reduce la presión arterial y optimiza la entrega de nutrientes.',
    benefitsDescription: [
      'Mejora significativa del flujo sanguíneo y circulación periférica',
      'Aumento del rendimiento deportivo y resistencia física',
      'Mejor entrega de oxígeno y nutrientes a los músculos',
      'Apoyo a la salud cardiovascular y función endotelial',
      'Reducción de la fatiga muscular y mejora de la recuperación',
      'Apoyo natural a la presión arterial saludable',
      'Mejora de la función eréctil y salud vascular masculina',
      'Optimización del bombeo muscular durante el ejercicio'
    ],
    healthIssues: [
      'Bajo rendimiento deportivo y resistencia física limitada',
      'Problemas circulatorios y flujo sanguíneo deficiente',
      'Fatiga muscular excesiva y recuperación lenta',
      'Disfunción endotelial y problemas vasculares',
      'Presión arterial elevada y problemas cardiovasculares',
      'Función eréctil comprometida relacionada con circulación',
      'Baja entrega de oxígeno a tejidos durante ejercicio',
      'Problemas de perfusión tisular y oxigenación'
    ],
    components: [
      {
        name: 'L-Arginina HCl',
        description: 'Aminoácido semi-esencial que actúa como sustrato directo para la síntesis de óxido nítrico por la enzima NOS.',
        amount: '800 mg por porción'
      },
      {
        name: 'L-Citrulina',
        description: 'Aminoácido que se convierte en L-Arginina en los riñones, proporcionando un suministro sostenido para la síntesis de NO.',
        amount: '400 mg por porción'
      }
    ],
    dosage: 'Tomar 2 cápsulas al día, preferiblemente 30-45 minutos antes del entrenamiento con el estómago vacío. En días de descanso, tomar entre comidas para apoyo cardiovascular.',
    administrationMethod: 'Tomar con el estómago vacío para máxima absorción, al menos 30 minutos antes de las comidas. Para uso deportivo, tomar 30-45 minutos antes del entrenamiento con abundante agua. Evitar tomar con alimentos ricos en proteínas que puedan competir por la absorción.',
    faqs: [
      {
        question: '¿Cuánto tiempo antes del entrenamiento debo tomarlo?',
        answer: 'Para obtener máximos beneficios deportivos, tome 30-45 minutos antes del entrenamiento con el estómago vacío. Esto permite tiempo suficiente para la absorción y conversión a óxido nítrico.'
      },
      {
        question: '¿Puedo combinarlo con otros suplementos deportivos?',
        answer: 'Sí, se combina bien con creatina, beta-alanina y otros suplementos deportivos. Evite tomar simultáneamente con otros suplementos que contengan arginina para evitar dosis excesivas.'
      },
      {
        question: '¿Es seguro para personas con presión arterial baja?',
        answer: 'El óxido nítrico puede reducir la presión arterial. Si tiene hipotensión o toma medicamentos para la presión arterial, consulte con su médico antes de usar.'
      },
      {
        question: '¿Cuándo veré resultados en el rendimiento deportivo?',
        answer: 'Los efectos agudos sobre el flujo sanguíneo pueden notarse dentro de 30-60 minutos. Los beneficios en rendimiento y resistencia se desarrollan típicamente después de 1-2 semanas de uso consistente.'
      }
    ]
  },

  {
    id: "pr-horse-chestnut",
    name: 'Castaño de Indias 400mg - 180 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1098.70,
    description: 'Extracto estandarizado de semilla de Castaño de Indias rico en escina. Tradicionalmente usado para apoyar la circulación venosa y salud de las piernas.',
    // IMAGEN PIPING ROCK: Horse Chestnut
    images: [
      {
        thumbnail: '/Jpeg/Horse Chestnut Anverso.jpg',
        full: '/Jpeg/Horse Chestnut Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Horse Chestnut Reverso.jpg',
        full: '/Jpeg/Horse Chestnut Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'PR-CHESTNUT-400',
    tags: ['castaño indias', 'circulación', 'piernas', 'escina'],
  },

  {
    id: "pr-horsetail",
    name: 'Cola de Caballo 800mg - 180 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 945.25,
    description: 'Extracto de Cola de Caballo rico en sílice natural. Apoya la salud de cabello, piel, uñas y tejido conectivo. Fuente tradicional de minerales.',
    // IMAGEN PIPING ROCK: Horsetail 800mg
    images: [
      {
        thumbnail: '/Jpeg/Horsetail, 800 mg Anverso.jpg',
        full: '/Jpeg/Horsetail, 800 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Horsetail, 800 mg Reverso.jpg',
        full: '/Jpeg/Horsetail, 800 mg Reverso.jpg',
      },
    ],
    stock: 45,
    sku: 'PR-HORSETAIL-800',
    tags: ['cola caballo', 'sílice', 'cabello', 'uñas'],
  },

  {
    id: "pr-black-cohosh",
    name: 'Cohosh Negro 540mg - 180 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1234.80,
    description: 'Extracto estandarizado de raíz de Cohosh Negro tradicionalmente usado para apoyar el bienestar femenino durante la menopausia y ciclos hormonales.',
    // IMAGEN PIPING ROCK: Black Cohosh
    images: [
      {
        thumbnail: '/Jpeg/Black Cohosh Anverso.jpg',
        full: '/Jpeg/Black Cohosh Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Black Cohosh Reverso.jpg',
        full: '/Jpeg/Black Cohosh Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-BCOHOSH-540',
    tags: ['cohosh negro', 'menopausia', 'femenino', 'hormonal'],
  },

  // Superalimentos y Desintoxicación
  {
    id: "pr-bitter-melon",
    name: 'Melón Amargo 600mg - 120 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 987.40,
    description: 'Extracto de Melón Amargo (Momordica charantia) tradicionalmente usado en medicina ayurvédica. Apoya el metabolismo saludable de la glucosa.',
    // IMAGEN PIPING ROCK: Bitter Melon
    images: [
      {
        thumbnail: '/Jpeg/Bitter Melon Anverso.jpg',
        full: '/Jpeg/Bitter Melon Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Bitter Melon Reverso.jpg',
        full: '/Jpeg/Bitter Melon Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-BMELON-600',
    tags: ['melón amargo', 'glucosa', 'ayurvédico', 'metabolismo'],
  },

  {
    id: "pr-chanca-piedra",
    name: 'Chanca Piedra 900mg - 120 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1145.30,
    description: 'Extracto de hoja de Chanca Piedra (Phyllanthus niruri), hierba amazónica tradicionalmente usada para apoyar la salud renal y del tracto urinario.',
    // IMAGEN PIPING ROCK: Chanca Piedra
    images: [
      {
        thumbnail: '/Jpeg/Chanca Piedra Anverso.jpg',
        full: '/Jpeg/Chanca Piedra Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Chanca Piedra Reverso.jpg',
        full: '/Jpeg/Chanca Piedra Reverso.jpg',
      },
    ],
    stock: 30,
    sku: 'PR-CHANCA-900',
    tags: ['chanca piedra', 'renal', 'urinario', 'amazónico'],
  },

  {
    id: "pr-chlorella-organic",
    name: 'Chlorella Orgánica 1000mg - 180 Comprimidos',
    categories: ['suplementos-especializados'],
    price: 1567.85,
    description: 'Chlorella orgánica de pared celular rota para máxima biodisponibilidad. Superalimento rico en proteínas, clorofila y nutrientes esenciales.',
    // IMAGEN PIPING ROCK: Chlorella Organic 1000mg
    images: [
      {
        thumbnail: '/Jpeg/Chlorella (Organic), 1000 mg Anverso.jpg',
        full: '/Jpeg/Chlorella (Organic), 1000 mg Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Chlorella (Organic), 1000 mg Reverso.jpg',
        full: '/Jpeg/Chlorella (Organic), 1000 mg Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-CHLORELLA-1000',
    tags: ['chlorella', 'orgánico', 'superalimento', 'clorofila'],
  },

  {
    id: "pr-circulation-complex",
    name: 'Complejo de Circulación 60 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 1234.50,
    description: 'Fórmula sinérgica con hierbas tradicionales para apoyar la circulación saludable. Combina Ginkgo, Castaño de Indias y otros nutrientes circulatorios.',
    // IMAGEN PIPING ROCK: Circulation Complex
    images: [
      {
        thumbnail: '/Jpeg/Circulation Complex Anverso.jpg',
        full: '/Jpeg/Circulation Complex Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Circulation Complex Reverso.jpg',
        full: '/Jpeg/Circulation Complex Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'PR-CIRC-COMPLEX',
    tags: ['circulación', 'ginkgo', 'complejo', 'vascular'],
  },

  // Vitaminas Adicionales

  // Productos de Limpieza y Desintoxicación
  {
    id: "pr-cleanse-more",
    name: 'Cleanse More 15 Días - 90 Cápsulas',
    categories: ['salud-digestiva'],
    price: 1345.70,
    description: 'Fórmula de limpieza intestinal de 15 días con hierbas tradicionales. Apoya la eliminación natural y la salud digestiva regular.',
    // IMAGEN PIPING ROCK: Cleanse More
    images: [
      {
        thumbnail: '/Jpeg/Cleanse More Anverso.jpg',
        full: '/Jpeg/Cleanse More Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Cleanse More Reverso.jpg',
        full: '/Jpeg/Cleanse More Reverso.jpg',
      },
    ],
    stock: 25,
    sku: 'PR-CLEANSE-15',
    tags: ['limpieza', 'digestivo', 'eliminación', 'hierbas'],
  },

  // Suplementos Deportivos
  {
    id: "pr-electrolyte-lemon",
    name: 'Electrolitos Sabor Limón 90 Cápsulas',
    categories: ['suplementos-especializados'],
    price: 892.45,
    description: 'Complejo de electrolitos con sabor natural a limón. Repone minerales esenciales perdidos durante el ejercicio y actividades físicas intensas.',
    // IMAGEN PIPING ROCK: Electrolyte Lemon
    images: [
      {
        thumbnail: '/Jpeg/Electrolyte (Lemon) Anverso.jpg',
        full: '/Jpeg/Electrolyte (Lemon) Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Electrolyte (Lemon) Reverso.jpg',
        full: '/Jpeg/Electrolyte (Lemon) Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'PR-ELECTRO-LEM',
    tags: ['electrolitos', 'limón', 'deportivo', 'hidratación'],
  },

  // ===== SISTEMAS SINÉRGICOS EXPANDIDOS =====
  
  // 🛡️ SISTEMA INMUNOLÓGICO - Productos específicos para fortalecer las defensas naturales
  {
    id: "sys-immune-01",
    name: 'Immune Defense Complex - Fórmula Inmune Avanzada',
    categories: ['sistema-inmunologico'],
    price: 3456.78,
    description: 'Fórmula sinérgica completa que combina Vitamina C, D3, Zinc, Equinácea, Saúco y hongos medicinales. Apoyo integral para el sistema inmunológico durante todo el año.',
    images: [
      {
        thumbnail: '/Jpeg/Immune Defense Complex Anverso.jpg',
        full: '/Jpeg/Immune Defense Complex Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Immune Defense Complex Reverso.jpg',
        full: '/Jpeg/Immune Defense Complex Reverso.jpg',
      },
    ],
    stock: 45,
    sku: 'SYS-IMM-COMPLEX',
    tags: ['inmune', 'defensa', 'vitamina C', 'zinc', 'equinácea', 'saúco', 'hongos'],
    detailedDescription: 'Immune Defense Complex es la formulación más completa para el apoyo inmunológico, diseñada con base en investigación científica y medicina tradicional. Esta fórmula sinérgica combina nutrientes esenciales (Vitamina C 1000mg, Vitamina D3 4000 UI, Zinc quelado 15mg) con extractos herbales potentes (Equinácea purpúrea, Saúco negro, Astragalus) y hongos medicinales (Reishi, Shiitake, Maitake). Cada componente ha sido seleccionado por su capacidad única de fortalecer diferentes aspectos del sistema inmunológico, desde la inmunidad innata hasta la adaptativa.',
    mechanismOfAction: 'Esta fórmula actúa en múltiples niveles del sistema inmunológico. La Vitamina C y el Zinc son cofactores esenciales para la función de neutrófilos, macrófagos y células NK. La Vitamina D3 modula tanto la inmunidad innata como adaptativa, regulando la expresión de genes antimicrobianos. La Equinácea estimula la fagocitosis y aumenta la producción de interferón. El Saúco bloquea la replicación viral y reduce la duración de infecciones. Los hongos medicinales aportan beta-glucanos que activan los receptores de reconocimiento de patrones (PRR), fortaleciendo la vigilancia inmunológica.',
    benefitsDescription: [
      'Fortalecimiento robusto del sistema inmunológico durante todo el año',
      'Reducción significativa de la duración y severidad de resfriados y gripes',
      'Mejora de la respuesta inmune ante estrés físico y emocional',
      'Apoyo a la inmunidad respiratoria y de mucosas',
      'Activación de células inmunes (NK, macrófagos, linfocitos T)',
      'Protección antioxidante contra daño por radicales libres',
      'Recuperación más rápida de enfermedades e infecciones',
      'Apoyo inmunológico para personas con alto estrés o exposición'
    ],
    healthIssues: [
      'Infecciones respiratorias frecuentes (resfriados, gripes, sinusitis)',
      'Sistema inmunológico debilitado por estrés crónico',
      'Recuperación lenta de enfermedades o infecciones',
      'Exposición constante a patógenos (trabajo con público, viajes)',
      'Fatiga crónica relacionada con inmunidad comprometida',
      'Cambios estacionales que afectan las defensas',
      'Necesidad de apoyo inmunológico preventivo',
      'Infecciones recurrentes del tracto respiratorio superior'
    ],
    components: [
      {
        name: 'Vitamina C (como ascorbato de calcio)',
        description: 'Antioxidante esencial y cofactor para la síntesis de colágeno e interferón. Apoya la función de neutrófilos y células NK.',
        amount: '1000 mg (1111% VD)'
      },
      {
        name: 'Vitamina D3 (colecalciferol)',
        description: 'Modula la inmunidad innata y adaptativa, regula la expresión de péptidos antimicrobianos como catelicidina.',
        amount: '4000 UI (1000% VD)'
      },
      {
        name: 'Zinc (como bisglicinato quelado)',
        description: 'Mineral esencial para más de 300 enzimas, crucial para la función inmune, cicatrización y síntesis proteica.',
        amount: '15 mg (136% VD)'
      },
      {
        name: 'Extracto de Equinácea purpúrea (raíz)',
        description: 'Estandarizada al 4% de equinacósidos. Estimula la fagocitosis, aumenta la producción de interferón y activa macrófagos.',
        amount: '400 mg'
      },
      {
        name: 'Extracto de Saúco negro (Sambucus nigra)',
        description: 'Rico en antocianinas y flavonoides. Inhibe la neuraminidasa viral y reduce la duración de infecciones respiratorias.',
        amount: '300 mg'
      },
      {
        name: 'Complejo de hongos medicinales (Reishi, Shiitake, Maitake)',
        description: 'Estandarizado al 30% de beta-glucanos. Activa receptores de reconocimiento de patrones y estimula células inmunes.',
        amount: '250 mg'
      },
      {
        name: 'Extracto de Astragalus membranaceus (raíz)',
        description: 'Adaptógeno inmune que fortalece la resistencia a estrés y patógenos. Rico en polisacáridos inmunomoduladores.',
        amount: '200 mg'
      },
      {
        name: 'Quercetina dihidratada',
        description: 'Flavonoide con propiedades antivirales, antiinflamatorias y estabilizadoras de mastocitos.',
        amount: '100 mg'
      }
    ],
    dosage: 'Tomar 2 cápsulas al día con alimentos, preferiblemente 1 por la mañana y 1 por la noche. Durante temporadas de alto riesgo o primeros síntomas, puede aumentarse a 3 cápsulas diarias por períodos cortos.',
    administrationMethod: 'Tomar con alimentos para optimizar la absorción de vitaminas liposolubles. Para máxima efectividad preventiva, usar consistentemente durante temporadas de alto riesgo (otoño-invierno). Puede tomarse de forma continua o en ciclos de 8 semanas con descansos de 1 semana.',
    faqs: [
      {
        question: '¿Cuándo es mejor comenzar a tomarlo?',
        answer: 'Idealmente, comenzar 2-4 semanas antes de temporadas de alto riesgo (otoño-invierno) para permitir que el sistema inmunológico se fortalezca. También es beneficioso durante períodos de alto estrés o antes de viajes.'
      },
      {
        question: '¿Puedo tomarlo si ya estoy enfermo?',
        answer: 'Sí, puede ser especialmente beneficioso durante los primeros síntomas. Durante enfermedades activas, puede aumentarse temporalmente a 3 cápsulas diarias hasta la recuperación.'
      },
      {
        question: '¿Es seguro para uso a largo plazo?',
        answer: 'Sí, todos los componentes son seguros para uso prolongado. Sin embargo, se recomienda hacer pausas ocasionales (1 semana cada 8 semanas) para mantener la sensibilidad del sistema inmune.'
      },
      {
        question: '¿Puede interferir con medicamentos inmunodepresores?',
        answer: 'Este suplemento estimula el sistema inmunológico, por lo que personas que toman medicamentos inmunodepresores o tienen enfermedades autoinmunes deben consultar con su médico antes del uso.'
      }
    ]
  },

  {
    id: "sys-immune-02", 
    name: 'Ultra Vitamin C Complex - Inmunidad Diaria Premium',
    categories: ['sistema-inmunologico'],
    price: 2134.56,
    description: 'Complejo avanzado de Vitamina C con bioflavonoides, escaramujo y acerola. Fórmula de liberación sostenida para protección antioxidante e inmune las 24 horas.',
    images: [
      {
        thumbnail: '/Jpeg/Ultra Vitamin C Complex Anverso.jpg',
        full: '/Jpeg/Ultra Vitamin C Complex Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Ultra Vitamin C Complex Reverso.jpg',
        full: '/Jpeg/Ultra Vitamin C Complex Reverso.jpg',
      },
    ],
    stock: 60,
    sku: 'SYS-IMM-VITC',
    tags: ['vitamina C', 'inmune', 'antioxidante', 'bioflavonoides', 'liberación sostenida'],
    detailedDescription: 'Ultra Vitamin C Complex combina múltiples formas de vitamina C en una fórmula de liberación sostenida que proporciona protección continua durante 8-12 horas. Esta formulación incluye ácido ascórbico puro, ascorbato de calcio (gentil con el estómago), palmitato de ascorbilo (vitamina C liposoluble) y fuentes naturales como acerola y escaramujo. Los bioflavonoides cítricos mejoran la absorción y proporcionan sinergia antioxidante, mientras que la rutina fortalece los capilares sanguíneos.',
    mechanismOfAction: 'Este complejo proporciona vitamina C en diferentes formas que se absorben y utilizan en distintos momentos y tejidos. El ácido ascórbico actúa inmediatamente, el ascorbato de calcio es gentil y de absorción gradual, y el palmitato de ascorbilo protege las membranas celulares al ser liposoluble. Los bioflavonoides inhiben la enzima hialuronidasa (que degrada la vitamina C), extienden su vida media y potencian sus efectos antioxidantes y antiinflamatorios.',
    benefitsDescription: [
      'Protección antioxidante continua durante todo el día',
      'Fortalecimiento del sistema inmunológico y resistencia a infecciones',
      'Producción óptima de colágeno para piel, articulaciones y vasos sanguíneos',
      'Mejora de la absorción de hierro de fuentes vegetales',
      'Reducción de la fatiga y aumento de la energía natural',
      'Protección cardiovascular y fortalecimiento de capilares',
      'Apoyo a la cicatrización y reparación de tejidos',
      'Neutralización de radicales libres y estrés oxidativo'
    ],
    healthIssues: [
      'Deficiencia de vitamina C y escorbuto subclínico',
      'Sistema inmunológico debilitado y infecciones frecuentes',
      'Fatiga crónica y baja energía',
      'Problemas de cicatrización y reparación tisular lenta',
      'Estrés oxidativo elevado y envejecimiento acelerado',
      'Problemas de absorción de hierro y anemia ferropénica',
      'Fragilidad capilar y tendencia a hematomas',
      'Exposición a contaminantes y toxinas ambientales'
    ],
    components: [
      {
        name: 'Ácido Ascórbico (Vitamina C pura)',
        description: 'Forma más potente y rápidamente absorbida de vitamina C, ideal para respuesta inmune inmediata.',
        amount: '500 mg'
      },
      {
        name: 'Ascorbato de Calcio',
        description: 'Forma tamponada de vitamina C que es gentil con el estómago y proporciona liberación gradual.',
        amount: '300 mg'
      },
      {
        name: 'Palmitato de Ascorbilo',
        description: 'Forma liposoluble de vitamina C que protege las membranas celulares del daño oxidativo.',
        amount: '100 mg'
      },
      {
        name: 'Extracto de Acerola (25% Vitamina C natural)',
        description: 'Fuente natural concentrada de vitamina C con cofactores naturales y antioxidantes.',
        amount: '200 mg'
      },
      {
        name: 'Extracto de Escaramujo',
        description: 'Rico en vitamina C natural, flavonoides y ácidos orgánicos que mejoran la absorción.',
        amount: '150 mg'
      },
      {
        name: 'Complejo de Bioflavonoides Cítricos',
        description: 'Hesperidina, rutina y naringina que mejoran la absorción y efectos de la vitamina C.',
        amount: '100 mg'
      },
      {
        name: 'Rutina',
        description: 'Flavonoide que fortalece los capilares sanguíneos y tiene propiedades antiinflamatorias.',
        amount: '50 mg'
      }
    ],
    dosage: 'Tomar 1-2 comprimidos al día con alimentos. Para apoyo inmunológico intensivo, tomar 1 comprimido cada 8 horas durante períodos de estrés o enfermedad.',
    administrationMethod: 'Tomar con alimentos para minimizar posible irritación gástrica. La fórmula de liberación sostenida permite tomar menos frecuentemente manteniendo niveles estables. Beber abundante agua para apoyar la eliminación de metabolitos.',
    faqs: [
      {
        question: '¿Qué ventajas tiene sobre la vitamina C regular?',
        answer: 'Esta fórmula combina múltiples formas de vitamina C para absorción óptima y liberación sostenida, evitando los picos y caídas de las fórmulas simples. Los bioflavonoides mejoran la absorción y prolongan la actividad.'
      },
      {
        question: '¿Es gentil con el estómago?',
        answer: 'Sí, incluye ascorbato de calcio que es una forma tamponada y gentil con el estómago, reduciendo la acidez típica del ácido ascórbico puro.'
      },
      {
        question: '¿Puedo tomar dosis altas sin problemas?',
        answer: 'La vitamina C es hidrosoluble y el exceso se elimina por orina. Sin embargo, dosis muy altas (>2000mg) pueden causar molestias digestivas en algunas personas. Esta fórmula está diseñada para proporcionar dosis óptimas sin excesos.'
      }
    ]
  },

  {
    id: "sys-immune-03",
    name: 'Zinc Immunity Pro - Defensa Mineral Esencial',
    categories: ['sistema-inmunologico'], 
    price: 1567.89,
    description: 'Zinc altamente biodisponible en forma quelada con aminoácidos. Esencial para función inmune, cicatrización y más de 300 reacciones enzimáticas.',
    images: [
      {
        thumbnail: '/Jpeg/Zinc Immunity Pro Anverso.jpg',
        full: '/Jpeg/Zinc Immunity Pro Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Zinc Immunity Pro Reverso.jpg',
        full: '/Jpeg/Zinc Immunity Pro Reverso.jpg',
      },
    ],
    stock: 50,
    sku: 'SYS-IMM-ZINC',
    tags: ['zinc', 'inmune', 'quelado', 'enzimas', 'cicatrización'],
    detailedDescription: 'Zinc Immunity Pro proporciona 30mg de zinc elemental en forma de bisglicinato quelado, la forma más biodisponible y gentil con el estómago. El zinc es el segundo oligoelemento más abundante en el cuerpo y cofactor esencial en más de 300 enzimas. Es crucial para la función inmunitaria, síntesis de proteínas, cicatrización de heridas, crecimiento celular y función neurológica. Esta formulación incluye también cobre en proporción 15:1 para mantener el equilibrio mineral adecuado.',
    mechanismOfAction: 'El zinc quelado con glicina se absorbe intacto en el intestino delgado sin competir con otros minerales, asegurando máxima biodisponibilidad. Una vez absorbido, actúa como cofactor en enzimas críticas para la función inmune como la timulina (desarrollo de células T), metaloproteinasas (reparación tisular) y superóxido dismutasa (antioxidante). También estabiliza membranas celulares, regula la expresión génica y es esencial para la síntesis de ARN y ADN.',
    benefitsDescription: [
      'Fortalecimiento robusto del sistema inmunológico y resistencia a infecciones',
      'Aceleración de la cicatrización de heridas y reparación tisular',
      'Mejora del sentido del gusto y olfato',
      'Apoyo a la salud reproductiva masculina y femenina',
      'Promoción del crecimiento y desarrollo saludable',
      'Protección antioxidante y neutralización de radicales libres',
      'Mejora de la función cognitiva y memoria',
      'Apoyo a la salud de piel, cabello y uñas'
    ],
    healthIssues: [
      'Deficiencia de zinc e inmunidad comprometida',
      'Cicatrización lenta de heridas y cortes',
      'Infecciones respiratorias frecuentes',
      'Pérdida del sentido del gusto u olfato',
      'Problemas de piel (acné, dermatitis, psoriasis)',
      'Problemas de fertilidad y salud reproductiva',
      'Crecimiento retardado en niños y adolescentes',
      'Fatiga crónica y baja energía'
    ],
    components: [
      {
        name: 'Zinc (como bisglicinato de zinc)',
        description: 'Forma quelada de máxima biodisponibilidad que no compite con otros minerales y es gentil con el estómago.',
        amount: '30 mg (273% VD)'
      },
      {
        name: 'Cobre (como glicinato de cobre)',
        description: 'Incluido en proporción 15:1 con zinc para mantener el equilibrio mineral y prevenir deficiencia de cobre.',
        amount: '2 mg (222% VD)'
      },
      {
        name: 'Vitamina C (como ascorbato de magnesio)',
        description: 'Mejora la absorción del zinc y proporciona sinergia antioxidante e inmunológica.',
        amount: '60 mg (67% VD)'
      }
    ],
    dosage: 'Tomar 1 cápsula al día con alimentos. Para apoyo inmunológico intensivo o durante enfermedades, puede tomarse 1 cápsula dos veces al día por períodos cortos.',
    administrationMethod: 'Tomar con alimentos para optimizar absorción y minimizar molestias gástricas. Evitar tomar simultáneamente con suplementos de calcio, hierro o antibióticos (espaciar al menos 2 horas). No exceder 40mg diarios de zinc total.',
    faqs: [
      {
        question: '¿Por qué incluye cobre junto con el zinc?',
        answer: 'El zinc y cobre compiten por absorción. Dosis altas de zinc pueden causar deficiencia de cobre, por lo que incluimos cobre en proporción adecuada (15:1) para mantener el equilibrio mineral.'
      },
      {
        question: '¿Cuál es la diferencia entre zinc quelado y otras formas?',
        answer: 'El zinc quelado (bisglicinato) se absorbe como un aminoácido intacto, evitando la competencia con otros minerales. Tiene 3-4 veces mejor absorción que formas como óxido o sulfato de zinc.'
      },
      {
        question: '¿Puedo tomar más zinc si estoy enfermo?',
        answer: 'Durante enfermedades puede aumentarse temporalmente a 2 cápsulas diarias por máximo 7-10 días. Dosis excesivas de zinc pueden interferir con la absorción de cobre y causar desequilibrios.'
      }
    ]
  },

  // ❤️ SISTEMA CARDIOVASCULAR - Productos para corazón, circulación y salud vascular
  {
    id: "sys-cardio-01",
    name: 'CardioMax Pro - Fórmula Cardiovascular Completa',
    categories: ['sistema-cardiovascular'],
    price: 4567.89,
    description: 'Fórmula sinérgica avanzada con CoQ10, Omega-3, Magnesio, Hawthorne y Ajo. Apoyo integral para corazón, circulación y presión arterial saludable.',
    images: [
      {
        thumbnail: '/Jpeg/CardioMax Pro Anverso.jpg',
        full: '/Jpeg/CardioMax Pro Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/CardioMax Pro Reverso.jpg',
        full: '/Jpeg/CardioMax Pro Reverso.jpg',
      },
    ],
    stock: 35,
    sku: 'SYS-CAR-MAX',
    tags: ['cardiovascular', 'corazón', 'CoQ10', 'omega-3', 'presión arterial'],
    detailedDescription: 'CardioMax Pro es la formulación más completa para la salud cardiovascular, combinando nutrientes esenciales y extractos herbales en dosis terapéuticas basadas en investigación clínica. Esta fórmula sinérgica incluye CoQ10 (fundamental para la energía del músculo cardíaco), Omega-3 EPA/DHA (antiinflamatorios cardiovasculares), Magnesio (relajante vascular natural), extracto de Espino Blanco (tónico cardíaco tradicional) y Ajo envejecido (apoyo circulatorio). Cada componente ha sido seleccionado por su evidencia científica en la promoción de la salud cardíaca y vascular.',
    mechanismOfAction: 'Esta fórmula actúa en múltiples aspectos de la salud cardiovascular. CoQ10 optimiza la producción de ATP en las mitocondrias cardíacas, mejorando la función del músculo cardíaco. Los Omega-3 reducen la inflamación vascular, mejoran la función endotelial y tienen efectos antiarrítmicos. El Magnesio actúa como bloqueador natural de canales de calcio, relajando el músculo liso vascular. El Espino Blanco contiene flavonoides que mejoran la contractilidad cardíaca y dilatan las arterias coronarias. El Ajo aporta compuestos azufrados que mejoran la circulación y tienen efectos cardioprotectores.',
    benefitsDescription: [
      'Fortalecimiento de la función del músculo cardíaco y contractilidad',
      'Mejora de la circulación y salud de los vasos sanguíneos',
      'Apoyo natural para mantener presión arterial saludable',
      'Reducción de la inflamación cardiovascular y estrés oxidativo',
      'Optimización del metabolismo energético del corazón',
      'Mejora de la función endotelial y elasticidad arterial',
      'Apoyo a niveles saludables de colesterol y triglicéridos',
      'Protección contra arritmias y promoción del ritmo cardíaco normal'
    ],
    healthIssues: [
      'Problemas cardiovasculares y riesgo cardíaco elevado',
      'Presión arterial elevada (hipertensión)',
      'Niveles altos de colesterol y triglicéridos',
      'Función cardíaca comprometida y baja energía del corazón',
      'Problemas circulatorios y mala perfusión tisular',
      'Inflamación cardiovascular y estrés oxidativo',
      'Arritmias cardíacas leves y palpitaciones',
      'Fatiga relacionada con problemas cardiovasculares'
    ],
    components: [
      {
        name: 'Coenzima Q10 (Ubiquinona)',
        description: 'Esencial para la producción de energía en las mitocondrias cardíacas. Mejora la función del músculo cardíaco y actúa como antioxidante.',
        amount: '200 mg'
      },
      {
        name: 'Omega-3 concentrado (EPA/DHA)',
        description: 'Ácidos grasos esenciales con potentes efectos antiinflamatorios cardiovasculares y protección contra arritmias.',
        amount: '1000 mg (EPA 600mg, DHA 400mg)'
      },
      {
        name: 'Magnesio (como citrato y taurato)',
        description: 'Mineral esencial que actúa como bloqueador natural de canales de calcio, relajando el músculo vascular.',
        amount: '400 mg'
      },
      {
        name: 'Extracto de Espino Blanco (Crataegus oxyacantha)',
        description: 'Rico en flavonoides cardiotónicos. Mejora la contractilidad cardíaca y dilata las arterias coronarias.',
        amount: '300 mg (estandarizado al 1.8% vitexina)'
      },
      {
        name: 'Extracto de Ajo Envejecido',
        description: 'Rico en compuestos azufrados orgánicos que mejoran la circulación y tienen efectos cardioprotectores.',
        amount: '250 mg (equivalente a 2500mg de ajo fresco)'
      },
      {
        name: 'L-Taurina',
        description: 'Aminoácido que mejora la función cardíaca, tiene efectos antiarrítmicos y apoya la presión arterial saludable.',
        amount: '500 mg'
      },
      {
        name: 'Vitamina E (d-alfa tocoferol)',
        description: 'Antioxidante liposoluble que protege las membranas cardíacas del daño oxidativo.',
        amount: '400 UI'
      }
    ],
    dosage: 'Tomar 2 cápsulas al día con alimentos, preferiblemente 1 con el desayuno y 1 con la cena. Para apoyo cardiovascular intensivo, puede incrementarse bajo supervisión médica.',
    administrationMethod: 'Tomar con alimentos ricos en grasas para optimizar la absorción de CoQ10 y vitamina E. Mantener consistencia en horarios para niveles estables. Si toma medicamentos cardiovasculares, espaciar al menos 2 horas.',
    faqs: [
      {
        question: '¿Puedo tomarlo si ya tomo medicamentos para el corazón?',
        answer: 'Consulte con su cardiólogo antes del uso. Algunos componentes pueden interactuar con medicamentos cardiovasculares, especialmente anticoagulantes y medicamentos para la presión arterial.'
      },
      {
        question: '¿Cuánto tiempo tardará en ver beneficios?',
        answer: 'Los efectos energéticos pueden notarse en 2-4 semanas. Los beneficios cardiovasculares completos se desarrollan gradualmente durante 2-3 meses de uso consistente.'
      },
      {
        question: '¿Es seguro para personas con presión arterial baja?',
        answer: 'Esta fórmula tiene efectos hipotensores naturales. Personas con presión arterial baja deben consultar con su médico antes del uso y monitorear la presión regularmente.'
      }
    ]
  },

  {
    id: "sys-cardio-02",
    name: 'Omega-3 Ultra Pure - Protección Cardiovascular EPA/DHA',
    categories: ['sistema-cardiovascular'],
    price: 3245.67,
    description: 'Omega-3 de grado farmacéutico con máxima concentración EPA/DHA. Destilado molecularmente para pureza superior. Apoyo cardiovascular y antiinflamatorio.',
    images: [
      {
        thumbnail: '/Jpeg/Omega-3 Ultra Pure Anverso.jpg',
        full: '/Jpeg/Omega-3 Ultra Pure Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Omega-3 Ultra Pure Reverso.jpg',
        full: '/Jpeg/Omega-3 Ultra Pure Reverso.jpg',
      },
    ],
    stock: 45,
    sku: 'SYS-CAR-OMEGA3',
    tags: ['omega-3', 'EPA', 'DHA', 'cardiovascular', 'antiinflamatorio'],
    detailedDescription: 'Omega-3 Ultra Pure ofrece la concentración más alta de EPA (ácido eicosapentaenoico) y DHA (ácido docosahexaenoico) en forma de triglicéridos naturales. Cada cápsula proporciona 1200mg de Omega-3 activos (EPA 720mg, DHA 480mg) derivados de peces de aguas profundas del Atlántico Norte. El aceite es destilado molecularmente para eliminar metales pesados, PCBs y dioxinas, garantizando pureza farmacéutica. Esta proporción 3:2 de EPA:DHA está optimizada para máximos beneficios cardiovasculares y antiinflamatorios.',
    mechanismOfAction: 'Los Omega-3 EPA y DHA se incorporan a las membranas celulares, especialmente en el corazón y vasos sanguíneos, mejorando su fluidez y función. El EPA es precursor de prostaglandinas antiinflamatorias (serie 3) y resolvinas que resuelven la inflamación. El DHA es crucial para la función endotelial y la regulación de la presión arterial. Ambos reducen los triglicéridos al inhibir la síntesis hepática de VLDL, mejoran la función plaquetaria y tienen efectos antiarrítmicos al estabilizar las membranas del músculo cardíaco.',
    benefitsDescription: [
      'Reducción significativa de triglicéridos y colesterol VLDL',
      'Potente efecto antiinflamatorio cardiovascular',
      'Mejora de la función endotelial y elasticidad arterial',
      'Apoyo natural para presión arterial saludable',
      'Protección contra arritmias cardíacas y muerte súbita',
      'Reducción de la agregación plaquetaria y trombosis',
      'Mejora de la función del ventrículo izquierdo',
      'Apoyo a la salud cerebral y función cognitiva'
    ],
    healthIssues: [
      'Triglicéridos elevados e hipertrigliceridemia',
      'Enfermedad cardiovascular y riesgo cardíaco alto',
      'Inflamación crónica y marcadores inflamatorios elevados',
      'Arritmias cardíacas y problemas del ritmo cardíaco',
      'Presión arterial elevada y problemas vasculares',
      'Función endotelial comprometida',
      'Historia familiar de enfermedad cardíaca',
      'Síndrome metabólico y resistencia a la insulina'
    ],
    components: [
      {
        name: 'EPA (Ácido Eicosapentaenoico)',
        description: 'Omega-3 con potentes efectos antiinflamatorios cardiovasculares. Precursor de mediadores especializados de resolución.',
        amount: '720 mg por cápsula'
      },
      {
        name: 'DHA (Ácido Docosahexaenoico)', 
        description: 'Omega-3 esencial para función cardíaca, cerebral y endotelial. Crucial para membrana celular y señalización.',
        amount: '480 mg por cápsula'
      },
      {
        name: 'Vitamina E natural (d-alfa tocoferol)',
        description: 'Antioxidante que protege los Omega-3 de la oxidación y proporciona protección adicional al sistema cardiovascular.',
        amount: '10 UI'
      }
    ],
    dosage: 'Tomar 1-2 cápsulas al día con alimentos ricos en grasas. Para apoyo cardiovascular intensivo o triglicéridos elevados, puede incrementarse a 3 cápsulas bajo supervisión médica.',
    administrationMethod: 'Tomar con la comida más rica en grasas del día para maximizar absorción. Refrigerar después de abrir para mantener frescura. Si experimenta reflujo, congelar las cápsulas antes de tomar.',
    faqs: [
      {
        question: '¿Cuál es la diferencia entre EPA y DHA?',
        answer: 'EPA tiene efectos más antiinflamatorios y cardiovasculares específicos, mientras que DHA es más importante para función cerebral y desarrollo. Esta fórmula 3:2 optimiza los beneficios cardiovasculares.'
      },
      {
        question: '¿Puedo tomarlo si tomo anticoagulantes?',
        answer: 'Los Omega-3 tienen efectos anticoagulantes leves. Si toma warfarina u otros anticoagulantes, consulte con su médico y monitoree el INR regularmente.'
      },
      {
        question: '¿Cómo sé si el aceite está fresco?',
        answer: 'Un aceite fresco no debe tener olor o sabor a pescado rancio. Nuestro producto incluye vitamina E como antioxidante y se recomienda refrigeración para mantener frescura óptima.'
      }
    ]
  },

  // 🦴 SISTEMA ÓSEO MINERAL - Productos para huesos, dientes y mineralización
  {
    id: "sys-bone-01",
    name: 'Bone Matrix Pro - Fórmula Ósea Completa',
    categories: ['sistema-oseo-mineral'],
    price: 3987.65,
    description: 'Fórmula sinérgica completa con Calcio, Magnesio, Vitamina D3, K2, Boro y Sílice. Apoyo integral para densidad ósea, dientes y mineralización.',
    images: [
      {
        thumbnail: '/Jpeg/Bone Matrix Pro Anverso.jpg',
        full: '/Jpeg/Bone Matrix Pro Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Bone Matrix Pro Reverso.jpg',
        full: '/Jpeg/Bone Matrix Pro Reverso.jpg',
      },
    ],
    stock: 40,
    sku: 'SYS-BON-MATRIX',
    tags: ['huesos', 'calcio', 'vitamina D3', 'K2', 'mineralización', 'densidad ósea'],
    detailedDescription: 'Bone Matrix Pro es la formulación más avanzada para la salud ósea, combinando todos los nutrientes esenciales en proporciones optimizadas basadas en investigación científica. Esta fórmula sinérgica incluye formas altamente biodisponibles de Calcio (citrato y microhidrosipatita), Magnesio (citrato y malato), Vitamina D3 para absorción, Vitamina K2 para dirección del calcio, Boro para metabolismo mineral y Sílice para matriz ósea. Diseñada para personas preocupadas por la densidad ósea, especialmente mujeres postmenopáusicas y adultos mayores.',
    mechanismOfAction: 'Esta fórmula trabaja en todos los aspectos del metabolismo óseo. El Calcio proporciona el mineral estructural principal, mientras que el Magnesio regula su deposición y activa la vitamina D. La Vitamina D3 aumenta la absorción intestinal de calcio y fósforo. La Vitamina K2 activa las proteínas dependientes de vitamina K (osteocalcina y MGP) que dirigen el calcio hacia los huesos y lo alejan de arterias. El Boro mejora el metabolismo de calcio, magnesio y vitamina D. La Sílice fortalece la matriz de colágeno que sostiene la mineralización ósea.',
    benefitsDescription: [
      'Fortalecimiento de la densidad mineral ósea y prevención de osteoporosis',
      'Mejora de la absorción y utilización del calcio dietético',
      'Apoyo a la salud dental y fortalecimiento del esmalte',
      'Prevención de la pérdida ósea relacionada con la edad',
      'Mejora de la arquitectura y calidad del tejido óseo',
      'Apoyo a la reparación de fracturas y lesiones óseas',
      'Fortalecimiento de la matriz de colágeno óseo',
      'Prevención de calcificaciones vasculares al dirigir calcio correctamente'
    ],
    healthIssues: [
      'Osteoporosis y baja densidad mineral ósea',
      'Fracturas frecuentes y huesos frágiles',
      'Menopausia y pérdida ósea acelerada',
      'Deficiencias nutricionales que afectan huesos',
      'Problemas dentales y pérdida de esmalte',
      'Recuperación lenta de fracturas',
      'Riesgo elevado de osteoporosis por genética o edad',
      'Uso prolongado de medicamentos que afectan huesos'
    ],
    components: [
      {
        name: 'Calcio (como citrato y microhidrosipatita)',
        description: 'Combinación de formas altamente absorbibles. El citrato se absorbe sin ácido gástrico, la hidroxiapatita aporta matriz ósea completa.',
        amount: '1000 mg (100% VD)'
      },
      {
        name: 'Magnesio (como citrato y malato)',
        description: 'Cofactor esencial para más de 300 enzimas, incluidas las que convierten vitamina D a su forma activa. Regula la deposición de calcio.',
        amount: '500 mg (119% VD)'
      },
      {
        name: 'Vitamina D3 (colecalciferol)',
        description: 'Forma natural que aumenta la absorción intestinal de calcio y fósforo. Esencial para mineralización ósea adecuada.',
        amount: '2000 UI (500% VD)'
      },
      {
        name: 'Vitamina K2 (como MK-7)',
        description: 'Activa osteocalcina para incorporar calcio en huesos y MGP para evitar calcificación arterial. Forma de larga duración.',
        amount: '120 mcg (100% VD)'
      },
      {
        name: 'Boro (como citrato de boro)',
        description: 'Oligoelemento que mejora el metabolismo de calcio, magnesio y vitamina D. Reduce la excreción urinaria de calcio.',
        amount: '3 mg'
      },
      {
        name: 'Sílice (de extracto de bambú)',
        description: 'Esencial para la síntesis de colágeno tipo I y la formación de la matriz ósea. Mejora la flexibilidad y resistencia ósea.',
        amount: '50 mg'
      },
      {
        name: 'Zinc (como picolinato)',
        description: 'Cofactor para enzimas involucradas en la síntesis de colágeno y mineralización ósea.',
        amount: '15 mg (136% VD)'
      },
      {
        name: 'Manganeso (como gluconato)',
        description: 'Necesario para la formación de cartílago y hueso. Cofactor de enzimas que sintetizan glucosaminoglicanos.',
        amount: '5 mg (217% VD)'
      }
    ],
    dosage: 'Tomar 2-3 cápsulas al día con alimentos, preferiblemente divididas entre las comidas principales. Para máxima absorción, no tomar todas las cápsulas de una vez.',
    administrationMethod: 'Tomar con alimentos para optimizar absorción de minerales. Dividir la dosis a lo largo del día ya que el cuerpo absorbe mejor pequeñas cantidades de calcio. Evitar tomar con alimentos ricos en fibra o oxalatos que pueden interferir con la absorción.',
    faqs: [
      {
        question: '¿Por qué incluye vitamina K2 junto con calcio?',
        answer: 'La vitamina K2 es crucial para dirigir el calcio hacia los huesos y dientes, evitando que se deposite en arterias y tejidos blandos. Sin K2, el calcio suplementario puede calcificar arterias.'
      },
      {
        question: '¿Cuál es la proporción ideal de calcio y magnesio?',
        answer: 'Usamos una proporción 2:1 (calcio:magnesio) que permite la absorción óptima de ambos minerales y refleja las necesidades metabólicas del cuerpo para el equilibrio mineral.'
      },
      {
        question: '¿Cuándo veré mejoras en la densidad ósea?',
        answer: 'Los cambios en densidad ósea son graduales. Los marcadores bioquímicos pueden mejorar en 3-6 meses, pero los cambios significativos en densitometría ósea generalmente se observan después de 12-24 meses de suplementación consistente.'
      }
    ]
  },

  {
    id: "sys-bone-02",
    name: 'Calcium Plus D3 & K2 - Absorción Ósea Optimizada',
    categories: ['sistema-oseo-mineral'],
    price: 2345.78,
    description: 'Fórmula sinérgica de Calcio, Vitamina D3 y K2 en proporciones científicamente validadas. Máxima absorción y dirección correcta del calcio.',
    images: [
      {
        thumbnail: '/Jpeg/Calcium Plus D3 K2 Anverso.jpg',
        full: '/Jpeg/Calcium Plus D3 K2 Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Calcium Plus D3 K2 Reverso.jpg',
        full: '/Jpeg/Calcium Plus D3 K2 Reverso.jpg',
      },
    ],
    stock: 55,
    sku: 'SYS-BON-CAL-D3K2',
    tags: ['calcio', 'vitamina D3', 'vitamina K2', 'absorción', 'huesos'],
    detailedDescription: 'Calcium Plus D3 & K2 combina tres nutrientes fundamentales para la salud ósea en una fórmula científicamente balanceada. Proporciona 600mg de calcio como citrato (máxima biodisponibilidad), 2000 UI de vitamina D3 (para absorción óptima) y 100mcg de vitamina K2 como MK-7 (para dirección correcta del calcio). Esta combinación asegura que el calcio se absorba eficientemente, se transporte adecuadamente y se deposite en huesos y dientes en lugar de arterias y tejidos blandos.',
    mechanismOfAction: 'Esta fórmula optimiza cada paso del metabolismo del calcio. La vitamina D3 se convierte en calcitriol, la hormona que aumenta la absorción intestinal de calcio del 10-15% al 30-40%. La vitamina K2 activa la osteocalcina, proteína que incorpora calcio en la matriz ósea, y la proteína MGP que previene la calcificación arterial. El citrato de calcio no requiere ácido gástrico para absorberse y tiene mejor biodisponibilidad que el carbonato, especialmente en adultos mayores con reducción de ácido estomacal.',
    benefitsDescription: [
      'Absorción máxima de calcio con mínimas dosis necesarias',
      'Fortalecimiento de huesos y dientes sin calcificar arterias',
      'Prevención efectiva de osteoporosis y fracturas',
      'Apoyo a la función muscular y contracción cardíaca',
      'Mejora de la transmisión nerviosa y función neuromuscular',
      'Reducción del riesgo de cálculos renales por dirección correcta',
      'Apoyo durante el crecimiento en niños y adolescentes',
      'Mantenimiento óseo durante menopausia y envejecimiento'
    ],
    healthIssues: [
      'Deficiencia de calcio y problemas de absorción',
      'Osteoporosis y riesgo de fracturas',
      'Menopausia y pérdida ósea acelerada',
      'Deficiencia de vitamina D y poca exposición solar',
      'Calambres musculares y contracciones involuntarias',
      'Problemas dentales y pérdida de esmalte',
      'Preocupación por calcificación arterial',
      'Necesidades aumentadas durante embarazo y lactancia'
    ],
    components: [
      {
        name: 'Calcio (como citrato de calcio)',
        description: 'Forma altamente biodisponible que se absorbe independientemente del ácido gástrico. Ideal para adultos mayores.',
        amount: '600 mg (60% VD)'
      },
      {
        name: 'Vitamina D3 (colecalciferol)',
        description: 'Forma natural idéntica a la producida por la piel. Optimiza la absorción intestinal de calcio.',
        amount: '2000 UI (500% VD)'
      },
      {
        name: 'Vitamina K2 (como menaquinona-7 MK-7)',
        description: 'Forma de larga duración que activa proteínas para dirigir calcio a huesos y evitar calcificación arterial.',
        amount: '100 mcg (83% VD)'
      }
    ],
    dosage: 'Tomar 2 comprimidos al día con alimentos, preferiblemente 1 con el desayuno y 1 con la cena para mantener niveles estables de calcio.',
    administrationMethod: 'Tomar con alimentos para optimizar absorción. Espaciar de suplementos de hierro, zinc o antibióticos al menos 2 horas. Para personas que toman anticoagulantes, consultar médico debido a la vitamina K2.',
    faqs: [
      {
        question: '¿Es seguro combinar calcio con vitamina K2 si tomo anticoagulantes?',
        answer: 'La vitamina K2 puede afectar la anticoagulación. Si toma warfarina u otros anticoagulantes, consulte con su médico antes de usar y monitoree el INR regularmente.'
      },
      {
        question: '¿Por qué citrato de calcio en lugar de carbonato?',
        answer: 'El citrato de calcio se absorbe mejor (especialmente con el estómago vacío), no requiere ácido gástrico y tiene menor riesgo de causar cálculos renales comparado con el carbonato.'
      },
      {
        question: '¿Puedo tomar toda la dosis de una vez?',
        answer: 'Es mejor dividir la dosis porque el cuerpo absorbe máximo 500mg de calcio por vez. Tomar en dosis divididas asegura mejor absorción y utilización.'
      }
    ]
  },

];

import { System } from '@/types/system';

// ===== INTERFACES PARA SISTEMAS SINÉRGICOS =====
// Movido a src/types/system.ts para centralización

// ===== DATOS DE SISTEMAS SINÉRGICOS =====

export const systems: System[] = [
  {
    id: 'sistema-inmunologico',
    name: '🛡️ Sistema Inmunológico',
    description: 'Fortalece tus defensas naturales con nuestra línea completa de suplementos inmunológicos científicamente respaldados',
    icon: '🛡️',
    color: '#E3F2FD',
    featured: true,
    targetAudience: ['Adultos con defensas bajas', 'Personas expuestas a patógenos', 'Temporadas de cambio estacional'],
    products: [
      'sys-immune-01', 'sys-immune-02', 'sys-immune-03', 
      '1', '10', 'pr-alpha-gpc', 'pr-5htp', 'pr-ashwa-melatonin'
    ],
    benefits: [
      'Fortalecimiento robusto del sistema inmune las 24 horas',
      'Protección contra infecciones respiratorias y virales',
      'Reducción significativa de la duración de resfriados y gripes',
      'Apoyo inmunológico durante cambios estacionales críticos',
      'Mejora de la respuesta inmune ante estrés físico y emocional',
      'Protección antioxidante contra radicales libres',
      'Activación de células de defensa natural (NK, macrófagos)',
      'Recuperación acelerada de enfermedades e infecciones'
    ],
    keyIngredients: [
      'Vitamina C 1000mg (múltiples formas de liberación)',
      'Vitamina D3 4000 UI (modulador inmune esencial)',
      'Zinc quelado 30mg (cofactor de +300 enzimas inmunes)',
      'Equinácea purpúrea (estimulante de fagocitosis)',
      'Saúco negro (inhibidor de replicación viral)',
      'Triple complejo de hongos medicinales (Reishi, Shiitake, Maitake)',
      'Beta-glucanos activos (activadores de receptores inmunes)',
      'Quercetina (antiinflamatorio y estabilizador de mastocitos)'
    ],
    relatedSystems: ['sistema-nervioso', 'sistema-detox']
  },
  {
    id: 'sistema-cardiovascular', 
    name: '❤️ Sistema Cardiovascular',
    description: 'Cuida tu corazón y circulación con fórmulas cardiovasculares de grado farmacéutico',
    icon: '❤️',
    color: '#FFEBEE',
    featured: true,
    targetAudience: ['Adultos +40 años', 'Personas con factores de riesgo cardíaco', 'Atletas de alto rendimiento'],
    products: [
      'sys-cardio-01', 'sys-cardio-02',
      'pr-fish-oil', '102', '105', 'pr-nitric-oxide-max'
    ],
    benefits: [
      'Fortalecimiento de la función del músculo cardíaco',
      'Mejora sustancial de la circulación y perfusión tisular',
      'Apoyo natural para mantener presión arterial en rangos saludables',
      'Reducción de la inflamación cardiovascular y marcadores de riesgo',
      'Optimización del metabolismo energético del corazón (ATP)',
      'Mejora de la función endotelial y elasticidad arterial',
      'Apoyo para niveles saludables de colesterol y triglicéridos',
      'Protección contra arritmias y promoción del ritmo cardíaco estable'
    ],
    keyIngredients: [
      'Omega-3 concentrado EPA 720mg/DHA 480mg (grado farmacéutico)',
      'Coenzima Q10 200mg (energía mitocondrial cardíaca)',
      'Magnesio citrato 400mg (bloqueador natural de canales de calcio)',
      'Extracto de Espino Blanco (tónico cardíaco con flavonoides)',
      'Ajo envejecido sin olor (circulatorio y cardioprotector)',
      'L-Taurina 500mg (antiarrítmico y regulador de presión)',
      'L-Arginina + L-Citrulina (precursores de óxido nítrico)',
      'Vitamina E natural (protección de membranas cardíacas)'
    ],
    relatedSystems: ['sistema-nervioso', 'sistema-oseo-mineral']
  },
  {
    id: 'sistema-oseo-mineral',
    name: '🦴 Sistema Óseo Mineral', 
    description: 'Fortalece huesos y dientes con la matriz mineral más completa y biodisponible',
    icon: '🦴',
    color: '#F3E5F5',
    featured: true,
    targetAudience: ['Mujeres postmenopáusicas', 'Adultos mayores +50', 'Personas con historial familiar de osteoporosis'],
    products: [
      'sys-bone-01', 'sys-bone-02',
      '2', '3', '4', '105', 'pr-bamboo-extract'
    ],
    benefits: [
      'Fortalecimiento progresivo de la densidad mineral ósea',
      'Prevención efectiva de osteoporosis y fracturas por fragilidad',
      'Mejora de la absorción y utilización óptima del calcio dietético',
      'Apoyo integral a la salud dental y fortalecimiento del esmalte',
      'Dirección inteligente del calcio hacia huesos (evita arterias)',
      'Apoyo acelerado a la reparación de fracturas y lesiones óseas',
      'Fortalecimiento de la matriz de colágeno que sostiene la mineralización',
      'Mantenimiento óseo durante menopausia y cambios hormonales'
    ],
    keyIngredients: [
      'Calcio citrato + microhidrosipatita 1000mg (absorción superior)',
      'Vitamina D3 2000 UI (activador de absorción intestinal)',
      'Vitamina K2 MK-7 120mcg (director de calcio hacia huesos)',
      'Magnesio citrato/malato 500mg (cofactor de +300 enzimas óseas)',
      'Boro citrato 3mg (optimizador del metabolismo mineral)',
      'Sílice de bambú 50mg (matriz de colágeno y flexibilidad ósea)',
      'Zinc picolinato 15mg (síntesis de colágeno tipo I)',
      'Manganeso gluconato 5mg (formación de cartílago y hueso)'
    ],
    relatedSystems: ['sistema-endocrino', 'sistema-cardiovascular']
  },
  {
    id: 'sistema-nervioso',
    name: '🧠 Sistema Nervioso',
    description: 'Optimiza tu función cerebral, memoria y bienestar neurológico',
    icon: '🧠',
    color: '#E8F5E8',
    featured: false,
    targetAudience: ['Estudiantes y profesionales', 'Adultos +60 años', 'Personas con estrés mental alto'],
    products: [
      'pr-alpha-gpc', 'pr-magnesium-threonate', '103', '104', 'pr-5htp'
    ],
    benefits: [
      'Mejora significativa de memoria y capacidad de aprendizaje',
      'Incremento del enfoque mental y concentración sostenida',
      'Optimización de la claridad mental y agilidad cognitiva',
      'Apoyo a la neuroplasticidad y formación de nuevas conexiones',
      'Protección neuronal contra el envejecimiento cerebral',
      'Mejora del estado de ánimo y equilibrio neurotransmisores',
      'Apoyo a un sueño reparador y ciclos circadianos saludables',
      'Reducción del estrés mental y promoción de calma alerta'
    ],
    keyIngredients: [
      'Alpha GPC 200mg (precursor directo de acetilcolina)',
      'L-Treonato de Magnesio (único magnesio que cruza barrera cerebral)',
      'L-Teanina 200mg (calma alerta sin somnolencia)',
      'GABA 750mg (neurotransmisor inhibitorio principal)',
      '5-HTP 200mg (precursor natural de serotonina)',
      'Bacopa Monnieri (memoria y concentración ayurvédica)',
      'PQQ (biogénesis mitocondrial cerebral)',
      'Fosfatidilserina (integridad de membranas neuronales)'
    ],
    relatedSystems: ['sistema-inmunologico', 'sistema-endocrino']
  },
  {
    id: 'sistema-endocrino',
    name: '⚖️ Sistema Endocrino',
    description: 'Equilibra tus hormonas naturalmente para bienestar integral',
    icon: '⚖️',
    color: '#FFF3E0',
    featured: false,
    targetAudience: ['Mujeres en menopausia', 'Personas con desequilibrios hormonales', 'Atletas de alto rendimiento'],
    products: [
      '12', 'pr-maca', 'pr-ashwa-melatonin', 'pr-inositol', '2'
    ],
    benefits: [
      'Equilibrio natural de hormonas sexuales y tiroideas',
      'Apoyo durante transiciones hormonales (menopausia, andropausia)',
      'Mejora de la adaptación al estrés y resistencia adrenal',
      'Regulación de ciclos circadianos y calidad del sueño',
      'Apoyo a la fertilidad y salud reproductiva',
      'Estabilización del estado de ánimo y energía',
      'Optimización del metabolismo y composición corporal',
      'Reducción de síntomas hormonales (sofocos, irritabilidad)'
    ],
    keyIngredients: [
      'Ashwagandha 4500mg (adaptógeno hormonal ayurvédico)',
      'Maca peruana 4800mg (equilibrio hormonal andino)',
      'Inositol 650mg (sensibilidad insulínica y SOP)',
      'Vitamina D3 (hormona esteroidea reguladora)',
      'Melatonina (regulador del ritmo circadiano)',
      'Isoflavonas de soja y trébol rojo (fitoestrógenos)',
      'Cohosh negro (modulador estrogénico natural)',
      'Zinc (síntesis y metabolismo hormonal)'
    ],
    relatedSystems: ['sistema-nervioso', 'sistema-oseo-mineral']
  },
  {
    id: 'sistema-detox',
    name: '🌿 Sistema Detox',
    description: 'Purifica y regenera tu organismo con detoxificación natural profunda',
    icon: '🌿',
    color: '#E0F2F1',
    featured: false,
    targetAudience: ['Personas con exposición a toxinas', 'Quienes buscan limpiezas estacionales', 'Habitantes de ciudades contaminadas'],
    products: [
      '11', 'pr-chlorophyll', 'pr-liver-cleanse', 'pr-activated-charcoal', '8'
    ],
    benefits: [
      'Desintoxicación profunda de hígado, riñones y sistema linfático',
      'Eliminación eficiente de metales pesados y toxinas ambientales',
      'Purificación sanguínea y mejora de la oxigenación celular',
      'Apoyo a los procesos naturales de detoxificación (Fase I y II)',
      'Mejora de la digestión y eliminación de residuos intestinales',
      'Incremento de energía y vitalidad tras la limpieza',
      'Fortalecimiento de la función hepática y biliar',
      'Restauración del equilibrio ácido-base corporal'
    ],
    keyIngredients: [
      'Clorofila concentrada 60mg (quelante natural y oxigenante)',
      'Complejo hepático (Cardo Mariano, Diente de León, Alcachofa)',
      'N-Acetilcisteína NAC (precursor de glutatión)',
      'Carbón activado 780mg (absorbente de toxinas intestinales)',
      'Fibra de Konjac (limpieza intestinal y saciedad)',
      'Extractos herbales (Boldo, Cúrcuma, Regaliz)',
      'Probióticos de limpieza (restauración de flora)',
      'Electrolitos (mantenimiento del equilibrio durante detox)'
    ],
    relatedSystems: ['sistema-inmunologico', 'sistema-cardiovascular']
  }
];

// ===== FUNCIONES DE UTILIDAD PARA SISTEMAS =====

export const getSystemById = (id: string): System | undefined => {
  return systems.find(system => system.id === id);
};

export const getProductsBySystem = (systemId: string): Product[] => {
  const system = getSystemById(systemId);
  if (!system) return [];
  
  return products.filter(product => 
    system.products.includes(product.id) || 
    product.categories.some(cat => cat === systemId)
  );
};

export const getFeaturedSystems = (): System[] => {
  return systems.filter(system => system.featured);
};

export const getRelatedSystems = (systemId: string): System[] => {
  const system = getSystemById(systemId);
  if (!system || !system.relatedSystems) return [];
  
  return systems.filter(s => system.relatedSystems?.includes(s.id));
};