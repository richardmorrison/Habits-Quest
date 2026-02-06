export function getDailyXpPool(state){
    const base = state.xp?.dailyPoolBase ?? 40
    const growth = state.xp?.dailyPoolGrowthPerLevel ?? 5
    const level = state.user.level ?? 1
    return base + level * growth
}

export function calculateXpForQuest(state, quest){
    const pool = getDailyXpPool(state)

    const completedIds = state.today.completedQuestIds
    const completedQuests = state.quests.filter(q => completedIds.includes(q.id))

    const totalWeight = completedQuests.reduce((sum, q) => sum + (q.weight ?? 1), 0)

    const questWeight = quest.weight ?? 1

    if (totalWeight === 0) return 0

    return Math.round((pool * questWeight) / totalWeight)
}