import React, { useEffect, useState } from 'react';
import {
  useWebVitals,
  WebVitalMetric,
  WEB_VITALS_THRESHOLDS,
  getMetricsStats,
  clearStoredMetrics,
} from '../hooks/useWebVitals';

/**
 * WebVitalsMonitor - Componente para visualizar Core Web Vitals en tiempo real
 *
 * Solo visible en desarrollo o con query param ?debug=vitals
 * Muestra métricas actuales + histórico
 */
export const WebVitalsMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<Map<string, WebVitalMetric>>(
    new Map()
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Check si debe mostrarse
  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const hasDebugParam =
      new URLSearchParams(window.location.search).get('debug') === 'vitals';
    setIsVisible(isDev || hasDebugParam);
  }, []);

  // Monitorear métricas
  useWebVitals({
    onMetric: (metric) => {
      setMetrics((prev) => new Map(prev).set(metric.name, metric));
    },
    debug: true,
  });

  if (!isVisible) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-[9999] bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        title="Show Web Vitals Monitor"
      >
        📊 Web Vitals
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-white border-2 border-gray-300 rounded-lg shadow-2xl w-96 max-h-[600px] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="font-bold text-sm">Web Vitals Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              clearStoredMetrics();
              window.location.reload();
            }}
            className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
            title="Clear stored metrics and reload"
          >
            Clear
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:text-gray-300 transition-colors"
            title="Minimize"
          >
            <svg
              className="w-5 h-5"
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
        </div>
      </div>

      {/* Metrics List */}
      <div className="p-4 space-y-3">
        {['LCP', 'FCP', 'CLS', 'INP', 'TBT'].map((metricName) => {
          const current = metrics.get(metricName);
          const stats = getMetricsStats(metricName);

          return (
            <MetricCard
              key={metricName}
              name={metricName}
              current={current}
              stats={stats}
            />
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-50 px-4 py-2 text-xs text-gray-600 border-t">
        💡 Tip: Métricas se guardan en localStorage. Click "Clear" para
        resetear.
      </div>
    </div>
  );
};

/**
 * MetricCard - Card individual para cada métrica
 */
interface MetricCardProps {
  name: string;
  current?: WebVitalMetric;
  stats: ReturnType<typeof getMetricsStats>;
}

const MetricCard: React.FC<MetricCardProps> = ({ name, current, stats }) => {
  const threshold =
    WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  const rating = current?.rating || stats?.rating || 'good';

  const ratingColor = {
    good: 'text-green-600 bg-green-50 border-green-200',
    'needs-improvement': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    poor: 'text-red-600 bg-red-50 border-red-200',
  }[rating];

  const ratingDot = {
    good: '🟢',
    'needs-improvement': '🟡',
    poor: '🔴',
  }[rating];

  return (
    <div className={`border-2 rounded-lg p-3 ${ratingColor} transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{ratingDot}</span>
          <div>
            <h4 className="font-bold text-sm">{name}</h4>
            <p className="text-xs opacity-70">{getMetricDescription(name)}</p>
          </div>
        </div>
      </div>

      {/* Current Value */}
      {current && (
        <div className="mb-2">
          <div className="text-2xl font-bold">
            {formatMetricValue(name, current.value)}
          </div>
          <div className="text-xs opacity-70 capitalize">
            {rating.replace('-', ' ')}
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 text-xs mt-2 pt-2 border-t border-current border-opacity-20">
          <div>
            <div className="opacity-70">Avg (n={stats.count})</div>
            <div className="font-semibold">
              {formatMetricValue(name, stats.avg)}
            </div>
          </div>
          <div>
            <div className="opacity-70">P75</div>
            <div className="font-semibold">
              {formatMetricValue(name, stats.p75)}
            </div>
          </div>
          <div>
            <div className="opacity-70">Min</div>
            <div className="font-semibold">
              {formatMetricValue(name, stats.min)}
            </div>
          </div>
          <div>
            <div className="opacity-70">Max</div>
            <div className="font-semibold">
              {formatMetricValue(name, stats.max)}
            </div>
          </div>
        </div>
      )}

      {/* Thresholds */}
      <div className="mt-2 pt-2 border-t border-current border-opacity-20">
        <div className="text-xs opacity-70">
          Good: ≤{formatMetricValue(name, threshold.good)} | Poor: ≥
          {formatMetricValue(name, threshold.poor)}
        </div>
      </div>

      {/* No data message */}
      {!current && !stats && (
        <div className="text-xs opacity-70 text-center py-4">
          Waiting for metric...
        </div>
      )}
    </div>
  );
};

/**
 * Descripción de cada métrica
 */
const getMetricDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    LCP: 'Largest Contentful Paint',
    FCP: 'First Contentful Paint',
    CLS: 'Cumulative Layout Shift',
    INP: 'Interaction to Next Paint',
    TBT: 'Total Blocking Time',
  };
  return descriptions[name] || name;
};

/**
 * Formatea valor de métrica con unidad correcta
 */
const formatMetricValue = (name: string, value: number): string => {
  if (name === 'CLS') {
    return value.toFixed(3); // CLS es sin unidad
  }
  return `${Math.round(value)}ms`;
};

export default WebVitalsMonitor;
