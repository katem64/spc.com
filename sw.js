// Service Worker for SPC Prayer.Com - Capacitor Version
// Provides complete offline functionality

const CACHE_NAME = 'spc-capacitor-v63';
const RUNTIME_CACHE = 'spc-runtime-v63';

function getCacheKey(request) {
  const cacheUrl = new URL(request.url);
  cacheUrl.search = '';
  return cacheUrl.href;
}

// Essential files to cache immediately
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './landing.html',
  './pages/marks-examen.html',
  './pages/examen-foundations.html',
  './css/clean-blog.min.css',
  './css/theme.css',
  './css/dark-mode.css',
  './css/modern-theme.css',
  './css/capacitor-enhancements.css',
  './css/examen.css',
  './assets/fonts/local-fonts.css',
  './assets/images/spccomlogo.png',
  './assets/images/spc-icon-180.png',
  './assets/images/spc-icon-192.png',
  './assets/images/spc-icon-512.png',
  './assets/images/spc-icon-maskable-512.png',
  './js/app.js',
  './js/access-code.js',
  './js/font-size.js',
  './js/bookmarks.js',
  './js/search.js',
  './js/footer-loader.js',
  './js/navbar-loader.js',
  './js/global-language.js',
  './js/landing-language.js',
  './js/prayer-enhancer.js',
  './js/prayer-tracker.js',
  './js/prayer-features.js',
  './js/liturgical-data.js',
  './js/liturgical-calendar.js',
  './js/mass-readings-data.js',
  './js/mass-readings.js',
  './js/ux-enhancements.js',
  './js/examen.js',
  './js/clean-blog.min.js',
  './data/marks-examen-index.json',
  './data/french-page-manifest.json',
  './data/prayer-page-manifest.json',
  './assets/images/marks-examen-cover.png',
  './assets/vendor/jquery/jquery.min.js',
  './assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
  './assets/vendor/bootstrap/css/bootstrap.min.css',
  './navbar.html',
  './navbar-for-pages.html',
  './footer.html'
];

async function cacheAsset(cache, asset) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(asset, { signal: controller.signal });
    if (response.ok) {
      await cache.put(asset, response);
    }
  } catch (error) {
    console.warn('[ServiceWorker] Skipping unavailable asset:', asset);
  } finally {
    clearTimeout(timeout);
  }
}

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return Promise.all(PRECACHE_ASSETS.map((asset) => cacheAsset(cache, asset)));
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

  // Navigation uses the current published page first, with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(getCacheKey(request), responseToCache);
            });
          }
          return response;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Other assets remain cache-first for offline functionality.
  event.respondWith(
    caches.match(request, { ignoreSearch: true })
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
                  cache.put(getCacheKey(request), responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('[ServiceWorker] Fetch failed:', error);
            if (request.mode === 'navigate') {
              return caches.match('./index.html', { ignoreSearch: true });
            }
            return new Response('', {
              status: 503,
              statusText: 'Offline resource unavailable'
            });
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

  if (event.data && event.data.type === 'CACHE_PRAYERS') {
    const urls = Array.isArray(event.data.urls) ? event.data.urls : [];
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => Promise.all(
        urls.map((url) => {
          const absoluteUrl = new URL(url, self.registration.scope);
          if (absoluteUrl.origin !== self.location.origin) return Promise.resolve();
          return fetch(absoluteUrl.href)
            .then((response) => {
              if (response.ok) return cache.put(getCacheKey(new Request(absoluteUrl.href)), response);
              return undefined;
            })
            .catch(() => undefined);
        })
      ))
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

