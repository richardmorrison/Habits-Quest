import { todayISO } from "../utils/time.js"
import { BANKS, pick } from "./journeyBanks.js"
import { activateEdgeIfDue, applyEdgeFlagsForDay } from "./edge.js"

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)) }

function ensureStats(state){
  if (!state.campaign.stats) state.campaign.stats = { enemiesDefeated: 0, rescuesCompleted: 0, repairsCompleted: 0, unlocksCompleted: 0, assistsCompleted: 0 }
}

function rollEscapeChance(state){
  if (state.campaign?.flags?.noEscapeToday) return 0
  const enc = state.campaign?.encounter
  if (!enc || enc.type !== "enemy") return 0
  if (enc.isBoss || enc.subtype === "boss") return 0
  if (enc.progress <= 0) return 0

  const pct = enc.max ? enc.progress / enc.max : 1
  let p = 0.18
  if (pct <= 0.35) p = 0.32
  if (pct >= 0.85) p = 0.12

  const plan = state.campaign?.area?.plan || "mixed"
  if (plan === "swarm") p += 0.06
  if (plan === "brute") p -= 0.05

  return clamp(p, 0, 0.5)
}

function handleOvernightEncounter(state){
  // Called when the day rolls over.
  // Occasionally an undefeated enemy escapes, then returns later stronger with a callback line.
  const enc = state.campaign?.encounter
  if (!enc || enc.type !== "enemy") return
  if (enc.isBoss || enc.subtype === "boss") return
  if (enc.progress <= 0) return

  // Avoid recursion: ensureCampaignShape may call spawnEncounter when encounter is missing.
  // Only call ensureCampaignShape when we were not invoked from ensureCampaignShape itself.
  if (!opts._fromEnsureShape) ensureCampaignShape(state)

  const themeId = state.user?.themeId || "fantasy"
  const bank = BANKS[themeId]

  const p = rollEscapeChance(state)
  if (Math.random() >= p) return

  state.campaign.escape.lastEscapedName = enc.name

  const existingIndex = state.campaign.escape.escaped.findIndex((e) => e.name === enc.name)
  let times = 1
  if (existingIndex >= 0) {
    times = (state.campaign.escape.escaped[existingIndex].times || 1) + 1
    state.campaign.escape.escaped.splice(existingIndex, 1)
  }

  state.campaign.escape.escaped.unshift({
    name: enc.name,
    max: enc.max,
    escapedAtISO: todayISO(),
    times
  })

  const line = bank.escapeLines ? pick(bank.escapeLines) : "The foe escapes into the dark"
  state.campaign.narrative.lastText = `${line}.`

  // Replace with a fresh encounter.
  state.campaign.encounter = spawnEncounter(state, { force: "enemy" })
}

export function ensureTodaySeedData(state){
  const today = todayISO()
  if (state.today.dateISO !== today) {
    // Keep the shape consistent so UI code can safely read `today.counts`.
    state.today = { dateISO: today, completedQuestIds: [], xpEarned: 0, counts: {} }
    state.user.lastActiveISO = today

    // Avoid recursion: ensureCampaignShape may call spawnEncounter when encounter is missing.
  // Only call ensureCampaignShape when we were not invoked from ensureCampaignShape itself.
  if (!opts._fromEnsureShape) ensureCampaignShape(state)
    handleOvernightEncounter(state)

    state.campaign.area.daysInArea = (state.campaign.area.daysInArea || 1) + 1

    const bank = BANKS[state.user.themeId || "fantasy"]
    const stageText = bank.thresholds[clamp(state.campaign.area.sceneIndex || 0, 0, bank.thresholds.length - 1)]
    state.campaign.narrative.lastText = `${stageText}. ${composeAmbient(state)}`

    state._touched = true
  }
  return state
}

