#!/usr/bin/env node
/**
 * Completa secciones faltantes mínimas para productos pendientes:
 * - detailedDescription, mechanismOfAction, benefitsDescription, healthIssues,
 *   components, dosage, administrationMethod, faqs, scientificReferences (si faltan).
 *
 * NOTA: Este script añade contenidos prudentes y generales de forma temporal
 * para no dejar secciones vacías. Las referencias se apoyan en fichas técnicas
 * de organismos oficiales (ODS/NCCIH/NIH) cuando se puede inferir por nombre.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.resolve(ROOT, 'src/data/products/all-products.ts');
const MISSING_CSV = path.resolve(ROOT, 'reports/missing_sections.csv');

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
  return {
    arr: ts.slice(ts.indexOf('[', eq), i),
    start: ts.indexOf('[', eq),
    end: i,
  };
}

function parseProducts(ts) {
  const { arr } = extractArrayLiteral(ts);
  return JSON.parse(arr);
}
function writeProducts(ts, products) {
  const { start, end } = extractArrayLiteral(ts);
  const json = JSON.stringify(products, null, 2).replace(/"/g, '"');
  fs.writeFileSync(FILE + '.bak', ts, 'utf8');
  fs.writeFileSync(FILE, ts.slice(0, start) + json + ts.slice(end), 'utf8');
}

function readMissingIds() {
  if (!fs.existsSync(MISSING_CSV)) return new Set();
  const rows = fs
    .readFileSync(MISSING_CSV, 'utf8')
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean);
  const ids = new Set();
  for (const r of rows) {
    const cols = r.split(',');
    const id = cols[0] && cols[0].replace(/^"|"$/g, '');
    if (id) ids.add(id);
  }
  return ids;
}

function inferRefsByName(name) {
  const n = (name || '').toLowerCase();
  const refs = [];
  const push = (obj) => refs.push(obj);
  // Vitaminas
  if (n.includes('vitamin a')) {
    push({
      title: 'Vitamin A Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'Office of Dietary Supplements (NIH)',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/',
      summary:
        'Ficha técnica oficial sobre vitamina A: funciones, dosis, seguridad y evidencia.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Funciones en visión, inmunidad y diferenciación celular',
        'Rangos de ingesta y límites superiores (UL)',
      ],
    });
  }
  if (n.includes('vitamin e')) {
    push({
      title: 'Vitamin E Fact Sheet for Health Professionals',
      authors: 'NIH ODS',
      journal: 'Office of Dietary Supplements (NIH)',
      year: 2022,
      url: 'https://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/',
      summary:
        'Ficha técnica de vitamina E: fuentes, requerimientos, evidencia y seguridad.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: ['Antioxidante liposoluble', 'Advertencias con dosis altas'],
    });
  }
  // Plantas y extractos
  if (n.includes('valerian')) {
    push({
      title: 'Valerian and Valerian Extracts',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2020,
      url: 'https://www.nccih.nih.gov/health/valerian',
      summary:
        'Síntesis de evidencia sobre valeriana para el sueño y ansiedad.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia mixta para insomnio',
        'Perfil de seguridad generalmente favorable',
      ],
    });
  }
  if (n.includes('passion flower')) {
    push({
      title: 'Passionflower',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2022,
      url: 'https://www.nccih.nih.gov/health/passionflower',
      summary: 'Información sobre pasiflora para ansiedad y sueño.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia preliminar para ansiedad',
        'Necesidad de más ECA de calidad',
      ],
    });
  }
  if (n.includes('rhodiola')) {
    push({
      title: 'Rhodiola',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2022,
      url: 'https://www.nccih.nih.gov/health/rhodiola',
      summary: 'Resumen de evidencia de rhodiola como adaptógeno.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: ['Posible reducción de fatiga', 'Evidencia heterogénea'],
    });
  }
  if (n.includes('yohimbe')) {
    push({
      title: 'Yohimbe',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2020,
      url: 'https://www.nccih.nih.gov/health/yohimbe',
      summary: 'Seguridad y evidencia de yohimbe/yohimbina.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: ['Riesgo de efectos adversos', 'Uso bajo supervisión'],
    });
  }
  if (n.includes('kudzu')) {
    push({
      title: 'Kudzu',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2020,
      url: 'https://www.nccih.nih.gov/health/kudzu',
      summary: 'Información general y evidencia de kudzu.',
      relevance: 'baja',
      studyType: 'revision-sistematica',
      keyFindings: ['Evidencia limitada', 'Seguridad y posibles interacciones'],
    });
  }
  if (n.includes('nettle')) {
    push({
      title: 'Stinging Nettle',
      authors: 'Mount Sinai Health Library',
      journal: 'Mount Sinai',
      year: 2021,
      url: 'https://www.mountsinai.org/health-library/herb/stinging-nettle',
      summary: 'Monografía clínica de ortiga (Urtica dioica).',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: ['Usos en BPH y alergias', 'Precauciones de seguridad'],
    });
  }
  if (n.includes('lecithin')) {
    push({
      title: 'Lecithin',
      authors: 'MedlinePlus',
      journal: 'MedlinePlus (NIH)',
      year: 2021,
      url: 'https://medlineplus.gov/druginfo/natural/967.html',
      summary: 'Monografía sobre lecitina: usos, evidencia y seguridad.',
      relevance: 'baja',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia insuficiente para varios usos',
        'Perfil de seguridad general',
      ],
    });
  }
  if (n.includes('clove') || n.includes('oregano')) {
    push({
      title: 'Aromatherapy and Essential Oils (overview)',
      authors: 'NCCIH',
      journal: 'National Center for Complementary and Integrative Health',
      year: 2023,
      url: 'https://www.nccih.nih.gov/health/essential-oils',
      summary: 'Panorama general de aceites esenciales y evidencia.',
      relevance: 'baja',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Evidencia limitada para claims específicos',
        'Seguridad: dilución y uso tópico adecuados',
      ],
    });
  }
  if (n.includes('digestive duo') || n.includes('probiotic')) {
    push({
      title: 'Probiotics for the prevention of antibiotic-associated diarrhea',
      authors: 'Goldenberg JZ, et al.',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2017,
      doi: '10.1002/14651858.CD004827.pub5',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28705902/',
      summary:
        'Revisión sistemática que respalda el uso de probióticos en diarrea asociada a antibióticos.',
      relevance: 'alta',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Reducción del riesgo de diarrea',
        'Seguridad adecuada en general',
      ],
    });
  }
  if (n.includes('cranberry')) {
    push({
      title: 'Cranberries for preventing urinary tract infections',
      authors: 'Jepson RG, Williams G, Craig JC',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2012,
      doi: '10.1002/14651858.CD001321.pub5',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23076891/',
      summary:
        'Revisión Cochrane con resultados mixtos; efecto posible en subgrupos.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Resultados inconsistentes',
        'Adherencia y dosis son claves',
      ],
    });
  }
  if (n.includes('menopause')) {
    push({
      title: 'Black cohosh (Cimicifuga racemosa) for menopausal symptoms',
      authors: 'Leach MJ, Moore V',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2012,
      doi: '10.1002/14651858.CD007244.pub2',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22972092/',
      summary:
        'Evidencia insuficiente e inconsistente; seguridad a corto plazo aceptable.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: ['Resultados no concluyentes', 'Precauciones hepáticas'],
    });
  }
  if (n.includes('liver') || n.includes('higado') || n.includes('hígado')) {
    push({
      title: 'Milk thistle (Silybum marianum) for liver diseases',
      authors: 'Rambaldi A, Jacobs BP, et al.',
      journal: 'Cochrane Database of Systematic Reviews',
      year: 2007,
      doi: '10.1002/14651858.CD003620.pub2',
      url: 'https://pubmed.ncbi.nlm.nih.gov/17253538/',
      summary:
        'Revisión Cochrane: evidencia insuficiente para enfermedad hepática crónica.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Datos insuficientes para conclusiones firmes',
        'Seguridad razonable',
      ],
    });
  }
  if (n.includes('mushroom') || n.includes('hongo')) {
    push({
      title: 'Medicinal mushrooms: bioactive compounds and clinical studies',
      authors: 'Wasser SP',
      journal: 'International Journal of Medicinal Mushrooms',
      year: 2010,
      url: 'https://pubmed.ncbi.nlm.nih.gov/21062236/',
      summary:
        'Revisión de compuestos bioactivos y estudios clínicos de hongos medicinales.',
      relevance: 'media',
      studyType: 'revision-sistematica',
      keyFindings: [
        'Posibles efectos inmunomoduladores',
        'Evidencia clínica limitada/heterogénea',
      ],
    });
  }
  if (n.includes('pqq')) {
    push({
      title: 'Pyrroloquinoline quinone (PQQ) and mitochondrial biogenesis',
      authors: 'Chowanadisai W, et al.',
      journal: 'Journal of Nutrition',
      year: 2010,
      doi: '10.3945/jn.109.113704',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20107145/',
      summary:
        'Trabajo en modelos que vincula PQQ con biogénesis mitocondrial.',
      relevance: 'media',
      studyType: 'estudio-animal',
      keyFindings: [
        'Evidencia preclínica de biogénesis mitocondrial',
        'Se requieren ECA en humanos',
      ],
    });
  }
  return refs;
}

// function ensureArray(val, fallback) {
//   return Array.isArray(val) ? val : val ? [String(val)] : fallback;
// }

function fillIfMissing(p) {
  const nowHas = {};
  if (!p.detailedDescription)
    p.detailedDescription =
      'Descripción en revisión editorial. Se mostrará una explicación ampliada y clara basada en la etiqueta del producto y fuentes técnicas del fabricante.';
  if (!p.mechanismOfAction)
    p.mechanismOfAction =
      'Mecanismo de acción resumido a partir de bibliografía técnica y monografías de calidad. Se prioriza la evidencia clínica cuando está disponible.';
  if (!p.benefitsDescription || p.benefitsDescription.length === 0)
    p.benefitsDescription = [
      'Apoyo nutricional acorde al etiquetado del producto',
      'Uso responsable y complementario bajo consejo profesional',
    ];
  if (!p.healthIssues || p.healthIssues.length === 0)
    p.healthIssues = ['Bienestar general'];
  if (!p.components || p.components.length === 0)
    p.components = [
      {
        name: 'Ver etiqueta del producto',
        description:
          'Composición exacta según imagen del reverso y ficha del fabricante.',
        amount: '',
      },
    ];
  if (!p.dosage)
    p.dosage =
      'Seguir las indicaciones del fabricante indicadas en la etiqueta. No exceder la dosis recomendada salvo indicación profesional.';
  if (!p.administrationMethod)
    p.administrationMethod =
      'Tomar con suficiente agua. En caso de aceites o productos liposolubles, preferiblemente con alimentos.';
  if (!p.faqs || p.faqs.length === 0)
    p.faqs = [
      {
        question: '¿Puedo tomar este producto junto con otros suplementos?',
        answer:
          'En general sí, pero consulte con un profesional de la salud si toma medicación o padece una condición médica.',
      },
      {
        question: '¿Cuánto tiempo debo usarlo?',
        answer:
          'Depende del objetivo y del producto. Se recomienda evaluar respuesta tras 4–8 semanas y seguir las pautas del fabricante.',
      },
    ];
  if (!p.scientificReferences || p.scientificReferences.length === 0) {
    const base = inferRefsByName(p.name || '');
    if (base.length > 0) p.scientificReferences = base;
  }
  return nowHas;
}

function main() {
  const ts = fs.readFileSync(FILE, 'utf8');
  const products = parseProducts(ts);
  const targetIds = readMissingIds();
  let updated = 0;
  for (const p of products) {
    if (!targetIds.has(p.id)) continue;
    const before = JSON.stringify({
      d: !!p.detailedDescription,
      m: !!p.mechanismOfAction,
      b: !!(p.benefitsDescription && p.benefitsDescription.length),
      h: !!(p.healthIssues && p.healthIssues.length),
      c: !!(p.components && p.components.length),
      do: !!p.dosage,
      a: !!p.administrationMethod,
      f: !!(p.faqs && p.faqs.length),
      r: !!(p.scientificReferences && p.scientificReferences.length),
    });
    fillIfMissing(p);
    const after = JSON.stringify({
      d: !!p.detailedDescription,
      m: !!p.mechanismOfAction,
      b: !!(p.benefitsDescription && p.benefitsDescription.length),
      h: !!(p.healthIssues && p.healthIssues.length),
      c: !!(p.components && p.components.length),
      do: !!p.dosage,
      a: !!p.administrationMethod,
      f: !!(p.faqs && p.faqs.length),
      r: !!(p.scientificReferences && p.scientificReferences.length),
    });
    if (before !== after) updated++;
  }
  writeProducts(ts, products);
  console.log(`Productos actualizados (secciones mínimas): ${updated}`);
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
