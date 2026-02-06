import { todayISO } from "./utils/time.js";

let STATE = null;

export function initState(){
  if (STATE) return;

  STATE = {
    meta: { schemaVersion: 1, appVersion: "0.1.0" },

    user: {
      level: 1,
      xpTotal: 0,
      power: 6,
      endurance: 5,
      tone: "Steady Progress",
      lastActiveISO: todayISO()
    },

    xp: { dailyPoolBase: 40, dailyPoolGrowthPerLevel: 1 },

    quests: [
      {
        id: "q_pushups",
        title: "Push ups",
        category: "Fitness",
        repeat: { type: "daily" },
        effort: { type: "reps", base: 10, step: 10, rank: 1, rankCompletionsRequired: 7, autoRankUp: true },
        weight: 1.2,
        status: "active",
        createdAtISO: todayISO()
      },
      {
        id: "q_teeth",
        title: "Brush teeth",
        category: "Life",
        repeat: { type: "daily" },
        effort: { type: "simple" },
        weight: 1.0,
        status: "active",
        createdAtISO: todayISO()
      }
    ],

    today: { dateISO: todayISO(), completedQuestIds: [], xpEarned: 0 },

    campaign: {
      chapter: 1,
      areaIndex: 0,
      theme: "Mossy Ruins",
      enemy: { id: "e_slime_001", name: "Moss Slime", type: "minor", hpMax: 35, hp: 35 },
      narrative: { lastLineId: null, lastText: "You step into the Mossy Ruins. Something squishes nearby." }
    },

    inventory: { equippedWeaponId: null, weapons: [] },

    storyLog: [{ id: "log_start", dateISO: todayISO(), type: "system", text: "Your journey begins." }]
  };
}

export function getState(){ return structuredClone(STATE); }
export function setState(next){ STATE = structuredClone(next); }
