import conteudo from './conteudo.js'

// Caminho de arquivos da pasta public/ (funciona no GitHub Pages e local)
export function arquivo(caminho) {
  if (!caminho) return ''
  if (/^https?:\/\//.test(caminho)) return caminho
  return import.meta.env.BASE_URL + caminho.replace(/^\//, '')
}

const fuso = 'America/Sao_Paulo'

export function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: fuso,
  })
}

export function formatarHora(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: fuso,
  }).replace(':', 'h')
}

export function partesData(iso) {
  const d = new Date(iso)
  return {
    dia: d.toLocaleDateString('pt-BR', { day: '2-digit', timeZone: fuso }),
    mes: d.toLocaleDateString('pt-BR', { month: 'short', timeZone: fuso }).replace('.', ''),
  }
}

export function eventoJaPassou(data) {
  return new Date(data).getTime() < Date.now()
}

export function linkInstagram() {
  return `https://instagram.com/${conteudo.instagram}`
}

export function linkWhatsapp() {
  return conteudo.whatsapp ? `https://wa.me/${conteudo.whatsapp.replace(/\D/g, '')}` : ''
}

export function linkMapa(local, cidade) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${local}, ${cidade}`)}`
}

export function linkInscricaoEvento() {
  return conteudo.proximoEvento.linkInscricao || conteudo.linkInscricao
}
