import { useEffect, useState } from 'react'

function calcular(alvo) {
  const resto = Math.max(0, new Date(alvo).getTime() - Date.now())
  return {
    acabou: resto === 0,
    dias: Math.floor(resto / 86400000),
    horas: Math.floor(resto / 3600000) % 24,
    minutos: Math.floor(resto / 60000) % 60,
    segundos: Math.floor(resto / 1000) % 60,
  }
}

const plural = (n, um, varios) => `${n === 1 ? um : varios}`

// Contagem regressiva escrita como frase: "Faltam 31 dias e 22 horas."
export function ContagemFrase({ data }) {
  const [t, setT] = useState(() => calcular(data))

  useEffect(() => {
    const id = setInterval(() => setT(calcular(data)), 30000)
    return () => clearInterval(id)
  }, [data])

  if (t.acabou) return null

  let partes
  if (t.dias > 0) {
    partes = [[t.dias, plural(t.dias, 'dia', 'dias')], [t.horas, plural(t.horas, 'hora', 'horas')]]
  } else if (t.horas > 0) {
    partes = [[t.horas, plural(t.horas, 'hora', 'horas')], [t.minutos, plural(t.minutos, 'minuto', 'minutos')]]
  } else {
    partes = [[t.minutos, plural(t.minutos, 'minuto', 'minutos')]]
  }
  const visiveis = partes.filter(([n], i) => i === 0 || n > 0)
  const verbo = visiveis[0][0] === 1 ? 'Falta' : 'Faltam'

  return (
    <p className="contagem-frase">
      {verbo}{' '}
      {visiveis.map(([n, rotulo], i) => (
        <span key={rotulo}>
          {i > 0 && ' e '}
          <strong>{n}</strong> {rotulo}
        </span>
      ))}
      .
    </p>
  )
}

// Contagem regressiva em caixinhas (dias, horas, min, seg), usada no topo azul
export default function Contagem({ data }) {
  const [t, setT] = useState(() => calcular(data))

  useEffect(() => {
    const id = setInterval(() => setT(calcular(data)), 1000)
    return () => clearInterval(id)
  }, [data])

  if (t.acabou) return null

  const blocos = [
    ['dias', t.dias],
    ['horas', t.horas],
    ['min', t.minutos],
    ['seg', t.segundos],
  ]

  return (
    <div className="contagem" role="timer" aria-label={`Faltam ${t.dias} dias e ${t.horas} horas`}>
      {blocos.map(([rotulo, valor]) => (
        <div key={rotulo} className="contagem-bloco">
          <span className="contagem-numero">{String(valor).padStart(2, '0')}</span>
          <span className="contagem-rotulo">{rotulo}</span>
        </div>
      ))}
    </div>
  )
}
