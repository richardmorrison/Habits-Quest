
# Habits Quest – Master Scaffolding Document
_Last Updated: 2026-02-11_

---

# 1. Core Vision

Habits Quest is a local-first Progressive Web App built with HTML, CSS, and vanilla JavaScript.

It gamifies real-life habits through:

- Narrative progression
- Combat and support encounters
- Area-based advancement
- Daily reward mechanics (Edge system)
- Long-term arc planning (multi-year potential)

The app is designed for sustainable motivation, not addiction mechanics.

---

# 2. Current Implemented Systems

## 2.1 Task System

### Repeat Types
- Every day (default)
- Once (completes permanently)

### Effort Types
- One tap complete
- Count (tap multiple times until target reached)

Count tasks:
- Display live counter pill (e.g., 2 / 3)
- Apply scaled encounter progress per tap
- Award XP only on full completion

### Favorites
- Star to pin to top
- Automatic sorting

### Delete
- Confirm dialog before deletion
- Cleans counts and daily completion state

---

## 2.2 Encounter System

Unified encounter model:

- Enemy (red bar, drains)
- Rescue (green bar, fills)
- Repair
- Unlock
- Escort (hybrid, multiple ambush phases)
- Defense (hybrid, multi-wave)

Hybrid behavior:
- Support encounter triggers ambush at threshold
- After ambush defeat, resumes support progress

---

## 2.3 Campaign & Areas

- Areas have target progress
- Boss ends area
- Hybrid pacing built into campaign
- Area progress bar separate from encounter bar

Planned long-term:
- 7-year arc progression model
- Seasonal narrative shifts
- Narrative banks expandable

---

## 2.4 Daily Edge System

Earned when:
- 100 percent completion (perfect)
- 70 percent or more and at least 3 tasks (partial)

Activates next day only.
Does not stack.
Expires automatically.

### Rarity
Common ●
Uncommon ◆
Rare ★

Mechanics identical across themes.
Wording changes per theme only.

### Current Edge Effects Implemented
- Stabilized (no overnight escape)
- Calm Start (first encounter support)
- Prepared (weaken first ambush)
- Focus (boost first two hits)
- Momentum (opening strike damage)
- Surge (stronger opening strike)

---

## 2.5 UI Systems

- Edge badge with rarity markers
- Subtle star/delete buttons (hover emphasis)
- Count pill visual
- Floating damage numbers
- Level badge
- Sound and vibration toggles
- Shield plus tick icon pack
- Maskable PWA icon

---

# 3. Recently Completed Changes

- Simplified effort model (removed sets x reps)
- Added once tasks
- Added count visual pill
- Implemented confirm delete
- Favorites sorting
- Edge rarity markers
- Hybrid escort and defense encounters
- Updated scaffold documentation
- PWA icon integration

---

# 4. Not Yet Fully Implemented / Pending Polish

## UI Polish
- Subtle hover animation tuning for action icons
- Count pill micro animation on increment
- Edge activation glow refinement

## Narrative Depth
- Full 7-year arc structure not yet implemented
- Seasonal area theming transitions
- Expanded hybrid mission narrative branches
- More escort and defense variations

## Companion / Growth Layer (Deferred)
- No side companion implemented yet
- Player trait tracking not yet surfaced visually
- No cosmetic unlock layer

## Advanced Daily Reward Layer
- Rare event system not fully implemented
- Trait preview for tomorrow refinement
- Streak scaling visual feedback

---

# 5. Next Recommended Implementation Order

1. Edge micro polish (activation animation refinement)
2. Narrative arc phase engine (month 1 to year 1 structure)
3. Rare mission event injection system
4. Seasonal area transitions
5. Player trait visual reflection without companion
6. Long-term arc scaffolding for 7-year progression

---

# 6. Long-Term Vision

Year 1: Stabilization arc
Year 2 and beyond: Expansion cycles
Hybrid pacing balanced with quiet missions
Support-heavy weeks during user low activity
Narrative tone shifts over time

---

# 7. Architecture Overview

- Vanilla JS modules
- IndexedDB persistence
- Service Worker offline cache
- Modular narrative banks
- Encounter engine handles hybrid flow
- Edge engine separate from encounter logic

---

This document serves as the canonical rebuild blueprint.
