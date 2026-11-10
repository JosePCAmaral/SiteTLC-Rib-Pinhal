// Cabeçalhos de segurança aplicados a TODA resposta do site
// (páginas, imagens e API). Chamado por worker/index.js.
//
// Se adicionar um serviço externo novo (outro mapa, vídeo, analytics...),
// libere o domínio dele na Content-Security-Policy abaixo.

const CSP = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  "img-src 'self' data:",
  'frame-src https://maps.google.com https://www.google.com',
  "connect-src 'self' https://cloudflareinsights.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const CABECALHOS = {
  'Content-Security-Policy': CSP,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

export function aplicarCabecalhos(original, url) {
  // As respostas de arquivos estáticos vêm com cabeçalhos imutáveis: copia
  const resposta = new Response(original.body, {
    status: original.status,
    statusText: original.statusText,
    headers: new Headers(original.headers),
  })

  for (const [nome, valor] of Object.entries(CABECALHOS)) {
    resposta.headers.set(nome, valor)
  }

  // Arquivos do build têm nome único (hash): podem ficar em cache por 1 ano
  if (url.pathname.startsWith('/assets/') && original.ok) {
    resposta.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return resposta
}
