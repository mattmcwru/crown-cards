const CACHE_NAME = "crown-cards-v2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "./nosleep.mp4",

  // Card images (pre-cached for offline use)
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/3S%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/4S%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/5S%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/6S%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/7S%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/8S%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/9S%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/TS%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/JS%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/QS%403x.png",
  "https://raw.githubusercontent.com/Xadeck/xCards/refs/heads/master/png/face/KS%403x.png"
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
