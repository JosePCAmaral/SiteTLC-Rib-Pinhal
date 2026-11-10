import { IconeCalendario } from './Icones.jsx'

// Botão "Adicionar à agenda": abre duas opções.
//  - Google Agenda: abre o Google já com o evento preenchido.
//  - Arquivo de calendário (.ics): funciona no iPhone, Android e Outlook,
//    e já vem com lembretes de 1 dia e de 2 horas antes.

function utc(data) {
  // 2026-12-11T22:30:00.000Z -> 20261211T223000Z
  return data.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

// Texto de arquivo .ics precisa escapar vírgula, ponto e vírgula e quebra de linha
function textoIcs(texto) {
  return String(texto).replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
}

function horarios(ev) {
  const inicio = new Date(ev.data)
  const fim = new Date(inicio.getTime() + (ev.duracaoHoras || 2) * 3600 * 1000)
  return { inicio, fim }
}

function linkGoogle(ev, endereco) {
  const { inicio, fim } = horarios(ev)
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.nome,
    dates: `${utc(inicio)}/${utc(fim)}`,
    details: `${ev.descricao}\n\n${window.location.origin}${ev.pagina || ''}`,
    location: endereco,
    ctz: 'America/Sao_Paulo',
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

function baixarIcs(ev, endereco) {
  const { inicio, fim } = horarios(ev)
  const url = `${window.location.origin}${ev.pagina || ''}`
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TLC Ribeirao do Pinhal//Site//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${utc(inicio)}-${ev.nome.replace(/\W+/g, '-').toLowerCase()}@tlcribeiraodopinhal.com.br`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(inicio)}`,
    `DTEND:${utc(fim)}`,
    `SUMMARY:${textoIcs(ev.nome)}`,
    `DESCRIPTION:${textoIcs(`${ev.descricao}\n\n${url}`)}`,
    `LOCATION:${textoIcs(endereco)}`,
    `URL:${url}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${textoIcs(ev.nome)} é amanhã`, 'TRIGGER:-P1D', 'END:VALARM',
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${textoIcs(ev.nome)} começa em 2 horas`, 'TRIGGER:-PT2H', 'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const arquivo = new Blob([linhas.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(arquivo)
  link.download = `${ev.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\W+/g, '-').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

export default function AdicionarAgenda({ evento }) {
  const endereco = `${evento.local}, ${evento.cidade}`
  return (
    <details className="agenda">
      <summary className="botao botao-contorno">
        <IconeCalendario aria-hidden="true" />
        Adicionar à agenda
      </summary>
      <div className="agenda-opcoes">
        <a href={linkGoogle(evento, endereco)} target="_blank" rel="noreferrer">Google Agenda</a>
        <button type="button" onClick={() => baixarIcs(evento, endereco)}>
          iPhone, Android ou Outlook
          <small>baixa o evento com lembretes</small>
        </button>
      </div>
    </details>
  )
}
