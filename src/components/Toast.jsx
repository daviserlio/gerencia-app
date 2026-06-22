import { useEffect } from 'react'
import './Toast.css'

export default function Toast({ mensagem, tipo = 'sucesso', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast-${tipo}`}>
      <span className="toast-icone">
        {tipo === 'sucesso' ? '✓' : tipo === 'erro' ? '✕' : 'ℹ'}
      </span>
      <span className="toast-msg">{mensagem}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  )
}