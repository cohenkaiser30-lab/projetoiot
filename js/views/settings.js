// Aba Configurações: broker ativo e tópicos.
import { DEF } from "../config.js";
import { state } from "../state.js";
import { store } from "../storage.js";
import { $, show } from "../ui.js";
import { connect } from "../mqtt-client.js";

const FIELDS = ["h", "p", "pa", "u", "temp", "led", "disp"];

export function fill() {
  const c = state.cfg;
  FIELDS.forEach(k => $("f-" + k).value = c[k] || "");
  $("f-tls").checked = !!c.tls;
  $("f-w").value = c.pw || "";
}

export function initSettings() {
  $("fsave").onclick = () => {
    const n = {};
    FIELDS.forEach(k => n[k] = ($("f-" + k).value || "").trim());
    n.h = n.h.replace(/^[a-z]+:\/\//i, "").replace(/\/.*$/, "");
    n.tls = $("f-tls").checked;
    n.pw = $("f-w").value || "";

    if (!n.h || !/^\d+$/.test(n.p) || !n.temp || !n.led || !n.disp) {
      $("ferr").textContent = "Preencha host, porta numérica e os três tópicos."; return;
    }
    if (n.u && !n.pw) { $("ferr").textContent = "Este broker usa usuário: informe a senha."; return }

    $("ferr").textContent = "";
    state.cfg = { ...state.cfg, ...n };
    store("sweetech-cfg", { ...state.cfg, pw: "" });
    connect();
    show("v1");
  };

  $("freset").onclick = () => {
    state.cfg = { ...DEF };
    store("sweetech-cfg", { ...DEF });
    fill();
    $("ferr").textContent = "Valores padrão restaurados. Digite a senha e salve.";
  };
}
