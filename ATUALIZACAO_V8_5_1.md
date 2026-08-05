# CORREÇÃO V8.5.1 — TIMEOUT DO RELATÓRIO COM IA

## Arquivos do GitHub a substituir

Copie para a raiz do repositório:

- app.js
- config.js
- index.html
- service-worker.js

## Arquivo do Apps Script a substituir

Substitua o conteúdo do arquivo:

- V8_5_IA_Relatorios.gs

pelo arquivo localizado em:

- google-apps-script/V8_5_IA_Relatorios.gs

## Depois da substituição no Apps Script

1. Salve o projeto.
2. Não é necessário executar configurarV85 novamente.
3. Vá em:
   Implantar > Gerenciar implantações > Editar > Nova versão > Implantar.

## Depois da substituição no GitHub

1. Faça o commit.
2. Aguarde o GitHub Pages publicar.
3. Pressione Ctrl + Shift + R.
4. Se ainda carregar a versão anterior:
   F12 > Application > Storage > Clear site data.
5. Em Service Workers, clique em Unregister.

## Correções aplicadas

- Tempo de espera exclusivo da IA ampliado de 25 segundos para 3 minutos.
- Mensagens de progresso durante a análise.
- Limite do relatório reduzido de 7000 para 3500 tokens para melhorar a velocidade.
- Cache atualizado para prioridades-v1.
- Versão visível atualizada para 8.5.1.
