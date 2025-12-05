import React from 'react';
import type { SerieTemporal } from '../../data/metricsDashboard';
import { formatMetricValue } from './metricCardUtils';

const ChartSection: React.FC<{ serie: SerieTemporal }> = ({ serie }) => {
  return (
    <article className="bg-white/90 border border-emerald-100 rounded-xl shadow-sm p-4">
      <header className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold text-emerald-900">{serie.nombre}</h4>
        <span className="text-xs text-slate-500">
          Objetivo: {serie.objetivo ?? '—'}
        </span>
      </header>

      <div className="text-sm text-slate-700">
        {/* Simple placeholder list for historical points (small, static fallback) */}
        <ul className="space-y-2">
          {serie.puntos.map((p) => (
            <li key={p.label} className="flex justify-between">
              <span className="text-slate-600">{p.label}</span>
              <strong className="text-slate-900">
                {formatMetricValue(p.valor, serie.unidad)}
              </strong>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-4 text-xs text-slate-500">
        Gráficos interactivos se pueden añadir después.
      </footer>
    </article>
  );
};

export default ChartSection;
