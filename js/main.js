// Ponto de entrada: liga as abas e inicia a conexão.
import { state } from "./state.js";
import { $, show, setStatus, add } from "./ui.js";
import { connect } from "./mqtt-client.js";
import { initControl } from "./views/control.js";
import { initSettings, fill } from "./views/settings.js";
import { initBrokers } from "./views/brokers.js";

$("seg").addEventListener("ionChange", e => show(e.detail.value));

initControl();
initSettings();
initBrokers();
fill();

if (state.cfg.u && !state.cfg.pw) {
  setStatus("sem senha", "bad");
  add("bot", "Abra Configurações, digite a senha do broker e toque em Salvar e conectar.");
} else {
  connect();
}
