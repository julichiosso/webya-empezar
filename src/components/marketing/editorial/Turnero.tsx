import type { CSSProperties } from 'react';
import { MOCKUPS } from '@/content/mockups';
import { SECCIONES, TURNERO } from '@/content/home';
import { Boton } from './Boton';
import { CabezaSeccion } from './CabezaSeccion';
import { PantallaTurnero, PantallasTurneroApiladas, Telefono } from './Pantallas';

/**
 * Turnero con seña: scroll storytelling. En escritorio el teléfono queda fijo a la izquierda y cambia
 * de escena según el paso que cruza el centro de la pantalla (data-paso, lo pone el script de
 * movimiento). En celular cada paso lleva su propia pantalla, sin sticky. Cero JS de React.
 */
export function Turnero({ numero = 2, conCta = true }: { numero?: number; conCta?: boolean }) {
  const S = SECCIONES.turnero;
  return (
    <section id={S.id} className="tono-oscuro e-seccion" aria-labelledby="titulo-turnero">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          idTitulo="titulo-turnero"
        />
        <div className="mt-14 grid grid-cols-12 gap-x-6 md:mt-20" data-steps="" data-paso="1">
          <div className="col-span-12 hidden lg:col-span-5 lg:block">
            <div className="sticky top-[max(5.5rem,calc(50vh-18rem))]">
              <Telefono etiqueta={MOCKUPS.turnero.alt} className="max-w-[17.5rem]">
                <PantallasTurneroApiladas />
              </Telefono>
            </div>
          </div>
          <ol className="col-span-12 lg:col-span-6 lg:col-start-7">
            {TURNERO.pasos.map((p, i) => (
              <li
                key={p.rotulo}
                className="e-paso border-t border-ed-line py-10 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:py-0"
                data-step={i + 1}
              >
                <div data-reveal="">
                  <p className="e-rotulo flex gap-3 text-ed-muted">
                    <span className="text-ed-fg tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{p.rotulo}</span>
                  </p>
                  <h3 className="e-h2 mt-5 max-w-[14ch]">{p.titulo}</h3>
                  <p className="e-lead mt-5 max-w-[42ch] text-ed-muted">{p.texto}</p>
                </div>
                <div
                  className="mt-10 lg:hidden"
                  data-reveal=""
                  style={{ '--i': 1 } as CSSProperties}
                >
                  <Telefono className="max-w-[12.5rem]">
                    <PantallaTurnero paso={i + 1} />
                  </Telefono>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 grid grid-cols-12 gap-6 border-t border-ed-line pt-10">
          <p className="e-lead col-span-12 flex items-start gap-3 md:col-span-7">
            <span className="e-punto mt-2.5" aria-hidden="true" />
            <span>{TURNERO.prueba}</span>
          </p>
          {conCta ? (
            <div className="col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end">
              <Boton href="#armar" armar="turnero" iman>
                {TURNERO.cta}
              </Boton>
              <Boton href="/demo/peluqueria" variante="secundario" externo>
                {TURNERO.demo}
              </Boton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
