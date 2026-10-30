import type { ReactNode } from 'react';
import { conMuesca, ENCASTRE, GRILLA_DIBUJO } from '../grilla';
import type { EstadoId } from './ids';
import '../movimiento.css';

/**
 * Estados con personalidad, en el lenguaje Encastre (ver ../LEEME.md): lo que falta es un hueco
 * punteado con la forma de lo que falta; lo que encaja, la pieza en acento. Grilla 96, trazo 2,
 * dos tonos como máximo (currentColor + un token). Sin texto: la frase que los acompaña ("Acá
 * encaja tu primer pedido") vive en `src/content`.
 */

const { punteado: P } = GRILLA_DIBUJO;
const M = GRILLA_DIBUJO.muesca;

/** Pieza chica del tablero (20 × 20, con muesca de 3). */
const pieza = (x: number, y: number) => conMuesca(x, y, 20, 20, 4, M.chica);

export const ESTADOS_DIBUJOS: Record<EstadoId, ReactNode> = {
  // Sin pedidos: el riel con su pinza y, colgado de la muesca, el hueco de la primera comanda.
  vacio: (
    <>
      <path d="M12 20h72M12 16v8M84 16v8" />
      <path
        className={ENCASTRE.hueco}
        strokeDasharray={P}
        d={conMuesca(28, 30, 40, 52, GRILLA_DIBUJO.radio.grande, M.grande)}
      />
      <rect x="45" y="14" width="6" height="18" rx="2" />
    </>
  ),

  // Sin resultados: la lupa sobre el hueco de una ficha que no apareció.
  'sin-resultados': (
    <>
      <path
        className={ENCASTRE.hueco}
        strokeDasharray={P}
        d={conMuesca(14, 16, 44, 56, 6, M.grande)}
      />
      <circle cx="60" cy="58" r="14" />
      <path d="M70 68l14 14" />
      <path d="M53 58h14" />
    </>
  ),

  // 404: el tablero con un hueco; la pieza que iba ahí quedó suelta, fuera de lugar.
  'no-encontrado': (
    <>
      <path d={pieza(20, 44)} />
      <path d={pieza(20, 68)} />
      <path d={pieza(44, 68)} />
      <path className={ENCASTRE.hueco} strokeDasharray={P} d={pieza(44, 44)} />
      <path className={ENCASTRE.hueco} strokeDasharray={P} d="M58 40c1-6 4-10 8-12" />
      <path d={pieza(62, 12)} transform="rotate(14 72 22)" />
    </>
  ),

  // Error: la comanda se rasgó. El aviso va en el color de error (nunca en el acento).
  error: (
    <>
      <g transform="rotate(-5 48 34)">
        <path d="M34 20h8a6 6 0 0 0 12 0h8a6 6 0 0 1 6 6v18l-5 4-5-4-5 4-5-4-5 4-5-4-5 4-5-4V26a6 6 0 0 1 6-6Z" />
        <path d="M36 32h24M36 38h16" />
      </g>
      <g transform="translate(4 2) rotate(4 48 66)">
        <path d="M28 52l5 4 5-4 5 4 5-4 5 4 5-4 5 4 5-4v22a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6Z" />
        <path d="M36 64h24M36 70h12" />
      </g>
      <path className={ENCASTRE.aviso} d="M74 42l8-4M76 49h8M74 56l8 4" />
    </>
  ),

  // Cargando: tres huecos en el riel y las piezas que caen, una tras otra. Con movimiento
  // reducido queda quieto: la primera pieza encajada y los otros dos huecos. Dos tonos: el gris
  // del hueco (también el riel) y el acento de la pieza.
  cargando: (
    <>
      <path className={ENCASTRE.hueco} d="M10 68h76" />
      {[14, 38, 62].map((x) => (
        <rect
          key={`h${x}`}
          className={ENCASTRE.hueco}
          strokeDasharray={P}
          x={x}
          y="38"
          width="20"
          height="20"
          rx="4"
        />
      ))}
      {/* La pieza es apenas más chica que su hueco: se ve el contorno punteado alrededor. */}
      {[14, 38, 62].map((x, i) => (
        <rect
          key={`p${x}`}
          className={`ilus-cae ${ENCASTRE.pieza} ${ENCASTRE.piezaTrazo}`}
          data-quieta={i === 0 ? 'true' : undefined}
          style={{ animationDelay: `${i * 200}ms` }}
          x={x + 4}
          y="42"
          width="12"
          height="12"
          rx="2"
        />
      ))}
    </>
  ),
};
