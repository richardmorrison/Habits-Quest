import { deepCloneSafe } from "./utils/dom.js"

const DB_NAME = "quest_rpg_db"
const DB_VERSION = 1

const STORE_APP = "app"
const STORE_COMPLETIONS = "completions"

let dbPromise = null

function openDbCached(){
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = () => {
      const db = req.result

      if (!db.objectStoreNames.contains(STORE_APP)) {
        db.createObjectStore(STORE_APP, { keyPath: "key" })
      }

      if (!db.objectStoreNames.contains(STORE_COMPLETIONS)) {
        const s = db.createObjectStore(STORE_COMPLETIONS, { keyPath: "id" })
        s.createIndex("by_date", "dateISO", { unique: false })
        s.createIndex("by_quest", "questId", { unique: false })
      }
    }

    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

  return dbPromise
}

async function tx(storeName, mode, fn){
  const db = await openDbCached()

  return new Promise((resolve, reject) => {
    const t = db.transaction(storeName, mode)
    const store = t.objectStore(storeName)

    const result = fn(store, t)

    t.oncomplete = () => resolve(result)
    t.onerror = () => reject(t.error)
    t.onabort = () => reject(t.error)
  })
}

export const Store = {
  async loadApp(){
    const db = await openDbCached()

    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE_APP, "readonly")
      const store = t.objectStore(STORE_APP)
      const req = store.get("app")

      req.onsuccess = () => resolve(req.result ? deepCloneSafe(req.result.value) : null)
      req.onerror = () => reject(req.error)
    })
  },

  async saveApp(appState){
    const value = deepCloneSafe(appState)
    await tx(STORE_APP, "readwrite", (store) => store.put({ key: "app", value }))
  },

  async addCompletion({ id, questId, dateISO, effortValue = null }){
    const completion = { id, questId, dateISO, effortValue, createdAt: Date.now() }
    await tx(STORE_COMPLETIONS, "readwrite", (store) => store.put(completion))
    return completion
  },

  async listCompletionsByDate(dateISO){
    const db = await openDbCached()

    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE_COMPLETIONS, "readonly")
      const store = t.objectStore(STORE_COMPLETIONS)
      const idx = store.index("by_date")
      const req = idx.getAll(IDBKeyRange.only(dateISO))

      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    })
  }
}