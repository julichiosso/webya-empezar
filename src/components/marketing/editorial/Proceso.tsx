import type { CSSProperties } from 'react';
import { PROCESO, SECCIONES } from '@/content/home';
import { CabezaSeccion } from './CabezaSeccion';

/** Cómo trabajo: cuatro pasos numerados en una grilla de líneas finas. */
export function Proceso({ numero = 6 }: { numero?: number }) {
  const S = SECCIONES.comoTrabajo;
  return (
    <section id={S.id} className="tono-claro e-seccion" aria-labelledby="titulo-como-trabajo">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          idTitulo="titulo-como-trabajo"
        />
        <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ed-line bg-ed-line sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {PROCESO.pasos.map((p, i) => (
            <li
              key={p.titulo}
              className="flex flex-col justify-between gap-6 bg-ed-bg p-6 sm:min-h-[16rem] sm:gap-10 md:p-8"
              data-reveal=""
              style={{ '--i': i } as CSSProperties}
            >
              <span
                className="e-cifra text-[2.5rem] text-ed-muted sm:text-[3.5rem]"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="e-h3">{p.titulo}</h3>
                <p className="e-cuerpo mt-3 text-ed-muted">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
