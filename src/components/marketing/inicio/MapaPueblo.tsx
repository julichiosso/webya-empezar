'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
// Solo tipos: el copy y los datos de las demos llegan por props (los arma HeroPueblo en el servidor).
import type { HERO_MAPA } from '@/content/home';

/**
 * El plano del pueblo del hero: un damero visto desde arriba, con la plaza al medio, manzanas con techos y
 * cinco terrenos que son negocios. Tocar uno abre su globo con la mini demo del sistema (arranca abierto el
 * de la peluquería: el turno con seña). Todo es HTML y CSS (pueblo.css): sin imágenes ni SVG grande.
 *
 * Dos planos: en la compu 5 × 3 manzanas y en el celular 3 × 3. Las coordenadas van en % del plano; cada
 * pieza lleva las dos (--x… y --mx…) y el CSS elige según el ancho.
 */

type Plano = { cols: number; filas: number; calleX: number; calleY: number };
const COMPU: Plano = { cols: 5, filas: 3, calleX: 3.2, calleY: 9.5 };
const CELU: Plano = { cols: 3, filas: 3, calleX: 5, calleY: 5 };

type Celda = readonly [col: number, fila: number];
type Rect = { x: number; y: number; w: number; h: number };

function manzana(p: Plano, [c, f]: Celda): Rect {
  const w = (100 - (p.cols - 1) * p.calleX) / p.cols;
  const h = (100 - (p.filas - 1) * p.calleY) / p.filas;
  return { x: c * (w + p.calleX), y: f * (h + p.calleY), w, h };
}

/** Un rectángulo relativo a su manzana (en % de ella) pasado a % del plano. */
const dentro = (m: Rect, r: Rect): Rect => ({
  x: m.x + (r.x * m.w) / 100,
  y: m.y + (r.y * m.h) / 100,
  w: (r.w * m.w) / 100,
  h: (r.h * m.h) / 100,
});

const vars = (r: Rect, pre: '' | 'm'): Record<string, string> => ({
  [`--${pre}x`]: `${r.x.toFixed(2)}%`,
  [`--${pre}y`]: `${r.y.toFixed(2)}%`,
  [`--${pre}w`]: `${r.w.toFixed(2)}%`,
  [`--${pre}h`]: `${r.h.toFixed(2)}%`,
});

/** Terreno del negocio dentro de su manzana: del lado que da a la plaza (abajo o arriba). */
const LOTE_ABAJO: Rect = { x: 18, y: 50, w: 64, h: 46 };
const LOTE_ARRIBA: Rect = { x: 18, y: 4, w: 64, h: 46 };
/** Las otras casas de la manzana de un negocio, del lado de afuera. */
const VECINAS_ABAJO: readonly Rect[] = [
  { x: 4, y: 4, w: 44, h: 42 },
  { x: 52, y: 4, w: 44, h: 42 },
  { x: 4, y: 50, w: 11, h: 46 },
  { x: 85, y: 50, w: 11, h: 46 },
];
const VECINAS_ARRIBA: readonly Rect[] = VECINAS_ABAJO.map((r) => ({ ...r, y: r.y === 4 ? 54 : 4 }));

/** Casas de una manzana común: tres dibujos que se alternan (siempre los mismos: nada al azar). */
const CASAS: readonly (readonly Rect[])[] = [
  [
    { x: 4, y: 4, w: 30, h: 44 },
    { x: 37, y: 4, w: 26, h: 44 },
    { x: 66, y: 4, w: 30, h: 44 },
    { x: 4, y: 52, w: 44, h: 44 },
    { x: 52, y: 52, w: 44, h: 44 },
  ],
  [
    { x: 4, y: 4, w: 46, h: 30 },
    { x: 54, y: 4, w: 42, h: 44 },
    { x: 4, y: 38, w: 46, h: 58 },
    { x: 54, y: 52, w: 20, h: 44 },
    { x: 77, y: 52, w: 19, h: 44 },
  ],
  [
    { x: 4, y: 4, w: 22, h: 92 },
    { x: 29, y: 4, w: 40, h: 40 },
    { x: 72, y: 4, w: 24, h: 40 },
    { x: 29, y: 48, w: 67, h: 48 },
  ],
];

type Negocio = (typeof HERO_MAPA)['negocios'][number];
export type IdNegocio = Negocio['id'];
const UBICACION: Record<IdNegocio, { compu: Celda; celu: Celda }> = {
  peluqueria: { compu: [1, 0], celu: [0, 0] },
  pizzeria: { compu: [3, 0], celu: [2, 0] },
  tu: { compu: [2, 2], celu: [1, 2] },
  comercio: { compu: [1, 2], celu: [0, 2] },
  consultorio: { compu: [3, 2], celu: [2, 2] },
};
const PLAZA = { compu: [2, 1] as Celda, celu: [1, 1] as Celda };

