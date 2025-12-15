import generatedMetrics from './generated-metrics.json';

export interface MetricCard {
  id: string;
  nombre: string;
  actual: number;
  objetivo: number;
  unidad: 'ms' | 's' | 'kb' | '%' | 'ratio';
  fuente: string;
  responsable: string;
  comentario?: string;
}

export interface SerieTemporal {
  id: string;
  nombre: string;
  puntos: { label: string; valor: number }[];
  unidad: 'ms' | 's' | 'kb' | '%' | 'ratio';
  objetivo?: number;
}

const { metrics, history } = generatedMetrics as {
  metrics: {
    lcp: { value: number; unit: string };
    cls: { value: number; unit: string };
    tbt: { value: number; unit: string };
    fcp: { value: number; unit: string };
    bundle: { value: number; unit: string };
    coverage: { value: number; unit: string };
  };
  history: {
    lcp: { label: string; valor: number }[];
    bundle: { label: string; valor: number }[];
  };
};

export const metricCards: MetricCard[] = [
  {
    id: 'lcp-home',
    nombre: 'LCP Home',
    actual: metrics.lcp.value,
    objetivo: 2.5,
    unidad: 's',
    fuente: 'Lighthouse Desktop',
    responsable: 'Frontend',
    comentario: 'Largest Contentful Paint. Meta: < 2.5s.',
  },
  {
    id: 'cls-home',
    nombre: 'CLS Home',
    actual: metrics.cls.value,
    objetivo: 0.1,
    unidad: 'ratio',
    fuente: 'Lighthouse Desktop',
    responsable: 'Frontend',
    comentario: 'Cumulative Layout Shift. Meta: < 0.1.',
  },
  {
    id: 'tbt-home',
    nombre: 'TBT Home',
    actual: metrics.tbt.value,
    objetivo: 200,
    unidad: 'ms',
    fuente: 'Lighthouse Desktop',
    responsable: 'Frontend',
    comentario: 'Total Blocking Time. Meta: < 200ms.',
  },
  {
    id: 'fcp-home',
    nombre: 'FCP Home',
    actual: metrics.fcp.value,
    objetivo: 1.8,
    unidad: 's',
    fuente: 'Lighthouse Desktop',
    responsable: 'Frontend',
    comentario: 'First Contentful Paint. Meta: < 1.8s.',
  },
  {
    id: 'ttfb-auth',
    nombre: 'TTFB Auth',
    actual: 0.9,
    objetivo: 0.3,
    unidad: 's',
    fuente: 'Mock API',
    responsable: 'Backend',
    comentario: 'Pendiente medición real backend.',
  },
  {
    id: 'bundle-inicial',
    nombre: 'Bundle JS/CSS',
    actual: metrics.bundle.value,
    objetivo: 650,
    unidad: 'kb',
    fuente: 'Build Artifacts',
    responsable: 'Frontend',
    comentario: 'Peso total de assets en dist/.',
  },
  {
    id: 'coverage',
    nombre: 'Cobertura',
    actual: metrics.coverage.value,
    objetivo: 80,
    unidad: '%',
    fuente: 'Vitest Coverage',
    responsable: 'QA',
    comentario: 'Statements coverage.',
  },
];

export const seriesTemporales: SerieTemporal[] = [
  {
    id: 'serie-lcp',
    nombre: 'LCP Home (s)',
    unidad: 's',
    objetivo: 2.5,
    puntos: history.lcp.map((p) => ({ label: p.label, valor: p.valor })),
  },
  {
    id: 'serie-bundle',
    nombre: 'Bundle inicial (kb)',
    unidad: 'kb',
    objetivo: 650,
    puntos: history.bundle.map((p) => ({ label: p.label, valor: p.valor })),
  },
];