export function ensureCampaignShape(state){
  if (!state.campaign) state.campaign = {}

  const themeId = state.user?.themeId || "fantasy"

  if (!state.campaign.chapter) state.campaign.chapter = 1
  if (state.campaign.areaIndex === undefined || state.campaign.areaIndex === null) state.campaign.areaIndex = 0

  if (!state.campaign.area) {
    state.campaign.area = startNewArea(themeId, state.campaign.areaIndex)
  }

  if (!state.campaign.area.targetProgress) {
    state.campaign.area.targetProgress = 100
  }

  if (!state.campaign.escape) {
    state.campaign.escape = {
      escaped: [],
      returnedThisArea: false,
      lastEscapedName: null
    }
  }
  if (!Array.isArray(state.campaign.escape.escaped)) state.campaign.escape.escaped = []
  if (state.campaign.escape.returnedThisArea === undefined) state.campaign.escape.returnedThisArea = false

  if (state.campaign.pendingSupport === undefined) state.campaign.pendingSupport = null

  if (!state.campaign.narrative) state.campaign.narrative = { lastLineId: null, lastText: "" }
  if (!state.campaign.narrative.lastText) {
    state.campaign.narrative.lastText = composeAmbient(state)
  }

  ensureStats(state)

  if (!state.campaign.encounter) {
    const force = state.campaign.forceSupportNext ? "support" : null
    state.campaign.encounter = spawnEncounter(state, { force, _fromEnsureShape: true })
    state.campaign.forceSupportNext = false
  }

  if (!state.inventory) state.inventory = { equippedWeaponId: null, weapons: [], modules: [] }
  if (!state.inventory.weapons) state.inventory.weapons = []
  if (!state.inventory.modules) state.inventory.modules = []
}

export function progressAreaFromQuest(state, quest, opts = {}){
  // Avoid recursion: ensureCampaignShape may call spawnEncounter when encounter is missing.
  // Only call ensureCampaignShape when we were not invoked from ensureCampaignShape itself.
  if (!opts._fromEnsureShape) ensureCampaignShape(state)

  const w = quest?.weight ?? 1
  const base = 6
  const gain = Math.round(base * w)

  state.campaign.area.progress = clamp((state.campaign.area.progress || 0) + gain, 0, (state.campaign.area.targetProgress || 100))

  const prevScene = state.campaign.area.sceneIndex || 0
  const nextScene = sceneIndexForProgress(state.campaign.area.progress, state.campaign.area.targetProgress)
  if (nextScene !== prevScene) {
    state.campaign.area.sceneIndex = nextScene
    state.campaign.narrative.lastText = `${sceneThresholdText(state)}. ${composeAmbient(state)}`
  }

  return { gain, sceneChanged: nextScene !== prevScene }
}

export function sceneIndexForProgress(progress, targetProgress){
  const t = targetProgress || 100
  const pct = t ? (progress / t) * 100 : 0
  if (pct >= 100) return 4
  if (pct >= 75) return 3
  if (pct >= 50) return 2
  if (pct >= 25) return 1
  return 0
}

export function sceneThresholdText(state){
  const themeId = state.user?.themeId || "fantasy"
  const bank = BANKS[themeId]
  const idx = clamp(state.campaign.area.sceneIndex || 0, 0, bank.thresholds.length - 1)
  return bank.thresholds[idx]
}

export function composeAmbient(state){
  const themeId = state.user?.themeId || "fantasy"
  const bank = BANKS[themeId]
  const a = pick(bank.ambientA)
  const b = pick(bank.ambientB)
  const l = pick(bank.landmarks)
  return `${a}. ${b}. ${l}.`
}

export function startNewArea(themeId, areaIndex){
  const bank = BANKS[themeId]
  const areaType = bank.areaTypes[areaIndex % bank.areaTypes.length]
  const name = pick(areaType.names)

  const plan = rollAreaPlan()

  const range = areaType.targetRange || [90, 130]
  const baseTarget = Math.max(60, Math.round(range[0] + Math.random() * (range[1] - range[0])))

  // Make length feel intentional:
  let targetProgress = baseTarget
  if (plan === "brute") targetProgress = Math.round(baseTarget * 1.28)
  if (plan === "swarm") targetProgress = Math.round(baseTarget * 0.82)
  if (plan === "mixed") targetProgress = Math.round(baseTarget * 1.05)
  targetProgress = Math.max(60, targetProgress)

  return {
    id: `a_${themeId}_${areaIndex}`,
    type: areaType.id,
    name,
    progress: 0,
    targetProgress,
    sceneIndex: 0,
    daysInArea: 1,
    plan,
    bossSpawned: false
  }
}

