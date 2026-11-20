import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ESCENAS } from '@/content/home';
import { CabezaSeccion } from './CabezaSeccion';

/**
 * Tres escenas de la semana de un negocio: cuándo pasa (en grande, la tinta lo recorre al entrar),
 * el problema de siempre y lo que cambia con el sistema, con el link a su página. En el celular, una
 * escena por pantalla.
 */
export function Escenas() {
  return (
    <section className="tono-claro" aria-labelledby="titulo-escenas">
      <div className="e-wrap py-12 md:py-20">
        <CabezaSeccion idTitulo="titulo-escenas" rotulo={ESCENAS.rotulo} titulo={ESCENAS.titulo} />
        <ol className="e-escenas mt-8 grid grid-cols-1 md:mt-12 md:grid-cols-3 md:gap-x-10">
          {ESCENAS.lista.map((e, i) => (
            <li
              key={e.cuando}
              className="e-escena-item"
              data-reveal=""
              style={{ '--i': i } as CSSProperties}
            >
              <p
                className="e-manifiesto-palabra e-escena-cuando"
                data-texto={e.cuando}
                style={{ '--i': i } as CSSProperties}
              >
                {e.cuando}
              </p>
              <p className="e-cuerpo mt-3 max-w-[32ch] text-ed-muted">{e.antes}</p>
              <p className="e-cuerpo mt-2 max-w-[32ch] font-medium">{e.despues}</p>
              <Link href={e.href} className="e-link mt-4 inline-block">
                {e.link}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
