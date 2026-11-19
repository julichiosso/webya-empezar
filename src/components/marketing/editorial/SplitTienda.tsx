import type { CSSProperties } from 'react';
import { TIENDA } from '@/content/landings';
import { Boton } from './Boton';
import { CabezaSeccion } from './CabezaSeccion';
import { PantallaProyecto, Telefono } from './Pantallas';

/** Bloque de /tiendas: dolor y solución a un lado, el mockup de tienda al otro. */
export function SplitTienda({ numero = 1 }: { numero?: number }) {
  return (
    <section id="tienda" className="tono-claro e-seccion" aria-labelledby="titulo-tienda">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={TIENDA.rotulo}
          titulo={TIENDA.titulo}
          idTitulo="titulo-tienda"
        />
        <div className="mt-14 grid grid-cols-12 items-center gap-x-6 gap-y-14 md:mt-20">
          <div className="col-span-12 lg:col-span-6">
            <p className="e-h3 max-w-[30ch] font-medium" data-reveal="">
              {TIENDA.dolor}
            </p>
            <p
              className="e-lead mt-6 max-w-[48ch] text-ed-muted"
              data-reveal=""
              style={{ '--i': 1 } as CSSProperties}
            >
              {TIENDA.solucion}
            </p>
            <dl className="mt-10 grid grid-cols-1 border-t border-ed-line sm:grid-cols-2">
              {TIENDA.puntos.map((p, i) => (
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
              {TIENDA.prueba}
            </p>
            <div className="mt-8">
              <Boton href="#armar" armar="tienda">
                {TIENDA.cta}
              </Boton>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8" data-reveal="">
            <Telefono etiqueta={TIENDA.alt}>
              <PantallaProyecto mockup="tienda" />
            </Telefono>
          </div>
        </div>
      </div>
    </section>
  );
}
