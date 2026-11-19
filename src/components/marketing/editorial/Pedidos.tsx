import type { CSSProperties } from 'react';
import { PEDIDOS, SECCIONES } from '@/content/home';
import { Boton } from './Boton';
import { CabezaSeccion } from './CabezaSeccion';
import { FlujoPedidos } from './Pantallas';

/** Sistema de pedidos: split screen. Dolor y solución a la izquierda, el flujo animado a la derecha. */
export function Pedidos({ numero = 3, conCta = true }: { numero?: number; conCta?: boolean }) {
  const S = SECCIONES.pedidos;
  return (
    <section id={S.id} className="tono-claro e-seccion" aria-labelledby="titulo-pedidos">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          idTitulo="titulo-pedidos"
        />
        <div className="mt-14 grid grid-cols-12 items-center gap-x-6 gap-y-14 md:mt-20">
          <div className="col-span-12 lg:col-span-6">
            <p className="e-h3 max-w-[30ch] font-medium" data-reveal="">
              {PEDIDOS.dolor}
            </p>
            <p
              className="e-lead mt-6 max-w-[48ch] text-ed-muted"
              data-reveal=""
              style={{ '--i': 1 } as CSSProperties}
            >
              {PEDIDOS.solucion}
            </p>
            <dl className="mt-10 grid grid-cols-1 border-t border-ed-line sm:grid-cols-2">
              {PEDIDOS.puntos.map((p, i) => (
                <div
                  key={p.titulo}
                  className="border-b border-ed-line py-5 sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
                  data-reveal=""
                  style={{ '--i': i } as CSSProperties}
                >
                  <dt className="font-semibold">{p.titulo}</dt>
                  <dd className="e-chico mt-1 text-ed-muted">{p.texto}</dd>
                </div>
              ))}
            </dl>
            <p className="e-cuerpo mt-8 flex items-center gap-3">
              <span className="e-punto" aria-hidden="true" />
              {PEDIDOS.prueba}
            </p>
            {conCta ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Boton href="#armar" armar="pedidos" iman>
                  {PEDIDOS.cta}
                </Boton>
                <Boton href="/demo/pedidos" variante="secundario">
                  {PEDIDOS.demo}
                </Boton>
              </div>
            ) : null}
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8" data-reveal="">
            <FlujoPedidos />
          </div>
        </div>
      </div>
    </section>
  );
}
