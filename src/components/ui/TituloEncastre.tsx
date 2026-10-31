import type { CSSProperties } from 'react';
import { PRESUPUESTO } from '@/brand/motion/presets';
import { ActivadorEncastre } from './ActivadorEncastre';
import { cn } from './clases';
import estilos from './TituloEncastre.module.css';

type Nivel = 1 | 2 | 3 | 4 | 5 | 6;

export interface TituloEncastreProps {
  /** Texto completo del titular (desde src/content). Es también el nombre accesible del heading. */
  texto: string;
  /** Nivel del heading (h1…h6). */
  nivel?: Nivel;
  /** Qué encastra: cada palabra (por defecto) o cada letra (solo para titulares muy cortos). */
  partir?: 'palabras' | 'letras';
  /**
   * `carga`: se arma al pintar, en CSS puro y sin JS (primer pliegue; es el caso común).
   * `vista`: se arma una vez al entrar en pantalla (isla mínima con IntersectionObserver); sin JS
   * queda en su estado final.
   */
  entrada?: 'carga' | 'vista';
  id?: string;
  className?: string;
}

export interface Pieza {
  texto: string;
  /** Orden en la entrada escalonada (puede ser fraccionario: ver `piezasDe`). */
  orden: number;
  /** 1: llega de abajo; -1: de arriba (alterna, como el logo que se arma). */
  lado: 1 | -1;
}

/**
 * Parte el titular en palabras; cada palabra trae sus letras si `partir` es `letras`. El orden se
 * comprime para que la entrada completa entre en el presupuesto (como mucho `maxPiezas` pasos de
 * `--paso-pieza`), aunque haya más palabras o letras: así nunca pasa de `entradaMaximaMs`.
 */
export function piezasDe(texto: string, partir: 'palabras' | 'letras' = 'palabras'): Pieza[][] {
  const palabras = texto.trim().split(/\s+/).filter(Boolean);
  const grupos = palabras.map((p) => (partir === 'letras' ? Array.from(p) : [p]));
  const total = grupos.reduce((n, g) => n + g.length, 0);
  const pasos = PRESUPUESTO.maxPiezas - 1;
  const escala = total > PRESUPUESTO.maxPiezas ? pasos / (total - 1) : 1;
  let i = 0;
  return grupos.map((grupo) =>
    grupo.map((t) => {
      const pieza: Pieza = {
        texto: t,
        orden: Math.round(i * escala * 100) / 100,
        lado: i % 2 === 0 ? 1 : -1,
      };
      i++;
      return pieza;
    }),
  );
}

const estilo = (p: Pieza) => ({ '--i': p.orden, '--lado': p.lado }) as CSSProperties;

/**
 * Titular "kinetic" del Plano: las palabras llegan por piezas y encastran en su lugar
 * (desplazamiento + escala + micro-rebote, escalonadas), una sola vez. Componente de servidor.
 *
 * - Accesible: el texto completo es el `aria-label` del heading; las piezas son `aria-hidden`, así
 *   que el lector lo lee una sola vez y entero.
 * - LCP: el titular está pintado y legible desde el primer frame (las piezas parten de opacidad
 *   0.55 y un desplazamiento chico); nunca se esconde esperando JS.
 * - Solo transform/opacity (nada de font-variation-settings ni propiedades de layout). Con
 *   `prefers-reduced-motion`, estático.
 *
 * Sin estados interactivos: es texto (no se toca ni se enfoca).
 */
export function TituloEncastre({
  texto,
  nivel = 2,
  partir = 'palabras',
  entrada = 'carga',
  id,
  className,
}: TituloEncastreProps) {
  const Etiqueta = `h${nivel}` as const;
  const grupos = piezasDe(texto, partir);

  const piezas = grupos.map((grupo, g) => {
    const enPiezas = grupo.map((p, l) => (
      <span key={l} className={estilos.pieza} data-pieza="" style={estilo(p)}>
        {p.texto}
      </span>
    ));
    return (
      <span key={g}>
        {g > 0 && ' '}
        {partir === 'letras' ? (
          // La palabra no se corta entre líneas; sus letras encastran adentro.
          <span className={estilos.palabra} data-palabra="">
            {enPiezas}
          </span>
        ) : (
          enPiezas
        )}
      </span>
    );
  });

  const clasePiezas = cn(estilos.piezas, entrada === 'carga' ? estilos.carga : estilos.vista);

  return (
    <Etiqueta
      id={id}
      aria-label={texto}
      data-entrada={entrada}
      className={cn('text-balance', className)}
    >
      {entrada === 'vista' ? (
        <ActivadorEncastre className={clasePiezas}>{piezas}</ActivadorEncastre>
      ) : (
        <span aria-hidden="true" className={clasePiezas}>
          {piezas}
        </span>
      )}
    </Etiqueta>
  );
}
