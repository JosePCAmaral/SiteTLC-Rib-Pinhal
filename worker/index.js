// Ponto de entrada do Worker do Cloudflare.
// Toda requisição passa por aqui:
//   /api/doacao  -> backend das doações e apoios (worker/doacao.js)
//   /api/...     -> 404
//   o resto      -> arquivos do site (pasta dist/, gerada pelo "npm run build")
// e no fim recebe os cabeçalhos de segurança (worker/seguranca.js).

import { tratarDoacao } from './doacao.js'
import { aplicarCabecalhos } from './seguranca.js'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    let resposta

    try {
      if (url.pathname === '/api/doacao') {
        resposta = await tratarDoacao(request, env, ctx)
      } else if (url.pathname.startsWith('/api/')) {
        resposta = Response.json({ erro: 'Não encontrado.' }, { status: 404 })
      } else {
        resposta = await env.ASSETS.fetch(request)
      }
    } catch (e) {
      console.error('Erro inesperado', e)
      resposta = Response.json({ erro: 'Erro interno. Tente novamente.' }, { status: 500 })
    }

    return aplicarCabecalhos(resposta, url)
  },
}
