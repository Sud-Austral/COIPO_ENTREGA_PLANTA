# COIPO — Sistema de Entrega de Plantas
**Proyecto:** Gestión de entregas del Programa de Arborización CONAF  
**Stack:** React (frontend) + FastAPI (backend) + PostgreSQL  
**Estado:** MVP funcional en frontend; mejoras de UX/funcionalidad solicitadas  
**Última actualización:** 2026-07-20  

---

## Resumen del proyecto

Sistema web centralizado para gestionar solicitudes de plantas del Programa de Arborización CONAF. Reemplaza Google Forms + Excel descentralizados. Atiende ~1.800 solicitudes anuales en 18 regiones administrativas y ~38 viveros.

**Versión actual:** Frontend MVP + mock data. Backend aún no integrado.

---

## Arquitectura y estructura

### Frontend (`/frontend/src`)
- **React** (Vite) con routing (react-router)
- **Contexto Auth** con mock de Clave Única y usuarios internos
- **Componentes:** MapaPicker (Leaflet), Layout, ProtectedRoute
- **Páginas por rol:**
  - `pages/solicitante/`: NuevaSolicitud, MisSolicitudes, MisDatos
  - `pages/encargado/`: Bandeja, DetalleSolicitud, Stock
  - `pages/consolidador/`: Dashboard
  - `pages/admin/`: Admin

### Mock Data (`/frontend/src/api/mockData.js`)
- Catálogos de regiones, viveros, especies, stock
- Mock user: Clave Única (María Soledad González)
- Mock usuarios internos: 4 encargados + consolidador + admin
- 5 solicitudes ejemplo

### Base de datos simulada
- `catalogo.generated.json`: regiones, viveros, especies, parámetros por región
- `mockData.js`: usuarios y solicitudes de demostración

---

## Estado actual

### ✅ Implementado
1. **Login dual:** Clave Única vs. Usuarios/contraseña (mock)
2. **Flujo básico de solicitud:** región → comuna → vivero → especies → mapa → confirmación
3. **Validaciones básicas:** máx especies, máx unidades, obligatoriedad de datos
4. **MapaPicker:** click en mapa + drag marker, coordenadas lat/lng (no UTM)
5. **Roles y rutas protegidas:** solicitante, encargado, consolidador, admin
6. **Consentimiento de datos:** checkbox en formulario
7. **Bandeja de encargado:** listado mock de solicitudes
8. **Stock mock:** descarga manual por vivero
9. **Dashboard mock:** consolidador con vista simulada

### ⚠️ Parcialmente implementado
- **Dirección:** se captura, pero no se valida ni se vincula con coordenadas
- **Teléfono/correo:** se capturan, pero sin validación
- **Notificaciones:** mock; no hay integración real de email
- **Mapa:** solo OSM estándar; sin opciones de vista alternativa

### ❌ No implementado / Requiere backend
- Clave Única real (OIDC con SEGPRES)
- Base de datos real (PostgreSQL)
- API endpoints (FastAPI)
- Envío de email real
- Guía de despacho
- Generación de PDF
- Logs de auditoría
- Validación de RUT
- Conversión de coordenadas a UTM

---

## Mejoras solicitadas — Plan de implementación

### 1. **Dos tipos de usuarios: Clave Única vs. Otros (Registro)**
**Estado:** ✅ **Parcialmente implementado**  
**Descripción:** El login ya distingue entre Clave Única (solicitantes) y usuarios/contraseña (internos).

**Qué falta:**
- Backend: registro de nuevos usuarios (registro self-service para Otros)
- Frontend: formulario de registro con validación
- Backend: gestión de perfiles (cambio contraseña, datos personales)

**Acción recomendada:** El frontend está listo. Esperar integración de backend para registro real.

---

### 2. **Datos validados con Clave Única**
**Estado:** 🔶 **Mock completo; requiere integración backend**

Campos que Clave Única debería validar:
- ✅ Nombre (nombres + apellidos separados) — **ya en mockData**
- ✅ RUT (sin digito verificador)
- ✅ Teléfono
- ✅ Correo electrónico
- ✅ Dirección

Campos adicionales que CONAF necesita (NO vienen de Clave Única):
- ❌ Rango de edad / Fecha de nacimiento
- ❌ Discapacidad
- ❌ Género
- ❌ Pertenencia a Pueblo Originario

**Acción:**
1. **Frontend:** Actualizar `mockClaveUnicaUser` en `mockData.js` para incluir nombre1, nombre2, apellido1, apellido2 (separados).
   ```javascript
   mockClaveUnicaUser = {
     nombre1: 'María',
     nombre2: 'Soledad',
     apellido1: 'González',
     apellido2: 'Pérez',
     rut: '12345678', // sin dígito verificador
     rutDv: '9',
     // ... resto
   }
   ```
