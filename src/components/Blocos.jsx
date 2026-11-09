import conteudo from '../conteudo.js'
import { arquivo } from '../utils.js'

export function CabecalhoPagina({ titulo, subtitulo }) {
  return (
    <section className="cabecalho-pagina">
      <div className="container">
        <h1>{titulo}</h1>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
    </section>
  )
}

export function Titulo({ sobre, children }) {
  return (
    <div className="titulo-secao">
      {sobre && <span className="sobretitulo">{sobre}</span>}
      <h2>{children}</h2>
    </div>
  )
}

export function GradeFotos({ fotos }) {
  return (
    <div className="grade-fotos">
      {fotos.map((f, i) => (
        <figure key={i} className="foto">
          <img src={arquivo(f.arquivo)} alt={f.legenda || `Foto ${i + 1}`} loading="lazy" />
          {f.legenda && <figcaption>{f.legenda}</figcaption>}
        </figure>
      ))}
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
      {conteudo.apoiadores.map((a, i) => {
        const corpo = a.logo ? (
          <img src={arquivo(a.logo)} alt={a.nome} loading="lazy" />
        ) : (
          <span>{a.nome}</span>
        )
        return (
          <li key={i} className="apoiador">
            {a.link ? <a href={a.link} target="_blank" rel="noreferrer">{corpo}</a> : corpo}
          </li>
        )
      })}
    </ul>
  )
}
