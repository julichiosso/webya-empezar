import { GRILLA_DIBUJO, TRAZO } from '../grilla';
import { ESCENA_GENERICA, ESCENAS } from './escenas';
import { esEscenaRubro } from './ids';
import '../movimiento.css';

interface IlustracionRubroProps {
  /** Id del rubro (content/rubros). Uno desconocido dibuja el genérico. */
  rubro: string;
  /**
   * El tamaño lo pone quien la usa (p. ej. `size-16` en la cabecera chica, `size-40` en escritorio).
   * Sin tamaño, el SVG ocupa el ancho de su contenedor, cuadrado.
   */
  className?: string;
}

/**
 * Escena propia de cada rubro para la vista previa de /empezar (grilla de dibujo 96, Encastre).
 * Decorativa: el nombre del rubro ya está escrito al lado. El acento es `--accent`, así que toma la
 * paleta del contenedor (`variablesDePaleta`). Al montarse, la pieza en acento cae y asienta una vez
 * (`.ilus-encaja`); con movimiento reducido queda quieta en su lugar. Para repetir el "clic" al
 * cambiar de rubro, quien la usa le pone `key={rubro}`.
 */
export function IlustracionRubro({ rubro, className }: IlustracionRubroProps) {
  return (
    <svg
      viewBox={GRILLA_DIBUJO.viewBox}
      {...TRAZO}
      strokeWidth={GRILLA_DIBUJO.trazo}
      aria-hidden="true"
      focusable="false"
      data-escena={esEscenaRubro(rubro) ? rubro : 'generico'}
      className={className}
    >
      {esEscenaRubro(rubro) ? ESCENAS[rubro] : ESCENA_GENERICA}
    </svg>
  );
}
