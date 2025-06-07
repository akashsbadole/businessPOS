/**
 * PWA Service Worker Registration
 * Handles service worker registration and updates
 */

export interface PWARegistrationCallbacks {
  onInstalled?: () => void;
  onUpdateAvailable?: () => void;
  onOfflineReady?: () => void;
  onError?: (error: Error) => void;
}

export class PWARegistration {
  private registration: ServiceWorkerRegistration | null = null;
  private callbacks: PWARegistrationCallbacks = {};

  constructor(callbacks: PWARegistrationCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Register the service worker
   */
  async register(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return false;
    }

    try {
      // Register the service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully');

      // Handle installation
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                this.callbacks.onUpdateAvailable?.();
              } else {
                // First time installation
                this.callbacks.onInstalled?.();
                this.callbacks.onOfflineReady?.();
              }
            }
          });
        }
      });

      // Check if there's already an update waiting
      if (this.registration.waiting) {
        this.callbacks.onUpdateAvailable?.();
      }

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SYNC_COMPLETE') {
          console.log(`Synced ${event.data.count} offline transactions`);
        }
      });

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      this.callbacks.onError?.(error as Error);
      return false;
    }
  }

  /**
   * Update the service worker
   */
  async update(): Promise<void> {
    if (this.registration?.waiting) {
      // Tell the waiting service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to activate the new service worker
      window.location.reload();
    }
  }

  /**
   * Unregister the service worker
   */
  async unregister(): Promise<boolean> {
    if (this.registration) {
      const result = await this.registration.unregister();
      console.log('Service Worker unregistered:', result);
      return result;
    }
    return false;
  }

  /**
   * Check if the app is running in standalone mode (installed as PWA)
   */
  isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  /**
   * Request background sync for offline data
   */
  async requestBackgroundSync(tag: string = 'pos-data-sync'): Promise<void> {
    if (this.registration && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        await this.registration.sync.register(tag);
        console.log('Background sync registered:', tag);
      } catch (error) {
        console.error('Background sync registration failed:', error);
      }
    }
  }

  /**
   * Show notification (requires permission)
   */
  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return;
    }

    if (Notification.permission === 'granted') {
      if (this.registration) {
        await this.registration.showNotification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          ...options,
        });
      } else {
        new Notification(title, {
          icon: '/pwa-192x192.png',
          ...options,
        });
      }
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.showNotification(title, options);
      }
    }
  }

  /**
   * Get cache storage usage
   */
  async getCacheUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: Math.round((estimate.usage || 0) / 1024 / 1024), // MB
        quota: Math.round((estimate.quota || 0) / 1024 / 1024), // MB
      };
    }
    return { used: 0, quota: 0 };
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared');
    }
  }
}

// Global PWA instance
let pwaInstance: PWARegistration | null = null;

/**
 * Initialize PWA with callbacks
 */
export function initializePWA(callbacks: PWARegistrationCallbacks = {}): PWARegistration {
  if (!pwaInstance) {
    pwaInstance = new PWARegistration(callbacks);
  }
  return pwaInstance;
}

/**
 * Get the current PWA instance
 */
export function getPWAInstance(): PWARegistration | null {
  return pwaInstance;
}

/**
 * Auto-register PWA on app load
 */
export function autoRegisterPWA(callbacks: PWARegistrationCallbacks = {}): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const pwa = initializePWA(callbacks);
      pwa.register();
    });
  }
}
