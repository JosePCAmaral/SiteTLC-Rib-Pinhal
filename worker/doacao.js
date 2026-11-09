// POST /api/doacao  (chamado por worker/index.js)
// Recebe os formulários de Doação (pessoa física) e Apoio (empresa),
// guarda no banco D1 (o "extrato") e avisa a equipe por e-mail.

const LIMITES = { nome: 120, email: 160, telefone: 30, mensagem: 1000, razao_social: 160 }
const TIPOS_APOIO = ['dinheiro', 'produtos', 'servicos', 'espaco', 'outro']
const NOMES_APOIO = { dinheiro: 'Dinheiro', produtos: 'Produtos', servicos: 'Serviços', espaco: 'Espaço', outro: 'Outro' }

// Proteções contra abuso
const TAMANHO_MAXIMO = 8 * 1024        // corpo da requisição: 8 KB
const MAX_POR_IP = 5                   // envios por pessoa…
const JANELA_IP_MS = 10 * 60 * 1000    // …a cada 10 minutos
const MAX_GLOBAL_HORA = 120            // envios de todo o site por hora (protege a cota de e-mails)
const MSG_LIMITE = 'Muitos envios em pouco tempo. Aguarde alguns minutos e tente de novo.'

export async function tratarDoacao(request, env, ctx) {
  if (request.method !== 'POST') return resposta(405, { erro: 'Método não permitido.' })

  // 1. Só aceita envios vindos do próprio site
  const origem = request.headers.get('Origin')
  if (!origem || new URL(origem).host !== new URL(request.url).host) {
    return resposta(403, { erro: 'Origem não permitida.' })
  }

  // 2. Só JSON e de tamanho pequeno
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) {
    return resposta(415, { erro: 'Formato inválido.' })
  }
  const bruto = await request.text()
  if (bruto.length > TAMANHO_MAXIMO) return resposta(413, { erro: 'Dados grandes demais.' })

  let dados
  try {
    dados = JSON.parse(bruto)
  } catch {
    return resposta(400, { erro: 'Dados inválidos.' })
  }
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return resposta(400, { erro: 'Dados inválidos.' })

  // 3. Anti-robô: campo invisível preenchido ou envio rápido demais
  if (dados.site_url) return resposta(200, { ok: true, id: 0 })
  const tempo = Date.now() - Number(dados.iniciado_em)
  if (!Number.isFinite(tempo) || tempo < 2500) {
    return resposta(400, { erro: 'Envio rápido demais. Tente novamente.' })
  }

  const v = validar(dados)
  if (v.erro) return resposta(400, { erro: v.erro })
  const r = v.registro

  if (!env.DB) return resposta(500, { erro: 'Banco de dados não configurado.' })

  // 4. Limite de envios (por IP "embaralhado" e global)
  const ipHash = await hashIp(request.headers.get('CF-Connecting-IP') || 'desconhecido', env.HASH_SALT)
  try {
    const agora = Date.now()
    await env.DB.prepare('DELETE FROM envios WHERE criado_em < ?').bind(agora - 24 * 3600 * 1000).run()
    const [porIp, global] = await env.DB.batch([
      env.DB.prepare('SELECT COUNT(*) AS n FROM envios WHERE ip_hash = ? AND criado_em > ?').bind(ipHash, agora - JANELA_IP_MS),
      env.DB.prepare('SELECT COUNT(*) AS n FROM envios WHERE criado_em > ?').bind(agora - 3600 * 1000),
    ])
    if (porIp.results[0].n >= MAX_POR_IP || global.results[0].n >= MAX_GLOBAL_HORA) {
      return resposta(429, { erro: MSG_LIMITE })
    }
  } catch (e) {
    console.error('Erro no controle de envios', e)
    return resposta(500, { erro: 'Não foi possível registrar agora. Tente novamente em instantes.' })
  }

  let id
  try {
    const res = await env.DB.prepare(
      `INSERT INTO registros (tipo, nome, email, telefone, valor_centavos, mensagem, anonimo, razao_social, cnpj, tipos_apoio, autoriza_logo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
      .bind(r.tipo, r.nome, r.email, r.telefone, r.valor_centavos, r.mensagem, r.anonimo, r.razao_social, r.cnpj, r.tipos_apoio, r.autoriza_logo)
      .first()
    id = res.id
    await env.DB.prepare('INSERT INTO envios (ip_hash, criado_em) VALUES (?, ?)').bind(ipHash, Date.now()).run()
  } catch (e) {
    console.error('Erro ao salvar registro', e)
    return resposta(500, { erro: 'Não foi possível registrar agora. Tente novamente em instantes.' })
  }

  // O e-mail sai em segundo plano: se falhar, o registro já está salvo.
  ctx.waitUntil(enviarEmail(env, { ...r, id }).catch((e) => console.error('Erro ao enviar e-mail', e)))

  return resposta(200, { ok: true, id })
}

// ------------------------------------------------------------------ validação

function texto(valor, limite) {
  if (valor === undefined || valor === null) return null
  const t = String(valor).trim().replace(/\s+/g, ' ')
  return t ? t.slice(0, limite) : null
}

function valorCentavos(valor) {
  if (valor === undefined || valor === null || valor === '') return null
  const n = Math.round(Number(String(valor).replace(',', '.')) * 100)
  return Number.isFinite(n) ? n : NaN
}

function emailValido(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}

function cnpjValido(cnpj) {
  const n = String(cnpj).replace(/\D/g, '')
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const digito = (base) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const soma = base.split('').reduce((s, d, i) => s + Number(d) * pesos[i], 0)
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }
  const d1 = digito(n.slice(0, 12))
  const d2 = digito(n.slice(0, 12) + d1)
  return n.endsWith(`${d1}${d2}`)
}

function validar(d) {
  if (!d.consentimento) return { erro: 'É preciso autorizar o uso dos dados para continuar.' }

  const email = texto(d.email, LIMITES.email)
  const telefone = texto(d.telefone, LIMITES.telefone)
  if (email && !emailValido(email)) return { erro: 'E-mail inválido.' }

  if (d.tipo === 'doacao') {
    const anonimo = d.anonimo ? 1 : 0
    const nome = anonimo ? null : texto(d.nome, LIMITES.nome)
    if (!anonimo && !nome) return { erro: 'Informe seu nome ou marque "doação anônima".' }
    const valor = valorCentavos(d.valor)
    if (!valor || Number.isNaN(valor) || valor < 100 || valor > 10000000) {
      return { erro: 'Informe um valor entre R$ 1,00 e R$ 100.000,00.' }
    }
    return {
      registro: {
        tipo: 'doacao', nome, email, telefone, valor_centavos: valor,
        mensagem: texto(d.mensagem, LIMITES.mensagem), anonimo,
        razao_social: null, cnpj: null, tipos_apoio: null, autoriza_logo: 0,
      },
    }
  }

  if (d.tipo === 'apoio') {
    const razao_social = texto(d.razao_social, LIMITES.razao_social)
    const nome = texto(d.nome, LIMITES.nome)
    const cnpj = String(d.cnpj || '').replace(/\D/g, '')
    if (!razao_social) return { erro: 'Informe o nome da empresa.' }
    if (!cnpjValido(cnpj)) return { erro: 'CNPJ inválido. Confira os números.' }
    if (!nome) return { erro: 'Informe o nome do responsável.' }
    if (!email && !telefone) return { erro: 'Informe um e-mail ou telefone para contato.' }
    const tipos = Array.isArray(d.tipos_apoio) ? d.tipos_apoio.filter((t) => TIPOS_APOIO.includes(t)) : []
    if (tipos.length === 0) return { erro: 'Escolha pelo menos um tipo de apoio.' }
    const valor = valorCentavos(d.valor)
    if (Number.isNaN(valor) || (valor !== null && (valor < 0 || valor > 100000000))) return { erro: 'Valor estimado inválido.' }
    return {
      registro: {
        tipo: 'apoio', nome, email, telefone, valor_centavos: valor,
        mensagem: texto(d.mensagem, LIMITES.mensagem), anonimo: 0,
        razao_social, cnpj, tipos_apoio: tipos.map((t) => NOMES_APOIO[t]).join(', '),
        autoriza_logo: d.autoriza_logo ? 1 : 0,
      },
    }
  }

  return { erro: 'Tipo de formulário inválido.' }
}

// ------------------------------------------------------------------ e-mail

const reais = (c) => (c === null || c === undefined ? '—' : (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
const formatarCnpj = (n) => n.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
const esc = (s) => String(s ?? '—').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function montarEmail(r) {
  const quando = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  let assunto, titulo, linhas

  if (r.tipo === 'doacao') {
    const quem = r.anonimo ? 'Doação anônima' : r.nome
    assunto = `💙 Nova doação #${r.id}: ${quem} — ${reais(r.valor_centavos)}`
    titulo = 'Nova intenção de doação'
    linhas = [
      ['Registro', `#${r.id}`],
      ['Data', quando],
      ['Doador', quem],
      ['Valor', reais(r.valor_centavos)],
      ['E-mail', r.email],
      ['Telefone', r.telefone],
      ['Mensagem / intenção', r.mensagem],
      ['Identificador do Pix', `TLC${r.id}`],
    ]
  } else {
    assunto = `🤝 Novo apoio #${r.id}: ${r.razao_social}`
    titulo = 'Nova proposta de apoio (empresa)'
    linhas = [
      ['Registro', `#${r.id}`],
      ['Data', quando],
      ['Empresa', r.razao_social],
      ['CNPJ', formatarCnpj(r.cnpj)],
      ['Responsável', r.nome],
      ['E-mail', r.email],
      ['Telefone', r.telefone],
      ['Tipo de apoio', r.tipos_apoio],
      ['Valor estimado', reais(r.valor_centavos)],
      ['Detalhes', r.mensagem],
      ['Autoriza logo no site', r.autoriza_logo ? 'Sim' : 'Não'],
    ]
  }

  const aviso = r.tipo === 'doacao'
    ? 'Este é um registro de intenção: confirme no extrato do banco se o Pix entrou. O identificador TLC + número pode aparecer no extrato.'
    : 'Entre em contato com a empresa para combinar o apoio.'

  const html = `<!doctype html><html><body style="margin:0;background:#f7f5f0;font-family:Arial,sans-serif;color:#13203a">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <div style="background:#0047ab;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
    <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.85">TLC Ribeirão do Pinhal</div>
    <div style="font-size:22px;font-weight:bold;margin-top:4px">${esc(titulo)}</div>
  </div>
  <table style="width:100%;background:#fff;border-collapse:collapse;border-radius:0 0 12px 12px">
    ${linhas.map(([k, v]) => `<tr><td style="padding:10px 24px;color:#4b5670;font-size:14px;width:40%;border-bottom:1px solid #eee">${esc(k)}</td><td style="padding:10px 24px;font-size:15px;border-bottom:1px solid #eee"><strong>${esc(v)}</strong></td></tr>`).join('')}
  </table>
  <p style="font-size:13px;color:#4b5670;margin-top:16px">${esc(aviso)}</p>
</div></body></html>`

  const text = `${titulo}\n\n${linhas.map(([k, v]) => `${k}: ${v ?? '—'}`).join('\n')}\n\n${aviso}`
  return { assunto, html, text }
}

async function enviarEmail(env, registro) {
  const { assunto, html, text } = montarEmail(registro)

  if (!env.RESEND_API_KEY) {
    console.log(`[e-mail não enviado: falta RESEND_API_KEY]\nPara: ${env.EMAIL_DESTINO}\nAssunto: ${assunto}\n\n${text}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_REMETENTE,
      to: [env.EMAIL_DESTINO],
      subject: assunto,
      html,
      text,
      ...(registro.email ? { reply_to: registro.email } : {}),
    }),
  })
  if (!res.ok) throw new Error(`Resend respondeu ${res.status}: ${await res.text()}`)
}

// ------------------------------------------------------------------ util

// IP -> hash SHA-256 com "sal" secreto: dá para contar envios sem guardar o IP
async function hashIp(ip, sal) {
  if (!sal) console.warn('HASH_SALT não configurado: configure em Settings > Variables and Secrets')
  const dados = new TextEncoder().encode(`${sal || 'tlc-sem-sal'}:${ip}`)
  const hash = await crypto.subtle.digest('SHA-256', dados)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function resposta(status, corpo) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
