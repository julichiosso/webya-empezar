import Image from 'next/image';
import type { CSSProperties } from 'react';
import { CTA, FRASES, RUTAS } from '@/content/home';
import type { Landing } from '@/content/landings';
import { getProyecto } from '@/content/proyectos';
import { Boton } from './Boton';
import { CabezaSeccion } from './CabezaSeccion';
import { FondoMarca } from './FondoMarca';
import { FlujoPedidos, Telefono } from './Pantallas';
import { PasosTurnero } from './PasosTurnero';

/** Captura real del proyecto que prueba cada producto (la tienda y la web). */
const PRUEBA: Partial<Record<Landing['tipo'], string>> = { tienda: 'petrucci', web: 'lorena' };

function Visual({ landing }: { landing: Landing }) {
  if (landing.tipo === 'pedidos') return <FlujoPedidos />;
  const img = getProyecto(PRUEBA[landing.tipo] ?? '')?.imagenes[0];
  if (!img) return null;
  return (
    <Telefono decorativo={false} colorBarra={img.barra}>
      <Image
        src={img.src}
        alt={landing.bloque.alt}
        fill
        sizes="(min-width: 1024px) 17.5rem, 70vw"
        className="object-cover object-top"
      />
    </Telefono>
  );
}

function Ctas({ landing }: { landing: Landing }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Boton href={RUTAS.armarTipo(landing.tipo)}>{CTA.armar}</Boton>
      <Boton href={landing.demo} variante="secundario" externo>
        {CTA.verDemo}
      </Boton>
    </div>
  );
}

/**
 * El producto contado en orden: dolor → solución → puntos → prueba → acción. El turnero se cuenta en
 * pasos con el teléfono que los muestra; el resto, en dos columnas con la captura o el flujo.
 */
export function BloqueProducto({ landing }: { landing: Landing }) {
  const B = landing.bloque;
  if (landing.tipo === 'turnero') {
    return (
      <section className="tono-claro e-seccion e-con-fondo" aria-labelledby="titulo-producto">
        <FondoMarca variante="frase" frase={FRASES.promesa} />
        <div className="e-wrap">
          <CabezaSeccion rotulo={B.rotulo} titulo={B.titulo} idTitulo="titulo-producto" />
          <div className="mt-10 md:mt-14">
            <PasosTurnero
              pasos={B.puntos.map((p) => ({
                rotulo: p.rotulo ?? '',
                titulo: p.titulo,
                texto: p.texto,
              }))}
              etiqueta={B.alt}
            />
          </div>
          <div className="mt-10 flex flex-col gap-6 border-t border-ed-line pt-8 md:flex-row md:items-center md:justify-between">
            <p className="e-lead max-w-[46ch]">{B.prueba}</p>
            <Ctas landing={landing} />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="tono-claro e-seccion e-con-fondo" aria-labelledby="titulo-producto">
      <FondoMarca variante="frase" frase={FRASES.promesa} />
      <div className="e-wrap">
        <CabezaSeccion rotulo={B.rotulo} titulo={B.titulo} idTitulo="titulo-producto" />
        <div className="mt-8 grid grid-cols-12 items-center gap-x-6 gap-y-10 md:mt-12">
          <div className="col-span-12 lg:col-span-6">
            <p className="e-h3 max-w-[30ch] font-medium" data-reveal="">
              {B.dolor}
            </p>
            <p
              className="e-lead mt-5 max-w-[48ch] text-ed-muted"
              data-reveal=""
              style={{ '--i': 1 } as CSSProperties}
            >
              {B.solucion}
            </p>
            <dl className="mt-8 grid grid-cols-1 border-t border-ed-line sm:grid-cols-2">
              {B.puntos.map((p, i) => (
                <div
                  key={p.titulo}
                  className="border-b border-ed-line py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6"
                  data-reveal=""
                  style={{ '--i': i } as CSSProperties}
                >
                  <dt className="font-semibold">{p.titulo}</dt>
                  <dd className="e-chico mt-1 text-ed-muted">{p.texto}</dd>
                </div>
              ))}
            </dl>
            <p className="e-cuerpo mt-6">{B.prueba}</p>
            <div className="mt-6">
              <Ctas landing={landing} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8" data-reveal="">
            <Visual landing={landing} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Para quién": los rubros con su lenguaje, para que cada negocio se reconozca. */
export function ParaQuien({ landing }: { landing: Landing }) {
  const P = landing.paraQuien;
  return (
    <section className="tono-oscuro e-seccion" aria-labelledby="titulo-para-quien">
      <div className="e-wrap">
        <CabezaSeccion rotulo={P.rotulo} titulo={P.titulo} idTitulo="titulo-para-quien" />
        <ul className="mt-8 grid grid-cols-1 border-t border-ed-line sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {P.rubros.map((r, i) => (
            <li
              key={r.titulo}
              className="border-b border-ed-line py-4 sm:pr-6"
              data-reveal=""
              style={{ '--i': i % 3 } as CSSProperties}
            >
              <p className="font-semibold">{r.titulo}</p>
              <p className="e-chico mt-1 text-ed-muted">{r.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
