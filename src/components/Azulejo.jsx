import { useId } from 'react'

// Azulejo próprio do TLC Ribeirão do Pinhal: cobalto sobre branco, como nas
// igrejas luso-brasileiras. No centro, a estrela mariana de oito pontas; nos
// cantos, quartos de círculo que formam rosetas quando as peças se encontram.
// Desenhado numa peça de 80 × 80 e repetido como padrão.

const estrela = Array.from({ length: 16 }, (_, i) => {
  const r = i % 2 === 0 ? 19 : 8.5
  const a = (i / 16) * Math.PI * 2 - Math.PI / 2
  return `${(40 + Math.cos(a) * r).toFixed(2)},${(40 + Math.sin(a) * r).toFixed(2)}`
}).join(' ')

const cantos = [[0, 0], [80, 0], [0, 80], [80, 80]]
const meios = [[40, 0], [40, 80], [0, 40], [80, 40]]

function Peca() {
  return (
    <>
      <rect width="80" height="80" className="azulejo-esmalte" />
      {cantos.map(([x, y]) => (
        <g key={`c${x}${y}`}>
          <circle cx={x} cy={y} r="17" fill="currentColor" />
          <circle cx={x} cy={y} r="11" className="azulejo-esmalte" />
          <circle cx={x} cy={y} r="5.5" fill="currentColor" />
        </g>
      ))}
      {meios.map(([x, y]) => (
        <circle key={`m${x}${y}`} cx={x} cy={y} r="4" fill="currentColor" />
      ))}
      {/* pétalas que ligam a estrela às bordas */}
      <ellipse cx="40" cy="12" rx="3.2" ry="6" fill="currentColor" />
      <ellipse cx="40" cy="68" rx="3.2" ry="6" fill="currentColor" />
      <ellipse cx="12" cy="40" rx="6" ry="3.2" fill="currentColor" />
      <ellipse cx="68" cy="40" rx="6" ry="3.2" fill="currentColor" />
      <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <polygon points={estrela} fill="currentColor" />
      <circle cx="40" cy="40" r="5" className="azulejo-esmalte" />
      <circle cx="40" cy="40" r="2" fill="currentColor" />
    </>
  )
}

/**
 * Preenche o espaço do elemento pai com azulejos.
 * @param {number} tamanho  lado de cada peça, em pixels
 */
export default function Azulejo({ tamanho = 72, className = '' }) {
  const id = `azulejo-${useId().replace(/:/g, '')}`
  return (
    <svg className={`azulejo ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={tamanho} height={tamanho} viewBox="0 0 80 80" patternUnits="userSpaceOnUse">
          <Peca />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

// Faixa de azulejos na horizontal, como a "barra" nas paredes das igrejas
export function BarraAzulejo({ tamanho = 40 }) {
  return (
    <div className="barra-azulejo" style={{ height: tamanho }}>
      <Azulejo tamanho={tamanho} />
    </div>
  )
}
