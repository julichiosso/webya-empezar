import type { NecesidadId } from '@/config/necesidades';
import { circulo as circle, circuloPunteado, conMuesca, rectangulo as rect } from '../grilla';

/**
 * Set de íconos propio de WebYa. Reglas en `../grilla.ts` y `../LEEME.md`: grilla 24×24, zona viva
 * [2, 22], trazo 1.5, sin relleno, extremos y uniones redondeados, todo como <path> para que el
 * "dibujado" con stroke-dashoffset funcione igual en cada ícono. Brand define los nombres;
 * `content` elige cuál usa cada rubro, módulo o necesidad.
 */

/** Íconos de rubros (la clave es el campo `icono` de cada rubro). */
export const RUBRO_ICONS = {
  // Tijera abierta: dos ojos y dos hojas que se cruzan en el eje (12.2, 12).
  tijera: [circle(6, 7, 2.5), circle(6, 17, 2.5), 'M8 8.5 19.5 18', 'M8 15.5 19.5 6'],
  // Tenedor de tres dientes y cuchillo.
  cubiertos: [
    'M5.5 3v5a2.5 2.5 0 0 0 5 0V3',
    'M8 3v5',
    'M8 10.5V21',
    'M17.5 21V3c-2.5 1.5-3.5 4-3.5 7.5 0 1.5 1 2.5 3.5 2.5',
  ],
  // Local a la calle: toldo con festón, vidriera y puerta.
  tienda: [
    'M3 9.5 4.5 4h15L21 9.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z',
    'M4.5 12v8h15v-8',
    'M10 20v-4h4v4',
  ],
  portafolio: [
    rect(3, 7, 18, 13, 2),
    'M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7',
    'M3 13h18',
  ],
  // Mancuerna: dos discos redondeados, topes y barra.
  pesa: [
    rect(4.5, 7, 3, 10, 1.5),
    rect(16.5, 7, 3, 10, 1.5),
    'M2.5 10v4',
    'M21.5 10v4',
    'M7.5 12h9',
  ],
  // Llave inglesa: un solo trazo continuo (cabeza abierta + mango).
  llave: [
    'M14.5 4.5a4.5 4.5 0 0 0-5.2 5.8L4 15.6a1.9 1.9 0 0 0 2.7 2.7l5.3-5.3a4.5 4.5 0 0 0 5.8-5.2l-2.7 2.7-2.5-.7-.7-2.5 2.6-2.8Z',
  ],
  mas: ['M12 5v14', 'M5 12h14'],
  // Encastre: el hueco punteado que espera una pieza (para "Otro rubro" u "Otra cosa").
  hueco: [...circuloPunteado(12, 12, 8.5), 'M12 8.5v7', 'M8.5 12h7'],
} as const;

/** Íconos de módulos (clave = id del módulo en content/modulos.ts). */
export const MODULO_ICONS = {
  // Calendario con los días marcados como puntos.
  turnos: [
    rect(3.5, 5, 17, 15, 2),
    'M3.5 9.5h17',
    'M8 3v4',
    'M16 3v4',
    'M8 13.5v.01',
    'M12 13.5v.01',
    'M16 13.5v.01',
    'M8 17v.01',
    'M12 17v.01',
  ],
  catalogo: [
    rect(4, 4, 7, 7, 1.5),
    rect(13, 4, 7, 7, 1.5),
    rect(4, 13, 7, 7, 1.5),
    rect(13, 13, 7, 7, 1.5),
  ],
  carta_qr: [
    rect(4, 4, 6, 6, 1),
    rect(14, 4, 6, 6, 1),
    rect(4, 14, 6, 6, 1),
    'M14 14h3v3',
    'M20 14v3',
    'M14 20h3',
    'M20 20v.01',
  ],
  formularios: ['M6 3.5h8.5L18 7v13.5H6Z', 'M14 3.5V7.5h4', 'M9 12h6', 'M9 16h6'],
  // Comanda colgada del riel: la muesca arriba y el borde de abajo dentado.
  pedidos: [
    'M6 3.5h4.5a1.5 1.5 0 0 0 3 0H18v17l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5Z',
    'M9 9h6',
    'M9 12.5h6',
    'M9 16h3',
  ],
  pagos: [rect(3, 6, 18, 12, 2), 'M3 10h18', 'M7 14.5h3'],
  clientes: [
    circle(9, 8, 3),
    'M3.5 19.5a5.5 5.5 0 0 1 11 0',
    'M16 5.3a3 3 0 0 1 0 5.4',
    'M17.5 14.5a5.5 5.5 0 0 1 3 5',
  ],
  notificaciones: ['M6 15.5V10a6 6 0 0 1 12 0v5.5l1.5 2h-15Z', 'M10 20a2 2 0 0 0 4 0'],
} as const;

/**
 * Íconos de necesidades (paso "¿Qué necesitás?"): hablan del resultado, no de la herramienta, así
 * que no repiten el ícono del módulo que la resuelve.
 */
