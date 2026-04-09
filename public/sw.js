self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Pass through all requests, allowing the browser to handle caching
  // This satisfies the PWA requirement for a fetch handler
  e.respondWith(fetch(e.request).catch(() => {
    return new Response('Offline mode not fully supported yet.');
  }));
});
