c# SweeTech IoT (Ionic + MQTT)

App mobile de controle de um ESP32 por MQTT: mostra a temperatura em tempo
real, liga e desliga o LED e envia qualquer texto digitado para o display.

## Tecnologias
- **Ionic Core 8** (web components, carregado via CDN) + HTML, CSS e JavaScript (módulos ES6)
- **Biblioteca MQTT:** mqtt.js 5.10.1 (MQTT sobre WebSocket, carregada via CDN)
- **Broker:** EMQX Cloud (configurável; também funciona com outros brokers)
- **Equipamento:** ESP32 com sensor de temperatura, LED e display LCD I2C
- **ESP32:** biblioteca PubSubClient (Arduino)

## Tópicos MQTT
| Função | Tópico |
|---|---|
| Temperatura (ESP32 → app) | `casa/sala/temperatura` |
| LED (app → ESP32) | `casa/sala/led` |
| Display (app → ESP32) | `casa/sala/display` |

Os tópicos, o host, a porta, o usuário e a senha podem ser alterados na tela
de **Configurações**, sem mexer no código.

## Como rodar no VS Code
1. Instale a extensão **Live Server**.
2. Clique com o botão direito em `index.html` > **Open with Live Server**.
3. Em **Configurações**, digite a senha do broker e toque em **Salvar e conectar**.

> Precisa abrir por servidor (http://localhost). Abrir o arquivo direto
> (file://) não carrega os módulos JS.

## Segurança
A senha do broker **não está no código**. Ela é digitada na tela de
Configurações e só é guardada no aparelho se o usuário marcar
"Lembrar senha neste aparelho".

## Estrutura
```
index.html          telas (Controle, Configurações, Brokers)
css/styles.css      estilos
js/main.js          ponto de entrada
js/config.js        valores padrão e brokers públicos
js/state.js         estado compartilhado (configuração, brokers salvos, cliente)
js/storage.js       localStorage
js/ui.js            helpers de interface (status, log, trocar de aba)
js/mqtt-client.js   conectar, desconectar, testar broker
js/views/           uma pasta por tela: control, settings, brokers
```

## Próximos passos
- Gerar o APK Android com Capacitor.
- No APK, guardar a senha em armazenamento seguro (plugin do Capacitor)
  em vez do `localStorage`.
- Confirmar as portas WebSocket dos brokers públicos em `js/config.js`.