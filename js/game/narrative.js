const LINES = [
  { id: "start_1", tones: ["Steady Progress", "Getting Stronger", "Calm and Kind"], text: "You steady your breath. The ruins feel less scary today." },
  { id: "start_2", tones: ["Playful Chaos"], text: "You kick a pebble. It is dramatic. The enemy is not impressed." },
  { id: "start_3", tones: ["Survival Mode"], text: "You are here. That counts. The path waits patiently." },
  { id: "hit_1", tones: ["Steady Progress", "Discipline and Focus"], text: "A clean hit. Small wins stack up." },
  { id: "hit_2", tones: ["Getting Stronger"], text: "You feel stronger. The enemy notices." },
  { id: "hit_3", tones: ["Playful Chaos"], text: "Bonk. The enemy wobbles like jelly." }
];

export function pickLine({ themeId, tone, kind }){
  const list = LINES.filter((l) => (l.themeIds || ["fantasy"]).includes(themeId))
  const tonePool = list.filter((l) => l.tones.includes(tone))
  const pool = tonePool.length ? tonePool : list
  const filtered = kind ? pool.filter((l) => l.id.startsWith(kind)) : pool
  const use = filtered.length ? filtered : pool
  return use[Math.floor(Math.random() * use.length)]
}