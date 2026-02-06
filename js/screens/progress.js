import { getState } from "../state.js";
import { el } from "../utils/dom.js";
import { Store } from "../store.js";
import { todayISO } from "../utils/time.js";

export async function renderProgress({ root }){
  const state = getState();
  const today = todayISO();
  const comps = await Store.listCompletionsByDate(today);

  const card = el("div", { class: "card section stack" }, [
    el("div", { class: "row" }, [
      el("div", {}, [
        el("div", { class: "sectionTitle" }, ["Progress history"]),
        el("div", { class: "small" }, ["V0.1 shows today completions. Later it will show bosses, chapters, and reflection beats."])
      ]),
      el("span", { class: "badge" }, [`Today: ${today}`])
    ]),
    el("div", { class: "stack" }, [
      el("div", { class: "muted" }, [`Completions today: ${comps.length}`]),
      el("div", { class: "list" }, comps.length
        ? comps.map((c) => el("div", { class: "item" }, [
            el("div", { class: "item__left" }, [
              el("div", { class: "item__icon" }, [el("span", {}, ["✓"])]),
              el("div", {}, [
                el("div", { class: "item__title" }, [questTitle(state, c.questId)]),
                el("div", { class: "item__meta" }, [c.dateISO])
              ])
            ])
          ]))
        : [el("div", { class: "muted" }, ["No completions logged today yet."])]
      )
    ])
  ]);

  root.appendChild(card);
}

function questTitle(state, id){
  const q = state.quests.find((x) => x.id === id);
  return q ? q.title : id;
}
