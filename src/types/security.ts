// Security Types and Interfaces for Pureza-Naturalis-V3

export enum SecurityEventType {
  // Authentication & Authorization
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  AUTH_LOGOUT = 'auth_logout',
  AUTH_TOKEN_EXPIRED = 'auth_token_expired',
  AUTH_INVALID_TOKEN = 'auth_invalid_token',

  // API Security
  API_RATE_LIMIT_EXCEEDED = 'api_rate_limit_exceeded',
  API_CSRF_VIOLATION = 'api_csrf_violation',
  API_INPUT_VALIDATION_FAILED = 'api_input_validation_failed',
  API_SANITIZATION_BYPASS = 'api_sanitization_bypass',

  // User Activity
  USER_SUSPICIOUS_ACTIVITY = 'user_suspicious_activity',
  USER_MULTIPLE_FAILED_LOGINS = 'user_multiple_failed_logins',
  USER_UNUSUAL_ACCESS_PATTERN = 'user_unusual_access_pattern',
  USER_DATA_EXPORT = 'user_data_export',

  // System Security
  SYSTEM_VULNERABILITY_DETECTED = 'system_vulnerability_detected',
  SYSTEM_INTEGRITY_CHECK_FAILED = 'system_integrity_check_failed',
  SYSTEM_CONFIGURATION_CHANGE = 'system_configuration_change',

  // Data Protection
  DATA_ENCRYPTION_FAILED = 'data_encryption_failed',
  DATA_DECRYPTION_FAILED = 'data_decryption_failed',
  DATA_ACCESS_UNAUTHORIZED = 'data_access_unauthorized',
  DATA_MODIFICATION_ATTEMPT = 'data_modification_attempt',

  // Network Security
  NETWORK_SUSPICIOUS_REQUEST = 'network_suspicious_request',
  NETWORK_DDOS_ATTEMPT = 'network_ddos_attempt',
  NETWORK_PORT_SCAN = 'network_port_scan',

  // Compliance
  COMPLIANCE_AUDIT_FAILED = 'compliance_audit_failed',
  COMPLIANCE_DATA_RETENTION_VIOLATION = 'compliance_data_retention_violation',
}

export enum SecuritySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum SecurityCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  API_SECURITY = 'api_security',
  USER_ACTIVITY = 'user_activity',
  SYSTEM_SECURITY = 'system_security',
  DATA_PROTECTION = 'data_protection',
  NETWORK_SECURITY = 'network_security',
  COMPLIANCE = 'compliance',
}

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  category: SecurityCategory;
  severity: SecuritySeverity;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource?: string;
  action?: string;
  details: Record<string, unknown>;
  metadata: {
    component?: string;
    version?: string;
    environment: string;
    correlationId?: string;
  };
  riskScore?: number;
  resolved?: boolean;
  resolution?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface AuditTrail {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  resourceType: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  metadata: Record<string, unknown>;
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  type: 'realtime' | 'threshold' | 'anomaly' | 'correlation';
  severity: SecuritySeverity;
  title: string;
  description: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  escalationLevel: number;
  assignedTo?: string;
  tags: string[];
  relatedEvents: string[];
  recommendedActions: string[];
}

export interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<SecurityEventType, number>;
  eventsBySeverity: Record<SecuritySeverity, number>;
  eventsByCategory: Record<SecurityCategory, number>;
  activeAlerts: number;
  resolvedAlerts: number;
  averageResponseTime: number;
  falsePositiveRate: number;
  detectionAccuracy: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface SecurityDashboard {
  overview: {
    totalEvents: number;
    activeAlerts: number;
    criticalAlerts: number;
    riskScore: number;
  };
  recentEvents: SecurityEvent[];
  topAlerts: SecurityAlert[];
  metrics: SecurityMetrics;
  trends: {
    eventsOverTime: Array<{
      timestamp: Date;
      count: number;
      severity: SecuritySeverity;
    }>;
    alertsOverTime: Array<{ timestamp: Date; count: number }>;
    riskScoreTrend: Array<{ timestamp: Date; score: number }>;
  };
}

export interface SecurityConfiguration {
  enabled: boolean;
  eventTypes: {
    [key in SecurityEventType]: {
      enabled: boolean;
      severity: SecuritySeverity;
      alertThreshold?: number;
      retentionDays: number;
    };
  };
  alertRules: {
    realtimeAlerts: boolean;
    thresholdAlerts: {
      enabled: boolean;
      timeWindow: number; // minutes
      thresholds: Record<SecurityEventType, number>;
    };
    anomalyDetection: {
      enabled: boolean;
      sensitivity: 'low' | 'medium' | 'high';
      baselinePeriod: number; // days
    };
    correlationRules: {
      enabled: boolean;
      rules: Array<{
        name: string;
        conditions: Array<{
          eventType: SecurityEventType;
          count: number;
          timeWindow: number; // minutes
        }>;
        severity: SecuritySeverity;
        description: string;
      }>;
    };
  };
  monitoring: {
    enabled: boolean;
    endpoints: string[];
    healthChecks: boolean;
    metricsCollection: boolean;
  };
  reporting: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    includeMetrics: boolean;
    includeAlerts: boolean;
  };
  incidentResponse: {
    enabled: boolean;
    escalationPolicy: Array<{
      level: number;
      conditions: string;
      notify: string[];
      timeout: number; // minutes
    }>;
    automatedActions: Array<{
      trigger: string;
      action: string;
      parameters: Record<string, unknown>;
    }>;
  };
}

export interface IncidentResponse {
  id: string;
  title: string;
  description: string;
  severity: SecuritySeverity;
  status: 'detected' | 'investigating' | 'contained' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  relatedEvents: string[];
  timeline: Array<{
    timestamp: Date;
    action: string;
    user?: string;
    details: string;
  }>;
  impact: {
    affectedUsers?: number;
    affectedSystems?: string[];
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
    dataCompromised?: boolean;
  };
  resolution: {
    rootCause?: string;
    actionsTaken: string[];
    preventiveMeasures: string[];
    lessonsLearned: string[];
  };
}

export interface SecurityReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'compliance';
  title: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalEvents: number;
    totalAlerts: number;
    criticalIncidents: number;
    resolvedIncidents: number;
  };
  metrics: SecurityMetrics;
  topIssues: Array<{
    type: SecurityEventType;
    count: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    percentage: number;
  }>;
  recommendations: string[];
  attachments?: string[];
}
