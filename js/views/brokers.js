// Aba Brokers: lista de públicos, formulário (público ou privado) e brokers salvos.
import { PUB } from "../config.js";
import { state } from "../state.js";
import { store } from "../storage.js";
import { $, show } from "../ui.js";
import { connect, testar } from "../mqtt-client.js";
import { fill } from "./settings.js";

function use(b) {
  state.cfg = { ...state.cfg, h: b.h, p: b.p, pa: b.pa, tls: b.tls, u: b.u || "", pw: b.pw || "" };
  store("sweetech-cfg", { ...state.cfg, pw: "" });
  fill();
  if (state.cfg.u && !state.cfg.pw) {
    show("v2");
    $("ferr").textContent = "Digite a senha deste broker e toque em Salvar e conectar.";
    return;
  }
  connect();
  show("v1");
}

function row(b, isPub) {
  const r = document.createElement("div"); r.className = "br";
  const i = document.createElement("div"); i.className = "bi";
  const nm = document.createElement("b"); nm.textContent = b.n;
  const ad = document.createElement("small"); ad.className = "t"; ad.style.display = "block";
  ad.textContent = b.h + ":" + b.p + b.pa;
  i.append(nm, ad);

  const bd = document.createElement("span"); bd.className = "bdg"; bd.textContent = b.u ? "privado" : "público";
  const u = document.createElement("ion-button"); u.size = "small"; u.textContent = "Usar"; u.onclick = () => use(b);
  r.append(i, bd, u);

  if (!isPub) {
    const d = document.createElement("ion-button"); d.size = "small"; d.fill = "outline"; d.textContent = "Remover";
    d.onclick = () => { state.saved = state.saved.filter(x => x !== b); store("sweetech-brokers", state.saved); draw() };
    r.appendChild(d);
  }
  return r;
}

function note(t) { const p = document.createElement("small"); p.className = "t"; p.textContent = t; return p }

function draw() {
  const q = ($("bq").value || "").trim().toLowerCase();
  $("bpub").textContent = ""; $("bsav").textContent = "";
  const hits = PUB.filter(b => !q || (b.n + b.h).toLowerCase().includes(q));
  hits.forEach(b => $("bpub").appendChild(row(b, true)));
  if (!hits.length) $("bpub").appendChild(note("Nenhum broker público encontrado. Use o formulário abaixo."));
  state.saved.forEach(b => $("bsav").appendChild(row(b, false)));
  if (!state.saved.length) $("bsav").appendChild(note("Nenhum broker salvo ainda."));
}

function readForm() {
  const h = ($("b-h").value || "").trim().replace(/^[a-z]+:\/\//i, "").replace(/\/.*$/, "");
  return {
    n: ($("b-n").value || "").trim() || h, h,
    p: ($("b-p").value || "").trim(), pa: ($("b-pa").value || "").trim() || "/mqtt",
    tls: $("b-tls").checked, u: ($("b-u").value || "").trim(), pw: $("b-w").value || ""
  };
}

function check(b) {
  if (!b.h || !/^\d+$/.test(b.p)) return "Informe o host e uma porta numérica.";
  if (b.u && !b.pw) return "Este broker usa usuário: informe a senha.";
  return "";
}

export function initBrokers() {
  draw();
  $("bq").addEventListener("ionInput", draw);

  $("btest").onclick = async () => {
    const b = readForm(), m = check(b), o = $("bmsg");
    o.classList.remove("ok");
    if (m) { o.textContent = m; return }
    o.textContent = "Testando…";
    const r = await testar(b);
    o.classList.toggle("ok", r.ok);
    o.textContent = r.ok ? "Broker respondeu" + (b.u ? ": usuário e senha aceitos." : ".") : "Falhou: " + r.msg;
  };

  $("bsave").onclick = () => {
    const b = readForm(), m = check(b), o = $("bmsg");
    o.classList.remove("ok");
    if (m) { o.textContent = m; return }
    const rem = $("b-r").checked;
    // ATENÇÃO: localStorage não é cofre. Na versão APK, trocar por plugin de armazenamento seguro.
    state.saved.push({ n: b.n, h: b.h, p: b.p, pa: b.pa, tls: b.tls, u: b.u, pw: rem ? b.pw : "" });
    store("sweetech-brokers", state.saved);
    draw();
    ["b-n", "b-h", "b-p", "b-u", "b-w"].forEach(i => $(i).value = "");
    $("b-pa").value = "/mqtt";
    o.classList.add("ok");
    o.textContent = rem ? "Broker salvo, com a senha." : "Broker salvo. A senha não fica guardada: será pedida ao usar.";
  };
}
