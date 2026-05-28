# Documento de Levantamiento de Requisitos
## Sistema de Gestión de Entregas — Programa de Arborización CONAF

**Versión:** 1.1
**Fecha:** 2026-05-28
**Levantado por:** Luis Monsalve (CONAF)

---

## 1. Resumen ejecutivo

Sistema web para gestionar de forma sistemática las entregas de plantas del **Programa de Arborización de CONAF**, reemplazando el flujo actual basado en Google Forms regionales y planillas Excel descentralizadas. La aplicación centraliza la solicitud (autenticada con Clave Única), la validación por el encargado de vivero, el aviso automático al beneficiario, el registro del retiro con descuento automático de stock, y la consolidación nacional exportable a Excel. Atiende ~1.800 solicitudes anuales en 18 unidades administrativas y ~38 viveros, con un horizonte de uso de 3 a 5 años. Construcción: 3 meses, 1 desarrollador, CLP 30 millones, stack FastAPI + PostgreSQL + React, infraestructura on-premise CONAF.

---

## 2. Usuarios y sus capacidades

| Rol | Autenticación | Volumen | Capacidades principales |
|---|---|---|---|
| **Solicitante** | Clave Única | ~1.800/año (~100/región × 18) | Seleccionar **región** y luego **vivero** específico; ver el catálogo de especies disponibles en ese vivero; crear 1 solicitud anual (máx 3 especies, máx 100 unidades); autorizar expresamente el tratamiento de sus datos; ver estado de su solicitud; cancelar antes del retiro; recibir notificaciones por correo |
| **Encargado de vivero** | Usuario y contraseña | Mínimo 38 (1 por vivero, con suplencias) | Ver bandeja de solicitudes asignadas a su vivero por orden de llegada; validar/aceptar/rechazar; marcar "lista para retirar" (dispara aviso al solicitante); registrar retiro efectivo o vencimiento; generar PDF comprobante de entrega; recibir alertas de vencimientos próximos; gestionar stock disponible (carga inicial por Excel y descuento automático); responder mensajes; ver nombre, correo, teléfono, dirección y coordenadas del solicitante (**NO ve RUT**) |
| **Consolidador** | Usuario y contraseña | 1 a nivel nacional (con suplencias) | Visión nacional completa con filtros (región, vivero, fecha, especie, estado); exportar Excel propio del Programa de Arborización; dashboards simples; auditar acciones (logs); directorio de encargados con correo |
| **Administrador del sistema** | Usuario y contraseña | 1+ (puede crear otros admins) | Gestionar catálogo de especies; gestionar viveros y unidades administrativas; alta/baja/suplencias de encargados, consolidadores y otros admins; configurar parámetros del sistema (plazo de retiro, máximos por solicitud, plantillas de notificaciones); configurar reglas de asignación de vivero; visión total de datos operativos y configuración |

---

## 3. Funcionalidades en alcance

### 3.1 Crítico (MVP — sin esto la aplicación no sirve el día 1)

1. Autenticación del Solicitante vía **Clave Única**.
2. Creación de solicitud con: **selección de región**, **selección de vivero** dentro de esa región, especies (máx 3, desde el catálogo cargado del vivero elegido), cantidades (máx 100 totales), coordenadas del lugar a plantar y **autorización expresa de tratamiento de datos**.
3. **El vivero es elegido por el Solicitante** (no hay asignación automática). El catálogo de especies y el stock disponible corresponden al inventario previamente cargado de ese vivero.
4. Validación y aceptación de solicitudes por el Encargado, por **orden de llegada**.
5. **Aviso automático por correo** al Solicitante cuando la solicitud queda "lista para retirar".
6. Registro del retiro efectivo, o vencimiento automático a los 30 días, con **descuento automático del stock**.
7. Generación automática de **PDF "Comprobante de Entrega"** (sin RUT ni firma; referencia al N° de guía de despacho oficial emitida por otro sistema).
8. Carga inicial de stock disponible por vivero mediante Excel simple; descuento automático con cada retiro registrado.
9. Exportación a **Excel propio del Programa de Arborización** por el Consolidador, con filtros.
10. Validación automática: **una solicitud por persona por año**.
11. **Alertas automáticas** de vencimiento próximo al Solicitante (días 20 y 28).
12. Marcación automática como "vencida" al día 30 y **devolución automática** del stock comprometido.
13. **Filtrado automático del catálogo** de especies según el vivero elegido por el Solicitante.
14. Autenticación de roles internos por usuario y contraseña.
15. Roles con visibilidad acotada de datos personales (Encargado sin RUT).
16. **Encriptación de datos personales en reposo**.

