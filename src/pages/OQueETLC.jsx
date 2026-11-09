import conteudo from '../conteudo.js'
import { CabecalhoPagina, Titulo } from '../components/Blocos.jsx'

export default function OQueETLC() {
  const { introducao, pilares } = conteudo.oQueETLC

  return (
    <>
      <CabecalhoPagina titulo="O que é o TLC" subtitulo="Treinamento de Liderança Cristã" />

      <section className="secao">
        <div className="container texto texto-estreito">
          {introducao.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <section className="secao secao-clara">
        <div className="container">
          <Titulo sobre="Nossa caminhada">O que vivemos</Titulo>
          <div className="cartoes">
            {pilares.map((p) => (
              <article key={p.titulo} className="cartao">
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="secao">
        <div className="container texto-estreito">
          <Titulo sobre="Perguntas frequentes">E o encontro, como é?</Titulo>
          <div className="perguntas">
            {conteudo.perguntas.map((q, i) => (
              <details key={i} className="pergunta">
                <summary>{q.pergunta}</summary>
                {q.resposta ? (
                  <p>{q.resposta}</p>
                ) : (
                  <p className="previsto">{conteudo.fraseDoMovimento} <span aria-hidden="true">😉</span></p>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
