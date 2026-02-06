export function xpRequiredForLevel(level){
    const base = 80
    const step = 40
    return base + (level - 1) * step
}

export function applyLevelUps(state){
    if (!state.user) return { leveledUp: false, levelsGained: 0 }

    let leveledUp = false
    let levelsGained = 0

    while (state.user.xpTotal >= xpRequiredForLevel(state.user.level || 1)) {
        state.user.xpTotal -= xpRequiredForLevel(state.user.level || 1)
        state.user.level = (state.user.level || 1) + 1

        state.user.power = (state.user.power || 6) + 1
        state.user.endurance = (state.user.endurance || 5) + 1

        leveledUp = true
        levelsGained += 1
    }

    return { leveledUp, levelsGained }
}