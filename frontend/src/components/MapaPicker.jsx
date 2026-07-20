import { useEffect, useState } from 'react'
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

function TileLayerSwitcher({ tileLayer, onChange }) {
  return (
    <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '4px', display: 'flex', gap: '0.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 1000, position: 'absolute', top: '10px', left: '50px' }}>
      {Object.entries(TILE_LAYERS).map(([key, layer]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            border: tileLayer === key ? '2px solid var(--color-primary)' : '1px solid #ccc',
            backgroundColor: tileLayer === key ? 'var(--color-bg-alt)' : 'white',
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

function MapContent({ tileLayer, value, onChange }) {
  const map = useMap()
  useEffect(() => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer)
        }
      })
      const layer = TILE_LAYERS[tileLayer]
      L.tileLayer(layer.url, { attribution: layer.attribution }).addTo(map)
    }
  }, [tileLayer, map])

  return (
    <>
      <TileLayerSwitcher tileLayer={tileLayer} onChange={(newLayer) => {
        // Pasamos el valor actualizado al padre
      }} />
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
    </>
  )
}

export default function MapaPicker({ value, onChange, height = 360 }) {
  const initialCenter = value?.lat && value?.lng ? [value.lat, value.lng] : CHILE_CENTER
  const initialZoom = value?.lat && value?.lng ? 13 : 4
  const [tileLayer, setTileLayer] = useState('osm')

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

function TileLayerControl({ tileLayer, setTileLayer }) {
  return (
    <div style={{ position: 'absolute', top: '10px', left: '50px', zIndex: 1000 }}>
      <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'white', padding: '0.5rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {Object.entries(TILE_LAYERS).map(([key, layer]) => (
          <button
            key={key}
            onClick={() => setTileLayer(key)}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: tileLayer === key ? 'bold' : 'normal',
              border: tileLayer === key ? '2px solid var(--color-primary)' : '1px solid #999',
              backgroundColor: tileLayer === key ? 'var(--color-bg-alt)' : 'white',
              cursor: 'pointer',
              borderRadius: '3px',
              transition: 'all 0.2s',
            }}
          >
            {layer.name}
          </button>
        ))}
      </div>
    </div>
  )
}
