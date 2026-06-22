import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './Cadastro.css'

const VALIDADORES = {
  nome: (v) => v.trim().length < 3 ? 'Nome deve ter pelo menos 3 caracteres.' : '',
  email: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Insira um e-mail válido.' : '',
  telefone: (v) => v && !/^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(v.trim()) ? 'Telefone inválido.' : '',
  cargo: (v) => v.trim().length < 2 ? 'Cargo é obrigatório.' : '',
  departamento: () => '',
  bio: (v) => v.length > 250 ? 'Bio deve ter no máximo 250 caracteres.' : '',
}

export default function Editar() {
  const { id } = useParams()
  const { usuarios, editarUsuario } = useApp()
  const navigate = useNavigate()

  const usuario = usuarios.find((u) => String(u.id) === String(id))

  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (usuario) setForm({ ...usuario })
    else navigate('/listagem')
  }, [usuario])

  if (!form) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: VALIDADORES[name](value) }))
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: VALIDADORES[name](value) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const allTouched = Object.fromEntries(Object.keys(VALIDADORES).map((k) => [k, true]))
    setTouched(allTouched)
    const novosErros = {}
    ;['nome', 'email', 'cargo'].forEach((c) => { if (!form[c].trim()) novosErros[c] = 'Campo obrigatório.' })
    Object.keys(VALIDADORES).forEach((c) => { if (!novosErros[c]) { const err = VALIDADORES[c](form[c]); if (err) novosErros[c] = err } })
    setErrors(novosErros)
    if (Object.keys(novosErros).length > 0) return
    editarUsuario(form)
    setSuccess(true)
    setTimeout(() => navigate('/listagem'), 1500)
  }

  if (success) return (
    <div className="cadastro-page page-enter">
      <div className="success-screen">
        <div className="success-icon">✓</div>
        <h2 className="success-title">Usuário atualizado!</h2>
        <p className="success-msg">Redirecionando para a listagem...</p>
      </div>
    </div>
  )

  return (
    <div className="cadastro-page page-enter">
      <div className="form-wrapper">
        <div className="form-header">
          <h1 className="form-title">Editar Usuário</h1>
          <p className="form-subtitle">Atualize os dados do usuário selecionado.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="form-card">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Dados Pessoais</legend>
            <div className="field-row two-col">
              <Field label="Nome completo *" error={touched.nome && errors.nome}>
                <input type="text" name="nome" value={form.nome} onChange={handleChange} onBlur={handleBlur} className={touched.nome && errors.nome ? 'input input-error' : 'input'} />
              </Field>
              <Field label="E-mail *" error={touched.email && errors.email}>
                <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} className={touched.email && errors.email ? 'input input-error' : 'input'} />
              </Field>
            </div>
            <div className="field-row">
              <Field label="Telefone" error={touched.telefone && errors.telefone}>
                <input type="tel" name="telefone" value={form.telefone} onChange={handleChange} onBlur={handleBlur} className={touched.telefone && errors.telefone ? 'input input-error' : 'input'} />
              </Field>
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Informações Profissionais</legend>
            <div className="field-row two-col">
              <Field label="Cargo *" error={touched.cargo && errors.cargo}>
                <input type="text" name="cargo" value={form.cargo} onChange={handleChange} onBlur={handleBlur} className={touched.cargo && errors.cargo ? 'input input-error' : 'input'} />
              </Field>
              <Field label="Departamento" error={touched.departamento && errors.departamento}>
                <select name="departamento" value={form.departamento} onChange={handleChange} onBlur={handleBlur} className="input select-input">
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
                <textarea name="bio" value={form.bio} onChange={handleChange} onBlur={handleBlur} rows={3} className={touched.bio && errors.bio ? 'input textarea-input input-error' : 'input textarea-input'} />
              </Field>
            </div>
          </fieldset>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/listagem')} className="btn btn-ghost">Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
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
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}