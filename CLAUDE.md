# COIPO — Sistema de Entrega de Plantas
**Proyecto:** Gestión de entregas del Programa de Arborización CONAF  
**Stack:** React (frontend) + FastAPI (backend) + PostgreSQL  
**Estado:** MVP funcional en frontend; mejoras de UX/funcionalidad solicitadas  
**Última actualización:** 2026-07-20 (segunda ronda: UTM, geocoding, fuera de región, reportes admin)  

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
4. **Validación de correo y teléfono** en tiempo real (regex, feedback visual)
5. **MapaPicker:** click en mapa + drag marker, coordenadas **lat/lng Y UTM** (conversión WGS84→UTM en `utils/utmConvert.js`, sin dependencia externa, verificada contra puntos de referencia de Chile)
6. **Geocodificación inversa real** (dirección/comuna/provincia/región) al marcar el punto en el mapa, vía fetch directo a Nominatim/OSM (`utils/reverseGeocode.js`), con debounce y cache
7. **Selector de capas de mapa:** base OSM, satélite (Esri), topográfico (OpenTopoMap)
8. **Validación "fuera de región":** parámetro `permiteFueraRegion` configurable por región en Admin → Parámetros; si está desactivado y el punto geocodificado cae fuera de la región elegida, la solicitud se bloquea con error; si está activado, se muestra una advertencia informativa pero se permite continuar
9. **Características de especies** (contenedor, hábito de crecimiento, rango de altura) expandibles en el paso "2. Elige especies"
10. **Consentimiento Ley 21.719** expandido: finalidad, datos tratados, compromisos del solicitante, retención, derechos
11. **Reportes en Admin:** pestaña nueva con 4 KPIs + 4 gráficos (SVG/CSS puro, sin librería de gráficos) — solicitudes por región, distribución por estado, top 5 especies, solicitudes por mes
12. **Roles y rutas protegidas:** solicitante, encargado, consolidador, admin
13. **Bandeja de encargado:** listado mock de solicitudes
14. **Stock mock:** descarga manual por vivero
15. **Dashboard mock:** consolidador con vista simulada (KPIs básicos + exportar Excel)

### ⚠️ Parcialmente implementado
- **Dirección:** se captura y ahora se valida referencialmente contra el punto del mapa (geocoding), pero no hay validación catastral (SII/ROL)
- **Notificaciones:** mock; no hay integración real de email
- **Nombre/RUT separados:** ya está en `mockClaveUnicaUser` (nombre1/nombre2/apellido1/apellido2, rut sin DV), pendiente que Clave Única real los entregue así

### ❌ No implementado / Requiere backend
- Clave Única real (OIDC con SEGPRES)
- Base de datos real (PostgreSQL)
- API endpoints (FastAPI)
- Envío de email real
- Guía de despacho
- Generación de PDF
- Logs de auditoría
- Validación de RUT (dígito verificador)
- Registro self-service para usuarios "Otros"
- Zona de atención comuna↔vivero (tabla dedicada)
- Campos adicionales de Clave Única: edad/fecha nacimiento, discapacidad, género, pueblo originario (están en el mock pero no se muestran/editan en UI todavía)

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
**Estado:** ✅ **Implementado (mock funcional, verificado en navegador)**

Se agregó `permiteFueraRegion` (booleano, default `true` = comportamiento actual) como parámetro por región en `api/parametros.js`, editable en **Admin → Parámetros** (checkbox "Permitir plantar fuera de esta región (o en otro país)").

En `NuevaSolicitud.jsx`, al marcar el punto en el mapa se compara la región geocodificada (vía Nominatim, ver punto 6) contra la región elegida en "Elige dónde retirar" (comparación laxa de nombres, normalizada sin tildes — ver función `coincideRegion`):
- Si coinciden o no hay datos suficientes: sin aviso.
- Si difieren y `permiteFueraRegion = true`: banner informativo azul, se permite continuar.
- Si difieren y `permiteFueraRegion = false`: banner de advertencia naranja **y bloqueo real del submit** con mensaje de error.

