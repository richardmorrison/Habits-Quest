let audioCtx = null

export const HAPTICS = {
  modalOpen: 10,
  taskComplete: 12,
  enemyDefeat: [14, 45, 14],
  bossDefeat: [18, 45, 18, 55, 22],
  levelUp: [12, 35, 16, 35, 20]
}

export function vibratePattern({ enabled, pattern }){
  if (!enabled) return
  if (!navigator.vibrate) return
  try { navigator.vibrate(pattern) } catch {}
}

function getCtx(){
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

async function ensureRunning(){
  try {
    const ctx = getCtx()
    if (ctx.state === "suspended") {
      await ctx.resume()
    }
    return ctx.state === "running"
  } catch {
    return false
  }
}

function tone({ freq, start, duration, volume, type = "sine" }){
  const ctx = getCtx()

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = freq

  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(volume, start + 0.01)
  gain.gain.linearRampToValueAtTime(0, start + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(start)
  osc.stop(start + duration)
}

const CAT = {
  Fitness: { base: 220, typeA: "triangle", typeB: "sine" },   // punchy
  Health:  { base: 392, typeA: "sine", typeB: "sine" },      // gentle
  Mind:    { base: 880, typeA: "triangle", typeB: "sine" },  // airy
  Project: { base: 523.25, typeA: "square", typeB: "sine" }, // techy
  Life:    { base: 330, typeA: "sine", typeB: "triangle" },  // warm
  Custom:  { base: 659.25, typeA: "sine", typeB: "sine" }
}

export async function playTaskCompleteTick({ enabled, vibrate, category = "Custom", volume = 0.06 }){
  // haptics can be enabled independently of sound
  if (vibrate) vibratePattern({ enabled: true, pattern: HAPTICS.taskComplete })
  if (!enabled) return

  const ok = await ensureRunning()
  if (!ok) return

  const ctx = getCtx()
  const now = ctx.currentTime

  const cfg = CAT[category] || CAT.Custom
  const f1 = cfg.base
  const f2 = cfg.base * 1.5

  tone({ freq: f1, start: now, duration: 0.06, volume, type: cfg.typeA })
  tone({ freq: f2, start: now + 0.035, duration: 0.08, volume: volume * 0.7, type: cfg.typeB })
}

export async function playLevelUpChime({ enabled, vibrate, volume = 0.08 }){
  if (vibrate) vibratePattern({ enabled: true, pattern: HAPTICS.levelUp })
  if (!enabled) return

  const ok = await ensureRunning()
  if (!ok) return

  const ctx = getCtx()
  const now = ctx.currentTime

  // Rising “ta da”
  tone({ freq: 523.25, start: now, duration: 0.18, volume, type: "sine" })
  tone({ freq: 659.25, start: now + 0.12, duration: 0.18, volume, type: "sine" })
  tone({ freq: 783.99, start: now + 0.24, duration: 0.28, volume, type: "sine" })
}
