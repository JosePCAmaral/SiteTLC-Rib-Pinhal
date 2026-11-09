import { Link } from 'react-router-dom'
import { CabecalhoPagina } from '../components/Blocos.jsx'

export default function NaoEncontrada() {
  return (
    <>
      <CabecalhoPagina titulo="Página não encontrada" subtitulo="Mas calma: tudo está previsto!" />
      <section className="secao">
        <div className="container">
          <Link to="/" className="botao">Voltar para o início</Link>
        </div>
      </section>
    </>
  )
}
