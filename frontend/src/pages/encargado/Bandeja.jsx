import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { especies } from '../../api/mockData.js'

const labelEstado = {
  recibida: 'Recibida',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  lista_retirar: 'Lista para retirar',
  retirada: 'Retirada',
  vencida: 'Vencida',
  cancelada: 'Cancelada',
}

export default function Bandeja() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [filtro, setFiltro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSolicitudes({ viveroId: user.viveroId })
      .then(setItems)
      .finally(() => setLoading(false))
  }, [user])

  const filtradas = filtro ? items.filter(i => i.estado === filtro) : items
  // Orden de llegada
  const ordenadas = [...filtradas].sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Bandeja de solicitudes</h1>
          <p>Solicitudes asignadas a tu vivero, ordenadas por fecha de llegada.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div>
          <label>Estado</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Todos</option>
            <option value="recibida">Recibida</option>
            <option value="aceptada">Aceptada</option>
            <option value="lista_retirar">Lista para retirar</option>
            <option value="retirada">Retirada</option>
            <option value="vencida">Vencida</option>
            <option value="cancelada">Cancelada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>
      </div>

      {loading ? <p>Cargando…</p> : ordenadas.length === 0 ? (
        <div className="card"><p>No hay solicitudes con ese filtro.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Solicitante</th>
              <th>Especies</th>
              <th>Estado</th>
              <th>Vence</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ordenadas.map(s => {
              const total = s.especies.reduce((a, e) => a + e.cantidad, 0)
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.fechaCreacion}</td>
                  <td>{s.solicitanteNombre}<br/><em style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.correo}</em></td>
                  <td>
                    {s.especies.map(e => {
                      const esp = especies.find(x => x.id === e.especieId)
                      return <div key={e.especieId} style={{ fontSize: '0.85rem' }}>{esp?.nombreComun}: {e.cantidad}</div>
                    })}
                    <strong style={{ fontSize: '0.82rem' }}>Total: {total}</strong>
                  </td>
                  <td><span className={`badge ${s.estado}`}>{labelEstado[s.estado]}</span></td>
                  <td>{s.fechaVencimiento || '—'}</td>
                  <td>
                    <Link to={`/encargado/solicitud/${s.id}`}>Ver detalle</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
