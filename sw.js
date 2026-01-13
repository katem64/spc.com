// Service Worker for SPC Online - Capacitor Version
// Provides complete offline functionality

const CACHE_NAME = 'spc-capacitor-v46';
const RUNTIME_CACHE = 'spc-runtime-v46';

// Essential files to cache immediately
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './landing.html',
  './pages/BLconcordance.html',
  './css/clean-blog.min.css',
  './css/theme.css',
  './css/dark-mode.css',
  './css/modern-theme.css',
  './css/capacitor-enhancements.css',
  './assets/fonts/local-fonts.css',
  './js/app.js',
  './js/access-code.js',
  './js/font-size.js',
  './js/bookmarks.js',
  './js/search.js',
  './js/footer-loader.js',
  './js/navbar-loader.js',
  './js/prayer-enhancer.js',
  './js/prayer-tracker.js',
  './js/prayer-features.js',
  './js/liturgical-data.js',
  './js/liturgical-calendar.js',
  './js/mass-readings-data.js',
  './js/mass-readings.js',
  './js/ux-enhancements.js',
  './js/bl-concordance.js',
  './js/clean-blog.min.js',
  './data/bl-concordance-index.json',
  './assets/vendor/jquery/jquery.min.js',
  './assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  './assets/vendor/bootstrap/css/bootstrap.min.css',
  './navbar.html',
  './footer.html'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Strategy: Cache First (for complete offline capability)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache all assets for offline use
            if (
              request.url.includes('.html') ||
              request.url.includes('.jpg') ||
              request.url.includes('.jpeg') ||
              request.url.includes('.png') ||
              request.url.includes('.gif') ||
              request.url.includes('.webp') ||
              request.url.includes('.svg') ||
              request.url.includes('.css') ||
              request.url.includes('.js') ||
              request.url.includes('.json') ||
              request.url.includes('.woff') ||
              request.url.includes('.woff2') ||
              request.url.includes('.ttf') ||
              request.url.includes('.eot')
            ) {
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('[ServiceWorker] Fetch failed:', error);
            // Return offline page or fallback
            return caches.match('./index.html');
          });
      })
  );
});

// Message event - handle cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        return self.clients.claim();
      })
    );
  }

  // Background sync for readings update
  if (event.data && event.data.type === 'SYNC_READINGS') {
    event.waitUntil(
      syncReadingsData()
    );
  }
});

// Background sync for readings
async function syncReadingsData() {
  try {
    console.log('[ServiceWorker] Syncing readings data...');
    
    // Check if we need to extend the readings database
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // This would check if we're approaching the end of our pre-calculated data
    // and fetch extended data from an API if available
    
    // For now, just log that sync was attempted
    console.log('[ServiceWorker] Readings sync checked for year:', currentYear);
    
    return true;
  } catch (error) {
    console.error('[ServiceWorker] Readings sync failed:', error);
    return false;
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'readings-update') {
    event.waitUntil(syncReadingsData());
  }
});

console.log('[ServiceWorker] Loaded successfully');
