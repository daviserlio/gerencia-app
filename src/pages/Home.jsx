import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Home.css'

export default function Home() {
  const { usuarios, posts } = useApp()

  const stats = [
    { label: 'Usuários cadastrados', value: usuarios.length, icon: '👤', to: '/listagem' },
    { label: 'Posts carregados via API', value: posts.length, icon: '📄', to: '/listagem' },
    { label: 'Páginas disponíveis', value: 3, icon: '📑', to: null },
  ]

  return (
    <div className="home-page page-enter">
      <section className="hero">
        <div className="hero-eyebrow">◈ Bem-vindo ao</div>
        <h1 className="hero-title">GerenciaApp</h1>
        <p className="hero-subtitle">
          Cadastre usuários, visualize listagens dinâmicas e explore
          dados de uma API REST — tudo em um único painel integrado.
        </p>
        <div className="hero-actions">
          <Link to="/cadastro" className="btn btn-primary">Novo Cadastro</Link>
          <Link to="/listagem" className="btn btn-ghost">Ver Listagem →</Link>
        </div>
      </section>

      <section className="stats-section">
        <h2 className="section-title">Visão Geral</h2>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              {stat.to && (
                <Link to={stat.to} className="stat-link">Ver detalhes →</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Funcionalidades</h2>
        <div className="features-grid">
          {[
            { icon: '🔀', title: 'Roteamento SPA', desc: 'Navegação entre páginas com React Router sem recarregar a aplicação.' },
            { icon: '✅', title: 'Formulário Validado', desc: 'Campos controlados com validação em tempo real e feedback visual.' },
            { icon: '🌐', title: 'Integração com API', desc: 'Consumo de dados da JSONPlaceholder com loading e tratamento de erro.' },
            { icon: '⚡', title: 'Estado Compartilhado', desc: 'Context API sincroniza dados entre todas as páginas automaticamente.' },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}