import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Inicio from './pages/Inicio.jsx'
import OQueETLC from './pages/OQueETLC.jsx'
import Eventos from './pages/Eventos.jsx'
import Galeria from './pages/Galeria.jsx'
import Doacoes from './pages/Doacoes.jsx'
import Contato from './pages/Contato.jsx'
import Privacidade from './pages/Privacidade.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'

// Para adicionar uma página nova: crie o arquivo em src/pages/,
// adicione uma <Route> aqui e um item em src/components/Layout.jsx (menu).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="o-que-e-o-tlc" element={<OQueETLC />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="galeria" element={<Galeria />} />
        <Route path="doacoes" element={<Doacoes />} />
        <Route path="contato" element={<Contato />} />
        <Route path="privacidade" element={<Privacidade />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
