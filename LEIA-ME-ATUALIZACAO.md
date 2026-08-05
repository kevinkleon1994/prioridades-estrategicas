CORREÇÃO PWA WINDOWS — V8.5.3

ARQUIVOS PARA SUBSTITUIR NA RAIZ DO GITHUB:
- index.html
- manifest.webmanifest
- service-worker.js

ARQUIVOS QUE DEVEM EXISTIR NA PASTA assets:
- assets/icone_192.png
- assets/icone_512.png

IMPORTANTE:
O manifesto anterior citava:
- icone_192_maskable.png
- icone_512_maskable.png

Esses arquivos não aparecem na pasta assets do print enviado. Por isso, as referências foram removidas. Um manifesto que aponta para ícones inexistentes pode impedir o navegador de reconhecer corretamente a instalação ou fazer o Windows usar um ícone incorreto.

PASSO A PASSO:
1. Substitua os três arquivos na raiz do repositório.
2. Confirme que icone_192.png tem exatamente 192x192 px.
3. Confirme que icone_512.png tem exatamente 512x512 px.
4. Faça o commit.
5. Aguarde a publicação do GitHub Pages.
6. Desinstale completamente o aplicativo antigo no Windows.
7. No navegador:
   F12 > Application > Storage > Clear site data.
8. Em:
   Application > Service Workers > Unregister.
9. Feche o navegador.
10. Abra novamente o site e instale o aplicativo.

OBSERVAÇÃO SOBRE ENQUADRAMENTO:
Se a logomarca continuar pequena no Menu Iniciar, o problema estará no conteúdo interno dos PNGs. A arte deve ocupar aproximadamente 75% a 85% da tela quadrada, com margens uniformes.
