# Prioridades Estratégicas — V8.3

Desenvolvido por Kevin Fernandes · © 2026 · Versão 8.3

## Atualizações

- Cadastro manual de membros frequentes, não frequentes, a transferir e a resgatar.
- Ícones do Semáforo e Alertas com 25% de opacidade e 75% ao passar o mouse.
- Evidências editáveis e mural estilo ladrilhos, preservando proporções retrato e paisagem.
- Aba `Versiculos_Diarios` com data e texto bíblico em itálico.
- Texto bíblico diário na Visão Executiva.
- Fontes ampliadas em Prioridades, Semáforo, Alertas, Meta, Realizado e Ranking.

## Apps Script

1. Substitua o `Code.gs` pelo conteúdo de `google-apps-script/Code_V8_3_COMPLETO.gs`.
2. Crie um arquivo Script chamado `V8_3_Extensoes`.
3. Cole o conteúdo de `google-apps-script/V8_3_Extensoes.gs`.
4. Salve.
5. Execute `configurarV83()` uma única vez.
6. Autorize o acesso ao Google Sheets, Drive e envio de arquivos.
7. Atualize a implantação em `Implantar > Gerenciar implantações > Editar > Nova versão > Implantar`.

A função preserva as quantidades anteriores, convertendo membros ativos em frequentes e a diferença entre total e ativos em não frequentes.

## GitHub Pages

Substitua: `index.html`, `styles.css`, `app.js`, `config.js`, `manifest.webmanifest`, `service-worker.js` e `assets/`.

Depois do commit, pressione `Ctrl + Shift + R`. Se necessário, limpe o Service Worker em `F12 > Application`.
