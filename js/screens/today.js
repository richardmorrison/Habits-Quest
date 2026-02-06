import { getState, setState } from "../state.js";
import { el, toast } from "../utils/dom.js";
import { uid, todayISO } from "../utils/time.js";
import { Store } from "../store.js";
import { computeDamage, applyDamage } from "../game/combat.js";
import { pickLine } from "../game/narrative.js";
import { openAddQuestModal } from "./today_addQuestModal.js";

const CAT_ICON = {
  Fitness: "./assets/icons/cat-fitness.svg",
  Health: "./assets/icons/cat-health.svg",
  Mind: "./assets/icons/cat-mind.svg",
  Project: "./assets/icons/cat-project.svg",
  Life: "./assets/icons/cat-life.svg",
  Custom: "./assets/icons/cat-custom.svg"
};

export function renderToday({ root }){
  const state = getState();

  const enemyPct = Math.round((state.campaign.enemy.hp / state.campaign.enemy.hpMax) * 100);

  const storyCard = el("div", { class: "card section stack" }, [
    el("div", { class: "row" }, [
      el("div", {}, [
        el("div", { class: "sectionTitle" }, [state.campaign.theme]),
        el("div", { class: "muted" }, [state.campaign.narrative.lastText])
      ]),
      el("span", { class: "badge" }, [`Lv ${state.user.level}`])
    ]),
    el("div", { class: "rowWrap" }, [
      el("span", { class: "badge" }, [`Enemy: ${state.campaign.enemy.name}`]),
      el("span", { class: "badge" }, [`HP ${state.campaign.enemy.hp}/${state.campaign.enemy.hpMax}`]),
      el("span", { class: "badge" }, [`Tone: ${state.user.tone}`])
    ]),
    el("div", { class: "progress", "aria-label": "Enemy health" }, [
      el("div", { style: `width:${enemyPct}%` })
    ])
  ]);

  const quests = state.quests.filter((q) => q.status === "active");
  const list = el("div", { class: "card section stack" }, [
    el("div", { class: "row" }, [
      el("div", {}, [
        el("div", { class: "sectionTitle" }, ["Today quests"]),
        el("div", { class: "small" }, ["Tap Do it to apply automatic battle damage and log progress."])
      ]),
      el("button", { class: "btn primary", type: "button", id: "addQuestBtn" }, ["Add quest"])
    ]),
    el("div", { class: "list", id: "questList" }, quests.length ? quests.map((q) => questRow(q, state)) : [
      el("div", { class: "muted" }, ["No quests yet. Add one to begin."])
    ])
  ]);

  root.appendChild(storyCard);
  root.appendChild(list);

  root.querySelector("#addQuestBtn").addEventListener("click", async () => {
    await openAddQuestModal({
      onSave: async (newQuest) => {
        const s = getState();
        s.quests.unshift(newQuest);
        setState(s);
        await Store.saveApp(getState());
        toast("Quest added.");
        root.innerHTML = "";
        renderToday({ root });
      }
    });
  });
}

function questRow(q, state){
  const isDone = state.today.completedQuestIds.includes(q.id);
  const meta = questMeta(q);
  const icon = CAT_ICON[q.category] || CAT_ICON.Custom;

  return el("div", { class: "item" }, [
    el("div", { class: "item__left" }, [
      el("div", { class: "item__icon" }, [el("img", { src: icon, alt: "" })]),
      el("div", {}, [
        el("div", { class: "item__title" }, [q.title]),
        el("div", { class: "item__meta" }, [meta])
      ])
    ]),
    el("div", { class: "item__right" }, [
      el("span", { class: "badge" }, [q.category]),
      el("button", {
        class: `btn slim ${isDone ? "" : "primary"}`,
        type: "button",
        disabled: isDone ? "true" : null,
        onclick: async () => { await completeQuest(q.id); }
      }, [isDone ? "Done" : "Do it"])
    ])
  ]);
}

function questMeta(q){
  if (q.effort?.type === "reps") {
    const base = q.effort.base ?? 10;
    const step = q.effort.step ?? 0;
    const rank = q.effort.rank ?? 1;
    const target = base + step * (rank - 1);
    return `Rank ${rank} • Target ${target} reps`;
  }
  if (q.effort?.type === "sets_reps") {
    const sets = q.effort.sets ?? 3;
    const reps = q.effort.reps ?? 10;
    return `${sets} sets × ${reps} reps`;
  }
  return "Simple complete";
}

async function completeQuest(questId){
  const state = getState();
  const q = state.quests.find((x) => x.id === questId);
  if (!q) return;

  const today = todayISO();
  if (state.today.dateISO !== today) {
    state.today = { dateISO: today, completedQuestIds: [], xpEarned: 0 };
  }
  if (state.today.completedQuestIds.includes(questId)) return;

  state.today.completedQuestIds.push(questId);

  const completionId = uid("c");
  await Store.addCompletion({ id: completionId, questId, dateISO: today });

  const dmg = computeDamage(state, q);
  applyDamage(state, dmg);

  const line = pickLine({ tone: state.user.tone, kind: "hit" });
  state.campaign.narrative.lastText = `${line.text} (-${dmg} HP)`;

  setState(state);
  await Store.saveApp(getState());

  toast(`Quest complete. Damage ${dmg}.`);

  const root = document.getElementById("screenRoot");
  root.innerHTML = "";
  renderToday({ root });
}
