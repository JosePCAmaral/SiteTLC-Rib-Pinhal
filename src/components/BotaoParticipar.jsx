import { Link } from 'react-router-dom'
import { destinoParticipar } from '../utils.js'

// Botão "Quero participar": leva à página do próximo evento,
// ou ao formulário de inscrição quando não há página.
export default function BotaoParticipar({ className = 'botao', children = 'Quero participar', ...resto }) {
  const destino = destinoParticipar()
  if (destino.interno) {
    return <Link to={destino.para} className={className} {...resto}>{children}</Link>
  }
  return <a href={destino.para} target="_blank" rel="noreferrer" className={className} {...resto}>{children}</a>
}
