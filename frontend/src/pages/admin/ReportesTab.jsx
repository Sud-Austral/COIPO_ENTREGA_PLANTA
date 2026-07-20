import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client.js'
import { regiones, especies } from '../../api/mockData.js'

const labelEstado = {
  recibida: 'Recibida',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
  lista_retirar: 'Lista para retirar',
  retirada: 'Retirada',
  vencida: 'Vencida',
  cancelada: 'Cancelada',
}

// Mismos colores que .badge.<estado> en index.css, para consistencia visual.
const colorEstado = {
  recibida: { bg: '#e0e7ff', fg: '#3730a3' },
  aceptada: { bg: '#fef3c7', fg: '#92400e' },
  lista_retirar: { bg: '#d1fae5', fg: '#065f46' },
  retirada: { bg: '#d8f3dc', fg: '#1b4332' },
  vencida: { bg: '#fee2e2', fg: '#991b1b' },
  cancelada: { bg: '#f3f4f6', fg: '#4b5563' },
  rechazada: { bg: '#fee2e2', fg: '#991b1b' },
}

const mesesCorto = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export default function ReportesTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSolicitudes().then(setItems).finally(() => setLoading(false))
  }, [])

  // --- KPIs ---
  const total = items.length
  const retiradas = items.filter(s => s.estado === 'retirada').length
  const finalizadas = items.filter(s => ['retirada', 'vencida', 'cancelada', 'rechazada'].includes(s.estado)).length
  const tasaRetiro = finalizadas > 0 ? Math.round((retiradas / finalizadas) * 100) : 0
  const totalUnidades = items.reduce((acc, s) => acc + s.especies.reduce((a, e) => a + e.cantidad, 0), 0)
  const regionesConDatos = new Set(items.map(s => s.regionId)).size

  // --- Por región ---
  const porRegion = useMemo(() => {
    const mapa = new Map()
    items.forEach(s => {
      mapa.set(s.regionId, (mapa.get(s.regionId) || 0) + 1)
    })
    return [...mapa.entries()]
      .map(([regionId, cantidad]) => ({
        regionId,
        nombre: regiones.find(r => r.id === regionId)?.nombre || `Región ${regionId}`,
        cantidad,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
  }, [items])

  // --- Por estado ---
  const porEstado = useMemo(() => {
    const mapa = new Map()
    items.forEach(s => {
      mapa.set(s.estado, (mapa.get(s.estado) || 0) + 1)
    })
    return Object.keys(labelEstado)
      .map(estado => ({ estado, cantidad: mapa.get(estado) || 0 }))
      .filter(e => e.cantidad > 0)
  }, [items])

  // --- Top 5 especies por unidades ---
  const topEspecies = useMemo(() => {
    const mapa = new Map()
    items.forEach(s => {
      s.especies.forEach(e => {
        mapa.set(e.especieId, (mapa.get(e.especieId) || 0) + e.cantidad)
      })
    })
    return [...mapa.entries()]
      .map(([especieId, cantidad]) => ({
        especieId,
        nombre: especies.find(e => e.id === especieId)?.nombreComun || `Especie ${especieId}`,
        cantidad,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
  }, [items])

  // --- Por mes (bono) ---
  const porMes = useMemo(() => {
    const mapa = new Map()
    items.forEach(s => {
      if (!s.fechaCreacion) return
      const d = new Date(s.fechaCreacion)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      mapa.set(key, (mapa.get(key) || 0) + 1)
    })
    return [...mapa.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, cantidad]) => {
        const [anio, mes] = key.split('-')
        return { key, etiqueta: `${mesesCorto[Number(mes) - 1]} ${anio.slice(2)}`, cantidad }
      })
  }, [items])

  if (loading) return <p>Cargando reportes…</p>

  const maxRegion = Math.max(1, ...porRegion.map(r => r.cantidad))
  const maxEstado = Math.max(1, ...porEstado.map(e => e.cantidad))
  const maxEspecie = Math.max(1, ...topEspecies.map(e => e.cantidad))
  const maxMes = Math.max(1, ...porMes.map(m => m.cantidad))

  return (
    <div>
      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">Solicitudes históricas</div>
          <div className="value">{total}</div>
        </div>
        <div className="kpi">
          <div className="label">Tasa de retiro</div>
          <div className="value">{tasaRetiro}%</div>
          <div className="delta">{retiradas} retiradas / {finalizadas} finalizadas</div>
        </div>
        <div className="kpi">
          <div className="label">Unidades solicitadas</div>
          <div className="value">{totalUnidades}</div>
          <div className="delta">plantas en todas las solicitudes</div>
        </div>
        <div className="kpi">
          <div className="label">Regiones con solicitudes</div>
          <div className="value">{regionesConDatos}</div>
          <div className="delta">de {regiones.length} regiones totales</div>
        </div>
      </div>

      <div className="grid-2">
        <BarChartCard
          title="Solicitudes por región"
          subtitle="Ordenadas de mayor a menor"
          data={porRegion.map(r => ({
            key: r.regionId,
            label: r.nombre,
            value: r.cantidad,
            color: 'var(--color-primary)',
          }))}
          max={maxRegion}
        />

        <EstadoChartCard data={porEstado} max={maxEstado} total={total} />
      </div>

      <div className="grid-2">
        <BarChartCard
          title="Top 5 especies más solicitadas"
          subtitle="Por unidades totales solicitadas"
          data={topEspecies.map(e => ({
            key: e.especieId,
            label: e.nombre,
            value: e.cantidad,
            color: 'var(--color-accent)',
            colorFg: 'var(--color-primary-dark)',
          }))}
          max={maxEspecie}
        />

        <BarChartCard
          title="Solicitudes creadas por mes"
          subtitle="Volumen mensual histórico"
          data={porMes.map(m => ({
            key: m.key,
            label: m.etiqueta,
            value: m.cantidad,
            color: 'var(--color-primary)',
          }))}
          max={maxMes}
          empty="Sin datos de fecha suficientes para agrupar por mes."
        />
      </div>
    </div>
  )
}

// Gráfico de barras horizontales genérico, accesible: cada barra tiene
// etiqueta de texto visible y title/aria-label con el valor exacto.
function BarChartCard({ title, subtitle, data, max, empty }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {subtitle && <p className="help" style={{ marginTop: '-0.4rem', marginBottom: '1rem' }}>{subtitle}</p>}
      {data.length === 0 ? (
        <p className="help">{empty || 'Sin datos disponibles.'}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {data.map(d => (
            <div key={d.key} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 44px', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={d.label}
              >
                {d.label}
              </span>
              <div
                role="img"
                aria-label={`${d.label}: ${d.value}`}
                title={`${d.label}: ${d.value}`}
                style={{
                  background: 'var(--color-primary-light)',
                  borderRadius: 5,
                  height: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.max(2, (d.value / max) * 100)}%`,
                    height: '100%',
                    background: d.color || 'var(--color-primary)',
                    borderRadius: 5,
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-dark)', textAlign: 'right' }}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Distribución por estado: barras apiladas horizontales (tipo dona lineal)
// + desglose con leyenda, usando los mismos colores que .badge.<estado>.
function EstadoChartCard({ data, max, total }) {
  return (
    <div className="card">
      <h3>Distribución de solicitudes por estado</h3>
      <p className="help" style={{ marginTop: '-0.4rem', marginBottom: '1rem' }}>
        Colores consistentes con las etiquetas de estado del sistema
      </p>

      {data.length === 0 ? (
        <p className="help">Sin datos disponibles.</p>
      ) : (
        <>
          {/* Barra apilada única (resumen visual tipo dona lineal) */}
          <div
            role="img"
            aria-label={data.map(d => `${labelEstado[d.estado]}: ${d.cantidad} (${Math.round((d.cantidad / total) * 100)}%)`).join(', ')}
            style={{
              display: 'flex',
              width: '100%',
              height: 22,
              borderRadius: 6,
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              marginBottom: '1rem',
            }}
          >
            {data.map(d => (
              <div
                key={d.estado}
                title={`${labelEstado[d.estado]}: ${d.cantidad} (${Math.round((d.cantidad / total) * 100)}%)`}
                style={{
                  width: `${(d.cantidad / total) * 100}%`,
                  background: colorEstado[d.estado]?.bg,
                  borderRight: '2px solid white',
                }}
              />
            ))}
          </div>

          {/* Desglose por estado con barra + valor, para lectura sin depender del color */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {data.map(d => (
              <div key={d.estado} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 80px', alignItems: 'center', gap: '0.6rem' }}>
                <span className={`badge ${d.estado}`} style={{ justifySelf: 'start' }}>{labelEstado[d.estado]}</span>
                <div
                  role="img"
                  aria-label={`${labelEstado[d.estado]}: ${d.cantidad}`}
                  title={`${labelEstado[d.estado]}: ${d.cantidad}`}
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 5,
                    height: 18,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(2, (d.cantidad / max) * 100)}%`,
                      height: '100%',
                      background: colorEstado[d.estado]?.bg,
                      borderRight: `2px solid ${colorEstado[d.estado]?.fg}`,
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.85rem', textAlign: 'right', color: 'var(--color-text-muted)' }}>
                  {d.cantidad} · {Math.round((d.cantidad / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
