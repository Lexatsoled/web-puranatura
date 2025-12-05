import type { MetricCard } from '../../data/metricsDashboard';

type MetricUnit = MetricCard['unidad'];

export const formatMetricValue = (valor: number, unidad: MetricUnit) => {
  if (unidad === 'ms') return `${Math.round(valor)} ms`;
  if (unidad === 's') return `${Number(valor).toFixed(2)} s`;
  if (unidad === 'kb') return `${Number(valor).toFixed(0)} kB`;
  if (unidad === '%') return `${Number(valor).toFixed(0)} %`;
  return `${valor}`;
};

interface BadgeProps {
  label: string;
  color: string;
}

export const getMetricBadge = (metric: MetricCard): BadgeProps => {
  const { actual, objetivo, unidad } = metric;
  const worseIsHigher = unidad !== 'ratio' && unidad !== '%';
  const enRiesgo = worseIsHigher ? actual > objetivo : actual < objetivo;
  const color = enRiesgo
    ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';
  const label = enRiesgo ? 'En riesgo' : 'OK';
  return { label, color };
};
