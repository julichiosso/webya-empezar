'use client';

import { useRef, type CSSProperties } from 'react';
import { variablesDePaleta } from '@/brand/tokens/colores';
import { COCINA_POR_DEFECTO, getCocina } from '@/content/demos/gastronomia';
import { PREVIEW } from '@/content/empezar/preview';
import { getPaletaCurada } from '@/content/paletas';
import { Carta } from './cliente/Carta';

export interface VistaPreviaCartaProps {
  /** Nombre del negocio tal como lo escribe la persona; vacío = el de ejemplo. */
  nombre: string;
  /** Id de una paleta curada (content/paletas.ts). */
  paleta?: string | null;
}

const sinAccion = () => undefined;

/**
 * La plantilla REAL de la carta de Gastronomía (la misma de /demo/gastronomia) con el nombre y los
 * colores de la persona. Sin estado compartido ni guardado: es de lectura, con los platos y precios
 * de ejemplo de la cocina por defecto, y el aviso lo dice. Se desliza y se busca como la real.
 */
export function VistaPreviaCarta({ nombre, paleta }: VistaPreviaCartaProps) {
  const cocina = getCocina(COCINA_POR_DEFECTO);
  const pantalla = useRef<HTMLDivElement>(null);
  const limpio = nombre.trim();
  return (
    <figure data-testid="vista-previa-carta" className="m-0">
      <div
        style={variablesDePaleta(getPaletaCurada(paleta)) as CSSProperties}
        className="papel overflow-hidden rounded-card border border-line-strong bg-paper text-paper-fg"
      >
        <div
          ref={pantalla}
          // Alto fijo: escribir el nombre no mueve nada de lo que está debajo (CLS 0).
          className="h-[30rem] overflow-y-auto overscroll-contain lg:h-[34rem]"
        >
          <Carta
            cocina={cocina}
            nombreLocal={limpio || cocina.nombreLocalPorDefecto}
            scroller={pantalla}
            onAbrirPlato={sinAccion}
          />
        </div>
      </div>
      <figcaption className="mt-2 text-small text-muted">{PREVIEW.deEjemplo}</figcaption>
    </figure>
  );
}
