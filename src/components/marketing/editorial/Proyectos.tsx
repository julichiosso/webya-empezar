import Link from 'next/link';
import type { CSSProperties } from 'react';
import { CTA, PROYECTOS_UI, RUTAS, SECCIONES } from '@/content/home';
import { CASOS, ESTADO_PROYECTO, datosCasos, dominioDe, type Proyecto } from '@/content/proyectos';
import { Boton } from './Boton';
import { CabezaSeccion } from './CabezaSeccion';
import Image from 'next/image';
import { Casos, type CasoVista, type VisualesCaso } from './Casos';
import { Composicion } from './Composicion';
import { FondoGrilla } from './FondoGrilla';
import { PantallaProyecto, Telefono } from './Pantallas';

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
      className="tono-oscuro e-seccion"
      style={enPagina ? { paddingTop: 0 } : undefined}
      aria-labelledby={enPagina ? undefined : 'titulo-proyectos'}
    >
      <div className="e-wrap">
        {enPagina ? null : (
          <CabezaSeccion
            rotulo={S.rotulo}
            titulo={S.titulo}
            bajada={S.bajada}
            idTitulo="titulo-proyectos"
          />
        )}
        <p
          className={
            enPagina ? 'e-chico text-ed-muted' : 'e-chico mt-6 text-ed-muted md:col-start-4'
          }
        >
          {textoDatos()}
        </p>
        <div className="mt-6 md:mt-8">
          <Casos casos={CASOS.map(vista)} visuales={visuales()} />
        </div>
        <div className="mt-12 flex flex-col gap-5 rounded-[1.75rem] bg-ed-surface p-6 md:mt-16 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="e-h3">{PROYECTOS_UI.proximo.titulo}</p>
          <div className="grid grid-cols-1 gap-3 sm:flex">
            <Boton href={RUTAS.armar}>{CTA.armar}</Boton>
            {enPagina ? null : (
              <Boton href={RUTAS.proyectos} variante="secundario">
                {PROYECTOS_UI.verTodos}
              </Boton>
            )}
          </div>
        </div>
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
      className="flex scroll-mt-24 flex-col"
      aria-labelledby={`titulo-proyecto-${p.id}`}
      data-reveal=""
      style={{ '--i': i % 3 } as CSSProperties}
    >
      <div className="rounded-[1.5rem] bg-ed-surface p-5">
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
      className="tono-claro e-seccion e-con-fondo scroll-mt-16"
      aria-labelledby="titulo-proyectos"
    >
      <FondoGrilla />
      <div className="e-wrap">
        <CabezaSeccion rotulo={S.rotulo} titulo={S.titulo} idTitulo="titulo-proyectos" />
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
          {lista.map((p, i) => (
            <Tarjeta key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
