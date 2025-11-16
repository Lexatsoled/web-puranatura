/**
 * Security Service
 * Comprehensive security monitoring, event logging, and incident response system
 */

import {
  SecurityEvent,
  SecurityEventType,
  SecuritySeverity,
  SecurityCategory,
  AuditTrail,
  SecurityAlert,
  SecurityMetrics,
  SecurityDashboard,
  SecurityConfiguration,
  IncidentResponse,
  SecurityReport,
} from '@/types/security';
import { logger } from '@/utils/logger';
const resolveStorage = (): Storage | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    return window.localStorage;
  } catch (error) {
    logger.error(
      'Unable to access localStorage',
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
};

const secureSetItem = async (key: string, value: string): Promise<void> => {
  const storage = resolveStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(key, value);
  } catch (error) {
    logger.error(
      `Failed to persist data for key ${key}`,
      error instanceof Error ? error : new Error(String(error))
    );
  }
};

const secureGetItem = async (key: string): Promise<string | null> => {
  const storage = resolveStorage();
  if (!storage) {
    return null;
  }
  try {
    return storage.getItem(key);
  } catch (error) {
    logger.error(
      `Failed to read persisted data for key ${key}`,
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
};

class SecurityService {
  private events: SecurityEvent[] = [];
  private auditTrails: AuditTrail[] = [];
  private alerts: SecurityAlert[] = [];
  private incidents: IncidentResponse[] = [];
  private config: SecurityConfiguration;
  private eventListeners: Map<string, ((event: SecurityEvent) => void)[]> =
    new Map();

  constructor() {
    this.config = this.getDefaultConfiguration();
    this.loadPersistedData().catch((error) => {
      logger.error(
        'Failed to load persisted security data on init',
        error instanceof Error ? error : new Error(String(error))
      );
    });
    this.initializeEventListeners();
  }

  /**
   * Log a security event
   */
  async logEvent(
    type: SecurityEventType,
    details: Record<string, unknown> = {},
    userId?: string,
    sessionId?: string,
    severity?: SecuritySeverity
  ): Promise<string> {
    const event: SecurityEvent = {
      id: this.generateId('event'),
      type,
      category: this.getCategoryFromType(type),
      severity: severity || this.getSeverityFromType(type),
      timestamp: new Date(),
      userId,
      sessionId: sessionId || this.getCurrentSessionId(),
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      resource: (details.resource as string | undefined),
      action: (details.action as string | undefined),
      details,
      metadata: {
        component: (details.component as string | undefined) || 'unknown',
        version: process.env.VITE_APP_VERSION || '1.0.0',
        environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
        correlationId: (details.correlationId as string | undefined) || this.generateCorrelationId(),
      },
      riskScore: this.calculateRiskScore(type, details),
    };

    // Add to events array
    this.events.push(event);

    // Log to existing logger with security category
    logger.security(
      `${type}: ${details.message || 'Security event occurred'}`,
      {
        eventId: event.id,
        type,
        severity: event.severity,
        userId,
        sessionId,
        ...details,
      }
    );

    // Check for alerts
    await this.checkForAlerts(event);

    // Persist events (keep only recent ones)
    this.persistEvents().catch((error) => {
      logger.error(
        'Failed to persist security event',
        error instanceof Error ? error : new Error(String(error))
      );
    });

    // Notify listeners
    this.notifyEventListeners(type, event);

    return event.id;
  }

  /**
   * Create an audit trail entry
   */
  async createAuditTrail(
    userId: string | undefined,
    action: string,
    resource: string,
    resourceType: string,
    success: boolean = true,
    oldValue?: unknown,
    newValue?: unknown,
    errorMessage?: string
  ): Promise<string> {
    const auditEntry: AuditTrail = {
      id: this.generateId('audit'),
      timestamp: new Date(),
      userId,
      action,
      resource,
      resourceType,
      oldValue,
      newValue,
      ipAddress: await this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage,
      metadata: {
        sessionId: this.getCurrentSessionId(),
        correlationId: this.generateCorrelationId(),
      },
    };

    this.auditTrails.push(auditEntry);

    // Log audit event
    await this.logEvent(
      SecurityEventType.COMPLIANCE_AUDIT_FAILED,
      {
        message: `Audit: ${action} on ${resourceType} ${resource}`,
        auditId: auditEntry.id,
        success,
        errorMessage,
      },
      userId,
      (auditEntry.metadata.sessionId as string | undefined),
      success ? SecuritySeverity.LOW : SecuritySeverity.MEDIUM
    );

    // Persist audit trails
    this.persistAuditTrails().catch((error) => {
      logger.error(
        'Failed to persist audit trail',
        error instanceof Error ? error : new Error(String(error))
      );
    });

    return auditEntry.id;
  }

  /**
   * Create a security alert
   */
  async createAlert(
    eventId: string,
    type: 'realtime' | 'threshold' | 'anomaly' | 'correlation',
    title: string,
    description: string,
    severity: SecuritySeverity,
    recommendedActions: string[] = []
  ): Promise<string> {
    const alert: SecurityAlert = {
      id: this.generateId('alert'),
      eventId,
      type,
      severity,
      title,
      description,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      escalationLevel: this.getInitialEscalationLevel(severity),
      tags: this.generateAlertTags(type, severity),
      relatedEvents: [eventId],
      recommendedActions,
    };

    this.alerts.push(alert);

    // Log alert creation
    logger.security(`Alert created: ${title}`, {
      alertId: alert.id,
      type,
      severity,
      eventId,
    });

    // Persist alerts
    this.persistAlerts().catch((error) => {
      logger.error(
        'Failed to persist security alert',
        error instanceof Error ? error : new Error(String(error))
      );
    });

    return alert.id;
  }

  /**
   * Get security dashboard data
   */
  async getDashboard(): Promise<SecurityDashboard> {
    const recentEvents = this.events
      .filter((e) => Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000) // Last 24 hours
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50);

    const activeAlerts = this.alerts.filter((a) => !a.resolved);
    const criticalAlerts = activeAlerts.filter(
      (a) => a.severity === SecuritySeverity.CRITICAL
    );

    const metrics = await this.getMetrics();

    return {
      overview: {
        totalEvents: this.events.length,
        activeAlerts: activeAlerts.length,
        criticalAlerts: criticalAlerts.length,
        riskScore: this.calculateOverallRiskScore(),
      },
      recentEvents,
      topAlerts: activeAlerts
        .sort(
          (a, b) =>
            this.getSeverityWeight(b.severity) -
            this.getSeverityWeight(a.severity)
        )
        .slice(0, 10),
      metrics,
      trends: await this.getTrends(),
    };
  }

  /**
   * Get security metrics
   */
  async getMetrics(timeRange?: {
    start: Date;
    end: Date;
  }): Promise<SecurityMetrics> {
    const range = timeRange || {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      end: new Date(),
    };

    const eventsInRange = this.events.filter(
      (e) => e.timestamp >= range.start && e.timestamp <= range.end
    );

    const alertsInRange = this.alerts.filter(
      (a) => a.timestamp >= range.start && a.timestamp <= range.end
    );

    const eventsByType = eventsInRange.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      },
      {} as Record<SecurityEventType, number>
    );

    const eventsBySeverity = eventsInRange.reduce(
      (acc, event) => {
        acc[event.severity] = (acc[event.severity] || 0) + 1;
        return acc;
      },
      {} as Record<SecuritySeverity, number>
    );

    const eventsByCategory = eventsInRange.reduce(
      (acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      },
      {} as Record<SecurityCategory, number>
    );

    return {
      totalEvents: eventsInRange.length,
      eventsByType,
      eventsBySeverity,
      eventsByCategory,
      activeAlerts: this.alerts.filter((a) => !a.resolved).length,
      resolvedAlerts: this.alerts.filter((a) => a.resolved).length,
      averageResponseTime: this.calculateAverageResponseTime(alertsInRange),
      falsePositiveRate: this.calculateFalsePositiveRate(),
      detectionAccuracy: this.calculateDetectionAccuracy(),
      timeRange: range,
    };
  }

  /**
   * Generate security report
   */
  async generateReport(
    type: 'daily' | 'weekly' | 'monthly' | 'incident',
    period: { start: Date; end: Date }
  ): Promise<SecurityReport> {
    const metrics = await this.getMetrics(period);
    const eventsInPeriod = this.events.filter(
      (e) => e.timestamp >= period.start && e.timestamp <= period.end
    );
    const alertsInPeriod = this.alerts.filter(
      (a) => a.timestamp >= period.start && a.timestamp <= period.end
    );

    const topIssues = Object.entries(metrics.eventsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([type, count]) => ({
        type: type as SecurityEventType,
        count,
        trend: this.calculateTrend(type as SecurityEventType, period),
        percentage: (count / metrics.totalEvents) * 100,
      }));

    return {
      id: this.generateId('report'),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Security Report`,
      generatedAt: new Date(),
      period,
      summary: {
        totalEvents: metrics.totalEvents,
        totalAlerts: alertsInPeriod.length,
        criticalIncidents: alertsInPeriod.filter(
          (a) => a.severity === SecuritySeverity.CRITICAL
        ).length,
        resolvedIncidents: alertsInPeriod.filter((a) => a.resolved).length,
      },
      metrics,
      topIssues,
      recommendations: await this.generateRecommendations(
        metrics,
        eventsInPeriod
      ),
      attachments: [],
    };
  }

  /**
   * Create incident response
   */
  async createIncident(
    title: string,
    description: string,
    severity: SecuritySeverity,
    relatedEvents: string[] = []
  ): Promise<string> {
    const incident: IncidentResponse = {
      id: this.generateId('incident'),
      title,
      description,
      severity,
      status: 'detected',
      createdAt: new Date(),
      updatedAt: new Date(),
      relatedEvents,
      timeline: [
        {
          timestamp: new Date(),
          action: 'Incident detected',
          details: description,
        },
      ],
      impact: {
        businessImpact:
          severity === SecuritySeverity.CRITICAL
            ? 'critical'
            : severity === SecuritySeverity.HIGH
              ? 'high'
              : 'medium',
      },
      resolution: {
        actionsTaken: [],
        preventiveMeasures: [],
        lessonsLearned: [],
      },
    };

    this.incidents.push(incident);

    // Log incident creation
    await this.logEvent(
      SecurityEventType.SYSTEM_VULNERABILITY_DETECTED,
      {
        message: `Incident created: ${title}`,
        incidentId: incident.id,
        severity,
      },
      undefined,
      undefined,
      severity
    );

    this.persistIncidents().catch((error) => {
      logger.error(
        'Failed to persist security incident',
        error instanceof Error ? error : new Error(String(error))
      );
    });

    return incident.id;
  }

  /**
   * Update security configuration
   */
  updateConfiguration(newConfig: Partial<SecurityConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    this.persistConfiguration().catch((error) => {
      logger.error(
        'Failed to persist security configuration',
        error instanceof Error ? error : new Error(String(error))
      );
    });

    logger.security('Security configuration updated', {
      changes: Object.keys(newConfig),
    });
  }

  /**
   * Get current configuration
   */
  getConfiguration(): SecurityConfiguration {
    return { ...this.config };
  }

  /**
   * Subscribe to security events
   */
  onEvent(
    eventType: SecurityEventType,
    callback: (event: SecurityEvent) => void
  ): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }

    this.eventListeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Private helper methods

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCorrelationId(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentSessionId(): string {
    return logger.getSessionId();
  }

  private async getClientIP(): Promise<string> {
    // In a real implementation, this would fetch from a service
    // For now, return a placeholder
    return 'client_ip_not_available';
  }

  private getCategoryFromType(type: SecurityEventType): SecurityCategory {
    const categoryMap: Record<SecurityEventType, SecurityCategory> = {
      [SecurityEventType.AUTH_SUCCESS]: SecurityCategory.AUTHENTICATION,
      [SecurityEventType.AUTH_FAILURE]: SecurityCategory.AUTHENTICATION,
      [SecurityEventType.AUTH_LOGOUT]: SecurityCategory.AUTHENTICATION,
      [SecurityEventType.AUTH_TOKEN_EXPIRED]: SecurityCategory.AUTHENTICATION,
      [SecurityEventType.AUTH_INVALID_TOKEN]: SecurityCategory.AUTHENTICATION,
      [SecurityEventType.API_RATE_LIMIT_EXCEEDED]:
        SecurityCategory.API_SECURITY,
      [SecurityEventType.API_CSRF_VIOLATION]: SecurityCategory.API_SECURITY,
      [SecurityEventType.API_INPUT_VALIDATION_FAILED]:
        SecurityCategory.API_SECURITY,
      [SecurityEventType.API_SANITIZATION_BYPASS]:
        SecurityCategory.API_SECURITY,
      [SecurityEventType.USER_SUSPICIOUS_ACTIVITY]:
        SecurityCategory.USER_ACTIVITY,
      [SecurityEventType.USER_MULTIPLE_FAILED_LOGINS]:
        SecurityCategory.USER_ACTIVITY,
      [SecurityEventType.USER_UNUSUAL_ACCESS_PATTERN]:
        SecurityCategory.USER_ACTIVITY,
      [SecurityEventType.USER_DATA_EXPORT]: SecurityCategory.USER_ACTIVITY,
      [SecurityEventType.SYSTEM_VULNERABILITY_DETECTED]:
        SecurityCategory.SYSTEM_SECURITY,
      [SecurityEventType.SYSTEM_INTEGRITY_CHECK_FAILED]:
        SecurityCategory.SYSTEM_SECURITY,
      [SecurityEventType.SYSTEM_CONFIGURATION_CHANGE]:
        SecurityCategory.SYSTEM_SECURITY,
      [SecurityEventType.DATA_ENCRYPTION_FAILED]:
        SecurityCategory.DATA_PROTECTION,
      [SecurityEventType.DATA_DECRYPTION_FAILED]:
        SecurityCategory.DATA_PROTECTION,
      [SecurityEventType.DATA_ACCESS_UNAUTHORIZED]:
        SecurityCategory.DATA_PROTECTION,
      [SecurityEventType.DATA_MODIFICATION_ATTEMPT]:
        SecurityCategory.DATA_PROTECTION,
      [SecurityEventType.NETWORK_SUSPICIOUS_REQUEST]:
        SecurityCategory.NETWORK_SECURITY,
      [SecurityEventType.NETWORK_DDOS_ATTEMPT]:
        SecurityCategory.NETWORK_SECURITY,
      [SecurityEventType.NETWORK_PORT_SCAN]: SecurityCategory.NETWORK_SECURITY,
      [SecurityEventType.COMPLIANCE_AUDIT_FAILED]: SecurityCategory.COMPLIANCE,
      [SecurityEventType.COMPLIANCE_DATA_RETENTION_VIOLATION]:
        SecurityCategory.COMPLIANCE,
    };

    return categoryMap[type] || SecurityCategory.SYSTEM_SECURITY;
  }

  private getSeverityFromType(type: SecurityEventType): SecuritySeverity {
    const severityMap: Record<SecurityEventType, SecuritySeverity> = {
      [SecurityEventType.AUTH_SUCCESS]: SecuritySeverity.LOW,
      [SecurityEventType.AUTH_FAILURE]: SecuritySeverity.MEDIUM,
      [SecurityEventType.AUTH_LOGOUT]: SecuritySeverity.LOW,
      [SecurityEventType.AUTH_TOKEN_EXPIRED]: SecuritySeverity.LOW,
      [SecurityEventType.AUTH_INVALID_TOKEN]: SecuritySeverity.MEDIUM,
      [SecurityEventType.API_RATE_LIMIT_EXCEEDED]: SecuritySeverity.MEDIUM,
      [SecurityEventType.API_CSRF_VIOLATION]: SecuritySeverity.HIGH,
      [SecurityEventType.API_INPUT_VALIDATION_FAILED]: SecuritySeverity.MEDIUM,
      [SecurityEventType.API_SANITIZATION_BYPASS]: SecuritySeverity.HIGH,
      [SecurityEventType.USER_SUSPICIOUS_ACTIVITY]: SecuritySeverity.HIGH,
      [SecurityEventType.USER_MULTIPLE_FAILED_LOGINS]: SecuritySeverity.HIGH,
      [SecurityEventType.USER_UNUSUAL_ACCESS_PATTERN]: SecuritySeverity.MEDIUM,
      [SecurityEventType.USER_DATA_EXPORT]: SecuritySeverity.MEDIUM,
      [SecurityEventType.SYSTEM_VULNERABILITY_DETECTED]:
        SecuritySeverity.CRITICAL,
      [SecurityEventType.SYSTEM_INTEGRITY_CHECK_FAILED]: SecuritySeverity.HIGH,
      [SecurityEventType.SYSTEM_CONFIGURATION_CHANGE]: SecuritySeverity.MEDIUM,
      [SecurityEventType.DATA_ENCRYPTION_FAILED]: SecuritySeverity.HIGH,
      [SecurityEventType.DATA_DECRYPTION_FAILED]: SecuritySeverity.HIGH,
      [SecurityEventType.DATA_ACCESS_UNAUTHORIZED]: SecuritySeverity.CRITICAL,
      [SecurityEventType.DATA_MODIFICATION_ATTEMPT]: SecuritySeverity.CRITICAL,
      [SecurityEventType.NETWORK_SUSPICIOUS_REQUEST]: SecuritySeverity.MEDIUM,
      [SecurityEventType.NETWORK_DDOS_ATTEMPT]: SecuritySeverity.CRITICAL,
      [SecurityEventType.NETWORK_PORT_SCAN]: SecuritySeverity.HIGH,
      [SecurityEventType.COMPLIANCE_AUDIT_FAILED]: SecuritySeverity.MEDIUM,
      [SecurityEventType.COMPLIANCE_DATA_RETENTION_VIOLATION]:
        SecuritySeverity.MEDIUM,
    };

    return severityMap[type] || SecuritySeverity.MEDIUM;
  }

  private calculateRiskScore(
    type: SecurityEventType,
    details: Record<string, unknown>
  ): number {
    let baseScore = 0;

    // Base score from severity
    const severity = this.getSeverityFromType(type);
    switch (severity) {
      case SecuritySeverity.LOW:
        baseScore = 1;
        break;
      case SecuritySeverity.MEDIUM:
        baseScore = 3;
        break;
      case SecuritySeverity.HIGH:
        baseScore = 7;
        break;
      case SecuritySeverity.CRITICAL:
        baseScore = 10;
        break;
    }

    // Adjust based on context
    const failedAttempts = (details as Record<string, unknown>)
      .failedAttempts as number | undefined;
    if (typeof failedAttempts === 'number' && failedAttempts > 5)
      baseScore += 2;
    if ((details as Record<string, unknown>).suspiciousPatterns) baseScore += 1;
    if ((details as Record<string, unknown>).adminAccess) baseScore += 3;

    return Math.min(baseScore, 10);
  }

  private async checkForAlerts(event: SecurityEvent): Promise<void> {
    // Check for threshold-based alerts
    if (this.config.alertRules.thresholdAlerts.enabled) {
      const threshold =
        this.config.alertRules.thresholdAlerts.thresholds[event.type];
      if (threshold) {
        const recentEvents = this.events.filter(
          (e) =>
            e.type === event.type &&
            Date.now() - e.timestamp.getTime() <
              this.config.alertRules.thresholdAlerts.timeWindow * 1000
        );

        if (recentEvents.length >= threshold) {
          await this.createAlert(
            event.id,
            'threshold',
            `Threshold exceeded for ${event.type}`,
            `${recentEvents.length} occurrences of ${event.type} in the last ${this.config.alertRules.thresholdAlerts.timeWindow} seconds`,
            event.severity,
            [`Investigate ${event.type} events`, 'Review security policies']
          );
        }
      }
    }

    // Check for correlation-based alerts
    if (this.config.alertRules.correlationRules.enabled) {
      for (const rule of this.config.alertRules.correlationRules.rules) {
        const matches = rule.conditions.every((condition) => {
          const recentEvents = this.events.filter(
            (e) =>
              e.type === condition.eventType &&
              Date.now() - e.timestamp.getTime() < condition.timeWindow * 1000
          );
          return recentEvents.length >= condition.count;
        });

        if (matches) {
          await this.createAlert(
            event.id,
            'correlation',
            rule.description,
            `Correlation rule triggered: ${rule.name}`,
            rule.severity,
            ['Investigate correlated events', 'Review system logs']
          );
        }
      }
    }
  }

  private getInitialEscalationLevel(severity: SecuritySeverity): number {
    switch (severity) {
      case SecuritySeverity.LOW:
        return 1;
      case SecuritySeverity.MEDIUM:
        return 2;
      case SecuritySeverity.HIGH:
        return 3;
      case SecuritySeverity.CRITICAL:
        return 4;
      default:
        return 1;
    }
  }

  private generateAlertTags(
    type: string,
    severity: SecuritySeverity
  ): string[] {
    const tags = [type, severity];

    if (severity === SecuritySeverity.CRITICAL) tags.push('urgent');
    if (type === 'correlation') tags.push('complex');

    return tags;
  }

  private calculateOverallRiskScore(): number {
    const recentEvents = this.events.filter(
      (e) => Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    if (recentEvents.length === 0) return 0;

    const totalRisk = recentEvents.reduce(
      (sum, event) => sum + (event.riskScore || 0),
      0
    );
    return Math.min(Math.round(totalRisk / recentEvents.length), 10);
  }

  private async getTrends(): Promise<SecurityDashboard['trends']> {
    const now = Date.now();
    const intervals = 24; // 24 hours
    const intervalSize = 60 * 60 * 1000; // 1 hour

    const eventsOverTime = [];
    const alertsOverTime = [];
    const riskScoreTrend = [];

    for (let i = intervals - 1; i >= 0; i--) {
      const intervalStart = new Date(now - (i + 1) * intervalSize);
      const intervalEnd = new Date(now - i * intervalSize);

      const eventsInInterval = this.events.filter(
        (e) => e.timestamp >= intervalStart && e.timestamp <= intervalEnd
      );

      const alertsInInterval = this.alerts.filter(
        (a) => a.timestamp >= intervalStart && a.timestamp <= intervalEnd
      );

      const avgRiskScore =
        eventsInInterval.length > 0
          ? eventsInInterval.reduce((sum, e) => sum + (e.riskScore || 0), 0) /
            eventsInInterval.length
          : 0;

      eventsOverTime.push({
        timestamp: intervalEnd,
        count: eventsInInterval.length,
        severity:
          eventsInInterval.length > 0
            ? eventsInInterval[0].severity
            : SecuritySeverity.LOW,
      });

      alertsOverTime.push({
        timestamp: intervalEnd,
        count: alertsInInterval.length,
      });

      riskScoreTrend.push({
        timestamp: intervalEnd,
        score: Math.round(avgRiskScore),
      });
    }

    return {
      eventsOverTime,
      alertsOverTime,
      riskScoreTrend,
    };
  }

  private calculateAverageResponseTime(alerts: SecurityAlert[]): number {
    const resolvedAlerts = alerts.filter(
      (a) => a.resolved && a.resolvedAt && a.timestamp
    );

    if (resolvedAlerts.length === 0) return 0;

    const totalResponseTime = resolvedAlerts.reduce((sum, alert) => {
      const responseTime =
        alert.resolvedAt!.getTime() - alert.timestamp.getTime();
      return sum + responseTime;
    }, 0);

    return totalResponseTime / resolvedAlerts.length;
  }

  private calculateFalsePositiveRate(): number {
    const resolvedAlerts = this.alerts.filter((a) => a.resolved);

    if (resolvedAlerts.length === 0) return 0;

    const falsePositives = resolvedAlerts.filter(
      (a) => a.resolved && !a.acknowledged
    ).length;
    return falsePositives / resolvedAlerts.length;
  }

  private calculateDetectionAccuracy(): number {
    // Simplified calculation - in real implementation, this would be more sophisticated
    const totalEvents = this.events.length;
    const alertedEvents = new Set(this.alerts.flatMap((a) => a.relatedEvents))
      .size;

    return totalEvents > 0 ? alertedEvents / totalEvents : 1;
  }

  private calculateTrend(
    type: SecurityEventType,
    period: { start: Date; end: Date }
  ): 'increasing' | 'decreasing' | 'stable' {
    const periodEvents = this.events.filter(
      (e) =>
        e.type === type &&
        e.timestamp >= period.start &&
        e.timestamp <= period.end
    );

    const midPoint = new Date(
      (period.start.getTime() + period.end.getTime()) / 2
    );
    const firstHalf = periodEvents.filter((e) => e.timestamp < midPoint).length;
    const secondHalf = periodEvents.filter(
      (e) => e.timestamp >= midPoint
    ).length;

    if (secondHalf > firstHalf * 1.1) return 'increasing';
    if (firstHalf > secondHalf * 1.1) return 'decreasing';
    return 'stable';
  }

  private async generateRecommendations(
    metrics: SecurityMetrics,
    _events: SecurityEvent[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    if (metrics.eventsBySeverity[SecuritySeverity.CRITICAL] > 0) {
      recommendations.push(
        'Immediate attention required for critical security events'
      );
    }

    if (
      metrics.eventsByType[SecurityEventType.USER_MULTIPLE_FAILED_LOGINS] > 10
    ) {
      recommendations.push(
        'Implement stronger authentication policies and monitoring'
      );
    }

    if (metrics.eventsByType[SecurityEventType.API_RATE_LIMIT_EXCEEDED] > 50) {
      recommendations.push(
        'Review and optimize API rate limiting configuration'
      );
    }

    if (metrics.falsePositiveRate > 0.3) {
      recommendations.push(
        'Fine-tune alert thresholds to reduce false positives'
      );
    }

    return recommendations;
  }

  private getSeverityWeight(severity: SecuritySeverity): number {
    switch (severity) {
      case SecuritySeverity.LOW:
        return 1;
      case SecuritySeverity.MEDIUM:
        return 2;
      case SecuritySeverity.HIGH:
        return 3;
      case SecuritySeverity.CRITICAL:
        return 4;
      default:
        return 1;
    }
  }

  private notifyEventListeners(
    type: SecurityEventType,
    event: SecurityEvent
  ): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          logger.error(
            'Error in security event listener',
            error instanceof Error ? error : new Error(String(error)),
            {
              eventType: type,
              eventId: event.id,
            }
          );
        }
      });
    }
  }

  private getDefaultConfiguration(): SecurityConfiguration {
    return {
      enabled: true,
      eventTypes: Object.values(SecurityEventType).reduce(
        (acc, type) => {
          acc[type] = {
            enabled: true,
            severity: this.getSeverityFromType(type),
            alertThreshold: this.getDefaultThreshold(type),
            retentionDays: 90,
          };
          return acc;
        },
        {} as SecurityConfiguration['eventTypes']
      ),
      alertRules: {
        realtimeAlerts: true,
        thresholdAlerts: {
          enabled: true,
          timeWindow: 300, // 5 minutes
          thresholds: Object.values(SecurityEventType).reduce(
            (acc, type) => {
              const threshold = this.getDefaultThreshold(type);
              if (threshold !== undefined) {
                acc[type] = threshold;
              }
              return acc;
            },
            {} as Record<SecurityEventType, number>
          ),
        },
        anomalyDetection: {
          enabled: false,
          sensitivity: 'medium',
          baselinePeriod: 7,
        },
        correlationRules: {
          enabled: true,
          rules: [],
        },
      },
      monitoring: {
        enabled: true,
        endpoints: [],
        healthChecks: true,
        metricsCollection: true,
      },
      reporting: {
        enabled: true,
        frequency: 'weekly',
        recipients: [],
        includeMetrics: true,
        includeAlerts: true,
      },
      incidentResponse: {
        enabled: true,
        escalationPolicy: [],
        automatedActions: [],
      },
    };
  }

  private getDefaultThreshold(type: SecurityEventType): number | undefined {
    const thresholds: Partial<Record<SecurityEventType, number>> = {
      [SecurityEventType.USER_MULTIPLE_FAILED_LOGINS]: 3,
      [SecurityEventType.API_RATE_LIMIT_EXCEEDED]: 5,
      [SecurityEventType.API_CSRF_VIOLATION]: 1,
    };

    return thresholds[type];
  }

  private async loadPersistedData(): Promise<void> {
    try {
      const eventsData = await secureGetItem('security_events');
      if (eventsData && typeof eventsData === 'string') {
        const arr = JSON.parse(eventsData) as Array<Record<string, unknown>>;
        this.events = arr.map((e) => ({
          ...(e as unknown as SecurityEvent),
          timestamp: new Date(String(e.timestamp)),
        }));
      }

      const auditData = await secureGetItem('security_audit_trails');
      if (auditData && typeof auditData === 'string') {
        const arr = JSON.parse(auditData) as Array<Record<string, unknown>>;
        this.auditTrails = arr.map((a) => ({
          ...(a as unknown as AuditTrail),
          timestamp: new Date(String(a.timestamp)),
        }));
      }

      const alertsData = await secureGetItem('security_alerts');
      if (alertsData && typeof alertsData === 'string') {
        const arr = JSON.parse(alertsData) as Array<Record<string, unknown>>;
        this.alerts = arr.map((a) => ({
          ...(a as unknown as SecurityAlert),
          timestamp: new Date(String(a.timestamp)),
          acknowledgedAt: (a as Record<string, unknown>).acknowledgedAt
            ? new Date(String((a as Record<string, unknown>).acknowledgedAt))
            : undefined,
          resolvedAt: (a as Record<string, unknown>).resolvedAt
            ? new Date(String((a as Record<string, unknown>).resolvedAt))
            : undefined,
        }));
      }

      const incidentsData = await secureGetItem('security_incidents');
      if (incidentsData && typeof incidentsData === 'string') {
        const arr = JSON.parse(incidentsData) as Array<Record<string, unknown>>;
        this.incidents = arr.map((i) => ({
          ...(i as unknown as IncidentResponse),
          createdAt: new Date(String((i as Record<string, unknown>).createdAt)),
          updatedAt: new Date(String((i as Record<string, unknown>).updatedAt)),
          timeline: ((i as Record<string, unknown>).timeline as Array<
            Record<string, unknown>
          >).map((t) => ({
            ...(t as Record<string, unknown>),
            timestamp: new Date(String(t.timestamp)),
          })) as IncidentResponse['timeline'],
        }));
      }

      const configData = await secureGetItem('security_config');
      if (configData && typeof configData === 'string') {
        this.config = { ...this.config, ...JSON.parse(configData) };
      }
    } catch (error) {
      logger.error(
        'Failed to load persisted security data',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async persistEvents(): Promise<void> {
    try {
      // Keep only last 1000 events
      const recentEvents = this.events.slice(-1000);
      await secureSetItem('security_events', JSON.stringify(recentEvents));
    } catch (error) {
      logger.error(
        'Failed to persist security events',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async persistAuditTrails(): Promise<void> {
    try {
      // Keep only last 5000 audit trails
      const recentTrails = this.auditTrails.slice(-5000);
      await secureSetItem(
        'security_audit_trails',
        JSON.stringify(recentTrails)
      );
    } catch (error) {
      logger.error(
        'Failed to persist audit trails',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async persistAlerts(): Promise<void> {
    try {
      await secureSetItem('security_alerts', JSON.stringify(this.alerts));
    } catch (error) {
      logger.error(
        'Failed to persist security alerts',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async persistIncidents(): Promise<void> {
    try {
      await secureSetItem('security_incidents', JSON.stringify(this.incidents));
    } catch (error) {
      logger.error(
        'Failed to persist security incidents',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async persistConfiguration(): Promise<void> {
    try {
      await secureSetItem('security_config', JSON.stringify(this.config));
    } catch (error) {
      logger.error(
        'Failed to persist security configuration',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private initializeEventListeners(): void {
    // Initialize listeners for critical events
    this.onEvent(SecurityEventType.SYSTEM_VULNERABILITY_DETECTED, (event) => {
      logger.fatal('Critical vulnerability detected', undefined, {
        eventId: event.id,
        details: event.details,
      });
    });

    this.onEvent(SecurityEventType.DATA_ACCESS_UNAUTHORIZED, (event) => {
      logger.error('Unauthorized data access attempt', undefined, {
        eventId: event.id,
        resource: event.resource,
        userId: event.userId,
      });
    });
  }
}

// Export singleton instance
export const securityService = new SecurityService();

// Export convenience functions
export const logSecurityEvent = securityService.logEvent.bind(securityService);
export const createAuditTrail =
  securityService.createAuditTrail.bind(securityService);
export const getSecurityDashboard =
  securityService.getDashboard.bind(securityService);
export const generateSecurityReport =
  securityService.generateReport.bind(securityService);

// Export types for components
export { SecurityEventType } from '@/types/security';
