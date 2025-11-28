import {
  Counter,
  Gauge,
  Histogram,
  Summary,
  register,
  collectDefaultMetrics,
} from 'prom-client';

const REQUEST_LABELS = ['method', 'route', 'status', 'traceId'] as const;
const ROUTE_LABELS = ['method', 'route'] as const;

let totalRequests = 0;
let totalErrors = 0;

const errorRateGauge = new Gauge({
  name: 'http_request_error_rate_percentage',
  help: 'Porcentaje de errores 5xx sobre el total de peticiones',
});

const updateErrorRateGauge = (gauge: Gauge) => {
  if (totalRequests === 0) {
    gauge.set(0);
    return;
  }
  const rate = (totalErrors / totalRequests) * 100;
  gauge.set(rate);
};

export const requestDurationHistogram = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duración de las peticiones HTTP en segundos',
  labelNames: REQUEST_LABELS as unknown as string[],
  buckets: [0.01, 0.05, 0.1, 0.3, 1, 2, 5],
});

export const requestDurationSummary = new Summary({
  name: 'http_request_duration_seconds_summary',
  help: 'Resumen de latencias de peticiones HTTP (quintiles históricos)',
  labelNames: REQUEST_LABELS as unknown as string[],
  percentiles: [0.5, 0.9, 0.95, 0.99],
});

export const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total de solicitudes HTTP procesadas',
  labelNames: REQUEST_LABELS as unknown as string[],
});

export const errorCounter = new Counter({
  name: 'http_request_errors_total',
  help: 'Solicitudes HTTP que terminaron con código >=500',
  labelNames: ['method', 'route', 'status'],
});

export const cspReportsCounter = new Counter({
  name: 'csp_reports_total',
  help: 'Total de informes CSP recibidos',
  labelNames: [
    'violated_directive',
    'blocked_uri',
    'report_only',
  ] as unknown as string[],
});

export const cspReportsBlockedCounter = new Counter({
  name: 'csp_reports_blocked_total',
  help: 'Total de informes CSP que corresponden a peticiones bloqueadas (posible ataque)',
  labelNames: ['blocked_uri'] as unknown as string[],
});

export const inFlightGauge = new Gauge({
  name: 'http_requests_in_flight',
  help: 'Cantidad de solicitudes HTTP en curso',
});

export const requestQueueHistogram = new Histogram({
  name: 'http_request_queue_duration_seconds',
  help: 'Tiempo en cola antes de procesar la solicitud',
  labelNames: ROUTE_LABELS as unknown as string[],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1],
});

export const recordRequest = () => {
  totalRequests += 1;
  updateErrorRateGauge(errorRateGauge);
};

export const recordError = () => {
  totalErrors += 1;
  updateErrorRateGauge(errorRateGauge);
};

// collect defaults on the default register so /metrics works out of the box
collectDefaultMetrics({ register });

export default register;
