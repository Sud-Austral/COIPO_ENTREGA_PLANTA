// Catálogos compartidos — fuente de verdad: tabla_insumo/*.xlsx
// El archivo catalogo.generated.json lo produce `python tabla_insumo/generar_insumos.py`.
// NO editar los catálogos a mano aquí: editar el Excel y regenerar.
// Los datos demo (usuario Clave Única, internos, solicitudes) NO son catálogo
// y se mantienen en este archivo.

import catalogo from '../data/catalogo.generated.json'

// --- Catálogos (desde tabla_insumo, compartidos con COIPO_INVENTARIO_PLANTA) ---
export const regiones = catalogo.regiones
export const viveros = catalogo.viveros
export const especies = catalogo.especies
export const stock = catalogo.stock
export const parametrosRegion = catalogo.parametrosRegion

// Usuario simulado para Solicitante (lo que vendría de Clave Única)
export const mockClaveUnicaUser = {
  rut: '12345678',
  rutDv: '9',
  nombre1: 'María',
  nombre2: 'Soledad',
  apellido1: 'González',
  apellido2: 'Pérez',
  correo: 'maria.gonzalez@example.cl',
  telefono: '+56912345678',
  direccion: 'Av. Libertador 1234, Buin',
  fechaNacimiento: '1985-03-15',
  edad: 41,
  genero: 'Femenino',
  discapacidad: false,
  puebloOriginario: false,
}

// Catálogo de usuarios internos para login mock.
// IDs de vivero ajustados al listado expandido.
export const mockInternos = [
  { email: 'enc.buin@conaf.cl',        password: 'demo', rol: 'encargado',     nombre: 'Juan Pérez',     viveroId: 35 },
  { email: 'enc.curacautin@conaf.cl',  password: 'demo', rol: 'encargado',     nombre: 'Pamela Soto',    viveroId: 20 },
  { email: 'enc.huillilemu@conaf.cl',  password: 'demo', rol: 'encargado',     nombre: 'Roberto Aguilar', viveroId: 22 },
  { email: 'enc.chomedahue@conaf.cl',  password: 'demo', rol: 'encargado',     nombre: 'Felipe Sandoval', viveroId: 13 },
  { email: 'consolidador@conaf.cl',    password: 'demo', rol: 'consolidador',  nombre: 'Ana Ramírez' },
  { email: 'admin@conaf.cl',           password: 'demo', rol: 'administrador', nombre: 'Carlos Soto' },
]

// Estados posibles: recibida | aceptada | rechazada | lista_retirar | retirada | vencida | cancelada
// IDs de vivero referencian el listado expandido (Buin=35, Clarillo=36, Chomedahue=13, Curacautín=20, Huillilemu=22).
export const solicitudes = [
  {
    id: 1001,
    solicitanteRut: '12.345.678-9',
    solicitanteNombre: 'María Soledad González Pérez',
    correo: 'maria.gonzalez@example.cl',
    telefono: '+56 9 1234 5678',
    direccion: 'Av. Libertador 1234, Buin',
    coordenadas: { lat: -33.7320, lng: -70.7445 },
    regionId: 16,
    viveroId: 35,
    especies: [
      { especieId: 1, cantidad: 20 },
      { especieId: 7, cantidad: 30 },
    ],
    estado: 'lista_retirar',
    fechaCreacion: '2026-05-15',
    fechaAceptacion: '2026-05-17',
    fechaListaRetirar: '2026-05-20',
    fechaVencimiento: '2026-06-19',
  },
  {
    id: 1002,
    solicitanteRut: '15.987.654-K',
    solicitanteNombre: 'Pedro Antonio Sepúlveda Vargas',
    correo: 'pedro.sepulveda@example.cl',
    telefono: '+56 9 8765 4321',
    direccion: 'Camino Rural s/n, Pirque',
    coordenadas: { lat: -33.6745, lng: -70.5712 },
    regionId: 16,
    viveroId: 36,
    especies: [
      { especieId: 1, cantidad: 15 },
      { especieId: 3, cantidad: 10 },
      { especieId: 10, cantidad: 25 },
    ],
    estado: 'recibida',
    fechaCreacion: '2026-05-25',
  },
  {
    id: 1003,
    solicitanteRut: '18.222.333-4',
    solicitanteNombre: 'Carla Andrea Muñoz Riquelme',
    correo: 'carla.munoz@example.cl',
    telefono: '+56 9 2233 4455',
    direccion: 'Calle El Roble 456, Curacautín',
    coordenadas: { lat: -38.4408, lng: -71.8767 },
    regionId: 11,
    viveroId: 20,
    especies: [
      { especieId: 13, cantidad: 50 },
      { especieId: 21, cantidad: 5 },
    ],
    estado: 'retirada',
    fechaCreacion: '2026-04-10',
    fechaAceptacion: '2026-04-12',
    fechaListaRetirar: '2026-04-18',
    fechaRetiro: '2026-04-25',
    fechaVencimiento: '2026-05-18',
    comprobante: 'CE-2026-0003',
  },
  {
    id: 1004,
    solicitanteRut: '20.111.222-3',
    solicitanteNombre: 'José Manuel Reyes Cárcamo',
    correo: 'jose.reyes@example.cl',
    telefono: '+56 9 7766 5544',
    direccion: 'Pasaje Los Aromos 89, Mariquina',
    coordenadas: { lat: -39.5400, lng: -72.9530 },
    regionId: 12,
    viveroId: 22,
    especies: [
      { especieId: 18, cantidad: 40 },
      { especieId: 20, cantidad: 20 },
    ],
    estado: 'aceptada',
    fechaCreacion: '2026-05-20',
    fechaAceptacion: '2026-05-22',
  },
  {
    id: 1005,
    solicitanteRut: '14.555.666-7',
    solicitanteNombre: 'Patricia Elena Ortiz Bahamondes',
    correo: 'patricia.ortiz@example.cl',
    telefono: '+56 9 3344 5566',
    direccion: 'Av. Centenario 220, Santa Cruz',
    coordenadas: { lat: -34.6395, lng: -71.3641 },
    regionId: 7,
    viveroId: 13,
    especies: [
      { especieId: 1,  cantidad: 30 },
      { especieId: 6,  cantidad: 20 },
    ],
    estado: 'vencida',
    fechaCreacion: '2026-03-05',
    fechaAceptacion: '2026-03-07',
    fechaListaRetirar: '2026-03-12',
    fechaVencimiento: '2026-04-11',
  },
]
