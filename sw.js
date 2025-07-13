const CACHE_NAME = 'videoflow-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/config.js',
  '/utils.js',
  '/pkg/wasm_video_editor.js',
  '/pkg/wasm_video_editor_bg.wasm',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
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
