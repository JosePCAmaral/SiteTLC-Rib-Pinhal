import conteudo from './conteudo.js'

// Cloudflare Web Analytics: conta visitas e páginas vistas sem cookies e sem
// dados pessoais. Só liga no domínio oficial (não conta testes locais nem prévias).
const DOMINIO_OFICIAL = 'tlcribeiraodopinhal.com.br'

export function iniciarEstatisticas() {
  const token = conteudo.tokenWebAnalytics
  const host = window.location.hostname
  const noSiteOficial = host === DOMINIO_OFICIAL || host.endsWith(`.${DOMINIO_OFICIAL}`)
  if (!token || !noSiteOficial) return

  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  // spa: conta também a navegação entre páginas sem recarregar (React Router)
  script.setAttribute('data-cf-beacon', JSON.stringify({ token, spa: true }))
  document.head.appendChild(script)
}
