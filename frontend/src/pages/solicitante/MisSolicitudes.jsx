import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { viveros, especies } from '../../api/mockData.js'

const labelEstado = {
  recibida: 'Recibida',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  lista_retirar: 'Lista para retirar',
  retirada: 'Retirada',
  vencida: 'Vencida',
  cancelada: 'Cancelada',
}

export default function MisSolicitudes() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const recargar = () => {
    setLoading(true)
    api.getSolicitudes({ solicitanteRut: user.rut })
      .then(setItems)
      .finally(() => setLoading(false))
  }
  useEffect(() => { recargar() }, [user])

  const cancelar = async (id) => {
    if (!confirm('¿Confirmas la cancelación de esta solicitud?')) return
    await api.actualizarEstadoSolicitud(id, 'cancelada')
    recargar()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mis solicitudes</h1>
          <p>Historial de solicitudes que has realizado al Programa de Arborización.</p>
        </div>
      </div>

      {loading ? <p>Cargando…</p> : items.length === 0 ? (
        <div className="card">
          <p>Aún no has realizado ninguna solicitud.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Vivero</th>
              <th>Especies</th>
              <th>Estado</th>
              <th>Vence</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(s => {
              const vivero = viveros.find(v => v.id === s.viveroId)
              const totalUnidades = s.especies.reduce((a, e) => a + e.cantidad, 0)
              const cancelable = ['recibida', 'aceptada', 'lista_retirar'].includes(s.estado)
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.fechaCreacion}</td>
                  <td>{vivero?.nombre}</td>
                  <td>
                    {s.especies.map(e => {
                      const esp = especies.find(x => x.id === e.especieId)
                      return <div key={e.especieId}>{esp?.nombreComun}: {e.cantidad}</div>
                    })}
                    <strong style={{ fontSize: '0.82rem' }}>Total: {totalUnidades}</strong>
                  </td>
                  <td><span className={`badge ${s.estado}`}>{labelEstado[s.estado]}</span></td>
                  <td>{s.fechaVencimiento || '—'}</td>
                  <td>
                    {cancelable && (
                      <button className="danger" onClick={() => cancelar(s.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}>
                        Cancelar
                      </button>
                    )}
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
