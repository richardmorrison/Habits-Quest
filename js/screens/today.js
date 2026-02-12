import { getState, setState } from "../state.js"
import { el, toast } from "../utils/dom.js"
import { playTaskCompleteTick, playLevelUpChime, vibratePattern, HAPTICS } from "../utils/sound.js"
import { uid, todayISO } from "../utils/time.js"
import { Store } from "../store.js"
import { computeDamage, applyDamage } from "../game/combat.js"
import { pickLine } from "../game/narrative.js"
import { openAddQuestModal } from "./today_addQuestModal.js"
import { calculateXpForQuest } from "../game/xp.js"
import { applyLevelUps } from "../game/level.js"
import { rollBossReward, applyRewardToStats } from "../game/loot.js"
import { getTheme } from "../game/theme.js"
import { displayEdge, activateEdgeIfDue, applyEdgeFlagsForDay, rollEdge } from "../game/edge.js"
import {
  ensureCampaignShape,
  progressAreaFromQuest,
  onEncounterCompleted,
  spawnEncounter,
  isEncounterComplete,
  advanceToNextArea,
  maybeTriggerHybridAmbush
} from "../game/campaign.js"

const CAT_ICON = {
  Fitness: "./assets/icons/cat-fitness.svg",
  Health: "./assets/icons/cat-health.svg",
  Mind: "./assets/icons/cat-mind.svg",
  Project: "./assets/icons/cat-project.svg",
  Life: "./assets/icons/cat-life.svg",
  Custom: "./assets/icons/cat-custom.svg"
}

const inFlight = new Set()

export function renderToday({ root }){
  const state = getState()
  ensureCampaignShape(state)
  activateEdgeIfDue(state)
  applyEdgeFlagsForDay(state)

  // Persist any shape/edge adjustments immediately so refresh does not re-roll encounters or edges.
  setState(state)
  Store.saveApp(state).catch(() => {})

  const theme = getTheme(state)
  const L = theme.labels

  const enc = state.campaign.encounter
  const isEnemy = enc.type === "enemy"
  const pct = enc.max ? Math.round((enc.progress / enc.max) * 100) : 0
  const barClass = isEnemy ? "progress progress--enemy" : "progress progress--support"
  const badgeLabel = isEnemy ? `${L.enemy}: ${enc.name}` : `${L.objective || "Objective"}: ${enc.name}`
  const barText = isEnemy ? `${enc.progress}/${enc.max} ${L.hp}` : `${enc.progress}/${enc.max} ${L.progress || "Progress"}`
  const areaTarget = state.campaign.area?.targetProgress || 100
  const areaProgress = state.campaign.area?.progress || 0
  const areaPct = Math.round((areaProgress / areaTarget) * 100)

  const storyCard = el("div", { class: "card section stack", id: "storyCard" }, [
    el("div", { class: "row" }, [
      el("div", {}, [
        el("div", { class: "sectionTitle" }, [state.campaign.area.name]),
        renderEdgeBadge(state),
        el("div", { class: "muted" }, [state.campaign.narrative.lastText])
      ]),
      el("span", { class: "badge levelBadge", id: "playerLevelBadge" }, [`Lv ${state.user.level}`])
    ]),
    el("div", { class: "rowWrap" }, [
      el("span", { class: `badge ${isEnemy ? "badge--enemy" : "badge--support"}`, id: "encounterBadge" }, [badgeLabel]),
      el("span", { class: "badge" }, [barText]),
      el("span", { class: "badge" }, [`Tone: ${state.user.tone}`]),
      el("span", { class: "badge" }, [`${L.chapter} ${state.campaign.chapter}`])
    ]),
    el("div", { class: "progress", "aria-label": "Enemy health" }, [
      el("div", { id: "encounterFill", style: `width:${pct}%` })
    ]),
    el("div", { class: "rowWrap" }, [
      el("span", { class: "badge" }, [`Area: ${state.campaign.area.name}`]),
      el("span", { class: "badge" }, [`Progress: ${areaProgress}/${areaTarget}`]),
      el("span", { class: "badge" }, [`Day ${state.campaign.area.daysInArea}`])
    ]),
    el("div", { class: "progress progress--area", "aria-label": "Area progress" }, [
      el("div", { id: "areaProgFill", style: `width:${Math.min(100, areaPct)}%` })
    ])
  ])

  const quests = state.quests
    .filter((q) => q.status === "active")
    .sort((a, b) => (b.starred === true) - (a.starred === true))

  const list = el("div", { class: "card section stack" }, [
  el("div", { class: "row" }, [
    el("div", {}, [
      el("div", { class: "sectionTitle" }, [L.todayQuests || "Today objectives"])
    ])
  ]),
  el(
    "div",
    { class: "list", id: "questList" },
    quests.length
      ? quests.map((q) => questRow(q, state, L))
      : [el("div", { class: "muted" }, ["No quests yet. Add one to begin."])]
  ),
  el("div", { class: "row row--bottom" }, [
    el("div", { class: "small" }, ["Complete your quests to earn tomorrow’s Edge."]),
    el("button", { class: "btn primary", type: "button", id: "addQuestBtn" }, [L.addQuest || "Add objective"])
  ])
])

  root.appendChild(storyCard)
  root.appendChild(list)

  root.querySelector("#addQuestBtn").addEventListener("click", async () => {
    const s0 = getState()
    vibratePattern({ enabled: !!s0.user.vibrateEnabled, pattern: HAPTICS.modalOpen })
    await openAddQuestModal({
      onSave: async (newQuest) => {
        const s = getState()
        s.quests.unshift(newQuest)
        setState(s)
        await Store.saveApp(getState())
        toast("Quest added.")
        rerenderToday()
      }
    })
  })
}

