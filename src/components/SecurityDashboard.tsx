/**
 * Security Dashboard Component
 * Real-time security monitoring and incident management interface
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  SecurityEvent,
  SecurityAlert,
  SecurityDashboard as SecurityDashboardData,
} from '@/types/security';
import { securityService, SecurityEventType } from '@/services/securityService';
import { logger } from '@/utils/logger';

interface SecurityDashboardProps {
  className?: string;
  refreshInterval?: number; // in milliseconds
  showIncidents?: boolean;
  showReports?: boolean;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  className = '',
  refreshInterval = 30000, // 30 seconds
}) => {
  const [dashboardData, setDashboardData] =
    useState<SecurityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    '1h' | '24h' | '7d' | '30d'
  >('24h');
  const [selectedEventType, setSelectedEventType] = useState<
    SecurityEventType | 'all'
  >('all');

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await securityService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load security dashboard';
      setError(errorMessage);
      logger.error(
        'Failed to load security dashboard',
        err instanceof Error ? err : new Error(errorMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh dashboard
  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(loadDashboardData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Filter events based on selection
  const filteredEvents = useMemo(() => {
    if (!dashboardData) return [];

    let events = dashboardData.recentEvents;

    // Filter by time range
    const now = new Date();
    const timeRangeMap = {
      '1h': 1 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    const timeThreshold = new Date(
      now.getTime() - timeRangeMap[selectedTimeRange]
    );
    events = events.filter((event) => event.timestamp >= timeThreshold);

    // Filter by event type
    if (selectedEventType !== 'all') {
      events = events.filter((event) => event.type === selectedEventType);
    }

    return events;
  }, [dashboardData, selectedTimeRange, selectedEventType]);

  // Handle alert acknowledgment
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      // In a real implementation, this would call an API
      logger.info('Alert acknowledged', { alertId });
      await loadDashboardData(); // Refresh data
    } catch (err) {
      logger.error(
        'Failed to acknowledge alert',
        err instanceof Error ? err : new Error('Unknown error')
      );
    }
  };

  // Handle event investigation
  const handleInvestigateEvent = (event: SecurityEvent) => {
    // Open detailed event view or modal
    logger.info('Investigating security event', {
      eventId: event.id,
      type: event.type,
    });
  };

  if (loading && !dashboardData) {
    return (
      <div className={`security-dashboard loading ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            Loading security dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`security-dashboard error ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Security Dashboard Error
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={loadDashboardData}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className={`security-dashboard ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Security Dashboard
        </h1>
        <p className="text-gray-600">
          Real-time security monitoring and incident management
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <OverviewCard
          title="Total Events"
          value={dashboardData.overview.totalEvents}
          icon="📊"
          color="blue"
        />
        <OverviewCard
          title="Active Alerts"
          value={dashboardData.overview.activeAlerts}
          icon="🚨"
          color="red"
        />
        <OverviewCard
          title="Critical Alerts"
          value={dashboardData.overview.criticalAlerts}
          icon="⚠️"
          color="orange"
        />
        <OverviewCard
          title="Risk Score"
          value={`${dashboardData.overview.riskScore}/10`}
          icon="🎯"
          color={
            dashboardData.overview.riskScore > 7
              ? 'red'
              : dashboardData.overview.riskScore > 4
                ? 'yellow'
                : 'green'
          }
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedTimeRange}
          onChange={(e) =>
            setSelectedTimeRange(e.target.value as typeof selectedTimeRange)
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>

        <select
          value={selectedEventType}
          onChange={(e) =>
            setSelectedEventType(e.target.value as SecurityEventType | 'all')
          }
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Event Types</option>
          {Object.values(SecurityEventType).map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>

        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Security Events</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No events found for the selected filters
              </p>
            ) : (
              filteredEvents.map((event) => (
                <SecurityEventItem
                  key={event.id}
                  event={event}
                  onInvestigate={handleInvestigateEvent}
                />
              ))
            )}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Active Security Alerts</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dashboardData.topAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active alerts</p>
            ) : (
              dashboardData.topAlerts.map((alert) => (
                <SecurityAlertItem
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={handleAcknowledgeAlert}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Security Trends Chart Placeholder */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Security Trends</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">
            Security trends chart would be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

// Overview Card Component
interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'red' | 'orange' | 'yellow' | 'green';
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    green: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Security Event Item Component
interface SecurityEventItemProps {
  event: SecurityEvent;
  onInvestigate: (event: SecurityEvent) => void;
}

const SecurityEventItem: React.FC<SecurityEventItemProps> = ({
  event,
  onInvestigate,
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(event.severity)}`}
            >
              {event.severity.toUpperCase()}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {event.type.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {String(event.details?.message || 'Security event occurred')}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{event.timestamp.toLocaleString()}</span>
            {event.userId && <span>User: {event.userId}</span>}
            {event.ipAddress && <span>IP: {event.ipAddress}</span>}
          </div>
        </div>
        <button
          onClick={() => onInvestigate(event)}
          className="ml-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Investigate
        </button>
      </div>
    </div>
  );
};

// Security Alert Item Component
interface SecurityAlertItemProps {
  alert: SecurityAlert;
  onAcknowledge: (alertId: string) => void;
}

const SecurityAlertItem: React.FC<SecurityAlertItemProps> = ({
  alert,
  onAcknowledge,
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(alert.severity)}`}
            >
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {alert.title}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{alert.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{alert.timestamp.toLocaleString()}</span>
            <span>Escalation: Level {alert.escalationLevel}</span>
            {!alert.acknowledged && (
              <span className="text-red-600 font-medium">Unacknowledged</span>
            )}
          </div>
        </div>
        {!alert.acknowledged && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="ml-3 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
