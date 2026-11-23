// Estado compartilhado do app. Os outros módulos sempre leem de state.cfg (nunca guardam cópia).
import { DEF } from "./config.js";
import { load } from "./storage.js";

export const state = {
  cfg: { ...DEF, ...load("sweetech-cfg", {}), pw: "" },
  saved: load("sweetech-brokers", [{ n: DEF.n, h: DEF.h, p: DEF.p, pa: DEF.pa, tls: true, u: DEF.u, pw: "" }]),
  client: null,
  lastTemp: null
};
