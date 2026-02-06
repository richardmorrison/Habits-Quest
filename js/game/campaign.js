import { todayISO } from "../utils/time.js";

export function ensureTodaySeedData(state){
  const today = todayISO();
  if (state.today.dateISO !== today) {
    state.today = { dateISO: today, completedQuestIds: [], xpEarned: 0 };
    state.user.lastActiveISO = today;
    state._touched = true;
  }
  return state;
}
