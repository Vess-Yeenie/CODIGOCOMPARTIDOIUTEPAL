self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Peticiones directas a la red (sin caché complejo para evitar problemas de desarrollo)
  e.respondWith(fetch(e.request));
});
