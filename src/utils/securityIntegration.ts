/**
 * Security Integration Utilities
 * Integration points for security monitoring across the application
 */

import { SecurityEventType, SecuritySeverity } from '@/types/security';
import { logSecurityEvent, createAuditTrail } from '@/services/securityService';
import { logger } from '@/utils/logger';

// Authentication Security Integration
export const authSecurityIntegration = {
  // Log successful authentication
  logSuccessfulAuth: async (
    userId: string,
    method: 'login' | 'register' | 'token_refresh'
  ) => {
    await logSecurityEvent(
      SecurityEventType.AUTH_SUCCESS,
      {
        message: `User ${method} successful`,
        method,
        component: 'authService',
      },
      userId
    );
  },

  // Log failed authentication
  logFailedAuth: async (
    email: string,
    reason: string,
    attemptCount?: number
  ) => {
    const severity =
      attemptCount && attemptCount >= 3
        ? SecuritySeverity.HIGH
        : SecuritySeverity.MEDIUM;

    await logSecurityEvent(
      SecurityEventType.AUTH_FAILURE,
      {
        message: `Authentication failed: ${reason}`,
        email,
        attemptCount,
        component: 'authService',
      },
      undefined,
      undefined,
      severity
    );

    // Check for multiple failed logins
    if (attemptCount && attemptCount >= 3) {
      await logSecurityEvent(
        SecurityEventType.USER_MULTIPLE_FAILED_LOGINS,
        {
          message: `Multiple failed login attempts for ${email}`,
          email,
          attemptCount,
          component: 'authService',
        },
        undefined,
        undefined,
        SecuritySeverity.HIGH
      );
    }
  },

  // Log logout
  logLogout: async (userId: string) => {
    await logSecurityEvent(
      SecurityEventType.AUTH_LOGOUT,
      {
        message: 'User logged out',
        component: 'authService',
      },
      userId
    );
  },

  // Log token expiration
  logTokenExpired: async (userId?: string) => {
    await logSecurityEvent(
      SecurityEventType.AUTH_TOKEN_EXPIRED,
      {
        message: 'Authentication token expired',
        component: 'authService',
      },
      userId,
      undefined,
      SecuritySeverity.LOW
    );
  },
};

// API Security Integration
export const apiSecurityIntegration = {
  // Log rate limit exceeded
  logRateLimitExceeded: async (
    endpoint: string,
    userId?: string,
    _ipAddress?: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.API_RATE_LIMIT_EXCEEDED,
      {
        message: `Rate limit exceeded for ${endpoint}`,
        endpoint,
        component: 'apiClient',
      },
      userId,
      undefined,
      SecuritySeverity.MEDIUM
    );
  },

  // Log CSRF violation
  logCsrfViolation: async (
    endpoint: string,
    userId?: string,
    _ipAddress?: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.API_CSRF_VIOLATION,
      {
        message: `CSRF token validation failed for ${endpoint}`,
        endpoint,
        component: 'apiClient',
      },
      userId,
      undefined,
      SecuritySeverity.HIGH
    );
  },

  // Log input validation failure
  logValidationFailure: async (
    endpoint: string,
    field: string,
    reason: string,
    userId?: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.API_INPUT_VALIDATION_FAILED,
      {
        message: `Input validation failed: ${field} - ${reason}`,
        endpoint,
        field,
        reason,
        component: 'validationMiddleware',
      },
      userId,
      undefined,
      SecuritySeverity.MEDIUM
    );
  },

  // Log sanitization bypass attempt
  logSanitizationBypass: async (
    endpoint: string,
    field: string,
    userId?: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.API_SANITIZATION_BYPASS,
      {
        message: `Sanitization bypass attempt detected in ${field}`,
        endpoint,
        field,
        component: 'sanitizationMiddleware',
      },
      userId,
      undefined,
      SecuritySeverity.HIGH
    );
  },
};