### 3.2 Importante (idealmente en V1, podría diferirse si aprieta el plazo)

17. Dashboards simples para el Consolidador (totales por región/especie/mes; tasa de retiro; tiempo de proceso).
18. Logs de auditoría (quién hizo qué y cuándo).
19. Directorio de encargados (correo) visible para el Consolidador.
20. Notificaciones al Solicitante por cancelación, rechazo y cambios de estado.
21. Cancelación de solicitud por parte del propio Solicitante antes del retiro.

### 3.3 Deseable (no bloquea V1)

22. **Mensajería bidireccional Solicitante ↔ Encargado** dentro de la aplicación.

---

## 4. Funcionalidades fuera de alcance

| # | Funcionalidad excluida | Razón |
|---|---|---|
| a | Conexión con plataforma de inventario CONAF | Largo plazo (3-5 años); en V1 el stock se carga manualmente |
| b | Gestión de ventas, donaciones, traslados internos entre viveros y bajas de plantas | Alcance acotado a entregas del Programa de Arborización |
| c | Generación de guía de despacho oficial timbrada por el SII | Solo se genera comprobante de entrega; la guía oficial sigue emitiéndose por el sistema actual |
| d | Integración con el sistema actual que emite guías oficiales | Por confirmar; a futuro |
| e | Historial de años anteriores para el Solicitante | No prioritario |
| f | App móvil nativa (iOS/Android) | V1 es web responsive |
| g | Transporte / despacho a domicilio | El Solicitante siempre retira en el vivero |
| h | Seguimiento post-entrega y fiscalización en terreno | Módulo a **mediano plazo** |
| i | Pagos / cobros | El Programa de Arborización es gratuito |
| j | Reporte completo del Indicador SIGI GBCC 8 | Se genera Excel propio del Programa, no reemplaza al SIGI |
| k | Mapa interactivo / visualización geográfica | Se almacenan coordenadas pero no se visualizan en mapa |
| l | Notificaciones por WhatsApp y SMS | Solo correo en V1; impacto de costos recurrentes |
| m | Notificaciones push dentro de la app | Solo correo en V1 |
| n | Integración con Active Directory / LDAP CONAF | No |
| o | Integración con CeroPapel u otros sistemas de gobierno | No |
| p | Importación automática de catálogos desde un sistema maestro CONAF | Carga manual por el Administrador |

---

## 5. Integraciones requeridas

### 5.1 En V1

- **Clave Única** (SEGPRES / Gobierno Digital): autenticación de Solicitantes. **Requiere convenio que debe gestionarse en paralelo al desarrollo desde el día 1.**
- **Servicio de correo electrónico**: envío de notificaciones (aceptada, lista para retirar, recordatorios día 20 y 28, vencida, cancelación, rechazo).

### 5.2 Fuera de V1 (futuro)

- Plataforma de inventario CONAF (largo plazo).
- Sistema actual de emisión de guías de despacho oficiales.
- WhatsApp Business API y SMS.

---

## 6. Restricciones técnicas confirmadas

| Ítem | Valor |
|---|---|
| Backend | FastAPI (Python) |
| Base de datos | PostgreSQL |
| Frontend | React (simple) |
| Infraestructura | On-premise CONAF a nivel nacional, datacenter Claro (en gestión) |
| Presupuesto | CLP 30.000.000 |
| Plazo | 3 meses |
| Equipo | 1 desarrollador |

---

## 7. Criterios de aceptación de la primera versión

### 7.1 Métricas de éxito que se evaluarán

- **Tasa de retiros**: % de solicitudes aceptadas que efectivamente se retiran antes del vencimiento de 30 días.
- **Tiempo de proceso**: días desde el ingreso de la solicitud hasta el retiro.

### 7.2 Requisitos no funcionales (no negociables)

**SLA de disponibilidad (punto inicial, sujeto a revisión):** caída máxima tolerable de **5 días al año** (≈ 98,6% de disponibilidad anual).

