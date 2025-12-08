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

export const metricCards: MetricCard[] = [
  {
    id: 'lcp-home',
    nombre: 'LCP Home (desktop)',
    actual: 5.63,
    objetivo: 2.5,
    unidad: 's',
    fuente: 'reports/lighthouse-desktop.report.json',
    responsable: 'Frontend',
    comentario: 'Baseline 2025-11-20; necesita lazy y assets optimizados.',
  },
  {
    id: 'ttfb-auth',
    nombre: 'TTFB /api/auth/login',
    actual: 0.9,
    objetivo: 0.3,
    unidad: 's',
    fuente: 'k6 o trace backend (mock actual)',
    responsable: 'Backend',
    comentario: 'Reducir a 300 ms con BFF real y cache liviana.',
  },
  {
    id: 'bundle-inicial',
    nombre: 'Bundle inicial',
    actual: 650.69,
    objetivo: 650,
    unidad: 'kb',
    fuente: 'npm run build (vite)',
    responsable: 'Frontend',
    comentario: 'Se mantiene en límite; reforzar code-splitting.',
  },
  {
    id: 'coverage',
    nombre: 'Cobertura statements',
    actual: 42,
    objetivo: 80,
    unidad: '%',
    fuente: 'npm run test:coverage',
    responsable: 'QA',
    comentario: 'Falta ampliar unit + integration.',
  },
  {
    id: 'secret-leaks',
    nombre: 'Secret leaks por release',
    actual: 0,
    objetivo: 0,
    unidad: 'ratio',
    fuente: 'gitleaks detect',
    responsable: 'DevSecOps',
    comentario: 'Mantener .env ignorado y escaneos en CI.',
  },
  {
    id: 'eventos-analytics',
    nombre: 'Eventos analytics validos',
    actual: 0,
    objetivo: 95,
    unidad: '%',
    fuente: 'GA debug view (consentimiento)',
    responsable: 'Marketing Ops',
    comentario: 'Bloqueado hasta conectar GA con consentimiento real.',
  },
];

export const seriesTemporales: SerieTemporal[] = [
  {
    id: 'serie-lcp',
    nombre: 'LCP Home (s)',
    unidad: 's',
    objetivo: 2.5,
    puntos: [
      { label: 'Nov 12', valor: 6.1 },
      { label: 'Nov 18', valor: 5.9 },
      { label: 'Nov 20', valor: 5.63 },
    ],
  },
  {
    id: 'serie-bundle',
    nombre: 'Bundle inicial (kb)',
    unidad: 'kb',
    objetivo: 650,
    puntos: [
      { label: 'Nov 12', valor: 2100 },
      { label: 'Nov 18', valor: 820 },
      { label: 'Nov 21', valor: 650.69 },
    ],
  },
];
