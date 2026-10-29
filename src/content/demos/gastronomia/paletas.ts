import { getPaletaMarca } from '@/brand/tokens/colores';
import type { PaletaDemo } from './types';

/**
 * Las 6 paletas curadas de "Personalizá tu demo". Se aplican con variables CSS en el contenedor de
 * la demo (`variablesDePaleta`). Todas pasan AA en todas las combinaciones de la UI: lo verifica
 * src/content/demos/gastronomia/gastronomia.test.ts con el contraste medido.
 */
const brasa = getPaletaMarca('brasa');
const mostaza = getPaletaMarca('mostaza');

export const PALETAS_DEMO: readonly PaletaDemo[] = [
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

export const PALETA_DEMO_POR_DEFECTO = 'brasa';

export function getPaletaDemo(id: string | null | undefined): PaletaDemo {
  return PALETAS_DEMO.find((p) => p.id === id) ?? (PALETAS_DEMO[0] as PaletaDemo);
}