Los siguientes problemas son **inaceptables en producción**:

1. Pérdida o corrupción de datos sin posibilidad de recuperación.
2. Caída del sistema fuera del SLA acordado (máximo 5 días al año).
3. Doble entrega de una misma solicitud o stock en negativo.
4. Solicitudes duplicadas por la misma persona en el mismo año.
5. Falla en la entrega de la notificación "lista para retirar" al Solicitante.
6. Filtración de datos personales entre roles o entre viveros.
7. Errores en los datos del Excel exportado.
8. Acceso indebido o escalamiento de privilegios entre roles.

### 7.3 Definición de "listo para producción"

- Las 16 funcionalidades **críticas** implementadas y probadas.
- Convenio de **Clave Única** firmado y funcional en producción.
- Infraestructura on-premise provisionada y con accesos vigentes.
- Encriptación de datos personales en reposo verificada.
- Backups automáticos configurados y probados.

---

## 8. Decisiones recientes y riesgos pendientes

### 8.1 Decisiones tomadas en esta revisión (v1.1)

| # | Tema | Decisión |
|---|---|---|
| 1 | Asignación de vivero | **El Solicitante elige región → vivero**. El catálogo de especies se carga desde el inventario previamente cargado de ese vivero. Ya no hay división de solicitud por especies en distintos viveros. |
| 2 | Cumplimiento Ley 21.719 | Estrategia: **consentimiento expreso** del Solicitante al crear la solicitud + **planificación de base de datos y frontend con apoyo de IA**, aplicando privacidad por diseño. Detalles en [`PROPUESTA_PROTECCION_DATOS.md`](PROPUESTA_PROTECCION_DATOS.md). |
| 3 | Política interna de protección de datos | Se redacta una propuesta específica para este sistema en [`PROPUESTA_PROTECCION_DATOS.md`](PROPUESTA_PROTECCION_DATOS.md), pendiente de revisión jurídica de CONAF. |
| 5 | SLA de disponibilidad | **5 días de caída tolerable al año** (≈ 98,6% de disponibilidad). Punto inicial, sujeto a revisión con TI CONAF. |
| 7 | Retención de datos personales | Se define **según Ley 21.719** (principios de minimización y finalidad). Propuesta: **5 años desde la última interacción del Solicitante**, luego anonimización irreversible. Detalle en [`PROPUESTA_PROTECCION_DATOS.md`](PROPUESTA_PROTECCION_DATOS.md). |

### 8.2 Riesgos / preguntas aún abiertas

| # | Tema | Estado | Riesgo | Responsable |
|---|---|---|---|---|
| 4 | **Convenio Clave Única con SEGPRES** | En gestión. Manual de referencia disponible en [`INSUMO/clave_unica/_Manual de ClaveÚnica ⭐⭐.docx`](INSUMO/clave_unica/). | Si la habilitación del cliente OIDC en ambiente productivo demora más de ~6 semanas, comprime fuertemente el plazo de 3 meses. | Patrocinador del proyecto |
| 6 | **Sistema actual que emite guías de despacho oficiales** | Sin información: no se sabe cuál es ni si tiene API. | Define el módulo futuro de integración. No bloquea V1. | TI CONAF / dirección |
| 8 | **Provisión del ambiente on-premise (datacenter Claro)** | Sin información aún: fechas, accesos y contraparte técnica por definir. | Riesgo de plazo: si el ambiente no está disponible al inicio del proyecto, los 3 meses corren contra un servidor que recién se provisiona. | TI CONAF |

---

## Anexo: Insumos de referencia

- Documento Adjunto 1 — Instructivo Reportes del SIGI GBCC 8 2026 (CONAF, Departamento de Arbolado Urbano).
- Documento Adjunto 2 — Ejemplo de Resolución de Baja de Plantas 289/2022, La Araucanía (referencia documental; no aplica a V1).
- Documento Adjunto 3 — Excel "Programa de Producción y Evaluación de Plantas" (catálogo maestro de especies, viveros, comunas y regiones para semillado inicial).
- Documento Adjunto 4 — Excel "Control de Inventario de Plantas (Ingresos y Egresos)" (formato de referencia del SIGI; el Excel exportado por la app **NO** reemplaza este).