Verificado con Chrome headless: seleccionar Región Metropolitana + plantar en Región del Maule con el flag desactivado bloquea el envío; con el flag activado, solo advierte.

**Pendiente (backend):** persistir el parámetro en base de datos compartida en vez de `localStorage`.

---

### 5. **Coordenadas en UTM**
**Estado:** ✅ **Implementado (ambos formatos, verificado numéricamente)**

Se implementó `latLngToUTM()` en `frontend/src/utils/utmConvert.js`: fórmula estándar WGS84→UTM (Snyder/Karney), **sin dependencia npm** (se evaluaron paquetes como `utm`/`utm-latlng`/`geodesy`, pero se optó por la fórmula propia para no depender de un paquete externo cuya disponibilidad en el registry no estaba garantizada en este entorno).

Verificado con Node ejecutando puntos de referencia conocidos: Plaza de Armas Santiago da `19S 346564 E, 6299025 N`, muy cercano al valor público de referencia (~346100E/6299000N). Zona 19S detectada correctamente en Chile central-sur.

`MapaPicker.jsx` muestra ambos formatos lado a lado bajo el mapa:
```
COORDENADAS GPS (WGS84)      COORDENADAS UTM
-35.649485, -71.586935       19S 265793 E, 6051845 N
```

**Pendiente (backend):** almacenar ambos formatos en la base de datos compartida (hoy `crearSolicitud()` solo envía lat/lng; agregar UTM al payload cuando exista API real).

---

### 6. **Validación de ubicación: Dirección + Comuna + Provincia + Región**
**Estado:** ✅ **Implementado (geocoding real contra Nominatim, verificado en navegador)**

Se investigaron 3 opciones (agente de investigación con lectura de código fuente real de cada candidato):
- `leaflet-geosearch`: descartado — su API pública no expone reverse geocoding utilizable de fábrica (solo búsqueda por texto para un `GeoSearchControl`).
- `nominatim-client`: descartado — configura un header `User-Agent` custom que los navegadores bloquean por seguridad (patrón pensado para Node, no para frontend).
- **Fetch directo a Nominatim `/reverse`**: elegido. Cero dependencias nuevas, control total de parámetros.

Implementado en `frontend/src/utils/reverseGeocode.js`. La estructura de la respuesta de Nominatim para Chile se verificó empíricamente (no se adivinó): en zonas urbanas trae `address.city`, en zonas rurales chilenas trae `address.town` o `address.village` en su lugar; `county` = provincia, `state` = región. El código usa ese fallback (`city || town || village || municipality`).

`MapaPicker.jsx` dispara el geocoding con **debounce de 700ms** tras el clic/arrastre del marcador y **cancela la petición anterior** (`AbortController`) si el usuario mueve el punto antes de que responda, respetando el límite de 1 req/seg de la política de uso de Nominatim. Incluye caché en memoria por coordenada para no repetir consultas.

Verificado en navegador real: clic en un punto de la Región del Maule mostró correctamente "Ruta L-151 — San Javier, Provincia de Linares, Región del Maule". Un clic en el océano (sin dirección) mostró el mensaje de error correspondiente sin romper la UI.

**Pendiente:** validación catastral real (SII/ROL) — fuera de alcance de este frontend, requiere backend/convenio.
**Nota producción:** Nominatim es un servicio "best effort" sin SLA (máx. 1 req/seg, prohibido autocompletar en vivo, requiere atribución "© OpenStreetMap contributors"). Si el volumen crece mucho, evaluar instancia propia de Nominatim o un proveedor comercial (LocationIQ, Mapbox, Geoapify).

---

### 7. **Visualizador de mapa: opciones de vista alternativa**
**Estado:** ✅ **Implementado y verificado visualmente**

`MapaPicker.jsx` tiene un control flotante (`TileLayerControl`) con 3 capas, todas gratuitas y sin API key:
- **Mapa base** — OpenStreetMap estándar.
- **Satélite** — Esri World Imagery.
- **Topográfico** — OpenTopoMap.

