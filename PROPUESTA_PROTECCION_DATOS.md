# Propuesta de Política de Protección de Datos Personales
## Sistema de Gestión de Entregas — Programa de Arborización CONAF

**Versión:** 1.0 — Propuesta sujeta a revisión jurídica
**Fecha:** 2026-05-28
**Autor técnico:** Luis Monsalve (CONAF)
**Estado:** Propuesta. Requiere validación por la asesoría jurídica de CONAF antes de su adopción formal.

---

> ⚠️ **Aviso**: este documento es una **propuesta técnico-funcional** redactada por el equipo del proyecto para cubrir un vacío normativo identificado durante el levantamiento de requisitos. **No constituye un instrumento jurídicamente vinculante mientras no sea revisado, ajustado y aprobado por la asesoría jurídica de CONAF.** Su finalidad es dar lineamientos suficientes para diseñar y construir el sistema en cumplimiento razonable con la Ley 21.719, sin paralizar el proyecto a la espera de una política institucional general.

---

## 1. Antecedentes y propósito

El **Sistema de Gestión de Entregas del Programa de Arborización** trata datos personales de personas naturales beneficiarias del programa. CONAF, a la fecha de redacción de esta propuesta, **no cuenta con una política institucional de protección de datos personales** específica para sistemas de información que traten datos de personas naturales en el contexto del Programa de Arborización.

Esta propuesta:

- Define el marco mínimo de cumplimiento aplicable al sistema.
- Establece las medidas técnicas y organizativas que se incorporan al diseño del sistema (privacidad por diseño y por defecto).
- Documenta las decisiones que se toman para mitigar el riesgo legal mientras se elabora la política institucional general.

## 2. Marco normativo aplicable

| Norma | Aplicación |
|---|---|
| **Ley 21.719** de Protección de Datos Personales | Régimen general aplicable a partir de su entrada en vigencia plena (diciembre 2026). Define principios, derechos del titular, obligaciones del responsable y del encargado, sanciones. |
| **Ley 19.628** sobre Protección de la Vida Privada | Régimen transitorio hasta la entrada en vigencia plena de la Ley 21.719. |
| **Ley 20.285** sobre Acceso a la Información Pública | Define qué información puede ser pública y qué debe ser reservada en organismos del Estado. Plazo típico de retención documental: 5 años. |
| **Ley 19.880** de Bases de Procedimientos Administrativos | Aplica al procedimiento administrativo subyacente a la entrega de plantas. |

## 3. Datos personales tratados

### 3.1 Solicitantes (personas naturales)

| Dato | Origen | Finalidad | Sensibilidad |
|---|---|---|---|
| RUT | Clave Única | Identificación inequívoca del Solicitante; validación "una solicitud al año" | Identificador único nacional |
| Nombres y apellidos | Clave Única | Identificación; emisión de documentos | Personal |
| Correo electrónico | Ingresado por el Solicitante | Notificaciones del proceso | Personal |
| Teléfono | Ingresado por el Solicitante | Coordinación del retiro | Personal |
| Dirección particular | Ingresada por el Solicitante | Seguimiento y futura fiscalización | Personal |
| Coordenadas del lugar de plantación | Ingresadas por el Solicitante | Verificar plantación efectiva (módulo futuro) | Geolocalización |

### 3.2 Funcionarios CONAF (usuarios internos)

| Dato | Origen | Finalidad | Sensibilidad |
|---|---|---|---|
| Correo institucional | Cargado por el Administrador | Autenticación y comunicación | Personal |
| Vivero asignado | Configuración | Control de acceso por vivero | Operacional |

> **No se almacena el RUT de funcionarios internos.**

### 3.3 Categorías excluidas

El sistema **no trata** datos de las siguientes categorías especiales (en el sentido del art. 2 letra g) de la Ley 21.719): origen racial o étnico, afiliación sindical, datos de salud, datos biométricos, datos genéticos, vida sexual u orientación sexual, datos socioeconómicos en sentido estricto, o datos de niños, niñas y adolescentes.

## 4. Base de legitimación

| Sujeto | Base de legitimación | Mecanismo |
|---|---|---|
| Solicitantes (personas naturales) | **Consentimiento expreso, libre, informado y específico** del titular | Casilla de aceptación al crear la solicitud, con texto claro sobre finalidad, plazo de retención y derechos. El consentimiento es prerrequisito para procesar la solicitud (sin él, la solicitud no se crea). |
| Funcionarios CONAF | **Cumplimiento de funciones públicas** y relación laboral / institucional | Aceptación de términos de uso al momento de la habilitación de la cuenta. |

