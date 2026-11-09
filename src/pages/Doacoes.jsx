import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'
import conteudo from '../conteudo.js'
import { Apoiadores, CabecalhoPagina, Titulo } from '../components/Blocos.jsx'
import { IconeInstagram } from '../components/Icones.jsx'
import { gerarPix } from '../pix.js'
import { linkInstagram } from '../utils.js'

const reais = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

async function enviar(dados) {
  const res = await fetch('/api/doacao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  })
  const corpo = await res.json().catch(() => ({}))
  if (!res.ok || !corpo.ok) throw new Error(corpo.erro || 'Não foi possível enviar agora. Tente novamente.')
  return corpo
}

function formatarCnpj(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 14)
  return n
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

// ------------------------------------------------------------ Validação no navegador
// (o servidor valida tudo de novo; aqui é só para guiar quem está preenchendo)

const numero = (v) => Number(String(v ?? '').replace(',', '.'))
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim())

function cnpjValido(cnpj) {
  const n = String(cnpj).replace(/\D/g, '')
  if (n.length !== 14 || /^(\d)\1+$/.test(n)) return false
  const digito = (base) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const resto = base.split('').reduce((s, d, i) => s + Number(d) * pesos[i], 0) % 11
    return resto < 2 ? 0 : 11 - resto
  }
  const d1 = digito(n.slice(0, 12))
  return n.endsWith(`${d1}${digito(n.slice(0, 12) + d1)}`)
}

// "a", "a e b", "a, b e c"
const juntar = (itens) => (itens.length <= 1 ? itens.join('') : `${itens.slice(0, -1).join(', ')} e ${itens.at(-1)}`)

// Botão que fica cinza até o formulário estar completo, com aviso do que falta
function BotaoEnviar({ faltando, enviando, texto, textoEnviando }) {
  const incompleto = faltando.length > 0
  return (
    <div className="enviar">
      <button type="submit" className="botao botao-grande" disabled={incompleto || enviando} aria-describedby={incompleto ? 'o-que-falta' : undefined}>
        {enviando ? textoEnviando : texto}
      </button>
      {incompleto && (
        <p className="o-que-falta" id="o-que-falta" aria-live="polite">
          Para continuar, falta: {juntar(faltando)}.
        </p>
      )}
    </div>
  )
}

// Campos comuns aos dois formulários
function useEnvio() {
  const [estado, setEstado] = useState({ enviando: false, erro: '' })
  const iniciadoEm = useRef(0)
  useEffect(() => { iniciadoEm.current = Date.now() }, [])
  return { estado, setEstado, iniciadoEm }
}

function Consentimento({ marcado, aoMudar }) {
  return (
    <label className="campo-check">
      <input type="checkbox" checked={marcado} onChange={(e) => aoMudar(e.target.checked)} required />
      <span>
        Autorizo o TLC Ribeirão do Pinhal a usar estes dados para registrar e entrar em contato sobre esta
        contribuição, conforme a <Link to="/privacidade">Política de Privacidade</Link>.
      </span>
    </label>
  )
}

// Campo invisível: se for preenchido, é um robô
const Armadilha = ({ valor, aoMudar }) => (
  <input type="text" name="site_url" className="armadilha" tabIndex={-1} autoComplete="off" aria-hidden="true" value={valor} onChange={(e) => aoMudar(e.target.value)} />
)

// ------------------------------------------------------------ Pix

function PagamentoPix({ valor, id, aoVoltar }) {
  const { chave, favorecido, cidade } = conteudo.doacoes.pix
  const codigo = chave ? gerarPix({ chave, nome: favorecido, cidade, valor, txid: `TLC${id}` }) : ''
  const [qr, setQr] = useState('')
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    if (!codigo) return
    QRCode.toDataURL(codigo, { margin: 1, width: 480, color: { dark: '#13203a', light: '#ffffff' } }).then(setQr)
  }, [codigo])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      window.prompt('Copie o código Pix:', codigo)
    }
  }

  if (!chave) {
    return (
      <div className="pix-resultado" role="status">
        <span className="sobretitulo">Registro nº {id}</span>
        <h3>Obrigado! Recebemos sua intenção de doar {reais(valor)} 💙</h3>
        <p>Nossa chave Pix será divulgada em breve. Se você deixou um contato, a tesouraria vai falar com você. Também dá para chamar a gente no Instagram.</p>
        <div className="pix-acoes">
          <a href={linkInstagram()} target="_blank" rel="noreferrer" className="botao"><IconeInstagram /> Falar no Instagram</a>
          <button type="button" className="botao botao-fantasma" onClick={aoVoltar}>Fazer outra doação</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pix-resultado" role="status">
      <span className="sobretitulo">Registro nº {id}</span>
      <h3>Falta só o Pix de {reais(valor)} 💙</h3>
      <p>Abra o app do seu banco, escolha <strong>Pix → Ler QR Code</strong> ou <strong>Pix Copia e Cola</strong>. O valor já vem preenchido.</p>
      <div className="pix-qr">
        {qr ? <img src={qr} alt={`QR Code Pix de ${reais(valor)}`} /> : <div className="pix-qr-carregando" />}
      </div>
      <div className="pix-codigo">
        <code>{codigo}</code>
        <button type="button" className="botao" onClick={copiar}>{copiado ? 'Código copiado!' : 'Copiar código Pix'}</button>
      </div>
      <button type="button" className="botao botao-fantasma" onClick={aoVoltar}>Fazer outra doação</button>
    </div>
  )
}

