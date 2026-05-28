import { useState } from 'react'
import { regiones, viveros, especies, mockInternos } from '../../api/mockData.js'

const tabs = ['Especies', 'Viveros', 'Usuarios', 'Parámetros']

export default function Admin() {
  const [tab, setTab] = useState('Especies')

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Administración</h1>
          <p>Configuración del sistema. Las acciones de alta/baja están en construcción.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {tabs.map(t => (
          <button
            key={t}
            className={tab === t ? '' : 'secondary'}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Especies' && (
        <div className="card">
          <h3>Catálogo de especies ({especies.length})</h3>
          <table>
            <thead><tr><th>Nombre común</th><th>Nombre científico</th><th>Origen</th></tr></thead>
            <tbody>
              {especies.map(e => (
                <tr key={e.id}>
                  <td>{e.nombreComun}</td>
                  <td><em>{e.nombreCientifico}</em></td>
                  <td>{e.origen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Viveros' && (
        <div className="card">
          <h3>Viveros y unidades administrativas ({viveros.length})</h3>
          <table>
            <thead><tr><th>Vivero</th><th>Región</th><th>Comuna</th><th>Encargado</th></tr></thead>
            <tbody>
              {viveros.map(v => {
                const region = regiones.find(r => r.id === v.regionId)
                return (
                  <tr key={v.id}>
                    <td>{v.nombre}</td>
                    <td>{region?.nombre}</td>
                    <td>{v.comuna}</td>
                    <td>{v.encargadoEmail}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Usuarios' && (
        <div className="card">
          <h3>Usuarios internos</h3>
          <table>
            <thead><tr><th>Correo</th><th>Nombre</th><th>Rol</th></tr></thead>
            <tbody>
              {mockInternos.map(u => (
                <tr key={u.email}>
                  <td>{u.email}</td>
                  <td>{u.nombre}</td>
                  <td>{u.rol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Parámetros' && (
        <div className="card">
          <h3>Parámetros del sistema</h3>
          <table>
            <thead><tr><th>Parámetro</th><th>Valor</th></tr></thead>
            <tbody>
              <tr><td>Plazo de retiro (días)</td><td>30</td></tr>
              <tr><td>Máximo de especies por solicitud</td><td>3</td></tr>
              <tr><td>Máximo de unidades por solicitud</td><td>100</td></tr>
              <tr><td>Máximo de solicitudes por persona por año</td><td>1</td></tr>
              <tr><td>SLA disponibilidad (días caída/año)</td><td>5</td></tr>
              <tr><td>Retención de datos personales (años)</td><td>5</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
