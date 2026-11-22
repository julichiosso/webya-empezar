import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { LogoWebya } from '@/brand/logo/LogoWebya';
import { MENSAJE_CONTACTO } from '@/content/configurador';
import { enlaceContacto } from '@/components/marketing/editorial/contacto';
import { Chevron, WhatsApp } from '@/components/marketing/editorial/Iconos';
import { Telefono } from '@/components/marketing/editorial/Pantallas';
import { DEMOS, HUB_DEMOS, type DemoInfo } from '@/content/demos/hub';
import { CTA, RUTAS } from '@/content/home';
import { getProyecto } from '@/content/proyectos';
import { Ilustracion } from '@/features/demo/protectora/Ilustracion';
import { MisDemos } from '@/features/demo/studio/MisDemos';
import { metadataPagina } from '../_landing/metadata';

export const metadata: Metadata = metadataPagina({
  titulo: HUB_DEMOS.seo.titulo,
  descripcion: HUB_DEMOS.seo.descripcion,
  ruta: '/demos',
});

/** La pantalla real que muestra cada demo en su fila (captura de un cliente o, si no hay, un dibujo). */
const CAPTURA: Partial<Record<DemoInfo['id'], string>> = {
  pedidos: 'micios',
  turnos: 'canina',
  web: 'lorena',
  tienda: 'petrucci',
};

function Vista({ id }: { id: DemoInfo['id'] }) {
  const img = CAPTURA[id] ? getProyecto(CAPTURA[id]!)?.imagenes.mobile : undefined;
  return (
    <Telefono className="max-w-none" barra={!img?.completa} colorBarra={img?.barra}>
      {img ? (
        <Image src={img.src} alt="" fill sizes="10rem" className="object-cover object-top" />
      ) : (
        <div className="grid h-full place-items-center bg-ed-surface">
          <Ilustracion
            especie="perro"
            semilla="vista"
            className="w-3/5 text-ed-fg"
            ojos="var(--e-surface)"
          />
        </div>
      )}
    </Telefono>
  );
}

/**
 * Hub de demos: la puerta de entrada al producto. Arriba, el rubro en botones grandes (abren la demo con el
 * asistente); después lo que la persona ya empezó, todas las demos con su pantalla real, cómo funciona,
 * preguntas y el contacto. Oscuro, como las demos. Sin tarjetas genéricas: tipografía, líneas finas y aire.
 */
export default function Demos() {
  const contacto = enlaceContacto(MENSAJE_CONTACTO);
  return (
    <div className="tono-oscuro min-h-svh bg-ed-bg text-ed-fg">
      <header className="a-nav sticky top-0 z-10">
        <div className="e-wrap flex h-14 items-center justify-between">
          <Link href="/" aria-label={HUB_DEMOS.volver} className="flex min-h-12 items-center">
            <LogoWebya decorativo className="h-5 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex min-h-12 items-center text-[1rem] text-ed-muted hover:text-ed-fg"
          >
            {HUB_DEMOS.volver}
          </Link>
        </div>
      </header>

      <main className="e-wrap pt-12 pb-20 md:pt-20">
        <div className="text-center">
          <h1 className="a-hero mx-auto max-w-[14ch]">{HUB_DEMOS.titulo}</h1>
          <p className="a-sub mt-4 text-ed-muted">{HUB_DEMOS.bajada}</p>
        </div>

        <section aria-labelledby="pregunta-rubro" className="mx-auto mt-12 max-w-4xl md:mt-16">
          <h2 id="pregunta-rubro" className="a-ceja text-center">
            {HUB_DEMOS.pregunta}
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {HUB_DEMOS.rubrosGrandes.map((r) => {
              const d = DEMOS.find((x) => x.id === r.demo)!;
              return (
                <li key={r.id}>
                  <Link
                    href={RUTAS.conGuia(d.href)}
                    prefetch={false}
                    className="flex min-h-18 items-center justify-between gap-3 rounded-2xl bg-ed-surface px-5 text-[1.1875rem] font-semibold transition-colors hover:bg-ed-fg hover:text-ed-bg"
                  >
                    {r.nombre}
                    <Chevron />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <MisDemos />

        <section aria-labelledby="indice-demos" className="mx-auto mt-20 max-w-5xl md:mt-28">
          <h2 id="indice-demos" className="a-titulo text-center">
            {HUB_DEMOS.indice}
          </h2>
          <ul className="mt-10 border-t border-ed-line">
            {DEMOS.map((d, i) => (
              <li key={d.id} className="relative overflow-hidden border-b border-ed-line">
                <span
                  aria-hidden="true"
                  className="d-palabra-fondo"
                  style={{ '--i': i } as CSSProperties}
                >
                  {d.barra}
                </span>
                <Link
                  href={d.href}
                  prefetch={false}
                  className="group relative flex items-center gap-5 py-8 md:gap-10 md:py-10"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1rem] text-ed-muted">{d.rubro}</span>
                    <span className="mt-1 block text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-tight font-semibold tracking-[-0.035em]">
                      {d.titulo}
                    </span>
                    <span className="mt-2 block text-[1.0625rem] text-ed-muted">{d.texto}</span>
                    <span className="a-link mt-2">
                      {HUB_DEMOS.abrir}
                      <Chevron />
                    </span>
                  </span>
                  <span className="w-28 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 md:w-40">
                    <Vista id={d.id} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="como-funciona" className="mx-auto mt-20 max-w-5xl md:mt-28">
          <h2 id="como-funciona" className="a-titulo text-center">
            {HUB_DEMOS.como.titulo}
          </h2>
          <ol className="mt-10 grid gap-8 text-center md:grid-cols-3">
            {HUB_DEMOS.como.pasos.map((p) => (
              <li key={p.titulo}>
                <p className="a-tile-titulo">{p.titulo}</p>
                <p className="mt-2 text-[1.125rem] text-ed-muted">{p.texto}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="preguntas" className="mx-auto mt-20 max-w-3xl md:mt-28">
          <h2 id="preguntas" className="a-titulo text-center">
            {HUB_DEMOS.preguntas.titulo}
          </h2>
          <div className="mt-8 border-t border-ed-line">
            {HUB_DEMOS.preguntas.items.map((q) => (
              <details key={q.p} className="group border-b border-ed-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.1875rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {q.p}
                  <span
                    aria-hidden="true"
                    className="text-[1.5rem] leading-none transition-transform group-open:rotate-45"
                  >
                    {HUB_DEMOS.abrirPregunta}
                  </span>
                </summary>
                <p className="pb-5 text-[1.0625rem] text-ed-muted">{q.r}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <a
            href={contacto.href}
            target="_blank"
            rel="noopener"
            aria-label={`${HUB_DEMOS.cierre}${CTA.pestana}`}
            className="e-btn e-btn-primario min-h-14"
          >
            {contacto.canal === 'whatsapp' ? <WhatsApp /> : null}
            {HUB_DEMOS.cierre}
          </a>
          <Link href={RUTAS.armar} className="e-btn e-btn-secundario min-h-14">
            {CTA.armar}
          </Link>
        </div>
        <p className="mt-8 text-center text-[1rem] text-ed-muted">{HUB_DEMOS.nota}</p>
      </main>
    </div>
  );
}
