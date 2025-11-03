// Service Worker for caching and offline functionality
const CACHE_NAME = 'portfolio-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/style/styles.css',
    '/scripts/theme.js',
    '/scripts/responsive.js',
    '/scripts/accessibility.js',
    '/images/avtor.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});