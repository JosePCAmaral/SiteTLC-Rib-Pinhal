// Gera o código "Pix Copia e Cola" (BR Code estático, padrão do Banco Central).
// O mesmo texto vira o QR Code.

function campo(id, valor) {
  return id + String(valor.length).padStart(2, '0') + valor
}

// Remove acentos e caracteres que alguns bancos não aceitam
function limpar(texto, max) {
  return String(texto || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .toUpperCase().trim().slice(0, max)
}

// "JOSE PEDRO CUNHA DO AMARAL" (26) -> "JOSE PEDRO C D AMARAL" (cabe em 25)
function abreviarNome(nome, max) {
  const limpo = limpar(nome, 200)
  if (limpo.length <= max) return limpo
  const partes = limpo.split(/\s+/)
  for (let i = partes.length - 2; i >= 1; i--) {
    partes[i] = partes[i][0]
    const tentativa = partes.join(' ')
    if (tentativa.length <= max) return tentativa
  }
  return partes.join(' ').slice(0, max)
}

function crc16(payload) {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let b = 0; b < 8; b++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

/**
 * @param {object} p
 * @param {string} p.chave       chave Pix (aleatória, e-mail, telefone...)
 * @param {string} p.nome        nome do recebedor (até 25 letras)
 * @param {string} p.cidade      cidade do recebedor (até 15 letras)
 * @param {number} [p.valor]     valor em reais (ex: 50 ou 12.5)
 * @param {string} [p.txid]      identificador (aparece no extrato de alguns bancos)
 */
export function gerarPix({ chave, nome, cidade, valor, txid }) {
  const conta = campo('00', 'br.gov.bcb.pix') + campo('01', chave.trim())
  const id = (String(txid || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 25)) || '***'

  let payload =
    campo('00', '01') +
    campo('26', conta) +
    campo('52', '0000') +
    campo('53', '986') +
    (valor ? campo('54', Number(valor).toFixed(2)) : '') +
    campo('58', 'BR') +
    campo('59', abreviarNome(nome, 25) || 'TLC') +
    campo('60', limpar(cidade, 15) || 'BRASIL') +
    campo('62', campo('05', id)) +
    '6304'

  return payload + crc16(payload)
}