export function rollAreaPlan(){
  const r = Math.random()
  if (r < 0.25) return "brute"
  if (r < 0.55) return "swarm"
  return "mixed"
}

export function shouldSpawnBoss(state){
  return (state.campaign.area.progress || 0) >= (state.campaign.area.targetProgress || 100) && !state.campaign.area.bossSpawned
}

function spawnEnemyEncounter(state){
  const themeId = state.user?.themeId || "fantasy"
  const bank = BANKS[themeId]
  const level = state.user?.level || 1
  const plan = state.campaign.area.plan || "mixed"

  // If a foe escaped earlier in this area, it may return right before the boss.
  if (shouldSpawnBoss(state) && state.campaign.escape?.escaped?.length && !state.campaign.escape.returnedThisArea) {
    const chance = 0.7
    if (Math.random() < chance) {
      const escaped = state.campaign.escape.escaped.pop()
      state.campaign.escape.returnedThisArea = true

      const times = escaped?.times || 1
      const name = escaped?.name || pick(bank.eliteEnemies)
      const hpBase = Math.round((escaped?.max || 70) * (1.25 + Math.min(0.25, (times - 1) * 0.08)))
      const max = hpBase + (level - 1) * 5

      const line = bank.returnLines ? pick(bank.returnLines) : "A familiar threat returns, stronger than before"
      state.campaign.narrative.lastText = `${line}: ${name}.`

      return { id: `e_return_${Date.now()}`, type: "enemy", name, subtype: "minor", isBoss: false, isReturn: true, returnTimes: times, max: max, progress: max }
    }
  }

  if (shouldSpawnBoss(state)) {
    state.campaign.area.bossSpawned = true
    const name = pick(bank.bosses)
    const max = 110 + (level - 1) * 7
    return { id: `e_boss_${Date.now()}`, type: "enemy", name, subtype: "boss", isBoss: true, max: max, progress: max }
  }

  const isElite = plan === "brute" || (plan === "mixed" && (state.campaign.area.progress || 0) >= 50 && Math.random() < 0.6)
  const name = isElite ? pick(bank.eliteEnemies) : pick(bank.minorEnemies)

  let base = isElite ? 70 : 38
  if (plan === "swarm") base = isElite ? 60 : 28
  if (plan === "brute") base = isElite ? 95 : 70

  const max = base + (level - 1) * (isElite ? 6 : 3)
  return { id: `e_minor_${Date.now()}`, type: "enemy", name, subtype: "minor", isBoss: false, max: max, progress: max }
}

function spawnSupportEncounter(state){
  const themeId = state.user?.themeId || "fantasy"
  const bank = BANKS[themeId]
  const level = state.user?.level || 1
  const plan = state.campaign.area.plan || "mixed"

  const mission = pick(bank.supportMissions || []) || { kind: "repair", title: "Stabilize the route", detail: "You pause to help before moving on" }
  const kind = mission.kind || "repair"

  let baseMax = 54
  if (kind === "unlock") baseMax = 40
  if (kind === "repair") baseMax = 62
  if (kind === "rescue") baseMax = 58
  if (kind === "assist") baseMax = 48
  if (kind === "escort") baseMax = 66
  if (kind === "defense") baseMax = 72

  // Plan biases
  if (plan === "brute") baseMax = Math.round(baseMax * 1.12)
  if (plan === "swarm") baseMax = Math.round(baseMax * 0.9)

  const max = Math.max(28, baseMax + (level - 1) * 4)

  state.campaign.narrative.lastText = mission.detail

  // Hybrid support missions can trigger ambushes mid-way, then resume.
  let hybrid = null
  if (kind === "escort") {
    hybrid = { enabled: true, triggers: [0.33, 0.66], nextIndex: 0, label: "ambush" }
  } else if (kind === "defense") {
    hybrid = { enabled: true, triggers: [0.25, 0.5, 0.75], nextIndex: 0, label: "wave" }
  } else if (mission.hybrid === true) {
    hybrid = { enabled: true, triggers: [0.5], nextIndex: 0, label: "ambush" }
  } else {
    // Small chance that any support mission becomes a hybrid moment.
    const p = plan === "mixed" ? 0.22 : (plan === "brute" ? 0.18 : 0.14)
    if (Math.random() < p) hybrid = { enabled: true, triggers: [0.5], nextIndex: 0, label: "ambush" }
  }

  return {
    id: `s_${kind}_${Date.now()}`,
    type: "support",
    kind,
    name: mission.title,
    detail: mission.detail,
    max,
    progress: 0,
    isBoss: false,
    hybrid,
    ambushesResolved: 0
  }
}

