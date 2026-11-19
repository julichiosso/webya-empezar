import Link from 'next/link';
import type { CSSProperties } from 'react';
import { RUBROS_INDICE, SECCIONES } from '@/content/home';
import { CabezaSeccion } from './CabezaSeccion';
import { Flecha, Mas } from './Iconos';

/**
 * Índice de rubros: lista grande con línea fina, un solo <details> por fila (sin JS, sin duplicar
 * markup). En escritorio, al pasar el mouse el nombre se corre y aparece qué se arma; con un toque
 * (o Enter) se abre el detalle con el enlace. En celular es un acordeón.
 */
export function RubrosIndice({ numero = 5 }: { numero?: number }) {
  const S = SECCIONES.rubros;
  return (
    <section id={S.id} className="tono-oscuro e-seccion" aria-labelledby="titulo-rubros">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          bajada={S.bajada}
          idTitulo="titulo-rubros"
        />
        <ul className="mt-14 border-b border-ed-line md:mt-20">
          {RUBROS_INDICE.map((r, i) => (
            <li
              key={r.nombre}
              className="border-t border-ed-line"
              data-reveal=""
              style={{ '--i': i } as CSSProperties}
            >
              <details className="e-detalle e-indice-fila">
                <summary className="grid min-h-16 grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-5 lg:grid-cols-12 lg:gap-x-6 lg:py-8">
                  <span className="e-rotulo text-ed-muted tabular-nums lg:col-span-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="e-indice-nombre e-h3 lg:col-span-6 lg:text-[clamp(2rem,1rem+2.6vw,3.5rem)] lg:leading-none">
                    {r.nombre}
                  </span>
                  <span className="e-indice-extra hidden lg:col-span-4 lg:block">
                    <span className="e-chico block text-ed-muted">{r.ejemplos}</span>
                    <span className="e-cuerpo mt-1 block">{r.arma}</span>
                  </span>
                  <span className="flex justify-end lg:col-span-1">
                    <Mas className="e-mas" />
                  </span>
                </summary>
                <div className="e-detalle-cuerpo pb-7 pl-[3.5rem] lg:pl-[calc((100%+1.5rem)/12)]">
                  <p className="e-chico text-ed-muted lg:hidden">{r.ejemplos}</p>
                  <p className="e-cuerpo mt-2 lg:hidden">{r.arma}</p>
                  <Link href={r.link.href} className="e-link e-cuerpo mt-4 font-medium lg:mt-0">
                    {r.link.texto}
                    <Flecha />
                  </Link>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
