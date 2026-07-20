import { useEffect, useState } from 'react'
import { regiones, viveros, especies, mockInternos } from '../../api/mockData.js'
import { getParametros, getDefaults, setParametros, resetParametros, tieneOverride } from '../../api/parametros.js'
import ReportesTab from './ReportesTab.jsx'

const tabs = ['Especies', 'Viveros', 'Usuarios', 'Parámetros', 'Reportes']

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

      {tab === 'Parámetros' && <ParametrosRegion />}

      {tab === 'Reportes' && <ReportesTab />}
    </div>
  )
}

const CAMPOS = [
  { key: 'plazoRetiroDias',    label: 'Plazo de retiro (días)' },
  { key: 'maxEspecies',        label: 'Máximo de especies por solicitud' },
  { key: 'maxUnidades',        label: 'Máximo de unidades por solicitud' },
  { key: 'maxSolicitudesAnio', label: 'Máximo de solicitudes por persona por año' },
]

function ParametrosRegion() {
  const [regionId, setRegionId] = useState(regiones[0]?.id ?? '')
  const [form, setForm] = useState({})
  const [defaults, setDefaults] = useState({})
  const [conOverride, setConOverride] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const cargar = (rid) => {
    setForm(getParametros(rid))
    setDefaults(getDefaults(rid))
    setConOverride(tieneOverride(rid))
    setGuardado(false)
  }

  useEffect(() => { if (regionId) cargar(regionId) }, [regionId])

  const cambiar = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setGuardado(false)
  }

  const guardar = () => {
    setParametros(regionId, form)
    cargar(regionId)
    setGuardado(true)
  }

  const restablecer = () => {
    resetParametros(regionId)
    cargar(regionId)
  }

  const regionNombre = regiones.find(r => r.id === Number(regionId))?.nombre

  return (
    <div className="card">
      <h3>Parámetros por región</h3>
      <p className="help">
        Cada región puede tener límites propios. El flujo de Nueva Solicitud respeta el valor de la
        región elegida. Los cambios se guardan localmente (mock) hasta que exista la base de datos compartida.
      </p>

      <div className="field" style={{ maxWidth: 420 }}>
        <label>Región</label>
        <select value={regionId} onChange={(e) => setRegionId(Number(e.target.value))}>
          {regiones.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
        </select>
      </div>

      <table style={{ marginTop: '1rem' }}>
        <thead>
          <tr><th>Parámetro</th><th style={{ width: 160 }}>Valor</th><th style={{ width: 120 }}>Por defecto</th></tr>
        </thead>
        <tbody>
          {CAMPOS.map(c => (
            <tr key={c.key}>
              <td>{c.label}</td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={form[c.key] ?? ''}
                  onChange={(e) => cambiar(c.key, e.target.value)}
                />
              </td>
              <td style={{ color: 'var(--color-text-muted)' }}>{defaults[c.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="field" style={{ marginTop: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            style={{ width: 'auto' }}
            checked={!!form.permiteFueraRegion}
            onChange={(e) => cambiar('permiteFueraRegion', e.target.checked)}
          />
          <span style={{ fontWeight: 500 }}>Permitir plantar fuera de esta región (o en otro país)</span>
        </label>
        <p className="help" style={{ marginLeft: '1.6rem', marginTop: '0.15rem' }}>
          Si está desactivado, el sistema bloqueará la solicitud cuando el punto marcado en el mapa
          de "Lugar de plantación" quede fuera de {regionNombre || 'la región seleccionada'}.
          Por defecto está permitido (comportamiento actual del programa).
        </p>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <button type="button" onClick={guardar}>Guardar parámetros de {regionNombre}</button>
        <button type="button" className="secondary" onClick={restablecer} disabled={!conOverride}>
          Restablecer a valores por defecto
        </button>
      </div>

      {guardado && <p className="help" style={{ color: 'var(--color-success, green)' }}>✓ Guardado para {regionNombre}.</p>}
      {conOverride && !guardado && <p className="help">Esta región tiene valores personalizados (distintos al default).</p>}

      <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--color-border, #ddd)' }} />
      <h4>Parámetros globales (no editables aquí)</h4>
      <table>
        <thead><tr><th>Parámetro</th><th>Valor</th></tr></thead>
        <tbody>
          <tr><td>SLA disponibilidad (días caída/año)</td><td>5</td></tr>
          <tr><td>Retención de datos personales (años)</td><td>5</td></tr>
        </tbody>
      </table>
    </div>
  )
}