## 5. Finalidades del tratamiento

Los datos del Solicitante se tratan exclusivamente para:

1. Tramitar y resolver la solicitud de entrega de plantas del Programa de Arborización.
2. Notificar al Solicitante el estado de su solicitud (aceptada, lista para retirar, recordatorios, vencida, cancelada).
3. Generar el comprobante de entrega.
4. Verificar el cumplimiento de la regla "una solicitud por persona por año".
5. Generar estadísticas operativas e informes consolidados para CONAF, en formato **agregado** o **anonimizado**.
6. **A futuro (módulo de seguimiento post-entrega):** fiscalizar la plantación efectiva en el lugar declarado.

**No se autoriza** el uso para fines comerciales, de marketing, cesión a terceros, ni fines distintos a los enumerados arriba.

## 6. Plazos de retención y eliminación

**Principio rector:** los datos se mantienen solo el tiempo necesario para cumplir las finalidades declaradas, alineado con los principios de **minimización** y **limitación de la finalidad** de la Ley 21.719.

| Tipo de dato | Plazo de retención | Acción al cumplir plazo |
|---|---|---|
| Solicitudes activas (estado: en proceso, aceptada, lista para retirar) | Mientras dure la temporada operativa | Avanzan a "histórico" al cerrar la temporada |
| Solicitudes y entregas históricas con datos identificables | **5 años desde la última interacción del Solicitante con el sistema** | **Anonimización irreversible** (eliminación de RUT, nombres, correo, teléfono, dirección y coordenadas; se conservan datos agregados sin identificadores: especie, cantidad, vivero, mes, región) |
| Comprobantes de entrega (PDF) | 5 años | Eliminación o anonimización del PDF |
| Logs de auditoría con datos personales | 2 años | Eliminación |
| Datos de funcionarios internos | Mientras esté vigente la habilitación + 6 meses | Eliminación |

El plazo de 5 años se sustenta en:
- Consistencia con los plazos de conservación documental habituales en la Administración del Estado.
- Suficiencia para auditorías internas y externas.
- Permite el análisis de tendencias plurianuales del Programa.

**El proceso de anonimización debe ser automático**, mediante un job programado que corra mensualmente y procese los registros que cumplan el plazo.

## 7. Derechos del titular

El sistema debe permitir al Solicitante ejercer en línea los siguientes derechos reconocidos por la Ley 21.719:

| Derecho | Implementación en el sistema |
|---|---|
| Acceso | Pantalla "Mis datos" que muestra todos los datos personales tratados |
| Rectificación | Edición directa de correo, teléfono y dirección por el propio Solicitante |
| Supresión (olvido) | Botón "Eliminar mis datos" que dispara la anonimización inmediata de los datos del titular (manteniendo trazabilidad agregada anónima) |
| Oposición | Botón "Retirar mi consentimiento" con la consecuencia de cancelar la solicitud activa, si existe |
| Portabilidad | Descarga en JSON/CSV de los datos del Solicitante |
| Información | Aviso de privacidad accesible en todo momento desde el pie de página |

**Plazo máximo de respuesta:** 30 días corridos desde la solicitud del titular, salvo que la acción sea inmediata (caso de las acciones automatizadas del sistema).

## 8. Medidas técnicas y organizativas

### 8.1 Técnicas

- **Encriptación en reposo** de la base de datos PostgreSQL (al menos a nivel de tablespace; idealmente, encriptación a nivel de columna para campos sensibles).
- **Encriptación en tránsito** mediante TLS 1.2 o superior en todas las comunicaciones (frontend ↔ backend, backend ↔ servicios externos).
- **Hash** de las contraseñas de usuarios internos con un algoritmo moderno (bcrypt, scrypt o Argon2) y salt único por usuario.
- **Autenticación de Solicitantes vía Clave Única** (no se almacena su contraseña).
- **Control de acceso por rol** (RBAC) con principio de mínimo privilegio.
- **Segmentación por vivero**: cada Encargado solo accede a las solicitudes de su vivero.
- **Logs de auditoría inmutables** para acciones sobre datos personales.
- **Backups encriptados** con política de retención y prueba periódica de restauración.
- **Validación y sanitización** de todas las entradas para mitigar inyección y XSS.
- **Rate limiting** y protección contra fuerza bruta en los endpoints de autenticación.
- **Anonimización automatizada** mediante job programado.

