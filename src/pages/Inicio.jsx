import { Link } from 'react-router-dom'
import conteudo from '../conteudo.js'
import Contagem from '../components/Contagem.jsx'
import { Apoiadores, Depoimentos, GradeFotos, Titulo } from '../components/Blocos.jsx'
import { CoroaEstrelas, IconeCalendario, IconeInstagram, IconeLocal, IconePessoas, IconeRelogio, IconeSeta } from '../components/Icones.jsx'
import { eventoJaPassou, formatarData, formatarHora, linkInscricaoEvento, linkInstagram, linkMapa } from '../utils.js'

function Destaque() {
  const ev = conteudo.proximoEvento
  const passou = eventoJaPassou(ev.data)

  if (passou) {
    return (
      <section className="destaque">
        <CoroaEstrelas className="destaque-estrelas" />
        <div className="container destaque-conteudo">
          <span className="sobretitulo claro">{conteudo.nome}</span>
          <h1 className="destaque-titulo">{conteudo.slogan}</h1>
          <div className="destaque-acoes">
            <a href={linkInstagram()} target="_blank" rel="noreferrer" className="botao botao-claro">
              <IconeInstagram /> Acompanhe no Instagram
            </a>
            <Link to="/eventos" className="botao botao-contorno">Ver eventos</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="destaque">
      <CoroaEstrelas className="destaque-estrelas" />
      <div className="container destaque-conteudo">
        <span className="sobretitulo claro">Nosso primeiro encontro</span>
        <h1 className="destaque-titulo">{ev.nome}</h1>
        <p className="destaque-chamada">{ev.chamada}</p>
        <Contagem data={ev.data} />
        <div className="destaque-acoes">
          <a href={linkInscricaoEvento()} target="_blank" rel="noreferrer" className="botao botao-claro botao-grande">
            Quero participar <IconeSeta />
          </a>
        </div>
        <ul className="destaque-info">
          <li><IconeCalendario /> {formatarData(ev.data)}</li>
          <li><IconeRelogio /> {formatarHora(ev.data)}</li>
          <li>
            <IconeLocal />
            <a href={linkMapa(ev.local, ev.cidade)} target="_blank" rel="noreferrer">{ev.local}</a>
          </li>
          <li><IconePessoas /> {ev.publico}</li>
        </ul>
      </div>
    </section>
  )
}

export default function Inicio() {
  const fotos = conteudo.fotos.slice(0, 6)

  return (
    <>
      <Destaque />

      <section className="secao">
        <div className="container quem-somos">
          <Titulo sobre="Quem somos">Jovens, fé e amizade em Ribeirão do Pinhal</Titulo>
          <div className="texto">
            {conteudo.quemSomos.map((p, i) => <p key={i}>{p}</p>)}
            <Link to="/o-que-e-o-tlc" className="link-seta">Conheça o TLC <IconeSeta /></Link>
          </div>
        </div>
      </section>

      {fotos.length > 0 && (
        <section className="secao secao-clara">
          <div className="container">
            <Titulo sobre="Fotos">Nossos momentos</Titulo>
            <GradeFotos fotos={fotos} />
            <Link to="/galeria" className="link-seta">Ver galeria completa <IconeSeta /></Link>
          </div>
        </section>
      )}

      {conteudo.depoimentos.length > 0 && (
        <section className="secao">
          <div className="container">
            <Titulo sobre="Depoimentos">O que dizem por aqui</Titulo>
            <Depoimentos />
          </div>
        </section>
      )}

      {conteudo.apoiadores.length > 0 && (
        <section className="secao secao-clara">
          <div className="container">
            <Titulo sobre="Quem caminha com a gente">Instituições de apoio</Titulo>
            <Apoiadores />
            <Link to="/doacoes" className="link-seta">Quero apoiar também <IconeSeta /></Link>
          </div>
        </section>
      )}

      <section className="faixa">
        <div className="container faixa-conteudo">
          <p className="faixa-frase">{conteudo.fraseDoMovimento}</p>
          <p>Ficou curioso? Siga a gente e acompanhe tudo o que vem por aí.</p>
          <a href={linkInstagram()} target="_blank" rel="noreferrer" className="botao botao-claro">
            <IconeInstagram /> @{conteudo.instagram}
          </a>
        </div>
      </section>
    </>
  )
}
