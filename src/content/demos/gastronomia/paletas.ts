import { getPaletaCurada, PALETA_CURADA_POR_DEFECTO, PALETAS_CURADAS } from '@/content/paletas';
import type { PaletaDemo } from './types';

/**
 * Las 6 paletas de "Personalizá tu demo". Viven en src/content/paletas.ts (las comparte la vista
 * previa de /empezar); acá quedan con los nombres de siempre para no romper a quien las importa.
 * Mismos ids y mismos valores.
 */
export const PALETAS_DEMO: readonly PaletaDemo[] = PALETAS_CURADAS;

export const PALETA_DEMO_POR_DEFECTO: string = PALETA_CURADA_POR_DEFECTO;

export function getPaletaDemo(id: string | null | undefined): PaletaDemo {
  return getPaletaCurada(id);
}
