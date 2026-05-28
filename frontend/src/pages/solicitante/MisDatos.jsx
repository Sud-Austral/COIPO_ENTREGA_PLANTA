import { useAuth } from '../../context/AuthContext.jsx'

export default function MisDatos() {
  const { user } = useAuth()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mis datos</h1>
          <p>Datos personales tratados por el sistema. Ley 21.719 — derechos del titular.</p>
        </div>
      </div>

      <div className="card">
        <h3>Datos provenientes de Clave Única</h3>
        <p><strong>RUT:</strong> {user.rut}</p>
        <p><strong>Nombres:</strong> {user.nombres}</p>
        <p><strong>Apellidos:</strong> {user.apellidos}</p>
        <p className="help">Estos datos no son editables aquí; provienen directamente de Clave Única.</p>
      </div>

      <div className="card">
        <h3>Datos de contacto (editables)</h3>
        <p><strong>Correo:</strong> {user.correo}</p>
        <p><strong>Teléfono:</strong> {user.telefono}</p>
        <p><strong>Dirección:</strong> {user.direccion}</p>
        <button className="secondary" disabled>Editar (próximamente)</button>
      </div>

      <div className="card" style={{ borderColor: 'var(--color-warning)' }}>
        <h3>Derechos del titular</h3>
        <p>De acuerdo a la Ley 21.719, puedes ejercer los siguientes derechos sobre tus datos:</p>
        <div className="actions" style={{ marginTop: '0.75rem' }}>
          <button className="secondary" disabled>Descargar mis datos (JSON)</button>
          <button className="secondary" disabled>Retirar consentimiento</button>
          <button className="danger" disabled>Solicitar eliminación</button>
        </div>
        <p className="help" style={{ marginTop: '0.75rem' }}>
          Funcionalidad en construcción. Mientras tanto puedes escribir a [correo CONAF DPO por definir].
        </p>
      </div>
    </div>
  )
}
