import { useEffect, useRef } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

/**
 * Umbrales de Core Web Vitals según Google
 * Good: Verde | Needs Improvement: Amarillo | Poor: Rojo
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint
} as const;

/**
 * Rating de una métrica según umbrales
 */
export type MetricRating = 'good' | 'needs-improvement' | 'poor';

export const getMetricRating = (
  metricName: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): MetricRating => {
  const threshold = WEB_VITALS_THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

/**
 * Interfaz para datos de métricas procesados
 */
export interface WebVitalMetric {
  name: string;
  value: number;
  rating: MetricRating;
  delta: number;
  id: string;
  timestamp: number;
}

/**
 * Opciones para el hook useWebVitals
 */
export interface UseWebVitalsOptions {
  /**
   * Callback llamado cada vez que se reporta una métrica
   */
  onMetric?: (metric: WebVitalMetric) => void;

  /**
   * Si es true, envía métricas a analytics automáticamente
   */
  sendToAnalytics?: boolean;

  /**
   * Si es true, muestra logs en consola (solo dev)
   */
  debug?: boolean;

  /**
   * Intervalo en ms para reportar métricas periódicamente
   */
  reportInterval?: number;
}

/**
 * Hook para monitorear Core Web Vitals en tiempo real
 * 
 * Características:
 * - Monitorea LCP, FID, CLS, TTFB, INP automáticamente
 * - Rating automático (good/needs-improvement/poor)
 * - Envío opcional a analytics
 * - Debug mode para development
 * - Almacenamiento local de métricas históricas
 * 
 * @example
 * ```tsx
 * useWebVitals({
 *   onMetric: (metric) => {
 *     console.log(`${metric.name}: ${metric.value}ms (${metric.rating})`);
 *   },
 *   sendToAnalytics: true,
 *   debug: true
 * });
 * ```
 */
export const useWebVitals = (options: UseWebVitalsOptions = {}) => {
  const {
    onMetric,
    sendToAnalytics = false,
    debug = false,
    reportInterval,
  } = options;

  const metricsRef = useRef<Map<string, WebVitalMetric>>(new Map());
  const isInitialized = useRef(false);

  useEffect(() => {
    // Solo inicializar una vez
    if (isInitialized.current) return;
    isInitialized.current = true;

    /**
     * Handler universal para todas las métricas
     */
    const handleMetric = (metric: Metric) => {
      const rating = getMetricRating(
        metric.name as keyof typeof WEB_VITALS_THRESHOLDS,
        metric.value
      );

      const processedMetric: WebVitalMetric = {
        name: metric.name,
        value: Math.round(metric.value * 100) / 100, // Round to 2 decimals
        rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
      };

      // Guardar en ref para acceso posterior
      metricsRef.current.set(metric.name, processedMetric);

      // Debug logging
      if (debug) {
        console.log(
          `%c[Web Vitals] ${metric.name}`,
          `color: ${
            rating === 'good'
              ? '#10b981'
              : rating === 'needs-improvement'
              ? '#f59e0b'
              : '#ef4444'
          }; font-weight: bold`,
          {
            value: `${processedMetric.value}${metric.name === 'CLS' ? '' : 'ms'}`,
            rating,
            delta: metric.delta,
          }
        );
      }

      // Callback personalizado
      if (onMetric) {
        onMetric(processedMetric);
      }

      // Enviar a analytics
      if (sendToAnalytics) {
        sendMetricToAnalytics(processedMetric);
      }

      // Guardar en localStorage para histórico
      saveMetricToStorage(processedMetric);
    };

    // Registrar listeners para todas las métricas
    onLCP(handleMetric);
    onFCP(handleMetric);
    onCLS(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric);

    // Report periódico opcional
    let intervalId: NodeJS.Timeout | undefined;
    if (reportInterval) {
      intervalId = setInterval(() => {
        const currentMetrics = Array.from(metricsRef.current.values());
        if (debug) {
          console.log('[Web Vitals] Periodic report:', currentMetrics);
        }
      }, reportInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [onMetric, sendToAnalytics, debug, reportInterval]);

  return metricsRef.current;
};

/**
 * Envía métrica a Google Analytics (GA4)
 */
const sendMetricToAnalytics = (metric: WebVitalMetric) => {
  // Check si Google Analytics está disponible
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      non_interaction: true,
    });
  }

  // También puedes enviar a otros servicios de analytics
  // Ejemplo: Vercel Analytics, Plausible, etc.
  if ((window as any).va) {
    (window as any).va('track', 'Web Vital', {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }
};

/**
 * Guarda métrica en localStorage para histórico
 */
const saveMetricToStorage = (metric: WebVitalMetric) => {
  try {
    const STORAGE_KEY = 'puranatura_web_vitals';
    const MAX_METRICS = 100; // Mantener últimas 100 métricas

    const stored = localStorage.getItem(STORAGE_KEY);
    const metrics: WebVitalMetric[] = stored ? JSON.parse(stored) : [];

    // Añadir nueva métrica
    metrics.push(metric);

    // Mantener solo las más recientes
    if (metrics.length > MAX_METRICS) {
      metrics.splice(0, metrics.length - MAX_METRICS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch (error) {
    // Silent fail - localStorage puede estar deshabilitado
    console.debug('Failed to save metric to storage:', error);
  }
};

/**
 * Obtiene métricas históricas de localStorage
 */
export const getStoredMetrics = (): WebVitalMetric[] => {
  try {
    const STORAGE_KEY = 'puranatura_web_vitals';
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Calcula estadísticas agregadas de métricas históricas
 */
export const getMetricsStats = (metricName: string) => {
  const metrics = getStoredMetrics().filter((m) => m.name === metricName);

  if (metrics.length === 0) {
    return null;
  }

  const values = metrics.map((m) => m.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Percentil 75
  const sorted = [...values].sort((a, b) => a - b);
  const p75Index = Math.floor(sorted.length * 0.75);
  const p75 = sorted[p75Index];

  // Rating basado en promedio
  const rating = getMetricRating(
    metricName as keyof typeof WEB_VITALS_THRESHOLDS,
    avg
  );

  return {
    count: metrics.length,
    avg: Math.round(avg * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    p75: Math.round(p75 * 100) / 100,
    rating,
    lastUpdate: metrics[metrics.length - 1].timestamp,
  };
};

/**
 * Limpia métricas históricas de localStorage
 */
export const clearStoredMetrics = () => {
  try {
    const STORAGE_KEY = 'puranatura_web_vitals';
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.debug('Failed to clear stored metrics:', error);
  }
};
