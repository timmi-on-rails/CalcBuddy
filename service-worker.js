
const version = "0.6.11";
const cacheName = `airhorner-${version}`;
self.addEventListener('install', e => {
    e.waitUntil(
      caches.open(cacheName).then(cache => {
          return cache.addAll([
            `.`,
            `index.html`,
            `bridge.js`,
            `bridge.meta.js`,
            `CalcBuddy.js`,
            `codemirror.css`,
            `codemirror.js`,
            `Parser.js`,
            `require.js`,
            `Tokenizer.js`
          ])
          .then(() => self.skipWaiting());
      })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.open(cacheName)
        .then(cache => cache.match(event.request, { ignoreSearch: true }))
        .then(response => {
            return response || fetch(event.request);
        })
    );
});
