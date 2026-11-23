// Aba Controle: pedir temperatura e enviar on/off/texto.
import { state } from "../state.js";
import { $, add } from "../ui.js";

function enviar() {
  const v = ($("msg").value || "").trim();
  if (!v) { $("err").textContent = "Digite on, off ou um texto."; return }
  const c = state.client;
  if (!c || !c.connected) { $("err").textContent = "Sem conexão com o broker."; return }
  $("err").textContent = "";

  const k = v.toUpperCase();
  let topic, payload;
  if (k === "ON" || k === "1") { topic = state.cfg.led; payload = "ON" }
  else if (k === "OFF" || k === "0") { topic = state.cfg.led; payload = "OFF" }
  else { topic = state.cfg.disp; payload = v }

  c.publish(topic, payload, err => {
    add("me", v);
    add("bot", err ? "Falha ao publicar: " + err.message : "Enviado", "publicado em " + topic);
  });
  $("msg").value = "";
}

export function initControl() {
  $("btemp").onclick = () => {
    add("me", "Qual a temperatura?");
    add("bot",
      state.lastTemp == null
        ? "Ainda não chegou nenhuma leitura em " + state.cfg.temp + "."
        : "Sala: " + state.lastTemp.toFixed(1) + " °C",
      "recebido em " + state.cfg.temp);
  };
  $("bsend").onclick = enviar;
  $("msg").addEventListener("keydown", e => { if (e.key === "Enter") enviar() });
  $("msg").addEventListener("ionInput", () => { $("err").textContent = "" });
}