2. **Frontend:** Crear componentes de formulario para datos adicionales (edad, discapacidad, género, pueblo).
3. **Backend:** Integración real de Clave Única (OIDC); mapear scopes.

---

### 3. **Relación comuna y vivero (zona de atención)**
**Estado:** 🔶 **Parcialmente implementado; requiere mapeo backend**

Actualmente: región → vivero (sin comuna de atención definida explícitamente).

**Acción:**
1. **Backend:** Agregar tabla `vivero_zonas_atencion` que mapee vivero → comunas que atiende.
2. **Frontend:** Usar mapeo backend en el flujo actual (ya se cargan viveroPorComuna, solo falta llenar tabla).

---

### 4. **Permitir solicitar plantas fuera de la región / país**
**Estado:** ❌ **No implementado; requiere backend**

Actualmente se restringe a región seleccionada.

**Acción:**
1. **Backend:** Agregar validación configurable (parámetro por región/vivero).
2. **Frontend:** Si está habilitado, permitir seleccionar vivero de otra región.
3. **Frontend:** Mostrar advertencia: "Solicita plantas fuera de tu región".

**Nota:** Requiere aclaración de negocio: ¿esto es permitido en los parámetros o prohibido?

---

### 5. **Coordenadas en UTM**
**Estado:** 🔶 **Lat/lng capturadas; requiere conversión**

Actualmente se almacenan/usan lat/lng (GPS estándar). Se necesitan UTM para precisión catastral.

**Acción:**
1. **Frontend/Backend:** Instalar librería de conversión (ej: `utm` npm package).
   ```javascript
   import utm from 'utm'
   const utmCoords = utm.fromLatLon(lat, lng)
   // utmCoords = { easting, northing, zoneNum, zoneLetter }
   ```
2. **Backend:** Almacenar ambos (lat/lng + UTM) en base de datos.
3. **Frontend:** Mostrar ambas coordenadas al usuario:
   ```javascript
   Coordenadas GPS: -33.7320, -70.7445
   UTM: 19H 335420 E, 6270150 N
   ```

---

### 6. **Validación de ubicación: Dirección + Comuna + Provincia + Región**
**Estado:** 🔶 **Parcialmente implementado; requiere API de geolocalización**

Actualmente: solo se capturan coordenadas en mapa. No hay validación con dirección.

**Acción:**
1. **Frontend:** Al marcar punto en mapa, hacer reverse geocoding (OSM Nominatim API).
   ```javascript
   const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
   const data = await response.json()
   // data.address = { road, village, municipality, province, state, country }
   ```
2. **Frontend:** Mostrar dirección inferida y pedir confirmación:
   - "¿Confirmas que la ubicación es en [dirección], [comuna], [región]?"
3. **Backend:** Opcionalmente validar contra catastro (requiere integración con SII/ROL).

**Importante:** Nominatim tiene límites de llamadas. Para producción, considerar Google Maps / mapbox.

---

### 7. **Visualizador de mapa: opciones de vista alternativa**
**Estado:** ❌ **No implementado**

Actualmente: solo OSM estándar. Se pide soporte para otras capas (satélite, topográfica, etc.).

**Acción:**
1. **Frontend:** Agregar controles de capas a `MapaPicker.jsx`:
   ```javascript
   const [tileLayer, setTileLayer] = useState('osm') // osm | satellite | topographic
   
   // En MapContainer:
   {tileLayer === 'osm' && (
     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" ... />
   )}
   {tileLayer === 'satellite' && (
     <TileLayer url="https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" ... />
   )}
   ```
2. **Frontend:** Botones para cambiar vista (toggle en mapa).

**Nota:** Si usas satélite de Google, revisar términos de servicio y atribuciones.

---

### 8. **Validador de correo electrónico y teléfono**
**Estado:** 🔶 **Capturados; sin validación real**

Actualmente se aceptan como strings sin validar.

**Acción:**
1. **Frontend:** Agregar validación en `NuevaSolicitud.jsx`:
   ```javascript
   const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
   const validarTelefono = (tel) => /^(\+56|0)?9\d{8}$/.test(tel.replace(/\s/g, ''))
   
   // En handleSubmit:
   if (!validarEmail(correo)) return setError('Correo inválido')
   if (!validarTelefono(telefono)) return setError('Teléfono inválido (formato: +56 9 XXXX XXXX)')
   ```
