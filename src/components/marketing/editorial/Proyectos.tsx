import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PROYECTOS_UI, RUTAS, SECCIONES } from '@/content/home';
import { CASOS, ESTADO_PROYECTO, datosCasos, dominioDe, type Proyecto } from '@/content/proyectos';
import Image from 'next/image';
import { Casos, type CasoVista, type VisualesCaso } from './Casos';
import { Composicion } from './Composicion';
import { LinkChevron } from './LinkChevron';
import { PantallaProyecto, Telefono } from './Pantallas';
import { TituloPalabras } from './TituloPalabras';

/** Lo que el componente de casos necesita de cada proyecto (todo sale del manifiesto). */
const vista = (p: Proyecto): CasoVista => ({
  ...p,
  href: `${RUTAS.proyectos}/${p.id}`,
  estadoTexto: ESTADO_PROYECTO[p.estado],
  dominio: p.url ? dominioDe(p.url) : undefined,
});

/** El teléfono de la tarjeta del celular: la captura real o el esquema del sistema. */
function Miniatura({ p }: { p: Proyecto }) {
  const img = p.imagenes.mobile;
  return (
    <Telefono
      className="max-w-none"
      decorativo={!img}
      barra={!img?.completa}
      colorBarra={img?.barra}
    >
      {img ? (
        <Image src={img.src} alt={img.alt} fill sizes="7rem" className="object-cover object-top" />
      ) : (
        <PantallaProyecto mockup={p.mockup} />
      )}
    </Telefono>
  );
}

/** Las imágenes de cada caso, dibujadas acá (servidor) y pasadas ya armadas al componente interactivo. */
const visuales = (): VisualesCaso =>
  Object.fromEntries(
    CASOS.map((p) => [p.id, { panel: <Composicion caso={p} />, miniatura: <Miniatura p={p} /> }]),
  );

/** La barra de datos, calculada desde el manifiesto. */
function textoDatos() {
  const d = datosCasos();
  return PROYECTOS_UI.datos(d.casos, d.enProduccion, d.rubros.join(', '), d.ciudades.join(', '));
}

/**
 * Casos de éxito: encabezado, barra de datos real, el índice con su panel (escritorio) o las tarjetas
 * (celular) y el cierre "¿Tu negocio es el próximo?". En la home y en /proyectos (ahí el título es el h1
 * de la página y no hace falta el link a todos).
 */
export function SeccionCasos({ enPagina = false }: { enPagina?: boolean }) {
  const S = SECCIONES.proyectos;
  return (
    <section
      id={S.id}
      className="tono-oscuro a-seccion"
      style={enPagina ? { paddingTop: 0 } : undefined}
      aria-labelledby={enPagina ? undefined : 'titulo-proyectos'}
    >
      <div className="e-wrap">
        {enPagina ? null : (
          <TituloPalabras
            lineas={[S.titulo]}
            id="titulo-proyectos"
            className="a-titulo mx-auto text-center"
          />
        )}
        <p
          className={enPagina ? 'e-chico text-ed-muted' : 'e-chico mt-4 text-center text-ed-muted'}
        >
          {textoDatos()}
        </p>
        <div className="mt-6 md:mt-8">
          <Casos casos={CASOS.map(vista)} visuales={visuales()} />
        </div>
        {enPagina ? null : (
          <div className="mt-10 flex justify-center">
            <LinkChevron href={RUTAS.proyectos}>{PROYECTOS_UI.verTodos}</LinkChevron>
          </div>
        )}
      </div>
    </section>
  );
}

/** Home: la sección de casos. */
export function ProyectosInicio() {
  return <SeccionCasos />;
}

/** Tarjeta de un caso en las páginas de producto: composición, desafío, lo que armamos y el caso. */
function Tarjeta({ p, i }: { p: Proyecto; i: number }) {
  return (
    <article
      id={`proyecto-${p.id}`}
      className="flex w-full scroll-mt-24 flex-col md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]"
      aria-labelledby={`titulo-proyecto-${p.id}`}
      data-reveal=""
      style={{ '--i': i % 3 } as CSSProperties}
    >
      <div className="rounded-[1.75rem] bg-ed-surface p-5">
        <Composicion caso={p} tamanos="(min-width: 768px) 24rem, 88vw" />
      </div>
      <p className="e-chico mt-4 text-ed-muted">
        {p.rubro} · {p.ciudad} · {ESTADO_PROYECTO[p.estado]}
      </p>
      <h3 id={`titulo-proyecto-${p.id}`} className="e-h3 mt-2">
        {p.cliente}
      </h3>
      <p className="e-cuerpo mt-2 text-ed-muted">{p.desafio}</p>
      <div className="mt-auto pt-5">
        <Link href={`${RUTAS.proyectos}/${p.id}`} className="e-link e-cuerpo font-medium">
          {PROYECTOS_UI.verCaso}
        </Link>
      </div>
    </article>
  );
}

/** Páginas de producto: los casos de ese tipo, con su cabeza de sección. */
export function ProyectosGrilla({
  filtro,
}: {
  filtro?: (p: Proyecto) => boolean;
  cabeza?: boolean;
}) {
  const S = SECCIONES.proyectos;
  const lista = filtro ? CASOS.filter(filtro) : CASOS;
  if (lista.length === 0) return null;
  return (
    <section
      id={S.id}
      className="tono-gris a-seccion scroll-mt-16"
      aria-labelledby="titulo-proyectos"
    >
      <div className="e-wrap">
        <TituloPalabras
          lineas={[S.titulo]}
          id="titulo-proyectos"
          className="a-titulo mx-auto text-center"
        />
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-14 md:mt-12">
          {lista.map((p, i) => (
            <Tarjeta key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
