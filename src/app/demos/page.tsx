import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoWebya } from '@/brand/logo/LogoWebya';
import { Chevron } from '@/components/marketing/editorial/Iconos';
import { DEMOS, HUB_DEMOS } from '@/content/demos/hub';
import { RUBROS_HOME } from '@/content/home';
import { metadataPagina } from '../_landing/metadata';

export const metadata: Metadata = metadataPagina({
  titulo: HUB_DEMOS.seo.titulo,
  descripcion: HUB_DEMOS.seo.descripcion,
  ruta: '/demos',
});

/**
 * Elegir demo, por sistema o por rubro. Corta a propósito: en el celular las opciones se ven casi sin
 * scrollear. Se abre aparte del sitio, como otro sistema.
 */
export default function Demos() {
  return (
    <div className="tono-claro min-h-svh bg-ed-bg text-ed-fg">
      <header className="a-nav sticky top-0 z-10">
        <div className="e-wrap flex h-12 items-center justify-between">
          <Link href="/" aria-label={HUB_DEMOS.volver} className="flex min-h-11 items-center">
            <LogoWebya decorativo className="h-5 w-auto" />
          </Link>
          <Link href="/" className="e-link e-link-nav e-chico text-ed-muted hover:text-ed-fg">
            {HUB_DEMOS.volver}
          </Link>
        </div>
      </header>
      <main className="e-wrap max-w-6xl pt-10 pb-16 md:pt-16">
        <div className="text-center">
          <h1 className="a-titulo">{HUB_DEMOS.titulo}</h1>
          <p className="a-sub mt-3 text-ed-muted">{HUB_DEMOS.bajada}</p>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 md:gap-4">
          {DEMOS.map((d) => (
            <li key={d.id}>
              <Link
                href={d.href}
                prefetch={false}
                className="a-tile group h-full px-6 py-10 active:opacity-70 md:py-14"
              >
                <span className="e-chico text-ed-muted">{d.rubro}</span>
                <span className="a-tile-titulo mt-2">{d.titulo}</span>
                <span className="e-cuerpo mt-2 text-ed-muted">{d.texto}</span>
                <span className="a-link mt-3">
                  {HUB_DEMOS.abrir}
                  <Chevron />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="a-ceja mt-14 text-center md:mt-20">{HUB_DEMOS.rubros}</h2>
        <ul className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2.5">
          {RUBROS_HOME.map((r) => (
            <li key={r.id}>
              <Link href={r.href} prefetch={false} className="a-chip">
                {r.nombre}
              </Link>
            </li>
          ))}
        </ul>
        <p className="e-chico mt-10 text-center text-ed-muted">{HUB_DEMOS.nota}</p>
      </main>
    </div>
  );
}
