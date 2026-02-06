import { initState, getState, setState } from "./state.js";
import { Store } from "./store.js";
import { Router } from "./router.js";
import { qs, on, toast } from "./utils/dom.js";
import { renderToday } from "./screens/today.js";
import { renderProgress } from "./screens/progress.js";
import { renderSettings } from "./screens/settings.js";
import { ensureTodaySeedData } from "./game/campaign.js";

const screenRoot = qs("#screenRoot");
const tabs = qs("#tabs");
const pillStatus = qs("#pillStatus");

const routes = { today: renderToday, progress: renderProgress, settings: renderSettings };

async function main(){
  initState();

  const persisted = await Store.loadApp();
  if (persisted) setState(persisted);
  else await Store.saveApp(getState());

  function applyThemeFromState(){
    const appRoot = document.getElementById("appRoot")
    if (!appRoot) return
    const s = getState()
    appRoot.dataset.theme = s.user?.themeId || "fantasy"
  }

  applyThemeFromState()

  const updated = ensureTodaySeedData(getState());
  if (updated._touched) {
    delete updated._touched;
    setState(updated);
    await Store.saveApp(getState());
  }

  Router.init({
    defaultRoute: "today",
    onRoute: (routeName) => {
      [...tabs.querySelectorAll(".tab")].forEach((b) => {
        b.classList.toggle("is-active", b.dataset.route === routeName);
      });
      applyThemeFromState()
      screenRoot.innerHTML = "";
      routes[routeName]({ root: screenRoot });
    }
  });

  on(tabs, "click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    Router.go(btn.dataset.route);
  });

  if ("serviceWorker" in navigator) {
    try{
      await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
      pillStatus.textContent = "Offline-ready";
    } catch(err){
      pillStatus.textContent = "Service worker off";
      toast("Offline mode not available yet.");
      console.warn(err);
    }
  }

  const updateOnline = () => {
    pillStatus.textContent = navigator.onLine ? "Online" : "Offline";
  };
  window.addEventListener("online", updateOnline);
  window.addEventListener("offline", updateOnline);
  updateOnline();
}

main();
