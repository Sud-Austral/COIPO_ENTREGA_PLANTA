# Frontend — Sistema de Entrega de Plantas, Programa de Arborización CONAF

Aplicación React (Vite) con mock data en memoria. Todavía **no se conecta** al backend FastAPI; la capa de API está aislada en [`src/api/client.js`](src/api/client.js) para reemplazarse cuando esté disponible.

## Stack

- React 19 + React Router 7
- Vite 8
- JavaScript (sin TypeScript)
- CSS plano en `src/index.css`

## Setup

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Credenciales de demo

En la pantalla de login:

- **Solicitante**: botón "Ingresar con Clave Única" — simula el flujo OIDC y carga un usuario de prueba.
- **Encargado** (Vivero Buin): `enc.buin@conaf.cl` / `demo`
- **Encargado** (Curacautín): `enc.curacautin@conaf.cl` / `demo`
- **Consolidador**: `consolidador@conaf.cl` / `demo`
- **Administrador**: `admin@conaf.cl` / `demo`

## Estructura

```
src/
├── api/
│   ├── client.js       ← API mock; reemplazar por fetch al backend
│   └── mockData.js     ← datos en memoria
├── components/
│   ├── Layout.jsx      ← sidebar + nav por rol
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx ← estado de sesión + login/logout
├── pages/
│   ├── Login.jsx
│   ├── solicitante/
│   │   ├── NuevaSolicitud.jsx
│   │   ├── MisSolicitudes.jsx
│   │   └── MisDatos.jsx
│   ├── encargado/
│   │   ├── Bandeja.jsx
│   │   ├── DetalleSolicitud.jsx
│   │   └── Stock.jsx
│   ├── consolidador/
│   │   └── Dashboard.jsx
│   └── admin/
│       └── Admin.jsx
├── App.jsx             ← router
├── main.jsx
└── index.css
```

## Flujos cubiertos

- Solicitante: login → región/vivero → catálogo filtrado por stock → selección (máx 3 especies / 100 unidades) → coordenadas → consentimiento → enviar.
- Solicitante: ver historial, cancelar solicitud activa, vista "Mis datos" (Ley 21.719).
- Encargado: bandeja filtrable por estado, ver detalle, aceptar/rechazar, marcar lista para retirar (notificación simulada), registrar retiro (genera correlativo de comprobante), marcar vencida; ver stock disponible.
- Consolidador: KPIs (total, retiradas, tasa de retiro, tiempo de proceso), filtros, exportar a CSV.
- Administrador: vista de especies, viveros, usuarios y parámetros (sin alta/baja en V1 del mock).

## Cuando se conecte el backend

1. Reemplazar las funciones en [`src/api/client.js`](src/api/client.js) por `fetch` a los endpoints FastAPI.
2. Reemplazar `loginClaveUnica()` en [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx) por un `window.location.href = '/api/auth/claveunica/login'`. Ver [`../CLAVE_UNICA.md`](../CLAVE_UNICA.md).
3. Reemplazar `loginInterno()` por un `POST /api/auth/login` que devuelva sesión.
4. Implementar la descarga real del PDF de comprobante y la exportación Excel desde el backend.

## Limitaciones actuales del mock

- El estado se pierde al recargar (excepto la sesión, que persiste en localStorage).
- Las notificaciones por correo son `alert()` simulados.
- El comprobante PDF es solo un correlativo en pantalla.
- No hay validaciones de seguridad reales (RBAC se evalúa solo en cliente).
