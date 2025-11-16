export type Severity = 'warning' | 'error' | 'critical';

export interface PerformanceAlertConfig {
  metric: string;
  threshold: number;
  minSamples: number;
  message: string;
  severity: Severity;
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  message: string;
  severity: Severity;
  timestamp: number;
  currentValue: number;
  baselineValue: number;
  percentageChange: number;
  url: string;
}

export const DEFAULT_PERFORMANCE_ALERTS: PerformanceAlertConfig[] = [
  {
    metric: 'LCP',
    threshold: 20,
    minSamples: 5,
    message:
      '{metric} increased by {change}% (Current: {current}ms, Baseline: {baseline}ms)',
    severity: 'warning',
  },
  {
    metric: 'FID',
    threshold: 50,
    minSamples: 3,
    message:
      '{metric} increased by {change}% (Current: {current}ms, Baseline: {baseline}ms)',
    severity: 'error',
  },
  {
    metric: 'CLS',
    threshold: 100,
    minSamples: 5,
    message:
      '{metric} increased by {change}% (Current: {current}, Baseline: {baseline})',
    severity: 'critical',
  },
];

export const sendAlertToMonitoring = (alert: PerformanceAlert) => {
  const w = window as unknown as {
    Sentry?: { captureMessage: (msg: string, opts?: Record<string, unknown>) => void };
  };

  if (w.Sentry) {
    w.Sentry.captureMessage(`Performance Regression: ${alert.message}`, {
      level:
        alert.severity === 'critical'
          ? 'fatal'
          : alert.severity === 'error'
            ? 'error'
            : 'warning',
      tags: { metric: alert.metric, severity: alert.severity },
      extra: {
        currentValue: alert.currentValue,
        baselineValue: alert.baselineValue,
        percentageChange: alert.percentageChange,
        url: alert.url,
      },
    });
  }

  const webhookUrl = import.meta.env.VITE_PERFORMANCE_WEBHOOK_URL as string | undefined;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    }).catch(() => {
      // Error silenciado - webhook de alertas no crítico
    });
  }
};

