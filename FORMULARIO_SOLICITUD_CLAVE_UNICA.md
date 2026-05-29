# Formulario interno — Datos para solicitar integración con Clave Única

**Sistema:** Gestión de Entregas — Programa de Arborización CONAF
**Fecha de levantamiento:** _____ / _____ / _________
**Responsable de completar este formulario:** _________________________________
**Estado del formulario:** ☐ Borrador  ☐ Validado internamente  ☐ Enviado a División de Gobierno Digital

> Documento de uso **interno CONAF**. Una vez completado, su contenido se usa para redactar el oficio formal y el formulario técnico que se enviará a la División de Gobierno Digital (SEGPRES) para solicitar la integración con Clave Única.
>
> Documentos de referencia:
> - [`CLAVE_UNICA.md`](CLAVE_UNICA.md) (resumen técnico)
> - [`INSUMO/clave_unica/_Manual de ClaveÚnica ⭐⭐.docx`](INSUMO/clave_unica/) (manual oficial)
> - [`PROPUESTA_PROTECCION_DATOS.md`](PROPUESTA_PROTECCION_DATOS.md)
> - [`REQUISITOS.md`](REQUISITOS.md)

---

## 1. Identificación de la institución solicitante

| Campo | Valor |
|---|---|
| Razón social | Corporación Nacional Forestal |
| Sigla | CONAF |
| RUT institucional | _________________________________ |
| Dirección institucional | _________________________________ |
| Comuna / Región | _________________________________ |
| Sitio web institucional | https://www.conaf.cl |
| Representante legal | _________________________________ |
| Cargo del representante legal | _________________________________ |
| RUT del representante legal | _________________________________ |

## 2. Unidad técnica responsable del sistema

| Campo | Valor |
|---|---|
| Nombre de la unidad/departamento | Departamento de Arbolado Urbano — Gerencia de Bosques y Cambio Climático |
| Jefatura del departamento | _________________________________ |
| Correo de la jefatura | _________________________________ |
| Teléfono de la jefatura | _________________________________ |

## 3. Datos del sistema o aplicación

| Campo | Valor |
|---|---|
| Nombre del sistema | Sistema de Gestión de Entregas — Programa de Arborización |
| Sigla o alias del sistema | _________________________________ |
| Descripción breve (máx. 3 líneas) | Sistema web que permite a personas naturales solicitar plantas del Programa de Arborización de CONAF, autenticadas mediante Clave Única; gestiona el flujo de validación, aviso de retiro y registro de entrega. |
| Estado actual | ☐ En diseño  ☐ En desarrollo  ☐ En pruebas  ☐ En producción |
| Fecha estimada de puesta en producción | _____ / _____ / _________ |
| Audiencia objetivo | Personas naturales beneficiarias del Programa de Arborización |
| Volumen estimado de autenticaciones anuales | ~1.800 (≈ 5/día promedio nacional) |
| Volumen estimado de autenticaciones máximas (pico) | _________________________________ |

## 4. Casos de uso para Clave Única

**Marcar todos los que apliquen:**

- [x] **Autenticación de personas naturales** que ingresan a hacer una solicitud.
- [ ] Autenticación de funcionarios CONAF (no aplica — usan correo y contraseña).
- [ ] Firma electrónica de documentos (no aplica en V1).
- [ ] Otro: _________________________________

**Justificación breve del uso de Clave Única:**

> El Programa de Arborización entrega plantas gratuitamente a personas naturales. Es necesario identificar inequívocamente al solicitante para (a) aplicar la regla de "una solicitud por persona por año", (b) emitir el comprobante de entrega con datos validados y (c) permitir una eventual fiscalización en terreno de la plantación efectiva.

_(ajustar / completar si corresponde)_: _________________________________

## 5. Scopes y datos personales requeridos

| Scope | ¿Se solicita? | Dato que entrega | Justificación |
|---|---|---|---|
| `openid` | ☒ Sí (obligatorio) | Identificador OIDC `sub` | Requisito del protocolo OIDC |
| `run` | ☒ Sí | RUT del titular | Identificación inequívoca y validación "1 solicitud/año" |
| `name` | ☒ Sí | Nombres y apellidos | Emisión del comprobante y notificaciones |
| `email` | ☐ Sí ☐ No | Correo registrado en Clave Única | _Pendiente: el sistema pide al usuario su correo directamente; evaluar si conviene tomar también el de Clave Única_ |

