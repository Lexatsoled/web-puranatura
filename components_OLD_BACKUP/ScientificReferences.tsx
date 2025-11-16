/**
 * Componente: ScientificReferences
 * Propósito: Mostrar en formato expandible las referencias científicas asociadas a un producto,
 *            con enlaces a DOI/PMID/URL cuando existan.
 * Entradas: product (con scientificReferences) y className opcional.
 * Comportamiento: Si no hay referencias, presenta un estado informativo.
 */
import React, { useState } from 'react';
import { Product } from '../src/types/product';

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
};

const StudyTypeLabels: Record<string, string> = {
  'ensayo-clinico': 'Ensayo Clínico',
  'revision-sistematica': 'Revisión Sistemática',
  'meta-analisis': 'Meta-análisis',
  'estudio-observacional': 'Estudio Observacional',
  'in-vitro': 'Estudio In Vitro',
  animal: 'Estudio Animal',
};

const RelevanceColors: Record<string, string> = {
  alta: 'bg-green-100 text-green-800 border-green-200',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  baja: 'bg-gray-100 text-gray-800 border-gray-200',
};

const ScientificReferences: React.FC<ScientificReferencesProps> = ({
  product,
  className = '',
}) => {
  const [expandedReference, setExpandedReference] = useState<number | null>(
    null
  );

  if (
    !product.scientificReferences ||
    product.scientificReferences.length === 0
  ) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium">Referencias Científicas</p>
          <p className="text-sm mt-2">
            Las referencias científicas para este producto están siendo
            recopiladas y serán añadidas pronto.
          </p>
        </div>
      </div>
    );
  }

  const toggleReference = (index: number) => {
    setExpandedReference(expandedReference === index ? null : index);
  };

  const openLink = (ref: {
    doi?: string;
    pmid?: string;
    url?: string;
  }) => {
    let url = '';
    if (ref.doi) url = `https://doi.org/${ref.doi}`;
    else if (ref.pmid) url = `https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`;
    else if (ref.url) url = ref.url;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
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
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Referencias Científicas
        </h3>
        <p className="text-gray-600 text-sm">
          Estudios científicos que respaldan la información de este producto.
          Haz clic en cada referencia para más detalles.
        </p>
      </div>

      <div className="space-y-4">
        {product.scientificReferences.map((ref, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg transition-all duration-200 ${RelevanceColors[ref.relevance]} ${expandedReference === index ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleReference(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${StudyTypeColors[ref.studyType]}`}
                    >
                      {StudyTypeLabels[ref.studyType]}
                    </span>
                    <span className="text-xs text-gray-500">{ref.year}</span>
                    {ref.sampleSize && (
                      <span className="text-xs text-gray-500">
                        n={ref.sampleSize}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${ref.relevance === 'alta' ? 'bg-green-100 text-green-700' : ref.relevance === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Relevancia {ref.relevance}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1 pr-4">
                    {ref.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{ref.authors}</span> ·{' '}
                    {ref.journal}
                  </p>
                  <p className="text-sm text-gray-700">{ref.summary}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedReference === index ? 'rotate-180' : ''}`}
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
                      {ref.keyFindings.map((finding: string, i: number) => (
                        <li
                          key={i}
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