export const NECESIDAD_ICONS = {
  // Vender: etiqueta de precio con su ojal.
  etiqueta: [
    'M3.5 11.6V4.5a1 1 0 0 1 1-1h7.1a1 1 0 0 1 .7.3l8.2 8.2a1.5 1.5 0 0 1 0 2.1l-6.5 6.5a1.5 1.5 0 0 1-2.1 0L3.8 12.3a1 1 0 0 1-.3-.7Z',
    circle(8, 8, 1.5),
  ],
  // Recibir turnos: el calendario con un turno tomado.
  agenda: [rect(3.5, 5, 17, 15, 2), 'M3.5 9.5h17', 'M8 3v4', 'M16 3v4', 'M9 14.5l2 2 4-4'],
  // Mostrar la carta: carta abierta, dos hojas con renglones.
  menu: [
    'M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5',
    'M12 6.5c2-1.5 5-2 8.5-1.5v13c-3.5-.5-6.5 0-8.5 1.5',
    'M12 6.5v13',
    'M6 9h3',
    'M6 12h3',
    'M15 9h3',
    'M15 12h3',
  ],
  // Cobrar: una moneda con el signo peso.
  moneda: [
    circle(12, 12, 8.5),
    'M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5',
    'M12 6.5V8',
    'M12 16v1.5',
  ],
  // Organizar clientes: la ficha de un cliente.
  fichero: [
    rect(3, 5, 18, 14, 2),
    circle(8.5, 10.5, 2),
    'M5.5 16a3 3 0 0 1 6 0',
    'M14 10h4',
    'M14 13.5h4',
  ],
} as const;

/** Qué ícono acompaña a cada necesidad (sugerencia de brand; `content` puede elegir otro). */
export const ICONO_DE_NECESIDAD = {
  vender: 'etiqueta',
  turnos: 'agenda',
  carta: 'menu',
  cobrar: 'moneda',
  clientes: 'fichero',
  otra: 'hueco',
} as const satisfies Record<NecesidadId, keyof typeof NECESIDAD_ICONS | 'hueco'>;

/** Íconos de interfaz. */
export const UI_ICONS = {
  check: ['M5 12.5 9.5 17 19 7.5'],
  arrowLeft: ['M19 12H5', 'M11 6l-6 6 6 6'],
  arrowRight: ['M5 12h14', 'M13 6l6 6-6 6'],
  arrowDown: ['M12 5v14', 'M6 13l6 6 6-6'],
  chat: [
    'M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5Z',
  ],
  mail: [rect(3, 5.5, 18, 13, 2), 'M3.5 7.5 12 13.5l8.5-6'],
  // Demo de pedidos.
  buscar: [circle(10.5, 10.5, 6), 'M15 15l5 5'],
  menos: ['M5 12h14'],
  cerrar: ['M6 6l12 12', 'M18 6 6 18'],
  bolsa: ['M5 8h14l-1.2 12h-11.6Z', 'M9 8V6.5a3 3 0 0 1 6 0V8'],
  moto: [
    circle(6, 17, 2.5),
    circle(18, 17, 2.5),
    'M8.5 17h7',
    'M15 17l-2.5-7H9',
    'M12.5 10h3l2.5 7',
  ],
  mesa: ['M4 9h16', 'M7 9v10', 'M17 9v10', 'M6 5h12'],
  billete: [rect(3, 6.5, 18, 11, 2), circle(12, 12, 2.5), 'M6.5 9.5v.01', 'M17.5 14.5v.01'],
  reloj: [circle(12, 12, 8.5), 'M12 7.5V12l3 2'],
  impresora: [rect(4, 9, 16, 8, 1.5), 'M7 9V4h10v5', 'M7 14h10v6H7Z'],
  // Ticket suelto con la muesca (comprobante, papel).
  ticket: [conMuesca(5.5, 3.5, 13, 17, 1.5, 1.5), 'M9 10h6', 'M9 13.5h6', 'M9 17h3'],
  // Video explicativo.
  play: ['M8 5.5v13l10.5-6.5Z'],
  pausa: ['M8.5 5.5v13', 'M15.5 5.5v13'],
  volumen: [
    'M4 9.5h3.5L12 6v12l-4.5-3.5H4Z',
    'M15.5 9a4 4 0 0 1 0 6',
    'M18 6.5a7.5 7.5 0 0 1 0 11',
  ],
  silencio: ['M4 9.5h3.5L12 6v12l-4.5-3.5H4Z', 'M16 9.5l5 5', 'M21 9.5l-5 5'],
} as const;

export const ICONS = {
  ...RUBRO_ICONS,
  ...MODULO_ICONS,
  ...NECESIDAD_ICONS,
  ...UI_ICONS,
} as const;

export type IconName = keyof typeof ICONS;

export function isIconName(value: string): value is IconName {
  return Object.prototype.hasOwnProperty.call(ICONS, value);
}
