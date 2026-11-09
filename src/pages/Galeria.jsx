import conteudo from '../conteudo.js'
import { CabecalhoPagina, Depoimentos, GradeFotos, Titulo } from '../components/Blocos.jsx'
import { CoroaEstrelas } from '../components/Icones.jsx'

export default function Galeria() {
  return (
    <>
      <CabecalhoPagina titulo="Galeria" subtitulo="Momentos que guardamos no coração" />
      <section className="secao">
        <div className="container">
          {conteudo.fotos.length > 0 ? (
            <GradeFotos fotos={conteudo.fotos} />
          ) : (
            <div className="vazio vazio-destaque">
              <CoroaEstrelas className="vazio-estrelas" />
              <p>As primeiras fotos chegam depois da {conteudo.proximoEvento.nome}.</p>
              <p className="previsto">{conteudo.fraseDoMovimento}</p>
            </div>
          )}
        </div>
      </section>

      {conteudo.depoimentos.length > 0 && (
        <section className="secao secao-clara">
          <div className="container">
            <Titulo sobre="Depoimentos">O que dizem por aqui</Titulo>
            <Depoimentos />
          </div>
        </section>
      )}
    </>
  )
}
