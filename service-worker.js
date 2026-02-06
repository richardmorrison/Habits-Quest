const CACHE_NAME = "quest-rpg-v0.3.1"
const ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/app.js",
  "./js/state.js",
  "./js/store.js",
  "./js/router.js",
  "./js/utils/dom.js",
  "./js/utils/time.js",
  "./js/screens/today.js",
  "./js/screens/today_addQuestModal.js",
  "./js/screens/progress.js",
  "./js/screens/settings.js",
  "./js/game/narrative.js",
  "./js/game/combat.js",
  "./js/game/loot.js",
  "./js/game/campaign.js",
  "./js/game/level.js",
  "./js/game/theme.js",
  "./js/game/xp.js",
  "./manifest.webmanifest",
  "./assets/icons/app-icon.svg",
  "./assets/icons/tab-today.svg",
  "./assets/icons/tab-progress.svg",
  "./assets/icons/tab-settings.svg",
  "./assets/icons/cat-fitness.svg",
  "./assets/icons/cat-health.svg",
  "./assets/icons/cat-mind.svg",
  "./assets/icons/cat-project.svg",
  "./assets/icons/cat-life.svg",
  "./assets/icons/cat-custom.svg"

];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    const res = await fetch(req);
    const url = new URL(req.url);
    if (url.origin === location.origin) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  })());
});
