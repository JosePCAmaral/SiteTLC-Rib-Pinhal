import { useEffect, useRef } from 'react'
import { arquivo } from '../utils.js'

// Mostra uma foto em tela cheia, com legenda e setas para navegar.
export default function Visualizador({ fotos, indice, aoMudar, aoFechar }) {
  const dialogo = useRef(null)
  const aberto = indice !== null

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (aberto && !d.open) d.showModal()
    if (!aberto && d.open) d.close()
  }, [aberto])

  const foto = aberto ? fotos[indice] : null
  const total = fotos.length
  const mudar = (passo) => aoMudar((indice + passo + total) % total)

  return (
    <dialog
      ref={dialogo}
      className="visualizador"
      onClose={aoFechar}
      onClick={(e) => { if (e.target === e.currentTarget) aoFechar() }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') mudar(-1)
        if (e.key === 'ArrowRight') mudar(1)
      }}
      aria-label={foto ? foto.legenda : 'Foto'}
    >
      {foto && (
        <figure className="visualizador-figura">
          <img src={arquivo(foto.arquivo)} alt={foto.legenda} />
          <figcaption>
            <span>{foto.legenda}</span>
            <span className="visualizador-contador">{indice + 1} / {total}</span>
          </figcaption>
        </figure>
      )}
      <button type="button" className="visualizador-fechar" onClick={aoFechar} aria-label="Fechar">×</button>
      {total > 1 && (
        <>
          <button type="button" className="visualizador-seta anterior" onClick={() => mudar(-1)} aria-label="Foto anterior">‹</button>
          <button type="button" className="visualizador-seta proximo" onClick={() => mudar(1)} aria-label="Próxima foto">›</button>
        </>
      )}
    </dialog>
  )
}
