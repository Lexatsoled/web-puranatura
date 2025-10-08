import React, { useEffect, useState } from 'react';
import {
  getStoredMetrics,
  getMetricsStats,
  WEB_VITALS_THRESHOLDS,
  clearStoredMetrics,
} from '../hooks/useWebVitals';

/**
 * WebVitalsReport - Página de reporte de métricas
 * Accesible en /admin/vitals o con ?vitals=report
 * 
 * Muestra:
 * - Resumen de métricas actuales
 * - Histórico con gráficas simples
 * - Comparación con umbrales de Google
 * - Opciones de export/clear
 */
export const WebVitalsReport: React.FC = () => {
  const [metrics, setMetrics] = useState<ReturnType<typeof getStoredMetrics>>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('LCP');

  useEffect(() => {
    setMetrics(getStoredMetrics());
  }, []);

  const metricNames = ['LCP', 'FCP', 'CLS', 'TTFB', 'INP'];
  const stats = metricNames.map((name) => ({
    name,
    stats: getMetricsStats(name),
  }));

  const handleExport = () => {
    const dataStr = JSON.stringify(metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `web-vitals-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('¿Seguro que quieres limpiar todas las métricas?')) {
      clearStoredMetrics();
      setMetrics([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Web Vitals Report
              </h1>
              <p className="text-gray-600">
                Monitoreo de Core Web Vitals · {metrics.length} métricas registradas
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                disabled={metrics.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                📥 Export JSON
              </button>
              <button
                onClick={handleClear}
                disabled={metrics.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🗑️ Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.map(({ name, stats }) => (
            <StatsCard key={name} name={name} stats={stats} />
          ))}
        </div>

        {/* Detailed View */}
        {metrics.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detalle de Métricas
            </h2>

            {/* Metric Selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {metricNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setSelectedMetric(name)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMetric === name
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Metric History */}
            <MetricHistory metricName={selectedMetric} metrics={metrics} />
          </div>
        )}

        {/* Empty State */}
        {metrics.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No hay métricas registradas
            </h2>
            <p className="text-gray-600 mb-6">
              Las métricas se recolectarán automáticamente mientras navegas por la aplicación.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ir a la aplicación
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * StatsCard - Card de resumen de una métrica
 */
interface StatsCardProps {
  name: string;
  stats: ReturnType<typeof getMetricsStats>;
}

const StatsCard: React.FC<StatsCardProps> = ({ name, stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-sm text-gray-600">No data yet</p>
      </div>
    );
  }

  const threshold = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  const rating = stats.rating;

  const ratingConfig = {
    good: { color: 'green', icon: '🟢', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    'needs-improvement': { color: 'yellow', icon: '🟡', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    poor: { color: 'red', icon: '🔴', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  }[rating];

  return (
    <div className={`rounded-lg shadow-md p-6 border-2 ${ratingConfig.bg} ${ratingConfig.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold ${ratingConfig.text}`}>{name}</h3>
        <span className="text-2xl">{ratingConfig.icon}</span>
      </div>

      <div className={`text-3xl font-bold ${ratingConfig.text} mb-2`}>
        {formatValue(name, stats.p75)}
      </div>

      <div className="text-sm text-gray-600 mb-4">
        P75 · {stats.count} samples
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-gray-600">Avg</div>
          <div className={`font-semibold ${ratingConfig.text}`}>
            {formatValue(name, stats.avg)}
          </div>
        </div>
        <div>
          <div className="text-gray-600">Range</div>
          <div className={`font-semibold ${ratingConfig.text}`}>
            {formatValue(name, stats.min)} - {formatValue(name, stats.max)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-current border-opacity-20">
        <div className="text-xs text-gray-600">
          Good: ≤{formatValue(name, threshold.good)} | Poor: ≥{formatValue(name, threshold.poor)}
        </div>
      </div>
    </div>
  );
};

/**
 * MetricHistory - Historial de una métrica específica
 */
interface MetricHistoryProps {
  metricName: string;
  metrics: ReturnType<typeof getStoredMetrics>;
}

const MetricHistory: React.FC<MetricHistoryProps> = ({ metricName, metrics }) => {
  const filtered = metrics
    .filter((m) => m.name === metricName)
    .slice(-50); // Últimas 50

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No hay datos para {metricName}
      </div>
    );
  }

  const threshold = WEB_VITALS_THRESHOLDS[metricName as keyof typeof WEB_VITALS_THRESHOLDS];
  const maxValue = Math.max(...filtered.map((m) => m.value), threshold.poor);

  return (
    <div>
      {/* Simple Bar Chart */}
      <div className="mb-6">
        <div className="flex items-end justify-between gap-1 h-48">
          {filtered.map((metric, index) => {
            const heightPercent = (metric.value / maxValue) * 100;
            const ratingColor = {
              good: 'bg-green-500',
              'needs-improvement': 'bg-yellow-500',
              poor: 'bg-red-500',
            }[metric.rating];

            return (
              <div
                key={index}
                className="flex-1 flex flex-col justify-end"
                title={`${formatValue(metricName, metric.value)} (${metric.rating})`}
              >
                <div
                  className={`${ratingColor} rounded-t transition-all hover:opacity-80`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Threshold Lines Reference */}
        <div className="mt-2 flex justify-between text-xs text-gray-600">
          <span>Sample {filtered.length - 50} - {filtered.length}</span>
          <span>
            🟢 ≤{formatValue(metricName, threshold.good)} | 
            🔴 ≥{formatValue(metricName, threshold.poor)}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Delta</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filtered.reverse().slice(0, 20).map((metric, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{filtered.length - index}</td>
                <td className="px-4 py-2 font-semibold">
                  {formatValue(metricName, metric.value)}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    metric.rating === 'good' ? 'bg-green-100 text-green-700' :
                    metric.rating === 'needs-improvement' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {metric.rating}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {formatValue(metricName, metric.delta)}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {new Date(metric.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Formatea valor de métrica
 */
const formatValue = (metricName: string, value: number): string => {
  if (metricName === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
};

export default WebVitalsReport;
