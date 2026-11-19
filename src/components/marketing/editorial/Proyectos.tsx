import Image from 'next/image';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { DEMOS } from '@/content/demos/hub';
import { PROYECTOS_UI, SECCIONES } from '@/content/home';
import { ESTADO_PROYECTO, PROYECTOS, dominioDe, type Proyecto } from '@/content/proyectos';
import { CabezaSeccion } from './CabezaSeccion';
import { ControlesCarril } from './ControlesCarril';
import { FlechaDiagonal, Mas } from './Iconos';
import { PantallaProyecto, Telefono } from './Pantallas';

const CARRIL = 'carril-proyectos';

function Visual({ p }: { p: Proyecto }) {
  const img = p.imagenes[0];
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ed-line bg-ed-surface">
      <div className="absolute top-6 left-1/2 w-[46%] -translate-x-1/2">
        <Telefono
          className="max-w-none"
          etiqueta={img ? undefined : PROYECTOS_UI.mockupAlt(p.sistema)}
          decorativo={!img}
          colorBarra={img?.barra}
        >
          {img ? (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 16rem, 52vw"
              className="object-cover object-top"
            />
          ) : (
            <PantallaProyecto mockup={p.mockup} />
          )}
        </Telefono>
      </div>
    </div>
  );
}

function Tarjeta({ p, i }: { p: Proyecto; i: number }) {
  const enProduccion = p.estado === 'produccion';
  const demoPropia = DEMOS.find((d) => d.sistema === p.tipo);
  const demo = demoPropia
    ? { href: demoPropia.href }
    : enlaceContacto(PROYECTOS_UI.mensajeDemo(p.cliente));
  return (
    <article
      id={`proyecto-${p.id}`}
      className="flex scroll-mt-24 flex-col"
      aria-labelledby={`titulo-proyecto-${p.id}`}
      data-reveal=""
      style={{ '--i': i } as CSSProperties}
    >
      <Visual p={p} />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="e-rotulo text-ed-muted">
          {p.rubro} · {p.ciudad}
        </p>
        <p
          className={cn(
            'e-rotulo flex items-center gap-2 rounded-full border px-2.5 py-1.5',
            enProduccion ? 'border-ed-line' : 'border-dashed border-ed-line-strong',
          )}
        >
          {enProduccion ? <span className="e-punto" aria-hidden="true" /> : null}
          {ESTADO_PROYECTO[p.estado]}
        </p>
      </div>
      <h3 id={`titulo-proyecto-${p.id}`} className="e-h3 mt-3">
        {p.cliente}
      </h3>
      <p className="e-cuerpo mt-1 text-ed-muted">{p.sistema}</p>
      <p className="e-chico mt-3">{p.problema}</p>
      <details className="group mt-4 border-t border-ed-line pt-3">
        <summary className="e-chico flex min-h-11 cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
          {PROYECTOS_UI.incluye}
          <span
            aria-hidden="true"
            className="text-ed-muted transition-transform group-open:rotate-45"
          >
            <Mas />
          </span>
        </summary>
        <ul className="e-chico space-y-1.5 pb-1 text-ed-muted">
          {p.incluye.map((x) => (
            <li key={x} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-ed-fg" />
              {x}
            </li>
          ))}
        </ul>
      </details>
      <div className="mt-auto pt-4">
        {p.url ? (
          <a href={p.url} target="_blank" rel="noopener" className="e-link e-cuerpo font-medium">
            {enProduccion ? PROYECTOS_UI.ver : PROYECTOS_UI.verAvance}
            <span className="text-ed-muted">{dominioDe(p.url)}</span>
            <FlechaDiagonal />
            <span className="sr-only">{PROYECTOS_UI.externo}</span>
          </a>
        ) : (
          <a
            href={demo.href}
            target="_blank"
            rel="noopener"
            className="e-link e-cuerpo font-medium"
          >
            {demoPropia ? PROYECTOS_UI.probarDemo : PROYECTOS_UI.pedirDemo}
            <FlechaDiagonal />
            <span className="sr-only">{PROYECTOS_UI.externo}</span>
          </a>
        )}
      </div>
    </article>
  );
}

/** Carril horizontal (scroll-snap) con los proyectos del manifiesto. */
export function Proyectos({
  numero = 4,
  filtro,
}: {
  numero?: number;
  /** Solo algunos proyectos (landings). */
  filtro?: (p: Proyecto) => boolean;
}) {
  const S = SECCIONES.proyectos;
  const lista = filtro ? PROYECTOS.filter(filtro) : PROYECTOS;
  return (
    <section
      id={S.id}
      className="tono-claro e-seccion scroll-mt-16"
      aria-labelledby="titulo-proyectos"
    >
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          bajada={S.bajada}
          idTitulo="titulo-proyectos"
        >
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="e-chico text-ed-muted md:hidden">{PROYECTOS_UI.deslizar}</p>
            <ControlesCarril
              carrilId={CARRIL}
              anterior={PROYECTOS_UI.anterior}
              siguiente={PROYECTOS_UI.siguiente}
            />
          </div>
        </CabezaSeccion>
      </div>
      <div
        id={CARRIL}
        className="e-carril mt-8"
        tabIndex={0}
        role="region"
        aria-labelledby="titulo-proyectos"
      >
        {lista.map((p, i) => (
          <Tarjeta key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
