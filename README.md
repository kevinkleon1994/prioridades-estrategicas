# Prioridades Estratégicas | DSA

**Versão oficial:** 1.0.0  
**Identificação do projeto:** prioridades-v1  
**Desenvolvido por:** Kevin Fernandes  
**Ano:** 2026

Sistema de planejamento estratégico para igrejas adventistas, com acompanhamento de metas nas áreas de Identidade, Liderança, Novas Gerações e Discipulado.

## Recursos principais

- Dashboard executivo com indicadores e gráficos;
- prioridades estratégicas com critérios editáveis;
- metas e resultados por igreja;
- semáforo, alertas, evolução mensal e ranking;
- checklist estilo Microsoft Planner;
- linha do tempo;
- mural de evidências;
- cadastro da igreja e membros;
- usuários e permissões;
- integração com Google Sheets;
- relatórios em PDF, Excel, e-mail e WhatsApp;
- relatório estratégico com inteligência artificial;
- aplicativo PWA instalável em Desktop, Android e iOS;
- modo apresentação em tela cheia.

## Estrutura principal

```text
index.html
styles.css
app.js
config.js
manifest.webmanifest
service-worker.js
assets/
google-apps-script/
```

## Atualização no GitHub

Substitua os arquivos da raiz e a pasta `assets`, faça o commit e aguarde a publicação do GitHub Pages.

Depois:

```text
Ctrl + Shift + R
```

Caso a versão antiga continue carregando:

```text
F12 → Application → Storage → Clear site data
Application → Service Workers → Unregister
```

## Atualização do Apps Script

Use os arquivos disponíveis em:

```text
google-apps-script/
```

Depois publique uma nova versão da implantação do Web App.

## Versionamento

Esta é a primeira versão oficial do sistema:

```text
1.0.0
```

As antigas numerações V8.x foram tratadas como ciclos internos de desenvolvimento.
