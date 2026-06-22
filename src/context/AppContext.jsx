import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [usuarios, setUsuarios] = useState([])
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [errorPosts, setErrorPosts] = useState(null)
  const [toast, setToast] = useState(null)

  function mostrarToast(mensagem, tipo = 'sucesso') {
    setToast({ mensagem, tipo })
  }

  const adicionarUsuario = useCallback((novoUsuario) => {
    setUsuarios((prev) => [
      { ...novoUsuario, id: Date.now(), criadoEm: new Date().toLocaleString('pt-BR') },
      ...prev,
    ])
    mostrarToast('Usuário cadastrado com sucesso!')
  }, [])

  const editarUsuario = useCallback((usuarioAtualizado) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuarioAtualizado.id ? { ...usuarioAtualizado } : u))
    )
    mostrarToast('Usuário atualizado com sucesso!')
  }, [])

  const removerUsuario = useCallback((id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
    mostrarToast('Usuário removido.', 'info')
  }, [])

  const buscarPosts = useCallback(async () => {
    setLoadingPosts(true)
    setErrorPosts(null)
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12')
      if (!res.ok) throw new Error(`Erro ${res.status}: não foi possível buscar os dados`)
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      setErrorPosts(err.message)
      mostrarToast('Erro ao carregar posts da API.', 'erro')
    } finally {
      setLoadingPosts(false)
    }
  }, [])

  return (
    <AppContext.Provider value={{ usuarios, adicionarUsuario, editarUsuario, removerUsuario, posts, loadingPosts, errorPosts, buscarPosts }}>
      {children}
      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}