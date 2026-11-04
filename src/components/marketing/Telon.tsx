import type { CSSProperties } from 'react';
import { LOGO_TRAZOS, LOGO_VIEWBOX } from '@/brand/logo/trazos';
import { CLIENTES } from '@/content/clientes';
import { TELON } from '@/content/telon';
import estilos from './Telon.module.css';

/** Id del h1 del hero: destino del enlace "Saltar". */
const DESTINO = 'hero-title';

/** La intro está encendida; NEXT_PUBLIC_INTRO_LOGO=0 la apaga (se resuelve al compilar). */
export const INTRO_ACTIVA = process.env.NEXT_PUBLIC_INTRO_LOGO !== '0';

// Tres filas con las mismas capturas en otro orden; cada una deriva distinto con el scroll.
const TAMANO_FILA = 14;
const FILAS = [0, 1, 2, 3, 4].map((desfase) =>
  Array.from({ length: TAMANO_FILA }, (_, k) => (k + desfase) % CLIENTES.length),
);

const RECT = { x: -8000, y: -8000, width: 17000, height: 16300 } as const;

/**
 * "El telón": el logo de WebYa grande sobre casi-negro. Al scrollear, las letras funcionan como
 * ventanas a una pared de capturas reales inclinada en perspectiva; el logo crece hasta que la pared
 * ocupa todo y queda el hero. Todo es CSS con animation-timeline (solo transform y opacity); sin
 * soporte, con reduced-motion o dentro del navegador de Instagram no se muestra (hero directo).
 * El h1 y el wizard están en el DOM desde el inicio: la intro va antes en el flujo y es decorativa.
 */
export function Telon() {
  return (
    <div className={estilos.telon} data-telon>
      <a href={`#${DESTINO}`} className={estilos.saltar}>
        {TELON.saltar}
      </a>
      <div aria-hidden="true" className={estilos.escena}>
        <div className={estilos.perspectiva}>
          <div className={estilos.pared}>
            {FILAS.map((fila, f) => (
              <div key={f} className={`${estilos.fila} ${estilos[`f${f % 3}`]}`}>
                {fila.map((i, k) => {
                  const c = CLIENTES[i % CLIENTES.length];
                  if (!c) return null;
                  const primera = f === 2 && k === 2;
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={k}
                      src={c.telon}
                      alt=""
                      width={375}
                      height={560}
                      // Son 3 archivos livianos repetidos: se piden todos (lazy dejaría huecos en la pared 3D).
                      fetchPriority={primera ? 'high' : 'low'}
                      decoding="async"
                      className={estilos.captura}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className={estilos.velo} />
        <svg viewBox={LOGO_VIEWBOX} className={estilos.mascara} focusable="false">
          <defs>
            <mask id="telon-mascara" maskUnits="userSpaceOnUse" {...RECT}>
              <rect {...RECT} fill="white" />
              <g fill="black" fillRule="evenodd">
                {LOGO_TRAZOS.map((t) => (
                  <path key={t.letra} d={t.d} />
                ))}
              </g>
            </mask>
          </defs>
          <rect {...RECT} className={estilos.tinta} mask="url(#telon-mascara)" />
        </svg>
        <p className={estilos.pista}>{TELON.pista}</p>
        <div className={estilos.rotulos}>
          {CLIENTES.map((c, i) => (
            <p
              key={c.id}
              className={estilos.rotulo}
              style={
                {
                  '--ini': `${4 + (i * 94) / CLIENTES.length}svh`,
                  '--fin': `${1 + ((i + 1) * 94) / CLIENTES.length}svh`,
                } as CSSProperties
              }
            >
              {c.rotulo}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
