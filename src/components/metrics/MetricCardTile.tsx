import React from 'react';

interface MetricCardTileProps {
  metric: any;
}

const MetricCardTile: React.FC<MetricCardTileProps> = ({ metric }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
      <h3 className="font-semibold text-gray-700">{metric.nombre}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-bold text-emerald-600">
          {metric.actual} {metric.unidad}
        </p>
        <span className="ml-2 text-sm text-gray-500">
          / {metric.objetivo} {metric.unidad}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        {metric.comentario || 'Sin comentarios'}
      </p>
    </div>
  );
};

export default MetricCardTile;