// User Activity Security Integration
export const userActivityIntegration = {
  // Log suspicious activity
  logSuspiciousActivity: async (
    userId: string,
    activity: string,
    details: Record<string, unknown>
  ) => {
    await logSecurityEvent(
      SecurityEventType.USER_SUSPICIOUS_ACTIVITY,
      {
        message: `Suspicious activity detected: ${activity}`,
        activity,
        ...details,
        component: 'userActivityMonitor',
      },
      userId,
      undefined,
      SecuritySeverity.HIGH
    );
  },

  // Log unusual access pattern
  logUnusualAccessPattern: async (
    userId: string,
    pattern: string,
    details: Record<string, unknown>
  ) => {
    await logSecurityEvent(
      SecurityEventType.USER_UNUSUAL_ACCESS_PATTERN,
      {
        message: `Unusual access pattern: ${pattern}`,
        pattern,
        ...details,
        component: 'userActivityMonitor',
      },
      userId,
      undefined,
      SecuritySeverity.MEDIUM
    );
  },

  // Log data export
  logDataExport: async (
    userId: string,
    dataType: string,
    recordCount: number
  ) => {
    await logSecurityEvent(
      SecurityEventType.USER_DATA_EXPORT,
      {
        message: `User exported ${recordCount} ${dataType} records`,
        dataType,
        recordCount,
        component: 'dataExport',
      },
      userId,
      undefined,
      SecuritySeverity.LOW
    );
  },
};

// System Security Integration
export const systemSecurityIntegration = {
  // Log vulnerability detection
  logVulnerabilityDetected: async (
    vulnerability: string,
    severity: SecuritySeverity,
    details: Record<string, unknown>
  ) => {
    await logSecurityEvent(
      SecurityEventType.SYSTEM_VULNERABILITY_DETECTED,
      {
        message: `System vulnerability detected: ${vulnerability}`,
        vulnerability,
        ...details,
        component: 'vulnerabilityScanner',
      },
      undefined,
      undefined,
      severity
    );
  },

  // Log integrity check failure
  logIntegrityCheckFailure: async (component: string, reason: string) => {
    await logSecurityEvent(
      SecurityEventType.SYSTEM_INTEGRITY_CHECK_FAILED,
      {
        message: `Integrity check failed for ${component}: ${reason}`,
        component,
        reason,
        systemComponent: 'integrityChecker',
      },
      undefined,
      undefined,
      SecuritySeverity.HIGH
    );
  },

  // Log configuration change
  logConfigurationChange: async (
    component: string,
    change: string,
    userId?: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.SYSTEM_CONFIGURATION_CHANGE,
      {
        message: `Configuration changed: ${change}`,
        component,
        change,
        systemComponent: 'configurationManager',
      },
      userId,
      undefined,
      SecuritySeverity.MEDIUM
    );
  },
};

// Data Protection Integration
export const dataProtectionIntegration = {
  // Log encryption failure
  logEncryptionFailure: async (dataType: string, reason: string) => {
    await logSecurityEvent(
      SecurityEventType.DATA_ENCRYPTION_FAILED,
      {
        message: `Data encryption failed for ${dataType}: ${reason}`,
        dataType,
        reason,
        component: 'encryptionService',
      },
      undefined,
      undefined,
      SecuritySeverity.HIGH
    );
  },

  // Log decryption failure
  logDecryptionFailure: async (dataType: string, reason: string) => {
    await logSecurityEvent(
      SecurityEventType.DATA_DECRYPTION_FAILED,
      {
        message: `Data decryption failed for ${dataType}: ${reason}`,
        dataType,
        reason,
        component: 'decryptionService',
      },
      undefined,
      undefined,
      SecuritySeverity.HIGH
    );
  },

  // Log unauthorized data access
  logUnauthorizedAccess: async (
    resource: string,
    userId?: string,
    _ipAddress?: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.DATA_ACCESS_UNAUTHORIZED,
      {
        message: `Unauthorized access attempt to ${resource}`,
        resource,
        component: 'accessControl',
      },
      userId,
      undefined,
      SecuritySeverity.CRITICAL
    );
  },

  // Log data modification attempt
  logDataModificationAttempt: async (
    resource: string,
    operation: string,
    userId?: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.DATA_MODIFICATION_ATTEMPT,
      {
        message: `Unauthorized data modification attempt: ${operation} on ${resource}`,
        resource,
        operation,
        component: 'dataIntegrity',
      },
      userId,
      undefined,
      SecuritySeverity.CRITICAL
    );
  },
};

// Network Security Integration
export const networkSecurityIntegration = {
  // Log suspicious request
  logSuspiciousRequest: async (
    _ipAddress: string,
    endpoint: string,
    reason: string
  ) => {
    await logSecurityEvent(
      SecurityEventType.NETWORK_SUSPICIOUS_REQUEST,
      {
        message: `Suspicious network request: ${reason}`,
        endpoint,
        reason,
        component: 'networkMonitor',
      },
      undefined,
      undefined,
      SecuritySeverity.MEDIUM
    );
  },

  // Log DDoS attempt
  logDdosAttempt: async (ipAddress: string, requestCount: number) => {
    await logSecurityEvent(
      SecurityEventType.NETWORK_DDOS_ATTEMPT,
      {
        message: `DDoS attack detected from ${ipAddress}: ${requestCount} requests`,
        requestCount,
        component: 'ddosProtection',
      },
      undefined,
      undefined,
      SecuritySeverity.CRITICAL
    );
  },

  // Log port scan
  logPortScan: async (ipAddress: string, ports: number[]) => {
    await logSecurityEvent(
      SecurityEventType.NETWORK_PORT_SCAN,
      {
        message: `Port scan detected from ${ipAddress}: ports ${ports.join(', ')}`,
        ports,
        component: 'portScanner',
      },
      undefined,
      undefined,
      SecuritySeverity.HIGH
    );
  },
};

