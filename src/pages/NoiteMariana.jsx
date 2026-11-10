import { Link } from 'react-router-dom'
import conteudo from '../conteudo.js'
import Azulejo, { BarraAzulejo } from '../components/Azulejo.jsx'
import { Titulo } from '../components/Blocos.jsx'
import { ContagemFrase } from '../components/Contagem.jsx'
import AdicionarAgenda from '../components/AdicionarAgenda.jsx'
import { arquivo, eventoJaPassou, formatarHora, linkInscricaoEvento, linkMapa } from '../utils.js'

// "Sexta-feira, 11 de dezembro"
function diaPorExtenso(iso) {
  const texto = new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
  })
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function FotoEmoldurada() {
  const foto = conteudo.fotoDestaque || conteudo.fotos[0]
  if (!foto) return null
  return (
    <div className="nm-moldura">
      <Azulejo tamanho={56} />
      <figure className="nm-foto">
        <img src={arquivo(foto.arquivo)} alt={foto.legenda} fetchPriority="high" />
      </figure>
    </div>
  )
}

export default function NoiteMariana() {
  const ev = conteudo.proximoEvento
  const passou = eventoJaPassou(ev.data)
  const mapaEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`${ev.local}, ${ev.cidade}`)}&output=embed`

  return (
    <>
      <section className="nm-topo">
        <div className="container nm-grade">
          <div>
            <h1 className="nm-titulo">
              {ev.nome.split(' ').map((palavra, i) => <span key={i} className="nm-palavra">{palavra} </span>)}
            </h1>
            <p className="nm-chamada">{ev.chamada}</p>

            <p className="nm-quando">{diaPorExtenso(ev.data)}, às {formatarHora(ev.data)}</p>
            <p className="nm-onde">
              <a href={linkMapa(ev.local, ev.cidade)} target="_blank" rel="noreferrer">{ev.local}</a>
              <br />
              {ev.cidade}
            </p>
            <p className="nm-publico">{ev.publico}.</p>

            {passou ? (
              <p className="contagem-frase">Essa noite já aconteceu. Obrigado a todos que vieram!</p>
            ) : (
              <ContagemFrase data={ev.data} />
            )}

            <div className="nm-acoes">
              {passou ? (
                <Link to="/galeria" className="botao botao-grande">Ver as fotos</Link>
              ) : (
                <a href={linkInscricaoEvento()} target="_blank" rel="noreferrer" className="botao botao-grande">
                  Fazer minha inscrição
                </a>
              )}
              {!passou && <AdicionarAgenda evento={ev} />}
              <a href={linkMapa(ev.local, ev.cidade)} target="_blank" rel="noreferrer" className="link-seta">
                Ver como chegar
              </a>
            </div>
          </div>
          <FotoEmoldurada />
        </div>
      </section>
      <BarraAzulejo tamanho={40} />

      <section className="secao">
        <div className="container nm-sobre">
          <Titulo>Como vai ser</Titulo>
          <div className="texto">
            <p>{ev.descricao}</p>
            <p>
              Não precisa ser do TLC nem ter participado de nenhum encontro: a noite é aberta a toda a comunidade.
              Traga a família e os amigos.
            </p>
            <p className="previsto">E o resto? {conteudo.fraseDoMovimento}</p>
          </div>
        </div>
      </section>

      <section className="secao secao-clara">
        <div className="container nm-local">
          <div>
            <Titulo>Como chegar</Titulo>
            <p className="nm-endereco">
              <strong>{ev.local}</strong>
              <br />
              {ev.cidade}
            </p>
            <a href={linkMapa(ev.local, ev.cidade)} target="_blank" rel="noreferrer" className="botao botao-contorno">
              Abrir no Google Maps
            </a>
          </div>
          <iframe className="mapa" title={`Mapa: ${ev.local}`} src={mapaEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      {!passou && (
        <section className="faixa">
          <div className="container faixa-conteudo">
            <p className="faixa-frase">Te esperamos lá!</p>
            <p>A inscrição é rápida e ajuda a gente a preparar tudo com carinho.</p>
            <a href={linkInscricaoEvento()} target="_blank" rel="noreferrer" className="botao botao-grande">
              Fazer minha inscrição
            </a>
          </div>
        </section>
      )}
    </>
  )
}
