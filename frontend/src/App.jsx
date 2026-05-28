import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'

import NuevaSolicitud from './pages/solicitante/NuevaSolicitud.jsx'
import MisSolicitudes from './pages/solicitante/MisSolicitudes.jsx'
import MisDatos from './pages/solicitante/MisDatos.jsx'

import Bandeja from './pages/encargado/Bandeja.jsx'
import DetalleSolicitud from './pages/encargado/DetalleSolicitud.jsx'
import Stock from './pages/encargado/Stock.jsx'

import Dashboard from './pages/consolidador/Dashboard.jsx'

import Admin from './pages/admin/Admin.jsx'

const homeByRole = {
  solicitante: '/solicitante/nueva',
  encargado: '/encargado/bandeja',
  consolidador: '/consolidador',
  administrador: '/admin',
}

function Home() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={homeByRole[user.rol] || '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Home />} />

        <Route path="/solicitante/nueva" element={
          <ProtectedRoute rolesPermitidos={['solicitante']}><NuevaSolicitud /></ProtectedRoute>
        } />
        <Route path="/solicitante/mis-solicitudes" element={
          <ProtectedRoute rolesPermitidos={['solicitante']}><MisSolicitudes /></ProtectedRoute>
        } />
        <Route path="/solicitante/mis-datos" element={
          <ProtectedRoute rolesPermitidos={['solicitante']}><MisDatos /></ProtectedRoute>
        } />

        <Route path="/encargado/bandeja" element={
          <ProtectedRoute rolesPermitidos={['encargado']}><Bandeja /></ProtectedRoute>
        } />
        <Route path="/encargado/solicitud/:id" element={
          <ProtectedRoute rolesPermitidos={['encargado']}><DetalleSolicitud /></ProtectedRoute>
        } />
        <Route path="/encargado/stock" element={
          <ProtectedRoute rolesPermitidos={['encargado']}><Stock /></ProtectedRoute>
        } />

        <Route path="/consolidador" element={
          <ProtectedRoute rolesPermitidos={['consolidador']}><Dashboard /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute rolesPermitidos={['administrador']}><Admin /></ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
