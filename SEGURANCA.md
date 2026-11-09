# Segurança do site do TLC Ribeirão do Pinhal

O site recebe dados pessoais (doações e apoios). Este guia reúne o que já está protegido
e o que a equipe precisa manter.

## O que o site já faz

| Proteção | Onde |
|---|---|
| Segredos fora do código (`.env` local, painel do Cloudflare em produção) | `.env.example`, `.gitignore` |
| Cabeçalhos de segurança em todas as páginas (CSP, HSTS, anti-clickjacking, nosniff…) | `worker/seguranca.js` |
| API só aceita envios do próprio site (Origin), só JSON, no máximo 8 KB | `worker/doacao.js` |
| Limite de envios: 5 por pessoa a cada 10 min e 120 por hora no site todo | `worker/doacao.js` |
| IP nunca é guardado: só um hash com "sal" secreto, apagado em 24 h | `migrations/0002_controle_envios.sql` |
| Anti-robô: campo invisível e bloqueio de envio rápido demais | formulários + API |
| Validação de todos os campos no servidor (CNPJ, e-mail, valores, tamanhos) | `worker/doacao.js` |
| Banco protegido contra SQL injection (consultas preparadas) | `worker/doacao.js` |
| Textos dos usuários escapados nos e-mails (sem HTML malicioso) | `worker/doacao.js` |
| Não coletamos CPF nem dados bancários; Pix com chave aleatória | `src/conteudo.js` |
| Consentimento obrigatório + Política de Privacidade (LGPD) | `/privacidade` |

## Segredos

| Nome | Para que serve | Onde fica |
|---|---|---|
| `RESEND_API_KEY` | Enviar os e-mails | `.env` (local) e Cloudflare → Worker → Settings → Variables and Secrets (**Secret**) |
| `HASH_SALT` | Embaralhar IPs no limite de envios | idem. Gere com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

Regras:
- **Nunca** coloque segredos no código, no `wrangler.toml`, em print ou no WhatsApp.
- **Nunca** use o prefixo `VITE_` para segredos: o Vite coloca essas variáveis dentro do site, visíveis para todos.
- Vazou uma chave? **Apague no Resend e crie outra** na hora, depois atualize no Cloudflare.

## Contas: o mais importante

Quase todo ataque a sites pequenos acontece por **senha roubada**, não por falha no código.

- [ ] **Verificação em duas etapas (2FA)** em: GitHub, Cloudflare, Resend, Gmail do TLC e Registro.br.
- [ ] Senhas diferentes e fortes em cada serviço (use um gerenciador de senhas).
- [ ] Só quem precisa tem acesso ao Cloudflare e ao Gmail do TLC. Quando alguém sair da equipe, **remova o acesso**.
- [ ] O e-mail de recuperação dessas contas deve ser um e-mail que a coordenação controle.

## Cuidados no dia a dia

- **Fotos:** só publique fotos de menores com autorização dos responsáveis.
- **Dados das doações:** não repasse prints da tabela ou dos e-mails em grupos. Compartilhe só totais.
- **Retenção:** definam por quanto tempo guardar os registros (sugestão: 5 anos, para prestação de contas) e apaguem os mais antigos.
- **Pedido de exclusão (LGPD):** se alguém pedir para apagar os dados, no D1 Console:
  `DELETE FROM registros WHERE id = 123;`
- **Dependências:** de vez em quando rode `npm audit` e atualize os pacotes.
- **Novo serviço externo** (vídeo do YouTube, outro mapa, analytics): libere o domínio na CSP em `worker/seguranca.js`, senão ele não carrega.
- Se ativarem recursos do Cloudflare que injetam scripts (Web Analytics, Rocket Loader, Email Obfuscation), eles também precisam ser liberados na CSP.

## Próximos passos recomendados

1. **Cloudflare Turnstile** (captcha invisível e gratuito) nos formulários, se aparecer spam.
2. **Regra de limite no WAF do Cloudflare** para `/api/*`, como segunda camada contra abuso.
3. **Painel da tesouraria com login** (Cloudflare Access ou login próprio), em vez de usar o console do D1.
