/**
 * Set de íconos propio de WebYa. Reglas (ver .claude/skills/webya-design-system):
 * grilla 24×24, trazo 1.5, sin relleno, extremos y uniones redondeados, todo como <path>
 * para que el "dibujado" con stroke-dashoffset funcione igual en cada ícono.
 */

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const rect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}` +
  `h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}Z`;

/** Íconos de rubros (la clave es el campo `icono` de cada rubro). */
export const RUBRO_ICONS = {
  tijera: [circle(6, 6, 2.5), circle(6, 18, 2.5), 'M7.8 7.8 20 19', 'M7.8 16.2 20 5'],
  cubiertos: [
    'M5 3v5a2 2 0 0 0 4 0V3',
    'M7 10.5V21',
    'M17 21V3c-2.5 1.5-3.5 4-3.5 7.5 0 1.5 1 2.5 3.5 2.5',
  ],
  tienda: ['M4.5 8h15l-1 12h-13Z', 'M8.5 8V7a3.5 3.5 0 0 1 7 0v1'],
  portafolio: [
    rect(3, 7, 18, 13, 2),
    'M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7',
    'M3 13h18',
  ],
  pesa: ['M6.5 6.5v11', 'M17.5 6.5v11', 'M3.5 9.5v5', 'M20.5 9.5v5', 'M6.5 12h11'],
  // Llave inglesa: un solo trazo continuo (cabeza abierta + mango).
  llave: [
    'M14.5 4.5a4.5 4.5 0 0 0-5.2 5.8L4 15.6a1.9 1.9 0 0 0 2.7 2.7l5.3-5.3a4.5 4.5 0 0 0 5.8-5.2l-2.7 2.7-2.5-.7-.7-2.5 2.6-2.8Z',
  ],
  mas: ['M12 5v14', 'M5 12h14'],
} as const;

/** Íconos de módulos (clave = id del módulo en config/modulos.ts). */
export const MODULO_ICONS = {
  turnos: [rect(3.5, 5, 17, 15.5, 2), 'M3.5 10h17', 'M8 3v4', 'M16 3v4'],
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
  pagos: [rect(3, 6, 18, 12, 2), 'M3 10h18', 'M7 14.5h3'],
  clientes: [
    circle(9, 8, 3),
    'M3.5 19.5a5.5 5.5 0 0 1 11 0',
    'M16 5.3a3 3 0 0 1 0 5.4',
    'M17.5 14.5a5.5 5.5 0 0 1 3 5',
  ],
  notificaciones: ['M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15Z', 'M10 21a2 2 0 0 0 4 0'],
} as const;

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
} as const;

export const ICONS = { ...RUBRO_ICONS, ...MODULO_ICONS, ...UI_ICONS } as const;

export type IconName = keyof typeof ICONS;

export function isIconName(value: string): value is IconName {
  return Object.prototype.hasOwnProperty.call(ICONS, value);
}
