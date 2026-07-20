import { createContext, useContext, useState, useEffect } from 'react'
import { mockClaveUnicaUser, mockInternos } from '../api/mockData.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'conaf_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  /**
   * Simula el flujo OIDC con Clave Única.
   * En producción: redirigir a https://accounts.claveunica.gob.cl/openid/authorize
   * con los parámetros del cliente registrado (client_id, redirect_uri, scopes).
   * Ver CLAVE_UNICA.md.
   */
  const loginClaveUnica = () => {
    const { nombre1, nombre2, apellido1, apellido2 } = mockClaveUnicaUser
    const nombreCompleto = [nombre1, nombre2, apellido1, apellido2].filter(Boolean).join(' ')
    setUser({
      rol: 'solicitante',
      ...mockClaveUnicaUser,
      nombre: nombreCompleto,
    })
  }

  const loginInterno = (email, password) => {
    const u = mockInternos.find(x => x.email === email && x.password === password)
    if (!u) throw new Error('Credenciales inválidas')
    setUser(u)
    return u
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, loginClaveUnica, loginInterno, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