**Datos personales adicionales que el sistema captura del propio usuario (no provienen de Clave Única):**

- Correo electrónico de contacto
- Teléfono
- Dirección particular
- Coordenadas del lugar de plantación

## 6. Datos técnicos de integración

### 6.1 Ambiente de certificación (pruebas)

| Campo | Valor |
|---|---|
| URL del sistema en certificación | _________________________________ |
| `redirect_uri` de callback | _________________________________ |
| `redirect_uri` post-logout | _________________________________ |
| Rango de IPs de origen (si aplica) | _________________________________ |

### 6.2 Ambiente de producción

| Campo | Valor |
|---|---|
| URL del sistema en producción | _________________________________ |
| `redirect_uri` de callback | _________________________________ |
| `redirect_uri` post-logout | _________________________________ |
| Rango de IPs de origen (si aplica) | _________________________________ |

### 6.3 Infraestructura

| Campo | Valor |
|---|---|
| Tipo de hosting | ☒ On-premise CONAF  ☐ Nube pública  ☐ Híbrido |
| Proveedor del datacenter / nube | Datacenter Claro (gestionado por TI CONAF) |
| ¿La aplicación está detrás de un balanceador / proxy? | ☐ Sí  ☐ No  ¿Cuál? _____________ |
| Certificado SSL/TLS en producción | ☐ Por contratar  ☐ Ya disponible — Emisor: _____________ |

## 7. Contactos técnicos y administrativos

### 7.1 Contacto técnico principal (desarrollo del sistema)

| Campo | Valor |
|---|---|
| Nombre | _________________________________ |
| Cargo | _________________________________ |
| Correo | _________________________________ |
| Teléfono / celular | _________________________________ |

### 7.2 Contacto técnico de respaldo

| Campo | Valor |
|---|---|
| Nombre | _________________________________ |
| Cargo | _________________________________ |
| Correo | _________________________________ |
| Teléfono / celular | _________________________________ |

### 7.3 Contacto de TI CONAF (contraparte del proyecto)

| Campo | Valor |
|---|---|
| Nombre | _________________________________ |
| Cargo | _________________________________ |
| Correo | _________________________________ |
| Teléfono / celular | _________________________________ |

### 7.4 Contacto administrativo / formal

| Campo | Valor |
|---|---|
| Nombre | _________________________________ |
| Cargo | _________________________________ |
| Correo | _________________________________ |
| Teléfono | _________________________________ |

## 8. Encargado de Protección de Datos (DPO)

| Campo | Valor |
|---|---|
| ¿CONAF ya tiene un DPO formal designado? | ☐ Sí  ☐ No  ☐ En proceso |
| Nombre del DPO (o persona que actuará como tal) | _________________________________ |
| Cargo / unidad | _________________________________ |
| Correo del DPO | _________________________________ |
| Correo para solicitudes de ejercicio de derechos del titular | _________________________________ |

## 9. Marco legal y consentimiento

**Base de legitimación del tratamiento:**

- [x] **Consentimiento expreso, libre, informado y específico** del titular al momento de crear la solicitud.
- [x] **Cumplimiento de funciones públicas de CONAF** (Programa de Arborización).
- [ ] Otra: _________________________________

**Compromisos institucionales:**

- [ ] Política de Protección de Datos institucional aprobada — referencia: _________________________________
- [x] Propuesta interna específica para este sistema — ver [`PROPUESTA_PROTECCION_DATOS.md`](PROPUESTA_PROTECCION_DATOS.md)
- [ ] Aviso de privacidad publicado en el sistema — versión: _________________________________
- [ ] Texto del consentimiento expreso aprobado por asesoría jurídica — fecha aprobación: _____ / _____ / _________

**Retención de datos personales declarada:** 5 años desde la última interacción del titular, luego anonimización irreversible.

## 10. Medidas técnicas y organizativas declaradas

Marcar las medidas implementadas o comprometidas para producción:

- [ ] HTTPS / TLS 1.2 o superior en toda comunicación.
- [ ] Encriptación de datos personales en reposo (base de datos).
- [ ] Hash de contraseñas de usuarios internos (bcrypt / Argon2 / scrypt).
- [ ] Control de acceso basado en roles (RBAC).
- [ ] Segmentación de datos por vivero (cada Encargado solo accede a sus solicitudes).
- [ ] Logs de auditoría inmutables.
- [ ] Backups encriptados con prueba periódica de restauración.
- [ ] Validación y sanitización de inputs.
- [ ] Rate limiting / protección anti-fuerza bruta.
- [ ] Plan documentado de respuesta a brechas.
- [ ] Convenios de confidencialidad firmados por funcionarios.

