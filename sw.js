const CACHE_NAME = 'videoflow-v2';
const urlsToCache = [
  './',
  './index.html',
  './config.js',
  './utils.js',
  './pkg/wasm_video_editor.js',
  './pkg/wasm_video_editor_bg.wasm',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, { cache: 'reload' });
        }));
      })
  );
  // Force waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // For navigation requests, serve index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        // For other requests, try network first
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Add to cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If network fails and it's a navigation request, serve index.html
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// Handle video file shares from other apps
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHARE_TARGET') {
    // Handle shared video files
    event.ports[0].postMessage({
      type: 'SHARE_RECEIVED',
      files: event.data.files
    });
  }
});

// Background sync for video processing
self.addEventListener('sync', event => {
  if (event.tag === 'video-processing') {
    event.waitUntil(processVideoInBackground());
  }
});

async function processVideoInBackground() {
  // Process video tasks when back online
  const tasks = await getStoredTasks();
  for (const task of tasks) {
    await processVideoTask(task);
  }
}
