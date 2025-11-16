import { Service } from '../types/services';

export const services: Service[] = [
  {
    id: 'naturopatia',
    title: 'Naturopatía',
    slug: 'naturopatia',
    description:
      'Un enfoque holístico para el bienestar que utiliza remedios naturales para ayudar al cuerpo a curarse a sí mismo. Evaluamos tu estilo de vida, dieta y estado emocional para crear un plan personalizado.',
    detailedContent: `
      <h2>¿Qué es la Naturopatía?</h2>
      <p>La naturopatía es una forma de medicina alternativa que emplea una gama de técnicas pseudocientíficas comercializadas como "naturales", "no invasivas" y que "promueven la autocuración". Sin embargo, en nuestro enfoque, aplicamos los principios más sólidos de esta disciplina, basándonos en evidencia científica disponible y métodos comprobados.</p>
      
      <h3>Principios Fundamentales</h3>
      <p>Nuestra práctica naturopática se basa en seis principios fundamentales que guían cada consulta y tratamiento:</p>
      <ul>
        <li><strong>Primum non nocere (Primero no hacer daño):</strong> Utilizamos métodos y sustancias medicinales que minimicen el riesgo de efectos secundarios dañinos.</li>
        <li><strong>Vis medicatrix naturae (El poder curativo de la naturaleza):</strong> El cuerpo tiene una capacidad inherente para mantenerse y restaurar la salud.</li>
        <li><strong>Tolle causam (Identificar y tratar las causas):</strong> Buscamos identificar y eliminar las causas subyacentes de la enfermedad.</li>
        <li><strong>Docere (Médico como maestro):</strong> Los naturópatas educan a sus pacientes y los alientan a asumir la responsabilidad personal de su salud.</li>
        <li><strong>Tratamiento de la persona completa:</strong> Consideramos todos los factores individuales en la salud y la enfermedad.</li>
        <li><strong>Prevención:</strong> El objetivo final es la prevención de enfermedades y trastornos.</li>
      </ul>
      
      <h3>Metodología de Evaluación</h3>
      <p>Durante tu consulta inicial, realizamos una evaluación integral que incluye:</p>
      
      <h4>Historia Clínica Detallada</h4>
      <p>Revisamos tu historial médico completo, incluyendo síntomas actuales, medicamentos, cirugías previas y antecedentes familiares de salud.</p>
      
      <h4>Análisis del Estilo de Vida</h4>
      <ul>
        <li><strong>Patrones de sueño:</strong> Calidad, duración y rutinas de descanso</li>
        <li><strong>Niveles de estrés:</strong> Factores estresantes y mecanismos de afrontamiento</li>
        <li><strong>Actividad física:</strong> Tipo, frecuencia e intensidad del ejercicio</li>
        <li><strong>Exposición ambiental:</strong> Toxinas, químicos y contaminantes</li>
      </ul>
      
      <h4>Evaluación Nutricional Completa</h4>
      <p>Analizamos tus hábitos alimentarios, intolerancias, digestión y absorción de nutrientes para identificar deficiencias o desequilibrios que puedan estar afectando tu salud.</p>
      
      <h4>Estado Emocional y Mental</h4>
      <p>Consideramos el impacto del bienestar emocional en la salud física, evaluando niveles de ansiedad, depresión y otros factores psicológicos.</p>
      
      <h3>Herramientas Terapéuticas</h3>
      <p>Basándonos en la evaluación, desarrollamos un plan de tratamiento personalizado que puede incluir:</p>
      
      <h4>Medicina Herbal</h4>
      <p>Utilizamos plantas medicinales con respaldo científico, siempre considerando interacciones con medicamentos convencionales.</p>
      
      <h4>Suplementación Nutricional</h4>
      <p>Recomendamos vitaminas, minerales y otros nutrientes específicos basados en necesidades individuales y evidencia científica.</p>
      
      <h4>Modificaciones Dietéticas</h4>
      <p>Desarrollamos planes nutricionales personalizados que consideran preferencias, restricciones y objetivos de salud específicos.</p>
      
      <h4>Técnicas de Manejo del Estrés</h4>
      <p>Enseñamos métodos comprobados como la respiración profunda, meditación mindfulness y técnicas de relajación progresiva.</p>
      
      <h3>Condiciones que Tratamos</h3>
      <p>Nuestro enfoque naturopático es especialmente efectivo para:</p>
      <ul>
        <li>Trastornos digestivos (síndrome del intestino irritable, disbiosis intestinal)</li>
        <li>Desequilibrios hormonales (síndrome premenstrual, menopausia)</li>
        <li>Fatiga crónica y problemas de energía</li>
        <li>Problemas de piel (eczema, acné, psoriasis)</li>
        <li>Trastornos del sueño</li>
        <li>Manejo del estrés y ansiedad</li>
        <li>Apoyo inmunológico</li>
        <li>Desintoxicación y limpieza corporal</li>
      </ul>
      
      <h3>Enfoque Integrativo</h3>
      <p>Trabajamos en colaboración con tu médico de cabecera y otros profesionales de la salud. No recomendamos suspender tratamientos médicos convencionales sin supervisión médica adecuada.</p>
      
      <p>Nuestro objetivo es complementar la medicina convencional, ofreciendo un enfoque más holístico que considere todos los aspectos de tu bienestar para lograr una salud óptima y sostenible.</p>
    `,
    imageUrl: '/images/og-image.jpg',
    duration: 90,
    price: 75.0,
    category: 'Consulta',
    benefits: [
      'Enfoque holístico personalizado',
      'Identificación de causas raíz',
      'Tratamientos naturales seguros',
      'Educación en autocuidado',
      'Prevención de enfermedades',
    ],
    contraindications: [
      'Condiciones médicas graves que requieren atención médica inmediata',
      'Pacientes que requieren medicación de emergencia',
      'Casos donde se necesita cirugía urgente',
    ],
    whatToExpect:
      'Durante tu primera consulta, dedicaremos 90 minutos a conocerte completamente. Revisaremos tu historia clínica, hábitos de vida, alimentación y estado emocional. Recibirás un plan personalizado con recomendaciones específicas para tu situación.',
    preparation:
      'Trae contigo tu historial médico reciente, lista de medicamentos actuales, y un diario de alimentación de los últimos 3 días. Viste ropa cómoda y ven con mente abierta para explorar nuevas perspectivas sobre tu salud.',
  },
  {
    id: 'fitoterapia',
    title: 'Fitoterapia',
    slug: 'fitoterapia',
    description:
      'El arte y la ciencia de usar plantas medicinales para promover la salud y tratar enfermedades. Utilizamos extractos, tés e infusiones basados en evidencia científica y conocimiento tradicional.',
    detailedContent: `
      <h2>La Ciencia de las Plantas Medicinales</h2>
      <p>La fitoterapia combina la sabiduría tradicional milenaria con la investigación científica moderna para ofrecer tratamientos naturales seguros y efectivos. Cada planta contiene una compleja sinfonía de compuestos bioactivos que trabajan en armonía para promover la curación.</p>
      
      <h3>¿Cómo Funcionan las Plantas Medicinales?</h3>
      <p>A diferencia de los medicamentos sintéticos que aíslan un solo compuesto, las plantas medicinales ofrecen un espectro completo de sustancias activas que se potencian mutuamente. Este fenómeno, conocido como sinergia, permite efectos terapéuticos más suaves y sostenidos con menos efectos secundarios.</p>
      
      <h4>Principales Grupos de Compuestos Activos:</h4>
      <ul>
        <li><strong>Alcaloides:</strong> Compuestos nitrogenados con efectos potentes sobre el sistema nervioso (quinina, morfina, cafeína)</li>
        <li><strong>Glucósidos:</strong> Compuestos que liberan sustancias activas gradualmente (digitoxina, salicina)</li>
        <li><strong>Flavonoides:</strong> Potentes antioxidantes que protegen contra el daño celular</li>
        <li><strong>Taninos:</strong> Compuestos astringentes con propiedades antiinflamatorias</li>
        <li><strong>Aceites esenciales:</strong> Compuestos volátiles con efectos antimicrobianos y aromáticos</li>
        <li><strong>Mucílagos:</strong> Sustancias gelatinosas que protegen las mucosas</li>
      </ul>
      
      <h3>Nuestro Enfoque Terapéutico</h3>
      <p>En nuestras consultas de fitoterapia, realizamos una evaluación integral que considera:</p>
      
      <h4>Evaluación Constitucional</h4>
      <p>Analizamos tu constitución única, incluyendo temperamento, metabolismo, y patrones de respuesta para seleccionar las plantas más adecuadas para ti.</p>
      
      <h4>Historia Clínica Detallada</h4>
      <p>Revisamos síntomas actuales, medicamentos, alergias y respuestas previas a tratamientos naturales.</p>
      
      <h4>Análisis de Interacciones</h4>
      <p>Evaluamos cuidadosamente posibles interacciones con medicamentos convencionales que puedas estar tomando.</p>
      
      <h3>Especialidades Terapéuticas</h3>
      
      <h4>🌱 Sistema Digestivo</h4>
      <ul>
        <li><strong>Manzanilla (Matricaria chamomilla):</strong> Antiinflamatoria, antiespasmódica, ideal para gastritis y colitis</li>
        <li><strong>Regaliz (Glycyrrhiza glabra):</strong> Protector de mucosas, efectivo contra úlceras pépticas</li>
        <li><strong>Boldo (Peumus boldus):</strong> Estimulante biliar, hepatoprotector, facilita la digestión</li>
        <li><strong>Alcachofa (Cynara scolymus):</strong> Depurativa hepática, reduce colesterol</li>
      </ul>
      
      <h4>🧠 Sistema Nervioso</h4>
      <ul>
        <li><strong>Valeriana (Valeriana officinalis):</strong> Sedante natural, mejora calidad del sueño</li>
        <li><strong>Pasiflora (Passiflora incarnata):</strong> Ansiolítica suave, no causa dependencia</li>
        <li><strong>Ginkgo (Ginkgo biloba):</strong> Mejora circulación cerebral, potencia memoria</li>
        <li><strong>Hierba de San Juan (Hypericum perforatum):</strong> Antidepresiva natural para depresión leve-moderada</li>
      </ul>
      
      <h4>💪 Sistema Inmunológico</h4>
      <ul>
        <li><strong>Equinácea (Echinacea purpurea):</strong> Inmunoestimulante, previene infecciones respiratorias</li>
        <li><strong>Astrágalo (Astragalus membranaceus):</strong> Adaptógeno inmunológico, aumenta resistencia</li>
        <li><strong>Uña de gato (Uncaria tomentosa):</strong> Inmunomoduladora, antiinflamatoria potente</li>
        <li><strong>Saúco (Sambucus nigra):</strong> Antiviral natural, rico en antocianinas</li>
      </ul>
      
      <h4>❤️ Sistema Cardiovascular</h4>
      <ul>
        <li><strong>Espino blanco (Crataegus monogyna):</strong> Cardiotónico, regula presión arterial</li>
        <li><strong>Ajo (Allium sativum):</strong> Anticoagulante natural, reduce colesterol</li>
        <li><strong>Olivo (Olea europaea):</strong> Hipotensor suave, antioxidante vascular</li>
        <li><strong>Ginkgo (Ginkgo biloba):</strong> Mejora circulación periférica</li>
      </ul>
      
      <h3>Formas de Preparación y Administración</h3>
      
      <h4>Extractos Fluidos</h4>
      <p>Concentrados hidroalcohólicos que preservan el espectro completo de principios activos. Ofrecen dosificación precisa y absorción rápida.</p>
      
      <h4>Extractos Secos Estandarizados</h4>
      <p>Formas concentradas que garantizan una cantidad específica de principios activos. Ideales para tratamientos de larga duración.</p>
      
      <h4>Infusiones y Decociones</h4>
      <p>Preparaciones tradicionales que mantienen la sinergia natural de la planta. Perfectas para tratamientos suaves y preventivos.</p>
      
      <h4>Tinturas Madre</h4>
      <p>Extracciones alcohólicas de plantas frescas que conservan la energía vital de la planta. Especialmente efectivas para condiciones agudas.</p>
      
      <h3>Protocolos de Tratamiento</h3>
      
      <h4>💊 Protocolo Anti-Estrés (4 semanas)</h4>
      <p><strong>Semana 1-2:</strong> Difusión de lavanda 20 min/día + baño con bergamota 2x/semana</p>
      <p><strong>Semana 3-4:</strong> Masaje semanal con mezcla personalizada + inhalación de emergencia</p>
      
      <h4>⚡ Mezcla Energizante Matutina</h4>
      <p><strong>Fórmula:</strong> Romero (35%) + Menta (25%) + Limón (25%) + Eucalipto (15%)</p>
      <p><strong>Efecto:</strong> Aumenta alerta mental, mejora concentración, energiza sin nerviosismo</p>
      
      <h4>🛡️ Mezcla Inmuno-Protectora</h4>
      <p><strong>Fórmula:</strong> Ravintsara (30%) + Árbol de Té (25%) + Tomillo (20%) + Limón (25%)</p>
      <p><strong>Efecto:</strong> Fortalece defensas, purifica ambiente, previene infecciones</p>
      
      <h3>Seguridad y Contraindicaciones</h3>
      <p>Aunque naturales, las plantas medicinales son potentes y requieren uso responsable:</p>
      
      <h4>Interacciones Medicamentosas Importantes:</h4>
      <ul>
        <li><strong>Hierba de San Juan:</strong> Puede reducir eficacia de anticonceptivos, anticoagulantes y algunos antidepresivos</li>
        <li><strong>Ginkgo:</strong> Potencia efectos anticoagulantes, precaución con warfarina</li>
        <li><strong>Regaliz:</strong> Puede elevar presión arterial en uso prolongado</li>
        <li><strong>Ajo:</strong> Aumenta riesgo de sangrado con anticoagulantes</li>
      </ul>
      
      <h3>Integración con Medicina Convencional</h3>
      <p>Nuestra fitoterapia se diseña como complemento inteligente a la medicina convencional. Trabajamos en colaboración con tu médico para optimizar resultados y minimizar riesgos.</p>
      
      <p>La fitoterapia moderna representa una síntesis perfecta entre tradición y ciencia, ofreciendo alternativas naturales respaldadas por investigación rigurosa para tu bienestar integral.</p>
    `,
    imageUrl: '/images/og-image.jpg',
    duration: 60,
    price: 60.0,
    category: 'Terapia',
    benefits: [
      'Tratamientos naturales personalizados',
      'Mínimos efectos secundarios',
      'Apoyo integral a la salud',
      'Sinergia de compuestos activos',
      'Fortalecimiento del terreno biológico',
    ],
    contraindications: [
      'Embarazo y lactancia (según planta específica)',
      'Alergias conocidas a plantas específicas',
      'Interacciones con medicamentos anticoagulantes',
      'Trastornos hepáticos graves (para ciertas plantas)',
    ],
    whatToExpect:
      'En tu consulta, realizaremos una evaluación detallada de tu estado de salud, historial médico y objetivos terapéuticos. Recibirás un protocolo personalizado con plantas específicas, dosificaciones precisas y seguimiento para optimizar resultados.',
    preparation:
      'Trae tu historial médico completo, lista de medicamentos actuales y suplementos. Si tienes análisis de sangre recientes, tráelos también. Evita alcohol 24 horas antes de la consulta para una evaluación más precisa.',
  },
  {
    id: 'aromaterapia',
    title: 'Aromaterapia',
    slug: 'aromaterapia',
    description:
      'Terapia natural que utiliza aceites esenciales puros para equilibrar cuerpo, mente y espíritu. Cada aroma tiene propiedades terapéuticas específicas respaldadas por neurociencia y medicina tradicional.',
    detailedContent: `
      <h2>La Ciencia del Olfato y la Curación</h2>
      <p>La aromaterapia aprovecha la conexión directa entre el sistema olfativo y el cerebro límbico, donde se procesan emociones y memoria. Los aceites esenciales son compuestos volátiles extraídos de plantas que contienen la esencia aromática y propiedades terapéuticas concentradas.</p>
      
      <h3>Neurociencia de los Aromas</h3>
      <p>Cuando inhalamos un aceite esencial, las moléculas aromáticas viajan directamente al sistema límbico en menos de 3 segundos, desencadenando respuestas inmediatas a nivel:</p>
      
      <h4>🧠 Neurológico</h4>
      <ul>
        <li>Liberación de neurotransmisores (serotonina, dopamina, noradrenalina)</li>
        <li>Modulación de la actividad del hipotálamo</li>
        <li>Regulación del sistema nervioso autónomo</li>
        <li>Influencia en patrones de ondas cerebrales</li>
      </ul>
      
      <h4>🫁 Respiratorio</h4>
      <ul>
        <li>Broncodilatación natural</li>
        <li>Acción expectorante y mucolítica</li>
        <li>Propiedades antimicrobianas en vías respiratorias</li>
        <li>Descongestión de mucosas</li>
      </ul>
      
      <h4>💧 Sistémico</h4>
      <ul>
        <li>Absorción transdérmica durante masajes</li>
        <li>Circulación sistémica y distribución en tejidos</li>
        <li>Modulación de respuesta inmunológica</li>
        <li>Efectos hormonales sutiles</li>
      </ul>
      
      <h3>Métodos de Aplicación Terapéutica</h3>
      
      <h4> diffuser_with_steam Difusión Ambiental</h4>
      <p>Utilizamos difusores ultrasónicos que preservan las propiedades moleculares de los aceites mientras crean atmósferas terapéuticas específicas.</p>
      
      <h4> massage_person Masaje Aromático</h4>
      <p>Combinamos aceites esenciales con aceites portadores para tratamientos que integran beneficios táctiles y aromáticos.</p>
      
      <h4> bathtub Baños Aromáticos</h4>
      <p>Inmersión terapéutica que permite absorción transdérmica mientras se inhalan los vapores curativos.</p>
      
      <h4> woman_getting_massage Inhalación Directa</h4>
      <p>Técnicas de respiración consciente con aceites específicos para efectos inmediatos sobre estado mental y emocional.</p>
      
      <h3>Aceites Esenciales y Sus Aplicaciones</h3>
      
      <h4>🌸 Para el Sistema Nervioso</h4>
      <ul>
        <li><strong>Lavanda (Lavandula angustifolia):</strong> El "botiquín en una botella". Reduce cortisol, mejora calidad del sueño, alivia ansiedad. Componente principal: linalol (40-50%)</li>
        <li><strong>Bergamota (Citrus bergamia):</strong> Antidepresivo natural, reduce estrés sin sedación. Rico en limoneno y acetato de linalilo</li>
        <li><strong>Manzanilla Romana (Anthemis nobilis):</strong> Calmante profundo, ideal para niños y personas sensibles. Contiene ésteres relajantes únicos</li>
        <li><strong>Ylang Ylang (Cananga odorata):</strong> Regula frecuencia cardíaca, reduce hipertensión por estrés</li>
      </ul>
      
      <h4>🔥 Para Energía y Concentración</h4>
      <ul>
        <li><strong>Romero (Rosmarinus officinalis):</strong> Mejora memoria y concentración. El cineol estimula circulación cerebral</li>
        <li><strong>Menta (Mentha piperita):</strong> Estimulante mental, mejora alerta. El mentol activa receptores de frío</li>
        <li><strong>Limón (Citrus limon):</strong> Claridad mental, humor positivo. El limoneno es neuroprotector</li>
        <li><strong>Eucalipto (Eucalyptus globulus):</strong> Despeja mente y vías respiratorias</li>
      </ul>
      
      <h4>🌳 Para Sistema Respiratorio</h4>
      <ul>
        <li><strong>Árbol de Té (Melaleuca alternifolia):</strong> Antimicrobiano potente, ideal para infecciones</li>
        <li><strong>Ravintsara (Cinnamomum camphora):</strong> Antiviral excepcional, fortalece inmunidad</li>
        <li><strong>Pino Silvestre (Pinus sylvestris):</strong> Expectorante, purifica ambiente</li>
        <li><strong>Tomillo (Thymus vulgaris):</strong> Antiséptico pulmonar, combate infecciones bacterianas</li>
      </ul>
      
      <h4>💪 Para Dolor y Inflamación</h4>
      <ul>
        <li><strong>Gaulteria (Gaultheria procumbens):</strong> 99% salicilato de metilo, analgésico natural</li>
        <li><strong>Enebro (Juniperus communis):</strong> Antiinflamatorio, depurativo, alivia artritis</li>
        <li><strong>Manzanilla Alemana (Matricaria chamomilla):</strong> Antiinflamatoria por camazuleno</li>
        <li><strong>Incienso (Boswellia carterii):</strong> Regenerador celular, antiinflamatorio profundo</li>
      </ul>
      
      <h3>Sinergias Aromáticas Terapéuticas</h3>
      
      <h4>🌙 Mezcla Relajante Nocturna</h4>
      <p><strong>Fórmula:</strong> Lavanda (40%) + Manzanilla Romana (30%) + Bergamota (20%) + Sándalo (10%)</p>
      <p><strong>Efecto:</strong> Reduce tiempo para conciliar sueño, mejora sueño profundo, disminuye despertares nocturnos</p>
      
      <h4>⚡ Mezcla Energizante Matutina</h4>
      <p><strong>Fórmula:</strong> Romero (35%) + Menta (25%) + Limón (25%) + Eucalipto (15%)</p>
      <p><strong>Efecto:</strong> Aumenta alerta mental, mejora concentración, energiza sin nerviosismo</p>
      
      <h4>🛡️ Mezcla Inmuno-Protectora</h4>
      <p><strong>Fórmula:</strong> Ravintsara (30%) + Árbol de Té (25%) + Tomillo (20%) + Limón (25%)</p>
      <p><strong>Efecto:</strong> Fortalece defensas, purifica ambiente, previene infecciones</p>
      
      <h3>Protocolos de Tratamiento</h3>
      
      <h4>🧘 Protocolo Anti-Estrés (4 semanas)</h4>
      <p><strong>Semana 1-2:</strong> Difusión de lavanda 20 min/día + baño con bergamota 2x/semana</p>
      <p><strong>Semana 3-4:</strong> Masaje semanal con mezcla personalizada + inhalación de emergencia</p>
      
      <h4>🧠 Protocolo Concentración (6 semanas)</h4>
      <p><strong>Mañanas:</strong> Difusión energizante durante 30 min en espacio de trabajo</p>
      <p><strong>Tardes:</strong> Inhalación directa de romero antes de tareas complejas</p>
      
      <h4>😴 Protocolo Sueño Reparador (8 semanas)</h4>
      <p><strong>Rutina nocturna:</strong> Difusión 1 hora antes de dormir + aplicación tópica en muñecas</p>
      <p><strong>Optimización:</strong> Ajuste de mezclas según respuesta individual</p>
      
      <h3>Calidad y Pureza de Aceites</h3>
      
      <h4>Criterios de Selección</h4>
      <ul>
        <li><strong>Origen botánico certificado:</strong> Especie, quimiotipo, parte de planta</li>
        <li><strong>Método de extracción:</strong> Destilación vapor, expresión en frío, CO2 supercrítico</li>
        <li><strong>Análisis cromatográfico:</strong> Verificación de componentes moleculares</li>
        <li><strong>Pureza garantizada:</strong> Sin diluyentes, sintéticos o adulterantes</li>
      </ul>
      
      <h4>Almacenamiento Óptimo</h4>
      <ul>
        <li>Frascos de vidrio ámbar para protección UV</li>
        <li>Temperatura fresca y estable (15-20°C)</li>
        <li>Etiquetado con fecha de apertura</li>
        <li>Inventario rotativo para máxima frescura</li>
      </ul>
      
      <h3>Precauciones y Contraindicaciones</h3>
      
      <h4>⚠️ Embarazo y Lactancia</h4>
      <p>Evitar aceites emenagogos (salvia, ruda), neurotóxicos (alcanfor, tuya) y hormonalmente activos (hinojo, anís).</p>
      
      <h4>👶 Uso Pediátrico</h4>
      <p>Diluciones específicas según edad. Evitar mentol en menores de 3 años. Preferir aceites suaves como lavanda y manzanilla.</p>
      
      <h4>☀️ Fotosensibilización</h4>
      <p>Cítricos (bergamota, limón, lima) pueden causar manchas con exposición solar. No aplicar 12 horas antes de sol directo.</p>
      
      <h3>Integración con Otras Terapias</h3>
      <p>La aromaterapia potencia significativamente otros tratamientos:</p>
      <ul>
        <li><strong>Con masaje:</strong> Relajación muscular profunda</li>
        <li><strong>Con meditación:</strong> Estados alterados de conciencia</li>
        <li><strong>Con psicoterapia:</strong> Acceso a memorias emocionales</li>
        <li><strong>Con fitoterapia:</strong> Sinergia de principios activos</li>
      </ul>
      
      <p>La aromaterapia moderna combina arte olfativo milenario con neurociencia contemporánea, ofreciendo herramientas precisas para el bienestar integral a través del poder transformador de los aromas naturales.</p>
    `,
    imageUrl: '/images/og-image.jpg',
    duration: 60,
    price: 65.0,
    category: 'Terapia',
    benefits: [
      'Equilibrio emocional inmediato',
      'Mejora calidad del sueño',
      'Reducción del estrés y ansiedad',
      'Fortalecimiento del sistema inmune',
      'Claridad mental y concentración',
    ],
    contraindications: [
      'Embarazo (aceites específicos)',
      'Epilepsia (evitar alcanfor, romero)',
      'Asma severo (precaución con inhalaciones)',
      'Alergias conocidas a plantas específicas',
    ],
    whatToExpect:
      'Durante la sesión, seleccionaremos aceites específicos según tu estado emocional y objetivos terapéuticos. Experimentarás relajación profunda mientras los aromas actúan sobre tu sistema nervioso. Recibirás mezclas personalizadas para uso doméstico.',
    preparation:
      'Evita perfumes o productos aromáticos fuertes el día de la sesión. Informa sobre alergias, asma o sensibilidades. Ven con ropa cómoda y mente abierta para experimentar el poder transformador de los aromas naturales.',
  },
  {
    id: 'reflexologia-podal',
    title: 'Reflexología Podal',
    slug: 'reflexologia-podal',
    description:
      'Técnica terapéutica milenaria que estimula puntos reflejos específicos en los pies para promover la autocuración del organismo. Cada zona del pie corresponde a órganos y sistemas corporales específicos.',
    detailedContent: `
      <h2>Los Pies: Espejo de Todo el Cuerpo</h2>
      <p>La reflexología podal se basa en el principio de que los pies contienen un mapa completo del cuerpo humano. Cada zona, punto y área refleja específicamente órganos, glándulas y sistemas corporales. A través de técnicas de presión precisas, estimulamos estos puntos para activar los mecanismos naturales de autocuración.</p>
      
      <h3>Fundamentos Científicos</h3>
      <p>La reflexología actúa sobre múltiples sistemas simultáneamente:</p>
      
      <h4>🧠 Sistema Nervioso</h4>
      <ul>
        <li><strong>Teoría del Portal de Control:</strong> La estimulación táctil bloquea señales de dolor según el mecanismo descrito por Melzack y Wall</li>
        <li><strong>Liberación de Endorfinas:</strong> La presión específica estimula la producción de neurotransmisores naturales del bienestar</li>
        <li><strong>Activación Parasimpática:</strong> Induce respuesta de relajación que facilita procesos de regeneración</li>
        <li><strong>Neuroplasticidad:</strong> Estimula nuevas conexiones neurales a través del tacto terapéutico</li>
      </ul>
      
      <h4>💧 Sistema Circulatorio</h4>
      <ul>
        <li>Mejora circulación sanguínea y linfática</li>
        <li>Reduce edemas y retención de líquidos</li>
        <li>Optimiza oxigenación celular</li>
        <li>Facilita eliminación de toxinas</li>
      </ul>
      
      <h4>⚡ Sistema Energético</h4>
      <ul>
        <li>Equilibra flujo de energía vital (Qi/Prana)</li>
        <li>Desbloquea meridianos energéticos</li>
        <li>Restaura homeostasis natural</li>
        <li>Armoniza polaridades corporales</li>
      </ul>
      
      <h3>Mapas Reflejos Detallados</h3>
      
      <h4>🦶 Pie Derecho - Lado Derecho del Cuerpo</h4>
      
      <h5>🧠 Zona de la Cabeza (Dedos del Pie)</h5>
      <ul>
        <li><strong>Dedo Gordo:</strong> Cerebro, hipófisis, pineal, nervios craneales</li>
        <li><strong>Segundo Dedo:</strong> Ojos, músculos oculares, nervio óptico</li>
        <li><strong>Tercer Dedo:</strong> Oídos, equilibrio, tímpanos</li>
        <li><strong>Cuarto Dedo:</strong> Senos paranasales, trompa de Eustaquio</li>
        <li><strong>Quinto Dedo:</strong> Oído externo, hombros, cuello</li>
      </ul>
      
      <h5>🫁 Zona Torácica (Metatarsos)</h5>
      <ul>
        <li><strong>Base dedos:</strong> Tiroides, paratiroides, bronquios</li>
        <li><strong>Zona central:</strong> Pulmones, corazón, timo</li>
        <li><strong>Arco plantar:</strong> Diafragma, plexo solar</li>
        <li><strong>Borde externo:</strong> Brazo, hombro, costillas</li>
      </ul>
      
      <h5> abdomen Zona Abdominal (Arco Medio)</h5>
      <ul>
        <li><strong>Borde interno:</strong> Columna vertebral, médula espinal</li>
        <li><strong>Centro:</strong> Estómago, páncreas, duodeno</li>
        <li><strong>Zona lateral:</strong> Hígado, vesícula biliar (pie derecho)</li>
        <li><strong>Área superior:</strong> Glándulas suprarrenales</li>
      </ul>
      
      <h5>🍑 Zona Pélvica (Talón)</h5>
      <ul>
        <li><strong>Talón interno:</strong> Útero, próstata, vejiga</li>
        <li><strong>Talón externo:</strong> Ovarios, testículos</li>
        <li><strong>Tobillo:</strong> Órganos reproductivos, pelvis</li>
        <li><strong>Tendón Aquiles:</strong> Coxis, recto</li>
      </ul>
      
      <h4>🦶 Pie Izquierdo - Lado Izquierdo del Cuerpo</h4>
      
      <h5>Especialidades del Pie Izquierdo:</h5>
      <ul>
        <li><strong>Corazón:</strong> Zona específica en metatarso izquierdo</li>
        <li><strong>Bazo:</strong> Área exclusiva del pie izquierdo</li>
        <li><strong>Páncreas:</strong> Distribución principalmente izquierda</li>
        <li><strong>Colon descendente:</strong> Reflejo específico lateral</li>
      </ul>
      
      <h3>Técnicas de Estimulación</h3>
      
      <h4>✍️ Técnica del Pulgar</h4>
      <p><strong>Aplicación:</strong> Presión firme y constante con la yema del pulgar</p>
      <p><strong>Movimiento:</strong> Pequeños círculos en sentido horario</p>
      <p><strong>Intensidad:</strong> 3-7 en escala de 10, según tolerancia</p>
      <p><strong>Duración:</strong> 30-60 segundos por punto específico</p>
      
      <h4>🤏 Técnica de Pellizco</h4>
      <p><strong>Aplicación:</strong> Para zonas reflejas de nervios y glándulas</p>
      <p><strong>Ejecución:</strong> Pellizcos suaves y rítmicos</p>
      <p><strong>Objetivo:</strong> Estimular circulación en áreas específicas</p>
      
      <h4>👋 Técnica de Amasamiento</h4>
      <p><strong>Aplicación:</strong> Para relajación general del pie</p>
      <p><strong>Movimiento:</strong> Compresión y liberación rítmica</p>
      <p><strong>Beneficio:</strong> Prepara el pie para trabajo específico</p>
      
      <h4>🔄 Técnica Rotatoria</h4>
      <p><strong>Aplicación:</strong> Para articulaciones y zonas de transición</p>
      <p><strong>Ejecución:</strong> Movimientos circulares amplios</p>
      <p><strong>Efecto:</strong> Mejora movilidad y circulación</p>
      
      <h3>Protocolos Terapéuticos Específicos</h3>
      
      <h4>💖 Protocolo Anti-Estrés e Insomnio</h4>
      <p><strong>Duración:</strong> 45-60 minutos</p>
      <p><strong>Secuencia:</strong></p>
      <ul>
        <li>Relajación general (10 min): Masaje completo para preparar</li>
        <li>Sistema nervioso (15 min): Dedo gordo, zona cerebral, plexo solar</li>
        <li>Glóndulas endocrinas (10 min): Hipófisis, tiroides, suprarrenales</li>
        <li>Sistema digestivo (10 min): Estómago, intestinos para serotonina</li>
        <li>Finalización (10 min): Técnicas de integración y equilibrio</li>
      </ul>
      
      <h4>🫁 Protocolo Respiratorio</h4>
      <p><strong>Indicado para:</strong> Asma, bronquitis, alergias respiratorias</p>
      <p><strong>Secuencia:</strong></p>
      <ul>
        <li>Apertura diafragmática (10 min): Arco plantar, costillas</li>
        <li>Pulmones (15 min): Zona metatarsal, bronquios</li>
        <li>Senos paranasales (10 min): Dedos del pie</li>
        <li>Linfático (10 min): Drenaje para reducir inflamación</li>
      </ul>
      
      <h4>🦴 Protocolo Musculoesquelético</h4>
      <p><strong>Para:</strong> Dolores articulares, tensiones musculares</p>
      <p><strong>Enfoque:</strong></p>
      <ul>
        <li>Columna vertebral (15 min): Borde interno completo</li>
        <li>Articulaciones específicas (10 min): Según área afectada</li>
        <li>Sistema circulatorio (10 min): Para reducir inflamación</li>
        <li>Nervios (10 min): Alivio del dolor neurálgico</li>
      </ul>
      
      <h4>❤️ Protocolo Cardiovascular</h4>
      <p><strong>Objetivos:</strong> Mejorar circulación, regular presión arterial</p>
      <p><strong>Puntos clave:</strong></p>
      <ul>
        <li>Corazón (pie izquierdo): Estimulación suave y rítmica</li>
        <li>Sistema circulatorio: Trabajo ascendente desde pies</li>
        <li>Riñones: Para regulación de presión arterial</li>
        <li>Suprarrenales: Para manejo del estrés cardiovascular</li>
      </ul>
      
      <h3>Respuestas Terapéuticas</h3>
      
      <h4>🔍 Interpretación de Sensaciones</h4>
      <ul>
        <li><strong>Dolor agudo:</strong> Posible congestión en órgano correspondiente</li>
        <li><strong>Sensibilidad extrema:</strong> Inflamación o irritación activa</li>
        <li><strong>Entumecimiento:</strong> Circulación deficiente o bloqueo energético</li>
        <li><strong>Calor:</strong> Proceso de activación y desintoxicación</li>
        <li><strong>Relajación profunda:</strong> Respuesta parasimpática óptima</li>
      </ul>
      
      <h4>📈 Progreso Terapéutico</h4>
      <p><strong>Sesión 1-3:</strong> Evaluación y desintoxicación inicial</p>
      <p><strong>Sesión 4-8:</strong> Equilibrio y fortalecimiento de sistemas</p>
      <p><strong>Sesión 9+:</strong> Mantenimiento y prevención</p>
      
      <h3>Beneficios Específicos por Sistema</h3>
      
      <h4>🧠 Sistema Nervioso</h4>
      <ul>
        <li>Reducción 40-60% en niveles de cortisol</li>
        <li>Mejora calidad del sueño en 80% de casos</li>
        <li>Disminución de ansiedad y depresión leve</li>
        <li>Aumento de concentración y claridad mental</li>
      </ul>
      
      <h4>💧 Sistema Circulatorio</h4>
      <ul>
        <li>Mejora de 20-30% en circulación periférica</li>
        <li>Reducción de edemas en extremidades</li>
        <li>Normalización gradual de presión arterial</li>
        <li>Optimización del retorno venoso</li>
      </ul>
      
      <h4>💪 Sistema Inmunológico</h4>
      <ul>
        <li>Fortalecimiento de defensas naturales</li>
        <li>Reducción de infecciones recurrentes</li>
        <li>Mejora de respuesta a vacunas</li>
        <li>Aceleración de procesos de curación</li>
      </ul>
      
      <h3>Contraindicaciones y Precauciones</h3>
      
      <h4>⚠️ Contraindicaciones Absolutas</h4>
      <ul>
        <li>Trombosis venosa profunda activa</li>
        <li>Infecciones severas del pie</li>
        <li>Fracturas no consolidadas en pie</li>
        <li>Embarazo de alto riesgo (primer trimestre)</li>
      </ul>
      
      <h4>⚡ Precauciones Especiales</h4>
      <ul>
        <li><strong>Diabetes:</strong> Presión suave, monitoreo de sensibilidad</li>
        <li><strong>Osteoporosis:</strong> Técnicas adaptadas, presión reducida</li>
        <li><strong>Medicaciín:</strong> Posible modificación de efectos</li>
        <li><strong>Embarazo:</strong> Evitar puntos que estimulen contracciones</li>
      </ul>
      
      <h3>Investigación y Evidencia Científica</h3>
      
      <h4>📚 Estudios Clínicos</h4>
      <ul>
        <li><strong>Cefaleas tensionales:</strong> 85% mejora significativa (Journal of Bodywork)</li>
        <li><strong>Fibromialgia:</strong> Reducción 40% en intensidad del dolor</li>
        <li><strong>Autismo infantil:</strong> Mejoras en comunicación y comportamiento</li>
        <li><strong>Depresión post-parto:</strong> Reducción significativa de síntomas</li>
      </ul>
      
      <h4>⚙️ Mecanismos Validados</h4>
      <ul>
        <li>Modulación del tono vagal</li>
        <li>Regulación del eje hipotálamo-hipófisis-suprarrenal</li>
        <li>Optimización de la circulación del LCR</li>
        <li>Liberación de endorfinas y neurotransmisores</li>
      </ul>
      
      <h3>Integración Holística</h3>
      <p>La terapia cráneosacral se integra perfectamente con:</p>
      <ul>
        <li><strong>Osteopatía:</strong> Complemento estructural</li>
        <li><strong>Acupuntura:</strong> Sinergia energética</li>
        <li><strong>Psicoterapia:</strong> Liberación somática de traumas</li>
        <li><strong>Medicina convencional:</strong> Apoyo neurológico sin interferencias</li>
      </ul>
      
      <p>La terapia cráneosacral representa un arte refinado de escucha corporal que honra la sabiduría innata del organismo, facilitando profundos procesos de autocuración a través del tacto consciente y la presencia terapéutica.</p>
    `,
    imageUrl: '/images/og-image.jpg',
    duration: 90,
    price: 75.0,
    category: 'Terapia Manual',
    benefits: [
      'Liberación profunda de tensiones cráneo-cervicales',
      'Mejora significativa de cefaleas y migrañas',
      'Equilibrio del sistema nervioso autónomo',
      'Reducción del estrés y ansiedad',
      'Optimización de la función neurológica',
    ],
    contraindications: [
      'Fractura craneal reciente',
      'Aneurisma cerebral agudo',
      'Hemorragia intracraneal',
      'Herniación cerebral aguda',
    ],
    whatToExpect:
      'Durante la sesión, permanecerás vestido mientras aplico un toque extremadamente suave en cabeza, cuello y sacro. Puedes experimentar sensaciones de calor, relajación profunda, o movimientos sutiles. Muchas personas entran en estados meditativos profundos.',
    preparation:
      'Usa ropa cómoda y holgada. Evita alcohol y estimulantes 24 horas antes. Informa sobre medicación neurológica, trauma craneal previo o cirugías. Ven con mente abierta para experimentar sutilezas terapéuticas profundas.',
  },
  {
    id: 'quiromasaje',
    title: 'Quiromasaje',
    slug: 'quiromasaje',
    description:
      'Arte del masaje terapéutico que combina técnicas manuales especializadas para tratar contracturas, tensiones musculares y desequilibrios posturales, restaurando la armonía funcional del sistema musculoesquelético.',
    detailedContent: `
      <h2>El Arte del Masaje Terapéutico</h2>
      <p>El quiromasaje es una disciplina terapéutica que utiliza las manos como herramientas de diagnóstico y tratamiento. Combina técnicas de masaje clásico, osteopatía suave y manipulaciones articulares para abordar de manera integral las disfunciones del aparato locomotor.</p>
      
      <h3>Fundamentos Científicos</h3>
      
      <h4>⚙️ Efectos Fisiológicos del Masaje</h4>
      
      <h5>Sistema Circulatorio</h5>
      <ul>
        <li><strong>Vasodilatación:</strong> Aumento del flujo sanguíneo local hasta 300%</li>
        <li><strong>Drenaje venoso:</strong> Mejora del retorno venoso y linfático</li>
        <li><strong>Oxigenación tisular:</strong> Mayor aporte de nutrientes a los músculos</li>
        <li><strong>Eliminación de toxinas:</strong> Aceleración del metabolismo celular</li>
      </ul>
      
      <h5>Sistema Muscular</h5>
      <ul>
        <li><strong>Relajación de fibras:</strong> Liberación de contracturas y nudos</li>
        <li><strong>Elasticidad:</strong> Restauración de la flexibilidad muscular</li>
        <li><strong>Tono muscular:</strong> Equilibrio entre músculos agonistas y antagonistas</li>
        <li><strong>Prevención de lesiones:</strong> Mantenimiento de la salud muscular</li>
      </ul>
      
      <h5>Sistema Nervioso</h5>
      <ul>
        <li><strong>Reducción del dolor:</strong> Activación de mecanismos antinociceptivos</li>
        <li><strong>Relajación:</strong> Estimulación del sistema parasimpático</li>
        <li><strong>Liberación de endorfinas:</strong> Analgesia natural</li>
        <li><strong>Mejora propioceptiva:</strong> Mayor conciencia corporal</li>
      </ul>
      
      <h3>Técnicas Fundamentales</h3>
      
      <h4>✍️ Effleurage (Pases Largos)</h4>
      <p><strong>Descripción:</strong> Movimientos deslizantes, suaves y rítmicos con palma completa</p>
      <p><strong>Objetivos:</strong></p>
      <ul>
        <li>Calentamiento inicial de tejidos</li>
        <li>Evaluación de tensiones y restricciones</li>
        <li>Estimulación de circulación superficial</li>
        <li>Relajación general del paciente</li>
      </ul>
      
      <h4>🤏 Pétrissage (Amasamiento)</h4>
      <p><strong>Descripción:</strong> Compresión, levantamiento y rodamiento de tejidos blandos</p>
      <p><strong>Modalidades:</strong></p>
      <ul>
        <li><strong>Amasamiento simple:</strong> Con palmas, ideal para músculos grandes</li>
        <li><strong>Amasamiento digital:</strong> Con dedos, para áreas específicas</li>
        <li><strong>Rodamiento:</strong> Levantamiento en onda de tejido subcutáneo</li>
        <li><strong>Presión deslizada:</strong> Compresión profunda con movimiento</li>
      </ul>
      
      <h4>⚡ Fricción</h4>
      <p><strong>Concepto:</strong> Movimientos circulares profundos sin deslizamiento sobre la piel</p>
      <p><strong>Aplicaciones:</strong></p>
      <ul>
        <li><strong>Fricción circular:</strong> Para puntos gatillo específicos</li>
        <li><strong>Fricción transversa:</strong> Perpendicular a fibras musculares</li>
        <li><strong>Fricción profunda:</strong> Para adherencias y cicatrices</li>
      </ul>
      
      <h4>👋 Percusión (Tapotement)</h4>
      <p><strong>Técnicas:</strong></p>
      <ul>
        <li><strong>Palmoteo:</strong> Con palmas cóncavas, estimulante suave</li>
        <li><strong>Cachetes:</strong> Con bordes cubitales, tonificante</li>
        <li><strong>Puños:</strong> Con dorso de puños, estimulación profunda</li>
        <li><strong>Picoteo:</strong> Con yemas de dedos, estimulación nerviosa</li>
      </ul>
      
      <h3>Especialidades Terapéuticas</h3>
      
      <h4>🛠️ Quiromasaje Descontracturante</h4>
      <p><strong>Protocolo Específico:</strong></p>
      <ol>
        <li><strong>Evaluación postural (5 min):</strong> Identificación de patrones tensionales</li>
        <li><strong>Calentamiento global (10 min):</strong> Effleurage y amasamiento superficial</li>
        <li><strong>Trabajo específico (30 min):</strong> Fricción profunda en contracturas</li>
        <li><strong>Liberación miofascial (10 min):</strong> Técnicas de estiramiento pasivo</li>
        <li><strong>Integración (5 min):</strong> Movimientos suaves de finalización</li>
      </ol>
      
      <h4>🏃 Masaje Deportivo</h4>
      <p><strong>Pre-competición:</strong> Activación neuromuscular, calentamiento</p>
      <p><strong>Post-esfuerzo:</strong> Recuperación, eliminación de ácido láctico</p>
      <p><strong>Mantenimiento:</strong> Prevención de lesiones, optimización del rendimiento</p>
      
      <h4>😴 Masaje de Relajación</h4>
      <p><strong>Características:</strong></p>
      <ul>
        <li>Ritmo lento y constante</li>
        <li>Presión suave a moderada</li>
        <li>Movimientos envolventes y continuos</li>
        <li>Ambiente tranquilo con aromaterapia</li>
      </ul>
      
      <h3>Puntos Gatillo Principales</h3>
      
      <h4>Región Cervical</h4>
      <ul>
        <li><strong>Trapecio superior:</strong> Cefaleas, dolor cervical</li>
        <li><strong>Suboccipitales:</strong> Cefaleas tensionales</li>
        <li><strong>Escalenos:</strong> Dolor irradiado al brazo</li>
        <li><strong>Esternocleidomastoideo:</strong> Mareos, dolor temporal</li>
      </ul>
      
      <h4>Región Lumbar</h4>
      <ul>
        <li><strong>Cuadrado lumbar:</strong> Dolor lumbar bajo</li>
        <li><strong>Psoas:</strong> Dolor lumbar anterior</li>
        <li><strong>Glúteo medio:</strong> Dolor pseudociático</li>
        <li><strong>Piriforme:</strong> Ciática verdadera</li>
      </ul>
      
      <h3>Beneficios Documentados</h3>
      <ul>
        <li><strong>Dolor lumbar:</strong> Reducción 50-70% en intensidad</li>
        <li><strong>Fibromialgia:</strong> Mejora significativa en calidad de vida</li>
        <li><strong>Estrés laboral:</strong> Reducción 40% en cortisol salival</li>
        <li><strong>Insomnio:</strong> Mejora 60% en calidad del sueño</li>
        <li><strong>Ansiedad:</strong> Reducción inmediata en escalas validadas</li>
      </ul>
      
      <h3>Aceites Terapéuticos</h3>
      <ul>
        <li><strong>Wintergreen:</strong> Analgésico, antiinflamatorio</li>
        <li><strong>Romero:</strong> Estimulante circulatorio</li>
        <li><strong>Lavanda:</strong> Relajante, cicatrizante</li>
        <li><strong>Eucalipto:</strong> Refrescante, descongestionante</li>
      </ul>
      
      <p>El quiromasaje representa una síntesis perfecta entre conocimiento anatómico, habilidad manual y sensibilidad terapéutica, ofreciendo un enfoque integral para la salud del sistema musculoesquelético.</p>
    `,
    imageUrl: '/images/og-image.jpg',
    duration: 60,
    price: 60.0,
    category: 'Masaje',
    benefits: [
      'Liberación profunda de contracturas musculares',
      'Mejora significativa de la circulación',
      'Reducción del dolor y la tensión',
      'Relajación del sistema nervioso',
      'Prevención de lesiones deportivas',
    ],
    contraindications: [
      'Fiebre o procesos infecciosos',
      'Tromboflebitis activa',
      'Fracturas no consolidadas',
      'Lesiones cutáneas graves',
    ],
    whatToExpect:
      'Durante la sesión, aplicaré diferentes técnicas manuales adaptadas a tus necesidades específicas. Sentirás una presión variable que puede generar algunas molestias en zonas tensas, seguidas de alivio y relajación. Es normal experimentar somnolencia post-tratamiento.',
    preparation:
      'Ven con ropa interior cómoda o ropa deportiva. Evita comidas pesadas 2 horas antes. Informa sobre lesiones previas, medicación anticoagulante o condiciones médicas. Hidrátate bien antes y después de la sesión.',
  },
  {
    id: 'reiki',
    title: 'Reiki',
    slug: 'reiki',
    description:
      'Ancestral arte de sanación energética japonés que canaliza la energía vital universal a través de la imposición de manos, promoviendo la autocuración, el equilibrio de chakras y la armonización integral del ser.',
    detailedContent: `
      <h2>La Sabiduría Ancestral del Reiki</h2>
      <p>El Reiki (éœŠæ°—) es un sistema de sanación energética que significa "energía espiritual" o "energía vital universal". Desarrollado por el Dr. Mikao Usui en Japón en 1922, combina técnicas meditativas, imposición de manos y canalización de energía para promover la autocuración y el equilibrio integral.</p>
      
      <h3>Los Cinco Principios del Reiki</h3>
      <p>La filosofía del Reiki se fundamenta en cinco principios que guían tanto la práctica como la vida cotidiana:</p>
      
      <h4>🌳 Solo por hoy, no te enfades</h4>
      <p>La ira bloquea el flujo de energía vital. Cultivamos la paciencia y la comprensión como caminos hacia la sanación emocional.</p>
      
      <h4>🙏 Solo por hoy, no te preocupes</h4>
      <p>La preocupación excesiva agota la energía. Desarrollamos confianza en el proceso natural de la vida y en nuestra capacidad de adaptación.</p>
      
      <h4>✨ Solo por hoy, sé agradecido</h4>
      <p>La gratitud eleva nuestra vibración energética y atrae experiencias positivas. Reconocemos las bendiciones presentes en cada momento.</p>
      
      <h4>💼 Solo por hoy, trabaja honestamente</h4>
      <p>El trabajo consciente y ético alimenta el alma. Ponemos intención y amor en todas nuestras acciones.</p>
      
      <h4>❤️ Solo por hoy, sé amable con todos los seres vivos</h4>
      <p>La compasión universal es la base de la sanación. Extendemos amor incondicional a nosotros mismos y a todos los seres.</p>
      
      <h3>Fundamentos Energéticos</h3>
      
      <h4>⚡ La Energía Vital Universal (Ki)</h4>
      <p>El Ki es la fuerza vital que anima toda la existencia. Similar al Prana (hinduismo), Chi (medicina china) o Pneuma (tradición griega), representa la inteligencia cósmica que mantiene y equilibra la vida.</p>
      
      <h5>Características del Ki:</h5>
      <ul>
        <li><strong>Inteligente:</strong> Se dirige automáticamente donde es más necesaria</li>
        <li><strong>Infinita:</strong> Fuente inagotable de energía cósmica</li>
        <li><strong>Sanadora:</strong> Restaura naturalmente el equilibrio y la armonía</li>
        <li><strong>Amorosa:</strong> Porta la cualidad del amor incondicional</li>
      </ul>
      
      <h4>🔄 Cómo Funciona la Canalización</h4>
      <p>El practicante de Reiki actúa como canal conductor, no como fuente de energía:</p>
      <ol>
        <li><strong>Conexión:</strong> Sintonización con la energía universal a través de meditación</li>
        <li><strong>Intención:</strong> Establecimiento de propósito sanador puro</li>
        <li><strong>Canalización:</strong> Flujo de energía a través de las manos del practicante</li>
        <li><strong>Recepción:</strong> El receptor absorbe la energía según sus necesidades</li>
        <li><strong>Equilibrio:</strong> La energía se distribuye automáticamente donde es requerida</li>
      </ol>
      
      <h3>Sistema de Chakras y Reiki</h3>
      
      <h4>🌈 Los Siete Chakras Principales</h4>
      
      <h5>1. Chakra Raíz (Muladhara) - Rojo</h5>
      <p><strong>Ubicación:</strong> Base de la columna</p>
      <p><strong>Función:</strong> Supervivencia, estabilidad, conexión tierra</p>
      <p><strong>Desequilibrios:</strong> Ansiedad, inseguridad, problemas económicos</p>
      <p><strong>Reiki:</strong> Grounding, seguridad, estabilización energética</p>
      
      <h5>2. Chakra Sacro (Svadhisthana) - Naranja</h5>
      <p><strong>Ubicación:</strong> Bajo vientre, órganos reproductivos</p>
      <p><strong>Función:</strong> Creatividad, sexualidad, emociones</p>
      <p><strong>Desequilibrios:</strong> Bloqueos creativos, problemas sexuales, dependencia emocional</p>
      <p><strong>Reiki:</strong> Liberación emocional, creatividad, placer sano</p>
      
      <h5>3. Chakra Plexo Solar (Manipura) - Amarillo</h5>
      <p><strong>Ubicación:</strong> Estómago, área digestiva</p>
      <p><strong>Función:</strong> Poder personal, autoestima, voluntad</p>
      <p><strong>Desequilibrios:</strong> Baja autoestima, problemas digestivos, control excesivo</p>
      <p><strong>Reiki:</strong> Empoderamiento personal, confianza, digestión</p>
      
      <h5>4. Chakra Corazón (Anahata) - Verde</h5>
      <p><strong>Ubicación:</strong> Centro del pecho, corazón</p>
      <p><strong>Función:</strong> Amor, compasión, conexión</p>
      <p><strong>Desequilibrios:</strong> Dificultades relacionales, dolor emocional, aislamiento</p>
      <p><strong>Reiki:</strong> Sanación emocional, amor incondicional, perdón</p>
      
      <h5>5. Chakra Garganta (Vishuddha) - Azul</h5>
      <p><strong>Ubicación:</strong> Garganta, tiroides</p>
      <p><strong>Función:</strong> Comunicación, expresión, verdad</p>
      <p><strong>Desequilibrios:</strong> Problemas de comunicación, timidez, mentiras</p>
      <p><strong>Reiki:</strong> Expresión auténtica, comunicación clara, creatividad verbal</p>
      
      <h5>6. Chakra Tercer Ojo (Ajna) - Índigo</h5>
      <p><strong>Ubicación:</strong> Entrecejo, glándula pineal</p>
      <p><strong>Función:</strong> Intuición, clarividencia, sabiduría</p>
      <p><strong>Desequilibrios:</strong> Confusión mental, falta de dirección, escepticismo extremo</p>
      <p><strong>Reiki:</strong> Claridad mental, intuición, visión espiritual</p>
      
      <h5>7. Chakra Corona (Sahasrara) - Violeta/Blanco</h5>
      <p><strong>Ubicación:</strong> Corona de la cabeza</p>
      <p><strong>Función:</strong> Conexión espiritual, iluminación, unidad</p>
      <p><strong>Desequilibrios:</strong> Desconexión espiritual, materialismo excesivo, ego</p>
      <p><strong>Reiki:</strong> Conexión divina, paz interior, trascendencia</p>
      
      <h3>Niveles de Formación en Reiki</h3>
      
      <h4>🌱 Primer Nivel (Shoden)</h4>
      <p><strong>Enfoque:</strong> Autosanación y tratamiento presencial</p>
      <p><strong>Capacidades:</strong></p>
      <ul>
        <li>Canalización básica de energía</li>
        <li>Autotratamiento diario</li>
        <li>Tratamiento a familiares y amigos</li>
        <li>Sanación de plantas y animales</li>
      </ul>
      <p><strong>Símbolos:</strong> Ninguno específico, conexión directa</p>
      
      <h4>🌿 Segundo Nivel (Okuden)</h4>
      <p><strong>Enfoque:</strong> Sanación emocional y a distancia</p>
      <p><strong>Capacidades:</strong></p>
      <ul>
        <li>Sanación emocional profunda</li>
        <li>Tratamiento a distancia</li>
        <li>Sanación del pasado y futuro</li>
        <li>Potenciación de la energía</li>
      </ul>
      <p><strong>Símbolos:</strong> Cho Ku Rei, Sei He Ki, Hon Sha Ze Sho Nen</p>
      
      <h4>🌳 Tercer Nivel (Shinpiden) - Maestría</h4>
      <p><strong>Enfoque:</strong> Realización espiritual y enseñanza</p>
      <p><strong>Capacidades:</strong></p>
      <ul>
        <li>Iniciación de otros estudiantes</li>
        <li>Sanación del maestro interior</li>
        <li>Conexión con guías espirituales</li>
        <li>Enseñanza y transmisión de linaje</li>
      </ul>
      <p><strong>Símbolos:</strong> Dai Ko Myo (símbolo maestro)</p>
      
      <h3>Técnicas de Tratamiento</h3>
      
      <h4>✍️ Posiciones de Manos Tradicionales</h4>
      
      <h5>Posiciones Frontales (30-45 min)</h5>
      <ol>
        <li><strong>Cabeza:</strong> Ojos, mejillas, corona, base cráneo (4 posiciones)</li>
        <li><strong>Torso:</strong> Garganta, corazón, plexo solar, abdomen (4 posiciones)</li>
        <li><strong>Piernas:</strong> Muslos, rodillas, pantorrillas, pies (4 posiciones)</li>
      </ol>
      
      <h5>Posiciones Posteriores (30-45 min)</h5>
      <ol>
        <li><strong>Cabeza y cuello:</strong> Occipucio, cervicales (2 posiciones)</li>
        <li><strong>Torso:</strong> Hombros, corazón posterior, riñones, sacro (4 posiciones)</li>
        <li><strong>Piernas:</strong> Glúteos, isquiotibiales, pantorrillas (3 posiciones)</li>
      </ol>
      
      <h4>✨ Técnicas Especializadas</h4>
      
      <h5>Byosen (Escaneado Energético)</h5>
      <p>Técnica de diagnóstico energético que detecta áreas de desequilibrio a través de sensaciones en las manos del practicante.</p>
      
      <h5>Reiji-Ho (Guía Intuitiva)</h5>
      <p>Permite que las manos se dirijan intuitivamente hacia las áreas que más necesitan sanación.</p>
      
      <h5>Nentatsu-Ho (Deprogramación Mental)</h5>
      <p>Técnica para liberar patrones mentales negativos y creencias limitantes.</p>
      
      <h5>Jakikiri Joka-Ho (Purificación Energética)</h5>
      <p>Limpieza de energías densas o negativas de objetos, espacios y personas.</p>
      
      <h3>Beneficios Terapéuticos Documentados</h3>
      
      <h4>📚 Evidencia Científica</h4>
      <ul>
        <li><strong>Ansiedad:</strong> Reducción significativa en escalas validadas (estudios controlados)</li>
        <li><strong>Dolor crónico:</strong> Disminución 25-40% en intensidad</li>
        <li><strong>Calidad de vida:</strong> Mejora notable en pacientes oncológicos</li>
        <li><strong>Presión arterial:</strong> Reducción en hipertensión leve</li>
        <li><strong>Sistema inmune:</strong> Fortalecimiento de defensas naturales</li>
      </ul>
      
      <h4>🏥 Aplicaciones Clínicas</h4>
      <ul>
        <li><strong>Hospitales:</strong> Complemento en cuidados paliativos</li>
        <li><strong>Oncología:</strong> Apoyo durante quimioterapia y radioterapia</li>
        <li><strong>Cirugía:</strong> Aceleración de recuperación post-operatoria</li>
        <li><strong>Salud mental:</strong> Apoyo en depresión y trastornos de ansiedad</li>
        <li><strong>Cuidados intensivos:</strong> Estabilización emocional de pacientes</li>
      </ul>
      
      <h3>Proceso de Sanación Energética</h3>
      
      <h4>🔄 Fases del Tratamiento</h4>
      
      <h5>Fase 1: Relajación (10-15 min)</h5>
      <p>Inducción del estado alfa cerebral, activación del sistema parasimpático, conexión con la energía universal.</p>
      
      <h5>Fase 2: Equilibrado (30-45 min)</h5>
      <p>Balanceo de chakras, liberación de bloqueos energéticos, armonización de campo áurico.</p>
      
      <h5>Fase 3: Integración (10-15 min)</h5>
      <p>Sellado energético, ancla de la nueva vibración, regreso gradual a la consciencia ordinaria.</p>
      
      <h4>🌟 Sensaciones Comunes Durante el Tratamiento</h4>
      <ul>
        <li><strong>Calor o frío:</strong> Movimiento de energía en áreas específicas</li>
        <li><strong>Hormigueo:</strong> Activación de centros energéticos</li>
        <li><strong>Colores o luces:</strong> Estimulación del tercer ojo</li>
        <li><strong>Emociones intensas:</strong> Liberación de bloqueos emocionales</li>
        <li><strong>Paz profunda:</strong> Conexión con el estado natural del ser</li>
      </ul>
      
      <h3>Reiki a Distancia</h3>
      
      <h4>🌌 Principios Cuánticos</h4>
      <p>La sanación a distancia se fundamenta en principios de física cuántica:</p>
      <ul>
        <li><strong>No-localidad:</strong> Conexión instantánea más allá del espacio-tiempo</li>
        <li><strong>Entrelazamiento:</strong> Vinculación energética entre sanador y receptor</li>
        <li><strong>Intención:</strong> El poder creador de la consciencia dirigida</li>
        <li><strong>Campo mórfico:</strong> Información compartida en el campo universal</li>
      </ul>
      
      <h4>⏱️ Protocolo de Sesión a Distancia</h4>
      <ol>
        <li><strong>Preparación:</strong> Meditación, conexión, establecimiento de intención</li>
        <li><strong>Invocación:</strong> Activación de símbolos sagrados</li>
        <li><strong>Conexión:</strong> Visualización y enlace energético</li>
        <li><strong>Tratamiento:</strong> Envío de energía durante 30-45 minutos</li>
        <li><strong>Cierre:</strong> Desconexión respetuosa y protección energética</li>
      </ol>
      
      <h3>Autocuidado del Practicante</h3>
      
      <h4>🛡️ Protección Energética</h4>
      <ul>
        <li><strong>Limpieza áurica:</strong> Técnicas de purificación personal</li>
        <li><strong>Escudos de luz:</strong> Visualizaciones protectoras</li>
        <li><strong>Cristales protectores:</strong> Cuarzo, amatista, turmalina negra</li>
        <li><strong>Plantas sagradas:</strong> Salvia, palo santo, copal</li>
      </ul>
      
      <h4>🧘 Prácticas Diarias</h4>
      <ul>
        <li><strong>Autotratamiento:</strong> 30 minutos diarios mínimo</li>
        <li><strong>Meditación Gassho:</strong> Conexión con la fuente</li>
        <li><strong>Recitación de principios:</strong> Alineación filosófica</li>
        <li><strong>Gratitud:</strong> Reconocimiento del don recibido</li>
      </ul>
      
      <h3>Integración con Otras Terapias</h3>
      <p>El Reiki es complementario y potencia otras modalidades:</p>
      <ul>
        <li><strong>Medicina convencional:</strong> Sin interferencias farmacológicas</li>
        <li><strong>Psicoterapia:</strong> Facilita procesamiento emocional</li>
        <li><strong>Masaje:</strong> Profundiza la relajación muscular</li>
        <li><strong>Acupuntura:</strong> Optimiza el flujo energético</li>
        <li><strong>Aromaterapia:</strong> Sinergia vibracional</li>
      </ul>
      
      <p>El Reiki trasciende las limitaciones de la sanación física para abrazar la totalidad del ser humano: cuerpo, mente, emociones y espíritu, ofreciendo un camino de transformación y despertar a través del amor universal.</p>
    `,
    imageUrl: '/images/og-image.jpg',
    duration: 60,
    price: 70.0,
    category: 'Terapia Energética',
    benefits: [
      'Equilibrio profundo de los chakras',
      'Reducción significativa del estrés',
      'Sanación emocional y liberación de traumas',
      'Fortalecimiento del sistema inmunológico',
      'Conexión espiritual y paz interior',
    ],
    contraindications: [
      'Marcapasos (precaución en zona cardíaca)',
      'Episodios psicóticos agudos',
      'Resistencia absoluta a terapias energéticas',
      'Intoxicación severa por sustancias',
    ],
    whatToExpect:
      'Durante la sesión permanecerás vestido y relajado mientras coloco mis manos suavemente sobre diferentes áreas de tu cuerpo. Puedes experimentar sensaciones de calor, frío, hormigueo o profunda paz. Muchas personas experimentan liberaciones emocionales o estados meditativos.',
    preparation:
      'Usa ropa cómoda y holgada, preferiblemente de fibras naturales. Mantén la mente abierta y receptiva. Evita alcohol y drogas 24 horas antes. Hidrátate bien y ven con intención clara de sanación. Informa sobre marcapasos o implantes electrónicos.',
  },
];
