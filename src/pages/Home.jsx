import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Home.css'

function GraficoPizza({ usuarios }) {
  const departamentos = {}
  usuarios.forEach((u) => {
    const dep = u.departamento || 'Não informado'
    departamentos[dep] = (departamentos[dep] || 0) + 1
  })

  const total = usuarios.length
  const cores = ['#6c8ef5', '#a78bfa', '#34d399', '#f59e0b', '#f87171', '#38bdf8']
  const entradas = Object.entries(departamentos)

  if (total === 0) {
    return (
      <div className="pizza-vazio">
        <span>Nenhum dado ainda</span>
      </div>
    )
  }

  let anguloAtual = 0
  const fatias = entradas.map(([dep, qtd], i) => {
    const porcentagem = qtd / total
    const angulo = porcentagem * 360
    const inicio = anguloAtual
    anguloAtual += angulo

    const rad = (deg) => (deg * Math.PI) / 180
    const cx = 80, cy = 80, r = 70

    const x1 = cx + r * Math.cos(rad(inicio - 90))
    const y1 = cy + r * Math.sin(rad(inicio - 90))
    const x2 = cx + r * Math.cos(rad(inicio + angulo - 90))
    const y2 = cy + r * Math.sin(rad(inicio + angulo - 90))
    const largeArc = angulo > 180 ? 1 : 0

    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`

    return { d, cor: cores[i % cores.length], dep, qtd, porcentagem }
  })

  return (
    <div className="pizza-wrapper">
      <svg viewBox="0 0 160 160" className="pizza-svg">
        {fatias.map((f, i) => (
          <path key={i} d={f.d} fill={f.cor} stroke="var(--bg)" strokeWidth="2">
            <title>{f.dep}: {f.qtd}</title>
          </path>
        ))}
        <circle cx="80" cy="80" r="35" fill="var(--bg)" />
        <text x="80" y="76" textAnchor="middle" fill="var(--text-primary)" fontSize="16" fontWeight="bold" fontFamily="Syne">{total}</text>
        <text x="80" y="90" textAnchor="middle" fill="var(--text-muted)" fontSize="7">usuários</text>
      </svg>
      <div className="pizza-legenda">
        {fatias.map((f, i) => (
          <div key={i} className="legenda-item">
            <span className="legenda-cor" style={{ background: f.cor }} />
            <span className="legenda-dep">{f.dep}</span>
            <span className="legenda-qtd">{f.qtd}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const { usuarios, posts } = useApp()

  const stats = [
    { label: 'Usuários cadastrados', value: usuarios.length, icon: '👤', to: '/listagem' },
    { label: 'Último cadastro', value: usuarios.length > 0 ? usuarios[0].nome : '—', icon: '🕐', to: '/listagem' },
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
              {stat.to && <Link to={stat.to} className="stat-link">Ver detalhes →</Link>}
            </div>
          ))}
          <div className="stat-card pizza-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-label" style={{ marginBottom: '0.75rem' }}>Colaboradores por departamento</div>
            <GraficoPizza usuarios={usuarios} />
          </div>
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