/** Terreno del negocio en un plano: en la fila de arriba da hacia abajo (a la plaza) y al revés. */
function lote(p: Plano, celda: Celda) {
  const m = manzana(p, celda);
  const arriba = celda[1] === 0;
  return { m, arriba, r: dentro(m, arriba ? LOTE_ABAJO : LOTE_ARRIBA) };
}

/** Las manzanas comunes de un plano (sin la plaza), con sus casas. */
function manzanas(p: Plano, plaza: Celda, clave: 'compu' | 'celu') {
  const negocios = Object.values(UBICACION).map((u) => u[clave]);
  const lista: { id: string; m: Rect; casas: readonly Rect[] }[] = [];
  for (let f = 0; f < p.filas; f++)
    for (let c = 0; c < p.cols; c++) {
      if (c === plaza[0] && f === plaza[1]) continue;
      const m = manzana(p, [c, f]);
      const deNegocio = negocios.some(([nc, nf]) => nc === c && nf === f);
      const casas = deNegocio ? (f === 0 ? VECINAS_ABAJO : VECINAS_ARRIBA) : CASAS[(c + f) % 3];
      lista.push({ id: `${clave}-${c}-${f}`, m, casas: casas ?? [] });
    }
  return lista;
}

const MANZANAS_COMPU = manzanas(COMPU, PLAZA.compu, 'compu');
const MANZANAS_CELU = manzanas(CELU, PLAZA.celu, 'celu');

function Manzanas({ lista, plano }: { lista: typeof MANZANAS_COMPU; plano: 'compu' | 'celu' }) {
  return (
    <>
      {lista.map(({ id, m, casas }, i) => (
        <div
          key={id}
          className="pb-manzana"
          data-plano={plano}
          style={vars(m, '') as CSSProperties}
        >
          {casas.map((c, j) => (
            <span
              key={j}
              className="pb-casa"
              data-techo={(i + j) % 5}
              style={vars(c, '') as CSSProperties}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export function MapaPueblo({
  negocios,
  fichas,
  textos,
}: {
  negocios: readonly Negocio[];
  /** La mini demo de cada negocio, ya renderizada en el servidor (FichasPueblo.tsx). */
  fichas: Record<IdNegocio, ReactNode>;
  /** plano: nombre del grupo; plaza; pista; etiqueta(rubro, sistema): nombre de la ficha. */
  textos: { plano: string; plaza: string; pista: string; etiquetas: Record<IdNegocio, string> };
}) {
  const [abierto, setAbierto] = useState<IdNegocio>('peluqueria');
  const mapa = useRef<HTMLDivElement>(null);

  // Fuera de pantalla, la moto de reparto y el turno animado se pausan (pueblo.css → data-fuera).
  useEffect(() => {
    const el = mapa.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(([e]) =>
      el.toggleAttribute('data-fuera', !e?.isIntersecting),
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const negocio = negocios.find((n) => n.id === abierto);

  return (
    <div ref={mapa} className="pb-mapa" role="group" aria-label={textos.plano}>
      <div className="pb-marco">
        <div className="pb-lienzo">
          <div className="pb-plano" aria-hidden="true">
            <Manzanas lista={MANZANAS_COMPU} plano="compu" />
            <Manzanas lista={MANZANAS_CELU} plano="celu" />
            <div
              className="pb-plaza"
              style={
                {
                  ...vars(manzana(COMPU, PLAZA.compu), ''),
                  ...vars(manzana(CELU, PLAZA.celu), 'm'),
                } as CSSProperties
              }
            >
              <span className="pb-plaza-centro" />
              <span className="pb-plaza-nombre">{textos.plaza}</span>
            </div>
            <span className="pb-reparto">
              <span className="pb-reparto-punto" />
            </span>
          </div>

          {negocios.map((n) => {
            const c = lote(COMPU, UBICACION[n.id].compu);
            const m = lote(CELU, UBICACION[n.id].celu);
            return (
              <button
                key={n.id}
                type="button"
                className="pb-negocio"
                data-negocio={n.id}
                aria-pressed={abierto === n.id}
                aria-controls="pb-globo"
                onClick={() => setAbierto(n.id)}
                style={{ ...vars(c.r, ''), ...vars(m.r, 'm') } as CSSProperties}
              >
                <span className="pb-negocio-rubro">{n.rubro}</span>
              </button>
            );
          })}
        </div>

        <div id="pb-globo" className="pb-globo-lugar" aria-live="polite">
          {negocio ? (
            <section
              key={negocio.id}
              className="pb-globo"
              aria-label={textos.etiquetas[negocio.id]}
            >
              <div className="pb-globo-cabeza">
                <p className="pb-globo-rubro">{negocio.rubro}</p>
                <p className="pb-globo-sistema">{negocio.sistema}</p>
              </div>
              <div className="pb-globo-demo" aria-hidden="true">
                {fichas[negocio.id]}
              </div>
              <Link href={negocio.href} prefetch={false} className="pb-globo-ver">
                {negocio.ver}
              </Link>
            </section>
          ) : null}
        </div>
      </div>
      <p className="pb-pista">{textos.pista}</p>
    </div>
  );
}
