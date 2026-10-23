const CACHE = 'gept15-practice-v15';
const FILES = [
  './',
  'index.html',
  'gept15-manifest-v2.json',
  'gept-elementary.js',
  'gept-examples.js',
  'gept-emoji.js',
  'gept-order.js',
  'gept15-icon-180.png',
  'gept15-icon-192.png',
  'gept15-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('gept15-practice-') && key !== CACHE)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(async () =>
      (await caches.match(event.request)) ||
      (await caches.match(event.request, { ignoreSearch: true })) ||
      Response.error()
    )
  );
});
