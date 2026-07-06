// API client. Hoy usa mock data en memoria + stock compartido (stockBridge) y
// parámetros por región (parametros). Cuando exista la base de datos compartida,
// reemplazar cada función por una llamada fetch al endpoint correspondiente:
// la UI no cambia.

import {
  regiones as mockRegiones,
  viveros as mockViveros,
  especies as mockEspecies,
  solicitudes as mockSolicitudes,
} from './mockData.js'
import { stockBridge } from './stockBridge.js'
import { getParametros } from './parametros.js'

// Estado mutable en memoria (se pierde al recargar la página).
let _solicitudes = [...mockSolicitudes]
let _nextId = 2000

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms))

// Comunas distintas (con vivero) de una región, ordenadas.
function comunasDeRegion(regionId) {
  const set = new Map()
  mockViveros
    .filter(v => v.regionId === Number(regionId))
    .forEach(v => set.set(v.comuna, true))
  return [...set.keys()].sort((a, b) => a.localeCompare(b, 'es'))
}

export const api = {
  // Catálogos
  async getRegiones() {
    await delay()
    return mockRegiones
  },

  async getViveros({ regionId } = {}) {
    await delay()
    return regionId ? mockViveros.filter(v => v.regionId === Number(regionId)) : mockViveros
  },

  // Flujo nuevo: región → comuna → vivero auto.
  async getComunas({ regionId } = {}) {
    await delay()
    if (!regionId) return []
    return comunasDeRegion(regionId)
  },

  // Viveros de una comuna (normalmente 1; puede haber >1).
  async getViveroPorComuna({ regionId, comuna } = {}) {
    await delay()
    if (!regionId || !comuna) return []
    return mockViveros.filter(v => v.regionId === Number(regionId) && v.comuna === comuna)
  },

  // Parámetros efectivos por región (semilla del catálogo ∪ override del admin).
  async getParametros(regionId) {
    await delay(80)
    return getParametros(regionId)
  },

  async getEspeciesDisponibles(viveroId) {
    await delay()
    return stockBridge.porVivero(viveroId)
      .filter(s => s.disponible > 0)
      .map(s => ({
        ...mockEspecies.find(e => e.id === s.especieId),
        cantidadDisponible: s.disponible,
      }))
  },

  async getStockVivero(viveroId) {
    await delay()
    return stockBridge.porVivero(viveroId).map(s => ({
      especie: mockEspecies.find(e => e.id === s.especieId),
      cantidadDisponible: s.disponible,
      comprometido: s.comprometido,
    }))
  },

  // Solicitudes
  async crearSolicitud(payload) {
    await delay()
    const params = getParametros(payload.regionId)

    // Validaciones por región (defensa del lado servidor del mock).
    if (payload.especies.length > params.maxEspecies) {
      throw new Error(`Máximo ${params.maxEspecies} especies por solicitud en esta región.`)
    }
    const totalUnidades = payload.especies.reduce((a, e) => a + (Number(e.cantidad) || 0), 0)
    if (totalUnidades > params.maxUnidades) {
      throw new Error(`Máximo ${params.maxUnidades} unidades por solicitud en esta región.`)
    }
    if (await this.yaPidioEsteAnio(payload.solicitanteRut, payload.regionId)) {
      throw new Error(`Alcanzaste el máximo de ${params.maxSolicitudesAnio} solicitud(es) al año en esta región.`)
    }

    // Reserva de stock (disponible → comprometido). Valida disponibilidad.
    stockBridge.reservar(payload.viveroId, payload.especies)

    const nueva = {
      id: _nextId++,
      ...payload,
      estado: 'recibida',
      fechaCreacion: new Date().toISOString().slice(0, 10),
    }
    _solicitudes.unshift(nueva)
    return nueva
  },

  async getSolicitudes(filtros = {}) {
    await delay()
    let r = [..._solicitudes]
    if (filtros.solicitanteRut) r = r.filter(s => s.solicitanteRut === filtros.solicitanteRut)
    if (filtros.viveroId)       r = r.filter(s => s.viveroId === Number(filtros.viveroId))
    if (filtros.regionId)       r = r.filter(s => s.regionId === Number(filtros.regionId))
    if (filtros.estado)         r = r.filter(s => s.estado === filtros.estado)
    return r
  },

  async getSolicitud(id) {
    await delay()
    return _solicitudes.find(s => s.id === Number(id))
  },

  async actualizarEstadoSolicitud(id, nuevoEstado, datosAdicionales = {}) {
    await delay()
    const sol = _solicitudes.find(s => s.id === Number(id))
    if (!sol) throw new Error('Solicitud no encontrada')
    sol.estado = nuevoEstado
    Object.assign(sol, datosAdicionales)

    // Rechazo / cancelación / vencimiento sin retirar: liberar lo comprometido.
    if (['rechazada', 'cancelada', 'vencida'].includes(nuevoEstado)) {
      stockBridge.liberar(sol.viveroId, sol.especies)
    }
    // Retiro: egreso definitivo (baja del comprometido, no vuelve a disponible).
    if (nuevoEstado === 'retirada') {
      stockBridge.entregar(sol.viveroId, sol.especies)
    }
    return sol
  },

  // Validación: ¿el solicitante alcanzó el máximo anual en esta región?
  // (Si no se pasa regionId, evalúa a nivel global con maxSolicitudesAnio=1.)
  async yaPidioEsteAnio(rut, regionId) {
    const anio = new Date().getFullYear()
    const activas = _solicitudes.filter(s =>
      s.solicitanteRut === rut &&
      new Date(s.fechaCreacion).getFullYear() === anio &&
      !['cancelada', 'rechazada'].includes(s.estado) &&
      (regionId == null || s.regionId === Number(regionId))
    )
    const max = regionId != null ? getParametros(regionId).maxSolicitudesAnio : 1
    return activas.length >= max
  },
}
