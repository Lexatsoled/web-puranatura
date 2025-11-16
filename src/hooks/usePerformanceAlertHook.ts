import { useEffect, useRef, useCallback } from 'react';
import { getStoredMetrics, getMetricsStats } from './useWebVitals';
import {
  type PerformanceAlert,
  type PerformanceAlertConfig,
  sendAlertToMonitoring,
} from '@/utils/performance/alerts';

export const usePerformanceAlertHook = (
  configs: PerformanceAlertConfig[] = []
) => {
  const alertsRef = useRef<PerformanceAlert[]>([]);
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    const checkForRegressions = () => {
      const now = Date.now();
      if (now - lastCheckRef.current < 30000) return;
      lastCheckRef.current = now;

      configs.forEach((config) => {
        const stats = getMetricsStats(config.metric);
        if (!stats || stats.count < config.minSamples) return;

        const metrics = getStoredMetrics()
          .filter((m) => m.name === config.metric)
          .slice(-10);
        if (metrics.length < config.minSamples) return;

        const baselineValue =
          metrics.slice(0, -1).reduce((sum, m) => sum + m.value, 0) /
          (metrics.length - 1);

        const currentValue = metrics[metrics.length - 1].value;
        const percentageChange =
          ((currentValue - baselineValue) / baselineValue) * 100;

        if (percentageChange > config.threshold) {
          const alert: PerformanceAlert = {
            id: `${config.metric}_${now}`,
            metric: config.metric,
            message: config.message
              .replace('{metric}', config.metric)
              .replace('{change}', percentageChange.toFixed(1))
              .replace('{current}', currentValue.toString())
              .replace('{baseline}', baselineValue.toFixed(1)),
            severity: config.severity,
            timestamp: now,
            currentValue,
            baselineValue,
            percentageChange,
            url: window.location.href,
          };

          alertsRef.current.push(alert);
          // Eliminado console.warn para cumplimiento ultra-estricto
          sendAlertToMonitoring(alert);
        }
      });
    };

    checkForRegressions();
    const interval = setInterval(checkForRegressions, 30000);
    return () => clearInterval(interval);
  }, [configs]);

  const clearAlerts = useCallback(() => {
    alertsRef.current = [];
  }, []);

  const getActiveAlerts = useCallback(
    () => alertsRef.current.filter((a) => Date.now() - a.timestamp < 300000),
    []
  );

  return { alertsRef, clearAlerts, getActiveAlerts };
};

export default usePerformanceAlertHook;

