# Prioridades Estratégicas — V8.4

Desenvolvido por Kevin Fernandes · © 2026 · Versão 8.4

## Principais atualizações

- Total de membros no topo, seguido por Frequentes, Não frequentes, A transferir e A resgatar.
- Layout móvel dos indicadores reorganizado em duas colunas, com Total ocupando a largura inteira.
- Marca lateral alterada para:
  - Prioridades
  - Estratégicas | DSA
- Clique na logomarca geométrica recolhe ou expande o menu lateral.
- Ícones do Semáforo e dos Alertas com 75% de opacidade e 100% ao passar o mouse.
- Botão **Atualizar Sistema** sincroniza títulos, direcionamentos, perguntas e metas a partir da planilha.
- Alterações feitas diretamente na aba `Requisitos` passam a aparecer na Web após Atualizar Sistema.
- Meta automática do requisito `ID-01 — Patriarcas e Profetas`: 60% dos membros frequentes da igreja.
- Novo módulo **Requisitos** para edição e configuração.
- Novo módulo **Minha Igreja** para quantidade de anciãos, famílias, pastor, telefone, endereço, e-mail e observações.

## Apps Script

Use:

```text
google-apps-script/Code_V8_4_COMPLETO.gs
google-apps-script/V8_4_Extensoes.gs
```

### Atualização

1. Substitua o conteúdo de `Code.gs` por `Code_V8_4_COMPLETO.gs`.
2. Crie um arquivo Script chamado `V8_4_Extensoes`.
3. Cole o conteúdo de `V8_4_Extensoes.gs`.
4. Salve.
5. Execute `configurarV84()` uma única vez.
6. Atualize a implantação:
   `Implantar > Gerenciar implantações > Editar > Nova versão > Implantar`.

## GitHub

Substitua na raiz:

- index.html
- styles.css
- app.js
- config.js
- manifest.webmanifest
- service-worker.js
- assets/

Depois publique e use `Ctrl + Shift + R`.

## Observação sobre o total de membros

O total exibido é calculado como:

```text
Frequentes + Não frequentes + A transferir + A resgatar
```
