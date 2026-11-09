# Como editar o site do TLC Ribeirão do Pinhal

Você **não precisa saber programar**. Quase tudo que muda no site fica em um único arquivo:

👉 **`src/conteudo.js`**

## Editando pelo navegador (sem instalar nada)

1. Entre em https://github.com/JosePCAmaral/SiteTLC-Rib-Pinhal
2. Abra a pasta `src` e clique em `conteudo.js`
3. Clique no ícone de **lápis ✏️** (Edit) no canto direito
4. Altere o texto que quiser, sempre **dentro das aspas**
5. Clique em **Commit changes** (botão verde) e confirme
6. Em uns 2 minutos o site atualiza sozinho

## Regras de ouro

- Texto fica sempre entre aspas: `"assim"`.
- Cada item de uma lista termina com **vírgula**.
- Para **esconder** algo, deixe vazio: `""` ou `[]`.
- Se o site parar de atualizar depois de uma edição, quase sempre é uma aspa ou vírgula faltando. Na aba **Actions** do GitHub aparece um ❌ vermelho mostrando o erro.

## Tarefas comuns

### Mudar o próximo evento (contagem regressiva)
Em `proximoEvento`, troque `nome`, `data`, `local` etc.
A data segue o formato `"2026-12-11T19:30:00-03:00"` (ano-mês-dia, depois `T` e a hora). Mantenha o `-03:00` no final.

Lembre também de adicionar o evento à lista `eventos`, que é a agenda da página Eventos.

### Adicionar fotos
1. No GitHub, abra `public/fotos/` → **Add file → Upload files** e envie as fotos.
   Use nomes simples, sem espaço nem acento: `noite-mariana-01.jpg`.
2. Em `conteudo.js`, dentro de `fotos: [ ... ]`, adicione:
   ```js
   { arquivo: "fotos/noite-mariana-01.jpg", legenda: "Noite Mariana 2026" },
   ```
   ⚠️ Só publique fotos de menores com autorização dos responsáveis.

### Adicionar depoimento
Dentro de `depoimentos: [ ... ]`:
```js
{ nome: "Ana, 17 anos", texto: "Foi a noite mais bonita do meu ano!" },
```
A seção aparece sozinha na página inicial quando houver pelo menos um.

### Adicionar instituição de apoio
Envie o logo para `public/apoiadores/` (opcional) e, em `apoiadores`:
```js
{ nome: "Mercado São José", logo: "apoiadores/mercado.png", link: "" },
```

### Colocar a chave Pix
Em `doacoes.pix`, preencha `chave`, `tipo` e `favorecido`. O botão "Copiar chave Pix" aparece automaticamente.

### Perguntas com "Tudo está previsto!"
Em `perguntas`, deixe a `resposta` vazia (`""`) e o site mostra **Tudo está previsto! 😉**

### Trocar as cores
As cores ficam no topo de `src/styles.css` (`--cobalto`, `--offwhite`...).

## Para quem programa

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a pasta dist/
```

Stack: Vite + React + React Router. Cada página fica em `src/pages/`, e as rotas em `src/App.jsx`.
O deploy é automático para o GitHub Pages a cada push na `main` (`.github/workflows/deploy.yml`).
