import { useState } from 'react'
import conteudo from '../conteudo.js'
import { CabecalhoPagina, Depoimentos, Titulo } from '../components/Blocos.jsx'
import Azulejo from '../components/Azulejo.jsx'
import Visualizador from '../components/Visualizador.jsx'
import { arquivo } from '../utils.js'

export default function Galeria() {
  const [aberta, setAberta] = useState(null)
  const fotos = conteudo.fotos

  return (
    <>
      <CabecalhoPagina titulo="Galeria" subtitulo="Momentos que guardamos no coração" />
      <section className="secao">
        <div className="container">
          {fotos.length > 0 ? (
            <div className="mosaico">
              {fotos.map((f, i) => (
                <figure key={f.arquivo} className="mosaico-item">
                  <button type="button" onClick={() => setAberta(i)} aria-label={`Ampliar: ${f.legenda}`}>
                    <img src={arquivo(f.arquivo)} alt={f.legenda} loading="lazy" />
                  </button>
                  <figcaption>{f.legenda}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="vazio vazio-destaque">
              <span className="vazio-azulejo" aria-hidden="true"><Azulejo tamanho={64} /></span>
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

      <Visualizador fotos={fotos} indice={aberta} aoMudar={setAberta} aoFechar={() => setAberta(null)} />
    </>
  )
}
