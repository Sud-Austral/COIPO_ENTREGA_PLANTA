// parametros — parámetros del sistema POR REGIÓN, editables y persistidos (mock).
//
// Semilla: tabla_insumo/parametros_region.xlsx (vía catalogo.generated.json).
// Overrides del administrador: localStorage['coipo:parametros_region'].
// El flujo de Nueva Solicitud usa getParametros(regionId) para validar.

import { parametrosRegion } from './mockData.js'

const KEY = 'coipo:parametros_region'

// Defaults globales por si una región no estuviera en el catálogo.
const FALLBACK = {
  plazoRetiroDias: 30,
  maxEspecies: 3,
  maxUnidades: 100,
  maxSolicitudesAnio: 1,
}

const CAMPOS = ['plazoRetiroDias', 'maxEspecies', 'maxUnidades', 'maxSolicitudesAnio']

const tieneLS = () => {
  try { return typeof localStorage !== 'undefined' } catch { return false }
}

function leerOverrides() {
  if (!tieneLS()) return {}
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function guardarOverrides(obj) {
  if (!tieneLS()) return
  try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch { /* ignorar */ }
}

// Valores de semilla (catálogo) para una región.
export function getDefaults(regionId) {
  const fila = parametrosRegion.find(p => p.regionId === Number(regionId))
  if (!fila) return { ...FALLBACK }
  return {
    plazoRetiroDias: fila.plazoRetiroDias,
    maxEspecies: fila.maxEspecies,
    maxUnidades: fila.maxUnidades,
    maxSolicitudesAnio: fila.maxSolicitudesAnio,
  }
}

// Valores efectivos = semilla ∪ override del administrador.
export function getParametros(regionId) {
  const base = getDefaults(regionId)
  const ov = leerOverrides()[String(Number(regionId))] || {}
  const out = { ...base }
  for (const campo of CAMPOS) {
    if (ov[campo] != null && ov[campo] !== '') out[campo] = Number(ov[campo])
  }
  return out
}

// ¿La región tiene overrides respecto de la semilla?
export function tieneOverride(regionId) {
  const ov = leerOverrides()[String(Number(regionId))]
  return !!ov && Object.keys(ov).length > 0
}

// Persiste un patch de parámetros para una región (solo guarda lo que difiere).
export function setParametros(regionId, patch) {
  const overrides = leerOverrides()
  const def = getDefaults(regionId)
  const actual = overrides[String(Number(regionId))] || {}
  const nuevo = { ...actual }
  for (const campo of CAMPOS) {
    if (patch[campo] == null || patch[campo] === '') continue
    const val = Number(patch[campo])
    if (val === def[campo]) delete nuevo[campo]   // igual al default → no guardar
    else nuevo[campo] = val
  }
  if (Object.keys(nuevo).length === 0) delete overrides[String(Number(regionId))]
  else overrides[String(Number(regionId))] = nuevo
  guardarOverrides(overrides)
  return getParametros(regionId)
}

// Restablece una región a la semilla del catálogo.
export function resetParametros(regionId) {
  const overrides = leerOverrides()
  delete overrides[String(Number(regionId))]
  guardarOverrides(overrides)
  return getParametros(regionId)
}
