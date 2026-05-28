# Integración con Clave Única — Datos y pasos necesarios

**Sistema:** Gestión de Entregas — Programa de Arborización CONAF
**Fecha:** 2026-05-28
**Documento de referencia oficial:** [`INSUMO/clave_unica/_Manual de ClaveÚnica ⭐⭐.docx`](INSUMO/clave_unica/)

> ⚠️ Este documento resume los datos y pasos que debes tener listos para integrar Clave Única. Los valores **exactos** (endpoints, scopes habilitados, política de redirect_uri) deben validarse contra el **Manual oficial de Clave Única** ubicado en `INSUMO/clave_unica/` y contra la documentación vigente que entregue la **División de Gobierno Digital** al momento de la habilitación.

---

## 1. Qué es Clave Única en este sistema

Clave Única es el sistema de autenticación digital del Estado de Chile, basado en **OpenID Connect (OIDC)** sobre OAuth 2.0. Lo administra la División de Gobierno Digital del Ministerio Secretaría General de la Presidencia.

En este proyecto se usará **exclusivamente para autenticar al rol Solicitante** (personas naturales que solicitan plantas). Los demás roles (Encargado, Consolidador, Administrador) usan correo y contraseña propios del sistema.

## 2. Pasos administrativos (gestión del convenio)

| # | Paso | Responsable | Tiempo estimado |
|---|---|---|---|
| 1 | Definir el **caso de uso institucional** (qué datos personales se requieren, qué scopes, justificación) | Equipo de proyecto + jefatura CONAF | 1 semana |
| 2 | Enviar **oficio formal** a la División de Gobierno Digital solicitando integración con Clave Única | Director Ejecutivo CONAF (o quien delegue) | 1-2 semanas trámite |
| 3 | Recibir y completar el **formulario técnico de integración** (URLs de redirect, ambientes, contacto técnico) | Equipo técnico del proyecto | 1 semana |
| 4 | Recepción de **credenciales en ambiente de certificación** (`client_id` + `client_secret` para testing) | División de Gobierno Digital | 2-4 semanas |
| 5 | Desarrollo e **integración contra ambiente de certificación** | Equipo técnico | 1-2 semanas |
| 6 | **Pruebas funcionales y de seguridad** | Equipo técnico + División de Gobierno Digital | 1-2 semanas |
| 7 | **Habilitación de credenciales productivas** | División de Gobierno Digital | 1-2 semanas |
| **Total** | | | **8-14 semanas** |

> 🚨 **Crítico para el plazo de 3 meses del proyecto:** este trámite debe arrancar el día 1. Si comienza tarde, no llegará a producción dentro de los 3 meses.

## 3. Datos que CONAF debe entregar a la División de Gobierno Digital

Para solicitar la integración, prepara con anticipación:

| Dato | Valor para este sistema |
|---|---|
| **Nombre de la institución** | Corporación Nacional Forestal (CONAF) |
| **Sistema o aplicación** | Sistema de Gestión de Entregas — Programa de Arborización |
| **Casos de uso** | Autenticación de personas naturales que solicitan plantas del Programa de Arborización |
| **Datos personales requeridos (scopes)** | `openid`, `run`, `name` (y `email` si aplica) — ver §5 |
| **Justificación legal del tratamiento** | Cumplimiento de funciones públicas de CONAF; consentimiento expreso del titular |
| **Volumen estimado de autenticaciones** | ~1.800 por año (≈ 5/día promedio nacional) |
| **Ambiente productivo URL** | URL pública definitiva del sistema (por definir con TI CONAF) |
| **Ambiente de pruebas / certificación URL** | URL del ambiente de QA del sistema |
| **`redirect_uri` productivo** | `https://<dominio-prod>/api/auth/claveunica/callback` |
| **`redirect_uri` de pruebas** | `https://<dominio-qa>/api/auth/claveunica/callback` |
| **Logout `redirect_uri`** | `https://<dominio>/` (o el que defina CONAF) |
| **Contacto técnico** | Nombre, correo y teléfono del desarrollador y de la contraparte TI CONAF |
| **Encargado de protección de datos** | Nombre y correo del DPO (por definir, ver `PROPUESTA_PROTECCION_DATOS.md`) |
| **Documentación de seguridad** | Descripción de medidas: TLS, encriptación en reposo, RBAC, logs |

## 4. Endpoints OIDC (referenciales — confirmar con el Manual)

| Endpoint | URL (referencial) |
|---|---|
| **Authorize** (redirige al usuario) | `https://accounts.claveunica.gob.cl/openid/authorize/` |
| **Token** (intercambia `code` por `access_token`) | `https://accounts.claveunica.gob.cl/openid/token/` |
| **UserInfo** (obtiene datos del usuario) | `https://www.claveunica.gob.cl/openid/userinfo/` |
| **Logout** | `https://accounts.claveunica.gob.cl/api/v1/accounts/app/logout/` |
| **Discovery (OIDC)** | `https://accounts.claveunica.gob.cl/openid/.well-known/openid-configuration` |