// Audit Trail Integration
export const auditIntegration = {
  // Create audit trail for user actions
  auditUserAction: async (
    userId: string | undefined,
    action: string,
    resource: string,
    resourceType: string,
    success: boolean = true,
    oldValue?: unknown,
    newValue?: unknown,
    errorMessage?: string
  ) => {
    await createAuditTrail(
      userId,
      action,
      resource,
      resourceType,
      success,
      oldValue,
      newValue,
      errorMessage
    );
  },

  // Audit admin actions
  auditAdminAction: async (
    adminId: string,
    action: string,
    resource: string,
    resourceType: string,
    changes: Record<string, unknown>
  ) => {
    await createAuditTrail(
      adminId,
      action,
      resource,
      resourceType,
      true,
      undefined,
      changes
    );

    // Also log as security event for admin actions
    await logSecurityEvent(
      SecurityEventType.USER_SUSPICIOUS_ACTIVITY,
      {
        message: `Admin action performed: ${action} on ${resource}`,
        action,
        resource,
        resourceType,
        changes,
        component: 'adminAudit',
      },
      adminId,
      undefined,
      SecuritySeverity.MEDIUM
    );
  },
};

// Compliance Integration
export const complianceIntegration = {
  // Log compliance audit failure
  logComplianceFailure: async (
    checkType: string,
    reason: string,
    severity: SecuritySeverity = SecuritySeverity.MEDIUM
  ) => {
    await logSecurityEvent(
      SecurityEventType.COMPLIANCE_AUDIT_FAILED,
      {
        message: `Compliance check failed: ${checkType} - ${reason}`,
        checkType,
        reason,
        component: 'complianceChecker',
      },
      undefined,
      undefined,
      severity
    );
  },

  // Log data retention violation
  logRetentionViolation: async (
    dataType: string,
    recordAge: number,
    policyAge: number
  ) => {
    await logSecurityEvent(
      SecurityEventType.COMPLIANCE_DATA_RETENTION_VIOLATION,
      {
        message: `Data retention policy violated: ${dataType} record age ${recordAge} days exceeds policy ${policyAge} days`,
        dataType,
        recordAge,
        policyAge,
        component: 'retentionPolicy',
      },
      undefined,
      undefined,
      SecuritySeverity.MEDIUM
    );
  },
};

// Global security event handlers
export const setupGlobalSecurityHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logSecurityEvent(
      SecurityEventType.SYSTEM_VULNERABILITY_DETECTED,
      {
        message: 'Unhandled promise rejection',
        reason: event.reason?.toString(),
        component: 'globalErrorHandler',
      },
      undefined,
      undefined,
      SecuritySeverity.HIGH
    ).catch((err) => logger.error('Failed to log unhandled rejection', err));
  });

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    logSecurityEvent(
      SecurityEventType.SYSTEM_INTEGRITY_CHECK_FAILED,
      {
        message: `JavaScript error: ${event.message}`,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        component: 'globalErrorHandler',
      },
      undefined,
      undefined,
      SecuritySeverity.MEDIUM
    ).catch((err) => logger.error('Failed to log JavaScript error', err));
  });

  // Monitor for suspicious DOM manipulation
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        const scripts = Array.from(mutation.addedNodes)
          .filter((node) => node.nodeType === Node.ELEMENT_NODE)
          .filter(
            (node) =>
              (node as Element).tagName === 'SCRIPT' &&
              !(node as Element).hasAttribute('data-trusted')
          );

        if (scripts.length > 0) {
          logSecurityEvent(
            SecurityEventType.SYSTEM_VULNERABILITY_DETECTED,
            {
              message: 'Suspicious script injection detected',
              scripts: scripts.length,
              component: 'domMonitor',
            },
            undefined,
            undefined,
            SecuritySeverity.CRITICAL
          ).catch((err) => logger.error('Failed to log script injection', err));
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

// Initialize global security handlers
if (typeof window !== 'undefined') {
  setupGlobalSecurityHandlers();
}
