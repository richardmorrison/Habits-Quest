# MVP definition

## What this app is
A local-first habit tracker that feels like a light RPG.

You add quests, complete them each day, and your actions advance a simple campaign:
- Each completed quest contributes to encounters and area progress
- You earn XP on full quest completion
- You can toggle a Daily Edge modifier that changes the feel without changing the core rules

## What this app is not (yet)
- Not a social app
- Not cloud synced
- Not a complex RPG with inventories, builds, or endless stats
- Not a calendar planner

## MVP must-have behaviors
1. Add quests (daily, once, count)
2. Complete quests (one tap, or incremental count until target)
3. Once quests disappear after completion
4. Favorites sort to the top
5. Delete removes the quest and any related progress
6. State persists across refresh
7. Theme and tone can be changed without breaking progress
8. Export and import JSON backup works
9. A user can run a self check and see basic integrity results

## MVP success criteria
- A new user can get from zero to completing a quest in under 60 seconds
- No console errors during the happy path smoke test
- The UI remains usable on a phone screen
