import { Link } from 'react-router-dom'
import conteudo from '../conteudo.js'
import { CabecalhoPagina, Titulo } from '../components/Blocos.jsx'
import { IconeLocal, IconeRelogio } from '../components/Icones.jsx'
import { eventoJaPassou, formatarData, formatarHora, linkInstagram, linkMapa, partesData } from '../utils.js'

function CartaoEvento({ ev, futuro }) {
  const { dia, mes } = partesData(ev.data)
  return (
    <article className={`evento ${futuro ? '' : 'evento-passado'}`}>
      <div className="evento-data" aria-hidden="true">
        <span className="evento-dia">{dia}</span>
        <span className="evento-mes">{mes}</span>
      </div>
      <div className="evento-corpo">
        <h3>{ev.nome}</h3>
        <p className="evento-meta">
          <span><IconeRelogio /> {formatarData(ev.data)}, {formatarHora(ev.data)}</span>
          {ev.local && (
            <span>
              <IconeLocal />
              <a href={linkMapa(ev.local, conteudo.cidade)} target="_blank" rel="noreferrer">{ev.local}</a>
            </span>
          )}
        </p>
        {ev.descricao && <p>{ev.descricao}</p>}
        {futuro && ev.pagina && (
          <Link to={ev.pagina} className="botao botao-pequeno">Quero participar</Link>
        )}
        {futuro && !ev.pagina && (
          <a href={ev.linkInscricao || conteudo.linkInscricao} target="_blank" rel="noreferrer" className="botao botao-pequeno">
            Quero participar
          </a>
        )}
      </div>
    </article>
  )
}

export default function Eventos() {
  const ordenados = [...conteudo.eventos].sort((a, b) => new Date(a.data) - new Date(b.data))
  const proximos = ordenados.filter((e) => !eventoJaPassou(e.data))
  const passados = ordenados.filter((e) => eventoJaPassou(e.data)).reverse()

  return (
    <>
      <CabecalhoPagina titulo="Eventos" subtitulo="Fique por dentro da nossa agenda" />
      <section className="secao">
        <div className="container texto-estreito">
          <Titulo sobre="Agenda">Próximos eventos</Titulo>
          {proximos.length > 0 ? (
            <div className="eventos">
              {proximos.map((ev, i) => <CartaoEvento key={i} ev={ev} futuro />)}
            </div>
          ) : (
            <p className="vazio">
              Novas datas em breve! Acompanhe no{' '}
              <a href={linkInstagram()} target="_blank" rel="noreferrer">Instagram</a>.
            </p>
          )}

          {passados.length > 0 && (
            <>
              <Titulo sobre="Memória">Já aconteceu</Titulo>
              <div className="eventos">
                {passados.map((ev, i) => <CartaoEvento key={i} ev={ev} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