## 11. Información complementaria

| Campo | Valor |
|---|---|
| ¿La aplicación va a integrarse con otros sistemas del Estado además de Clave Única? | ☐ Sí ☐ No  ¿Cuáles? _____________ |
| ¿Hay otras instituciones públicas involucradas? | ☐ Sí ☐ No  ¿Cuáles? _____________ |
| ¿Esta integración reemplaza un sistema anterior? | ☐ Sí ☐ No  ¿Cuál? _____________ |
| ¿El sistema es de uso obligatorio para el ciudadano? | ☐ Sí ☐ No |
| ¿Es accesible en lenguaje claro y cumple WCAG 2.1? | ☐ Sí ☐ No ☐ Por confirmar |

## 12. Documentación a adjuntar al oficio

Marcar lo que se adjuntará:

- [ ] Oficio formal del Director Ejecutivo de CONAF dirigido a la División de Gobierno Digital.
- [ ] Este formulario completo.
- [ ] Documento técnico del sistema ([`REQUISITOS.md`](REQUISITOS.md)).
- [ ] Propuesta de Política de Protección de Datos ([`PROPUESTA_PROTECCION_DATOS.md`](PROPUESTA_PROTECCION_DATOS.md)).
- [ ] Texto del aviso de privacidad y consentimiento expreso.
- [ ] Diagrama de arquitectura del sistema.
- [ ] Diagrama del flujo de autenticación (Authorization Code Flow).
- [ ] Política de seguridad / certificaciones (si existen).
- [ ] Resolución que aprueba el sistema (si existe).
- [ ] Otros: _________________________________

## 13. Plan de pruebas

| Fase | Fecha estimada | Responsable |
|---|---|---|
| Recepción de credenciales en ambiente de certificación | _____ / _____ / _________ | División de Gobierno Digital |
| Inicio del desarrollo de integración | _____ / _____ / _________ | _________________________ |
| Pruebas unitarias y de integración | _____ / _____ / _________ | _________________________ |
| Pruebas de seguridad (penetración básica) | _____ / _____ / _________ | _________________________ |
| Validación funcional final | _____ / _____ / _________ | _________________________ |
| Solicitud de credenciales productivas | _____ / _____ / _________ | _________________________ |
| Habilitación en producción | _____ / _____ / _________ | División de Gobierno Digital |

## 14. Hitos administrativos

| Hito | Fecha | Notas |
|---|---|---|
| Validación interna de este formulario | _____ / _____ / _________ | _________________________ |
| Visto bueno de asesoría jurídica CONAF | _____ / _____ / _________ | _________________________ |
| Firma del oficio por Director Ejecutivo | _____ / _____ / _________ | _________________________ |
| Envío del oficio a División de Gobierno Digital | _____ / _____ / _________ | N° oficio: ____________ |
| Respuesta recibida de Gobierno Digital | _____ / _____ / _________ | _________________________ |
| Credenciales de certificación recibidas | _____ / _____ / _________ | _________________________ |
| Credenciales productivas recibidas | _____ / _____ / _________ | _________________________ |

## 15. Observaciones

_(Espacio para notas adicionales, pendientes, riesgos identificados, etc.)_

```
[                                                                    ]
[                                                                    ]
[                                                                    ]
[                                                                    ]
[                                                                    ]
```

---

## 16. Firmas internas (visación previa al envío)

| Responsabilidad | Nombre | Cargo | Firma | Fecha |
|---|---|---|---|---|
| Levantamiento técnico | _____________________ | _____________________ | _________ | __/__/____ |
| TI CONAF | _____________________ | _____________________ | _________ | __/__/____ |
| Asesoría jurídica | _____________________ | _____________________ | _________ | __/__/____ |
| Departamento de Arbolado Urbano | _____________________ | _____________________ | _________ | __/__/____ |
| Dirección Ejecutiva (envío) | _____________________ | _____________________ | _________ | __/__/____ |

---

**Versión del formulario:** 1.0
**Última actualización:** 2026-05-28
