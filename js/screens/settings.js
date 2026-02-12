import { getState, setState } from "../state.js"
import { el, toast } from "../utils/dom.js"
import { Store } from "../store.js"
import { THEMES } from "../game/theme.js"

const TONES = [
  "Steady Progress",
  "Getting Stronger",
  "Survival Mode",
  "Discipline and Focus",
  "Playful Chaos",
  "Calm and Kind"
]

export function renderSettings({ root }){
  const state = getState()

  const themeSelect = el(
    "select",
    { id: "themeSelect" },
    Object.values(THEMES).map((t) =>
      el(
        "option",
        { value: t.id, selected: t.id === (state.user.themeId || "fantasy") ? "true" : null },
        [t.name]
      )
    )
  )

  const toneSelect = el(
    "select",
    { id: "toneSelect" },
    TONES.map((t) =>
      el("option", { value: t, selected: t === state.user.tone ? "true" : null }, [t])
    )
  )

  const soundToggle = el("input", {
    id: "soundEnabled",
    type: "checkbox",
    checked: state.user.soundEnabled ? "true" : null
  })

  const vibrateToggle = el("input", {
    id: "vibrateEnabled",
    type: "checkbox",
    checked: state.user.vibrateEnabled ? "true" : null
  })


  const card = el("div", { class: "card section stack" }, [
    el("div", { class: "sectionTitle" }, ["Settings"]),
    el("div", { class: "muted" }, [
      "Theme changes the story world and labels. Tone changes the narrative voice."
    ]),

    el("div", { class: "field" }, [el("label", {}, ["Theme"]), themeSelect]),
    el("div", { class: "field" }, [el("label", {}, ["Narrative tone"]), toneSelect]),

    el("div", { class: "field" }, [
      el("label", { for: "soundEnabled" }, ["Sound effects"]),
      soundToggle
    ]),
    el("div", { class: "small muted" }, [
      "Sound plays only if enabled. Your device may still block audio until you interact with the page."
    ]),

    el("div", { class: "field" }, [
      el("label", { for: "vibrateEnabled" }, ["Vibration feedback"]),
      vibrateToggle
    ]),
    el("div", { class: "small muted" }, [
      "Vibration works on some devices and browsers (often Android). If unsupported, it will do nothing."
    ]),

    el("div", { class: "rowWrap" }, [
      el("button", { class: "btn", type: "button", id: "exportBtn" }, ["Export data (JSON)"]),
      el("button", { class: "btn", type: "button", id: "importBtn" }, ["Import data (JSON)"]),
      el("button", { class: "btn", type: "button", id: "selfCheckBtn" }, ["Run self check"]),
      el("button", { class: "btn danger", type: "button", id: "resetBtn" }, ["Reset local data"])
    ]),
    el("div", { class: "small" }, ["Export and import are handy for backups while local first."])
  ])

  root.appendChild(card)

  themeSelect.addEventListener("change", async () => {
    const s = getState()
    s.user.themeId = themeSelect.value
    setState(s)
    await Store.saveApp(getState())

    const appRoot = document.getElementById("appRoot")
    if (appRoot) appRoot.dataset.theme = s.user.themeId || "fantasy"

    toast("Theme updated.")
  })

  toneSelect.addEventListener("change", async () => {
    const s = getState()
    s.user.tone = toneSelect.value
    setState(s)
    await Store.saveApp(getState())
    toast("Tone updated.")
  })

  soundToggle.addEventListener("change", async () => {
    const s = getState()
    s.user.soundEnabled = !!soundToggle.checked
    setState(s)
    await Store.saveApp(getState())
    toast(s.user.soundEnabled ? "Sound on." : "Sound off.")
  })


  vibrateToggle.addEventListener("change", async () => {
    const s = getState()
    s.user.vibrateEnabled = !!vibrateToggle.checked
    setState(s)
    await Store.saveApp(getState())
    toast(s.user.vibrateEnabled ? "Vibration on." : "Vibration off.")
  })

  root.querySelector("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "quest-rpg-export.json"
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 5000)
  })


  root.querySelector("#importBtn").addEventListener("click", () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0]
      if (!file) return
      try {
        const text = await file.text()
        const parsed = JSON.parse(text)
        setState(parsed)
        await Store.saveApp(getState())
        toast("Import complete. Reloading…")
        location.reload()
      } catch (err) {
        console.error(err)
        toast("Import failed. Make sure you selected a valid export JSON.")
      }
    })
    input.click()
  })


  root.querySelector("#selfCheckBtn").addEventListener("click", () => {
    try {
      const s0 = getState()
      const questIds = new Set()
      let dupes = 0
      for (const q of (s0.quests || [])) {
        if (!q || !q.id) continue
        if (questIds.has(q.id)) dupes++
        questIds.add(q.id)
      }

      let badCounts = 0
      const counts = s0.today?.counts || {}
      for (const q of (s0.quests || [])) {
        if (q?.effort?.type === "count") {
          const target = q.effort.target ?? 3
          const done = counts[q.id] ?? 0
          if (done > target) badCounts++
        }
      }

      const completed = s0.today?.completedQuestIds || []
      const missingCompleted = completed.filter((id) => !questIds.has(id)).length

      const issues = []
      if (dupes) issues.push(`${dupes} duplicate quest id`)
      if (badCounts) issues.push(`${badCounts} count over target`)
      if (missingCompleted) issues.push(`${missingCompleted} completed ids missing quest`)

      toast(issues.length ? `Self check: ${issues.join(", ")}` : "Self check: all good.")
    } catch (err) {
      console.error(err)
      toast("Self check failed. See console.")
    }
  })

  root.querySelector("#resetBtn").addEventListener("click", () => {
    openResetConfirmModal()
  })
}

function openResetConfirmModal(){
  const overlay = document.getElementById("modalOverlay")
  if (!overlay) {
    const ok = confirm("Reset local data? This clears quests and progress on this device.")
    if (!ok) return
    indexedDB.deleteDatabase("quest_rpg_db")
    location.reload()
    return
  }

  overlay.innerHTML = ""
  overlay.classList.remove("is-hidden")

  const close = () => {
    overlay.classList.add("is-hidden")
    overlay.innerHTML = ""
  }

  const input = el("input", {
    type: "text",
    placeholder: "Type RESET to confirm"
  })

  const confirmBtn = el("button", {
    class: "btn danger",
    disabled: "true",
    type: "button"
  }, ["Reset data"])

  input.addEventListener("input", () => {
    if (String(input.value || "").trim() === "RESET") {
      confirmBtn.removeAttribute("disabled")
    } else {
      confirmBtn.setAttribute("disabled", "true")
    }
  })

  confirmBtn.addEventListener("click", () => {
    indexedDB.deleteDatabase("quest_rpg_db")
    location.reload()
  })

  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal__header" }, [
      el("div", { class: "modal__title" }, ["Reset all local data"]),
      el("button", { class: "btn slim", type: "button", onclick: close }, ["Close"])
    ]),
    el("div", { class: "modal__body stack" }, [
      el("p", {}, ["This will delete your quests, progress, levels, and campaign data from this device."]),
      el("p", { class: "muted" }, ["This cannot be undone."]),
      input
    ]),
    el("div", { class: "modal__footer" }, [
      el("button", { class: "btn", type: "button", onclick: close }, ["Cancel"]),
      confirmBtn
    ])
  ])

  overlay.appendChild(modal)
}
