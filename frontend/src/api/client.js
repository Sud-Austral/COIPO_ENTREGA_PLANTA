// API client. Hoy usa mock data en memoria. Cuando exista backend, reemplazar
// cada función por una llamada fetch al endpoint correspondiente de FastAPI.

import {
  regiones as mockRegiones,
  viveros as mockViveros,
  especies as mockEspecies,
  stock as mockStock,
  solicitudes as mockSolicitudes,
} from './mockData.js'

// Estado mutable en memoria (se pierde al recargar la página).
let _solicitudes = [...mockSolicitudes]
let _stock = mockStock.map(s => ({ ...s }))
let _nextId = 2000

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms))

export const api = {
  // Catálogos
  async getRegiones() {
    await delay()
    return mockRegiones
  },

  async getViveros({ regionId } = {}) {
    await delay()
    return regionId ? mockViveros.filter(v => v.regionId === regionId) : mockViveros
  },

  async getEspeciesDisponibles(viveroId) {
    await delay()
    const stockVivero = _stock.filter(s => s.viveroId === viveroId && s.cantidadDisponible > 0)
    return stockVivero.map(s => ({
      ...mockEspecies.find(e => e.id === s.especieId),
      cantidadDisponible: s.cantidadDisponible,
    }))
  },

  async getStockVivero(viveroId) {
    await delay()
    return _stock
      .filter(s => s.viveroId === viveroId)
      .map(s => ({
        especie: mockEspecies.find(e => e.id === s.especieId),
        cantidadDisponible: s.cantidadDisponible,
      }))
  },

  // Solicitudes
  async crearSolicitud(payload) {
    await delay()
    // Validar stock
    for (const item of payload.especies) {
      const stockItem = _stock.find(s => s.viveroId === payload.viveroId && s.especieId === item.especieId)
      if (!stockItem || stockItem.cantidadDisponible < item.cantidad) {
        throw new Error(`Stock insuficiente para la especie ${item.especieId}`)
      }
    }
    // Reservar stock
    payload.especies.forEach(item => {
      const stockItem = _stock.find(s => s.viveroId === payload.viveroId && s.especieId === item.especieId)
      stockItem.cantidadDisponible -= item.cantidad
    })
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
    if (filtros.viveroId)       r = r.filter(s => s.viveroId === filtros.viveroId)
    if (filtros.regionId)       r = r.filter(s => s.regionId === filtros.regionId)
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

    // Si se rechaza, cancela o vence sin retirar: devolver stock
    if (['rechazada', 'cancelada', 'vencida'].includes(nuevoEstado)) {
      sol.especies.forEach(item => {
        const stockItem = _stock.find(s => s.viveroId === sol.viveroId && s.especieId === item.especieId)
        if (stockItem) stockItem.cantidadDisponible += item.cantidad
      })
    }
    return sol
  },

  // Validación: ¿el solicitante ya pidió este año?
  async yaPidioEsteAnio(rut) {
    await delay()
    const anio = new Date().getFullYear()
    return _solicitudes.some(s =>
      s.solicitanteRut === rut &&
      new Date(s.fechaCreacion).getFullYear() === anio &&
      !['cancelada', 'rechazada'].includes(s.estado)
    )
  },
}
