const LINES = [
  { id: "start_1", tones: ["Steady Progress", "Getting Stronger", "Calm and Kind"], text: "You steady your breath. The ruins feel less scary today." },
  { id: "start_2", tones: ["Playful Chaos"], text: "You kick a pebble. It is dramatic. The enemy is not impressed." },
  { id: "start_3", tones: ["Survival Mode"], text: "You are here. That counts. The path waits patiently." },
  { id: "hit_1", tones: ["Steady Progress", "Discipline and Focus"], text: "A clean hit. Small wins stack up." },
  { id: "hit_2", tones: ["Getting Stronger"], text: "You feel stronger. The enemy notices." },
  { id: "hit_3", tones: ["Playful Chaos"], text: "Bonk. The enemy wobbles like jelly." }
];

export function pickLine({ tone, kind }){
  const pool = LINES.filter((l) => l.tones.includes(tone));
  const list = pool.length ? pool : LINES;
  const filtered = kind ? list.filter((l) => l.id.startsWith(kind)) : list;
  const use = filtered.length ? filtered : list;
  return use[Math.floor(Math.random() * use.length)];
}
