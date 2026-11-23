// Conexão MQTT (WebSocket). Usa o global "mqtt" carregado no index.html.
import { state } from "./state.js";
import { $, setStatus, add } from "./ui.js";

export const urlOf = b => (b.tls ? "wss" : "ws") + "://" + b.h + ":" + b.p + (b.pa || "/mqtt");

export function disconnect() {
  if (state.client) { state.client.removeAllListeners(); state.client.end(true); state.client = null }
}

export function connect() {
  disconnect();
  const cfg = state.cfg;
  if (!cfg.h || !cfg.p) { setStatus("sem broker", "bad"); return }
  setStatus("conectando…", "warn");

  const opts = {
    clientId: "sweetech-app-" + Math.random().toString(16).slice(2, 8),
    clean: true, reconnectPeriod: 4000, connectTimeout: 8000
  };
  if (cfg.u) { opts.username = cfg.u; opts.password = cfg.pw }

  const c = state.client = window.mqtt.connect(urlOf(cfg), opts);

  c.on("connect", () => {
    setStatus("conectado", "ok");
    c.subscribe(cfg.temp, err => { if (err) add("bot", "Falha ao assinar " + cfg.temp) });
    add("bot", "Conectado a " + cfg.h + ".");
  });
  c.on("reconnect", () => setStatus("reconectando…", "warn"));
  c.on("close", () => { if (state.client === c && !c.connected && !c.reconnecting) setStatus("desconectado", "bad") });
  c.on("error", e => {
    setStatus("erro", "bad");
    add("bot", "Erro: " + e.message);
    // Credencial recusada: para de tentar, senão repete o erro a cada 4 s
    if (/refused|authorized|bad user/i.test(e.message)) c.end(true);
  });
  c.on("message", (t, m) => {
    if (t !== state.cfg.temp) return;
    const txt = m.toString(), n = parseFloat(txt);
    state.lastTemp = isNaN(n) ? null : n;
    $("temp").textContent = isNaN(n) ? txt : n.toFixed(1) + " °C";
    $("tt").textContent = "atualizado às " + new Date().toLocaleTimeString("pt-BR");
  });
}

// Testa um broker sem mexer na conexão ativa.
export function testar(b) {
  return new Promise(res => {
    const o = { clientId: "sweetech-test-" + Math.random().toString(16).slice(2, 8), reconnectPeriod: 0, connectTimeout: 6000 };
    if (b.u) { o.username = b.u; o.password = b.pw }
    const c = window.mqtt.connect(urlOf(b), o);
    const done = r => { c.removeAllListeners(); c.end(true); res(r) };
    c.on("connect", () => done({ ok: true }));
    c.on("error", e => done({ ok: false, msg: e.message }));
    c.on("close", () => done({ ok: false, msg: "Não conectou (tempo esgotado, ou host, porta ou caminho incorretos)." }));
  });
}
