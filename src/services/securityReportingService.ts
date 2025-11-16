/**
 * Servicio: Reporte de Seguridad
 * Propósito: Generar informes de seguridad de forma automatizada (métricas,
 *             eventos, alertas, tendencias y recomendaciones) y programarlos
 *             con distintas frecuencias (diario/semanal/mensual/incidentes).
 */

import {
  SecurityReport,
  SecurityMetrics,
  SecurityEventType,
  SecuritySeverity,
} from '@/types/security';
import { securityService } from '@/services/securityService';
import { logger } from '@/utils/logger';

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  recipients: string[];
  enabled: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'compliance';
  sections: ReportSection[];
  enabled: boolean;
}

interface ReportSection {
  id: string;
  title: string;
  type:
    | 'metrics'
    | 'events'
    | 'alerts'
    | 'trends'
    | 'recommendations'
    | 'custom';
  config: Record<string, unknown>;
}

class SecurityReportingService {
  private schedules: Map<string, ReportSchedule> = new Map();
  private templates: Map<string, ReportTemplate> = new Map();
  private reportHistory: SecurityReport[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeDefaultSchedules();
    this.startScheduler();
  }

  /**
   * Generate a security report
   */
  async generateReport(
    type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'compliance',
    period: { start: Date; end: Date },
    templateId?: string
  ): Promise<SecurityReport> {
    const template = templateId
      ? this.templates.get(templateId)
      : this.getDefaultTemplate(type);

    if (!template) {
      throw new Error(`No template found for report type: ${type}`);
    }

    const report: SecurityReport = {
      id: this.generateReportId(),
      type,
      title: this.generateReportTitle(type, period),
      generatedAt: new Date(),
      period,
      summary: await this.generateSummary(period),
      metrics: await securityService.getMetrics(period),
      topIssues: await this.identifyTopIssues(period),
      recommendations: await this.generateRecommendations(
        await securityService.getMetrics(period)
      ),
      attachments: [],
    };

    // Generate report content based on template
    report.attachments = await this.generateReportContent(report, template);

    // Store report in history
    this.reportHistory.push(report);

    // Keep only last 100 reports
    if (this.reportHistory.length > 100) {
      this.reportHistory = this.reportHistory.slice(-100);
    }

    logger.info('Security report generated', {
      reportId: report.id,
      type,
      period: `${period.start.toISOString()} - ${period.end.toISOString()}`,
    });

    return report;
  }

  /**
   * Schedule automated report generation
   */
  scheduleReport(
    id: string,
    schedule: ReportSchedule,
    _templateId?: string
  ): void {
    this.schedules.set(id, schedule);

    logger.info('Security report scheduled', {
      scheduleId: id,
      frequency: schedule.frequency,
      time: schedule.time,
      recipients: schedule.recipients.length,
    });
  }

  /**
   * Get report history
   */
  getReportHistory(
    type?: string,
    limit: number = 50,
    offset: number = 0
  ): SecurityReport[] {
    let reports = this.reportHistory;

    if (type) {
      reports = reports.filter((r) => r.type === type);
    }

    return reports
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
      .slice(offset, offset + limit);
  }