function AvisoFavorecido() {
  const { favorecido, cargo } = conteudo.doacoes.pix
  if (!favorecido) return null
  return (
    <p className="aviso-favorecido">
      <strong>Quem recebe:</strong> as doações via Pix são recebidas na conta de <strong>{favorecido}</strong>, {cargo}.
      Por isso é esse nome que aparece na confirmação do pagamento.
    </p>
  )
}

// ------------------------------------------------------------ Doação (pessoa física)

function FormDoacao() {
  const sugeridos = conteudo.doacoes.valoresSugeridos || []
  const [f, setF] = useState({ valor: sugeridos[1] ?? '', nome: '', anonimo: false, email: '', telefone: '', mensagem: '', consentimento: false, site_url: '' })
  const [pronto, setPronto] = useState(null)
  const { estado, setEstado, iniciadoEm } = useEnvio()
  const mudar = (campo) => (e) => setF((v) => ({ ...v, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const faltando = []
  if (!(numero(f.valor) >= 1)) faltando.push('o valor (mínimo R$ 1,00)')
  if (!f.anonimo && !f.nome.trim()) faltando.push('seu nome (ou marque doação anônima)')
  if (f.email.trim() && !emailOk(f.email)) faltando.push('um e-mail válido')
  if (!f.consentimento) faltando.push('marcar a autorização')

  async function aoEnviar(e) {
    e.preventDefault()
    if (faltando.length) return
    setEstado({ enviando: true, erro: '' })
    try {
      const { id } = await enviar({ ...f, tipo: 'doacao', iniciado_em: iniciadoEm.current })
      setPronto({ id, valor: Number(String(f.valor).replace(',', '.')) })
      setEstado({ enviando: false, erro: '' })
    } catch (err) {
      setEstado({ enviando: false, erro: err.message })
    }
  }

  if (pronto) {
    return <PagamentoPix {...pronto} aoVoltar={() => { setPronto(null); setF((v) => ({ ...v, mensagem: '' })) }} />
  }

  return (
    <form className="formulario" onSubmit={aoEnviar} noValidate={false}>
      <fieldset className="campo">
        <legend>Quanto você quer doar?</legend>
        <div className="valores">
          {sugeridos.map((v) => (
            <button key={v} type="button" className={`valor ${Number(f.valor) === v ? 'ativo' : ''}`} onClick={() => setF((s) => ({ ...s, valor: v }))} aria-pressed={Number(f.valor) === v}>
              {reais(v)}
            </button>
          ))}
        </div>
        <label className="campo-valor">
          <span>Outro valor (R$)</span>
          <input type="number" inputMode="decimal" min="1" step="0.01" required value={f.valor} onChange={mudar('valor')} placeholder="0,00" />
        </label>
      </fieldset>

      <label className="campo">
        <span>Seu nome</span>
        <input type="text" value={f.nome} onChange={mudar('nome')} disabled={f.anonimo} required={!f.anonimo} maxLength={120} autoComplete="name" />
      </label>
      <label className="campo-check">
        <input type="checkbox" checked={f.anonimo} onChange={mudar('anonimo')} />
        <span>Quero fazer uma doação anônima</span>
      </label>

      <div className="campos-dupla">
        <label className="campo">
          <span>E-mail <em>(opcional)</em></span>
          <input type="email" value={f.email} onChange={mudar('email')} maxLength={160} autoComplete="email" />
        </label>
        <label className="campo">
          <span>WhatsApp <em>(opcional)</em></span>
          <input type="tel" value={f.telefone} onChange={mudar('telefone')} maxLength={30} autoComplete="tel" />
        </label>
      </div>

      <label className="campo">
        <span>Mensagem ou intenção de oração <em>(opcional)</em></span>
        <textarea rows={3} value={f.mensagem} onChange={mudar('mensagem')} maxLength={1000} />
      </label>

      <Consentimento marcado={f.consentimento} aoMudar={(v) => setF((s) => ({ ...s, consentimento: v }))} />
      <Armadilha valor={f.site_url} aoMudar={(v) => setF((s) => ({ ...s, site_url: v }))} />

      {estado.erro && <p className="erro" role="alert">{estado.erro}</p>}
      <BotaoEnviar faltando={faltando} enviando={estado.enviando} texto="Continuar para o Pix" textoEnviando="Registrando…" />
    </form>
  )
}

// ------------------------------------------------------------ Apoio (empresa)

const TIPOS = [
  ['dinheiro', 'Dinheiro'],
  ['produtos', 'Produtos (lanches, materiais)'],
  ['servicos', 'Serviços (gráfica, som…)'],
  ['espaco', 'Espaço / local'],
  ['outro', 'Outro'],
]

function FormApoio() {
  const [f, setF] = useState({ razao_social: '', cnpj: '', nome: '', email: '', telefone: '', tipos_apoio: [], valor: '', mensagem: '', autoriza_logo: false, consentimento: false, site_url: '' })
  const [pronto, setPronto] = useState(null)
  const { estado, setEstado, iniciadoEm } = useEnvio()
  const mudar = (campo) => (e) => setF((v) => ({ ...v, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const alternarTipo = (t) => setF((v) => ({ ...v, tipos_apoio: v.tipos_apoio.includes(t) ? v.tipos_apoio.filter((x) => x !== t) : [...v.tipos_apoio, t] }))

  const faltando = []
  if (!f.razao_social.trim()) faltando.push('o nome da empresa')
  if (!cnpjValido(f.cnpj)) faltando.push(f.cnpj.replace(/\D/g, '').length === 14 ? 'um CNPJ válido (confira os números)' : 'o CNPJ')
  if (!f.nome.trim()) faltando.push('o nome do responsável')
  if (!f.email.trim() && !f.telefone.trim()) faltando.push('um e-mail ou telefone')
  else if (f.email.trim() && !emailOk(f.email)) faltando.push('um e-mail válido')
  if (f.tipos_apoio.length === 0) faltando.push('o tipo de apoio')
  if (!f.consentimento) faltando.push('marcar a autorização')

  async function aoEnviar(e) {
    e.preventDefault()
    if (faltando.length) return
    setEstado({ enviando: true, erro: '' })
    try {
      const { id } = await enviar({ ...f, tipo: 'apoio', iniciado_em: iniciadoEm.current })
      setPronto({ id, empresa: f.razao_social })
      setEstado({ enviando: false, erro: '' })
    } catch (err) {
      setEstado({ enviando: false, erro: err.message })
    }
  }

  if (pronto) {
    return (
      <div className="pix-resultado" role="status">
        <span className="sobretitulo">Registro nº {pronto.id}</span>
        <h3>Muito obrigado, {pronto.empresa}! 🤝</h3>
        <p>Recebemos sua proposta de apoio. Nossa equipe vai entrar em contato em breve para combinar os detalhes.</p>
      </div>
    )
  }

  return (
    <form className="formulario" onSubmit={aoEnviar}>
      <div className="campos-dupla">
        <label className="campo">
          <span>Nome da empresa</span>
          <input type="text" value={f.razao_social} onChange={mudar('razao_social')} required maxLength={160} autoComplete="organization" />
        </label>
        <label className="campo">
          <span>CNPJ</span>
          <input type="text" inputMode="numeric" value={f.cnpj} onChange={(e) => setF((v) => ({ ...v, cnpj: formatarCnpj(e.target.value) }))} required placeholder="00.000.000/0000-00" pattern="\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}" title="Digite os 14 números do CNPJ" />
        </label>
      </div>

      <label className="campo">
        <span>Nome do responsável</span>
        <input type="text" value={f.nome} onChange={mudar('nome')} required maxLength={120} autoComplete="name" />
      </label>

      <div className="campos-dupla">
        <label className="campo">
          <span>E-mail</span>
          <input type="email" value={f.email} onChange={mudar('email')} required={!f.telefone} maxLength={160} autoComplete="email" />
        </label>
        <label className="campo">
          <span>Telefone / WhatsApp</span>
          <input type="tel" value={f.telefone} onChange={mudar('telefone')} required={!f.email} maxLength={30} autoComplete="tel" />
        </label>
      </div>

      <fieldset className="campo">
        <legend>Como sua empresa quer apoiar?</legend>
        <div className="opcoes">
          {TIPOS.map(([t, rotulo]) => (
            <label key={t} className={`opcao ${f.tipos_apoio.includes(t) ? 'ativo' : ''}`}>
              <input type="checkbox" checked={f.tipos_apoio.includes(t)} onChange={() => alternarTipo(t)} />
              {rotulo}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="campo">
        <span>Valor estimado (R$) <em>(opcional)</em></span>
        <input type="number" inputMode="decimal" min="0" step="0.01" value={f.valor} onChange={mudar('valor')} placeholder="0,00" />
      </label>

      <label className="campo">
        <span>Conte um pouco sobre o apoio <em>(opcional)</em></span>
        <textarea rows={3} value={f.mensagem} onChange={mudar('mensagem')} maxLength={1000} />
      </label>

      <label className="campo-check">
        <input type="checkbox" checked={f.autoriza_logo} onChange={mudar('autoriza_logo')} />
        <span>Autorizo exibir o logo da empresa em “Instituições de apoio” no site</span>
      </label>
      <Consentimento marcado={f.consentimento} aoMudar={(v) => setF((s) => ({ ...s, consentimento: v }))} />
      <Armadilha valor={f.site_url} aoMudar={(v) => setF((s) => ({ ...s, site_url: v }))} />

      {estado.erro && <p className="erro" role="alert">{estado.erro}</p>}
      <BotaoEnviar faltando={faltando} enviando={estado.enviando} texto="Enviar proposta de apoio" textoEnviando="Enviando…" />
    </form>
  )
}

// ------------------------------------------------------------ Página

export default function Doacoes() {
  const { texto, outrasFormas } = conteudo.doacoes
  const [aba, setAba] = useState('doacao')

  return (
    <>
      <CabecalhoPagina titulo="Doações" subtitulo="Ajude a levar o TLC a mais jovens" />

      <section className="secao">
        <div className="container doacoes-grade">
          <div className="texto">
            <Titulo sobre="Por que doar">Toda ajuda faz diferença</Titulo>
            <p>{texto}</p>
            <p>
              <strong>Pessoa física?</strong> Escolha o valor, registre sua doação e pague pelo Pix com o valor já preenchido.
            </p>
            <p>
              <strong>Empresa?</strong> Conte como quer apoiar — com dinheiro, produtos, serviços ou espaço — e nossa equipe entra em contato.
            </p>
            <AvisoFavorecido />
          </div>

          <div className="cartao-formulario">
            <div className="abas" role="tablist" aria-label="Tipo de contribuição">
              <button type="button" role="tab" id="aba-doacao" aria-controls="painel-doacao" aria-selected={aba === 'doacao'} className={`aba ${aba === 'doacao' ? 'ativa' : ''}`} onClick={() => setAba('doacao')}>
                Quero doar
              </button>
              <button type="button" role="tab" id="aba-apoio" aria-controls="painel-apoio" aria-selected={aba === 'apoio'} className={`aba ${aba === 'apoio' ? 'ativa' : ''}`} onClick={() => setAba('apoio')}>
                Sou empresa
              </button>
            </div>
            <div role="tabpanel" id="painel-doacao" aria-labelledby="aba-doacao" hidden={aba !== 'doacao'}>
              <FormDoacao />
            </div>
            <div role="tabpanel" id="painel-apoio" aria-labelledby="aba-apoio" hidden={aba !== 'apoio'}>
              <FormApoio />
            </div>
          </div>
        </div>
      </section>

      {outrasFormas.length > 0 && (
        <section className="secao secao-clara">
          <div className="container">
            <Titulo sobre="Além do Pix">Outras formas de ajudar</Titulo>
            <div className="cartoes">
              {outrasFormas.map((f) => (
                <article key={f.titulo} className="cartao">
                  <h3>{f.titulo}</h3>
                  <p>{f.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {conteudo.apoiadores.length > 0 && (
        <section className="secao">
          <div className="container">
            <Titulo sobre="Obrigado!">Instituições de apoio</Titulo>
            <Apoiadores />
          </div>
        </section>
      )}
    </>
  )
}
