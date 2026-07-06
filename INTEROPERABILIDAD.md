# Interoperabilidad COIPO — ENTREGA ↔ INVENTARIO

Documento del contrato compartido entre las dos plataformas:

- **COIPO_ENTREGA_PLANTA** — portal del solicitante del Programa de Arborización.
- **COIPO_INVENTARIO_PLANTA** — sistema de inventario/producción de viveros (maestro de stock).

> **Fase actual: MOCK.** Ambas apps son frontends React + Vite con backend simulado.
> El objetivo de esta fase es **fijar el contrato compartido** (mismos catálogos e IDs,
> mismo modelo de stock) para que, cuando exista la **base de datos compartida**, la
> integración real se logre reemplazando solo la capa de datos, sin tocar la UI.

---

## 1. Fuente de verdad única: `tabla_insumo/`

Todos los insumos viven en `COIPO_ENTREGA_PLANTA/tabla_insumo/` como Excel editables:

| Archivo | Contenido | Columnas |
|---|---|---|
| `region_comuna_vivero.xlsx` | Tabla región → comuna → vivero | `region_id, region, provincia, comuna, vivero_id, vivero, codigo, encargado_email` |
| `plantas.xlsx` | Catálogo de especies | `especie_id, nombre_comun, nombre_cientifico, origen, codigo` |
| `stock.xlsx` | Stock disponible (maestro) | `vivero_id, especie_id, cantidad_disponible` |
| `parametros_region.xlsx` | Parámetros por región | `region_id, plazo_retiro_dias, max_especies, max_unidades, max_solicitudes_anio` |

### Generador

`tabla_insumo/generar_insumos.py` (Python + `openpyxl`):

```bash
# Crea/repuebla los .xlsx desde los datos canónicos y emite el catálogo JSON:
python tabla_insumo/generar_insumos.py --seed

# Solo re-emite el JSON leyendo los .xlsx (tras editarlos a mano):
python tabla_insumo/generar_insumos.py
```

Emite el mismo `catalogo.generated.json` en **ambos** frontends (este es el contrato):

- `COIPO_ENTREGA_PLANTA/frontend/src/data/catalogo.generated.json`
- `COIPO_INVENTARIO_PLANTA/frontend/src/data/catalogo.generated.json`

> Tras editar cualquier `.xlsx`, **re-ejecutar el generador** para refrescar el JSON
> en los dos repos. El JSON no se edita a mano.

---

## 2. Catálogo compartido (mismos IDs)

`catalogo.generated.json` expone `regiones`, `viveros`, `especies`, `stock`,
`parametrosRegion`. Las **claves compartidas** entre apps son numéricas:

- `region_id` (1–17), `vivero_id` (1–38), `especie_id` (1–41).
- Además cada vivero/especie lleva un `codigo` string estable
  (`VIV-BUIN`, `ESP-QUILLAY`).

Cómo lo consume cada app:

| App | viveros/especies | Identidad |
|---|---|---|
| ENTREGA | `frontend/src/api/mockData.js` re-exporta el catálogo | usa `id` numérico |
| INVENTARIO | `infrastructure/mock/data/{viveros,especies}.js` mapean el catálogo | usa `id = codigo` string + `viveroId`/`especieId` numéricos para el stock |

Así, un vivero o especie **significa lo mismo en ambas plataformas**. El catálogo de
especies es un **superset**: incluye las especies propias de INVENTARIO (Boldo,
Tamarugo) además de las 39 de ENTREGA.

---

## 3. Flujo región → comuna → vivero (ENTREGA)

El solicitante elige **región**, luego **comuna**, y el **vivero se asigna
automáticamente** desde `region_comuna_vivero.xlsx`:

- `api.getComunas({ regionId })` → comunas con vivero en esa región.
- `api.getViveroPorComuna({ regionId, comuna })` → vivero(s) de esa comuna.
  Si hay uno solo, se autoselecciona; si hay varios (p. ej. **La Unión**: Mashue +
  Llancacura), aparece un sub-selector.

Implementado en `frontend/src/pages/solicitante/NuevaSolicitud.jsx`.

---

## 4. Parámetros por región (admin)

`parametros_region.xlsx` siembra los límites por región. El administrador los edita en
**Administración → Parámetros** (`frontend/src/pages/admin/Admin.jsx`):

- `frontend/src/api/parametros.js`: `getParametros(regionId)` = semilla ∪ override;
  `setParametros` / `resetParametros` persisten en `localStorage['coipo:parametros_region']`.
- El flujo de Nueva Solicitud respeta los límites de la **región elegida**
  (máx. especies, máx. unidades, máx. solicitudes/persona/año, plazo de retiro).

---

## 5. Stock compartido (contrato, fase mock)

Modelo único por `(vivero_id, especie_id)`: `{ disponible, comprometido }`, **sembrado
desde `stock.xlsx`**.

- ENTREGA: `frontend/src/api/stockBridge.js` — `crearSolicitud` reserva
  (disponible→comprometido); rechazo/cancelación/vencimiento libera; retiro = egreso
  definitivo. Lo consume `frontend/src/api/client.js`.
- INVENTARIO: `frontend/src/data/stockBridge.js` (mismo contrato y misma clave
  `localStorage['coipo:stock']`) — la página de Inventario muestra la columna
  **"Programa (Entrega)"** con el disponible compartido.

**Alcance:** la sincronización en vivo entre apps **no** es objetivo de esta fase.
Bajo un mismo origin (GitHub Pages de producción: `https://<user>.github.io`) el
`localStorage` se comparte y la sincronización ocurre; en desarrollo (puertos
distintos) cada app parte de la **misma semilla**. La sincronización real llega con la
**base de datos compartida**, que reemplazará a `stockBridge` sin cambiar la UI.

---

## 6. Costura para la base de datos compartida (futuro)

Toda la lógica de datos vive detrás de funciones async:

- ENTREGA: `frontend/src/api/client.js` (+ `stockBridge.js`, `parametros.js`).
- INVENTARIO: repositorios/casos de uso (arquitectura hexagonal) + `data/stockBridge.js`.

Migrar a la BD compartida = cambiar la **implementación** de esas funciones por llamadas
HTTP/SQL. Los componentes de UI no cambian.

---

## 7. Cómo verificar

1. `python tabla_insumo/generar_insumos.py --seed` → abrir los `.xlsx` y el JSON.
2. ENTREGA `npm run dev`: flujo región → comuna → vivero auto; crear solicitud y ver el
   stock bajar; en Admin editar parámetros de una región y comprobar que el flujo los respeta.
3. INVENTARIO `npm run dev`: mismos 38 viveros / 41 especies; columna
   "Programa (Entrega)" reflejando el stock compartido.