function renderEdgeBadge(state){
  const themeId = state.user?.themeId || "fantasy"
  const active = state.user?.edgeActive
  const tomorrow = state.user?.edgeTomorrow
  const today = todayISO()

  if (active && active.activeOnISO === today) {
    return el("div", { class: `edgeBadge edgeBadge--${active.rarity || "common"}`, title: "Today’s Edge" }, [
      el("span", { class: "edgeBadge__label" }, [`Edge: ${displayEdge(active, themeId)}`])
    ])
  }

  if (tomorrow && tomorrow.activatesOnISO) {
    return el("div", { class: `edgeBadge edgeBadge--${tomorrow.rarity || "common"}`, title: "Tomorrow’s Edge" }, [
      el("span", { class: "edgeBadge__label" }, [`Tomorrow’s Edge: ${displayEdge(tomorrow, themeId)}`])
    ])
  }

  return el("div", { class: "edgeBadge edgeBadge--hidden" }, [])
}

function questRow(q, state, L){
  const isDone = state.today.completedQuestIds.includes(q.id)
  const counts = state.today.counts || {}
  const target = q.effort?.type === "count" ? (q.effort.target ?? 3) : 1
  const doneCount = q.effort?.type === "count" ? (counts[q.id] ?? 0) : (isDone ? 1 : 0)
  const remaining = Math.max(0, target - doneCount)

  const icon = CAT_ICON[q.category] || CAT_ICON.Custom

  const favBtn = el("button", {
    class: `btn icon btnIcon ${q.starred ? "is-on" : ""}`,
    type: "button",
    title: q.starred ? "Unfavorite" : "Favorite", "aria-label": q.starred ? "Unfavorite quest" : "Favorite quest",
    onclick: () => toggleFavorite(q.id)
  }, [q.starred ? "★" : "☆"])

  const delBtn = el("button", {
    class: "btn icon btnIcon danger",
    type: "button",
    title: "Delete", "aria-label": "Delete quest",
    onclick: () => deleteQuest(q.id)
  }, ["🗑"])

  const actionLabel = isDone
    ? (L.done || "Done")
    : (q.effort?.type === "count" ? `Log (${remaining} left)` : (L.doIt || "Log it"))

  const meta = questMetaNode(q, state)

  return el("div", { class: `item questRow ${q.starred ? "listItem--fav" : ""}`, role: "button", tabindex: "0", "aria-label": `Quest: ${q.title}`, "aria-disabled": isDone ? "true" : null, onclick: (e) => { if (isDone) return; if (e && e.target && e.target.closest && e.target.closest("button")) return; completeQuest(q.id); }, onkeydown: (e) => { if (isDone) return; const k = e.key; if (k === "Enter" || k === " ") { if (e.target && e.target.closest && e.target.closest("button")) return; e.preventDefault(); completeQuest(q.id); } } }, [
    el("div", { class: "item__left" }, [
      el("div", { class: "item__icon" }, [el("img", { src: icon, alt: "" })]),
      el("div", { class: "stack tight" }, [
        el("div", { class: "item__title" }, [q.title]),
        el("div", { class: "item__meta" }, [meta])
      ])
    ]),
    el("div", { class: "item__right" }, [
      el("div", { class: "questActions" }, [delBtn, favBtn]),
      el("button",
        { class: `btn ${isDone ? "secondary" : "primary"}`, type: "button", disabled: isDone ? "true" : null, "aria-label": "Complete quest", onclick: () => completeQuest(q.id) },
        [actionLabel]
      )
    ])
  ])
}