Verificado con captura de pantalla: cambiar a "Satélite" muestra imagen satelital real de la zona con el marcador conservando su posición.

---

### 8. **Validador de correo electrónico y teléfono**
**Estado:** ✅ **Implementado**

`NuevaSolicitud.jsx` valida ambos campos con regex (`validarEmail`, `validarTelefono` — formato chileno `+56 9 XXXX XXXX`), con feedback visual en tiempo real (borde e ícono rojo) y bloqueo del submit si son inválidos.

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
**Estado:** ✅ **Implementado (con datos simulados)**

En "2. Elige especies", cada fila tiene un botón `+/-` que expande contenedor (L), hábito de crecimiento y rango de altura. Los valores están en `especieCaracteristicas` (objeto local en `NuevaSolicitud.jsx`), **simulados solo para las primeras 7 especies** — no vienen de `catalogo.generated.json` (el catálogo real solo trae nombre/origen/código).

**Pendiente:** el Excel maestro (`tabla_insumo/*.xlsx`) debe incluir estas columnas para que `generar_insumos.py` las propague al catálogo real y cubran todas las especies, no solo las 7 hardcodeadas.

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
**Estado:** 🔶 **Implementado en Admin (KPIs/gráficos); glosas y reportes por perfil aún pendientes**

Se agregó la pestaña **Reportes** en `pages/admin/ReportesTab.jsx` (no en el Dashboard del Consolidador, que ya tenía sus propios 4 KPIs + tabla + exportar Excel — se mantuvo intacto). Contiene:
1. KPI — Solicitudes históricas (total).
2. KPI — Tasa de retiro % (retiradas / finalizadas).
3. KPI — Unidades solicitadas totales.
4. KPI — Regiones con solicitudes (de N totales).
5. Gráfico de barras — Solicitudes por región.
6. Gráfico de barras apiladas + desglose — Distribución por estado (mismos colores que los `.badge.<estado>` existentes).
7. Gráfico de barras — Top 5 especies más solicitadas.
8. Gráfico de barras — Solicitudes por mes.

Todo en SVG/CSS puro (`BarChartCard`, `EstadoChartCard`), **sin librería de gráficos externa** (se evaluó y descartó recharts/chart.js/d3 para no agregar peso al bundle), accesible (cada barra tiene `aria-label`/`title` con el valor exacto, no depende solo del color). Build de producción verificado sin errores.

**Pendiente (requiere backend):**
- Resolución de entregas / glosas (rechazos, devoluciones) como reporte propio.
- Trámites relevantes / filtros avanzados por vivero, especie, rango de fechas dentro de Reportes (hoy son fijos, sin filtro).
- Definir qué ve cada perfil (Consolidador ve el Dashboard nacional; ¿debería ver también Reportes de Admin, o son roles con vistas separadas a propósito?). **Pregunta abierta para conversar con Luis.**

---

## Dependencias externas / Backend requerido

| Mejora | Frontend | Requiere backend para producción | Notas |
|--------|----------|-----------------------------------|-------|
| 1 | ✅ listo | ✅ | Registro self-service, BD de usuarios |
| 2 | ✅ mock | ✅ | Integración Clave Única (OIDC), mapeo scopes |
| 3 | ❌ | ✅ | Tabla `vivero_zonas_atencion` |
| 4 | ✅ **hecho** | ⚠️ | Mock funcional en `localStorage`; falta persistir en BD compartida |
| 5 | ✅ **hecho** | ⚠️ | Cálculo ya no depende del backend; falta almacenar UTM en BD |
| 6 | ✅ **hecho** | ⚠️ | Geocoding ya es real (Nominatim); falta validación catastral opcional (SII/ROL) |
| 7 | ✅ **hecho** | ❌ | Solo frontend, ya terminado |
| 8 | ✅ **hecho** | ❌ | Solo frontend, ya terminado |
| 9 | ❌ | ✅ | Modelado de reglas de negocio — pregunta abierta |
| 10 | ❌ | ✅ | Validación de zonas de atención — pregunta abierta |
| 11 | ✅ texto legal | ✅ | Falta guardar consentimiento en BD + versionado |
| 12 | ❌ | ✅ | SMTP, cola de notificaciones |
| 13 | ✅ **hecho** (datos simulados) | ⚠️ | Falta que el Excel maestro incluya estas columnas |
| 14 | 🔶 parcial | ✅ | Timeline de estados, guía de despacho |
| 15 | ✅ **hecho** (Admin) | ⚠️ | Reportes con KPIs/gráficos ya funcionan sobre datos mock; glosas y filtros avanzados pendientes |

