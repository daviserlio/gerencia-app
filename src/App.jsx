import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Listagem from './pages/Listagem'
import NotFound from './pages/NotFound'
import Editar from './pages/Editar'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/listagem" element={<Listagem />} />
          <Route path="/editar/:id" element={<Editar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}