function questMetaNode(q, state){
  const counts = state.today?.counts || {}
  const parts = []

  // Count pill
  if (q.effort?.type === "count") {
    const target = q.effort.target ?? 3
    const done = counts[q.id] ?? 0
    parts.push(
      el("span", { class: "countPill", title: "Count task" }, [
        el("strong", {}, [String(done)]),
        " / ",
        String(target)
      ])
    )
  } else {
    parts.push(el("span", { class: "metaText" }, ["One tap"]))
  }

  // Repeat tag
  const repeatType = q.repeat?.type || "daily"
  if (repeatType === "once") {
    parts.push(el("span", { class: "repeatTag", title: "One off" }, ["Once"]))
  }

  return el("span", { class: "metaInline" }, parts)
}

function toggleFavorite(questId){
  const state = getState()
  const q = state.quests.find((x) => x.id === questId)
  if (!q) return
  q.starred = !q.starred
  setState(state)
  Store.saveApp(state)
  rerenderToday()
}

function deleteQuest(questId){
  if (!confirm("Delete this quest? This cannot be undone.")) return
  const state = getState()
  state.quests = state.quests.filter((q) => q.id !== questId)
  // Clean up any counts/completions
  if (state.today?.counts) delete state.today.counts[questId]
  state.today.completedQuestIds = (state.today.completedQuestIds || []).filter((id) => id !== questId)
  setState(state)
  Store.saveApp(state)
  rerenderToday()
}

function computeCompletionStats(state){
  const active = state.quests.filter((q) => q.status === "active")
  const total = active.length
  const done = (state.today.completedQuestIds || []).length
  const pct = total ? done / total : 0
  return { total, done, pct }
}

function maybeAwardTomorrowsEdge(state){
  const { total, done, pct } = computeCompletionStats(state)
  if (!total) return

  const tomorrowISO = (() => {
    const d = new Date(state.today.dateISO + "T00:00:00")
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0,10)
  })()

  // Already set for tomorrow
  if (state.user.edgeTomorrow && state.user.edgeTomorrow.activatesOnISO === tomorrowISO) return

  const atLeastThree = done >= 3
  const partial = pct >= 0.7 && atLeastThree
  const perfect = done === total

  if (!partial && !perfect) return

  const streak = (state.user.edgePerfectStreakDays || 0) + (perfect ? 1 : 0)
  const edge = rollEdge({ perfectStreakDays: streak, forceCommon: !perfect })
  state.user.edgeTomorrow = {
    ...edge,
    activatesOnISO: tomorrowISO,
    expiresOnISO: tomorrowISO
  }
}

