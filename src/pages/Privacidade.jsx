import conteudo from '../conteudo.js'
import { CabecalhoPagina } from '../components/Blocos.jsx'

export default function Privacidade() {
  const email = 'tlcribeiraodopinhal@gmail.com'
  return (
    <>
      <CabecalhoPagina titulo="Política de Privacidade" subtitulo="Como cuidamos dos seus dados" />
      <section className="secao">
        <div className="container texto texto-estreito politica">
          <p>
            O <strong>{conteudo.nome}</strong>, movimento de jovens da {conteudo.paroquia} ({conteudo.diocese}),
            respeita a sua privacidade e segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
          </p>

          <h2>Quais dados coletamos</h2>
          <ul>
            <li><strong>Doações (pessoa física):</strong> nome (ou doação anônima), e-mail e WhatsApp (opcionais), valor e mensagem.</li>
            <li><strong>Apoio (empresas):</strong> nome da empresa, CNPJ, nome do responsável, e-mail, telefone, tipo e valor estimado do apoio.</li>
            <li><strong>Inscrições em eventos:</strong> feitas por formulário do Google, que tem a sua própria política de privacidade.</li>
          </ul>
          <p>Não coletamos CPF, dados bancários nem senhas. O pagamento via Pix acontece no app do seu banco, fora deste site.</p>
          <p>
            Para proteger os formulários contra robôs, guardamos por até 24 horas uma versão embaralhada e
            irreversível do endereço de internet (IP) de quem envia. Não é possível descobrir o IP real a partir dela.
          </p>

          <h2>Para que usamos</h2>
          <ul>
            <li>Registrar as contribuições e fazer a prestação de contas do movimento;</li>
            <li>Entrar em contato sobre a sua doação ou proposta de apoio;</li>
            <li>Exibir o logo de empresas apoiadoras no site, <strong>somente</strong> quando autorizado.</li>
          </ul>
          <p>Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.</p>

          <h2>Onde ficam guardados</h2>
          <p>
            Os registros ficam em um banco de dados protegido (Cloudflare) e uma cópia é enviada por e-mail à
            coordenação e à tesouraria do TLC. Apenas a equipe responsável tem acesso.
          </p>

          <h2>Seus direitos</h2>
          <p>
            Você pode pedir a qualquer momento para ver, corrigir ou apagar os seus dados, escrevendo para{' '}
            <a href={`mailto:${email}`}>{email}</a>.
          </p>

          <p className="politica-data">Última atualização: novembro de 2026.</p>
        </div>
      </section>
    </>
  )
}
