import type { CSSProperties } from 'react';
import { SECCIONES } from '@/content/home';
import { CabezaSeccion } from './CabezaSeccion';
import { Mas } from './Iconos';

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

/** FAQ en acordeón nativo (<details>): accesible con teclado y lector, sin JS. */
export function Preguntas({
  numero = 8,
  preguntas,
}: {
  numero?: number;
  preguntas: readonly Pregunta[];
}) {
  const S = SECCIONES.faq;
  return (
    <section id={S.id} className="tono-claro e-seccion" aria-labelledby="titulo-preguntas">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          idTitulo="titulo-preguntas"
        />
        <div className="mt-14 grid grid-cols-12 md:mt-20">
          <ul className="col-span-12 border-b border-ed-line md:col-span-9 md:col-start-4">
            {preguntas.map((q, i) => (
              <li
                key={q.pregunta}
                className="border-t border-ed-line"
                data-reveal=""
                style={{ '--i': i } as CSSProperties}
              >
                <details className="e-detalle">
                  <summary className="flex min-h-16 items-center justify-between gap-6 py-5">
                    <span className="e-h3 font-medium">{q.pregunta}</span>
                    <Mas className="e-mas shrink-0" />
                  </summary>
                  <p className="e-detalle-cuerpo e-lead max-w-[60ch] pb-7 text-ed-muted">
                    {q.respuesta}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
