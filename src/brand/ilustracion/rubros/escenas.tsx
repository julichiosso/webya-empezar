import type { ReactNode } from 'react';
import { conMuesca, GRILLA_DIBUJO, rectangulo } from '../grilla';
import type { EscenaRubro } from './ids';

/**
 * Escenas de rubro en el lenguaje Encastre (ver ../LEEME.md): grilla 96, zona viva [8, 88], trazo 2,
 * dos tonos (currentColor + `fill-accent`). En cada una hay una sola pieza que encaja en otra y va en
 * acento: la boquilla en el secador, la comida en el plato, la bolsa con su muesca, la hoja en la
 * muesca de la carpeta, los discos en la barra y la tuerca en la boca de la llave.
 *
 * El acento es `fill-accent` (y no `fill-pieza-encajada`) a propósito: la vista previa re-tiñe con
 * la paleta del negocio redefiniendo `--accent` en su contenedor, y una variable que apunta a otra
 * (`--pieza-encajada: var(--accent)`) queda resuelta en :root y no se enteraría.
 *
 * Pensadas para leerse a 64 px (1 unidad ≈ 0,7 px): pocas piezas, nada más chico que 4 unidades.
 */

const A = 'fill-accent';
const M = GRILLA_DIBUJO.muesca;

/** La pieza que encaja: lleva el acento y, si hay movimiento, cae y asienta una vez. */
function Encaja({ children }: { children: ReactNode }) {
  return <g className="ilus-encaja">{children}</g>;
}

export const ESCENAS: Record<EscenaRubro, ReactNode> = {
  // Secador con la boquilla encastrada (acento) y la tijera abierta.
  peluqueria_estetica: (
    <>
      <path d={rectangulo(14, 18, 44, 26, 13)} />
      <circle cx="27" cy="31" r="6" />
      <path d="M28 44v22a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V44" />
      <path d="M80 26h4M80 36h4" />
      <Encaja>
        <path className={A} d="M56 24h15a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H56Z" />
      </Encaja>
      <circle cx="58" cy="78" r="5" />
      <circle cx="76" cy="78" r="5" />
      <path d="M60 73 80 50M74 73 54 50" />
      <circle cx="67" cy="65" r="2" />
    </>
  ),

  // Plato visto de arriba, con la comida (acento) en el hueco, tenedor y cuchillo.
  gastronomia: (
    <>
      <circle cx="48" cy="52" r="24" />
      <Encaja>
        <circle className={A} cx="48" cy="52" r="15" />
      </Encaja>
      <path d="M10 28v10a4 4 0 0 0 8 0V28M14 28v10M14 42v34" />
      <path d="M84 76V28c-4 3-6 8-6 16 0 3 2 5 6 5" />
    </>
  ),

  // Local con toldo y vidriera; delante, la bolsa con la muesca de la grilla (acento).
  comercio: (
    <>
      <path d="M12 32 16 16h48l4 16a7 7 0 0 1-14 0 7 7 0 0 1-14 0 7 7 0 0 1-14 0 7 7 0 0 1-14 0Z" />
      <path d="M16 44v38h48V44" />
      <path d={rectangulo(22, 50, 20, 16, 2)} />
      <path d="M46 82V60h8v22" />
      <path d="M66 56v-3a6 6 0 0 1 12 0v3" />
      <Encaja>
        <path className={A} d={conMuesca(58, 56, 28, 28, 4, M.chica)} />
      </Encaja>
    </>
  ),

  // Escritorio con una carpeta parada: la hoja (acento) asoma y llena la muesca. Al lado, la taza.
  profesionales: (
    <>
      <Encaja>
        <path className={A} d="M30 28V18a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v10H50A6 6 0 0 1 38 28Z" />
        <path d="M36 22h16" />
      </Encaja>
      <path d={conMuesca(22, 28, 44, 32, 2, M.grande)} />
      <path d="M32 48h20" />
      <path d="M72 48h10v8a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4Z" />
      <path d="M82 51h2a3 3 0 0 1 0 6h-2" />
      <path d="M10 60h76M14 60v24M82 60v24" />
    </>
  ),

  // Cronómetro y mancuerna: los discos (acento) encajan en la barra.
  gimnasio_deportes: (
    <>
      <circle cx="64" cy="36" r="18" />
      <path d="M60 12h8M64 12v6M64 36l7-7" />
      <path d="M12 66v12M68 66v12M12 72h56" />
      <Encaja>
        <path className={A} d={rectangulo(16, 60, 8, 24, 2)} />
        <path className={A} d={rectangulo(56, 60, 8, 24, 2)} />
      </Encaja>
    </>
  ),

  // Casa y llave fija: la tuerca (acento) calza justo en la boca de la llave.
  servicios_tecnicos: (
    <>
      <path d="M12 40 36 18l24 22" />
      <path d="M18 36v44h36V36" />
      <path d="M30 80V66a6 6 0 0 1 12 0v14" />
      <path d="M70 18v8h12v-8A10 10 0 0 1 82 34v46a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V34A10 10 0 0 1 70 18Z" />
      <circle cx="76" cy="74" r="2" />
      <Encaja>
        <path className={A} d="M76 12l6 3.5v7L76 26l-6-3.5v-7Z" />
        <circle cx="76" cy="19" r="2.5" />
      </Encaja>
    </>
  ),
};

/**
 * Genérico (rubro "otro" o desconocido): el tablero de cuatro piezas con muesca. Dos puestas, una
 * por encajar (hueco punteado) y la que encaja, en acento: "tu negocio, pieza por pieza".
 */
export const ESCENA_GENERICA: ReactNode = (
  <>
    <path d={conMuesca(12, 12, 34, 34, 4, M.chica)} />
    <path d={conMuesca(50, 12, 34, 34, 4, M.chica)} />
    <path strokeDasharray={GRILLA_DIBUJO.punteado} d={conMuesca(12, 50, 34, 34, 4, M.chica)} />
    <Encaja>
      <path className={A} d={conMuesca(50, 50, 34, 34, 4, M.chica)} />
    </Encaja>
  </>
);
