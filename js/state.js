import { todayISO } from "./utils/time.js";
import { deepCloneSafe } from "./utils/dom.js";

function clone(obj){
  // `structuredClone` is not available in some older browsers.
  // Use a safe JSON clone as a fallback for this app state shape.
  return (typeof structuredClone === "function")
    ? structuredClone(obj)
    : deepCloneSafe(obj);
}

let STATE = null;

export function initState(){
  if (STATE) return;

  STATE = {
    meta: { schemaVersion: 1, appVersion: "0.6.5" },

    user: {
      level: 1,
      xpTotal: 0,
      power: 6,
      endurance: 5,
      tone: "Steady Progress",
      themeId: "fantasy",
      soundEnabled: false,
      soundVolume: 0.08,
      vibrateEnabled: false,
      edgePerfectStreakDays: 0,
      edgeActive: null,
      edgeTomorrow: null,
      edgeLastActivatedISO: null,
      lastActiveISO: todayISO()
    },

    xp: { dailyPoolBase: 40, dailyPoolGrowthPerLevel: 1 },

    quests: [
      {
        id: "q_water",
        title: "Drink water",
        category: "Health",
        repeat: { type: "daily" },
        effort: { type: "simple" },
        weight: 1.0,
        starred: false,
        status: "active",
        createdAtISO: todayISO()
      },
      {
        id: "q_dentist",
        title: "Book dentist",
        category: "Life",
        repeat: { type: "once" },
        effort: { type: "simple" },
        weight: 1.0,
        starred: false,
        status: "active",
        createdAtISO: todayISO()
      },
      {
        id: "q_walk",
        title: "Walk 10 minutes",
        category: "Fitness",
        repeat: { type: "daily" },
        effort: { type: "count", target: 3 },
        weight: 1.15,
        starred: false,
        status: "active",
        createdAtISO: todayISO()
      }
    ],

    today: { dateISO: todayISO(), completedQuestIds: [], xpEarned: 0, counts: {} },
    campaign: {
      chapter: 1,
      areaIndex: 0,
      area: {
        id: "a_fantasy_0",
        type: "ruins",
        name: "Mossy Ruins",
        progress: 0,
        sceneIndex: 0,
        daysInArea: 1,
        plan: "mixed",
        bossSpawned: false
      },
      enemy: { id: "e_minor_start", name: "Moss Slime", type: "minor", isBoss: false, hpMax: 35, hp: 35 },
      narrative: { lastLineId: null, lastText: "You step into the Mossy Ruins. Cold mist clings to broken stone." }
    },

    inventory: {
      equippedWeaponId: null,
      weapons: [],
      modules: []
    },

    storyLog: [{ id: "log_start", dateISO: todayISO(), type: "system", text: "Your journey begins." }]
  };
  STATE = normalizeStateInternal(STATE);

}