Existe un **ambiente de certificación** (URLs distintas) que se entrega al momento de la habilitación.

## 5. Scopes disponibles

| Scope | Dato que entrega | ¿Necesario en este sistema? |
|---|---|---|
| `openid` | Identificador OIDC (sub) | **Sí** (obligatorio en OIDC) |
| `run` | RUT del titular | **Sí** — identifica unívocamente al Solicitante y permite validar la regla "1 solicitud por persona por año" |
| `name` | Nombres y apellidos | **Sí** — para el comprobante y notificaciones |
| `email` | Correo registrado en Clave Única | **Opcional** — el sistema captura el correo directamente del Solicitante para evitar inconsistencias |

Solicitar **solo los scopes estrictamente necesarios** (principio de minimización de la Ley 21.719).

## 6. Flujo de autenticación (Authorization Code Flow)

```
[Browser]                [Frontend React]           [Backend FastAPI]           [Clave Única]
   |                          |                          |                          |
   | clic "Ingresar con CU"   |                          |                          |
   |------------------------->|                          |                          |
   |                          | GET /api/auth/claveunica/login                       |
   |                          |------------------------->|                          |
   |                          |                          | construye authorize URL  |
   |                          |                          | con state + nonce        |
   |                          |  302 redirect            |                          |
   |                          |<-------------------------|                          |
   |  302 a authorize URL                                                           |
   |--------------------------------------------------------------------------------------->|
   |                                                                                |
   |                                Usuario se autentica en Clave Única              |
   |                                                                                |
   |  302 a redirect_uri?code=...&state=...                                          |
   |<---------------------------------------------------------------------------------------|
   |                          |                          |                          |
   | GET /api/auth/claveunica/callback?code=...&state=...                            |
   |--------------------------------------------------------------------------------->|
   |                          |                          | valida state             |
   |                          |                          | POST /token (code)       |
   |                          |                          |------------------------->|
   |                          |                          |        access_token      |
   |                          |                          |<-------------------------|
   |                          |                          | GET /userinfo            |
   |                          |                          |------------------------->|
   |                          |                          |  {sub, run, name, ...}   |
   |                          |                          |<-------------------------|
   |                          |                          | crea sesión backend      |
   |                          |                          | (cookie httpOnly o JWT)  |
   |  redirect a /solicitante/nueva                                                  |
   |<--------------------------------------------------------------------------------|
```

## 7. Endpoints que debe exponer el backend FastAPI

| Método | Ruta | Función |
|---|---|---|
| `GET` | `/api/auth/claveunica/login` | Genera `state` y `nonce`, los guarda en sesión, construye URL de authorize y responde con `302` |
| `GET` | `/api/auth/claveunica/callback` | Recibe `?code` y `?state`. Valida `state`. Llama a `/token` y `/userinfo`. Crea sesión en backend. Redirige al frontend. |
| `POST` | `/api/auth/logout` | Cierra sesión local y, si corresponde, redirige al logout de Clave Única |
| `GET` | `/api/auth/me` | Devuelve los datos del usuario autenticado al frontend |

## 8. Variables de entorno necesarias en el backend

```env
# Clave Única
CLAVE_UNICA_CLIENT_ID=<entregado por División Gobierno Digital>
CLAVE_UNICA_CLIENT_SECRET=<entregado por División Gobierno Digital>
CLAVE_UNICA_AUTHORIZE_URL=https://accounts.claveunica.gob.cl/openid/authorize/
CLAVE_UNICA_TOKEN_URL=https://accounts.claveunica.gob.cl/openid/token/
CLAVE_UNICA_USERINFO_URL=https://www.claveunica.gob.cl/openid/userinfo/
CLAVE_UNICA_LOGOUT_URL=https://accounts.claveunica.gob.cl/api/v1/accounts/app/logout/
CLAVE_UNICA_REDIRECT_URI=https://<dominio>/api/auth/claveunica/callback
CLAVE_UNICA_SCOPES=openid run name
SESSION_SECRET=<generar uno fuerte>
```

El `client_secret` y `SESSION_SECRET` **nunca** deben quedar en el código ni en el repositorio. Usar variables de entorno o un gestor de secretos.

## 9. Esqueleto mínimo en FastAPI (referencial)

