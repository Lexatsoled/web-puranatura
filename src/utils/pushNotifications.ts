/**
 * Push Notifications Utilities
 * Handles push notification subscriptions and management
 */

import { PushNotificationPayload } from '@/types/serviceWorker';

class PushNotificationManager {
  private vapidPublicKey: string | null = null;
  private subscription: PushSubscription | null = null;

  constructor() {
    this.loadVapidKey();
  }

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          new Error('Push notifications not supported in this browser'),
          ErrorSeverity.LOW,
          ErrorCategory.SECURITY,
          { context: 'PushNotificationManager' }
        );
      });
      return false;
    }

    try {
      const permission = await this.requestPermission();
      if (permission === 'granted') {
        await this.subscribe();
        return true;
      }
    } catch (error) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.MEDIUM,
          ErrorCategory.SECURITY,
          { context: 'PushNotificationManager', message: 'Failed to initialize push notifications' }
        );
      });
    }

    return false;
  }

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications not supported');
    }

    const permission = await Notification.requestPermission();
    import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
      errorLogger.log(
        new Error('Notification permission'),
        ErrorSeverity.LOW,
        ErrorCategory.SECURITY,
        { permission, context: 'PushNotificationManager' }
      );
    });
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported() || !this.vapidPublicKey) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          new Error('Cannot subscribe to push notifications'),
          ErrorSeverity.LOW,
          ErrorCategory.SECURITY,
          { context: 'PushNotificationManager' }
        );
      });
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const applicationServerKey: BufferSource = this.urlBase64ToUint8Array(this.vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      this.subscription = subscription;
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          new Error('Subscribed to push notifications'),
          ErrorSeverity.LOW,
          ErrorCategory.SECURITY,
          { endpoint: subscription.endpoint, context: 'PushNotificationManager' }
        );
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.MEDIUM,
          ErrorCategory.SECURITY,
          { context: 'PushNotificationManager', operation: 'subscribe' }
        );
      });
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      const result = await this.subscription.unsubscribe();
      if (result) {
        this.subscription = null;
        await this.removeSubscriptionFromServer();
      }
      return result;
    } catch (error) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.MEDIUM,
          ErrorCategory.SECURITY,
          { context: 'PushNotificationManager', operation: 'unsubscribe' }
        );
      });
      return false;
    }
  }

  /**
   * Send push notification
   */
  async sendNotification(payload: PushNotificationPayload): Promise<boolean> {
    if (!this.subscription) {
      return false;
    }

    try {
      // In a real implementation, this would send to your push service
      // For now, we'll simulate by showing a local notification
      await this.showLocalNotification(payload);
      return true;
    } catch (error) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.MEDIUM,
          ErrorCategory.SECURITY,
          { context: 'PushNotificationManager', operation: 'sendNotification' }
        );
      });
      return false;
    }
  }

  /**
   * Show local notification (fallback for testing)
   */
  private async showLocalNotification(
    payload: PushNotificationPayload
  ): Promise<void> {
    if (Notification.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/favicon-192x192.png',
      badge: payload.badge,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction,
      data: payload.data,
    });

    notification.onclick = () => {
      // Handle notification click
      window.focus();
      notification.close();

      // Dispatch custom event for the app to handle
      window.dispatchEvent(
        new CustomEvent('notificationClicked', {
          detail: payload.data,
        })
      );
    };

    // Auto-close after 5 seconds if not requiring interaction
    if (!payload.requireInteraction) {
      setTimeout(() => notification.close(), 5000);
    }
  }

  /**
   * Get current subscription status
   */
  getSubscriptionStatus() {
    return {
      isSupported: this.isSupported(),
      permission: Notification.permission,
      isSubscribed: !!this.subscription,
      endpoint: this.subscription?.endpoint,
    };
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(
    _subscription: PushSubscription
  ): Promise<void> {
    // In a real implementation, send to your backend
    // Simulate API call
    // await fetch('/api/push/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     subscription: subscription.toJSON(),
    //     userId: getCurrentUserId(), // Your user identification
    //   }),
    // });
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(): Promise<void> {
    // Simulate API call
    // await fetch('/api/push/unsubscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     endpoint: this.subscription?.endpoint,
    //   }),
    // });
  }

  /**
   * Load VAPID public key from environment
   */
  private loadVapidKey(): void {
    // In a real implementation, this would come from environment variables
    // For demo purposes, we'll use a placeholder
    this.vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || null;
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    // Forzar cast a Uint8Array estándar para compatibilidad
    return outputArray as unknown as Uint8Array;
  }
}

// Export singleton instance
export const pushNotificationManager = new PushNotificationManager();

/**
 * Helper functions
 */
export const initializePushNotifications = () =>
  pushNotificationManager.initialize();
export const subscribeToPushNotifications = () =>
  pushNotificationManager.subscribe();
export const unsubscribeFromPushNotifications = () =>
  pushNotificationManager.unsubscribe();
export const sendPushNotification = (payload: PushNotificationPayload) =>
  pushNotificationManager.sendNotification(payload);
export const getPushNotificationStatus = () =>
  pushNotificationManager.getSubscriptionStatus();
