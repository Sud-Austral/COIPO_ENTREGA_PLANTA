// Conversión de coordenadas geográficas (WGS84, lat/lng) a UTM.
// Fórmula estándar de proyección Transversa de Mercator (Snyder/Karney),
// sin dependencia externa. Verificada contra puntos de referencia conocidos
// en Chile (Plaza de Armas Santiago: 19S 346100E 6299000N aprox.).

const WGS84_A = 6378137.0        // semieje mayor (m)
const WGS84_ECC_SQ = 0.00669438  // primera excentricidad al cuadrado
const K0 = 0.9996                 // factor de escala UTM

const toRad = (deg) => (deg * Math.PI) / 180

/**
 * Convierte {lat, lng} (WGS84, grados decimales) a coordenadas UTM.
 * @param {number} lat
 * @param {number} lng
 * @returns {{easting: number, northing: number, zoneNumber: number, hemisphere: 'N'|'S'}}
 */
export function latLngToUTM(lat, lng) {
  const zoneNumber = Math.floor((lng + 180) / 6) + 1
  const lonOrigin = (zoneNumber - 1) * 6 - 180 + 3
  const lonOriginRad = toRad(lonOrigin)
  const latRad = toRad(lat)
  const lonRad = toRad(lng)
  const eccPrimeSq = WGS84_ECC_SQ / (1 - WGS84_ECC_SQ)

  const N = WGS84_A / Math.sqrt(1 - WGS84_ECC_SQ * Math.sin(latRad) ** 2)
  const T = Math.tan(latRad) ** 2
  const C = eccPrimeSq * Math.cos(latRad) ** 2
  const A = Math.cos(latRad) * (lonRad - lonOriginRad)

  const M = WGS84_A * (
    (1 - WGS84_ECC_SQ / 4 - (3 * WGS84_ECC_SQ ** 2) / 64 - (5 * WGS84_ECC_SQ ** 3) / 256) * latRad
    - ((3 * WGS84_ECC_SQ) / 8 + (3 * WGS84_ECC_SQ ** 2) / 32 + (45 * WGS84_ECC_SQ ** 3) / 1024) * Math.sin(2 * latRad)
    + ((15 * WGS84_ECC_SQ ** 2) / 256 + (45 * WGS84_ECC_SQ ** 3) / 1024) * Math.sin(4 * latRad)
    - ((35 * WGS84_ECC_SQ ** 3) / 3072) * Math.sin(6 * latRad)
  )

  let easting = K0 * N * (A + ((1 - T + C) * A ** 3) / 6
    + ((5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSq) * A ** 5) / 120) + 500000.0

  let northing = K0 * (M + N * Math.tan(latRad) * (
    (A * A) / 2 + ((5 - T + 9 * C + 4 * C * C) * A ** 4) / 24
    + ((61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSq) * A ** 6) / 720
  ))

  if (lat < 0) northing += 10000000.0 // offset hemisferio sur

  return {
    easting: Math.round(easting * 100) / 100,
    northing: Math.round(northing * 100) / 100,
    zoneNumber,
    hemisphere: lat < 0 ? 'S' : 'N',
  }
}

/** Formatea el resultado de latLngToUTM como texto legible, ej: "19S 346564 E, 6299025 N". */
export function formatUTM({ easting, northing, zoneNumber, hemisphere }) {
  return `${zoneNumber}${hemisphere} ${Math.round(easting)} E, ${Math.round(northing)} N`
}
