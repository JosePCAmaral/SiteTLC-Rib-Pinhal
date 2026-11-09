const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const IconeInstagram = (p) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
)
export const IconeWhatsapp = (p) => (
  <svg {...base} {...p}><path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.4L3 21z" /><path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1-1.5-2-1-1 .8a5 5 0 0 1-2-2l.8-1-1-2L9 9.5z" /></svg>
)
export const IconeSite = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
)
export const IconeLocal = (p) => (
  <svg {...base} {...p}><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
)
export const IconeCalendario = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
)
export const IconeRelogio = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IconePessoas = (p) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14.2A5 5 0 0 1 21.5 19" /></svg>
)
export const IconeEmail = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
)
export const IconeSeta = (p) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

// Coroa de 12 estrelas — símbolo mariano (Ap 12,1)
export function CoroaEstrelas({ className }) {
  const estrelas = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    return { x: 100 + Math.cos(a) * 82, y: 100 + Math.sin(a) * 82 }
  })
  const estrela = 'M0,-7 L2,-2.2 7,-2.2 3,1 4.5,6 0,3 -4.5,6 -3,1 -7,-2.2 -2,-2.2 Z'
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      {estrelas.map((e, i) => (
        <path key={i} d={estrela} transform={`translate(${e.x} ${e.y})`} fill="currentColor" />
      ))}
    </svg>
  )
}
