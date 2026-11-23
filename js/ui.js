// Funções de interface usadas por todas as telas.
export const $ = id => document.getElementById(id);

export function show(v) {
  ["v1", "v2", "v3"].forEach(i => $(i).hidden = i !== v);
  $("seg").value = v;
}

export function setStatus(text, kind) {
  const s = $("st");
  s.textContent = text;
  s.style.color = kind === "ok" ? "var(--ion-color-success)"
    : kind === "bad" ? "var(--ion-color-danger)" : "var(--ion-color-warning)";
}

export function add(side, text, tag) {
  const r = document.createElement("div"); r.className = "row " + side;
  const m = document.createElement("div"); m.className = "m"; m.textContent = text; r.appendChild(m);
  if (tag) { const t = document.createElement("small"); t.className = "t"; t.textContent = tag; r.appendChild(t) }
  $("log").appendChild(r);
  while ($("log").children.length > 8) $("log").firstChild.remove();
}
