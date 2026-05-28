import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { viveros } from '../../api/mockData.js'

export default function Stock() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStockVivero(user.viveroId)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [user])

  const vivero = viveros.find(v => v.id === user.viveroId)

  const handleSubirExcel = () => {
    alert('Funcionalidad de carga de Excel — pendiente de implementación en V1.')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Stock disponible</h1>
          <p>{vivero?.nombre} — especies habilitadas para entrega en el Programa de Arborización.</p>
        </div>
        <div className="actions">
          <button onClick={handleSubirExcel}>Cargar Excel de stock</button>
        </div>
      </div>

      <div className="banner-info">
        El stock se descuenta automáticamente cuando un solicitante crea una solicitud aceptada, y se devuelve si la solicitud se rechaza, cancela o vence.
      </div>

      {loading ? <p>Cargando…</p> : items.length === 0 ? (
        <div className="card"><p>No hay stock cargado todavía.</p></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Especie</th>
              <th>Nombre científico</th>
              <th>Origen</th>
              <th>Disponibles</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.especie.id}>
                <td><strong>{it.especie.nombreComun}</strong></td>
                <td><em>{it.especie.nombreCientifico}</em></td>
                <td>{it.especie.origen}</td>
                <td>{it.cantidadDisponible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
