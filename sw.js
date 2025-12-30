const CACHE_NAME = "crown-cards-v3";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "./nosleep.mp4",

  // Card images (pre-cached for offline use)
  "./images/3S%403x.webp",
  "./images/4S%403x.webp",
  "./images/5S%403x.webp",
  "./images/6S%403x.webp",
  "./images/7S%403x.webp",
  "./images/8S%403x.webp",
  "./images/9S%403x.webp",
  "./images/TS%403x.webp",
  "./images/JS%403x.webp",
  "./images/QS%403x.webp",
  "./images/KS%403x.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });
        return response;
      });
    }).catch(() => caches.match("./index.html"))
  );
});
