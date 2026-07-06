// stockBridge — modelo único de stock compartido (fase MOCK).
//
// Contrato compartido con COIPO_INVENTARIO_PLANTA: el stock se modela por
// (viveroId, especieId) con { disponible, comprometido }. La semilla viene de
// tabla_insumo/stock.xlsx (vía catalogo.generated.json). En el mock se persiste
// en localStorage['coipo:stock'] para que el flujo reserva→entrega se vea
// funcionando dentro de cada app.
//
// IMPORTANTE: la sincronización en vivo entre las dos apps NO es objetivo de
// esta fase; llega con la base de datos compartida. Cuando exista, basta
// reemplazar la implementación de este módulo por llamadas a esa BD/API: la
// UI y el client.js no cambian.

import catalogo from '../data/catalogo.generated.json'

const KEY = 'coipo:stock'
const seedStock = catalogo.stock // [{ viveroId, especieId, cantidadDisponible }]

// Firma de la semilla: si cambia el catálogo, se re-siembra automáticamente.
const firmaSemilla = () =>
  `${seedStock.length}:${seedStock.reduce((a, s) => a + (s.cantidadDisponible || 0), 0)}`

const k = (viveroId, especieId) => `${viveroId}:${especieId}`

const tieneLS = () => {
  try { return typeof localStorage !== 'undefined' } catch { return false }
}

function construirSemilla() {
  const mapa = {}
  for (const s of seedStock) {
    mapa[k(s.viveroId, s.especieId)] = {
      disponible: s.cantidadDisponible || 0,
      comprometido: 0,
    }
  }
  return mapa
}

let _estado = null

function cargar() {
  if (_estado) return _estado
  if (tieneLS()) {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.firma === firmaSemilla() && parsed.mapa) {
          _estado = parsed.mapa
          return _estado
        }
      }
    } catch { /* corrupto → re-siembra */ }
  }
  _estado = construirSemilla()
  persistir()
  return _estado
}

function persistir() {
  if (!tieneLS()) return
  try {
    localStorage.setItem(KEY, JSON.stringify({ firma: firmaSemilla(), mapa: _estado }))
  } catch { /* cuota/privado → ignorar, queda en memoria */ }
}

function celda(viveroId, especieId) {
  const mapa = cargar()
  const key = k(viveroId, especieId)
  if (!mapa[key]) mapa[key] = { disponible: 0, comprometido: 0 }
  return mapa[key]
}

export const stockBridge = {
  // Stock disponible de una especie en un vivero.
  disponible(viveroId, especieId) {
    return celda(Number(viveroId), Number(especieId)).disponible
  },

  // Listado completo del vivero: [{ especieId, disponible, comprometido }]
  porVivero(viveroId) {
    const mapa = cargar()
    const vid = Number(viveroId)
    return Object.entries(mapa)
      .map(([key, val]) => {
        const [v, e] = key.split(':').map(Number)
        return { viveroId: v, especieId: e, ...val }
      })
      .filter(r => r.viveroId === vid)
  },

  // Valida que haya stock disponible para todos los ítems.
  validarDisponibilidad(viveroId, items) {
    for (const it of items) {
      const c = celda(Number(viveroId), Number(it.especieId))
      if (c.disponible < it.cantidad) {
        return { ok: false, especieId: it.especieId, disponible: c.disponible }
      }
    }
    return { ok: true }
  },

  // Reserva: disponible → comprometido (al crear la solicitud).
  reservar(viveroId, items) {
    const val = this.validarDisponibilidad(viveroId, items)
    if (!val.ok) throw new Error(`Stock insuficiente para la especie ${val.especieId}`)
    items.forEach(it => {
      const c = celda(Number(viveroId), Number(it.especieId))
      c.disponible -= it.cantidad
      c.comprometido += it.cantidad
    })
    persistir()
  },

  // Libera: comprometido → disponible (rechazo / cancelación / vencimiento).
  liberar(viveroId, items) {
    items.forEach(it => {
      const c = celda(Number(viveroId), Number(it.especieId))
      const n = Math.min(it.cantidad, c.comprometido)
      c.comprometido -= n
      c.disponible += n
    })
    persistir()
  },

  // Entrega: baja del comprometido sin volver a disponible (egreso definitivo).
  entregar(viveroId, items) {
    items.forEach(it => {
      const c = celda(Number(viveroId), Number(it.especieId))
      c.comprometido = Math.max(0, c.comprometido - it.cantidad)
    })
    persistir()
  },

  // Reinicia el stock a la semilla del catálogo (útil para demos).
  reset() {
    _estado = construirSemilla()
    persistir()
    return _estado
  },
}