---

## Próximos pasos recomendados

### ✅ Fase 1: Mejoras frontend puras (sin backend) — COMPLETADA
1. ~~Separar nombre en componentes (nombre1, nombre2, apellido1, apellido2)~~
2. ~~Validar email y teléfono en tiempo real~~
3. ~~Agregar capas de mapa alternativas (satélite, topográfica)~~
4. ~~Mostrar características de especies (contenedor, origen, hábito, altura)~~
5. ~~Implementar modal detallado de consentimiento Ley 21.719~~
6. ~~Mostrar coordenadas UTM junto a lat/lng~~
7. ~~Geocodificación inversa real (Nominatim) con validación de región~~
8. ~~Parámetro "permitir fuera de región" configurable en Admin~~
9. ~~Reportes con KPIs y gráficos en Admin~~

### Fase 2: Integración con backend existente
1. Conectar API endpoints reales (reemplazar mockData)
2. Implementar clave única real (OIDC)
3. Agregar campos adicionales (discapacidad, género, pueblo originario) — ya están en `mockClaveUnicaUser`, falta UI para mostrarlos/capturarlos
4. Persistir `permiteFueraRegion` y overrides de parámetros en BD (hoy en `localStorage`)
5. Registro self-service para usuarios "Otros" (no Clave Única)

### Fase 3: Funcionalidades complejas
1. Notificaciones por email (SMTP)
2. Validación catastral (SII/ROL) opcional sobre el geocoding ya implementado
3. Almacenar coordenadas UTM en base de datos (el cálculo frontend ya existe)
4. Filtros avanzados y glosas en Reportes
5. Guía de despacho integrada
6. Tabla `vivero_zonas_atencion` para la relación comuna↔vivero (punto 3) y la relación retiro↔plantación (punto 10)

---

## Referencias

- **Requisitos:** [REQUISITOS.md](REQUISITOS.md)
- **Protección de datos:** [PROPUESTA_PROTECCION_DATOS.md](PROPUESTA_PROTECCION_DATOS.md)
- **Clave Única:** Manual en `INSUMO/clave_unica/`

---

## Notas para Luis

- Solo están implementadas funciones frontend. El backend (FastAPI + PostgreSQL) aún no está integrado.
- `mockData.js` simula toda la base de datos. Cuando el backend esté listo, reemplazar llamadas a `api/client.js`.
- Las coordenadas ahora se calculan y muestran en **ambos formatos** (lat/lng y UTM) en el frontend (`utils/utmConvert.js`), pero `crearSolicitud()` (mock) todavía solo envía lat/lng — falta agregar UTM al payload cuando exista API real.
- La geocodificación inversa (dirección/comuna/provincia/región) ya es real, contra Nominatim/OSM, sin librería adicional. Nominatim tiene límites de uso (1 req/seg, sin SLA); para producción con mucho volumen, evaluar Google Maps/Mapbox o una instancia propia de Nominatim.
- Clave Única real requiere convenio con SEGPRES (en gestión según REQUISITOS.md).
- El flag `permiteFueraRegion` y los demás parámetros por región se guardan en `localStorage` (mock del admin). Se pierden si se limpia el navegador; migrar a BD compartida es tarea de backend.
- **Pregunta abierta para conversar:** ¿el tab "Reportes" debería vivir en Admin (como quedó, siguiendo tu pedido explícito) o duplicarse/moverse al Dashboard del Consolidador? Hoy son dos vistas separadas con datos parecidos pero no idénticos.
