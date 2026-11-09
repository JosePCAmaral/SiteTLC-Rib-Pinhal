import conteudo from '../conteudo.js'
import { arquivo } from '../utils.js'
import { IconeInstagram, IconeSite } from './Icones.jsx'
import { BarraAzulejo } from './Azulejo.jsx'

export function CabecalhoPagina({ titulo, subtitulo }) {
  return (
    <>
      <section className="cabecalho-pagina">
        <div className="container">
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
      </section>
      <BarraAzulejo tamanho={28} />
    </>
  )
}

// "sobre" é aceito por compatibilidade, mas não é mais exibido:
// o título da seção já diz do que ela trata.
// eslint-disable-next-line no-unused-vars
export function Titulo({ sobre, children }) {
  return (
    <div className="titulo-secao">
      <h2>{children}</h2>
    </div>
  )
}

export function Depoimentos() {
  return (
    <div className="depoimentos">
      {conteudo.depoimentos.map((d, i) => (
        <blockquote key={i} className="depoimento">
          <p>“{d.texto}”</p>
          <cite>{d.nome}</cite>
        </blockquote>
      ))}
    </div>
  )
}

export function Apoiadores() {
  return (
    <ul className="apoiadores">
      {conteudo.apoiadores.map((a, i) => (
        <li key={i} className="apoiador">
          {a.logo && <img src={arquivo(a.logo)} alt="" loading="lazy" />}
          <span className="apoiador-nome">{a.nome}</span>
          {(a.instagram || a.site) && (
            <div className="apoiador-redes">
              {a.instagram && (
                <a href={`https://instagram.com/${a.instagram.replace(/^@/, '')}`} target="_blank" rel="noreferrer" aria-label={`Instagram de ${a.nome}`} title="Instagram">
                  <IconeInstagram />
                </a>
              )}
              {a.site && (
                <a href={a.site} target="_blank" rel="noreferrer" aria-label={`Site de ${a.nome}`} title="Site">
                  <IconeSite />
                </a>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
