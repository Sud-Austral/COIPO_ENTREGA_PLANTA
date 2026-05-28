import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

export default function MapaPicker({ value, onChange, height = 360 }) {
  const initialCenter = value?.lat && value?.lng ? [value.lat, value.lng] : CHILE_CENTER
  const initialZoom = value?.lat && value?.lng ? 13 : 4

  return (
    <div>
      <div style={{ height, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <MapContainer center={initialCenter} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
        </MapContainer>
      </div>
      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p className="help" style={{ margin: 0 }}>
          {value?.lat && value?.lng
            ? <>Punto seleccionado: <strong>{value.lat.toFixed(5)}, {value.lng.toFixed(5)}</strong> — puedes arrastrar el marcador para ajustarlo.</>
            : <>Haz clic en el mapa para indicar el lugar exacto donde plantarás.</>
          }
        </p>
        {value?.lat && value?.lng && (
          <button type="button" className="secondary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.82rem' }}
                  onClick={() => onChange(null)}>
            Borrar punto
          </button>
        )}
      </div>
    </div>
  )
}
