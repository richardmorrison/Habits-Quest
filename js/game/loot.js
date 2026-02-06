import { uid } from "../utils/time.js"

const FANTASY_WEAPONS = [
  { name: "Moss Cutter", stat: "power", amount: 1 },
  { name: "Ruins Pike", stat: "power", amount: 2 },
  { name: "Shield of Calm", stat: "endurance", amount: 2 }
]

const SPACE_MODULES = [
  { name: "Thruster Coil", stat: "power", amount: 1 },
  { name: "Reinforced Plating", stat: "endurance", amount: 2 },
  { name: "Sensor Array", stat: "power", amount: 2 }
]

export function rollBossReward(themeId){
  const pool = themeId === "space" ? SPACE_MODULES : FANTASY_WEAPONS
  const pick = pool[Math.floor(Math.random() * pool.length)]

  return {
    id: uid("loot"),
    kind: themeId === "space" ? "module" : "weapon",
    name: pick.name,
    stat: pick.stat,
    amount: pick.amount,
    earnedAt: Date.now()
  }
}

export function applyRewardToStats(state, reward){
  if (!reward) return

  if (reward.stat === "power") state.user.power = (state.user.power || 6) + reward.amount
  if (reward.stat === "endurance") state.user.endurance = (state.user.endurance || 5) + reward.amount
}