2. **Frontend:** Mostrar validación en tiempo real (visual feedback mientras escribe).

---

### 9. **Relación entre direcciones: Clave Única vs. Plantación vs. Contacto**
**Estado:** ❌ **No modelado; requiere clarificación de negocio**

Hay 3 direcciones potenciales:
- **Dirección Clave Única:** donde vive el solicitante (del sistema de identidad)
- **Dirección de Plantación:** donde plantará (capturada con mapa)
- **Dirección de Contacto:** para notificaciones

**Pregunta a aclarar:**
- ¿Las 3 deben ser iguales o pueden ser distintas?
- ¿Hay restricción geográfica (ej: solo puede plantar en su región)?

**Acción después de clarificación:**
1. **Frontend:** Mostrar las 3 direcciones y permitir editar según política.
2. **Backend:** Validar relaciones según reglas de negocio.

---

### 10. **Relación entre "Elige dónde retirar" y "Lugar de Plantación"**
**Estado:** ❌ **No modelado; requiere clarificación**

Actualmente se elige vivero (retiro) pero no se conecta explícitamente con ubicación de plantación.

**Preguntas:**
- ¿Hay restricción: solo plantar dentro de la zona de atención del vivero?
- ¿O puedo retirar plantas de un vivero y plantarlas en otro municipio?

**Acción después de clarificación:**
1. **Frontend:** Si hay restricción, validar al marcar punto en mapa:
   - "⚠️ Estás plantando fuera de la zona de atención del vivero seleccionado. ¿Continuar?"
2. **Backend:** Implementar validación de zonas.

---

### 11. **Consentimiento expreso — Ley 21.719**
**Estado:** 🔶 **Básico implementado; requiere detalle normativo**

Actualmente: checkbox simple "Autorizo tratamiento de datos".

Se necesita:
- Buen uso de plantas
- Encuestas
- Monitoreo
- Restricciones / castigos
- Propiedad (uso solo en terreno privado)
- No uso en otras obligaciones legales

**Acción:**
1. **Negocio/Jurídica:** Redactar texto legal completo (detallado en `PROPUESTA_PROTECCION_DATOS.md`).
2. **Frontend:** Reemplazar checkbox simple por modal o sección expandible:
   ```javascript
   <details>
     <summary>Autorización expresa según Ley 21.719</summary>
     <div className="legal-text">
       {/* Texto legal completo */}
     </div>
     <input type="checkbox" required /> Autorizo el tratamiento de mis datos
   </details>
   ```
3. **Backend:** Guardar timestamp + versión de consentimiento aceptado.

---

### 12. **Notificación de "solicitud conforme"**
**Estado:** ❌ **Mock; requiere servidor SMTP**

Actualmente: no hay envío real de email.

**Acción:**
1. **Backend:** Integrar servidor SMTP (ej: servidor CONAF, SendGrid, AWS SES).
2. **Backend:** Crear cola de notificaciones (Celery, RQ, etc.) para envíos no-bloqueantes.
3. **Backend:** Implementar endpoints que disparen emails:
   - `POST /api/solicitudes/{id}/notificar-conforme`
   - `POST /api/solicitudes/{id}/notificar-rechazada`
   - `POST /api/solicitudes/{id}/recordatorio-vencimiento`
4. **Frontend:** Mostrar confirmación visual:
   - "✓ Solicitud enviada. Recibirás confirmación en [correo] dentro de 5 minutos."

---

### 13. **Características adicionales de especies**
**Estado:** 🔶 **Capturadas en mockData; no mostradas**

Las especies tienen (en `catalogo.generated.json`):
- Contenedor (volumen en litros)
- Origen (nativo, exótico)
- Hábito de crecimiento (árbol, arbusto, herbáceo)
- Rango de altura

Actualmente: solo se muestran nombre y disponibilidad.

**Acción:**
1. **Frontend:** En paso "2. Elige especies", agregar tooltip o sección expandible:
   ```javascript
   <div className="especie-card">
     <h4>{especie.nombre}</h4>
     <p>{especie.nombreCientifico}</p>
     <button onClick={() => toggle(especie.id)}>ⓘ Más info</button>
     {expanded && (
       <div>
         📦 Contenedor: {especie.contenedor}L
         🌱 Origen: {especie.origen}
         📈 Hábito: {especie.habitoCrecimiento}
         📏 Altura: {especie.alturaMin}-{especie.alturaMax}m
       </div>
     )}
   </div>
   ```
2. **Backend:** Incluir campos adicionales en respuesta de especies.

---

