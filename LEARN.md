# LEARN.md – How this app works (V0.1)

## Architecture
- Single state object in js/state.js
- Screen renderers in js/screens
- Game logic in js/game
- Storage wrapper in js/store.js (IndexedDB)
- Hash router in js/router.js

The code stays clean because:
- Screens read state, render UI
- Actions update state, then persist
- IndexedDB calls are hidden behind Store

## Key screens
- Today: story, enemy HP bar, quest list, add quest modal
- Progress: simple daily completion list (V0.1)
- Settings: tone selector, export, reset

## Service worker
- Cache-first shell
- Enough for local offline testing
- Can be upgraded later

## Next planned steps
- Daily XP pool fairness
- Rank completion counting and auto rank up
- Boss defeat flow
- Weapons and inventory
- Missed day buckets and comeback beats
