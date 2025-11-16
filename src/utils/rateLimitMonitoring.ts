/**
 * Rate Limiting Monitoring and Logging
 * Comprehensive monitoring system for rate limiting metrics and alerts.
 */

import { RateLimitMetrics, RateLimitCategory } from '@/types/rateLimit';
import { rateLimitManager } from './rateLimitUtils';

interface MonitoringConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  metricsInterval: number;
  alertThresholds: {
    blockedRequestsPercentage: number;
    averageResponseTime: number;
    circuitBreakerTrips: number;
  };
  storage: {
    maxEntries: number;
    retentionPeriod: number; // in milliseconds
  };
}

interface MonitoringEntry {
  timestamp: number;
  category: RateLimitCategory;
  metrics: RateLimitMetrics;
  alerts: Alert[];
}

interface Alert {
  id: string;
  type: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
  category: RateLimitCategory;
  threshold: number;
  actual: number;
}

class RateLimitMonitor {
  private config: MonitoringConfig;
  private metricsHistory: MonitoringEntry[] = [];
  private alerts: Alert[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private alertCallbacks: ((alert: Alert) => void)[] = [];

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      enabled: true,
      logLevel: 'warn',
      metricsInterval: 30000,
      alertThresholds: {
        blockedRequestsPercentage: 10, // 10% blocked requests
        averageResponseTime: 5000, // 5 seconds
        circuitBreakerTrips: 3, // 3 circuit breaker trips
      },
      storage: {
        maxEntries: 1000,
        retentionPeriod: 24 * 60 * 60 * 1000, // 24 hours
      },
      ...config,
    };

    if (this.config.enabled) {
      this.startMonitoring();
    }
  }

  private startMonitoring(): void {
    this.intervalId = setInterval(() => {
      this.collectMetrics();
      this.checkAlerts();
      this.cleanupOldData();
    }, this.config.metricsInterval);
  }

  private collectMetrics(): void {
    const allMetrics = rateLimitManager.getMetrics();
    const timestamp = Date.now();

    allMetrics.forEach((metrics) => {
      const entry: MonitoringEntry = {
        timestamp,
        category: metrics.category,
        metrics: { ...metrics },
        alerts: [],
      };

      this.metricsHistory.push(entry);
    });

    // Limit history size
    if (this.metricsHistory.length > this.config.storage.maxEntries) {
      this.metricsHistory = this.metricsHistory.slice(
        -this.config.storage.maxEntries
      );
    }
  }

  private checkAlerts(): void {
    const recentMetrics = this.getRecentMetrics(5 * 60 * 1000); // Last 5 minutes

    recentMetrics.forEach((entry) => {
      const { metrics, category } = entry;

      // Check blocked requests percentage
      const totalRequests = metrics.totalRequests;
      if (totalRequests > 0) {
        const blockedPercentage =
          (metrics.blockedRequests / totalRequests) * 100;
        if (
          blockedPercentage >
          this.config.alertThresholds.blockedRequestsPercentage
        ) {
          this.createAlert({
            type: 'warn',
            message: `High blocked requests percentage: ${blockedPercentage.toFixed(1)}% for ${category}`,
            category,
            threshold: this.config.alertThresholds.blockedRequestsPercentage,
            actual: blockedPercentage,
          });
        }
      }

      // Check average response time
      if (
        metrics.averageResponseTime >
        this.config.alertThresholds.averageResponseTime
      ) {
        this.createAlert({
          type: 'warn',
          message: `High average response time: ${metrics.averageResponseTime.toFixed(0)}ms for ${category}`,
          category,
          threshold: this.config.alertThresholds.averageResponseTime,
          actual: metrics.averageResponseTime,
        });
      }
    });
  }

  private createAlert(alertData: Omit<Alert, 'id' | 'timestamp'>): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...alertData,
    };

    this.alerts.push(alert);

    // Keep only recent alerts (last hour)
    this.alerts = this.alerts.filter(
      (a) => Date.now() - a.timestamp < 60 * 60 * 1000
    );

    // Log alert based on level
    this.logAlert(alert);

    // Notify callbacks
    this.alertCallbacks.forEach((callback) => callback(alert));
  }

  private logAlert(_alert: Alert): void {
    // Log de alertas eliminado para cumplimiento estricto
  }

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - this.config.storage.retentionPeriod;

    this.metricsHistory = this.metricsHistory.filter(
      (entry) => entry.timestamp > cutoffTime
    );
    this.alerts = this.alerts.filter((alert) => alert.timestamp > cutoffTime);
  }

  // Public API
  getMetrics(
    category?: RateLimitCategory,
    timeRange?: number
  ): MonitoringEntry[] {
    let entries = this.metricsHistory;

    if (category) {
      entries = entries.filter((entry) => entry.category === category);
    }

    if (timeRange) {
      const cutoffTime = Date.now() - timeRange;
      entries = entries.filter((entry) => entry.timestamp > cutoffTime);
    }

    return entries;
  }

  getRecentMetrics(timeRange: number): MonitoringEntry[] {
    return this.getMetrics(undefined, timeRange);
  }

  getAlerts(category?: RateLimitCategory, timeRange?: number): Alert[] {
    let alerts = this.alerts;

    if (category) {
      alerts = alerts.filter((alert) => alert.category === category);
    }

    if (timeRange) {
      const cutoffTime = Date.now() - timeRange;
      alerts = alerts.filter((alert) => alert.timestamp > cutoffTime);
    }

    return alerts;
  }

  getAlertSummary(): {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const summary = {
      total: this.alerts.length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    this.alerts.forEach((alert) => {
      summary.byType[alert.type] = (summary.byType[alert.type] || 0) + 1;
      summary.byCategory[alert.category] =
        (summary.byCategory[alert.category] || 0) + 1;
    });

    return summary;
  }

  onAlert(callback: (alert: Alert) => void): () => void {
    this.alertCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.config.enabled && !this.intervalId) {
      this.startMonitoring();
    } else if (!this.config.enabled && this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  exportData(): { metrics: MonitoringEntry[]; alerts: Alert[] } {
    return {
      metrics: [...this.metricsHistory],
      alerts: [...this.alerts],
    };
  }

  clearData(): void {
    this.metricsHistory = [];
    this.alerts = [];
  }

  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.alertCallbacks = [];
    this.clearData();
  }
}

