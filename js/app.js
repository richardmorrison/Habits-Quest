import { initState, getState, setState } from "./state.js"
import { Store } from "./store.js"
import { Router } from "./router.js"
import { qs, on, toast } from "./utils/dom.js"
import { renderToday } from "./screens/today.js"
import { renderProgress } from "./screens/progress.js"
import { renderSettings } from "./screens/settings.js"
import { ensureTodaySeedData } from "./game/campaign.js"

const screenRoot = qs("#screenRoot")
const tabs = qs("#tabs")
const pillStatus = qs("#pillStatus")
const appRoot = qs("#appRoot")

const routes = { today: renderToday, progress: renderProgress, settings: renderSettings }

function applyThemeFromState(){
  if (!appRoot) return
  const s = getState()
  appRoot.dataset.theme = s.user?.themeId || "fantasy"
}

function ensureVersionBadge(){
  const existing = document.getElementById("appVersionBadge")
  if (existing) return
  const v = getState()?.meta?.appVersion || ""
  if (!v) return
  const elDiv = document.createElement("div")
  elDiv.id = "appVersionBadge"
  elDiv.className = "appVersionBadge"
  elDiv.textContent = `v${v}`
  document.body.appendChild(elDiv)
}

async function main(){
  initState()

  const persisted = await Store.loadApp()
  if (persisted) setState(persisted)
  else await Store.saveApp(getState())

  const updated = ensureTodaySeedData(getState())
  if (updated._touched) {
    delete updated._touched
    setState(updated)
    await Store.saveApp(getState())
  }

  applyThemeFromState()
  ensureVersionBadge()

  Router.init({
    defaultRoute: "today",
    onRoute: (routeName) => {
      applyThemeFromState()
  ensureVersionBadge()

      for (const b of tabs.querySelectorAll(".tab")) {
        b.classList.toggle("is-active", b.dataset.route === routeName)
      }

      screenRoot.innerHTML = ""
      routes[routeName]({ root: screenRoot })
    }
  })

  on(tabs, "click", (e) => {
    const btn = e.target.closest(".tab")
    if (!btn) return
    Router.go(btn.dataset.route)
  })

  if ("serviceWorker" in navigator) {
    try{
      const reg = await navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
      pillStatus.textContent = "Offline-ready"
      const showUpdate = () => {
        pillStatus.textContent = "Update available"
        pillStatus.classList.add("is-update")
        pillStatus.title = "Tap to refresh"
      }
      if (reg.waiting) showUpdate()
      reg.addEventListener("updatefound", () => {
        const sw = reg.installing
        if (!sw) return
        sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            showUpdate()
          }
        })
      })
      pillStatus.addEventListener("click", () => {
        if (!reg.waiting) return
        reg.waiting.postMessage({ type: "SKIP_WAITING" })
      })
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (pillStatus.classList.contains("is-update")) window.location.reload()
      })
    } catch (err) {
      pillStatus.textContent = "Service worker off"
      toast("Offline mode not available yet.")
      console.warn(err)
    }
  }

  const updateOnline = () => {
    pillStatus.textContent = navigator.onLine ? "Online" : "Offline"
  }
  window.addEventListener("online", updateOnline)
  window.addEventListener("offline", updateOnline)
  updateOnline()
}

main()