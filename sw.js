/* Service Worker raiz — JurisParaguay */
const CACHE_NAME = 'jurisparaguay-root-v1';

// Pre-cachear solo el shell; los JSON se cachean al primer fetch
const SHELL = [
  '/jurisparaguay/',
  '/jurisparaguay/index.html',
  '/jurisparaguay/assets/css/styles.css',
  '/jurisparaguay/assets/js/data.js',
  '/jurisparaguay/assets/js/app.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // JSON de codigos: cache-first (son estaticos, cambian poco)
  if (url.includes('_completo.json') || url.includes('codigo_') && url.endsWith('.json')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(resp => {
            if (resp.ok) cache.put(e.request, resp.clone());
            return resp;
          });
        })
      )
    );
    return;
  }

  // Resto: network-first
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
