import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import conteudo from '../conteudo.js'
import { arquivo, eventoJaPassou, linkInstagram, linkWhatsapp } from '../utils.js'
import BotaoParticipar from './BotaoParticipar.jsx'
import { IconeInstagram, IconeWhatsapp } from './Icones.jsx'
import { BarraAzulejo } from './Azulejo.jsx'

const ev = conteudo.proximoEvento
const menu = [
  { para: '/', texto: 'Início' },
  // Página do próximo evento (some do menu depois que o evento passa)
  ...(ev.pagina && !eventoJaPassou(ev.data) ? [{ para: ev.pagina, texto: ev.nome }] : []),
  { para: '/o-que-e-o-tlc', texto: 'O que é o TLC' },
  { para: '/eventos', texto: 'Eventos' },
  { para: '/galeria', texto: 'Galeria' },
  { para: '/doacoes', texto: 'Doações' },
  { para: '/contato', texto: 'Contato' },
]

function Marca() {
  return (
    <Link to="/" className="marca" aria-label={`${conteudo.nome} — início`}>
      {conteudo.logo ? (
        <img src={arquivo(conteudo.logo)} alt="" className="marca-logo" />
      ) : (
        <span className="marca-sigla">{conteudo.nomeCurto}</span>
      )}
      <span className="marca-cidade">Ribeirão do Pinhal</span>
    </Link>
  )
}

export default function Layout() {
  const [menuAberto, setMenuAberto] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a href="#conteudo" className="pular">Pular para o conteúdo</a>
      <header className="topo">
        <div className="container topo-linha">
          <Marca />
          <button
            className="menu-botao"
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            onClick={() => setMenuAberto((v) => !v)}
          >
            <span className="menu-traco" />
            <span className="sr-only">Menu</span>
          </button>
          <nav id="menu-principal" className={`menu ${menuAberto ? 'aberto' : ''}`}>
            {menu.map((item) => (
              <NavLink key={item.para} to={item.para} end className="menu-link" onClick={() => setMenuAberto(false)}>
                {item.texto}
              </NavLink>
            ))}
            <BotaoParticipar className="botao botao-pequeno" onClick={() => setMenuAberto(false)} />
          </nav>
        </div>
      </header>

      <main id="conteudo">
        <Outlet />
      </main>

      <BarraAzulejo tamanho={40} />
      <footer className="rodape">
        <div className="container rodape-grade">
          <div>
            <p className="rodape-nome">{conteudo.nome}</p>
            <p>{conteudo.paroquia}</p>
            <p>{conteudo.diocese}</p>
            <p>{conteudo.cidade}</p>
          </div>
          <div className="rodape-redes">
            <a href={linkInstagram()} target="_blank" rel="noreferrer">
              <IconeInstagram /> @{conteudo.instagram}
            </a>
            {linkWhatsapp() && (
              <a href={linkWhatsapp()} target="_blank" rel="noreferrer">
                <IconeWhatsapp /> WhatsApp
              </a>
            )}
          </div>
          <div>
            <p className="rodape-frase">{conteudo.fraseDoMovimento}</p>
            <Link to="/privacidade" className="rodape-link">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
