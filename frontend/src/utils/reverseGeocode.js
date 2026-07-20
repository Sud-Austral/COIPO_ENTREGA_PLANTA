// Reverse geocoding contra Nominatim (OpenStreetMap) — sin dependencia npm.
// Se evaluaron leaflet-geosearch (no expone reverse geocoding utilizable de
// fábrica, solo búsqueda por texto) y nominatim-client (usa un User-Agent
// custom que los navegadores bloquean por seguridad). El fetch directo es
// la opción más simple, liviana y mantenida (es la API HTTP misma).
//
// Estructura de `address` verificada empíricamente con coordenadas chilenas
// reales (zona urbana, rural y remota): en zonas urbanas Nominatim devuelve
// `city`; en zonas rurales chilenas devuelve `town` o `village` en su lugar.
// `county` mapea a provincia y `state` a región.
//
// Política de uso gratuito de Nominatim: máx. 1 solicitud/seg, no usar para
// autocompletar mientras se escribe, requiere identificar la app (se usa el
// parámetro `email`) y atribuir "© OpenStreetMap contributors".

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'
const CONTACT_EMAIL = 'geo-coipo@conaf.cl' // TODO: reemplazar por correo real de CONAF

const cache = new Map()
const cacheKey = (lat, lng) => `${lat.toFixed(5)},${lng.toFixed(5)}`

/**
 * Convierte {lat, lng} en {direccion, comuna, provincia, region, country}.
 * @param {{lat:number, lng:number}} coords
 * @param {{signal?: AbortSignal}} [opts]
 */
export async function reverseGeocode({ lat, lng }, opts = {}) {
  const key = cacheKey(lat, lng)
  if (cache.has(key)) return cache.get(key)

  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(lat),
    lon: String(lng),
    zoom: '18',
    addressdetails: '1',
    'accept-language': 'es',
    email: CONTACT_EMAIL,
  })

  const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, {
    signal: opts.signal,
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) throw new Error(`Nominatim respondió ${res.status}`)

  const data = await res.json()
  if (data.error) throw new Error(data.error) // ej. "Unable to geocode" en medio del mar

  const a = data.address || {}
  const comuna = a.city || a.town || a.village || a.municipality || a.suburb || null
  const provincia = a.county || null
  const region = a.state || null

  const result = {
    direccion: buildDireccion(a, data.display_name),
    comuna,
    provincia,
    region,
    country: a.country || null,
  }

  cache.set(key, result)
  return result
}

function buildDireccion(a, displayName) {
  const partes = [a.road, a.house_number].filter(Boolean)
  if (partes.length) return partes.join(' ')
  return displayName ? displayName.split(',')[0].trim() : ''
}
