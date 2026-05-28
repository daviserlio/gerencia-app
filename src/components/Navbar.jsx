import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Navbar.css'

export default function Navbar() {
  const { usuarios } = useApp()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">GerenciaApp</span>
        </NavLink>
        <nav className="navbar-links" role="navigation" aria-label="Menu principal">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Início
          </NavLink>
          <NavLink to="/cadastro" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Cadastro
          </NavLink>
          <NavLink to="/listagem" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Listagem
            {usuarios.length > 0 && (
              <span className="badge">{usuarios.length}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}