export const THEMES = {
    fantasy: {
        id: "fantasy",
        name: "Fantasy (Ruins and Bosses)",
        labels: {
            campaignTitle: "Adventure",
            enemy: "Enemy",
            hp: "HP",
            chapter: "Chapter",
            addQuest: "Add quest",
            todayQuests: "Today quests",
            doIt: "Do it",
            done: "Done"
        }
    },

    space: {
        id: "space",
        name: "Space (Expedition and Anomalies)",
        labels: {
            campaignTitle: "Expedition",
            enemy: "Anomaly",
            hp: "Stability",
            chapter: "Sector",
            addQuest: "Add objective",
            todayQuests: "Today objectives",
            doIt: "Engage",
            done: "Logged"
        }
    }
}

export function getTheme(state){
    const id = state?.user?.themeId || "fantasy"
    return THEMES[id] || THEMES.fantasy
}