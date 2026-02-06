const CATEGORY_BASE_DAMAGE = {
  Fitness: 8,
  Project: 7,
  Mind: 6,
  Health: 6,
  Life: 5,
  Custom: 6
};

export function computeDamage(state, quest){
  const base = CATEGORY_BASE_DAMAGE[quest.category] ?? 6;
  const powerBonus = Math.floor((state.user.power ?? 6) / 3);
  const weaponBonus = 0;
  return base + powerBonus + weaponBonus;
}

export function applyDamage(state, dmg){
  state.campaign.enemy.hp = Math.max(0, state.campaign.enemy.hp - dmg);
  return state;
}
