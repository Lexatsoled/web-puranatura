// (Mover la definición de la clase BackgroundSyncManager aquí, antes de las exportaciones)
/**
 * Background Sync Utilities
 * Handles offline requests and syncs them when connection is restored
 */

import {
  BackgroundSyncRequest,
  BackgroundSyncOptions,
} from '@/types/serviceWorker';

const DEFAULT_OPTIONS: BackgroundSyncOptions = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelay: 1000,
};

class BackgroundSyncManager {
  // ...existing code...
  private onlineListener = () => {
    this.isOnline = true;
    this.processQueue();
  };

  private offlineListener = () => {
    this.isOnline = false;
  };
  private queue: BackgroundSyncRequest[] = [];
  private isOnline = navigator.onLine;
  private syncInProgress = false;

  constructor() {
    this.loadQueueFromStorage();
    this.setupEventListeners();
  }

  /**
   * Add a request to the background sync queue
   */
  async addToQueue(
    request: Omit<BackgroundSyncRequest, 'id' | 'timestamp' | 'retryCount'>
  ): Promise<void> {
    const syncRequest: BackgroundSyncRequest = {
      ...request,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: request.maxRetries || DEFAULT_OPTIONS.maxRetries!,
    };

    this.queue.push(syncRequest);
    this.saveQueueToStorage();

    import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
      errorLogger.log(
        new Error('Added to background sync queue'),
        ErrorSeverity.LOW,
        ErrorCategory.STATE,
        { id: syncRequest.id, context: 'BackgroundSyncManager' }
      );
    });

    // Try to sync immediately if online
    if (this.isOnline && !this.syncInProgress) {
      this.processQueue();
    }
  }

  /**
   * Process the sync queue
   */
  private async processQueue(): Promise<void> {
    if (this.syncInProgress || this.queue.length === 0 || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
      errorLogger.log(
        new Error('Processing background sync queue'),
        ErrorSeverity.LOW,
        ErrorCategory.STATE,
        { context: 'BackgroundSyncManager' }
      );
    });

    const requestsToProcess = [...this.queue];

    for (const request of requestsToProcess) {
      try {
        await this.executeRequest(request);
        this.removeFromQueue(request.id);
        import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
          errorLogger.log(
            new Error('Background sync success'),
            ErrorSeverity.LOW,
            ErrorCategory.STATE,
            { id: request.id, context: 'BackgroundSyncManager' }
          );
        });
      } catch (error) {
        import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
          errorLogger.log(
            error instanceof Error ? error : new Error(String(error)),
            ErrorSeverity.MEDIUM,
            ErrorCategory.API,
            { id: request.id, context: 'BackgroundSyncManager', message: 'Background sync failed' }
          );
        });

        if (request.retryCount < request.maxRetries) {
          request.retryCount++;
          await this.scheduleRetry(request);
        } else {
          this.removeFromQueue(request.id);
          import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
            errorLogger.log(
              new Error('Removed from queue after max retries'),
              ErrorSeverity.LOW,
              ErrorCategory.STATE,
              { id: request.id, context: 'BackgroundSyncManager' }
            );
          });
        }
      }
    }

    this.syncInProgress = false;
    this.saveQueueToStorage();
  }

  /**
   * Execute a single request
   */
  private async executeRequest(request: BackgroundSyncRequest): Promise<void> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Schedule a retry with exponential backoff
   */
  private async scheduleRetry(request: BackgroundSyncRequest): Promise<void> {
    const delay =
      DEFAULT_OPTIONS.initialDelay! *
      Math.pow(DEFAULT_OPTIONS.backoffMultiplier!, request.retryCount);

    setTimeout(() => {
      this.processQueue();
    }, delay);
  }

  /**
   * Remove a request from the queue
   */
  private removeFromQueue(id: string): void {
    this.queue = this.queue.filter((req) => req.id !== id);
  }

  /**
   * Get current queue status
   */
  getQueueStatus() {
    return {
      length: this.queue.length,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      requests: this.queue.map((req) => ({
        id: req.id,
        url: req.url,
        method: req.method,
        retryCount: req.retryCount,
        timestamp: req.timestamp,
      })),
    };
  }

  /**
   * Clear the entire queue
   */
  clearQueue(): void {
    this.queue = [];
    this.saveQueueToStorage();
  }

  /**
   * Setup event listeners for online/offline events
   */
  private setupEventListeners(): void {
    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);
  }

  /**
   * Remove event listeners for online/offline events
   */
  destroy(): void {
    window.removeEventListener('online', this.onlineListener);
    window.removeEventListener('offline', this.offlineListener);
  }

  /**
   * Load queue from localStorage
   */
  private loadQueueFromStorage(): void {
    try {
      const stored = localStorage.getItem('background-sync-queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.LOW,
          ErrorCategory.STATE,
          { context: 'BackgroundSyncManager', operation: 'loadQueueFromStorage' }
        );
      });
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueueToStorage(): void {
    try {
      localStorage.setItem('background-sync-queue', JSON.stringify(this.queue));
    } catch (error) {
      import('../services/errorLogger').then(({ errorLogger, ErrorSeverity, ErrorCategory }) => {
        errorLogger.log(
          error instanceof Error ? error : new Error(String(error)),
          ErrorSeverity.LOW,
          ErrorCategory.STATE,
          { context: 'BackgroundSyncManager', operation: 'saveQueueToStorage' }
        );
      });
    }
  }


  /**
   * Generate unique ID for requests
   */
  private generateId(): string {
    return `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export destroy function for cleanup in tests or lifecycle
// Export destroy function for cleanup in tests or lifecycle
export const destroyBackgroundSyncManager = () => {
  backgroundSyncManager.destroy();
};


// Export singleton instance
export const backgroundSyncManager = new BackgroundSyncManager();

/**
 * Helper function to add requests to background sync
 */
export const addToBackgroundSync = (
  request: Omit<BackgroundSyncRequest, 'id' | 'timestamp' | 'retryCount'>
) => {
  return backgroundSyncManager.addToQueue(request);
};

/**
 * Helper function to get queue status
 */
export const getBackgroundSyncStatus = () => {
  return backgroundSyncManager.getQueueStatus();
};
