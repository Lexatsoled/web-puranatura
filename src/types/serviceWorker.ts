/**
 * Service Worker Types and Interfaces
 * Enhanced PWA functionality with background sync and push notifications
 */

export interface BackgroundSyncRequest {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: NotificationAction[];
  data?: unknown;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface ServiceWorkerMessage {
  type:
    | 'BACKGROUND_SYNC_SUCCESS'
    | 'BACKGROUND_SYNC_FAILED'
    | 'PUSH_RECEIVED'
    | 'NOTIFICATION_CLICKED';
  payload?: unknown;
}

export interface BackgroundSyncOptions {
  maxRetries?: number;
  backoffMultiplier?: number;
  initialDelay?: number;
}

export interface PushSubscriptionOptions {
  userVisibleOnly: boolean;
  applicationServerKey: string;
}

export interface ServiceWorkerState {
  isRegistered: boolean;
  isActive: boolean;
  hasBackgroundSync: boolean;
  hasPushSupport: boolean;
  isSubscribed: boolean;
  backgroundSyncQueue: BackgroundSyncRequest[];
}
