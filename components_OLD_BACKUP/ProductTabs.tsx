import React, { useState } from 'react';

/**
 * Componente: ProductTabs
 * Propósito: Renderizar una navegación por pestañas accesible y su contenido asociado
 * Contexto de uso: Se utiliza en la página de producto para organizar información
 *                  en secciones como Descripción Detallada, Componentes, etc.
 * Entradas principales:
 *  - tabs: Lista de pestañas con id, etiqueta visible y contenido (ReactNode)
 *  - className: Clases opcionales para ajustar el contenedor
 * Comportamiento:
 *  - Mantiene el id de la pestaña activa en estado local
 *  - Aplica estilos de selección a la pestaña activa y oculta el resto del contenido
 * Accesibilidad:
 *  - Usa botones y marca aria-current en la pestaña activa
 */

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

const ProductTabs: React.FC<TabsProps> = ({ tabs, className = '' }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className={`w-full ${className}`}>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'} prose prose-green max-w-none`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;
