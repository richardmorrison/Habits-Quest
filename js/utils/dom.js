export function qs(sel, root = document){
  const node = root.querySelector(sel);
  if (!node) throw new Error(`Missing element: ${sel}`);
  return node;
}

export function on(el, eventName, fn){
  el.addEventListener(eventName, fn);
}

export function el(tag, attrs = {}, children = []){
  const node = document.createElement(tag);

  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === false || v === null || v === undefined) continue;
    else node.setAttribute(k, String(v));
  }

  for (const child of children) {
    if (typeof child === "string") node.appendChild(document.createTextNode(child));
    else if (child) node.appendChild(child);
  }

  return node;
}

export function toast(msg){
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(t._timer);
  t._timer = setTimeout(() => (t.style.display = "none"), 2200);
}

export function deepCloneSafe(obj){
  return JSON.parse(JSON.stringify(obj));
}
