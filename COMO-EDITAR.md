# Como editar o site do TLC Ribeirão do Pinhal

Você **não precisa saber programar**. Quase tudo que muda no site fica em um único arquivo:

👉 **`src/conteudo.js`**

## Editando pelo navegador (sem instalar nada)

1. Entre em https://github.com/JosePCAmaral/SiteTLC-Rib-Pinhal
2. Abra a pasta `src` e clique em `conteudo.js`
3. Clique no ícone de **lápis ✏️** (Edit) no canto direito
4. Altere o texto que quiser, sempre **dentro das aspas**
5. Clique em **Commit changes** (botão verde) e confirme
6. Em uns 2 minutos o site atualiza sozinho (Cloudflare Workers)

## Regras de ouro

- Texto fica sempre entre aspas: `"assim"`.
- Cada item de uma lista termina com **vírgula**.
- Para **esconder** algo, deixe vazio: `""` ou `[]`.
- Se o site parar de atualizar depois de uma edição, quase sempre é uma aspa ou vírgula faltando. No commit, no GitHub, aparece um ❌ vermelho; clique nele para ver o erro do Cloudflare.

## Tarefas comuns

### Mudar o próximo evento (contagem regressiva)
Em `proximoEvento`, troque `nome`, `data`, `local` etc.
A data segue o formato `"2026-12-11T19:30:00-03:00"` (ano-mês-dia, depois `T` e a hora). Mantenha o `-03:00` no final.

Lembre também de adicionar o evento à lista `eventos`, que é a agenda da página Eventos.

O campo `pagina` (ex.: `"/noite-mariana"`) faz os botões "Quero participar" levarem para a página do evento, que também aparece no menu.
Deixe `pagina: ""` para os botões irem direto ao formulário de inscrição. Depois que o evento passa, o item some do menu sozinho.
A foto emoldurada por azulejos na página do evento é a `fotoDestaque`.
`duracaoHoras` é quanto tempo o evento dura; é usado no botão "Adicionar à agenda".

### Imagem que aparece ao compartilhar o link (WhatsApp, Instagram)
É o arquivo `public/compartilhar.png`. Para mudar os textos dela:
1. Edite `ferramentas/imagem-compartilhamento.html` (os textos estão no meio do arquivo).
2. No terminal, rode `npm run imagem` (precisa do Google Chrome instalado).
3. Em `index.html`, troque o número em `compartilhar.png?v=1` (ex.: `?v=2`). Sem isso o WhatsApp continua mostrando a imagem antiga.

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
Em `doacoes.pix`, preencha `chave` com uma **chave aleatória** (crie no app do banco). **Nunca use CPF**: ele ficaria público no site.
Depois que alguém registra uma doação, o site mostra o QR Code e o "Pix Copia e Cola" com o valor já preenchido.
Se trocar de conta, por exemplo para a conta própria do TLC, atualize `chave`, `favorecido` e `cargo`.

### Valores sugeridos de doação
Em `doacoes.valoresSugeridos`, por exemplo `[20, 50, 100, 200]`.

### Onde ver as doações e os apoios (extrato)
- Cada doação ou apoio gera um **e-mail** para `tlcribeiraodopinhal@gmail.com`.
- Tudo também fica salvo no banco de dados do Cloudflare. Para ver, entre no painel do Cloudflare → **Storage & Databases → D1 → tlc-registros → Console** e rode:
  ```sql
  SELECT * FROM registros ORDER BY id DESC;
  ```
- Consultas úteis no mesmo Console:
  ```sql
  SELECT id, criado_em, nome, valor_centavos / 100.0 AS valor, status FROM registros WHERE tipo = 'doacao' ORDER BY id DESC;
  ```
  ```sql
  SELECT id, criado_em, razao_social, cnpj, tipos_apoio, email, telefone FROM registros WHERE tipo = 'apoio' ORDER BY id DESC;
  ```
  ```sql
  SELECT status, COUNT(*) AS quantidade, SUM(valor_centavos) / 100.0 AS total FROM registros WHERE tipo = 'doacao' GROUP BY status;
  ```
  Os horários (`criado_em`) estão no fuso UTC: diminua 3 horas para o horário de Brasília.
- Testes feitos na **prévia** ficam em outro banco, o `tlc-registros-preview`.
- Para marcar uma doação como conferida no banco:
  ```sql
  UPDATE registros SET status = 'confirmado' WHERE id = 12;
  ```
- ⚠️ O site registra a **intenção** de doar. Confira sempre no extrato do banco se o Pix entrou. O identificador `TLC` + número do registro pode aparecer no extrato.

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

Backend (doações): Cloudflare Worker (`worker/`: `index.js` roteia, `doacao.js` é a API, `seguranca.js` os cabeçalhos) + banco D1 (`migrations/`) + e-mail via Resend.
Para testar formulários localmente: copie `.env.example` para `.env` e preencha, rode `npm run db:local` (uma vez) e depois `npm run dev:completo` (abre em http://localhost:8788).
Segurança e segredos: veja [SEGURANCA.md](SEGURANCA.md).

Stack: Vite + React + React Router. Cada página fica em `src/pages/`, e as rotas em `src/App.jsx`.
O deploy é automático no Cloudflare Workers a cada push na `main` (`npx wrangler deploy`, que roda o `npm run build` sozinho; configuração em `wrangler.toml`).
