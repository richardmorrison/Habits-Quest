# Quest Habit RPG – Local-first PWA Starter (Vanilla JS)

This starter repo gives you a clean, local-first PWA foundation using HTML, CSS, and pure JavaScript modules.

## What is included
- Vanilla HTML, CSS, ES Modules JS
- Local-first persistence via IndexedDB
- Service worker for offline caching
- Three screens: Today, Progress, Settings
- Narrative only plus small icons

## Run locally
Service workers require HTTPS or localhost.

### Option A: Python
From the project folder:
- python3 -m http.server 8080
Open:
- http://localhost:8080

### Option B: Node
- npx serve .
or any static server.

## Notes
- IndexedDB is per browser per domain.
- Use DevTools → Application to inspect IndexedDB and service worker.

See LEARN.md for the mental model and NOTES/decisions.md for key choices.
