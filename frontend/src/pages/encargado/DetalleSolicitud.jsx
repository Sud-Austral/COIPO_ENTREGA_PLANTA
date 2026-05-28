import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../../api/client.js'
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

function diasDesde(fecha) {
  const ms = Date.now() - new Date(fecha).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export default function DetalleSolicitud() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sol, setSol] = useState(null)
  const [loading, setLoading] = useState(true)

  const recargar = () => {
    setLoading(true)
    api.getSolicitud(id).then(s => { setSol(s); setLoading(false) })
  }
  useEffect(() => { recargar() }, [id])

  if (loading) return <p>Cargando…</p>
  if (!sol) return <p>Solicitud no encontrada.</p>

  const vivero = viveros.find(v => v.id === sol.viveroId)
  const total = sol.especies.reduce((a, e) => a + e.cantidad, 0)

  const aceptar = async () => {
    const fecha = new Date().toISOString().slice(0, 10)
    await api.actualizarEstadoSolicitud(sol.id, 'aceptada', { fechaAceptacion: fecha })
    recargar()
  }

  const rechazar = async () => {
    if (!confirm('¿Rechazar esta solicitud? Se devolverá el stock comprometido.')) return
    await api.actualizarEstadoSolicitud(sol.id, 'rechazada')
    recargar()
  }

  const marcarLista = async () => {
    const hoy = new Date()
    const venc = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    await api.actualizarEstadoSolicitud(sol.id, 'lista_retirar', {
      fechaListaRetirar: hoy.toISOString().slice(0, 10),
      fechaVencimiento: venc,
    })
    alert('Notificación enviada al solicitante por correo (simulado).')
    recargar()
  }

  const registrarRetiro = async () => {
    const correlativo = `CE-${new Date().getFullYear()}-${String(sol.id).padStart(4, '0')}`
    await api.actualizarEstadoSolicitud(sol.id, 'retirada', {
      fechaRetiro: new Date().toISOString().slice(0, 10),
      comprobante: correlativo,
    })
    alert(`Retiro registrado. Comprobante de entrega generado: ${correlativo}`)
    recargar()
  }

  const marcarVencida = async () => {
    if (!confirm('¿Marcar como vencida? El stock se devolverá al inventario.')) return
    await api.actualizarEstadoSolicitud(sol.id, 'vencida')
    recargar()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/encargado/bandeja">← Volver a la bandeja</Link>
          <h1>Solicitud #{sol.id}</h1>
          <p>Creada el {sol.fechaCreacion} ({diasDesde(sol.fechaCreacion)} días) — <span className={`badge ${sol.estado}`}>{labelEstado[sol.estado]}</span></p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Solicitante</h3>
          <p><strong>Nombre:</strong> {sol.solicitanteNombre}</p>
          <p><strong>Correo:</strong> <a href={`mailto:${sol.correo}`}>{sol.correo}</a></p>
          <p><strong>Teléfono:</strong> <a href={`tel:${sol.telefono}`}>{sol.telefono}</a></p>
          <p><strong>Dirección:</strong> {sol.direccion}</p>
          <p className="help">El RUT no se muestra al encargado por política de protección de datos.</p>
        </div>

        <div className="card">
          <h3>Plantación</h3>
          <p><strong>Coordenadas:</strong> {sol.coordenadas.lat}, {sol.coordenadas.lng}</p>
          <p>
            <a href={`https://www.google.com/maps?q=${sol.coordenadas.lat},${sol.coordenadas.lng}`}
               target="_blank" rel="noreferrer">
              Ver en mapa →
            </a>
          </p>
          <p><strong>Vivero asignado:</strong> {vivero?.nombre}</p>
        </div>
      </div>

      <div className="card">
        <h3>Especies y cantidades</h3>
        <table>
          <thead>
            <tr><th>Especie</th><th>Origen</th><th>Cantidad</th></tr>
          </thead>
          <tbody>
            {sol.especies.map(e => {
              const esp = especies.find(x => x.id === e.especieId)
              return (
                <tr key={e.especieId}>
                  <td><strong>{esp?.nombreComun}</strong> — <em>{esp?.nombreCientifico}</em></td>
                  <td>{esp?.origen}</td>
                  <td>{e.cantidad}</td>
                </tr>
              )
            })}
            <tr><td colSpan={2}><strong>Total</strong></td><td><strong>{total}</strong></td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Línea de tiempo</h3>
        <ul style={{ lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>Recibida: {sol.fechaCreacion}</li>
          {sol.fechaAceptacion   && <li>Aceptada: {sol.fechaAceptacion}</li>}
          {sol.fechaListaRetirar && <li>Lista para retirar: {sol.fechaListaRetirar}</li>}
          {sol.fechaVencimiento  && <li>Vence: {sol.fechaVencimiento}</li>}
          {sol.fechaRetiro       && <li>Retirada: {sol.fechaRetiro}</li>}
          {sol.comprobante       && <li>Comprobante: <strong>{sol.comprobante}</strong></li>}
        </ul>
      </div>

      <div className="card">
        <h3>Acciones</h3>
        <div className="actions">
          {sol.estado === 'recibida' && (
            <>
              <button onClick={aceptar}>Aceptar</button>
              <button className="danger" onClick={rechazar}>Rechazar</button>
            </>
          )}
          {sol.estado === 'aceptada' && (
            <button onClick={marcarLista}>Marcar como lista para retirar</button>
          )}
          {sol.estado === 'lista_retirar' && (
            <>
              <button onClick={registrarRetiro}>Registrar retiro efectivo</button>
              <button className="danger" onClick={marcarVencida}>Marcar como vencida</button>
            </>
          )}
          {sol.estado === 'retirada' && (
            <button className="secondary" onClick={() => alert(`Descarga del comprobante ${sol.comprobante} (simulado).`)}>
              Descargar comprobante PDF
            </button>
          )}
          <button className="secondary" onClick={() => navigate('/encargado/bandeja')}>
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