```python
# main.py — ejemplo. Reemplazar por estructura modular en el proyecto real.
import os, secrets, httpx
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from urllib.parse import urlencode

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.environ["SESSION_SECRET"])

CFG = {
    "client_id":     os.environ["CLAVE_UNICA_CLIENT_ID"],
    "client_secret": os.environ["CLAVE_UNICA_CLIENT_SECRET"],
    "authorize":     os.environ["CLAVE_UNICA_AUTHORIZE_URL"],
    "token":         os.environ["CLAVE_UNICA_TOKEN_URL"],
    "userinfo":      os.environ["CLAVE_UNICA_USERINFO_URL"],
    "redirect_uri":  os.environ["CLAVE_UNICA_REDIRECT_URI"],
    "scopes":        os.environ["CLAVE_UNICA_SCOPES"],
}

@app.get("/api/auth/claveunica/login")
def login(request: Request):
    state = secrets.token_urlsafe(24)
    request.session["cu_state"] = state
    params = {
        "client_id": CFG["client_id"],
        "redirect_uri": CFG["redirect_uri"],
        "scope": CFG["scopes"],
        "response_type": "code",
        "state": state,
    }
    return RedirectResponse(f"{CFG['authorize']}?{urlencode(params)}")

@app.get("/api/auth/claveunica/callback")
async def callback(request: Request, code: str, state: str):
    if state != request.session.get("cu_state"):
        raise HTTPException(400, "Estado inválido (posible CSRF)")
    async with httpx.AsyncClient(timeout=10) as cli:
        token_resp = await cli.post(CFG["token"], data={
            "client_id": CFG["client_id"],
            "client_secret": CFG["client_secret"],
            "redirect_uri": CFG["redirect_uri"],
            "grant_type": "authorization_code",
            "code": code,
        })
        token_resp.raise_for_status()
        access_token = token_resp.json()["access_token"]

        user_resp = await cli.get(CFG["userinfo"],
                                  headers={"Authorization": f"Bearer {access_token}"})
        user_resp.raise_for_status()
        user = user_resp.json()
        # user contiene al menos: sub, RolUnico { numero, DV, tipo }, name { nombres, apellidos }

    request.session["user"] = {
        "rut": f"{user['RolUnico']['numero']}-{user['RolUnico']['DV']}",
        "nombres": " ".join(user["name"]["nombres"]),
        "apellidos": " ".join(user["name"]["apellidos"]),
    }
    return RedirectResponse("/solicitante/nueva")
```

## 10. Conexión desde el frontend React

El frontend **no maneja directamente** el `client_secret` ni los tokens. Solo:

1. Botón "Ingresar con Clave Única" → redirige a `/api/auth/claveunica/login` (backend).
2. Tras el callback, el backend redirige al frontend con sesión iniciada (cookie httpOnly o JWT).
3. Frontend llama a `/api/auth/me` para obtener los datos del usuario y mostrarlos.

En el mock actual (`AuthContext.jsx`) el botón llama a `loginClaveUnica()` que simula el flujo. Cuando exista backend, reemplazar:

```jsx
const loginClaveUnica = () => {
  window.location.href = '/api/auth/claveunica/login'
}
```

## 11. Seguridad — checklist

- [ ] `state` aleatorio y validado en el callback (prevención CSRF).
- [ ] `nonce` en el flujo cuando se valide el `id_token`.
- [ ] Sesión backend con cookie `Secure`, `HttpOnly`, `SameSite=Lax` o `Strict`.
- [ ] `client_secret` y `session_secret` en variables de entorno, **nunca** en repositorio.
- [ ] HTTPS obligatorio en producción.
- [ ] Logs de autenticación sin exponer tokens.
- [ ] Manejo de errores: si Clave Única devuelve error, mostrar mensaje claro al usuario.
- [ ] No persistir el `access_token` en el navegador.
- [ ] Cierre de sesión: limpiar sesión backend + llamar al logout de Clave Única.

## 12. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Trámite del convenio demora más que el plazo del proyecto | **Iniciar el día 1**. Si se atrasa, evaluar autenticación temporal con correo/contraseña hasta que llegue la habilitación. |
| Cambio de URL de redirección en producción | Solicitar a División Gobierno Digital habilitar tanto la URL de QA como la de producción desde el inicio. |
| Cambios en las URLs de Clave Única (handover de Gobierno Digital) | Validar contra `well-known/openid-configuration` antes de hardcodear URLs. |
| Datos del usuario inconsistentes (Clave Única vs lo que el Solicitante ingresa) | El sistema toma **RUT y nombres de Clave Única** (datos verificados) y **correo/teléfono/dirección/coordenadas** los ingresa el Solicitante. |

## 13. Siguientes acciones inmediatas

1. **Hoy:** confirmar contraparte en CONAF para gestionar el convenio.
2. **Esta semana:** revisar el manual oficial en `INSUMO/clave_unica/_Manual de ClaveÚnica ⭐⭐.docx` y completar/corregir los endpoints exactos.
3. **Esta semana:** preparar el oficio formal a la División de Gobierno Digital.
4. **Antes del desarrollo:** definir las URLs definitivas de QA y producción (depende de la provisión del ambiente on-premise — ver §8.2 de [`REQUISITOS.md`](REQUISITOS.md)).

---

**Documentos relacionados:**
- [`REQUISITOS.md`](REQUISITOS.md)
- [`PROPUESTA_PROTECCION_DATOS.md`](PROPUESTA_PROTECCION_DATOS.md)
- [`INSUMO/clave_unica/_Manual de ClaveÚnica ⭐⭐.docx`](INSUMO/clave_unica/)
