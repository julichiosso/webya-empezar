import Image from 'next/image';
import type { CSSProperties } from 'react';
import { CTA, RUTAS } from '@/content/home';
import type { Landing } from '@/content/landings';
import { getProyecto } from '@/content/proyectos';
import { Boton } from './Boton';
import { FlujoPedidos, Telefono } from './Pantallas';
import { PasosTurnero } from './PasosTurnero';
import { TituloPalabras } from './TituloPalabras';

/** Captura real del proyecto que prueba cada producto (la tienda y la web). */
const PRUEBA: Partial<Record<Landing['tipo'], string>> = { tienda: 'petrucci', web: 'lorena' };

function Visual({ landing }: { landing: Landing }) {
  if (landing.tipo === 'pedidos') return <FlujoPedidos />;
  const img = getProyecto(PRUEBA[landing.tipo] ?? '')?.imagenes.mobile;
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

/** La prueba (dónde funciona) y las dos acciones, centradas. */
function Cierre({ landing }: { landing: Landing }) {
  return (
    <div className="mt-12 flex flex-col items-center gap-5 text-center md:mt-16" data-reveal="">
      <p className="a-sub text-ed-muted">{landing.bloque.prueba}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Boton href={RUTAS.armarTipo(landing.tipo)}>{CTA.armar}</Boton>
        <Boton href={landing.demo} variante="secundario" externo>
          {CTA.verDemo}
        </Boton>
      </div>
    </div>
  );
}

/** Título de sección centrado, grande. */
function Titulo({ texto, id }: { texto: string; id: string }) {
  return <TituloPalabras lineas={[texto]} id={id} className="a-titulo mx-auto text-center" />;
}

/**
 * El producto contado como la página de un producto de tecnología: un título, la idea en una línea, las
 * cuatro funciones en tarjetas y el teléfono real al lado. El turnero se cuenta en pasos con el teléfono
 * que los muestra. Al final, dónde funciona y las dos acciones.
 */
export function BloqueProducto({ landing }: { landing: Landing }) {
  const B = landing.bloque;
  if (landing.tipo === 'turnero') {
    return (
      <section className="tono-gris a-seccion" aria-labelledby="titulo-producto">
        <div className="e-wrap">
          <Titulo texto={B.titulo} id="titulo-producto" />
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
          <Cierre landing={landing} />
        </div>
      </section>
    );
  }
  return (
    <section className="tono-gris a-seccion" aria-labelledby="titulo-producto">
      <div className="e-wrap">
        <Titulo texto={B.titulo} id="titulo-producto" />
        <p className="a-sub mx-auto mt-3 max-w-[30ch] text-center text-ed-muted" data-reveal="">
          {B.solucion}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:gap-4 lg:grid-cols-12">
          <div className="a-tile justify-center px-6 py-10 lg:col-span-5" data-reveal="">
            <div className="w-full max-w-72">
              <Visual landing={landing} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:col-span-7">
            {B.puntos.map((p, i) => (
              <div
                key={p.titulo}
                className="a-tile justify-center px-4 py-8 md:px-8 md:py-12"
                data-reveal=""
                style={{ '--i': i } as CSSProperties}
              >
                <p className="text-[1.25rem] leading-tight font-semibold tracking-[-0.03em] md:text-[1.75rem]">
                  {p.titulo}
                </p>
                <p className="e-chico mt-2 text-ed-muted md:text-[1rem]">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
        <Cierre landing={landing} />
      </div>
    </section>
  );
}

/** "Para quién": los rubros como chips, para que cada negocio se reconozca de un vistazo. */
export function ParaQuien({ landing }: { landing: Landing }) {
  const P = landing.paraQuien;
  return (
    <section className="tono-claro a-seccion" aria-labelledby="titulo-para-quien">
      <div className="e-wrap flex flex-col items-center">
        <Titulo texto={P.titulo} id="titulo-para-quien" />
        <ul className="mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5 md:mt-10">
          {P.rubros.map((r, i) => (
            <li
              key={r.titulo}
              className="a-chip"
              data-reveal=""
              style={{ '--i': i % 4 } as CSSProperties}
            >
              {r.titulo}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
