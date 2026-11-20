import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { cn } from '@/components/ui/clases';
import { DEMOS } from '@/content/demos/hub';
import { CTA, PROYECTOS_UI, RUTAS, SECCIONES } from '@/content/home';
import { ESTADO_PROYECTO, PROYECTOS, dominioDe, type Proyecto } from '@/content/proyectos';
import { CabezaSeccion } from './CabezaSeccion';
import { Flecha, FlechaDiagonal } from './Iconos';
import { PantallaProyecto, Telefono } from './Pantallas';

/** La captura real en el teléfono o, mientras falte, el esquema vectorial del manifiesto. */
function Visual({ p, chico = false }: { p: Proyecto; chico?: boolean }) {
  const img = p.imagenes[0];
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-ed-line bg-ed-surface',
        chico ? 'aspect-[4/5]' : 'aspect-[4/3]',
      )}
    >
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2',
          chico ? 'top-5 w-[62%]' : 'top-6 w-[46%]',
        )}
      >
        <Telefono
          className="max-w-none"
          etiqueta={img ? undefined : PROYECTOS_UI.mockupAlt(p.sistema)}
          decorativo={!img}
          colorBarra={img?.barra}
        >
          {img ? (
            <Image
              src={img.src}
              alt={chico ? '' : img.alt}
              fill
              sizes={chico ? '(min-width: 1024px) 11rem, 40vw' : '(min-width: 768px) 16rem, 52vw'}
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

function Estado({ p }: { p: Proyecto }) {
  return (
    <span className="e-rotulo inline-flex items-center gap-2 text-ed-muted">
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          p.estado === 'produccion' ? 'bg-ed-fg' : 'border border-ed-line-strong',
        )}
      />
      {ESTADO_PROYECTO[p.estado]}
    </span>
  );
}

/** Home: cuatro proyectos en grilla compacta (dos por fila en el celular) y el link a todos. */
export function ProyectosInicio({ numero = 2 }: { numero?: number }) {
  const S = SECCIONES.proyectos;
  const lista = PROYECTOS.filter((p) => p.id !== 'abelardo').slice(0, 4);
  return (
    <section id={S.id} className="tono-oscuro e-seccion" aria-labelledby="titulo-proyectos">
      <div className="e-wrap">
        <CabezaSeccion
          numero={numero}
          rotulo={S.rotulo}
          titulo={S.titulo}
          idTitulo="titulo-proyectos"
        />
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-12 lg:grid-cols-4 lg:gap-x-5">
          {lista.map((p, i) => (
            <li key={p.id} data-reveal="" style={{ '--i': i } as CSSProperties}>
              <Link
                href={`${RUTAS.proyectos}#proyecto-${p.id}`}
                className="group block active:opacity-70"
              >
                <Visual p={p} chico />
                <span className="mt-3 block">
                  <Estado p={p} />
                </span>
                <span className="mt-1.5 block text-[0.9375rem] leading-tight font-semibold underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-current md:text-[1.0625rem]">
                  {p.cliente}
                </span>
                <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ed-muted">
                  {p.sistema}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={RUTAS.proyectos} className="e-link e-cuerpo mt-8 font-medium">
          {PROYECTOS_UI.verTodos}
          <Flecha />
        </Link>
      </div>
    </section>
  );
}

/** Tarjeta completa: problema → qué armamos → qué ve el cliente, y el link al sitio o a la demo. */
function Tarjeta({ p, i, nivel }: { p: Proyecto; i: number; nivel: 'h2' | 'h3' }) {
  const Titulo = nivel;
  const demo = DEMOS.find((d) => d.sistema === p.tipo);
  const fila = 'border-t border-ed-line pt-3';
  return (
    <article
      id={`proyecto-${p.id}`}
      className="flex scroll-mt-24 flex-col"
      aria-labelledby={`titulo-proyecto-${p.id}`}
      data-reveal=""
      style={{ '--i': i % 3 } as CSSProperties}
    >
      <Visual p={p} />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="e-rotulo text-ed-muted">
          {p.rubro} · {p.ciudad}
        </p>
        <Estado p={p} />
      </div>
      <Titulo id={`titulo-proyecto-${p.id}`} className="e-h3 mt-3">
        {p.cliente}
      </Titulo>
      <p className="e-chico mt-1 text-ed-muted">{p.sistema}</p>
      <dl className="e-chico mt-5 space-y-3">
        <div className={fila}>
          <dt className="font-medium">{PROYECTOS_UI.problema}</dt>
          <dd className="mt-0.5 text-ed-muted">{p.problema}</dd>
        </div>
        <div className={fila}>
          <dt className="font-medium">{PROYECTOS_UI.armamos}</dt>
          <dd className="mt-0.5 text-ed-muted">{p.incluye.join(' · ')}</dd>
        </div>
        <div className={fila}>
          <dt className="font-medium">{PROYECTOS_UI.ve}</dt>
          <dd className="mt-0.5 text-ed-muted">{p.ve}</dd>
        </div>
      </dl>
      <div className="mt-auto pt-5">
        {p.url && p.estado === 'produccion' ? (
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            aria-label={`${PROYECTOS_UI.ver} ${dominioDe(p.url)}${CTA.pestana}`}
            className="e-link e-cuerpo font-medium"
          >
            {PROYECTOS_UI.ver}
            <span className="text-ed-muted">{dominioDe(p.url)}</span>
            <FlechaDiagonal />
          </a>
        ) : demo ? (
          <a
            href={demo.href}
            target="_blank"
            rel="noopener"
            aria-label={`${PROYECTOS_UI.verDemo}${CTA.pestana}`}
            className="e-link e-cuerpo font-medium"
          >
            {PROYECTOS_UI.verDemo}
            <FlechaDiagonal />
          </a>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Grilla de proyectos completos. En /proyectos va sola (títulos h2); en las páginas de producto, con su
 * cabeza de sección y solo los de ese tipo.
 */
export function ProyectosGrilla({
  filtro,
  cabeza,
}: {
  filtro?: (p: Proyecto) => boolean;
  cabeza?: { numero: number };
}) {
  const S = SECCIONES.proyectos;
  const lista = filtro ? PROYECTOS.filter(filtro) : PROYECTOS;
  if (lista.length === 0) return null;
  return (
    <section
      id={S.id}
      className="tono-claro e-seccion scroll-mt-16"
      aria-labelledby={cabeza ? 'titulo-proyectos' : undefined}
    >
      <div className="e-wrap">
        {cabeza ? (
          <CabezaSeccion
            numero={cabeza.numero}
            rotulo={S.rotulo}
            titulo={S.titulo}
            idTitulo="titulo-proyectos"
          />
        ) : null}
        <div
          className={cn(
            'grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3',
            cabeza && 'mt-8 md:mt-12',
          )}
        >
          {lista.map((p, i) => (
            <Tarjeta key={p.id} p={p} i={i} nivel={cabeza ? 'h3' : 'h2'} />
          ))}
        </div>
      </div>
    </section>
  );
}
