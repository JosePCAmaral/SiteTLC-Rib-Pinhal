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
