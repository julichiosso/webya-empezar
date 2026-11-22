import type { CSSProperties } from 'react';
import { colorMarca, fuenteMarca } from '@/content/demos/studio';
import { AA_TEXTO, BLANCO, ajustarContraste, tintaSobre } from '@/lib/color';

/** La marca que arma la persona: nombre, color, estilo de letra y logo (URL local, nunca se sube). */
export interface Marca {
  nombre: string;
  colorId: string;
  fuenteId: string;
  logo?: string;
}

/**
 * Variables CSS de la marca para la vista previa: `--marca` (botones y fondos de acento), `--marca-tinta`
 * (texto sobre el acento, blanco o negro según contraste), `--marca-texto` (el acento como color de texto
 * sobre blanco, oscurecido si hace falta para que se lea) y `--marca-fuente`.
 */
export function estiloMarca(m: Pick<Marca, 'colorId' | 'fuenteId'>): CSSProperties {
  const c = colorMarca(m.colorId).hex;
  return {
    '--marca': c,
    '--marca-tinta': tintaSobre(c),
    '--marca-texto': ajustarContraste(c, BLANCO, AA_TEXTO),
    '--marca-fuente': fuenteMarca(m.fuenteId).pila,
  } as CSSProperties;
}

/** El color elegido no se lee como texto sobre blanco: la vista previa usa una versión más oscura. */
export const colorAjustado = (colorId: string) => {
  const c = colorMarca(colorId).hex;
  return ajustarContraste(c, BLANCO, AA_TEXTO) !== c;
};

/** Sin fotos locales: lo que se guarda o se comparte. */
export const marcaPortable = (m: Marca): Marca => ({ ...m, logo: undefined });
