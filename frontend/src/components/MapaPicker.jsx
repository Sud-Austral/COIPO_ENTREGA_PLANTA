import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { latLngToUTM, formatUTM } from '../utils/utmConvert.js'
import { reverseGeocode } from '../utils/reverseGeocode.js'

// Fix del ícono por defecto de Leaflet en bundlers (Vite).
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

const CHILE_CENTER = [-35.6751, -71.5430]

const TILE_LAYERS = {
  osm: {
    name: 'Mapa base',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    name: 'Satélite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
  },
  topo: {
    name: 'Topográfico',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
}

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function Recentrar({ value }) {
  const map = useMap()
  useEffect(() => {
    if (value?.lat && value?.lng) {
      map.flyTo([value.lat, value.lng], Math.max(map.getZoom(), 13), { duration: 0.6 })
    }
  }, [value, map])
  return null
}

function TileLayerControl({ tileLayer, setTileLayer }) {
  return (
    <div style={{ position: 'absolute', top: '10px', left: '50px', zIndex: 1000, display: 'flex', gap: '0.25rem', backgroundColor: 'white', padding: '0.5rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {Object.entries(TILE_LAYERS).map(([key, layer]) => (
        <button
          key={key}
          type="button"
          onClick={() => setTileLayer(key)}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: tileLayer === key ? 'bold' : 'normal',
            border: tileLayer === key ? '2px solid var(--color-primary)' : '1px solid #999',
            backgroundColor: tileLayer === key ? 'var(--color-primary-light)' : 'white',
            color: tileLayer === key ? 'var(--color-primary-dark)' : 'var(--color-text)',
            cursor: 'pointer',
            borderRadius: '3px',
          }}
        >
          {layer.name}
        </button>
      ))}
    </div>
  )
}

// Nominatim exige no consultarse en cada evento (máx. 1 req/seg) y no usarse
// como autocompletado en vivo; por eso el reverse geocoding se dispara con
// debounce tras el último clic/arrastre, con cancelación del request anterior.
const GEOCODE_DEBOUNCE_MS = 700

export default function MapaPicker({ value, onChange, height = 360, onGeoResuelto }) {
  const initialCenter = value?.lat && value?.lng ? [value.lat, value.lng] : CHILE_CENTER
  const initialZoom = value?.lat && value?.lng ? 13 : 4
  const [tileLayer, setTileLayer] = useState('osm')
  const [geo, setGeo] = useState(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState(null)
  const debounceRef = useRef(null)
  const abortRef = useRef(null)

  const lat = value?.lat
  const lng = value?.lng

  useEffect(() => {
    clearTimeout(debounceRef.current)
    abortRef.current?.abort()

    if (!lat || !lng) {
      setGeo(null)
      setGeoError(null)
      setGeoLoading(false)
      onGeoResuelto?.(null)
      return
    }

    setGeoLoading(true)
    setGeoError(null)
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const result = await reverseGeocode({ lat, lng }, { signal: controller.signal })
        setGeo(result)
        onGeoResuelto?.(result)
      } catch (err) {
        if (err.name !== 'AbortError') setGeoError('No se pudo obtener la dirección automáticamente. Verifica igualmente el punto en el mapa.')
      } finally {
        setGeoLoading(false)
      }
    }, GEOCODE_DEBOUNCE_MS)

    return () => clearTimeout(debounceRef.current)
  }, [lat, lng])

  const utm = lat && lng ? latLngToUTM(lat, lng) : null

  return (
    <div>
      <div style={{ height, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}>
        <MapContainer center={initialCenter} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            key={`layer-${tileLayer}`}
            url={TILE_LAYERS[tileLayer].url}
            attribution={TILE_LAYERS[tileLayer].attribution}
          />
          <ClickHandler onPick={onChange} />
          <Recentrar value={value} />
          {value?.lat && value?.lng && (
            <Marker
              position={[value.lat, value.lng]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng()
                  onChange({ lat, lng })
                },
              }}
            />
          )}
          <TileLayerControl tileLayer={tileLayer} setTileLayer={setTileLayer} />
        </MapContainer>
      </div>

      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p className="help" style={{ margin: 0 }}>
          {lat && lng
            ? <>Punto seleccionado: <strong>{lat.toFixed(5)}, {lng.toFixed(5)}</strong> — puedes arrastrar el marcador para ajustarlo.</>
            : <>Haz clic en el mapa para indicar el lugar exacto donde plantarás.</>
          }
        </p>
        {lat && lng && (
          <button type="button" className="secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.82rem' }}
                  onClick={() => onChange(null)}>
            Borrar punto
          </button>
        )}
      </div>

      {utm && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', borderRadius: 6, fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>Coordenadas GPS (WGS84)</div>
              <div>{lat.toFixed(6)}, {lng.toFixed(6)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>Coordenadas UTM</div>
              <div>{formatUTM(utm)}</div>
            </div>
          </div>

          <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600, marginBottom: '0.2rem' }}>
              Ubicación aproximada (validación)
            </div>
            {geoLoading && <span style={{ color: 'var(--color-text-muted)' }}>Buscando dirección…</span>}
            {!geoLoading && geoError && <span style={{ color: 'var(--color-danger)' }}>{geoError}</span>}
            {!geoLoading && !geoError && geo && (
              <span>
                {geo.direccion && <>{geo.direccion} — </>}
                <strong>{geo.comuna || 'Comuna no identificada'}</strong>
                {geo.provincia && <>, {geo.provincia}</>}
                {geo.region && <>, {geo.region}</>}
              </span>
            )}
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              Dirección referencial obtenida de © OpenStreetMap contributors; confirma que corresponde al lugar de plantación.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
