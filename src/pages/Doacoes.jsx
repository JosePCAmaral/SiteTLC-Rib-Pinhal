import { useState } from 'react'
import conteudo from '../conteudo.js'
import { Apoiadores, CabecalhoPagina, Titulo } from '../components/Blocos.jsx'
import { IconeInstagram } from '../components/Icones.jsx'
import { linkInstagram } from '../utils.js'

function CartaoPix() {
  const { chave, tipo, favorecido } = conteudo.doacoes.pix
  const [copiado, setCopiado] = useState(false)

  if (!chave) {
    return (
      <div className="pix">
        <span className="sobretitulo">Pix</span>
        <p className="pix-breve">Em breve divulgaremos nossa chave Pix.</p>
        <p>Enquanto isso, fale com a gente pelo Instagram para combinar sua doação.</p>
        <a href={linkInstagram()} target="_blank" rel="noreferrer" className="botao">
          <IconeInstagram /> Falar no Instagram
        </a>
      </div>
    )
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(chave)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      window.prompt('Copie a chave Pix:', chave)
    }
  }

  return (
    <div className="pix">
      <span className="sobretitulo">Pix {tipo && `· ${tipo}`}</span>
      <p className="pix-chave">{chave}</p>
      {favorecido && <p>Favorecido: {favorecido}</p>}
      <button type="button" className="botao" onClick={copiar}>
        {copiado ? 'Chave copiada!' : 'Copiar chave Pix'}
      </button>
    </div>
  )
}

export default function Doacoes() {
  const { texto, outrasFormas } = conteudo.doacoes

  return (
    <>
      <CabecalhoPagina titulo="Doações" subtitulo="Ajude a levar o TLC a mais jovens" />

      <section className="secao">
        <div className="container doacoes-grade">
          <div className="texto">
            <Titulo sobre="Por que doar">Toda ajuda faz diferença</Titulo>
            <p>{texto}</p>
          </div>
          <CartaoPix />
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
