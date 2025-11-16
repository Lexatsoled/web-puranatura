import React, { useState } from 'react';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  className?: string;
}

/**
 * ProductTabs component for rendering accessible tab navigation and content.
 *
 * @component
 * @param {TabsProps} props - Props for ProductTabs
 * @returns {JSX.Element}
 */
const ProductTabs: React.FC<TabsProps> = ({ tabs, className = '' }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className={`w-full ${className}`}>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" role="tablist" aria-label="Información de producto">
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
              role="tab"
              aria-selected={activeTab === tab.id ? "true" : "false"}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              title={tab.label}
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
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={`${activeTab === tab.id ? 'block' : 'hidden'} prose prose-green max-w-none`}
            tabIndex={0}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;
