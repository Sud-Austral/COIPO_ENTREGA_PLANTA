import { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { api } from '../../api/client.js'
import { regiones, viveros, especies } from '../../api/mockData.js'

const labelEstado = {
  recibida: 'Recibida',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  lista_retirar: 'Lista para retirar',
  retirada: 'Retirada',
  vencida: 'Vencida',
  cancelada: 'Cancelada',
}

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [fRegion, setFRegion] = useState('')
  const [fVivero, setFVivero] = useState('')
  const [fEstado, setFEstado] = useState('')

  useEffect(() => {
    api.getSolicitudes().then(setItems).finally(() => setLoading(false))
  }, [])

  const filtradas = useMemo(() => items.filter(s =>
    (!fRegion || s.regionId === Number(fRegion)) &&
    (!fVivero || s.viveroId === Number(fVivero)) &&
    (!fEstado || s.estado === fEstado)
  ), [items, fRegion, fVivero, fEstado])

  // KPIs
  const total = filtradas.length
  const retiradas = filtradas.filter(s => s.estado === 'retirada').length
  const finalizadas = filtradas.filter(s => ['retirada', 'vencida', 'cancelada', 'rechazada'].includes(s.estado)).length
  const tasaRetiro = finalizadas > 0 ? Math.round((retiradas / finalizadas) * 100) : 0
  const tiempos = filtradas
    .filter(s => s.fechaRetiro)
    .map(s => Math.floor((new Date(s.fechaRetiro) - new Date(s.fechaCreacion)) / (1000 * 60 * 60 * 24)))
  const tiempoPromedio = tiempos.length > 0 ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length) : 0

  const exportarExcel = () => {
    const rows = filtradas.map(s => {
      const region = regiones.find(r => r.id === s.regionId)?.nombre || ''
      const vivero = viveros.find(v => v.id === s.viveroId)?.nombre || ''
      const especiesTxt = s.especies.map(e => {
        const esp = especies.find(x => x.id === e.especieId)
        return `${esp?.nombreComun} (${e.cantidad})`
      }).join('; ')
      const totalU = s.especies.reduce((a, e) => a + e.cantidad, 0)
      return {
        'ID': s.id,
        'Fecha solicitud': s.fechaCreacion,
        'RUT': s.solicitanteRut,
        'Solicitante': s.solicitanteNombre,
        'Correo': s.correo,
        'Teléfono': s.telefono,
        'Región': region,
        'Vivero': vivero,
        'Latitud': s.coordenadas?.lat ?? '',
        'Longitud': s.coordenadas?.lng ?? '',
        'Dirección': s.direccion,
        'Especies': especiesTxt,
        'Total unidades': totalU,
        'Estado': labelEstado[s.estado],
        'Fecha aceptación': s.fechaAceptacion || '',
        'Fecha lista para retirar': s.fechaListaRetirar || '',
        'Fecha retiro': s.fechaRetiro || '',
        'Fecha vencimiento': s.fechaVencimiento || '',
        'Comprobante': s.comprobante || '',
      }
    })

    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [
      { wch: 6 },  { wch: 13 }, { wch: 14 }, { wch: 32 }, { wch: 28 }, { wch: 16 },
      { wch: 28 }, { wch: 32 }, { wch: 11 }, { wch: 11 }, { wch: 32 }, { wch: 42 },
      { wch: 10 }, { wch: 18 }, { wch: 16 }, { wch: 22 }, { wch: 14 }, { wch: 16 },
      { wch: 14 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Entregas')
    XLSX.writeFile(wb, `entregas_programa_arborizacion_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard nacional</h1>
          <p>Consolidado de solicitudes y entregas del Programa de Arborización.</p>
        </div>
        <div className="actions">
          <button onClick={exportarExcel}>Exportar a Excel</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">Solicitudes totales</div>
          <div className="value">{total}</div>
        </div>
        <div className="kpi">
          <div className="label">Retiradas</div>
          <div className="value">{retiradas}</div>
        </div>
        <div className="kpi">
          <div className="label">Tasa de retiro</div>
          <div className="value">{tasaRetiro}%</div>
          <div className="delta">sobre solicitudes finalizadas</div>
        </div>
        <div className="kpi">
          <div className="label">Tiempo de proceso</div>
          <div className="value">{tiempoPromedio} días</div>
          <div className="delta">desde solicitud a retiro</div>
        </div>
      </div>

      <div className="filter-bar">
        <div>
          <label>Región</label>
          <select value={fRegion} onChange={(e) => setFRegion(e.target.value)}>
            <option value="">Todas</option>
            {regiones.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
          </select>
        </div>
        <div>
          <label>Vivero</label>
          <select value={fVivero} onChange={(e) => setFVivero(e.target.value)}>
            <option value="">Todos</option>
            {viveros
              .filter(v => !fRegion || v.regionId === Number(fRegion))
              .map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
          </select>
        </div>
        <div>
          <label>Estado</label>
          <select value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(labelEstado).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {loading ? <p>Cargando…</p> : (
        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Solicitante</th>
              <th>Vivero</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(s => {
              const vivero = viveros.find(v => v.id === s.viveroId)
              const total = s.especies.reduce((a, e) => a + e.cantidad, 0)
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.fechaCreacion}</td>
                  <td>{s.solicitanteNombre}</td>
                  <td>{vivero?.nombre}</td>
                  <td>{total}</td>
                  <td><span className={`badge ${s.estado}`}>{labelEstado[s.estado]}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
