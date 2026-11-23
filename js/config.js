// Valores padrão do app. A SENHA nunca fica no código.
export const DEF = {
  n: "Meu EMQX", h: "z728b702.ala.eu-central-1.emqxsl.com", p: "8084", pa: "/mqtt",
  tls: true, u: "eduardo", pw: "",
  temp: "casa/sala/temperatura", led: "casa/sala/led", disp: "casa/sala/display"
};

// Brokers públicos. Confira host, porta e caminho antes de usar: esses serviços mudam.
export const PUB = [
  { n: "EMQX público",      h: "broker.emqx.io",     p: "8084", pa: "/mqtt", tls: true },
  { n: "HiveMQ público",    h: "broker.hivemq.com",  p: "8884", pa: "/mqtt", tls: true },
  { n: "Mosquitto (teste)", h: "test.mosquitto.org", p: "8081", pa: "/",     tls: true }
];
