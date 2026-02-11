import { el } from "../utils/dom.js";
import { uid, todayISO } from "../utils/time.js";

const CATEGORIES = ["Fitness", "Health", "Mind", "Project", "Life", "Custom"];

export async function openAddQuestModal({ onSave }){
  const overlay = document.getElementById("modalOverlay");
  overlay.innerHTML = "";
  overlay.classList.remove("is-hidden");

  const close = () => {
    overlay.classList.add("is-hidden");
    overlay.innerHTML = "";
  };

  const form = el("form", {}, []);

  const titleField = field("Quest name", el("input", { name: "title", placeholder: "Example: Push ups", required: "true" }));
  const catSelect = el("select", { name: "category" }, CATEGORIES.map((c) => el("option", { value: c }, [c])));
  const catField = field("Category", catSelect);

  const repeatSelect = el("select", { name: "repeatType" }, [
    el("option", { value: "daily" }, ["Daily"]),
    el("option", { value: "times_per_week" }, ["X times per week"])
  ]);
  const repeatField = field("Repeat", repeatSelect);

  const perWeekInput = el("input", { name: "timesPerWeek", type: "number", min: "1", max: "7", value: "3" });
  const perWeekField = field("Times per week", perWeekInput);
  perWeekField.style.display = "none";

  repeatSelect.addEventListener("change", () => {
    perWeekField.style.display = repeatSelect.value === "times_per_week" ? "" : "none";
  });

  const effortSelect = el("select", { name: "effortType" }, [
    el("option", { value: "simple" }, ["Simple complete"]),
    el("option", { value: "reps" }, ["Reps"]),
    el("option", { value: "sets_reps" }, ["Sets × reps"])
  ]);
  const effortField = field("Effort type", effortSelect);

  const repsBase = el("input", { name: "repsBase", type: "number", min: "1", value: "10" });
  const repsStep = el("input", { name: "repsStep", type: "number", min: "0", value: "10" });
  const autoRank = el("select", { name: "autoRankUp" }, [
    el("option", { value: "true" }, ["Auto increase difficulty"]),
    el("option", { value: "false" }, ["Manual increase"])
  ]);
  const repsGroup = el("div", {}, [
    field("Starting reps", repsBase),
    field("Increase per rank", repsStep),
    field("Rank up behavior", autoRank)
  ]);

  const sets = el("input", { name: "sets", type: "number", min: "1", value: "3" });
  const reps = el("input", { name: "reps", type: "number", min: "1", value: "10" });
  const setsGroup = el("div", {}, [
    field("Sets", sets),
    field("Reps", reps)
  ]);

  repsGroup.style.display = "none";
  setsGroup.style.display = "none";

  function updateEffort(){
    repsGroup.style.display = effortSelect.value === "reps" ? "" : "none";
    setsGroup.style.display = effortSelect.value === "sets_reps" ? "" : "none";
  }
  effortSelect.addEventListener("change", updateEffort);
  updateEffort();

  form.appendChild(titleField);
  form.appendChild(catField);
  form.appendChild(repeatField);
  form.appendChild(perWeekField);
  form.appendChild(el("hr"));
  form.appendChild(effortField);
  form.appendChild(repsGroup);
  form.appendChild(setsGroup);

  const modal = el("div", { class: "modal" }, [
    el("div", { class: "modal__header" }, [
      el("div", { class: "modal__title" }, ["Add quest"]),
      el("button", { class: "btn slim", type: "button", onclick: close }, ["Close"])
    ]),
    el("div", { class: "modal__body" }, [form]),
    el("div", { class: "modal__footer" }, [
      el("button", { class: "btn", type: "button", onclick: close }, ["Cancel"]),
      el("button", { class: "btn primary", type: "submit" }, ["Save quest"])
    ])
  ]);

  overlay.appendChild(modal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // 1) Safety check: onSave must exist
    if (typeof onSave !== "function") {
      alert("Save handler is missing. Please reload the app.")
      return
    }

    const data = new FormData(form)

    const title = String(data.get("title") || "").trim()
    if (!title) {
      alert("Please enter a quest name.")
      return
    }

    const category = String(data.get("category") || "Custom")
    const repeatType = String(data.get("repeatType") || "daily")

    const repeat =
        repeatType === "times_per_week"
            ? { type: "times_per_week", times: Number(data.get("timesPerWeek") || 3) }
            : { type: "daily" }

    const effortType = String(data.get("effortType") || "simple")
    let effort = { type: "simple" }

    if (effortType === "reps") {
      effort = {
        type: "reps",
        base: Number(data.get("repsBase") || 10),
        step: Number(data.get("repsStep") || 5),
        rank: 1,
        rankCompletionsRequired: 7,
        autoRankUp: String(data.get("autoRankUp")) === "true"
      }
    }

    if (effortType === "sets_reps") {
      effort = {
        type: "sets_reps",
        sets: Number(data.get("sets") || 3),
        reps: Number(data.get("reps") || 10)
      }
    }

    const weight = effort.type === "simple" ? 1.0 : (effort.type === "reps" ? 1.2 : 1.4)

    const quest = {
      id: uid("q"),
      title,
      category,
      repeat,
      effort,
      weight,
      status: "active",
      createdAtISO: todayISO()
    }

    try {
      await onSave(quest)
      close()
    } catch (err) {
      console.error(err)
      alert("Could not save quest. Check console for details.")
    }
  })
}

function field(labelText, inputEl){
  return el("div", { class: "field" }, [
    el("label", {}, [labelText]),
    inputEl
  ]);
}
