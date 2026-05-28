import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [usuarios, setUsuarios] = useState([])
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [errorPosts, setErrorPosts] = useState(null)

  const adicionarUsuario = useCallback((novoUsuario) => {
    setUsuarios((prev) => [
      {
        ...novoUsuario,
        id: Date.now(),
        criadoEm: new Date().toLocaleString('pt-BR'),
      },
      ...prev,
    ])
  }, [])

  const removerUsuario = useCallback((id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
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
    } finally {
      setLoadingPosts(false)
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        usuarios,
        adicionarUsuario,
        removerUsuario,
        posts,
        loadingPosts,
        errorPosts,
        buscarPosts,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}