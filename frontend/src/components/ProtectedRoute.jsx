import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ rolesPermitidos, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/login" replace />
  }
  return children
}
