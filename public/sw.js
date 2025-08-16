const CACHE_NAME = 'airac-explorer-v2.0.0'
const STATIC_CACHE = 'static-v2.0.0'
const DYNAMIC_CACHE = 'dynamic-v2.0.0'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/calendar',
  '/analytics',
  '/about',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Static assets cached successfully')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Error caching static assets:', error)
      })
  )
})

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', request.url)
          
          // For HTML requests, also fetch from network to update cache
          if (request.headers.get('accept')?.includes('text/html')) {
            fetchAndCache(request)
          }
          
          return cachedResponse
        }
        
        // Not in cache, fetch from network
        return fetchAndCache(request)
      })
      .catch(error => {
        console.error('Error serving request:', error)
        
        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/')
        }
        
        // Return a basic error response for other requests
        return new Response('Offline - Content not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'text/plain'
          }
        })
      })
  )
})

// Helper function to fetch from network and cache
function fetchAndCache(request) {
  return fetch(request)
    .then(response => {
      // Check if response is valid
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response
      }
      
      // Clone response for caching
      const responseToCache = response.clone()
      const url = new URL(request.url)
      
      // Determine cache strategy
      let cacheName = DYNAMIC_CACHE
      if (STATIC_ASSETS.some(asset => url.pathname === asset) || 
          request.url.includes('.js') || 
          request.url.includes('.css') ||
          request.url.includes('/icons/')) {
        cacheName = STATIC_CACHE
      }
      
      // Cache the response
      caches.open(cacheName)
        .then(cache => {
          console.log('Caching response:', request.url)
          cache.put(request, responseToCache)
        })
        .catch(error => {
          console.error('Error caching response:', error)
        })
      
      return response
    })
}

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync any pending offline actions
      syncOfflineActions()
    )
  }
})

// Handle push notifications (if implemented later)
self.addEventListener('push', event => {
  if (!event.data) return
  
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'airac-notification',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('AIRAC Cycles Update', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'open' || event.action === '') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Placeholder for offline action sync
function syncOfflineActions() {
  return Promise.resolve()
    .then(() => {
      console.log('Background sync completed')
    })
    .catch(error => {
      console.error('Background sync failed:', error)
    })
}

// Handle service worker updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Skipping waiting, updating service worker...')
    self.skipWaiting()
  }
})

console.log('Service Worker loaded successfully')
