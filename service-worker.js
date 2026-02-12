const CACHE_NAME = "quest-rpg-v0.6.5"

const ASSETS = [
  "./",
  "./index.html",
  "./css/app.css",
  "./js/app.js",
  "./js/state.js",
  "./js/store.js",
  "./js/router.js",
  "./js/utils/dom.js",
  "./js/utils/sound.js",
  "./js/utils/time.js",
  "./js/screens/today.js",
  "./js/screens/today_addQuestModal.js",
  "./js/screens/progress.js",
  "./js/screens/settings.js",
  "./js/game/narrative.js",
  "./js/game/combat.js",
  "./js/game/campaign.js",
  "./js/game/journeyBanks.js",
  "./js/game/level.js",
  "./js/game/loot.js",
  "./js/game/theme.js",
  "./js/game/xp.js",
  "./manifest.webmanifest",
  "./assets/icons/app-icon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-32.png",
  "./assets/icons/favicon-16.png",
  "./favicon.ico",
  "./assets/icons/tab-today.svg",
  "./assets/icons/tab-progress.svg",
  "./assets/icons/tab-settings.svg",
  "./assets/icons/cat-fitness.svg",
  "./assets/icons/cat-health.svg",
  "./assets/icons/cat-mind.svg",
  "./assets/icons/cat-project.svg",
  "./assets/icons/cat-life.svg",
  "./assets/icons/cat-custom.svg"
]

function unique(list){
  return Array.from(new Set(list))
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(unique(ASSETS)))
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req)
    })
  )
})

self.addEventListener("message", (event) => {
  if (!event.data) return
  if (event.data.type === "SKIP_WAITING") self.skipWaiting()
})