### 8.2 Organizativas

- **Aviso de privacidad** visible al momento del consentimiento, redactado en lenguaje claro.
- **Términos y condiciones** específicos para el sistema, aceptados por todos los usuarios.
- **Convenios de confidencialidad** firmados por los funcionarios CONAF con rol de Encargado, Consolidador y Administrador.
- **Capacitación inicial** a los roles internos sobre el correcto tratamiento de datos.
- **Procedimiento documentado** para responder a solicitudes de derechos del titular.
- **Revisión periódica** de esta política (mínimo una vez al año).

## 9. Responsable y encargado de protección de datos

**Responsable del tratamiento (propuesta):** Jefatura del Departamento de Arbolado Urbano de CONAF.

**Encargado de protección de datos (DPO) (propuesta):** Por designar por CONAF. Mientras no exista designación formal, el rol de **Administrador del sistema** actúa como punto único de contacto para temas de protección de datos del sistema.

## 10. Procedimiento ante brechas de seguridad

En caso de detectarse una posible filtración o acceso indebido a datos personales, el procedimiento mínimo es:

1. **Contención inmediata**: deshabilitar el acceso comprometido y aislar el componente afectado.
2. **Evaluación**: alcance, naturaleza de los datos comprometidos, número de titulares afectados.
3. **Notificación interna** a la jefatura del Departamento de Arbolado Urbano y a TI CONAF dentro de 24 horas de detectada.
4. **Notificación a la Agencia de Protección de Datos Personales** (organismo creado por la Ley 21.719) dentro del plazo legal cuando la brecha represente riesgo para los titulares.
5. **Notificación a los titulares afectados** cuando la brecha represente un riesgo alto, mediante el correo registrado.
6. **Registro de la brecha** en una bitácora interna con causa raíz, impacto y medidas correctivas.

## 11. Aviso de privacidad (propuesta de texto, sujeto a revisión jurídica)

> **Aviso de privacidad — Sistema de Gestión de Entregas, Programa de Arborización CONAF**
>
> La Corporación Nacional Forestal (CONAF) tratará tus datos personales (RUT, nombres y apellidos provenientes de Clave Única, correo electrónico, teléfono, dirección y coordenadas del lugar donde plantarás) con la finalidad exclusiva de tramitar tu solicitud de plantas del Programa de Arborización, notificarte el estado del proceso, emitir el comprobante de entrega y, eventualmente, verificar la plantación en terreno.
>
> Tus datos serán **almacenados en forma encriptada** y solo accederán a ellos los funcionarios CONAF estrictamente necesarios para gestionar tu solicitud. **No serán cedidos a terceros** ni utilizados para fines distintos.
>
> Serán conservados por **5 años desde tu última interacción con el sistema**, plazo tras el cual se anonimizarán de manera irreversible.
>
> Puedes ejercer en cualquier momento tus derechos de **acceso, rectificación, supresión, oposición y portabilidad** desde la sección "Mis datos" o escribiendo a [correo CONAF DPO por definir].
>
> Marcando la casilla siguiente, otorgas tu consentimiento libre, informado y específico para este tratamiento. **Sin tu consentimiento la solicitud no puede tramitarse.**
>
> ☐ He leído y acepto.

## 12. Vigencia y revisión

Esta propuesta entra en vigor cuando sea aprobada por la asesoría jurídica de CONAF.

**Revisión obligatoria:**
- Antes del paso a producción del sistema.
- Antes de la entrada en vigencia plena de la Ley 21.719 (diciembre 2026).
- Anualmente desde su adopción.
- Frente a cualquier modificación sustancial del sistema (nuevos datos tratados, nuevas integraciones, nuevos roles).

## 13. Acciones inmediatas recomendadas (antes de iniciar desarrollo)

1. **Validación jurídica** de esta propuesta por la asesoría jurídica de CONAF.
2. **Designación formal** del responsable y del encargado de protección de datos para el sistema.
3. **Aprobación del texto del aviso de privacidad y del consentimiento expreso** que se mostrarán al Solicitante.
4. **Definición del correo institucional CONAF** que recibirá las solicitudes de ejercicio de derechos del titular.
5. **Confirmación del plazo de retención de 5 años** (o ajuste a lo que defina la asesoría jurídica).

---

**Documento relacionado:** [`REQUISITOS.md`](REQUISITOS.md)
