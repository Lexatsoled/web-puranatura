import React from 'react';
import { MetricCard } from '../../data/metricsDashboard';
import { formatMetricValue, getMetricBadge } from './metricCardUtils';

interface MetricCardTileProps {
  metric: MetricCard;
}

const MetricCardTile: React.FC<MetricCardTileProps> = ({ metric }) => {
  const badge = getMetricBadge(metric);

  return (
    <article className="bg-white/90 border border-emerald-100 rounded-xl shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-emerald-900">
          {metric.nombre}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
        >
          {badge.label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">
          {formatMetricValue(metric.actual, metric.unidad)}
        </span>
        <span className="text-sm text-slate-500">
          Objetivo {formatMetricValue(metric.objetivo, metric.unidad)}
        </span>
      </div>
      <p className="text-sm text-slate-600 leading-snug">{metric.comentario}</p>
      <dl className="text-xs text-slate-500 grid grid-cols-2 gap-2 mt-auto">
        <div>
          <dt className="font-semibold">Fuente</dt>
          <dd>{metric.fuente}</dd>
        </div>
        <div>
          <dt className="font-semibold">Responsable</dt>
          <dd>{metric.responsable}</dd>
        </div>
      </dl>
    </article>
  );
};

export default MetricCardTile;
