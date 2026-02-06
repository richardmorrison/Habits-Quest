import { getState, setState } from "../state.js";
import { el, toast } from "../utils/dom.js";
import { Store } from "../store.js";

const TONES = [
  "Steady Progress",
  "Getting Stronger",
  "Survival Mode",
  "Discipline and Focus",
  "Playful Chaos",
  "Calm and Kind"
];

export function renderSettings({ root }){
  const state = getState();

  const toneSelect = el("select", { id: "toneSelect" }, TONES.map((t) =>
    el("option", { value: t, selected: t === state.user.tone ? "true" : null }, [t])
  ));

  const card = el("div", { class: "card section stack" }, [
    el("div", { class: "sectionTitle" }, ["Settings"]),
    el("div", { class: "muted" }, ["Tone changes narrative voice only. It does not change stats or difficulty."]),
    el("div", { class: "field" }, [
      el("label", {}, ["Narrative tone"]),
      toneSelect
    ]),
    el("div", { class: "rowWrap" }, [
      el("button", { class: "btn", type: "button", id: "exportBtn" }, ["Export data (JSON)"]),
      el("button", { class: "btn danger", type: "button", id: "resetBtn" }, ["Reset local data"])
    ]),
    el("div", { class: "small" }, ["Export is handy for backups while local-first. Import can be added later."])
  ]);

  root.appendChild(card);

  toneSelect.addEventListener("change", async () => {
    const s = getState();
    s.user.tone = toneSelect.value;
    setState(s);
    await Store.saveApp(getState());
    toast("Tone updated.");
  });

  root.querySelector("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quest-rpg-export.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });

  root.querySelector("#resetBtn").addEventListener("click", () => {
    const ok = confirm("Reset local data? This clears quests and progress on this device.");
    if (!ok) return;
    indexedDB.deleteDatabase("quest_rpg_db");
    location.reload();
  });
}
