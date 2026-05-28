// Mock data — reemplazar por llamadas reales a la API cuando el backend esté disponible.
// Listado de viveros y especies basado en los catálogos del SIGI GBCC 8 2026.

export const regiones = [
  { id: 1,  nombre: 'Arica y Parinacota' },
  { id: 2,  nombre: 'Tarapacá' },
  { id: 3,  nombre: 'Antofagasta' },
  { id: 4,  nombre: 'Atacama' },
  { id: 5,  nombre: 'Coquimbo' },
  { id: 6,  nombre: 'Valparaíso' },
  { id: 7,  nombre: "Libertador General Bernardo O'Higgins" },
  { id: 8,  nombre: 'Maule' },
  { id: 9,  nombre: 'Ñuble' },
  { id: 10, nombre: 'Biobío' },
  { id: 11, nombre: 'La Araucanía' },
  { id: 12, nombre: 'Los Ríos' },
  { id: 13, nombre: 'Los Lagos' },
  { id: 14, nombre: 'Aysén' },
  { id: 15, nombre: 'Magallanes y La Antártica Chilena' },
  { id: 16, nombre: 'Metropolitana de Santiago' },
  { id: 17, nombre: 'Isla de Pascua' },
]

export const viveros = [
  // Arica y Parinacota
  { id: 1,  nombre: 'Vivero Las Maitas',                              regionId: 1,  comuna: 'Arica',           encargadoEmail: 'enc.lasmaitas@conaf.cl' },
  { id: 2,  nombre: 'Vivero Putre',                                   regionId: 1,  comuna: 'Putre',           encargadoEmail: 'enc.putre@conaf.cl' },
  // Tarapacá
  { id: 3,  nombre: 'Vivero Alejandro Caipa',                         regionId: 2,  comuna: 'Pozo Almonte',    encargadoEmail: 'enc.caipa@conaf.cl' },
  // Antofagasta
  { id: 4,  nombre: 'Vivero Regional Antofagasta',                    regionId: 3,  comuna: 'Antofagasta',     encargadoEmail: 'enc.antofagasta@conaf.cl' },
  { id: 5,  nombre: 'Vivero Quillagua',                               regionId: 3,  comuna: 'María Elena',     encargadoEmail: 'enc.quillagua@conaf.cl' },
  // Atacama
  { id: 6,  nombre: 'Vivero Copiapó',                                 regionId: 4,  comuna: 'Copiapó',         encargadoEmail: 'enc.copiapo@conaf.cl' },
  { id: 7,  nombre: 'Vivero Vallenar',                                regionId: 4,  comuna: 'Vallenar',        encargadoEmail: 'enc.vallenar@conaf.cl' },
  // Coquimbo
  { id: 8,  nombre: 'Vivero Illapel',                                 regionId: 5,  comuna: 'Illapel',         encargadoEmail: 'enc.illapel@conaf.cl' },
  // Valparaíso
  { id: 9,  nombre: 'Vivero Archipiélago Juan Fernández',             regionId: 6,  comuna: 'Juan Fernández',  encargadoEmail: 'enc.juanfernandez@conaf.cl' },
  { id: 10, nombre: 'Vivero Reserva Nacional Lago Peñuelas',          regionId: 6,  comuna: 'Valparaíso',      encargadoEmail: 'enc.penuelas@conaf.cl' },
  { id: 11, nombre: 'Vivero La Ligua',                                regionId: 6,  comuna: 'La Ligua',        encargadoEmail: 'enc.laligua@conaf.cl' },
  { id: 12, nombre: 'Vivero Llay Llay',                               regionId: 6,  comuna: 'Llay Llay',       encargadoEmail: 'enc.llayllay@conaf.cl' },
  // O'Higgins
  { id: 13, nombre: 'Vivero Chomedahue',                              regionId: 7,  comuna: 'Santa Cruz',      encargadoEmail: 'enc.chomedahue@conaf.cl' },
  // Maule
  { id: 14, nombre: 'Centro de Acopio Pantanillo',                    regionId: 8,  comuna: 'Constitución',    encargadoEmail: 'enc.pantanillo@conaf.cl' },
  { id: 15, nombre: 'Centro Experimental Cauquenes',                  regionId: 8,  comuna: 'Cauquenes',       encargadoEmail: 'enc.cauquenes@conaf.cl' },
  // Ñuble
  { id: 16, nombre: 'Vivero Centro de Semillas, Genética y Entomología', regionId: 9, comuna: 'Chillán',       encargadoEmail: 'enc.chillan@conaf.cl' },
  // Biobío
  { id: 17, nombre: 'Base Brigada La Granja',                         regionId: 10, comuna: 'Cañete',          encargadoEmail: 'enc.lagranja@conaf.cl' },
  { id: 18, nombre: 'Centro de Acondicionamiento Duqueco',            regionId: 10, comuna: 'Los Ángeles',     encargadoEmail: 'enc.duqueco@conaf.cl' },
  { id: 19, nombre: 'Liceo Nueva Zelandia',                           regionId: 10, comuna: 'Santa Juana',     encargadoEmail: 'enc.nuevazelandia@conaf.cl' },
  // La Araucanía
  { id: 20, nombre: 'Vivero Curacautín',                              regionId: 11, comuna: 'Curacautín',      encargadoEmail: 'enc.curacautin@conaf.cl' },
  { id: 21, nombre: 'Vivero Imperial',                                regionId: 11, comuna: 'Nueva Imperial',  encargadoEmail: 'enc.imperial@conaf.cl' },
  // Los Ríos
  { id: 22, nombre: 'Vivero Huillilemu',                              regionId: 12, comuna: 'Mariquina',       encargadoEmail: 'enc.huillilemu@conaf.cl' },
  { id: 23, nombre: 'Vivero San Juan',                                regionId: 12, comuna: 'Panguipulli',     encargadoEmail: 'enc.sanjuan@conaf.cl' },
  { id: 24, nombre: 'Vivero Chabranco',                               regionId: 12, comuna: 'Futrono',         encargadoEmail: 'enc.chabranco@conaf.cl' },
  { id: 25, nombre: 'Vivero Liceo Técnico de Ignao',                  regionId: 12, comuna: 'Lago Ranco',      encargadoEmail: 'enc.ignao@conaf.cl' },
  { id: 26, nombre: 'Vivero Mashue',                                  regionId: 12, comuna: 'La Unión',        encargadoEmail: 'enc.mashue@conaf.cl' },
  { id: 27, nombre: 'Vivero Llancacura',                              regionId: 12, comuna: 'La Unión',        encargadoEmail: 'enc.llancacura@conaf.cl' },
  // Los Lagos
  { id: 28, nombre: 'Vivero Butalcura',                               regionId: 13, comuna: 'Dalcahue',        encargadoEmail: 'enc.butalcura@conaf.cl' },
  // Aysén
  { id: 29, nombre: 'Vivero Augusto Falcón',                          regionId: 14, comuna: 'Chile Chico',     encargadoEmail: 'enc.augustofalcon@conaf.cl' },
  { id: 30, nombre: 'Centro de Acondicionamiento Cochrane',           regionId: 14, comuna: 'Cochrane',        encargadoEmail: 'enc.cochrane@conaf.cl' },
  { id: 31, nombre: 'Vivero El Mallín',                               regionId: 14, comuna: 'Aysén',           encargadoEmail: 'enc.mallin@conaf.cl' },
  { id: 32, nombre: 'Vivero Las Lengas',                              regionId: 14, comuna: 'Coyhaique',       encargadoEmail: 'enc.laslengas@conaf.cl' },
  // Magallanes
  { id: 33, nombre: 'Vivero Dorotea',                                 regionId: 15, comuna: 'Natales',         encargadoEmail: 'enc.dorotea@conaf.cl' },
  { id: 34, nombre: 'Vivero Río de Los Ciervos',                      regionId: 15, comuna: 'Punta Arenas',    encargadoEmail: 'enc.ciervos@conaf.cl' },
  // Metropolitana
  { id: 35, nombre: 'Vivero Buin',                                    regionId: 16, comuna: 'Buin',            encargadoEmail: 'enc.buin@conaf.cl' },
  { id: 36, nombre: 'Vivero Reserva Nacional Río Clarillo',           regionId: 16, comuna: 'Pirque',          encargadoEmail: 'enc.clarillo@conaf.cl' },
  { id: 37, nombre: 'Vivero San Pedro',                               regionId: 16, comuna: 'San Pedro',       encargadoEmail: 'enc.sanpedro@conaf.cl' },
  // Isla de Pascua
  { id: 38, nombre: 'Vivero Mataveri Otai',                           regionId: 17, comuna: 'Isla de Pascua',  encargadoEmail: 'enc.matavari@conaf.cl' },
]