async function completeQuest(questId){
  if (inFlight.has(questId)) return
  inFlight.add(questId)

  try {
    const state = getState()
    const q = state.quests.find((x) => x.id === questId)
    if (!q) return

    if (!state.today.counts) state.today.counts = {}

    // Already completed today
    if (state.today.completedQuestIds.includes(q.id)) return

    const isCount = q.effort?.type === "count"
    const target = isCount ? (q.effort.target ?? 3) : 1
    const doneCount = isCount ? (state.today.counts[q.id] ?? 0) : 0
    const nextCount = Math.min(target, doneCount + 1)

    // Apply encounter progress for each tap, scaled for count tasks
    let dmg = computeDamage(state, q)
    if (isCount) dmg = Math.max(1, Math.round(dmg / target))

    // Focus Edge: slightly boost first two hits (invisible)
    if (state.campaign?.flags?.focusHitsRemaining > 0) {
      dmg = Math.round(dmg * 1.15)
      state.campaign.flags.focusHitsRemaining -= 1
    }

    applyDamage(state, dmg)

    // Tiny feedback
    await playTaskCompleteTick({
      enabled: state.user.soundEnabled,
      volume: state.user.soundVolume,
      vibrate: state.user.vibrateEnabled,
      category: q.category
    })

    // Visual floating number
    showFloatingHit(dmg, state.campaign.encounter?.type === "enemy")

    // Update count and maybe complete the quest
    if (isCount) {
      state.today.counts[q.id] = nextCount
      if (nextCount < target) {
        setState(state)
        await Store.saveApp(state)
        rerenderToday()
        return
      }
    }

    // Mark complete for the day
    state.today.completedQuestIds.push(q.id)

    // Log completion for the Progress tab (one record per quest per day)
    const dateISO = todayISO()
    await Store.addCompletion({
      id: `${dateISO}_${q.id}`,
      questId: q.id,
      dateISO,
      effortValue: isCount ? target : 1
    })

    // XP only when fully completed
    const xp = calculateXpForQuest(state, q)
    state.today.xpEarned = (state.today.xpEarned || 0) + xp
    state.user.xpTotal = (state.user.xpTotal || 0) + xp

    // Level ups
    const leveled = applyLevelUps(state)
    if (leveled) {
      await playLevelUpChime({ enabled: state.user.soundEnabled, volume: state.user.soundVolume, vibrate: state.user.vibrateEnabled })
      // simple flash class handled by CSS in existing build
    }

    // If quest is once, complete permanently
    if (q.repeat?.type === "once") {
      q.status = "completed"
    }

    // Area progress + encounter completion
    progressAreaFromQuest(state, q)
    if (isEncounterComplete(state.campaign.encounter)) {
      onEncounterCompleted(state)
      // Boss reward etc handled in existing onEncounterCompleted
    } else {
      maybeTriggerHybridAmbush(state)
    }

    // Award tomorrow’s edge when threshold reached
    maybeAwardTomorrowsEdge(state)

    setState(state)
    await Store.saveApp(state)
    rerenderToday()
  } finally {
    inFlight.delete(questId)
  }
}

function showFloatingHit(amount, isEnemy){
  const bar = document.getElementById("enemyBar") || document.getElementById("encounterBar")
  const host = bar || document.getElementById("storyCard") || document.body
  const pill = el("div", { class: `floatHit ${isEnemy ? "floatHit--enemy" : "floatHit--support"}` }, [`${isEnemy ? "-" : "+"}${amount}`])
  host.appendChild(pill)
  setTimeout(() => { try { pill.remove() } catch(e) {} }, 800)
}

function rerenderToday(){
  const root = document.getElementById("screenRoot")
  root.innerHTML = ""
  renderToday({ root })
}