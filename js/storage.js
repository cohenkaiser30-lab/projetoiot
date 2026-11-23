// Leitura e escrita no localStorage (sem quebrar se estiver bloqueado).
export const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d } catch (e) { return d } };
export const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} };
