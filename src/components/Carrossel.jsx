import { useCallback, useEffect, useRef, useState } from 'react'
import { arquivo } from '../utils.js'

const INTERVALO = 6000 // tempo de cada foto (ms)

function IconeSeta({ direcao }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direcao === 'esquerda' ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  )
}

export default function Carrossel({ fotos }) {
  const trilho = useRef(null)
  const [atual, setAtual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const total = fotos.length

  const irPara = useCallback((i) => {
    const el = trilho.current
    if (!el) return
    const alvo = (i + total) % total
    el.scrollTo({ left: alvo * el.clientWidth, behavior: 'smooth' })
  }, [total])

  // Atualiza o indicador conforme o usuário arrasta/rola
  function aoRolar() {
    const el = trilho.current
    if (!el) return
    setAtual(Math.round(el.scrollLeft / el.clientWidth))
  }

  // Passagem automática (pausa com mouse em cima, foco ou movimento reduzido)
  useEffect(() => {
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (pausado || reduzido || total < 2) return
    const id = setInterval(() => {
      if (!document.hidden) irPara(atual + 1)
    }, INTERVALO)
    return () => clearInterval(id)
  }, [atual, pausado, irPara, total])

  if (total === 0) return null

  return (
    <div
      className="carrossel"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Fotos do TLC Ribeirão do Pinhal"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') irPara(atual - 1)
        if (e.key === 'ArrowRight') irPara(atual + 1)
      }}
    >
      <div className="carrossel-palco">
        <div className="carrossel-trilho" ref={trilho} onScroll={aoRolar}>
          {fotos.map((f, i) => (
            <figure
              key={f.arquivo}
              className="carrossel-slide"
              role="group"
              aria-roledescription="foto"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={i !== atual}
            >
              <div className="carrossel-quadro">
                <img className="carrossel-fundo" src={arquivo(f.arquivo)} alt="" aria-hidden="true" loading={i === 0 ? 'eager' : 'lazy'} />
                <img className="carrossel-img" src={arquivo(f.arquivo)} alt={f.legenda} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            </figure>
          ))}
        </div>

        {total > 1 && (
          <>
            <button type="button" className="carrossel-botao anterior" onClick={() => irPara(atual - 1)} aria-label="Foto anterior">
              <IconeSeta direcao="esquerda" />
            </button>
            <button type="button" className="carrossel-botao proximo" onClick={() => irPara(atual + 1)} aria-label="Próxima foto">
              <IconeSeta direcao="direita" />
            </button>
          </>
        )}
      </div>

      <p className="carrossel-legenda" aria-live={pausado ? 'polite' : 'off'}>{fotos[atual]?.legenda}</p>

      {total > 1 && (
        <div className="carrossel-pontos">
          {fotos.map((f, i) => (
            <button
              key={f.arquivo}
              type="button"
              className={`carrossel-ponto ${i === atual ? 'ativo' : ''}`}
              onClick={() => irPara(i)}
              aria-label={`Ir para a foto ${i + 1}`}
              aria-current={i === atual}
            />
          ))}
        </div>
      )}
    </div>
  )
}
