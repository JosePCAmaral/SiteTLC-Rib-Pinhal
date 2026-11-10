// Gera public/compartilhar.png a partir de ferramentas/imagem-compartilhamento.html
// usando o Google Chrome instalado no computador.  Uso: npm run imagem
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const candidatos = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean)
const chrome = candidatos.find((c) => existsSync(c))
if (!chrome) {
  console.error('Chrome não encontrado. Informe o caminho na variável CHROME.')
  process.exit(1)
}

const pagina = pathToFileURL(resolve('ferramentas/imagem-compartilhamento.html')).href
const saida = resolve('public/compartilhar.png')
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630',
  '--virtual-time-budget=5000', `--screenshot=${saida}`, pagina,
], { stdio: 'ignore' })
console.log(`Imagem gerada: ${saida}`)
