import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Cadastro.css'

const INITIAL = {
  nome: '',
  email: '',
  telefone: '',
  cargo: '',
  departamento: '',
  bio: '',
}

const VALIDADORES = {
  nome: (v) => v.trim().length < 3 ? 'Nome deve ter pelo menos 3 caracteres.' : '',
  email: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Insira um e-mail válido.' : '',
  telefone: (v) => v && !/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(v.trim()) ? 'Telefone inválido. Ex: (11) 91234-5678' : '',
  cargo: (v) => v.trim().length < 2 ? 'Cargo é obrigatório.' : '',
  departamento: () => '',
  bio: (v) => v.length > 250 ? 'Bio deve ter no máximo 250 caracteres.' : '',
}

export default function Cadastro() {
  const { adicionarUsuario } = useApp()
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: VALIDADORES[name](value) }))
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: VALIDADORES[name](value) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const allTouched = Object.fromEntries(Object.keys(INITIAL).map((k) => [k, true]))
    setTouched(allTouched)
    const novosErros = {}
    ;['nome', 'email', 'cargo'].forEach((c) => {
      if (!form[c].trim()) novosErros[c] = 'Campo obrigatório.'
    })
    Object.keys(VALIDADORES).forEach((c) => {
      if (!novosErros[c]) {
        const err = VALIDADORES[c](form[c])
        if (err) novosErros[c] = err
      }
    })
    setErrors(novosErros)
    if (Object.keys(novosErros).length > 0) return
    adicionarUsuario(form)
    setSuccess(true)
    setTimeout(() => navigate('/listagem'), 1800)
  }

  function handleReset() {
    setForm(INITIAL)
    setErrors({})
    setTouched({})
    setSubmitted(false)
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="cadastro-page page-enter">
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Cadastro realizado!</h2>
          <p className="success-msg">Redirecionando para a listagem...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cadastro-page page-enter">
      <div className="form-wrapper">
        <div className="form-header">
          <h1 className="form-title">Novo Cadastro</h1>
          <p className="form-subtitle">Preencha os dados para adicionar um usuário ao sistema.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="form-card">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Dados Pessoais</legend>

            <div className="field-row two-col">
              <Field label="Nome completo *" error={touched.nome && errors.nome}>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ex: Maria Silva"
                  className={touched.nome && errors.nome ? 'input input-error' : 'input'}
                  autoComplete="name"
                />
              </Field>

              <Field label="E-mail *" error={touched.email && errors.email}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="ex@email.com"
                  className={touched.email && errors.email ? 'input input-error' : 'input'}
                  autoComplete="email"
                />
              </Field>
            </div>

            <div className="field-row">
              <Field label="Telefone" error={touched.telefone && errors.telefone}>
                <input
                  type="tel"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="(11) 91234-5678"
                  className={touched.telefone && errors.telefone ? 'input input-error' : 'input'}
                  autoComplete="tel"
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Informações Profissionais</legend>

            <div className="field-row two-col">
              <Field label="Cargo *" error={touched.cargo && errors.cargo}>
                <input
                  type="text"
                  name="cargo"
                  value={form.cargo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ex: Desenvolvedor Frontend"
                  className={touched.cargo && errors.cargo ? 'input input-error' : 'input'}
                />
              </Field>

              <Field label="Departamento" error={touched.departamento && errors.departamento}>
                <select
                  name="departamento"
                  value={form.departamento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="input select-input"
                >
                  <option value="">Selecione...</option>
                  <option value="TI">Tecnologia da Informação</option>
                  <option value="RH">Recursos Humanos</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operações">Operações</option>
                  <option value="Jurídico">Jurídico</option>
                </select>
              </Field>
            </div>

            <div className="field-row">
              <Field label={`Biografia (${form.bio.length}/250)`} error={touched.bio && errors.bio}>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Breve descrição sobre o usuário..."
                  rows={3}
                  className={touched.bio && errors.bio ? 'input textarea-input input-error' : 'input textarea-input'}
                />
              </Field>
            </div>
          </fieldset>

          {submitted && Object.keys(errors).length > 0 && (
            <div className="form-error-banner" role="alert">
              ⚠ Corrija os campos destacados antes de continuar.
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Limpar
            </button>
            <button type="submit" className="btn btn-primary">
              Cadastrar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      <label className="field-label">{label}</label>
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  )
}