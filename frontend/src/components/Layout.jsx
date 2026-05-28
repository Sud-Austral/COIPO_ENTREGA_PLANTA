import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { viveros } from '../api/mockData.js'

const navByRole = {
  solicitante: [
    { to: '/solicitante/nueva',         label: 'Nueva solicitud' },
    { to: '/solicitante/mis-solicitudes', label: 'Mis solicitudes' },
    { to: '/solicitante/mis-datos',     label: 'Mis datos' },
  ],
  encargado: [
    { to: '/encargado/bandeja', label: 'Bandeja de solicitudes' },
    { to: '/encargado/stock',   label: 'Stock disponible' },
  ],
  consolidador: [
    { to: '/consolidador', label: 'Dashboard' },
  ],
  administrador: [
    { to: '/admin', label: 'Administración' },
  ],
}

const rolLabel = {
  solicitante: 'Solicitante',
  encargado: 'Encargado de vivero',
  consolidador: 'Consolidador',
  administrador: 'Administrador',
}

export default function Layout() {
  const { user, logout } = useAuth()
  const items = navByRole[user?.rol] || []
  const vivero = user?.viveroId ? viveros.find(v => v.id === user.viveroId) : null

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">CONAF</div>
        <div className="brand-sub">Entrega de Plantas — Programa de Arborización</div>

        <nav>
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="user-info">
          <div className="name">{user?.nombre || user?.nombres}</div>
          <div className="role">{rolLabel[user?.rol]}</div>
          {vivero && <div className="role">{vivero.nombre}</div>}
          <button className="logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
