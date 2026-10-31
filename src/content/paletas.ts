import { getPaletaMarca, type ColoresPaleta } from '@/brand/tokens/colores';

/**
 * Paletas curadas que puede elegir un negocio: las usan la demo ("Personalizá tu demo", `?paleta=`)
 * y la vista previa de /empezar ("Así te queda"). Se aplican con variables CSS en un contenedor con
 * scope (`variablesDePaleta` de src/brand/tokens/colores.ts): los componentes nunca llevan colores
 * en línea. Los hex viven solo acá.
 *
 * Los ids son ESTABLES: viajan en la URL de la demo, en sessionStorage y en el lead (`demo.paleta`).
 * Todas pasan AA en cada combinación que usa la UI (lo verifica paletas.test.ts con el contraste
 * medido, en tema oscuro y claro).
 */
export const PALETA_CURADA_IDS = [
  'brasa',
  'mostaza',
  'albahaca',
  'pileta',
  'ciruela',
  'frutilla',
] as const;

export type PaletaCuradaId = (typeof PALETA_CURADA_IDS)[number];

export interface PaletaCurada extends ColoresPaleta {
  id: PaletaCuradaId;
}

const brasa = getPaletaMarca('brasa');
const mostaza = getPaletaMarca('mostaza');

export const PALETAS_CURADAS: readonly PaletaCurada[] = [
  {
    id: 'brasa',
    nombre: brasa.nombre,
    accent: brasa.accent,
    accentFg: brasa.accentFg,
    accentInk: brasa.accentInk,
    danger: brasa.danger,
  },
  {
    id: 'mostaza',
    nombre: mostaza.nombre,
    accent: mostaza.accent,
    accentFg: mostaza.accentFg,
    accentInk: mostaza.accentInk,
    danger: mostaza.danger,
  },
  {
    id: 'albahaca',
    nombre: 'Albahaca',
    accent: '#4ade80',
    accentFg: '#0b0b0c',
    accentInk: '#18733a',
    danger: '#ff6b8a',
  },
  {
    id: 'pileta',
    nombre: 'Pileta',
    accent: '#38bdf8',
    accentFg: '#0b0b0c',
    accentInk: '#0a6390',
    danger: '#ff6b8a',
  },
  {
    id: 'ciruela',
    nombre: 'Ciruela',
    accent: '#c084fc',
    accentFg: '#0b0b0c',
    accentInk: '#7434ad',
    danger: '#ff6b8a',
  },
  // El error de la paleta rosa pasa a naranja: así nunca se confunde con el acento.
  {
    id: 'frutilla',
    nombre: 'Frutilla',
    accent: '#ff5c8a',
    accentFg: '#0b0b0c',
    accentInk: '#a8124a',
    danger: '#ff8a3d',
  },
];

export const PALETA_CURADA_POR_DEFECTO: PaletaCuradaId = 'brasa';

export function esPaletaCurada(id: unknown): id is PaletaCuradaId {
  return (PALETA_CURADA_IDS as readonly unknown[]).includes(id);
}

/** La paleta de ese id; si no existe (o no vino), la por defecto. */
export function getPaletaCurada(id: string | null | undefined): PaletaCurada {
  return (
    PALETAS_CURADAS.find((p) => p.id === id) ??
    (PALETAS_CURADAS.find((p) => p.id === PALETA_CURADA_POR_DEFECTO) as PaletaCurada)
  );
}