function spawnAmbushEnemyEncounter(state, supportKind){
  const themeId = state.user?.themeId || "fantasy"
  const bank = BANKS[themeId]
  const level = state.user?.level || 1

  const pool = bank.ambushEnemies || bank.minorEnemies || ["Raider"]
  const name = pick(pool)

  let base = 26
  if (supportKind === "escort") base = 30
  if (supportKind === "defense") base = 34

  const max = base + (level - 1) * 3

  // Daily Edge: mitigate the first ambush enemy
  const flags = state.campaign.flags || {}
  let mitigatedMax = max
  if (flags.firstAmbushMitigation && !flags._usedAmbushMitigation) {
    flags._usedAmbushMitigation = true
    mitigatedMax = Math.max(10, Math.round(max * (1 - flags.firstAmbushMitigation)))
  }
  const linePool = bank.ambushLines || ["An ambush erupts from the shadows", "A sudden threat interrupts your work", "Warning alarms spike. Contact ahead"]
  state.campaign.narrative.lastText = `${pick(linePool)}: ${name}.`

  return { id: `e_ambush_${Date.now()}`, type: "enemy", name, subtype: "ambush", isBoss: false, max: mitigatedMax, progress: mitigatedMax, fromSupport: true }
}

export function maybeTriggerHybridAmbush(state, opts = {}){
  // Avoid recursion: ensureCampaignShape may call spawnEncounter when encounter is missing.
  // Only call ensureCampaignShape when we were not invoked from ensureCampaignShape itself.
  if (!opts._fromEnsureShape) ensureCampaignShape(state)
  const enc = state.campaign.encounter
  if (!enc || enc.type !== "support") return false
  if (!enc.hybrid || !enc.hybrid.enabled) return false
  if (state.campaign.pendingSupport) return false

  const idx = enc.hybrid.nextIndex ?? 0
  const triggers = enc.hybrid.triggers || []
  if (idx >= triggers.length) return false

  const threshold = triggers[idx]
  if (enc.max && enc.progress >= Math.round(enc.max * threshold)) {
    // Save support encounter to resume later
    state.campaign.pendingSupport = enc
    state.campaign.pendingSupport.hybrid.nextIndex = idx + 1

    // Spawn an ambush enemy
    state.campaign.encounter = spawnAmbushEnemyEncounter(state, enc.kind)

    return true
  }
  return false
}



export function spawnEncounter(state, opts = {}){
  const flags = state.campaign.flags || {}
  if (flags.forceSupportFirstEncounter && !flags._usedForceSupport) {
    flags._usedForceSupport = true
    return spawnSupportEncounter(state)
  }
  // Avoid recursion: ensureCampaignShape may call spawnEncounter when encounter is missing.
  // Only call ensureCampaignShape when we were not invoked from ensureCampaignShape itself.
  if (!opts._fromEnsureShape) ensureCampaignShape(state)

  const force = opts.force
  if (force === "enemy") return spawnEnemyEncounter(state)
  if (force === "support") return spawnSupportEncounter(state)

  // After boss defeat, always give a breather.
  if (state.campaign.forceSupportNext) {
    return spawnSupportEncounter(state)
  }

  // Never replace the boss with a support encounter.
  if (shouldSpawnBoss(state)) {
    return spawnEnemyEncounter(state)
  }

  // Normal pacing: occasional support encounters.
  const plan = state.campaign.area.plan || "mixed"
  let pSupport = 0.15
  if (plan === "brute") pSupport = 0.2
  if (plan === "swarm") pSupport = 0.12

  if (Math.random() < pSupport) return spawnSupportEncounter(state)
  return spawnEnemyEncounter(state)
}

export function isEncounterComplete(enc){
  if (!enc) return false
  if (enc.type === "enemy") return (enc.progress || 0) <= 0
  return (enc.progress || 0) >= (enc.max || 0)
}

