import { todayISO } from "../utils/time.js"

const MARK = { common: "●", uncommon: "◆", rare: "★" }

// Mechanics are identical across themes. Only wording changes.
const THEME_LABELS = {
  fantasy: {
    Stabilized: "Stabilized",
    "Calm Start": "Calm Start",
    Prepared: "Prepared",
    Shielded: "Shielded",
    "Clean Entry": "Clean Entry",
    Focus: "Focus",
    Momentum: "Momentum",
    Surge: "Surge"
  },
  space: {
    Stabilized: "Systems Stable",
    "Calm Start": "Clean Launch",
    Prepared: "Deflectors Ready",
    Shielded: "Shields Up",
    "Clean Entry": "Trajectory Locked",
    Focus: "Targeting Focus",
    Momentum: "Thrust Ready",
    Surge: "Power Surge"
  }
}

export function displayEdge(edge, themeId){
  if (!edge) return ""
  const t = themeId || "fantasy"
  const label = (THEME_LABELS[t] && THEME_LABELS[t][edge.name]) ? THEME_LABELS[t][edge.name] : edge.name
  const mark = MARK[edge.rarity] || "●"
  return `${mark} ${label}`
}

export function rollEdge({ perfectStreakDays = 0, forceCommon = false } = {}){
  const roll = Math.random()

  if (!forceCommon && perfectStreakDays >= 14 && roll > 0.72) return { name: "Surge", rarity: "rare" }
  if (!forceCommon && perfectStreakDays >= 7  && roll > 0.85) return { name: "Surge", rarity: "rare" }

  if (!forceCommon && perfectStreakDays >= 7 && roll > 0.55) return { name: "Momentum", rarity: "uncommon" }
  if (!forceCommon && perfectStreakDays >= 3 && roll > 0.60) return { name: "Momentum", rarity: "uncommon" }

  const common = ["Stabilized", "Calm Start", "Prepared", "Clean Entry", "Focus"]
  return { name: common[Math.floor(Math.random() * common.length)], rarity: "common" }
}

export function getEdgeState(state){
  const u = state.user || {}
  return {
    active: u.edgeActive || null,
    tomorrow: u.edgeTomorrow || null
  }
}

export function activateEdgeIfDue(state){
  const today = todayISO()
  const u = state.user
  if (!u) return

  // Move tomorrow edge into active edge when it becomes due
  if (u.edgeTomorrow && u.edgeTomorrow.activatesOnISO === today) {
    u.edgeActive = { ...u.edgeTomorrow, activeOnISO: today, consumed: false }
    u.edgeTomorrow = null
    u.edgeLastActivatedISO = today
    // flags get set by applyEdgeFlagsForDay
  }

  // Expire active edge if needed
  if (u.edgeActive && u.edgeActive.expiresOnISO && u.edgeActive.expiresOnISO < today) {
    u.edgeActive = null
  }
}

export function applyEdgeFlagsForDay(state){
  const u = state.user
  if (!u) return

  // Ensure campaign shape exists before we touch flags
  if (!state.campaign) state.campaign = { flags: {} }
  if (!state.campaign.flags) state.campaign.flags = {}
  const edge = u.edgeActive

  // Reset daily flags
  state.campaign.flags.noEscapeToday = false
  state.campaign.flags.forceSupportFirstEncounter = false
  state.campaign.flags.firstAmbushMitigation = 0
  state.campaign.flags.openingStrikePct = 0
  state.campaign.flags.cleanEntryApplied = false
  state.campaign.flags.focusHitsRemaining = 0

  if (!edge) return

  if (edge.name === "Stabilized") state.campaign.flags.noEscapeToday = true
  if (edge.name === "Calm Start") state.campaign.flags.forceSupportFirstEncounter = true
  if (edge.name === "Prepared") state.campaign.flags.firstAmbushMitigation = 0.12
  if (edge.name === "Shielded") state.campaign.flags.firstAmbushMitigation = 0.22
  if (edge.name === "Momentum") state.campaign.flags.openingStrikePct = 0.10
  if (edge.name === "Surge") state.campaign.flags.openingStrikePct = 0.18
  if (edge.name === "Focus") state.campaign.flags.focusHitsRemaining = 2
  if (edge.name === "Clean Entry") state.campaign.flags.cleanEntryApplied = false
}
