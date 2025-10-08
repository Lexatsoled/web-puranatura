import { Product, ProductCategory } from '../src/types/product';

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

export const products: Product[] = [
  // Vitaminas y Minerales
  {
    id: "1",
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
    category: 'vitaminas-minerales',
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
    dosage: 'Debido a la alta potencia de esta fórmula (10000 UI), se recomienda tomar 1 cápsula cada 2-3 días con una comida que contenga algo de grasa, o según las indicaciones específicas de un profesional de la salud. Para uso continuo a largo plazo, es aconsejable monitorizar los niveles séricos de vitamina D periódicamente.',
    administrationMethod: 'Ingerir la cápsula blanda con un vaso de agua durante una comida que contenga algo de grasa para optimizar la absorción. Por ser liposoluble, la vitamina D3 se absorbe mejor cuando se consume con alimentos que contienen grasas saludables como aguacate, frutos secos o aceite de oliva.',
    faqs: [
      {
        question: '¿Por qué esta fórmula contiene 10000 UI? ¿No es una dosis muy alta?',
        answer: '10000 UI es una dosis elevada diseñada para corregir deficiencias significativas bajo supervisión médica. No está pensada para uso diario a largo plazo sin control profesional. Las personas con deficiencias severas, problemas de absorción o condiciones específicas pueden beneficiarse de esta potencia, pero siempre siguiendo pautas médicas y con monitorización periódica de los niveles sanguíneos.'
      },
      {
        question: '¿Cuáles son los signos de una deficiencia de vitamina D?',
        answer: 'Los síntomas comunes de deficiencia incluyen fatiga crónica, dolor óseo y muscular, debilidad muscular, infecciones frecuentes, cicatrización lenta de heridas, pérdida de densidad ósea y estado de ánimo deprimido, especialmente durante los meses de menor luz solar. Sin embargo, muchas personas con deficiencia pueden no presentar síntomas evidentes, por lo que los análisis de sangre son el método más confiable para detectarla.'
      },
      {
        question: '¿Es posible tomar demasiada vitamina D?',
        answer: 'Sí, la hipervitaminosis D es posible con suplementación excesiva a largo plazo. Niveles séricos superiores a 150 ng/ml pueden causar hipercalcemia (exceso de calcio en sangre) con síntomas como náuseas, vómitos, debilidad, confusión, arritmias y daño renal. Por eso, las formulaciones de alta potencia como esta (10000 UI) deben utilizarse bajo supervisión médica y con controles periódicos.'
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
    category: 'vitaminas-minerales',
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
    category: 'vitaminas-minerales',
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
        answer: 'Los suplementos de calcio y magnesio pueden interactuar con ciertos medicamentos para la presión arterial, especialmente los bloqueadores de los canales de calcio y los diuréticos. Consulte con su médico antes de comenzar la suplementación si está tomando estos u otros medicamentos recetados para asegurar que no haya interacciones significativas.'
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
    category: 'salud-articular',
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
    category: 'salud-digestiva',
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
    category: 'salud-digestiva',
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
    category: 'salud-digestiva',
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
    category: 'suplementos-especializados',
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
    category: 'suplementos-especializados',
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
    category: 'suplementos-especializados',
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
    category: 'salud-femenina',
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
    category: 'salud-femenina',
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
    category: 'suplementos-especializados',
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
  },

  {
    id: "pr-chlorophyll",
    name: 'Clorofila 60mg - 120 Cápsulas de Liberación Rápida',
    category: 'suplementos-especializados',
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
  },

  {
    id: "pr-konjac-fiber",
    name: 'Fibra de Raíz de Konjac - Glucomanano 600mg - 120 Cápsulas',
    category: 'salud-digestiva',
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
  },

  {
    id: "pr-tribulus",
    name: 'Ultra Tribulus Max 1000mg - 100 Cápsulas',
    category: 'suplementos-especializados',
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
  },

  {
    id: "pr-inositol",
    name: 'Inositol 650mg - 180 Cápsulas de Liberación Rápida',
    category: 'suplementos-especializados',
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
  },

  {
    id: "pr-magnesium-threonate",
    name: 'L-Treonato de Magnesio - 90 Cápsulas',
    category: 'vitaminas-minerales',
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
  },

  // Aceites Esenciales y Omega
  {
    id: "pr-fish-oil",
    name: 'Aceite de Pescado Omega-3 - 415mg - 200 Cápsulas Mini',
    category: 'suplementos-especializados',
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
    category: 'suplementos-especializados',
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

  {
    id: "pr-ashwagandha",
    name: 'Ashwagandha 4500mg - 120 Cápsulas de Liberación Rápida',
    category: 'suplementos-especializados',
    price: 715.61,
    description: 'Extracto estandarizado de raíz de Ashwagandha. Adaptógeno ayurvédico que ayuda a manejar el estrés, apoya la energía y promueve un sueño reparador.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14230_1.jpg
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
    sku: 'PR-ASHWA-4500',
    tags: ['adaptógeno', 'estrés', 'energía', 'sueño'],
  },

  // Salud Hepática y Desintoxicación
  {
    id: "pr-same",
    name: 'SAMe - Recuperimiento Entérico 200mg - 30 Tabletas',
    category: 'suplementos-especializados',
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
    category: 'suplementos-especializados',
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
    category: 'suplementos-especializados',
    price: 714.42,
    description: 'Aceite de borraja rico en ácido gamma-linolénico (GLA). Apoya la salud de la piel, equilibrio hormonal y respuesta inflamatoria saludable.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14154_2.jpg
    images: [
      {
        thumbnail: '/Jpeg/Borage Oil (GLA) Reverso.jpg',
        full: '/Jpeg/Borage Oil (GLA) Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Borage Oil (GLA) Anverso.jpg',
        full: '/Jpeg/Borage Oil (GLA) Anverso.jpg',
      },
    ],
    stock: 28,
    sku: 'PR-BOR-1000',
    tags: ['GLA', 'piel', 'hormonal', 'inflamación'],
  },

  {
    id: "pr-liver-cleanse",
    name: '3-Day Liver Cleanse - 12 Cápsulas Vegetarianas',
    category: 'salud-digestiva',
    price: 891.66,
    description: 'Programa de limpieza hepática de 3 días con hierbas tradicionales. Diseñado para apoyar la función de desintoxicación natural del hígado.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16486_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Milk Thistle, Dandelion & Yellow Dock Anverso.jpg',
        full: '/Jpeg/Milk Thistle, Dandelion & Yellow Dock Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Milk Thistle, Dandelion & Yellow Dock Reverso.jpg',
        full: '/Jpeg/Milk Thistle, Dandelion & Yellow Dock Reverso.jpg',
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
    category: 'suplementos-especializados',
    price: 356.90,
    description: 'Fórmula sinérgica que combina Ashwagandha, Melatonina y L-Teanina para promover relajación profunda y sueño reparador de calidad.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17265_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=ashwa-melatonin',
        full: 'https://picsum.photos/600/600?random=ashwa-melatonin',
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
    category: 'suplementos-especializados',
    price: 356.90,
    description: 'Aceite esencial de albahaca 100% puro y natural. Ideal para aromaterapia, masajes y uso tópico diluido. Aroma fresco y revitalizante.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14001_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=basil-oil',
        full: 'https://picsum.photos/600/600?random=basil-oil',
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
    category: 'suplementos-especializados',
    price: 1789.32,
    description: 'Creatina monohidrato micronizada de alta pureza. Apoya la fuerza muscular, potencia y recuperación en entrenamientos intensos.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14520_1.jpg
    images: [
      {
        thumbnail: '/Jpeg/Creatine (Micronized) Reverso.jpg',
        full: '/Jpeg/Creatine (Micronized) Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Creatine (Micronized) Anverso.jpg',
        full: '/Jpeg/Creatine (Micronized) Anverso.jpg',
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
    category: 'suplementos-especializados',
    price: 318.72,
    description: 'Mezcla premium de aceite esencial de manzanilla. Conocido por sus propiedades calmantes y relajantes. Ideal para relajación y cuidado de la piel.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14008_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=chamomile-oil',
        full: 'https://picsum.photos/600/600?random=chamomile-oil',
      },
    ],
    stock: 30,
    sku: 'PR-CHAM-15',
    tags: ['aceite esencial', 'calmante', 'relajante', 'manzanilla'],
  },

  {
    id: "pr-sandalwood-oil",
    name: 'Mezcla de Aceite Esencial de Sándalo - 15mL',
    category: 'suplementos-especializados',
    price: 318.72,
    description: 'Mezcla exquisita de aceite esencial de sándalo. Aroma exótico y relajante, tradicionalmente usado en meditación y cuidado espiritual.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14045_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=sandalwood-oil',
        full: 'https://picsum.photos/600/600?random=sandalwood-oil',
      },
    ],
    stock: 25,
    sku: 'PR-SAND-15',
    tags: ['aceite esencial', 'meditación', 'relajante', 'sándalo'],
  },

  // Neurotransmisores y Estado de Ánimo
  {
    id: "pr-gaba",
    name: 'GABA (Ácido Gamma Aminobutírico) 750mg - 100 Cápsulas',
    category: 'suplementos-especializados',
    price: 1085.65,
    description: 'GABA, neurotransmisor inhibidor natural que promueve la calma y relajación. Apoya la reducción del estrés y un estado mental equilibrado.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14456_1.jpg
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
    stock: 30,
    sku: 'PR-GABA-750',
    tags: ['neurotransmisor', 'calma', 'estrés', 'relajación'],
  },

  {
    id: "pr-5htp",
    name: '5-HTP 200mg - 180 Cápsulas de Liberación Rápida',
    category: 'suplementos-especializados',
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
  },

  // Antioxidantes y Antiinflamatorios
  {
    id: "pr-turmeric-complex",
    name: 'Complejo de Cúrcuma Estandarizada con Pimienta Negra 1000mg - 180 Cápsulas',
    category: 'suplementos-especializados',
    price: 1909.29,
    description: 'Cúrcuma estandarizada con bioperina (pimienta negra) para máxima absorción. Potente antiinflamatorio natural y antioxidante.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14287_1.jpg
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
    stock: 35,
    sku: 'PR-TURC-1000',
    tags: ['cúrcuma', 'antiinflamatorio', 'antioxidante', 'bioperina'],
  },

  {
    id: "pr-coq10",
    name: 'CoQ10 100mg - 240 Cápsulas Blandas',
    category: 'suplementos-especializados',
    price: 1163.24,
    description: 'Coenzima Q10 de alta potencia para apoyar la salud cardiovascular y producción de energía celular. Antioxidante esencial para el corazón.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14198_1.jpg
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
    tags: ['coenzima', 'cardiovascular', 'energía', 'antioxidante'],
  },

  // Hierbas Tradicionales
  {
    id: "pr-bacopa",
    name: 'Bacopa Monnieri 1000mg - 180 Cápsulas',
    category: 'suplementos-especializados',
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
    category: 'suplementos-especializados',
    price: 1790.90,
    description: 'Pirroloquinolina Quinona, cofactor que apoya la biogénesis mitocondrial y función cerebral. Potente antioxidante para energía celular.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14589_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=pqq',
        full: 'https://picsum.photos/600/600?random=pqq',
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
    category: 'suplementos-especializados',
    price: 793.64,
    description: 'Extracto concentrado de ajo sin olor, estandarizado en alicina. Apoya la salud cardiovascular y función inmunológica.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14156_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=garlic',
        full: 'https://picsum.photos/600/600?random=garlic',
      },
    ],
    stock: 35,
    sku: 'PR-GAR-500',
    tags: ['ajo', 'cardiovascular', 'inmune', 'alicina'],
  },

  {
    id: "pr-kudzu-root",
    name: 'Raíz de Kudzu 1600mg - 100 Cápsulas',
    category: 'suplementos-especializados',
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

  {
    id: "pr-arnica-oil",
    name: 'Aceite de Árnica - 15mL',
    category: 'suplementos-especializados',
    price: 536.26,
    description: 'Aceite de árnica puro para uso tópico. Tradicionalmente usado para apoyar la recuperación muscular y alivio de molestias menores.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14003_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=arnica-oil',
        full: 'https://picsum.photos/600/600?random=arnica-oil',
      },
    ],
    stock: 30,
    sku: 'PR-ARN-15',
    tags: ['árnica', 'tópico', 'muscular', 'recuperación'],
  },

  // Salud Digestiva Avanzada
  {
    id: "pr-apple-cider-vinegar",
    name: 'Dieta de Vinagre de Sidra de Manzana - 84 Cápsulas',
    category: 'salud-digestiva',
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
    category: 'salud-digestiva',
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
  {
    id: "pr-ashwagandha-240",
    name: 'Ashwagandha 4500mg - 240 Cápsulas (Presentación Grande)',
    category: 'suplementos-especializados',
    price: 2173.09,
    description: 'Presentación económica de Ashwagandha. Extracto estandarizado de raíz para manejo del estrés, energía y bienestar general a largo plazo.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14230_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=ashwagandha-240',
        full: 'https://picsum.photos/600/600?random=ashwagandha-240',
      },
    ],
    stock: 25,
    sku: 'PR-ASHWA-240',
    tags: ['adaptógeno', 'estrés', 'energía', 'económico'],
  },

  // Salud Cerebral y Cognitiva
  {
    id: "pr-soy-lecithin",
    name: 'Soya Lecithin 1200mg - 100 Softgels',
    category: 'suplementos-especializados',
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
    category: 'suplementos-especializados',
    price: 356.50,
    description: 'Aceite esencial de clavo 100% puro. Conocido por sus propiedades antimicrobianas y uso tradicional en cuidado bucal.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14012_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=clove-oil',
        full: 'https://picsum.photos/600/600?random=clove-oil',
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
    category: 'suplementos-especializados',
    price: 149.19,
    description: 'Combinación potente de arándano rojo concentrado y vitamina C. Apoya la salud del tracto urinario y función inmunológica.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14189_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=cranberry-vitamin-c',
        full: 'https://picsum.photos/600/600?random=cranberry-vitamin-c',
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
    category: 'suplementos-especializados',
    price: 1197.14,
    description: 'Péptidos de colágeno alimentado con pasto, tipos I y III. Apoya la salud de piel, cabello, uñas y articulaciones. En polvo fácil de mezclar.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17234_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=collagen-peptides',
        full: 'https://picsum.photos/600/600?random=collagen-peptides',
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
    category: 'salud-digestiva',
    price: 267.84,
    description: 'Combinación sinérgica de probióticos y enzimas digestivas múltiples. Apoya la digestión saludable y equilibrio de la flora intestinal.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16789_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=digestive-duo',
        full: 'https://picsum.photos/600/600?random=digestive-duo',
      },
    ],
    stock: 35,
    sku: 'PR-DIG-30',
    tags: ['probióticos', 'enzimas', 'digestión', 'flora'],
  },

  // Desintoxicación Adicional
  {
    id: "pr-liver-cleanse-3day",
    name: 'Limpieza del Hígado en 3 Días - Programa Completo',
    category: 'salud-digestiva',
    price: 596.76,
    description: 'Programa completo de limpieza hepática de 3 días con mezcla de hierbas tradicionales para apoyar la función de desintoxicación natural.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/6/16486_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=liver-cleanse-3day',
        full: 'https://picsum.photos/600/600?random=liver-cleanse-3day',
      },
    ],
    stock: 15,
    sku: 'PR-LIVER-COMP',
    tags: ['hígado', 'detox', 'limpieza', 'programa'],
  },

  // Aceites Esenciales Finales
  {
    id: "pr-chamomile-oil-blend",
    name: 'Mezcla de Aceite Esencial de Manzanilla (Presentación 6-pack) - 15mL',
    category: 'suplementos-especializados',
    price: 319.98,
    description: 'Pack económico de aceite esencial de manzanilla. Ideal para uso regular en aromaterapia, relajación y cuidado natural de la piel.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14008_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=chamomile-6pack',
        full: 'https://picsum.photos/600/600?random=chamomile-6pack',
      },
    ],
    stock: 20,
    sku: 'PR-CHAM-6PK',
    tags: ['aceite esencial', 'manzanilla', 'pack', 'económico'],
  },

  {
    id: "pr-sandalwood-oil-blend",
    name: 'Mezcla de Aceite Esencial de Sándalo (Presentación 6-pack) - 15mL',
    category: 'suplementos-especializados',
    price: 319.98,
    description: 'Pack económico de aceite esencial de sándalo. Perfecto para meditación, relajación profunda y prácticas espirituales regulares.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14045_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=sandalwood-6pack',
        full: 'https://picsum.photos/600/600?random=sandalwood-6pack',
      },
    ],
    stock: 15,
    sku: 'PR-SAND-6PK',
    tags: ['aceite esencial', 'sándalo', 'meditación', 'pack'],
  },

  // Suplementos para Rendimiento Mental
  {
    id: "pr-ashwa-melatonin-4pack",
    name: 'Ashwagandha Melatonin plus L-Theanine (Pack de 4) - 60 Cápsulas c/u',
    category: 'suplementos-especializados',
    price: 716.60,
    description: 'Pack económico de fórmula para sueño reparador. Combina adaptógenos y melatonina para un descanso profundo y reparador.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17265_2.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=ashwa-melatonin-4pack',
        full: 'https://picsum.photos/600/600?random=ashwa-melatonin-4pack',
      },
    ],
    stock: 12,
    sku: 'PR-ASHMEL-4PK',
    tags: ['sueño', 'pack', 'melatonina', 'económico'],
  },

  // Salud Celular Avanzada
  {
    id: "pr-gaba-single",
    name: 'GABA (Ácido Gamma Aminobutírico) 750mg - 100 Cápsulas (Unidad)',
    category: 'suplementos-especializados',
    price: 1089.88,
    description: 'GABA individual para manejo del estrés y promoción de la calma mental. Neurotransmisor natural para equilibrio emocional.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/4/14456_2.jpg
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
    stock: 25,
    sku: 'PR-GABA-SING',
    tags: ['GABA', 'estrés', 'calma', 'neurotransmisor'],
  },

  // Aceites MCT y Energía
  {
    id: "pr-mct-oil",
    name: 'Aceite de MCT (Triglicéridos de Cadena Media) 3600mg - 150 Cápsulas',
    category: 'suplementos-especializados',
    price: 760.34,
    description: 'Aceite de MCT para energía rápida y apoyo metabólico. Ideal para dietas cetogénicas y rendimiento mental sostenido.',
    // IMAGEN PIPING ROCK: https://www.pipingrock.com/media/catalog/product/1/7/17489_1.jpg
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=mct-oil',
        full: 'https://picsum.photos/600/600?random=mct-oil',
      },
    ],
    stock: 30,
    sku: 'PR-MCT-3600',
    tags: ['MCT', 'energía', 'cetogénico', 'mental'],
  },

  // Productos Adicionales de Piping Rock
  {
    id: "pr-calendula-extract",
    name: 'Extracto Líquido de Caléndula, Botella con Gotero de 4 fl oz (118 mL)',
    category: 'suplementos-especializados',
    price: 187.12,
    description: 'Extracto líquido de caléndula para apoyo en cuidado de la piel y bienestar general. Formato líquido de fácil absorción.',
    // URL PIPING ROCK: https://www.pipingrock.com/calendula/calendula-liquid-extract-4-fl-oz-118-ml-dropper-bottle-15024
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=calendula-extract',
        full: 'https://picsum.photos/600/600?random=calendula-extract',
      },
    ],
    stock: 20,
    sku: 'PR-CAL-EXT',
    tags: ['caléndula', 'extracto', 'líquido', 'piel'],
  },

  {
    id: "pr-dhea-100mg-extra",
    name: 'DHEA, 100 mg, 100 Cápsulas (Presentación Adicional)',
    category: 'suplementos-especializados',
    price: 374.92,
    description: 'DHEA adicional para balance hormonal y vitalidad. Presentación alternativa del suplemento hormonal premium.',
    // URL PIPING ROCK: https://www.pipingrock.com/dhea/dhea-100-mg-100-capsules-1436
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=dhea-extra',
        full: 'https://picsum.photos/600/600?random=dhea-extra',
      },
    ],
    stock: 15,
    sku: 'PR-DHEA-100-EXTRA',
    tags: ['DHEA', 'hormonal', 'vitalidad', 'premium'],
  },

  {
    id: "pr-licorice-root",
    name: 'Raíz de Regaliz 900 mg (por porción) 180 Cápsulas de liberación rápida',
    category: 'suplementos-especializados',
    price: 156.42,
    description: 'Raíz de regaliz tradicional para apoyo respiratorio y digestivo. Hierba adaptógena con múltiples beneficios.',
    // URL PIPING ROCK: https://www.pipingrock.com/licorice-root/licorice-root-900-mg-180-quick-release-capsules-1088
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=licorice-root',
        full: 'https://picsum.photos/600/600?random=licorice-root',
      },
    ],
    stock: 25,
    sku: 'PR-LIC-900',
    tags: ['regaliz', 'respiratorio', 'digestivo', 'adaptógeno'],
  },

  {
    id: "pr-borage-oil",
    name: 'Aceite de Borraja (GLA) 1000 mg 120 Cápsulas blandas de liberación rápida',
    category: 'suplementos-especializados',
    price: 124.62,
    description: 'Aceite de borraja rico en GLA para salud de la piel y balance hormonal femenino. Ácidos grasos esenciales.',
    // URL PIPING ROCK: https://www.pipingrock.com/borage-oil/borage-oil-gla-1000-mg-120-quick-release-softgels-1123
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=borage-oil',
        full: 'https://picsum.photos/600/600?random=borage-oil',
      },
    ],
    stock: 20,
    sku: 'PR-BOR-1000',
    tags: ['borraja', 'GLA', 'piel', 'hormonal'],
  },

  {
    id: "pr-vitamin-c-rosehips-extra",
    name: 'Vitamina C 1000 mg con Escaramujos, 250 cápsulas (Presentación Extra)',
    category: 'vitaminas-minerales',
    price: 187.12,
    description: 'Vitamina C con escaramujos para potenciar la absorción. Presentación extra económica con bioflavonoides naturales.',
    // URL PIPING ROCK: https://www.pipingrock.com/vitamin-c/vitamin-c-1000-mg-with-rose-hips-250-caplets-1004
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=vitamin-c-extra',
        full: 'https://picsum.photos/600/600?random=vitamin-c-extra',
      },
    ],
    stock: 30,
    sku: 'PR-VC-ROSE-EXTRA',
    tags: ['vitamina C', 'escaramujos', 'económico', 'bioflavonoides'],
  },

  {
    id: "pr-saw-palmetto",
    name: 'Palmito Salvaje, 160 mg, 50 Cápsulas Blandas',
    category: 'salud-masculina',
    price: 187.12,
    description: 'Palmito salvaje para salud prostática masculina. Extracto estandarizado con ácidos grasos y esteroles.',
    // URL PIPING ROCK: https://www.pipingrock.com/saw-palmetto/saw-palmetto-160-mg-50-softgels-1025
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=saw-palmetto',
        full: 'https://picsum.photos/600/600?random=saw-palmetto',
      },
    ],
    stock: 25,
    sku: 'PR-SAW-160',
    tags: ['palmito', 'próstata', 'masculino', 'extracto'],
  },

  {
    id: "pr-l-serine",
    name: 'L-Serina 500 mg 90 Cápsulas de liberación rápida',
    category: 'suplementos-especializados',
    price: 187.12,
    description: 'L-Serina para función cerebral y síntesis de neurotransmisores. Aminoácido esencial para salud neurológica.',
    // URL PIPING ROCK: https://www.pipingrock.com/l-serine/l-serine-500-mg-90-quick-release-capsules-17115
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=l-serine',
        full: 'https://picsum.photos/600/600?random=l-serine',
      },
    ],
    stock: 20,
    sku: 'PR-SER-500',
    tags: ['serina', 'cerebral', 'neurológico', 'aminoácido'],
  },

  {
    id: "pr-menopause-plus-extra",
    name: 'Menopausia Plus, 60 Cápsulas Vegetarianas (Presentación Adicional)',
    category: 'salud-femenina',
    price: 374.92,
    description: 'Fórmula completa para apoyo durante la menopausia. Presentación adicional con hierbas tradicionales y nutrientes.',
    // URL PIPING ROCK: https://www.pipingrock.com/womens-health/menopause-plus-60-vegetarian-capsules-1259
    images: [
      {
        thumbnail: '/Jpeg/Menopause Plus Anverso.jpg',
        full: '/Jpeg/Menopause Plus Anverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Menopause Plus Reverso.jpg',
        full: '/Jpeg/Menopause Plus Reverso.jpg',
      },
    ],
    stock: 15,
    sku: 'PR-MENO-EXTRA',
    tags: ['menopausia', 'femenino', 'hierbas', 'completo'],
  },

  {
    id: "pr-apple-cider-vinegar",
    name: 'Vinagre de Sidra de Manzana, 450 mg, 120 Cápsulas',
    category: 'salud-digestiva',
    price: 156.42,
    description: 'Vinagre de sidra de manzana para apoyo digestivo y metabólico. Rico en ácido acético y enzimas naturales.',
    // URL PIPING ROCK: https://www.pipingrock.com/apple-cider-vinegar/apple-cider-vinegar-450-mg-120-capsules-1169
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=apple-cider',
        full: 'https://picsum.photos/600/600?random=apple-cider',
      },
    ],
    stock: 25,
    sku: 'PR-ACV-450',
    tags: ['vinagre', 'digestivo', 'metabólico', 'enzimas'],
  },

  {
    id: "pr-nutmeg-oil",
    name: 'Aceite esencial de nuez moscada, puro (GC/MS Probado) 1/2 fl oz 15 mL Frasco con dosificador',
    category: 'aceites-esenciales',
    price: 62.36,
    description: 'Aceite esencial puro de nuez moscada para aromaterapia. Probado por GC/MS para garantizar pureza y potencia.',
    // URL PIPING ROCK: https://www.pipingrock.com/essential-oils/pure-nutmeg-essential-oil-gc-ms-tested-1-2-fl-oz-15-ml-dropper-bottle-1844
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=nutmeg-oil',
        full: 'https://picsum.photos/600/600?random=nutmeg-oil',
      },
    ],
    stock: 20,
    sku: 'PR-NUTMEG-OIL',
    tags: ['nuez moscada', 'aceite esencial', 'aromaterapia', 'puro'],
  },

  {
    id: "pr-juniper-berry-oil",
    name: 'Aceite esencial de baya de enebro del Himalaya, puro (GC/MS Probado) 1/2 fl oz 15 mL Frasco con dosificador',
    category: 'aceites-esenciales',
    price: 124.62,
    description: 'Aceite esencial de baya de enebro del Himalaya para aromaterapia. Calidad premium con certificación GC/MS.',
    // URL PIPING ROCK: https://www.pipingrock.com/essential-oils/pure-himalayan-juniper-berry-essential-oil-gc-ms-tested-1-2-fl-oz-15-ml-dropper-bottle-15457
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=juniper-oil',
        full: 'https://picsum.photos/600/600?random=juniper-oil',
      },
    ],
    stock: 15,
    sku: 'PR-JUNIPER-OIL',
    tags: ['enebro', 'Himalaya', 'aceite esencial', 'premium'],
  },

  {
    id: "pr-cinnamon-leaf-oil",
    name: 'Aceite esencial de hoja de canela, puro (GC/MS Probado) 2 fl oz 59 mL Botella/Frasco',
    category: 'aceites-esenciales',
    price: 218.62,
    description: 'Aceite esencial de hoja de canela en presentación grande. Propiedades calmantes y aromáticas intensas.',
    // URL PIPING ROCK: https://www.pipingrock.com/essential-oils/pure-cinnamon-leaf-essential-oil-gc-ms-tested-2-fl-oz-59-ml-bottle-1795
    images: [
      {
        thumbnail: 'https://picsum.photos/300/300?random=cinnamon-oil',
        full: 'https://picsum.photos/600/600?random=cinnamon-oil',
      },
    ],
    stock: 10,
    sku: 'PR-CINNAMON-OIL',
    tags: ['canela', 'aceite esencial', 'calmante', 'grande'],
  },

  {
    id: "pr-turmeric-advanced",
    name: 'Compuesto avanzado de cúrcuma y curcumina 1500 mg (por porción) 120 Cápsulas de liberación rápida',
    category: 'suplementos-especializados',
    price: 37.99,
    description: 'Fórmula avanzada de cúrcuma con curcumina concentrada. Máxima potencia antiinflamatoria con biodisponibilidad mejorada.',
    images: [
      {
        thumbnail: '/Jpeg/Standardized Turmeric Curcumin Reverso.jpg',
        full: '/Jpeg/Standardized Turmeric Curcumin Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Standardized Turmeric Curcumin Anverso.jpg',
        full: '/Jpeg/Standardized Turmeric Curcumin Anverso.jpg',
      },
    ],
    stock: 12,
    sku: 'PR-TURMERIC-ADV',
    tags: ['cúrcuma', 'curcumina', 'antiinflamatorio', 'avanzado'],
  },

  // Nuevos productos con imágenes reales de Piping Rock
  {
    id: "101",
    name: 'Ashwagandha 4500mg',
    category: 'suplementos-especializados',
    price: 29.99,
    description: 'Ashwagandha de alta potencia para reducir el estrés y mejorar la energía natural.',
    images: [
      {
        thumbnail: '/Jpeg/Ashwagandha, 4500 mg Reverso.jpg',
        full: '/Jpeg/Ashwagandha, 4500 mg Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Ashwagandha, 4500 mg Anverso.jpg',
        full: '/Jpeg/Ashwagandha, 4500 mg Anverso.jpg',
      },
    ],
    stock: 45,
    sku: 'ASH-4500',
    tags: ['adaptógeno', 'estrés', 'energía', 'ashwagandha'],
  },

  {
    id: "102",
    name: 'CoQ10 100mg',
    category: 'vitaminas-minerales',
    price: 34.99,
    description: 'Coenzima Q10 para la salud cardiovascular y energía celular.',
    images: [
      {
        thumbnail: '/Jpeg/CoQ10, 100 mg Reverso.jpg',
        full: '/Jpeg/CoQ10, 100 mg Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/CoQ10, 100 mg Anverso.jpg',
        full: '/Jpeg/CoQ10, 100 mg Anverso.jpg',
      },
    ],
    stock: 30,
    sku: 'COQ10-100',
    tags: ['coenzima', 'cardiovascular', 'energía', 'antioxidante'],
  },

  {
    id: "103",
    name: 'GABA 750mg',
    category: 'suplementos-especializados',
    price: 24.99,
    description: 'GABA para promover la relajación y mejorar la calidad del sueño.',
    images: [
      {
        thumbnail: '/Jpeg/GABA Reverso.jpg',
        full: '/Jpeg/GABA Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/GABA Anverso.jpg',
        full: '/Jpeg/GABA Anverso.jpg',
      },
    ],
    stock: 40,
    sku: 'GABA-750',
    tags: ['relajación', 'sueño', 'calma', 'neurotransmisor'],
  },

  {
    id: "104",
    name: 'L-Theanine 200mg',
    category: 'suplementos-especializados',
    price: 26.99,
    description: 'L-Teanina para la relajación mental sin somnolencia.',
    images: [
      {
        thumbnail: '/Jpeg/L-Theanine, 200 mg Reverso.jpg',
        full: '/Jpeg/L-Theanine, 200 mg Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/L-Theanine, 200 mg Anverso.jpg',
        full: '/Jpeg/L-Theanine, 200 mg Anverso.jpg',
      },
    ],
    stock: 35,
    sku: 'LTHEA-200',
    tags: ['relajación', 'concentración', 'té verde', 'calma'],
  },

  {
    id: "105",
    name: 'Magnesium Citrate 400mg',
    category: 'vitaminas-minerales',
    price: 19.99,
    description: 'Citrato de magnesio de alta absorción para músculos y nervios.',
    images: [
      {
        thumbnail: '/Jpeg/Magnesium Citrate, 400 mg Reverso.jpg',
        full: '/Jpeg/Magnesium Citrate, 400 mg Reverso.jpg',
      },
      {
        thumbnail: '/Jpeg/Magnesium Citrate, 400 mg Anverso.jpg',
        full: '/Jpeg/Magnesium Citrate, 400 mg Anverso.jpg',
      },
    ],
    stock: 60,
    sku: 'MAG-CIT-400',
    tags: ['magnesio', 'músculos', 'nervios', 'citrato'],
  },
];