export function onEncounterCompleted(state, opts = {}){
  // Avoid recursion: ensureCampaignShape may call spawnEncounter when encounter is missing.
  // Only call ensureCampaignShape when we were not invoked from ensureCampaignShape itself.
  if (!opts._fromEnsureShape) ensureCampaignShape(state)
  ensureStats(state)

  const themeId = state.user?.themeId || "fantasy"
  const bank = BANKS[themeId]
  const enc = state.campaign.encounter

  if (!enc) return {}

  if (enc.type === "support") {
    if (enc.kind === "rescue") state.campaign.stats.rescuesCompleted += 1
    if (enc.kind === "repair") state.campaign.stats.repairsCompleted += 1
    if (enc.kind === "unlock") state.campaign.stats.unlocksCompleted += 1
    if (enc.kind === "assist") state.campaign.stats.assistsCompleted += 1
    if (enc.kind === "escort") state.campaign.stats.assistsCompleted += 1
    if (enc.kind === "defense") state.campaign.stats.assistsCompleted += 1

    const line = pick(bank.supportComplete || ["All clear. You move on"])
    state.campaign.narrative.lastText = `${line}. ${composeAmbient(state)}`
    // Move on to the next encounter immediately.
    state.campaign.encounter = spawnEncounter(state, { _fromEnsureShape: true })
    return { supportCompleted: true }
  }

  // Enemy completion
  state.campaign.stats.enemiesDefeated += 1

  // If this was an ambush during a support mission, resume that mission.
  if (enc.fromSupport && state.campaign.pendingSupport) {
    const support = state.campaign.pendingSupport
    state.campaign.pendingSupport = null
    support.ambushesResolved = (support.ambushesResolved || 0) + 1

    const resumePool = bank.supportResume || ["Threat cleared. You return to the objective", "Area secured. Continue the mission", "The interruption ends. You press on"]
    state.campaign.narrative.lastText = `${pick(resumePool)}. ${support.detail}`

    state.campaign.encounter = support
    return { resumeSupport: true, bossDefeated: false }
  }

  const wasReturn = !!enc.isReturn
  if (wasReturn) {
    const line = bank.returnDefeat ? pick(bank.returnDefeat) : "The returning threat falls at last"
    state.campaign.narrative.lastText = `${line}. ${composeAmbient(state)}`
    state.campaign.encounter = spawnEncounter(state, { _fromEnsureShape: true })
    return { bossDefeated: false, returnedDefeated: true }
  }

  const wasBoss = !!enc.isBoss || enc.subtype === "boss"
  if (wasBoss) {
    const line = pick(bank.bossDefeat)
    state.campaign.narrative.lastText = `${line}. ${composeAmbient(state)}`
    // Advance immediately into the next area (includes a breather support encounter).
    advanceToNextArea(state, { _fromEnsureShape: true })
    return { bossDefeated: true }
  }

  state.campaign.narrative.lastText =
    shouldSpawnBoss(state)
      ? `${sceneThresholdText(state)}. A major threat approaches.`
      : `Enemy defeated. Momentum holds.`

  // Spawn the next encounter so the player keeps moving.
  state.campaign.encounter = spawnEncounter(state, { _fromEnsureShape: true })
  return { bossDefeated: false }
}

export function advanceToNextArea(state, opts = {}){
  // Avoid recursion: ensureCampaignShape may call spawnEncounter when encounter is missing.
  // Only call ensureCampaignShape when we were not invoked from ensureCampaignShape itself.
  if (!opts._fromEnsureShape) ensureCampaignShape(state)

  const themeId = state.user?.themeId || "fantasy"
  state.campaign.chapter = (state.campaign.chapter || 1) + 1
  state.campaign.areaIndex = (state.campaign.areaIndex || 0) + 1

  state.campaign.area = startNewArea(themeId, state.campaign.areaIndex)
  if (state.campaign.escape) state.campaign.escape.returnedThisArea = false

  // Force a quiet/support encounter as a breather at the start of the new area.
  state.campaign.forceSupportNext = true

  if (!state.campaign.narrative) state.campaign.narrative = { lastText: "" }
  state.campaign.narrative.lastText = `New sector entered. ${composeAmbient(state)}`

  state.campaign.encounter = spawnEncounter(state, { force: "support" })
  state.campaign.forceSupportNext = false

  return state
}