import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound-page page-enter">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Página não encontrada</h1>
      <p className="notfound-desc">A URL que você acessou não existe ou foi removida.</p>
      <Link to="/" className="btn btn-primary">Voltar para o Início</Link>
    </div>
  )
}