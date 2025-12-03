import React from 'react';

type Props = {
  count: number;
  max: number;
  showDifferences: boolean;
  toggleDifferences: () => void;
};

export const CompareHeader: React.FC<Props> = ({
  count,
  max,
  showDifferences,
  toggleDifferences,
}) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Comparar Productos ({count}/{max})
    </h2>
    {count >= 2 && (
      <button
        onClick={toggleDifferences}
        className="text-green-600 hover:text-green-700 font-medium flex items-center"
      >
        {showDifferences ? 'Mostrar Todo' : 'Mostrar Diferencias'}
        <svg
          className="w-4 h-4 ml-1"
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
      </button>
    )}
  </div>
);
