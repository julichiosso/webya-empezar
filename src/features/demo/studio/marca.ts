import type { CSSProperties } from 'react';
import { z } from 'zod';
// Antes de construir los esquemas: sin eval (CSP). Ver lib/zod-sin-eval.ts.
import '@/lib/zod-sin-eval';
import {
  COLORES_MARCA,
  FUENTES_MARCA,
  colorMarca,
  fuenteMarca,
  type ColorMarcaId,
  type FuenteMarcaId,
} from '@/content/demos/studio';
import { AA_TEXTO, BLANCO, NEGRO_SUAVE, ajustarContraste, tintaSobre } from '@/lib/color';

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
    // El acento como texto sobre fondo oscuro (apps oscuras): aclarado si hace falta.
    '--marca-claro': ajustarContraste(c, NEGRO_SUAVE, AA_TEXTO),
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

export type AccionMarca =
  | { tipo: 'nombre'; valor: string }
  | { tipo: 'color'; id: string }
  | { tipo: 'fuente'; id: string }
  | { tipo: 'logo'; url?: string };

export const MAX_NOMBRE = 40;

export function reducirMarca<M extends Marca>(m: M, a: AccionMarca): M {
  switch (a.tipo) {
    case 'nombre': {
      const valor = a.valor.slice(0, MAX_NOMBRE);
      return valor === m.nombre ? m : { ...m, nombre: valor };
    }
    case 'color':
      return a.id === m.colorId ? m : { ...m, colorId: a.id };
    case 'fuente':
      return a.id === m.fuenteId ? m : { ...m, fuenteId: a.id };
    case 'logo':
      return a.url === m.logo ? m : { ...m, logo: a.url };
  }
}

/** Lo que llega de un link o del guardado: solo campos conocidos, ids de la lista y textos cortos. */
export const esquemaMarca = z.object({
  nombre: z.string().max(MAX_NOMBRE),
  colorId: z.enum(COLORES_MARCA.map((c) => c.id) as [ColorMarcaId, ...ColorMarcaId[]]),
  fuenteId: z.enum(FUENTES_MARCA.map((f) => f.id) as [FuenteMarcaId, ...FuenteMarcaId[]]),
});
