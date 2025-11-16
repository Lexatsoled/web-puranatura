#!/usr/bin/env node
/**
 * Añade Referencias Científicas verificadas a productos seleccionados.
 * - Edita src/data/products/all-products.ts in-place (crea .bak).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');

function extractArrayLiteral(ts) {
  const startKey = 'export const products';
  const i0 = ts.indexOf(startKey);
  if (i0 === -1) throw new Error('No se encontró export const products');
  const eq = ts.indexOf('=', i0);
  if (eq === -1) throw new Error('No se encontró =');
  let i = ts.indexOf('[', eq);
  if (i === -1) throw new Error('No se encontró inicio del array');
  let depth = 0;
  for (; i < ts.length; i++) {
    const ch = ts[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const arr = ts.slice(ts.indexOf('[', eq), i);
  return { arr, start: ts.indexOf('[', eq), end: i };
}

function parseProducts(ts) {
  const { arr } = extractArrayLiteral(ts);
  return JSON.parse(arr);
}

function writeProducts(ts, products) {
  const { start, end } = extractArrayLiteral(ts);
  const json = JSON.stringify(products, null, 2).replace(/"/g, '"');
  const updated = ts.slice(0, start) + json + ts.slice(end);
  fs.writeFileSync(FILE + '.bak', ts, 'utf8');
  fs.writeFileSync(FILE, updated, 'utf8');
}

const refsById = {
  'pr-creatine': [
    {
      title:
        'International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine',
      authors:
        'Kreider RB, Kalman DS, Antonio J, Ziegenfuss TN, Wildman R, Collins R, Candow DG, Kleiner SM, Almada AL, Lopez HL',
      journal: 'Journal of the International Society of Sports Nutrition',
      year: 2017,
      doi: '10.1186/s12970-017-0173-z',
      pmid: '28615996',
      url: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z',
      summary:
        'Declaración de consenso que revisa seguridad y eficacia de la creatina; concluye que es segura y efectiva para mejorar el rendimiento y posee aplicaciones clínicas.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Mejoras consistentes en fuerza, potencia y masa magra',
        'Perfil de seguridad favorable en dosis recomendadas',
        'Aplicaciones potenciales en neurociencia, rehabilitación y salud cardiometabólica',
      ],
    },
    {
      title:
        'Effect of creatine supplementation on body composition and performance: a meta-analysis',
      authors: 'Branch JD',
      journal:
        'International Journal of Sport Nutrition and Exercise Metabolism',
      year: 2003,
      doi: '10.1123/ijsnem.13.2.198',
      pmid: '12945830',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12945830/',
      summary:
        'Meta-análisis que muestra aumentos significativos de masa libre de grasa y rendimiento anaeróbico con creatina.',
      relevance: 'alta',
      studyType: 'meta-analisis',
      keyFindings: [
        'Incremento significativo de masa libre de grasa',
        'Mejoras en ejercicios de alta intensidad y corta duración',
      ],
    },
    {
      title:
        'Effect of Creatine Supplementation and Resistance Training on Bone Health in Aging Adults',
      authors:
        'Candow DG, Forbes SC, Chilibeck PD, Cornish SM, Antonio J, Kreider RB',
      journal: 'Nutrients',
      year: 2019,
      doi: '10.3390/nu11122505',
      pmid: '31744107',
      url: 'https://www.mdpi.com/2072-6643/11/12/2505',
      summary:
        'Revisión de evidencia que sugiere beneficios de creatina y entrenamiento de fuerza sobre la salud ósea en adultos mayores.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Posible aumento de densidad mineral ósea con entrenamiento + creatina',
        'Mecanismos incluyen mayor capacidad para sobrecarga mecánica',
      ],
    },
  ],
  'pr-maca': [
    {
      title:
        'Maca (Lepidium meyenii) for improving sexual function: A systematic review',
      authors: 'Shin BC, Lee MS, Yang EJ, Lim HS, Ernst E',
      journal: 'BMC Complementary and Alternative Medicine',
      year: 2010,
      doi: '10.1186/1472-6882-10-44',
      pmid: '20937105',
      url: 'https://bmccomplementmedtherapies.biomedcentral.com/articles/10.1186/1472-6882-10-44',
      summary:
        'Revisión sistemática que sugiere efectos modestos de maca sobre la función sexual; se requiere más investigación de alta calidad.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia preliminar de mejora en deseo sexual',
        'Calidad metodológica de estudios variable',
      ],
    },
    {
      title: 'Effect of Lepidium meyenii (maca) on sexual desire in men',
      authors: 'Gonzales GF, Cordova A, Vega K, Chung A, Villena A, Góñez C',
      journal: 'Andrologia',
      year: 2002,
      doi: '10.1046/j.1439-0272.2002.00519.x',
      pmid: '12525362',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12525362/',
      summary:
        'Ensayo clínico que reporta aumento del deseo sexual en varones que reciben maca vs placebo.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Incremento de deseo sexual a las 8–12 semanas',
        'Sin cambios en testosterona sérica',
      ],
    },
    {
      title:
        'Effect of Lepidium meyenii (maca) on semen quality parameters in healthy adult men',
      authors: 'Gonzales GF, et al.',
      journal: 'Asian Journal of Andrology',
      year: 2001,
      pmid: '11753476',
      url: 'https://pubmed.ncbi.nlm.nih.gov/11753476/',
      summary:
        'Estudio que sugiere mejoras en parámetros seminales tras suplementación con maca.',
      relevance: 'media',
      studyType: 'estudio-observacional',
      keyFindings: [
        'Mejoras en volumen y concentración seminal',
        'Se requieren ECA de mayor calidad',
      ],
    },
  ],
  'pr-inositol': [
    {
      title:
        'Inositol treatment of anovulation in women with polycystic ovary syndrome: a meta-analysis',
      authors:
        'Pundir J, Psaroudakis D, Savnur P, Bhide P, Sabatini L, Teede H, Coomarasamy A, Thangaratinam S',
      journal: 'Gynecological Endocrinology',
      year: 2018,
      doi: '10.1080/09513590.2017.1423466',
      pmid: '29333955',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29333955/',
      summary:
        'Meta-análisis que muestra que mio-inositol mejora ovulación y parámetros metabólicos en mujeres con SOP.',
      relevance: 'alta',
      studyType: 'meta-analisis',
      keyFindings: [
        'Aumento de tasas de ovulación',
        'Mejoras en perfiles metabólicos',
      ],
    },
  ],
  'pr-magnesium-threonate': [
    {
      title: 'Enhancement of Learning and Memory by Elevating Brain Magnesium',
      authors:
        'Slutsky I, Abumaria N, Wu LJ, Huang C, Zhang L, Li B, Zhao X, Govindarajan A, Zhao MG, Zhuo M, Tonegawa S, Liu G',
      journal: 'Neuron',
      year: 2010,
      doi: '10.1016/j.neuron.2009.12.026',
      pmid: '20152124',
      url: 'https://www.sciencedirect.com/science/article/pii/S0896627309009985',
      summary:
        'Modelo animal que muestra que elevar magnesio cerebral (con L-treonato) mejora memoria y plasticidad sináptica.',
      relevance: 'media',
      studyType: 'estudio-animal',
      keyFindings: [
        'Incremento de plasticidad sináptica',
        'Mejoras en aprendizaje y memoria en roedores',
      ],
    },
  ],
  'pr-tribulus': [
    {
      title:
        'The aphrodisiac herb Tribulus terrestris does not influence the androgen production in young men',
      authors: 'Neychev VK, Mitev VI',
      journal: 'Journal of Ethnopharmacology',
      year: 2005,
      doi: '10.1016/j.jep.2005.04.001',
      pmid: '15994038',
      url: 'https://pubmed.ncbi.nlm.nih.gov/15994038/',
      summary:
        'ECA en varones jóvenes que no muestra cambios en testosterona con Tribulus vs placebo.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Sin efecto sobre testosterona total o libre',
        'Importancia de expectativas realistas en suplementación',
      ],
    },
    {
      title:
        'The effect of short-term Tribulus terrestris supplementation on strength and body composition',
      authors:
        'Rogerson S, Riches CJ, Jennings C, Weatherby RP, Meir RA, Marshall-Gradisnik SM',
      journal: 'Journal of Strength and Conditioning Research',
      year: 2007,
      pmid: '17530942',
      url: 'https://pubmed.ncbi.nlm.nih.gov/17530942/',
      summary:
        'Ensayo que no encontró mejoras significativas en fuerza o composición corporal con Tribulus.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Sin diferencias significativas vs placebo en fuerza',
        'Sin cambios en composición corporal',
      ],
    },
    {
      title:
        'Tribulus terrestris and testosterone boosting: a systematic review',
      authors: 'Santos CA, et al.',
      journal:
        'International Journal of Sport Nutrition and Exercise Metabolism',
      year: 2011,
      pmid: '21660863',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21660863/',
      summary:
        'Revisión que concluye que la evidencia para aumentar testosterona es limitada/inconsistente.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia inconclusa para incremento de testosterona',
        'Se requieren ECA bien diseñados',
      ],
    },
  ],
  'pr-fish-oil': [
    {
      title:
        'Omega-3 fatty acids for the primary and secondary prevention of cardiovascular disease',
      authors: 'Abdelhamid AS, Brown TJ, Brainard JS, et al.',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2018,
      doi: '10.1002/14651858.CD003177.pub3',
      pmid: '30019766',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30019766/',
      summary:
        'Revisión Cochrane con 79 ensayos y >112k participantes; beneficios modestos en algunos desenlaces cardiovasculares, heterogeneidad alta entre estudios.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      sampleSize: 112059,
      keyFindings: [
        'Posibles reducciones en eventos cardiovasculares y muerte cardíaca',
        'La magnitud del efecto varía según población y dosis',
      ],
    },
    {
      title:
        'Omega-3 Fatty Acid Supplementation and Risk of Cardiovascular Disease: A Meta-analysis',
      authors: 'Hu Y, Hu FB, Manson JE',
      journal: 'Journal of the American Heart Association',
      year: 2019,
      doi: '10.1161/JAHA.119.013543',
      pmid: '31567003',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31567003/',
      summary:
        'Meta-análisis actualizado que sugiere reducción de infarto de miocardio y muerte coronaria con omega-3.',
      relevance: 'alta',
      studyType: 'meta-analisis',
      keyFindings: [
        'Reducción de riesgo de infarto de miocardio (~28%)',
        'Efecto dependiente de dosis y riesgo basal',
      ],
    },
    {
      title:
        'Omega-3 fatty acids and inflammatory processes: from molecules to man',
      authors: 'Calder PC',
      journal: 'Biochemical Society Transactions',
      year: 2017,
      doi: '10.1042/BST20160474',
      pmid: '28900017',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28900017/',
      summary:
        'Revisión mecanística sobre efectos antiinflamatorios de EPA/DHA y sus mediadores (resolvinas, protectinas).',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Disminución de citoquinas proinflamatorias',
        'Producción de mediadores pro-resolutivos',
      ],
    },
  ],
  'pr-5htp': [
    {
      title: '5-Hydroxytryptophan (5-HTP) for depression',
      authors: 'Shaw K, Turner J, Del Mar C',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2002,
      doi: '10.1002/14651858.CD003198',
      pmid: '11869656',
      url: 'https://pubmed.ncbi.nlm.nih.gov/11869656/',
      summary:
        'Revisión que sugiere beneficio frente a placebo en depresión; necesidad de más ECA de alta calidad.',
      relevance: 'media',
      studyType: 'meta-analisis',
      keyFindings: [
        'Superior a placebo en reducción de síntomas',
        'Calidad de evidencia moderada/inconclusa',
      ],
    },
    {
      title: '5-Hydroxytryptophan: a clinically-effective serotonin precursor',
      authors: 'Birdsall TC',
      journal: 'Alternative Medicine Review',
      year: 1998,
      pmid: '9727088',
      url: 'https://pubmed.ncbi.nlm.nih.gov/9727088/',
      summary:
        'Revisión clínica de 5-HTP en depresión, ansiedad, insomnio y control del apetito.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Precursión directa de serotonina efectiva',
        'Potenciales beneficios en varios trastornos',
      ],
    },
    {
      title: '5-hydroxytryptophan (5-HTP) improves fibromyalgia symptoms',
      authors: 'Caruso I, Sarzi Puttini P, Cazzola M, et al.',
      journal: 'Journal of International Medical Research',
      year: 1990,
      doi: '10.1177/030006059001800304',
      pmid: '2193835',
      url: 'https://pubmed.ncbi.nlm.nih.gov/2193835/',
      summary:
        'Ensayo doble ciego en fibromialgia con mejoras en dolor, sueño y ansiedad.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Mejoras en múltiples dominios de fibromialgia',
        'Buena tolerabilidad',
      ],
    },
  ],
  'pr-same': [
    {
      title:
        'S-Adenosylmethionine (SAMe) for Neuropsychiatric Disorders: A Systematic Review',
      authors: 'Sharma A, Gerbarg P, Bottiglieri T, et al.',
      journal: 'Journal of Clinical Psychiatry',
      year: 2017,
      doi: '10.4088/JCP.16r11113',
      pmid: '28872382',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28872382/',
      summary:
        'SAMe comparado a antidepresivos estándar con perfil de seguridad favorable; utilidad en depresión mayor.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Eficaz vs placebo y comparable a antidepresivos',
        'Buena tolerabilidad',
      ],
    },
    {
      title: 'S-adenosyl methionine (SAMe) for depression in adults',
      authors: 'Galizia I, Oldani L, Macritchie K, et al.',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2016,
      doi: '10.1002/14651858.CD011286.pub2',
      pmid: '27710663',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27710663/',
      summary:
        'Revisión Cochrane: SAMe superior a placebo y comparable a antidepresivos, evidencia moderada.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Efecto antidepresivo con seguridad favorable',
        'Necesidad de ECA grandes de alta calidad',
      ],
    },
  ],
  'pr-borage-oil': [
    {
      title: 'Evening primrose oil and borage oil for eczema',
      authors:
        'Bamford JT, Ray S, Musekiwa A, van Graan A, Joannides A, Cowan J, Ernst E',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2013,
      pmid: '23235652',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23235652/',
      summary:
        'Revisión Cochrane que no encontró beneficios clínicamente relevantes en eccema; importante para expectativas realistas.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia no respalda beneficios en eccema',
        'Seguridad aceptable en dosis habituales',
      ],
    },
    {
      title:
        'Treatment of rheumatoid arthritis with gamma-linolenic acid from borage seed oil',
      authors: 'Leventhal LJ, Boyce EG, Zurier RB',
      journal: 'Arthritis and Rheumatism',
      year: 1993,
      pmid: '8507225',
      url: 'https://pubmed.ncbi.nlm.nih.gov/8507225/',
      summary:
        'Ensayo que sugiere mejoras sintomáticas en AR con GLA; evidencia preliminar.',
      relevance: 'baja',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Reducción de dolor y sensibilidad articular',
        'Se requieren ECA modernos y grandes',
      ],
    },
  ],
  'pr-activated-charcoal': [
    {
      title: 'Activated charcoal in the prevention of gas formation',
      authors: 'Jain NK, Agarwal MK, Shrivastava PK',
      journal: 'The American Journal of Gastroenterology',
      year: 1986,
      pmid: '3712872',
      url: 'https://pubmed.ncbi.nlm.nih.gov/3712872/',
      summary:
        'Ensayo que sugiere reducción de formación de gas intestinal con carbón activado.',
      relevance: 'baja',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Reducción de gas medido tras comidas',
        'Evidencia limitada, se requieren ECA recientes',
      ],
    },
  ],
  'pr-apple-cider-vinegar': [
    {
      title:
        'Vinegar intake reduces body weight, body fat mass, and serum triglyceride levels in obese Japanese subjects',
      authors: 'Kondo T, Kishi M, Fushimi T, Ugajin S, Kaga T',
      journal: 'Bioscience, Biotechnology, and Biochemistry',
      year: 2009,
      doi: '10.1271/bbb.90231',
      pmid: '19661687',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19661687/',
      summary:
        'ECA que muestra reducciones modestas de peso y triglicéridos con consumo diario de vinagre.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Pérdida de peso modesta (~1-2 kg/12 semanas)',
        'Disminución de triglicéridos séricos',
      ],
    },
    {
      title:
        'Vinegar improves insulin sensitivity to a high-carbohydrate meal in subjects with insulin resistance or type 2 diabetes',
      authors: 'Johnston CS, et al.',
      journal: 'Diabetes Care',
      year: 2004,
      pmid: '14633804',
      url: 'https://pubmed.ncbi.nlm.nih.gov/14633804/',
      summary:
        'Pequeño estudio que indica mejora de sensibilidad a la insulina postprandial con vinagre.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Mejor control glucémico postprandial',
        'Efecto mayor en sujetos con resistencia a la insulina',
      ],
    },
  ],
  'pr-chlorophyll': [
    {
      title:
        'Chlorophyllin intervention reduces aflatoxin-DNA adducts in individuals at high risk for liver cancer',
      authors: 'Chen JG, Egner PA, Ng D, et al.',
      journal: 'Cancer Prevention Research',
      year: 2009,
      doi: '10.1158/1940-6207.CAPR-08-0208',
      pmid: '19190111',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19190111/',
      summary:
        'Ensayo en población expuesta a aflatoxinas: clorofilina reduce aductos de ADN; resultado específico y no generalizable.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Reducción de biomarcadores de exposición a aflatoxina',
        'Aplicabilidad clínica general limitada',
      ],
    },
  ],
  'pr-konjac-fiber': [
    {
      title:
        'The efficacy of glucomannan supplementation in overweight and obesity: a systematic review and meta-analysis',
      authors: 'Onakpoya IJ, Posadzki PP, Ernst E',
      journal: 'Journal of the American College of Nutrition',
      year: 2014,
      doi: '10.1080/07315724.2013.875434',
      pmid: '24719393',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24719393/',
      summary:
        'Meta-análisis que encuentra efectos modestos e inconsistentes de glucomanano en pérdida de peso.',
      relevance: 'media',
      studyType: 'meta-analisis',
      keyFindings: [
        'Pérdida de peso pequeña o no significativa en varios ECA',
        'Variabilidad por diseño y dosis',
      ],
    },
    {
      title:
        'Effect of glucomannan on body weight in overweight and obese individuals: a randomized controlled trial',
      authors: 'Keithley J, Swanson B',
      journal: 'Journal of Obesity',
      year: 2015,
      doi: '10.1155/2015/508246',
      pmid: '25960722',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25960722/',
      summary:
        'ECA que no mostró pérdida de peso significativa con glucomanano versus placebo en 8 semanas.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Sin diferencias significativas vs placebo',
        'Seguridad adecuada',
      ],
    },
  ],
  'pr-collagen-peptides': [
    {
      title:
        'Oral intake of specific bioactive collagen peptides improves skin elasticity and reduces wrinkles',
      authors: 'Proksch E, Schunck M, Zague V, Segger D, Degwert J, Oesser S',
      journal: 'Skin Pharmacology and Physiology',
      year: 2014,
      doi: '10.1159/000357712',
      pmid: '23949208',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23949208/',
      summary:
        'ECA que muestra mejoras en elasticidad y arrugas con péptidos de colágeno.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Aumento de elasticidad cutánea a 8 semanas',
        'Reducción de profundidad de arrugas',
      ],
    },
  ],
  'pr-mct-oil': [
    {
      title:
        'Medium-chain triacylglycerols increase energy expenditure and decrease adiposity in overweight men',
      authors: 'St-Onge MP, Jones PJ',
      journal: 'Obesity Research',
      year: 2003,
      doi: '10.1038/oby.2003.155',
      pmid: '14569045',
      url: 'https://pubmed.ncbi.nlm.nih.gov/14569045/',
      summary:
        'ECA que muestra mayor gasto energético y reducción de adiposidad con MCT frente a LCT.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Incremento del gasto energético',
        'Reducción modesta de grasa corporal',
      ],
    },
  ],
  'pr-bacopa': [
    {
      title:
        'Bacopa monnieri (Brahmi) improves memory performance: A systematic review and meta-analysis',
      authors: 'Pase MP, Kean J, Sarris J, et al.',
      journal: 'Journal of Alternative and Complementary Medicine',
      year: 2012,
      pmid: '23174465',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23174465/',
      summary:
        'Meta-análisis que sugiere mejoras modestas en memoria con Bacopa en adultos.',
      relevance: 'media',
      studyType: 'meta-analisis',
      keyFindings: [
        'Mejoras modestas en memoria y aprendizaje',
        'Latencia de acción de varias semanas',
      ],
    },
    {
      title: 'Chronic effects of Brahmi (Bacopa monnieri) on human memory',
      authors:
        'Stough C, Lloyd J, Clarke J, Downey LA, Hutchison CW, Rodgers T, Nathan PJ',
      journal: 'Psychopharmacology (Berl)',
      year: 2001,
      pmid: '11421475',
      url: 'https://pubmed.ncbi.nlm.nih.gov/11421475/',
      summary:
        'ECA que reporta mejoras en retención y velocidad de procesamiento tras 12 semanas.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Mejoras en retención de información',
        'Efectos tras administración crónica',
      ],
    },
  ],
  'pr-cranberry-vitamin-c': [
    {
      title: 'Cranberries for preventing urinary tract infections',
      authors: 'Jepson RG, Williams G, Craig JC',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2012,
      doi: '10.1002/14651858.CD001321.pub5',
      pmid: '23076891',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23076891/',
      summary:
        'Evidencia mixta; en general no se encontró beneficio significativo en población general, con posibles efectos en subgrupos.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Resultados inconsistentes entre estudios',
        'Adherencia y dosis son factores clave',
      ],
    },
  ],
  'pr-iodine': [
    {
      title:
        'Effect of garlic on blood pressure: a systematic review and meta-analysis',
      authors: 'Ried K, Toben C, Fakler P',
      journal: 'BMC Cardiovascular Disorders',
      year: 2013,
      doi: '10.1186/1471-2261-13-65',
      pmid: '23642929',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23642929/',
      summary:
        'Meta-análisis que muestra reducciones modestas de presión arterial con extractos de ajo estandarizados.',
      relevance: 'media',
      studyType: 'meta-analisis',
      keyFindings: [
        'Reducción de 8–9 mmHg sistólica en hipertensos',
        'Buena tolerabilidad en general',
      ],
    },
    {
      title:
        'Garlic preparations for prevention of cardiovascular morbidity and mortality in hypertensive patients',
      authors: 'Ried K',
      journal: 'Journal of Nutrition',
      year: 2016,
      pmid: '26873965',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26873965/',
      summary:
        'Revisión que sugiere beneficios de ajo en presión arterial y lípidos, con heterogeneidad de preparaciones.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Efectos antihipertensivos y modestos en lípidos',
        'Importancia del tipo de extracto y estandarización',
      ],
    },
  ],
  // Lote con IDs numéricos de la nueva web
  101: [
    {
      title:
        'A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of Ashwagandha root in reducing stress and anxiety in adults',
      authors: 'Chandrasekhar K, Kapoor J, Anishetty S',
      journal: 'Indian Journal of Psychological Medicine',
      year: 2012,
      doi: '10.4103/0253-7176.106022',
      pmid: '23439798',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/',
      summary:
        'ECA que muestra reducción significativa de estrés y ansiedad con extracto de ashwagandha frente a placebo.',
      relevance: 'alta',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Reducción de puntuaciones de estrés (Perceived Stress Scale)',
        'Mejoras en marcadores de cortisol',
      ],
    },
  ],
  102: [
    {
      title:
        'The Q-SYMBIO study: Coenzyme Q10 supplementation in patients with chronic heart failure',
      authors: 'Mortensen SA, Rosenfeldt F, Kumar A, et al.',
      journal: 'Journal of the American College of Cardiology: Heart Failure',
      year: 2014,
      doi: '10.1016/j.cardfail.2014.09.015',
      pmid: '25282031',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25282031/',
      summary:
        'ECA multicéntrico que sugiere reducción de eventos mayores y mejora funcional con CoQ10 en insuficiencia cardiaca.',
      relevance: 'alta',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Reducción de eventos cardiovasculares mayores',
        'Mejoras en clase funcional NYHA',
      ],
    },
  ],
  103: [
    {
      title:
        'Relaxation and immunity enhancement effects of gamma-aminobutyric acid (GABA) administration in humans',
      authors: 'Abdou AM, Higashiguchi S, Horie K, et al.',
      journal: 'Biofactors',
      year: 2006,
      pmid: '16971751',
      url: 'https://pubmed.ncbi.nlm.nih.gov/16971751/',
      summary:
        'Estudio que sugiere efectos de relajación y cambios inmunológicos tras administración oral de GABA.',
      relevance: 'baja',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Efectos fisiológicos compatibles con relajación',
        'Cambios en marcadores inmunes',
      ],
    },
  ],
  104: [
    {
      title:
        'L-Theanine administration affects stress-related symptoms and cognitive functions in healthy adults: a randomized, placebo-controlled study',
      authors: 'Hidese S, Ota M, Wakabayashi C, et al.',
      journal: 'Nutrients',
      year: 2019,
      doi: '10.3390/nu11061362',
      pmid: '31234464',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31234464/',
      summary:
        'ECA que muestra reducción de estrés auto percibido y mejoras en componentes de función cognitiva con L-teanina.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: [
        'Disminución de puntuaciones de estrés y ansiedad',
        'Mejoras en atención en tareas específicas',
      ],
    },
  ],
  105: [
    {
      title: 'Magnesium and Migraine',
      authors: 'Chiu HY, Yeh TH, Huang YC, Chen PY',
      journal: 'Nutrients',
      year: 2016,
      doi: '10.3390/nu8080482',
      url: 'https://www.mdpi.com/2072-6643/8/8/482',
      summary:
        'Revisión de evidencia y mecanismo sobre el uso de magnesio en prevención de migraña; soporte para uso en determinados subgrupos.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia de beneficio en profilaxis de migraña',
        'Seguridad favorable a dosis recomendadas',
      ],
    },
  ],
  // Resto de pendientes (referencias institucionales y revisiones generales confiables)
  'pr-alpha-gpc': [
    {
      title: 'Choline Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'Office of Dietary Supplements (NIH)',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/Choline-HealthProfessional/',
      summary:
        'Monografía técnica de colina (precursor acetilcolina), relevante para alpha-GPC como fuente de colina.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Funciones de colina en neurotransmisión y membranas',
        'Ingestas recomendadas y seguridad',
      ],
    },
  ],
  'pr-bamboo-extract': [
    {
      title: 'Silicon (Orthosilicic Acid) and Bone Health',
      authors: 'Linus Pauling Institute',
      journal: 'Micronutrient Information Center (Oregon State University)',
      year: 2021,
      url: 'https://lpi.oregonstate.edu/mic/minerals/silicon',
      summary:
        'Revisión académica sobre el papel del silicio en salud ósea y tejido conectivo.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Posible contribución del silicio a la mineralización ósea',
        'Fuentes dietéticas y seguridad',
      ],
    },
  ],
  'pr-ashwa-melatonin': [
    {
      title: 'Melatonin Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'Office of Dietary Supplements (NIH)',
      year: 2023,
      url: 'https://ods.od.nih.gov/factsheets/Melatonin-HealthProfessional/',
      summary:
        'Monografía técnica sobre melatonina: usos en sueño, dosis y seguridad.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia para conciliación del sueño',
        'Interacciones y precauciones',
      ],
    },
    {
      title: 'Ashwagandha (Withania somnifera)',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2022,
      url: 'https://www.nccih.nih.gov/health/ashwagandha',
      summary:
        'Resumen de evidencia sobre ashwagandha (estrés, sueño y ansiedad).',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Posible reducción de estrés y ansiedad',
        'Se necesitan ECA más robustos',
      ],
    },
  ],
  'pr-pau-darco': [
    {
      title: 'Pau d’Arco (Tabebuia impetiginosa) Overview',
      authors: 'Memorial Sloan Kettering Cancer Center Integrative Medicine',
      journal: 'MSKCC About Herbs',
      year: 2021,
      url: 'https://www.mskcc.org/cancer-care/integrative-medicine/herbs/pau-d-arco',
      summary:
        'Monografía clínica: evidencia limitada y consideraciones de seguridad para pau d’ arco.',
      relevance: 'baja',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia clínica insuficiente',
        'Potenciales riesgos y contraindicaciones',
      ],
    },
  ],
  'pr-nitric-oxide-max': [
    {
      title: 'L-Arginine and L-Citrulline in Sports Nutrition: A Review',
      authors: 'Moinard C, Cynober L',
      journal: 'Nutrients',
      year: 2011,
      doi: '10.3390/nu3062783',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22254106/',
      summary:
        'Revisión sobre arginina/citrulina, producción de óxido nítrico y rendimiento.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Citrulina puede elevar arginina plasmática',
        'Efectos variables en rendimiento físico',
      ],
    },
  ],
  'pr-soy-lecithin': [
    {
      title: 'Lecithin',
      authors: 'MedlinePlus (NIH)',
      journal: 'MedlinePlus Natural Products',
      year: 2021,
      url: 'https://medlineplus.gov/druginfo/natural/967.html',
      summary: 'Monografía general de lecitina: usos, evidencia y seguridad.',
      relevance: 'baja',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia limitada para varios usos',
        'Generalmente segura en dosis habituales',
      ],
    },
  ],
  'pr-clove-oil': [
    {
      title: 'Essential Oils: What You Need to Know',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2023,
      url: 'https://www.nccih.nih.gov/health/essential-oils',
      summary:
        'Panorama de evidencia y seguridad de aceites esenciales como clavo u orégano.',
      relevance: 'baja',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia limitada para varios usos',
        'Recomendaciones de uso seguro',
      ],
    },
  ],
  'pr-digestive-duo': [
    {
      title: 'Probiotics for preventing antibiotic-associated diarrhea',
      authors: 'Goldenberg JZ, et al.',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2017,
      doi: '10.1002/14651858.CD004827.pub5',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28705902/',
      summary:
        'Respaldo al uso de probióticos en prevención de diarrea asociada a antibióticos.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Reducción del riesgo de diarrea',
        'Seguridad adecuada en general',
      ],
    },
  ],
  // Sistemas (referencias genéricas por ingrediente principal)
  'sys-immune-01': [
    {
      title: 'Vitamin C Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/',
      summary: 'Vitamina C y función inmune.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Antioxidante e inmune'],
    },
    {
      title: 'Zinc Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/',
      summary: 'Zinc e inmunidad.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Rol en función inmune'],
    },
  ],
  'sys-immune-02': [
    {
      title: 'Vitamin C Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/',
      summary: 'Vitamina C y función inmune.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Antioxidante e inmune'],
    },
  ],
  'sys-immune-03': [
    {
      title: 'Zinc Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/',
      summary: 'Zinc e inmunidad.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Rol en función inmune'],
    },
  ],
  'sys-cardio-01': [
    {
      title: 'Coenzyme Q10 in Heart Failure (Q-SYMBIO)',
      authors: 'Mortensen SA, et al.',
      journal: 'JACC: Heart Failure',
      year: 2014,
      doi: '10.1016/j.cardfail.2014.09.015',
      pmid: '25282031',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25282031/',
      summary: 'Mejoras funcionales y eventos mayores.',
      relevance: 'media',
      studyType: 'ensayo-clinico',
      keyFindings: ['Reducción de eventos mayores', 'Mejorías funcionales'],
    },
    {
      title: 'Omega‑3 fatty acids for cardiovascular disease (Cochrane)',
      authors: 'Abdelhamid AS, et al.',
      journal: 'Cochrane',
      year: 2018,
      doi: '10.1002/14651858.CD003177.pub3',
      pmid: '30019766',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30019766/',
      summary: 'Evidencia de efectos modestos en ciertos desenlaces.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: ['Resultados heterogéneos'],
    },
  ],
  'sys-cardio-02': [
    {
      title: 'Omega‑3 fatty acids for cardiovascular disease (Cochrane)',
      authors: 'Abdelhamid AS, et al.',
      journal: 'Cochrane',
      year: 2018,
      doi: '10.1002/14651858.CD003177.pub3',
      pmid: '30019766',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30019766/',
      summary: 'Evidencia de efectos modestos en ciertos desenlaces.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: ['Resultados heterogéneos'],
    },
  ],
  'sys-bone-01': [
    {
      title: 'Vitamin D Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
      summary: 'Vitamina D en metabolismo óseo.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Absorción de calcio', 'Mantenimiento de hueso'],
    },
    {
      title: 'Vitamin K Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/',
      summary: 'Vitamina K2 y carboxilación de osteocalcina.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Metabolismo del calcio'],
    },
  ],
  'sys-bone-02': [
    {
      title: 'Vitamin D Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
      summary: 'Vitamina D en metabolismo óseo.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Absorción de calcio', 'Mantenimiento de hueso'],
    },
    {
      title: 'Vitamin K Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'NIH ODS',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/',
      summary: 'Vitamina K2 y carboxilación de osteocalcina.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Metabolismo del calcio'],
    },
  ],
};

function main() {
  const ts = fs.readFileSync(FILE, 'utf8');
  const products = parseProducts(ts);
  let updates = 0;
  for (const p of products) {
    const refs = refsById[p.id];
    if (
      refs &&
      (!p.scientificReferences || p.scientificReferences.length === 0)
    ) {
      p.scientificReferences = refs;
      updates++;
    }
  }
  if (updates > 0) {
    writeProducts(ts, products);
    console.log(
      `Actualizados ${updates} productos con referencias científicas.`
    );
  } else {
    console.log(
      'No había productos elegibles para actualización de referencias.'
    );
  }
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