  /**
   * Export report to various formats
   */
  async exportReport(
    reportId: string,
    format: 'json' | 'csv' | 'pdf' | 'html'
  ): Promise<string> {
    const report = this.reportHistory.find((r) => r.id === reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.convertToCSV(report);
      case 'html':
        return await this.convertToHTML(report);
      case 'pdf':
        return await this.convertToPDF(report);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Send report via email (placeholder for actual email service)
   */
  async sendReport(
    reportId: string,
    recipients: string[],
    subject?: string,
  _message?: string
  ): Promise<boolean> {
    const report = this.reportHistory.find((r) => r.id === reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

  const emailSubject = subject || `Security Report: ${report.title}`;

    // In a real implementation, this would integrate with an email service
    logger.info('Security report email sent', {
      reportId,
      recipients,
      subject: emailSubject,
    });

    // Simulate email sending (console.log eliminado para cumplimiento estricto)
    return true;
  }

  // Private methods

  private initializeDefaultTemplates(): void {
    const dailyTemplate: ReportTemplate = {
      id: 'daily-default',
      name: 'Daily Security Report',
      type: 'daily',
      enabled: true,
      sections: [
        {
          id: 'overview',
          title: 'Security Overview',
          type: 'metrics',
          config: { showCharts: true },
        },
        {
          id: 'critical-events',
          title: 'Critical Security Events',
          type: 'events',
          config: { severity: 'critical', limit: 10 },
        },
        {
          id: 'active-alerts',
          title: 'Active Security Alerts',
          type: 'alerts',
          config: { status: 'active' },
        },
        {
          id: 'recommendations',
          title: 'Security Recommendations',
          type: 'recommendations',
          config: {},
        },
      ],
    };

    const weeklyTemplate: ReportTemplate = {
      id: 'weekly-default',
      name: 'Weekly Security Report',
      type: 'weekly',
      enabled: true,
      sections: [
        {
          id: 'trends',
          title: 'Security Trends',
          type: 'trends',
          config: { period: '7d' },
        },
        {
          id: 'top-issues',
          title: 'Top Security Issues',
          type: 'custom',
          config: { analysis: 'top-issues' },
        },
        {
          id: 'compliance',
          title: 'Compliance Status',
          type: 'custom',
          config: { checkType: 'compliance' },
        },
      ],
    };

    this.templates.set(dailyTemplate.id, dailyTemplate);
    this.templates.set(weeklyTemplate.id, weeklyTemplate);
  }

  private initializeDefaultSchedules(): void {
    // Daily report at 6:00 AM
    this.scheduleReport('daily-report', {
      frequency: 'daily',
      time: '06:00',
      recipients: ['security@company.com'],
      enabled: true,
    });

    // Weekly report every Monday at 9:00 AM
    this.scheduleReport('weekly-report', {
      frequency: 'weekly',
      time: '09:00',
      recipients: ['security@company.com', 'management@company.com'],
      enabled: true,
    });
  }

  private startScheduler(): void {
    // Check every minute for scheduled reports
    this.intervalId = setInterval(() => {
      this.checkScheduledReports();
    }, 60000);
  }

  private async checkScheduledReports(): Promise<void> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    for (const [id, schedule] of this.schedules) {
      if (!schedule.enabled) continue;

      let shouldRun = false;

      switch (schedule.frequency) {
        case 'daily':
          shouldRun = currentTime === schedule.time;
          break;
        case 'weekly':
          // Run on Mondays (day 1)
          shouldRun = currentDay === 1 && currentTime === schedule.time;
          break;
        case 'monthly':
          // Run on first day of month
          shouldRun = now.getDate() === 1 && currentTime === schedule.time;
          break;
      }

      if (shouldRun) {
        try {
          await this.runScheduledReport(id, schedule);
        } catch (error) {
          logger.error(
            'Failed to run scheduled report',
            error instanceof Error ? error : new Error(String(error))
          );
        }
      }
    }
  }

  private async runScheduledReport(
    id: string,
    schedule: ReportSchedule
  ): Promise<void> {
    const period = this.getReportPeriod(schedule.frequency);
    const report = await this.generateReport(schedule.frequency, period);

    await this.sendReport(report.id, schedule.recipients);

    logger.info('Scheduled security report completed', {
      scheduleId: id,
      reportId: report.id,
      recipients: schedule.recipients.length,
    });
  }

  private getReportPeriod(frequency: 'daily' | 'weekly' | 'monthly'): {
    start: Date;
    end: Date;
  } {
    const end = new Date();
    const start = new Date();

    switch (frequency) {
      case 'daily':
        start.setDate(end.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(end.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(end.getMonth() - 1);
        break;
    }

    return { start, end };
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportTitle(
    type: string,
    period: { start: Date; end: Date }
  ): string {
    const startStr = period.start.toLocaleDateString();
    const endStr = period.end.toLocaleDateString();

    return `${type.charAt(0).toUpperCase() + type.slice(1)} Security Report - ${startStr} to ${endStr}`;
  }

  private async generateSummary(period: {
    start: Date;
    end: Date;
  }): Promise<SecurityReport['summary']> {
    const metrics = await securityService.getMetrics(period);

    return {
      totalEvents: metrics.totalEvents,
      totalAlerts: Object.values(metrics.eventsBySeverity).reduce(
        (sum, count) => sum + count,
        0
      ),
      criticalIncidents:
        metrics.eventsBySeverity[SecuritySeverity.CRITICAL] || 0,
      resolvedIncidents: 0, // Would need to track resolved incidents separately
    };
  }

  private async identifyTopIssues(period: {
    start: Date;
    end: Date;
  }): Promise<SecurityReport['topIssues']> {
    const metrics = await securityService.getMetrics(period);

    return Object.entries(metrics.eventsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([type, count]) => ({
        type: type as SecurityEventType,
        count,
        trend: 'stable' as const, // Would need trend analysis
        percentage: (count / metrics.totalEvents) * 100,
      }));
  }

  private async generateRecommendations(
    metrics: SecurityMetrics
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

  private getDefaultTemplate(type: string): ReportTemplate | undefined {
    return Array.from(this.templates.values()).find(
      (t) => t.type === type && t.enabled
    );
  }

  private async generateReportContent(
    report: SecurityReport,
    template: ReportTemplate
  ): Promise<string[]> {
    const attachments: string[] = [];

    // Generate HTML report
    const htmlContent = await this.generateHTMLReport(report, template);
    attachments.push(htmlContent);

    // Generate JSON data
    const jsonContent = JSON.stringify(report, null, 2);
    attachments.push(jsonContent);

    return attachments;
  }

  private async generateHTMLReport(
    report: SecurityReport,
    _template: ReportTemplate
  ): Promise<string> {
    // Simple HTML report generation
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .section { margin-bottom: 30px; }
          .metric { display: inline-block; margin: 10px; padding: 15px; background: #e9ecef; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f8f9fa; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${report.title}</h1>
          <p>Generated: ${report.generatedAt.toLocaleString()}</p>
          <p>Period: ${report.period.start.toLocaleDateString()} - ${report.period.end.toLocaleDateString()}</p>
        </div>
    `;

    // Summary section
    html += `
      <div class="section">
        <h2>Summary</h2>
        <div class="metric">Total Events: ${report.summary.totalEvents}</div>
        <div class="metric">Total Alerts: ${report.summary.totalAlerts}</div>
        <div class="metric">Critical Incidents: ${report.summary.criticalIncidents}</div>
        <div class="metric">Resolved Incidents: ${report.summary.resolvedIncidents}</div>
      </div>
    `;

    // Top Issues section
    if (report.topIssues.length > 0) {
      html += `
        <div class="section">
          <h2>Top Security Issues</h2>
          <table>
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Count</th>
                <th>Percentage</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
      `;

      report.topIssues.forEach((issue) => {
        html += `
          <tr>
            <td>${issue.type.replace(/_/g, ' ').toUpperCase()}</td>
            <td>${issue.count}</td>
            <td>${issue.percentage.toFixed(1)}%</td>
            <td>${issue.trend}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Recommendations section
    if (report.recommendations.length > 0) {
      html += `
        <div class="section">
          <h2>Recommendations</h2>
          <ul>
      `;

      report.recommendations.forEach((rec) => {
        html += `<li>${rec}</li>`;
      });

      html += `
          </ul>
        </div>
      `;
    }

    html += `
      </body>
      </html>
    `;

    return html;
  }

  private convertToCSV(report: SecurityReport): string {
    let csv = 'Section,Metric,Value\n';

    // Summary
    csv += `Summary,Total Events,${report.summary.totalEvents}\n`;
    csv += `Summary,Total Alerts,${report.summary.totalAlerts}\n`;
    csv += `Summary,Critical Incidents,${report.summary.criticalIncidents}\n`;

    // Top Issues
    report.topIssues.forEach((issue) => {
      csv += `Top Issues,${issue.type},${issue.count}\n`;
    });

    return csv;
  }

  private async convertToHTML(report: SecurityReport): Promise<string> {
    return this.generateHTMLReport(
      report,
      this.getDefaultTemplate(report.type)!
    );
  }

  private async convertToPDF(report: SecurityReport): Promise<string> {
    // In a real implementation, this would use a PDF generation library
    // For now, return HTML that can be converted to PDF
    return this.convertToHTML(report);
  }

  private generateEmailMessage(report: SecurityReport): string {
    return `
      Security Report: ${report.title}

      Period: ${report.period.start.toLocaleDateString()} - ${report.period.end.toLocaleDateString()}

      Summary:
      - Total Events: ${report.summary.totalEvents}
      - Total Alerts: ${report.summary.totalAlerts}
      - Critical Incidents: ${report.summary.criticalIncidents}

      ${
        report.recommendations.length > 0
          ? `
      Key Recommendations:
      ${report.recommendations.map((rec) => `- ${rec}`).join('\n')}
      `
          : ''
      }

      Please review the attached report for detailed information.
    `.trim();
  }

  // Cleanup
  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Export singleton instance
export const securityReportingService = new SecurityReportingService();
