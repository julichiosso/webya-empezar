import type { CSSProperties } from 'react';
import { CITAS, HECHOS } from '@/content/home';
import { resumenProyectos } from '@/content/proyectos';
import { Cita } from './Cita';

/**
 * Pull quote + cifras reales. Los números salen del manifiesto de proyectos (nunca a mano) y cuentan
 * desde cero al entrar; sin JS se ve el número final.
 */
export function Hechos() {
  const r = resumenProyectos();
  const items = [
    { n: r.total, texto: HECHOS.items.total },
    { n: r.enProduccion, texto: HECHOS.items.enProduccion },
    { n: r.rubros, texto: HECHOS.items.rubros },
  ];
  return (
    <section className="tono-oscuro e-seccion" aria-labelledby="titulo-hechos">
      <Cita texto={CITAS.directo.texto} autor={CITAS.directo.autor} />
      <div className="e-wrap mt-20 md:mt-28">
        <h2 id="titulo-hechos" className="e-rotulo text-ed-muted" data-reveal="">
          {HECHOS.titulo}
        </h2>
        <ul className="mt-6 grid grid-cols-1 border-t border-ed-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <li
              key={it.texto}
              className="border-b border-ed-line py-8 sm:pr-6 lg:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
              data-reveal=""
              style={{ '--i': i } as CSSProperties}
            >
              <p className="e-cifra text-[clamp(4rem,3rem+5vw,7.5rem)]" data-count={it.n}>
                {it.n}
              </p>
              <p className="e-cuerpo mt-4 max-w-[22ch] text-ed-muted">{it.texto}</p>
            </li>
          ))}
          <li
            className="py-8 sm:pr-6 lg:border-l lg:border-ed-line lg:pl-6"
            data-reveal=""
            style={{ '--i': 3 } as CSSProperties}
          >
            <p className="e-cifra text-[clamp(4rem,3rem+5vw,7.5rem)]">{HECHOS.persona.cifra}</p>
            <p className="e-cuerpo mt-4 max-w-[22ch] text-ed-muted">{HECHOS.persona.texto}</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
