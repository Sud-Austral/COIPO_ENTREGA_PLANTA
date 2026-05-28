import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const homeByRole = {
  solicitante: '/solicitante/nueva',
  encargado: '/encargado/bandeja',
  consolidador: '/consolidador',
  administrador: '/admin',
}

export default function Login() {
  const { loginClaveUnica, loginInterno } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleClaveUnica = () => {
    loginClaveUnica()
    navigate(homeByRole.solicitante)
  }

  const handleInterno = (e) => {
    e.preventDefault()
    setError('')
    try {
      const u = loginInterno(email.trim(), password)
      navigate(homeByRole[u.rol])
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>CONAF</h1>
        <p className="sub">Sistema de Entrega de Plantas<br/>Programa de Arborización</p>

        <div className="banner-info">
          <strong>¿Eres ciudadano y quieres solicitar plantas?</strong> Ingresa con Clave Única.
        </div>

        <button className="clave-unica-btn" onClick={handleClaveUnica}>
          Ingresar con Clave Única
        </button>

        <div className="divider">o ingreso de funcionarios CONAF</div>

        <form onSubmit={handleInterno}>
          <div className="field">
            <label htmlFor="email">Correo institucional</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@conaf.cl"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="secondary" style={{ width: '100%' }}>
            Ingresar
          </button>
        </form>

        <details style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          <summary style={{ cursor: 'pointer' }}>Credenciales de demo (mock)</summary>
          <div style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
            <strong>Encargado Buin:</strong> enc.buin@conaf.cl / demo<br/>
            <strong>Encargado Curacautín:</strong> enc.curacautin@conaf.cl / demo<br/>
            <strong>Consolidador:</strong> consolidador@conaf.cl / demo<br/>
            <strong>Administrador:</strong> admin@conaf.cl / demo
          </div>
        </details>
      </div>
    </div>
  )
}
