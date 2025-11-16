import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

interface AnalyticsPayload {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Enviar métricas al backend
 */
function sendToAnalytics({ name, value, rating, delta, id }: AnalyticsPayload) {
  const body = JSON.stringify({ name, value, rating, delta, id });
  
  // Usar sendBeacon para garantizar envío
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    });
  }
}

/**
 * Iniciar tracking de Web Vitals
 */
export function initWebVitals() {
  onCLS((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onFCP((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onLCP((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onTTFB((metric: Metric) => sendToAnalytics(formatMetric(metric)));
  onINP((metric: Metric) => sendToAnalytics(formatMetric(metric)));
}

function formatMetric(metric: Metric): AnalyticsPayload {
  return {
    name: metric.name,
    value: metric.value,
    rating: metric.rating!,
    delta: metric.delta,
    id: metric.id,
  };
}

/**
 * Log Web Vitals en consola (dev)
 */
export function logWebVitals() {
  if (import.meta.env.DEV) {
    onCLS(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
    onINP(console.log);
  }
}