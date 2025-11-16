import React, { useMemo, useState } from 'react';
import { Product } from '@/types/product';

interface ScientificReferencesProps {
  product: Product;
  className?: string;
}

const StudyTypeColors: Record<string, string> = {
  'ensayo-clinico': 'bg-blue-100 text-blue-800',
  'revision-sistematica': 'bg-purple-100 text-purple-800',
  'meta-analisis': 'bg-green-100 text-green-800',
  'estudio-observacional': 'bg-yellow-100 text-yellow-800',
  'in-vitro': 'bg-orange-100 text-orange-800',
  animal: 'bg-gray-100 text-gray-800',
  'estudio-animal': 'bg-gray-100 text-gray-800',
};

const StudyTypeLabels: Record<string, string> = {
  'ensayo-clinico': 'Ensayo Clínico',
  'revision-sistematica': 'Revisión Sistemática',
  'meta-analisis': 'Meta-análisis',
  'estudio-observacional': 'Estudio Observacional',
  'in-vitro': 'Estudio In Vitro',
  animal: 'Estudio Animal',
  'estudio-animal': 'Estudio Animal',
};

const RelevanceColors = {
  alta: 'bg-green-100 text-green-800 border-green-200',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  baja: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Normaliza etiquetas con posibles problemas de codificación
const displayStudyTypeLabel = (key: string) => {
  const raw = StudyTypeLabels[key] || key;
  return raw
    .replace('Clínico', 'Clínico')
    .replace('Revisión Sistemática', 'Revisión Sistemática')
    .replace('Meta-anÇ­lisis', 'Meta-análisis');
};

// Función auxiliar para mostrar tipos de estudio cortos
const displayShortType = (key: string) => {
  const shortLabels: Record<string, string> = {
    'ensayo-clinico': 'Ensayos Clínicos',
    'meta-analisis': 'Meta-análisis',
    'revision-sistematica': 'Revisiones Sistemáticas',
    'guia-clinica': 'Guías Clínicas',
    'revision-narrativa': 'Revisiones Narrativas',
    'position-stand': 'Posiciones Oficiales',
    'opinion-regulatoria': 'Opiniones Regulatorias',
    'estudio-observacional': 'Estudios Observacionales',
    'in-vitro': 'Estudios In Vitro',
    'estudio-animal': 'Estudios Animales',
    animal: 'Estudios Animales',
  };
  return shortLabels[key] || displayStudyTypeLabel(key);
};

// Función para alternar la expansión de referencias
const toggleReference = (index: number, setExpandedReference: React.Dispatch<React.SetStateAction<number | null>>, expandedReference: number | null) => {
  setExpandedReference(expandedReference === index ? null : index);
};

type SciRef = NonNullable<Product['scientificReferences']>[number];

// Función para abrir enlaces
const openLink = (ref: SciRef) => {
  if (ref.url) {
    window.open(ref.url, '_blank', 'noopener,noreferrer');
  } else if (ref.doi) {
    window.open(`https://doi.org/${ref.doi}`, '_blank', 'noopener,noreferrer');
  } else if (ref.pmid) {
    window.open(`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}`, '_blank', 'noopener,noreferrer');
  }
};

const ScientificReferences: React.FC<ScientificReferencesProps> = ({
  product,
  className = '',
}) => {
  const [expandedReference, setExpandedReference] = useState<number | null>(
    null
  );

  // Ordenar por relevancia (alta > media > baja) y luego por año descendente
  const sortedRefs = useMemo(() => {
    const relevanceRank: Record<string, number> = { alta: 3, media: 2, baja: 1 };
    return (product.scientificReferences || []).slice().sort(
      (a, b) => {
        const ra = relevanceRank[a.relevance] ?? 0;
        const rb = relevanceRank[b.relevance] ?? 0;
        if (rb !== ra) return rb - ra;
        const ay =
          typeof a.year === 'number' ? a.year : parseInt(String(a.year), 10) || 0;
        const by =
          typeof b.year === 'number' ? b.year : parseInt(String(b.year), 10) || 0;
        return by - ay;
      }
    );
  }, [product.scientificReferences]);

  // Resumen por tipo y utilidades
  const countsByType = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of sortedRefs) {
      const key = (r.studyType || '').toString();
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [sortedRefs]);

  const summaryText = useMemo(() => {
    const parts: string[] = [];
    const order = [
      'ensayo-clinico',
      'meta-analisis',
      'revision-sistematica',
      'guia-clinica',
      'revision-narrativa',
      'position-stand',
      'opinion-regulatoria',
      'estudio-observacional',
      'in-vitro',
      'estudio-animal',
      'animal',
    ];
    for (const k of order) {
      const c = countsByType.get(k) || 0;
      if (c > 0) parts.push(`${c} ${displayShortType(k)}`);
    }
    for (const [k, c] of countsByType.entries()) {
      if (order.includes(k)) continue;
      if (c > 0) parts.push(`${c} ${displayStudyTypeLabel(k)}`);
    }
    return parts.join(', ');
  }, [countsByType]);

  if (
    !product.scientificReferences ||
    product.scientificReferences.length === 0
  ) {
    return null;
  }

  const copyAll = async () => {
    const lines = sortedRefs.map((ref: SciRef) => {
      const bits: string[] = [];
      const year = ref.year ? `[${ref.year}] ` : '';
      bits.push(`${year}${ref.title || ''}`.trim());
      const meta: string[] = [];
      if (ref.authors) meta.push(ref.authors);
      if (ref.journal) meta.push(ref.journal);
      if (ref.studyType) meta.push(displayStudyTypeLabel(ref.studyType));
      if (ref.relevance) meta.push(`Relevancia: ${ref.relevance}`);
      if (meta.length) bits.push(meta.join(' — '));
      const ids: string[] = [];
      if (ref.doi) ids.push(`DOI: ${ref.doi}`);
      if (ref.pmid) ids.push(`PMID: ${ref.pmid}`);
      if (ref.url) ids.push(ref.url);
      if (ids.length) bits.push(ids.join(' | '));
      return bits.join('\n');
    });
    const payload = lines.join('\n\n');
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = payload;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        // Ignore if execCommand fails
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Referencias Científicas
        </h3>
        <p className="text-gray-600 text-sm">
          Estudios científicos que respaldan la información de este producto.
          Haz clic en cada referencia para más detalles.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-xs text-gray-700">
          {summaryText && (
            <span
              className="bg-gray-100 px-2 py-1 rounded"
              title="Resumen por tipo de estudio"
            >
              {summaryText}
            </span>
          )}
        </div>
        <div>
          <button
            onClick={copyAll}
            className="inline-flex items-center px-2 py-1 text-xs bg-gray-800 text-white rounded hover:bg-black"
            title="Copiar todas las referencias"
          >
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-2"
              />
            </svg>
            Copiar referencias
          </button>
        </div>
      </div>

      <div className="space-y-4 mt-2">
        {sortedRefs.map((ref, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg transition-all duration-200 ${
              RelevanceColors[ref.relevance as keyof typeof RelevanceColors]
            } ${
              expandedReference === index
                ? 'shadow-lg'
                : 'shadow-sm hover:shadow-md'
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleReference(index, setExpandedReference, expandedReference)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${StudyTypeColors[ref.studyType]}`}
                    >
                      {displayStudyTypeLabel(ref.studyType)}
                    </span>
                    <span className="text-xs text-gray-500">{ref.year}</span>
                    {ref.sampleSize && (
                      <span className="text-xs text-gray-500">
                        n={ref.sampleSize}
                      </span>
                    )}
                    <span
                      title={
                        ref.relevance === 'alta'
                          ? 'Evidencia alta: revisiones sistemáticas/meta-análisis o ensayos clínicos robustos'
                          : ref.relevance === 'media'
                            ? 'Evidencia moderada: ensayos clínicos pequeños, estudios observacionales o mezcla de resultados'
                            : 'Evidencia limitada: preclínica, series de casos o resultados heterogéneos'
                      }
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        ref.relevance === 'alta'
                          ? 'bg-green-100 text-green-700'
                          : ref.relevance === 'media'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Relevancia {ref.relevance}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1 pr-4">
                    {ref.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{ref.authors}</span> •{' '}
                    {ref.journal}
                  </p>
                  <p className="text-sm text-gray-700">{ref.summary}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedReference === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {expandedReference === index && (
              <div className="border-t border-gray-200 p-4 bg-white bg-opacity-50">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Hallazgos Clave:
                    </h5>
                    <ul className="space-y-1">
                      {(Array.isArray(ref.keyFindings)
                        ? ref.keyFindings
                        : []
                      ).map((finding: string, findingIndex: number) => (
                        <li
                          key={findingIndex}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-green-600 mr-2 flex-shrink-0 mt-1">
                            •
                          </span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {(ref.doi || ref.pmid || ref.url) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLink(ref);
                        }}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Ver Estudio
                      </button>
                    )}
                    {ref.pmid && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        PMID: {ref.pmid}
                      </span>
                    )}
                    {ref.doi && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        DOI: {ref.doi}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm">
            <p className="text-blue-800 font-medium mb-1">
              Interpretación de Estudios
            </p>
            <p className="text-blue-700">
              Las referencias científicas se presentan con fines informativos.
              Los resultados pueden variar entre individuos. Siempre consulte
              con un profesional de la salud antes de usar este o cualquier
              suplemento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificReferences;