### 14. **Acceso al estado del trámite (expediente)**
**Estado:** 🔶 **Listar implementado; detalle incompleto**

Ya existe `MisSolicitudes.jsx` pero falta:
- Estado detallado (cronología)
- Guía de despacho
- Fecha de retiro confirmada
- Plazo de vencimiento

**Acción:**
1. **Frontend:** Crear vista "Detalle del trámite" con timeline:
   ```
   📅 15 may — Solicitud recibida
   ✅ 17 may — Aceptada (encargado: Juan Pérez)
   📦 20 may — Lista para retirar
   🚚 [Pendiente] Retiro confirmado
   ⏳ Vence en: 10 días (04 jun)
   ```
2. **Frontend:** Mostrar guía de despacho (cuando esté disponible del backend).
3. **Frontend:** Botón "Descargar comprobante" (PDF).

---

### 15. **Perfiles y reportes**
**Estado:** ❌ **Mock parcial; requiere backend robusto**

Se necesitan:
- Resolución de entregas
- Glosas (rechazos/devoluciones)
- Trámites relevantes
- Filtros por región, vivero, especie, rango de fechas

**Acción:**
1. **Backend:** Implementar endpoints de reportes:
   - `GET /api/reportes/entregas?regionId=X&viveroId=Y&fechaInicio=...&fechaFin=...`
   - `GET /api/reportes/glosas?...`
   - `GET /api/reportes/resumen-regional?regionId=X`
2. **Frontend:** Mejorar `Dashboard.jsx` del consolidador:
   - Gráficos: entregas por región, tasa de retiro, tiempo promedio
   - Tabla: listado filtrable de solicitudes
   - Exportar a Excel (con estructura del Programa de Arborización)

---

## Dependencias externas / Backend requerido

| Mejora | Requiere backend | Notas |
|--------|-----------------|-------|
| 1 | ✅ | Registro self-service, BD de usuarios |
| 2 | ✅ | Integración Clave Única (OIDC), mapeo scopes |
| 3 | ✅ | Tabla `vivero_zonas_atencion` |
| 4 | ✅ | Parámetros configurables por región |
| 5 | ✅ | Almacenamiento UTM en BD |
| 6 | ✅ | Reverse geocoding (OSM/Google), opcionalmente SII ROL |
| 7 | ❌ | Solo frontend (capas Leaflet) |
| 8 | ❌ | Solo frontend (regex + librerías) |
| 9 | ✅ | Modelado de reglas de negocio |
| 10 | ✅ | Validación de zonas de atención |
| 11 | ✅ | Guardar consentimiento en BD + versionado |
| 12 | ✅ | SMTP, cola de notificaciones |
| 13 | ⚠️  | Datos ya existen en mockData; solo mostrar |
| 14 | ✅ | Timeline de estados, guía de despacho |
| 15 | ✅ | Endpoints de reportes |

---

## Próximos pasos recomendados

### Fase 1: Mejoras frontend puras (sin backend)
1. Separar nombre en componentes (nombre1, nombre2, apellido1, apellido2)
2. Validar email y teléfono en tiempo real
3. Agregar capas de mapa alternativas (satélite, topográfica)
4. Mostrar características de especies (contenedor, origen, hábito, altura)
5. Implementar modal detallado de consentimiento Ley 21.719

### Fase 2: Integración con backend existente
1. Conectar API endpoints reales (reemplazar mockData)
2. Implementar clave única real (OIDC)
3. Agregar campos adicionales (discapacidad, género, pueblo originario)
4. Implementar validación de dirección con reverse geocoding

### Fase 3: Funcionalidades complejas
1. Notificaciones por email
2. Reverse geocoding real
3. Conversión de coordenadas a UTM
4. Reportes y dashboards avanzados
5. Guía de despacho integrada

---

## Referencias

- **Requisitos:** [REQUISITOS.md](REQUISITOS.md)
- **Protección de datos:** [PROPUESTA_PROTECCION_DATOS.md](PROPUESTA_PROTECCION_DATOS.md)
- **Clave Única:** Manual en `INSUMO/clave_unica/`

---

## Notas para Luis

- Solo están implementadas funciones frontend. El backend (FastAPI + PostgreSQL) aún no está integrado.
- `mockData.js` simula toda la base de datos. Cuando el backend esté listo, reemplazar llamadas a `api/client.js`.
- Las coordenadas se guardan como lat/lng. Para producción, convertir a UTM (librería `utm` npm).
- Nominatim (OSM) tiene límites de uso. Para producción, considerar Google Maps API (revisando términos).
- Clave Única real requiere convenio con SEGPRES (en gestión según REQUISITOS.md).
