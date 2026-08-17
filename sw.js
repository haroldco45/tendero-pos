/* Tendero — Service Worker
   Vibras Positivas HM. Cambia CACHE al publicar una versión nueva. */
const CACHE = 'tendero-v1.0.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Navegación: red primero, caché si no hay internet.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => {
          const copia = r.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copia));
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Resto: caché primero, red de respaldo.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok && (req.url.startsWith(self.location.origin) || req.url.includes('fonts.g'))) {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
      }
      return r;
    }).catch(() => hit))
  );
});
