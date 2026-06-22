import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Listagem.css'

export default function Listagem() {
  const { usuarios, removerUsuario, posts, loadingPosts, errorPosts, buscarPosts } = useApp()
  const [aba, setAba] = useState('usuarios')
  const [busca, setBusca] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    if (aba === 'api' && posts.length === 0 && !loadingPosts) {
      buscarPosts()
    }
  }, [aba])

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      (u.cargo && u.cargo.toLowerCase().includes(busca.toLowerCase()))
  )

  const postsFiltrados = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(busca.toLowerCase()) ||
      String(p.id).includes(busca)
  )

  return (
    <div className="listagem-page page-enter">
      <div className="listagem-inner">
        <div className="listagem-header">
          <div>
            <h1 className="listagem-title">Listagem</h1>
            <p className="listagem-subtitle">Gerencie usuários cadastrados e explore dados da API.</p>
          </div>
          <Link to="/cadastro" className="btn btn-primary">+ Novo Cadastro</Link>
        </div>

        <div className="listagem-controls">
          <div className="abas">
            <button
              className={`aba-btn ${aba === 'usuarios' ? 'aba-ativa' : ''}`}
              onClick={() => { setAba('usuarios'); setBusca('') }}
            >
              Usuários{' '}
              <span className={`aba-count ${aba === 'usuarios' ? 'ativa' : ''}`}>
                {usuarios.length}
              </span>
            </button>
            <button
              className={`aba-btn ${aba === 'api' ? 'aba-ativa' : ''}`}
              onClick={() => { setAba('api'); setBusca('') }}
            >
              Posts da API{' '}
              <span className={`aba-count ${aba === 'api' ? 'ativa' : ''}`}>
                {posts.length}
              </span>
            </button>
          </div>

          <input
            type="search"
            placeholder={aba === 'usuarios' ? 'Buscar por nome, e-mail ou cargo...' : 'Buscar por título ou ID...'}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input"
            style={{ maxWidth: '320px' }}
          />
        </div>

        {aba === 'usuarios' && (
          <div>
            {usuariosFiltrados.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">{busca ? '🔍' : '👤'}</div>
                <h3 className="empty-title">
                  {busca ? 'Nenhum resultado encontrado' : 'Nenhum usuário cadastrado ainda'}
                </h3>
                <p className="empty-desc">
                  {busca ? 'Tente outro termo de busca.' : 'Vá até Cadastro para adicionar o primeiro usuário.'}
                </p>
                {!busca && <Link to="/cadastro" className="btn btn-primary">Cadastrar usuário</Link>}
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table" role="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Cargo</th>
                      <th>Departamento</th>
                      <th>Cadastrado em</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.map((u, idx) => (
                      <tr key={u.id}>
                        <td className="col-idx">{idx + 1}</td>
                        <td>
                          <div className="user-cell">
                            <div className="avatar">{u.nome[0].toUpperCase()}</div>
                            <span className="user-name">{u.nome}</span>
                          </div>
                        </td>
                        <td className="col-email">{u.email}</td>
                        <td><span className="tag">{u.cargo}</span></td>
                        <td>{u.departamento || <span className="col-idx">—</span>}</td>
                        <td className="col-date">{u.criadoEm}</td>
                        <td>
                          {confirmDelete === u.id ? (
                            <div className="confirm-row">
                              <button
                                className="btn-danger"
                                onClick={() => { removerUsuario(u.id); setConfirmDelete(null) }}
                              >
                                Sim
                              </button>
                              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>
                                Não
                              </button>
                            </div>
                          ) : (
                            <button className="btn-remove" onClick={() => setConfirmDelete(u.id)}>
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {aba === 'api' && (
          <div>
            {loadingPosts && (
              <div className="loading-state">
                <div className="spinner" />
                <p>Carregando posts da API...</p>
              </div>
            )}
            {errorPosts && (
              <div className="error-state">
                <p>⚠ {errorPosts}</p>
                <button className="btn btn-ghost" onClick={buscarPosts}>Tentar novamente</button>
              </div>
            )}
            {!loadingPosts && !errorPosts && (
              <>
                {postsFiltrados.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3 className="empty-title">Nenhum post encontrado</h3>
                    <p className="empty-desc">Tente outro termo de busca.</p>
                  </div>
                ) : (
                  <div className="posts-grid">
                    {postsFiltrados.map((post) => (
                      <article key={post.id} className="post-card">
                        <div className="post-id">#{post.id}</div>
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-body">{post.body}</p>
                        <div className="post-footer">
                          <span className="post-user">Usuário {post.userId}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}