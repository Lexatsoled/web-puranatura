import React, { Suspense } from 'react';
import {
  metricCards,
  MetricCard,
  seriesTemporales,
  SerieTemporal,
} from '../data/metricsDashboard';

const ChartSection = React.lazy(
  () => import('../components/metrics/ChartSection')
);

const formatValor = (valor: number, unidad: MetricCard['unidad']) => {
  if (unidad === 'ms') return `${Math.round(valor)} ms`;
  if (unidad === 's') return `${Number(valor).toFixed(2)} s`;
  if (unidad === 'kb') return `${Number(valor).toFixed(0)} kB`;
  if (unidad === '%') return `${Number(valor).toFixed(0)} %`;
  return `${valor}`;
};

const estadoBadge = (metric: MetricCard) => {
  const { actual, objetivo, unidad } = metric;
  const worseIsHigher = unidad !== 'ratio' && unidad !== '%';
  const enRiesgo = worseIsHigher ? actual > objetivo : actual < objetivo;
  const color = enRiesgo
    ? 'bg-red-100 text-red-700'
    : 'bg-green-100 text-green-700';
  const label = enRiesgo ? 'En riesgo' : 'OK';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
};

const MetricsDashboardPage: React.FC = () => {
  return (
    <div className="bg-emerald-50 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <header className="mb-8">
          <p className="text-sm text-emerald-700 font-semibold uppercase tracking-wide">
            Observabilidad
          </p>
          <h1 className="text-4xl font-bold text-emerald-900 leading-tight">
            Dashboard de metricas
          </h1>
          <p className="text-gray-700 mt-3 max-w-3xl">
            Seguimiento rapido de salud del frontend/BFF: LCP, bundle, auth,
            cobertura y telemetria. Los datos estan precargados con el baseline
            actual (2025-11-22) y pueden conectarse a fuentes reales (GA/APM)
            mas adelante.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-700">
            <span className="px-3 py-1 rounded-full bg-white shadow-sm border border-emerald-100">
              Fuente: reports/ + scripts locales
            </span>
            <span className="px-3 py-1 rounded-full bg-white shadow-sm border border-emerald-100">
              Objetivo Q1 2026: LCP {'<='} 2.5s / Bundle {'<='} 650 kB
            </span>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {metricCards.map((metric) => (
            <article
              key={metric.id}
              className="bg-white/90 border border-emerald-100 rounded-xl shadow-sm p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-emerald-900">
                  {metric.nombre}
                </h3>
                {estadoBadge(metric)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  {formatValor(metric.actual, metric.unidad)}
                </span>
                <span className="text-sm text-slate-500">
                  Objetivo {formatValor(metric.objetivo, metric.unidad)}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-snug">
                {metric.comentario}
              </p>
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
          ))}
        </section>

        <section className="grid lg:grid-cols-2 gap-8 mb-10">
          <Suspense
            fallback={
              <div className="text-sm text-slate-600">Cargando graficos...</div>
            }
          >
            {seriesTemporales.map((serie: SerieTemporal) => (
              <ChartSection
                key={serie.id}
                serie={serie}
                formatValor={formatValor}
              />
            ))}
          </Suspense>
        </section>

        <section className="bg-white/90 border border-emerald-100 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <h3 className="text-xl font-semibold text-emerald-900">
              Instrucciones rapidas
            </h3>
            <span className="text-xs text-slate-500">
              Ejecuta estos comandos y actualiza los valores en
              `data/metricsDashboard.ts`.
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-700">
            <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
              <p className="font-semibold text-emerald-900">Lighthouse / LCP</p>
              <code className="block text-xs text-slate-800 bg-white rounded p-2 mt-1">
                npx lighthouse http://localhost:4173 --preset=desktop
                --output=json
              </code>
            </div>
            <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
              <p className="font-semibold text-emerald-900">Bundle size</p>
              <code className="block text-xs text-slate-800 bg-white rounded p-2 mt-1">
                npm run build
              </code>
            </div>
            <div className="p-3 bg-emerald-50 rounded border border-emerald-100">
              <p className="font-semibold text-emerald-900">Cobertura</p>
              <code className="block text-xs text-slate-800 bg-white rounded p-2 mt-1">
                npm run test:coverage
              </code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MetricsDashboardPage;