function normalizeStateInternal(state){
  const s = state || {}
  if (!s.meta) s.meta = { schemaVersion: 1, appVersion: "0.6.5" }
  if (!s.meta.schemaVersion) s.meta.schemaVersion = 1
  // Keep the app version current for the on-screen version badge.
  s.meta.appVersion = "0.6.5"

  if (!s.user) s.user = {}
  if (typeof s.user.level !== "number") s.user.level = 1
  if (typeof s.user.xpTotal !== "number") s.user.xpTotal = 0
  if (typeof s.user.power !== "number") s.user.power = 6
  if (typeof s.user.endurance !== "number") s.user.endurance = 5
  if (!s.user.tone) s.user.tone = "Steady Progress"
  if (!s.user.themeId) s.user.themeId = "fantasy"
  if (typeof s.user.soundEnabled !== "boolean") s.user.soundEnabled = false
  if (typeof s.user.soundVolume !== "number") s.user.soundVolume = 0.08
  if (typeof s.user.vibrateEnabled !== "boolean") s.user.vibrateEnabled = false
  if (typeof s.user.edgePerfectStreakDays !== "number") s.user.edgePerfectStreakDays = 0
  if (!("edgeActive" in s.user)) s.user.edgeActive = null
  if (!("edgeTomorrow" in s.user)) s.user.edgeTomorrow = null
  if (!("edgeLastActivatedISO" in s.user)) s.user.edgeLastActivatedISO = null
  if (!s.user.lastActiveISO) s.user.lastActiveISO = todayISO()

  if (!s.xp) s.xp = { dailyPoolBase: 40, dailyPoolGrowthPerLevel: 1 }

  if (!Array.isArray(s.quests)) s.quests = []

  // Normalize quests and enforce basic integrity
  const seenQuestIds = new Set()
  const normalizedQuests = []
  for (const q0 of s.quests) {
    if (!q0 || typeof q0 !== "object") continue
    const q = q0
    if (!q.title) continue
    if (!q.id) q.id = `q_${Math.random().toString(36).slice(2, 10)}`
    // Ensure unique ids
    let id = String(q.id)
    if (seenQuestIds.has(id)) {
      let i = 2
      while (seenQuestIds.has(`${id}_${i}`)) i++
      id = `${id}_${i}`
      q.id = id
    }
    seenQuestIds.add(id)

    if (!q.category) q.category = "Custom"
    if (!q.repeat || typeof q.repeat !== "object") q.repeat = { type: "daily" }
    if (q.repeat.type !== "daily" && q.repeat.type !== "once") q.repeat.type = "daily"

    if (!q.effort || typeof q.effort !== "object") q.effort = { type: "simple" }
    if (q.effort.type === "count") {
      const t = Number(q.effort.target ?? 3)
      q.effort.target = Math.max(2, Math.min(50, Number.isFinite(t) ? t : 3))
    } else {
      q.effort.type = "simple"
    }

    if (typeof q.weight !== "number") q.weight = q.effort.type === "count" ? 1.15 : 1.0
    if (typeof q.starred !== "boolean") q.starred = false
    if (!q.status) q.status = "active"
    if (q.status !== "active" && q.status !== "completed") q.status = "active"

    normalizedQuests.push(q)
  }
  s.quests = normalizedQuests

  if (!s.today) s.today = { dateISO: todayISO(), completedQuestIds: [], xpEarned: 0, counts: {} }
  if (!s.today.dateISO) s.today.dateISO = todayISO()
  if (!Array.isArray(s.today.completedQuestIds)) s.today.completedQuestIds = []
  if (typeof s.today.xpEarned !== "number") s.today.xpEarned = 0
  if (!s.today.counts || typeof s.today.counts !== "object") s.today.counts = {}

  // Clean up today refs to match current quests
  const questIdSet = new Set((s.quests || []).map((q) => q.id))
  s.today.completedQuestIds = (s.today.completedQuestIds || []).filter((id) => questIdSet.has(id))
  const nextCounts = {}
  for (const [qid, val] of Object.entries(s.today.counts || {})) {
    if (!questIdSet.has(qid)) continue
    const q = (s.quests || []).find((qq) => qq.id === qid)
    const target = q?.effort?.type === "count" ? (q.effort.target ?? 3) : 1
    const done = Number(val || 0)
    nextCounts[qid] = Math.max(0, Math.min(target, Number.isFinite(done) ? done : 0))
  }
  s.today.counts = nextCounts


  if (!s.campaign) s.campaign = { chapter: 1, areaIndex: 0, area: {}, enemy: null, narrative: { lastLineId: null, lastText: "" } }
  if (!s.inventory) s.inventory = { equippedWeaponId: null, weapons: [], modules: [] }
  if (!Array.isArray(s.inventory.weapons)) s.inventory.weapons = []
  if (!Array.isArray(s.inventory.modules)) s.inventory.modules = []

  if (!Array.isArray(s.storyLog)) s.storyLog = []
  return s
}

export function normalizeState(state){
  return normalizeStateInternal(clone(state))
}

export function getState(){ return clone(normalizeStateInternal(STATE)); }
export function setState(next){ STATE = normalizeStateInternal(clone(next)); }