import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import MapaPicker from '../../components/MapaPicker.jsx'

// Valores por defecto hasta que se elija región (se sobrescriben con los
// parámetros por región del administrador).
const PARAMS_FALLBACK = { maxEspecies: 3, maxUnidades: 100, plazoRetiroDias: 30, maxSolicitudesAnio: 1 }

export default function NuevaSolicitud() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [regiones, setRegiones] = useState([])
  const [comunas, setComunas] = useState([])
  const [viverosComuna, setViverosComuna] = useState([])
  const [especiesDisp, setEspeciesDisp] = useState([])

  const [regionId, setRegionId] = useState('')
  const [comuna, setComuna] = useState('')
  const [viveroId, setViveroId] = useState('')

  const [params, setParams] = useState(PARAMS_FALLBACK)
  const [seleccionadas, setSeleccionadas] = useState([])
  const [coordenadas, setCoordenadas] = useState(null)
  const [correo, setCorreo] = useState(user?.correo || '')
  const [telefono, setTelefono] = useState(user?.telefono || '')
  const [direccion, setDireccion] = useState(user?.direccion || '')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [yaPidio, setYaPidio] = useState(false)

  const maxEspecies = params?.maxEspecies ?? PARAMS_FALLBACK.maxEspecies
  const maxUnidades = params?.maxUnidades ?? PARAMS_FALLBACK.maxUnidades

  useEffect(() => { api.getRegiones().then(setRegiones) }, [])

  // Al cambiar región: cargar comunas + parámetros + chequear máximo anual.
  useEffect(() => {
    setComuna(''); setViveroId(''); setComunas([]); setViverosComuna([])
    setEspeciesDisp([]); setSeleccionadas([])
    if (!regionId) { setParams(PARAMS_FALLBACK); setYaPidio(false); return }
    api.getComunas({ regionId: Number(regionId) }).then(setComunas)
    api.getParametros(Number(regionId)).then(setParams)
    if (user?.rut) api.yaPidioEsteAnio(user.rut, Number(regionId)).then(setYaPidio)
  }, [regionId, user])

  // Al cambiar comuna: cargar vivero(s); si hay exactamente uno, auto-seleccionar.
  useEffect(() => {
    setViveroId(''); setEspeciesDisp([]); setSeleccionadas([])
    if (!regionId || !comuna) { setViverosComuna([]); return }
    api.getViveroPorComuna({ regionId: Number(regionId), comuna }).then(vs => {
      setViverosComuna(vs)
      if (vs.length === 1) setViveroId(String(vs[0].id))
    })
  }, [comuna, regionId])

  // Al fijar vivero: cargar especies disponibles.
  useEffect(() => {
    if (!viveroId) { setEspeciesDisp([]); return }
    api.getEspeciesDisponibles(Number(viveroId)).then(setEspeciesDisp)
    setSeleccionadas([])
  }, [viveroId])

  const viveroSel = viverosComuna.find(v => String(v.id) === String(viveroId))
  const totalUnidades = seleccionadas.reduce((acc, s) => acc + (Number(s.cantidad) || 0), 0)

  const toggleEspecie = (especieId) => {
    setSeleccionadas(prev => {
      const existe = prev.find(s => s.especieId === especieId)
      if (existe) return prev.filter(s => s.especieId !== especieId)
      if (prev.length >= maxEspecies) return prev
      return [...prev, { especieId, cantidad: 1 }]
    })
  }

  const cambiarCantidad = (especieId, cantidad) => {
    setSeleccionadas(prev =>
      prev.map(s => s.especieId === especieId ? { ...s, cantidad: Number(cantidad) || 0 } : s)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!regionId) return setError('Selecciona una región.')
    if (!comuna) return setError('Selecciona una comuna.')
    if (!viveroId) return setError('No hay un vivero asociado a esa comuna.')
    if (yaPidio) return setError(`Ya alcanzaste el máximo de solicitudes para esta región este año.`)
    if (seleccionadas.length === 0) return setError('Selecciona al menos una especie.')
    if (seleccionadas.length > maxEspecies) return setError(`Máximo ${maxEspecies} especies.`)
    if (totalUnidades > maxUnidades) return setError(`Máximo ${maxUnidades} unidades en total.`)
    if (totalUnidades < 1) return setError('Indica al menos 1 unidad.')
    if (!coordenadas?.lat || !coordenadas?.lng) return setError('Selecciona en el mapa el lugar de plantación.')
    if (!consent) return setError('Debes autorizar el tratamiento de tus datos para crear la solicitud.')

    setSubmitting(true)
    try {
      await api.crearSolicitud({
        solicitanteRut: user.rut,
        solicitanteNombre: `${user.nombres} ${user.apellidos}`,
        correo,
        telefono,
        direccion,
        coordenadas: { lat: coordenadas.lat, lng: coordenadas.lng },
        regionId: Number(regionId),
        viveroId: Number(viveroId),
        especies: seleccionadas,
      })
      navigate('/solicitante/mis-solicitudes')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Nueva solicitud</h1>
          <p>
            Programa de Arborización — máx. {maxEspecies} especies, máx. {maxUnidades} unidades en total
            {regionId ? ' (límites de la región seleccionada)' : ''}.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3>1. Elige dónde retirar</h3>
          <div className="grid-2">
            <div className="field">
              <label>Región</label>
              <select value={regionId} onChange={(e) => setRegionId(e.target.value)} required>
                <option value="">Selecciona una región…</option>
                {regiones.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Comuna</label>
              <select value={comuna} onChange={(e) => setComuna(e.target.value)} required disabled={!regionId}>
                <option value="">{regionId ? 'Selecciona una comuna…' : 'Primero selecciona una región'}</option>
                {comunas.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Vivero: auto-seleccionado desde la tabla región/comuna/vivero. */}
          {comuna && viverosComuna.length > 0 && (
            <div className="field" style={{ marginTop: '0.75rem' }}>
              <label>Vivero asignado</label>
              {viverosComuna.length === 1 ? (
                <input type="text" value={`${viveroSel?.nombre || ''} (${comuna})`} readOnly />
              ) : (
                <select value={viveroId} onChange={(e) => setViveroId(e.target.value)} required>
                  <option value="">Selecciona el vivero…</option>
                  {viverosComuna.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                </select>
              )}
              <p className="help" style={{ marginTop: '0.35rem' }}>
                {viverosComuna.length === 1
                  ? 'El vivero se asignó automáticamente según la comuna elegida.'
                  : 'Esta comuna tiene más de un vivero; elige uno.'}
              </p>
            </div>
          )}
          {comuna && viverosComuna.length === 0 && (
            <p className="help" style={{ marginTop: '0.5rem' }}>No hay viveros registrados para esta comuna.</p>
          )}
        </div>

        {yaPidio && (
          <div className="banner-warning">
            <strong>Ya tienes una solicitud activa este año en esta región.</strong> El máximo es {params.maxSolicitudesAnio} por región al año. Revisa el detalle en <a href="/solicitante/mis-solicitudes">Mis solicitudes</a>.
          </div>
        )}

        {viveroId && !yaPidio && (
          <div className="card">
            <h3>2. Elige especies disponibles</h3>
            {especiesDisp.length === 0
              ? <p className="help">Este vivero no tiene stock disponible para el Programa de Arborización.</p>
              : (
                <>
                  <p className="help">
                    Seleccionadas: {seleccionadas.length}/{maxEspecies} — Unidades totales: {totalUnidades}/{maxUnidades}
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Especie</th>
                        <th>Origen</th>
                        <th>Disponibles</th>
                        <th>Cantidad solicitada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {especiesDisp.map(esp => {
                        const sel = seleccionadas.find(s => s.especieId === esp.id)
                        const deshabilitado = !sel && seleccionadas.length >= maxEspecies
                        return (
                          <tr key={esp.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={!!sel}
                                disabled={deshabilitado}
                                onChange={() => toggleEspecie(esp.id)}
                                style={{ width: 'auto' }}
                              />
                            </td>
                            <td>
                              <strong>{esp.nombreComun}</strong><br/>
                              <em style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{esp.nombreCientifico}</em>
                            </td>
                            <td>{esp.origen}</td>
                            <td>{esp.cantidadDisponible}</td>
                            <td style={{ width: 140 }}>
                              {sel && (
                                <input
                                  type="number"
                                  min={1}
                                  max={Math.min(esp.cantidadDisponible, maxUnidades)}
                                  value={sel.cantidad}
                                  onChange={(e) => cambiarCantidad(esp.id, e.target.value)}
                                />
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </>
              )}
          </div>
        )}

        <div className="card">
          <h3>3. Lugar de plantación</h3>
          <p className="help" style={{ marginBottom: '0.75rem' }}>
            Marca en el mapa el punto exacto donde plantarás. CONAF podrá fiscalizar la plantación efectiva en esa ubicación.
          </p>
          <MapaPicker value={coordenadas} onChange={setCoordenadas} />
        </div>

        <div className="card">
          <h3>4. Datos de contacto</h3>
          <div className="field">
            <label>Correo</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Teléfono</label>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
            <div className="field">
              <label>Dirección particular</label>
              <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            </div>
          </div>
        </div>

        <div className="card consent-box">
          <strong>Consentimiento expreso — Ley 21.719</strong>
          <p style={{ marginTop: '0.5rem' }}>
            CONAF tratará tus datos personales (RUT y nombres provenientes de Clave Única, correo,
            teléfono, dirección y coordenadas) con la finalidad exclusiva de tramitar tu solicitud
            del Programa de Arborización, notificarte el estado del proceso, emitir el comprobante
            de entrega y eventualmente verificar la plantación en terreno. Tus datos se almacenarán
            encriptados, no serán cedidos a terceros y se conservarán por 5 años desde tu última
            interacción con el sistema, plazo tras el cual serán anonimizados.
          </p>
          <label>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>He leído y autorizo expresamente el tratamiento de mis datos personales para esta finalidad.</span>
          </label>
        </div>

        {error && <div className="card" style={{ borderColor: 'var(--color-danger)' }}><p className="error">{error}</p></div>}

        <div className="actions">
          <button type="submit" disabled={submitting || yaPidio}>
            {submitting ? 'Enviando…' : 'Enviar solicitud'}
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/solicitante/mis-solicitudes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
