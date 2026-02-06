import { getState, setState } from "../state.js"
import { el, toast } from "../utils/dom.js"
import { uid, todayISO } from "../utils/time.js"
import { Store } from "../store.js"
import { computeDamage, applyDamage } from "../game/combat.js"
import { pickLine } from "../game/narrative.js"
import { openAddQuestModal } from "./today_addQuestModal.js"
import { getTheme } from "../game/theme.js"
import { calculateXpForQuest } from "../game/xp.js"
import { applyLevelUps } from "../game/level.js"
import { rollBossReward, applyRewardToStats } from "../game/loot.js"
import { getTheme } from "../game/theme.js"


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

  const enemyPct = Math.round((state.campaign.enemy.hp / state.campaign.enemy.hpMax) * 100)

  const storyCard = el("div", { class: "card section stack" }, [
    el("div", { class: "row" }, [
      el("div", {}, [
        el("div", { class: "sectionTitle" }, [state.campaign.theme]),
        el("div", { class: "muted" }, [state.campaign.narrative.lastText])
      ]),
      el("span", { class: "badge" }, [`Lv ${state.user.level}`])
    ]),
    el("div", { class: "rowWrap" }, [
      el("span", { class: "badge" }, [`Enemy: ${state.campaign.enemy.name}`]),
      el("span", { class: "badge" }, [`HP ${state.campaign.enemy.hp}/${state.campaign.enemy.hpMax}`]),
      el("span", { class: "badge" }, [`Tone: ${state.user.tone}`]),
      el("span", { class: "badge" }, [`Chapter ${state.campaign.chapter}`])
    ]),
    el("div", { class: "progress", "aria-label": "Enemy health" }, [
      el("div", { style: `width:${enemyPct}%` })
    ])
  ])

  const quests = state.quests.filter((q) => q.status === "active")

  const list = el("div", { class: "card section stack" }, [
    el("div", { class: "row" }, [
      el("div", {}, [
        el("div", { class: "sectionTitle" }, ["Today quests"]),
        el("div", { class: "small" }, ["Tap Do it to apply automatic battle damage and log progress."])
      ]),
      el("button", { class: "btn primary", type: "button", id: "addQuestBtn" }, ["Add quest"])
    ]),
    el(
        "div",
        { class: "list", id: "questList" },
        quests.length
            ? quests.map((q) => questRow(q, state))
            : [el("div", { class: "muted" }, ["No quests yet. Add one to begin."])]
    )
  ])

  root.appendChild(storyCard)
  root.appendChild(list)

  root.querySelector("#addQuestBtn").addEventListener("click", async () => {
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

function questRow(q, state){
  const isDone = state.today.completedQuestIds.includes(q.id)
  const meta = questMeta(q)
  const icon = CAT_ICON[q.category] || CAT_ICON.Custom

  return el("div", { class: "item" }, [
    el("div", { class: "item__left" }, [
      el("div", { class: "item__icon" }, [el("img", { src: icon, alt: "" })]),
      el("div", {}, [
        el("div", { class: "item__title" }, [q.title]),
        el("div", { class: "item__meta" }, [meta])
      ])
    ]),
    el("div", { class: "item__right" }, [
      el("span", { class: "badge" }, [q.category]),
      el(
          "button",
          {
            class: `btn slim ${isDone ? "" : "primary"}`,
            type: "button",
            disabled: isDone ? "true" : null,
            onclick: async () => {
              await completeQuest(q.id)
            }
          },
          [isDone ? "Done" : "Do it"]
      )
    ])
  ])
}

function questMeta(q){
  if (q.effort?.type === "reps") {
    const base = q.effort.base ?? 10
    const step = q.effort.step ?? 0
    const rank = q.effort.rank ?? 1
    const target = base + step * (rank - 1)
    return `Rank ${rank} • Target ${target} reps`
  }

  if (q.effort?.type === "sets_reps") {
    const sets = q.effort.sets ?? 3
    const reps = q.effort.reps ?? 10
    return `${sets} sets × ${reps} reps`
  }

  return "Simple complete"
}

async function completeQuest(questId){
  if (inFlight.has(questId)) return
  inFlight.add(questId)

  try{
    const state = getState()
    ensureCampaignShape(state)

    const q = state.quests.find((x) => x.id === questId)
    if (!q) return

    const today = todayISO()
    if (state.today.dateISO !== today) {
      state.today = { dateISO: today, completedQuestIds: [], xpEarned: 0 }
    }

    if (state.today.completedQuestIds.includes(questId)) return

    state.today.completedQuestIds.push(questId)

    const effortValue = inferEffortValue(q)

    const completionId = uid("c")
    await Store.addCompletion({ id: completionId, questId, dateISO: today, effortValue })

    const dmg = computeDamage(state, q)
    applyDamage(state, dmg)

    const hitLine = pickLine({ themeId: state.user.themeId || "fantasy", tone: state.user.tone, kind: "hit" })
    state.campaign.narrative.lastText =
        `${hitLine.text} (+${xpGained} XP, ${dmg} ${getTheme(state).labels.hp})`

    if (state.campaign.enemy.hp <= 0) {
      handleEnemyDefeated(state)
    }

    setState(state)
    await Store.saveApp(getState())

    const xpGained = calculateXpForQuest(state, q)

    state.today.xpEarned += xpGained
    state.user.xpTotal += xpGained

    const levelResult = applyLevelUps(state)
    if (levelResult.leveledUp) {
      const L = getTheme(state).labels
      state.campaign.narrative.lastText =
          `Level up. Systems improved. Power and endurance increased.`
    }

    toast(`Objective logged. +${xpGained} XP`)
    rerenderToday()
  } finally {
    inFlight.delete(questId)
  }
}

function inferEffortValue(q){
  if (q.effort?.type === "reps") {
    const base = q.effort.base ?? 10
    const step = q.effort.step ?? 0
    const rank = q.effort.rank ?? 1
    return base + step * (rank - 1)
  }

  if (q.effort?.type === "sets_reps") {
    const sets = q.effort.sets ?? 3
    const reps = q.effort.reps ?? 10
    return sets * reps
  }

  return null
}

function handleEnemyDefeated(state){
  const wasBoss = state.campaign.enemy.type === "boss"

  if (wasBoss) {
    state.campaign.chapter = (state.campaign.chapter ?? 1) + 1
    state.campaign.areaIndex = (state.campaign.areaIndex ?? 0) + 1
    state.campaign.minorsDefeatedInArea = 0

    const themeId = state.user.themeId || "fantasy"
    const reward = rollBossReward(themeId)

    if (themeId === "space") state.inventory.modules.unshift(reward)
    else state.inventory.weapons.unshift(reward)

    applyRewardToStats(state, reward)

    state.campaign.narrative.lastText =
        themeId === "space"
            ? `Major anomaly contained. You salvage a ${reward.name} (+${reward.amount} ${reward.stat}).`
            : `Boss defeated. You loot a ${reward.name} (+${reward.amount} ${reward.stat}).`

    state.campaign.theme = nextTheme(state.campaign.theme)

    state.campaign.narrative.lastText =
        `The boss collapses. The path opens. Chapter ${state.campaign.chapter} begins.`
  } else {
    state.campaign.minorsDefeatedInArea = (state.campaign.minorsDefeatedInArea ?? 0) + 1

    state.campaign.narrative.lastText =
        `Enemy defeated. The air feels lighter. (${state.campaign.minorsDefeatedInArea}/3 toward a boss)`
  }

  state.campaign.enemy = spawnNextEnemy(state)
}

function spawnNextEnemy(state){
  const minors = state.campaign.minorsDefeatedInArea ?? 0
  const shouldSpawnBoss = minors >= 3

  if (shouldSpawnBoss) {
    return spawnBoss(state)
  }

  return spawnMinor(state)
}

function spawnMinor(state){
  const options = [
    { name: "Moss Slime", hp: 35 },
    { name: "Pebble Gremlin", hp: 42 },
    { name: "Fog Moth", hp: 38 },
    { name: "Creaky Vine", hp: 45 }
  ]

  const pick = options[Math.floor(Math.random() * options.length)]
  const levelBoost = Math.max(0, (state.user.level ?? 1) - 1)
  const hpMax = pick.hp + levelBoost * 3

  return {
    id: uid("e_minor"),
    name: pick.name,
    type: "minor",
    hpMax,
    hp: hpMax
  }
}

function spawnBoss(state){
  const options = [
    { name: "Slime Baron", hp: 90 },
    { name: "Gatekeeper Wisp", hp: 100 },
    { name: "Old Stone Sentinel", hp: 110 }
  ]

  const pick = options[Math.floor(Math.random() * options.length)]
  const levelBoost = Math.max(0, (state.user.level ?? 1) - 1)
  const hpMax = pick.hp + levelBoost * 6

  state.campaign.minorsDefeatedInArea = 0

  return {
    id: uid("e_boss"),
    name: pick.name,
    type: "boss",
    hpMax,
    hp: hpMax
  }
}

function nextTheme(current){
  const themes = ["Mossy Ruins", "Breezy Tunnels", "Sunken Library", "Crystal Steps", "Ash Orchard"]
  const idx = Math.max(0, themes.indexOf(current))
  return themes[(idx + 1) % themes.length]
}

function ensureCampaignShape(state){
  if (!state.campaign) state.campaign = {}

  if (!state.campaign.chapter) state.campaign.chapter = 1
  if (state.campaign.areaIndex === undefined || state.campaign.areaIndex === null) state.campaign.areaIndex = 0
  if (state.campaign.minorsDefeatedInArea === undefined || state.campaign.minorsDefeatedInArea === null) {
    state.campaign.minorsDefeatedInArea = 0
  }

  if (!state.campaign.theme) state.campaign.theme = "Mossy Ruins"

  if (!state.campaign.narrative) state.campaign.narrative = {}
  if (!state.campaign.narrative.lastText) {
    state.campaign.narrative.lastText = "You step forward. Something watches you from the dark."
  }

  if (!state.campaign.enemy) {
    state.campaign.enemy = {
      id: uid("e_minor"),
      name: "Moss Slime",
      type: "minor",
      hpMax: 35,
      hp: 35
    }
  }
}

function rerenderToday(){
  const theme = getTheme(state)
  const L = theme.labels
  const root = document.getElementById("screenRoot")
  root.innerHTML = ""
  renderToday({ root })
}