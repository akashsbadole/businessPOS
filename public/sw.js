// Smart POS Service Worker
const CACHE_NAME = 'smart-pos-v1';
const OFFLINE_URL = '/offline.html';

// Essential files to cache for offline functionality
const ESSENTIAL_FILES = [
  '/',
  '/pos',
  '/dashboard',
  '/inventory',
  '/offline.html',
  '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files');
        return cache.addAll(ESSENTIAL_FILES);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Ensure the new service worker takes control immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Skip external API requests for now (let them fail naturally)
  if (event.request.url.includes('api.') || event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If network fails and we're requesting a page, show offline page
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other resources, just fail
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'pos-data-sync') {
    event.waitUntil(syncPOSData());
  }
});

// Sync POS data when back online
async function syncPOSData() {
  try {
    // Get offline transactions from IndexedDB
    const offlineTransactions = await getOfflineTransactions();
    
    if (offlineTransactions.length > 0) {
      // Send to server
      for (const transaction of offlineTransactions) {
        try {
          await fetch('/api/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
          });
          
          // Remove from offline storage after successful sync
          await removeOfflineTransaction(transaction.id);
        } catch (error) {
          console.error('Failed to sync transaction:', error);
        }
      }
      
      // Notify main thread about sync completion
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          count: offlineTransactions.length
        });
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline data management
async function getOfflineTransactions() {
  // This would integrate with your offline storage system
  // For now, return empty array
  return [];
}

async function removeOfflineTransaction(id) {
  // This would remove the transaction from offline storage
  console.log('Removing offline transaction:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: data.data,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then((clients) => {
        // Check if there's already a window open
        for (const client of clients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