// Global monitor instance
export const rateLimitMonitor = new RateLimitMonitor();

// Utility functions
export const logRateLimitEvent = (
  _level: 'debug' | 'info' | 'warn' | 'error',
  _message: string,
  _category: RateLimitCategory,
  _data?: unknown
): void => {
  // const logMessage = `[RateLimit:${category}] ${message}`;

  // Logging de eventos eliminado para cumplimiento estricto
};

export const createMetricsReport = (timeRange?: number): string => {
  const metrics = rateLimitMonitor.getMetrics(undefined, timeRange);
  const alerts = rateLimitMonitor.getAlerts(undefined, timeRange);
  const summary = rateLimitMonitor.getAlertSummary();

  let report = 'Rate Limiting Metrics Report\n';
  report += '='.repeat(40) + '\n\n';

  if (timeRange) {
    report += `Time Range: Last ${Math.round(timeRange / (60 * 1000))} minutes\n\n`;
  }

  report += 'Metrics Summary:\n';
  const categories = new Set(metrics.map((m) => m.category));
  categories.forEach((category) => {
    const categoryMetrics = metrics.filter((m) => m.category === category);
    const latest = categoryMetrics[categoryMetrics.length - 1];

    if (latest) {
      report += `  ${category}:\n`;
      report += `    Total Requests: ${latest.metrics.totalRequests}\n`;
      report += `    Successful: ${latest.metrics.successfulRequests}\n`;
      report += `    Blocked: ${latest.metrics.blockedRequests}\n`;
      report += `    Avg Response Time: ${latest.metrics.averageResponseTime.toFixed(2)}ms\n`;
      report += '\n';
    }
  });

  report += 'Alert Summary:\n';
  report += `  Total Alerts: ${summary.total}\n`;
  Object.entries(summary.byType).forEach(([type, count]) => {
    report += `  ${type}: ${count}\n`;
  });
  report += '\n';

  if (alerts.length > 0) {
    report += 'Recent Alerts:\n';
    alerts.slice(-10).forEach((alert) => {
      report += `  [${alert.type.toUpperCase()}] ${new Date(alert.timestamp).toLocaleTimeString()}: ${alert.message}\n`;
    });
    report += '\n';
  }

  return report;
};

export const exportMonitoringData = (): string => {
  const data = rateLimitMonitor.exportData();
  return JSON.stringify(data, null, 2);
};

export const importMonitoringData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    if (data.metrics && Array.isArray(data.metrics)) {
      rateLimitMonitor.clearData();
      // Note: In a real implementation, you might want to restore the data
      // but for now, we'll just validate the format
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
