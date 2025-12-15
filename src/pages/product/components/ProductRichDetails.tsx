import React, { useState } from 'react';
import type { Product } from '../../../types/product';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-4 text-gray-600 space-y-4">{children}</div>}
    </div>
  );
};

interface ProductRichDetailsProps {
  product: Product;
}

export const ProductRichDetails: React.FC<ProductRichDetailsProps> = ({
  product,
}) => {
  const hasDetails = product.detailedDescription || product.mechanismOfAction;
  const hasIngredients = product.components && product.components.length > 0;
  const hasUsage = product.dosage || product.administrationMethod;
  const hasFaq = product.faqs && product.faqs.length > 0;
  const hasHealthIssues =
    product.healthIssues && product.healthIssues.length > 0;

  if (!hasDetails && !hasIngredients && !hasUsage && !hasFaq) return null;

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm p-6 md:p-8">
      {hasDetails && (
        <Section title="Descripción Detallada" defaultOpen>
          {product.detailedDescription && <p>{product.detailedDescription}</p>}
          {product.mechanismOfAction && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Mecanismo de Acción
              </h4>
              <p>{product.mechanismOfAction}</p>
            </div>
          )}
          {hasHealthIssues && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Indicado para:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {product.healthIssues?.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {hasIngredients && (
        <Section title="Ingredientes y Composición">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Componente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {product.components?.map((comp, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {comp.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {comp.amount || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {comp.description || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {hasUsage && (
        <Section title="Modo de Empleo">
          {product.dosage && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-1">
                Dosis Recomendada:
              </h4>
              <p>{product.dosage}</p>
            </div>
          )}
          {product.administrationMethod && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Administración:
              </h4>
              <p>{product.administrationMethod}</p>
            </div>
          )}
        </Section>
      )}

      {hasFaq && (
        <Section title="Preguntas Frecuentes">
          <div className="space-y-6">
            {product.faqs?.map((faq, idx) => (
              <div key={idx}>
                <h5 className="font-semibold text-gray-900 mb-1">
                  {faq.question}
                </h5>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};
