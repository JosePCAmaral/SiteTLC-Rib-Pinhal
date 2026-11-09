import conteudo from '../conteudo.js'
import { CabecalhoPagina } from '../components/Blocos.jsx'
import { IconeEmail, IconeInstagram, IconeLocal, IconeSeta, IconeWhatsapp } from '../components/Icones.jsx'
import { linkInstagram, linkMapa, linkWhatsapp } from '../utils.js'

export default function Contato() {
  const local = conteudo.proximoEvento.local
  const mapaEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`${local}, ${conteudo.cidade}`)}&output=embed`

  return (
    <>
      <CabecalhoPagina titulo="Contato" subtitulo="Vamos conversar? A gente adora conhecer gente nova." />

      <section className="secao">
        <div className="container contato-grade">
          <div className="contato-lista">
            <a href={conteudo.linkInscricao} target="_blank" rel="noreferrer" className="contato-item contato-principal">
              <IconeSeta />
              <div>
                <strong>Quero participar</strong>
                <span>Preencha o formulário de inscrição</span>
              </div>
            </a>
            <a href={linkInstagram()} target="_blank" rel="noreferrer" className="contato-item">
              <IconeInstagram />
              <div>
                <strong>Instagram</strong>
                <span>@{conteudo.instagram}</span>
              </div>
            </a>
            {linkWhatsapp() && (
              <a href={linkWhatsapp()} target="_blank" rel="noreferrer" className="contato-item">
                <IconeWhatsapp />
                <div>
                  <strong>WhatsApp</strong>
                  <span>Mande uma mensagem</span>
                </div>
              </a>
            )}
            {conteudo.email && (
              <a href={`mailto:${conteudo.email}`} className="contato-item">
                <IconeEmail />
                <div>
                  <strong>E-mail</strong>
                  <span>{conteudo.email}</span>
                </div>
              </a>
            )}
            <a href={linkMapa(local, conteudo.cidade)} target="_blank" rel="noreferrer" className="contato-item">
              <IconeLocal />
              <div>
                <strong>Onde estamos</strong>
                <span>{conteudo.paroquia}</span>
                <span>{conteudo.cidade} · {conteudo.diocese}</span>
              </div>
            </a>
          </div>
          <iframe
            className="mapa"
            title={`Mapa: ${local}`}
            src={mapaEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  )
}
