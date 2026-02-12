import { el, toast } from "../utils/dom.js"
import { uid, todayISO } from "../utils/time.js"

const CATEGORIES = ["Fitness", "Health", "Mind", "Project", "Life", "Custom"]

export async function openAddQuestModal({ onSave }){
  const overlay = document.getElementById("modalOverlay")
  overlay.innerHTML = ""
  overlay.classList.remove("is-hidden")

  const close = () => {
    overlay.classList.add("is-hidden")
    overlay.innerHTML = ""
  }

  const form = el("form", { id: "addQuestForm" }, [])

  const titleInput = el("input", { name: "title", placeholder: "Example: Drink water", required: "true" })
  const titleField = field("Quest name", titleInput)
  const titleError = el("div", { class: "formError titleError", role: "alert", style: "display:none" }, [""])
  titleField.appendChild(titleError)

    const catGroup = segmented("category", CATEGORIES, "Fitness")
  const catField = field("Category", catGroup)

    // Repeat: daily default, or once
  const repeatGroup = segmented("repeatType", [
    { value: "daily", label: "Every day" },
    { value: "once", label: "Once" }
  ], "daily")
  const repeatField = field("Repeat", repeatGroup)

    // Effort: one tap, or count taps
  const effortGroup = segmented("effortType", [
    { value: "simple", label: "One tap" },
    { value: "count", label: "Count" }
  ], "simple")
  const effortField = field("Effort", effortGroup)

  const countTarget = el("input", { name: "countTarget", type: "number", min: "2", max: "50", value: "3" })
  const countField = field("Count target", countTarget)
  countField.style.display = "none"

    function getRadioValue(name, fallback){
    const checked = form.querySelector(`input[name="${name}"]:checked`)
    return checked ? checked.value : fallback
  }

  function updateEffort(){
    countField.style.display = getRadioValue("effortType", "simple") === "count" ? "" : "none"
  }
  form.addEventListener("change", (e) => {
    if (e.target && e.target.name === "effortType") updateEffort()
  })
  updateEffort()

  form.appendChild(titleField)
  form.appendChild(catField)
  form.appendChild(repeatField)
  form.appendChild(el("hr"))
  form.appendChild(effortField)
  form.appendChild(countField)

  const saveBtn = el("button", { class: "btn primary", type: "submit", form: "addQuestForm", disabled: "true", id: "saveQuestBtn" }, ["Save quest"])

  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal__header" }, [
      el("div", { class: "modal__title" }, ["Add quest"]),
      el("button", { class: "btn slim", type: "button", onclick: close }, ["Close"])
    ]),
    el("div", { class: "modal__body" }, [form]),
    el("div", { class: "modal__footer" }, [
      el("button", { class: "btn", type: "button", onclick: close }, ["Cancel"]),
      saveBtn
    ])
  ])

  overlay.appendChild(modal)

  const setTitleError = (msg) => {
    if (!titleError) return
    titleError.textContent = msg || ""
    titleError.style.display = msg ? "" : "none"
  }

  const validate = () => {
    const titleVal = String(titleInput.value || "").trim()
    const effortType = getRadioValue("effortType", "simple")
    const targetVal = Number(countTarget.value || 3)
    let ok = true

    if (!titleVal) {
      ok = false
      setTitleError("Please enter a quest name.")
    } else {
      setTitleError("")
    }

    if (effortType === "count") {
      const tNum = Math.max(2, Math.min(50, targetVal))
      if (!Number.isFinite(tNum)) ok = false
    }

    if (ok) {
      saveBtn.removeAttribute("disabled")
    } else {
      saveBtn.setAttribute("disabled", "true")
    }
    return ok
  }

  titleInput.addEventListener("input", validate)
  countTarget.addEventListener("input", validate)
  form.addEventListener("change", validate)
  validate()

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!validate()) {
      titleInput.focus()
      return
    }

    if (typeof onSave !== "function") {
      toast("Save handler is missing. Reload the app.")
      return
    }

    const data = new FormData(form)
    const title = String(data.get("title") || "").trim()

    const category = String(data.get("category") || "Custom")
    const repeatType = String(data.get("repeatType") || "daily")

    const repeat = repeatType === "once" ? { type: "once" } : { type: "daily" }

    const effortType = String(data.get("effortType") || "simple")
    let effort = { type: "simple" }

    if (effortType === "count") {
      const target = Math.max(2, Math.min(50, Number(data.get("countTarget") || 3)))
      effort = { type: "count", target }
    }

    // Light weighting: count tasks slightly heavier
    const weight = effort.type === "count" ? 1.15 : 1.0

    const quest = {
      id: uid("q"),
      title,
      category,
      repeat,
      effort,
      weight,
      starred: false,
      status: "active",
      createdAtISO: todayISO()
    }

    try {
      await onSave(quest)
      close()
    } catch (err) {
      console.error(err)
      toast("Could not save quest. Check console for details.")
    }
  })
}


function segmented(name, options, defaultValue){
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o))
  return el("div", { class: "segmented" }, opts.map((o, idx) => {
    const id = `${name}_${idx}`
    const input = el("input", { id, type: "radio", name, value: o.value })
    if (String(o.value) === String(defaultValue)) input.checked = true
    const label = el("label", { class: "segmented__btn", for: id }, [o.label])
    return el("div", { class: "segmented__item" }, [input, label])
  }))
}

function field(labelText, inputEl){
  return el("div", { class: "field" }, [
    el("label", {}, [labelText]),
    inputEl
  ])
}