import type { CSSProperties } from 'react';
import { PORQUE, SECCIONES } from '@/content/home';
import { LinkChevron } from './LinkChevron';
import { MiniMapaZona } from './MiniMapaZona';
import { TituloPalabras } from './TituloPalabras';

/**
 * Por qué Webya: tres razones grandes, una línea cada una, y el mapa de dónde atendemos. Tarjetas grises
 * como en la vidriera de productos.
 */
export function Porque() {
  const S = SECCIONES.porque;
  return (
    <section id={S.id} className="tono-claro a-seccion" aria-labelledby="titulo-porque">
      <div className="e-wrap">
        <TituloPalabras lineas={[S.titulo]} id="titulo-porque" className="a-titulo text-center" />
        <ul className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-2 md:gap-4">
          {PORQUE.map((r, i) => (
            <li
              key={r.id}
              className="a-tile justify-center px-8 py-12 md:min-h-72"
              data-reveal=""
              style={{ '--i': i % 2 } as CSSProperties}
            >
              <h3 className="a-tile-titulo max-w-[16ch]">{r.titulo}</h3>
              <p className="a-sub mt-2 text-ed-muted">{r.texto}</p>
              {r.href ? (
                <LinkChevron href={r.href} className="mt-3">
                  {r.link}
                </LinkChevron>
              ) : null}
            </li>
          ))}
          <li
            className="a-tile justify-center px-6 py-8 md:min-h-72"
            data-reveal=""
            style={{ '--i': 1 } as CSSProperties}
          >
            <div className="text-left">
              <MiniMapaZona />
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
