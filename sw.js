'use strict';
const CACHE_NAME = 'cache-v6';
const FILES_TO_CACHE = [
    'index.html',
    'offline.html',
    'styles/main.css',
    'images/icon.png',
    'images/badge.png',
    'images/touch/icon-128x128.png',
    'images/touch/icon-192x192.png',
    'images/touch/icon-256x256.png',
    'images/touch/icon-384x384.png',
    'images/touch/icon-512x512.png'
];

self.addEventListener('install', event => {
    console.log('Service worker install event!');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[ServiceWorker] Pre-caching offline page');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker activate event!');
    event.waitUntil(
        caches.keys().then((keyList) => {
          return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }));
        })
    );
});

self.addEventListener('fetch', function(event) {
     console.log('Service worker fetch event!');
   if (event.request.mode !== 'navigate') {
      // Not a page navigation, bail.
      return;
    }
    event.respondWith(
        fetch(event.request)
            .catch(() => {
              return caches.open(CACHE_NAME)
                  .then((cache) => {
                    console.log('Service worker return offline.html');
                    return cache.match('offline.html');
                  });
            })
    );
    //event.respondWith(caches.match(event.request));
});

/*
self.addEventListener('fetch', event => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});
*/