export const especies = [
  // Esclerófilas / zona central (Mediterránea)
  { id: 1,  nombreCientifico: 'Quillaja saponaria',     nombreComun: 'Quillay',                 origen: 'Nativo' },
  { id: 2,  nombreCientifico: 'Cryptocarya alba',       nombreComun: 'Peumo',                   origen: 'Nativo' },
  { id: 3,  nombreCientifico: 'Lithraea caustica',      nombreComun: 'Litre',                   origen: 'Nativo' },
  { id: 4,  nombreCientifico: 'Schinus molle',          nombreComun: 'Pimiento',                origen: 'Nativo' },
  { id: 5,  nombreCientifico: 'Schinus latifolius',     nombreComun: 'Molle',                   origen: 'Nativo' },
  { id: 6,  nombreCientifico: 'Maytenus boaria',        nombreComun: 'Maitén',                  origen: 'Nativo' },
  { id: 7,  nombreCientifico: 'Acacia caven',           nombreComun: 'Espino',                  origen: 'Nativo' },
  { id: 8,  nombreCientifico: 'Azara dentata',          nombreComun: 'Corcolén',                origen: 'Nativo' },
  { id: 9,  nombreCientifico: 'Citronella mucronata',   nombreComun: 'Naranjillo',              origen: 'Nativo' },
  { id: 10, nombreCientifico: 'Crinodendron patagua',   nombreComun: 'Patagua',                 origen: 'Nativo' },
  { id: 11, nombreCientifico: 'Beilschmiedia miersii',  nombreComun: 'Belloto del norte',       origen: 'Nativo Conservación' },
  { id: 12, nombreCientifico: 'Beilschmiedia berteroana', nombreComun: 'Belloto del sur',       origen: 'Nativo Conservación' },
  // Bosque caducifolio / templado
  { id: 13, nombreCientifico: 'Nothofagus obliqua',     nombreComun: 'Roble',                   origen: 'Nativo' },
  { id: 14, nombreCientifico: 'Nothofagus alessandrii', nombreComun: 'Ruil',                    origen: 'Nativo Conservación' },
  { id: 15, nombreCientifico: 'Nothofagus dombeyi',     nombreComun: 'Coihue',                  origen: 'Nativo' },
  { id: 16, nombreCientifico: 'Nothofagus pumilio',     nombreComun: 'Lenga',                   origen: 'Nativo' },
  { id: 17, nombreCientifico: 'Nothofagus antarctica',  nombreComun: 'Ñirre',                   origen: 'Nativo' },
  { id: 18, nombreCientifico: 'Persea lingue',          nombreComun: 'Lingue',                  origen: 'Nativo' },
  { id: 19, nombreCientifico: 'Aristotelia chilensis',  nombreComun: 'Maqui',                   origen: 'Nativo' },
  { id: 20, nombreCientifico: 'Drimys winteri',         nombreComun: 'Canelo',                  origen: 'Nativo Conservación' },
  { id: 21, nombreCientifico: 'Araucaria araucana',     nombreComun: 'Araucaria',               origen: 'Nativo Conservación' },
  { id: 22, nombreCientifico: 'Austrocedrus chilensis', nombreComun: 'Ciprés de la Cordillera', origen: 'Nativo Conservación' },
  { id: 23, nombreCientifico: 'Aextoxicon punctatum',   nombreComun: 'Olivillo',                origen: 'Nativo Conservación' },
  { id: 24, nombreCientifico: 'Luma apiculata',         nombreComun: 'Arrayán',                 origen: 'Nativo' },
  { id: 25, nombreCientifico: 'Amomyrtus luma',         nombreComun: 'Luma',                    origen: 'Nativo' },
  { id: 26, nombreCientifico: 'Amomyrtus meli',         nombreComun: 'Meli',                    origen: 'Nativo' },
  { id: 27, nombreCientifico: 'Gevuina avellana',       nombreComun: 'Avellano chileno',        origen: 'Nativo' },
  { id: 28, nombreCientifico: 'Embothrium coccineum',   nombreComun: 'Notro',                   origen: 'Nativo' },
  { id: 29, nombreCientifico: 'Berberis microphylla',   nombreComun: 'Calafate',                origen: 'Nativo' },
  // Norte / zonas áridas
  { id: 30, nombreCientifico: 'Prosopis chilensis',     nombreComun: 'Algarrobo chileno',       origen: 'Nativo' },
  { id: 31, nombreCientifico: 'Geoffroea decorticans',  nombreComun: 'Chañar',                  origen: 'Nativo' },
  { id: 32, nombreCientifico: 'Caesalpinia spinosa',    nombreComun: 'Tara',                    origen: 'Nativo' },
  { id: 33, nombreCientifico: 'Atriplex atacamensis',   nombreComun: 'Cachiyuyo',               origen: 'Nativo' },
  { id: 34, nombreCientifico: 'Adesmia confusa',        nombreComun: 'Palhuén',                 origen: 'Nativo' },
  { id: 35, nombreCientifico: 'Balsamocarpon brevifolium', nombreComun: 'Algarrobilla',         origen: 'Nativo' },
  { id: 36, nombreCientifico: 'Azorella compacta',      nombreComun: 'Yareta',                  origen: 'Nativo Conservación' },
  // Conservación especiales
  { id: 37, nombreCientifico: 'Avellanita bustillosii', nombreComun: 'Avellanita',              origen: 'Nativo Conservación' },
  { id: 38, nombreCientifico: 'Sophora cassioides',     nombreComun: 'Pelú',                    origen: 'Nativo' },
  { id: 39, nombreCientifico: 'Sophora toromiro',       nombreComun: 'Toromiro',                origen: 'Nativo Conservación' },
]

// Stock por vivero — distribuido según zona climática.
// Cada entrada: { viveroId, especieId, cantidadDisponible }
export const stock = [
  // === Norte árido (Arica, Tarapacá, Antofagasta) ===
  // Vivero 1 — Las Maitas (Arica)
  { viveroId: 1, especieId: 30, cantidadDisponible: 180 },
  { viveroId: 1, especieId: 31, cantidadDisponible: 220 },
  { viveroId: 1, especieId: 33, cantidadDisponible: 340 },
  { viveroId: 1, especieId: 32, cantidadDisponible: 90 },
  // Vivero 2 — Putre (Arica, altiplano)
  { viveroId: 2, especieId: 33, cantidadDisponible: 120 },
  { viveroId: 2, especieId: 36, cantidadDisponible: 45 },
  { viveroId: 2, especieId: 34, cantidadDisponible: 80 },
  // Vivero 3 — Alejandro Caipa (Tarapacá)
  { viveroId: 3, especieId: 30, cantidadDisponible: 260 },
  { viveroId: 3, especieId: 31, cantidadDisponible: 310 },
  { viveroId: 3, especieId: 33, cantidadDisponible: 420 },
  { viveroId: 3, especieId: 32, cantidadDisponible: 75 },
  // Vivero 4 — Antofagasta
  { viveroId: 4, especieId: 30, cantidadDisponible: 140 },
  { viveroId: 4, especieId: 33, cantidadDisponible: 230 },
  { viveroId: 4, especieId: 34, cantidadDisponible: 95 },
  // Vivero 5 — Quillagua
  { viveroId: 5, especieId: 30, cantidadDisponible: 80 },
  { viveroId: 5, especieId: 33, cantidadDisponible: 150 },

  // === Norte semiárido (Atacama, Coquimbo) ===
  // Vivero 6 — Copiapó
  { viveroId: 6, especieId: 31, cantidadDisponible: 280 },
  { viveroId: 6, especieId: 33, cantidadDisponible: 200 },
  { viveroId: 6, especieId: 34, cantidadDisponible: 120 },
  { viveroId: 6, especieId: 35, cantidadDisponible: 95 },
  // Vivero 7 — Vallenar
  { viveroId: 7, especieId: 31, cantidadDisponible: 240 },
  { viveroId: 7, especieId: 32, cantidadDisponible: 110 },
  { viveroId: 7, especieId: 35, cantidadDisponible: 150 },
  // Vivero 8 — Illapel (Coquimbo)
  { viveroId: 8, especieId: 1,  cantidadDisponible: 320 },
  { viveroId: 8, especieId: 7,  cantidadDisponible: 450 },
  { viveroId: 8, especieId: 30, cantidadDisponible: 180 },
  { viveroId: 8, especieId: 35, cantidadDisponible: 100 },

  // === Zona central (Valparaíso, O'Higgins, Maule, RM) ===
  // Vivero 9 — Juan Fernández
  { viveroId: 9, especieId: 23, cantidadDisponible: 70 },
  { viveroId: 9, especieId: 8,  cantidadDisponible: 50 },
  // Vivero 10 — Lago Peñuelas
  { viveroId: 10, especieId: 1,  cantidadDisponible: 580 },
  { viveroId: 10, especieId: 2,  cantidadDisponible: 410 },
  { viveroId: 10, especieId: 3,  cantidadDisponible: 350 },
  { viveroId: 10, especieId: 6,  cantidadDisponible: 290 },
  { viveroId: 10, especieId: 7,  cantidadDisponible: 220 },
  { viveroId: 10, especieId: 19, cantidadDisponible: 180 },
  // Vivero 11 — La Ligua
  { viveroId: 11, especieId: 1,  cantidadDisponible: 240 },
  { viveroId: 11, especieId: 6,  cantidadDisponible: 180 },
  { viveroId: 11, especieId: 7,  cantidadDisponible: 300 },
  { viveroId: 11, especieId: 11, cantidadDisponible: 60 },
  // Vivero 12 — Llay Llay
  { viveroId: 12, especieId: 1,  cantidadDisponible: 320 },
  { viveroId: 12, especieId: 2,  cantidadDisponible: 260 },
  { viveroId: 12, especieId: 7,  cantidadDisponible: 420 },
  { viveroId: 12, especieId: 11, cantidadDisponible: 40 },
  // Vivero 13 — Chomedahue (O'Higgins)
  { viveroId: 13, especieId: 1,  cantidadDisponible: 800 },
  { viveroId: 13, especieId: 2,  cantidadDisponible: 540 },
  { viveroId: 13, especieId: 3,  cantidadDisponible: 380 },
  { viveroId: 13, especieId: 6,  cantidadDisponible: 420 },
  { viveroId: 13, especieId: 13, cantidadDisponible: 670 },
  { viveroId: 13, especieId: 19, cantidadDisponible: 260 },
  // Vivero 14 — Pantanillo (Maule)
  { viveroId: 14, especieId: 13, cantidadDisponible: 540 },
  { viveroId: 14, especieId: 14, cantidadDisponible: 120 },
  { viveroId: 14, especieId: 18, cantidadDisponible: 280 },
  { viveroId: 14, especieId: 19, cantidadDisponible: 410 },
  // Vivero 15 — Cauquenes
  { viveroId: 15, especieId: 13, cantidadDisponible: 320 },
  { viveroId: 15, especieId: 14, cantidadDisponible: 80 },
  { viveroId: 15, especieId: 24, cantidadDisponible: 150 },
  // Vivero 35 — Buin (RM)
  { viveroId: 35, especieId: 1,  cantidadDisponible: 250 },
  { viveroId: 35, especieId: 2,  cantidadDisponible: 180 },
  { viveroId: 35, especieId: 6,  cantidadDisponible: 150 },
  { viveroId: 35, especieId: 7,  cantidadDisponible: 410 },
  { viveroId: 35, especieId: 8,  cantidadDisponible: 90 },
  { viveroId: 35, especieId: 19, cantidadDisponible: 320 },
  // Vivero 36 — Río Clarillo (RM)
  { viveroId: 36, especieId: 1,  cantidadDisponible: 120 },
  { viveroId: 36, especieId: 2,  cantidadDisponible: 95 },
  { viveroId: 36, especieId: 3,  cantidadDisponible: 200 },
  { viveroId: 36, especieId: 6,  cantidadDisponible: 60 },
  { viveroId: 36, especieId: 10, cantidadDisponible: 45 },
  { viveroId: 36, especieId: 37, cantidadDisponible: 25 },
  // Vivero 37 — San Pedro (RM)
  { viveroId: 37, especieId: 1,  cantidadDisponible: 180 },
  { viveroId: 37, especieId: 7,  cantidadDisponible: 220 },
  { viveroId: 37, especieId: 9,  cantidadDisponible: 80 },

  // === Ñuble — Centro de Semillas ===
  // Vivero 16 — Chillán (semilla y producción)
  { viveroId: 16, especieId: 1,  cantidadDisponible: 1200 },
  { viveroId: 16, especieId: 13, cantidadDisponible: 1500 },
  { viveroId: 16, especieId: 19, cantidadDisponible: 600 },
  { viveroId: 16, especieId: 20, cantidadDisponible: 320 },
  { viveroId: 16, especieId: 21, cantidadDisponible: 180 },
  { viveroId: 16, especieId: 27, cantidadDisponible: 240 },

  // === Biobío ===
  // Vivero 17 — La Granja
  { viveroId: 17, especieId: 13, cantidadDisponible: 280 },
  { viveroId: 17, especieId: 24, cantidadDisponible: 160 },
  { viveroId: 17, especieId: 25, cantidadDisponible: 140 },
  // Vivero 18 — Duqueco
  { viveroId: 18, especieId: 13, cantidadDisponible: 540 },
  { viveroId: 18, especieId: 15, cantidadDisponible: 380 },
  { viveroId: 18, especieId: 18, cantidadDisponible: 260 },
  { viveroId: 18, especieId: 19, cantidadDisponible: 410 },
  // Vivero 19 — Liceo Nueva Zelandia
  { viveroId: 19, especieId: 13, cantidadDisponible: 220 },
  { viveroId: 19, especieId: 25, cantidadDisponible: 180 },
  { viveroId: 19, especieId: 27, cantidadDisponible: 90 },

  // === La Araucanía ===
  // Vivero 20 — Curacautín
  { viveroId: 20, especieId: 13, cantidadDisponible: 1200 },
  { viveroId: 20, especieId: 15, cantidadDisponible: 850 },
  { viveroId: 20, especieId: 18, cantidadDisponible: 800 },
  { viveroId: 20, especieId: 20, cantidadDisponible: 350 },
  { viveroId: 20, especieId: 21, cantidadDisponible: 90 },
  { viveroId: 20, especieId: 22, cantidadDisponible: 120 },
  { viveroId: 20, especieId: 27, cantidadDisponible: 220 },
  // Vivero 21 — Imperial
  { viveroId: 21, especieId: 13, cantidadDisponible: 680 },
  { viveroId: 21, especieId: 15, cantidadDisponible: 420 },
  { viveroId: 21, especieId: 24, cantidadDisponible: 380 },
  { viveroId: 21, especieId: 27, cantidadDisponible: 180 },

  // === Los Ríos ===
  // Vivero 22 — Huillilemu
  { viveroId: 22, especieId: 13, cantidadDisponible: 950 },
  { viveroId: 22, especieId: 15, cantidadDisponible: 720 },
  { viveroId: 22, especieId: 18, cantidadDisponible: 470 },
  { viveroId: 22, especieId: 20, cantidadDisponible: 280 },
  { viveroId: 22, especieId: 23, cantidadDisponible: 220 },
  { viveroId: 22, especieId: 25, cantidadDisponible: 310 },
  // Vivero 23 — San Juan
  { viveroId: 23, especieId: 13, cantidadDisponible: 540 },
  { viveroId: 23, especieId: 20, cantidadDisponible: 230 },
  { viveroId: 23, especieId: 24, cantidadDisponible: 280 },
  // Vivero 24 — Chabranco
  { viveroId: 24, especieId: 13, cantidadDisponible: 420 },
  { viveroId: 24, especieId: 15, cantidadDisponible: 380 },
  { viveroId: 24, especieId: 25, cantidadDisponible: 290 },
  // Vivero 25 — Liceo Técnico de Ignao
  { viveroId: 25, especieId: 13, cantidadDisponible: 180 },
  { viveroId: 25, especieId: 24, cantidadDisponible: 150 },
  // Vivero 26 — Mashue
  { viveroId: 26, especieId: 13, cantidadDisponible: 320 },
  { viveroId: 26, especieId: 18, cantidadDisponible: 240 },
  { viveroId: 26, especieId: 25, cantidadDisponible: 200 },
  // Vivero 27 — Llancacura
  { viveroId: 27, especieId: 13, cantidadDisponible: 280 },
  { viveroId: 27, especieId: 20, cantidadDisponible: 180 },
  { viveroId: 27, especieId: 23, cantidadDisponible: 140 },

  // === Los Lagos ===
  // Vivero 28 — Butalcura (Chiloé)
  { viveroId: 28, especieId: 15, cantidadDisponible: 480 },
  { viveroId: 28, especieId: 20, cantidadDisponible: 350 },
  { viveroId: 28, especieId: 23, cantidadDisponible: 280 },
  { viveroId: 28, especieId: 24, cantidadDisponible: 320 },
  { viveroId: 28, especieId: 28, cantidadDisponible: 190 },

  // === Aysén ===
  // Vivero 29 — Augusto Falcón
  { viveroId: 29, especieId: 16, cantidadDisponible: 420 },
  { viveroId: 29, especieId: 17, cantidadDisponible: 380 },
  { viveroId: 29, especieId: 28, cantidadDisponible: 220 },
  { viveroId: 29, especieId: 29, cantidadDisponible: 310 },
  // Vivero 30 — Cochrane
  { viveroId: 30, especieId: 16, cantidadDisponible: 280 },
  { viveroId: 30, especieId: 17, cantidadDisponible: 240 },
  // Vivero 31 — El Mallín
  { viveroId: 31, especieId: 15, cantidadDisponible: 540 },
  { viveroId: 31, especieId: 16, cantidadDisponible: 480 },
  { viveroId: 31, especieId: 17, cantidadDisponible: 420 },
  { viveroId: 31, especieId: 28, cantidadDisponible: 180 },
  // Vivero 32 — Las Lengas
  { viveroId: 32, especieId: 16, cantidadDisponible: 850 },
  { viveroId: 32, especieId: 17, cantidadDisponible: 720 },
  { viveroId: 32, especieId: 28, cantidadDisponible: 320 },
  { viveroId: 32, especieId: 29, cantidadDisponible: 280 },

  // === Magallanes ===
  // Vivero 33 — Dorotea
  { viveroId: 33, especieId: 16, cantidadDisponible: 380 },
  { viveroId: 33, especieId: 17, cantidadDisponible: 320 },
  { viveroId: 33, especieId: 29, cantidadDisponible: 240 },
  // Vivero 34 — Río de Los Ciervos
  { viveroId: 34, especieId: 16, cantidadDisponible: 620 },
  { viveroId: 34, especieId: 17, cantidadDisponible: 540 },
  { viveroId: 34, especieId: 28, cantidadDisponible: 290 },
  { viveroId: 34, especieId: 29, cantidadDisponible: 380 },

  // === Isla de Pascua ===
  // Vivero 38 — Mataveri Otai
  { viveroId: 38, especieId: 39, cantidadDisponible: 45 },
  { viveroId: 38, especieId: 38, cantidadDisponible: 30 },
]

// Usuario simulado para Solicitante (lo que vendría de Clave Única)
export const mockClaveUnicaUser = {
  rut: '12.345.678-9',
  nombres: 'María Soledad',
  apellidos: 'González Pérez',
  correo: 'maria.gonzalez@example.cl',
  telefono: '+56 9 1234 5678',
  direccion: 'Av. Libertador 1234, Buin',
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
